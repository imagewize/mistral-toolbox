---
name: design-first-ui-prompting
description: Turn fuzzy ideas into a tight, design-first spec for consistent UI generation — a copy/paste prompt skeleton (goal, format, layout, type system, color, copy, constraints, negative prompt) plus rules for locking one system, iterating with single-variable variants, and keeping a local reference pack. Includes a WordPress block-pattern handoff section.
user-invocable: true
license: MIT
metadata:
  version: "1.0.0"
  source: "github.com/MengTo/Skills agent-skills/ui/design-first-ui-prompting @ ef5f85130d083d33e08cb19f6ee23cdde2d406ab (MIT, LICENSE copied alongside)"
---

# Design-First UI Prompting Skill

This skill is for **design-first prompting**: turn fuzzy ideas into a tight spec that produces consistent UI.

## Core principle
**Prompt like a design system, not a wish.**

## Prompt Structure (copy/paste)
Use this skeleton, then fill the blanks.

```text
GOAL
- What are we making? (e.g., landing page hero / onboarding / dashboard / carousel slide)
- Who is it for? (persona)
- What’s the success criteria? (clarity, conversion, vibe)

FORMAT
- Size/aspect: (e.g., 1080x1350)
- Safe margins: (e.g., 90px)

LAYOUT (wireframe in words)
- Grid: (e.g., Swiss 6-col)
- Placement: (e.g., type-left / image-right)
- Hierarchy: H1 → subhead → body → CTA

TYPE SYSTEM
- Font vibe: (e.g., Söhne / Neue Haas / SF Pro)
- Weights: (H1 700, body 400)
- Leading: (tight for H1, readable for body)
- Tracking: (micro labels wider)

COLOR + MATERIAL
- Background: (hex or description)
- Text: (white/ivory/charcoal)
- One accent only: (cyan/lime/purple)
- Texture: (subtle grain, no plastic HDR)

IMAGERY / UI STYLE
- UI style: (minimal / glass / editorial / playful 3D)
- If photo: lighting + crop + texture rules
- If 3D: materials + lighting + softness

COPY (render EXACTLY)
- Line 1:
- Line 2:
- ...

CONSTRAINTS (change 1–2 things only)
- FONT: ___
- STYLE: ___
- MODE: ___

NEGATIVE PROMPT
- No logos, no watermarks
- No extra text beyond provided lines
- No gibberish typography
```

## Rules that improve consistency

### 1) Lock one “system”, then iterate with variants
- First output: nail **layout + hierarchy + copy**.
- Variants: change **ONE variable** at a time:
  - angle / crop
  - accent color
  - card arrangement
  - background tone

### 2) Treat typography as fragile
If the model keeps misspelling:
- Use **2-pass workflow**:
  1) Generate without text (reserve a clean text-safe area)
  2) Typeset in Figma

### 3) Use “constraints cards”
When you want the model to obey a style:
- Add a small “Constraints” panel with explicit values.
- It anchors the output like a mini style guide.

Example:
```text
Constraints
FONT  CANELA
STYLE  MINIMAL
MODE  DARK
```

### 4) Keep a local reference pack
Don’t ask the model to “remember” taste.
- Save references into a gitignored local reference folder, such as `refs/...`
- Point prompts to the reference style

## Fast iteration checklist (what to tweak)
- Spacing: margins, leading, baseline rhythm
- Contrast: background vs text
- Hierarchy: one hero line, one support line
- One accent only (don’t rainbow)
- Texture: add grain, remove smoothing

## Questions to ask (when user is vague)
- What’s the single message of this screen?
- What’s the hierarchy (H1 / sub / CTA)?
- Which style lane: minimal editorial vs playful 3D vs glass UI?
- Any must-keep constraints (font vibe, color, spacing, grid)?

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
