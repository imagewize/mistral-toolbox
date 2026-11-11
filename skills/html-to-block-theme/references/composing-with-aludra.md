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
| Project, portfolio or case cards in a **grid** (image + title + meta) | `aludra/feature-cards` | `aludra/carousel` with `slidesToShow` set to the source's column count, no `variableWidth` |
| Project cards that are a **slider** in the source | `aludra/carousel` + `aludra/slide` (see `carousel-portfolio-showcase.php`) | `aludra/photo-grid` (square images, no text) |
| Steps, process, "how we work" | `aludra/service-blocks` (numbered) | `aludra/feature-list-grid`, `aludra/icon-grid`, `aludra/spine-section` |
| About, studio, facts | `aludra/about` | `aludra/split-section` (media + content), `aludra/spine-section` |
| One or more client quotes | `aludra/testimonial-grid` | `aludra/review-profiles` |
| Contact with form | `aludra/contact-section` (form card needs Contact Form 7) | — |
| Closing call to action | `aludra/cta-banner` | `aludra/cta-columns` |
| FAQ | `aludra/faq-tabs` + `aludra/faq-tab-answer` | — |
| Pricing | `aludra/pricing-tiers` | — |

Match the source's **layout**, not only its content: a 3-column grid stays a grid, not a carousel
with one and a half slides visible. Several blocks have style variations (`is-style-night`,
`is-style-light`, `is-style-steps`, …) in their `block.json` `styles`. Many blocks are dark by
default (`hero-banner`, `stat-rail`, `contact-section`, `cta-banner`), so a light source design
needs their `light` variation. List the variations per block:

```bash
python3 -c "import json,glob; [print(json.load(open(f))['name'], [s['name'] for s in json.load(open(f)).get('styles',[])]) for f in sorted(glob.glob('$HOME/code/aludra/blocks/*/src/block.json'))]"
```

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

## 4. Port the design layer. Colours are not enough.

Aludra blocks and the Aviendha fork bring their own look: pill buttons, rounded cards, shadows,
monospace eyebrows, dark sections, Aviendha's header with a WooCommerce cart. With only the
palette changed, the page has the client's colours but the starter's design. The source's design
rules have to be moved into the theme as well, in this order:

1. **Write down the source's design rules** from its `:root` tokens and base CSS: border radius,
   shadows, button shape and hover, heading weight and letter-spacing, link style, eyebrow/kicker
   style, section separators (lines, bands), card frames, form fields (labels, borders), and the
   font families. These are facts from the source, like its copy.
2. **Style variations** of the chosen blocks (step 1 above), e.g. `is-style-light` on a block that
   is dark by default.
3. **`theme.json`** for everything it can express:
   - `settings.border.radiusSizes` and `settings.shadow.presets`: replace the starter's values
     (Aviendha's `pill` radius, its shadows) with the source's, e.g. `0` and none
   - `styles.elements`: `button` (shape, colours, `:hover`), `link`, `heading`, `h1`–`h6`
   - `styles.blocks["aludra/<name>"]`: colours, spacing, typography and border per Aludra block
   - `settings.typography.fontFamilies`: only the source's families. Remove the starter's (e.g. a
     mono family) **and** every reference to them, or eyebrows keep a monospace fallback
4. **Header and footer parts**: rebuild them from the source's header and footer (site title,
   tagline, navigation, CTA, footer columns). Remove starter-only blocks the client doesn't need
   (WooCommerce mini-cart and account, "Start a project"). Set the site's `blogname` and
   `blogdescription` (`wp option update`), since the header shows the site title.
5. **Plugin output the theme renders** (e.g. the Contact Form 7 form inside
   `aludra/contact-section`): its template must keep the source's visible labels. Placeholders
   instead of labels are an accessibility regression. Three things to know about Contact Form 7:
   - The form template lives in the database (`_form` post meta), not in the theme. Keep a copy in
     the theme (`assets/forms/contact-form-7-<name>.txt`) and document how to load it
     (`wp post meta update <form-id> _form "$(cat assets/forms/<file>.txt)"`), or a fresh install
     gets an empty form.
   - CF7 wraps fields in `<p>` and `<br>`, and `aludra/contact-section` lays the form out as a
     two-column grid with 11px uppercase labels. To get stacked, sentence-case labels, override
     `.contact-section__card form { display: block }`, hide `br`, and reset the label's
     `font-size`, `letter-spacing` and `text-transform`. Use `display: block` on the label (not
     flex), or the required star and the hint land on separate lines.
   - Check the rendered form: the field tops in one row must line up, and the submit button must
     not inherit Aludra's uppercase, arrow icon and `translateY` hover.
6. **Theme CSS only for what is left**, in one block at the end of `style.css` headed
   `/* <Client> design layer */`, one comment per rule naming the section and why `theme.json` or a
   variation can't do it. Don't edit the starter's own rules in place. Override them in that block,
   so the fork's diff with the starter stays readable.

7. **Specificity.** Aludra's CSS is nested under the block class and, for some blocks, under
   `.wp-block-group.<class>` (e.g. `.wp-block-aludra-testimonial-grid .wp-block-group.testimonial-grid__card`
   at 0,3,0). A rule with fewer classes loses silently: the quote card stayed white with a 12px
   radius, the CTA button kept `border-radius: 10px` and the hero button its drop shadow. Copy the
   block's own selector and add a class (or repeat it), and use `!important` only where Aludra
   itself does, with a comment saying so. Check the computed style in the browser, not the CSS.
8. **Layout classes on grid containers.** A `core/group` with `"layout":{"type":"constrained"}`
   gets `has-global-padding` (56px of side padding inside a full-width block), and its children
   get `margin-inline: auto` and `max-width`, which staircases headings and pulls grid items off
   the left edge. For a group that the design layer turns into a grid (project cards, footer
   columns, a contact intro), omit `layout` entirely. For a row that must not wrap (title + folio
   number), set `"flexWrap":"nowrap"` on the group.
9. **Header.** Brand left and navigation + CTA right is `justifyContent: space-between` on the
   header row, with the navigation and the button inside one inner group. Three siblings in one
   flex row leave the nav next to the brand.

    **Keep the hamburger.** A static prototype usually has no mobile menu: its nav is just a row
    that wraps under 760px. Don't copy that into the part as `"overlayMenu":"never"`, because the
    forked starter's responsive overlay (and its breakpoint CSS) is then dead code and phones get
    a nav row instead of a hamburger. Use `"overlayMenu":"mobile","icon":"menu"`, put the nav
    *after* the CTA in the inner group (the starter's CSS pulls it back in front on desktop), and
    delete the prototype's mobile nav-row CSS. Keep `"never"` only for the footer nav. Check the
    header at 375px and 1280px: hamburger opens the overlay on the former, inline links on the latter.
10. **Scroll-triggered SVG animation.** If the source plays draw-on animations inside SVG files
    loaded as `<img>`, they run when the image loads, so below-the-fold drawings finish before
    they are seen (half-drawn and static in screenshots). Port the source's
    `IntersectionObserver` script to `assets/js/draw-on-scroll.js` and enqueue it with
    `wp_enqueue_script` (footer, `defer`). It swaps below-the-fold images to a placeholder and
    restores the `src` when they scroll into view, and does nothing under reduced motion. Grep the
    source for `IntersectionObserver` before declaring the page done.
11. **Tell users the plugins are required.** In Mode B the homepage is made of `aludra/*` blocks
    (and often a Contact Form 7 form). Without those plugins the blocks render as empty
    placeholders, so the theme must say so: a "required plugins" section in its README and
    `readme.txt`, and the dismissible admin notice from `~/code/winespring/inc/plugin-recommendations.php`
    (copy it, change the namespace, slugs and wording, and `require_once` it in `functions.php`
    inside `is_admin()`).

**Size as a signal, both ways.** If the design layer block grows to hundreds of lines, a block
or variation was probably skipped (step 1). If it is empty while the source has a clear design of
its own, the design layer was skipped, and the page will look like the starter. A `style.css` the
same size as the starter's is not a success by itself.

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
3. **Sentinel passes** on every pattern. `npm run validate` prompts for a URL and hangs a
   non-interactive agent, and a Valet/local site has no Trellis vault, so pass the site and login as
   flags: `npx sentinel --log --url=https://<site>.test --user=<admin> --pass=<password> patterns/`
   (the local dev login is in the project notes or `AGENTS.md`; ask the user if it is not). See
   `references/forking-a-starter-theme.md`. The site sentinel validates against must have Aludra
   active, or every `aludra/*` block fails. Re-run it after every pattern or part change.
   **Coding standards.** Run `composer install` once in the fork, then
   `vendor/bin/phpcs --standard=phpcs.xml .` and fix what it reports (`vendor/bin/phpcbf` for the
   auto-fixable). A fork that adds PHP (the plugin notice, an enqueue) must stay clean.
4. **The rendered page uses the blocks.** For each block you used, check that its wrapper class
   appears in the HTML of the front page:
   ```bash
   curl -sk https://<site>.test/ -o "$TMPDIR/front.html"
   grep -oE "wp-block-aludra-[a-z-]+" "$TMPDIR/front.html" | sort | uniq -c
   ```

5. **The page looks like the source.** Take screenshots of the source HTML and the local site at
   1440px and 390px wide with headless Chrome, before and after the design pass:
   ```bash
   "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless --hide-scrollbars --force-prefers-reduced-motion --window-size=1440,6000 --screenshot="$TMPDIR/site-1440.png" https://<site>.test/
   ```
   Run it again with `file://<path>/index.html` for the source and `--window-size=390,9000` for
   phones. For long pages crop the full-page screenshot into slices of about 1300px, so each
   section is readable, and look at every slice. Measure what the eye can miss with the browser's
   computed styles: padding on grid containers, the tops of form fields in one row, button radius
   and shadow. List per section what still differs. Passing sentinel and the block checks says nothing
   about the look. If you can't view images, say so in the report and ask the user to compare.

## 6. Report

End with:

- A section-to-block table: source section, the `aludra/*` block used (or "core: gap"), the source
  pattern copied, and the style variation.
- The gaps: what the source design has that no Aludra block covers, and how it was built instead.
  These are candidates for a new Aludra block or variation. Don't build one unless asked.
- The palette mapping, including slugs mapped to the same value.
- The design layer: the source's design rules from step 4.1, where each one landed (variation,
  `theme.json` path, or design-layer CSS rule), and the design-layer line count.
- Per section, what still differs from the source after the screenshot comparison.
