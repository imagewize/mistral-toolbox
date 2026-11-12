# Design principles

What makes these different from a pile of prompts:

- **Vibe-native, not ported.** Skills follow the Agent Skills format with `metadata.version`, so copies in projects can be compared. Agents are plain TOML with scoped `enabled_skills`. Commands are written from each tool's real interface (checked against `--help` and MCP schemas).
- **Allowlist-friendly.** Skills prescribe plain single commands: no shell loops, no `$(…)`, no one-liner interpreters. A project can approve them once in `[tools.bash] allowlist` and stop seeing prompts ([install.md](install.md)).
- **Evidence before claims.** Review output carries `file:line` references and a failure scenario per finding; completion requires running the proving command fresh. False positives are treated as a defect.
- **Project rules live in the project.** Skills stay generic across WordPress projects. Per-repo rules go in `.agents/` files such as `.agents/code-review.md`, so one skill serves many codebases.
- **Honest provenance.** 50 of the 62 skills are adapted from permissively licensed open-source collections. Each keeps its upstream `LICENSE`, records the pinned commit in `metadata.source`, and is logged in [`NOTICE.md`](../NOTICE.md) and [sources.md](sources.md). The upstream collections are listed in [credits.md](credits.md).
- **Public-safe.** No client hostnames, credentials or per-client lists; real values live in private per-site files.
- **Le Chat prompts are tested.** Each prompt ships with recorded runs (input, raw output, review feedback), including failures, so you can see how it behaves before pasting it ([le-chat-prompts.md](le-chat-prompts.md)).
