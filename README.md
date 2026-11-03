<div align="center">

# 🧰 Mistral Toolbox

**Mistral Vibe skills, Vibe agent profiles and Le Chat prompts for WordPress development.**

[![Latest release](https://img.shields.io/github/v/release/imagewize/mistral-toolbox?label=release&color=orange)](https://github.com/imagewize/mistral-toolbox/releases/latest)
[![License: MIT](https://img.shields.io/github/license/imagewize/mistral-toolbox?color=blue)](LICENSE.md)
[![Last commit](https://img.shields.io/github/last-commit/imagewize/mistral-toolbox)](https://github.com/imagewize/mistral-toolbox/commits/main)
<br>
[![Mistral Vibe](https://img.shields.io/badge/Mistral-Vibe-FA520F)](https://docs.mistral.ai/vibe/)
[![Le Chat](https://img.shields.io/badge/Mistral-Le%20Chat-FA520F)](https://chat.mistral.ai)
[![WordPress](https://img.shields.io/badge/WordPress-FSE%20%7C%20Sage-21759B?logo=wordpress&logoColor=white)](https://wordpress.org)
<br>
[![Skills](https://img.shields.io/badge/skills-44-brightgreen)](#-vibe-skills)
[![Agents](https://img.shields.io/badge/agents-6-brightgreen)](#-vibe-agents)
[![Prompts](https://img.shields.io/badge/Le%20Chat%20prompts-2-brightgreen)](#-le-chat-prompts)

[Quick start](#-quick-start) · [Skills](#-vibe-skills) · [Agents](#-vibe-agents) · [Le Chat prompts](#-le-chat-prompts) · [Contributing](#-contributing)

</div>

---

Reusable AI instructions in three kinds:

| Kind | Lives in | Runs in | What it does |
|------|----------|---------|--------------|
| 🛠 **Vibe skills** | [`skills/`](skills/) | [Mistral Vibe](https://docs.mistral.ai/vibe/), inside your project | [Agent Skills](https://docs.mistral.ai/vibe/code/cli/skills) invoked as slash commands — they read your files, run git and linters, and report (e.g. `/code-review`) |
| 🤖 **Vibe agents** | [`agents/`](agents/) | Mistral Vibe, any repository | TOML role profiles you select with `vibe --agent NAME`; each loads the skills it needs on demand |
| 💬 **Le Chat prompts** | [`prompts/`](prompts/) | [Mistral Le Chat](https://chat.mistral.ai) | System prompts you paste into a Le Chat agent — no file or shell access, they work on what you paste in |

Imagewize built these for its own WordPress work — the **Elayne** block theme, the **Nynaeve** Sage theme and the **Aludra** block plugin — but they adapt to other projects. Use as-is, extend, or fork. 39 of the 43 skills are curated from permissively licensed open-source collections; see [Credits](#-credits).

---

## 🚀 Quick start

**1. Wire the toolbox into Vibe once** — skills in `~/.vibe/config.toml`:

```toml
skill_paths = ["~/code/mistral-toolbox/skills"]
```

and the agents by linking them into Vibe's own agents folder, which it searches without any config:

```bash
ln -s ~/code/mistral-toolbox/agents ~/.vibe/agents
```

**2. Use it in any repository:**

```bash
cd ~/code/some-wordpress-project
vibe                                        # then: /code-review, /frontend-design, …
vibe --agent wp-reviewer -p "review the diff against main"
vibe --agent release-manager -p "is main ready for release?"
```

**3. Or, in Le Chat**, paste [`prompts/frontend-dev/FRONTEND-DEV.md`](prompts/frontend-dev/FRONTEND-DEV.md) into **Agents → New Agent → System Prompt**.

More install options in [Install](#install).

---

## 🛠 Vibe skills

Skills run inside your project with Vibe's tools and are invoked as slash commands. **Source** shows where a skill came from — imported skills keep their upstream `LICENSE` and record the pinned commit in `metadata.source`.

### WordPress development

| Skill | What it does | Source |
|-------|--------------|--------|
| [`/code-review`](skills/code-review/SKILL.md) | Reviews a branch diff, a GitHub PR, or a block, pattern, template or path in place, in any WordPress plugin, theme or site. Detects project type, minimum PHP/WordPress and lint commands, and applies the project's own rules from `.agents/code-review.md`. | Imagewize |
| [`/html-to-block-theme`](skills/html-to-block-theme/SKILL.md) | Converts an HTML/CSS/JS design into a production-ready FSE block theme: theme.json v3 from design tokens, templates, parts, patterns, Interactivity API, optional WooCommerce. | siddik-web |
| [`/wordpress-plugin-audit`](skills/wordpress-plugin-audit/SKILL.md) | Read-only plugin audit across metadata, naming/i18n, docs vs code and conventions/security, with file:line-verified findings. | mralaminahamed |
| [`/wordpress-coding-standards`](skills/wordpress-coding-standards/SKILL.md) | Sets up and enforces PHPCS + WPCS: `phpcs.xml.dist`, `phpcs`/`phpcbf`, CI and pre-commit, common sniff fixes. | mralaminahamed |
| [`/wordpress-plugin-testing`](skills/wordpress-plugin-testing/SKILL.md) | WP_UnitTestCase, Brain Monkey/WP_Mock, factories, AJAX/multisite, wp-browser acceptance tests, CI matrices. | mralaminahamed |
| [`/wordpress-i18n-workflow`](skills/wordpress-i18n-workflow/SKILL.md) | Text domain, i18n functions, `wp i18n make-pot`/`make-mo`/`make-json`, JS translations, GlotPress. | mralaminahamed |
| [`/wordpress-database`](skills/wordpress-database/SKILL.md) | Custom tables: `dbDelta` rules, versioned upgrades, prepared `$wpdb` CRUD, migrations, uninstall cleanup. | mralaminahamed |
| [`/wordpress-woocommerce`](skills/wordpress-woocommerce/SKILL.md) | WooCommerce extensions: gateways, shipping, WC CRUD, HPOS, REST/Store API, cart/checkout blocks. | mralaminahamed |
| [`/wp-update-round`](skills/wp-update-round/SKILL.md) | WordPress update rounds: before/after screenshots, pixel diff, human approval, production deployment for plugins/themes/core. Uses wp-ops commands. | Imagewize |

### Design & frontend

| Skill | What it does | Source |
|-------|--------------|--------|
| [`/frontend-design`](skills/frontend-design/SKILL.md) | One of eight aesthetic anchors locked to exact CSS tokens, real content instead of filler; output uses `var(--wp--preset--*)` so it converts to block patterns. | Ilm-Alan |
| [`/landing-page`](skills/landing-page/SKILL.md) | High-converting landing pages — structure, layouts, conversion strategy, copy templates, SEO/AEO — with a block-pattern handoff. | MengTo |
| [`/design-first-ui-prompting`](skills/design-first-ui-prompting/SKILL.md) | Turns fuzzy ideas into a design-first spec: prompt skeleton, constraints, single-variable variants, reference pack. | MengTo |
| [`/no-ai-design-slop`](skills/no-ai-design-slop/SKILL.md) | Quality gate against generic AI-design defaults: removal test and full slop catalog. | MengTo |
| [`/architectural-drawing`](skills/architectural-drawing/SKILL.md) | Architectural elevations and sections as SVG, built in metres with a bundled kit (`arch.mjs`): one scale, a fixed line-weight hierarchy, people and trees for scale, with proportion, overlap and file checks. | Imagewize |
| [`/illustration-isometric-mono`](skills/illustration-isometric-mono/SKILL.md) | True-isometric SVG dioramas built with a bundled scene kit (`iso.mjs`) instead of hand-written coordinates, with lint and colour checks and a render-and-critique loop. | MengTo |
| [`/ui-ux-pro-max`](skills/ui-ux-pro-max/SKILL.md) | Design intelligence with local catalogs (styles, palettes, font pairings, 119 UX guidelines, icons, motion, charts, 22 stacks). | nextlevelbuilder |
| [`/ux-writing`](skills/ux-writing/SKILL.md) | Microcopy — buttons, labels, errors, empty states, onboarding — with voice/tone and accessibility guidance. | content-designer |
| [`/frontend-ui-engineering`](skills/frontend-ui-engineering/SKILL.md) | Production-quality accessible, responsive UIs: semantic markup, keyboard/focus states. | addyosmani |
| [`/better-ui`](skills/better-ui/SKILL.md) | Polish surfaces, icons and motion with exact values. | jakubkrehel |
| [`/better-colors`](skills/better-colors/SKILL.md) | Color formats, contrast, palette generation and token naming. | jakubkrehel |
| [`/better-accessibility`](skills/better-accessibility/SKILL.md) | Keyboard/focus, ARIA, accessible names, forms, hit areas, motion/zoom, screen readers. | jakubkrehel |
| [`/interface-review`](skills/interface-review/SKILL.md) | Reviews a branch/PR for the interface problems it introduces, scoped to what changed. | jakubkrehel |
| [`/html-page-review`](skills/html-page-review/SKILL.md) | Reviews a rendered HTML/CSS page: headless-Chrome layout probe at three widths, then brief fit, consistency and copy; writes numbered fix notes to `REVIEW.md`. | Imagewize |

### Development workflow & quality

| Skill | What it does | Source |
|-------|--------------|--------|
| [`/brainstorming`](skills/brainstorming/SKILL.md) | Turns a rough idea into a formed design through structured questioning. | obra |
| [`/writing-plans`](skills/writing-plans/SKILL.md) | Spec → step-by-step implementation plan with exact paths and verification steps. | obra |
| [`/test-driven-development`](skills/test-driven-development/SKILL.md) | Red-green-refactor: failing test first, minimum implementation, refactor. | obra |
| [`/systematic-debugging`](skills/systematic-debugging/SKILL.md) | Four-phase root-cause debugging — no fix before the cause is found. | obra |
| [`/verification-before-completion`](skills/verification-before-completion/SKILL.md) | Evidence before claims: run the proving command fresh, read the output, then claim. | obra |
| [`/requesting-code-review`](skills/requesting-code-review/SKILL.md) | Dispatches a read-only reviewer subagent before merging. | obra |
| [`/receiving-code-review`](skills/receiving-code-review/SKILL.md) | Verifies each review suggestion against the code; accept, adapt or push back with evidence. | obra |
| [`/code-review-and-quality`](skills/code-review-and-quality/SKILL.md) | Multi-axis review — correctness, readability, maintainability, performance, security, tests. | addyosmani |
| [`/security-and-hardening`](skills/security-and-hardening/SKILL.md) | Hardening against vulnerabilities with attack-scenario verification. | addyosmani |
| [`/performance-optimization`](skills/performance-optimization/SKILL.md) | Profile-first performance work; re-measure after every fix. | addyosmani |

### DevOps & release

| Skill | What it does | Source |
|-------|--------------|--------|
| [`/incident`](skills/incident/SKILL.md) | Read-only, evidence-logged incident investigation and blameless postmortem. | NotHarshhaa |
| [`/runbook`](skills/runbook/SKILL.md) | Operational runbooks: symptom → diagnostic → mitigation → escalation. | NotHarshhaa |
| [`/alerting-oncall`](skills/alerting-oncall/SKILL.md) | Alerting rules, on-call rotations and escalation. | BagelHole |
| [`/observability-review`](skills/observability-review/SKILL.md) | Reviews metrics, logs, traces, dashboards, alerting and SLO coverage. | NotHarshhaa |
| [`/observability-and-instrumentation`](skills/observability-and-instrumentation/SKILL.md) | Structured logging, metrics, tracing and alerting so production is diagnosable. | addyosmani |
| [`/security-review`](skills/security-review/SKILL.md) | Infra/app security posture review: IAM, secrets, network, dependencies. | NotHarshhaa |
| [`/pipeline-review`](skills/pipeline-review/SKILL.md) | CI/CD review: security, caching, flakiness, speed. | NotHarshhaa |
| [`/kubernetes-ops`](skills/kubernetes-ops/SKILL.md) | Deploy, scale, manage and troubleshoot Kubernetes workloads. | BagelHole |
| [`/release-readiness`](skills/release-readiness/SKILL.md) | Release gate: changelog, versioning, rollback, migrations, monitoring. | NotHarshhaa |
| [`/git-workflow`](skills/git-workflow/SKILL.md) | Branching strategies, PR workflows and release management. | BagelHole |
| [`/create-pull-request`](skills/create-pull-request/SKILL.md) | Opens/edits PRs with `gh` safely — body via `--body-file`, single-quoted titles, verified with `gh pr view`. | Imagewize |

### `/code-review` usage

```
/code-review                 # this branch against the default base branch
/code-review 51              # GitHub PR #51
/code-review hero            # audit the block or pattern named "hero"
/code-review --help          # usage and valid targets
```

### `/wp-update-round` usage

The skill needs two things outside this repository:

- **[wp-ops](https://github.com/imagewize/wp-ops) 5.42.0+** for `update-snapshot` and `update-compare` (plus Playwright Chromium and ImageMagick 7).
- **A per-site `update-manifest.yml`**, kept private in the site's own repository (e.g. `.vibe/update-manifest.yml`) or in a private manifests folder. It holds the facts the skill must not guess and this public repository must not contain: host type (Trellis or shared host), PHP/MySQL versions, local and production URLs, SSH target, the pages to screenshot, CSS selectors to mask, packages to skip and the cache to purge. Without one, the skill asks for these before starting. Copy one of the examples to start: [Trellis/Bedrock](skills/wp-update-round/examples/update-manifest.trellis.yml), [shared host](skills/wp-update-round/examples/update-manifest.shared.yml), plus a [page list](skills/wp-update-round/examples/update-pages.txt).

```
/wp-update-round                         # reads .vibe/update-manifest.yml, lists updates, stops at each approval
vibe --agent wp-maintainer               # same round, with debugging and verification skills enabled
```

### Design → HTML/CSS → block patterns

The design skills form a pipeline for FSE themes such as Elayne:

```
brief → /landing-page + /design-first-ui-prompting   (structure, copy, spec)
      → /frontend-design or /ui-ux-pro-max           (anchored HTML/CSS, token-locked)
      → /architectural-drawing or /illustration-isometric-mono   (SVG drawings from a kit, not hand-written)
      → /no-ai-design-slop                           (quality gate on the output)
      → /html-page-review                            (rendered review → REVIEW.md → change requests)
      → /html-to-block-theme                         (HTML/CSS/JS → theme + patterns)
```

The design skills emit one self-contained HTML file per page, with sections marked by `<!-- ===== Section ===== -->` comments and preset-named CSS custom properties (`--wp--preset--color--<slug>` etc.), so each section converts to a valid block pattern without renaming fixes. `/ux-writing` covers the on-screen copy. Drawings come from a kit, not hand-written SVG: `/architectural-drawing` draws buildings as elevations and sections in metres at one shared scale, and `/illustration-isometric-mono` draws technical and product scenes. The [`wp-frontend-builder`](agents/wp-frontend-builder.toml) agent runs the build steps; the [`ux-designer`](agents/ux-designer.toml) agent reviews the result with `/html-page-review`, and the builder applies the numbered notes from `REVIEW.md`.

### Install

**For all your projects** — add this repository's `skills/` to `~/.vibe/config.toml` and link `agents/` to `~/.vibe/agents`, as in [Quick start](#-quick-start). Vibe uses the first skill it finds with a given name and searches `skill_paths` before a project's `.vibe/skills/` and `.agents/skills/`. If your config sets `enabled_skills`, add the skills you want to it.

**For one project** — put the same lines in that project's `.vibe/config.toml` (the folder must be trusted), or copy individual skill directories (e.g. `skills/code-review/`) into the project's `.agents/skills/` so everyone on the project gets them. Copies carry `metadata.version`, so you can compare them with this repository.

<details>
<summary><strong>Project rules for <code>/code-review</code></strong></summary>

The skill's generic checks are the same everywhere; what catches most regressions is the project's own rules. Add them to `.agents/code-review.md` in the project — facts, named audit targets, files to skip, lint commands, and rules with the failure each one prevents. The file format is documented at the end of [SKILL.md](skills/code-review/SKILL.md). For a plugin or theme, keep `.agents/` and `.vibe/` out of release zips (`.distignore`, `.gitattributes` `export-ignore`).

</details>

<details>
<summary><strong>Fewer approval prompts</strong></summary>

Approvals come from the `[tools.bash] allowlist` in Vibe's config, not from a skill's `allowed-tools`. Put the commands the skill runs in the project's `.vibe/config.toml` so everyone on the project gets the same approvals. A project allowlist **replaces** the one in `~/.vibe/config.toml`, so include the read-only basics too — the **Setup** section of [code-review's SKILL.md](skills/code-review/SKILL.md) has a starting list.

</details>

<details>
<summary><strong>Project instructions: AGENTS.md, not a system prompt</strong></summary>

Vibe loads `AGENTS.md` files on top of its built-in system prompt; that is the place for project rules. `system_prompt_id` in `config.toml` *replaces* the built-in prompt — tool use, planning and editing instructions included — and is rarely what you want. See [Mistral Vibe: AGENTS.md vs a custom system prompt](https://imagewize.com/mistral-vibe-agents-md-vs-custom-system-prompt/).

</details>

---

## 🤖 Vibe agents

Agent profiles in [`agents/`](agents/) are TOML files you select with `vibe --agent NAME`, in this repository or any other. Each profile's `instructions` say which skill to load for which task; the model loads them on demand through Vibe's `skill` tool, and `enabled_skills` scopes what the agent may load.

| Agent | Role | Skills it loads |
|-------|------|-----------------|
| [`wp-reviewer`](agents/wp-reviewer.toml) | Reviews WordPress diffs, PRs, plugins and patterns | code-review, wordpress-plugin-audit, wordpress-coding-standards, wordpress-plugin-testing, code-review-and-quality, security-and-hardening, requesting/receiving-code-review, verification-before-completion |
| [`wp-frontend-builder`](agents/wp-frontend-builder.toml) | Builds FSE frontends: spec → anchored HTML/CSS → block theme/patterns | design-first-ui-prompting, landing-page, frontend-design, no-ai-design-slop, better-ui, better-colors, frontend-ui-engineering, html-to-block-theme, architectural-drawing, illustration-isometric-mono |
| [`ux-designer`](agents/ux-designer.toml) | UI/UX design, microcopy, accessibility | brainstorming, ui-ux-pro-max, ux-writing, better-accessibility, interface-review, html-page-review, design-first-ui-prompting, no-ai-design-slop |
| [`devops-oncall`](agents/devops-oncall.toml) | Incidents (read-only first), on-call, observability, k8s, CI/CD | incident, runbook, alerting-oncall, observability-review, observability-and-instrumentation, security-review, pipeline-review, kubernetes-ops, systematic-debugging |
| [`release-manager`](agents/release-manager.toml) | Release gates, CI review, git flow, PR creation | release-readiness, pipeline-review, git-workflow, create-pull-request, receiving-code-review, verification-before-completion |
| [`wp-maintainer`](agents/wp-maintainer.toml) | WordPress update rounds: screenshots, diffs, approval, deployment | wp-update-round, systematic-debugging, verification-before-completion, security-review |

```bash
vibe --agent wp-reviewer                    # interactive review session
vibe --agent wp-reviewer -p "review the diff against main"
vibe --agent devops-oncall -p "triage this alert"
```

- Wire them in with `ln -s ~/code/mistral-toolbox/agents ~/.vibe/agents` (see [Quick start](#-quick-start)). If you use `agent_paths` instead, give an absolute path: Vibe expands `~` in `skill_paths` but not in `agent_paths`, so a `~/…` entry is silently skipped and `vibe --agent NAME` reports the agent as not found.
- The agent name is the TOML file stem; `vibe --agent NAME` fails with the reason if a profile is invalid.
- Skills are **not** auto-loaded — the agent loads them via the `skill` tool when the task calls for it. Remove `enabled_skills` from a profile to let it load any skill the session can see.
- Set `agent_type = "subagent"` in a copy of a profile to make it spawnable by the model as a subagent.
- See [`agents/README.md`](agents/README.md) for wiring details and the [Vibe agents docs](https://docs.mistral.ai/vibe/code/cli/agents).

---

## 💬 Le Chat prompts

System prompts you paste into a [Mistral Le Chat](https://chat.mistral.ai) agent. Le Chat has no file or shell access, so these work on what you paste in — to work on real files, use the [Vibe agents](#-vibe-agents).

1. Copy a prompt file, e.g. [`prompts/frontend-dev/FRONTEND-DEV.md`](prompts/frontend-dev/FRONTEND-DEV.md)
2. In Le Chat open **Agents → New Agent** and paste it into **System Prompt**
3. Pick a model such as `mistral-large-latest` or `devstral`, and start chatting

| Prompt | Role | Focus |
|--------|------|-------|
| [FRONTEND-DEV.md](prompts/frontend-dev/FRONTEND-DEV.md) | Senior Frontend Developer | WordPress themes, HTML/CSS, block patterns |
| [REVIEWER.md](prompts/reviewer/REVIEWER.md) | Frontend Code Reviewer | HTML/CSS output analysis, FSE compliance |

The prompts are tailored to these Imagewize projects:

| Project | Type | Tech stack |
|---------|------|------------|
| **Elayne** | FSE block theme | Gutenberg, theme.json, patterns |
| **Nynaeve** | Sage 11 hybrid theme | Blade, ACF Composer, React blocks |
| **imagewize.com** | Site | Enterprise WordPress |

The frontend prompts require production-ready, mobile-first output with realistic content — no placeholders, no lorem ipsum, and no centered overlay heroes (the most common failure pattern).

### Example runs

Each `prompts/<name>/<run>/` folder is a real run — `PROMPT.md` (input), `OUTPUT.md` (raw response), `canvas.html` (generated HTML, frontend runs) and `FEEDBACK.md` (what worked, what failed) — so you can see how a prompt performs in practice.

| Run | Prompt | Result |
|-----|--------|--------|
| [frontend-dev/elayne-hero-block](prompts/frontend-dev/elayne-hero-block/) | FRONTEND-DEV | Reviewed — see FEEDBACK.md |
| [reviewer/elayne-hero-block](prompts/reviewer/elayne-hero-block/) | REVIEWER | FAIL — CSS variable namespace + dash syntax errors |

---

## 📂 Repository structure

```
mistral-toolbox/
├── skills/        # Vibe skills: skills/<name>/SKILL.md (+ LICENSE for imported skills)
├── agents/        # Vibe agent profiles: agents/<name>.toml + README.md
├── prompts/       # Le Chat prompts: prompts/<name>/ROLE.md + example runs in prompts/<name>/<run>/
├── docs/          # Sourcing plan, source register, curation notes
├── .vibe/         # Vibe project settings for this repository
├── AGENTS.md      # Instructions for coding agents working in this repository
├── CHANGELOG.md
├── NOTICE.md      # Third-party material included in this repository
└── LICENSE.md
```

---

## 📝 Contributing

Contributions are welcome — for any domain, not just WordPress.

1. Fork the repository and create a branch
2. Add your prompt, skill or agent profile following [AGENTS.md](AGENTS.md)
3. Update this README (tables and the count badges) and `CHANGELOG.md` under `[Unreleased]`
4. Open a pull request with a semantic title (`feat:`, `fix:`, `docs:` …)

<details>
<summary><strong>Adding a Vibe skill</strong></summary>

1. Create `skills/<name>/SKILL.md` — `name` is lowercase letters, digits and hyphens.
2. Frontmatter: `name` and `description` are required; add `user-invocable: true` for a slash command and `metadata.version` so copies in projects can be compared.
3. Keep it generic — project-specific rules belong in the project, not in the skill.
4. Prescribe allowlist-friendly commands: plain single commands, no shell loops or one-liners; read files with `read_file`.
5. Importing from elsewhere? Only MIT, Apache-2.0, CC0, BSD or public-domain sources — copy the upstream `LICENSE`, record `metadata.source` with the pinned commit, and log it in [`NOTICE.md`](NOTICE.md) and [`docs/sources.md`](docs/sources.md).

</details>

<details>
<summary><strong>Adding a Vibe agent profile</strong></summary>

1. Create `agents/<name>.toml` — the file stem is the name used with `vibe --agent <name>`.
2. Required keys: `display_name` and `description`; then `instructions` (the role plus which skill to load for which task) and optionally `agent_type` (`"agent"` by default, `"subagent"` for a model-spawned subagent).
3. Scope the skills with `enabled_skills = ["code-review", ...]` so the agent only loads what it needs.

</details>

<details>
<summary><strong>Adding a Le Chat prompt</strong></summary>

1. Create `prompts/<name>/` with one system prompt file named by role — `ROLE.md` or `ROLE-SPECIALIZATION.md` (e.g. `prompts/backend-dev/BACKEND-DEV.md`).
2. Structure it as: role and scope, critical rules (do's and don'ts), output format, examples of expected output. Keep it project-agnostic where possible.
3. Add at least one example run in `prompts/<name>/<run>/`.

</details>

---

## 🙏 Credits

Imported skills are adapted from these MIT-licensed collections; each keeps its upstream license, and [`NOTICE.md`](NOTICE.md) and [`docs/sources.md`](docs/sources.md) record the pinned commits.

[obra/superpowers](https://github.com/obra/superpowers) ·
[addyosmani/agent-skills](https://github.com/addyosmani/agent-skills) ·
[mralaminahamed/wp-dev-skills](https://github.com/mralaminahamed/wp-dev-skills) ·
[NotHarshhaa/devops-skills](https://github.com/NotHarshhaa/devops-skills) ·
[jakubkrehel/skills](https://github.com/jakubkrehel/skills) ·
[MengTo/Skills](https://github.com/MengTo/Skills) ·
[BagelHole/DevOps-Security-Agent-Skills](https://github.com/BagelHole/DevOps-Security-Agent-Skills) ·
[Ilm-Alan/frontend-design](https://github.com/Ilm-Alan/frontend-design) ·
[siddik-web/wp-block-theme-converter](https://github.com/siddik-web/wp-block-theme-converter) ·
[nextlevelbuilder/ui-ux-pro-max-skill](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) ·
[content-designer/ux-writing-skill](https://github.com/content-designer/ux-writing-skill)

## 🔗 Resources

- [Mistral Vibe](https://docs.mistral.ai/vibe/) · [Vibe skills](https://docs.mistral.ai/vibe/code/cli/skills) · [Vibe agents](https://docs.mistral.ai/vibe/code/cli/agents)
- [Mistral Le Chat](https://chat.mistral.ai) · [Mistral Agents docs](https://docs.mistral.ai/agents/introduction)
- [Imagewize](https://imagewize.com)

## 📄 License

[MIT](LICENSE.md) © Imagewize. Third-party skills keep their own MIT licenses — see [NOTICE.md](NOTICE.md).

<div align="center"><sub>Created and maintained by <a href="https://imagewize.com">Imagewize</a>.</sub></div>
