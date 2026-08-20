import { useEffect, useMemo, useState } from 'react';
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { cn } from '@/lib/utils';
import { ArrowLeft, SquarePen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Composer } from './Composer';
import { Conversation } from './Conversation';
import { Message } from './Message';
import { STORE_KEY, settled, textOf } from './transcript';
import type { AskMessage, ChatStrings } from './types';

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
 * The stream, the status and the transcript are the SDK's, so this file holds
 * none of that. What it does hold is the two things the SDK has no opinion
 * about: the request the route already validates, and the reader's own copy of
 * the session. The server keeps nothing, so New chat is a real deletion.
 */
export function Chat({
  strings,
  locale,
  homeHref,
  altLocaleHref,
  altLocaleLabel,
  toBottomLabel,
}: Props) {
  const transport = useMemo(
    () =>
      new DefaultChatTransport<AskMessage>({
        api: '/api/chat',
        // The route's contract is `{ locale, messages: [{ role, text }] }` and
        // stays that way. Sending whole messages back would carry the Agent's
        // own tool results up with them, and a transcript the client can edit
        // is not a record of what the Corpus said.
        prepareSendMessagesRequest: ({ messages }) => ({
          body: {
            locale,
            messages: messages.map((message) => ({
              role: message.role,
              text: textOf(message),
            })),
          },
        }),
      }),
    [locale]
  );

  const { messages, setMessages, sendMessage, stop, status, error, clearError } =
    useChat<AskMessage>({ transport });

  const busy = status === 'submitted' || status === 'streaming';
  const [restored, setRestored] = useState(false);

  // Restored after mount, never during render: the island is server-rendered
  // empty, and reading storage in render would hand React different markup
  // than the page it is hydrating.
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORE_KEY);
      const parsed: unknown = saved ? JSON.parse(saved) : null;
      if (Array.isArray(parsed)) setMessages(settled(parsed as AskMessage[]));
    } catch {
      // Storage the browser will not give us, or a shape from an older
      // version of this surface. It costs the reader their last session,
      // never this one.
    }
    setRestored(true);
  }, [setMessages]);

  // Written when the surface is at rest, not on every token: a reply lands as
  // dozens of updates and a whole transcript re-serialised on each of them is
  // work nobody asked for. Nothing is written before the restore has run, so
  // an empty first pass cannot erase the last session; New chat clears it.
  useEffect(() => {
    if (busy || !restored) return;
    const keep = settled(messages);
    if (keep.length === 0) return;
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify(keep));
    } catch {
      // A full or unavailable store. The session still works; it just stops
      // outliving the tab.
    }
  }, [messages, busy, restored]);

  const ask = (question: string) => {
    clearError();
    void sendMessage({ text: question });
  };

  const reset = () => {
    stop();
    clearError();
    setMessages([]);
    try {
      localStorage.removeItem(STORE_KEY);
    } catch {}
  };

  const empty = messages.length === 0;

  // Until the reply starts arriving there is no reply to render, and the
  // reader would watch their own question sit there alone for as long as the
  // Agent takes to decide what to search for. An empty block stands in for it
  // so the surface is never silent about working. It is never stored: it is
  // not a thing the Agent said.
  const shown: AskMessage[] =
    status === 'submitted' && messages.at(-1)?.role === 'user'
      ? [...messages, { id: 'awaiting', role: 'assistant', parts: [] }]
      : messages;

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

      <Conversation revision={messages.length + (busy ? 0 : 1)} scrollLabel={toBottomLabel}>
        <div
          className={cn(
            'mx-auto w-full max-w-4xl px-[clamp(1rem,3vw,1.75rem)] py-[clamp(1.5rem,4vw,2.5rem)]',
            empty && 'flex min-h-full flex-col justify-center'
          )}
        >
          {empty ? (
            <Empty strings={strings} onPick={ask} />
          ) : (
            <div className="flex flex-col gap-[clamp(1.5rem,3.5vw,2.25rem)]">
              {shown.map((message, index) => (
                <Message
                  key={message.id}
                  messages={shown}
                  index={index}
                  strings={strings}
                  // The Agent is still working on the last reply only, and a
                  // request that failed is not a reply the reader can read.
                  busy={busy && index === shown.length - 1}
                  failed={
                    error !== undefined &&
                    index === shown.length - 1 &&
                    message.role === 'assistant'
                  }
                />
              ))}
            </div>
          )}
        </div>
      </Conversation>

      <div className="shrink-0 border-t-[3px] border-ink bg-paper px-[clamp(1rem,3vw,1.75rem)] pt-4 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
        <div className="mx-auto w-full max-w-4xl">
          {/*
            A request that never became a reply leaves no block in the
            transcript to carry the news, so the composer carries it instead.
          */}
          {error && (
            <p className="mb-3">
              <span className="plate plate-solid">
                {rateLimited(error) ? strings.rateLimited : strings.failed}
              </span>
            </p>
          )}
          <Composer strings={strings} busy={busy} onSend={ask} />
        </div>
      </div>
    </div>
  );
}

/**
 * Whether the reader was turned away for asking too fast, rather than for
 * anything being broken — the two need different words. The SDK hands the whole
 * response body over as the error's message, and the route puts a stable code
 * in it so this does not become a test against English prose.
 */
function rateLimited(error: Error): boolean {
  try {
    return (JSON.parse(error.message) as { code?: string }).code === 'rate_limited';
  } catch {
    return false;
  }
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
