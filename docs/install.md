# Install

**For all your projects** — add this repository's `skills/` to `~/.vibe/config.toml` and sync `agents/` into `~/.vibe/agents/` with rsync, as in [Quick start](../README.md#quick-start) (no `--delete` if you keep private profiles in `~/.vibe/agents/`; symlink and `agent_paths` alternatives are in [agents.md](agents.md)). Vibe uses the first skill it finds with a given name and searches `skill_paths` before a project's `.vibe/skills/` and `.agents/skills/`. If your config sets `enabled_skills`, add the skills you want to it.

**For one project** — put the same lines in that project's `.vibe/config.toml` (the folder must be trusted), or copy individual skill directories (e.g. `skills/code-review/`) into the project's `.agents/skills/` so everyone on the project gets them. Copies carry `metadata.version`, so you can compare them with this repository.

<details>
<summary><strong>Project rules for <code>/code-review</code></strong></summary>

The skill's generic checks are the same everywhere; what catches most regressions is the project's own rules. Add them to `.agents/code-review.md` in the project — facts, named audit targets, files to skip, lint commands, and rules with the failure each one prevents. The file format is documented at the end of [SKILL.md](../skills/code-review/SKILL.md). For a plugin or theme, keep `.agents/` and `.vibe/` out of release zips (`.distignore`, `.gitattributes` `export-ignore`).

</details>

<details>
<summary><strong>Fewer approval prompts</strong></summary>

**Quickest:** start Vibe with `vibe --agent wp-frontend-builder --smart-approve`. It classifies each tool call and only prompts for risky ones. `--auto-approve` (alias `--yolo`) skips every prompt, so use it only on a throwaway site. Commands that chain with `&&`, `;` or `|`, use shell variables, or touch paths outside the working directory (for example `~/code/aludra` or the local site's folder) prompt every time even when each command is on the allowlist; in the approval dialog choose "Allow for remainder of this session".

Approvals come from the `[tools.bash] allowlist` in Vibe's config, not from a skill's `allowed-tools`. Put the commands the skill runs in the project's `.vibe/config.toml` so everyone on the project gets the same approvals. A project allowlist **replaces** the one in `~/.vibe/config.toml`, so include the read-only basics too — the **Setup** section of [code-review's SKILL.md](../skills/code-review/SKILL.md) has a starting list.

</details>

<details>
<summary><strong>Faster model for coding runs (GLM) and a cheap approval classifier</strong></summary>

**Model.** The author gets faster coding runs from GLM (`zai-glm-5-3`, served through the Mistral provider) than from `mistral-large-4`, for theme and pattern work like the [Kadewerk case study](workflow.md#case-study-an-html-design-to-a-block-theme). That is one developer's experience on one kind of task, not a benchmark, so try both on your own repo. Add a preset to `~/.vibe/config.toml` and make it the active model:

```toml
active_model = "glm-5-3"

[[models]]
name = "zai-glm-5-3"
alias = "glm-5-3"
provider = "mistral"
thinking = "high"
```

Every `[[models]]` entry needs a `name`, a `provider` and an `alias`. An entry without them is not a usable preset.

**Smart approve.** Start with `vibe --smart-approve` (or `vibe --agent smart-approve`, or press `Shift+Tab` in a session). Vibe still applies your allowlist and denylist first, then classifies each remaining tool call, runs the ones it judges safe and asks before risky ones. It is a classifier, not a sandbox: a call judged safe runs with your account's access, so use `ask` or an isolated environment for untrusted code. With no setting, Vibe picks a small Mistral model as the classifier if one is available, otherwise your session model, which adds cost and latency to every tool call when that is GLM or Large. Pin a small classifier instead ([docs](https://docs.mistral.ai/vibe/code/safety-approvals-permissions#smart-approve)):

```toml
[utility_models]
smart_approve = "classifier"

[[models]]
name = "mistral-small-latest"
provider = "mistral"
alias = "classifier"
```

`smart_approve` must be the `alias` of one of your `[[models]]` presets (or `active` for the session model). To make smart approve the default, set `default_agent = "smart-approve"`. That applies when you start `vibe` without `--agent`. Whether a custom profile such as `wp-frontend-builder` can also run in smart-approve mode is not documented on that page, so check with a short test run before relying on it.

</details>

<details>
<summary><strong>Real-browser access (<code>/real-browser-control</code>)</strong></summary>

The skill drives the user's real, logged-in Chrome through [real-browser-mcp](https://github.com/ofershap/real-browser-mcp) (MIT) — a local MCP server plus an MV3 extension over a localhost WebSocket. It needs two pieces beyond `skill_paths`: the extension loaded in Chrome (recommended: unpacked from the pinned clone at `chrome://extensions` → Developer mode → Load unpacked → `extension/`; the store listing exists but has a thin review base) and a `[[mcp_servers]]` stdio entry in `~/.vibe/config.toml` running the clone's built `mcp-server/dist/index.js`. Full steps: [skills/real-browser-control/SKILL.md](../skills/real-browser-control/SKILL.md).

</details>

<details>
<summary><strong>Project instructions: AGENTS.md, not a system prompt</strong></summary>

Vibe loads `AGENTS.md` files on top of its built-in system prompt; that is the place for project rules. `system_prompt_id` in `config.toml` *replaces* the built-in prompt — tool use, planning and editing instructions included — and is rarely what you want. See [Mistral Vibe: AGENTS.md vs a custom system prompt](https://imagewize.com/mistral-vibe-agents-md-vs-custom-system-prompt/).

</details>

---
