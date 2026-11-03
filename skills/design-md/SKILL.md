---
name: design-md
description: "Author a DESIGN.md — a self-contained visual-identity spec (YAML design tokens plus rationale prose) — for a site or vertical from reference material, and validate it with the upstream linter (npx @google/design.md lint DESIGN.md). The spec and examples are Apache-2.0 from google-labs-code/design.md; use it to pin a design direction before building HTML/CSS."
user-invocable: true
license: Apache-2.0
metadata:
  version: "1.0.0"
  source: "github.com/google-labs-code/design.md docs/spec.md + examples/ @ 6e5da5382f41edbba9d73b2c62f33f32e9971f15 (Apache-2.0, LICENSE copied alongside; SKILL.md is authored for this repository around the upstream spec — the @google/design.md CLI itself is not vendored, run it via npx)"
---

# DESIGN.md — visual-identity spec

`DESIGN.md` is a plain-text format that pins a visual identity for coding agents: machine-readable YAML design tokens plus human-readable markdown rationale. Author one when a project needs a persistent design direction — especially when mining a vertical (record shops, bakeries, studios): the DESIGN.md becomes the source of truth that a builder agent then turns into HTML/CSS.

The full format rules are in `references/spec.md` (upstream, Apache-2.0). Three worked examples are in `examples/` (`atmospheric-glass`, `paws-and-paths`, `totality-festival`).

## When to use

- Starting a new site/brand where the look must be locked before building: author `DESIGN.md` first, then build against it.
- The user pastes reference sites or screenshots from a vertical and wants their shared visual language captured as tokens.
- Handing a design direction to another agent (`wp-frontend-builder`) in a file instead of a chat message.

## Workflow

1. **Collect references.** 2–4 real examples from the vertical (URLs or pasted screenshots/descriptions). Note what is shared across them: palette, type, spacing feel, radius, motion, imagery.
2. **Read `references/spec.md`.** Key rules: tokens may live in YAML front matter and/or interleaved ` ```yaml ` blocks, merged into one token tree; each top-level schema key may be defined at most once across the whole document; cross-reference values with `{path.to.token}` syntax; token groups are typed (colors, typography, spacing, rounded, …).
3. **Write `DESIGN.md`.** Front matter with `name` (and `version`), then token groups, then prose sections explaining *why* each value exists and how to apply it. Tokens are the normative values; prose gives the reasoning. Use descriptive color names in prose that map to token names.
4. **Validate.** Run `npx @google/design.md lint DESIGN.md`. Fix every error; treat contrast findings as must-fix for text/background pairs (AA: 4.5:1 normal, 3:1 large). Re-run until errors are 0.
5. **Hand off.** A builder agent reads the DESIGN.md and emits the page. For WordPress block-pattern output, the builder also maps the tokens to preset-named CSS custom properties (`--wp--preset--color--<slug>` etc. with exact `var()` matching; never a `--wp--preset--border-radius--*` namespace).

## Rules

- One DESIGN.md per project, at the project root or `.vibe/`; name it `DESIGN.md` so agents find it.
- Tokens beat prose: when they disagree, fix the file, don't improvise in code.
- Keep it small and exact — every token must be a value you would defend in review.
- Commands are single plain commands (`npx @google/design.md lint DESIGN.md`); read files with `read_file`.
