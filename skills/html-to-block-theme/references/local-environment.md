# Local WordPress Environment for Preview & Verification

A generated theme is verified on a real local WordPress, not by reading files. Pick the setup that
matches where the site will live in production — ask the user when unclear, and default to Valet
for client work:

| | Option A — Laravel Valet (default) | Option B — Trellis / Bedrock VM |
|---|---|---|
| Best for | Client sites that move to shared hosting | Pro/managed sites deployed with Trellis (e.g. Hetzner), like imagewize.com |
| Local URL | `http://<site>.test` | `http://<site>.test` |
| WP root | `<parked-dir>/<site>/`, theme in `wp-content/themes/` | `~/code/<site>/site/web/wp`, theme in `site/web/app/themes/` (host files sync into the VM) |
| WP-CLI | `wp <cmd> --path=<parked-dir>/<site>` | `cd ~/code/<site>/trellis && trellis vm shell --workdir /srv/www/<site>/current -- wp <cmd> --path=web/wp` |
| Production path | Upload to the client's shared host | `cd ~/code/<site> && trellis deploy production <site>` (deploys from GitHub) |

## Option A — Laravel Valet + WP-CLI (default for client sites)

```bash
valet park ~/code                  # once, if ~/code is not parked yet
cd ~/code
wp valet new <site-name>           # creates a WordPress install, served at http://<site-name>.test
wp valet new <site-name> --bedrock # same, but with the Bedrock structure (web root web/, themes in web/app/themes/)
```

Install and activate the generated theme:

```bash
cp -r <theme-slug> ~/code/<site-name>/wp-content/themes/
wp theme activate <theme-slug> --path="$HOME/code/<site-name>"
wp rewrite flush --hard --path="$HOME/code/<site-name>"
```

Use `$HOME`, not `~`, inside `--path=`: the shell does not expand `~` after `=`.

Useful Valet commands: `valet isolate php@8.x` pins the PHP version to match the target host,
`valet secure <site-name>` adds HTTPS, `valet links` lists the parked sites.

## Option B — Trellis / Bedrock VM (pro sites)

```bash
cd ~/code/<site>/trellis
trellis vm start                   # Lima VM (not Vagrant)
trellis vm shell --workdir /srv/www/<site>/current -- wp theme list --path=web/wp
# the theme is edited on the host at ~/code/<site>/site/web/app/themes/<slug> and syncs in
trellis vm shell --workdir /srv/www/<site>/current -- wp theme activate <slug> --path=web/wp
```

Production changes (nginx config, deploys) run via `trellis provision` / `trellis deploy` from the
Trellis directory or project root, never inside `shared/source/`.

## Verification on the local site (both options)

1. Theme activates with `WP_DEBUG` on and `debug.log` stays empty
2. Front page renders visually matching the source HTML — check at 390px and desktop widths
3. All patterns appear in the Site Editor inserter under their categories
4. No "unsupported block" warnings in the editor; browser console clean
5. `npx phpcs --standard=WordPress-Extra .` exits 0 in the theme directory

Then run the full `references/validation-checklist.md`.
