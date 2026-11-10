# Forking a Starter Theme (e.g. Aviendha) for a Client Theme

When a conversion should start from an existing starter theme instead of an empty folder — on the
Imagewize stack that is **Aviendha** (`~/code/aviendha`, a GitHub template repository) — fork it
and rename it. Never ship a client theme that still calls itself `aviendha`.

## 1. Create the fork

- Preferred: on GitHub, **Use this template → Create a new repository** for Aviendha, then in the
  new repo run **Actions → "Rename theme from template" → Run workflow**. GitHub fires no workflow
  event at template creation, so this one step is manual. Review and merge the PR it opens.
- Working locally instead: `cp -r ~/code/aviendha ~/code/<new-slug>` and do the rename by hand as
  below.

## 2. Rename every mechanical identifier

`aviendha` / `Aviendha` → the new slug / name, everywhere except the lineage docs in step 3:

- CSS class prefixes and keyframes: `aviendha-header`, `aviendha-eyebrow`, `aviendha-header-edge`, …
- PHP namespace and function prefix: `aviendha_*`, `Aviendha\…`
- Text domain (`Text Domain: aviendha`, `load_theme_textdomain( 'aviendha' )`)
- PHPCS prefix rule in `phpcs.xml(.dist)`
- Composer and npm package names (`composer.json`, `package.json`)
- Logo filenames in `assets/logos/` (`aviendha-rose-*.svg`) and every reference to them
- `languages/` text-domain files

Verify each pass with a grep that must return nothing (one command per call):

```bash
grep -rn "aviendha" --include="*.php" --include="*.css" --include="*.html" --include="*.json" --include="*.xml" <new-theme-dir>
```

## 3. Keep the lineage docs

Do NOT rename inside `CHANGELOG.md`, `README.md`, `readme.txt`, `AGENTS.md` and `CLAUDE.md` —
they should still name Aviendha as the theme's lineage. But reset the version to `1.0.0` in
`style.css`, `readme.txt`, `package.json` and `CHANGELOG.md`.

## 4. Hand-finished bits the rename cannot do

- `style.css` header: Theme Name, Theme URI, Description, Tags
- Replace `screenshot.png` and redraw the logo mark in `assets/logos/`
- Give the fork its own palette in `theme.json` (or a `styles/*.json` variation) from the source
  design's locked tokens
- Add a `patterns/` directory if the conversion needs patterns — `npm run validate`
  (wp-pattern-sentinel) is already wired in `package.json`

## 5. Connect the fork to a site and verify

Activate the renamed theme on the local WordPress from `references/local-environment.md`
(Valet for client/shared-hosting sites, Trellis VM for pro sites):

```bash
# Valet
cp -r ~/code/<new-slug> ~/code/<site>/wp-content/themes/
wp theme activate <new-slug> --path=~/code/<site>
# Trellis: theme lives at ~/code/<site>/site/web/app/themes/<new-slug>
trellis vm shell --workdir /srv/www/<site>/current -- wp theme activate <new-slug> --path=web/wp
```

Then confirm: `wp theme list` shows the new name as active, no `aviendha` string remains in the
active theme's code files, the front page renders, and `debug.log` stays clean with `WP_DEBUG` on.
