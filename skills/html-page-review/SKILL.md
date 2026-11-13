---
name: html-page-review
description: "Review a rendered static HTML/CSS page the way a designer would: render it in headless Chrome at phone, tablet and desktop widths, measure layout faults (overflow, overlapping text, labels crossing drawings, unbalanced columns, empty sides, alignment outliers, tall sticky headers, small text and tap targets), then judge it against the brief and its own design system. Writes numbered, fixable review notes to REVIEW.md and never edits the page. Use after a page is built or changed, before the next round of change requests."
user-invocable: true
allowed-tools:
  - read_file
  - write_file
  - bash
metadata:
  version: "1.3.2"
  source: "github.com/imagewize/wp-vibe-toolbox skills/html-page-review"
---

# HTML Page Review

Review a built page, not its code diff. The builder of a page checks its own work mechanically
(contrast, tags, tokens) and cannot judge it: a label that crosses a drawing, a column left half
empty or a centred block in a left-aligned system all pass those checks. This skill renders the
page, measures what can be measured, looks at what has to be judged, and writes notes the builder
can apply one by one.

You review. You do not fix. Never edit the page under review.

## Inputs

- **The page:** usually `index.html` in the project root. Ask for the path if there are several.
- **The brief:** what the page is for, who it is for and the main action. Look in `README.md`,
  `BRIEF.md` or the conversation. Without a brief you can review layout and consistency, but say
  in the review that brief fit was not checked.
- **Earlier review notes:** if `REVIEW.md` exists, read it first, so you can say which earlier
  points are now fixed and do not repeat them.

## Step 1: Measure with the probe

`probe.html` in this skill's directory loads the page in an iframe at a given width, measures it
and prints JSON. Run it once per width with headless Chrome. Use absolute `file://` paths.

Chrome binary:
- macOS: `/Applications/Google Chrome.app/Contents/MacOS/Google Chrome` (quote the path)
- Linux: `google-chrome` or `chromium`

One command per width, for 390 (phone), 768 (tablet) and 1440 (desktop):

```
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --disable-gpu --allow-file-access-from-files --virtual-time-budget=6000 --dump-dom "file:///ABS/SKILL/DIR/probe.html?target=file:///ABS/PROJECT/index.html&w=390&h=844"
```

The output is a small HTML document whose `<pre id="result">` holds the JSON: `findings`, each
with `kind`, `where` (section and heading) and `detail`, plus `page_height` and a `sections` map.
`--allow-file-access-from-files` is required; without it the probe reports an error with a hint.

What the finding kinds mean, and how far to trust them:

| Kind | Meaning | Trust |
|------|---------|-------|
| `horizontal-overflow` | The page scrolls sideways at this width | Certain |
| `tall-sticky-header` | A sticky or fixed header takes more than 12% of the screen | Certain |
| `text-overlap` | Two text elements' boxes intersect | High; confirm it is not an intended overlay |
| `svg-label-crossing` | Text in a drawing crosses a shape | Possible: a diagonal line's box is larger than the line |
| `unbalanced-columns` | A column's content fills under 60% of its row's height | Possible: may be intended whitespace |
| `empty-side` | Desktop: a section's content ends before 65% of its width | Possible: may be intended |
| `alignment-outlier` | A centred text block on a mostly left-aligned page | High for consistency; judge whether it is deliberate |
| `small-text` | Text under 12px | Certain; judge if it is legible captions or a problem |
| `small-tap-target` | A link or control under 24×24px, not inline in running text | Certain against WCAG 2.2 target size |
| `missing-accessible-name` | An image or drawing with no text alternative | Certain |

"Possible" findings need a second look before they become review notes. Drop the ones that are
deliberate and consistent with the rest of the page.

## Step 2: Look at the page

Take a screenshot per width through `frame.html` in this skill's directory, which shows the page
in an iframe at the exact width. Do not set the width with `--window-size` alone: headless Chrome
on macOS will not make its window narrower than 500px, so `--window-size=390,…` lays the page out
at 500px and the screenshot cuts off its right side. The hamburger, the end of a headline and a
second button then seem to be missing or overflowing when they are not. Keep the window at least
500px wide; the page fills the left `w` pixels. Use the `page_height` from the probe as `h` and as
the window height to capture the full page:

```
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --disable-gpu --hide-scrollbars --force-prefers-reduced-motion --allow-file-access-from-files --virtual-time-budget=6000 --window-size=600,9400 --screenshot=/tmp/html-page-review/page-390.png "file:///ABS/SKILL/DIR/frame.html?target=file:///ABS/PROJECT/index.html&w=390&h=9400"
```

For 768 and 1440, use a window wider than `w` (for example 800 and 1460).

Keep `--force-prefers-reduced-motion`: animated SVG images (`<img src="…svg">` with CSS animation
inside the file) stay frozen at their first frame in a headless screenshot, so cards would show
blank. With the flag, a drawing that respects reduced motion shows complete. Keep
`--virtual-time-budget`: without it Chrome captures before entrance animations finish, and
drawings show half-drawn. A tall window also stretches elements sized in `vh` (full-screen
heroes). Judge those from the probe numbers, not from the screenshot.

To view a tall screenshot section by section, slice it with one `magick` command per screenshot.
A crop with a size and no offset cuts the whole image into numbered tiles, and the `.jpg` name
converts them in the same step, so no loop or second pass is needed. `-resize 1100x` scales the
desktop tiles down in the same command: in Mistral Vibe a 1440px-wide image does not come through
inline, so the model sees nothing. Create the folder first with
`mkdir -p`. For a 390px shot through `frame.html`, first crop to the page's `w` pixels to drop the
white margin:

```
magick /tmp/html-page-review/page-1440.png -crop 1440x900 +repage -resize 1100x -quality 82 /tmp/html-page-review/seg/page-1440-%02d.jpg
magick /tmp/html-page-review/page-390.png -crop 390x+0+0 +repage -crop 390x844 +repage -quality 82 /tmp/html-page-review/seg/page-390-%02d.jpg
```

Use `magick`, not `convert` (the ImageMagick 6 name, which an allowlist for `magick` does not
cover), and no `python3`/PIL or shell loop for image work: each of those asks for approval.

If you can view images, open each screenshot and do the visual pass below. If you cannot, say so
in the review, rely on the probe, and list the screenshot paths so a human can do the visual pass.

You may not be able to tell from the inside. In Mistral Vibe, images only reach the model when its
`[[models]]` entry in `~/.vibe/config.toml` has `supports_images = true`; a model without it gets
no image, or an error such as "too large to process", and can still write a confident description.
So check before the visual pass: ask the user which model the session runs if you do not know, and
read its entry in `~/.vibe/config.toml`. Without `supports_images = true`, the visual pass is "not
done": never describe a screenshot you did not receive, and tell the user to switch with `/model`
to a model that has it (for example Mistral Large 4 or Medium 3.5) and run the review again.

## Step 3: Judge

Measurement finds faults. These need judgement; check each one:

1. **Brief fit.** Does the page serve the stated audience and lead to the main action? Are the
   sections the brief asked for all there, in a sensible order? Is the tone right?
2. **Consistency with its own system.** Every page locks a system: alignment (left or centred),
   grid, spacing scale, type scale, accent colour use. Flag what breaks it, such as a centred block
   in a left-aligned page, an accent used for body text, or a spacing value off the scale.
3. **Composition per section.** Empty areas that read as unfinished rather than calm, text
   centred vertically against a column it should align with, drawings or images that read as
   stray marks, sections with no visual weight next to dense ones.
4. **Copy and facts.** Wrong or doubtful facts: place names, districts, dates, numbers, claims.
   You may not know local facts for certain. Flag them as "verify", never as errors you assert.
   Also flag placeholder-like copy, and contact details (domains, phone numbers) that may belong
   to a real third party.
5. **Phone experience.** Reading order, what is visible above the fold, header height, tap
   targets, long words breaking the layout.
   Navigation: under the desktop breakpoint there must be a hamburger or equivalent toggle, not a
   nav row that wraps. Flag a missing one as a review note (see
   `html-to-block-theme/references/mobile-navigation.md`).
6. **Generic AI-design defaults.** If the `no-ai-design-slop` skill is available, apply its removal
   test. Do not repeat its catalogue here.

Do not re-check what the builder already verifies mechanically (contrast ratios, tag balance,
token names) unless the probe or the screenshots show a problem.

## Step 4: Write REVIEW.md

Write the review to `REVIEW.md` in the project root with `write_file`. Replace an earlier review;
the git history keeps it. Use this format:

```markdown
# Review: <page> (<date>)

Widths checked: 390, 768, 1440. Visual pass: done | not done (no image viewing; screenshots in /tmp/html-page-review/).
Brief: <file or "none found">.

## Fixed since last review
- <earlier point>: fixed

## Review notes
1. **<Section>: <problem in a few words>.** <What is wrong, with the evidence: probe finding or
   what the screenshot shows, and at which width.> Fix: <one concrete fix, or two options>.
2. ...

## Verify
- <facts or contact details a human should confirm>

## Checked and fine
- <short list of what was checked and passed, so the next round need not redo it>
```

Rules for the notes:
- Number them, most important first. At most eight; if there are more, keep the eight that matter
  most and say how many minor ones you left out.
- One problem per note, named by section, so a builder can apply "points 1–3" without guessing.
- Every note has evidence (a probe finding or something visible at a stated width) and a concrete
  fix. A note without a fix is an opinion.
- Respect the page's chosen style. "Make it more colourful" is not a note for a deliberately
  restrained design.

## Step 5: Report

In the reply, give the number of notes, the top three in one line each, and the path to
`REVIEW.md`. The builder applies them with a prompt such as:

```
Read index.html and REVIEW.md. Apply review notes 1–3 to index.html. Don't edit REVIEW.md. When done, list per note what you changed.
```
