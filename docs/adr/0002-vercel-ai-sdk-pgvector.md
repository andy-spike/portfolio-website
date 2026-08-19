# Retrieval runs on Vercel AI SDK and Supabase (Postgres pgvector)

The Agent's retrieval and generation run on the Vercel AI SDK, with vectors stored in Supabase — a hosted Postgres with the `pgvector` extension. A hosted Postgres beats running and managing our own database, at the cost of one second service beside the Vercel deploy.

## Considered Options

- **Self-managed Postgres + pgvector.** No second service, but we own provisioning, backups, and upgrades for no product gain.
- **Cloudflare Workers + Vectorize.** Edge-native, but adds a second deploy target and another platform's tooling beside Astro/Vercel.
- **Embedded JSON plus hosted embeddings.** Smallest, but demonstrates less infrastructure competence.

## Consequences

The site gains a second deploy target (Supabase) and a seed step that embeds the Corpus into it. The vector dimension (1536) is fixed by the embedding model choice and baked into the schema, so changing the model later means a migration and reseed.
