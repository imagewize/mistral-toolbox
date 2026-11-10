# Forking a Starter Theme (e.g. Aviendha) for a Client Theme

When a conversion should start from an existing starter theme instead of an empty folder — on the
Imagewize stack that is **Aviendha** (`~/code/aviendha`, a GitHub template repository) — fork it
and rename it. Never ship a client theme that still calls itself `aviendha`.

## 1. Create the fork

- Preferred: on GitHub, **Use this template → Create a new repository** for Aviendha, then in the
  new repo run **Actions → "Rename theme from template" → Run workflow**. GitHub fires no workflow
  event at template creation, so this one step is manual. Review and merge the PR it opens.
- Working locally instead: copy the **whole** repository without its build and run output, then do
  the rename by hand as below. Copy into the folder the prompt names. Don't pick your own:

  ```bash
  rsync -a --exclude .git --exclude node_modules --exclude vendor --exclude 'sentinel-*.log.json' ~/code/aviendha/ <new-theme-dir>/
  ```

  Then check that the fork has everything the starter has. Run both and compare the lists:

  ```bash
  ls -A ~/code/aviendha
  ls -A <new-theme-dir>
  ```

  Only `.git`, `node_modules`, `vendor` and sentinel logs may be missing. A fork without
  `package.json` cannot run sentinel, one without `composer.json` / `phpcs.xml` cannot run PHPCS,
  and one without `AGENTS.md` / `CLAUDE.md` loses the instructions for the next agent.

**Never run anything inside `~/code/aviendha` itself** (no `npm install`, no sentinel, no edits).
It is the upstream starter. Tools write logs into the folder they run in, and those files end up in
the starter repository.

## 2. Rename every mechanical identifier

`aviendha` / `Aviendha` → the new slug / name, everywhere except the lineage docs in step 3:

- CSS class prefixes and keyframes: `aviendha-header`, `aviendha-eyebrow`, `aviendha-header-edge`, …
- PHP namespace and function prefix: `aviendha_*`, `Aviendha\…`
- Text domain (`Text Domain: aviendha`, `load_theme_textdomain( 'aviendha' )`)
- PHPCS prefix rule in `phpcs.xml(.dist)`
- Composer and npm package names (`composer.json`, `package.json`)
- Logo filenames in `assets/logos/` (`aviendha-rose-*.svg`) and every reference to them
- `languages/` text-domain files

Verify each pass with a grep (one command per call):

```bash
grep -rni "aviendha" --include="*.php" --include="*.css" --include="*.html" --include="*.json" --include="*.xml" --exclude-dir=node_modules --exclude-dir=vendor <new-theme-dir>
```

The only hit allowed is one lineage comment in a file header, such as
`Forked from the Aviendha starter theme`. Every identifier, slug, class, text domain and package
name must be gone.

## 3. Keep the lineage docs

Do NOT rename inside `CHANGELOG.md`, `README.md`, `readme.txt`, `AGENTS.md` and `CLAUDE.md` —
they should still name Aviendha as the theme's lineage. But reset the version to `1.0.0` in
`style.css`, `readme.txt`, `package.json` and `CHANGELOG.md`.

## 4. Hand-finished bits the rename cannot do

- `style.css` header: Theme Name, Theme URI, Description, Tags
- Replace `screenshot.png` and redraw the logo mark in `assets/logos/`
- Give the fork its own palette in `theme.json` (or a `styles/*.json` variation) from the source
  design's locked tokens
- Add a `patterns/` directory if the conversion needs patterns — then validate every pattern
  with the wp-pattern-sentinel harness already wired in `package.json` (step 5 below)

## 5. Validate every pattern with wp-pattern-sentinel (already in `package.json`)

Aviendha ships no patterns itself, but its `package.json` carries the
`@imwz/wp-pattern-sentinel` dependency and the `validate` / `validate:file` / `validate:new`
scripts, so the fork inherits a working browser-based pattern validator the moment it adds a
`patterns/` directory. **Use it — do not re-invent pattern checking, and do not rely on
`wp pattern validate` alone:** its PHP `parse_blocks()` pass never runs Gutenberg's
JavaScript `save()` serializer, so issues only the JS serializer produces (class ordering,
attribute defaults like a block's own `align`, auto-injected styles) pass that check but
still fail block validation in the real editor. Sentinel catches those by launching a real
browser, logging into WP admin, inserting the pattern into a draft page, saving it, and
reading back the actual validation/content-mismatch result.

Setup once per fork, **in the fork's own directory** (never in `~/code/aviendha`, see step 1),
then run **after every pattern iteration, not just once at the end**:

```bash
cd <new-theme-dir>
npm install
npm run setup                                  # npx playwright install chromium, once

npm run validate                               # sentinel --log patterns/ — whole directory
npm run validate:file -- patterns/hero.php     # sentinel — single file
npm run validate:new                           # only patterns changed since the last run
```

On the Imagewize stack, prefer the `--trellis` form against the real Trellis VM demo install
— never a standalone `--url`, since the demo VM is the WordPress instance the patterns are
actually exercised against (swap `--subsite` for the fork's own subsite slug):

```bash
sentinel --trellis --trellis-dir=$HOME/code/imagewize.com/trellis \
  --site=demo.imagewize.com --subsite=<new-slug> patterns/                # everything
sentinel --trellis --trellis-dir=$HOME/code/imagewize.com/trellis \
  --site=demo.imagewize.com --subsite=<new-slug> patterns/my-pattern.php   # single file
```

Sentinel writes a `sentinel-<timestamp>.log.json` into the current directory on every run. Add
`sentinel-*.log.json` to the fork's `.gitignore` before the first run, so the logs are never
committed.

Sentinel validates against a real WordPress, so the site it uses must have every plugin the
patterns need active. For a Mode B theme that is Aludra (see `references/composing-with-aludra.md`),
otherwise every `aludra/*` block fails.

## 6. Connect the fork to a site and verify

Activate the renamed theme on the local WordPress from `references/local-environment.md`
(Valet for client/shared-hosting sites, Trellis VM for pro sites):

```bash
# Valet
ln -s <new-theme-dir> "$HOME/code/<site>/wp-content/themes/<new-slug>"   # or cp -r for a one-off copy
wp theme activate <new-slug> --path="$HOME/code/<site>"
# Trellis: theme lives at ~/code/<site>/site/web/app/themes/<new-slug>
trellis vm shell --workdir /srv/www/<site>/current -- wp theme activate <new-slug> --path=web/wp
```

Use `$HOME`, not `~`, in `--path=`: the shell does not expand `~` after `=`, so
`--path=~/code/<site>` points at a folder literally named `~`.

A symlink keeps the site in step with the repository while you work. Copy instead when the site
must not change while the theme is being edited.

Then confirm: `wp theme list` shows the new name as active, no `aviendha` string remains in the
active theme's code files, the front page renders, and `debug.log` stays clean with `WP_DEBUG` on.
