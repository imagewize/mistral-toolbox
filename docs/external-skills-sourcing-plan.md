# Sourcing external skills, agents, plugins and connectors into Mistral Toolbox — Plan

- **Status:** in progress — Phase 0 executed 2026-11-02 (`docs/sources.md` + `NOTICE.md` created; licenses verified via LICENSE files and the GitHub API; commits pinned in `docs/sources.md`); Phase 1 license checks recorded there
- **Date:** 2026-11-02
- **Replaces:** `docs/anubhav-vibe-integration-plan.md` (removed — its source collection is CC BY-NC-SA 4.0 and stays reference-only, see section 2)
- **Target repo:** `mistral-toolbox` (this repository, MIT, Imagewize)

## 1. Question and short answer

Can we improve mistral-toolbox with external collections of skills, agents, plugins and MCP connectors — for design, DevOps, WordPress development, code review, UX/UI?

**Yes — from permissively licensed sources only.** This repo is MIT and used commercially by Imagewize, so anything we import must come from an MIT-, Apache-2.0-, CC0-, BSD- or public-domain-licensed source. The SKILL.md-based formats line up well:

- **Skills** (`skills/<name>/SKILL.md` in the Agent Skills open standard) map directly onto our Vibe skills with mechanical adaptation.
- **Agents / personas** (single-file role markdown) map onto our Le Chat agents (`agents/ROLE.md`).
- **Plugin marketplaces** (Claude Code format) convert to native Agent Plugins 1.0 under a new `plugins/` dir.
- **MCP servers** (e.g. Figma) are not vendored into this repo — they belong to the consuming project's Vibe config; we document them as recommended connectors.

## 2. Licensing policy (hard rules)

1. **Allowed import licenses:** MIT, Apache-2.0, CC0-1.0, BSD-2-Clause, BSD-3-Clause, Unlicense, public domain.
2. **Never import** from NonCommercial, ShareAlike or all-rights-reserved sources (CC BY-NC\*, CC BY-SA\*, CC BY-NC-SA\*, proprietary). `anubhav-vibe` (CC BY-NC-SA 4.0) is **reference-only**: read for ideas, never copied, not even "adapted" — the NC clause conflicts with Imagewize's commercial use and ShareAlike forbids relicensing derivatives as MIT.
3. **Repo license is only a gate, not a guarantee.** Index/list repos mix licenses per artifact (the `travisvn`/`ComposioHQ` awesome lists say so explicitly). Every artifact gets its **own license check** — quality gate 0 below.
4. **Verify the license at the pinned commit**, not just today: upstream licenses change. Re-check on every sync (section 11).
5. **Attribution:** MIT and Apache-2.0 require retaining copyright notices; CC0 requires none, but we record provenance anyway. Every imported artifact gets `metadata.source` with repo, path and license, an entry in `docs/sources.md` with the pinned commit hash, and a repo-level entry in `NOTICE.md`. When a source ships a per-skill LICENSE, copy it into the artifact directory.

## 3. Source table

Licenses marked **(LICENSE fetched)** were verified by reading the repo's LICENSE file on 2026-11-02; **(API)** means the GitHub API `license` field. Pinned commit hashes and full verification notes live in `docs/sources.md`.

### Ready to import (verified permissive licenses)

| Source | License | Covers |
|---|---|---|
| `obra/superpowers` | MIT (LICENSE fetched) | Dev-workflow skills: brainstorming, writing-plans, systematic-debugging, test-driven-development, requesting/receiving-code-review, subagent-driven-development |
| `github/awesome-copilot` | MIT (LICENSE fetched) | GitHub Inc.'s community agents, instructions, skills and prompts across domains, incl. a DevOps specialist agent (`.agent.md`, `.prompt.md`) |
| `wshobson/agents` | MIT (LICENSE fetched) | Multi-harness plugin marketplace: Claude Code, Codex, Cursor, Copilot, and more — reviewer, PR, git-flow style plugins |
| `VoltAgent/awesome-agent-skills` | MIT (LICENSE fetched) | Index of 1000+ agent skills from official dev teams; **per-skill licenses vary** |
| `addyosmani/agent-skills` | MIT | 24 production engineering skills incl. `code-review-and-quality` |
| `NotHarshhaa/devops-skills` | MIT (LICENSE fetched) | Incident response, Kubernetes, Terraform, CI/CD, observability, security, platform engineering |
| `mthalman/agent-personas` | MIT (LICENSE fetched) | Library of AI agent personas (Le Chat agent material) |
| `dontriskit/awesome-ai-system-prompts` | MIT (LICENSE fetched) | System-prompt collections (Le Chat agent material) |
| `jakubkrehel/skills` | MIT (LICENSE fetched) | Skills for building great interfaces |
| `nextlevelbuilder/ui-ux-pro-max-skill` | MIT (LICENSE fetched) | Design intelligence for professional UI/UX across platforms |
| `plugin87/ux-ui-agent-skills` | MIT (LICENSE fetched) | DTCG tokens, 52 components, WCAG 2.2 AA, 138 design systems, hard quality gates |
| `content-designer/ux-writing-skill` | MIT (LICENSE fetched) | Systematic UX writing / content design |
| `fclairamb/awesome-agentic-devops` | CC0-1.0 (LICENSE fetched) | Index of AI SRE / incident / CI-CD agents and tools |
| `sergekostenchuk/ui-ux-agent-skill-system` | Apache-2.0 (LICENSE fetched) | Vendor-neutral UI/UX skill system with per-agent adapters |
| `alirezarezvani/claude-skills` | MIT (corroborated) | 380 skills, 96 plugins, 138 commands across 20 domains (engineering, security, review, marketing…) |
| `respira-press/agent-skills-wordpress` | MIT (README contributing clause) | 50+ WordPress skills: audit, optimize, fix, migrate real sites |
| `GLips/Figma-Context-MCP` | MIT (registry listings, 16k stars) | MCP server feeding Figma layout/style data to coding agents — **document as connector, do not vendor** |
| `MengTo/Skills` | MIT (LICENSE fetched) | Designer/builder skills: web-design, Tailwind CSS v4, design systems |
| `Ilm-Alan/frontend-design` | MIT (LICENSE fetched) | Frontend-design skill with eight aesthetic anchors — palette, typography, texture locked to CSS tokens; ideal for distinctive HTML/CSS output |
| `Koomook/claude-frontend-skills` | MIT (LICENSE fetched) | Plugin of skills for distinctive, non-generic frontend designs |
| `xiaopu-ai/web-design` | MIT (LICENSE fetched) | Spec-first, code-second web design skill |
| `rekryt/skill-tailwind` | MIT (LICENSE fetched) | Tailwind CSS v4 skill |
| `siddik-web/wp-block-theme-converter` | MIT (LICENSE fetched) | Converts any HTML/CSS/JS project into a production-ready WordPress block theme (FSE) — the design → WP-pattern bridge |
| `mralaminahamed/wp-dev-skills` | MIT (API) | WordPress plugin development skills |
| `BagelHole/DevOps-Security-Agent-Skills` | MIT (API) | 80+ skills: K8s, Terraform, AWS/Azure/GCP, SOC2/ISO27001, incident response |
| `mustafakendiguzel/claude-code-ui-agents` | MIT (API) | UI/UX agent prompts |

### Verify license before any import

| Source | Why caution |
|---|---|
| `jorgerosal/wordpress-skills` (plugin review, security audits, WooCommerce, WPGraphQL, performance, REST, migrations) | Claims MIT but ships no LICENSE file, and ~78 of 120 skills are vendored from 12 other projects — per-skill license audit required before any use |
| `anthropics/skills` | Mixed: example skills Apache-2.0, document skills source-available — per-skill licenses only |
| `shadcn-ui/ui` | MIT (API) — component code reference, not prompts |

**Tools we reference but never vendor:** `humanmade/block-runner` (GPL-2.0+, LICENSE fetched) converts HTML into WordPress blocks — GPL is fine for *running* it in a client project, but its code and docs must not be copied into this MIT repo. List it in `docs/sources.md` as a recommended project-level tool for HTML → block-pattern conversion.

### Reference-only (never import)

- `anubhav-vibe` (CC BY-NC-SA 4.0) — generalist 5,340-skill collection incl. 35 `acd-*-design` aesthetic-style skills and design modes; the *categories* inform our curation, the content is never copied
- `WordPress/agent-skills` (official WP org, incl. `wp-patterns` / `wp-block-themes`) — GitHub API reports NOASSERTION (no LICENSE at `trunk`, pinned `eff3785f`); reference-only unless the WP org adds a CC0/MIT LICENSE (open action item)
- `Automattic/wp-skill`, `Automattic/agent-skills`, `Automattic/wordpress-agent-skills` — no repo-level license detected; reference-only
- `dknauss/agent-skills` — NOASSERTION; reference-only
- `wpacademy/wordpress-dev-skills` — GPL-2.0, outside the allowed license list; reference-only
- `modelcontextprotocol/servers` — no repo-level license detected; reference listing only
- `jiji262/claude-design-skill` — adapted from Anthropic's internal design prompt; derivative of proprietary material, never import regardless of repo license
- Any vendor system-prompt leak collections — licensing/IP risk
- Anything all-rights-reserved (GitHub "no license") — no usage rights at all

## 4. Format compatibility map

| Source artifact | mistral-toolbox destination | Conversion needed |
|---|---|---|
| `SKILL.md` skill dir (Agent Skills standard) | `skills/<name>/SKILL.md` (Vibe skill) | Mechanical + editorial: rename to Vibe limits (lowercase, hyphens, ≤ 64 chars), trim `description` to ≤ 1024 chars, add `user-invocable` and `allowed-tools`, set `metadata.version` and `metadata.source` (+ license), copy per-skill LICENSE if present, verify WordPress claims (section 7) |
| Agent / persona markdown (`.agent.md`, role prompts) | `agents/ROLE.md` (Le Chat agent) | Strip tool/model frontmatter (Le Chat has no shell or file access); restructure to our agent anatomy: role and scope, critical rules, output format, examples; add example run under `prompts/<agent>/<run>/` |
| Tool-using agent definitions | Vibe plugin subagents (`ai.mistral.vibe/agents/*.toml`) inside a plugin package | Convert frontmatter to TOML (`schemaVersion`, `agentType = "subagent"`, `enabledTools`, `safety`, `instructions`) |
| Plugin marketplace packages (Claude format) | `plugins/<name>/` (new top-level dir) | Convert to native Agent Plugins 1.0 (`plugin.json` with `$schema: https://agent-plugins.org/schemas/1.0.0/plugin.schema.json`) per the `vibe:create-plugin` skill, or let Vibe auto-adapt `.claude-plugin/plugin.json` |
| MCP servers (e.g. Figma-Context-MCP) | **Not vendored** — recommended connectors listed in docs for consuming projects to add to their Vibe MCP config | Document name, repo, license, setup command in `docs/sources.md`; MCP servers belong to the project, not this repo |
| Ready-made HTML/CSS designs | **Not vendored** — designs belong to the consuming project (e.g. Elayne) | We import the *skills that produce them*, tuned so output converts cleanly to WP block patterns: semantic markup, `--wp--preset--*` variables, theme.json classes (see FRONTEND-DEV critical rules) |
| Rules / contexts / command templates | Reference material | Mine for checklists and critical rules to fold into our skills/agents; per AGENTS.md, project-specific rules stay in the consuming project's `.agents/`, not here |

## 5. Curated candidate list by area

**WordPress dev (`skills/`):** `respira-press/agent-skills-wordpress` (MIT — audit/optimize/fix/migrate), `mralaminahamed/wp-dev-skills` (MIT — plugin dev), `jorgerosal/wordpress-skills` (only after the per-skill license audit). The official `WordPress/agent-skills`, Automattic, wpacademy and dknauss repos are reference-only — see `docs/sources.md`.

**Code review & workflow (`skills/`):** `obra/superpowers` (code-review pair, systematic-debugging, TDD, writing-plans), `addyosmani/agent-skills` (`code-review-and-quality` + 23 more), security/review subsets of `alirezarezvani/claude-skills`, reviewer agents from `wshobson/agents`.

**DevOps / SRE (`skills/` + connector notes):** `NotHarshhaa/devops-skills` (MIT), `fclairamb/awesome-agentic-devops` (CC0 index), `BagelHole/DevOps-Security-Agent-Skills` (after license check), DevOps agent from `github/awesome-copilot`.

**UI / UX / design (`skills/` and `agents/`):** `nextlevelbuilder/ui-ux-pro-max-skill`, `plugin87/ux-ui-agent-skills`, `jakubkrehel/skills`, `sergekostenchuk/ui-ux-agent-skill-system`, `content-designer/ux-writing-skill`, `mustafakendiguzel/claude-code-ui-agents` (personas → Le Chat agents).

**Working with designs:** `GLips/Figma-Context-MCP` (MIT) — recommend as a project-level MCP connector (Figma → agent), documented, not vendored. `shadcn-ui/ui` (MIT) as component reference for imagewize.com-style frontends.

**Design → HTML/CSS → WordPress patterns (`skills/`):** `Ilm-Alan/frontend-design` (aesthetic anchors locked to CSS tokens — the closest permissive-license equivalent of anubhav-vibe's `acd-*-design` style skills), `MengTo/Skills` (web-design + Tailwind v4), `Koomook/claude-frontend-skills`, `xiaopu-ai/web-design`, `rekryt/skill-tailwind`; bridge to WordPress: `siddik-web/wp-block-theme-converter` (HTML/CSS/JS → FSE block theme), `wp-patterns` / `wp-block-themes` guidance from `WordPress/agent-skills` (reference-only — we replicate it in our own skills), and `humanmade/block-runner` as a project-level conversion tool. Acceptance for this area: a skill-generated HTML/CSS design converts to a valid block pattern in Elayne without manual fixes to CSS variable names or markup semantics.

**Personas / Le Chat agents (`agents/`):** `mthalman/agent-personas`, `dontriskit/awesome-ai-system-prompts`, `mustafakendiguzel` personas — re-scoped to our agent anatomy, each with a `prompts/<agent>/<run>/` example.

**Vibe plugins (`plugins/`, new):** WP-agnostic, client-repo-useful plugin sets from `wshobson/agents` and `alirezarezvani/claude-skills`: PR review, changelog, commit helpers, git flow, code-review assistant.

## 6. Gaps — what these sources do NOT have

None of them carry Elayne/Nynaeve/Aludra-specific conventions, and most lack Bedrock/WP-CLI/Sage-specific depth (the official `WordPress/agent-skills` would cover core blocks/themes/plugins best practices, but it has no detectable license and is reference-only — we author that guidance ourselves). Those we author ourselves; our existing `code-review` skill, `FRONTEND-DEV` and `REVIEWER` agents already cover part of it. Ready-made design *styles* like anubhav-vibe's `acd-*-design` set exist only in CC BY-NC-SA sources, so we rebuild that capability from the MIT design skills above rather than copying styles. Treat external sources as a force multiplier for the generic layer (WordPress core, review, DevOps, UI/UX, design-to-code), not as a source of Imagewize-specific conventions.

## 7. Import standards (quality gates from AGENTS.md)

Every imported artifact must pass these before merge:

0. **License gate:** the artifact's own license is in the allowed list (section 2), verified at the pinned commit, recorded in `metadata.source` and `docs/sources.md`; per-skill LICENSE copied when present. No pass, no import.
1. **Verify every WordPress claim** against WordPress core or a real Imagewize project; remove or reword anything unverifiable.
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
├── agents/                  # Le Chat agents (existing + imported)
├── skills/                  # Vibe skills (existing + imported)
├── plugins/                 # NEW — Vibe plugin packages (Agent Plugins 1.0)
├── prompts/                 # Example runs (existing + new per agent)
├── docs/                    # this plan, sources.md, sync notes
├── README.md
├── CHANGELOG.md
└── LICENSE.md / NOTICE.md   # NOTICE.md NEW — third-party source register
```

README's structure section and AGENTS.md's layout section get updated in the same PRs that land the first imports.

## 9. Phased execution plan

| Phase | Work | Output | Acceptance |
|---|---|---|---|
| **0. Provenance files** | Create `docs/sources.md` and `NOTICE.md`; record licensing policy; verify licenses (LICENSE files + GitHub API) and pin commits; CHANGELOG entry — **done 2026-11-02** | Provenance scaffolding in repo | Policy recorded; no import lands without a sources.md entry |
| **1. Curate + license-check** | For each section-5 candidate: confirm the artifact-level license at a pinned commit (including vendored-content audits like jorgerosal's), read fully, score relevance to Elayne/Nynaeve/imagewize.com | Shortlist with per-item license + relevance notes | Each shortlisted item has a named destination and a verified license |
| **2. Convert skills** | Rename dir, rewrite frontmatter (name/description/version/source/license), copy per-skill LICENSE, then manual pass over quality gates | `skills/<new-name>/SKILL.md` per item | Gates 0–4 pass |
| **3. Convert agents** | Adapt persona/agent markdown to Le Chat anatomy; create `prompts/<agent>/<run>/` example runs | `agents/ROLE.md` + example runs | Example run produces the documented output format |
| **4. Convert plugins** | Port priority plugins to native Agent Plugins 1.0 under `plugins/` | `plugins/<name>/` packages | Plugin loads in Vibe (`/reload`, no fatal diagnostics) in a test project |
| **5. Reference layer** | Fold useful rules/commands material into existing skills' checklists (e.g. extend `code-review`) | Diff edits to existing skills | code-review gains sections; version bumped |
| **6. Ship** | Branch per phase, semantic commits, PRs, CHANGELOG `[Unreleased]` entries, README/AGENTS.md layout updates, tag release when merged | PRs + `vX.Y.Z` release | All section-7 gates pass |

Suggested order within phases: WordPress skills first (`respira-press`, `mralaminahamed`), then the design → HTML/CSS → WordPress-pattern set (`Ilm-Alan/frontend-design`, `MengTo/Skills`, `siddik-web/wp-block-theme-converter`), then review/workflow (`superpowers`, `addyosmani`), then DevOps (`NotHarshhaa`, `BagelHole`), then remaining UI/UX, then plugins.

## 10. Per-artifact conversion checklist

- [ ] License gate passed: artifact license in allowed list, verified at pinned commit; recorded in `metadata.source` + `docs/sources.md`; per-skill LICENSE copied if present
- [ ] Source path and pinned commit hash recorded in `docs/sources.md`
- [ ] Name within Vibe limits; description ≤ 1024 chars; vendor prefix stripped
- [ ] WordPress claims verified against core or a real project (or removed)
- [ ] No project-specific rules (those stay in consuming projects)
- [ ] Commands are single plain commands; reads via `read_file`
- [ ] `metadata.version` set (start at `1.0.0` for new imports)
- [ ] Le Chat agents: anatomy + example run added
- [ ] CHANGELOG `[Unreleased]` entry; PR names projects needing copies

## 11. Maintenance and upstream sync

- Pin the source commit hash per import in `docs/sources.md` so re-syncs are diffable.
- Re-sync quarterly or before each release: fetch upstream, diff the curated paths only, re-run **all** section-7 gates on changes — including the license gate, because upstream licenses change (an MIT → NC change upstream means removal, not adaptation).
- Never bulk-sync `skills/` — curation is the point.

## 12. Open questions

1. ~~`WordPress/agent-skills` license~~ **Resolved 2026-11-02:** GitHub API reports NOASSERTION (no LICENSE at `trunk`, pinned `eff3785f`) → reference-only. Open action: ask the WordPress org to add a CC0/MIT LICENSE; re-evaluate at the next sync.
2. Scope of DevOps and UI/UX imports: full sets, or a curated top-N per area?
3. Plugins: native Agent Plugins 1.0 conversion for everything, or let Vibe auto-adapt Claude-format plugins (less work, less control)?
4. MCP connectors (Figma-Context-MCP etc.): document as recommended project-level connectors in `docs/sources.md`, or leave entirely to consuming projects?
5. Design-to-WP output conventions: which aesthetic-anchor set and CSS-token discipline should our own design skill standardize on, given anubhav-vibe's `acd-*-design` styles cannot be imported? (Candidate base: `Ilm-Alan/frontend-design` anchors + FRONTEND-DEV `--wp--preset--*` rules.)
