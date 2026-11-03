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
- `skills/wordpress-plugin-audit/` — from `github.com/mralaminahamed/wp-dev-skills`,
  MIT (© upstream author, see the copied `LICENSE`), pinned
  `762b7bc76443c7103623d11322a250910dfd8326`
- `skills/wordpress-coding-standards/` — from `github.com/mralaminahamed/wp-dev-skills`,
  MIT (© upstream author, see the copied `LICENSE`), pinned
  `762b7bc76443c7103623d11322a250910dfd8326`
- `skills/wordpress-woocommerce/`, `skills/wordpress-plugin-testing/`,
  `skills/wordpress-i18n-workflow/`, `skills/wordpress-database/` — from
  `github.com/mralaminahamed/wp-dev-skills`, MIT (© upstream author, see the copied
  `LICENSE` in each), pinned `762b7bc76443c7103623d11322a250910dfd8326`
- `skills/requesting-code-review/`, `skills/verification-before-completion/`,
  `skills/brainstorming/`, `skills/writing-plans/`, `skills/systematic-debugging/`,
  `skills/test-driven-development/` and `skills/receiving-code-review/` — from
  `github.com/obra/superpowers`, MIT (© 2025 Jesse Vincent, see the copied `LICENSE` in
  each), pinned `2ce8aa15d05bd57213e6f746o953aafb7ded7a8b`
- `skills/code-review-and-quality/`, `skills/security-and-hardening/`,
  `skills/performance-optimization/`, `skills/frontend-ui-engineering/` and
  `skills/observability-and-instrumentation/` — from `github.com/addyosmani/agent-skills`,
  MIT (© 2025 Addy Osmani, see the copied `LICENSE` in each), pinned
  `301b02b12bff98e4688e6984af6556802322bbde`
- `skills/better-ui/`, `skills/better-accessibility/`, `skills/better-colors/` and
  `skills/interface-review/` — from `github.com/jakubkrehel/skills`, MIT (© 2026 Jakub
  Krehel, see the copied `LICENSE` in each), pinned
  `60bf140e43c98b248e6594487384ec967e89d98a`
- `skills/incident/`, `skills/runbook/`, `skills/observability-review/`,
  `skills/security-review/`, `skills/pipeline-review/` and `skills/release-readiness/` —
  from `github.com/NotHarshhaa/devops-skills`, MIT (© 2026 devops-skills contributors, see
  the copied `LICENSE` in each), pinned `3605f9452e331d984a2a119e5a00763ecdff23e5`
- `skills/git-workflow/`, `skills/alerting-oncall/` and `skills/kubernetes-ops/` — from
  `github.com/BagelHole/DevOps-Security-Agent-Skills`, MIT (© 2026 Toby Miller, see the
  copied `LICENSE` in each), pinned `0365f57a079b1332f95cf26e31dd5d2332a8399f`
- `skills/landing-page/`, `skills/no-ai-design-slop/`,
  `skills/design-first-ui-prompting/` and `skills/illustration-isometric-mono/` — from `github.com/MengTo/Skills`, MIT (© 2026
  Meng To, see the copied `LICENSE` in each), pinned
  `ef5f85130d083d33e08cb19f6ee23cdde2d406ab`
- `skills/ui-ux-pro-max/` — from `github.com/nextlevelbuilder/ui-ux-pro-max-skill`,
  MIT (© 2024 Next Level Builder, see the copied `LICENSE`), pinned
  `3a13158ff1f32156cbe144108de48eda2ecaed9a`
- `skills/ux-writing/` — from `github.com/content-designer/ux-writing-skill`, MIT
  (© 2026 Christopher Greer, see the copied `LICENSE`), pinned
  `98cacde4ba2dd10ed28df43a8d53eef1e321c539`
- `skills/design-system-library/` — from `github.com/plugin87/ux-ui-agent-skills`, MIT
  (© 2026 Thientan Soparat, see the copied `LICENSE`), pinned
  `def84a70fadc3490d80901295a4f1951fdb2cc69`. Only the 76 Music & Audio, Retro &
  Nostalgic, Retail & E-commerce and E-commerce & Retail specs are vendored; the rest
  of the 2,144-system library stays upstream at the pinned commit
- `skills/design-md/` — from `github.com/google-labs-code/design.md`, Apache-2.0
  (© 2026 Google LLC, see the copied `LICENSE`), pinned
  `6e5da5382f41edbba9d73b2c62f33f32e9971f15`. The SKILL.md is authored for this
  repository around the upstream `docs/spec.md` and `examples/`

Full register with all approved sources: `docs/sources.md`. Entries are added here as
imports land.
