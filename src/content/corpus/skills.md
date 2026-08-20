# Skills

## Languages and runtimes

TypeScript is the main language across all three projects. The projects also use SQL for storage, shell scripting for tooling, and git for version control. Validation libraries like Zod keep the data boundaries checked.

## Frameworks and platforms

The projects cover the full stack: React for the interfaces, Astro for this site, Electron for the desktop app, and Hono for the course service. Vercel hosts this site. Postgres stores the data, from the retrieval store behind Ask to the application data.

## Agent and AI work

The agent work is real and inside products. Dolphin runs a custom agent that generates course material from a source course. Armin ships an MCP server that exposes its decks to agents, so an agent can read and schedule reviews. Ask is an agent itself: it answers questions about Andrés from a fixed corpus and cites the passages it used. These are integrations, not research — no model training, no fine-tuning.

## Infrastructure and delivery

GitHub Actions runs the CI in the repos. Vercel deploys this site. The projects are organized as monorepos.