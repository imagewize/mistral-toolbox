#!/usr/bin/env node
// html-page-review measure script.
//
// Measures elements on a live page (https:// or file://) at an exact viewport width, in
// headless Chrome, and prints JSON: per selector the box (x, y, w, h), a few computed styles
// and the text, plus the page's scroll width. Optionally clicks or hovers an element first,
// so an open mobile menu or a hover colour can be measured.
//
// No npm packages: Node 22+ (built-in fetch and WebSocket) and Google Chrome or Chromium.
// It starts its own Chrome with a throwaway profile, never touches your browser, writes
// nothing but that profile (deleted on exit), and only reads the page.
//
// Usage:
//   node measure.mjs <url> [--width 390] [--height 844] [--click SEL] [--hover SEL]
//                          [--wait 600] [--props a,b,c] [--all] [--select SEL …]
//                          [--screenshot FILE.png [--full]]
//
// Example (open the mobile menu, measure its links and its CTA):
//   node measure.mjs https://example.test/ --width 390 \
//     --click '.wp-block-navigation__responsive-container-open' \
//     --select '.wp-block-navigation__responsive-container' \
//     --select '.is-menu-open .wp-block-navigation-item__content' --all
//
// --select   CSS selector to measure; repeat it. Reports the first match, or every match
//            with --all.
// --click    Click this element (centre) after load, then wait --wait ms.
// --hover    Move the mouse onto this element after load (and after --click), then wait.
// --props    Computed styles to report (default: display, box-sizing, color,
//            background-color, font-size, font-weight, padding, margin, border-radius,
//            justify-content, align-items, transition).
// --width    Viewport width in CSS pixels; any width works, phones included (no 500px floor).
// --screenshot  Save a PNG of the page after the click/hover, at exactly --width CSS pixels,
//            with web fonts loaded and lazy images forced to load. --full captures the whole
//            page height instead of the viewport. Works for https:// and file:// alike, so no
//            frame.html is needed. Combine with --select to get numbers and a picture in one run.
// CHROME     Environment variable with the Chrome binary, if it is not in the default place.

import { spawn } from 'node:child_process';
import { mkdtempSync, rmSync, readFileSync, existsSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const DEFAULT_PROPS = [
  'display', 'box-sizing', 'color', 'background-color', 'font-size', 'font-weight',
  'padding', 'margin', 'border-radius', 'justify-content', 'align-items', 'transition',
];

function parseArgs(argv) {
  const o = { url: null, width: 1440, height: 900, click: null, hover: null, wait: 600, props: DEFAULT_PROPS, all: false, select: [], screenshot: null, full: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    const next = () => { const v = argv[++i]; if (v === undefined) fail(`${a} needs a value`); return v; };
    if (a === '--width') o.width = parseInt(next(), 10);
    else if (a === '--height') o.height = parseInt(next(), 10);
    else if (a === '--click') o.click = next();
    else if (a === '--hover') o.hover = next();
    else if (a === '--wait') o.wait = parseInt(next(), 10);
    else if (a === '--props') o.props = next().split(',').map((s) => s.trim()).filter(Boolean);
    else if (a === '--select') o.select.push(next());
    else if (a === '--all') o.all = true;
    else if (a === '--screenshot') o.screenshot = next();
    else if (a === '--full') o.full = true;
    else if (a === '-h' || a === '--help') { usage(); process.exit(0); }
    else if (a.startsWith('--')) fail(`unknown option ${a}`);
    else if (!o.url) o.url = a;
    else fail(`unexpected argument ${a}`);
  }
  if (!o.url) fail('missing <url>');
  if (!o.select.length && !o.screenshot) fail('give at least one --select, or --screenshot');
  if (o.full && !o.screenshot) fail('--full needs --screenshot');
  return o;
}

function usage() {
  console.log('node measure.mjs <url> [--width N] [--height N] [--click SEL] [--hover SEL] [--wait MS] [--props a,b] [--all] [--select SEL ...] [--screenshot FILE.png [--full]]');
}

function fail(msg) {
  console.error(`measure.mjs: ${msg}`);
  usage();
  process.exit(2);
}

function chromePath() {
  const candidates = [
    process.env.CHROME,
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/Applications/Chromium.app/Contents/MacOS/Chromium',
    '/usr/bin/google-chrome',
    '/usr/bin/chromium',
    '/usr/bin/chromium-browser',
  ].filter(Boolean);
  const found = candidates.find((p) => existsSync(p));
  if (!found) fail('Chrome not found; set CHROME=/path/to/chrome');
  return found;
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function waitForPort(profile, chrome) {
  const file = join(profile, 'DevToolsActivePort');
  for (let i = 0; i < 100; i++) {
    if (chrome.exitCode !== null) throw new Error(`Chrome exited (${chrome.exitCode})`);
    if (existsSync(file)) {
      const port = readFileSync(file, 'utf8').split('\n')[0].trim();
      if (port) return port;
    }
    await sleep(100);
  }
  throw new Error('Chrome did not open a DevTools port');
}

function cdp(wsUrl) {
  const ws = new WebSocket(wsUrl);
  let id = 0;
  const pending = new Map();
  const waiters = [];
  ws.addEventListener('message', (ev) => {
    const msg = JSON.parse(typeof ev.data === 'string' ? ev.data : ev.data.toString());
    if (msg.id && pending.has(msg.id)) {
      const { resolve, reject } = pending.get(msg.id);
      pending.delete(msg.id);
      if (msg.error) reject(new Error(`${msg.error.message} (${msg.error.code})`));
      else resolve(msg.result);
    } else if (msg.method) {
      for (let i = waiters.length - 1; i >= 0; i--) {
        if (waiters[i].method === msg.method) { waiters[i].resolve(msg.params); waiters.splice(i, 1); }
      }
    }
  });
  return {
    open: () => new Promise((resolve, reject) => { ws.addEventListener('open', resolve, { once: true }); ws.addEventListener('error', reject, { once: true }); }),
    send: (method, params = {}) => new Promise((resolve, reject) => { const n = ++id; pending.set(n, { resolve, reject }); ws.send(JSON.stringify({ id: n, method, params })); }),
    once: (method, timeout = 15000) => new Promise((resolve, reject) => {
      // The timer is cleared on success, so a pending timeout never keeps the process alive.
      const timer = setTimeout(() => { const i = waiters.indexOf(w); if (i >= 0) { waiters.splice(i, 1); reject(new Error(`timeout waiting for ${method}`)); } }, timeout);
      const w = { method, resolve: (v) => { clearTimeout(timer); resolve(v); } };
      waiters.push(w);
    }),
    close: () => ws.close(),
  };
}

// Runs in the page. Returns plain data only.
function measureInPage(selectors, props, all) {
  const r = (n) => Math.round(n * 10) / 10;
  const out = {
    url: location.href,
    viewport: { width: innerWidth, height: innerHeight },
    scrollWidth: document.documentElement.scrollWidth,
    horizontalScroll: document.documentElement.scrollWidth > innerWidth,
    elements: {},
  };
  for (const sel of selectors) {
    let list;
    try { list = Array.from(document.querySelectorAll(sel)); } catch (e) { out.elements[sel] = { error: String(e) }; continue; }
    const take = all ? list : list.slice(0, 1);
    out.elements[sel] = {
      count: list.length,
      items: take.map((el) => {
        const b = el.getBoundingClientRect();
        const cs = getComputedStyle(el);
        const styles = {};
        for (const p of props) styles[p] = cs.getPropertyValue(p);
        return {
          text: (el.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 60),
          box: { x: r(b.left), y: r(b.top), w: r(b.width), h: r(b.height), right: r(b.right), bottom: r(b.bottom) },
          visible: b.width > 0 && b.height > 0 && cs.visibility !== 'hidden' && cs.display !== 'none',
          hovered: el.matches(':hover'),
          classes: typeof el.className === 'string' ? el.className.slice(0, 160) : '',
          styles,
        };
      }),
    };
  }
  return out;
}

async function centreOf(client, sel) {
  const res = await client.send('Runtime.evaluate', {
    expression: `(() => { const el = document.querySelector(${JSON.stringify(sel)}); if (!el) return null; el.scrollIntoView({block:'center'}); const b = el.getBoundingClientRect(); return {x: b.left + b.width / 2, y: b.top + b.height / 2}; })()`,
    returnByValue: true,
  });
  const v = res.result.value;
  if (!v) throw new Error(`no element matches ${sel}`);
  return v;
}

async function main() {
  const o = parseArgs(process.argv.slice(2));
  const profile = mkdtempSync(join(tmpdir(), 'measure-'));
  const chrome = spawn(chromePath(), [
    '--headless=new', '--disable-gpu', '--hide-scrollbars', '--no-first-run', '--no-default-browser-check',
    '--force-prefers-reduced-motion', '--allow-file-access-from-files', '--remote-debugging-port=0',
    `--user-data-dir=${profile}`, `--window-size=${Math.max(o.width, 500)},${o.height}`, 'about:blank',
  ], { stdio: 'ignore' });
  let client;
  try {
    const port = await waitForPort(profile, chrome);
    const targets = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json();
    const page = targets.find((t) => t.type === 'page');
    if (!page) throw new Error('no page target');
    client = cdp(page.webSocketDebuggerUrl);
    await client.open();
    await client.send('Page.enable');
    await client.send('Runtime.enable');
    // Exact CSS width, also below Chrome's 500px window floor.
    await client.send('Emulation.setDeviceMetricsOverride', { width: o.width, height: o.height, deviceScaleFactor: 1, mobile: false });
    await client.send('Network.enable');
    await client.send('Network.setCacheDisabled', { cacheDisabled: true });
    const loaded = client.once('Page.loadEventFired', 30000);
    const nav = await client.send('Page.navigate', { url: o.url });
    if (nav.errorText) throw new Error(`navigation failed: ${nav.errorText}`);
    await loaded;
    // Load what a real visitor would see: lazy images (they never enter a headless viewport)
    // and web fonts, then back to the top so the layout is the initial one.
    await client.send('Runtime.evaluate', {
      expression: `(async () => {
        document.querySelectorAll('img[loading="lazy"]').forEach((i) => { i.loading = 'eager'; });
        // Scroll through in viewport steps: Chrome starts a lazy image only near the viewport,
        // and a single jump to the bottom skips the ones in between.
        for (let y = 0; y < document.documentElement.scrollHeight; y += innerHeight) {
          window.scrollTo(0, y);
          await new Promise((r) => setTimeout(r, 120));
        }
        window.scrollTo(0, 0);
        await Promise.all(Array.from(document.images).map((i) => (i.decode ? i.decode().catch(() => {}) : Promise.resolve())));
        if (document.fonts) await document.fonts.ready;
      })()`,
      awaitPromise: true,
    });
    await sleep(800); // Interactivity API hydration
    if (o.click) {
      const c = await centreOf(client, o.click);
      for (const type of ['mousePressed', 'mouseReleased']) {
        await client.send('Input.dispatchMouseEvent', { type, x: c.x, y: c.y, button: 'left', clickCount: 1 });
      }
      await sleep(o.wait);
    }
    if (o.hover) {
      const c = await centreOf(client, o.hover);
      await client.send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: c.x, y: c.y });
      await sleep(Math.max(o.wait, 400)); // let a hover transition finish
    }
    const res = await client.send('Runtime.evaluate', {
      expression: `(${measureInPage.toString()})(${JSON.stringify(o.select)}, ${JSON.stringify(o.props)}, ${o.all})`,
      returnByValue: true,
    });
    if (res.exceptionDetails) throw new Error(res.exceptionDetails.text);
    const data = res.result.value;
    data.actions = { click: o.click, hover: o.hover };
    if (o.screenshot) {
      const shot = { format: 'png', captureBeyondViewport: o.full };
      if (o.full) {
        const m = await client.send('Page.getLayoutMetrics');
        const h = Math.ceil((m.cssContentSize || m.contentSize).height);
        shot.clip = { x: 0, y: 0, width: o.width, height: h, scale: 1 };
      }
      const img = await client.send('Page.captureScreenshot', shot);
      writeFileSync(o.screenshot, Buffer.from(img.data, 'base64'));
      data.screenshot = { file: o.screenshot, full: o.full };
    }
    console.log(JSON.stringify(data, null, 1));
  } finally {
    try { client && client.close(); } catch (e) { /* ignore */ }
    chrome.kill();
    await sleep(200);
    try { rmSync(profile, { recursive: true, force: true }); } catch (e) { /* ignore */ }
  }
}

main().catch((e) => { console.error(`measure.mjs: ${e.message}`); process.exit(1); });
