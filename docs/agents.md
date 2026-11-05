# Vibe agents

Agent profiles in [`agents/`](../agents/) are TOML files you select with `vibe --agent NAME`, in this repository or any other. Each profile's `instructions` say which skill to load for which task; the model loads them on demand through Vibe's `skill` tool, and `enabled_skills` scopes what the agent may load.

| Agent | Role | Skills it loads |
|-------|------|-----------------|
| [`wp-reviewer`](../agents/wp-reviewer.toml) | Reviews WordPress diffs, PRs, plugins and patterns | code-review, wordpress-plugin-audit, wordpress-coding-standards, wordpress-plugin-testing, code-review-and-quality, security-and-hardening, requesting/receiving-code-review, verification-before-completion |
| [`wp-frontend-builder`](../agents/wp-frontend-builder.toml) | Builds FSE frontends: spec → anchored HTML/CSS → block theme/patterns | design-first-ui-prompting, landing-page, frontend-design, ui-ux-pro-max, design-system-library, design-md, ux-writing, no-ai-design-slop, better-ui, better-colors, frontend-ui-engineering, html-to-block-theme, architectural-drawing, illustration-isometric-mono |
| [`ux-designer`](../agents/ux-designer.toml) | UI/UX design, microcopy, accessibility | brainstorming, ui-ux-pro-max, ux-writing, better-accessibility, interface-review, html-page-review, design-first-ui-prompting, no-ai-design-slop |
| [`devops-oncall`](../agents/devops-oncall.toml) | Incidents (read-only first), on-call, observability, k8s, CI/CD | incident, runbook, alerting-oncall, observability-review, observability-and-instrumentation, security-review, pipeline-review, kubernetes-ops, systematic-debugging |
| [`release-manager`](../agents/release-manager.toml) | Release gates, CI review, git flow, PR creation | release-readiness, pipeline-review, git-workflow, create-pull-request, receiving-code-review, verification-before-completion |
| [`wp-maintainer`](../agents/wp-maintainer.toml) | WordPress update rounds: screenshots, diffs, approval, deployment | wp-update-round, systematic-debugging, verification-before-completion, security-review |
| [`seo-content-writer`](../agents/seo-content-writer.toml) | Plans and drafts SEO content: context, keyword gaps, SERP check, first-hand proof, copy, comparison pages | product-marketing, keyword-gap-analysis, serp-check, first-hand-proof, copywriting, competitors |
| [`seo-publish-reviewer`](../agents/seo-publish-reviewer.toml) | Independent pre-publish gate: SEO audit, schema, AI-search citability, hygiene, CRO | seo-audit, schema, ai-seo, publish-hygiene, cro |
| [`outreach-marketer`](../agents/outreach-marketer.toml) | Drafts cold email sequences and the manual LinkedIn comment queue; never sends | product-marketing, cold-email, linkedin-comment-queue |

```bash
vibe --agent wp-reviewer                    # interactive review session
vibe --agent wp-reviewer -p "review the diff against main"
vibe --agent devops-oncall -p "triage this alert"
vibe --agent seo-content-writer             # plan and draft a post, then hand it to:
vibe --agent seo-publish-reviewer -p "audit drafts/my-post.md before publishing"
```

- Wire them in with `ln -s ~/code/mistral-toolbox/agents ~/.vibe/agents` (see [Quick start](../README.md#-quick-start)). If you use `agent_paths` instead, give an absolute path: Vibe expands `~` in `skill_paths` but not in `agent_paths`, so a `~/…` entry is silently skipped and `vibe --agent NAME` reports the agent as not found.
- The agent name is the TOML file stem; `vibe --agent NAME` fails with the reason if a profile is invalid.
- Skills are **not** auto-loaded — the agent loads them via the `skill` tool when the task calls for it. Remove `enabled_skills` from a profile to let it load any skill the session can see.
- Set `agent_type = "subagent"` in a copy of a profile to make it spawnable by the model as a subagent.
- See [`agents/README.md`](../agents/README.md) for wiring details and the [Vibe agents docs](https://docs.mistral.ai/vibe/code/cli/agents).

---
