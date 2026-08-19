/**
 * The Agent's wire format, written and read in one place.
 *
 * `sources` arrives first and carries the passages the answer stands on,
 * `delta` carries the answer as it is produced, and one of `done` or `error`
 * ends it. Both ends of the stream are defined here so the writer and the
 * reader cannot drift apart.
 */
export type AskEvent = 'sources' | 'delta' | 'done' | 'error';

export interface Frame {
  event: AskEvent;
  data: unknown;
}

/** Write one frame. Frames are separated by a blank line. */
export function frame(event: AskEvent, data: unknown): Uint8Array {
  return new TextEncoder().encode(
    `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`
  );
}

/**
 * Read the stream back.
 *
 * Frames arrive in whatever pieces the network hands over, so a frame cut in
 * half stays in the buffer until the rest of it lands. Anything that is not a
 * whole frame yet is not an event.
 */
export async function* frames(
  body: ReadableStream<Uint8Array>
): AsyncGenerator<Frame> {
  const reader = body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  for (;;) {
    const { value, done } = await reader.read();
    if (done) return;
    buffer += decoder.decode(value, { stream: true });

    let cut: number;
    while ((cut = buffer.indexOf('\n\n')) !== -1) {
      const frame = buffer.slice(0, cut);
      buffer = buffer.slice(cut + 2);

      const event = frame.match(/^event: (.*)$/m)?.[1];
      const data = frame.match(/^data: (.*)$/m)?.[1];
      if (event) yield { event: event as AskEvent, data: JSON.parse(data ?? 'null') as unknown };
    }
  }
}
