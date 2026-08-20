# Portfolio Website

A personal website that presents Andy Sanabria's shipped work to people who are deciding whether to hire him.

## Initial scope boundary

The site has no blog, no CMS, no analytics dashboard, no comment system, no newsletter, and no client-side search. It presents three Portfolio Projects and one live Agent. The Agent runs on the site, accepts visitor input, and calls a model provider at request time, grounded in the Corpus.

## Language

**Hiring Manager**
The reader the site is optimized for: a technical decision-maker who spends three to five minutes, wants to see how Andy thinks, and will open the linked source code. Every page below the first screen is written for this reader.
_Avoid_: the user, the visitor, the audience

**Screener**
The secondary reader: a non-technical recruiter who spends fifteen to thirty seconds confirming a candidate found elsewhere, and who must be able to forward something internally. Only the first screen of Home and the Resume are written for this reader.
_Avoid_: recruiter, HR, the user

**AI Product Engineer**
A software engineer who builds web software products with AI agents integrated into them. This is the role the site claims for Andrés and the claim it makes about his work.
_Avoid_: AI engineer, AI developer, AI app builder

**the Agent**
The site's single live agent that answers the reader's questions about Andrés. It answers only from the Corpus, cites the Source it used, and refuses when no Source supports an answer. It lives on Ask, and nowhere else.
_Avoid_: chatbot, bot, assistant, concierge

**Ask**
The surface where the reader talks to the Agent, at its own route. It holds the session's Exchanges as one scrolling transcript and lists the Sources each Exchange stood on. The Agent lives here and nowhere else.
_Avoid_: chat page, chat widget, Q&A box, contact form

**Ask mark**
The fixed block in the bottom corner of every page except Ask, carrying the speech mark and a nudge that invites the reader to Ask. It is the only way in besides the Fascia link.
_Avoid_: bubble, floating button, launcher, FAB

**Exchange**
One question from the reader and the Agent's reply to it, printed together on Ask. Ask shows all of a session's Exchanges in one scrolling transcript; the Agent may use earlier Exchanges in the session as context when it answers.
_Avoid_: message, turn, thread, conversation item

**Corpus**
The versioned set of markdown files in the repo that hold the facts about Andrés — bio, projects, skills, and experience. It is the single source of truth the Agent answers from, and it is embedded into the retrieval store ahead of request time. It is authored in English; the Agent answers in the page's language.
_Avoid_: knowledge base, dataset, content, data dump

**Source**
A passage from the Corpus that the Agent retrieved and cites to support an answer. An answer without a Source is a defect, never a style choice.
_Avoid_: citation, reference, excerpt, snippet

**Portfolio Project**
One of the three shipped, publicly usable products the site presents: Dolphin, Armin, and Ask. A candidate for inclusion must be something a stranger can run or use today, with readable public source. Shortened to "Project" in UI copy (nav, headings) where space is tight; the full term still governs prose.
_Avoid_: work, portfolio piece, side project

**Flagship**
The Portfolio Project presented first and given the most space. Dolphin holds this position because it orchestrates coding agents as its central engine, so it demonstrates the claim rather than sitting adjacent to it.
_Avoid_: main project, featured project, hero project

**Case Study**
The dedicated page for one Portfolio Project. It follows a fixed shape: the Problem, the Decisions taken, the Rejected Alternatives for each, and the Result. Andy writes every Case Study himself.
_Avoid_: project page, write-up, deep dive, post

**Rejected Alternative**
The option that was considered and not taken for a given Decision, together with the reason. This is the load-bearing element of a Case Study: judgment is only visible in what was turned down, so a Decision recorded without its Rejected Alternative proves nothing.
_Avoid_: tradeoff, con, downside, alternative

**Terminal Cast**
One short YouTube video per Portfolio Project, embedded in the Casts section, showing that project running. The reader steps between the three with the section's arrow navigation.
_Avoid_: demo, animation, screencast, live demo

**Primary Action**
Opening Andy's GitHub — the solid-ink block on the action row everywhere it appears, hero and colophon alike. The Resume and email travel beside it as secondary chips, for the Screener who needs to forward something and the reader who wants to reply directly. Every element on every page either serves this or is cut.
_Avoid_: CTA, conversion, contact

**Resume**
The single-file document a Screener can download and forward internally. It is required by the Primary Action's fallback path and is not optional. Labelled "CV" in the UI, since that is the term a Screener searches for.
_Avoid_: PDF, download

**Accent**
The one saturated color in an otherwise near-monochrome palette. It is reserved for elements the reader can act on — links, focus rings, the Primary Action. Using it decoratively destroys its meaning.
_Avoid_: brand color, primary color, highlight

**Placeholder Asset**
An asset the site's design depends on that does not exist yet: the custom domain, the Resume, and the headshot. Each has a defined slot so that supplying the real asset is a content change, never a design change.
_Avoid_: TODO, stub, dummy, mock

## Positions not taken

**Seniority is never stated.** The site makes no claim about years of experience in either direction. Andy is early-career; the Portfolio Projects are presented at face value and the Hiring Manager draws their own conclusion. The site must never imply seniority he does not have.

**The claim is AI product engineering, not machine learning.** The site does not present model training, research, or data science work, because there is none.
