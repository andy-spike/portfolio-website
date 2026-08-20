import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  MAX_STORED_TURNS,
  searchInFlight,
  searched,
  settled,
  sourcesFor,
  sourcesOf,
  textOf,
} from './transcript.ts';
import type { AskMessage, Passage } from './types.ts';

const passage = (title: string, file = 'dolphin'): Passage => ({
  file,
  title,
  content: `## ${title}\n\nSomething true.`,
});

const question = (id: string, text: string): AskMessage => ({
  id,
  role: 'user',
  parts: [{ type: 'text', text }],
});

/** A finished reply: the search it ran, then the prose it wrote. */
const reply = (id: string, text: string, found?: Passage[]): AskMessage => ({
  id,
  role: 'assistant',
  parts: [
    ...(found
      ? [
          {
            type: 'tool-searchCorpus' as const,
            toolCallId: `${id}-call`,
            state: 'output-available' as const,
            input: { query: 'dolphin' },
            output: found,
          },
        ]
      : []),
    { type: 'text' as const, text },
  ],
});

test('the prose of a reply leaves the search out of it', () => {
  assert.equal(textOf(reply('a', 'Dolphin orchestrates agents.', [passage('What')])),
    'Dolphin orchestrates agents.');
});

test('a reply that searched is told apart from one that did not', () => {
  assert.equal(searched(reply('a', 'x', [passage('What')])), true);
  assert.equal(searched(reply('a', 'x')), false);
});

test('a passage found by two searches is named once', () => {
  const message: AskMessage = {
    id: 'a',
    role: 'assistant',
    parts: [
      { type: 'tool-searchCorpus', toolCallId: '1', state: 'output-available', input: { query: 'a' }, output: [passage('What'), passage('How')] },
      { type: 'tool-searchCorpus', toolCallId: '2', state: 'output-available', input: { query: 'b' }, output: [passage('How'), passage('Why', 'armin')] },
      { type: 'text', text: 'Both.' },
    ],
  };

  assert.deepEqual(
    sourcesOf(message).map((s) => `${s.file}/${s.title}`),
    ['dolphin/What', 'dolphin/How', 'armin/Why']
  );
});

test('a reply that searched stands on what it found', () => {
  const messages = [question('q', 'What is Dolphin?'), reply('a', 'It runs agents.', [passage('What')])];
  assert.deepEqual(sourcesFor(messages, 1), {
    list: [{ file: 'dolphin', title: 'What' }],
    inherited: false,
  });
});

test('a reply that searched and found nothing says so, and inherits nothing', () => {
  const messages = [
    question('q0', 'What is Dolphin?'),
    reply('a0', 'It runs agents.', [passage('What')]),
    question('q1', 'What is the capital of France?'),
    reply('a1', 'The Corpus does not cover it.', []),
  ];

  assert.deepEqual(sourcesFor(messages, 3), { list: [], inherited: false });
});

test('a reply that did not search carries the last Exchange forward', () => {
  const messages = [
    question('q0', 'What is Dolphin?'),
    reply('a0', 'It runs agents.', [passage('What')]),
    question('q1', 'Say that again more simply.'),
    reply('a1', 'It runs agents for you.'),
  ];

  assert.deepEqual(sourcesFor(messages, 3), {
    list: [{ file: 'dolphin', title: 'What' }],
    inherited: true,
  });
});

test('a first reply with nothing behind it inherits nothing', () => {
  const messages = [question('q', 'Hello.'), reply('a', 'Hello.')];
  assert.deepEqual(sourcesFor(messages, 1), { list: [], inherited: false });
});

test('a search still being written is in flight, named or not', () => {
  const writing: AskMessage = {
    id: 'a',
    role: 'assistant',
    parts: [{ type: 'tool-searchCorpus', toolCallId: '1', state: 'input-streaming', input: undefined }],
  };
  const named: AskMessage = {
    id: 'a',
    role: 'assistant',
    parts: [{ type: 'tool-searchCorpus', toolCallId: '1', state: 'input-available', input: { query: 'Dolphin' } }],
  };

  assert.deepEqual(searchInFlight(writing), { query: '' });
  assert.deepEqual(searchInFlight(named), { query: 'Dolphin' });
  assert.equal(searchInFlight(reply('a', 'done', [passage('What')])), undefined);
});

test('a reply still streaming leaves with the question it never answered', () => {
  const whole = [question('q0', 'What is Dolphin?'), reply('a0', 'It runs agents.', [passage('What')])];
  const messages = [...whole, question('q1', 'And Armin?'), reply('a1', '')];

  assert.deepEqual(settled(messages), whole);
});

test('the window keeps the recent tail and opens on a question', () => {
  const messages = Array.from({ length: MAX_STORED_TURNS }, (_, i) => [
    question(`q${i}`, `q${i}`),
    reply(`a${i}`, `a${i}`, [passage('What')]),
  ]).flat();

  const kept = settled(messages);
  assert.equal(kept.length, MAX_STORED_TURNS);
  assert.equal(kept[0]!.role, 'user');
  assert.equal(textOf(kept.at(-1)!), `a${MAX_STORED_TURNS - 1}`);
});

test('an empty transcript stays empty', () => {
  assert.deepEqual(settled([]), []);
});
