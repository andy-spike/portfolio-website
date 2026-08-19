/**
 * The Corpus: the facts the Agent answers from, and how they are cut into the
 * passages it cites. Shared by the seed script and the Agent's own route, so
 * the embedding model and the Corpus language cannot drift apart between them —
 * two different embedding models would leave retrieval returning noise with
 * nothing to show that anything was wrong.
 */

/** Baked into the schema as `vector(1536)`. Changing it means a migration and a reseed. */
export const EMBEDDING_MODEL = 'openai/text-embedding-3-small';

/** The Corpus is authored in English. The Agent answers in the page's language. */
export const CORPUS_LOCALE = 'en';

/** One passage of the Corpus: what the Agent retrieves and cites as a Source. */
export interface Chunk {
  title: string;
  content: string;
}

/**
 * A `#` or `##` line, outside a fenced code block. `#` counts as well as `##`
 * so that a file's opening prose is a chunk rather than silently dropped: a
 * fact written under the title is still a fact.
 */
const HEADING = /^#{1,2} +(.+?)\s*$/;
const FENCE = /^\s*(```|~~~)/;

/** An HTML comment is a prompt to the writer, never a fact. */
const isEmpty = (body: string) =>
  body.replace(/<!--[\s\S]*?-->/g, '').trim().length === 0;

/**
 * Split one Corpus file into chunks, one per heading.
 *
 * A section whose body is still a writer's prompt is not a chunk: the Corpus
 * ships as skeletons, and an empty passage embedded is a Source that says
 * nothing. The heading line stays in the content because it is context the
 * embedding needs — "Rejected Alternatives" alone does not say whose.
 */
export function chunk(markdown: string): Chunk[] {
  const chunks: Chunk[] = [];
  let title: string | null = null;
  let body: string[] = [];
  let fenced = false;

  const close = () => {
    // The heading is context, not content: a section is empty when only it is left.
    if (title !== null && !isEmpty(body.slice(1).join('\n'))) {
      chunks.push({ title, content: body.join('\n').trimEnd() });
    }
  };

  for (const line of markdown.split('\n')) {
    if (FENCE.test(line)) fenced = !fenced;

    const heading = fenced ? null : line.match(HEADING);
    if (heading) {
      close();
      title = heading[1];
      body = [line];
      continue;
    }
    if (title !== null) body.push(line);
  }
  close();

  return chunks;
}
