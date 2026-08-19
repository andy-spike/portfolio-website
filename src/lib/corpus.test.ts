import { test } from 'node:test';
import assert from 'node:assert/strict';
import { chunk } from './corpus.ts';

test('one chunk per heading, title and body kept together', () => {
  const chunks = chunk('# Bio\n\nA developer in Bogotá.\n\n## Where\n\nBogotá, Colombia.\n');

  assert.deepEqual(
    chunks.map((c) => c.title),
    ['Bio', 'Where']
  );
  assert.equal(chunks[0].content, '# Bio\n\nA developer in Bogotá.');
  assert.equal(chunks[1].content, '## Where\n\nBogotá, Colombia.');
});

test('an unfilled section is not a chunk', () => {
  const chunks = chunk('# Bio\n\n## Where\n\n<!-- to be written -->\n\n## What\n\nReal text.\n');

  assert.deepEqual(
    chunks.map((c) => c.title),
    ['What']
  );
});

test('a file with no headings yields nothing', () => {
  assert.deepEqual(chunk('Loose prose with no heading.\n'), []);
});

test('a hash inside a fenced block does not start a chunk', () => {
  const chunks = chunk('## Setup\n\n```sh\n# install it\npnpm install\n```\n');

  assert.equal(chunks.length, 1);
  assert.match(chunks[0].content, /# install it/);
});
