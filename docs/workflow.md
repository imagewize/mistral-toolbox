# The WordPress workflow

The skills and agents are built to chain, from a design to a live, maintained site.

| Step | Use | What you get |
|------|-----|--------------|
| 1. Design | [`wp-frontend-builder`](../agents/wp-frontend-builder.toml) with `/design-first-ui-prompting`, `/frontend-design`, `/no-ai-design-slop` | A locked design system and an anchored HTML/CSS prototype, one section per future block pattern |
| 2. Build | [`/html-to-block-theme`](../skills/html-to-block-theme/SKILL.md) | The HTML/CSS/JS design as a production FSE block theme with `theme.json` v3, patterns and parts |
| 3. Review | [`wp-reviewer`](../agents/wp-reviewer.toml), [`/code-review`](../skills/code-review/SKILL.md) | The diff reviewed against WordPress coding standards, every finding labelled CONFIRMED or PLAUSIBLE with a failure scenario |
| 4. Maintain | [`wp-maintainer`](../agents/wp-maintainer.toml), [`/wp-update-round`](../skills/wp-update-round/SKILL.md) | A full update round: before/after screenshots, pixel diff, human approval, production deploy |
| 5. Publish | [`seo-content-writer`](../agents/seo-content-writer.toml) → [`seo-publish-reviewer`](../agents/seo-publish-reviewer.toml) | Content planned and drafted, then handed to an independent reviewer before it goes live |

Also in the box: [`release-manager`](../agents/release-manager.toml) for release readiness and [`devops-oncall`](../agents/devops-oncall.toml) for incident triage that starts read-only and logs its evidence. All agents: [agents.md](agents.md). All skills: [skills.md](skills.md).

## Works best with Aviendha and Aludra

For themes, the toolbox builds on two open-source pieces:

| Piece | Role | Why you want it |
|-------|------|-----------------|
| [Aviendha](https://github.com/imagewize/aviendha) | Lean FSE starter theme to fork | A tested `theme.json`, WooCommerce templates and the pattern-validation harness, with no pattern library to fight |
| [Aludra](https://github.com/imagewize/aludra) | Block library (hero, stat rail, feature cards, carousel, FAQ, contact section, mega menu…) | Sections the agent composes instead of hand-writing markup |

**A theme built from Aludra blocks needs the plugin active, or the blocks render as empty placeholders.** The skills make the theme say so in its README and show an admin notice when Aludra is missing.

Plain core-block conversions (Mode A of [`/html-to-block-theme`](../skills/html-to-block-theme/SKILL.md)) need neither.

## Case study: an HTML design to a block theme

[`architect-demo`](https://github.com/imagewize/architect-demo) is an architecture studio site. The `wp-frontend-builder` agent took a single `index.html` and built a [Kadewerk](https://github.com/imagewize/architect-demo/tree/main/theme-kadewerk) block theme from it: a fork of Aviendha, with the homepage composed from Aludra blocks. The write-up of each run, including what went wrong and which skill change fixed it, is in its `PROMPTS.md`.
