<div align="center">

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="assets/logos/wp-vibe-toolbox-dark.svg">
  <img src="assets/logos/wp-vibe-toolbox-primary.svg" alt="WP Vibe Toolbox logo: an isometric box" width="96" height="96">
</picture>

# WP Vibe Toolbox

**Build, review and maintain WordPress block themes with Mistral Vibe.**<br>
From an HTML design to a reviewed FSE block theme, a safe update round and SEO content that ships after a second opinion.

[![Latest release](https://img.shields.io/github/v/release/imagewize/wp-vibe-toolbox?label=release&color=orange)](https://github.com/imagewize/wp-vibe-toolbox/releases/latest)
[![License: MIT](https://img.shields.io/github/license/imagewize/wp-vibe-toolbox?color=blue)](LICENSE.md)
[![Mistral Vibe](https://img.shields.io/badge/Mistral-Vibe-FA520F)](https://docs.mistral.ai/vibe/)
[![Skills](https://img.shields.io/badge/skills-61-brightgreen)](docs/skills.md)
[![Agents](https://img.shields.io/badge/agents-9-brightgreen)](docs/agents.md)
[![Prompts](https://img.shields.io/badge/Le%20Chat%20prompts-2-brightgreen)](docs/le-chat-prompts.md)

[Quick start](#quick-start) · [Workflow](docs/workflow.md) · [Skills](docs/skills.md) · [Agents](docs/agents.md) · [Install](docs/install.md)

</div>

---

Out of the box, Mistral Vibe doesn't know what a block theme is. It writes classic PHP templates, hardcodes colours instead of `theme.json` presets, invents blocks and calls it done when the page looks nothing like the design. This toolbox fixes that:

- **It knows the WordPress way.** `theme.json` v3 first, patterns and parts second, CSS last.
- **It checks its own work.** Pattern validation in a real browser, PHPCS with the WordPress standard, and source-vs-site screenshots at desktop and mobile width.
- **It asks before it ships.** Update rounds need your approval; content goes to an independent reviewer first.

Made by a block-theme developer who uses it daily.

## From design to live site

| Step | Agent / skill | You get |
|------|---------------|---------|
| Design | `wp-frontend-builder` | A locked design system and an HTML/CSS prototype, one section per future pattern |
| Build | `/html-to-block-theme` | A production FSE block theme: `theme.json` v3, patterns and parts |
| Review | `wp-reviewer`, `/code-review` | WordPress-standards review with a `file:line` and failure scenario per finding |
| Maintain | `wp-maintainer`, `/wp-update-round` | Before/after screenshots, pixel diff, approval, deploy |
| Publish | `seo-content-writer` → `seo-publish-reviewer` | Drafted content, reviewed before it goes live |

Works best with the [Aviendha](https://github.com/imagewize/aviendha) starter theme and the [Aludra](https://github.com/imagewize/aludra) block library. See the full [workflow](docs/workflow.md) and the [architect-demo case study](docs/workflow.md#case-study-an-html-design-to-a-block-theme).

![Terminal recording of vibe --agent wp-reviewer reviewing the latest commit in wp-vibe-toolbox: the agent loads the code-review skill, runs git checks and reports an OVERALL ASSESSMENT](docs/assets/vibe-agent-demo.gif)

## Quick start

Point Vibe at the skills in `~/.vibe/config.toml`:

```toml
skill_paths = ["~/code/wp-vibe-toolbox/skills"]
```

Sync the agents (re-run after `git pull`):

```bash
mkdir -p ~/.vibe/agents
rsync -a ~/code/wp-vibe-toolbox/agents/ ~/.vibe/agents/
```

Then, in any WordPress project:

```bash
vibe                                         # /html-to-block-theme, /wp-update-round, /code-review, …
vibe --agent wp-frontend-builder             # design to block theme
vibe --agent wp-reviewer -p "review the diff against main"
```

Using Le Chat instead? Paste [`FRONTEND-DEV.md`](prompts/frontend-dev/FRONTEND-DEV.md) into **Agents → New Agent → System Prompt**. Per-project installs, approval allowlists and model tips: [docs/install.md](docs/install.md).

## What's inside

| Kind | Count | |
|------|:-----:|---|
| [Vibe skills](docs/skills.md) | 61 | Slash commands that read your files, run git and linters, and report |
| [Vibe agents](docs/agents.md) | 9 | Role profiles for `vibe --agent NAME`, each with a spawnable subagent copy |
| [Le Chat prompts](docs/le-chat-prompts.md) | 2 | System prompts for agents without shell access, with recorded runs |

Skills by area: WordPress development (9) · Design & frontend (17) · Development workflow & quality (11) · DevOps & release (11) · SEO & content marketing (13).

Why they behave the way they do: [design principles](docs/principles.md).

## Documentation

[Workflow](docs/workflow.md) · [Skills](docs/skills.md) · [Agents](docs/agents.md) · [Le Chat prompts](docs/le-chat-prompts.md) · [Install](docs/install.md) · [Principles](docs/principles.md) · [Contributing](docs/contributing.md) · [Sources](docs/sources.md) · [Credits](docs/credits.md) · [Changelog](CHANGELOG.md)

## License

[MIT](LICENSE.md) © Imagewize. Most skills are adapted from open-source collections and keep their own licenses (MIT, one Apache-2.0): see [credits](docs/credits.md) and [NOTICE.md](NOTICE.md).

<div align="center"><sub>Created and maintained by <a href="https://imagewize.com">Imagewize</a>.</sub></div>
