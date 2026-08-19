-- The retrieval store the Agent answers from, plus the counter that keeps one
-- visitor from spending the whole key. Both tables are reached with the service
-- role key from the server only; RLS is on with no policy, so the anon key sees
-- nothing.

create extension if not exists vector;

-- One row per Corpus chunk. The dimension is fixed by the embedding model
-- (text-embedding-3-small, 1536): changing the model means a migration and a
-- reseed. Locale is the language the passage is *written* in — the Corpus is
-- English today, and the Agent answers in the page's language regardless.
create table if not exists corpus_chunks (
  id bigint generated always as identity primary key,
  -- The Corpus file the passage came from, e.g. `dolphin`. Not the domain term
  -- Source: a Source is the passage, and this is where it was written.
  file text not null,
  title text not null,
  content text not null,
  embedding vector(1536) not null,
  locale text not null default 'en'
);

create index if not exists corpus_chunks_embedding_idx
  on corpus_chunks using hnsw (embedding vector_cosine_ops);

alter table corpus_chunks enable row level security;

-- Top-k by cosine distance. `<=>` is cosine distance, so similarity is 1 minus
-- it; the order is by distance either way, which is what the index serves.
create or replace function match_chunks(
  query_embedding vector(1536),
  match_limit int,
  filter_locale text
)
returns table (file text, title text, content text, similarity float)
language sql
stable
as $$
  select c.file, c.title, c.content, 1 - (c.embedding <=> query_embedding)
  from corpus_chunks c
  where c.locale = filter_locale
  order by c.embedding <=> query_embedding
  limit match_limit;
$$;

-- One row per client IP, holding the current window.
create table if not exists rate_limits (
  ip text primary key,
  window_start timestamptz not null default now(),
  count int not null default 0
);

alter table rate_limits enable row level security;

-- Count this request and say whether it is allowed, in one statement: two round
-- trips would let concurrent requests both read the same count and both pass.
-- A window that has run out is restarted rather than incremented.
create or replace function bump_rate_limit(
  client_ip text,
  max_hits int,
  window_seconds int
)
returns boolean
language plpgsql
as $$
declare
  hits int;
begin
  insert into rate_limits as r (ip, window_start, count)
  values (client_ip, now(), 1)
  on conflict (ip) do update
    set count = case
          when r.window_start < now() - make_interval(secs => window_seconds) then 1
          else r.count + 1
        end,
        window_start = case
          when r.window_start < now() - make_interval(secs => window_seconds) then now()
          else r.window_start
        end
  returning r.count into hits;

  return hits <= max_hits;
end;
$$;
