# Mistral Toolbox

**Mistral Le Chat agent prompts and Mistral Vibe skills for WordPress development.**

This repository holds two kinds of reusable AI instructions:

- **Le Chat agents** — system prompts you paste into a [Mistral Le Chat](https://chat.mistral.ai) agent to get consistent output for a specific role, such as building a WordPress page section or reviewing its HTML/CSS.
- **Vibe skills** — [Agent Skills](https://docs.mistral.ai/vibe/code/cli/skills) for [Mistral Vibe](https://docs.mistral.ai/vibe/) that run inside your project, read its files, run git and linters, and report — such as `/code-review`.

Imagewize created these for its own WordPress work — the Elayne block theme, the Nynaeve Sage theme and the Aludra block plugin — but they are written to adapt to other projects. Use as-is, extend, or fork.

---

## 📂 Repository Structure

```
mistral-toolbox/
├── AGENTS.md                # Instructions for coding agents working in this repo
├── .vibe/
│   └── config.toml          # Vibe project settings for this repo
├── agents/                  # Le Chat agent system prompts
│   ├── FRONTEND-DEV.md      # Frontend Developer (WordPress-focused)
│   ├── REVIEWER.md          # Frontend Code Reviewer
│   └── (add your own!)
├── prompts/                 # Example Le Chat agent runs (prompt → output → feedback)
│   ├── frontend-dev/
│   │   └── elayne-hero-block/
│   │       ├── PROMPT.md        # Input prompt used
│   │       ├── OUTPUT.md        # Raw agent output
│   │       ├── FEEDBACK.md      # Review notes and issues found
│   │       └── canvas.html      # Generated HTML canvas
│   └── reviewer/
│       └── elayne-hero-block/
│           ├── PROMPT.md        # HTML input submitted for review
│           ├── OUTPUT.md        # Structured review report (FAIL)
│           └── FEEDBACK.md      # Review notes
├── skills/                  # Mistral Vibe skills (16; imported ones carry LICENSE + metadata.source)
│   ├── code-review/             # /code-review — review diffs, PRs, patterns in any WP project
│   ├── frontend-design/         # /frontend-design — 8 aesthetic anchors → HTML/CSS (MIT, Ilm-Alan)
│   ├── html-to-block-theme/     # /html-to-block-theme — HTML/CSS/JS → FSE block theme (MIT, siddik-web)
│   ├── landing-page/            # /landing-page — high-conversion page structure + copy (MIT, MengTo)
│   ├── no-ai-design-slop/       # /no-ai-design-slop — anti-generic-design quality gate (MIT, MengTo)
│   ├── design-first-ui-prompting/ # /design-first-ui-prompting — spec-first UI prompting (MIT, MengTo)
│   ├── ui-ux-pro-max/           # /ui-ux-pro-max — design intelligence + data/ catalogs (MIT, nextlevelbuilder)
│   ├── ux-writing/              # /ux-writing — microcopy standards (MIT, content-designer)
│   ├── wordpress-plugin-audit/  # /wordpress-plugin-audit — 4-dimension plugin audit (MIT, mralaminahamed)
│   ├── wordpress-coding-standards/ # /wordpress-coding-standards — PHPCS + WPCS (MIT, mralaminahamed)
│   ├── wordpress-woocommerce/   # /wordpress-woocommerce — WC gateways, HPOS, blocks (MIT, mralaminahamed)
│   ├── wordpress-plugin-testing/   # /wordpress-plugin-testing — PHPUnit/Brain Monkey/wp-browser (MIT, mralaminahamed)
│   ├── wordpress-i18n-workflow/    # /wordpress-i18n-workflow — POT/PO/MO/JSON + GlotPress (MIT, mralaminahamed)
│   ├── wordpress-database/      # /wordpress-database — dbDelta, $wpdb CRUD, migrations (MIT, mralaminahamed)
│   ├── requesting-code-review/  # /requesting-code-review — reviewer subagent before merge (MIT, obra)
│   ├── verification-before-completion/ # /verification-before-completion — evidence before claims (MIT, obra)
│   └── create-pull-request/   # /create-pull-request — safe gh PR creation, no quoting accidents (authored here)
├── docs/                    # Plans and source notes
│   ├── external-skills-sourcing-plan.md  # Import policy, phased plan, quality gates
│   ├── sources.md           # Verified external sources, licenses, pinned commits, import log
│   └── curation-2026-11-02.md  # Per-round curation notes (what was imported/skipped and why)
├── README.md
├── CHANGELOG.md
├── NOTICE.md                # Third-party sources included in this repo
└── LICENSE.md
```

---

## 💬 Le Chat Agents

### Quick Start

1. Copy any `.md` file from the `agents/` directory (e.g., `agents/FRONTEND-DEV.md`)
2. Paste into Le Chat → **Agents** → New Agent → **System Prompt**
3. Set model to `mistral-large-latest` or `devstral`
4. Start chatting!

> **Tip**: All prompts follow a consistent structure — you can easily modify them for your tech stack.

### Available Agents

| Agent | Role | Focus | Best For |
|-------|------|-------|----------|
| [FRONTEND-DEV.md](/agents/FRONTEND-DEV.md) | Senior Frontend Developer | WordPress themes, HTML/CSS, block patterns | WordPress devs, theme authors |
| [REVIEWER.md](/agents/REVIEWER.md) | Frontend Code Reviewer | HTML/CSS output analysis, FSE compliance | Frontend devs, designers |

**Planned Agents:**
- `BACKEND-DEV.md` - PHP/WordPress & general backend development
- `DEVOPS.md` - Deployment, infrastructure, and CI/CD
- `CONTENT-STRATEGY.md` - Content planning and SEO
- `UI-UX.md` - User interface and experience design
- `QA-TESTING.md` - Quality assurance and testing strategies
- `ACCESSIBILITY.md` - WCAG compliance and a11y best practices

### WordPress Context

The current agents are tailored for these Imagewize projects:

| Project | Type | Tech Stack |
|---------|------|------------|
| **Elayne** | FSE Block Theme | Gutenberg, theme.json, patterns |
| **Nynaeve** | Sage 11 Hybrid | Blade, ACF Composer, React blocks |
| **imagewize.com** | Site | Enterprise WordPress |

They include full page builds with component extraction, developer handoff notes with WordPress implementation mappings, and project-specific conventions (FSE block compatibility, ACF fields, etc.).

### Rules for the Frontend Agents

1. **Production-ready output only** - No placeholders, descriptions, or "replace with X" comments
2. **Mobile-first** - All output must be responsive by default
3. **No centered overlay heroes** - This is the most common failure pattern to avoid
4. **Realistic content** - Use relevant dummy content, never lorem ipsum or placeholder text
5. **Consistent formatting** - Follow the repository's style guidelines

### Example Agent Runs

The `prompts/` directory contains real agent runs — input prompt, raw output, canvas, and review feedback — so you can see how each agent performs in practice and what to watch out for.

| Run | Agent | Status |
|-----|-------|--------|
| [frontend-dev/elayne-hero-block](/prompts/frontend-dev/elayne-hero-block/) | FRONTEND-DEV | Reviewed — see FEEDBACK.md |
| [reviewer/elayne-hero-block](/prompts/reviewer/elayne-hero-block/) | REVIEWER | FAIL — CSS variable namespace + dash syntax errors |

Each run folder contains:
- **PROMPT.md** — the exact input sent to the agent
- **OUTPUT.md** — raw agent response
- **canvas.html** — generated HTML/CSS output (frontend runs)
- **FEEDBACK.md** — review notes: what worked, what failed, fixes needed

---

## 🛠 Mistral Vibe Skills

Skills run inside your project with Vibe's tools. They are invoked as slash commands.

| Skill | Command | What it does |
|-------|---------|--------------|
| [code-review](/skills/code-review/SKILL.md) | `/code-review [target]` | Reviews a branch diff, a GitHub PR, or a block, pattern, template or path in place, in any WordPress plugin, theme or site. Detects the project type, minimum PHP/WordPress and lint commands from the repository, and applies the project's own rules from `.agents/code-review.md`. |
| [frontend-design](/skills/frontend-design/SKILL.md) | `/frontend-design` | Builds a frontend with one of eight aesthetic anchors locked to exact CSS tokens, with real on-screen content instead of filler — output uses `var(--wp--preset--*)` and theme.json conventions so it converts cleanly to WordPress block patterns. MIT, adapted from `Ilm-Alan/frontend-design`. |
| [html-to-block-theme](/skills/html-to-block-theme/SKILL.md) | `/html-to-block-theme` | Converts an HTML/CSS/JS design into a production-ready WordPress block theme (FSE): theme.json v3 from design tokens, templates, parts, registered block patterns, Interactivity API, optional WooCommerce. MIT, adapted from `siddik-web/wp-block-theme-converter`. |
| [landing-page](/skills/landing-page/SKILL.md) | `/landing-page` | Designs a high-converting landing page — one offer, one audience, one primary action — with structure, layout types, conversion strategies, copy templates and SEO/AEO; ships a WordPress block-pattern handoff section so HTML/CSS output converts cleanly to patterns. MIT, adapted from `MengTo/Skills`. |
| [no-ai-design-slop](/skills/no-ai-design-slop/SKILL.md) | `/no-ai-design-slop` | Passive quality gate against generic AI-design defaults: quality gates, a removal test and a full slop catalog, preserving the chosen art direction. MIT, adapted from `MengTo/Skills`. |
| [design-first-ui-prompting](/skills/design-first-ui-prompting/SKILL.md) | `/design-first-ui-prompting` | Turns fuzzy ideas into a tight design-first spec (prompt skeleton, constraints, single-variable variants, reference pack) for consistent UI generation. MIT, adapted from `MengTo/Skills`. |
| [ui-ux-pro-max](/skills/ui-ux-pro-max/SKILL.md) | `/ui-ux-pro-max` | UI/UX design intelligence: searchable local catalogs (`data/` — styles, palettes, font pairings, 119 UX guidelines, icons, motion, charts, 22 stacks) plus full rule references; synthesizes a design system for new pages and answers targeted UX/stack questions. MIT, adapted from `nextlevelbuilder/ui-ux-pro-max-skill`. |
| [ux-writing](/skills/ux-writing/SKILL.md) | `/ux-writing` | User-centered microcopy (buttons, labels, errors, empty states, onboarding) with voice/tone frameworks, error patterns and accessibility guidance; WordPress i18n note included. MIT, adapted from `content-designer/ux-writing-skill`. |
| [wordpress-plugin-audit](/skills/wordpress-plugin-audit/SKILL.md) | `/wordpress-plugin-audit` | Read-only audit of a WordPress plugin across four dimensions (metadata, naming/i18n, docs vs code, conventions/security) with file:line-verified findings. MIT, adapted from `mralaminahamed/wp-dev-skills`. |
| [wordpress-coding-standards](/skills/wordpress-coding-standards/SKILL.md) | `/wordpress-coding-standards` | Sets up and enforces PHPCS with the WordPress Coding Standards: `phpcs.xml.dist`, running `phpcs`/`phpcbf`, CI and pre-commit integration, inline suppressions, common sniff fixes. MIT, adapted from `mralaminahamed/wp-dev-skills`. |
| [wordpress-woocommerce](/skills/wordpress-woocommerce/SKILL.md) | `/wordpress-woocommerce` | Build or debug WooCommerce extensions: payment gateways, shipping methods, CRUD via WC classes, HPOS compatibility, REST/Store API, cart/checkout blocks, hooks. MIT, adapted from `mralaminahamed/wp-dev-skills`. |
| [wordpress-plugin-testing](/skills/wordpress-plugin-testing/SKILL.md) | `/wordpress-plugin-testing` | Set up and write tests for a WordPress plugin: WP_UnitTestCase integration tests, Brain Monkey/WP_Mock unit tests, factories, AJAX/redirect/multisite, wp-browser acceptance tests, CI matrices. MIT, adapted from `mralaminahamed/wp-dev-skills`. |
| [wordpress-i18n-workflow](/skills/wordpress-i18n-workflow/SKILL.md) | `/wordpress-i18n-workflow` | Full plugin translation workflow: text domain, i18n functions, `wp i18n make-pot`/`make-mo`/`make-json`, JS translations, translator comments, GlotPress, CI. MIT, adapted from `mralaminahamed/wp-dev-skills`. |
| [wordpress-database](/skills/wordpress-database/SKILL.md) | `/wordpress-database` | Custom DB tables in WordPress plugins: `dbDelta` schema rules, versioned upgrade routines, `$wpdb` prepared-statement CRUD, migrations, uninstall cleanup, multisite. MIT, adapted from `mralaminahamed/wp-dev-skills`. |
| [requesting-code-review](/skills/requesting-code-review/SKILL.md) | `/requesting-code-review` | Dispatch a read-only reviewer subagent with crafted context before merging; act on Critical/Important findings. MIT, adapted from `obra/superpowers`. |
| [verification-before-completion](/skills/verification-before-completion/SKILL.md) | `/verification-before-completion` | Evidence before claims: run the proving command fresh, read the output, then claim. MIT, adapted from `obra/superpowers`. |
| [create-pull-request](/skills/create-pull-request/SKILL.md) | `/create-pull-request` | Opens/edits GitHub PRs with `gh` safely: body via `write_file` + `--body-file` (never inline backticks in double quotes), single-quoted titles, then verify with `gh pr view`. Authored in this repo. |

```
/code-review                 # this branch against the default base branch
/code-review 51              # GitHub PR #51
/code-review hero            # audit the block or pattern named "hero"
/code-review --help          # usage and valid targets
```

### Design → HTML/CSS → block patterns

The design skills form a pipeline for FSE themes such as Elayne and Aviendha:

```
brief → /landing-page + /design-first-ui-prompting   (structure, copy, spec)
      → /frontend-design or /ui-ux-pro-max           (anchored HTML/CSS, token-locked)
      → /no-ai-design-slop                            (quality gate on the output)
      → /html-to-block-theme                          (HTML/CSS/JS → theme + patterns)
```

The design skills emit one self-contained HTML file per page with semantic sections
marked by `<!-- ===== Section ===== -->` comments and preset-named CSS custom properties
(`--wp--preset--color--<slug>` etc.), so each section converts to a valid block pattern
without renaming fixes. `/ux-writing` covers the on-screen copy; `/html-to-block-theme`
does the conversion.

### Install

**Per project** — shared with everyone who works on it: copy `skills/code-review/` to the project's `.agents/skills/code-review/`.

**For all your projects** — add this repository's `skills/` directory to `~/.vibe/config.toml`:

```toml
skill_paths = ["~/code/mistral-toolbox/skills"]
```

Vibe uses the first skill it finds with a given name, and searches `skill_paths` before a project's `.vibe/skills/` and `.agents/skills/`. If your config sets `enabled_skills`, add `code-review` to it.

### Project rules

The skill's generic checks are the same everywhere; what catches most regressions is the project's own rules. Add them to `.agents/code-review.md` in the project — facts, named audit targets, files to skip, lint commands, and rules with the failure each one prevents. The file format is documented at the end of [SKILL.md](/skills/code-review/SKILL.md). For a plugin or theme, keep `.agents/` and `.vibe/` out of release zips (`.distignore`, `.gitattributes` `export-ignore`).

### Fewer approval prompts

Approvals come from the `[tools.bash] allowlist` in Vibe's config, not from a skill's `allowed-tools`. Put the commands the skill runs in the project's `.vibe/config.toml` so everyone on the project gets the same approvals. A project allowlist **replaces** the one in `~/.vibe/config.toml`, so include the read-only basics too — the **Setup** section of [SKILL.md](/skills/code-review/SKILL.md) has a starting list.

### Project instructions: AGENTS.md, not a system prompt

Vibe loads `AGENTS.md` files on top of its built-in system prompt; that is the place for project rules. `system_prompt_id` in `config.toml` *replaces* the built-in prompt — tool use, planning and editing instructions included — and is rarely what you want. See [Mistral Vibe: AGENTS.md vs a custom system prompt](https://imagewize.com/mistral-vibe-agents-md-vs-custom-system-prompt/).

---

## 📝 Adding Your Own

### A Le Chat agent

1. **Create**: New `.md` file in the `agents/` directory (e.g., `agents/BACKEND-DEV.md`)
2. **Name it well**: Use role-based naming like `ROLE-SPECIALIZATION.md`
3. **Structure your prompt**:
   - Role description and scope
   - Critical rules (do's and don'ts)
   - Output format expectations
   - Examples of expected output
   - Project-agnostic instructions where possible

**Naming Convention:**
```
{ROLE}-{SPECIALIZATION}.md    e.g., BACKEND-PHP.md
{ROLE}.md                    e.g., DEVOPS.md
{TEAM}-{ROLE}.md             e.g., FRONTEND-DEV.md
```

**Quality Checklist:**
- [ ] Clear, specific instructions (no "you should probably")
- [ ] Examples of expected output
- [ ] Do's and don'ts explicitly stated
- [ ] Project-agnostic where possible (add variants for specific stacks)
- [ ] Follows existing formatting in other prompts

### A Vibe skill

1. **Create** `skills/<name>/SKILL.md` — `name` is lowercase letters, digits and hyphens.
2. **Frontmatter**: `name` and `description` are required; add `user-invocable: true` for a slash command and a `metadata.version` so copies in projects can be compared.
3. **Keep it generic**: project-specific rules belong in the project, not in the skill.
4. **Prescribe allowlist-friendly commands**: plain single commands, no shell loops or one-liners; read files with `read_file`.

---

## 🔗 Resources

- [Mistral Le Chat](https://chat.mistral.ai)
- [Mistral Agent Documentation](https://docs.mistral.ai/capabilities/agent/)
- [Mistral Vibe Skills](https://docs.mistral.ai/vibe/code/cli/skills)
- [Imagewize](https://imagewize.com) - Original creators of this repository

---

## 🤝 Contributing

1. Fork this repository
2. Create a new branch for your agent prompt or skill
3. Add your file following the conventions above (see also [AGENTS.md](/AGENTS.md))
4. Update the README and CHANGELOG
5. Submit a pull request

We welcome contributions for any domain - not just WordPress!

---

*Created and maintained by Imagewize.*
