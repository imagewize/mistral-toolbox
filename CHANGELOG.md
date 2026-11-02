# Changelog

All notable changes to the mistral-toolbox repository will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

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
