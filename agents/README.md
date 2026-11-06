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

Vibe always searches `~/.vibe/agents/` for agent profiles, with no config needed. **Sync
the TOML files there** — the recommended wiring, because copies survive the repo moving
and keep private profiles of your own out of this public repository:

```bash
mkdir -p ~/.vibe/agents
rsync -a ~/code/mistral-toolbox/agents/ ~/.vibe/agents/
```

Syncs go stale, so re-run the `rsync` after every `git pull` of this repository. Don't add
`--delete` unless `~/.vibe/agents/` holds only toolbox profiles — it would delete private
ones. (`rsync` is not in a base macOS install; `brew install rsync` if it's missing, or
fall back to `cp ~/code/mistral-toolbox/agents/*.toml ~/.vibe/agents/`.) Changed only one
profile? Syncing is not needed — copy that single file (after regenerating its
`-subagent` copy, see below): `cp ~/code/mistral-toolbox/agents/<name>*.toml ~/.vibe/agents/`.

Skills are wired differently and need **no** copy or symlink: `skill_paths` (below) expands
`~`, so pointing it at this repository's `skills/` works as is. The copy/symlink caveats
above apply to agent directories only, because `~/.vibe/agents` is a searched directory,
not a config path, and `agent_paths` does not expand `~`.

Add the skills the profiles load to `~/.vibe/config.toml` (user-level, so it applies in
every project):

```toml
skill_paths = ["~/code/mistral-toolbox/skills"]
```

**Symlink alternative, and its pitfall.** `ln -s ~/code/mistral-toolbox/agents ~/.vibe/agents`
works and stays current with `git pull` on its own, but it dangles silently if the repo
moves or is renamed, and anything that replaces the link with a real directory makes every
profile in this repo disappear without a word: `vibe --agent NAME` fails with
`Agent 'NAME' not found`, and spawning one fails with `subagent_type_not_found`. It also
means a private profile you add to `~/.vibe/agents` lands in this public repository. If you
symlink, verify with `ls -la ~/.vibe/agents` (must show the link) and
`vibe --agent wp-reviewer -p "say hi"`.

**`agent_paths` alternative:** Vibe also reads profiles from directories listed in
`agent_paths`, but it does not expand `~` there (it does in `skill_paths`). A `~/code/...`
entry is treated as a path relative to the working directory and silently skipped, so use
an **absolute** path (`/Users/.../code/mistral-toolbox/agents`) in your own
`~/.vibe/config.toml` — a repository cannot register itself this way, since the setting is
user config.

Profiles are discovered when a session starts, so after adding or changing a profile in a
running interactive session, run `/reload` before using it.

Then, from any repository:

```bash
vibe --agent wp-reviewer                 # interactive review session
vibe --agent wp-reviewer -p "review the diff against main"
vibe --agent devops-oncall -p "triage alert X"
```

Vibe discovers only `*.toml` files in its agent directories, so this README is ignored by
the loader. The agent name is the file stem.

## Spawnable subagent copies

Vibe has two kinds of profiles. `agent_type = "agent"` (the default) profiles are
user-facing: selectable with `vibe --agent NAME`, but **not spawnable** — calling
`agents.spawn` with their `config_name` fails with `subagent_type_not_found` ("Unknown
subagent type"). Only `agent_type = "subagent"` profiles are offered to the model for
spawning, and those cannot be selected with `--agent`.

So every base profile has a generated copy next to it, `agents/<name>-subagent.toml`,
identical except `agent_type = "subagent"` and a ` (subagent)` suffix in `display_name`.
Spawn one from a running session by its file stem:

```ts
await tools.agents.spawn({
  name: "draft-post",
  config_name: "seo-content-writer-subagent",
  message: "Draft …",
});
```

Subagents run with the session's model and hooks, and `enabled_skills` still scopes which
skills they may load. They are discovered at session start, so `/reload` after adding one.

**The copies are generated — never edit them by hand.** After changing
`agents/<name>.toml`, regenerate its copy:

```bash
cd ~/code/mistral-toolbox/agents
for f in *.toml; do case "$f" in *-subagent.toml) continue;; esac
  n="${f%.toml}"
  { echo "# Spawnable copy of ${n}.toml — generated; do not edit by hand. Regenerate after changing ${n}.toml (see README.md in this directory)."
    sed -e "s/^display_name = \"\(.*\)\"$/display_name = \"\1 (subagent)\"/" \
        -e 's/^agent_type = "agent"$/agent_type = "subagent"/' "$f"
  } > "${n}-subagent.toml"
done
```

## Notes

- Skills are loaded on demand by the model via the `skill` tool — a profile does not
  auto-load them. `enabled_skills` in a profile narrows which skills that agent may
  load; remove the line to let it load anything the session can see.
- Base profiles stay `agent_type = "agent"`; spawnable copies live next to them as
  `<name>-subagent.toml` — see "Spawnable subagent copies" above.
- Tool approvals still come from the session's `[tools.bash] allowlist`; an agent
  profile can only narrow permissions, never widen them.
