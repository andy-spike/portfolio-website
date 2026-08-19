/**
 * The chat's own vocabulary. One Exchange is a user turn and the Agent's reply
 * to it; the transcript is a flat list of turns so the view never has to pair
 * them up. `status` belongs to an assistant turn only: `pending` while the
 * reply is being produced, `error` when the request did not complete.
 */
export type Role = 'user' | 'assistant';

export type TurnStatus = 'pending' | 'error';

/** A passage of the Corpus the Agent stood on, as the transcript prints it. */
export interface Source {
  /** The Corpus file it was written in, e.g. `dolphin`. */
  file: string;
  /** The heading of the passage inside that file. */
  title: string;
}

export interface Turn {
  id: string;
  role: Role;
  /** Empty while an assistant turn is still `pending`, then filled as it streams. */
  text: string;
  status?: TurnStatus;
  /** Assistant turns only. Present once the Sources arrive, ahead of the text. */
  sources?: Source[];
}

/** Every string the chat prints, resolved by the page in its own locale. */
export interface ChatStrings {
  back: string;
  newChat: string;
  you: string;
  agent: string;
  thinking: string;
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
  noSources: string;
  failed: string;
  rateLimited: string;
}
