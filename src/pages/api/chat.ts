import type { APIRoute } from 'astro';
import { createOpenRouter } from '@openrouter/ai-sdk-provider';
import { createClient } from '@supabase/supabase-js';
import { embed, streamText, type ModelMessage } from 'ai';
import { CORPUS_LOCALE, EMBEDDING_MODEL } from '../../lib/corpus';
import { frame } from '../../lib/ask-stream';
import { locales, type Locale } from '../../i18n/ui';

/** The one route on the site that is not prerendered. */
export const prerender = false;

const MODEL = process.env.OPENROUTER_MODEL ?? 'deepseek/deepseek-v4-flash-0731';

const SOURCE_LIMIT = 4;

/**
 * The floor a match has to clear to be a Source. Top-k always returns k rows,
 * however little they have to do with the question, and a weak passage handed
 * over as ground truth is how an Agent invents an answer with a citation on it.
 * Cosine similarity on this model runs around 0.3–0.6 for a passage that
 * genuinely answers and well under 0.2 for one that does not. This is the knob
 * to turn if the Agent starts either refusing good questions or reaching.
 */
const MIN_SIMILARITY = 0.25;

const RATE_LIMIT = 20;
const RATE_WINDOW_SECONDS = 60;

/**
 * The cap on one turn's text. It has to hold one of the Agent's own answers,
 * not just a question, because the whole transcript comes back on every request
 * and an answer cut mid-sentence is worse context than no answer.
 */
const MAX_TURN_CHARS = 4_000;
/** Turns the model is given. A longer session keeps working, on its recent tail. */
const MAX_TURNS = 40;
/** Past this the transcript is not a session, it is a payload. */
const MAX_SENT_TURNS = 200;

const LANGUAGES: Record<Locale, string> = { en: 'English', es: 'Spanish' };

/** One row of `match_chunks`: a Corpus passage and how well it matched. */
interface MatchedChunk {
  file: string;
  title: string;
  content: string;
  similarity: number;
}

function env(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is not set`);
  return value;
}

/**
 * The rules the Agent answers under. The Corpus is the only ground: an answer
 * without a Source is a defect, so the refusal has to be as easy to produce as
 * the answer.
 */
function systemPrompt(locale: Locale, sources: MatchedChunk[]): string {
  const block = sources
    .map((s) => `[${s.file} — ${s.title}]\n${s.content}`)
    .join('\n\n');

  return `You are the Agent on Andrés Sanabria's portfolio site. You answer questions about Andrés and his work.

Answer only from the Sources below. They are passages from the Corpus, the only facts you have.
If the Sources do not support an answer, say plainly that the Corpus does not cover it and suggest what the reader could ask instead. Never guess, never fill a gap from general knowledge, and never state anything about seniority, years of experience, employers, clients, or numbers that is not written in a Source.
Name the Sources you used in your prose where it reads naturally; the interface lists them separately, so do not append a citation list of your own.
Write in ${LANGUAGES[locale]}, in plain sentences, short and direct. A few sentences is usually the whole answer.

Sources:
${block || '(none — the Corpus returned nothing for this question)'}`;
}

function bad(message: string, status: number): Response {
  return new Response(JSON.stringify({ message }), {
    status,
    headers: { 'content-type': 'application/json' },
  });
}

export const POST: APIRoute = async ({ request, clientAddress }) => {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return bad('Malformed request', 400);
  }

  const { locale, messages } = (body ?? {}) as {
    locale?: unknown;
    messages?: unknown;
  };

  if (!locales.includes(locale as Locale)) return bad('Unknown locale', 400);
  if (
    !Array.isArray(messages) ||
    messages.length === 0 ||
    messages.length > MAX_SENT_TURNS
  ) {
    return bad('Malformed transcript', 400);
  }

  const history: ModelMessage[] = [];
  for (const turn of messages.slice(-MAX_TURNS)) {
    const role = (turn as { role?: unknown }).role;
    const text = (turn as { text?: unknown }).text;
    if ((role !== 'user' && role !== 'assistant') || typeof text !== 'string') {
      return bad('Malformed transcript', 400);
    }
    history.push({ role, content: text.slice(0, MAX_TURN_CHARS) });
  }

  const question = history.at(-1);
  if (question?.role !== 'user' || typeof question.content !== 'string' || !question.content.trim()) {
    return bad('Malformed transcript', 400);
  }

  // Everything up to the first token: missing configuration, a store that is
  // down, an embedding call that fails. They are one failure to the reader —
  // the Agent cannot answer — and none of them should reach it as a stack trace.
  let openrouter: ReturnType<typeof createOpenRouter>;
  let sources: MatchedChunk[];
  try {
    const supabase = createClient(env('SUPABASE_URL'), env('SUPABASE_SERVICE_ROLE_KEY'));
    openrouter = createOpenRouter({ apiKey: env('OPENROUTER_API_KEY') });

    // The first hop's address, or the socket's when there is no proxy in front.
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || clientAddress;
    const allowed = await supabase.rpc('bump_rate_limit', {
      client_ip: ip,
      max_hits: RATE_LIMIT,
      window_seconds: RATE_WINDOW_SECONDS,
    });
    if (allowed.error) throw allowed.error;
    if (allowed.data === false) return bad('Too many questions', 429);

    // Only the latest question is embedded: retrieval is about what is being
    // asked now, and the earlier turns travel to the model as context anyway.
    const { embedding } = await embed({
      model: openrouter.textEmbeddingModel(EMBEDDING_MODEL),
      value: question.content,
    });

    const matched = await supabase.rpc('match_chunks', {
      query_embedding: embedding,
      match_limit: SOURCE_LIMIT,
      filter_locale: CORPUS_LOCALE,
    });
    if (matched.error) throw matched.error;

    sources = ((matched.data ?? []) as MatchedChunk[]).filter(
      (row) => row.similarity >= MIN_SIMILARITY
    );
  } catch (cause) {
    console.error('Ask: the Agent could not be reached', cause);
    return bad('The Agent is unavailable', 503);
  }

  const result = streamText({
    model: openrouter.chat(MODEL),
    system: systemPrompt(locale as Locale, sources),
    messages: history,
    providerOptions: {
      // Reasoning stays on so the answer is right and cited. The tokens are
      // never shown to the reader, so they are never sent back either.
      openrouter: { reasoning: { enabled: true, effort: 'low', exclude: true } },
    },
  });

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      controller.enqueue(
        frame(
          'sources',
          sources.map(({ file, title }) => ({ file, title }))
        )
      );
      try {
        for await (const delta of result.textStream) {
          controller.enqueue(frame('delta', delta));
        }
        controller.enqueue(frame('done', null));
      } catch {
        controller.enqueue(frame('error', null));
      }
      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      'content-type': 'text/event-stream',
      'cache-control': 'no-store',
    },
  });
};
