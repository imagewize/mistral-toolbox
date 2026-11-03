---
name: design-system-library
description: "Pick a named design system for a vertical (music, retail, retro, food, fashion, …) from a catalog of 2,144 real brand systems and apply its DESIGN.md spec (tokens plus rationale) to a page. Specs for Music & Audio, Retro & Nostalgic, Retail & E-commerce and E-commerce & Retail are vendored locally; any other catalog entry is one URL away at the pinned upstream commit."
user-invocable: true
license: MIT
metadata:
  version: "1.0.1"
  source: "github.com/plugin87/ux-ui-agent-skills design-systems/catalog.md + design-systems/library/ + taste/aesthetic-systems.md @ def84a70fadc3490d80901295a4f1951fdb2cc69 (MIT, LICENSE copied alongside; only the 76 Music & Audio, Retro & Nostalgic, Retail & E-commerce and E-commerce & Retail specs are vendored — the full 30 MB library/, tokens/, scripts/ and the fetch tooling are not imported)"
---

# Design System Library

A catalog of **2,144 named design systems** extracted from real brand sites, each a `DESIGN.md` file (machine-readable tokens + human-readable rationale). Use it when the brief names a vertical or a look — "vintage CD shop", "bakery", "record label", "fashion boutique" — so the page inherits a real, coherent visual identity instead of a generic one.

## When to use

- The user asks for a specific vibe, industry or brand feel ("make it feel like a 90s record shop", "like Bandcamp but warmer").
- You need a starting palette, type system and component style that already passed real-world use.
- `ui-ux-pro-max` gave you a style direction and you now want exact tokens, not just keywords.

Skip it when the brief already locks an aesthetic anchor (`frontend-design`) or a `DESIGN.md` (`design-md`) — don't mix systems on one page. When a project needs a `DESIGN.md` and none exists yet, pick the system here first, then pin it with `design-md`.

**A spec is a starting point, not a costume.** The specs come from real brands (Bandcamp, Nike, Apple Music, Marshall, …). Take the token structure and the mood; never copy the brand's name, logo, wordmark or signature imagery, and shift the palette or type enough that the page does not read as that brand. A client site must look like the client.

## Steps

1. **Brief inference first.** Name the industry/domain, the audience and tone, and the one mood adjective the result must earn. Generating before deciding produces slop.
2. **Search the catalog.** `design-systems/catalog.md` lists all systems grouped by category (Music & Audio, Retro & Nostalgic, Retail & E-commerce, E-commerce & Retail, Food & Beverage, Fashion & Apparel, …). Search it with plain grep, e.g. `grep -in "record\|vinyl\|music" design-systems/catalog.md`, or jump straight to a category heading. The catalog is vendored verbatim from upstream: **ignore its header** — the `python3 scripts/design_systems.py`, `node scripts/library.mjs` and `get_design_system` MCP tool it mentions are not shipped here, and its `library/<slug>/DESIGN.md` links only resolve for the vendored slugs (step 3).
3. **Read the spec.** Vendored specs live at `design-systems/library/<slug>/DESIGN.md` — read with `read_file`. If the slug you want is not vendored, read it with your URL-reading tool from the pinned upstream commit:
   `https://raw.githubusercontent.com/plugin87/ux-ui-agent-skills/def84a70fadc3490d80901295a4f1951fdb2cc69/design-systems/library/<slug>/DESIGN.md` **Never write a spec from memory** — if it cannot be fetched, pick a vendored or archetype direction instead.
4. **Apply the tokens.** Map the spec's token groups to the page's CSS custom properties using preset-named variables with exact `var()` matching (`--wp--preset--color--<slug>` etc.) so the output converts to WordPress block patterns; never use a `--wp--preset--border-radius--*` namespace — WordPress does not expose one, so map radii to your own `--radius-*` tokens. Follow the same token discipline as `frontend-design` (one locked system, no mixing). See `references/aesthetic-systems.md` (the upstream Library Contract) if you need the archetype recipes instead of a named system.
5. **Make it the client's.** Replace brand names, logos and signature imagery with the client's own, and adjust the palette or type where the result would pass for the source brand.
6. **Verify contrast.** Every text/background color pair must reach WCAG AA (4.5:1 normal text, 3:1 large). A brand value that fails must be adjusted and the adjustment noted — accessibility beats the brand value.

## Output

- The chosen slug (and why it fits the brief), in one line.
- The tokens as applied in the HTML/CSS, and the contrast check result per color pair.
- Anything you deliberately did **not** take from the spec (e.g. motion, imagery style), so the next run keeps the same exclusions.
