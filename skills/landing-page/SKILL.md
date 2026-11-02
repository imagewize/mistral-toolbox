---
name: landing-page
description: Design or rewrite a high-converting landing page — one offer, one audience, one primary action. Covers discovery questions, page structure, layout types, conversion strategies, copywriting templates, SEO/AEO and pitfalls. Includes a WordPress block-pattern handoff section so HTML/CSS output converts cleanly to block patterns.
user-invocable: true
license: MIT
metadata:
  version: "1.0.0"
  source: "github.com/MengTo/Skills agent-skills/web-design/landing-page @ ef5f85130d083d33e08cb19f6ee23cdde2d406ab (MIT, LICENSE copied alongside)"
---

# Landing Page (High‑Conversion) — Web Design Skill

A landing page is not a homepage.
A homepage serves multiple intents.
A landing page wins one intent: **one offer → one audience → one primary action**.

## Before you design/write
Gather (ask if missing):

### 1) Page purpose
- What is the ONE primary action? (trial, demo, buy, waitlist, download)
- What’s the offer? (exactly what do they get?)
- What counts as conversion? (click, signup, purchase)

### 2) Audience + context
- Who is the ICP?
- What problem are they trying to solve?
- Top 3 objections (why they don’t convert today)
- Traffic source: ads / search / social / email
- What do visitors already know when they land?

### 3) Proof + assets
- Any proof points: logos, testimonials, numbers, case studies
- Screenshots, demo video, product GIFs
- Guarantees / refund / cancellation terms

### 4) Constraints
- Brand voice: casual vs professional
- Design direction: minimal editorial vs playful 3D vs glass UI
- Mobile priority?

---

## Core structure (what it should include)

### Above the fold (must)
1) **Headline** (outcome + audience)
2) **Subheadline** (clarifies “how” + adds specificity)
3) **Primary CTA** (clear verb + what they get)
4) **One proof signal** (logo strip / stat / short testimonial)
5) **Hero visual** (product screenshot/video) *or* a strong illustration

### Mid page (argument)
6) **Problem → solution** (1 section)
7) **Benefits** (3–5, outcome-driven)
8) **How it works** (3 steps)
9) **Social proof** (testimonials/case study)

### Bottom (objection handling)
10) **FAQ** (6–12 Q/A)
11) **Risk reversal** (trial, cancel anytime, guarantee)
12) **Final CTA** (same as top)

---

## Layout types (pick one)

### A) Classic hero + sections (most common)
Best when:
- product is understandable with a hero screenshot

### B) Long-form story (sales page)
Best when:
- you need to educate + overcome skepticism

### C) Minimal conversion page
Best when:
- high-intent traffic (email → known users)
- short offer (download, waitlist)

### D) Comparison landing page
Best when:
- search intent includes alternatives (“X vs Y”, “best for…”)—usually paired with SEO pages

---

## High‑conversion strategies (practical)

### 1) Match message to source
If traffic is from ads:
- mirror the ad headline in the hero
- use the same promise and visual tone

### 2) Make the next step obvious
- one primary CTA
- avoid multiple competing CTAs above the fold

### 3) Write benefit-first
- Features: what it does
- Benefits: what that means for them

### 4) Use specificity
- ❌ “Save time and streamline”
- ✅ “Cut your weekly reporting from 4 hours to 15 minutes”

### 5) Reduce risk
Pick at least one:
- free trial
- free plan
- no credit card
- cancel anytime
- money-back guarantee

### 6) Objection handling is a section, not a footer
- add FAQ earlier if it’s a high-friction offer
- put proof right next to the claim it supports

---

## Copywriting templates

### Headline formulas
- “{Outcome} without {pain}”
- “The {category} for {audience}”
- “Ship {result} in {time}”

### Subheadline rules
- 1–2 sentences
- clarify what it is + who it’s for

### CTA rules
- Verb + what they get
- Avoid weak CTAs: “Learn more”, “Submit”

Examples:
- “Start free trial”
- “Book a demo”
- “Get the checklist”

### Benefit bullets
Format:
- **Benefit** — proof/detail

Example:
- **Faster iteration** — generate 3 layout variants in one click.

---

## Section-by-section workflow (designer-friendly)
Work in this order:
1) Hero
2) Benefits
3) How it works
4) Proof
5) FAQ
6) Final CTA

Rule: don’t rebuild the whole page each time.
Iterate section-by-section to keep control.

---

## SEO + AEO checklist (when relevant)

### When landing pages should NOT be indexed
- ad-only campaigns
- highly time-bound offers

Use:
- `noindex` (or keep it behind a non-indexed path)

### When they SHOULD be indexed
- evergreen offers
- search intent matches the promise

Add:
- clear title + meta
- internal links from homepage/feature pages
- FAQ in plain Q/A for AEO

Optional:
- FAQ schema (if appropriate)

---

## Common pitfalls
- Too many CTAs above the fold
- Vague value prop (“streamline”, “optimize”)
- Big feature list with no outcomes
- Proof hidden at the bottom
- Mobile layout breaks readability
- No clear next step

---

## Output format (when generating a landing page)
Return:
1) **Page outline** (sections + order)
2) **Hero copy** (headline, subheadline, CTA, proof line)
3) **Benefits section** (3–5 bullets)
4) **How it works** (3 steps)
5) **FAQ** (6–12 Q/A)
6) **SEO/AEO** (indexing recommendation + title/meta if indexed)
7) **Layout recommendation** (A/B/C/D + why)

---

## Quick questions (if user says “make a landing page”)
- What’s the ONE primary CTA?
- Who is the ICP and what’s the main pain?
- Any proof (numbers/testimonials/logos)?
- What’s the offer and risk reversal?
- Where is traffic coming from?

---

## WordPress block-pattern handoff

When the deliverable is HTML/CSS for a WordPress block theme (FSE), follow these
conventions so the design converts to valid block patterns without renaming fixes:

- **Design tokens as preset variables.** Define colors, spacing and font sizes as CSS
  custom properties named after theme.json presets — `--wp--preset--color--<slug>`,
  `--wp--preset--spacing--<slug>`, `--wp--preset--font-size--<slug>` — and reference them
  with `var()` using the exact same name, dashes included. Never drop a dash.
- **No preset border radius.** WordPress exposes no `--wp--preset--border-radius--*`
  namespace; use a theme-prefixed custom property (e.g. `--<theme>--radius--md`) or a
  hardcoded value.
- **Sectioned, block-composable markup.** Deliver one self-contained HTML file per page
  using semantic landmarks (`header`, `main`, `section`, `footer`). Mark every section
  with an HTML comment (`<!-- ===== Section name ===== -->`) and build each `<section>` so
  it can be rebuilt by stacking or nesting core blocks (Group, Columns, Cover, Heading,
  Paragraph, Buttons, Image). If a section cannot be block-composed, redesign it.
- **No hardcoded image URLs in CSS.** Never hardcode `url()` values for background images;
  flag them in handoff notes for Cover block implementation instead.
- **Buttons are inner blocks.** Note buttons as inner blocks in handoff notes rather than
  hardcoding them, so editors can change them in the Site Editor.
- **i18n-ready copy.** Keep on-screen strings translatable and note in the handoff where
  translation functions apply in the pattern PHP.
