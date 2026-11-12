# {{NAME}} demo

<!-- One sentence: what is built, with which agent, in which mode. -->
{{SUMMARY}} Built with the `wp-frontend-builder` Vibe agent from
[wp-vibe-toolbox](https://github.com/imagewize/wp-vibe-toolbox): first an HTML/CSS prototype
(`index.html`), then a block theme (`theme-{{THEME_SLUG}}/`). The prompts for each run are in
[PROMPTS.md](PROMPTS.md).

## Brief

<!-- From the brief questions: name and place, what they do, audience, main actions, tone and
     language, references with what to take from each. Mark an invented name as invented. -->
{{BRIEF_BULLETS}}

## Layout

```
{{PROJECT_FOLDER_NAME}}/
├── images/              # Photos + CREDITS.md
├── index.html           # HTML/CSS prototype (prompt 1)
├── REVIEW.md            # Review notes from ux-designer (prompt 2)
├── theme-{{THEME_SLUG}}/  # Block theme (prompt 4)
└── PROMPTS.md           # Every prompt, in order, with outcome and commit
```

Local site: `https://{{SITE}}.test` (Laravel Valet){{SITE_PLUGINS}}.
