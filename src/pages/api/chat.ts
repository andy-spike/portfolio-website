import type { APIRoute } from 'astro';
import { createOpenRouter } from '@openrouter/ai-sdk-provider';
import { createClient } from '@supabase/supabase-js';
import {
  createUIMessageStreamResponse,
  embed,
  jsonSchema,
  stepCountIs,
  streamText,
  toUIMessageStream,
  tool,
  type ModelMessage,
} from 'ai';
import {
  OPENROUTER_API_KEY,
  OPENROUTER_MODEL,
  SUPABASE_SECRET_KEY,
  SUPABASE_URL,
} from 'astro:env/server';
import { CORPUS_LOCALE, EMBEDDING_MODEL } from '../../lib/corpus';
import { scrub } from '../../lib/scrub';
import { locales, type Locale } from '../../i18n/ui';

/** The one route on the site that is not prerendered. */
export const prerender = false;

/** Passages one search returns. The Agent may search more than once. */
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

/**
 * The ceiling on one question. A step is a model call: each search costs one,
 * and the answer costs the last. Four leaves room to search twice, enough to
 * compare two Portfolio Projects, and stops a loop from spending the key.
 */
const MAX_STEPS = 4;

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

/**
 * The rules the Agent answers under.
 *
 * The Corpus is still the only ground, but the Agent now reaches it itself. It
 * has read the whole transcript, so it, and not a heuristic in this file,
 * decides what "it" refers to and what to search for. The refusal has to stay
 * as easy to produce as the answer: an answer without a Source is a defect.
 */
function systemPrompt(locale: Locale): string {
  return `You are the Agent on Andrés Sanabria's portfolio site. You answer questions about Andrés and his work.

The Corpus is the only source of facts you have. Reach it with the searchCorpus tool.

Search before you state anything about Andrés: who he is, what he built, how he built it, what he decided against, what he is looking for. You have read this conversation, so write a query that names its subject in full. When the reader asks "and how does it work?", search for the thing they mean, not for their words.
Search more than once when a question covers more than one subject. Compare two projects by searching for each of them.
Do not search when the reader is not asking for a new fact, when they ask you to say something again more simply, or more briefly, or when they thank you. Answer from what you have already said.
Answer only from passages a search returned in this reply, or from what you have already said in this conversation. Never guess, never fill a gap from general knowledge, and never state anything about seniority, years of experience, employers, clients, or numbers that is not written in a passage.
When a search returns nothing, say plainly that the Corpus does not cover it and suggest what the reader could ask instead. Do not soften that into a partial answer.
Name the passages you used in your prose where it reads naturally; the interface lists them separately, so do not append a citation list of your own.
Write in ${LANGUAGES[locale]} the way the Corpus is written. Short sentences. One idea each. Plain words. Active voice. A few sentences is usually the whole answer.

Never write like a large language model. Avoid these tells:
- Filler and padding: "In order to", "It is important to note that", "delve", "showcase", "pivotal", "testament to", "underscore", "vibrant", "leverage", "utilize", "furthermore". State what happened, not what it "highlights" or "ensures".
- The "not just X, but Y" frame, and the rule of three. State the point directly, in the natural number of parts.
- Synonym cycling. Pick one word for a thing and repeat it.
- Em dashes and mid-sentence colons. Use a period or a comma.
- Chatbot filler: "Great question", "I hope this helps", "To sum up". Answer directly.
- Hedging: "might possibly", "could be argued". Be definite when the Corpus is definite.
- Metaphor nouns: "harness", "surface", "flywheel", "north star". Use the concrete word.
If a sentence could appear unchanged in any other person's portfolio, it says nothing about Andrés. Cut it, or say what the passages state. Never add a fact the passages do not state.
Write prose and nothing else. The surface prints your reply as plain text, so asterisks, bullet lists and headings arrive on the page as the characters you typed. Separate paragraphs with a blank line; that is the only formatting you have.`;
}

/**
 * The retrieval store, as this route reaches it. A factory rather than a bare
 * `createClient` call so the binding can be typed by inference: annotating it
 * with `ReturnType<typeof createClient>` collapses the client's generics and
 * leaves `rpc` refusing its own arguments.
 */
const connect = () => createClient(SUPABASE_URL, SUPABASE_SECRET_KEY);

/**
 * A request that never became a reply.
 *
 * The `code` is what the surface reads: the SDK hands the whole response body
 * to the client as the error's message, and a surface that told a rate-limited
 * reader to try again by matching English prose would stop doing so the day
 * that prose was reworded.
 */
function bad(code: 'rate_limited' | 'bad_request' | 'unavailable', message: string, status: number): Response {
  return new Response(JSON.stringify({ code, message }), {
    status,
    headers: { 'content-type': 'application/json' },
  });
}

export const POST: APIRoute = async ({ request, clientAddress }) => {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return bad('bad_request', 'Malformed request', 400);
  }

  const { locale, messages } = (body ?? {}) as {
    locale?: unknown;
    messages?: unknown;
  };

  if (!locales.includes(locale as Locale)) return bad('bad_request', 'Unknown locale', 400);
  if (
    !Array.isArray(messages) ||
    messages.length === 0 ||
    messages.length > MAX_SENT_TURNS
  ) {
    return bad('bad_request', 'Malformed transcript', 400);
  }

  const history: ModelMessage[] = [];
  for (const turn of messages.slice(-MAX_TURNS)) {
    const role = (turn as { role?: unknown }).role;
    const text = (turn as { text?: unknown }).text;
    if ((role !== 'user' && role !== 'assistant') || typeof text !== 'string') {
      return bad('bad_request', 'Malformed transcript', 400);
    }
    history.push({ role, content: text.slice(0, MAX_TURN_CHARS) });
  }

  const question = history.at(-1);
  if (question?.role !== 'user' || typeof question.content !== 'string' || !question.content.trim()) {
    return bad('bad_request', 'Malformed transcript', 400);
  }

  // Everything before the first token: missing configuration, or a store that
  // is down. They are one failure to the reader, the Agent cannot answer.
  // and none of them should reach it as a stack trace. The rate limit runs
  // here so a refused request costs no model call at all.
  let openrouter: ReturnType<typeof createOpenRouter>;
  let supabase: ReturnType<typeof connect>;
  try {
    supabase = connect();
    openrouter = createOpenRouter({ apiKey: OPENROUTER_API_KEY });

    // The first hop's address, or the socket's when there is no proxy in front.
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || clientAddress;
    const allowed = await supabase.rpc('bump_rate_limit', {
      client_ip: ip,
      max_hits: RATE_LIMIT,
      window_seconds: RATE_WINDOW_SECONDS,
    });
    if (allowed.error) throw allowed.error;
    if (allowed.data === false) return bad('rate_limited', 'Too many questions', 429);
  } catch (cause) {
    const detail = cause instanceof Error ? cause.message : String(cause);
    console.error('Ask: the Agent could not be reached -', scrub(detail));
    return bad('unavailable', 'The Agent is unavailable', 503);
  }

  // The Agent's own reach into the Corpus. What it searched for and what came
  // back travel to the reader as parts of the reply, so the surface can print
  // the search while it happens and the Sources when it lands. Nothing here
  // has to be tracked by hand: a turn with no search part is a turn that
  // needed no Source, and the transcript says so.
  const searchCorpus = tool({
    description:
      "Search the Corpus, the facts about Andrés Sanabria, and return the passages that match. Write the query as a standalone question or phrase that names its subject, not as the reader's own words. Call it again with a different query to cover a second subject.",
    inputSchema: jsonSchema<{ query: string }>({
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'What to look for, naming its subject in full.',
        },
      },
      required: ['query'],
      additionalProperties: false,
    }),
    execute: async ({ query }) => {
      // A store that fails mid-answer is not "the Corpus does not cover it".
      // Let it end the stream rather than let the Agent report an outage as a
      // gap in the Corpus, which the reader would read as a fact about Andrés.
      try {
        const { embedding } = await embed({
          model: openrouter.textEmbeddingModel(EMBEDDING_MODEL),
          value: query,
        });

        const matched = await supabase.rpc('match_chunks', {
          query_embedding: embedding,
          match_limit: SOURCE_LIMIT,
          filter_locale: CORPUS_LOCALE,
        });
        if (matched.error) throw matched.error;

        const passages = ((matched.data ?? []) as MatchedChunk[]).filter(
          (row) => row.similarity >= MIN_SIMILARITY
        );

        // The passages travel to the reader as well as to the Agent: they are
        // what the transcript lists as Sources. The similarity does not, it
        // is how a passage was chosen, not what it says.
        return passages.map(({ file, title, content }) => ({ file, title, content }));
      } catch (cause) {
        const detail = cause instanceof Error ? cause.message : String(cause);
        console.error('Ask: the Corpus could not be searched -', scrub(detail));
        throw cause;
      }
    },
  });

  const result = streamText({
    model: openrouter.chat(OPENROUTER_MODEL),
    system: systemPrompt(locale as Locale),
    messages: history,
    tools: { searchCorpus },
    stopWhen: stepCountIs(MAX_STEPS),
    providerOptions: {
      // Reasoning stays on so the answer is right and cited. The tokens are
      // never shown to the reader, so they are never sent back either.
      openrouter: { reasoning: { enabled: true, effort: 'low', exclude: true } },
    },
  });

  // The SDK's own wire format, read on the other end by `useChat`. It carries
  // the tool call as well as the text, which is what lets the transcript show
  // the Agent reaching for the Corpus rather than a spinner that says nothing.
  //
  // The reasoning tokens are never sent: the reader is owed the answer and the
  // Sources, not the working.
  return createUIMessageStreamResponse({
    stream: toUIMessageStream({
      stream: result.stream,
      sendReasoning: false,
      onError: (cause) => {
        const detail = cause instanceof Error ? cause.message : String(cause);
        console.error('Ask: the reply failed mid-stream -', scrub(detail));
        return 'The Agent is unavailable';
      },
    }),
    headers: { 'cache-control': 'no-store' },
  });
};
