# Portfolio Website

A personal website that presents Andy Sanabria's shipped work to people who are deciding whether to hire him.

## Initial scope boundary

The site has no blog, no CMS, no analytics dashboard, no comment system, no newsletter, and no client-side search. It presents three Portfolio Projects and nothing else. It does not run a live agent, accept visitor input, or call any model provider at request time.

## Language

**Hiring Manager**
The reader the site is optimized for: a technical decision-maker who spends three to five minutes, wants to see how Andy thinks, and will open the linked source code. Every page below the first screen is written for this reader.
_Avoid_: the user, the visitor, the audience

**Screener**
The secondary reader: a non-technical recruiter who spends fifteen to thirty seconds confirming a candidate found elsewhere, and who must be able to forward something internally. Only the first screen of Home and the Resume are written for this reader.
_Avoid_: recruiter, HR, the user

**Agent-Native Product**
A product that has AI agents operating inside it rather than alongside it — exposing itself to agents, or orchestrating agents to do its central work. This is the claim the site makes about Andy's skill, and it is narrower and more verifiable than "AI engineer".
_Avoid_: AI app, AI-powered product, ML project, AI integration

**Portfolio Project**
One of the three shipped, publicly usable products the site presents: Dolphin, Armin, and Citadela. A candidate for inclusion must be something a stranger can run or use today, with readable public source.
_Avoid_: project, work, portfolio piece, side project

**Flagship**
The Portfolio Project presented first and given the most space. Dolphin holds this position because it is itself an Agent-Native Product, so it demonstrates the claim rather than sitting adjacent to it.
_Avoid_: main project, featured project, hero project

**Case Study**
The dedicated page for one Portfolio Project. It follows a fixed shape: the Problem, the Decisions taken, the Rejected Alternatives for each, and the Result. Andy writes every Case Study himself.
_Avoid_: project page, write-up, deep dive, post

**Rejected Alternative**
The option that was considered and not taken for a given Decision, together with the reason. This is the load-bearing element of a Case Study: judgment is only visible in what was turned down, so a Decision recorded without its Rejected Alternative proves nothing.
_Avoid_: tradeoff, con, downside, alternative

**Terminal Cast**
The single embedded artifact on the site: a recorded terminal session showing Dolphin driving a coding agent to generate a course. It replays from a local recording, so it demonstrates the Agent-Native Product claim without running anything at request time.
_Avoid_: demo, video, animation, screencast, live demo

**Primary Action**
Sending Andy an email. Every element on every page either serves this or is cut.
_Avoid_: CTA, conversion, contact

**Resume**
The single-file document a Screener can download and forward internally. It is required by the Primary Action's fallback path and is not optional.
_Avoid_: CV, PDF, download

**Accent**
The one saturated color in an otherwise near-monochrome palette. It is reserved for elements the reader can act on — links, focus rings, the Primary Action. Using it decoratively destroys its meaning.
_Avoid_: brand color, primary color, highlight

**Placeholder Asset**
An asset the site's design depends on that does not exist yet: the custom domain, the Resume, and the headshot. Each has a defined slot so that supplying the real asset is a content change, never a design change.
_Avoid_: TODO, stub, dummy, mock

## Positions not taken

**Seniority is never stated.** The site makes no claim about years of experience in either direction. Andy is early-career; the Portfolio Projects are presented at face value and the Hiring Manager draws their own conclusion. The site must never imply seniority he does not have.

**The claim is Agent-Native Product engineering, not machine learning.** The site does not present model training, research, or data science work, because there is none.
