# Changelog

All notable changes to the mistral-toolbox repository will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

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
