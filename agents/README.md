# Vibe agent profiles

TOML agent profiles for [Mistral Vibe](https://docs.mistral.ai/vibe/). Each profile is a
role agent that loads the toolbox `skills/` on demand through Vibe's `skill` tool — the
profile's `instructions` say which skill to load for which task, and `enabled_skills`
scopes what the agent may load.

These are Vibe agents (selectable with `vibe --agent NAME`), not the Le Chat system
prompts — those live in [`prompts/`](../prompts/) together with their example runs.

## Profiles

| Profile | Agent name | Role | Skills it loads |
|---------|-----------|------|-----------------|
| [wp-reviewer.toml](wp-reviewer.toml) | `wp-reviewer` | WordPress code review (diffs, PRs, plugins, patterns) | code-review, wordpress-plugin-audit, wordpress-coding-standards, wordpress-plugin-testing, code-review-and-quality, security-and-hardening, requesting/receiving-code-review, verification-before-completion |
| [wp-frontend-builder.toml](wp-frontend-builder.toml) | `wp-frontend-builder` | WordPress FSE frontend builds: spec → anchored HTML/CSS → block theme/patterns | design-first-ui-prompting, landing-page, frontend-design, ui-ux-pro-max, design-system-library, design-md, ux-writing, no-ai-design-slop, better-ui, better-colors, frontend-ui-engineering, html-to-block-theme, architectural-drawing, illustration-isometric-mono |
| [ux-designer.toml](ux-designer.toml) | `ux-designer` | UI/UX design, microcopy, accessibility | brainstorming, ui-ux-pro-max, ux-writing, better-accessibility, interface-review, html-page-review, design-first-ui-prompting, no-ai-design-slop |
| [devops-oncall.toml](devops-oncall.toml) | `devops-oncall` | Incidents, on-call, observability, k8s, CI/CD | incident, runbook, alerting-oncall, observability-review, observability-and-instrumentation, security-review, pipeline-review, kubernetes-ops, systematic-debugging |
| [release-manager.toml](release-manager.toml) | `release-manager` | Release gates, CI, git flow, PRs | release-readiness, pipeline-review, git-workflow, create-pull-request, receiving-code-review, verification-before-completion |
| [wp-maintainer.toml](wp-maintainer.toml) | `wp-maintainer` | WordPress update rounds: screenshots, diffs, approval, deployment | wp-update-round, systematic-debugging, verification-before-completion, security-review |
| [seo-content-writer.toml](seo-content-writer.toml) | `seo-content-writer` | Plans and drafts SEO content: context, keyword gaps, SERP check, first-hand proof, copy, comparison pages | product-marketing, keyword-gap-analysis, serp-check, first-hand-proof, copywriting, competitors |
| [seo-publish-reviewer.toml](seo-publish-reviewer.toml) | `seo-publish-reviewer` | Independent pre-publish gate: SEO audit, schema, AI-search citability, hygiene, CRO | seo-audit, schema, ai-seo, publish-hygiene, cro |
| [outreach-marketer.toml](outreach-marketer.toml) | `outreach-marketer` | Drafts cold email sequences and the manual LinkedIn comment queue; never sends | product-marketing, cold-email, linkedin-comment-queue |

## Wiring them into any repository

Vibe always searches `~/.vibe/agents/` for agent profiles, with no config needed. Link
this directory there once, so the profiles work in every project and stay current with
`git pull`:

```bash
ln -s ~/code/mistral-toolbox/agents ~/.vibe/agents
```

Add the skills the profiles load to `~/.vibe/config.toml` (user-level, so it applies in
every project):

```toml
skill_paths = ["~/code/mistral-toolbox/skills"]
```

The symlink makes `~/.vibe/agents` *this* directory, so a private profile you add there
lands in the repository. To keep your own profiles next to these, make `~/.vibe/agents` a
real directory and link the individual `.toml` files into it instead.

**`agent_paths` alternative:** Vibe also reads profiles from directories listed in
`agent_paths`, but it does not expand `~` there (it does in `skill_paths`). A
`~/code/...` entry is treated as a path relative to the working directory, silently
skipped, and `vibe --agent NAME` then fails with `Agent 'NAME' not found`. Use an absolute
path, and keep it in your own `~/.vibe/config.toml` rather than a committed project config.

Then, from any repository:

```bash
vibe --agent wp-reviewer                 # interactive review session
vibe --agent wp-reviewer -p "review the diff against main"
vibe --agent devops-oncall -p "triage alert X"
```

Vibe discovers only `*.toml` files in its agent directories, so this README is ignored by
the loader. The agent name is the file stem.

## Notes

- Skills are loaded on demand by the model via the `skill` tool — a profile does not
  auto-load them. `enabled_skills` in a profile narrows which skills that agent may
  load; remove the line to let it load anything the session can see.
- To make a profile spawnable by the model as a subagent instead of a user-facing
  agent, set `agent_type = "subagent"` in a copy of the file.
- Tool approvals still come from the session's `[tools.bash] allowlist`; an agent
  profile can only narrow permissions, never widen them.
