import type { UIDataTypes, UIMessage } from 'ai';

/**
 * One passage the Agent's search returned. The Corpus text travels to the
 * reader with it, because the Agent's reply is streamed as it is produced and
 * the passage is part of that reply.
 */
export interface Passage {
  /** The Corpus file it was written in, e.g. `dolphin`. */
  file: string;
  /** The heading of the passage inside that file. */
  title: string;
  content: string;
}

/** A passage of the Corpus the Agent stood on, as the transcript prints it. */
export type Source = Pick<Passage, 'file' | 'title'>;

/**
 * The one tool the Agent holds, typed so its parts are typed in the view.
 *
 * A type and not an interface: an interface that extends `UITools` inherits its
 * index signature, `keyof` widens back to `string`, and every tool part ends up
 * carrying an unknown input and an unknown output again.
 */
export type AskTools = {
  searchCorpus: { input: { query: string }; output: Passage[] };
};

/**
 * One Exchange half — a question from the reader, or the Agent's reply to it.
 *
 * The reply is a list of parts rather than a string: the Agent searches the
 * Corpus while it answers, and the search is part of what the reader is shown.
 */
export type AskMessage = UIMessage<unknown, UIDataTypes, AskTools>;

/** Every string the chat prints, resolved by the page in its own locale. */
export interface ChatStrings {
  back: string;
  newChat: string;
  you: string;
  agent: string;
  thinking: string;
  searching: string;
  emptyHeading: string;
  lead: string;
  seedHeading: string;
  seeds: string[];
  composerLabel: string;
  placeholder: string;
  send: string;
  hint: string;
  error: string;
  sources: string;
  sourcesInherited: string;
  noSources: string;
  failed: string;
  rateLimited: string;
}
