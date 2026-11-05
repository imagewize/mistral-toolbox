# Le Chat prompts

System prompts you paste into a [Mistral Le Chat](https://chat.mistral.ai) agent. Le Chat has no file or shell access, so these work on what you paste in — to work on real files, use the [Vibe agents](agents.md).

1. Copy a prompt file, e.g. [`prompts/frontend-dev/FRONTEND-DEV.md`](../prompts/frontend-dev/FRONTEND-DEV.md)
2. In Le Chat open **Agents → New Agent** and paste it into **System Prompt**
3. Pick a model such as `mistral-large-latest` or `devstral`, and start chatting

| Prompt | Role | Focus |
|--------|------|-------|
| [FRONTEND-DEV.md](../prompts/frontend-dev/FRONTEND-DEV.md) | Senior Frontend Developer | WordPress themes, HTML/CSS, block patterns |
| [REVIEWER.md](../prompts/reviewer/REVIEWER.md) | Frontend Code Reviewer | HTML/CSS output analysis, FSE compliance |

The prompts are tailored to these Imagewize projects:

| Project | Type | Tech stack |
|---------|------|------------|
| **Elayne** | FSE block theme | Gutenberg, theme.json, patterns |
| **Nynaeve** | Sage 11 hybrid theme | Blade, ACF Composer, React blocks |
| **imagewize.com** | Site | Enterprise WordPress |

The frontend prompts require production-ready, mobile-first output with realistic content — no placeholders, no lorem ipsum, and no centered overlay heroes (the most common failure pattern).

## Example runs

Each `prompts/<name>/<run>/` folder is a real run — `PROMPT.md` (input), `OUTPUT.md` (raw response), `canvas.html` (generated HTML, frontend runs) and `FEEDBACK.md` (what worked, what failed) — so you can see how a prompt performs in practice.

| Run | Prompt | Result |
|-----|--------|--------|
| [frontend-dev/elayne-hero-block](../prompts/frontend-dev/elayne-hero-block/) | FRONTEND-DEV | Reviewed — see FEEDBACK.md |
| [reviewer/elayne-hero-block](../prompts/reviewer/elayne-hero-block/) | REVIEWER | FAIL — CSS variable namespace + dash syntax errors |

---
