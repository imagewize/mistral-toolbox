---
name: demo-project-setup
description: "Start a new WordPress theme project or demo the way the toolbox runs them: a project folder with the brief in README.md, an image credits table, a PROMPTS.md with one ready-to-paste Vibe prompt per stage (brief to HTML/CSS prototype, review, review notes, block-theme conversion in Mode A or Mode B with Aviendha + Aludra, design pass), a local Laravel Valet site with the required plugins, a first commit and optionally a private GitHub repository. Use when the user wants to start a new demo, client theme or HTML-to-block-theme project, asks for a PROMPTS.md or prompt plan, or asks to set up the folder, local site and repository before building."
user-invocable: true
allowed-tools:
  - read_file
  - write_file
  - bash
metadata:
  version: "1.0.1"
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

**Check the photos before writing anything.** When the visuals are photos, look at the folder
first, even when the user says the photos are there:

```bash
ls <project-dir>/images
```

If the folder is missing or empty, ask in the same question round which of these applies, and do
not assume either:

- **Photos come later.** Prompt 1 keeps the photo rule, `images/CREDITS.md` lists exactly which
  photos are needed (how many, which orientation, for which section), and the report says that
  stage 1 must wait until they are in `images/`.
- **No photos.** Prompt 1 gets the drawings rule (inline SVG or CSS compositions) instead.

If the user asked for minimal questions, take "photos come later" and say so at the top of the
reply.

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

Then check that no placeholder or template comment is left:

```bash
grep -n -e "{{" -e "<!--" <project-dir>/PROMPTS.md <project-dir>/README.md <project-dir>/images/CREDITS.md
```

It must print nothing.

**Photos already in `images/`?** (If not, follow the choice made in step 1: list the photos still
needed in `CREDITS.md` and skip this part.) List their sizes in one call:

```bash
file <project-dir>/images/*.jpg
```

A glob is fine here, it is not a loop. Each JPEG line shows its width x height (run it again with
`*.png` or `*.webp` for other formats). Add one `CREDITS.md` row per photo
with its orientation, and tell the user when an orientation the prompts need is missing (for
example a landscape photo for a full-bleed hero or a wide strip). Adjust prompt 1 to the photos
that are actually there instead of asking for ones that are not.

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
- the photos found and what is still missing (orientations, credits); when the photos come
  later, say plainly that stage 1 waits until they are in `images/` and their rows are in
  `CREDITS.md`
- the command and the prompt for stage 1:

  ```bash
  cd <project-dir>
  vibe --agent wp-frontend-builder --smart-approve
  ```

  then paste prompt 1 from `PROMPTS.md`. Each stage is a fresh session with the agent its section
  names; after each run, fill in its Result line and the table at the top.

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
