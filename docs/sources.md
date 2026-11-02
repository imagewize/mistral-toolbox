# Sources — external material register

Register of external sources curated into this repo (skills, agents, plugins, connector
recommendations). Import policy: `docs/external-skills-sourcing-plan.md` section 2 — only
MIT, Apache-2.0, CC0-1.0, BSD-2/3-Clause, Unlicense or public domain may be imported.

- Every import gets a row in the **Import log** below, with the pinned commit hash.
- Licenses were verified on **2026-11-02** by fetching each repo's LICENSE file
  (raw.githubusercontent.com) and/or the GitHub API `license` field; pinned commits via
  `git ls-remote`. Re-check both on every sync — upstream licenses and content change.
- Repo-level license is only a gate: index repos mix licenses per artifact, so each
  artifact gets its own license check before import (quality gate 0 in the plan).

## Source register

### Ready to import (permissive license verified 2026-11-02)

| Source | License | Verified by | Pinned commit | Area |
|---|---|---|---|---|
| `respira-press/agent-skills-wordpress` | MIT | README clause + GitHub API | `58f72c14c60fff79b7d1ff497e2da235d6f0624f` (main) | WordPress audit/optimize/fix/migrate skills |
| `mralaminahamed/wp-dev-skills` | MIT | GitHub API | `762b7bc76443c7103623d11322a250910dfd8326` (trunk) | WP plugin dev skills |
| `siddik-web/wp-block-theme-converter` | MIT | LICENSE fetched | `0347e8237f0d68a05abf3715d7cd8e271d23598f` (main) | HTML/CSS/JS → FSE block theme |
| `Ilm-Alan/frontend-design` | MIT | LICENSE fetched | `f8966e6cc9b90247aa102d71f7e675ec3462b419` (main) | design anchors → HTML/CSS |
| `MengTo/Skills` | MIT | LICENSE fetched | `ef5f85130d083d33e08cb19f6ee23cdde2d406ab` (main) | web design, Tailwind v4, design systems |
| `Koomook/claude-frontend-skills` | MIT | LICENSE fetched | `a6260107629d8ac0d613b7903656017c1df99c0a` (main) | distinctive frontend designs |
| `xiaopu-ai/web-design` | MIT | LICENSE fetched | `22a4f482cc4caa2394391c0c31ff0aefd1908774` (main) | spec-first web design |
| `rekryt/skill-tailwind` | MIT | LICENSE fetched | `a9d933c0439221ba250dafc133f8fafd57766832` (master) | Tailwind CSS v4 |
| `obra/superpowers` | MIT | LICENSE fetched | `2ce8aa15d05bd57213e6f746f953aafb7ded7a8b` (main) | code review, debugging, TDD, plans |
| `addyosmani/agent-skills` | MIT | LICENSE + GitHub API | `301b02b12bff98e4688e6984af6556802322bbde` (main) | 24 engineering skills incl. code-review-and-quality |
| `wshobson/agents` | MIT | LICENSE fetched | `7e2fb559cf4b824b27f1fec49fe88f7511066d26` (main) | multi-harness plugin marketplace |
| `github/awesome-copilot` | MIT | LICENSE fetched | `858bca0310db344b05bea54d77486e9b680f804c` (main) | Copilot agents/instructions/skills |
| `VoltAgent/awesome-agent-skills` | MIT | LICENSE fetched | `464dd87e30278a6f4ad0da21f0bd2ee1c2122f5d` (main) | index of 1000+ skills; per-skill licenses vary |
| `alirezarezvani/claude-skills` | MIT | corroborated (LICENSE blob + third-party) | `e4a1dc3695908dd5a6c811cc76ab7aa4cf95f2f0` (main) | 380 skills / 96 plugins / 20 domains |
| `NotHarshhaa/devops-skills` | MIT | LICENSE fetched | `3605f9452e331d984a2a119e5a00763ecdff23e5` (master) | incident response, K8s, Terraform, CI/CD, observability |
| `BagelHole/DevOps-Security-Agent-Skills` | MIT | GitHub API | `0365f57a079b1332f95cf26e31dd2d5332a8399f` (main) | 80+ devops/security/compliance skills |
| `fclairamb/awesome-agentic-devops` | CC0-1.0 | LICENSE fetched | `569ae8ffbd768b69274ddda789b3edbb91b07d13` (main) | index of AI SRE / incident / CI-CD agents |
| `mthalman/agent-personas` | MIT | LICENSE fetched | `902e306213351ebfdc1de08d11b990e7eadb1473` (main) | personas → Le Chat agents |
| `dontriskit/awesome-ai-system-prompts` | MIT | LICENSE fetched | `74964625038011525ab44c3a673fc605b2c765b3` (main) | system-prompt collections |
| `jakubkrehel/skills` | MIT | LICENSE fetched | `60bf140e43c98b248e6594487384ec967e89d98a` (main) | interface-building skills |
| `content-designer/ux-writing-skill` | MIT | LICENSE fetched | `98cacde4ba2dd10ed28df43a8d53eef1e321c539` (main) | UX writing / content design |
| `nextlevelbuilder/ui-ux-pro-max-skill` | MIT | LICENSE fetched | `3a13158ff1f32156cbe144108de48eda2ecaed9a` (main) | UI/UX design intelligence |
| `plugin87/ux-ui-agent-skills` | MIT | LICENSE fetched | `def84a70fadc3490d80901295a4f1951fdb2cc69` (main) | DTCG tokens, WCAG 2.2, hard quality gates |
| `sergekostenchuk/ui-ux-agent-skill-system` | Apache-2.0 | LICENSE fetched | `ddaedd712a37d7523f0ce99f556abe68ded7a315` (main) | vendor-neutral UI/UX skill system |
| `mustafakendiguzel/claude-code-ui-agents` | MIT | GitHub API | pin at import (main) | UI/UX agent prompts |

### Reference-only (never import)

| Source | License | Why |
|---|---|---|
| `anubhav-vibe` (anubhavg-icpl/vibe) | CC BY-NC-SA 4.0 | NonCommercial + ShareAlike conflict with this repo's MIT; ideas only |
| `WordPress/agent-skills` (official WP org) | none detected (GitHub: NOASSERTION; pinned `eff3785fc28c4380d172094518c66a6a997c95d4`, trunk) | No LICENSE file at trunk — all rights reserved as far as GitHub is concerned. Action: ask the WP org to add a CC0/MIT LICENSE, then re-evaluate |
| `Automattic/wp-skill`, `Automattic/agent-skills`, `Automattic/wordpress-agent-skills` | none detected | reference-only until a permissive license appears |
| `dknauss/agent-skills` | none detected (NOASSERTION) | reference-only |
| `wpacademy/wordpress-dev-skills` | GPL-2.0 | not in the allowed license list; reference-only |
| `jorgerosal/wordpress-skills` | claims MIT but ships no LICENSE file | per-skill audit required before anything is used; ~78 of 120 skills vendored from 12 other projects |
| `anthropics/skills` | mixed: example skills Apache-2.0, document skills source-available (pinned `ca45fc496a3436251f191354091d557da31c15b5`, main) | per-skill license only, never repo-level |
| `jiji262/claude-design-skill` | — | adapted from Anthropic's internal design prompt; derivative of proprietary material — never import |
| `modelcontextprotocol/servers` | no repo-level license detected | reference listing only |

## Recommended project-level tools and connectors (not vendored into this repo)

| Tool | License | Pinned commit | Use |
|---|---|---|---|
| `humanmade/block-runner` | GPL-2.0 | `a50f986093b026c8579f77c584b7e0a61ae99084` (main) | Run in client projects to convert HTML → WordPress blocks. GPL is fine for running; its code/docs are never copied into this MIT repo |
| `GLips/Figma-Context-MCP` | MIT | `c083d65c7e002923e7cb98f4e3bdafb105e90f6d` (main) | Figma → agent MCP connector; add to the consuming project's Vibe MCP config |
| `shadcn-ui/ui` | MIT | `c0d63c339d6cd2fc26135590a54cf1f362269451` (main) | Accessible component code reference for imagewize.com-style frontends |

## Import log

One row per imported artifact; the artifact's `metadata.source` must match the row.

| Date | Artifact (destination) | Source repo + path | License | Pinned commit | metadata.version |
|---|---|---|---|---|---|
| 2026-11-02 | `skills/frontend-design/` (SKILL.md + LICENSE.txt) | `github.com/Ilm-Alan/frontend-design` (SKILL.md, LICENSE.txt) | MIT | `f8966e6cc9b90247aa102d71f7e675ec3462b419` | 1.0.0 |
| 2026-11-02 | `skills/html-to-block-theme/` (SKILL.md + references/ + LICENSE) | `github.com/siddik-web/wp-block-theme-converter` (SKILL.md, references/, LICENSE) | MIT | `0347e8237f0d68a05abf3715d7cd8e271d23598f` | 1.0.0 |
| 2026-11-02 | `skills/wordpress-plugin-audit/` (SKILL.md + references/ + LICENSE) | `github.com/mralaminahamed/wp-dev-skills` skills/wp-plugin-audit | MIT | `762b7bc76443c7103623d11322a250910dfd8326` | 1.0.0 |
| 2026-11-02 | `skills/requesting-code-review/` (SKILL.md + code-reviewer.md + LICENSE) | `github.com/obra/superpowers` skills/requesting-code-review | MIT | `2ce8aa15d05bd57213e6f746f953aafb7ded7a8b` | 1.0.0 |
| 2026-11-02 | `skills/verification-before-completion/` (SKILL.md + LICENSE) | `github.com/obra/superpowers` skills/verification-before-completion | MIT | `2ce8aa15d05bd57213e6f746f953aafb7ded7a8b` | 1.0.0 |
| 2026-11-02 | `skills/wordpress-coding-standards/` (SKILL.md + references/ + LICENSE) | `github.com/mralaminahamed/wp-dev-skills` skills/wp-coding-standards | MIT | `762b7bc76443c7103623d11322a250910dfd8326` | 1.0.0 |
| 2026-11-02 | `skills/wordpress-woocommerce/` (SKILL.md + references/ + LICENSE) | `github.com/mralaminahamed/wp-dev-skills` skills/wp-woocommerce | MIT | `762b7bc76443c7103623d11322a250910dfd8326` | 1.0.0 |
| 2026-11-02 | `skills/wordpress-plugin-testing/` (SKILL.md + references/ + LICENSE) | `github.com/mralaminahamed/wp-dev-skills` skills/wp-plugin-testing | MIT | `762b7bc76443c7103623d11322a250910dfd8326` | 1.0.0 |
| 2026-11-02 | `skills/wordpress-i18n-workflow/` (SKILL.md + references/ + LICENSE) | `github.com/mralaminahamed/wp-dev-skills` skills/wp-i18n-workflow | MIT | `762b7bc76443c7103623d11322a250910dfd8326` | 1.0.0 |
| 2026-11-02 | `skills/wordpress-database/` (SKILL.md + references/ + LICENSE) | `github.com/mralaminahamed/wp-dev-skills` skills/wp-database | MIT | `762b7bc76443c7103623d11322a250910dfd8326` | 1.0.0 |
| 2026-11-02 | `skills/landing-page/` (SKILL.md + REFERENCES.md + LICENSE) | `github.com/MengTo/Skills` agent-skills/web-design/landing-page | MIT | `ef5f85130d083d33e08cb19f6ee23cdde2d406ab` | 1.0.0 |
| 2026-11-02 | `skills/no-ai-design-slop/` (SKILL.md + ARTICLE.md + REFERENCES.md + LICENSE) | `github.com/MengTo/Skills` agent-skills/ui/no-ai-design-slop | MIT | `ef5f85130d083d33e08cb19f6ee23cdde2d406ab` | 1.0.0 |
| 2026-11-02 | `skills/design-first-ui-prompting/` (SKILL.md + REFERENCES.md + LICENSE) | `github.com/MengTo/Skills` agent-skills/ui/design-first-ui-prompting | MIT | `ef5f85130d083d33e08cb19f6ee23cdde2d406ab` | 1.0.0 |
| 2026-11-02 | `skills/ui-ux-pro-max/` (SKILL.md + references/ + data/ catalogs + LICENSE) | `github.com/nextlevelbuilder/ui-ux-pro-max-skill` .claude/skills/ui-ux-pro-max | MIT | `3a13158ff1f32156cbe144108de48eda2ecaed9a` | 1.0.0 |
| 2026-11-02 | `skills/ux-writing/` (SKILL.md + LICENSE) | `github.com/content-designer/ux-writing-skill` SKILL.md | MIT | `98cacde4ba2dd10ed28df43a8d53eef1e321c539` | 1.0.0 |
| 2026-11-02 | `skills/brainstorming/` (SKILL.md + 2 refs + LICENSE) | `github.com/obra/superpowers` skills/brainstorming | MIT | `2ce8aa15d05bd57213e6f746f953aafb7ded7a8b` | 1.0.0 |
| 2026-11-02 | `skills/writing-plans/` (SKILL.md + LICENSE) | `github.com/obra/superpowers` skills/writing-plans | MIT | `2ce8aa15d05bd57213e6f746f953aafb7ded7a8b` | 1.0.0 |
| 2026-11-02 | `skills/systematic-debugging/` (SKILL.md + 3 refs + LICENSE) | `github.com/obra/superpowers` skills/systematic-debugging | MIT | `2ce8aa15d05bd57213e6f746f953aafb7ded7a8b` | 1.0.0 |
| 2026-11-02 | `skills/test-driven-development/` (SKILL.md + ref + LICENSE) | `github.com/obra/superpowers` skills/test-driven-development | MIT | `2ce8aa15d05bd57213e6f746f953aafb7ded7a8b` | 1.0.0 |
| 2026-11-02 | `skills/receiving-code-review/` (SKILL.md + LICENSE) | `github.com/obra/superpowers` skills/receiving-code-review | MIT | `2ce8aa15d05bd57213e6f746f953aafb7ded7a8b` | 1.0.0 |
