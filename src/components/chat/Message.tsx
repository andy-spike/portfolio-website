import { Streamdown, type Components } from 'streamdown';
import { cn } from '@/lib/utils';
import { searchInFlight, sourcesFor, textOf } from './transcript';
import type { AskMessage, ChatStrings, Source } from './types';

/**
 * The Agent's prose runs through `.reading`, the same measure the case
 * studies print in — so an answer looks like a passage of the site, not a
 * chat bubble. Streamdown ships its own Tailwind classes on these tags,
 * which would fight the kit's cascade, so the elements that carry
 * typography are handed back bare and `.reading` styles them instead. Code
 * and tables stay on Streamdown's own components: the shadcn bridge in
 * global.css already points their tokens at the kit's ink and paper.
 */
const proseComponents: Components = {
  p: ({ node: _node, ...props }) => <p {...props} />,
  a: ({ node: _node, ...props }) => <a target="_blank" rel="noreferrer" {...props} />,
  strong: ({ node: _node, ...props }) => <strong {...props} />,
  em: ({ node: _node, ...props }) => <em {...props} />,
  h1: ({ node: _node, ...props }) => <h2 {...props} />,
  h2: ({ node: _node, ...props }) => <h2 {...props} />,
  h3: ({ node: _node, ...props }) => <h3 {...props} />,
  ul: ({ node: _node, ...props }) => <ul {...props} />,
  ol: ({ node: _node, ...props }) => <ol {...props} />,
  li: ({ node: _node, ...props }) => <li {...props} />,
  blockquote: ({ node: _node, ...props }) => <blockquote {...props} />,
  hr: ({ node: _node, ...props }) => <hr {...props} />,
};

interface Props {
  messages: AskMessage[];
  index: number;
  strings: ChatStrings;
  /** This reply is the one the Agent is still working on. */
  busy: boolean;
  /** The request behind this reply did not complete. */
  failed: boolean;
}

/**
 * One turn, printed as a block.
 *
 * The reader's own words take the surface's accent, the way the question block
 * did on the old bench; the Agent answers on paper. Both are the kit's `.brick`
 * — border and hard offset shadow, no bubble, no radius — so a transcript
 * reads as a stack of printed slips rather than a messaging app.
 */
export function Message({ messages, index, strings, busy, failed }: Props) {
  const message = messages[index]!;
  const isUser = message.role === 'user';
  const text = textOf(message);
  const search = busy ? searchInFlight(message) : undefined;
  const settled = !busy && !failed && !isUser;

  return (
    <article
      className={cn('flex w-full flex-col gap-2', isUser ? 'items-end' : 'items-start')}
      data-role={message.role}
    >
      <span className="legend legend-strong px-1">
        {isUser ? strings.you : strings.agent}
      </span>

      <div
        className={cn(
          'brick max-w-[min(46rem,88%)] px-[clamp(1rem,2.5vw,1.5rem)] py-[clamp(0.875rem,2vw,1.25rem)]',
          isUser && 'bg-line-1'
        )}
      >
        {/*
          The Agent reaches for the Corpus before it writes, so there are two
          kinds of waiting and the reader is told which one they are in. The
          search names its subject once the Agent has written the query — that
          is the surface's honest system state, not a spinner.
        */}
        {text ? (
          <Streamdown className="reading max-w-none" components={proseComponents}>
            {text}
          </Streamdown>
        ) : search ? (
          <Working
            label={
              // The dash is the Sources line's own separator, so a search and
              // what it found are punctuated the same way.
              search.query ? `${strings.searching} — ${search.query}` : strings.searching
            }
          />
        ) : busy ? (
          <Working label={strings.thinking} />
        ) : (
          <p className="text-[1.0625rem] leading-relaxed">{strings.failed}</p>
        )}
      </div>

      {settled && <Sources {...sourcesFor(messages, index)} strings={strings} />}
    </article>
  );
}

/**
 * What the answer stood on. An answer without a Source is a defect, so the line
 * prints either way — but there are three things it can say, not two, and the
 * reader is told which one they are reading:
 *
 * - the passages the Agent searched for and used;
 * - the passages an earlier Exchange stood on, when this turn asked for no new
 *   fact and the Agent did not search — a rephrase is not a fresh claim;
 * - a plain statement that nothing in the Corpus supported the answer.
 */
function Sources({
  list,
  inherited,
  strings,
}: {
  list: Source[];
  inherited: boolean;
  strings: ChatStrings;
}) {
  if (!list.length) {
    return <span className="plate ml-1 mt-4">{strings.noSources}</span>;
  }

  return (
    <div className="ml-1 mt-4 flex max-w-[min(46rem,88%)] flex-wrap items-center gap-x-2 gap-y-1.5">
      <span className="legend legend-strong">
        {inherited ? strings.sourcesInherited : strings.sources}
      </span>
      {list.map((source) => (
        <span key={`${source.file}/${source.title}`} className="plate gap-1.5">
          <span>{source.file}</span>
          <span className="ink-muted font-normal">{source.title}</span>
        </span>
      ))}
    </div>
  );
}

/**
 * The waiting mark. Three ink squares stepping in turn — the only looping
 * animation on this surface, and it exists only while a reply is outstanding.
 * Under `prefers-reduced-motion` the base rule flattens it to three static
 * squares, which still reads as "working".
 */
function Working({ label }: { label: string }) {
  return (
    <p className="flex items-center gap-2" role="status">
      <span className="legend">{label}</span>
      <span className="flex gap-1" aria-hidden="true">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="thinking-tick size-1.5 bg-ink"
            style={{ animationDelay: `${i * 160}ms` }}
          />
        ))}
      </span>
    </p>
  );
}
