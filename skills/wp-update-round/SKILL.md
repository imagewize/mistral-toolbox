---
name: wp-update-round
description: "Use when running a WordPress update round — orchestrating before/after screenshots, diff comparisons, human approval, and production deployment for plugins, themes, or core updates. Works with Trellis/Bedrock sites and shared-host client sites using the wp-ops screenshot commands and per-site update manifests."
user-invocable: true
license: MIT
metadata:
  version: "1.0.0"
  source: "github.com/imagewize/mistral-toolbox skills/wp-update-round (Imagewize, MIT)"
---

# WordPress Update Round

> **Model note:** Update rounds involve running shell commands against live servers. Always verify commands before executing, and never proceed without explicit user approval for destructive or production-affecting operations.

Complete workflow for running WordPress updates safely: before/after screenshots, pixel diff comparison, human review, and production deployment. Uses `wp-ops update-snapshot` and `wp-ops update-compare` from the [wp-ops](https://github.com/imagewize/wp-ops) toolkit.

## When to use

- Running plugin, theme, or core updates on a WordPress site
- Managing updates for Trellis/Bedrock sites (Composer-based)
- Managing updates for shared-host client sites (wp-admin/WP-CLI)
- Creating a repeatable, auditable update process
- Generating before/after compare pages for client communication

**Not for:** Incident response (use `incident`), general site audits (use `wordpress-plugin-audit`), or continuous deployment automation.

## Prerequisites

1. **wp-ops installed:** `brew install imagewize/tap/wp-ops` (v5.42.0 or later)
2. **Per-site manifest:** each site has an `update-manifest.yml` (see below) with host type, PHP/MySQL versions, URLs, SSH access, pages, masks and a skip list
3. **Playwright:** `npx playwright install chromium` (for screenshot capture; if missing, `update-snapshot` prints the folder to run `npm install` in)
4. **ImageMagick 7:** `brew install imagemagick` (for pixel diff)

## Two ways to call wp-ops

- **CLI:** `wp-ops <command> ...` — commands resolve by bare name (`wp-ops db-pull`, `wp-ops update-snapshot`). `wp-ops <command> --help` for flags.
- **MCP tools** (when the wp-ops MCP server is connected). Sites and environments come from the wp-ops site registry; environment keys are `development`, `staging`, `production`.
  - `wp_cli` — `site`, `env`, `args` as separate argv tokens **without** the leading `wp` and without `--path`, e.g. `wp_cli(site="example.com", env="production", args=["plugin","list","--update=available","--format=json"])`. Commands outside the read-only allowlist need `confirm: true`, only after the user approved that exact command.
  - `ssh_command` — `site`, `env`, `command` (a string), same `confirm` rule.
  - `db_backup` (`site`, `env`) streams a database export to the local machine; `db_pull` / `files_pull` sync production into development.
  - Catalog commands without their own tool (such as `update-snapshot`) run through `command_run(command="update-snapshot", args=[...])`.

`wp_cli` is an MCP tool, not a CLI command: there is no `wp-ops wp_cli`.

## Method

An update round follows this sequence. Each step is a separate command; work through them in order and stop at every approval point.

### 0. Preflight: read the manifest, list available updates

Read the site's `update-manifest.yml` first: host type, skip list, pages, masks, cache plugin.

**Trellis/Bedrock (Composer).** `composer.json` lives in the Bedrock `site/` directory, not the Trellis directory:
```bash
cd /path/to/project/site
composer outdated --direct
```

**Shared host (WP-CLI over SSH).** `cd` into the WordPress root (or pass `--path`), since a non-interactive SSH session starts in the home directory:
```bash
ssh user@example.com 'cd ~/public_html && wp plugin list --update=available --format=json'
ssh user@example.com 'cd ~/public_html && wp theme list --update=available --format=json'
ssh user@example.com 'cd ~/public_html && wp core check-update --format=json'
```
MCP equivalent: `wp_cli(site="example.com", env="production", args=["plugin","list","--update=available","--format=json"])`.

Drop everything on the skip list. Flag **major version updates** (x.0.0), WooCommerce updates, page-builder updates, and anything with database migrations. These get manual review regardless of the screenshot result.

### 1. Sync local environment

Your local copy must match production in code AND data, **including uploads**: a media file missing locally shows up as a change once it arrives.

**Trellis/Bedrock:**
```bash
wp-ops db-pull example.com production      # SSH, with URL search-replace
wp-ops files-pull example.com production   # uploads
```
(`wp-ops database-pull` is the Ansible-playbook variant of the DB pull.) MCP: `db_pull`, `files_pull`.

**Shared host (local sandbox, e.g. Valet).** Stream the dump to your machine; never write it to the client's server, and never put the database password on the command line (other users on a shared host can read it from the process list):
```bash
cd ~/code/site-sandbox
# DB credentials stay in a file on the server, e.g. ~/.my.cnf with a [client] section
ssh user@example.com 'mysqldump --single-transaction DBNAME' > dump.sql
wp db import dump.sql
wp search-replace 'https://example.com' 'http://example.test' --all-tables --precise
rsync -az user@example.com:public_html/wp-content/uploads/ wp-content/uploads/
```

Verify PHP parity:
```bash
ssh user@example.com 'php --version'               # production
php --version                                      # local (pin with: valet isolate php@8.x)
trellis vm shell -- php --version                  # Trellis (Lima) VM
```

### 2. Pages and masks from the manifest

`update-snapshot` doesn't read the manifest; pass its `pages` and `mask` as flags. Either keep a `pages.txt` next to the manifest:

```txt
# One path per line; "name|/path/" sets the file name; # starts a comment
home|/
service|/our-service/
post|/blog/a-recent-post/
contact|/contact/
shop|/shop/
product|/shop/product/test-product/
cart|/cart/
checkout|/checkout/
```

or join the manifest lists into `--pages=/,/shop/,/contact/` and `--mask=.cookie-button,.latest-posts`. Use the same pages and masks for every run in the round.

For WooCommerce sites, always include cart and checkout. For sites with forms, include the form page.

### 3. Before screenshots

```bash
wp-ops update-snapshot http://example.test \
  --out=snapshots/before \
  --pages-file=pages.txt \
  --mask=".cookie-button,.latest-posts"
```

Default viewports are desktop (1920×1080) and mobile (390×844); add `--viewports=desktop,tablet,mobile` for tablet. Each page is scrolled through and its images decoded before capture, so two runs of an unchanged page are pixel-identical. Writes PNGs and `manifest.json` (HTTP status, page size, error per shot). Exits 1 if a capture fails or a page returns 400+.

Mask anything that changes on every load (rotating testimonials, "latest posts", countdowns). The Contact Form 7 CAPTCHA is masked by default (`--no-default-mask` to keep it). `--timeout` (default 60s) caps each capture.

### 4. Apply updates locally

**Trellis/Bedrock** (in `site/`):
```bash
composer update vendor/package --with-dependencies
```
If a Sage theme was updated, rebuild it **on the host** (the Trellis VM usually has no Node/npm), or the local site may 500:
```bash
cd web/app/themes/<theme>
composer install
npm install && npm run build
```

**Shared host** (local sandbox):
```bash
cd ~/code/site-sandbox
wp plugin update plugin-name --version=X.Y.Z
wp theme update theme-name
```

For many updates, apply them in batches and run step 5 after each batch, so a change can be traced to the batch that caused it.

### 5. After screenshots + diff

```bash
wp-ops update-snapshot http://example.test \
  --out=snapshots/after \
  --pages-file=pages.txt \
  --mask=".cookie-button,.latest-posts"

wp-ops update-compare snapshots/before snapshots/after \
  --out=snapshots/compare-local \
  --title="example.com update, local"
```

This writes `snapshots/compare-local/index.html` (with `before/`, `after/`, `diff/`) — a self-contained compare page, flagged shots first. It does not open it. `--fuzz` (default 15%) sets the per-pixel color tolerance; `--threshold` (default 0.5%) is the changed-pixel share that flags a shot. Exits 1 when a shot is over the threshold or missing.

**Reading the diff:**
- **0.000%:** Nothing visible changed
- **Block of red:** Content/structure changed — investigate
- **Size changed + widespread red:** Page got taller/shorter; the change is at the first red area from the top
- **Scattered small red:** Animation, carousel, or lazy element not masked — add to `--mask` and re-capture both runs

**Important:** Screenshots only prove the page *looks* the same. They do NOT prove functionality (checkout, contact forms). Test those separately.

### 6. Human review (approval gate)

```bash
open snapshots/compare-local/index.html
```

For each flagged shot, decide:
- **Looks fine:** Visual difference is acceptable (e.g., version number in footer)
- **Needs investigation:** Unexpected change — check what updated
- **Block:** Visual breakage — do not proceed to production

Write a one-line note summarizing the review, e.g. "WooCommerce 8.6.1 → 8.7.0, Contact Form 7 6.2.4.1 → 6.2.5. All pages 0.000%."

For major updates or any doubt, test functional paths manually: submit the contact form, add a product to the cart and reach checkout, run a gateway test.

**Do not continue to step 7 without the user's explicit go-ahead.**

### 7. Back up production

**Trellis/Bedrock:** code rolls back atomically with `trellis rollback`, but the database does not. Take a DB backup when any update runs migrations (WooCommerce, page builders, major versions):
```bash
wp-ops db-backup example.com production
```
MCP: `db_backup(site="example.com", env="production")`.

**Shared host:** there is no atomic rollback. Always take both before applying, and confirm the files exist locally:
```bash
ssh user@example.com 'mysqldump --single-transaction DBNAME' | gzip > backups/example.com-$(date +%F-%H%M).sql.gz
ssh user@example.com 'tar -czf - -C public_html wp-content/plugins wp-content/themes' > backups/example.com-code-$(date +%F-%H%M).tar.gz
```

### 8. Apply to production

**Trellis/Bedrock:**
```bash
git add site/composer.json site/composer.lock
git commit -m "Update plugin-name to X.Y.Z, theme-name to A.B.C"
git push                                   # Trellis deploys from the remote
trellis deploy production example.com
```

**Shared host:**
```bash
ssh user@example.com 'cd ~/public_html && wp plugin update plugin-name --version=X.Y.Z'
ssh user@example.com 'cd ~/public_html && wp theme update theme-name'
```
MCP: `wp_cli(site="example.com", env="production", args=["plugin","update","plugin-name","--version=X.Y.Z"], confirm=true)` — only after approval.

Then purge the page cache named in the manifest (from the cache plugin's admin bar or its own WP-CLI command, if installed) and run `wp cache flush` for the object cache.

### 9. Production verification

Compare production against **local after**, not against before — the question is "is live the same as what I tested?":

```bash
wp-ops update-snapshot https://example.com \
  --out=snapshots/prod \
  --pages-file=pages.txt \
  --mask=".cookie-button,.latest-posts"

wp-ops update-compare snapshots/after snapshots/prod \
  --out=snapshots/compare-prod \
  --title="example.com update, production"
```

On a matching stack, expect 0.000% on every shot. A non-zero diff usually means:
- Page cache wasn't flushed
- Different PHP/MySQL versions between local and production
- Content changed between testing and deployment

**Trellis rollback** (code, seconds, no restore needed):
```bash
trellis rollback production example.com
```
Restore the DB backup from step 7 only if a migration ran.

**Shared-host rollback:** restore the step-7 backups:
```bash
gunzip -c backups/example.com-YYYY-MM-DD-HHMM.sql.gz | ssh user@example.com 'mysql DBNAME'
ssh user@example.com 'tar -xzf - -C public_html' < backups/example.com-code-YYYY-MM-DD-HHMM.tar.gz
```

### 10. Record the round

Append to the site's update log. For Trellis/Bedrock, the commit message is part of the record. For clients, send the compare page or key screenshots.

```markdown
## 2026-11-04 Update Round
- **Site:** example.com
- **Host:** Trellis
- **Updates:** WooCommerce 8.6.1 → 8.7.0, Contact Form 7 6.2.4.1 → 6.2.5
- **Local diff:** 0.000% all pages
- **Production diff:** 0.000% all pages
- **Duration:** 28m (local test: 12m, deploy: 2m, prod check: 5m, review: 9m)
- **Rollback:** `trellis rollback production example.com`
```

## The update-manifest.yml

Each site has a manifest that tells the round how to run. Example for a shared-host site (placeholders — keep real hosts, users and skip lists in your own private manifests, never in this skill):

```yaml
site: example.com
host: shared              # trellis | shared
webserver: apache
php: "8.4"
mysql: "8.0"
local: ~/code/example-sandbox
local_url: http://example.test
prod_url: https://example.com
ssh: user@example.com
wp_root: public_html      # WordPress root on the server, relative to the SSH home
skip: [page-builder, page-builder-woocommerce]   # never auto-update
cache: wp-rocket          # purge after update
pages: [/, /products/, /about/, /contact/, /shop/, /cart/]
mask: [.cookie-button, .latest-posts]
```

The skill uses it to:
- Pick the host-specific commands (Trellis vs shared host)
- Build `--pages`/`--pages-file` and `--mask` for every snapshot run
- Leave skipped packages out of the round
- Get the SSH target and WordPress root for shared hosts
- Know which cache to purge

## Where manifests live

Keep manifests in a private location, e.g. `~/code/site-manifests/<site>/update-manifest.yml`, and copy or symlink them into each sandbox. For Trellis sites, `.vibe/update-manifest.yml` in the project works too.

## Notes

- **Pull DB and uploads before step 3.** A missing image in local uploads shows up as a change once it arrives from production.
- **Parity:** pin PHP locally (`valet isolate php@8.x`) and match the host's MySQL/MariaDB version. Web server differences (Nginx vs Apache) rarely matter in practice.
- **No resizing:** tall pages stay full resolution; view them in the compare page, not in tools that downscale.
- **WooCommerce checkout:** screenshots of checkout need a test product/cart state. Build that against a demo store before relying on it.

## References

- [wp-ops update snapshot commands](https://github.com/imagewize/wp-ops/tree/main/scripts/updates) — the screenshot and diff scripts, flags and capture rationale
- [wp-ops README](https://github.com/imagewize/wp-ops#readme) — full wp-ops documentation
