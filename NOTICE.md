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
- `skills/requesting-code-review/` and `skills/verification-before-completion/` — from
  `github.com/obra/superpowers`, MIT (© 2025 Jesse Vincent, see the copied `LICENSE`),
  pinned `2ce8aa15d05bd57213e6f746f953aafb7ded7a8b`
- `skills/landing-page/`, `skills/no-ai-design-slop/` and
  `skills/design-first-ui-prompting/` — from `github.com/MengTo/Skills`, MIT (© 2026
  Meng To, see the copied `LICENSE` in each), pinned
  `ef5f85130d083d33e08cb19f6ee23cdde2d406ab`

Full register with all approved sources: `docs/sources.md`. Entries are added here as
imports land.
