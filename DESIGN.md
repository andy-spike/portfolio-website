# Design

The visual world is a **type specimen sheet**: the artifact a foundry prints so a professional can judge a working object at a glance and in depth. Every Portfolio Project is a specimen — one object shown at several magnifications, measured, annotated, and set in use.

It was chosen because the reader's job and the form's job are the same job. It also does two things no other candidate did: a specimen's **alternates** — the glyphs considered and not set — are exactly the Rejected Alternatives that carry every Case Study, and a specimen's **reversed plate** makes a dark rendition native to the form rather than a toggle bolted onto a light one.

Direction seed `f2350afb`. The full contract is an HTML comment as the first child of `<body>` in `src/layouts/Base.astro`; it survives the production build and is the authority when this file and the render disagree.

## Rules that are not negotiable

1. **Accent marks action, and one word.** `--accent` and `--accent-ink` are spent on things the reader can act on: links, the primary action, focus rings, the `Set` mark. There is exactly one exception, `.showing-mark` — the word the claim turns on, set in `--accent-ink` in the showing. It is named here so it stays one word on one surface; a second decorative accent anywhere is the system breaking, not the exception widening. It carries no underline and no box, so it never reads as a link. Shadcn's own `--accent` role is aliased to the same token on the assumption that nothing installed spends it on a neutral hover; the first component that does (a menu, a combobox) needs that one usage re-routed to `--plate`, not this rule loosened.
2. **A decision without its alternate does not ship.** `<Decision>` renders `alternates` as struck, labelled showings. An empty `alternates` array is a content bug, not a styling choice.
3. **`--ink-faint` carries real words.** It is held at ≥4.5:1 against `--ground` in both plates. It is the quietest ink, never decorative grey.
4. **No seniority claims anywhere.** Copy states what exists. It never states or implies years of experience.
5. **Spanish falls back, never 404s.** A missing or `draft: true` Spanish specimen renders the English setting behind a notice.

## Color

Tokens live as CSS custom properties on `:root` and are mapped into Tailwind through `@theme inline` in `src/styles/global.css`, so the light/dark flip stays live instead of being frozen at build time.

Dark is the default — the reversed plate. Light takes over when the reader's system asks for it, and an explicit choice via the rail toggle beats both and persists in `localStorage` under `plate`.

| Token | Dark | Light | Use |
|---|---|---|---|
| `--ground` | `#111110` | `#f2f1ee` | Page ground |
| `--plate` | `#191917` | `#e8e7e2` | Raised plate (Shown in use, code) |
| `--rule` | `#2c2c28` | `#d6d4cd` | Hairline rules |
| `--rule-strong` | `#4a4a43` | `#a8a59c` | Section rules, measure ticks |
| `--ink` | `#f2f0e9` | `#131310` | Primary text |
| `--ink-muted` | `#9d9a90` | `#5c5a52` | Secondary text |
| `--ink-faint` | `#85827a` | `#6f6c64` | Quietest text, still ≥4.5:1 |
| `--accent` | `#e8482a` | `#c1301a` | Fills, rules, focus rings |
| `--accent-ink` | `#ff7052` | `#ab2814` | Accent as text (contrast-safe) |
| `--accent-wash` | 11% accent | 9% accent | Row hover, fallback notice |

The light ground is a neutral paper at very low chroma — deliberately not cream. Cream plus ink is the predictable rendition of any paper world, and the specimen's authority comes from precision, not warmth.

## Type

Two families, both variable, both self-hosted through Fontsource. The width axis is loaded (`wdth.css`), not just weight — the specimen's signature gesture depends on it.

- **Archivo Variable** (`wght` 100–900, `wdth` 62–125) — display and body. A grotesque with enough width range to demonstrate itself, which is what a specimen sheet exists to do.
- **Martian Mono Variable** (`wght` 100–800, `wdth` 75–112.5) — measurement only: the rail, reference numbers, stack lists, state, code. Mono here is data and measurement, never a costume for "technical".

| Token | Value | Use |
|---|---|---|
| `--text-showing` | `clamp(2.75rem, 10.5vw, 8.75rem)` | The showing (h1 on Home) |
| `--text-plate` | `clamp(2.125rem, 6vw, 4.25rem)` | Specimen title on a sheet |
| `--text-lead` | `clamp(1.0625rem, 1.4vw, 1.3125rem)` | Lead paragraph, prose body |
| `--text-micro` | `0.6875rem` | `.rail`, all mono metadata |

The showing exceeds the usual 6rem display ceiling on purpose: the enlarged showing is the form's central device, not emphasis for its own sake. Prose is capped at 68ch (`.prose-spec`). Display tracking sits at `-0.04em`, the tight floor, and no tighter.

## Motion

**One moving mark.** The showing does not animate: it is set, the way a printed line is set. The page's only sustained motion is `.cue-mark`, the arrow under the showing, which travels down its own length and fades on a 2.6s loop — the one thing on the sheet that is asking for something. Nothing else loops, anywhere.

Everything else is state feedback under 350ms: row hover wash, underline thickening on `.act`, colour on the rail links. `prefers-reduced-motion` stops the cue outright and flattens all transitions.

## Components

Specimen primitives are defined in `@layer components` in `src/styles/global.css`.

| Class | What it is |
|---|---|
| `.sheet` | Page measure — 90rem max, fluid gutters |
| `.rail` / `.rail-strong` | Mono metadata line: uppercase, tracked, tabular |
| `.showing` | The enlarged setting. Set, never animated |
| `.showing-mark` | The one word of the showing set in `--accent-ink`. The single named exception to rule 1 |
| `.key-entry` / `.key-num` | The key that answers the showing with verifiable facts |
| `.measure` | Hairline with tick ends — the dimension rule |
| `.cue` / `.cue-mark` | The Lucide `arrow-down` that points from the showing to the catalogue, travelling down its own length and fading on a loop |
| `.spec-row` / `.spec-name` | One catalogued specimen in the table — title, description, meta, and stack tags all inside one interactive strip |
| `.decision` / `.alt` / `.alt-mark` / `.alt-name` | A decision and its struck alternates |
| `.prose-spec` | Reading measure for Case Study prose |
| `.act` | Actionable text |

`SectionHead.astro` rules every division on the sheet the same way — the section's name on a hairline that spans the measure, with an optional count set at the far end. `--rail-h` carries the fixed rail's own height (`5.75rem`, `4.25rem` from 40rem up); the content reserve in `Base.astro` and every section's `scroll-margin-top` derive from it, so no heading can land underneath the rail.

Buttons come from Shadcn (`components.json` style `base-sera`, base color `taupe`, icon library `lucide`): `src/components/ui/button.tsx` exports `buttonVariants`, applied directly to `<a>` tags via `cn(buttonVariants({...}))` — these are static links, not interactive React state, so nothing hydrates and no client JS ships for them. Shadcn's semantic tokens (`--primary`, `--card`, `--border`, `--ring`, …) are retokened in `global.css` to reference the specimen tokens above instead of shadcn's own palette, and `--radius: 0` keeps every future shadcn component square. `ContactBar.astro` is the reusable primary-action-plus-icon-row pattern, used on both the showing and the colophon.

Icons: Lucide (`sun`, `moon`, `mail`, `file-text`, rendered as unhydrated React via `@astrojs/react`) for anything generic, plus `BrandIcon.astro` for trademarked marks — GitHub and X pull maintained `currentColor` path data from Simple Icons (`simple-icons`, tree-shaken per-icon, CC0), LinkedIn stays hand-authored because Simple Icons removed it from the package at LinkedIn's own request. `Arrow.astro` (1.25px stroke, square caps) remains the one authored non-brand mark, for in-page navigation. No icon font, no emoji, no unicode glyphs standing in for drawn marks.

## Structure

- `/` and `/es/` — the sheet: showing, key, actions, specimen table, shown-in-use, colophon.
- `/work/<slug>/` and `/es/work/<slug>/` — one Case Study. Prose in the reading measure, metadata in a sticky margin rail separated by a hairline.
- Content lives in `src/content/specimens/<locale>/<slug>.mdx`. Frontmatter carries facts; the body carries Problem → Decisions → Result. `<Decision>` is injected via the `components` prop, so authors do not import it.
- Locale resolution and English fallback are centralised in `src/lib/specimens.ts`. UI strings are in `src/i18n/ui.ts`.

## Placeholder Assets

Slots exist; the files do not. Supplying each is a content change, never a design change.

| Asset | Where | Note |
|---|---|---|
| Résumé PDF | `public/andres-sanabria.pdf` | Path in `src/lib/contact.ts`. The secondary action links it today and will 404 until it exists. |
| Headshot | `public/portrait.jpg` | `Portrait.astro` renders a reserved plate beside the showing until `CONTACT.portraitIsPlaceholder` is set to `false` and the file exists. |
| Domain | `astro.config.mjs` → `site` | Currently `https://andressanabria.dev`. Canonical and hreflang URLs derive from it. |
| Terminal Cast | `public/casts/dolphin.cast` | `InUse.astro` renders a reserved plate until a `cast` is set on the specimen. |
