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
├── skills/                  # Mistral Vibe skills
│   ├── code-review/
│   │   └── SKILL.md         # /code-review for WordPress plugins, themes and sites
│   ├── frontend-design/
│   │   ├── SKILL.md         # /frontend-design — anchored HTML/CSS design (MIT, upstream Ilm-Alan/frontend-design)
│   │   └── LICENSE.txt
│   ├── html-to-block-theme/
│   │   ├── SKILL.md         # /html-to-block-theme — HTML/CSS/JS design → FSE block theme (MIT, upstream siddik-web)
│   │   ├── LICENSE
│   │   └── references/      # 21 on-demand conversion workflow docs
│   ├── wordpress-plugin-audit/
│   │   ├── SKILL.md         # /wordpress-plugin-audit — read-only security/consistency audit (MIT, upstream mralaminahamed)
│   │   ├── LICENSE
│   │   └── references/      # 7 checklists: security, escaping, nonces, i18n, readme
│   ├── requesting-code-review/
│   │   ├── SKILL.md         # /requesting-code-review — dispatch reviewer subagent before merge (MIT, upstream obra/superpowers)
│   │   ├── code-reviewer.md
│   │   └── LICENSE
│   └── verification-before-completion/
│       ├── SKILL.md         # /verification-before-completion — evidence before claims (MIT, upstream obra/superpowers)
│       └── LICENSE
├── docs/                    # Plans and source notes
│   ├── external-skills-sourcing-plan.md
│   ├── sources.md           # Verified external sources, licenses, pinned commits, import log
│   └── curation-2026-11-02.md
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
| [wordpress-plugin-audit](/skills/wordpress-plugin-audit/SKILL.md) | `/wordpress-plugin-audit` | Read-only audit of a WordPress plugin across four dimensions (metadata, naming/i18n, docs vs code, conventions/security) with file:line-verified findings. MIT, adapted from `mralaminahamed/wp-dev-skills`. |
| [requesting-code-review](/skills/requesting-code-review/SKILL.md) | `/requesting-code-review` | Dispatch a read-only reviewer subagent with crafted context before merging; act on Critical/Important findings. MIT, adapted from `obra/superpowers`. |
| [verification-before-completion](/skills/verification-before-completion/SKILL.md) | `/verification-before-completion` | Evidence before claims: run the proving command fresh, read the output, then claim. MIT, adapted from `obra/superpowers`. |

```
/code-review                 # this branch against the default base branch
/code-review 51              # GitHub PR #51
/code-review hero            # audit the block or pattern named "hero"
/code-review --help          # usage and valid targets
```

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
