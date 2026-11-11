---
name: create-pull-request
description: Create or edit a GitHub pull request with the gh CLI without shell-quoting accidents — never pass a markdown body inline (backticks and $() execute, backslashes get eaten); write the body to a file with write_file and use --body-file, then verify the rendered result with gh pr view.
user-invocable: true
allowed-tools:
  - write_file
  - bash
metadata:
  version: "1.0.0"
  source: "github.com/imagewize/wp-vibe-toolbox skills/create-pull-request"
---

# Create Pull Request

Open and edit GitHub PRs with `gh` from the shell, safely. The failure mode this
skill exists to prevent: passing a markdown body inline with `--body "..."` — inside
double quotes the shell executes backticks as command substitution, expands `$(...)`,
and eats backslashes, so the PR body arrives mangled (or commands run that you never
meant to run).

## Rules

1. **Never inline a body containing backticks, `$()`, or backslashes.** Write the body
   to a file first and pass `--body-file`. In Vibe, write it with `write_file` (e.g. to
   the scratchpad); on a plain shell, use a single-quoted heredoc: `cat > pr-body.md <<'EOF'`
   … `EOF` (the quoted delimiter disables all expansion).
2. **Quote the title.** Use single quotes: `gh pr create --title 'feat: add thing'`.
   Single quotes disable substitution; double quotes do not.
3. **One plain command per step.** No shell loops, no `$(...)` substitutions in any
   argument.
4. **Verify after creating.** Read the PR back and check the body actually rendered:
   `gh pr view <number> --json title,body,url` — read the full output, not just the URL.
   If the body is mangled, fix it with `gh pr edit <number> --body-file <path>`.
5. Follow the repo's own conventions for titles and bodies (see AGENTS.md): semantic
   commit-style titles, no emoji, no AI-attribution trailers, and a body that states
   what changed, why, and the verification evidence.

## Workflow

1. Work on a branch, commit, then push:
   - `git push -u origin <branch>`
2. Write the PR body with `write_file` (markdown: what / why / verification / notes).
3. Create:
   - `gh pr create --title '<type>: <short summary>' --body-file <body-file> --base main`
4. Verify:
   - `gh pr view <number> --json title,body,url`
   - Read the returned body; confirm backticks, code spans and links are intact.
5. If anything is wrong: edit the body file, then `gh pr edit <number> --body-file <body-file>`
   and re-verify.

## Anti-patterns

| Wrong | Why | Right |
|-------|-----|-------|
| `gh pr create --body "fix \`foo\`"` | backticks execute as a command | `--body-file` |
| `gh pr create --body "see $(git log -1)"` | `$()` expands at call time | write body to file, or drop the substitution |
| `gh pr create --body "path C:\new"` | backslashes eaten in double quotes | single quotes or `--body-file` |
| `cat > body.md <<EOF` (unquoted) | heredoc body expands `$` and backticks | `<<'EOF'` |
| trusting the create output URL | body may be mangled silently | `gh pr view <n> --json title,body,url` and read it |

## Body checklist

- What changed and why (one short paragraph or bullets)
- How it was verified (commands run + their exit codes)
- Anything the reviewer should know (assumptions, follow-ups, projects needing updated copies)
- No emoji, no secrets, no AI-attribution trailers (per repo AGENTS.md)
