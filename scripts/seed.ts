/**
 * Embed the Corpus into the retrieval store.
 *
 * Run by hand after the Corpus changes: `pnpm run seed`. The store is replaced
 * rather than merged — a passage deleted from a file must stop being a Source,
 * and at this size a full rewrite is cheaper than reconciling.
 *
 * Needs OPENROUTER_API_KEY, SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.
 */
import { readFile, readdir } from 'node:fs/promises';
import { basename, join } from 'node:path';
import { createOpenRouter } from '@openrouter/ai-sdk-provider';
import { createClient } from '@supabase/supabase-js';
import { embedMany } from 'ai';
import { CORPUS_LOCALE, EMBEDDING_MODEL, chunk } from '../src/lib/corpus.ts';

const CORPUS_DIR = 'src/content/corpus';

function required(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is not set. See .env.example.`);
  return value;
}

const openrouter = createOpenRouter({ apiKey: required('OPENROUTER_API_KEY') });
const supabase = createClient(
  required('SUPABASE_URL'),
  required('SUPABASE_SERVICE_ROLE_KEY')
);

const files = (await readdir(CORPUS_DIR)).filter((f) => f.endsWith('.md')).sort();

const rows = [];
for (const file of files) {
  const name = basename(file, '.md');
  const chunks = chunk(await readFile(join(CORPUS_DIR, file), 'utf8'));
  console.log(`${name}: ${chunks.length} chunk(s)`);
  for (const c of chunks) rows.push({ file: name, ...c, locale: CORPUS_LOCALE });
}

if (rows.length === 0) {
  console.log('Nothing to seed: the Corpus is still skeletons.');
  process.exit(0);
}

const { embeddings } = await embedMany({
  model: openrouter.textEmbeddingModel(EMBEDDING_MODEL),
  values: rows.map((r) => `${r.title}\n\n${r.content}`),
});

// ponytail: delete-then-insert, so an insert that fails after the delete leaves
// the store empty until the script is re-run. Seed into a second table and swap
// if the Agent ever has traffic that cannot take that window. Embedding happens
// first, so the failure that actually costs money cannot get that far.
const cleared = await supabase.from('corpus_chunks').delete().neq('id', 0);
if (cleared.error) throw cleared.error;

const inserted = await supabase
  .from('corpus_chunks')
  .insert(rows.map((row, i) => ({ ...row, embedding: embeddings[i] })));
if (inserted.error) throw inserted.error;

console.log(`Seeded ${rows.length} chunk(s) from ${files.length} file(s).`);
