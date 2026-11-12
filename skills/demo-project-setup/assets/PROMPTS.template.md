# Prompts

Every prompt used in this demo, in the order they ran, with the agent, the outcome and the commit.
Copy a prompt as-is to repeat a run, or adapt it for a new client. The approach follows
[`architect-demo/PROMPTS.md`](https://github.com/imagewize/architect-demo/blob/main/PROMPTS.md).

Each run starts a fresh Vibe session in this folder with the agent named in its step; every
step shows the exact command, then the prompt to paste:

```bash
cd {{PROJECT_DIR}}
vibe --agent <agent>
```

| # | Step | Agent | Outcome | Commit |
|---|------|-------|---------|--------|
| 0 | Setup: folder, images, local site, plugins | `wp-frontend-builder` with `demo-project-setup` | {{SETUP_OUTCOME}} | – |
| 1 | Build from brief | `wp-frontend-builder` | Not run yet | – |
| 2 | Review the built page | `ux-designer` | Not run yet | – |
| 3 | Apply review notes | `wp-frontend-builder` | Not run yet | – |
| 4 | Convert to a block theme ({{MODE_LABEL}}) | `wp-frontend-builder` | Not run yet | – |
| 5 | Design pass against `index.html` | `wp-frontend-builder` | Not run yet | – |

## 0. Setup

Done with the `demo-project-setup` skill. To repeat it by hand:

**Images.** {{IMAGE_INSTRUCTIONS}}
Use only downloaded files, never made-up stock URLs: the agent invents photo IDs, which give broken
images, and the theme needs local files anyway. Keep Unsplash's own download names: the follow-up
run reads the photographer and photo ID from them. After adding the photos, start a fresh session
and paste:

```
Load demo-project-setup. Photos added to images/: fill in CREDITS.md, fit prompt 1 to the photos and commit.
```

It resizes the photos, writes one `images/CREDITS.md` row per photo and fits prompt 1 to them.

**Local site.** Laravel Valet{{SITE_PLUGINS}}:

```bash
{{SITE_COMMANDS}}
```

`wp valet new` provisions HTTPS by default (pass `--unsecure` for plain HTTP), so no
`valet secure` is needed: the site runs at `https://{{SITE}}.test`, login `admin` / `admin`. When
the parent folder is not parked (`valet paths`), the site needs `valet link` from its own folder,
or Valet answers with its 404 page.

<!-- MODE B START -->
**Starter and plugin.** In `~/code/aludra`, run `npm run build --workspaces --if-present` if the
build looks stale. In `~/code/aviendha`, delete any `sentinel-*.log.json` files and check that
`git status` is clean.
<!-- MODE B END -->

## 1. Build from brief

Agent: `wp-frontend-builder`

**Model:** Mistral Large 4, or another model whose `[[models]]` entry in `~/.vibe/config.toml` has
`supports_images = true`, so the agent can look at its own screenshots. A text-only model such as
GLM 5.3 checks the page by measuring, not by looking; then look at the result yourself, or let
stage 2 do it.

```bash
cd {{PROJECT_DIR}}
vibe --agent wp-frontend-builder
```

Then paste this prompt:

```
Build the {{PAGE}} for {{WHAT_FOR}} as one self-contained index.html with embedded CSS.

Brief:
{{BRIEF_BULLETS}}

This is a {{PAGE}}, not a landing page. Sections: {{SECTIONS}}.

{{VISUALS_RULE}}

Minimal questions: state your assumptions at the top of your reply, then build.

Design: load design-system-library and check the {{DESIGN_CATEGORIES}} categories for a fitting system; adapt it, never copy a brand. If none fits, load frontend-design and pick one anchor. {{FONT_AND_COLOUR_RULE}} Lock the tokens as --wp--preset--* custom properties. One <section> per future block pattern, marked with HTML comments. Mobile-first, accessible, a hamburger menu under 1024px. Run the no-ai-design-slop gate before you hand off.
```

Why it is written this way:
- **A concrete brief:** a name, an audience and the main actions keep the copy specific.
- **"Not a landing page":** this stops the agent narrowing the page to one conversion goal.
- **References with what to take from each:** a URL alone gives the agent nothing to work with
  when the site cannot be fetched, and naming the traits keeps it from copying the site.
- **Local images only:** no broken or made-up URLs, no `url()` backgrounds for the Cover block to
  untangle, and the same files go into the theme.

Result: _not run yet._

## 2. Review the built page

Agent: `ux-designer`, with the `html-page-review` skill. It writes numbered notes to `REVIEW.md`
and does not edit the page.

**Model:** this stage is a look, so it needs image support: Mistral Large 4 or another model with
`supports_images = true` (switch with `/model` if the session runs a text-only model), then paste
the prompt. Vibe asks to read `probe.html` and `frame.html` from the toolbox, outside this folder:
"Allow for remainder of this session" is fine. A good run measures with the probe and takes one
screenshot per width through `frame.html`, and reports "Visual pass: done". "Not done" means the
model could not see the screenshots: switch model and run it again. If it calls Chrome with
`--window-size=390` directly, stop it.

```bash
cd {{PROJECT_DIR}}
vibe --agent ux-designer
```

Then paste this prompt:

```
Load html-page-review and review index.html against the brief in README.md.
```

Result: _not run yet._

## 3. Apply review notes

Agent: `wp-frontend-builder`. Keep each run to a few notes, then compare and commit.

**Model:** the model with image support from stage 1, so it can check the edits by eye: ask for
screenshots at 390 and 1440px through `html-page-review/frame.html` at the end of the session.

```bash
cd {{PROJECT_DIR}}
vibe --agent wp-frontend-builder
```

Then paste this prompt:

```
Read index.html and REVIEW.md. Apply review notes 1–3 to index.html. Don't edit REVIEW.md. When done, list per note what you changed.
```

```bash
git diff                                  # compare with the last version
git commit -am "design: <what changed>"   # keep this run
git restore index.html                    # throw this run away
```

Result: _not run yet._

<!-- MODE B START -->
## 4. Convert on Aviendha + Aludra

Agent: `wp-frontend-builder`, with `html-to-block-theme`.

**Model:** Mistral Large 4: a full conversion needs its 1M context, and its image support lets it
compare the screenshots of `index.html` and the site section by section. Ask for that comparison
before you accept the report. On a text-only model, "what still differs" comes from measurements
only, however confident the report sounds: switch with `/model` for the comparison.

Run it on a branch:

```bash
cd {{PROJECT_DIR}}
git switch -c feat/block-theme
vibe --agent wp-frontend-builder
```

Then paste this prompt:

```
Load html-to-block-theme and work in Mode B (Aviendha fork + Aludra blocks). Read references/forking-a-starter-theme.md, references/composing-with-aludra.md and references/mobile-navigation.md before writing any file.

Create theme-{{THEME_SLUG}}/ in this repository as a fork of ~/code/aviendha for {{NAME}} and build the homepage as one pattern composed from aludra/* blocks:
- Fork: rsync as the reference describes (no .git, node_modules, vendor or sentinel logs), compare both folder listings, then rename every aviendha identifier to {{THEME_SLUG}}. Lineage docs keep naming Aviendha; version 1.0.0. Add sentinel-*.log.json to .gitignore. Run npm and sentinel only inside theme-{{THEME_SLUG}}/, never inside ~/code/aviendha.
- Palette: give theme.json only the colour slugs the Aludra blocks read (list them with the grep in composing-with-aludra.md), each with a value taken from index.html's :root. Report the mapping.
- Fonts: bundle the fonts from index.html as woff2 in theme-{{THEME_SLUG}}/assets/fonts/ and register them with theme.json fontFace.
- patterns/homepage.php: one pattern mirroring index.html section by section, copy verbatim. For every section, copy the block's markup from ~/code/aludra/patterns/ and change only the content:
{{SECTION_BLOCK_MAP}}
  Do not hand-build a section with core/group + CSS when an aludra block fits. If none fits, build it from core blocks and list it as a gap.
- Copy the images from images/ into theme-{{THEME_SLUG}}/assets/img/ and reference them with get_theme_file_uri().
- Point the front page template at the pattern.
- Design layer, in this order: block style variations first, then theme.json (radius, shadows, buttons, headings, links, eyebrows), then header and footer parts rebuilt from index.html (header navigation overlayMenu mobile, footer navigation never; no WooCommerce mini-cart or account blocks, no "Start a project" button), and only then the remaining gaps in one block at the end of style.css headed "/* {{NAME}} design layer */", one comment per rule naming the section. Set blogname to "{{NAME}}" with wp option update.
- Site: {{SITE_DIR}} (Valet{{SITE_PLUGINS}}). Symlink theme-{{THEME_SLUG}}/ to wp-content/themes/{{THEME_SLUG}} and activate it. Use --path="{{SITE_DIR_ABS}}", never ~ after =.
- README.md and readme.txt in the theme state which plugins must be installed; add the dismissible admin notice from ~/code/winespring/inc/plugin-recommendations.php.
- Checks, one command per call: php -l every PHP file; composer install and vendor/bin/phpcs --standard=phpcs.xml . in theme-{{THEME_SLUG}}/; sentinel with --url https://{{SITE}}.test --user admin --pass admin after every pattern change until it passes; the aviendha grep; the aludra block-name check; the rendered front page containing a wp-block-aludra-* wrapper for every block used; screenshots of index.html and the site at 1440px and 390px, compared section by section (390px through html-page-review/frame.html, which shows the page in an iframe at the exact width; never --window-size=390, headless Chrome on macOS stops at 500px). Confirm git -C ~/code/aviendha status shows nothing new.
- Report: the section-to-block table (block, source pattern copied, style variation), the gaps, the palette mapping, the design-layer line count, and per section what still differs from index.html.
```

Why it is written this way:
- **Mode B named up front:** without it the agent slides into a core-block conversion
  (architect-demo run 11).
- **Copy markup from Aludra's own patterns:** the blocks are static, so their wrapper must match
  `save()` exactly. Copying a working pattern is the fastest way to pass sentinel.
- **Design layer in the same run:** in architect-demo run 11b the palette was ported but the look
  stayed Aviendha's (pill buttons, shadows, dark bands). Variations, then `theme.json`, then parts,
  then CSS fixes that in order of cost.
- **Header menu named explicitly:** run 11c lost the hamburger menu when it rebuilt the header.
- **Screenshots compared:** sentinel and the block checks pass on a page that looks nothing like
  the source; only a visual comparison shows the difference.

Result: _not run yet._
<!-- MODE B END -->

<!-- MODE A START -->
## 4. Convert to a block theme

Agent: `wp-frontend-builder`, with `html-to-block-theme`.

**Model:** Mistral Large 4: a full conversion needs its 1M context, and its image support lets it
compare the screenshots of `index.html` and the site section by section. Ask for that comparison
before you accept the report. On a text-only model, "what still differs" comes from measurements
only, however confident the report sounds: switch with `/model` for the comparison.

Run it on a branch:

```bash
cd {{PROJECT_DIR}}
git switch -c feat/block-theme
vibe --agent wp-frontend-builder
```

Then paste this prompt:

```
Load html-to-block-theme and work in Mode A (standalone conversion from core blocks). Read references/mobile-navigation.md before writing any file.

Convert index.html into a block theme in theme-{{THEME_SLUG}}/ for {{NAME}}: theme.json v3 from the --wp--preset--* tokens in index.html, the fonts bundled as woff2 in assets/fonts/ with fontFace, one pattern per <section> with the copy verbatim, a front page template that uses them, and header and footer parts rebuilt from index.html (header navigation overlayMenu mobile, footer navigation never). Copy the images from images/ into theme-{{THEME_SLUG}}/assets/img/ and reference them with get_theme_file_uri(). Prefer core blocks; put what theme.json cannot express in one commented block in style.css.
Site: {{SITE_DIR}} (Valet). Symlink theme-{{THEME_SLUG}}/ to wp-content/themes/{{THEME_SLUG}} and activate it. Use --path="{{SITE_DIR_ABS}}", never ~ after =.
Checks, one command per call: php -l every PHP file, WP_DEBUG with an empty debug.log, no block validation errors in the editor, screenshots of index.html and the site at 1440px and 390px compared section by section (390px through html-page-review/frame.html, which shows the page in an iframe at the exact width; never --window-size=390, headless Chrome on macOS stops at 500px), the mobile menu opened at 390px.
Report: the section-to-pattern table, the CSS line count, and per section what still differs from index.html.
```

Result: _not run yet._
<!-- MODE A END -->

## 5. Design pass against `index.html`

Agent: `wp-frontend-builder`, on the same branch as 4, so its diff shows only the design changes.
Fill in the numbered list from the differences prompt 4 reported and from your own screenshots,
one point per difference.

**Model:** the model with image support from stage 4, for the fixes and the before and after
comparison.

```bash
cd {{PROJECT_DIR}}
git switch feat/block-theme
vibe --agent wp-frontend-builder
```

Then paste this prompt:

```
Load html-to-block-theme. theme-{{THEME_SLUG}}/ does not yet match index.html. Do a design pass so https://{{SITE}}.test matches index.html, without changing which blocks are used except where noted. Screenshot index.html and the site at 1440px and 390px with headless Chrome before and after (390px through html-page-review/frame.html, which shows the page in an iframe at the exact width; never --window-size=390, headless Chrome on macOS stops at 500px).

1. <difference and the fix you want>
2. ...

Fix each point with a block style variation or theme.json first; use the design-layer block in style.css only for what is left, with one comment per rule. Run the checks from prompt 4 after every pattern or part change, then re-screenshot and list per point what you changed and what still differs.
```

Result: _not run yet._
