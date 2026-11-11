# wp-update-round

A WordPress update round with before/after screenshots: list the updates, test them on a local copy, compare the screenshots, get a human approval, back up, deploy, and check that production matches what was tested. The step-by-step workflow the agent follows is in [SKILL.md](SKILL.md); this page covers setup.

Works with Vibe (`/wp-update-round`, or `vibe --agent wp-maintainer`) and with Claude Code, which reads the same `SKILL.md`.

A round normally runs the full screenshot path. A single semver-safe package (minor/patch, no migration, no security-relevant change in the changelog) can take the fast path in SKILL.md instead: local smoke test, deploy, WP-CLI verification — no screenshots. On shared hosts the pre-deploy backup stays mandatory even on the fast path, because there is no atomic rollback.

## Requirements

| Tool | Why | Install |
|---|---|---|
| [wp-ops](https://github.com/imagewize/wp-ops) 5.42.0+ | `update-snapshot` (screenshots) and `update-compare` (pixel diff + compare page), plus `db-pull`, `files-pull`, `db-backup` | `brew install imagewize/tap/wp-ops` |
| Playwright Chromium | used by `update-snapshot` | `npx playwright install chromium` (if missing, the command prints where to run `npm install`) |
| ImageMagick 7 | used by `update-compare` | `brew install imagemagick` |
| A local copy of the site | updates are tested there first | Trellis VM, or a Valet/other sandbox for shared-host sites |

The wp-ops MCP server is optional: the skill shows both the CLI and the MCP call for each step.

## Why every site needs a manifest

The skill is generic; the facts of one site are not. Each site gets a private `update-manifest.yml` with the things the agent must not guess and this public repository must not contain:

- **Host type** (`trellis` or `shared`): decides how updates are applied, deployed and rolled back. Shared hosts have no atomic rollback, so the backup step is mandatory there.
- **PHP and MySQL/MariaDB versions**, so the local copy can be checked for parity.
- **Local and production URLs, SSH target, WordPress root.**
- **Pages to screenshot and selectors to mask.** The same list is used for every run in a round; a different list makes the compare meaningless.
- **Skip list**, with a reason per package: majors you're not ready for, abandoned packages still in use, page builders whose next major can't read old data.
- **Cache** to purge after deploying.

Keep it in the site's own (private) repository, e.g. `.vibe/update-manifest.yml`, or in a private folder such as `~/code/site-manifests/<site>/`. One manifest per repo: when a Trellis repo hosts several sites as subtrees (`repo_subtree_path`), the repo-root `.vibe/` belongs to the flagship site — put subtree sites' manifests in `~/code/site-manifests/<site>/` or `<subtree>/.vibe/`. Without a manifest, the agent asks for these facts before starting.

## Setup for a new site

1. Copy an example and fill it in:
   - [`examples/update-manifest.trellis.yml`](examples/update-manifest.trellis.yml): Trellis/Bedrock site
   - [`examples/update-manifest.shared.yml`](examples/update-manifest.shared.yml): shared-host site
2. Copy [`examples/update-pages.txt`](examples/update-pages.txt) next to it and list one page per template: home, a service or landing page, a listing, a post, the form page, and cart/checkout on a WooCommerce site.
3. Find the selectors that change on every load (cookie button, rotating testimonials, "latest posts") and put them under `mask`. The Contact Form 7 CAPTCHA is masked by default.
4. Make sure screenshot output is gitignored.
5. Dry run: snapshot the local site twice with nothing changed and compare. Every shot should be 0.000%. If one isn't, add a mask and repeat. Then compare local against production: on a matching stack that is 0.000% too.

```bash
wp-ops update-snapshot http://example.test --out=snapshots/before --pages-file=.vibe/update-pages.txt --mask=.cookie-button
wp-ops update-snapshot http://example.test --out=snapshots/after  --pages-file=.vibe/update-pages.txt --mask=.cookie-button
wp-ops update-compare snapshots/before snapshots/after --out=snapshots/compare-local
```

## Manifest fields

| Field | Required | Meaning |
|---|---|---|
| `site` | yes | Site name, as in the wp-ops site registry |
| `host` | yes | `trellis` or `shared` |
| `php`, `mysql` | yes | Production versions, for the parity check |
| `local`, `local_url`, `prod_url` | yes | Local path and both URLs |
| `ssh` | yes | SSH target for production |
| `pages` or `pages_file` | yes | Paths to screenshot, inline or as a file |
| `mask` | no | CSS selectors hidden before capture |
| `skip` | no | Packages never updated in a round |
| `cache` | no | Cache to purge after deploying |
| `wp_root` | shared hosts | WordPress root on the server, relative to the SSH home |
| `composer_dir`, `theme_build` | Trellis | Where Composer runs, relative to the repo root (`site`; the subtree root for `repo_subtree_path` sites), and which theme to rebuild on the host |
| `snapshots`, `backups` | no | Where a round writes its folders |
| `rollback` | no | The exact rollback command |
| `webserver` | no | For the record; Nginx vs Apache rarely matters |

## Using it in Claude Code

Symlink the skill so Claude Code reads the same file:

```bash
ln -s ~/code/wp-vibe-toolbox/skills/wp-update-round ~/.claude/skills/wp-update-round
```

## What a round looks like

From the first round run with the skill (a Trellis site, six pages × desktop and mobile):

- 12 shots in about 75 seconds per run, every page 200
- local before vs after with nothing applied: 0.000% on all 12 (the capture is stable)
- local vs production: 0.000% on all 12 (the stack matches)

Screenshots prove a page looks the same. They don't prove a checkout or contact form still works; test those by hand on any WooCommerce, form or major update.
