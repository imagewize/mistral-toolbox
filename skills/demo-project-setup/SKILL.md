---
name: demo-project-setup
description: "Start a new WordPress theme project or demo the way the toolbox runs them: a project folder with the brief in README.md, an image credits table, a PROMPTS.md with one ready-to-paste Vibe prompt per stage (brief to HTML/CSS prototype, review, review notes, block-theme conversion in Mode A or Mode B with Aviendha + Aludra, design pass), a local Laravel Valet site with the required plugins, a first commit and optionally a private GitHub repository. After the user downloads the photos, a follow-up run resizes them, checks them by eye on a contact sheet, fills the credits from the Unsplash filenames and fits the prototype prompt to them. Use when the user wants to start a new demo, client theme or HTML-to-block-theme project, asks for a PROMPTS.md or prompt plan, or asks to set up the folder, local site and repository before building, or says the photos have been added."
user-invocable: true
allowed-tools:
  - read_file
  - write_file
  - bash
metadata:
  version: "1.4.1"
  source: "github.com/imagewize/wp-vibe-toolbox skills/demo-project-setup"
---

# Demo project setup

Everything that has to exist before the first build run: a folder with the brief, the photos and
their credits, a `PROMPTS.md` that holds the prompt for every stage, a working local WordPress site
and a first commit. The build itself is not part of this skill. It ends by telling the user which
command and which prompt start stage 1.

`SKILL_DIR` below stands for the absolute path of this skill's folder (for example
`~/code/wp-vibe-toolbox/skills/demo-project-setup`). The templates are in `SKILL_DIR/assets/`.

## When to use

- A new demo or client theme: "set up a demo for a bakery", "start a new theme project".
- The user wants a prompt plan (`PROMPTS.md`) for the stages from brief to block theme.
- The user wants the folder, the Valet site and the repository set up before any building.
- The photos have been downloaded into `images/` after the set-up: run step 7 only.

Not for changing an existing theme or for running the build stages: those are separate runs with
`wp-frontend-builder`, using the prompts this skill writes.

## Rules

- **One command per call.** No `&&`, `;`, pipes, loops, `$(…)` or shell variables. Write absolute
  paths in full (`/Users/<user>/code/…`): `~` does not expand after `=`, as in `--path=~/…`. `cd`
  does not carry over between calls, so every command takes its target as a path argument
  (`--path=`, `--in=`, `git -C`).
- **Never invent image URLs.** Unsplash (or any stock) photo IDs made up by a model give broken
  images. The user downloads the photos; this skill only lists and checks them.
- **No real client data in the toolbox.** Everything specific to the project goes into the
  project folder, never into this skill.
- **Never run anything inside the starter theme (`~/code/aviendha`) or edit the Aludra checkout.**
  Tools write logs into the folder they run in.
- **Ask before anything outward-facing:** creating a GitHub repository and pushing.

## Step 1 — Collect the brief

Ask once, in one message, for what is missing. If the user asked for minimal questions, fill the
gaps with stated assumptions and go on.

| Field | Example | Used in |
|-------|---------|---------|
| Project folder | `~/code/bakery-demo` | everything |
| Name and place (invented for demos) | Bakkerij Lindeboom, Utrecht | README, prompts |
| What they do, size, founded | family bakery, 12 people, since 1987 | brief |
| Audience | neighbourhood customers, office caterers | brief |
| Main actions (1–2) | "Order a cake", "Visit the shop" | brief, sections |
| Tone and language | warm, plain Dutch | brief |
| Page and sections | homepage: header, hero, … footer | prompt 1 |
| Forms and their fields | order form: name, email, date, … | prompt 1, contact section |
| References: URL **and what to take from each** | `example.com`: full-bleed photos, name-only captions | prompt 1 |
| Visuals | own photos in `images/`, or inline SVG drawings | prompt 1 |
| Design-system categories to search | Food & Beverage | prompt 1 |
| Build mode | Mode A (core blocks) or Mode B (Aviendha fork + Aludra blocks) | prompt 4 |
| Local site name and theme slug | `lindeboom-demo`, `lindeboom` | setup, prompt 4 |
| GitHub repository (optional) | `<owner>/bakery-demo`, private | step 5 |

A reference URL alone is not enough: write down what to take from it (layout traits, density,
photo treatment) and that its name, logo, layout and copy are not copied. The build agent may not
be able to fetch the site, and a JavaScript-heavy page often comes back almost empty.

**Photos come after the set-up.** The usual order is: this run sets up the project, the user then
downloads the photos into `images/`, and a short follow-up run (step 7) fills in the credits and
fits prompt 1 to the photos. So an empty or missing `images/` folder is normal, not a problem.
Still look before writing anything, because the user may have added photos already:

```bash
ls <project-dir>/images
```

- **Folder missing or empty, visuals are photos:** take "photos come later". Prompt 1 keeps the
  photo rule, `images/CREDITS.md` lists exactly which photos are needed (how many, which
  orientation, for which section), and the report gives the step 7 prompt.
- **Photos already there:** handle them now as in step 7.
- **No photos at all** (the user said drawings): prompt 1 gets the drawings rule (inline SVG or CSS
  compositions), and there is no step 7.

## Step 2 — Create the folder and files

```bash
mkdir -p <project-dir>/images
git init -b main <project-dir>
```

Then write these files with `write_file`, filled from the brief:

| File | From | Notes |
|------|------|-------|
| `.gitignore` | `assets/gitignore.txt` | as is |
| `README.md` | `assets/README.template.md` | the brief; the `ux-designer` review reads it |
| `images/CREDITS.md` | `assets/CREDITS.template.md` | header only; one row per photo |
| `PROMPTS.md` | `assets/PROMPTS.template.md` | see below |

When the project uses photos, also copy the resize script:

```bash
mkdir -p <project-dir>/scripts
cp SKILL_DIR/scripts/resize-images.sh <project-dir>/scripts/resize-images.sh
```

It resizes every image in `images/` to at most 1600px wide in place (macOS `sips`;
`MAX_WIDTH=2000` to change the limit).

**Filling the templates.** Replace every `{{…}}` placeholder:

| Placeholder | Filled with |
|-------------|-------------|
| `{{NAME}}`, `{{THEME_SLUG}}`, `{{SITE}}` | the name, theme slug and Valet site name |
| `{{PROJECT_DIR}}`, `{{PROJECT_FOLDER_NAME}}` | `~/code/bakery-demo`, `bakery-demo` |
| `{{SITE_DIR}}`, `{{SITE_DIR_ABS}}` | `~/code/lindeboom-demo` and the same path written out in full, `/Users/<user>/code/lindeboom-demo` (the second goes inside `--path=`, where `~` does not expand; no `$HOME`, the agent may not expand variables) |
| `{{SITE_PLUGINS}}` | `, with Aludra and Contact Form 7`, or empty |
| `{{SITE_COMMANDS}}` | the step 3 commands as run, one per line |
| `{{SETUP_OUTCOME}}` | what step 3 to 5 produced, for example "Site returns 200, Aludra and CF7 active" |
| `{{MODE_LABEL}}` | `Mode A, core blocks` or `Mode B, Aviendha + Aludra` |
| `{{PAGE}}`, `{{WHAT_FOR}}` | `homepage`, `a family bakery` |
| `{{SUMMARY}}` | one sentence: what is built, in which mode |
| `{{BRIEF_BULLETS}}` | the brief as `- Label: text` lines, references with what to take from each and "do not copy its name, logo, layout or copy" |
| `{{SECTIONS}}` | the sections in order, forms with their fields |
| `{{VISUALS_RULE}}` | photos: "Images: use only the files in images/ (credits in images/CREDITS.md), as <img> with width, height, alt text and loading=\"lazy\" except the hero. No url() backgrounds, no external image URLs." Drawings: "Use inline SVG line drawings or CSS compositions, so the file needs no images." |
| `{{DESIGN_CATEGORIES}}` | one to three category names from `design-system-library`'s `design-systems/catalog.md` (`## Fashion & Apparel` and so on) |
| `{{FONT_AND_COLOUR_RULE}}` | the user's wishes, plus "fonts open-licence and available as woff2 (Fontsource or Google Fonts), so the block theme can bundle them" |
| `{{IMAGE_NEEDS}}`, `{{IMAGE_INSTRUCTIONS}}` | how many photos, which orientations, for which sections |
| `{{SECTION_BLOCK_MAP}}` | Mode B only, see below |

Keep exactly one of the two stage 4 variants (Mode A or Mode B) and delete the other. In Mode A,
also delete the "Starter and plugin" paragraph between the Mode B markers in stage 0. Then delete
all marker and guidance comments (`<!-- … -->`). In Mode B, fill the section-to-block list from the
blocks that exist:

```bash
ls ~/code/aludra/blocks
ls ~/code/aludra/patterns
```

Write one line per section, indented two spaces, as `  - <section>: aludra/<block> or
aludra/<block> (see <pattern>.php)`, for example
`  - campaign strip: aludra/carousel (see carousel-portfolio-showcase.php)`. Read
`html-to-block-theme/references/composing-with-aludra.md` for which block suits which section, and
only name blocks and patterns that the `ls` shows.

Match the layout the brief and the references ask for, not only the section name. The hero is the
usual trap:

| The brief asks for | Use | Not |
|--------------------|-----|-----|
| Heading and text beside a photo or drawing | `aludra/hero-split` (`section-hero-split.php`) | |
| A full-bleed photo with text over it | `core/cover`, listed as a gap; or, for several rotating photos, `aludra/carousel` with `aludra/slide` + `core/cover` (`carousel-hero-carousel.php`) | `aludra/hero-split` (the photo sits beside the text) or `aludra/hero-banner` (text only, no image) |
| Text only, no image | `aludra/hero-banner` (`section-hero-banner.php`) | |

Check a block's own description before relying on it for an image:

```bash
grep -n "description" ~/code/aludra/blocks/<block>/src/block.json
```

Then check that no placeholder or template comment is left:

```bash
grep -n -e "{{" -e "<!--" <project-dir>/PROMPTS.md <project-dir>/README.md <project-dir>/images/CREDITS.md
```

It must print nothing.

**Photos already in `images/`?** Handle them as in step 7 before the first commit. Otherwise
leave the credits table empty below its header, with the list of photos still needed above it.

## Step 3 — Local site (Laravel Valet)

Skip this step when the user has a site already, or the project deploys with Trellis (see
`html-to-block-theme/references/local-environment.md`, Option B).

```bash
wp valet new <site> --in=<parent-dir>
```

This creates `<parent-dir>/<site>` with HTTPS (no `valet secure` needed; `--unsecure` gives
HTTP) and an `admin` / `admin` login for the local site. Then make Valet serve it. Valet serves
only folders in its parked paths and links:

```bash
valet paths
```

If `<parent-dir>` is not listed, the site needs a link, or Valet answers with its own 404 page.
`valet link` only links the current directory, so either ask the user to run
`cd <parent-dir>/<site>` and `valet link <site>` in their terminal, or create the same symlink
`valet link` makes, in the Sites folder that `valet paths` printed:

```bash
ln -s <parent-dir>/<site> <valet-sites-dir>/<site>
```

**Plugins for Mode B** (Aludra, and Contact Form 7 when a section has a form):

```bash
wp plugin install contact-form-7 --activate --path=<parent-dir>/<site>
ln -s <aludra-dir> <parent-dir>/<site>/wp-content/plugins/aludra
wp plugin activate aludra --path=<parent-dir>/<site>
```

The symlink makes the site run the Aludra working copy, so a block fix shows on the next page load
and the build agent copies markup from the same version the site runs. Two consequences to tell
the user: a change made through the site's plugin folder lands in the Aludra repository, and a
stale build breaks the site, so check that the blocks are built (`ls <aludra-dir>/blocks/hero-banner`
shows a `build` folder). Prefer `wp plugin install aludra` when the user wants the released
version instead.

**Check:**

```bash
curl -s -o /dev/null -w "%{http_code}\n" https://<site>.test/
wp plugin list --path=<parent-dir>/<site> --fields=name,status,version
```

The first must print `200`. Fix a `404` (missing link) before going on.

## Step 4 — First commit

```bash
git -C <project-dir> add -A
git -C <project-dir> commit -m "chore: set up <name> demo with brief and prompts"
```

Check `git -C <project-dir> status --short` first and look at any file you did not write (a
script or photos the user added) before committing it. No AI attribution in the commit message.

## Step 5 — GitHub repository (only when asked)

Ask for the owner and whether the repository is private (default: private). Then:

```bash
gh repo create <owner>/<repo> --private --source=<project-dir> --remote=origin --push
```

Photos from Unsplash may be committed to a private repository; for a public one, check the
licence of every image and keep `CREDITS.md` complete.

## Step 6 — Report

- the folder, the files written and the commit
- the local URL and the plugin list
- the photos found and what is still missing (orientations, credits)
- what comes next:
  - **Photos come later:** the list of photos to download (how many, orientation, section, about
    1600px wide, Unsplash's own download names kept), then the step 7 run in a fresh session:

    ```bash
    cd <project-dir>
    vibe --agent wp-frontend-builder --smart-approve
    ```

    ```
    Load demo-project-setup. Photos added to images/: fill in CREDITS.md, fit prompt 1 to the photos and commit.
    ```

    Say plainly that stage 1 waits until that run is done.
  - **Photos in place or no photos:** the same command, then paste prompt 1 from `PROMPTS.md`.
    Each stage is a fresh session with the agent its section names; after each run, fill in its
    Result line and the table at the top.

## Step 7 — Photos added (follow-up run)

Run when the user has downloaded the photos into `images/` after the set-up, or in step 2 when
they were there already. Read `PROMPTS.md`, `README.md` and `images/CREDITS.md` first.

**1. Resize**, if the project has the script:

```bash
<project-dir>/scripts/resize-images.sh
```

**2. List sizes** in one call per format (a glob is fine, it is not a loop):

```bash
file <project-dir>/images/*.jpg
```

Each JPEG line shows width x height; run it again with `*.png` or `*.webp` if those exist. Portrait
is taller than wide, landscape wider than tall.

**3. Credits from the filenames.** Unsplash names a download
`<photographer-name>-<photo-id>-unsplash.jpg`. The photo ID is always the last 11 characters before
`-unsplash` and may itself contain `-` or `_`: in `rafaella-mendes-diniz-AoL-mVxprmk-unsplash.jpg`
the ID is `AoL-mVxprmk` and the photographer is Rafaella Mendes Diniz. Write one row per photo:

| File | Orientation | Use | Photographer | Unsplash URL |
|------|-------------|-----|--------------|--------------|
| `rafaella-mendes-diniz-AoL-mVxprmk-unsplash.jpg` | portrait | featured models | Rafaella Mendes Diniz | https://unsplash.com/photos/AoL-mVxprmk |

Capitalise the name from the filename; it may lose accents or a surname particle, so tell the user
to check names that look odd. For a file that does not follow the Unsplash pattern, leave
Photographer and URL empty and list it in the report: never guess a name or an ID. Remove the
"photos still needed" list once every need is covered, or shorten it to what is still missing.

**4. Look at the photos.** Orientation alone is not enough: a landscape photo of a man with a phone
is not a bakery hero. And looking is easy to get wrong: on the first real run the agent scrolled a
contact sheet in four slices, reported that it had checked every photo, and still described most of
them wrongly (it called a row of cupcakes "bread and butter on a work table" and made it the hero).
The likeliest cause: that session ran a model without image support (in Vibe, no
`supports_images = true` in its `[[models]]` entry), so no image ever reached it and it described
photos it had not seen. Scrolling in slices may have added to it.

**First, can this session see images?** If you do not know which model the session runs, ask the
user. Read its `[[models]]` entry in `~/.vibe/config.toml`. Without `supports_images = true`, do
not build the sheet: write "uses by orientation only, not checked by eye" above the credits table,
assign by orientation, and tell the user to run this step again after switching with `/model` to a
model that has it (for example Mistral Large 4 or Medium 3.5). A screenshot tool that returns an error or
"too large to process" also means you did not see it.

With image support, build the sheet so a photo cannot be mixed up with its neighbour:

- Write `<project-dir>/contact-sheet.html` with `write_file`: a grid of 4 columns, one `<figure>`
  per photo, `<img src="images/<file>">` 300px wide and 220px high with `object-fit: contain`, and
  a large tile number (1, 2, 3 …) plus the filename as `<figcaption>` directly under each image.
- Below the grid, a numbered list: tile number, filename.
- Take **one** screenshot of the whole sheet, not slices. Each row of 4 is about 210px high, so set
  the window height to about 210 × rows + 200 (2400 fits 32 photos). Absolute paths; on Linux the
  binary is `google-chrome` or `chromium`:

```bash
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless --hide-scrollbars --window-size=1400,2400 --screenshot=<project-dir>/contact-sheet.png file://<project-dir>/contact-sheet.html
```

Open the PNG with `read_file`. Prefer it to browser tools: the headless screenshot needs no
extension and shows the whole sheet at once, and a browser-tool screenshot reaches the model the same
way, so it needs the same image support. Describe each tile by its number first, then
look the filename up in the list; never describe a filename from memory. Before writing the
credits, look again at every photo you are about to name as a primary (hero, first card, workshop,
about, shop front) and confirm its description matches. Then delete both files:

```bash
rm <project-dir>/contact-sheet.html <project-dir>/contact-sheet.png
```

If neither way shows you the images, say so plainly: write "uses by orientation only, not checked
by eye" above the credits table, and ask the user to look at the photos before stage 1. Never
describe a photo you have not seen; an Unsplash URL slug is a hint, not a check.

**5. Assign a use** to each photo from what it shows, its orientation and the sections in prompt 1
(landscape for the hero and wide strips, portrait for cards). Put the subject in the Use column
("cake card — layered cream cake"). Name one primary photo per section and the rest as alternates;
mark a photo that fits no section as "spare — <why>" so the build skips it. If an orientation or a
subject the sections need is missing, say which, and adjust prompt 1 instead of asking for photos
that are not there (for example: build the campaign strip from portrait crops, or shorten it).

**6. Fit prompt 1.** Name the hero file and the primary photo per section in it. Check the hero
block in prompt 4 against the hero photo: a full-bleed photo needs `core/cover` or the hero
carousel, not `aludra/hero-split` (see the table in step 2), so fix that line too. Check that no
placeholder is left, as in step 2.

**7. Commit:**

Check `git -C <project-dir> status --short` first (the contact sheet must be gone), then stage only
the photos, the credits and the prompts (a folder argument, not `-A`, so nothing else slips in):

```bash
git -C <project-dir> add images PROMPTS.md
git -C <project-dir> commit -m "chore: add photos and credits"
```

Push only if the project has a remote and the user asked for it.

**8. Report** the primary photo per section, the spares and why, whether the photos were checked by
eye, the names to check, any missing orientation or subject, and how prompts 1 and 4 changed, then
the command and prompt 1 for stage 1. Ask the user to open the primaries before stage 1: the build
writes alt text and picks crops from these descriptions, so a wrong one ends up on the page.

## Files

| File | What it is |
|------|------------|
| `assets/PROMPTS.template.md` | Stage plan with prompts 1–5, a status table and "why it is written this way" notes, Mode A and Mode B variants for stage 4 |
| `assets/README.template.md` | Project README holding the brief |
| `assets/CREDITS.template.md` | Image credits table |
| `assets/gitignore.txt` | `.gitignore` for a theme project (node_modules, vendor, sentinel logs) |
| `scripts/resize-images.sh` | Resizes `images/` to at most 1600px wide (macOS `sips`) |

A filled-in example of this setup, with every run recorded, is the
[Architect Demo `PROMPTS.md`](https://github.com/imagewize/architect-demo/blob/main/PROMPTS.md).
