# AGENTS.md — mistral-toolbox

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
mistral-toolbox/
├── AGENTS.md          # This file
├── .vibe/config.toml  # Vibe project settings for this repo
├── agents/            # Vibe agent profiles: agents/<name>.toml (linked to ~/.vibe/agents)
├── prompts/           # Le Chat prompts + runs, one dir per prompt: prompts/<name>/ROLE.md + <run>/
├── skills/            # Vibe skills: skills/<name>/SKILL.md
├── docs/              # Plans and source notes: sourcing plan, source register, curation notes
├── README.md          # Public overview: badges, skills/agents/prompts tables
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
- Scope the skills the agent may load with `enabled_skills = [...]` (same patterns as
  `config.toml`); the agent loads skills on demand via the `skill` tool — the profile never
  auto-loads them, so the `instructions` must say which skill to load for which task.
- Wire the directory in with `ln -s ~/code/mistral-toolbox/agents ~/.vibe/agents`, which Vibe
  searches without config. `agent_paths` needs an absolute path: Vibe does not expand `~`
  there, unlike in `skill_paths`. Validate a new profile by parsing it as TOML and checking the keys above.

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

- Adding, renaming or removing a skill, agent profile or prompt changes the README: update its
  table row (skills are grouped by category, with a **Source** column), the count badges at the
  top (`skills-N`, `agents-N`, `Le Chat prompts-N`), the imported-skills count in the intro and
  the **Credits** list when a new upstream source is added.

## Commits and releases

- Semantic commit messages: `feat:`, `fix:`, `docs:`, `refactor:`, `chore:`.
- **Never** add "Generated by Mistral Vibe", a `Co-Authored-By` trailer or any other AI
  attribution to commits or PR descriptions.
- Work on a branch and merge into `main` through a PR. Open PRs with the `create-pull-request`
  skill: body via `--body-file`, never inline backticks in a double-quoted `--body`.
- Record every change in `CHANGELOG.md`, under `[Unreleased]` until a release.
- Releases: after merging, tag `main` as `vX.Y.Z` (no other prefix or suffix), then create a
  GitHub release summarizing the changes.
