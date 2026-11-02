# NOTICE

This repository is MIT licensed (see `LICENSE.md`). It curates and adapts skills, agents
and plugins from third-party open-source sources. The import policy is in
`docs/external-skills-sourcing-plan.md` (section 2); the verified source register with
licenses and pinned commits is `docs/sources.md`.

Rules:

- Only MIT, Apache-2.0, CC0-1.0, BSD-2/3-Clause, Unlicense or public-domain sources are
  imported. NonCommercial, ShareAlike, GPL, no-license and proprietary-derivative sources
  are reference-only and are never copied.
- MIT and Apache-2.0 require retaining the upstream copyright notice: when a source ships
  a per-skill LICENSE, it is copied into the imported artifact's directory; otherwise the
  upstream LICENSE is linked from the artifact's `metadata.source` and from `docs/sources.md`.
- Every imported artifact records its origin in `metadata.source` and gets a row in the
  import log in `docs/sources.md`.

## Third-party material currently included

- `skills/frontend-design/` — from `github.com/Ilm-Alan/frontend-design`,
  MIT (© upstream author, see the copied `LICENSE.txt`), pinned
  `f8966e6cc9b90247aa102d71f7e675ec3462b419`
- `skills/html-to-block-theme/` — from `github.com/siddik-web/wp-block-theme-converter`,
  MIT (© upstream author, see the copied `LICENSE`), pinned
  `0347e8237f0d68a05abf3715d7cd8e271d23598f`

Full register with all approved sources: `docs/sources.md`. Entries are added here as
imports land.
