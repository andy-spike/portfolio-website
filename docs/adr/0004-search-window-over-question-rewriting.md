# Retrieval searches on a window of the reader's questions

**Superseded by 0005.** The window shipped and worked, and its limits were the ones recorded below. The Agent now searches for itself.

The Agent embedded the latest question alone, so a follow-up retrieved nothing: "And how does it work?" names no subject, and a search with no subject clears no similarity floor. The Agent then refused a question the reader had every reason to think was clear. Retrieval now embeds the reader's last three questions together, in the order they were asked.

The Agent could always read the earlier Exchanges — the whole transcript travels with every request. Only the search was blind. This closes that gap and nothing else: the server is still stateless, and no second model call enters the request path.

## Considered Options

- **Rewrite the question into a standalone one.** A small model call turns "And how does it work?" into "How does Dolphin work?" before the search. The Sources stay exactly on topic, which matters on a surface where a Source is the evidence. Rejected for its cost: a second model call on nearly every request, roughly 300–500ms before the reader sees a first token, plus a prompt to maintain and a rewrite that can itself go wrong.
- **Retry with context only when the first search finds nothing.** Costs nothing on a question that already works. Rejected because the failure it catches is not the only one: a follow-up that retrieves a single weak, wrong passage never triggers the retry, and that is the case that produces a confident answer on the wrong Source.
- **A window of the reader's recent questions (chosen).** No extra call, no extra latency, and it carries a subject through a chain of follow-ups rather than a single hop.

## Consequences

The window drifts. A question that changes the subject is searched for beside the one before it, so the Sources under an answer can name a passage the answer never used — the Agent is told to answer from the Sources, not to use all of them. Three questions is the bound on how far that reaches back.

`SEARCH_WINDOW` is the knob. Widening it carries a subject further and drifts more; narrowing it does the reverse. If drift starts showing in the Sources line, the upgrade path is question rewriting, which was rejected here on cost rather than on merit.
