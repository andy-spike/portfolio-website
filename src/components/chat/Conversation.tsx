import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { ArrowDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  children: ReactNode;
  /** Changes whenever a turn is added or edited, so the view knows to follow. */
  revision: number;
  scrollLabel: string;
}

// "At the bottom" needs slack: sub-pixel layout and the composer's own growth
// both leave a remainder that never reaches exactly zero.
const SLACK = 48;

/**
 * The scroll region the transcript lives in.
 *
 * It sticks to the bottom while the reader is already there, and stops
 * following the moment they scroll up to re-read something — the behaviour
 * every usable chat has and the one people notice only when it is missing.
 * When it has stopped following, a block offers the way back down.
 */
export function Conversation({ children, revision, scrollLabel }: Props) {
  const viewport = useRef<HTMLDivElement>(null);
  const [following, setFollowing] = useState(true);
  const [scrollable, setScrollable] = useState(false);

  const measure = useCallback(() => {
    const el = viewport.current;
    if (!el) return;
    const overflow = el.scrollHeight - el.clientHeight;
    setScrollable(overflow > SLACK);
    setFollowing(overflow - el.scrollTop < SLACK);
  }, []);

  useEffect(() => {
    const el = viewport.current;
    if (!el) return;

    const onScroll = () => {
      const overflow = el.scrollHeight - el.clientHeight;
      setFollowing(overflow - el.scrollTop < SLACK);
    };
    el.addEventListener('scroll', onScroll, { passive: true });

    // The transcript grows as turns land and the composer grows as the reader
    // types, so whether this region scrolls at all is not a one-time answer.
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    if (el.firstElementChild) observer.observe(el.firstElementChild);

    return () => {
      el.removeEventListener('scroll', onScroll);
      observer.disconnect();
    };
  }, [measure]);

  useEffect(() => {
    const el = viewport.current;
    if (!el || !following) return;
    el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
  }, [revision, following]);

  const toBottom = () => {
    const el = viewport.current;
    if (!el) return;
    setFollowing(true);
    el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
  };

  return (
    <div className="relative min-h-0 flex-1">
      <div
        ref={viewport}
        // The keyline prints inside: the region is clipped by the app frame,
        // so an outline held outside it would be cut away and the stop would
        // be silent. It is only a stop at all while there is something to
        // scroll — an empty chat should not cost a keyboard user a Tab.
        className="h-full overflow-y-auto overscroll-contain focus-visible:outline-offset-[-3px]"
        // The transcript is a log: additions are announced, not interrupted.
        role="log"
        aria-live="polite"
        aria-relevant="additions"
        tabIndex={scrollable ? 0 : -1}
      >
        {children}
      </div>

      {!following && (
        <div className="pointer-events-none absolute inset-x-0 bottom-4 flex justify-center">
          <Button
            type="button"
            size="icon-sm"
            variant="outline"
            onClick={toBottom}
            aria-label={scrollLabel}
            className="pointer-events-auto"
          >
            <ArrowDown className="size-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
