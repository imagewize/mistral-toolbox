---
name: real-browser-control
description: "Drive the user's real, logged-in Chrome from the agent via Real Browser MCP (local MCP server + MV3 extension over a localhost WebSocket — no debug port, no cloud relay): verify in the browser that is already past SSO, read open tabs, use existing sessions. MIT, adapted from ofershap/real-browser-mcp."
user-invocable: true
license: MIT
metadata:
  version: "1.0.0"
  source: "github.com/ofershap/real-browser-mcp skills/real-browser-control @ 173c964c3df3ea247a7b65ef519f664771709f12 (MIT, LICENSE copied alongside)"
---

# Real Browser Control (Real Browser MCP)

Drive the user's **actual** Chrome profile through [Real Browser MCP](https://github.com/ofershap/real-browser-mcp): a local MCP server plus an MV3 Chrome extension talking over a localhost WebSocket. Not a headless browser, not Playwright's fresh Chromium, not a cloud agentic browser — the agent talks MCP, the user's real Chrome executes, and sessions stay on the machine.

Chrome 136+ blocks `--remote-debugging-port` on the default profile, so CDP attach to an everyday logged-in Chrome fails or forces a throwaway profile that loses logins. The extension path works on the default profile, with cookies, SSO and open tabs intact.

## When to use vs alternatives

| Need | Real Browser MCP | Headless Playwright MCP | Cloud agentic browser | Chrome DevTools MCP (CDP) |
| ---- | ---------------- | ----------------------- | --------------------- | ------------------------- |
| Human's existing logins / SSO | Yes | Replay or inject state | Separate login | Hard on default profile after Chrome 136 |
| Tab already open with the bug | Yes | New window | Remote session | Attach path dependent |
| CI / repeatable clean runs | No | Yes | Sometimes | Weak fit |
| Local agent verify loop | Yes | Cold start | Not local | Debugging-oriented |

## Setup (Vibe)

1. Install the Chrome extension from the [Chrome Web Store](https://chromewebstore.google.com/detail/real-browser-mcp/fkkimpklpgedomcheiojngaaaicmaidi) ("Real Browser MCP" by ofershap). Popup green = connected.
2. Add the MCP server to `~/.vibe/config.toml` (or run `vibe mcp add real-browser --transport stdio --command npx --arg -y --arg real-browser-mcp`, which writes the same entry):

   ```toml
   [[mcp_servers]]
   name = "real-browser"
   transport = "stdio"
   command = "npx"
   args = ["-y", "real-browser-mcp"]
   ```

3. Restart Vibe, or `/mcp` reconnect in a running session. Confirm the bridge with the `browser_tabs` tool (action `list`).

## Tools

| Tool | When to use |
| ---- | ----------- |
| `browser_navigate` | Open a URL in the active tab |
| `browser_tabs` | List, create, focus or close tabs |
| `browser_snapshot` | Accessibility tree + refs (default first step) |
| `browser_screenshot` | Visual proof; heavier than snapshot |
| `browser_click` / `browser_click_text` | Act on a ref or visible text |
| `browser_type` | Fill inputs (contentEditable needs care) |
| `browser_press_key` | Enter, Escape, shortcuts |
| `browser_scroll` / `browser_wait` | Lazy feeds, SPAs, overlays |
| `browser_text` / `browser_find` | Read content or locate elements |
| `browser_console` / `browser_network` | Debug failures |
| `browser_evaluate` | Last resort; breaks strict-CSP sites and shows a debugger banner |
| `browser_handle_dialog` | Register before alert/confirm/prompt |

## Workflow

1. `browser_tabs` → confirm connection; focus the tab the user cares about.
2. Stay on the current page when the task lives there; navigate only when needed.
3. `browser_snapshot` (optionally scoped with `selector`) → collect refs.
4. Interact via refs (`browser_click`, `browser_type`, `browser_click_text` for menus).
5. After navigation, scroll or overlay: snapshot again — refs go stale.
6. Dropdowns: click trigger → wait ~400 ms → read menu → click option.
7. Verify with a snapshot or `browser_text`, not a screenshot alone.

## Defaults and guardrails

- **Read-only first on authenticated surfaces** (search consoles, admin panels, inboxes, dashboards): snapshot and read before any click; never submit forms, post, send, delete or change settings unless the user's prompt explicitly asks for that action.
- Prefer `browser_snapshot` over `browser_evaluate`; on strict-CSP sites (GitHub, Google) do not evaluate at all — use snapshot + click/type.
- Never close tabs you did not create; never leave the user's work tab without saying so.
- Large pages: scope the snapshot with `selector`.
- Social feeds: scroll 2000–3000 px, wait ~2 s, re-snapshot.

## Error scenarios

| Symptom | Action |
| ------- | ------ |
| Tools fail / timeout | Extension disconnected. Ask the user to open the popup (green ON) and check the WebSocket port matches. |
| Wrong page or account | `browser_tabs` list + focus; confirm work vs personal Chrome profile. |
| Stale ref errors | Re-run `browser_snapshot` after DOM changes. |
| `browser_evaluate` blocked | Stop evaluating; use snapshot + click/type. |
| contentEditable did not update | Reload the page and re-type; do not rely on `clear: true` alone. |
| User asked for CI automation | Recommend a headless Playwright MCP run instead, not this skill. |
