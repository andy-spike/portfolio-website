# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Astro 7.2 (existing scaffold, pnpm, Node >=24). Tailwind v4 with design tokens as CSS custom properties. shadcn (`components.json`, style `new-york`, Radix primitives) supplies the interface primitives and Lucide the generic icons, both retokened onto the print palette rather than left at their defaults — a bridge in `global.css` points shadcn's semantic tokens at the site's own, and sets every radius to 0. `@astrojs/react` renders most of these unhydrated at build time; the exception is Ask, which is a hydrated React island because it is an application. Deploy target: Vercel.

## Users

**Primary — the Hiring Manager.** A technical decision-maker at a company evaluating Andrés for an engineering role. Spends three to five minutes, wants to see how he thinks, and will open the linked source code on GitHub. Reads English. Frequently in a US timezone.

**Secondary — the Screener.** A non-technical recruiter who has already found Andrés elsewhere (usually LinkedIn) and is confirming he is worth advancing. Spends fifteen to thirty seconds and must be able to download and forward something internally. Served only by the first screen and the Resume.

Both audiences exist in two markets: remote English-speaking companies, and companies local to Bogotá, Colombia. The site ships in English and Spanish for this reason.

## Product Purpose

Present three shipped, publicly usable products as evidence that Andrés builds real software, demonstrate the claim live through the Agent on Home, and convert a convinced reader into an email. Success is a reply from a hiring manager. The site is not a blog, a résumé transcription, or a personal homepage.

## Positioning

Andrés is an **AI Product Engineer**: he builds web software products with AI agents integrated into them. Armin exposes its own domain to agents through an MCP server; Dolphin orchestrates coding agents (Codex, Claude Code) as its central generation engine. The claim excludes model training, research, and data science, which he does not do — and it is verifiable in public source, which a broader "AI engineer" claim would not be.

## Operating Context

The Hiring Manager arrives from a job application, a LinkedIn profile, or a referral link. They are comparing several candidates in one sitting, usually on a laptop, often with the site in one tab and GitHub in another. They will leave the site to read source and may not come back, so anything that must be communicated has to survive that exit.

The Screener arrives needing an artifact to attach to an internal message. Failing to give them one ends the process silently.

## Capabilities and Constraints

- Five surfaces: Home, one Case Study each for Dolphin, Armin, and Ask, and the Ask surface itself. No other pages.
- Content is authored by Andrés, in a fixed Case Study shape: Problem, Decisions, Rejected Alternatives, Result.
- English and Spanish. Spanish is a genuine market requirement, not a nicety. A missing Spanish translation must fall back to English, never 404.
- One embedded Terminal Cast (Dolphin driving a coding agent), replayed from a local recording.
- One live Agent, on Ask and nowhere else. Ask is its own surface and its own application: a chat the reader can actually use, in its own shell, reached from the Ask mark in the bottom corner of every other page and from the Fascia. The Agent answers only from the Corpus, cites its Source, and refuses when no Source supports an answer. It runs on Vercel AI SDK and Postgres pgvector, behind a rate limit and a monthly budget flag. Until it is connected, the interface is complete and every reply is the honest system state — no answer is invented.
- No blog, CMS, analytics dashboard, comment system, newsletter, or client-side search.
- Domain terminology is defined in `CONTEXT.md` and is binding.

## Brand Commitments

- The name on the site is **Andrés Sanabria**. GitHub handle is `andy-spike`. Contact email is `ansanabria12@gmail.com`.
- **Seniority is never stated, in either direction.** Andrés is early-career. The work is presented at face value and the reader draws their own conclusion. The site must never imply experience he does not have.
- Voice: plain, precise, technical, unembellished. No marketing superlatives, no growth-hacking copy, no invented metrics.

## Evidence on Hand

Real, verifiable, and public:

- **Dolphin** — `github.com/andy-spike/dolphin`. ~21k lines of TypeScript across a web app and a Cloudflare Workers course-service. Carries a rigorous domain model in `CONTEXT.md`. The Flagship.
- **Armin** — `github.com/andy-spike/armin`. Local-first spaced-repetition desktop app using FSRS. Ships an MCP server at `apps/desktop/src/mcp/` with tests. Released publicly as an AppImage, CI and release workflows in place.
- **Ask** — the agent on this site, live at `/ask`, answering questions about Andrés from a fixed Corpus and citing the Source it used. Source in this repository.
- LinkedIn profile exists.

Does not exist yet and **must not be fabricated** — these are Placeholder Assets with reserved slots:

- Custom domain
- Resume (single-file, downloadable, forwardable)
- Headshot

Does not exist at all and must never be invented: testimonials, client logos, press mentions, user counts, revenue figures, benchmark results, employment history, or awards.

Known stale fact to repair: `armin/package.json` still points `homepage`, `repository`, and `bugs` at `github.com/ansanabria/armin`, which is not the live URL.

## Product Principles

1. **Evidence over assertion.** Every claim on the site resolves to something the reader can open, run, or download. A claim with no artifact behind it gets cut.
2. **The Rejected Alternative is the product.** Judgment is only visible in what was turned down. A Decision recorded without the option it beat proves nothing and does not ship.
3. **Serve the exit.** The reader will leave for GitHub mid-visit. Anything essential must land before that, and the return path must be obvious.
4. **Narrow claims beat broad ones.** "AI Product Engineer" is defensible where "AI engineer" is not. Precision is the credibility strategy.
5. **Never imply seniority.** Silence about experience is the position. Any copy that reads as inflation is a defect, not a style choice.

## Accessibility & Inclusion

Bilingual content requires correct `lang` attributes per document and a language switcher that is reachable and announced, not a flag icon. The Agent answers in the page's language, and its conversation is keyboard-reachable and announced to screen readers. Beyond that, no product-specific requirement was established; standard craft-floor accessibility applies.
