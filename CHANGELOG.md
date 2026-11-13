# Changelog

All notable changes to the wp-vibe-toolbox repository (formerly mistral-toolbox) will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- `html-page-review` (1.4.0): `measure.mjs`, a script that measures a live site (`https://` or `file://`) at an exact viewport width in its own headless Chrome. It can click or hover first (an open mobile menu, a hover colour) and prints JSON per selector: box, visibility, hover state, classes and computed styles, plus `scrollWidth`. Node 22+ (built-in `fetch` and `WebSocket`), no npm packages, a throwaway Chrome profile deleted on exit, and it only reads the page. `probe.html` cannot do this for a live site: an `https://` page in its `file://` iframe is cross-origin. `html-to-block-theme` (1.7.1), `references/mobile-navigation.md` and `wp-frontend-builder` (and its generated `-subagent` copy) use it to measure the source and the site before and after an edit and to confirm hovers. `docs/install.md` allowlists the script by its full path, not `node`. Tested on the bakery demo against browser measurements: open-menu panel `rgb(245, 235, 217)`, links at x = 20, CTA x 20–360.3 and 62px tall, `border-box`, no horizontal scroll; the header button hovered `rgb(227, 210, 172)` with a 0.15s transition. On the prototype it found three differences no one had caught by eye: menu links 48px tall (theme 64px), rows 56px apart (theme about 88px), and a 48px CTA reaching x = 370 (theme 62px, to 360). Before this, the agent in that run wrote its own DevTools script (approval for `node *`) and reported layout values it had not measured, and the user measured every fix by hand.

### Changed

- `html-to-block-theme` (1.8.0): "port by value, never by name" now covers every `--wp--preset--*` token, not only colours (`SKILL.md`, `references/composing-with-aludra.md` steps 3 and 5). Two traps are added. A numbered spacing slug the source uses (`spacing--20` to `--80`) that the theme does not define gets WordPress's default scale value, so define the source's slugs in `spacingSizes` with its values (optionally `"spacingScale": { "steps": 0 }`). Fluid type (`typography.fluid: true`) outputs a fixed `fontSizes` value as a `clamp()`, so turn it off for fixed sizes. Check 6 is now "tokens by value": list the tokens the design layer uses, the definitions WordPress serves (`curl … | grep -o -e "--wp--preset--spacing--[a-z0-9-]*: [^;]*" …`, where the `: ` skips the `var()` fallbacks in block CSS), and compare with the source's `:root`. It also validates `theme.json` with the allowlisted `jq empty` instead of `php -r`. From the bakery demo stage 6 comparison: the design layer used `spacing--20`…`--80` 38 times while the theme had only the starter's named sizes, so WordPress served 0.44–5.06rem instead of 0.5–6rem, and every padding and gap was 25–33% tighter. Fluid type served `medium` (17px in the source) as `clamp(14px, …, 20px)`.
- `html-to-block-theme` (1.7.0), Mode B conversion, from the bakery demo design pass, where five rounds went into things the conversion had baked in:
  - Colours port by value, never by name (`SKILL.md`, `references/composing-with-aludra.md` step 3): a source that already uses `--wp--preset--color--*` names can mean another colour by the same slug. The mapping goes at the top of the design layer, with every name that differs marked. A design-layer rule copied as `var(--wp--preset--color--secondary)` painted the mobile menu brown instead of cream (menu text 2.35:1).
  - Two new checks in step 5: every colour variable in the design layer resolves to the source value, and every source `:hover`/`:focus` rule has a counterpart in the generated CSS or the design layer.
  - The report also goes to `conversion-report.md` in the project root, with the differing token names and the state check, so the design pass starts from it. The stage 4 report was lost with its session.
  - The design pass after the conversion runs in two kinds of rounds, never mixed: compare with a numbered list and no edits, then apply the numbers the user picks. A layout value not measured after the edit is reported as "expected".
  - `references/mobile-navigation.md`: a side gutter for the left-aligned overlay links, and a CTA in the panel needs `justify-content: flex-start` on the item, `flex: 1 1 auto` and centring on the link, and `box-sizing: border-box`. Core's link is `content-box`, so a full-width button grew from 340px to 396px wide and from 62px to 96px tall. Measure the open menu instead of estimating. The hard-reload note now points to versioning `style.css` by file time.
  - `references/forking-a-starter-theme.md`: version `style.css` with `filemtime( get_template_directory() … )` rather than the theme version, which never changes the URL while you work. Also: a fork in a subfolder of a project repository has workflows that GitHub does not run.

### Fixed

- Shell variables and timeouts: `wp-frontend-builder` (and its generated `-subagent` copy) now opens its shell rules with "no shell variables, ever", with full-path examples, and runs one heavy command (Chrome screenshot, `magick` slice) per call. `html-page-review` (1.4.1, step 2) says one `magick` per call and paths in full. `docs/install.md` recommends `default_timeout = 120` in `[tools.bash]`. From the bakery demo comparison run (Mistral Large 4, Vibe 3.1.2): the third session in a row shortened paths to `C=/tmp/shots/compare`, `CHROME=…` and `SKILL=…`, so every command asked for approval although the rule to write paths in full was in the profile. The run also chained six `magick` slices of 9,000px screenshots in one call, which passed the default 30-second timeout and was killed.
- Hover and focus checks: `html-to-block-theme` (1.6.4) and `wp-frontend-builder` (and its generated `-subagent` copy) compare `:hover` and `:focus` rules from the CSS: the source's with `grep` on `index.html`, the theme's with `curl -s https://<site>/ | grep -o ':hover[^}]*}'` (inline styles generated from `theme.json`) and `grep` on `style.css`. They forbid a DevTools-protocol or websocket script, and `node` or `python3`, to hover in a browser. `references/composing-with-aludra.md` says that hover colours in `styles.elements` go under `color`: a `"background"` key directly under `:hover` is ignored. From the bakery demo, where primary buttons kept their colour on hover for that reason, and the stage 5 agent, unable to hover with the browser extension, probed `node` and Python websocket libraries for its own DevTools script (approval for `node *`).

- Screenshot slicing: `html-page-review` (1.3.2, step 2), `html-to-block-theme` (1.6.3) and `wp-frontend-builder` (and its generated `-subagent` copy) now name one `magick … -crop WxH +repage -quality 82 …-%02d.jpg` command that cuts a full-page screenshot into numbered JPG tiles (desktop tiles scaled with `-resize 1100x`, because a 1440px-wide image does not come through inline in Vibe), with a first `-crop 390x+0+0 +repage` to drop the white margin of a `frame.html` phone shot. They say to use `magick`, not `convert`, `python3`/PIL or a shell loop, which all prompt. From the bakery demo stage 5 run (Mistral Large 4, Vibe 3.1.2), where no skill named a crop command, so the agent probed `python3 -c "import PIL"` (approval for `python3 *`) and then converted the slices with a `for` loop and `convert` (approval for the loop and parameter expansion), then scaled them down with a second loop, although `magick` was on the allowlist.
- `theme-style-options` (1.0.2), `scripts/options.mjs fonts`: `--body NAME` without a weight loaded the 700 heading default, so body text in every card rendered bold (seen with `--body Poppins`, a static family). Body fonts now default to 400; `--body Name:weight` still picks another weight.

## [1.19.1] - 2026-11-12

### Fixed

- `docs/install.md`, "Paths outside the project": the example allowlist adds headless Chrome (`"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new`, so Chrome with other options first still prompts) and read-only wp-cli calls (`wp option get`, `wp option list`, `wp post list`, `wp post get`, `wp plugin list`, `wp theme list`, `wp --info`; writes keep prompting). It also notes that Vibe prompts for `echo ===` but not for `echo ---`. `wp-frontend-builder` (and its generated `-subagent` copy) separates command output with `echo ---`. From the bakery demo stage 4 run, checked against Vibe 3.1.2: with the folder grants in place, the remaining prompts were about 20 Chrome screenshot calls, the wp-cli reads and `echo ===` separators.
- `docs/install.md`, "Paths outside the project": the example grants `/private/tmp` in the shell and `read_file` allowlists, because `wp-frontend-builder` and `html-page-review` write their screenshots to `/tmp` and read them back, so every visual check prompted. It explains why the grant names `/private/tmp` on macOS (`/tmp` is a link), that an older `/private/tmp/*` entry does not cover `cd /tmp`, and that allowing `magick` for screenshot crops lets it overwrite images in any granted folder. From the bakery demo, where image reads and a `cd /tmp && magick … -crop …` call prompted.

## [1.19.0] - 2026-11-12

### Fixed

- Approval prompts: `--smart-approve` does nothing next to `--agent wp-frontend-builder` (or any custom agent), because Vibe runs the classifier only while the active agent is `smart-approve` (checked with Vibe 3.1.2). `docs/install.md`, `docs/agents.md`, `agents/README.md` and `demo-project-setup` (1.4.2: `SKILL.md`, `assets/PROMPTS.template.md`) drop the flag from the start commands. `docs/install.md` corrects the chaining advice (Vibe checks each command in a `|`, `;` or `&&` chain against the allowlist; variables and redirects still prompt) and documents `vibe-path:directory_recursive:` grants for folders outside the project, such as other repositories, the local site's WordPress files and the Desktop, with `sed -n` instead of `sed`. From the bakery demo, where allowlisted `grep` and `sed -n` calls on the lindeboom-demo core CSS and a Desktop screenshot prompted every time.
- `wp-frontend-builder` (and its generated `-subagent` copy): the shell rule no longer forbids `|`, `;` and `&&` chains, which Vibe 3.1.2 checks command by command. It still forbids shell variables, `$(…)` and `>` redirects, which always prompt, and `sed -i` outside the project. When a path outside the project prompts, the agent names the folder so the user can grant it.
- Model advice: Mistral Large 4 with `supports_images = true` is now the recommended model for every stage, so one model builds, fixes and looks. `docs/install.md` shows the preset and how to check that images arrive, and says GLM 5.3 is text-only. `agents/README.md` ("Which model") and `demo-project-setup` (1.4.1) `assets/PROMPTS.template.md` drop the "GLM for code, `/model mistral-medium-3.5` for visual steps" split. `demo-project-setup`, `html-page-review` (1.3.1) and `wp-frontend-builder` name Large 4 or Medium 3.5 as examples of a model with image support, and the agent may not test image support by taking a screenshot. From the bakery demo, where a GLM 5.3 session reported a section-by-section visual match for a block theme whose hero text was unreadable.
- `html-to-block-theme` (1.6.2), `references/composing-with-aludra.md`: a Contact Form 7 shortcode in a `core/shortcode` block inside a pattern that a template includes by slug prints as raw text, because the template runs `do_shortcode()` before `do_blocks()` expands the pattern. The note gives the two fixes (shortcode block in the template, or a `render_block` filter for `core/shortcode`). From the bakery demo, where the agent blamed a WordPress 7.1 change.

### Changed

- `demo-project-setup` (1.4.0), `assets/PROMPTS.template.md`: every stage says which model to use. A fast coding model such as GLM builds and fixes; the review (stage 2) runs after `/model mistral-medium-3.5`, or another model with `supports_images = true`, with what a good run looks like and the permission prompt for the toolbox's `probe.html` and `frame.html`; stages 3–5 switch to that model in the same session for the screenshot comparison. The screenshot steps in prompts 4 and 5 (and the Mode A variant) take the 390px screenshot through `html-page-review/frame.html`, never `--window-size=390`. From the bakery demo, where the build ran on GLM without a visual check and the review needed Medium 3.5
- `agents/README.md`, Running the agents: a "Which model for which step" paragraph, and prompt template 1 takes its 390px screenshot through `frame.html`

## [1.18.0] - 2026-11-12

Visual checks got honest. The bakery demo's first runs showed two ways an agent can report confidently on images it never really saw: a model without image support in Vibe (GLM) "checked" 21 photos by eye and described most of them wrongly, and phone screenshots taken with `--window-size=390` were really 500px layouts with the right side cut off. The agents and skills now check image support before any visual step, take phone screenshots through an iframe at the exact width, and the photo follow-up of `demo-project-setup` builds a numbered contact sheet and picks the hero block to match the brief.

**Upgrading a local clone:** re-run the `agents/` sync (`rsync -a ~/code/wp-vibe-toolbox/agents/ ~/.vibe/agents/`) and `/reload`, so `wp-frontend-builder` picks up the visual-check rules.

### Changed

- `demo-project-setup` (1.2.0): the photo follow-up run looks at the photos. It builds a numbered contact sheet (4 columns, tile number and filename under each image, a number-to-filename list below), takes one headless Chrome screenshot of the whole sheet, describes each tile by number before looking up its filename, and checks every primary photo a second time before writing the credits; without a way to view images it writes "uses by orientation only, not checked by eye". The Use column holds the subject, one primary per section, the rest alternates, and off-brief photos are marked spare. On the bakery demo's first run the agent scrolled a sheet in four slices, said it had checked every photo, and described most of them wrongly, including the hero (a row of cupcakes recorded as "bread and butter on a work table"). The report now asks the user to open the primaries before stage 1
- `demo-project-setup` (1.2.0): the Mode B block map follows the layout the brief asks for, with a hero table: text beside a photo is `aludra/hero-split`, a full-bleed photo is `core/cover` (a gap) or the hero carousel (`aludra/carousel` + `aludra/slide` + `core/cover`), text only is `aludra/hero-banner`, which holds no image. The follow-up run checks prompt 4's hero block against the chosen hero photo

### Fixed

- Visual checks need a model that can see images. In Vibe, images reach the model only when its `[[models]]` entry has `supports_images = true`; GLM (`zai-glm-5-3`) and `mistral-large-4` presets have none. The bakery demo's photo follow-up ran on GLM, reported checking 21 photos by eye and described most of them wrongly, and a later GLM session said a screenshot "came through as a raw image payload (too large to process)". The likeliest cause of the wrong photo credits is that no image reached the model, not only the scrolled contact sheet that 1.2.0 blamed
  - `demo-project-setup` (1.3.0), step 7: checks the session model's `supports_images` before building the contact sheet; without it, assigns by orientation, writes "not checked by eye" and asks the user to rerun the step after `/model mistral-medium-3.5`. Prefers the headless Chrome screenshot over browser tools, whose screenshots reach the model the same way
  - `html-page-review` (1.2.0): the same check before the visual pass; without image support the pass is "not done" and the user is told to switch model
  - `wp-frontend-builder` (and its subagent copy): a "Screenshots and visual checks" rule. One headless Chrome command per width, no DevTools-protocol scripts and no dependence on the browser extension (it was disconnected, and cannot resize the window); measure what can be measured; never describe a screenshot or photo without image support, and ask the user to switch model for the visual part. The mobile check and the Mode B checks point to it
- `docs/install.md`: the GLM preset notes that GLM cannot look at images in Vibe and when to switch to `mistral-medium-3.5`
- Phone screenshots were taken at the wrong width. Headless Chrome on macOS will not make its window narrower than 500px, so `--window-size=390,…` laid the page out at 500px (`innerWidth` measured 500) and the screenshot cut off its right side: on the bakery demo the hamburger, the end of the headline and the second hero button seemed missing or overflowing, while at a real 390px the page was fine. New `html-page-review/frame.html` shows a page in an iframe at an exact width (`frame.html?target=…&w=390&h=…`), screenshotted with a wider window; works for `file://` pages and local `https://` sites
  - `html-page-review` (1.3.0), step 2: screenshots through `frame.html`. The probe already measured in an iframe, so its findings were right; only the screenshots were affected
  - `wp-frontend-builder` (and its subagent copy): the screenshot example uses `frame.html` and says never to set a phone width with `--window-size` alone
  - `html-to-block-theme` (1.6.1), `references/composing-with-aludra.md`: the 390px source and site screenshots use `frame.html`

## [1.17.0] - 2026-11-12

A new skill sets up a theme project or demo before the first build run: the brief, a `PROMPTS.md` with the prompt for every stage, a local Valet site with the plugins and a first commit. Its first real run (a bakery demo) changed the order: the agent now sets up first, the user adds the photos after, and a short follow-up run fills the image credits from Unsplash's filenames.

**Upgrading a local clone:** re-run the `agents/` sync (`rsync -a ~/code/wp-vibe-toolbox/agents/ ~/.vibe/agents/`) and `/reload`, so `wp-frontend-builder` can load `demo-project-setup`. The skill itself needs no step.

### Added

- `demo-project-setup` (1.0.0): sets up a theme project or demo before the first build run. It collects the brief (references with what to take from each, not only a URL), writes `README.md`, `images/CREDITS.md`, `.gitignore` and a `PROMPTS.md` from `assets/PROMPTS.template.md` with one ready-to-paste prompt per stage (prototype, `ux-designer` review, review notes, block-theme conversion in Mode A or Mode B with a section-to-Aludra-block map from the blocks that exist, design pass), each with its own `vibe --agent` command. Then a Valet site with `wp valet new --in` (HTTPS by default, so no `valet secure`), a link when the parent folder is not parked (otherwise Valet answers with its 404 page), Contact Form 7 and a symlinked Aludra working copy for Mode B, a 200 check, a first commit and, only when asked, a private GitHub repository. Never invents stock photo URLs: the user downloads the photos, the skill lists their sizes with `file` and flags missing orientations. Ships `scripts/resize-images.sh` (macOS `sips`, at most 1600px wide). Based on the setup of the model agency demo
- `wp-frontend-builder` (and its subagent copy) loads `demo-project-setup` for a new project, and ends that run with the stage 1 command and prompt instead of building
- `agents/README.md`: prompt template 0 for a new project; `docs/workflow.md`: a set-up step before design

### Changed

- `demo-project-setup` (1.1.0): photos come after the set-up by default. The set-up run lists the photos still needed in `images/CREDITS.md` and ends with a follow-up prompt; after the user downloads the photos, that follow-up run (new step 7) resizes them, reads their sizes with `file`, fills the credits table from Unsplash's download names (photographer from the name, photo ID from the last 11 characters before `-unsplash`, so `https://unsplash.com/photos/<id>`; never a guessed name or ID for other files), assigns each photo a use by orientation, fits prompt 1 to what is there and commits only `images/` and `PROMPTS.md`. An empty `images/` folder is no longer a question in the brief round

### Fixed

- `demo-project-setup` (1.0.1): checks `images/` with `ls` before writing anything, even when the prompt says the photos are there. On its first run the prompt said "Photos are in ~/code/bakery-demo/images", the folder did not exist, and the skill created it empty and only flagged that at the end. Now an empty or missing folder is a question in the brief round: photos come later (prompt 1 keeps the photo rule, `CREDITS.md` lists the photos still needed, and the report says stage 1 waits for them) or no photos (prompt 1 gets the drawings rule). With minimal questions it takes "photos come later" and says so

## [1.16.0] - 2026-11-12

A new skill turns open design choices in a block theme into option sheets a client can pick from, and the install docs explain how to pin a model to one agent. On its first runs the skill found real Twilight contrast bugs in two themes: a 1.1:1 footer in Ecotuin and a 1.9:1 sidebar CTA hover in Aviendha.

**Upgrading a local clone:** re-run the `agents/` sync (`rsync -a ~/code/wp-vibe-toolbox/agents/ ~/.vibe/agents/`) and `/reload`, so `wp-frontend-builder` can load `theme-style-options`. The skill itself needs no step.

### Added

- `theme-style-options` (1.0.0): option sheets for a block theme that a client can pick from. `scripts/options.mjs colors` renders one mini page per style variation (theme.json merged with `styles/*.json` the way WordPress does it: objects merge, arrays such as the palette are replaced) with header, hero and buttons, a dark band, a tinted section, the footer, a palette strip and measured contrast for button, body, band and footer text, flagged red under 4.5:1. The band, tint and footer roles are detected from the parts and the slugs that patterns use, with `--roles` to override. `scripts/options.mjs fonts` compares Fontsource heading-font candidates (variable axes such as `SOFT=100+WONK=1` supported, licence shown per card) with the theme's current heading font. Both write a portable HTML file plus `fonts/` and take the PNG with Chrome headless, so no npm install is needed. The workflow writes every color option as a real style variation, so the client's pick is already theme code
- `wp-frontend-builder` (and its subagent copy) loads `theme-style-options` when a client has to choose a heading font or colors for an existing block theme
- `docs/install.md`: how to pin a model to one agent (`active_model` in the profile) without letting the fork go stale: generate it from the base profile after every `git pull`, or set `active_model` in `~/.vibe/config.toml` instead

### Fixed

- `theme-style-options` (1.0.1): a header or footer part that sets no text or background color now inherits the body colors, as it does in WordPress. Before, the footer text fell back to the palette's light color, so a footer with only a light background (Aviendha's `tertiary`) was drawn and measured as light on light and flagged a false 1.1:1. `SKILL.md` also notes that a variation's `css` rules aimed at the theme's own classes don't reach the mock page, so a fix made that way has to be confirmed on the site

## [1.15.0] - 2026-11-11

Headers keep their mobile menu, and `wp-update-round` checks HTTPS and mixed content after a round. The Kadewerk conversion lost its hamburger because the HTML prototype had none and the header part was copied as `overlayMenu: "never"`. The skills and the `wp-frontend-builder` agent now require a mobile menu in the prototype and the theme, and the agents README says how to start a session and what to put in the first prompt.

**Upgrading a local clone:** re-run the `agents/` sync (`rsync -a ~/code/wp-vibe-toolbox/agents/ ~/.vibe/agents/`) and `/reload`, so `wp-frontend-builder` picks up the mobile check. Skills need no step.

### Added

- `wp-update-round` (1.2.0), step 5b: an HTTPS and mixed-content check for production after a round or after any SSL / `WP_HOME` change. `openssl s_client` (with `-servername`) shows the served certificate, `curl` without `-k` proves the chain, and a per-page grep finds `http://` resources in the HTML. Notes that a connection reset right after an SSL change usually means the vhost is reloading, and that the browser console still has to be checked for resources loaded by CSS or JS. The fast path now points at it
- `html-to-block-theme` (1.6.0), `references/mobile-navigation.md`: a basic no-JS `<details>` hamburger for the HTML prototype (three lines of script keep it open on desktop); the options (collapse below 1024px, always, never; `menu` or `handle` icon) and how they map to `overlayMenu` on `core/navigation`; a 375/800/1280px check (hamburger under the breakpoint, one-row header at every width, no horizontal scroll, hide the header CTA under 600px and keep its label on one line); conversion rules (header `mobile`, footer `never`, CTA before the navigation, delete the prototype's nav-row CSS, scope `ul` flex rules to the closed state, hard-reload before judging CSS); and a section on styling the overlay (ink panel, CSS-counter folio numbers, an overlay-only CTA item, and the two traps: core's `!important` colours and the `<li>` flex box ignoring `text-align`)
- `agents/README.md`, "Running the agents": `vibe --agent wp-frontend-builder --smart-approve` (`--agent` replaces the default smart-approve agent), re-sync and wiring check, what a good first prompt contains, and three prompt templates for `wp-frontend-builder` (brief to HTML prototype, prototype to block theme with the design layer and mobile menu, change requests). `docs/agents.md` links to it

### Changed

- `wp-frontend-builder` (and its subagent copy): a mobile check on every HTML/CSS build with a header navigation, at 375, 800 and 1280px, and a rule never to copy a prototype's missing hamburger into the theme as `overlayMenu: "never"`
- `html-page-review` (1.1.0): the phone-experience check flags a header navigation that has no hamburger or toggle under the desktop breakpoint
- `html-to-block-theme`, `references/composing-with-aludra.md` (Header step) and `references/block-conversion-map.md` (Navigation): keep the hamburger, `never` only for footer navigation
- README shortened for WordPress developers and agencies: a three-point pitch, a compact design → publish table, the demo, Quick start and counts. The details moved to new docs pages: `docs/workflow.md` (the full workflow table, Aviendha and Aludra, the `architect-demo` case study), `docs/principles.md` (design principles) and `docs/credits.md` (upstream collections, logo credit, resources). `docs/install.md` links point to the new pages and keep the `rsync --delete` caveat; `AGENTS.md` names the new files in its README sync rules. Section headings and the "What's inside" table no longer carry emoji, so the Quick start anchor is now `#quick-start`

## [1.14.0] - 2026-11-11

The repository is now `wp-vibe-toolbox` (renamed from `mistral-toolbox`), the README is written for WordPress developers, and the Mode B (Aviendha + Aludra) skill and agent carry the fixes from the Kadewerk run: selector specificity, Contact Form 7 markup and template, grid layout classes, scroll-triggered SVG animation, the required-plugin notice, and sentinel and PHPCS checks. New install docs cover a GLM model preset and a pinned smart-approve classifier.

**Upgrading a local clone:** rename the directory to `wp-vibe-toolbox`, run `git remote set-url origin git@github.com:imagewize/wp-vibe-toolbox.git`, and change `skill_paths` in `~/.vibe/config.toml` (and any `rsync` or symlink to `agents/`) to `~/code/wp-vibe-toolbox`. Re-run the `agents/` sync so `wp-frontend-builder` picks up its new Mode B paragraph.

### Added

- New logo mark: the `box` icon from Bootstrap Icons (via Blade Icons), MIT, as light and dark SVGs in `assets/logos/` that swap with the reader's colour scheme through a `<picture>` element in the README. The README credits the icon and links the Traveling box from *The Wheel of Time* it nods to; the Bootstrap Icons license text is in `assets/logos/LICENSE-bootstrap-icons.txt` and the icon is listed in `NOTICE.md`
- README: a "Why this exists" section, the `architect-demo` case study, and a "Works best with Aviendha and Aludra" table. A theme built from Aludra blocks needs the plugin active, so the skills now say so
- `html-to-block-theme` (1.5.0), `references/composing-with-aludra.md`: step 4 items 5 and 7–11 from the Kadewerk design pass. Contact Form 7 (template kept in the theme, `<p>`/`<br>` and the two-column grid, label markup), Aludra selector specificity, `has-global-padding` on grid groups, header alignment, scroll-triggered SVG animation, and telling users the plugins are required (admin notice, README). Checks: sentinel run with `--url`/`--user`/`--pass` (bare `npm run validate` hangs an agent), PHPCS in the fork, screenshots in slices plus computed-style measurements
- `docs/install.md`: `--smart-approve` and why chained commands and paths outside the working directory still prompt
- `docs/install.md`: a GLM model preset for faster coding runs (the author's experience, not a benchmark) and a pinned smart-approve classifier (`[utility_models] smart_approve`), with the caveats from Vibe's docs: it is a classifier, not a sandbox, and the page does not say whether custom agent profiles can run in smart-approve mode

### Changed

- `wp-frontend-builder` (and its subagent copy): a Mode B paragraph with the Aludra requirement, the PHPCS and sentinel steps and the items above, and a stricter one-command-per-call rule
- Renamed the repository from `mistral-toolbox` to `wp-vibe-toolbox` to match its WordPress positioning (1.13.0). GitHub redirects the old URL. Local clones: rename the directory, run `git remote set-url origin git@github.com:imagewize/wp-vibe-toolbox.git`, and change `skill_paths` in `~/.vibe/config.toml` (and any `rsync`/symlink to `agents/`) to `~/code/wp-vibe-toolbox`. Earlier changelog entries keep the old name

## [1.13.0] - 2026-11-11

The toolbox is repositioned as a WordPress toolbox for block-theme development, site maintenance and content work. A repository rename is planned after this release; the name and paths are unchanged in 1.13.0.

### Changed

- README repositioned as a WordPress toolbox: new tagline, a design → build → review → maintain → publish workflow table replacing "Start with these", and Quick start examples that lead with `wp-frontend-builder`. The repo name and all paths are unchanged
- `html-to-block-theme`, Mode B (`references/composing-with-aludra.md`): a new step 4, "Port the design layer". It replaces "Theme CSS stays small", which only checked size: the `architect-demo` rerun kept `style.css` identical to Aviendha's and reported that as a success, and the page had Kadewerk's colours with Aviendha's and Aludra's look (orange pill buttons, rounded cards with shadows, monospace eyebrows, dark stat and contact bands, Aviendha's header with a WooCommerce cart and "Start a project"). The step moves the source's design rules into the theme in a fixed order: write them down from the source CSS, block style variations (`light` for blocks that are dark by default), `theme.json` (`radiusSizes`, shadow presets, `styles.elements`, `styles.blocks["aludra/<name>"]`, only the source's font families), header and footer parts rebuilt from the source plus `blogname`/`blogdescription`, visible form labels in plugin-rendered forms, and then one design-layer CSS block at the end of `style.css` with a comment per rule. Size is a signal both ways: a large block means a skipped variation, an empty one means a skipped design layer
- `composing-with-aludra.md`: the section map keeps the source's layout (a grid of project cards maps to `aludra/feature-cards`, the carousel only for a source slider), with a command that lists each block's style variations. A new check compares headless Chrome screenshots of the source and the site at 1440px and 390px per section, because sentinel and the block checks say nothing about the look. The report lists where each design rule landed and what still differs
- SKILL.md Mode B row and the validation checklist's Mode B section updated to match

## [1.12.0] - 2026-11-10

### Added

- `html-to-block-theme` 1.4.0: two build modes, picked in Step 1 and never mixed. **Mode A** converts the HTML into a standalone theme from core blocks and patterns. **Mode B** builds on an Aviendha fork with content from the Aludra plugin's `aludra/*` blocks. The "prefer core blocks" rule now applies only to Mode A. In Mode B, a section hand-built from `core/group` + CSS when an Aludra block fits counts as a failure, and sections no block covers are reported as gaps. New `references/composing-with-aludra.md`: list the blocks from `~/code/aludra/blocks/*/src/block.json`, a section-to-block starting map, copying each block's wrapper markup from Aludra's own `patterns/section-*.php` (the blocks are static, so any markup difference makes the block invalid), defining every colour slug the blocks read (listed with a grep, no second set of design-named slugs), a small theme `style.css`, and checks: block names exist, Aludra is active on the site sentinel uses, wrapper classes appear in the rendered front page. The validation checklist has a Mode B section. These came from an `architect-demo` run of the Aviendha + Aludra prompt: the agent built prompt 10's conversion in `theme/` with 561 lines of CSS, used one Aludra block out of seven asked for, and kept two colour slug sets
- `html-to-block-theme` 1.1.0–1.3.0: `references/local-environment.md` (Laravel Valet via `wp valet new` for client sites that move to shared hosting, a Trellis/Bedrock VM for pro sites, with verification steps). `references/forking-a-starter-theme.md` for forking Aviendha for a client: rename every identifier (class prefixes, PHP namespace and prefix, text domain, phpcs prefix, package names, logo files), keep the lineage docs, reset the version, activate on the local site. Patterns in a fork are validated with `@imwz/wp-pattern-sentinel` (`npm run validate`, or `--trellis` against the demo VM) after every pattern edit, because `wp pattern validate` never runs the JS `save()` serializer. A house rule against a companion block plugin: compose from core blocks, patterns and block styles, and put custom blocks in a plugin, never in the theme (WordPress.org theme review)
- `wp-update-round` 1.1.0: a fast path for one semver-safe package (local apply and smoke test, production backup on shared hosts, deploy, verify with WP-CLI instead of screenshots). `trellis deploy` runs in the background because the server's `composer install` can take 15 minutes. The round log records the Trellis release ID and the `composer audit` result. Manifests for subtree sites (`repo_subtree_path`) live outside the repo-root `.vibe/`

### Fixed

- `html-to-block-theme` 1.4.0, `forking-a-starter-theme.md`: fork locally with `rsync` minus `.git`, `node_modules`, `vendor` and sentinel logs, then compare the folder listings, since the test run's fork lacked `package.json`, `composer.json`, `phpcs.xml`, `AGENTS.md` and `CLAUDE.md`. Never run npm or sentinel inside `~/code/aviendha`, since the test run left six sentinel logs there. Add `sentinel-*.log.json` to the fork's `.gitignore`. The "aviendha" grep allows one lineage comment
- `html-to-block-theme` 1.4.0: WP-CLI examples use `--path="$HOME/code/<site>"`. The shell does not expand `~` after `=`, so `--path=~/code/<site>` failed with "This does not seem to be a WordPress installation"

## [1.11.0] - 2026-11-09

### Added

- New skill `skills/real-browser-control/` (MIT, adapted from `github.com/ofershap/real-browser-mcp` skills/real-browser-control @ `173c964c3df3ea247a7b65ef519f664771709f12`, LICENSE copied): drive the user's real logged-in Chrome from the agent via Real Browser MCP — local MCP server (`npx -y real-browser-mcp` as a `[[mcp_servers]]` stdio entry) plus the Chrome Web Store extension over a localhost WebSocket, so no `--remote-debugging-port` on the default profile (blocked since Chrome 136) and no cloud relay. Setup for Vibe, tool table, workflow, read-only-first guardrails for authenticated dashboards. Registered in `docs/skills.md`, `docs/sources.md`, `NOTICE.md`, README counts/credits
- README quick start embeds `docs/assets/vibe-agent-demo.gif` (800px wide, 27s, 1.7 MB): a terminal recording of `vibe --agent wp-reviewer` reviewing the latest commit in this repo — the agent loads the `code-review` skill on demand, runs the checks and ends with an `OVERALL ASSESSMENT` verdict. Recorded with a VHS tape, cut to GIF with `mp4-to-gif.sh` (frozen stretches sped up via `--detect` segments), size-optimized with `gifsicle -O3 --colors 32 --lossy=120`
- Nine generated `agents/<name>-subagent.toml` copies (`agent_type = "subagent"`) so every profile can also be spawned by the model in a running session: `agents.spawn({ config_name: "<name>-subagent", … })`. Plain `"agent"` profiles are selectable with `--agent` but rejected by spawn with `subagent_type_not_found` ("Unknown subagent type"); subagent profiles are discovered at session start (`/reload` to pick up new ones) and cannot be selected with `--agent`. Copies are generated — after editing a base profile, regenerate all copies with the loop in `agents/README.md` and commit both. Verified with a fresh `vibe -p` smoke test that spawned `seo-content-writer-subagent` and got a reply

### Changed

- README shortened to an overview (what is inside, quick start, design principles, doc map). The skills tables and workflows moved to `docs/skills.md`; agents, Le Chat prompts, install and contributing each have their own page in `docs/`. AGENTS.md sync rules point at the new files
- `agents/README.md` lists the three SEO agents; README agent examples show the writer → reviewer hand-off
- Agent wiring docs (README quick start, `agents/README.md`, `docs/agents.md`, `docs/install.md`, AGENTS.md) now recommend syncing `agents/` into `~/.vibe/agents/` with `rsync -a ~/code/mistral-toolbox/agents/ ~/.vibe/agents/` (re-run after `git pull`, no `--delete` when private profiles live there) instead of symlinking. The symlink remains documented as an alternative with its failure mode: it dangles silently when the repo moves, after which `vibe --agent NAME` fails with `Agent 'NAME' not found` and spawn fails with `subagent_type_not_found`; it also leaks private profiles added to `~/.vibe/agents` into this public repo. `agent_paths` needs an absolute path — Vibe does not expand `~` there. Skills are unaffected and need no copy: `skill_paths` expands `~`, so pointing it at this repo's `skills/` works directly
- Agent docs (`docs/agents.md`, `agents/README.md`) now spell out the two profile kinds and the spawn semantics: `config_name` is the file stem of a `subagent`-type profile, how to check the wiring when profiles go missing, and the `/reload` requirement for new profiles in a running session

## [1.10.0] - 2026-11-05

### Added

- 13 SEO and content marketing skills. Adapted from `coreyhaines31/marketingskills` (MIT): `ai-seo` (AEO/GEO/LLMO), `cold-email`, `competitors`, `copywriting`, `cro`, `schema` and `product-marketing`. Adapted from `guillaumemeyer/watermarks-remover` (MIT): `publish-hygiene` (invisible Unicode strip + image metadata check, with runnable `rg`/`perl`/`exiftool` commands). Imagewize originals: `seo-audit`, `keyword-gap-analysis`, `first-hand-proof`, `linkedin-comment-queue`, and `serp-check` (method borrows from `aaron-he-zhu/aaron-marketing-skills`, Apache-2.0, nothing copied). Upstream licenses are copied into each adapted skill and logged in `NOTICE.md` and `docs/sources.md`
- `schema` checks what the site already emits before adding Article JSON-LD, so a plugin plus a manual block does not duplicate it; the product context file lives at `.agents/product-marketing.md`
- Three agent profiles split the SEO pipeline: `seo-content-writer` (product-marketing, keyword-gap-analysis, serp-check, first-hand-proof, copywriting, competitors), `seo-publish-reviewer` (seo-audit, schema, ai-seo, publish-hygiene, cro; an independent pre-publish gate) and `outreach-marketer` (product-marketing, cold-email, linkedin-comment-queue; drafts only, never sends)

## [1.9.0] - 2026-11-03

### Added

- `design-system-library` skill 1.0.1, imported from `plugin87/ux-ui-agent-skills` (MIT, pinned `def84a70fadc3490d80901295a4f1951fdb2cc69`): the catalog of 2,144 named design systems (`design-systems/catalog.md`, searchable by vertical category) plus 76 vendored `DESIGN.md` specs for Music & Audio (24), Retro & Nostalgic (4), Retail & E-commerce (39) and E-commerce & Retail (9) — each tokens plus rationale — and the upstream Library Contract (`references/aesthetic-systems.md`). A record-shop brief can now apply e.g. `bandcamp`, `soundcloud` or `vintage` instead of inventing a look. The remaining ~2,000 specs stay upstream at the pinned commit and are read by URL on demand; never from memory. SKILL.md gives the full raw URL, says to ignore the vendored catalog header (its scripts and MCP tool are not shipped), and requires adapting a brand spec to the client instead of copying the brand
- `design-md` skill 1.0.0, spec and examples imported from `google-labs-code/design.md` (Apache-2.0, pinned `6e5da5382f41edbba9d73b2c62f33f32e9971f15`): author a `DESIGN.md` visual-identity spec from reference sites in a vertical, validate with `npx @google/design.md lint DESIGN.md`. SKILL.md written for this repo around the upstream `docs/spec.md`; the CLI runs via npx, not vendored
- `wp-frontend-builder` agent: `ui-ux-pro-max`, `design-system-library`, `design-md` and `ux-writing` added to `enabled_skills` with instructions — a page uses one look — a `frontend-design` anchor, or for a vertical brief one design source in a fixed order (a named system from the library, else the pro-max style catalogs), optionally pin it in a DESIGN.md, and get on-screen copy from `ux-writing`
- `wp-update-round` 1.0.1: example files in `skills/wp-update-round/examples/` — `update-manifest.trellis.yml` (generalized from a real Trellis round), `update-manifest.shared.yml` and `update-pages.txt`. SKILL.md links them and documents the optional manifest fields (`pages_file`, `composer_dir`, `theme_build`, `snapshots`, `backups`, `rollback`). New `skills/wp-update-round/README.md` covers setup: requirements, why each site needs a private manifest, a field table, a dry run for a new site and the Claude Code symlink. The main README's `/wp-update-round` usage section points to it

## [1.8.0] - 2026-11-03

### Added

- `wp-update-round` skill 1.0.0 (Imagewize): complete WordPress update round workflow — preflight, sync local, before/after screenshots via `wp-ops update-snapshot`, pixel diff via `wp-ops update-compare`, human review, a production backup step (always on shared hosts, which have no atomic rollback), production deploy, production verification, and logging. Shows both the wp-ops CLI and the wp-ops MCP tool call shapes. Supports Trellis/Bedrock (Composer) and shared-host (WP-CLI/SSH) sites. Reads per-site `update-manifest.yml` for host config, page lists, and skip lists
- `wp-maintainer` agent profile: runs update rounds with `wp-update-round`, `systematic-debugging`, `verification-before-completion`, and `security-review` skills enabled
- `architectural-drawing` 1.4.0: an opt-in refinement layer for dense, refined drawings, all in the existing palette and five line weights so `check.mjs` still passes and nothing changes for drawings that do not opt in (verified: the shipped examples regenerate byte-identical). New parts: `groundShadow()`, `castShadow()`, `plinth()`, `stringCourse()`, `downpipe()`, `railing()`. New options: `window({ glass, reveal, bars: [nx, ny], drip, head })`, `door({ frame, handle })`, `coursing({ joints, joint })` (staggered perpends), `cutOpening({ reveal })`, `stair({ rail })`, `chimney({ pot })`, `tree({ shade, shadow })`, `barge({ rail })`. Shadows are flat translucent ink (a `fill-opacity` attribute on a palette fill, not `opacity`, which the fade-in keyframes would override to solid black in browsers), not filters, so they render through `<img>` and pass the palette check. SKILL.md gained a "Refinement" section with the rules: two tonal steps (paper/tint, poche only in sections), micro-detail at true scale, a 2x-zoom density rule, textures that end on an edge, and still one accent. The `architect-demo` project cards and hero were regenerated with the layer and roughly tripled their element counts (for example Villa Veldzicht 84 paths, Woonblok Maashaven 290)
- `architectural-drawing` 1.3.0: `d.svg({ animate: true })` makes a drawing draw itself on load, in layer order (trees and ground, building lines, fills, details, people, annotations). Lines are drawn stroke by stroke; fills, dashed lines, crowns and text fade in. The animation lives inside the SVG, so it plays when the file is shown with `<img>`, which page CSS cannot animate. Visitors who ask for reduced motion see the finished drawing at once, and the hidden start state lives only in the keyframes, so a drawing whose animation does not run still shows complete. `check.mjs` fails an animated drawing without a `prefers-reduced-motion` rule. Tested in Chrome: the drawing animates inside an `<img>`, finishes in about 3 seconds, and shows complete under reduced motion. The `architect-demo` drawings lost their draw-on animation when they moved from inline SVG to `<img>` files; this brings it back

### Changed

- `html-page-review` 1.0.1 and `architectural-drawing`: the screenshot commands add `--force-prefers-reduced-motion` (page) or `--virtual-time-budget` (SVG file). Headless Chrome freezes animated SVG images at their first frame, so page screenshots showed animated drawings blank
- AGENTS.md (Working on Vibe skills): no client-identifiable data in skills or agent profiles (the repository is public), command examples checked against the tool's real `--help` and MCP schemas, and shared-hosting examples that keep passwords off the command line, never write dumps on the remote server and make the production backup its own step. Came out of the review of the `wp-update-round` PR

## [1.7.0] - 2026-11-02

### Added

- `architectural-drawing` skill (Imagewize): architectural elevations and sections as SVG, built with a bundled kit (`scripts/arch.mjs`) in metres instead of hand-written coordinates. One scale per drawing (shareable across a set) and a five-step line-weight hierarchy. Parts: masses, gable, stepped, sawtooth and flat roofs, brick coursing, windows, doors including stacked loading doors, hoists, floor lines, section poche, stairs, quays and water, barges, trees, people, dimensions and level marks. The generator run reports implausible sizes, overlapping or floating openings, elements outside the frame, a missing scale figure and accent overuse, and exits 1 on errors. `scripts/check.mjs` validates the finished file: no repeated attributes, balanced tags, a title, kit line weights only and palette colours only. `A.sharedScale()` computes one scale for a set of drawings. The `labels: false` option leaves out dimension and level text for drawings shown small, and `displayWidth` makes the kit warn when people or labels will be too small at the shown size. New `chimney()` part. People have arms, legs and poses (`stand`, `walk`, facing either way). Dimensions can drop extension lines to the building (`from`). New checks: a front tree covering a building corner (warning) and a mass or chimney standing on nothing (error). These came from a Vibe run in `architect-demo`, where six kit drawings passed every check but were too small to read in the project cards. Version 1.2.0 adds section parts: `cutOpening()` for windows and doors in cut walls, a cut roof (`gableRoof({ cut })`), `roofWindow()` skylights, and `figure({ base })` for people on upper floors, with a second worked example (`examples/pakhuis-section.gen.mjs`). Also a warning when a tree crosses a cut wall in a section (on either layer), an error for a person, tree or building over the water, and a rule that building sizes from the brief are fixed: a second run had shrunk four buildings to fit the shared scale. Drawings get a paper-coloured background by default, so ink lines stay visible on dark pages and previews. Trees have a solid trunk, a scalloped crown and branches, so they don't read as a plain disc. A worked example (`examples/pakhuis-quay.gen.mjs`) draws a converted warehouse with a stepped gable on a quay. `wp-frontend-builder` loads it for drawings of buildings. The approach (a parts kit, checks, then a render loop) follows the `illustration-isometric-mono` test, which drew clean solids but at desk scale
- `illustration-isometric-mono` skill, imported from `MengTo/Skills` (MIT, pinned `ef5f851`): true-isometric SVG dioramas built with a bundled scene kit (`scripts/iso.mjs`) instead of hand-written coordinates. It ships a worked generator, lint and colour checks, three example cards and a render-and-critique workflow. A Vibe note adds a headless-Chrome render command, so Playwright is optional. `wp-frontend-builder` loads it for isometric illustrations of technical and product subjects only: a test in `architect-demo` showed clean isometric solids but desk-scale objects (planters as tall as a warehouse wall), so it is not used for buildings. `wp-frontend-builder` also now runs one shell command per call, without `&&`, `;`, pipes or shell variables, because the test agent chained commands and Vibe asked for approval each time. This was a test of whether a kit-based skill lifts Mistral's SVG drawings above hand-written ones; an architectural-drawing skill built the same way follows

- `html-page-review` skill (Imagewize): reviews a rendered static HTML/CSS page instead of its code. A bundled `probe.html` loads the page in headless Chrome at 390, 768 and 1440px and reports measured layout faults as JSON: horizontal overflow, tall sticky headers, overlapping text, labels crossing drawings, unbalanced columns, empty sides, alignment outliers, small text and tap targets, and drawings without a text alternative. A judgement pass then checks brief fit, consistency with the page's own design system, composition and doubtful facts. The skill writes numbered notes, each with evidence and a fix, to `REVIEW.md` and never edits the page. It uses one plain Chrome command per width, so it fits a command allowlist. Tested on the `architect-demo` run: the probe flagged all four issues of the first build from measurements alone, plus the centred quote introduced by the second round
- README: the design pipeline now includes the drawing step (`/architectural-drawing` for buildings, `/illustration-isometric-mono` for technical and product scenes)
- `ux-designer` loads `html-page-review` for built pages. `wp-frontend-builder` treats numbered notes in `REVIEW.md` as change requests. Together they form the loop: the builder builds, the designer reviews, and the builder applies the notes

### Fixed

- 19 of the 40 skills never loaded in Vibe: their unquoted `description` contained `: `, which is invalid YAML, so Vibe skipped them with `Invalid YAML frontmatter: mapping values are not allowed here`. The descriptions are now double-quoted, with wording unchanged, and `metadata.version` is bumped to 1.0.1. Affected: `alerting-oncall`, `better-colors`, `code-review-and-quality`, `frontend-ui-engineering`, `html-to-block-theme`, `incident`, `kubernetes-ops`, `observability-and-instrumentation`, `observability-review`, `performance-optimization`, `pipeline-review`, `release-readiness`, `runbook`, `security-and-hardening`, `security-review`, `systematic-debugging`, `test-driven-development`, `ui-ux-pro-max`, `ux-writing`. All 40 skills now parse. AGENTS.md now says to quote such descriptions and to check frontmatter with a YAML parser
- Agent setup docs (README, `agents/README.md`, AGENTS.md, `docs/external-skills-sourcing-plan.md`): the recommended `agent_paths = ["~/code/mistral-toolbox/agents"]` never worked. Vibe expands `~` in `skill_paths` but not in `agent_paths`, so the entry was silently skipped and `vibe --agent NAME` failed with `Agent 'NAME' not found`. The docs now recommend `ln -s ~/code/mistral-toolbox/agents ~/.vibe/agents`, a folder Vibe searches with no config and no absolute path. They explain that `agent_paths` needs an absolute path, and that the symlink means private profiles added to `~/.vibe/agents` land in the repository

- `wp-frontend-builder`: the fuzzy-brief instruction no longer tells the agent to load `brainstorming`, which is not in its `enabled_skills`. It now loads `design-first-ui-prompting` and, when the user asks for minimal questions, states its assumptions and builds instead of asking. For a full discovery conversation it points to the `ux-designer` agent
- `ux-designer`: `brainstorming` ends by invoking `writing-plans`, which this agent cannot load. The agent now ends with the approved design doc and hands WordPress frontend builds to `wp-frontend-builder`. It also skips brainstorming when the user asks for minimal questions

### Changed

- `wp-frontend-builder`: `landing-page` is now used only for single-offer landing pages, not for homepages or multi-page company sites. Change requests read the existing HTML file and edit it in place, keeping the locked tokens and untouched sections, and list what changed
- `wp-reviewer`: the extra reviewer-subagent pass (`requesting-code-review`) now runs only on large or risky diffs or when asked, not after every review round
- `release-manager`: the release flow now names the steps the instructions left out: move the `[Unreleased]` entries under the new version heading, and create a GitHub release after tagging `vX.Y.Z`

## [1.6.1] - 2026-11-02

### Changed

- README redesigned: centered header with shields.io badges (release, license, last commit, Mistral Vibe, Le Chat, WordPress, and skills/agents/prompts counts), a quick-nav bar, an overview table of the three artifact kinds, a Quick start section, skills grouped into four categories (WordPress, design & frontend, workflow & quality, DevOps & release) with a **Source** column, collapsible install/contributing details, a condensed repository tree, and new Credits and License sections listing the 11 MIT upstream collections
- README: replaced the dead Mistral Agent docs link (`docs.mistral.ai/capabilities/agent/`, 404) with `docs.mistral.ai/agents/introduction` and added the Vibe agents docs link; the per-project install note now covers any skill, not just `code-review`
- AGENTS.md: layout lists `NOTICE.md` and `LICENSE.md`; new "Importing third-party skills" section (license gate, copied LICENSE, `metadata.source`, `docs/sources.md` + `NOTICE.md` logging) and "Keeping the README in sync" section (tables, count badges, credits); PRs are opened with the `create-pull-request` skill
- GitHub repository description and topics refreshed

### Fixed

- README: the Le Chat Prompts section no longer labels the prompts as "agents" — "Available Agents" is now "Available Prompts" (table header `Prompt`), with "Rules for the Frontend Prompts" and "Example Prompt Runs" renamed to match, so the table lists the Le Chat prompts (`FRONTEND-DEV.md`, `REVIEWER.md`) while the actual agents — the Vibe profiles `wp-reviewer`, `wp-frontend-builder`, `ux-designer`, `devops-oncall`, `release-manager` in `agents/` — are documented in the Vibe Agents section. The section also gained an intro sentence stating that Le Chat prompts are pasted into a Le Chat agent (no file access) while the Vibe agents run the skills on real files
- README, AGENTS.md and `docs/external-skills-sourcing-plan.md`: the prompt directory slot is now `prompts/<name>/` instead of `prompts/<agent>/`, and "one dir per agent" prose now says "per prompt"; `docs/sources.md` maps personas to Le Chat prompts

## [1.6.0] - 2026-11-02

### Added

- Added `agents/` as the home of Vibe agent profiles — five TOML profiles (`wp-reviewer`, `wp-frontend-builder`, `ux-designer`, `devops-oncall`, `release-manager`) that wire the toolbox skills into agents callable from any repository: each profile scopes its skills with `enabled_skills` and its `instructions` tell the agent which skill to load for which task via the `skill` tool; wired cross-repo with `agent_paths = ["~/code/mistral-toolbox/agents"]` next to the existing `skill_paths`, then run e.g. `vibe --agent wp-reviewer`; profiles validated against Vibe's `AgentProfile.from_toml` loader; includes `agents/README.md` with wiring and usage docs
- Added a "Vibe Agents" section to the README (profiles table, quick start with `agent_paths` + `vibe --agent`, notes on on-demand skill loading and the subagent variant), restructured the intro and structure tree for the three artifact kinds, and corrected the skills count (40)
- Restructured `prompts/` to one directory per agent — the system prompt (`prompts/<agent>/ROLE.md`) now lives next to its example runs (`prompts/<agent>/<run>/`) instead of as a loose file at the `prompts/` root
- Updated AGENTS.md: layout now lists `agents/` (Vibe profiles) and `prompts/` (Le Chat prompts + runs), with a new "Working on Vibe agent profiles" section documenting the TOML schema

### Moved

- Moved the Le Chat prompts `agents/FRONTEND-DEV.md` and `agents/REVIEWER.md` into their agent directories `prompts/frontend-dev/FRONTEND-DEV.md` and `prompts/reviewer/REVIEWER.md`, so `agents/` holds the Vibe agent profiles and `prompts/` holds one directory per Le Chat agent (system prompt + example runs); README, AGENTS.md and the sourcing plan's format mapping updated accordingly

### Added

- Added `docs/external-skills-sourcing-plan.md`: plan for curating skills, agents, plugins and connector recommendations from permissively licensed external sources (MIT, Apache-2.0, CC0) into this repo — verified license table, a per-artifact license-check quality gate, candidate shortlists for WordPress dev, design → HTML/CSS → WordPress patterns, code review, DevOps and UI/UX, format mapping, quality gates and phased execution

### Removed

- Removed `docs/anubhav-vibe-integration-plan.md`: its source collection anubhav-vibe is CC BY-NC-SA 4.0, which conflicts with this repo's MIT license for imports — the collection stays reference-only and the new sourcing plan uses verified MIT/Apache-2.0/CC0 repositories instead

### Added

- Added `docs/sources.md`: source register for external material — permissive-license sources verified on 2026-11-02 by fetching LICENSE files and via the GitHub API, each with a pinned commit (`git ls-remote`); reference-only list (anubhav-vibe CC BY-NC-SA 4.0; `WordPress/agent-skills` and `dknauss/agent-skills` with no detectable license; `wpacademy/wordpress-dev-skills` GPL-2.0; Automattic repos without a repo-level license; `jorgerosal/wordpress-skills` pending a per-skill audit; `jiji262/claude-design-skill` as proprietary-derivative); recommended project-level tools/connectors that are never vendored (`humanmade/block-runner` GPL-2.0, `GLips/Figma-Context-MCP` MIT, `shadcn-ui/ui` MIT); and an import-log template
- Added `NOTICE.md`: third-party source register per the sourcing plan's attribution rules (copy per-skill LICENSE files, record `metadata.source`, log every import) — empty until the first imports land

### Changed

- Updated `docs/external-skills-sourcing-plan.md` to in-progress: Phase 0 marked done, source table updated with API-verified licenses (MIT confirmed for `mralaminahamed/wp-dev-skills`, `BagelHole/DevOps-Security-Agent-Skills`, `mustafakendiguzel/claude-code-ui-agents`; `WordPress/agent-skills` resolved as reference-only, NOASSERTION), and open question 1 closed with an action item to ask the WordPress org for a CC0/MIT LICENSE

### Added

- Added `skills/frontend-design/` — first imported Vibe skill: `/frontend-design` builds a frontend from one of eight aesthetic anchors locked to exact CSS tokens with real on-screen content, plus a WordPress note (`var(--wp--preset--*)`, theme.json, i18n) so designs convert cleanly to block patterns; MIT from `Ilm-Alan/frontend-design` @ `f8966e6c`, `LICENSE.txt` copied, `metadata.version` 1.0.0, logged in `docs/sources.md` and `NOTICE.md`
- Added `skills/html-to-block-theme/` — `/html-to-block-theme` converts an HTML/CSS/JS design into a production-ready FSE block theme (theme.json v3 from design tokens, templates, parts, block patterns, Interactivity API, Block Bindings, optional WooCommerce); MIT from `siddik-web/wp-block-theme-converter` @ `0347e823`, `references/` (21 docs) and `LICENSE` included, slash commands/`doctor.mjs`/templates not imported and replaced with plain single commands; WordPress version claims verified against current stable 7.1.4; `metadata.version` 1.0.0
- Added `docs/curation-2026-11-02.md` — Phase 1 curation notes for the first-wave sources (what was imported, skipped and why, queued candidates)
- Updated README structure tree and skills table, and `NOTICE.md`, for the two new skills
- Added `skills/wordpress-plugin-audit/` — `/wordpress-plugin-audit`, a read-only four-dimension plugin audit (metadata, naming/i18n, docs vs code, security) with file:line-verified findings; MIT from `mralaminahamed/wp-dev-skills` @ `762b7bc7`, `references/` and `LICENSE` included; stale version claims corrected against current stable WP 7.1.4, subagent and routing references adapted for Vibe, `metadata.version` 1.0.0
- Added `skills/requesting-code-review/` and `skills/verification-before-completion/` — review-workflow skills from `obra/superpowers` @ `2ce8aa15` (MIT, `LICENSE` copied each); `$(…)` substitutions replaced with plain read-only git commands, reviewer subagent wording adapted, `code-reviewer.md` template included, `metadata.version` 1.0.0
- Normalized PASS/FAIL markers (were emoji) in `html-to-block-theme` SKILL.md and references
- Updated `docs/sources.md` import log and `NOTICE.md` with all three new imports; README structure tree and skills table extended
- Added `skills/wordpress-coding-standards/` — `/wordpress-coding-standards`: PHPCS + WPCS setup, `phpcs.xml.dist` configuration, running `phpcs`/`phpcbf`, CI (GitHub Actions) and pre-commit integration, inline suppressions and common sniff fixes; MIT from `mralaminahamed/wp-dev-skills` @ `762b7bc7`, `references/` (3 docs) and `LICENSE` included, `evals/` not imported; stale "WPCS 3.1 is current" claim corrected (3.4.1, released 2026-07-27, is current as of 2026-11-02 — re-verify on Packagist), WPCS 3.x `minimum_wp_version` config key applied in place of the removed `minimum_supported_wp_version`, unverifiable "short array syntax allowed since WP 5.5" claim reworded, `$(…)` pre-commit snippet replaced with plain single commands, vendor model names generalized; `metadata.version` 1.0.0
- Updated `docs/sources.md` import log and `NOTICE.md` with the new import; README skills table extended; `docs/curation-2026-11-02.md` records Round 3 (respira-press queue found fully MCP-coupled and skipped; `wp-coding-standards` imported)
- Added `skills/wordpress-woocommerce/`, `skills/wordpress-plugin-testing/`, `skills/wordpress-i18n-workflow/` and `skills/wordpress-database/` — the remaining queued `wp-dev-skills` skills, MIT from `mralaminahamed/wp-dev-skills` @ `762b7bc7` (`references/` and `LICENSE` included each, `evals/` not imported); renamed `wp-*` → `wordpress-*` per the established precedent; vendor model names generalized; sibling-skill references re-routed to imported names or annotated as not imported; WC version claims verified (HPOS WC 7.1+ opt-in / 8.2+ stable default, blocks default in 8.3); `metadata.version` 1.0.0 each
- Updated `docs/sources.md` import log and `NOTICE.md` with the four imports; README skills table extended; `docs/curation-2026-11-02.md` records Round 4

### Added

- Added `skills/landing-page/` — `/landing-page`: high-conversion landing page design (one offer, one audience, one primary action) with discovery questions, structure, layout types, conversion strategies, copywriting templates and SEO/AEO; MIT from `MengTo/Skills` @ `ef5f851`, `REFERENCES.md` and repo `LICENSE` included, `demo/` not imported (ready-made designs stay in the consuming project); `metadata.version` 1.0.0
- Added `skills/no-ai-design-slop/` — `/no-ai-design-slop`: passive quality gate against generic AI-design defaults with compact quality gates, a removal test and the full catalog in `ARTICLE.md`; MIT from `MengTo/Skills` @ `ef5f851`, `REFERENCES.md` and `LICENSE` included, vendor `agents/openai.yaml` not imported; `metadata.version` 1.0.0
- Added `skills/design-first-ui-prompting/` — `/design-first-ui-prompting`: design-first spec-driven prompting (prompt skeleton, constraints cards, single-variable variants, local reference pack); MIT from `MengTo/Skills` @ `ef5f851`, `REFERENCES.md` and `LICENSE` included, `demo/` not imported; `metadata.version` 1.0.0
- Appended a shared WordPress block-pattern handoff section to all three: preset-named CSS custom properties (`--wp--preset--color--<slug>` etc. with exact `var()` matching, no `--wp--preset--border-radius--*`), sectioned semantic markup marked with HTML comments so each `<section>` maps to a block pattern, no hardcoded `url()` backgrounds (flag for Cover), buttons as inner blocks, i18n-ready copy
- Updated `docs/sources.md` import log and `NOTICE.md` with the three imports; README skills table extended; `docs/curation-2026-11-02.md` records Round 5

### Added

- Added `skills/ui-ux-pro-max/` — `/ui-ux-pro-max`: UI/UX design intelligence with searchable local catalogs under `data/` (79 styles, 192 palettes, 74 font pairings, 119 UX guidelines, icons, motion presets, charts, 22 stacks) plus `references/` rule docs; MIT from `nextlevelbuilder/ui-ux-pro-max-skill` @ `3a13158f`, `LICENSE` included; upstream `scripts/search.py` not imported — the skill now reads/greps the CSV catalogs directly per the plain-command gate, and the huge upstream font/icon dumps (`google-fonts.csv`, `google-font-licenses.json`, `phosphor-icons-upstream.json`) are not vendored (web search instead); `metadata.version` 1.0.0
- Added `skills/ux-writing/` — `/ux-writing`: user-centered microcopy (buttons, labels, errors, empty states, onboarding) with voice/tone, error patterns and accessibility guidance; MIT from `content-designer/ux-writing-skill` @ `98cacde`, `LICENSE` included, vendor-compat chatter removed, demo media/`build-skill.sh` not imported; `metadata.version` 1.0.0
- Appended the shared WordPress block-pattern handoff section to `ui-ux-pro-max` and a WordPress i18n note to `ux-writing`
- Updated `docs/sources.md` import log and `NOTICE.md` with the two imports; README restructured (full skills tree, skills table, design-to-pattern pipeline); `docs/curation-2026-11-02.md` records Round 6

### Added

- Added `skills/create-pull-request/` — `/create-pull-request` (authored in this repo): open and edit GitHub PRs with `gh` without shell-quoting accidents — never inline a markdown body in double quotes (backticks/`$()` execute, backslashes are eaten); write the body with `write_file` and pass `--body-file`, single-quote titles, and verify the rendered PR with `gh pr view --json title,body,url`. `metadata.version` 1.0.0; README tree and skills table updated
- Added `skills/brainstorming/`, `skills/writing-plans/`, `skills/systematic-debugging/`, `skills/test-driven-development/` and `skills/receiving-code-review/` — the remaining review/workflow skills from `obra/superpowers` @ `2ce8aa15` (MIT, `LICENSE` copied each, `metadata.version` 1.0.0): structured design questioning, spec-to-plan writing, four-phase root-cause debugging, red-green-refactor TDD, and review-feedback processing; cross-skill `superpowers:*` references re-routed to imported names or annotated as not imported, one `$(…)` snippet removed, dev artifacts/scripts not imported, reference docs included where relevant
- Updated `docs/sources.md` import log and `NOTICE.md` with the five imports; README tree and skills table extended; `docs/curation-2026-11-02.md` records Round 7

### Added

- Added `skills/code-review-and-quality/`, `skills/security-and-hardening/`, `skills/performance-optimization/`, `skills/frontend-ui-engineering/` and `skills/observability-and-instrumentation/` — from `addyosmani/agent-skills` @ `301b02b1` (MIT, `LICENSE` copied each, `metadata.version` 1.0.0): multi-axis review, vulnerability hardening, performance optimization, accessible UI engineering, and observability; the upstream shared checklists (`security/performance/accessibility/observability-checklist.md`) were copied into each referencing skill's `references/` and cross-links rewritten to local paths; upstream's own `test-driven-development` skipped (name clashes with the superpowers import)
- Updated `docs/sources.md` import log and `NOTICE.md` with the five imports; README tree and skills table extended; `docs/curation-2026-11-02.md` records Round 8

### Added

- Added `skills/better-ui/`, `skills/better-accessibility/`, `skills/better-colors/` and `skills/interface-review/` — UI polish/review skills from `jakubkrehel/skills` @ `60bf140` (MIT, `LICENSE` copied each, `metadata.version` 1.0.0) with their per-topic reference docs; vendor `agents/` subagent defs not imported; each carries the WordPress block-pattern handoff section
- Updated `docs/sources.md` import log and `NOTICE.md` with the four imports; README tree and skills table extended; `docs/curation-2026-11-02.md` records Round 9 (also notes `plugin87` and `sergekostenchuk` surveyed and skipped — their skills are thin wrappers over shared python-script kits)

### Added

- Added the DevOps lane: `skills/incident/`, `skills/runbook/`, `skills/observability-review/`, `skills/security-review/`, `skills/pipeline-review/`, `skills/release-readiness/` from `NotHarshhaa/devops-skills` @ `3605f94` (MIT, `LICENSE` copied each) — read-only incident investigation, runbooks, observability/security/CI-CD/release reviews (upstream `observability` renamed `observability-review`); plus `skills/git-workflow/`, `skills/alerting-oncall/` and `skills/kubernetes-ops/` (+ references/ and assets/) from `BagelHole/DevOps-Security-Agent-Skills` @ `0365f57` (MIT, `LICENSE` copied each; upstream `scripts/*.sh` not imported, sibling cross-links annotated) — all `metadata.version` 1.0.0
- Updated `docs/sources.md` import log and `NOTICE.md` with the nine imports; README tree and skills table extended; `docs/curation-2026-11-02.md` records Round 10

## [1.5.0] - 2026-11-02

### Changed

- Renamed the repository from `mistral-agents` to `mistral-toolbox` ("Mistral Toolbox") — on GitHub (`gh repo rename`, the old URL redirects) and in the local clone — so the name also covers future artifact types beyond agents and skills (MCP servers, plugins, hooks); updated the README title and install path, AGENTS.md, this changelog, and the `code-review` skill `metadata.source` (version bumped to 1.1.1) accordingly
- Updated the `code-review` skill copies carried by `imagewize/aludra`, `seed` and `koffie` to 1.1.1 with the new source, and pointed living references in other local repos (`mshin`, `ecotuin`, `winespring`, `aviendha`) at the new name

## [1.4.0] - 2026-09-13

### Added

**skills/code-review/ — Mistral Vibe code-review skill for WordPress projects:**
- Added `skills/code-review/SKILL.md`, an Agent Skill invoked as `/code-review` in Mistral Vibe
- Reviews a branch diff or GitHub PR (branch mode), or a block, pattern, template or path as it stands (audit mode)
- Detects the project type (plugin, theme, block theme, Sage, Bedrock), minimum PHP and WordPress, text domain and lint/test commands from the repository instead of hard-coding them
- Loads project-specific rules from `.agents/code-review.md` in the reviewed project, falling back to `.vibe/code-review.md`, then `AGENTS.md`
- WordPress checklist applied per project type: escaping, sanitization, nonces and capabilities, SQL, i18n, minimum versions, theme patterns, theme.json presets, blocks and committed build output, Sage, Bedrock
- Verification pass: every finding needs a failure scenario and a CONFIRMED/PLAUSIBLE label; the overall assessment follows from CONFIRMED items only
- Tool-use rules and a documented project allowlist so a review runs without approval prompts
- Adapted from the Aludra plugin's skill, which now uses this skill with Aludra's own rules file

**AGENTS.md — Repository Instructions for Coding Agents:**
- Added `AGENTS.md` with the repository's purpose, layout, conventions for Le Chat agents and Vibe skills, and commit and release rules
- Vibe loads it on top of its built-in system prompt; replaces `.vibe/prompts/vibe.md`

**agents/REVIEWER.md — Enhanced with Verification Discipline:**
- Added behavior rules: never skip checks, explicit failure listing, re-run after fixes
- Added verification discipline: try to disprove findings before reporting
- Added CONFIRMED/PLAUSIBLE labels for findings with failure scenarios
- Updated output format to include Target description and finding labels
- Clarified that findings without verifiable failure scenarios should be dropped

### Changed

**README.md — Covers Le Chat Agents and Vibe Skills:**
- Reframed the repository as Mistral Le Chat agent prompts and Mistral Vibe skills for WordPress development
- Split into a Le Chat Agents section (quick start, agents, WordPress context, frontend rules, example runs) and a Mistral Vibe Skills section (`/code-review`, install, project rules, allowlist)
- Added a note on using `AGENTS.md` for project instructions rather than `system_prompt_id`
- Updated the structure tree for `AGENTS.md`, `skills/` and the reviewer run's `FEEDBACK.md`
- Clarified REVIEWER.md as "Frontend Code Reviewer" for HTML/CSS output analysis

**.vibe/config.toml — Project Settings Only:**
- Removed `system_prompt_id = "vibe"`, which replaced Vibe's built-in system prompt with repository notes
- Removed the copy of user-level settings (models, providers, tool permissions) and a `skill_paths` entry pointing at a directory that does not exist
- Set `include_commit_signature = false` so Vibe does not ask for a `Co-Authored-By` trailer, per the repository's commit rules

**Repository metadata:**
- GitHub description updated to "Mistral Le Chat agent prompts and Mistral Vibe skills for WordPress development"; added topics `mistral-vibe`, `agent-skills`, `wordpress`

### Removed

- `.vibe/prompts/vibe.md` — repository notes moved to `AGENTS.md`

## [1.3.2] - 2026-04-11

### Changed

**agents/REVIEWER.md — Handoff Notes and Visual Completeness Refinements:**
- Updated Handoff Notes check: if handoff notes are absent entirely, agent now adds a Critical Failure ("Handoff notes missing — resubmit with component mapping included") and lists it first before all other findings — previously only marked as FAIL and halted
- Updated behavior rule to match: missing handoff notes trigger a listed Critical Failure rather than an immediate silent halt
- Added Visual Completeness clarification: a `div` with a background color or gradient used as an image placeholder is correct and expected — only `url()` references in CSS should be flagged as hardcoded background image violations

## [1.3.1] - 2026-04-11

### Added

**prompts/reviewer/ — First Reviewer Agent Example Run:**
- Added `prompts/reviewer/elayne-hero-block/` — first example run using `agents/REVIEWER.md` agent
  - `PROMPT.md` — raw HTML input (Elayne hero block) submitted to the REVIEWER agent for code review
  - `OUTPUT.md` — structured review report with critical failures, warnings, and passed checks
    - Critical failures: invalid `--wp--preset--border-radius--*` namespace and single-dash spacing variable references
    - Warnings: generic placeholder text and hardcoded background color in mockup
    - Verdict: FAIL — documents exactly the categories of errors the REVIEWER agent is designed to catch

### Changed

**README.md — Repository Structure and Example Runs:**
- Updated structure tree to include `prompts/reviewer/elayne-hero-block/` alongside existing `frontend-dev/` entry
- Updated Example Agent Runs table: added reviewer run row with FAIL verdict; made frontend-dev path more specific (`frontend-dev/elayne-hero-block/`)

## [1.3.0] - 2026-04-11

### Added

**agents/ — Dedicated Agent Directory:**
- Added `agents/` directory to house all agent prompt files (previously stored in root)
- Added `agents/REVIEWER.md` — new Code Review Agent specializing in WordPress FSE frontend code review
  - Runs a structured checklist: CSS variable integrity, layout rules, visual completeness, FSE/WordPress conventions
  - Flags critical failures with file location and precise fix guidance
  - Outputs a pass/fail report with categorized severity levels

### Changed

**Repository Structure — Agent Files Moved to `agents/`:**
- Moved `FRONTEND-DEV.md` from repo root to `agents/FRONTEND-DEV.md`
- Updated `README.md` quick start, structure tree, agent table, and adding-agents guide to reference `agents/` path
- Updated `.vibe/prompts/vibe.md` structure tree and workflow patterns to reference `agents/` directory

**prompts/ — Example Runs Reorganized by Agent:**
- Moved `prompts/elayne-hero-block/` → `prompts/frontend-dev/elayne-hero-block/`
- Example runs are now grouped under agent-named subdirectories (e.g., `prompts/frontend-dev/`) for scalability
- Updated `README.md` example runs table to reflect new path

## [1.2.0] - 2026-04-11

### Added

**prompts/ — Example Agent Runs:**
- Added `prompts/` directory to hold real agent run examples (prompt → output → canvas → feedback)
- Added `prompts/elayne-hero-block/` — first example run using FRONTEND-DEV.md agent
  - `PROMPT.md` — input prompt used for the run
  - `OUTPUT.md` — raw agent output
  - `canvas.html` — generated Elayne hero block (split layout, CSS Grid, browser mockup)
  - `FEEDBACK.md` — review notes covering two real bugs: spacing CSS variable dash bug and invalid border-radius namespace

**FRONTEND-DEV.md — Elayne critical rules:**
- Added rule: never use `--wp--preset--border-radius--*` — WordPress does not expose border radius as a `--wp--preset--` namespace; use theme-prefixed custom properties or hardcoded values instead

**README.md — Example Agent Runs section:**
- Added `Example Agent Runs` section documenting the `prompts/` directory purpose and structure
- Added table listing available example runs with agent and review status
- Updated Repository Structure tree to include `prompts/` with annotated contents

## [1.0.3] - 2025-06-26

### Added

**.vibe/prompts/vibe.md - Release Workflow Documentation:**
- Added Release Workflow section documenting branch management requirements
- Specified semantic versioning tag format (e.g., `v1.0.2`) without additional prefixes/suffixes
- Clarified tags must be created after merging changes into `main`, never on feature branches
- Required GitHub release creation with details after tagging
- Required CHANGELOG.md update before tagging

## [1.0.2] - 2025-06-26

### Changed

**FRONTEND-DEV.md - CSS Variable Validation:**
- Added critical rule: Must verify every `var(--...)` reference exactly matches a defined `:root` variable including all dashes before HTML output
- Added critical rule: `--wp--preset--` spacing and font-size Variables must be referenced with exact name matching including all dashes (e.g., `var(--wp--preset--spacing--40)` not `var(--wp--preset--spacing-40)`)

## [1.0.1] - 2025-06-25

### Changed

**README.md - Repository Rebranding:**
- Rebranded from WordPress/Imagewize-specific to general-purpose agent library
- Added origin story clarifying Imagewize roots while emphasizing adaptability
- Updated title from "mistral-agents" to "Mistral Agents"

**README.md - Structure & Content:**
- **Added**: Quick Start section with step-by-step setup instructions
- **Removed**: Configuration section (redundant with Quick Start)
- **Renamed**: "Imagewize Projects" → "WordPress Context (Optional)" to make it optional reading
- **Renamed**: "Adding New Agent Prompts" → "Adding Your Own Agents" with enhanced guidance
- **Renamed**: "Critical Rules (All Agents)" → "Universal Critical Rules" for broader applicability
- **Restructured**: Available Agents as a clear table with role, focus, and audience columns
- **Restructured**: WordPress project table simplified (removed Target Audience column)
- **Updated**: Contributing section to explicitly welcome non-WordPress contributions
- **Updated**: Resources section - removed internal theme directory links
- **Updated**: Planned Agents from checklist format to list format
- **Updated**: Footer from "Maintained by Imagewize for internal" to "Originally created by Imagewize; now maintained for the Mistral Le Chat community"

## [1.0.0] - 2025-04-11

### Added

**Repository Structure:**
- Created `mistral-agents` repository for Mistral Le Chat agent prompts
- Added `.vibe/config.toml` for optional Vibe CLI configuration
- Added `.vibe/prompts/` directory for prompt files
- Added `CHANGELOG.md` following Keep a Changelog format

**Frontend Developer Agent:**
- Added `FRONTEND-DEV.md` - Senior Frontend Developer agent prompt
- Specialized for WordPress theme development (HTML/CSS, page templates, block patterns)
- Covers three Imagewize projects: imagewize.com, Nynaeve, Elayne
- Includes critical rules for production-ready code output
- Defines workflow: full page build → component extraction → developer handoff notes

**Repository Documentation:**
- Added `.vibe/prompts/vibe.md` with comprehensive repository-level prompt details
- Documents repository purpose, structure, and conventions
- Describes Imagewize project context (imagewize.com, Nynaeve, Elayne)
- Outlines critical rules, handoff notes requirements, and workflow patterns

**Repository Documentation:**
- Added `README.md` with detailed repository documentation
- Available Agents section listing FRONTEND-DEV.md
- Imagewize project context table with type, audience, and tech stack
- Agent naming conventions and quality guidelines
- Usage instructions for Vibe CLI
- Contributing guidelines and future enhancements list

---

*This is the first tracked release of the vibe-agents repository.*
