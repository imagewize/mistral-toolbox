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
| [frontend-builder.toml](frontend-builder.toml) | `frontend-builder` | FSE frontend builds: spec → anchored HTML/CSS → block theme | design-first-ui-prompting, landing-page, frontend-design, no-ai-design-slop, better-ui, better-colors, frontend-ui-engineering, html-to-block-theme |
| [ux-designer.toml](ux-designer.toml) | `ux-designer` | UI/UX design, microcopy, accessibility | brainstorming, ui-ux-pro-max, ux-writing, better-accessibility, interface-review, design-first-ui-prompting, no-ai-design-slop |
| [devops-oncall.toml](devops-oncall.toml) | `devops-oncall` | Incidents, on-call, observability, k8s, CI/CD | incident, runbook, alerting-oncall, observability-review, observability-and-instrumentation, security-review, pipeline-review, kubernetes-ops, systematic-debugging |
| [release-manager.toml](release-manager.toml) | `release-manager` | Release gates, CI, git flow, PRs | release-readiness, pipeline-review, git-workflow, create-pull-request, receiving-code-review, verification-before-completion |

## Wiring them into any repository

Point Vibe at this repo's `skills/` and `agents/` in `~/.vibe/config.toml` (user-level,
so it applies in every project):

```toml
skill_paths = ["~/code/mistral-toolbox/skills"]
agent_paths = ["~/code/mistral-toolbox/agents"]
```

For a single project instead, put the same two lines in that project's `.vibe/config.toml`
(the folder must be trusted). Then, from any repository:

```bash
vibe --agent wp-reviewer                 # interactive review session
vibe --agent wp-reviewer -p "review the diff against main"
vibe --agent devops-oncall -p "triage alert X"
```

Vibe discovers only `*.toml` files in `agent_paths`, so this README is ignored by the
loader. The agent name is the file stem.

## Notes

- Skills are loaded on demand by the model via the `skill` tool — a profile does not
  auto-load them. `enabled_skills` in a profile narrows which skills that agent may
  load; remove the line to let it load anything the session can see.
- To make a profile spawnable by the model as a subagent instead of a user-facing
  agent, set `agent_type = "subagent"` in a copy of the file.
- Tool approvals still come from the session's `[tools.bash] allowlist`; an agent
  profile can only narrow permissions, never widen them.
