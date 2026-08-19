# The site runs a live RAG Agent at request time

The site was static: it ran no agent, accepted no visitor input, and called no model provider at request time. We added the Agent, a live feature in the Ask section on Home that answers questions grounded in the Corpus. This reverses the earlier stance because open-ended, source-cited answers cannot be produced at build time or on the client alone.

## Considered Options

- **Build-time / precomputed Q&A.** Cheap and static, but cannot answer an arbitrary question, so it proves nothing about retrieval.
- **Client-side retrieval without a model.** Returns matching passages but no generated answer.
- **Live RAG (chosen).** Proves end-to-end retrieval and generation, at the cost of a model call per request.

## Consequences

The site now needs a server function, a model API key, client-side JS, and a cost ceiling (rate limit plus a monthly budget flag).
