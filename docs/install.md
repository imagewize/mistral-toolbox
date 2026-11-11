# Install

**For all your projects** — add this repository's `skills/` to `~/.vibe/config.toml` and sync `agents/` into `~/.vibe/agents/` with rsync, as in [Quick start](../README.md#-quick-start). Vibe uses the first skill it finds with a given name and searches `skill_paths` before a project's `.vibe/skills/` and `.agents/skills/`. If your config sets `enabled_skills`, add the skills you want to it.

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
<summary><strong>Real-browser access (<code>/real-browser-control</code>)</strong></summary>

The skill drives the user's real, logged-in Chrome through [real-browser-mcp](https://github.com/ofershap/real-browser-mcp) (MIT) — a local MCP server plus an MV3 extension over a localhost WebSocket. It needs two pieces beyond `skill_paths`: the extension loaded in Chrome (recommended: unpacked from the pinned clone at `chrome://extensions` → Developer mode → Load unpacked → `extension/`; the store listing exists but has a thin review base) and a `[[mcp_servers]]` stdio entry in `~/.vibe/config.toml` running the clone's built `mcp-server/dist/index.js`. Full steps: [skills/real-browser-control/SKILL.md](../skills/real-browser-control/SKILL.md).

</details>

<details>
<summary><strong>Project instructions: AGENTS.md, not a system prompt</strong></summary>

Vibe loads `AGENTS.md` files on top of its built-in system prompt; that is the place for project rules. `system_prompt_id` in `config.toml` *replaces* the built-in prompt — tool use, planning and editing instructions included — and is rarely what you want. See [Mistral Vibe: AGENTS.md vs a custom system prompt](https://imagewize.com/mistral-vibe-agents-md-vs-custom-system-prompt/).

</details>

---
