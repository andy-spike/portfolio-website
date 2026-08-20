# Armin

## What Armin is

Armin is a local-first spaced-repetition desktop app. A card can declare its prerequisites, so a review is only scheduled once the material it depends on has been learned. Armin also ships an MCP server that exposes its decks to AI agents.

## The problem Armin solves

Flashcard apps treat every card as equal. Real learning has dependencies: you cannot review a card about dependency injection before you know what a package manager is. Armin lets a card carry its prerequisites and schedules each card only when its prerequisites are ready, so review order follows the structure of the subject.

## How Armin is built

Armin is an Electron app with a React interface and a local SQLite store, all in TypeScript. Scheduling runs on FSRS through ts-fsrs. The MCP server lives inside the app and speaks to agents over a local interface, so the data never leaves the machine.

## Decisions and the alternatives rejected

**Decision: a local MCP server with a narrow surface.** Armin exposes its decks to agents through an MCP server that runs locally. The alternative was a hosted API or syncing the data to the cloud. That was rejected because the point of the app is that data never leaves the machine. The surface is deliberately narrow: agents can read decks and schedule reviews, not reach every internal table.

**Decision: FSRS over SM-2.** Scheduling runs on the FSRS algorithm. The alternative was SM-2, the algorithm Anki uses, which treats every card the same no matter how the learner has been answering. FSRS tunes each card to the learner's actual history, which fits an app built around the structure of learning.

## What state Armin is in

Armin is released as v0.5.0. It ships packaged installers for Linux, macOS, and Windows, and the source is public on GitHub.