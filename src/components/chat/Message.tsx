import { cn } from '@/lib/utils';
import type { ChatStrings, Source, Turn } from './types';

interface Props {
  turn: Turn;
  strings: ChatStrings;
}

/**
 * One turn, printed as a block.
 *
 * The reader's own words take the surface's accent, the way the question block
 * did on the old bench; the Agent answers on paper. Both are the kit's `.brick`
 * — border and hard offset shadow, no bubble, no radius — so a transcript
 * reads as a stack of printed slips rather than a messaging app.
 */
export function Message({ turn, strings }: Props) {
  const isUser = turn.role === 'user';

  return (
    <article
      className={cn('flex w-full flex-col gap-2', isUser ? 'items-end' : 'items-start')}
      data-role={turn.role}
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
        {turn.status === 'pending' ? (
          <Thinking label={strings.thinking} />
        ) : (
          <p className="text-[1.0625rem] leading-relaxed whitespace-pre-wrap">
            {turn.text}
          </p>
        )}
      </div>

      {!isUser && turn.status !== 'pending' && turn.status !== 'error' && (
        <Sources sources={turn.sources} strings={strings} />
      )}
    </article>
  );
}

/**
 * What the answer stood on. An answer without a Source is a defect, so the line
 * prints either way: the passages when the Corpus supported the answer, and a
 * plain statement that none did when it did not. The second is a real state,
 * not a placeholder — the Agent refuses rather than reaching, and the reader is
 * told which of the two they are reading.
 */
function Sources({
  sources,
  strings,
}: {
  sources?: Source[];
  strings: ChatStrings;
}) {
  if (!sources?.length) {
    return <span className="plate ml-1">{strings.noSources}</span>;
  }

  return (
    <p className="legend ml-1 max-w-[min(46rem,88%)]">
      <span className="legend-strong">{strings.sources}</span>
      {sources.map((s) => (
        <span key={`${s.file}/${s.title}`} className="ml-2.5 whitespace-nowrap">
          {s.file} — {s.title}
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
function Thinking({ label }: { label: string }) {
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
