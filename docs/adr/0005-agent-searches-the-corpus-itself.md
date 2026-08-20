# The Agent searches the Corpus itself, as a tool

The route decided what to search for and handed the Agent the results. The Agent never got a say, so every attempt to handle a follow-up became a heuristic about how much of the transcript to glue into one search query — first the latest question alone, then a window of three (0004). Both are guesses at a subject, made by string handling, in front of a model that had already read the conversation.

The Agent now holds a `searchCorpus` tool and calls it. It writes its own query, may call it more than once, and may not call it at all. `stopWhen: stepCountIs(4)` bounds one question. This supersedes 0004 and removes `searchText` and `SEARCH_WINDOW` rather than tuning them.

## Considered Options

- **A wider window (0004).** Cheapest, and already shipped. Rejected on its ceiling rather than its cost: a window cannot search twice, so no window setting answers "how do these two differ?", and a window that carries a subject far enough to survive a chain of follow-ups also carries the previous subject into a topic switch.
- **Rewrite the question into a standalone one.** A model call turns the follow-up into a search query, then the route retrieves once as before. Costs the same extra round trip as tool calling and fixes reference resolution just as well, but it retrieves exactly once per question and always retrieves — so comparisons stay impossible and a rephrase still runs a search it does not need.
- **The Agent calls the search itself (chosen).** One extra round trip buys reference resolution, more than one search when a question needs it, and no search when it does not.

## Consequences

A question now costs a second model round trip, roughly 300–500ms before the first token. This was declined for query rewriting under 0004 and accepted here, because tool calling buys more for the same bill.

The Sources are no longer known before the answer starts. They are sent as one frame after the last token instead of before the first, and the transcript prints nothing in their place until then — mid-answer, "no Source supports this" is not yet true.

An Exchange can now stand on Sources it did not fetch. A rephrase is not a new claim, so the Agent is told not to search for one; the transcript then carries the previous Exchange's Sources forward and labels them as carried, rather than printing the reserved plate and calling a good answer a defect.

The Agent could search and then answer past what it found. The system prompt is what stands between the reader and that, which is a weaker guarantee than a route that could only pass on what it retrieved. It is the cost of letting the Agent hold the tool.

The reply must be prose. The transcript prints plain text, so the prompt forbids markdown; a model that emits a bullet list puts asterisks on the page.
