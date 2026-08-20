# Ask

## What Ask is

Ask is the agent on this site that answers questions about Andrés. A visitor asks something in English or Spanish and the agent replies with an answer and the Source it used. It answers only from the Corpus — the facts in this folder — and it says plainly when nothing in the Corpus supports an answer. It never invents one.

## The problem Ask solves

A hiring manager reading the site has questions the pages do not answer. A free chatbot would answer them by guessing, and a guess that sounds confident is worse than a page that stays silent. Ask answers from a fixed, versioned set of facts and shows its source, so an answer can be checked and silence is honest.

## How Ask is built

Ask is a React island on an Astro site. The conversation posts to a route that runs the Vercel AI SDK against a model provider. Answers are grounded in retrieval: the Corpus is embedded into a Postgres pgvector store ahead of time, the reader's question is embedded the same way, and the search returns the passages an answer can stand on. A rate limit and a monthly budget flag keep the cost bounded.

## Decisions and the alternatives rejected

**Decision: refusal with citation over free chat.** The agent refuses an answer when no Source supports it instead of free-chatting from general knowledge. The rejected alternative was an open conversational bot that answered everything from the model's memory — it would sound confident, contradict the site, and invent facts about Andrés. An answer without a Source is treated as a defect, not a style choice.

**Decision: a fixed corpus over live web access.** The facts live in a versioned corpus in the repository and are embedded ahead of request time. The rejected alternative was letting the agent browse the live web for answers. It would be current, but it would also be unrepeatable: a reader could get a different answer tomorrow for the same question, and nothing about Andrés would be verifiable or controlled.

## What state Ask is in

Ask is live on this site at the /ask route, in English and Spanish. It is the agent answering these questions.