# Vibe skills

Skills run inside your project with Vibe's tools and are invoked as slash commands. **Source** shows where a skill came from — imported skills keep their upstream `LICENSE` and record the pinned commit in `metadata.source`.

## WordPress development

| Skill | What it does | Source |
|-------|--------------|--------|
| [`/code-review`](../skills/code-review/SKILL.md) | Reviews a branch diff, a GitHub PR, or a block, pattern, template or path in place, in any WordPress plugin, theme or site. Detects project type, minimum PHP/WordPress and lint commands, and applies the project's own rules from `.agents/code-review.md`. | Imagewize |
| [`/html-to-block-theme`](../skills/html-to-block-theme/SKILL.md) | Converts an HTML/CSS/JS design into a production-ready FSE block theme: theme.json v3 from design tokens, templates, parts, patterns, Interactivity API, optional WooCommerce. | siddik-web |
| [`/wordpress-plugin-audit`](../skills/wordpress-plugin-audit/SKILL.md) | Read-only plugin audit across metadata, naming/i18n, docs vs code and conventions/security, with file:line-verified findings. | mralaminahamed |
| [`/wordpress-coding-standards`](../skills/wordpress-coding-standards/SKILL.md) | Sets up and enforces PHPCS + WPCS: `phpcs.xml.dist`, `phpcs`/`phpcbf`, CI and pre-commit, common sniff fixes. | mralaminahamed |
| [`/wordpress-plugin-testing`](../skills/wordpress-plugin-testing/SKILL.md) | WP_UnitTestCase, Brain Monkey/WP_Mock, factories, AJAX/multisite, wp-browser acceptance tests, CI matrices. | mralaminahamed |
| [`/wordpress-i18n-workflow`](../skills/wordpress-i18n-workflow/SKILL.md) | Text domain, i18n functions, `wp i18n make-pot`/`make-mo`/`make-json`, JS translations, GlotPress. | mralaminahamed |
| [`/wordpress-database`](../skills/wordpress-database/SKILL.md) | Custom tables: `dbDelta` rules, versioned upgrades, prepared `$wpdb` CRUD, migrations, uninstall cleanup. | mralaminahamed |
| [`/wordpress-woocommerce`](../skills/wordpress-woocommerce/SKILL.md) | WooCommerce extensions: gateways, shipping, WC CRUD, HPOS, REST/Store API, cart/checkout blocks. | mralaminahamed |
| [`/wp-update-round`](../skills/wp-update-round/SKILL.md) | WordPress update rounds: before/after screenshots, pixel diff, human approval, production deployment for plugins/themes/core. Uses wp-ops commands. | Imagewize |

## Design & frontend

| Skill | What it does | Source |
|-------|--------------|--------|
| [`/frontend-design`](../skills/frontend-design/SKILL.md) | One of eight aesthetic anchors locked to exact CSS tokens, real content instead of filler; output uses `var(--wp--preset--*)` so it converts to block patterns. | Ilm-Alan |
| [`/landing-page`](../skills/landing-page/SKILL.md) | High-converting landing pages — structure, layouts, conversion strategy, copy templates, SEO/AEO — with a block-pattern handoff. | MengTo |
| [`/design-first-ui-prompting`](../skills/design-first-ui-prompting/SKILL.md) | Turns fuzzy ideas into a design-first spec: prompt skeleton, constraints, single-variable variants, reference pack. | MengTo |
| [`/no-ai-design-slop`](../skills/no-ai-design-slop/SKILL.md) | Quality gate against generic AI-design defaults: removal test and full slop catalog. | MengTo |
| [`/architectural-drawing`](../skills/architectural-drawing/SKILL.md) | Architectural elevations and sections as SVG, built in metres with a bundled kit (`arch.mjs`): one scale, a fixed line-weight hierarchy, people and trees for scale, with proportion, overlap and file checks. | Imagewize |
| [`/illustration-isometric-mono`](../skills/illustration-isometric-mono/SKILL.md) | True-isometric SVG dioramas built with a bundled scene kit (`iso.mjs`) instead of hand-written coordinates, with lint and colour checks and a render-and-critique loop. | MengTo |
| [`/ui-ux-pro-max`](../skills/ui-ux-pro-max/SKILL.md) | Design intelligence with local catalogs (styles, palettes, font pairings, 119 UX guidelines, icons, motion, charts, 22 stacks). | nextlevelbuilder |
| [`/design-system-library`](../skills/design-system-library/SKILL.md) | Named design systems by vertical from a 2,144-entry catalog; 76 specs vendored (Music & Audio, Retro & Nostalgic, Retail) — each a `DESIGN.md` with tokens + rationale, adapted to the client rather than copied. | plugin87 |
| [`/design-md`](../skills/design-md/SKILL.md) | Author a `DESIGN.md` visual-identity spec from reference sites in a vertical and validate it with `npx @google/design.md lint`. | google-labs-code |
| [`/ux-writing`](../skills/ux-writing/SKILL.md) | Microcopy — buttons, labels, errors, empty states, onboarding — with voice/tone and accessibility guidance. | content-designer |
| [`/frontend-ui-engineering`](../skills/frontend-ui-engineering/SKILL.md) | Production-quality accessible, responsive UIs: semantic markup, keyboard/focus states. | addyosmani |
| [`/better-ui`](../skills/better-ui/SKILL.md) | Polish surfaces, icons and motion with exact values. | jakubkrehel |
| [`/better-colors`](../skills/better-colors/SKILL.md) | Color formats, contrast, palette generation and token naming. | jakubkrehel |
| [`/better-accessibility`](../skills/better-accessibility/SKILL.md) | Keyboard/focus, ARIA, accessible names, forms, hit areas, motion/zoom, screen readers. | jakubkrehel |
| [`/interface-review`](../skills/interface-review/SKILL.md) | Reviews a branch/PR for the interface problems it introduces, scoped to what changed. | jakubkrehel |
| [`/html-page-review`](../skills/html-page-review/SKILL.md) | Reviews a rendered HTML/CSS page: headless-Chrome layout probe at three widths, then brief fit, consistency and copy; writes numbered fix notes to `REVIEW.md`. | Imagewize |

## Development workflow & quality

| Skill | What it does | Source |
|-------|--------------|--------|
| [`/brainstorming`](../skills/brainstorming/SKILL.md) | Turns a rough idea into a formed design through structured questioning. | obra |
| [`/writing-plans`](../skills/writing-plans/SKILL.md) | Spec → step-by-step implementation plan with exact paths and verification steps. | obra |
| [`/test-driven-development`](../skills/test-driven-development/SKILL.md) | Red-green-refactor: failing test first, minimum implementation, refactor. | obra |
| [`/systematic-debugging`](../skills/systematic-debugging/SKILL.md) | Four-phase root-cause debugging — no fix before the cause is found. | obra |
| [`/verification-before-completion`](../skills/verification-before-completion/SKILL.md) | Evidence before claims: run the proving command fresh, read the output, then claim. | obra |
| [`/requesting-code-review`](../skills/requesting-code-review/SKILL.md) | Dispatches a read-only reviewer subagent before merging. | obra |
| [`/receiving-code-review`](../skills/receiving-code-review/SKILL.md) | Verifies each review suggestion against the code; accept, adapt or push back with evidence. | obra |
| [`/code-review-and-quality`](../skills/code-review-and-quality/SKILL.md) | Multi-axis review — correctness, readability, maintainability, performance, security, tests. | addyosmani |
| [`/security-and-hardening`](../skills/security-and-hardening/SKILL.md) | Hardening against vulnerabilities with attack-scenario verification. | addyosmani |
| [`/performance-optimization`](../skills/performance-optimization/SKILL.md) | Profile-first performance work; re-measure after every fix. | addyosmani |
| [`/real-browser-control`](../skills/real-browser-control/SKILL.md) | Drive the user's real logged-in Chrome via Real Browser MCP (extension + local MCP over localhost WebSocket, no CDP port): verify in the browser that is already past SSO, read open tabs, use existing sessions. Read-only first on authenticated dashboards. | ofershap |

## DevOps & release

| Skill | What it does | Source |
|-------|--------------|--------|
| [`/incident`](../skills/incident/SKILL.md) | Read-only, evidence-logged incident investigation and blameless postmortem. | NotHarshhaa |
| [`/runbook`](../skills/runbook/SKILL.md) | Operational runbooks: symptom → diagnostic → mitigation → escalation. | NotHarshhaa |
| [`/alerting-oncall`](../skills/alerting-oncall/SKILL.md) | Alerting rules, on-call rotations and escalation. | BagelHole |
| [`/observability-review`](../skills/observability-review/SKILL.md) | Reviews metrics, logs, traces, dashboards, alerting and SLO coverage. | NotHarshhaa |
| [`/observability-and-instrumentation`](../skills/observability-and-instrumentation/SKILL.md) | Structured logging, metrics, tracing and alerting so production is diagnosable. | addyosmani |
| [`/security-review`](../skills/security-review/SKILL.md) | Infra/app security posture review: IAM, secrets, network, dependencies. | NotHarshhaa |
| [`/pipeline-review`](../skills/pipeline-review/SKILL.md) | CI/CD review: security, caching, flakiness, speed. | NotHarshhaa |
| [`/kubernetes-ops`](../skills/kubernetes-ops/SKILL.md) | Deploy, scale, manage and troubleshoot Kubernetes workloads. | BagelHole |
| [`/release-readiness`](../skills/release-readiness/SKILL.md) | Release gate: changelog, versioning, rollback, migrations, monitoring. | NotHarshhaa |
| [`/git-workflow`](../skills/git-workflow/SKILL.md) | Branching strategies, PR workflows and release management. | BagelHole |
| [`/create-pull-request`](../skills/create-pull-request/SKILL.md) | Opens/edits PRs with `gh` safely — body via `--body-file`, single-quoted titles, verified with `gh pr view`. | Imagewize |

## SEO & content marketing

| Skill | What it does | Source |
|-------|--------------|--------|
| [`/seo-audit`](../skills/seo-audit/SKILL.md) | On-page/technical SEO audit: keywords, title, meta, headings, internal links, images, crawlability — run before publishing. | Imagewize |
| [`/ai-seo`](../skills/ai-seo/SKILL.md) | AEO/GEO/LLMO — optimize content for AI search engines (ChatGPT, Perplexity, Claude, Gemini) and zero-click answers. | coreyhaines31 |
| [`/serp-check`](../skills/serp-check/SKILL.md) | Pre-draft SERP analysis: who ranks on page 1, search intent, winnable angle, content brief. | Imagewize |
| [`/keyword-gap-analysis`](../skills/keyword-gap-analysis/SKILL.md) | Competitor keyword gaps scored by volume/difficulty/relevance, tied to your services. | Imagewize |
| [`/schema`](../skills/schema/SKILL.md) | JSON-LD structured data for WordPress — FAQPage, Article, Service, Organization, BreadcrumbList — with validation rules. | coreyhaines31 |
| [`/first-hand-proof`](../skills/first-hand-proof/SKILL.md) | Inject original tests, data, decisions and stories into content so competitors can't copy it. | Imagewize |
| [`/copywriting`](../skills/copywriting/SKILL.md) | PAS+AIDA marketing copy for any page — headlines, heroes, CTAs, value propositions. | coreyhaines31 |
| [`/competitors`](../skills/competitors/SKILL.md) | Competitor comparison pages: "X alternative", "X vs Y", battle cards — four formats. | coreyhaines31 |
| [`/cro`](../skills/cro/SKILL.md) | Conversion rate audit: above-the-fold, CTAs, forms, trust signals, performance — prioritized fix list. | coreyhaines31 |
| [`/publish-hygiene`](../skills/publish-hygiene/SKILL.md) | Pre-publish hygiene: strip invisible Unicode from drafts, check images for C2PA/AI/EXIF metadata. | guillaumemeyer |
| [`/cold-email`](../skills/cold-email/SKILL.md) | B2B cold email sequences — subject lines, hooks, multi-touch follow-ups, personalization. | coreyhaines31 |
| [`/linkedin-comment-queue`](../skills/linkedin-comment-queue/SKILL.md) | Manual LinkedIn soft-funnel: find posts to comment on, draft comments, decide follow/connect. | Imagewize |
| [`/product-marketing`](../skills/product-marketing/SKILL.md) | Product marketing context document (`.agents/product-marketing.md`) that other marketing skills reference. | coreyhaines31 |

## Content workflow

The SEO and content skills form a pipeline for blog posts, landing pages and outreach:

```
product-marketing → keyword-gap-analysis / serp-check → first-hand-proof → draft
  → seo-audit + schema + ai-seo → publish-hygiene → publish
  → cro (on the landing page) / cold-email + linkedin-comment-queue (outreach)
```

Three agents split the pipeline: [`seo-content-writer`](../agents/seo-content-writer.toml) (research and drafting), [`seo-publish-reviewer`](../agents/seo-publish-reviewer.toml) (pre-publish gate) and [`outreach-marketer`](../agents/outreach-marketer.toml) (cold email and LinkedIn).

## `/code-review` usage

```
/code-review                 # this branch against the default base branch
/code-review 51              # GitHub PR #51
/code-review hero            # audit the block or pattern named "hero"
/code-review --help          # usage and valid targets
```

## `/wp-update-round` usage

Needs [wp-ops](https://github.com/imagewize/wp-ops) 5.42.0+ and a private `update-manifest.yml` per site (host type, versions, pages to screenshot, skip list). Requirements, manifest fields, example files and a dry run for a new site: [skills/wp-update-round/README.md](../skills/wp-update-round/README.md).

```
/wp-update-round                         # reads .vibe/update-manifest.yml, lists updates, stops at each approval
vibe --agent wp-maintainer               # same round, with debugging and verification skills enabled
```

## `/real-browser-control` usage

Drives the user's real, logged-in Chrome through [real-browser-mcp](https://github.com/ofershap/real-browser-mcp) (MIT): local MCP server + MV3 extension over a localhost WebSocket — useful for read-only Search Console reads, verifying a live page past SSO, reading LinkedIn under Vibe. Needs more than `skill_paths`: the extension loaded in Chrome and a `[[mcp_servers]]` stdio entry in `~/.vibe/config.toml`. Recommended install is from the pinned source (clone, `git checkout 173c964c3df3ea247a7b65ef519f664771709f12`, `npm install && npm run build`, load `extension/` unpacked at `chrome://extensions`), not the thin-reviewed store listing. Setup, tool table, guardrails: [skills/real-browser-control/SKILL.md](../skills/real-browser-control/SKILL.md).

```
/real-browser-control                    # load the skill, then drive the real browser via browser_* tools
```

## Design → HTML/CSS → block patterns

The design skills form a pipeline for FSE themes such as Elayne:

```
brief → /landing-page + /design-first-ui-prompting         (structure, copy, spec)
      → /frontend-design                                   (anchored HTML/CSS, token-locked)
        or, for a vertical: /design-system-library         (a named system, adapted; /ui-ux-pro-max if none fits)
        + /design-md                                       (optional: pin the look in DESIGN.md and lint it)
      → /architectural-drawing or /illustration-isometric-mono   (SVG drawings from a kit)
      → /no-ai-design-slop                                 (quality gate on the output)
      → /html-page-review                                  (rendered review → REVIEW.md → change requests)
      → /html-to-block-theme                               (HTML/CSS/JS → theme + patterns)
```

The design skills emit one self-contained HTML file per page, with sections marked by `<!-- ===== Section ===== -->` comments and preset-named CSS custom properties (`--wp--preset--color--<slug>` etc.), so each section converts to a valid block pattern without renaming fixes. A page uses one look: a `/frontend-design` anchor, or for a vertical brief a named system from `/design-system-library`. `/ux-writing` covers the on-screen copy. Drawings come from a kit, not hand-written SVG: `/architectural-drawing` draws buildings as elevations and sections in metres at one shared scale, and `/illustration-isometric-mono` draws technical and product scenes. The [`wp-frontend-builder`](../agents/wp-frontend-builder.toml) agent runs the build steps; the [`ux-designer`](../agents/ux-designer.toml) agent reviews the result with `/html-page-review`, and the builder applies the numbered notes from `REVIEW.md`.
