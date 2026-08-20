# The Agent runs on OpenRouter with client-carried history

The Agent's model runs through OpenRouter (DeepSeek V4 Flash), with reasoning enabled at low effort and reasoning tokens never surfaced. Each request carries the full session transcript from the client; the server stays stateless and embeds the reader's recent questions for retrieval (see 0004). The Corpus is embedded once, ahead of request time, with `text-embedding-3-small` (1536 dims).

## Considered Options

- **OpenRouter gateway vs direct provider.** OpenRouter carries both the chat model and the embedding model behind one key, and lets the model be swapped by an env var without a code change. The cost is a second party in the request path.
- **Client-carried history vs server-side session.** The transcript already lives in the client's memory, so sending it with each request keeps the server stateless — no session store, no cleanup. A server session would add state for no benefit at this scale.
- **Reasoning on at low effort vs off.** Reasoning stays on deliberately: the answer must be right and cited, not fast. The effort is low because the task is retrieval-plus-summary, not problem-solving; the tokens themselves are never shown to the reader.
- **`text-embedding-3-small` vs larger or open-weight models.** Cross-lingual leaders (Gemini Embedding, bge-m3) only beat it for non-Latin scripts and large corpora. At a ~40-chunk English corpus with Spanish queries, the small model retrieves the right chunk every time and is natively supported by the OpenRouter AI SDK provider.

## Consequences

The server function is stateless: every answer is reproducible from the request alone. Swapping the chat model is an env var change; swapping the embedding model is a migration and reseed because the dimension is baked into the schema.
