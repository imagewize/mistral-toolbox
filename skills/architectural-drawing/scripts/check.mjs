// check.mjs: validate a finished drawing made with arch.mjs.
//   node scripts/check.mjs drawing.svg
// Checks that the file is well-formed enough for browsers (no repeated attribute on an element,
// balanced tags), has a title and viewBox, uses only the kit's line weights, and only the colours
// of the palette recorded on the root element. Exit code 1 on failure.
import fs from 'node:fs';

const file = process.argv[2];
if (!file) { console.log('usage: node scripts/check.mjs drawing.svg'); process.exit(2); }
const svg = fs.readFileSync(file, 'utf8');
const fails = [];
const warns = [];

// Repeated attributes break XML parsing: the browser shows an error page instead of the drawing.
for (const tag of svg.match(/<[a-zA-Z][^>]*>/g) || []) {
  const names = [...tag.matchAll(/\s([a-zA-Z:-]+)=/g)].map((m) => m[1]);
  const dup = names.find((n, i) => names.indexOf(n) !== i);
  if (dup) fails.push(`attribute "${dup}" repeated in ${tag.slice(0, 60)}...`);
}
// Balanced tags.
const opens = (svg.match(/<(?!\/|\?|!)[a-zA-Z][^>]*[^/]>/g) || []).length;
const closes = (svg.match(/<\/[a-zA-Z][^>]*>/g) || []).length;
if (opens !== closes) fails.push(`unbalanced tags: ${opens} open, ${closes} close`);

if (!/<title[\s>]/.test(svg)) fails.push('no <title>: the drawing has no accessible name');
if (!/viewBox="/.test(svg)) fails.push('no viewBox');
if (!/data-kit="arch.mjs"/.test(svg)) warns.push('not made with arch.mjs; palette and weight checks may not apply');

const weights = new Set(['2.2', '1.4', '0.9', '0.5', '0.35']);
// People scale their limb strokes with the drawing (data-part="figure"); every other stroke
// must use one of the kit weights.
for (const tag of svg.match(/<[a-zA-Z][^>]*>/g) || []) {
  if (tag.includes('data-part="figure"')) continue;
  const m = tag.match(/stroke-width="([\d.]+)"/);
  if (m && !weights.has(m[1])) { fails.push(`stroke-width ${m[1]} is not one of the kit weights (2.2, 1.4, 0.9, 0.5, 0.35)`); break; }
}

const pal = svg.match(/data-palette='([^']+)'/);
if (pal) {
  const allowed = new Set(Object.values(JSON.parse(pal[1])).map((c) => c.toLowerCase()));
  allowed.add('none');
  const used = new Set([...svg.matchAll(/(?:fill|stroke)="([^"]+)"/g)].map((m) => m[1].toLowerCase()));
  for (const c of used) if (!allowed.has(c)) fails.push(`colour ${c} is not in the drawing's palette`);
}

const scale = svg.match(/data-scale="([\d.]+)"/);
console.log(`${file}: ${(Buffer.byteLength(svg) / 1024).toFixed(1)} KB${scale ? `, scale ${scale[1]} units/m` : ''}`);
for (const w of warns) console.log(`WARN  ${w}`);
for (const f of fails) console.log(`FAIL  ${f}`);
console.log(fails.length ? 'FAIL' : 'PASS');
process.exitCode = fails.length ? 1 : 0;
