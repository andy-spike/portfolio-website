---
version: 1
slug: "src-pages-ask-astro"
primary_target: "src/pages/ask.astro"
related_targets: ["src/pages/es/ask.astro","src/layouts/ChatShell.astro","src/components/chat/Chat.tsx","src/components/chat/Conversation.tsx","src/components/chat/Message.tsx","src/components/chat/Composer.tsx","src/components/AskMark.astro"]
---

# Ask

The surface where the reader talks to the Agent: a chat application at its own route, in its own shell. Reached from the Ask mark in the bottom corner of every other page, and from the Fascia.

## Mode

Operate. The reader came to complete a task: get a grounded answer about Andrés. Usability, honest system state, and the conventions of a chat outrank expression. The brand lives in the press details inherited from the print-shop kit, not in new ornament.

## Direction contract

Surface roll, seed key `36013237`. Three structures were dealt (indices 3, 7, 5); the reader picked **The Bench** in the browser decision page. The visual world was already settled, so the roll governed composition only, never identity.

- **THESIS** — An answer is a printed page, not a message. Ask prints one Exchange at a time instead of stacking a chat column, so the Agent reads as shipped work rather than a widget bolted to the corner.
- **STRUCTURE** — The composer is the surface. The reader's question, once asked, is set at destination scale in the sheet's largest block, printed in the accent the Ask mark carries. The answer beneath it at reading measure. The Sources it stood on held in a sticky ink-barred window at the side, so grounding is furniture, not a footnote. Earlier questions wait in a numbered chip strip.
- **FIRST VIEWPORT** — The Ask division, the lead naming what the Agent answers from, and the box. Nothing else.
- **SIGNATURE** — The press, inherited. The one new moment is the nudge on the Ask mark: a paper plate that prints itself once and gets out of the way, returning on approach.
- **FINISH** — The Agent is not wired up. A live question gets an honest system state, never a fabricated answer, and the Sources window holds the hatch that marks a reserved position.

## Decisions

**Ask is an application, not a page.** The surface was first built inside the sheet — Fascia, main, Colophon, a composer in the flow of a document. The reader rejected it: the goal is to show that a fully functional chat can be built, and that a recruiter has access to the answers, and a text box parked in a page shows neither. Ask now runs in `ChatShell.astro` at full viewport with no Fascia and no Colophon, and is the only hydrated React island on the site. The way back to the sheet is the first block in its bar.

**Built on shadcn, worn as print.** The interface primitives come from shadcn on Radix, added as source. They are not left at their defaults and they are not rewritten class by class: a token bridge in `global.css` points shadcn's semantics at the print palette and pins the radius scale to 0, and `Button` and `Textarea` are rethemed at the source to compose `.btn` and `.composer-field`. An unmodified component therefore lands in this world already dressed. Recorded in DESIGN.md under "shadcn, and the chat".

**AI Elements was considered and declined.** The obvious registry for a chat is `elements.ai-sdk.dev`, but `prompt-input` alone pulls seven further registry components plus `ai`, `nanoid` and `use-stick-to-bottom`, and its components are typed against the AI SDK's `UIMessage`. For a chat with no endpoint that is a large dependency surface bought for styling that would have to be undone anyway. If the Agent is wired through the AI SDK later, this is worth revisiting.

**The bar names nothing.** It first carried a solid `ASK` plate beside the language and the new-chat mark. The reader cut it: the surface does not need to announce itself to someone who navigated to it, the tab title already does, and a label is not worth bar space on a surface whose whole job is the conversation under it. What remains is two blocks cut to one height.

**The reply is delayed on purpose.** A chat with no waiting state does not demonstrate a chat. The Agent looks busy for 700ms before returning the honest system state. The delay is an interface affordance, not a claim: nothing about the answer is invented, and the `NOT CONNECTED` plate is on every reply.


**Ask is a surface, not a widget.** The reader's request asked for a bubble that navigates to a chat route. `CONTEXT.md` previously said the Agent "lives in the Ask section on Home and nowhere else"; the reader answered that Ask becomes its own surface and Home loses its Ask section. Both binding docs were rewritten to match. The site is now five surfaces.

**One Exchange at a time.** No chat transcript column. The current question is the page's largest block; earlier ones collapse to a numbered chip strip that only appears once a second Exchange exists, because a strip of one is not a choice. This is what keeps an answer reading as a printed page.

**The composer is the whole arrival.** The surface first shipped with an authored sample Exchange printed above the box and four seed questions below it. The reader called the example noise: someone who came to test the Agent had to scroll past a fabricated conversation to reach the box. Both are gone. What lands is the division, one line naming what the Agent answers from, and the box — the bench stays empty until a question is asked. The seed questions went with the sample rather than being kept as a quick-start, because the placeholder already carries an example question and two sets of example questions on one small page is the noise again.

**The nudge prints once.** `ask.mark` ("Ask anything about me") appears on load, retires after a few seconds, and returns when the pointer approaches the dock. It is never a permanent floating label. Under `prefers-reduced-motion: reduce` it stays printed instead of animating.

**The nudge is the mark's accessible name.** The anchor carries `aria-labelledby="ask-nudge"`, so the label sits in the accessibility tree whether or not the plate is on screen.

**The mark is absent on Ask itself.** `Base.astro` mounts it on every page except `/ask`, where the Fascia nav item carries `aria-current="page"` instead.

**The unwired reply is a system state, never a fabricated answer.** A live question renders a `Not connected` plate and a hatched Sources window with count `00`. No placeholder prose pretends to be the Agent.

**Focus prints, it does not float.** The kit's focus keyline was a 3px ink outline held 4px off a 3px ink border, on blocks that also carry an offset shadow — three ink rules with ground between them, and a symmetric ring that could not agree with an asymmetric shadow. It read as a rendering fault. The keyline now lands hard against the border, and prints inside in the reverse material where the block is already a solid fill. The box also takes the press on focus, so the surface's one control answers when the reader reaches it. Recorded in DESIGN.md under Colour.

## Kit additions

`.ask-dock`, `.ask-mark`, `.ask-nudge`, `.hatched`, `.composer-field` and `.thinking-tick` were added to `global.css`, along with the shadcn token bridge. (`.seed-row`, `.bench-question`, `.source-entry` and the `.chip[aria-current]` fill went with the bench.) Depth stays border plus zero-blur offset; no radius, no gradient, no blur. The mark is the one round element in the build, permitted because rule 1 of the kit allows the speech bubble no radius — it is square, and the speech mark inside is drawn on Arrow's 14 grid so both marks come from one hand.

## Placeholder Assets

None on this surface. The Agent itself is the reserved position, and the hatch in the Sources window marks it.
