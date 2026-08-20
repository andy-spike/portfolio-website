# Corpus tracker

The Agent answers only from the Corpus in `src/content/corpus/`. This file tracks what a later session must verify or update before the Corpus is final. Each entry names the file and section it touches.

## Dolphin (src/content/corpus/dolphin.md)

- [ ] **Repo must be public.** On 2026-08-19, `github.com/andy-spike/dolphin` returned 404. The corpus claims the source is public. Make the repo public before launch, or change the corpus to match reality.
- [ ] **Live deployment URL.** Dolphin is a web app but is not deployed. When it is live, add the URL to "What state Dolphin is in".
- [ ] **Stack confirmation.** The corpus assumes TypeScript, Turborepo, Hono, Cloudflare Workers, Drizzle, Bun. Andrés said he would report what changed after finishing the project. Confirm before trusting "How Dolphin is built".

## Case studies (src/content/projects/en/*.mdx)

- [ ] **Write the case studies.** Dolphin, Armin, and Ask all have TO WRITE bodies. The corpus must stay in step with them; do not let the two drift apart.

## Ask (src/content/corpus/ask.md)

- [ ] **Spanish case study.** `es/ask.mdx` is draft. Flip it to false when the Spanish prose is written.

## Every corpus change

- [ ] **Reseed.** Run `pnpm run seed` after any change to a corpus file so the retrieval store matches the files. The store is replaced, not merged.

## Assets

- [ ] **Resume.** Still a placeholder. The corpus says nothing about it; add a line in "How to reach him" when the file exists.

## Verified as of 2026-08-19

- Site is live at https://ansanabria.dev; `/ask` answers in English and Spanish.
- Armin is public at github.com/andy-spike/armin with a v0.5.0 AppImage release.
- This repository is public at github.com/andy-spike/portfolio-website.
- The Corpus chunks cleanly: 24 sections across 6 files.