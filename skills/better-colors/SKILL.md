---
name: better-colors
description: Improve color use: formats, contrast, palette generation and structure, and token naming. References included per topic. MIT, adapted from jakubkrehel/skills.
user-invocable: true
license: MIT
metadata:
  version: "1.0.0"
  source: "github.com/jakubkrehel/skills skills/better-colors @ 60bf140e43c98b248e6594487384ec967e89d98a (MIT, LICENSE copied alongside)"
---

# Colors

This skill builds and audits color systems. It generates ramps, maps their steps to roles and token names, converts notation and measures rendered contrast pairs.

Never report a contrast value you did not measure, and never estimate a color you could compute. Notation, a tinted neutral and a gradient's interpolation space are project choices, not findings. A broken role mapping, a failing pair and an out-of-gamut step are findings. Perceived lightness throughout means OKLCH `L`, from `0` to `1`.

Whether a pair is required to pass belongs to `better-accessibility`. Surfaces, shadows and icon color belong to `better-ui`.

## Match the project's color system

Reuse the project's tokens and notation. A consistent hex system beats hex with `oklch()` scattered through it.

For a new system, `oklch()` is the best default, because its numbers behave the way the ramp rules below describe. Everywhere else, a color library produces the same ramp in the project's own notation ([color-formats.md](color-formats.md)).

## A system is ramps, not colors

One neutral ramp, one accent ramp and only the status ramps the product actually renders. A `warning` ramp nothing imports is maintenance for zero pixels. A second accent hue earns its place only when two things must be distinguishable at a glance. Otherwise use more steps of the one accent ramp.

## Every step has a job

A ramp is not a gradient to pick from by eye. Each step exists because a role needs it: page background, component hover, border, solid fill, body text. Do not generate a step no role consumes. Both the Tailwind `50`–`950` and Radix `1`–`12` conventions map to those roles ([palette-structure.md](palette-structure.md)).

## Name primitives by hue, semantics by role

Primitives name a value (`--blue-600`) and are never applied in a component. Semantic tokens name a job (`--color-text-secondary`), point at a primitive and are the only tier components reference. That seam is what lets a theme repoint colors without touching components ([token-naming.md](token-naming.md)).

## Use a token only in its role

Never borrow a token because its value is right today. A separator used as a text color works until borders get lighter, and then the text goes with them. If a role has no token, add the token.

## Hold the hue across the ramp

A ramp holds one hue end to end, peaks in vividness mid-ramp and steps more finely at the light end. Build it with a color library, never by eye ([palette-generation.md](palette-generation.md)).

## One color, one meaning

Use a color for one purpose across the whole interface, treating anything within `15°` of OKLCH hue as the same color ([color-usage.md](color-usage.md)). Never let color be the only carrier of meaning. Pair it with an icon or a label, a requirement `better-accessibility` owns.

## Fill exactly one action per view

When filled color encodes primary emphasis, one primary action gets it and peers stay neutral. Put the color on the background, not the label. A filled button reads as primary across the room; accent-colored text on a neutral button reads as a link.

Keep an established hierarchy that already signals emphasis another way. Several colored backgrounds are fine when they encode distinct states or categories rather than competing as peers.

## Measure the rendered pair, then report

Measure a foreground against the background it actually renders on, not the page background. When a pair fails, report the pair, its measured value and the threshold it misses, then leave the colors alone. They are a design decision. Change them only when asked, and remeasure after ([contrast.md](contrast.md)).

## Pick a gradient's interpolation space

The space is a look, not a correctness setting. Default to `in oklab`, and reach for `in oklch` when a two-hue gradient goes gray in the middle ([color-usage.md](color-usage.md)).

## Before you finish

| Pattern | Fix |
| --- | --- |
| A hex, `rgb(` or `oklch(` literal in a component file where a token exists | Reuse or add the role token, in the project's notation |
| One `oklch(` value in a codebase otherwise written in hex | Write it in the established notation unless a migration is in scope |
| `var(--blue-600)` or `bg-blue-600` in a component file | Point a semantic token at the primitive and use that |
| A semantic name containing a hue or a component, as in `--color-blue-button` or `--color-sidebar-gray` | Rename it for its role: `--color-accent-solid`, `--color-bg-surface` |
| `--color-primary` and `--color-text-primary` both defined | Rename the brand token `accent` |
| A `border` or `separator` token inside `color:`, or a `text` token inside `background:` | Add a token for the missing role |
| `hsl(` ramp values that differ only in lightness | Rebuild with a constant perceived hue, in the project's notation |
| `50`–`200` stepping as far apart in OKLCH `L` as mid-ramp steps do | Tighten the light end to about `0.04`–`0.05` per step |
| One chroma or saturation number copied across every hue's ramp | Use the same proportion of each hue's own maximum |
| A status hue within `15°` of the accent hue | Move it at least `15°` away, or give the destructive action a distinct treatment |
| Dark tokens equal to the light ramp in reverse step order | Lower the accent's chroma, widen the dark end and remeasure every pair |
| Color tokens set under both `prefers-color-scheme` and a `.dark` class | Pick one switching mechanism and use it throughout |
| A contrast fix that changes hue and leaves lightness | Change lightness, the channel contrast responds to |
| `prefers-contrast: more` overriding a color for both appearances in one block | Give each appearance its own increased-contrast value |
| Text on a color with alpha, such as `/50`, `rgba(` or `color-mix(` with `transparent` | Measure the rendered result, or use a solid token |
| `text-white` on a Tailwind `500` fill | Measure it; white on most `500` hues fails 4.5:1, so move the fill to `600` |
| `oklch()` chroma beyond sRGB with no sRGB value declared before it | Declare the sRGB value first, then the vivid one inside `@media (color-gamut: p3)` |

## Reporting

**Severity.** `HIGH` makes content unreadable or assigns a misleading semantic color. `MEDIUM` is a noticeable theme, token or gamut failure. `LOW` is isolated polish.

Three symptoms are `HIGH` on sight whatever the surface, matching `better-interface`'s escalation triggers. They are body or control text whose rendered pair fails its required ratio, state or meaning carried by color alone and a semantic color used against its meaning.

**Verification.** Without a browser: token values, the gamut of every declared color, both theme blocks present and contrast computed from the declared token pair. With one: the background actually rendered behind the text, including opacity and any image beneath it, measured in both light and dark. Report every check you could not run as `Not verified`.

**Format.** Group findings under the principle each violates, ordered by severity, one row per root cause listing every location it appears in:

| Severity | Location | Before | After | Why |
| --- | --- | --- | --- | --- |

`Location` is `path/to/file:line`. `Why` names the principle and the user impact.

End with `Block` when any `HIGH` remains, `Approve` otherwise, leaving the rest in the table as work to do. Never `Approve` coverage you did not inspect. With nothing to report, state "No actionable color findings" and report verification.

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
