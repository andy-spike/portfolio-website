import { cn } from '@/lib/utils';
import { searchInFlight, sourcesFor, textOf } from './transcript';
import type { AskMessage, ChatStrings, Source } from './types';

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
          <p className="text-[1.0625rem] leading-relaxed whitespace-pre-wrap">{text}</p>
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
    return <span className="plate ml-1">{strings.noSources}</span>;
  }

  return (
    <p className="legend ml-1 max-w-[min(46rem,88%)]">
      <span className="legend-strong">
        {inherited ? strings.sourcesInherited : strings.sources}
      </span>
      {list.map((source) => (
        <span key={`${source.file}/${source.title}`} className="ml-2.5 whitespace-nowrap">
          {source.file} — {source.title}
        </span>
      ))}
    </p>
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
