#!/usr/bin/env node
// Option sheets for a block theme: one PNG a client can pick from.
//
//   node options.mjs colors [--theme DIR] [--variations a,b] [--out DIR]
//       One mini page per style variation (theme.json + styles/*.json), built from the theme's own
//       palette, fonts and element styles: header, hero with buttons, dark band, tinted section,
//       footer, palette strip and measured contrast for the button, body and footer.
//
//   node options.mjs fonts --fonts "Fraunces:800,Young Serif,Bricolage Grotesque:800" [--theme DIR] [--out DIR]
//       One card per heading-font candidate next to the theme's current heading font. Candidates are
//       Fontsource ids or names (downloaded once into <out>/fonts/) or local .woff2 paths.
//
// Options
//   --theme DIR          block theme folder (default: current folder)
//   --out DIR            output folder (default: ./options); writes color-options.html/.png or heading-fonts.html/.png and fonts/
//   --variations LIST    colors: comma list of variation names or .json paths (default: every styles/*.json and styles/colors/*.json)
//   --no-current         colors: leave out the "current" card (theme.json without a variation); fonts: leave out the current heading font
//   --roles LIST         colors: override auto-detected slugs, e.g. band=secondary,tint=tertiary,footer=indigo,band-accent=leaf-light
//                        keys: header, header-text, band, band-text, band-accent, tint, footer, footer-text
//   --variation NAME     fonts: apply this style variation's colors to the font cards
//   --body NAME          fonts: body font from Fontsource instead of the theme's body font
//   --site NAME          site name in the mock header (default: Theme Name from style.css)
//   --copy FILE          JSON with any of: siteName, nav (array), navCta, heroTitle, heroText, cta, cta2,
//                        bandTitle, bandText, tintTitle, tintCta, footer
//   --cols N             cards per row (colors 3, fonts 2)
//   --scale N            device scale factor for the PNG (default 1)
//   --no-shot            write the HTML only
//
// Fonts entry syntax: name[:weight[:AXIS=value+AXIS=value]], e.g. "Fraunces:800:SOFT=100+WONK=1".
// The PNG is taken with Chrome headless (no npm packages). Chrome is found via $CHROME_PATH, Google Chrome,
// Chromium, then Playwright's ~/Library/Caches/ms-playwright or ~/.cache/ms-playwright downloads.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';

// ---------- arguments ----------
const argv = process.argv.slice(2);
const mode = argv.shift();
if (!['colors', 'fonts'].includes(mode)) {
  console.error('Usage: node options.mjs colors|fonts [options]  (see the header of this file)');
  process.exit(2);
}
const flags = new Set();
const opts = {};
for (let i = 0; i < argv.length; i++) {
  const a = argv[i];
  if (!a.startsWith('--')) { console.error(`Unexpected argument: ${a}`); process.exit(2); }
  const key = a.slice(2);
  if (['no-current', 'no-shot'].includes(key)) flags.add(key);
  else opts[key] = argv[++i];
}
const themeDir = path.resolve(opts.theme || '.');
const outDir = path.resolve(opts.out || 'options');
const fontsOut = path.join(outDir, 'fonts');
const scale = Number(opts.scale || 1);

const themeJsonPath = path.join(themeDir, 'theme.json');
if (!fs.existsSync(themeJsonPath)) { console.error(`No theme.json in ${themeDir} (pass --theme)`); process.exit(1); }
const theme = readJSON(themeJsonPath);
fs.mkdirSync(fontsOut, { recursive: true });

const copy = {
  siteName: opts.site || themeName() || 'Site name',
  nav: ['Services', 'Process', 'Work'],
  navCta: 'Contact',
  heroTitle: 'A clear headline for the home page',
  heroText: 'One or two sentences under the headline, in the body font and body color.',
  cta: 'Send a message',
  cta2: 'See our work',
  bandTitle: 'A section on a dark band',
  bandText: 'Accent text on the dark band',
  tintTitle: 'A tinted section with a call to action',
  tintCta: 'Get in touch',
  footer: 'Services · Process · Work · Contact',
  ...(opts.copy ? readJSON(path.resolve(opts.copy)) : {}),
};

// ---------- helpers ----------
function readJSON(p) { return JSON.parse(fs.readFileSync(p, 'utf8')); }
function themeName() {
  const css = path.join(themeDir, 'style.css');
  if (!fs.existsSync(css)) return null;
  const m = fs.readFileSync(css, 'utf8').match(/Theme Name:\s*(.+)/);
  return m ? m[1].trim() : null;
}
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const isObj = v => v && typeof v === 'object' && !Array.isArray(v);
// WordPress merges a variation over theme.json: objects merge, arrays (palette, fontFamilies) are replaced.
function merge(a, b) {
  if (!isObj(a) || !isObj(b)) return b === undefined ? a : b;
  const out = { ...a };
  for (const k of Object.keys(b)) out[k] = merge(a[k], b[k]);
  return out;
}
const kebab = s => String(s).replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
const preset = v => typeof v !== 'string' ? v
  : v.replace(/var:(preset|custom)\|([a-z0-9|_-]+)/gi, (_, kind, rest) => `var(--wp--${kind}--${rest.split('|').map(kebab).join('--')})`);

function cssVars(settings = {}) {
  const v = {};
  for (const c of settings.color?.palette || []) v[`--wp--preset--color--${c.slug}`] = c.color;
  for (const g of settings.color?.gradients || []) v[`--wp--preset--gradient--${g.slug}`] = g.gradient;
  for (const f of settings.typography?.fontFamilies || []) v[`--wp--preset--font-family--${f.slug}`] = f.fontFamily;
  for (const f of settings.typography?.fontSizes || []) v[`--wp--preset--font-size--${f.slug}`] = f.size;
  for (const s of settings.spacing?.spacingSizes || []) v[`--wp--preset--spacing--${s.slug}`] = s.size;
  for (const s of settings.shadow?.presets || []) v[`--wp--preset--shadow--${s.slug}`] = s.shadow;
  (function walk(o, pre) {
    for (const [k, val] of Object.entries(o || {})) {
      const name = `${pre}--${kebab(k)}`;
      if (isObj(val)) walk(val, name); else v[name] = String(val);
    }
  })(settings.custom, '--wp--custom');
  return v;
}
function resolveVar(value, vars, depth = 0) {
  if (typeof value !== 'string' || depth > 8) return value;
  const out = preset(value).replace(/var\(\s*(--[\w-]+)\s*(?:,\s*([^)]*))?\)/g, (_, n, fb) => vars[n] ?? fb ?? '');
  return out.includes('var(') ? resolveVar(out, vars, depth + 1) : out;
}

// contrast (WCAG 2.x relative luminance)
function rgb(c) {
  if (!c) return null;
  c = c.trim();
  let m = c.match(/^#([0-9a-f]{3,8})$/i);
  if (m) {
    let h = m[1];
    if (h.length <= 4) h = [...h].map(x => x + x).join('');
    return [0, 2, 4].map(i => parseInt(h.slice(i, i + 2), 16));
  }
  m = c.match(/^rgba?\(\s*(\d+)[ ,]+(\d+)[ ,]+(\d+)/i);
  return m ? m.slice(1, 4).map(Number) : null;
}
function lum(c) {
  const p = rgb(c); if (!p) return null;
  const [r, g, b] = p.map(x => { x /= 255; return x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4; });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
function ratio(a, b) {
  const la = lum(a), lb = lum(b);
  if (la == null || lb == null) return null;
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}

// theme.json style object -> CSS declarations. Sizes and spacing are left out on purpose:
// the mini page has its own scale, the preview compares color and type, not layout.
function styleToCss(s = {}, { withFont = true } = {}) {
  const d = [];
  const put = (prop, val) => { if (val != null && val !== '') d.push(`${prop}:${preset(val)}`); };
  put('color', s.color?.text);
  put('background-color', s.color?.background);
  put('background-image', s.color?.gradient);
  const t = s.typography || {};
  if (withFont) put('font-family', t.fontFamily);
  put('font-weight', t.fontWeight);
  put('font-style', t.fontStyle);
  put('line-height', t.lineHeight);
  put('letter-spacing', t.letterSpacing);
  put('text-transform', t.textTransform);
  put('text-decoration', t.textDecoration);
  const b = s.border || {};
  if (typeof b.radius === 'string') put('border-radius', b.radius);
  else if (isObj(b.radius)) put('border-radius', ['topLeft', 'topRight', 'bottomRight', 'bottomLeft'].map(k => preset(b.radius[k] || '0')).join(' '));
  if (b.width || b.color) { put('border-style', b.style || 'solid'); put('border-width', b.width); put('border-color', b.color); }
  put('box-shadow', s.shadow);
  return d.join(';');
}

// @font-face rules for a settings tree; theme files are copied into <out>/fonts so the HTML is portable.
const faceSeen = new Set();
function fontFaces(settings, baseDir) {
  let css = '';
  for (const fam of settings.typography?.fontFamilies || []) {
    for (const face of fam.fontFace || []) {
      const srcs = [].concat(face.src || []);
      const parts = [];
      for (const src of srcs) {
        if (src.startsWith('file:')) {
          const abs = path.resolve(baseDir, src.slice(5));
          if (!fs.existsSync(abs)) { console.warn(`! font file missing: ${abs}`); continue; }
          const dest = path.join(fontsOut, path.basename(abs));
          if (!fs.existsSync(dest)) fs.copyFileSync(abs, dest);
          parts.push(`url(fonts/${encodeURI(path.basename(abs))})`);
        } else parts.push(`url(${src})`);
      }
      if (!parts.length) continue;
      const key = `${face.fontFamily}|${face.fontWeight}|${face.fontStyle}|${parts[0]}`;
      if (faceSeen.has(key)) continue;
      faceSeen.add(key);
      css += `@font-face{font-family:${quoteFamily(face.fontFamily)};src:${parts.join(',')};font-weight:${face.fontWeight || 400};font-style:${face.fontStyle || 'normal'};font-display:block}\n`;
    }
  }
  return css;
}
const quoteFamily = f => /^['"]/.test(f) ? f : `'${f}'`;

// Slugs used as backgroundColor / textColor in patterns, parts and templates, most used first.
function usedSlugs(attr) {
  const counts = {};
  for (const sub of ['patterns', 'parts', 'templates']) {
    const dir = path.join(themeDir, sub);
    if (!fs.existsSync(dir)) continue;
    for (const f of fs.readdirSync(dir)) {
      if (!/\.(php|html)$/.test(f)) continue;
      const txt = fs.readFileSync(path.join(dir, f), 'utf8');
      for (const m of txt.matchAll(new RegExp(`"${attr}":"([a-z0-9-]+)"`, 'g'))) counts[m[1]] = (counts[m[1]] || 0) + 1;
    }
  }
  return Object.entries(counts).sort((a, b) => b[1] - a[1]).map(([s]) => s);
}
function partColors(part) {
  const p = path.join(themeDir, 'parts', `${part}.html`);
  if (!fs.existsSync(p)) return null;
  const txt = fs.readFileSync(p, 'utf8');
  return { bg: txt.match(/"backgroundColor":"([a-z0-9-]+)"/)?.[1], text: txt.match(/"textColor":"([a-z0-9-]+)"/)?.[1] };
}

// Pick the role slugs once, from the current theme palette, so every card uses the same structure.
function detectRoles(settings) {
  const pal = Object.fromEntries((settings.color?.palette || []).map(c => [c.slug, c.color]));
  const has = s => s && pal[s];
  const L = s => lum(pal[s]) ?? 0.5;
  const bgs = usedSlugs('backgroundColor').filter(has);
  const texts = usedSlugs('textColor').filter(has);
  // A part that exists but sets no color inherits the body colors in WordPress (null = inherit).
  // Only a theme without the part at all gets a mock dark footer.
  const header = partColors('header') || {}, footerPart = partColors('footer'), footer = footerPart || {};
  const light = ['base', 'white'].find(has) || Object.keys(pal).sort((a, b) => L(b) - L(a))[0];
  const darkest = Object.keys(pal).sort((a, b) => L(a) - L(b))[0];
  const roles = {
    header: has(header.bg) ? header.bg : null,
    'header-text': has(header.text) ? header.text : null,
    footer: has(footer.bg) ? footer.bg : footerPart ? null : darkest,
    'footer-text': has(footer.text) ? footer.text : footerPart ? null : light,
    band: bgs.find(s => L(s) < 0.18 && s !== footer.bg) || bgs.find(s => L(s) < 0.18) || darkest,
    'band-text': light,
    tint: bgs.find(s => L(s) > 0.55 && s !== light) || ['tertiary', 'primary-accent'].find(has) || light,
  };
  roles['band-accent'] = texts.find(s => L(s) > 0.35 && s !== light) || roles['band-text'];
  for (const pair of (opts.roles || '').split(',').filter(Boolean)) {
    const [k, v] = pair.split('=').map(x => x.trim());
    if (!(k in roles)) { console.error(`Unknown role "${k}". Use: ${Object.keys(roles).join(', ')}`); process.exit(2); }
    roles[k] = v;
  }
  return roles;
}
const cv = slug => slug ? `var(--wp--preset--color--${slug})` : 'transparent';

function findChrome() {
  const tries = [process.env.CHROME_PATH,
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/Applications/Chromium.app/Contents/MacOS/Chromium',
    '/usr/bin/google-chrome', '/usr/bin/google-chrome-stable', '/usr/bin/chromium', '/usr/bin/chromium-browser'];
  for (const cache of [path.join(os.homedir(), 'Library/Caches/ms-playwright'), path.join(os.homedir(), '.cache/ms-playwright')]) {
    if (!fs.existsSync(cache)) continue;
    for (const d of fs.readdirSync(cache).filter(d => /^chromium-\d+$/.test(d)).sort((a, b) => b.split('-')[1] - a.split('-')[1])) {
      tries.push(path.join(cache, d, 'chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing'),
        path.join(cache, d, 'chrome-mac/Chromium.app/Contents/MacOS/Chromium'),
        path.join(cache, d, 'chrome-linux/chrome'), path.join(cache, d, 'chrome-linux64/chrome'));
    }
  }
  return tries.find(p => p && fs.existsSync(p));
}
function screenshot(htmlFile, pngFile, width, height) {
  const chrome = findChrome();
  if (!chrome) { console.error('No Chrome found. Set CHROME_PATH, or open the HTML and screenshot it yourself.'); return false; }
  const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'tso-'));
  const r = spawnSync(chrome, ['--headless', '--disable-gpu', '--hide-scrollbars', '--no-first-run', '--no-default-browser-check',
    '--allow-file-access-from-files', `--user-data-dir=${profile}`, `--force-device-scale-factor=${scale}`,
    '--virtual-time-budget=8000', `--window-size=${width},${height}`, `--screenshot=${pngFile}`,
    pathToFileURL(htmlFile).href], { encoding: 'utf8', timeout: 90000 });
  fs.rmSync(profile, { recursive: true, force: true });
  if (!fs.existsSync(pngFile)) { console.error(`Chrome did not write the PNG:\n${r.stderr || r.error}`); return false; }
  return true;
}

function writeSheet(name, title, css, body, width, height) {
  const html = `<!doctype html><html lang="en"><meta charset="utf-8"><title>${esc(title)}</title>
<!-- generated by theme-style-options/scripts/options.mjs; edit the theme or the options, not this file -->
<style>${css}</style>
<body>${body}</body></html>\n`;
  const htmlFile = path.join(outDir, `${name}.html`);
  fs.writeFileSync(htmlFile, html);
  console.log(`wrote ${htmlFile}`);
  if (flags.has('no-shot')) return;
  const png = path.join(outDir, `${name}.png`);
  if (fs.existsSync(png)) fs.rmSync(png);
  if (screenshot(htmlFile, png, width, height)) console.log(`wrote ${png} (${width}x${height} @${scale}x)`);
}

const PAD = 24, GAP = 22, HEAD = 46;
const baseCss = `*{box-sizing:border-box}
body{margin:0;padding:${PAD}px;background:#fff;color:#1d1d1d;font:14px/1.4 system-ui,-apple-system,'Segoe UI',sans-serif}
.sheet-title{height:${HEAD - 12}px;margin:0 0 12px;font:600 18px/1.2 system-ui,sans-serif;display:flex;align-items:baseline;gap:12px}
.sheet-title small{font:400 13px system-ui,sans-serif;color:#666}
.grid{display:grid;gap:${GAP}px}
.n{height:56px;overflow:hidden;font:700 15px/1.25 system-ui,sans-serif;color:#1d1d1d}
.n span{display:block;font:400 12px/1.35 system-ui,sans-serif;color:#555;margin-top:2px}
.n .bad{color:#b3261e;font-weight:600}
`;

// ---------- colors ----------
function colorsSheet() {
  const files = [];
  const styleDir = path.join(themeDir, 'styles');
  if (opts.variations) {
    for (const v of opts.variations.split(',').map(s => s.trim()).filter(Boolean)) {
      const cand = [v, path.join(styleDir, `${v}.json`), path.join(styleDir, 'colors', `${v}.json`)].map(p => path.resolve(themeDir, p));
      const f = cand.find(p => fs.existsSync(p) && p.endsWith('.json'));
      if (!f) { console.error(`Variation not found: ${v}`); process.exit(1); }
      files.push(f);
    }
  } else {
    for (const dir of [styleDir, path.join(styleDir, 'colors')]) {
      if (!fs.existsSync(dir)) continue;
      for (const f of fs.readdirSync(dir).filter(f => f.endsWith('.json')).sort()) files.push(path.join(dir, f));
    }
  }
  const cards = [];
  if (!flags.has('no-current')) cards.push({ title: `Current: ${theme.title || 'theme.json'}`, file: 'theme.json', data: theme });
  for (const f of files) {
    const v = readJSON(f);
    if (v.blockTypes) continue; // section style variation (WP 6.6+), not a site-wide option
    cards.push({ title: v.title || path.basename(f, '.json'), file: path.relative(themeDir, f), data: { settings: merge(theme.settings, v.settings), styles: merge(theme.styles, v.styles) } });
  }
  if (!cards.length) { console.error('No variations found. Add styles/<option>.json files or pass --variations.'); process.exit(1); }

  const roles = detectRoles(theme.settings);
  console.log(`roles: ${Object.entries(roles).map(([k, v]) => `${k}=${v ?? '-'}`).join(' ')}  (override with --roles)`);

  let css = baseCss + `
.mini{height:480px;overflow:hidden;border:1px solid #d8d8d8;border-radius:10px;font-size:13px;line-height:1.5}
.mini :is(h1,h2,h3){margin:0}
.mini .hd{display:flex;gap:14px;align-items:center;padding:10px 16px;font-size:12px;height:52px}
.mini .hd .logo{margin-right:auto;font-size:15px;font-weight:700}
.mini .hd a{color:inherit;text-decoration:none}
.mini .btn{display:inline-block;padding:8px 14px;font-size:12px;margin-bottom:5px;white-space:nowrap}
.mini .hero{padding:24px 16px 26px;height:196px}
.mini .hero h1{font-size:30px;margin-bottom:8px}
.mini .hero p{margin:0 0 14px;max-width:34em}
.mini .hero .more{margin-left:10px;font-size:12px}
.mini .band{padding:18px 16px;height:84px}
.card .mini .band h2{font-size:21px;margin-bottom:4px;color:inherit}
.mini .band p{margin:0;font-size:12px}
.mini .tint{padding:16px;display:flex;gap:12px;justify-content:space-between;align-items:center;height:84px}
.mini .tint h3{font-size:18px}
.mini .ft{padding:14px 16px;display:flex;justify-content:space-between;font-size:12px;height:64px}
.mini .ft b{font-size:14px}
.strip{display:flex;gap:3px;margin-top:8px;height:30px}
.strip i{flex:1;border-radius:4px;border:1px solid rgba(0,0,0,.12);font:9px/1 system-ui,sans-serif;font-style:normal;display:flex;align-items:flex-end;padding:3px;overflow:hidden;white-space:nowrap}
`;
  let body = '';
  cards.forEach((c, i) => {
    const s = c.data.styles || {}, st = c.data.settings || {};
    const vars = cssVars(st);
    const scope = `.v${i}`;
    css += fontFaces(st, themeDir);
    css += `${scope}{${Object.entries(vars).map(([k, v]) => `${k}:${v}`).join(';')}}\n`;
    css += `${scope} .mini{${styleToCss(s)}}\n`;
    css += `${scope} .mini :is(h1,h2,h3){${styleToCss(s.elements?.heading)}}\n`;
    for (const h of ['h1', 'h2', 'h3']) if (s.elements?.[h]) css += `${scope} .mini ${h}{${styleToCss(s.elements[h])}}\n`;
    css += `${scope} .mini a{${styleToCss(s.elements?.link)}}\n`;
    css += `${scope} .mini .btn{${styleToCss(s.elements?.button)}}\n`;
    if (s.css) css += `${scope} .mini{${s.css}}\n`; // theme.json "css" string, scoped with native CSS nesting

    const R = slug => resolveVar(slug ? `var(--wp--preset--color--${slug})` : '', vars);
    const bodyText = resolveVar(s.color?.text, vars), bodyBg = resolveVar(s.color?.background, vars);
    const btn = s.elements?.button?.color || {};
    const checks = [
      ['button', resolveVar(btn.text, vars), resolveVar(btn.background, vars)],
      ['body', resolveVar(s.color?.text, vars), resolveVar(s.color?.background, vars)],
      ['band', R(roles['band-text']), R(roles.band)],
      ['band accent', R(roles['band-accent']), R(roles.band)],
      ['footer', roles['footer-text'] ? R(roles['footer-text']) : bodyText, roles.footer ? R(roles.footer) : bodyBg],
    ].map(([k, a, b]) => {
      const r = ratio(a, b);
      return r == null ? `${k} n/a` : r < 4.5 ? `<b class=bad>${k} ${r.toFixed(1)}:1</b>` : `${k} ${r.toFixed(1)}:1`;
    });
    const pal = (st.color?.palette || []).slice(0, 14);
    body += `<div class="card v${i}"><div class=n>${esc(c.title)}<span>${esc(c.file)} · contrast ${checks.join(' · ')}</span></div>
<div class=mini>
<div class=hd style="background:${cv(roles.header)};${roles['header-text'] ? `color:${cv(roles['header-text'])}` : ''}"><b class=logo>${esc(copy.siteName)}</b>${copy.nav.map(n => `<a>${esc(n)}</a>`).join('')}<span class=btn>${esc(copy.navCta)}</span></div>
<div class=hero><h1>${esc(copy.heroTitle)}</h1><p>${esc(copy.heroText)}</p><span class=btn>${esc(copy.cta)}</span><a class=more href="#">${esc(copy.cta2)} →</a></div>
<div class=band style="background:${cv(roles.band)};color:${cv(roles['band-text'])}"><h2>${esc(copy.bandTitle)}</h2><p style="color:${cv(roles['band-accent'])}">${esc(copy.bandText)}</p></div>
<div class=tint style="background:${cv(roles.tint)}"><h3>${esc(copy.tintTitle)}</h3><span class=btn>${esc(copy.tintCta)}</span></div>
<div class=ft style="${roles.footer ? `background:${cv(roles.footer)};` : ''}${roles['footer-text'] ? `color:${cv(roles['footer-text'])}` : ''}"><b>${esc(copy.siteName)}</b><span>${esc(copy.footer)}</span></div>
</div>
<div class=strip>${pal.map(p => `<i style="background:${esc(p.color)};color:${(lum(p.color) ?? 1) < 0.4 ? '#fff' : '#000'}" title="${esc(p.slug)} ${esc(p.color)}">${esc(p.slug)}</i>`).join('')}</div></div>\n`;
  });
  const cols = Number(opts.cols || Math.min(3, cards.length));
  const colW = 470, cardH = 56 + 480 + 38;
  const rows = Math.ceil(cards.length / cols);
  const width = PAD * 2 + cols * colW + (cols - 1) * GAP;
  const height = PAD * 2 + HEAD + rows * cardH + (rows - 1) * GAP;
  css += `.grid{grid-template-columns:repeat(${cols},${colW}px)}`;
  const page = `<div class=sheet-title>${esc(copy.siteName)} · color options<small>${cards.length} options from theme.json and styles/ · roles: band ${esc(roles.band)}, tint ${esc(roles.tint)}, footer ${esc(roles.footer ?? 'inherits body')}</small></div><div class=grid>${body}</div>`;
  writeSheet('color-options', `${copy.siteName} color options`, css, page, width, height);
}

// ---------- fonts ----------
async function fontsourceFont(entry) {
  const [name, weightArg, axesArg] = entry.split(':').map(s => s.trim());
  const axes = (axesArg || '').split('+').filter(Boolean).map(a => a.split('=')).map(([k, v]) => `'${k.trim()}' ${Number(v)}`);
  if (/\.(woff2?|ttf|otf)$/i.test(name)) {
    const abs = path.resolve(name);
    if (!fs.existsSync(abs)) throw new Error(`font file not found: ${abs}`);
    fs.copyFileSync(abs, path.join(fontsOut, path.basename(abs)));
    const family = path.basename(abs).replace(/\.[^.]+$/, '');
    return { label: family, family, file: path.basename(abs), weight: weightArg || '700', axes, meta: 'local file · check the licence yourself' };
  }
  const id = name.toLowerCase().replace(/\s+/g, '-');
  const res = await fetch(`https://api.fontsource.org/v1/fonts/${id}`);
  if (!res.ok) throw new Error(`"${name}" is not on Fontsource (id ${id}); pass a local .woff2 path instead`);
  const m = await res.json();
  const weights = m.weights || [400];
  const want = Number(weightArg || (weights.includes(700) ? 700 : weights[weights.length - 1]));
  const weight = weights.reduce((a, b) => Math.abs(b - want) < Math.abs(a - want) ? b : a);
  const urls = [];
  if (m.variable) {
    if (axes.length) urls.push([`${id}-latin-full-normal.woff2`, `https://cdn.jsdelivr.net/fontsource/fonts/${id}:vf@latest/latin-full-normal.woff2`]);
    urls.push([`${id}-latin-wght-normal.woff2`, `https://cdn.jsdelivr.net/fontsource/fonts/${id}:vf@latest/latin-wght-normal.woff2`]);
  }
  urls.push([`${id}-latin-${weight}-normal.woff2`, `https://cdn.jsdelivr.net/fontsource/fonts/${id}@latest/latin-${weight}-normal.woff2`]);
  for (const [file, u] of urls) {
    const dest = path.join(fontsOut, file);
    if (!fs.existsSync(dest)) {
      const r = await fetch(u);
      if (!r.ok) continue;
      fs.writeFileSync(dest, Buffer.from(await r.arrayBuffer()));
    }
    const variable = !file.endsWith(`-${weight}-normal.woff2`);
    return { label: m.family, family: `${m.family} preview`, file, weight: String(weight), range: variable ? '100 900' : String(weight), axes: variable ? axes : [],
      meta: `${m.license || 'licence ?'} · ${m.category || ''}${variable ? ' · variable' : ''} · ${m.version || ''}`.replace(/ · $/, '') };
  }
  throw new Error(`could not download ${m.family} from Fontsource`);
}

async function fontsSheet() {
  if (!opts.fonts) { console.error('fonts mode needs --fonts "Name[:weight],Name,..."'); process.exit(2); }
  let data = theme;
  if (opts.variation) {
    const f = [opts.variation, path.join('styles', `${opts.variation}.json`)].map(p => path.resolve(themeDir, p)).find(p => fs.existsSync(p) && p.endsWith('.json'));
    if (!f) { console.error(`Variation not found: ${opts.variation}`); process.exit(1); }
    const v = readJSON(f);
    data = { settings: merge(theme.settings, v.settings), styles: merge(theme.styles, v.styles) };
  }
  const st = data.settings || {}, s = data.styles || {};
  const vars = cssVars(st);
  const roles = detectRoles(theme.settings);
  let css = baseCss + fontFaces(st, themeDir);

  const families = st.typography?.fontFamilies || [];
  const famOf = val => { const m = preset(val || '').match(/--font-family--([\w-]+)/); return m ? families.find(f => f.slug === m[1]) : null; };
  const headingFam = famOf(s.elements?.heading?.typography?.fontFamily);
  const bodyFam = famOf(s.typography?.fontFamily);
  const buttonFollowsHeading = s.elements?.button?.typography?.fontFamily && s.elements.button.typography.fontFamily === s.elements?.heading?.typography?.fontFamily;
  let bodyStack = bodyFam?.fontFamily || 'system-ui, sans-serif';
  if (opts.body) {
    const b = await fontsourceFont(opts.body.includes(':') ? opts.body : `${opts.body}:400`); // body text defaults to regular, not the 700 heading default
    css += `@font-face{font-family:'${b.family}';src:url(fonts/${b.file});font-weight:${b.range || b.weight}}\n`;
    bodyStack = `'${b.family}', system-ui, sans-serif`;
  }

  const cards = [];
  if (!flags.has('no-current') && headingFam) {
    cards.push({ label: `Current: ${headingFam.fontFamily.split(',')[0].replace(/['"]/g, '').trim()}`, stack: headingFam.fontFamily, weight: s.elements?.heading?.typography?.fontWeight || '700', axes: [], meta: 'theme.json heading font' + (s.css ? ' (theme css rules not applied)' : '') });
  }
  for (const entry of opts.fonts.split(',').map(e => e.trim()).filter(Boolean)) {
    try {
      const f = await fontsourceFont(entry);
      css += `@font-face{font-family:'${f.family}';src:url(fonts/${encodeURI(f.file)});font-weight:${f.range || f.weight};font-display:block}\n`;
      cards.push({ label: f.label, stack: `'${f.family}', serif`, weight: f.weight, axes: f.axes, meta: `${f.weight}${f.axes.length ? ` · ${f.axes.join(', ')}` : ''} · ${f.meta}` });
      console.log(`font ${f.label}: ${f.file}`);
    } catch (e) { console.error(`! ${e.message}`); }
  }
  if (!cards.length) { console.error('No fonts to show.'); process.exit(1); }

  const btn = s.elements?.button || {};
  css += `.f{${Object.entries(vars).map(([k, v]) => `${k}:${v}`).join(';')}}
.c{height:300px;overflow:hidden;border:1px solid #d8d8d8;border-radius:12px;padding:18px 22px;${styleToCss(s, { withFont: false })};font-family:${bodyStack}}
.c h1{font-size:40px;line-height:1.05;margin:0 0 10px;${styleToCss(s.elements?.heading, { withFont: false })}}
.c p{font-size:15px;line-height:1.5;margin:0 0 12px}
.c .btn{display:inline-block;padding:9px 16px;font-size:14px;${styleToCss(btn, { withFont: false })}}
.c .d{margin-top:16px;padding:10px 14px;border-radius:8px;background:${cv(roles.band)};color:${cv(roles['band-text'])}}
.c .d h2{font-size:24px;margin:0;color:${cv(roles['band-accent'])}}
`;
  let body = '';
  cards.forEach((c, i) => {
    const face = `font-family:${c.stack};font-weight:${c.weight}${c.axes.length ? `;font-variation-settings:${c.axes.join(',')}` : ''}`;
    body += `<div class=f><div class=n>${esc(c.label)}<span>${esc(c.meta)}</span></div><div class=c>
<h1 style="${esc(face)}">${esc(copy.heroTitle)}</h1><p>${esc(copy.heroText)}</p>
<span class=btn style="${buttonFollowsHeading ? esc(face) : `font-family:${esc(bodyStack)}`}">${esc(copy.cta)}</span>
<div class=d><h2 style="${esc(face)}">${esc(copy.bandTitle)}</h2></div></div></div>\n`;
  });
  const cols = Number(opts.cols || 2);
  const colW = 620, cardH = 56 + 300;
  const rows = Math.ceil(cards.length / cols);
  const width = PAD * 2 + cols * colW + (cols - 1) * GAP;
  const height = PAD * 2 + HEAD + rows * cardH + (rows - 1) * GAP;
  css += `.grid{grid-template-columns:repeat(${cols},${colW}px)}`;
  const page = `<div class=sheet-title>${esc(copy.siteName)} · heading fonts<small>body: ${esc(bodyStack.split(',')[0].replace(/['"]/g, ''))}${buttonFollowsHeading ? ' · buttons use the heading font' : ''}</small></div><div class=grid>${body}</div>`;
  writeSheet('heading-fonts', `${copy.siteName} heading fonts`, css, page, width, height);
}

if (mode === 'colors') colorsSheet(); else await fontsSheet();
