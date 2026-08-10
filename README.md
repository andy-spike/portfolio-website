# Portfolio Website

The personal site of Andrés Sanabria, built to present three shipped, publicly
usable products as evidence that he builds real software — and to convert a
convinced reader into an email. It is not a blog, a résumé transcription, or a
personal homepage.

The site is a **foundry sheet**: every Portfolio Project is one object shown at
several magnifications, measured, annotated, and set in use.
The alternates a foundry shows are exactly the Rejected Alternatives that carry
each Case Study.

## The products

Three Portfolio Projects, each with a case study in the shape
Problem → Decisions (with Rejected Alternatives) → Result:

- **Dolphin** (Flagship) — agent-native course generator; a TUI that orchestrates
  coding agents as its central generation engine. ~21k lines of TypeScript.
- **Armin** — local-first spaced-repetition desktop app using FSRS, shipping an
  MCP server with tests and an AppImage release.
- **Citadela** — peer-to-peer tutoring marketplace for Bogotá universities
  (Next.js, Convex, Better Auth, payments and scheduling).

## Stack

- Astro 7.2, pnpm, Node >= 22.12
- Tailwind CSS v4 with design tokens as CSS custom properties
- MDX content collections for case studies
- React 19 + Shadcn primitives, rendered build-time only — no client JS ships
- Bilingual (en/es) with Astro i18n routing; a missing Spanish translation
  falls back to English, never 404s
- Deployed on Vercel (`@astrojs/vercel`)

## Project structure

```text
/
├── public/                     # og-*.png, favicon, (reserved: resume, portrait, casts)
├── scripts/                    # og-card.html — OG image source
├── src/
│   ├── components/             # HomeSheet, Sheet, ProjectTable, Rail, etc.
│   │   └── ui/                 # shadcn primitives (button, dropdown-menu)
│   ├── content/
│   │   └── projects/<locale>/<slug>.mdx   # case studies, per language
│   ├── i18n/ui.ts              # all UI copy in both languages
│   ├── layouts/Base.astro      # document shell + design contract comment
│   ├── lib/                    # contact facts, project resolution, cn()
│   ├── pages/
│   │   ├── index.astro         # the sheet (Home)
│   │   ├── es/index.astro
│   │   ├── work/[slug].astro   # case study
│   │   └── es/work/[slug].astro
│   └── styles/global.css       # tokens, plates, sheet primitives
├── components.json             # shadcn config
├── CONTEXT.md                  # domain vocabulary (binding)
├── PRODUCT.md                  # product context
└── DESIGN.md                   # design system
```

## Commands

| Command             | Action                                            |
| :------------------ | :------------------------------------------------ |
| `pnpm install`      | Installs dependencies                             |
| `pnpm dev`          | Starts local dev server at `localhost:4321`       |
| `pnpm build`        | Build your production site to `./dist/`           |
| `pnpm preview`      | Preview the build locally                         |
| `pnpm astro ...`    | Run CLI commands like `astro add`, `astro check`  |

## Adding or editing a case study

1. Add `src/content/projects/<en|es>/<slug>.mdx`.
2. Frontmatter carries facts (title, role, year, state, stack, links, order);
   the body carries Problem → Decisions → Result. `<Decision>` is injected via
   the `components` prop, so authors do not import it.
3. A Decision without its Rejected Alternatives does not ship.
4. Spanish is optional — a missing or `draft: true` Spanish file falls back to
   the English setting.

## Placeholder assets

The design depends on these slots; supplying each is a content change, never a
design change. Until the files exist the site renders reserved plates.

| Asset       | Path                          | Controlled by                         |
| :---------- | :---------------------------- | :------------------------------------ |
| Résumé      | `public/andres-sanabria-cv.pdf` | `src/lib/contact.ts` (`resume`)      |
| Headshot    | `public/portrait.jpg`         | `src/lib/contact.ts` (`portrait`)     |
| Domain      | `astro.config.mjs` → `site`   | currently `https://andressanabria.dev` |
| Terminal cast | `public/casts/dolphin.cast` | `cast` field on the project           |

## Rules that are not negotiable

1. Accent marks action, and one word.
2. A decision without its alternate does not ship.
3. No seniority claims anywhere, in either direction.
4. Spanish falls back, never 404s.
5. Every claim resolves to something the reader can open, run, or download.
