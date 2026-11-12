# Install

**For all your projects** — add this repository's `skills/` to `~/.vibe/config.toml` and sync `agents/` into `~/.vibe/agents/` with rsync, as in [Quick start](../README.md#quick-start) (no `--delete` if you keep private profiles in `~/.vibe/agents/`; symlink and `agent_paths` alternatives are in [agents.md](agents.md)). Vibe uses the first skill it finds with a given name and searches `skill_paths` before a project's `.vibe/skills/` and `.agents/skills/`. If your config sets `enabled_skills`, add the skills you want to it.

**For one project** — put the same lines in that project's `.vibe/config.toml` (the folder must be trusted), or copy individual skill directories (e.g. `skills/code-review/`) into the project's `.agents/skills/` so everyone on the project gets them. Copies carry `metadata.version`, so you can compare them with this repository.

<details>
<summary><strong>Project rules for <code>/code-review</code></strong></summary>

The skill's generic checks are the same everywhere; what catches most regressions is the project's own rules. Add them to `.agents/code-review.md` in the project — facts, named audit targets, files to skip, lint commands, and rules with the failure each one prevents. The file format is documented at the end of [SKILL.md](../skills/code-review/SKILL.md). For a plugin or theme, keep `.agents/` and `.vibe/` out of release zips (`.distignore`, `.gitattributes` `export-ignore`).

</details>

<details>
<summary><strong>Fewer approval prompts</strong></summary>

**Quickest:** put the read-only commands on the allowlist, grant the folders the agent reads outside the project (next paragraph) and start with `vibe --agent wp-frontend-builder`. `--smart-approve` does nothing next to a custom agent (see **Smart approve** below). `--auto-approve` (alias `--yolo`) skips every prompt, so use it only on a throwaway site. Vibe 3.1.2 splits a chain on `|`, `;` and `&&` and checks each command against the allowlist, so `grep … | head -5` runs without a prompt when both commands are allowed. Shell variables (`$X`) and redirects (`>`) always prompt. When a prompt does come, choose "Allow for remainder of this session".

**Paths outside the project.** A command that names a path outside the working directory prompts for that path, even when the command is on the allowlist: another theme, `~/code/aludra`, the WordPress core files of a local site, a screenshot on the Desktop. The `grep` pattern in `grep -o '/Users/you/Desktop/shot.png'` counts too, because Vibe checks every argument that looks like a path. Grant whole folders in `~/.vibe/config.toml`, in both the shell and the `read_file` allowlist, with absolute paths:

```toml
[tools.bash]
allowlist = [
    "vibe-path:directory_recursive:/Users/you/code",
    "vibe-path:directory_recursive:/Users/you/.config/valet/Sites",
    "vibe-path:directory_recursive:/Users/you/Desktop",
    "vibe-path:directory_recursive:/private/tmp",
    "sed -n",
    # … the other commands
]

[tools.read_file]
allowlist = [
    "vibe-path:directory_recursive:/Users/you/code",
    "vibe-path:directory_recursive:/Users/you/.config/valet/Sites",
    "vibe-path:directory_recursive:/Users/you/Desktop",
    "vibe-path:directory_recursive:/private/tmp",
]
```

The `/private/tmp` grant is for screenshots: `wp-frontend-builder` and `html-page-review` write them to `/tmp`, and the agent reads every one back with `read_file`, so without the grant each visual check prompts. On macOS `/tmp` is a link to `/private/tmp` and Vibe follows links before it compares, so the grant has to name `/private/tmp`; it then covers `/tmp/…` paths too. An older `"/private/tmp/*"` entry covers the files in the folder but not the folder itself, so `cd /tmp` still prompts. On Linux, where `/tmp` is a real folder, grant `/tmp`.

A grant only clears the path check. The command still needs its own allowlist entry, and an allowed command may then do anything it can in that folder. So allow `sed -n`, not `sed`, or `sed -i` edits any file in a granted folder without asking. The same goes for `magick` (ImageMagick), which the agent uses to crop screenshots into sections for comparison: allowing it stops those prompts, but `magick` writes its output file without asking, so it can overwrite an image in any granted folder, a theme's `assets/` included. Leave it off the allowlist if you would rather approve each crop. For a single session, `vibe --add-dir DIR` makes the folder part of the working directory instead. `[tools.grep]` takes no allowlist: the agent searches through the shell.

Approvals come from the `[tools.bash] allowlist` in Vibe's config, not from a skill's `allowed-tools`. Put the commands the skill runs in the project's `.vibe/config.toml` so everyone on the project gets the same approvals. A project allowlist **replaces** the one in `~/.vibe/config.toml`, so include the read-only basics too — the **Setup** section of [code-review's SKILL.md](../skills/code-review/SKILL.md) has a starting list.

</details>

<details>
<summary><strong>Model: Mistral Large 4 with image support, and a cheap approval classifier</strong></summary>

**Model.** For theme work, use Mistral Large 4 (`mistral-large-4`). Mistral describes it as multimodal, with a vision encoder and a 1M-token context, so one model can build, fix and compare screenshots, and a long block-theme conversion fits in one session. Add `supports_images = true` to its entry. Vibe sends images only to models whose entry has it, whatever the model itself can do:

```toml
active_model = "large-4"

[[models]]
name = "mistral-large-4"
alias = "large-4"
provider = "mistral"
thinking = "high"
supports_images = true
```

Every `[[models]]` entry needs a `name`, a `provider` and an `alias`. An entry without them is not a usable preset.

**Check that images arrive.** After setting it up, ask the agent to open one of your photos and describe it, and compare that with the photo. A model that receives no image can still write a confident description.

**GLM 5.3 is text-only.** GLM 5.3 (`zai-glm-5-3`, served through the Mistral provider) gave the author fast coding runs on the [Kadewerk case study](workflow.md#case-study-an-html-design-to-a-block-theme), but it takes no images. On a demo, a GLM session reported checking 21 photos by eye and described most of them wrongly, and a later GLM run reported a section-by-section visual match for a block theme whose hero text was unreadable. If you use it, switch with `/model` to a model with `supports_images = true` for every step that needs eyes: checking photos, screenshot comparisons and the `ux-designer` review. Mistral lists GLM 5.3 Flash (`zai-glm-5-3-flash`) as multimodal; it has not been tried with this toolbox.

**Pinning a model to one agent.** A profile can set its own model with `active_model = "large-4"` as its first line, so only that agent runs on it. Keep such a variant out of this repository and generate it from the base profile, because a hand-edited fork stops receiving the toolbox's changes: the instructions, the skills list and the rules that came with each release. After every `git pull`, regenerate it, then `/reload`:

```bash
{ echo 'active_model = "large-4"'; sed 's/^display_name = "WP Frontend Builder"$/display_name = "WP Frontend Builder (Large 4)"/' ~/code/wp-vibe-toolbox/agents/wp-frontend-builder.toml; } > ~/.vibe/agents/wp-frontend-builder-large.toml
```

Setting `active_model` in `~/.vibe/config.toml` instead (above) needs no copy and never goes stale.

**Smart approve.** Start with `vibe --smart-approve` (or `vibe --agent smart-approve`, or press `Shift+Tab` in a session). Vibe still applies your allowlist and denylist first, then classifies each remaining tool call, runs the ones it judges safe and asks before risky ones. It is a classifier, not a sandbox: a call judged safe runs with your account's access, so use `ask` or an isolated environment for untrusted code. With no setting, Vibe picks a small Mistral model as the classifier if one is available, otherwise your session model, which adds cost and latency to every tool call when that is GLM or Large. Pin a small classifier instead ([docs](https://docs.mistral.ai/vibe/code/safety-approvals-permissions#smart-approve)):

```toml
[utility_models]
smart_approve = "classifier"

[[models]]
name = "mistral-small-latest"
provider = "mistral"
alias = "classifier"
```

`smart_approve` must be the `alias` of one of your `[[models]]` presets (or `active` for the session model). To make smart approve the default, set `default_agent = "smart-approve"`. That applies when you start `vibe` without `--agent`. Smart approve is an agent of its own: Vibe runs the classifier only while the active agent is `smart-approve`. `vibe --agent wp-frontend-builder --smart-approve` runs `wp-frontend-builder` with ordinary prompts (checked with Vibe 3.1.2), so the toolbox agents need the allowlist and path grants above.

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
