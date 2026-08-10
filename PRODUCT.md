# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Astro 7.2 (existing scaffold, pnpm, Node >=22.12). Tailwind v4 with design tokens as CSS custom properties. Shadcn (`components.json`, style `base-sera`) for button primitives and Lucide for generic icons, both retokened onto the existing palette rather than left at their defaults; `@astrojs/react` is installed only to render those as unhydrated, build-time-only components — no client-side React ships. Deploy target: Vercel.

## Users

**Primary — the Hiring Manager.** A technical decision-maker at a company evaluating Andrés for an engineering role. Spends three to five minutes, wants to see how he thinks, and will open the linked source code on GitHub. Reads English. Frequently in a US timezone.

**Secondary — the Screener.** A non-technical recruiter who has already found Andrés elsewhere (usually LinkedIn) and is confirming he is worth advancing. Spends fifteen to thirty seconds and must be able to download and forward something internally. Served only by the first screen and the Resume.

Both audiences exist in two markets: remote English-speaking companies, and companies local to Bogotá, Colombia. The site ships in English and Spanish for this reason.

## Product Purpose

Present three shipped, publicly usable products as evidence that Andrés builds real software, and convert a convinced reader into an email. Success is a reply from a hiring manager. The site is not a blog, a résumé transcription, or a personal homepage.

## Positioning

Andrés builds **Agent-Native Products**: products with AI agents operating inside them rather than alongside them. Armin exposes its own domain to agents through an MCP server; Dolphin orchestrates coding agents (Codex, Claude Code) as its central generation engine. This is deliberately narrower than "AI engineer" — it excludes model training, research, and data science, which he does not do — and it is verifiable in public source, which the broader claim would not be.

## Operating Context

The Hiring Manager arrives from a job application, a LinkedIn profile, or a referral link. They are comparing several candidates in one sitting, usually on a laptop, often with the site in one tab and GitHub in another. They will leave the site to read source and may not come back, so anything that must be communicated has to survive that exit.

The Screener arrives needing an artifact to attach to an internal message. Failing to give them one ends the process silently.

## Capabilities and Constraints

- Four surfaces: Home, and one Case Study each for Dolphin, Armin, and Citadela. No other pages.
- Content is authored by Andrés, in a fixed Case Study shape: Problem, Decisions, Rejected Alternatives, Result.
- English and Spanish. Spanish is a genuine market requirement, not a nicety. A missing Spanish translation must fall back to English, never 404.
- One embedded Terminal Cast (Dolphin driving a coding agent), replayed from a local recording. The site never runs an agent or calls a model provider at request time.
- No blog, CMS, analytics dashboard, comment system, newsletter, or client-side search.
- Domain terminology is defined in `CONTEXT.md` and is binding.

## Brand Commitments

- The name on the site is **Andrés Sanabria**. GitHub handle is `andy-spike`. Contact email is `ansanabria12@gmail.com`.
- **Seniority is never stated, in either direction.** Andrés is early-career. The work is presented at face value and the reader draws their own conclusion. The site must never imply experience he does not have.
- Voice: plain, precise, technical, unembellished. No marketing superlatives, no growth-hacking copy, no invented metrics.

## Evidence on Hand

Real, verifiable, and public:

- **Dolphin** — `github.com/andy-spike/dolphin`. ~21k lines of TypeScript across a TUI, a Cloudflare Workers course-service, and a web app. Carries a rigorous domain model in `CONTEXT.md`. The Flagship.
- **Armin** — `github.com/andy-spike/armin`. Local-first spaced-repetition desktop app using FSRS. Ships an MCP server at `apps/desktop/src/mcp/` with tests. Released publicly as an AppImage, CI and release workflows in place.
- **Citadela** — `github.com/andy-spike/citadela`. Peer-to-peer tutoring marketplace for Bogotá universities. Next.js, Convex, Better Auth, payments and scheduling. Deployed and public.
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
4. **Narrow claims beat broad ones.** "Agent-Native Products" is defensible where "AI engineer" is not. Precision is the credibility strategy.
5. **Never imply seniority.** Silence about experience is the position. Any copy that reads as inflation is a defect, not a style choice.

## Accessibility & Inclusion

Bilingual content requires correct `lang` attributes per document and a language switcher that is reachable and announced, not a flag icon. Beyond that, no product-specific requirement was established; standard craft-floor accessibility applies.
