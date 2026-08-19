import { test } from 'node:test';
import assert from 'node:assert/strict';
import { frame, frames } from './ask-stream.ts';

/** A stream that hands over exactly the pieces given, in order. */
function streamOf(pieces: string[]): ReadableStream<Uint8Array> {
  const encoder = new TextEncoder();
  return new ReadableStream({
    start(controller) {
      for (const piece of pieces) controller.enqueue(encoder.encode(piece));
      controller.close();
    },
  });
}

async function read(pieces: string[]) {
  const out = [];
  for await (const frame of frames(streamOf(pieces))) out.push(frame);
  return out;
}

test('reads the frames in order', async () => {
  assert.deepEqual(
    await read([
      'event: sources\ndata: [{"file":"bio","title":"Who"}]\n\n',
      'event: delta\ndata: "He "\n\n',
      'event: delta\ndata: "builds."\n\n',
      'event: done\ndata: null\n\n',
    ]),
    [
      { event: 'sources', data: [{ file: 'bio', title: 'Who' }] },
      { event: 'delta', data: 'He ' },
      { event: 'delta', data: 'builds.' },
      { event: 'done', data: null },
    ]
  );
});

test('a frame split across reads is one frame', async () => {
  assert.deepEqual(await read(['event: del', 'ta\ndata: "He bu', 'ilds."\n\n']), [
    { event: 'delta', data: 'He builds.' },
  ]);
});

test('several frames in one read are several frames', async () => {
  const both = 'event: delta\ndata: "a"\n\nevent: delta\ndata: "b"\n\n';
  assert.deepEqual(await read([both]), [
    { event: 'delta', data: 'a' },
    { event: 'delta', data: 'b' },
  ]);
});

test('a frame left unfinished is not an event', async () => {
  assert.deepEqual(await read(['event: delta\ndata: "half"']), []);
});

test('a multi-byte character split across reads survives', async () => {
  const bytes = new TextEncoder().encode('event: delta\ndata: "Bogotá"\n\n');
  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      // Cut between the two bytes of "á".
      const at = bytes.length - 4;
      controller.enqueue(bytes.slice(0, at));
      controller.enqueue(bytes.slice(at));
      controller.close();
    },
  });

  const out = [];
  for await (const frame of frames(stream)) out.push(frame);
  assert.deepEqual(out, [{ event: 'delta', data: 'Bogotá' }]);
});

test('a frame is written in the shape the reader expects', async () => {
  const written = new TextDecoder().decode(frame('delta', 'He builds.'));
  assert.equal(written, 'event: delta\ndata: "He builds."\n\n');
  assert.deepEqual(await read([written]), [{ event: 'delta', data: 'He builds.' }]);
});
