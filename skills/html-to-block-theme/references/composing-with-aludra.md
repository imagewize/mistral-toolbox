# Composing Pages from Aludra Blocks (Mode B)

Read this when the build is **Mode B**: the theme is an Aviendha fork (or another theme on the
Imagewize stack) and the page content comes from the Aludra plugin (`~/code/aludra`). Aviendha
ships no patterns and no content blocks on purpose. The theme provides the palette, typography,
header and footer, and Aludra provides the sections. WordPress.org theme review forbids
theme-registered blocks, which is why the blocks live in a plugin.

**The rule:** every section of the source design starts as an `aludra/*` block. Build a section
from `core/group` + class names + theme CSS only when no Aludra block fits it, and report that
section as a gap. A Mode B theme whose patterns are mostly `core/group` with a large `style.css`
is a Mode A conversion in the wrong place, even when every check passes.

## 1. Know what the plugin offers. Read it, don't guess.

The plugin is the source of truth. List the blocks with one description each:

```bash
python3 -c "import json,glob; [print(json.load(open(f))['name'], '|', json.load(open(f)).get('description','')[:100]) for f in sorted(glob.glob('$HOME/code/aludra/blocks/*/src/block.json'))]"
```

Aludra's own patterns are the working examples. Each one shows a block's exact saved markup:

```bash
ls ~/code/aludra/patterns/
```

`section-*.php` holds one section per block (`section-hero-split.php`, `section-about.php`,
`section-testimonials.php`, …). `page-*.php` shows whole pages, and `carousel-*.php` the carousel
variants.

A starting map from typical page sections to blocks. Check it against the listing above, because
the plugin changes:

| Source section | First choice | Alternatives |
|---|---|---|
| Hero with text and an image or drawing | `aludra/hero-split` | `aludra/hero-banner` (text only, dark) |
| Key figures under the hero | `aludra/stat-rail` + `aludra/stat-item` | — |
| Project, portfolio or case cards (image + title + meta) | `aludra/carousel` + `aludra/slide` (see `carousel-portfolio-showcase.php`) | `aludra/feature-cards`, `aludra/photo-grid` (square images, no text) |
| Steps, process, "how we work" | `aludra/service-blocks` (numbered) | `aludra/feature-list-grid`, `aludra/icon-grid`, `aludra/spine-section` |
| About, studio, facts | `aludra/about` | `aludra/split-section` (media + content), `aludra/spine-section` |
| One or more client quotes | `aludra/testimonial-grid` | `aludra/review-profiles` |
| Contact with form | `aludra/contact-section` (form card needs Contact Form 7) | — |
| Closing call to action | `aludra/cta-banner` | `aludra/cta-columns` |
| FAQ | `aludra/faq-tabs` + `aludra/faq-tab-answer` | — |
| Pricing | `aludra/pricing-tiers` | — |

Several blocks have style variations (`is-style-night`, `is-style-light`, …) in their `block.json`
`styles`. Use a variation before writing CSS.

## 2. Copy the wrapper markup. Don't write it from scratch.

Almost every Aludra block is **static**: its `save()` writes the wrapper HTML
(`<div class="wp-block-aludra-hero-split alignfull" style="margin-top:0;margin-bottom:0"><div class="hero-split__inner">…`)
and the content sits in inner core blocks with BEM class names (`hero-split__title`,
`hero-split__lead`). The editor compares the saved markup with what `save()` produces. One missing
class, inline style or wrapper `div` makes the block invalid ("This block contains unexpected or
invalid content").

So for each section:

1. Open the matching `~/code/aludra/patterns/section-*.php`.
2. Copy the block from its opening comment to its closing comment.
3. Change only the inner content: headings, paragraphs, images, buttons. Keep the wrapper, the
   BEM class names and the inner group structure.
4. Wrap translatable text in `esc_html_e()` / `esc_html__()`, and image URLs in
   `esc_url( get_theme_file_uri( 'assets/img/…' ) )`.
5. Run sentinel on the pattern (step 5) before going on to the next section.

The few **dynamic** blocks (those with a `render.php` in `blocks/<name>/src/`, such as
`instagram-embed` and `mega-menu`) save only their comment and attributes, and the server renders
the markup.

## 3. Palette: define every slug the blocks read

Aludra's styles use `var(--wp--preset--color--<slug>, <fallback>)`. A slug the theme doesn't define
falls back to Aludra's default colours (rose, cream, olive), so the client's palette shows only in
some places. List the slugs the blocks actually use:

```bash
grep -rhoE "var\(--wp--preset--color--[a-z-]+" ~/code/aludra/blocks/*/src | sort | uniq -c | sort -rn
```

Give each of them a value from the source design's tokens in `theme.json`. At least these:
`base`, `contrast`, `main`, `primary`, `secondary`, `tertiary`, `accent`, `border-light`, `white`,
`primary-accent`, `main-accent`. When the source design has fewer colours, map several slugs to the
same value and say which in the report (for example `main` = `contrast` for a two-colour design).
Don't keep a second set of slugs named after the source design (`paper`, `ink`, …) next to them.
That gives the Site Editor two names for one colour.

## 4. Theme CSS stays small

The fork's `style.css` should stay close to Aviendha's size. Section layout comes from the Aludra
block. A theme CSS rule is for a real gap (a detail no block or variation can show), and gets a
comment naming the section. If `style.css` grows by hundreds of lines, stop and check whether a
block was skipped.

## 5. Checks

Run each as one command, from the fork's own directory:

1. **Block names exist.** Every `aludra/*` name in the theme's patterns, parts and templates must
   have a folder in `~/code/aludra/blocks/`:
   ```bash
   grep -rhoE "wp:aludra/[a-z0-9-]+" patterns parts templates | sort -u
   ```
   Compare that list with `ls ~/code/aludra/blocks`. A missing name renders as an "unsupported
   block". If `blocks/<name>/build/` is missing or older than `src/`, run
   `npm run build --workspaces --if-present` in `~/code/aludra` first.
2. **The plugin is active** on the local site: `wp plugin list --path="$HOME/code/<site>"` shows
   `aludra` as active (plus `contact-form-7` when `aludra/contact-section` is used).
3. **Sentinel passes** on every pattern (`npm run validate` in the fork, see
   `references/forking-a-starter-theme.md`). The site sentinel validates against must have Aludra
   active, or every `aludra/*` block fails.
4. **The rendered page uses the blocks.** For each block you used, check that its wrapper class
   appears in the HTML of the front page:
   ```bash
   curl -sk https://<site>.test/ -o "$TMPDIR/front.html"
   grep -oE "wp-block-aludra-[a-z-]+" "$TMPDIR/front.html" | sort | uniq -c
   ```

## 6. Report

End with:

- A section-to-block table: source section, the `aludra/*` block used (or "core: gap"), the source
  pattern copied, and the style variation.
- The gaps: what the source design has that no Aludra block covers, and how it was built instead.
  These are candidates for a new Aludra block or variation. Don't build one unless asked.
- The palette mapping, including slugs mapped to the same value.
