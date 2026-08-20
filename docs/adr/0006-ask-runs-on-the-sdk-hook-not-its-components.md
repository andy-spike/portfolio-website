# Ask runs on the AI SDK's chat hook, and on its own components

Ask was built by hand: a four-frame wire format in `ask-stream.ts`, a list of turns in React state, and an `AbortController` held beside it. That was defensible while the Agent did one thing per request. It stopped being defensible when the Agent got a tool (0005): the private wire format carried text and nothing else, so the surface could not say what the Agent was doing, and the Sources had to travel in a `{ list, searched }` frame invented for the purpose — a worse copy of something the SDK already models as tool parts.

Ask now runs on `useChat` from `@ai-sdk/react`, over the SDK's own UI message stream. `ask-stream.ts` and its tests are deleted. The Sources are read off the reply's `tool-searchCorpus` parts, and a reply with no such part is a reply that needed no Source. The components that draw the transcript stay ours.

## Considered Options

- **Keep the hand-written stream.** No dependency, and it worked. Rejected because it is a private protocol reimplementing a public one, and because it cannot carry the tool call — the reader waits through an embedding call, a search and two model round trips with no signal, on the one surface whose contract asks for honest system state.
- **Adopt the hook and AI Elements.** AI Elements is the SDK's component registry, and `components.json` is already here, so it would install. Rejected on the design: its components draw the standard messaging application, and Ask is deliberately not one — `Message.tsx` prints slips, with no bubble and no radius. Its components would be installed and then rewritten. The three components here already carry the parts worth keeping: stick-to-bottom that releases when the reader scrolls up, a field that grows without a script, the keyboard contract, and a waiting mark that stops under reduced motion.
- **Adopt the hook, keep the components (chosen).** The hook is the wheel. The components are the product — Ask is itself a Portfolio Project, so a Hiring Manager judges this surface directly, and looking like every other chat is a cost with no return.

## Consequences

`@ai-sdk/react` joins the dependencies, and with it `swr`, `throttleit` and `@ai-sdk/mcp`.

The request the route reads is deliberately unchanged: `prepareSendMessagesRequest` maps the SDK's messages back to `{ locale, messages: [{ role, text }] }`. The route's validation is where the reader stops being trusted, and moving it to fit a library would have been the most expensive part of this change for no gain. It also keeps the Agent's own tool results out of what the client can send back — a transcript the browser can edit is not a record of what the Corpus said.

The reply is a list of parts now, not a string, so the transcript reads text and searches out of the same message. `transcript.ts` holds those readers, and they are pure, so the store and the view agree on what a reply stood on without either knowing about the other.

`useChat` has no reply to render until the stream starts. The transcript prints a stand-in block for that gap — without it the reader watches their own question alone for as long as the Agent takes to choose a search, which measured at three and a half seconds.

Errors arrive as the response body inside `Error.message`. The route therefore returns a `code` beside the message, so telling a rate-limited reader to wait is not a test against English prose.

The Corpus passages now travel to the browser as part of the reply, and into its stored copy: about 6KB per Exchange, so roughly 120KB at the stored-turn cap. That is far inside the browser's budget, and it is more than a transcript of prose used to cost.
