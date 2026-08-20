/**
 * Reading the transcript: what the reader's browser keeps of it, and what each
 * reply stood on.
 *
 * The server is stateless and stores nothing, so the browser's copy is the only
 * one that exists anywhere. Everything here is pure — the view and the store
 * both read a reply the same way, and neither has to know how the other works.
 */
import type { AskMessage, Source } from './types';

/** One key for both locales, so switching language keeps the session running. */
export const STORE_KEY = 'ask.transcript';

/**
 * How much of the transcript survives a reload. Without a cap a returning
 * reader accumulates turns across weeks until the route rejects the transcript
 * outright, and the model is only given the recent tail either way.
 */
export const MAX_STORED_TURNS = 40;

/** The prose of a reply, with the Agent's reach into the Corpus left out. */
export function textOf(message: AskMessage): string {
  return message.parts
    .filter((part) => part.type === 'text')
    .map((part) => part.text)
    .join('');
}

/** True when the Agent reached for the Corpus on this reply, found or not. */
export function searched(message: AskMessage): boolean {
  return message.parts.some((part) => part.type === 'tool-searchCorpus');
}

/** The passages one reply's searches returned, each named once. */
export function sourcesOf(message: AskMessage): Source[] {
  const found = new Map<string, Source>();
  for (const part of message.parts) {
    if (part.type !== 'tool-searchCorpus' || part.state !== 'output-available') {
      continue;
    }
    for (const { file, title } of part.output) {
      found.set(`${file}/${title}`, { file, title });
    }
  }
  return [...found.values()];
}

/**
 * What the reply at `index` stood on.
 *
 * A reply that searched stands on what it found, and an empty list there is a
 * real answer: the Corpus held nothing. A reply that did not search asked for
 * no new fact — a rephrase, or a thank-you — so it rests on the last Exchange
 * that did, and says so rather than printing itself a defect.
 */
export function sourcesFor(
  messages: AskMessage[],
  index: number
): { list: Source[]; inherited: boolean } {
  const message = messages[index];
  if (!message) return { list: [], inherited: false };
  if (searched(message)) return { list: sourcesOf(message), inherited: false };

  for (let earlier = index - 1; earlier >= 0; earlier--) {
    const before = messages[earlier];
    if (before?.role !== 'assistant') continue;
    const list = sourcesOf(before);
    if (list.length) return { list, inherited: true };
  }
  return { list: [], inherited: false };
}

/**
 * The search the Agent is running right now, if it is running one.
 *
 * The query is empty while the Agent is still writing it, which is a moment
 * long enough to see. The surface says it is searching either way and names the
 * subject once it has one.
 */
export function searchInFlight(message: AskMessage): { query: string } | undefined {
  const part = message.parts.findLast((p) => p.type === 'tool-searchCorpus');
  if (!part || part.type !== 'tool-searchCorpus') return undefined;
  if (part.state === 'output-available' || part.state === 'output-error') {
    return undefined;
  }
  return { query: part.input?.query ?? '' };
}

/**
 * The part of the transcript worth keeping: whole Exchanges, most recent last.
 *
 * A reply still streaming when the tab closed never became an answer, and the
 * question it belonged to never got one, so the two leave together rather than
 * coming back as a question the Agent appears to have ignored. Messages come in
 * reader/Agent pairs, so the window always opens on a question.
 */
export function settled(messages: AskMessage[]): AskMessage[] {
  const last = messages.at(-1);
  const whole =
    last?.role === 'assistant' && !textOf(last).trim()
      ? messages.slice(0, -2)
      : messages;
  return whole.slice(-MAX_STORED_TURNS);
}
