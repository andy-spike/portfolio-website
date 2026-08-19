# Design

The visual world is a **stack of printed blocks on warm paper**: classic web neo-brutalism, user-pinned (no roll). Depth comes only from 3px/2px ink borders and zero-blur offset shadows. Every Portfolio Project carries its own saturated colour, always under black ink. It refuses two defaults at once: the wayfinding-program look and the dark developer portfolio with one neon accent.

Light is the only plate — `color-scheme: light` and no other. The day/night toggle does not exist in this build. The direction seed `d8cc7f12` (the platform sign kit) is this build's dead anti-reference; never revive it.

The full contract is an HTML comment at the top of `<body>` in `src/layouts/Base.astro` (THESIS / OWN-WORLD / STORY / FIRST VIEWPORT / SIGNATURE / FORM / FINISH). It survives the production build and is the authority when this file and the render disagree.

Ask carries a second contract of its own, in `src/layouts/ChatShell.astro` (surface roll, seed key `36013237`, structure "The Bench", rebuilt as an application). It governs composition on that surface only; the visual world above it is unchanged there.

## Rules that are not negotiable

1. **Depth is made only by ink and offset.** A block is a paper fill, a 3px (or 2px) solid `--ink` border, and a zero-blur offset shadow. No radius, no blur, no gradient — anywhere.
2. **`.hatched` is the one sanctioned exception to the no-gradient rule.** It is a repeating-linear-gradient at -45deg (1.5px `currentColor` stripes at 20% every 11px) used exclusively as the reserved-placeholder device — proof-sheet hatching for a position held for artwork. It is never decoration. Do not "fix" it into a flat fill.
3. **A decision without its alternates does not ship.** `<Decision>` renders each rejected alternative as `.struck` under a cross-mark list. An empty `alternates` array is a content bug, not a styling choice. (PRODUCT.md: "The Rejected Alternative is the product.")
4. **No seniority claims anywhere.** The site never states or implies experience in either direction. Copy states what exists.
5. **Spanish falls back, never 404s.** A missing Spanish project renders the English setting behind a fallback notice (a `--line-1` notice block on a Case Study; a legend mark in the Directory).
6. **Nothing is invented.** No testimonials, client logos, metrics, user counts, revenue, or awards. A claim with no artifact behind it gets cut.
7. **Placeholder assets are content swap points.** `CONTACT.resumeIsPlaceholder`, `CONTACT.portraitIsPlaceholder`, and a project's `cast` frontmatter switch a hatched reserved plate for the real asset. Supplying the asset is a content change with no design change. While the résumé is a placeholder, its chip renders hatched and as a non-link (`<span>`), because a download to a 404 fakes evidence.

## Colour

Tokens live as CSS custom properties on `:root` and map into Tailwind through `@theme inline` in `src/styles/global.css`.

| Token | Value | Use |
|---|---|---|
| `--ground` | `#F6F1E7` | Warm paper page ground |
| `--paper` | `#FFFDF6` | Block fill |
| `--ink` | `#16130D` | Near-black ink: text, borders, shadows, solid plates |
| `--ink-muted` | `#57503F` | Secondary text (`.legend`, descriptions); lifts to full ink on fills |
| `--rule` | `#DAD1BB` | Hairline rules (hr, internal dividers) |
| `--line-1` | `#F5B301` | Dolphin — also the claim highlight, text-selection, fallback notice |
| `--line-2` | `#F4602A` | Armin |
| `--line-3` | `#2FBFAE` | Citadela |

Per-project colour is keyed by directory order in `lineToken(order)` (`src/lib/projects.ts`): `var(--line-((order-1) % 3)+1)`. It arrives on a block as `--row-color` and is spent on the title brick fill, the ticket/entry hover fill, and the colour chip. Project colour always sits under black ink.

Selection is `--line-1` on ink, reversed to paper inside `.on-ink`.

**Focus prints the block's own rule twice as heavy.** The keyline is 3px solid and lands hard against the border — bare text keeps a 2px offset, every kit block sets its own to 0. It never floats: a gap puts ground between two ink rules of the same weight, and a symmetric ring cannot agree with an offset shadow, so the pair reads as a rendering fault rather than a state. Where the block is already an ink fill (`.btn-solid`, `.chip[aria-current]`) an ink rule could not show, so the keyline prints *inside* it in paper, at `-6px`; on the ink field the reversal runs the other way and `.on-ink .btn-solid` takes an ink keyline inside its paper. These three rules sit last in `@layer components`, because they tie with the `.btn` and `.chip` focus rules on specificity and source order is what decides a tie — moving them earlier, or into `@layer base`, silently disables them.

`.on-ink` is the scope class for content printed on the solid-ink field; it is deliberately not named `.invert`, because Tailwind ships `invert` as a `filter` utility and the collision paints the whole block through a colour inversion.

## Type

Two families, both variable, both self-hosted through Fontsource:

- **Bricolage Grotesque Variable** (`standard.css`, weight 200–800, `font-stretch` 75–100%) — display and body. The claim sets `font-stretch: 85%`.
- **Azeret Mono Variable** — legends and code only. Mono here is metadata, never a costume.

| Token | Value | Use |
|---|---|---|
| `--text-claim` | `clamp(2.75rem, 7.5vw, 6rem)` | The claim (h1 on Home), line-height 0.95 |
| `--text-destination` | `clamp(2rem, 5vw, 3.5rem)` | Project names in the Directory |
| `--text-plate` | `clamp(1.75rem, 4.4vw, 3rem)` | Project title on a Case Study |
| `--text-lead` | `clamp(1.0625rem, 1.25vw, 1.25rem)` | Lead paragraph, `.reading` body |
| `--text-legend` | `0.6875rem` | `.legend`, `.plate` — 11px, uppercase, tracked 0.13em, tabular |

`.reading` caps prose at 68ch with a 1.62 line-height. Headings are weight 800, tracked to -0.02em.

## Motion

**The press** is the signature. Every actionable block lifts off the paper on hover and focus-visible — `translate -2px,-2px`, the hard shadow deepening — and presses flush on active — `translate 3px,3px` (chips 2px,2px), shadow 0. All presses run 120ms on the one ease, `--ease-pop: cubic-bezier(0.22, 0.61, 0.36, 1)`. Nothing eases in softly.

Project rows (`.entry`) and tickets (`.ticket`) fill with `--row-color` as they lift; on the fill, `.ink-muted` and `.legend` lift to full ink and `.plate` / `.ticket-chip` invert to paper fill so every word and mark stays legible. `.plate-solid` is exempt: it keeps its ink fill, because a black block on the project colour is both the most legible mark on the fill and the loudest, and flipping it to paper would erase its paper lettering.

**One looping mark:** `.cue-mark`, the arrow chip below the arrival, drifts down its own length and fades on a 2.6s loop (`cue-drift`). It stops on hover/focus and under `prefers-reduced-motion`. Nothing else loops.

**One loop that only exists while waiting:** `.thinking-tick`, three ink squares in the Agent's turn, steps on a 1s cycle (`thinking-step`) while a reply is outstanding and leaves with the answer. It is the only other loop in the build, and unlike `.cue-mark` it is a state, not an ornament. The cycle ends where it starts, at full opacity, so the base reduced-motion rule — which collapses an animation to its end state — leaves three solid squares that still read as working.

**One mark that prints itself once:** `.ask-nudge`, the paper plate beside the Ask mark, fades in from 0.75rem to the right and back out over a single 7s run (`ask-nudge`, 1.1s delay, `both`). It is not a loop and it never returns on its own — approaching the dock (`.ask-dock:hover`, `:focus-within`) cancels the animation and holds the plate printed. Under `prefers-reduced-motion` it stays printed from the start rather than animating, because the base reduced-motion rule would otherwise collapse it to its end state, which is invisible.

Reduced motion also flattens every transition and disables smooth scroll.

## Components

Kit primitives are defined in `@layer components` in `src/styles/global.css`:

| Class | What it is |
|---|---|
| `.span` / `.span-trim` | Page measure — 88rem max, fluid gutters; the trim (70rem) a Case Study reads at |
| `.legend` / `.legend-strong` | Mono metadata line: uppercase, tracked 0.13em, tabular, muted ink / full ink |
| `.ink-muted` | The quiet tier: `--ink-muted` body text (hero description, project character, cast caption). A class rather than a Tailwind colour utility, because the `--row-color` fills lift it back to full ink by this name |
| `.plate` / `.plate-solid` | Flat 2px-bordered label in mono; the solid variant reverses to ink fill, paper lettering |
| `.brick` / `.brick-lift` | A printed block: paper fill, 3px ink border, 8px hard shadow; the lift variant presses |
| `.claim` / `.claim-mark` | The claim at block-letter scale; the mark is the one word set as a printed highlight — `--line-1` block, 3px ink border, 4px hard shadow |
| `.btn` / `.btn-solid` | An action block with 4px hard shadow; the solid variant is the ink fill. Inside `.on-ink`, shadows and fills reverse to paper |
| `.chip` | The small square marks (2px border, 3px shadow) that travel beside a button; reverses inside `.on-ink` |
| `.ticket` / `.ticket-chip` / `.ticket-name` | One project row on the arrival: fills with `--row-color` as it lifts; the chip is the project colour carrying its number and inverts to paper on hover |
| `.entry` / `.entry-name` | One project at full length in the Directory: 6px shadow, fills with `--row-color` on hover |
| `.window` / `.window-bar` | A framed figure: 3px border, 6px shadow, solid-ink title bar with paper legends |
| `.decision` / `.struck` | One decision as its own block, with what it turned down struck through at 2px |
| `.hatched` | The reserved-placeholder device — the one sanctioned gradient (rule 2) |
| `.cue-mark` | The page's only moving mark. `.cue` itself hides under 62rem of viewport height, where the arrival's bottom edge — the cue's anchor — falls below the fold |
| `.reading` | Prose measure for About and Case Study bodies |
| `.ask-dock` | The fixed bottom-right corner block that carries the Ask mark and its nudge. `z-index: 30` — under the Fascia (40), over the sheet |
| `.ask-mark` | The 3.25rem square that leads to Ask: `--line-1` fill, 3px ink border, 5px hard shadow, pressing like every other block. Square, because rule 1 allows no radius anywhere — the speech mark inside is drawn on Arrow's 14 grid |
| `.ask-nudge` | The paper plate beside the mark, composing `.plate` and departing from it only in wrapping, leading, and a 3px offset. `pointer-events: none`, so the dock's hover belongs to the mark. It is the mark's accessible name (`aria-labelledby`), so only its paint moves |
| `.composer-row` / `.composer-field` / `.composer-send` | The chat's composer: one row of two blocks sharing `--composer-h`. The field (shadcn's `Textarea`) takes that height as a **floor** and grows past it with what is typed; the send block takes it outright. The field's type and padding are pinned rather than fluid, so the floor — not a fluid clamp — is what decides the resting height. On a narrow bar the box legitimately stands taller than the floor, because `field-sizing: content` counts the placeholder as content; the pair stays bottom-aligned, which is what makes the growth read as intended. The row is what lifts on `:focus-within` — lifting the box alone would leave the send block two pixels adrift |
| `.thinking-tick` | One of three ink squares stepping while a reply is outstanding |
| `.touch-target` | 2.875rem minimum hit area under coarse pointers |

`.reading .decision` re-states `.decision`'s own margins (`2.5rem 0 1.25rem`) because `.reading > * + *` applies `margin-top: 1.1em` to every direct child at equal specificity but earlier in the layer. The override exists so the decision block's own rhythm holds inside prose. Do not "simplify" it away.

`--composer-h` (3.5rem) is the chat composer's resting height and `--bar-h` (2.875rem) the height every block in the chat's bar is cut to — the language and the new-chat mark — so they read as one row rather than marks at unrelated sizes. `--bar-h` is the kit's touch-target height, which `.chip` is already built at. The bar carries no name for the surface: the reader arrived by asking for it and the tab already says so.

`--fascia-h` (5rem, 3.75rem from 40rem up) is the Fascia's **total** height, its 3px ink rule included — the strip's inner row is `calc(var(--fascia-h) - 3px)`. It drives `main`'s top padding and every section's `scroll-mt`, so no heading can land underneath it.

### Astro components

| Component | What it renders |
|---|---|
| `Fascia.astro` | Fixed paper strip keyed to the page by a 3px ink bottom rule. The name is the one solid plate on it (`plate plate-solid`); nav links are legends that reverse (ink fill, paper text) on approach, and the link for the page you are on carries `aria-current="page"` and holds that reversal, so the strip states where you are instead of only where you can go; the ES/EN language toggle is a bordered legend that reverses the same way |
| `Arrival.astro` | The first viewport: hero brick (claim + `.claim-mark`, description, ExitBar) with the rotated (-1deg) portrait window at the right, three colour-chipped tickets beneath, and the cue chip |
| `Directory.astro` | Every project at full length as an `.entry`, under a `SignHead` with the count |
| `SignHead.astro` | A division: the section's name as a solid-ink plate on a 3px rule spanning the measure, with an optional count (a figure, never a label) at the far end |
| `Cast.astro` | The service display: an ink-barred `.window` cycling through every project's Cast — YouTube embed, or a hatched reserved plate (16/10) until `cast` frontmatter supplies the URL — with `.chip` prev/next arrows and a position count once more than one project is in play |
| `About.astro` | A `SignHead` plus three paragraphs in `.reading` |
| `Colophon.astro` | The sheet's last block, printed in solid ink (`.on-ink`): the availability line and a reversed ExitBar — paper blocks on the ink field |
| `ExitBar.astro` | The way out: one `.btn .btn-solid` GitHub block plus `.chip` marks (résumé, email, LinkedIn, X). The résumé chip renders hatched and non-linking while `CONTACT.resumeIsPlaceholder` is true |
| `Portrait.astro` | The portrait `.window` (ink bar, 01 legend); hatched reserved square until `CONTACT.portraitIsPlaceholder` is false, then the 4/5 headshot |
| `CaseStudy.astro` | The project's own colour printed as the sheet's largest brick (title, state plate rotated 2deg, back plate, character); optional fallback notice; optional Cast; `.reading` body with `<Decision>` injected via the `components` prop; a sticky aside with the facts panel (3px border, 4px hard shadow, rule-divided rows) and `.btn` externals |
| `AskMark.astro` | The Ask mark and its nudge, mounted by `Base.astro` on every page it lays out. Ask itself runs in `ChatShell.astro`, so there is no page left for `Base.astro` to withhold it from |
| `Decision.astro` | One decision as a `.decision` block: title, what was chosen, body slot, and rejected alternates struck under a cross-mark list |
| `Arrow.astro` | The one authored non-brand mark: 14x14, 1.25px stroke, square caps; `right` for navigation, `out` for links that leave, `down` for downloads |
| `BrandIcon.astro` | Trademarked marks in `currentColor`: GitHub and X from Simple Icons (CC0 path data), LinkedIn hand-authored because Simple Icons removed it at LinkedIn's request. Sized twice on purpose — width/height attributes for the intrinsic box, `size-4` to confirm in CSS |

Icons beyond these are Lucide (`X` in Decision, `FileText`/`Mail` in ExitBar, `ArrowDown` in the cue), rendered as unhydrated build-time React. No icon font, no emoji.

## shadcn, and the chat

shadcn components are added as source under `src/components/ui/`, on Radix primitives, and they speak a fixed set of semantic tokens. Rather than rewrite the classes they ship with, a **bridge** in `@theme inline` points those tokens at the print shop's own — `--color-primary` is `--ink`, `--color-accent` is `--line-1`, `--color-border` is `--ink`, and so on. There is no second palette. The whole radius scale is pinned to `0`, because rule 1 allows no radius and `rounded-md` would otherwise smuggle one in.

Two primitives are rethemed at the source, which is the point of owning it:

- **`Button`** composes the kit's action primitives rather than restating them, so it inherits the border, the hard shadow, the lift and the press. `default`, `outline` and `secondary` are `.btn`; `chip` is `.chip`, the quieter 2px mark for controls that travel beside a label. shadcn's `outline-none` is removed along with the `ring-*` it existed to make room for — dropping one without the other leaves a button with no visible keyboard focus at all.
- **`Textarea`** composes `.composer-field`, keeping only `field-sizing-content` from upstream, which grows the box with the question and needs no script.

The chat is four components in `src/components/chat/`:

| Component | What it does |
|---|---|
| `Chat.tsx` | The application: bar, transcript, composer, and the turn state they share. Holds the swap point where a wired Agent replaces the honest system reply |
| `Conversation.tsx` | The scroll region. Sticks to the bottom while the reader is already there and stops the moment they scroll up to re-read; offers a block back down when it has stopped. Its keyline prints inside, because the app frame clips anything outside it, and it is only a tab stop while there is something to scroll |
| `Message.tsx` | One turn as a `.brick` — the reader's in `--line-1`, the Agent's on paper, each under its own mono legend. Carries the `NOT CONNECTED` plate and the waiting mark |
| `Composer.tsx` | The box and its send block. Enter sends, Shift+Enter opens a line; empty submit prints the kit's error plate, never the browser's validation bubble |

Strings are resolved on the server by `chat/strings.ts` and handed to the island as one prop, so the i18n table never reaches the client bundle.

## Structure

- `/` and `/es/` — the sheet: Arrival, Directory, Cast, About (composed by `Station.astro`), inside `Base.astro` (Fascia + main + Colophon).
- `/work/<slug>/` and `/es/work/<slug>/` — one Case Study in the trim measure.
- `/ask/` and `/es/ask/` — Ask, and the one route that is not the sheet. It runs in `ChatShell.astro` at full viewport with no Fascia and no Colophon, and is a hydrated React island. Reached from the Ask mark in the bottom corner of every other page, and from the Fascia; the way back is the first block in its own bar.
- Content lives in `src/content/projects/<locale>/<slug>.mdx`. Locale resolution and English fallback are centralised in `src/lib/projects.ts`; UI strings in `src/i18n/ui.ts`.

## Placeholder assets and open content

| Asset | Swap point | Where the file lands |
|---|---|---|
| Résumé PDF | `CONTACT.resumeIsPlaceholder` in `src/lib/contact.ts` | `public/andres-sanabria-cv.pdf` |
| Headshot | `CONTACT.portraitIsPlaceholder` in `src/lib/contact.ts` | `public/portrait.jpg` |
| Casts | `cast` frontmatter on each project | a YouTube URL, one per project |

Each swap removes the hatching and nothing else — a content change, never a design change.

The six case-study bodies (three projects x two locales) are owner-authored stubs marked `TO WRITE` / `POR ESCRIBIR`. The visual treatment they sit in is final; only the words are owed.

## Social cards

`public/og-en.png` and `public/og-es.png` are rendered from `scripts/og-card.html` — the source of truth — at a 1200x630 viewport, 2x scale (`?locale=es` for the Spanish card). The card is the arrival block at another magnification: same words (`showingLine` in `src/i18n/ui.ts`), same kit, same tokens. Regenerate both whenever the claim changes — a stale card is a wrong claim. Both rasters carry an embedded `tEXt` provenance chunk recording their source.
