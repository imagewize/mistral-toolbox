# Integrating anubhav-vibe content into Mistral Toolbox — Plan

- **Status:** proposal (not yet executed)
- **Date:** 2026-11-02
- **Source repo:** `/Users/jasperfrumau/code/anubhav-vibe` ("VIBE — AI Chat Modes, Skills, Agents & Plugins" by Anubhav Gain, CC BY-NC-SA 4.0)
- **Target repo:** `mistral-toolbox` (this repository, MIT, Imagewize)

## 1. Question and short answer

Can we use anubhav-vibe to improve and add skills, agents and plugins to mistral-toolbox?

**Yes — selectively, and with one hard caveat: licensing.** The formats line up well:

- Its **skills** (`skills/<name>/SKILL.md`) use the same SKILL.md base format as our Vibe skills and need only mechanical adaptation.
- Its **agents** (`agents/**/*.md`) are single-file role prompts that map directly onto our Le Chat agents.
- Its **plugins** are Claude Code format, which Vibe can adapt automatically, or we convert them to native Agent Plugins 1.0.

The caveat: anubhav-vibe is licensed **CC BY-NC-SA 4.0** and this repo is **MIT**. The NonCommercial clause conflicts with Imagewize's commercial use, and ShareAlike forbids relicensing derivatives as MIT. So we must **adapt and attribute, not bulk-copy** (see section 4). Beyond licensing, anubhav-vibe is a generalist collection of 5,340 skills; only a curated, WordPress-relevant subset belongs here (see section 5).

## 2. What anubhav-vibe contains

| Artifact | Count | Location | Format |
|---|---|---|---|
| Skills | ~5,340 | `skills/<name>/SKILL.md` | SKILL.md + YAML frontmatter (`name`, `description`, `license`, `metadata`) |
| Expert modes | 853 in 52 categories | `modes/<category>/*.md` | Single-file persona/rule markdown |
| Agents (subagents) | ~200 in 10 groups | `agents/**/*.md` | Markdown with frontmatter (`name`, `description`, `tools`, `model`) |
| Plugins | ~120 | `plugins/<name>/` | Claude Code: `.claude-plugin/plugin.json` + `commands/`, `agents/` |
| Slash commands | 112 | `commands/` | Markdown command templates |
| Rules | 111 | `rules/` | Universal behavior policies (many `ecc-*` per-language) |
| Contexts | 8 | `contexts/*.md` | dev / review / debug / deploy / research briefs |
| Prompt templates | 106 | `prompts/` | Domain prompt templates |
| Recipes | 18 | `recipes/` | End-to-end workflows |
| System prompts | 759 | `system-prompts/` | Vendor prompt leaks — **exclude, do not import** |

## 3. Format compatibility map

| anubhav-vibe artifact | mistral-toolbox destination | Conversion needed |
|---|---|---|
| `skills/<name>/SKILL.md` | `skills/<name>/SKILL.md` (Vibe skill) | Mechanical + editorial: rename to Vibe limits (lowercase, hyphens, ≤ 64 chars; strip `ag-`/`ghcopilot-` prefixes), trim `description` to ≤ 1024 chars, add `user-invocable` and `allowed-tools`, set `metadata.version` and `metadata.source`, verify WordPress claims (section 7) |
| `agents/**/*.md` | `agents/ROLE.md` (Le Chat agent) | Strip tool/model frontmatter (Le Chat has no shell or file access); restructure to our agent anatomy: role and scope, critical rules, output format, examples; add example run under `prompts/<agent>/<run>/` |
| `agents/**/*.md` (tool-using roles) | Vibe plugin subagents `ai.mistral.vibe/agents/*.toml` | Convert frontmatter to TOML (`schemaVersion`, `agentType = "subagent"`, `enabledTools`, `safety`, `instructions`) inside a plugin package |
| `plugins/<name>/` (Claude format) | `plugins/<name>/` (new top-level dir) | Either rely on Vibe's automatic adaptation of `.claude-plugin/plugin.json`, or convert to native Agent Plugins 1.0 (`plugin.json` with `$schema: https://agent-plugins.org/schemas/1.0.0/plugin.schema.json`) per the `vibe:create-plugin` skill |
| `modes/<category>/*.md` (853) | Selected ones become `skills/` or `agents/` | No Vibe equivalent for "modes"; curate only (section 5). Do not bulk-import |
| `rules/*.md`, `contexts/*.md`, `commands/*.md` | Reference material | Mine for checklists and critical rules to fold into our skills/agents; per AGENTS.md, project-specific rules stay in the consuming project's `.agents/`, not here |
| `recipes/`, `prompts/` | Possibly `prompts/<agent>/<run>/` examples | Use as inspiration for example runs |
| `system-prompts/` (vendor leaks) | **Nothing** | Licensing/IP risk; never import |

## 4. Licensing analysis and recommendation

- anubhav-vibe: **CC BY-NC-SA 4.0** (attribution, non-commercial, share-alike).
- mistral-toolbox: **MIT** (commercial use expected — Imagewize sells WordPress services).

Consequences:

1. **Attribution** is required for any use: name the author and link the source, per artifact (in `metadata.source`) and repo-level (a `NOTICE.md` or `docs/sources.md`).
2. **NonCommercial** means verbatim copying into an MIT repo used commercially is not safely permitted. ShareAlike also means we cannot relicense the copied content as MIT.
3. Therefore the safe pattern is **adaptation**: use anubhav-vibe as reference and raw material, rewrite in our own structure and words where the text would otherwise be copied, keep the factual checklists (which are not copyrightable expression, but we still cite), and record provenance.
4. Alternative: ask the author for an MIT/dual license for the specific artifacts we want. Worth one email; do not block the plan on it.
5. Practical rule for contributors: every imported artifact gets `metadata.source: "github.com/iamanubhavgain/anubhav-vibe <path> (CC BY-NC-SA 4.0, adapted)"` and an entry in `docs/sources.md`.

## 5. Curated candidate list (WordPress-relevant)

Priority imports, mapped to our Elayne (FSE block theme), Nynaeve (Sage 11) and imagewize.com work:

**Vibe skills (`skills/`):**

| Candidate | Why |
|---|---|
| `ag-wordpress` | Umbrella WordPress workflow bundle |
| `ag-wordpress-plugin-development` | Plugin architecture, hooks, REST API, security — feeds Aludra-style plugins |
| `ag-wordpress-theme-development` | Template hierarchy, block editor support — feeds Elayne/Nynaeve |
| `ag-wordpress-woocommerce-development` | WooCommerce stores |
| `ag-codebase-to-wordpress-converter` | Migrating existing sites to WP |
| `ag-wordpress-penetration-testing`, `ag-security-audit`, `ag-security-scanning-security-hardening`, `ag-web-security-testing`, `ag-file-path-traversal` | Strengthens our `code-review` security checklist |
| `ag-application-performance-performance-optimization`, `addy-performance-optimization` | WP performance review |
| `ag-seo`, `ag-seo-audit`, `ag-seo-aeo-*`, `ag-programmatic-seo`, `ag-local-legal-seo-audit` | imagewize.com content/SEO work |
| `accessibility-wcag`, `ag-accessibility-compliance-accessibility-audit`, `ag-fixing-accessibility` | A11y audits for client sites |
| `ag-php-pro`, `ghcopilot-instr-php-mcp-server`, `php-laravel` | PHP quality for Sage 11 / Acorn / Bedrock |

**Le Chat agents (`agents/`):** from `agents/quality-assurance/` (code-reviewer, security-auditor, performance-engineer, accessibility-specialist), `agents/core-development/frontend-architect.md`, `agents/research-analysis/`, `agents/orchestration/` — re-scoped to WordPress and our agent anatomy, each with a `prompts/<agent>/<run>/` example.

**Vibe plugins (`plugins/`, new):** `a11y-audit`, `accessibility-checker`, `lighthouse-runner`, `security-guidance`, `code-review-assistant`, `changelog-writer`, `commit-commands`, `smart-commit`, `git-flow`, `pr-reviewer` — the most WordPress-agnostic but directly useful in client repos.

## 6. Gaps — what anubhav-vibe does NOT have

A search of its 5,340 skills found **no dedicated WP-CLI, Bedrock, block-theme/FSE-specific, Roots Sage, ACF or Elayne/Nynaeve content** — only generic WordPress bundles. Those must be authored by us (our existing `code-review`, `FRONTEND-DEV`, `REVIEWER` already cover some of this). Treat anubhav-vibe as a force multiplier for the generic layer (security, performance, SEO, a11y, PHP), not as a source of Imagewize-specific conventions.

## 7. Import standards (quality gates from AGENTS.md)

Every imported artifact must pass these before merge:

1. **Verify every WordPress claim** against WordPress core or a real Imagewize project. anubhav-vibe contains forward-looking claims (e.g. "WordPress 7.0 features") that must be checked against what actually exists today; remove or reword anything unverifiable.
2. **Keep skills generic.** Project-specific rules (Elayne, Nynaeve, Aludra) belong in the consuming project's `.agents/code-review.md`, not in this repo.
3. **Command style:** prescribed commands must be plain single commands that fit an allowlist — no shell loops, no `$(…)`, no `python3` one-liners; read files with `read_file`.
4. **Frontmatter limits:** `name` lowercase letters/digits/hyphens, ≤ 64 chars; `description` ≤ 1024 chars; set `metadata.version` on every artifact and bump it on every change.
5. **Le Chat agents:** one role per file (`ROLE.md`), structure = role and scope, critical rules, output format, examples of expected output; add an example run under `prompts/<agent>/<run>/` whenever behavior changes.
6. **Process:** semantic commit messages, no AI attribution trailers, work on a branch, merge via PR, record every change in `CHANGELOG.md` under `[Unreleased]`, and name the projects that need updated copies in the PR description.

## 8. Proposed repo layout after the first imports

```
mistral-toolbox/
├── AGENTS.md
├── .vibe/config.toml
├── agents/                  # Le Chat agents (existing + imported, WP-adapted)
├── skills/                  # Vibe skills (existing + imported)
├── plugins/                 # NEW — Vibe plugin packages (Agent Plugins 1.0)
├── prompts/                 # Example runs (existing + new per agent)
├── docs/                    # NEW — this plan, sources.md, sync notes
├── README.md
├── CHANGELOG.md
└── LICENSE.md / NOTICE.md   # NOTICE.md NEW if we record third-party sources
```

README's structure section and AGENTS.md's layout section get updated in the same PRs that land the first imports.

## 9. Phased execution plan

| Phase | Work | Output | Acceptance |
|---|---|---|---|
| **0. Licensing decision** | Decide adapt-vs-ask-author; create `NOTICE.md` / `docs/sources.md` skeleton; optionally email author about MIT for chosen artifacts | Licensing approach recorded in this doc + CHANGELOG | No verbatim CC BY-NC-SA text lands in the repo without attribution |
| **1. Curate** | Pick the section-5 list; for each, read the source fully and score relevance to Elayne/Nynaeve/imagewize.com | Shortlist with per-item notes in a scratch doc | Each shortlisted item has a named destination (skill/agent/plugin) |
| **2. Convert skills** | Script-assisted copy: rename dir, rewrite frontmatter (name/description/version/source), then manual pass for quality gates (section 7) | `skills/<new-name>/SKILL.md` per item | Frontmatter valid, WP claims verified, commands allowlist-safe |
| **3. Convert agents** | Adapt `agents/**` markdown to Le Chat anatomy; create `prompts/<agent>/<run>/` example runs | `agents/ROLE.md` + example runs | Example run produces the documented output format |
| **4. Convert plugins** | Port priority plugins to native Agent Plugins 1.0 (`plugin.json` with `$schema`, `skills/`, optional `ai.mistral.vibe/` extensions) under `plugins/` | `plugins/<name>/` packages | Plugin loads in Vibe (`/reload`, no fatal diagnostics) in a test project |
| **5. Reference layer** | Fold useful `rules/`, `contexts/`, `commands/` material into existing skills' checklists; skip modes except individually curated ones | Diff edits to existing skills | code-review skill gains security/performance/a11y sections; version bumped |
| **6. Ship** | Branch per phase, semantic commits, PRs, CHANGELOG `[Unreleased]` entries, README/AGENTS.md layout updates, tag release when merged | PRs + `vX.Y.Z` release | All section-7 gates pass |

Suggested order within phases: `wordpress-plugin-development` and `wordpress-theme-development` skills first (highest overlap with our agents), then the security set (extends `code-review`), then SEO/a11y/performance, then plugins.

## 10. Per-artifact conversion checklist

- [ ] Source path recorded in `metadata.source` / `docs/sources.md` with license and "adapted" note
- [ ] Name within Vibe limits; description ≤ 1024 chars; prefix stripped
- [ ] WordPress claims verified against core or a real project (or removed)
- [ ] No project-specific rules (those stay in consuming projects)
- [ ] Commands are single plain commands; reads via `read_file`
- [ ] `metadata.version` set (start at `1.0.0` for new imports)
- [ ] Le Chat agents: anatomy + example run added
- [ ] CHANGELOG `[Unreleased]` entry; PR names projects needing copies

## 11. Maintenance and upstream sync

- Keep a pinned note of the anubhav-vibe commit hash used per import in `docs/sources.md` so re-syncs are diffable.
- Re-sync quarterly or before each release: fetch upstream, diff the curated paths only, re-run the section-7 gates on changes, bump `metadata.version` on touched artifacts.
- Never bulk-sync `skills/` — curation is the point.

## 12. Open questions

1. Licensing: adapt-with-attribution only, or also ask the author for MIT on the shortlist? (Blocks Phase 0.)
2. Scope: just the section-5 shortlist, or also a handful of curated `modes/` (e.g. security/persona modes) as Le Chat agents?
3. Plugins: native Agent Plugins 1.0 conversion for everything, or drop Claude-format plugins in and let Vibe adapt them (less work, less control)?
4. Should imported skills ship example `prompts/` runs too, or only skills/agents?
