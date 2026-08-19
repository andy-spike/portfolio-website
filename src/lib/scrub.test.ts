import { test } from 'node:test';
import assert from 'node:assert/strict';
import { scrub } from './scrub.ts';

test('redacts a Supabase secret key', () => {
  const out = scrub('Headers.set: "sb_secret_EXAMPLE-not-a-real-key-000000" is invalid');
  assert.equal(out, 'Headers.set: "sb_secret_[redacted]" is invalid');
});

test('redacts a publishable key and an OpenRouter key', () => {
  assert.match(scrub('key sb_publishable_abc123DEF-456'), /sb_publishable_\[redacted\]$/);
  assert.match(scrub('bearer sk-or-v1-e2abc999def'), /sk-or-\[redacted\]$/);
});

test('redacts a legacy JWT', () => {
  const jwt = 'eyJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoic2VydmljZV9yb2xlIn0.abc-123_XYZ';
  assert.equal(scrub(`apikey ${jwt} rejected`), 'apikey [redacted-jwt] rejected');
});

test('redacts every occurrence, including the duplicated-paste shape', () => {
  const key = 'sb_secret_EXAMPLE-not-a-real-key-000000';
  const out = scrub(`"${key}\n${key}" is an invalid header value.`);
  assert.equal(out, '"sb_secret_[redacted]\nsb_secret_[redacted]" is an invalid header value.');
  assert.ok(!out.includes('EXAMPLE'), 'no fragment of the key survives');
});

test('leaves an ordinary message alone', () => {
  const msg = 'connect ETIMEDOUT db.kjdqxqkfdypnyrjvweat.supabase.co:5432';
  assert.equal(scrub(msg), msg);
});
