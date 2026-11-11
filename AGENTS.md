# AGENTS.md — wp-vibe-toolbox

Instructions for coding agents (Mistral Vibe and others) working in this repository.

## What this repository is

Reusable AI instructions for WordPress development, maintained by Imagewize, in three kinds:

- **Le Chat prompts** — `prompts/<name>/ROLE.md` are system prompts pasted into a Mistral
  Le Chat agent. Le Chat has no shell or file access: these prompts work on what the user
  pastes in and must not depend on running commands.
- **Vibe skills** — `skills/<name>/SKILL.md` are Agent Skills for Mistral Vibe. They run inside
  a project with Vibe's tools (`bash`, `read_file`, `grep`).
- **Vibe agents** — `agents/*.toml` are Vibe agent profiles, selectable with `vibe --agent NAME`
  once `agents/` is linked to `~/.vibe/agents`. Each loads skills on demand via the `skill` tool.

`prompts/<name>/<run>/` holds example Le Chat runs: input, raw output and review feedback.

## Layout

```
wp-vibe-toolbox/
├── AGENTS.md          # This file
├── .vibe/config.toml  # Vibe project settings for this repo
├── agents/            # Vibe agent profiles: agents/<name>.toml (linked to ~/.vibe/agents)
├── prompts/           # Le Chat prompts + runs, one dir per prompt: prompts/<name>/ROLE.md + <run>/
├── skills/            # Vibe skills: skills/<name>/SKILL.md
├── docs/              # User docs (workflow, skills, agents, prompts, install, principles, credits, contributing), plans and source notes: sourcing plan, source register, curation notes
├── README.md          # Short public overview: badges, counts, quick start, principles
├── CHANGELOG.md
├── NOTICE.md          # Third-party material included in this repo
└── LICENSE.md         # MIT
```

## Working on Le Chat prompts

- One directory per prompt under `prompts/<name>/`, containing the system prompt as a single
  `ROLE.md` or `ROLE-SPECIALIZATION.md` file (e.g. `prompts/frontend-dev/FRONTEND-DEV.md`)
  plus its example runs in `prompts/<name>/<run>/` subdirectories. One prompt per file — the
  same convention as Vibe's own prompt dirs (`.vibe/prompts/`, bare filename = prompt id).
- Structure: role and scope, critical rules, output format, examples of expected output.
- The WordPress prompts target Imagewize's Elayne (FSE block theme), Nynaeve (Sage 11 hybrid
  theme) and imagewize.com. Project conventions live in the prompts themselves.
- When a prompt's behaviour changes, add or update an example run under `prompts/<name>/<run>/`.

## Working on Vibe agent profiles

- One profile per file: `agents/<name>.toml`; the file stem is the agent name for
  `vibe --agent <name>`. Vibe reads only `*.toml` from its agent directories, so a `README.md` in
  `agents/` is safe.
- Required keys: `display_name` and `description`; then `instructions` and optionally
  `agent_type` (`"agent"` by default, `"subagent"` for a model-spawned subagent).
- Every base profile also has a **generated** copy `agents/<name>-subagent.toml` with
  `agent_type = "subagent"`, so the model can spawn it via `agents.spawn` with
  `config_name = "<name>-subagent"` (plain `"agent"` profiles are rejected by spawn with
  `subagent_type_not_found`). Never edit a `-subagent.toml` by hand: change the base
  profile, then regenerate all copies with the loop in `agents/README.md` ("Spawnable
  subagent copies") and commit both. Subagent files are discovered at session start, so a
  running session needs `/reload` to see new ones.
- Scope the skills the agent may load with `enabled_skills = [...]` (same patterns as
  `config.toml`); the agent loads skills on demand via the `skill` tool — the profile never
  auto-loads them, so the `instructions` must say which skill to load for which task.
- Wire the directory in by syncing the files into Vibe's agents folder:
  `mkdir -p ~/.vibe/agents && rsync -a ~/code/wp-vibe-toolbox/agents/ ~/.vibe/agents/`
  (re-run after `git pull`; no `--delete` if you keep private profiles there). Vibe searches
  `~/.vibe/agents` without config. A symlink (`ln -s … ~/.vibe/agents`) is the alternative —
  it stays current automatically but dangles silently if the repo moves, and private
  profiles added there land in this public repo. `agent_paths` also works but lives in user
  config, needs an absolute path (Vibe does not expand `~` there, unlike in `skill_paths`),
  and a `~/…` entry is silently skipped. Either way, if profiles go missing,
  `vibe --agent NAME` fails with `Agent 'NAME' not found`. Validate a new profile by parsing
  it as TOML and checking the keys above.

## Working on Vibe skills

- A skill is a directory with `SKILL.md`: YAML frontmatter with `name` (lowercase letters, digits
  and hyphens, at most 64 characters) and `description` (at most 1024), optionally
  `user-invocable`, `allowed-tools`, `license`, `compatibility` and `metadata`.
- Quote a `description` that contains `: ` (`description: "Audit: …"`). Unquoted, it is invalid
  YAML and Vibe skips the skill with `Invalid YAML frontmatter: mapping values are not allowed
  here`. Check a new or changed skill by parsing its frontmatter with a YAML parser, not by eye.
- `allowed-tools` documents intent only. Approvals come from the `[tools.bash] allowlist` in a
  project's `.vibe/config.toml`, and a project allowlist replaces the user-level one.
- Keep skills generic. Project-specific rules belong in the project — for `code-review`, in the
  project's `.agents/code-review.md` — not in this repository.
- No client-identifiable data in a skill or agent profile: no real hostnames, SSH users, IP
  allowlists, credential hints or per-client skip lists. This repository is public. Use
  `example.com` / `user@example.com` placeholders; real values live in private per-site files
  (for `wp-update-round`, the site's `update-manifest.yml`).
- Write command examples from the tool's real interface: check them against its `--help` output
  and, for MCP tools, the server's tool schemas. wp-ops CLI commands are hyphenated
  (`wp-ops db-backup`); its MCP tools are underscored and take structured arguments
  (`wp_cli(site, env, args=[...])`, argv without `wp`, `env` one of
  `development`/`staging`/`production`). There is no `wp-ops wp_cli`.
- Shared-hosting examples: never put a database password on a command line (other users see it
  in `ps`), never write dumps to the remote server, stream them to the local machine. Shared
  hosts have no atomic rollback, so a production backup is its own step before deploying.
- Verify every WordPress claim against core or a real project before adding it. A rule that is
  wrong for one project floods reviews there with false positives.
- Commands a skill prescribes are plain single commands that fit an allowlist: no shell loops, no
  `$(…)`, no `python3` one-liners, and files are read with `read_file`.
- Projects carry copies of a skill. Bump `metadata.version` on every change so copies can be
  compared, and name the projects that need the new copy in the PR. `imagewize/aludra` carries
  `code-review`.

## Importing third-party skills

- Import only from MIT, Apache-2.0, CC0-1.0, BSD-2/3-Clause, Unlicense or public-domain sources.
  NonCommercial, ShareAlike, GPL, unlicensed and proprietary-derivative sources are reference-only.
  The policy is in `docs/external-skills-sourcing-plan.md`.
- Check the license of each artifact at the pinned commit, not only the repo-level license.
- Copy a per-skill upstream `LICENSE` into the skill directory when the source ships one, and
  set `license` and `metadata.source` (repo, path, pinned commit, license) in the frontmatter.
- Log every import in `docs/sources.md` and list it under "Third-party material" in `NOTICE.md`.

## Keeping the README in sync

- `README.md` is a short overview. Adding, renaming or removing a skill, agent profile or prompt
  changes: its table row in `docs/skills.md` (grouped by category, with a **Source** column),
  `docs/agents.md` or `docs/le-chat-prompts.md`; the count badges and the "What's inside" and
  "Skills by area" counts in `README.md`; the imported-skills count in `docs/principles.md`; and the
  upstream list in `docs/credits.md` when a new source is added. `agents/README.md` lists agent
  profiles too. Keep the README short: details belong in `docs/` (workflow, principles, credits).

## Commits and releases

- Semantic commit messages: `feat:`, `fix:`, `docs:`, `refactor:`, `chore:`.
- **Never** add "Generated by Mistral Vibe", a `Co-Authored-By` trailer or any other AI
  attribution to commits or PR descriptions.
- Work on a branch and merge into `main` through a PR. Open PRs with the `create-pull-request`
  skill: body via `--body-file`, never inline backticks in a double-quoted `--body`.
- Record every change in `CHANGELOG.md`, under `[Unreleased]` until a release.
- Releases: after merging, tag `main` as `vX.Y.Z` (no other prefix or suffix), then create a
  GitHub release summarizing the changes.
