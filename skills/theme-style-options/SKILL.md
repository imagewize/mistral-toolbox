---
name: theme-style-options
description: "Make option sheets a client can pick from for a WordPress block theme: a color-options PNG with one mini page per style variation (header, hero, buttons, dark band, tinted section, footer, palette strip, measured contrast), built from theme.json and styles/*.json, and a heading-fonts PNG comparing Fontsource candidates with the theme's current heading font, with licence shown. A bundled script (scripts/options.mjs, Node + Chrome headless, no npm install) generates the HTML and the screenshot. Use when a client has to choose colors, button colors, section or footer backgrounds or a heading font, or when the user asks for color options, palette options, font previews or a style variation comparison."
user-invocable: true
allowed-tools:
  - read_file
  - write_file
  - bash
metadata:
  version: "1.0.0"
  source: "github.com/imagewize/wp-vibe-toolbox skills/theme-style-options"
---

# Theme style options

Clients pick faster from a picture than from hex values. This skill turns open design choices in a block
theme into one PNG per choice: **heading fonts** first, then **colors**, because colors are judged in the
chosen font. Every color option is a real style variation in `styles/`, so whatever the client picks is
already working theme code, and nothing is copied by hand from a mock-up.

The script is `scripts/options.mjs` in this skill's folder. Below, `SKILL_DIR` stands for the absolute
path of that folder (for example `~/code/wp-vibe-toolbox/skills/theme-style-options`). It needs Node 18+
and a Chrome or Chromium (Google Chrome, or a Playwright download in `~/Library/Caches/ms-playwright`;
override with `CHROME_PATH`). Fonts mode also needs network access to Fontsource.

## When to use

- A new theme or redesign has open choices: heading font, button color, section tint, footer color.
- A client says "too much green", "the buttons don't stand out" or "can we see it in blue".
- Before you change the theme's main palette: show the options first, then change one file.

Not for: building the theme (`html-to-block-theme`), a full design direction (`design-md`,
`frontend-design`), palette theory or ramps (`better-colors`), or a review of a rendered page
(`html-page-review`).

## Workflow

### 1. Read the theme

Read `theme.json`: `settings.color.palette`, `settings.typography.fontFamilies` (and their `fontFace`
files), `settings.custom`, and `styles.elements` (`heading`, `button`, `link`). List `styles/` and read
`parts/header.html` and `parts/footer.html` for their `backgroundColor` / `textColor`. Note which slugs
the buttons, footer and dark sections use. Those are the slugs the options change.

### 2. Heading fonts

Pick 5 to 7 candidates that fit the brand. Mix categories: a soft serif, a grotesque, a display face and
one wild card. Prefer variable fonts. Then run:

```
node SKILL_DIR/scripts/options.mjs fonts --theme . --out design/options --fonts "Fraunces:800:SOFT=100+WONK=1,Bricolage Grotesque:800,Young Serif,Caprasimo,Gluten:800"
```

- Entry syntax: `Name[:weight[:AXIS=value+AXIS=value]]`. Names are Fontsource ids or family names; a
  local `.woff2` path also works (the brand's own font, for example).
- The first card is the theme's current heading font. `--variation NAME` applies that variation's colors
  to the cards; `--body Figtree` swaps the body font. Buttons follow the heading font when the theme's
  button uses the same family.
- Each label shows the licence from Fontsource. **Only propose fonts the theme may ship**: OFL, Apache
  or similar. A local font file shows "check the licence yourself". A "personal use only" or "private
  purpose" font can be shown as a reference, never shipped. The script copies the theme's own font
  files into `<out>/fonts/` too, so don't commit that folder to a public repo when one of them is
  restricted.

After the pick, self-host the chosen files in the theme (`assets/fonts/`, plus the licence in
`assets/fonts/licenses/`) and add the family to `theme.json` or to the variation.

### 3. Color options as style variations

Write each option as `styles/option-<letter>-<name>.json` (`"version": 3`, a `title` such as
`"B · Marigold"`). Rules:

- **Keep the slugs and change the values.** Patterns refer to slugs (`backgroundColor: "tertiary"`), so
  the same page re-colors itself per variation.
- **A variation's palette replaces the whole theme palette** (WordPress merges objects but replaces
  arrays). Copy the full palette into every option and change only the colors that differ.
- Put button colors in `styles.elements.button` (and `:hover`), not in the palette alone. A custom value
  such as a button edge or shadow color goes in `settings.custom`.
- Change one idea per option (button color, tint, footer). Include the current look as the baseline.
- Text on a button needs at least 4.5:1. Marigold or yellow buttons usually need dark text.

Then run:

```
node SKILL_DIR/scripts/options.mjs colors --theme . --out design/options --variations option-a-poppy,option-b-marigold,option-c-cornflower
```

Without `--variations` it takes every `styles/*.json` and `styles/colors/*.json`, skipping section
styles that have `blockTypes`. The first card is the theme without a variation (`--no-current` drops
it).

The script prints the **roles** it detected: the header and footer colors from the parts, the dark
band and the tint as the most used dark and light `backgroundColor` slugs in patterns, and the band
accent as the most used light `textColor`. If one is wrong, override it, for example
`--roles band=secondary,band-accent=leaf-light`. The roles are slugs, so each variation shows its own
value for that slug, which is what the real pages will do.

### 4. Check the sheet

Open the PNG (or ask the user to look at it). Each label lists measured contrast for the button, body,
band, band accent and footer; anything under 4.5:1 is red. **Fix red values in the variation before the
client sees it.** Exception: a decorative accent the user has accepted. Also check that the button color
still reads as the main action next to the tint and the footer, and that headings on the dark band are
legible.

Never report a contrast value you did not read from the sheet or measure.

### 5. Send and apply

- Send the PNG with one line per option in the client's language: what changes and why.
- Copy: `--site "Name"` sets the site name; `--copy copy.json` overrides the mock text (`siteName`,
  `nav`, `navCta`, `heroTitle`, `heroText`, `cta`, `cta2`, `bandTitle`, `bandText`, `tintTitle`,
  `tintCta`, `footer`). Use the client's language and real headings when you have them.
- After the pick, merge the chosen option into the theme's main variation (or `theme.json`), delete the
  other option files so they don't show up in the Site Editor, and bump the theme version.
- Keep `<out>/` (HTML, PNG, `fonts/`) with the project's design files, so a rerun after a change is one
  command.

## What the sheet shows, and what it doesn't

- Shows: palette, element styles for headings, links and buttons (color, family, weight, radius,
  shadow), body text and background, the theme.json `css` string (colors mode), the header and footer
  colors from the parts.
- Doesn't show: font sizes and spacing (the mini page has its own scale), block-level styles, colors set
  inside individual patterns other than the detected roles, hover states, and images. It's a
  comparison sheet, not a page preview. Screenshot the real site for that.

## Options

| Flag | Mode | Meaning |
|---|---|---|
| `--theme DIR` | both | theme folder (default: current folder) |
| `--out DIR` | both | output folder (default `./options`); writes `color-options.*` or `heading-fonts.*` and `fonts/` |
| `--variations LIST` | colors | variation names or `.json` paths, comma separated |
| `--roles LIST` | both | `header`, `header-text`, `band`, `band-text`, `band-accent`, `tint`, `footer`, `footer-text` = slug |
| `--fonts LIST` | fonts | candidates, see step 2 |
| `--variation NAME` | fonts | apply one variation's colors |
| `--body NAME` | fonts | body font from Fontsource |
| `--no-current` | both | leave out the current theme card |
| `--site`, `--copy` | both | mock text |
| `--cols N`, `--scale N` | both | cards per row; PNG pixel density (2 for a sharp email attachment) |
| `--no-shot` | both | HTML only (no Chrome) |
