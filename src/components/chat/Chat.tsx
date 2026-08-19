import { useCallback, useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { ArrowLeft, SquarePen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Composer } from './Composer';
import { Conversation } from './Conversation';
import { Message } from './Message';
import { frames } from '@/lib/ask-stream';
import type { ChatStrings, Source, Turn } from './types';

interface Props {
  strings: ChatStrings;
  /** The page's language. The Agent answers in it; the Corpus stays English. */
  locale: string;
  homeHref: string;
  altLocaleHref: string;
  altLocaleLabel: string;
  toBottomLabel: string;
}

/**
 * Ask, as its own application.
 *
 * The site's sheet does not come with it: no Fascia, no Colophon, no page
 * scroll. The frame is the viewport — a bar, a transcript that scrolls inside
 * itself, and a composer pinned under it — because that is the shape a reader
 * already knows how to use, and the surface's whole job is to be used.
 *
 * The session's transcript is the only place it lives: the server is stateless,
 * so every request carries the whole thing back and the Agent's memory ends
 * when the reader closes the tab. New chat is therefore a real reset, and there
 * is nothing to clean up behind it.
 */
export function Chat({
  strings,
  locale,
  homeHref,
  altLocaleHref,
  altLocaleLabel,
  toBottomLabel,
}: Props) {
  const [turns, setTurns] = useState<Turn[]>([]);
  const [busy, setBusy] = useState(false);
  const nextId = useRef(0);
  const inflight = useRef<AbortController | undefined>(undefined);

  useEffect(() => () => inflight.current?.abort(), []);

  const send = useCallback(
    async (question: string) => {
      const answerId = `a${nextId.current++}`;

      // The transcript the server is given: everything that landed, plus the
      // question. A turn that failed is left out — it is not a thing the Agent
      // said, and replaying it would teach it to say more of the same.
      const messages = [
        ...turns
          .filter((turn) => turn.status !== 'error' && turn.text)
          .map(({ role, text }) => ({ role, text })),
        { role: 'user' as const, text: question },
      ];

      setTurns((prev) => [
        ...prev,
        { id: `q${nextId.current++}`, role: 'user', text: question },
        { id: answerId, role: 'assistant', text: '', status: 'pending' },
      ]);
      setBusy(true);

      // Writing by id rather than position: the reader may have reset the
      // transcript while this was in the air, and then there is nothing to
      // write to and this is correctly a no-op.
      const write = (patch: Partial<Turn>) =>
        setTurns((prev) =>
          prev.map((turn) => (turn.id === answerId ? { ...turn, ...patch } : turn))
        );

      const controller = new AbortController();
      inflight.current?.abort();
      inflight.current = controller;

      try {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ locale, messages }),
          signal: controller.signal,
        });

        if (!response.ok || !response.body) {
          write({
            status: 'error',
            text: response.status === 429 ? strings.rateLimited : strings.failed,
          });
          return;
        }

        let text = '';
        for await (const { event, data } of frames(response.body)) {
          if (event === 'sources') write({ sources: data as Source[] });
          if (event === 'delta') {
            text += data as string;
            write({ text, status: undefined });
          }
          // The Agent gave up mid-answer. Nothing after this frame is an
          // answer, and half an answer is not one either.
          if (event === 'error') {
            write({ status: 'error', text: strings.failed });
            return;
          }
        }

        // A stream that ended without a word is a failure that never announced
        // itself. Say so rather than leaving an empty block on the surface.
        if (!text) write({ status: 'error', text: strings.failed });
      } catch {
        if (!controller.signal.aborted) {
          write({ status: 'error', text: strings.failed });
        }
      } finally {
        if (!controller.signal.aborted) setBusy(false);
      }
    },
    [locale, turns, strings.failed, strings.rateLimited]
  );

  const reset = () => {
    inflight.current?.abort();
    setTurns([]);
    setBusy(false);
  };

  const empty = turns.length === 0;

  return (
    <div className="flex h-[100dvh] flex-col bg-ground">
      <header className="flex shrink-0 items-center gap-3 border-b-[3px] border-ink bg-paper px-[clamp(1rem,3vw,1.75rem)] py-2.5">
        {/*
          On a narrow bar the words are squeezed against the blocks at the
          other end, so below `sm` the mark carries the way back on its own.
          The label stays in the accessibility tree either way.
        */}
        <a
          href={homeHref}
          aria-label={strings.back}
          className="legend legend-strong -mx-1.5 -my-1 inline-flex items-center gap-2 px-1.5 py-1 no-underline transition-colors duration-100 hover:bg-ink hover:text-paper"
        >
          <ArrowLeft className="size-3.5 shrink-0" aria-hidden="true" />
          <span className="hidden whitespace-nowrap sm:inline">{strings.back}</span>
        </a>

        {/*
          The bar's right end: what language the chat is in, and the way to
          start over. Both are cut to `--bar-h` and keyed by the same 2px rule,
          so they read as a pair rather than two marks at two sizes. The
          surface does not name itself here — the reader arrived by asking for
          it, the tab already says so, and a label is not worth bar space on a
          surface whose whole job is the conversation under it.
        */}
        <div className="ml-auto flex items-center gap-2">
          <a
            href={altLocaleHref}
            className="plate h-[var(--bar-h)] px-4 no-underline transition-colors duration-100 hover:bg-ink hover:text-paper focus-visible:outline-offset-0"
          >
            {altLocaleLabel}
          </a>

          <Button
            type="button"
            variant="chip"
            onClick={reset}
            disabled={empty}
            aria-label={strings.newChat}
            title={strings.newChat}
            className="w-[var(--bar-h)] min-w-0 px-0"
          >
            <SquarePen className="size-4" />
          </Button>
        </div>
      </header>

      <Conversation revision={turns.length + (busy ? 0 : 1)} scrollLabel={toBottomLabel}>
        <div
          className={cn(
            'mx-auto w-full max-w-4xl px-[clamp(1rem,3vw,1.75rem)] py-[clamp(1.5rem,4vw,2.5rem)]',
            empty && 'flex min-h-full flex-col justify-center'
          )}
        >
          {empty ? (
            <Empty strings={strings} onPick={send} />
          ) : (
            <div className="flex flex-col gap-[clamp(1.5rem,3.5vw,2.25rem)]">
              {turns.map((turn) => (
                <Message key={turn.id} turn={turn} strings={strings} />
              ))}
            </div>
          )}
        </div>
      </Conversation>

      <div className="shrink-0 border-t-[3px] border-ink bg-paper px-[clamp(1rem,3vw,1.75rem)] pt-4 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
        <div className="mx-auto w-full max-w-4xl">
          <Composer strings={strings} busy={busy} onSend={send} />
        </div>
      </div>
    </div>
  );
}

/**
 * What the surface says before it has been used: the invitation, the honest
 * scope of what the Agent answers from, and four questions that can be sent
 * with one press. The starters belong here and only here — an empty chat is
 * the one place a reader needs to be told what to ask.
 */
function Empty({
  strings,
  onPick,
}: {
  strings: ChatStrings;
  onPick: (question: string) => void;
}) {
  return (
    <div className="flex flex-col items-start">
      <h1 className="max-w-[18ch] text-[clamp(1.875rem,5vw,3rem)] leading-[1.02] font-extrabold tracking-[-0.025em] text-balance">
        {strings.emptyHeading}
      </h1>

      <p className="ink-muted mt-5 max-w-[58ch] text-lead">{strings.lead}</p>

      <p className="legend mt-[clamp(2rem,4vw,2.75rem)]">{strings.seedHeading}</p>

      <ul className="m-0 mt-3 grid w-full list-none gap-2.5 p-0 sm:grid-cols-2">
        {strings.seeds.map((question) => (
          <li key={question}>
            <Button
              type="button"
              variant="outline"
              onClick={() => onPick(question)}
              // A starter is a sentence, not a label: it has to be allowed to
              // wrap, against the button base's own `whitespace-nowrap`.
              className="h-full w-full justify-start px-4 py-3 text-left text-[0.875rem] leading-snug font-semibold whitespace-normal"
            >
              {question}
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
}
