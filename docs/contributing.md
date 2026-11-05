# Contributing

Contributions are welcome — for any domain, not just WordPress.

1. Fork the repository and create a branch
2. Add your prompt, skill or agent profile following [AGENTS.md](../AGENTS.md)
3. Update the docs tables ([skills](skills.md), [agents](agents.md), [prompts](le-chat-prompts.md)) and the README count badges and `CHANGELOG.md` under `[Unreleased]`
4. Open a pull request with a semantic title (`feat:`, `fix:`, `docs:` …)

<details>
<summary><strong>Adding a Vibe skill</strong></summary>

1. Create `skills/<name>/SKILL.md` — `name` is lowercase letters, digits and hyphens.
2. Frontmatter: `name` and `description` are required; add `user-invocable: true` for a slash command and `metadata.version` so copies in projects can be compared.
3. Keep it generic — project-specific rules belong in the project, not in the skill.
4. Prescribe allowlist-friendly commands: plain single commands, no shell loops or one-liners; read files with `read_file`.
5. Importing from elsewhere? Only MIT, Apache-2.0, CC0, BSD or public-domain sources — copy the upstream `LICENSE`, record `metadata.source` with the pinned commit, and log it in [`NOTICE.md`](../NOTICE.md) and [`docs/sources.md`](sources.md).

</details>

<details>
<summary><strong>Adding a Vibe agent profile</strong></summary>

1. Create `agents/<name>.toml` — the file stem is the name used with `vibe --agent <name>`.
2. Required keys: `display_name` and `description`; then `instructions` (the role plus which skill to load for which task) and optionally `agent_type` (`"agent"` by default, `"subagent"` for a model-spawned subagent).
3. Scope the skills with `enabled_skills = ["code-review", ...]` so the agent only loads what it needs.

</details>

<details>
<summary><strong>Adding a Le Chat prompt</strong></summary>

1. Create `prompts/<name>/` with one system prompt file named by role — `ROLE.md` or `ROLE-SPECIALIZATION.md` (e.g. `prompts/backend-dev/BACKEND-DEV.md`).
2. Structure it as: role and scope, critical rules (do's and don'ts), output format, examples of expected output. Keep it project-agnostic where possible.
3. Add at least one example run in `prompts/<name>/<run>/`.
