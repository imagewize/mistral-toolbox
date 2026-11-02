// arch.mjs: a small kit for architectural elevations and sections as SVG.
//
// Work in metres. x runs along the facade (left to right), y is the height above ground
// (0 = ground level, negative = below ground or water). The kit converts metres to SVG units with
// one scale per drawing, draws with a fixed line-weight hierarchy, and records every element so
// report() can check proportions, overlaps and bounds. Nothing is placed by hand-written pixel
// coordinates.
//
//   import * as A from '/abs/path/architectural-drawing/scripts/arch.mjs';
//   const d = A.drawing({ width: 480, height: 300, extent: { x0: -2, x1: 40, top: 18, bottom: -3 } });
//   d.ground(-2, 40);
//   d.mass(0, 30, 12);
//   d.gableRoof(0, 30, 12, 17);
//   d.windowRow(1, 29, 7.5, 9.5, 10);
//   d.figure(33);
//   A.write('out.svg', d.svg({ title: 'Warehouse, quay elevation' }));
//   A.printReport(d);
//
// Plain ES module, no dependencies (Node 18+).

import fs from 'node:fs';

// Line-weight hierarchy in SVG units at 480 wide. Heavier means nearer or cut.
export const W = {
  CUT: 2.2,      // section cuts: walls and slabs the section plane passes through
  PROFILE: 1.4,  // outer silhouette of a building, the ground line
  EDGE: 0.9,     // elevation edges: openings, roof lines, quay edge
  DETAIL: 0.5,   // mullions, coursing, hatching, floor lines, trees
  FAINT: 0.35,   // glass reflections, water, things far behind
};

export const DEFAULT_PALETTE = {
  ink: '#111111',     // all lines and poche
  paper: '#ffffff',   // fills that must hide what is behind them
  tint: '#f3f3f3',    // one optional tone for a back plane or the sky behind glass
  mid: '#8a8a8a',     // annotations and things far behind
  accent: '#ff4f00',  // at most two elements per drawing
};

const ALLOWED_WEIGHTS = new Set(Object.values(W));

// Plausible sizes in metres; report() warns outside these ranges.
const RANGES = {
  door: { h: [1.9, 4.8], w: [0.8, 4.5] },
  window: { h: [0.5, 5.0], w: [0.4, 4.0] },   // up to 5 m for studio and shop glazing
  figure: { h: [1.5, 1.95] },
  storey: [2.4, 6.0],
  tree: { h: [3, 30] },
};

export function drawing(opts = {}) {
  const width = opts.width ?? 480;
  const height = opts.height ?? 300;
  const margin = opts.margin ?? 14;
  // labels: false leaves out dimension and level text, for drawings shown small (cards).
  const labels = opts.labels ?? true;
  // displayWidth: the width in CSS pixels the drawing will be shown at. Used to warn when text
  // or people would be too small to read.
  const displayWidth = opts.displayWidth ?? width;
  const palette = { ...DEFAULT_PALETTE, ...(opts.palette || {}) };
  const prefix = opts.prefix ?? 'ad-';
  const ext = opts.extent;
  if (!ext || ext.x1 <= ext.x0 || !(ext.top > 0)) throw new Error('drawing(): pass extent { x0, x1, top, bottom } in metres');
  const bottom = ext.bottom ?? -2;

  // One scale for the whole drawing. Pass `scale` (SVG units per metre) to share it across a set.
  const fit = Math.min((width - 2 * margin) / (ext.x1 - ext.x0), (height - 2 * margin) / (ext.top - bottom));
  const s = opts.scale ?? fit;
  const ox = margin + ((width - 2 * margin) - (ext.x1 - ext.x0) * s) / 2 - ext.x0 * s;
  const gy = margin + ((height - 2 * margin) - (ext.top - bottom) * s) / 2 + ext.top * s;

  const X = (x) => +(ox + x * s).toFixed(2);
  const Y = (y) => +(gy - y * s).toFixed(2);
  const L = (m) => +(m * s).toFixed(2);

  const layers = { back: [], fill: [], ground: [], lines: [], detail: [], front: [], notes: [] };
  const items = [];
  const warnings = [];
  const errors = [];
  let accents = 0;

  const rec = (type, x0, y0, x1, y1, extra = {}) => {
    const it = { type, x0: Math.min(x0, x1), x1: Math.max(x0, x1), y0: Math.min(y0, y1), y1: Math.max(y0, y1), ...extra };
    items.push(it);
    return it;
  };
  const stroke = (w, colour = palette.ink, extra = '') =>
    `fill="none" stroke="${colour}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"${extra}`;
  const path = (layer, d, w, colour, extra) => layers[layer].push(`<path d="${d}" ${stroke(w, colour, extra)}/>`);
  const fillPath = (layer, d, colour) => layers[layer].push(`<path d="${d}" fill="${colour}" stroke="none"/>`);
  const rectD = (x0, y0, x1, y1) => `M${X(x0)} ${Y(y0)}H${X(x1)}V${Y(y1)}H${X(x0)}Z`;
  const line = (x0, y0, x1, y1) => `M${X(x0)} ${Y(y0)}L${X(x1)} ${Y(y1)}`;
  const useAccent = (on, what) => {
    if (!on) return palette.ink;
    accents++;
    if (accents > 2) warnings.push(`accent used ${accents} times (${what}); keep it to two elements per drawing`);
    return palette.accent;
  };
  const inRange = (v, [a, b]) => v >= a && v <= b;

  const d = {
    scale: s, width, height, palette, items, warnings, errors,
    X, Y, L,

    // Ground line with an earth hatch below. Stops where a quay or water() starts.
    ground(x0, x1, { depth = 1.0, hatch = true } = {}) {
      path('ground', line(x0, 0, x1, 0), W.PROFILE);
      if (hatch) {
        let h = '';
        const step = 0.6;
        for (let x = x0; x < x1 - 0.01; x += step) {
          const xe = Math.min(x + depth * 0.6, x1);
          h += line(x, 0, xe, -Math.min(depth, (xe - x) / 0.6));
        }
        path('ground', h, W.DETAIL);
      }
      rec('ground', x0, -depth, x1, 0);
    },

    // A quay edge at x with water from x to x1. The quay wall is cut (poche) down to the bottom.
    quay(x, x1, { level = -1.2, wall = 0.6, bottom = -2.6 } = {}) {
      fillPath('lines', rectD(x - wall, bottom, x, 0), palette.ink);
      path('ground', line(x, level, x1, level), W.EDGE);
      let wv = '';
      for (let i = 0, xx = x + 0.6; xx < x1 - 0.8; xx += 1.7, i++) {
        const yy = level - 0.35 - (i % 2) * 0.3;
        wv += line(xx, yy, xx + 0.8, yy);
      }
      path('ground', wv, W.FAINT);
      rec('quay', x - wall, bottom, x1, 0, { level, water0: x, water1: x1 });
    },

    // A building block in elevation: paper fill (hides what is behind) and a profile outline.
    mass(x0, x1, h, { fill = 'paper', base = 0, outline = W.PROFILE, name = 'mass' } = {}) {
      fillPath('fill', rectD(x0, base, x1, base + h), fill === 'tint' ? palette.tint : palette.paper);
      path('lines', rectD(x0, base, x1, base + h), outline);
      return rec('mass', x0, base, x1, base + h, { name });
    },

    // Brick coursing: faint horizontal lines in the mid tone. Gives a facade texture without noise.
    coursing(x0, x1, y0, y1, { course = 0.6 } = {}) {
      let c = '';
      for (let y = y0 + course; y < y1 - 0.05; y += course) c += line(x0, y, x1, y);
      path('detail', c, W.FAINT, palette.mid);
    },

    // A gable seen end-on. In a section pass cut: t (metres) to draw the roof as a cut band of that
    // thickness. Returns the roof geometry, for roofWindow().
    gableRoof(x0, x1, eave, ridge, { overhang = 0.3, fill = 'paper', cut = 0 } = {}) {
      const xm = (x0 + x1) / 2;
      const d1 = `M${X(x0 - overhang)} ${Y(eave)}L${X(xm)} ${Y(ridge)}L${X(x1 + overhang)} ${Y(eave)}Z`;
      fillPath('fill', d1, fill === 'tint' ? palette.tint : palette.paper);
      if (cut > 0) {
        // the band's vertical depth keeps its true thickness on the slope
        const slope = Math.atan2(ridge - eave, xm - (x0 - overhang));
        const dv = cut / Math.cos(slope);
        const band = `M${X(x0 - overhang)} ${Y(eave)}L${X(xm)} ${Y(ridge)}L${X(x1 + overhang)} ${Y(eave)}L${X(x1 + overhang)} ${Y(eave - dv)}L${X(xm)} ${Y(ridge - dv)}L${X(x0 - overhang)} ${Y(eave - dv)}Z`;
        fillPath('lines', band, palette.ink);
      } else {
        path('lines', `M${X(x0 - overhang)} ${Y(eave)}L${X(xm)} ${Y(ridge)}L${X(x1 + overhang)} ${Y(eave)}`, W.PROFILE);
      }
      rec('roof', x0 - overhang, eave - (cut > 0 ? cut * 2 : 0), x1 + overhang, ridge);
      return { x0: x0 - overhang, x1: x1 + overhang, xm, eave, ridge, cut };
    },

    // A skylight on one slope of a gableRoof() (pass the object it returns): a frame raised off
    // the slope with a glass line. side 'left' or 'right', at 0..1 from eave to ridge, len in metres.
    roofWindow(roof, { side = 'left', at = 0.5, len = 1.4, raise = 0.22, accent = false } = {}) {
      const ex = side === 'left' ? roof.x0 : roof.x1;
      const vx = roof.xm - ex, vy = roof.ridge - roof.eave;
      const vl = Math.hypot(vx, vy);
      const ux = vx / vl, uy = vy / vl;
      const nx = side === 'left' ? -uy : uy, ny = side === 'left' ? ux : -ux;   // outward normal
      const ax = ex + vx * at, ay = roof.eave + vy * at;
      const bx = ax + ux * len, by = ay + uy * len;
      const col = useAccent(accent, 'roof window');
      const q = `M${X(ax)} ${Y(ay)}L${X(ax + nx * raise)} ${Y(ay + ny * raise)}L${X(bx + nx * raise)} ${Y(by + ny * raise)}L${X(bx)} ${Y(by)}`;
      fillPath('detail', q + 'Z', palette.paper);
      path('detail', q, W.EDGE);
      path('detail', line(ax + nx * raise * 0.55 + ux * 0.12, ay + ny * raise * 0.55 + uy * 0.12, bx + nx * raise * 0.55 - ux * 0.12, by + ny * raise * 0.55 - uy * 0.12), W.DETAIL, col);
      rec('roofwindow', Math.min(ax, bx), Math.min(ay, by), Math.max(ax, bx), Math.max(by, ay) + raise);
    },

    // A Dutch stepped gable (trapgevel) on a block from x0 to x1, from eave to ridge.
    stepGable(x0, x1, eave, ridge, { steps = 4, cap = 0.25 } = {}) {
      const xm = (x0 + x1) / 2;
      const top = (x1 - x0) * 0.14;
      const dy = (ridge - eave) / steps;
      const dx = ((x1 - x0) / 2 - top / 2) / steps;
      // Left side climbs (up, then in), the top runs across, the right side mirrors (out, then down).
      let p = `M${X(x0)} ${Y(eave)}`;
      for (let i = 0; i < steps; i++) p += `V${Y(eave + dy * (i + 1))}H${X(x0 + dx * (i + 1))}`;
      p += `H${X(xm + top / 2)}`;
      for (let i = steps - 1; i >= 0; i--) p += `H${X(x1 - dx * i)}V${Y(eave + dy * i)}`;
      fillPath('fill', p + 'Z', palette.paper);
      path('lines', p, W.PROFILE);
      // capping stones
      let c = '';
      for (let i = 0; i < steps; i++) {
        const y = eave + dy * (i + 1);
        c += line(x0 + dx * i - 0.05, y, x0 + dx * (i + 1) + 0.05, y) + line(x1 - dx * (i + 1) - 0.05, y, x1 - dx * i + 0.05, y);
      }
      path('detail', c, W.EDGE);
      rec('roof', x0, eave, x1, ridge + cap);
    },

    // Sawtooth (shed) roof of `count` teeth; the glazed vertical faces get glazing bars.
    sawtoothRoof(x0, x1, eave, toothH, count, { glazed = true } = {}) {
      const tw = (x1 - x0) / count;
      let p = `M${X(x0)} ${Y(eave)}`;
      let g = '';
      for (let i = 0; i < count; i++) {
        const a = x0 + i * tw;
        p += `L${X(a + tw)} ${Y(eave + toothH)}V${Y(eave)}`;
        if (glazed) for (let k = 1; k < 4; k++) g += line(a + tw, eave + (toothH * k) / 4, a + tw - 0.18, eave + (toothH * k) / 4);
      }
      fillPath('fill', p + 'Z', palette.paper);
      path('lines', p, W.PROFILE);
      if (g) path('detail', g, W.DETAIL);
      rec('roof', x0, eave, x1, eave + toothH);
    },

    flatRoof(x0, x1, h, { parapet = 0.6, coping = 0.15 } = {}) {
      fillPath('fill', rectD(x0, h, x1, h + parapet), palette.paper);
      path('lines', rectD(x0, h, x1, h + parapet), W.PROFILE);
      path('detail', line(x0 - coping, h + parapet, x1 + coping, h + parapet), W.EDGE);
      rec('roof', x0 - coping, h, x1 + coping, h + parapet);
    },

    // One window: frame, optional mullion and transom, two faint glass reflection strokes.
    window(cx, sill, w, h, { mullion = w > 1.2, transom = false, accent = false, sillLine = true } = {}) {
      if (!inRange(w, RANGES.window.w) || !inRange(h, RANGES.window.h)) warnings.push(`window at x=${f(cx)}: ${f(w)} x ${f(h)} m is outside plausible window sizes`);
      const x0 = cx - w / 2, x1 = cx + w / 2;
      const col = useAccent(accent, 'window');
      fillPath('detail', rectD(x0, sill, x1, sill + h), palette.paper);
      path('detail', rectD(x0, sill, x1, sill + h), W.EDGE, col);
      let det = '';
      if (mullion) det += line(cx, sill, cx, sill + h);
      if (transom) det += line(x0, sill + h * 0.72, x1, sill + h * 0.72);
      if (det) path('detail', det, W.DETAIL, col);
      path('detail', line(x0 + w * 0.15, sill + h * 0.35, x0 + w * 0.32, sill + h * 0.62) + line(x0 + w * 0.22, sill + h * 0.3, x0 + w * 0.36, sill + h * 0.52), W.FAINT, col);
      if (sillLine) path('detail', line(x0 - 0.08, sill, x1 + 0.08, sill), W.EDGE);
      return rec('opening', x0, sill, x1, sill + h, { kind: 'window' });
    },

    // A row of `count` equal windows spread evenly between x0 and x1.
    windowRow(x0, x1, sill, head, count, opts = {}) {
      const bay = (x1 - x0) / count;
      const w = opts.width ?? Math.min(bay * 0.55, RANGES.window.w[1]);
      for (let i = 0; i < count; i++) d.window(x0 + bay * (i + 0.5), sill, w, head - sill, { ...opts, accent: opts.accentIndex === i });
    },

    // Door types: single, double, loading (a warehouse loading door with a cross brace).
    // base lifts a door to an upper floor, as for the stacked loading doors of a warehouse.
    door(cx, w, h, { type = 'single', accent = false, base = 0 } = {}) {
      if (!inRange(w, RANGES.door.w) || !inRange(h, RANGES.door.h)) warnings.push(`door at x=${f(cx)}: ${f(w)} x ${f(h)} m is outside plausible door sizes`);
      const x0 = cx - w / 2, x1 = cx + w / 2;
      const col = useAccent(accent, 'door');
      const b = base, t = base + h;
      fillPath('detail', rectD(x0, b, x1, t), accent ? palette.accent : palette.paper);
      path('detail', rectD(x0, b, x1, t), W.EDGE);
      let det = '';
      if (type === 'double' || type === 'loading') det += line(cx, b, cx, t);
      if (type === 'loading') det += line(x0, b, cx, t) + line(cx, b, x0, t) + line(cx, b, x1, t) + line(x1, b, cx, t);
      if (det) path('detail', det, W.DETAIL, accent ? palette.ink : col);
      return rec('opening', x0, b, x1, t, { kind: 'door' });
    },

    // A hoist beam above a loading door (warehouses), with a hook.
    hoist(cx, y, { reach = 1.2 } = {}) {
      path('detail', line(cx, y, cx + reach, y) + line(cx + reach * 0.9, y, cx + reach * 0.9, y - 0.8), W.EDGE);
      path('detail', `M${X(cx + reach * 0.9)} ${Y(y - 0.8)}a${L(0.12)} ${L(0.12)} 0 1 1 ${-L(0.2)} ${L(0.05)}`, W.DETAIL);
    },

    // A chimney standing on a roof or mass at height base: a stack with a cap.
    chimney(cx, base, { w = 0.7, h = 1.6 } = {}) {
      const x0 = cx - w / 2, x1 = cx + w / 2;
      fillPath('fill', rectD(x0, base, x1, base + h), palette.paper);
      path('lines', rectD(x0, base, x1, base + h), W.EDGE);
      path('lines', rectD(x0 - 0.1, base + h, x1 + 0.1, base + h + 0.18), W.EDGE);
      rec('chimney', x0, base, x1, base + h + 0.18);
    },

    // Interior floor levels shown on an elevation (dashed) or in a section (pass dashed: false).
    floorLines(x0, x1, levels, { dashed = true } = {}) {
      const sorted = [0, ...levels].sort((a, b) => a - b);
      for (let i = 1; i < sorted.length; i++) {
        const sh = sorted[i] - sorted[i - 1];
        if (!inRange(sh, RANGES.storey)) warnings.push(`storey height ${sh.toFixed(2)} m between levels ${sorted[i - 1]} and ${sorted[i]} is implausible`);
      }
      path('detail', levels.map((y) => line(x0, y, x1, y)).join(''), W.DETAIL, palette.ink, dashed ? ` stroke-dasharray="${L(0.6)} ${L(0.4)}"` : '');
    },

    // Section: a wall or slab cut by the section plane, filled solid (poche).
    cut(x0, y0, x1, y1) {
      fillPath('lines', rectD(x0, y0, x1, y1), palette.ink);
      rec('cut', x0, y0, x1, y1);
    },
    slab(x0, x1, level, { t = 0.3 } = {}) { d.cut(x0, level - t, x1, level); },

    // A window or door in a cut wall (x0..x1 is the wall thickness), seen in section: the opening
    // clears the poche, with frame lines at sill and head and glass in the middle. Draw it after
    // the cut(). For a door, pass sill 0 and glass: false.
    cutOpening(x0, x1, sill, head, { glass = true, accent = false } = {}) {
      const col = useAccent(accent, 'section opening');
      fillPath('detail', rectD(x0, sill, x1, head), palette.paper);
      path('detail', line(x0, sill, x1, sill) + line(x0, head, x1, head), W.EDGE);
      if (glass) path('detail', line((x0 + x1) / 2, sill, (x0 + x1) / 2, head), W.DETAIL, col);
      return rec('opening', x0, sill, x1, head, { kind: 'section opening' });
    },

    // A straight stair in section from (x0, y0) to (x1, y1).
    stair(x0, y0, x1, y1, { steps } = {}) {
      const n = steps ?? Math.max(3, Math.round((y1 - y0) / 0.18));
      const r = (y1 - y0) / n, g = (x1 - x0) / n;
      let p = `M${X(x0)} ${Y(y0)}`;
      for (let i = 0; i < n; i++) p += `V${Y(y0 + r * (i + 1))}H${X(x0 + g * (i + 1))}`;
      path('detail', p, W.EDGE);
      path('detail', line(x0, y0 - 0.2, x1, y1 - 0.2), W.DETAIL);
    },

    // A person, 1.75 m by default: the scale reference every drawing needs.
    // pose: 'stand', 'walk' (legs apart, facing +x) or 'stand-left' / 'walk-left' (facing -x).
    figure(x, { h = 1.75, accent = false, layer = 'front', pose = 'stand', base = 0 } = {}) {
      if (!inRange(h, RANGES.figure.h)) warnings.push(`figure at x=${f(x)}: height ${f(h)} m is implausible`);
      const k = h / 1.75;
      // base lifts the person onto a floor, e.g. a slab in a section
      const Yb = (y) => Y(base + y);
      const lineB = (ax, ay, bx, by) => line(ax, base + ay, bx, base + by);
      const col = useAccent(accent, 'figure');
      const dir = pose.endsWith('-left') ? -1 : 1;
      const walk = pose.startsWith('walk');
      const head = 0.115 * k;
      const sh = h - 2.2 * head;          // shoulders
      const hip = 0.92 * k;
      layers[layer].push(`<circle cx="${X(x + 0.02 * dir * k)}" cy="${Yb(h - head)}" r="${L(head)}" fill="${col}" stroke="none"/>`);
      // torso: shoulders to hips, slightly narrower at the hips
      const torso = `M${X(x - 0.2 * k)} ${Yb(sh)}L${X(x + 0.2 * k)} ${Yb(sh)}L${X(x + 0.15 * k)} ${Yb(hip)}L${X(x - 0.15 * k)} ${Yb(hip)}Z`;
      layers[layer].push(`<path d="${torso}" fill="${col}" stroke="none"/>`);
      // legs and arms as strokes, so a figure stays readable at small sizes
      const lw = Math.max(L(0.13 * k), 0.9).toFixed(2);
      const aw = Math.max(L(0.09 * k), 0.7).toFixed(2);
      const step = walk ? 0.22 * k : 0.07 * k;
      const legs = lineB(x - 0.07 * k, hip, x - 0.07 * k - step * dir, 0) + lineB(x + 0.07 * k, hip, x + 0.07 * k + step * dir, 0);
      const swing = walk ? 0.16 * k : 0.04 * k;
      const arms = lineB(x - 0.19 * k, sh - 0.04 * k, x - 0.2 * k + swing * dir, hip - 0.05 * k) + lineB(x + 0.19 * k, sh - 0.04 * k, x + 0.2 * k - swing * dir, hip - 0.05 * k);
      layers[layer].push(`<path data-part="figure" d="${legs}" fill="none" stroke="${col}" stroke-width="${lw}" stroke-linecap="round"/>`);
      layers[layer].push(`<path data-part="figure" d="${arms}" fill="none" stroke="${col}" stroke-width="${aw}" stroke-linecap="round"/>`);
      rec('figure', x - 0.25 * k, base, x + 0.25 * k, base + h, { base });
    },

    // A tree: a solid trunk into a scalloped crown, with faint branches inside the crown.
    // type 'round' or 'poplar'. layer 'back' draws it faint and unfilled, behind buildings.
    tree(x, { h = 9, crown, type = 'round', layer = 'front' } = {}) {
      if (!inRange(h, RANGES.tree.h)) warnings.push(`tree at x=${f(x)}: height ${f(h)} m is implausible`);
      const back = layer === 'back';
      const cw = crown ?? (type === 'poplar' ? h * 0.3 : h * 0.62);
      const crownBase = type === 'poplar' ? h * 0.16 : h * 0.34;
      const rx = cw / 2, ry = (h - crownBase) / 2, cy = crownBase + ry;
      // Scalloped outline: small arcs between points on an ellipse read as foliage, not as a disc.
      const n = Math.max(9, Math.round((Math.PI * (rx + ry)) / 1.5));
      const pts = [];
      for (let i = 0; i < n; i++) {
        const t = (i / n) * Math.PI * 2 + 0.3;
        pts.push([x + rx * Math.cos(t), cy + ry * Math.sin(t)]);
      }
      let c = `M${X(pts[0][0])} ${Y(pts[0][1])}`;
      for (let i = 1; i <= n; i++) {
        const [ax, ay] = pts[(i - 1) % n], [bx, by] = pts[i % n];
        const r = (Math.hypot(L(bx - ax), L(by - ay)) * 0.62).toFixed(2);
        c += `A${r} ${r} 0 0 0 ${X(bx)} ${Y(by)}`;
      }
      layers[layer].push(`<path d="${c}Z" fill="${back ? 'none' : palette.paper}" stroke="${palette.ink}" stroke-width="${back ? W.FAINT : W.DETAIL}" stroke-linejoin="round"/>`);
      // Trunk: a tapered solid from the ground to just inside the crown.
      const tw = Math.min(0.45, h * 0.035);
      const tTop = crownBase + ry * 0.35;
      layers[layer].push(`<path d="M${X(x - tw / 2)} ${Y(0)}L${X(x - tw / 4)} ${Y(tTop)}L${X(x + tw / 4)} ${Y(tTop)}L${X(x + tw / 2)} ${Y(0)}Z" fill="${back ? palette.mid : palette.ink}" stroke="none"/>`);
      // Branches fork from the trunk top into the crown.
      const br = line(x, tTop, x - rx * 0.45, cy + ry * 0.25) + line(x, tTop, x + rx * 0.5, cy + ry * 0.15) + line(x, tTop, x + rx * 0.05, cy + ry * 0.55);
      layers[layer].push(`<path d="${br}" ${stroke(W.FAINT, back ? palette.mid : palette.ink)}/>`);
      rec('tree', x - rx, 0, x + rx, h, { front: !back, cx: x, cy0: crownBase });
    },

    // A moored barge on water at `level`: hull, wheelhouse at the stern.
    barge(x0, x1, level, { freeboard = 1.0, accent = false } = {}) {
      const draft = 0.6;
      const hull = `M${X(x0)} ${Y(level + freeboard)}H${X(x1)}L${X(x1 - 0.8)} ${Y(level - draft)}H${X(x0 + 1.2)}Z`;
      fillPath('lines', hull, palette.paper);
      path('lines', hull, W.EDGE);
      path('detail', line(x0 + 0.3, level + freeboard - 0.3, x1 - 0.3, level + freeboard - 0.3), W.DETAIL);
      const wh0 = x1 - 3.2, wh1 = x1 - 0.9;
      const col = useAccent(accent, 'barge');
      fillPath('lines', rectD(wh0, level + freeboard, wh1, level + freeboard + 2.0), accent ? palette.accent : palette.paper);
      path('lines', rectD(wh0, level + freeboard, wh1, level + freeboard + 2.0), W.EDGE);
      path('detail', rectD(wh0 + 0.3, level + freeboard + 1.0, wh1 - 0.3, level + freeboard + 1.7), W.DETAIL, accent ? palette.ink : col);
      rec('barge', x0, level - draft, x1, level + freeboard + 2.0);
    },

    // Dimension line with ticks and a label, at height y above the building. `from` is the height
    // the extension lines drop to (usually the eave or ridge), with a small gap above it.
    dimension(x0, x1, y, label, { from } = {}) {
      if (!labels) return;
      const t = 0.35;
      let d1 = line(x0, y, x1, y) + line(x0 - t, y - t, x0 + t, y + t) + line(x1 - t, y - t, x1 + t, y + t);
      if (from !== undefined && from < y - 0.6) d1 += line(x0, y + 0.4, x0, from + 0.4) + line(x1, y + 0.4, x1, from + 0.4);
      path('notes', d1, W.DETAIL, palette.mid);
      layers.notes.push(`<text x="${X((x0 + x1) / 2)}" y="${Y(y) - 3}" font-family="'Helvetica Neue', Helvetica, Arial, sans-serif" font-size="7" fill="${palette.mid}" text-anchor="middle">${esc(label ?? `${(x1 - x0).toFixed(1).replace('.', ',')} m`)}</text>`);
    },

    // Level marker: a small triangle and a label, e.g. '+12,0'.
    levelMark(x, y, label) {
      if (!labels) return;
      const t = 0.45;
      path('notes', `M${X(x)} ${Y(y)}l${L(-t)} ${-L(t)}h${L(2 * t)}Z` + line(x - t * 2, y, x + t * 4, y), W.DETAIL, palette.mid);
      layers.notes.push(`<text x="${X(x + t * 1.5)}" y="${Y(y) - 4}" font-family="'Helvetica Neue', Helvetica, Arial, sans-serif" font-size="7" fill="${palette.mid}">${esc(label)}</text>`);
    },

    // background: a paper-coloured rect behind everything, so the drawing stays readable on dark
    // previews and dark pages. Pass false only when the drawing sits on a paper-coloured page
    // and must let it show through.
    // animate: true (or { speed }) makes the drawing draw itself when it loads, in layer order:
    // trees behind, ground, building lines, fills, details, people, annotations. Lines are drawn
    // stroke by stroke; filled shapes, dashed lines, people and text fade in. The animation lives
    // inside the SVG, so it also runs when the file is shown with <img>, and it is switched off
    // for visitors who ask for reduced motion. speed scales all timings (2 = twice as fast).
    svg({ title, desc = '', background = true, animate = false } = {}) {
      if (!title) throw new Error('svg(): pass a title; it becomes the accessible name');
      check();
      const anim = animate ? { speed: 1, ...(typeof animate === 'object' ? animate : {}) } : null;
      const bg = background ? `<rect width="${width}" height="${height}" fill="${palette.paper}"/>\n` : '';
      const order = ['back', 'ground', 'fill', 'lines', 'detail', 'front', 'notes'];
      // seconds after load at which each layer starts, and the stagger between its elements
      const START = { back: 0, ground: 0.15, lines: 0.35, fill: 0.9, detail: 1.1, front: 1.6, notes: 2.0 };
      const STEP = 0.025, MAXSTEP = 24;
      const body = bg + order.map((k) => {
        if (!layers[k].length) return '';
        const els = anim ? layers[k].map((el, i) => animateEl(el, (START[k] + Math.min(i, MAXSTEP) * STEP) / anim.speed)) : layers[k];
        return `<g data-layer="${k}">${els.join('')}</g>`;
      }).join('\n');
      const style = anim ? `\n<style>
/* The hidden state lives only in the keyframes (fill-mode both): where animations do not run, the drawing shows complete. */
.${prefix}draw{stroke-dasharray:1 1.02;animation:${prefix}draw ${(0.9 / anim.speed).toFixed(2)}s ease-out both}
.${prefix}fade{animation:${prefix}fade ${(0.6 / anim.speed).toFixed(2)}s ease-out both}
@keyframes ${prefix}draw{from{stroke-dashoffset:1.01}to{stroke-dashoffset:0}}
@keyframes ${prefix}fade{from{opacity:0}to{opacity:1}}
@media (prefers-reduced-motion: reduce){.${prefix}draw,.${prefix}fade{animation:none;stroke-dasharray:none;stroke-dashoffset:0;opacity:1}}
</style>` : '';
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" role="img" aria-labelledby="${prefix}title${desc ? ` ${prefix}desc` : ''}" data-kit="arch.mjs" data-scale="${s.toFixed(3)}" data-palette='${JSON.stringify(palette)}'${anim ? ' data-animate="true"' : ''}>
<title id="${prefix}title">${esc(title)}</title>${desc ? `\n<desc id="${prefix}desc">${esc(desc)}</desc>` : ''}${style}
${body}
</svg>
`;
    },

    report() {
      check();
      return { scale_units_per_m: +s.toFixed(3), size: [width, height], items: items.length, accents, warnings, errors };
    },
  };

  // Give one element its animation: a stroke-only shape without a dash pattern is drawn (it gets
  // pathLength="1" so the dash maths works for any length); everything else fades in.
  function animateEl(el, delay) {
    const m = el.match(/^<([a-z]+)\s/);
    if (!m) return el;
    const fill = (el.match(/\sfill="([^"]*)"/) || [])[1];
    const stroke = (el.match(/\sstroke="([^"]*)"/) || [])[1];
    const dashed = /stroke-dasharray=/.test(el);
    const drawable = ['path', 'line', 'polyline', 'polygon', 'circle', 'ellipse', 'rect'].includes(m[1]);
    const draw = drawable && fill === 'none' && stroke && stroke !== 'none' && !dashed && !/data-part="figure"/.test(el);
    const attrs = draw
      ? ` class="${prefix}draw" pathLength="1" style="animation-delay:${delay.toFixed(2)}s"`
      : ` class="${prefix}fade" style="animation-delay:${delay.toFixed(2)}s"`;
    return el.replace(/^<([a-z]+)/, `<$1${attrs}`);
  }

  let checked = false;
  function check() {
    if (checked) return;
    checked = true;
    // Everything must fit inside the drawing with the margin.
    for (const it of items) {
      if (X(it.x0) < 0 || X(it.x1) > width || Y(it.y1) < 0 || Y(it.y0) > height) {
        errors.push(`${it.type} (${it.x0.toFixed(1)}..${it.x1.toFixed(1)} m, up to ${it.y1.toFixed(1)} m) falls outside the ${width}x${height} drawing`);
      }
    }
    // Openings must not overlap each other.
    const ops = items.filter((i) => i.type === 'opening');
    for (let i = 0; i < ops.length; i++) for (let j = i + 1; j < ops.length; j++) {
      const a = ops[i], b = ops[j];
      if (a.x0 < b.x1 - 0.01 && b.x0 < a.x1 - 0.01 && a.y0 < b.y1 - 0.01 && b.y0 < a.y1 - 0.01) {
        errors.push(`${a.kind} at x=${((a.x0 + a.x1) / 2).toFixed(1)} overlaps ${b.kind} at x=${((b.x0 + b.x1) / 2).toFixed(1)}`);
      }
    }
    // Openings must sit inside a mass or a roof (a window in a gable).
    const hosts = items.filter((i) => i.type === 'mass' || i.type === 'roof' || i.type === 'cut');
    for (const o of ops) {
      if (!hosts.some((m) => o.x0 >= m.x0 - 0.01 && o.x1 <= m.x1 + 0.01 && o.y0 >= m.y0 - 0.01 && o.y1 <= m.y1 + 0.01)) {
        errors.push(`${o.kind} at x=${f((o.x0 + o.x1) / 2)} is not inside any mass(), roof or cut()`);
      }
    }
    if (!items.some((i) => i.type === 'figure')) warnings.push('no figure(): add at least one 1.75 m person as a scale reference');
    // A front tree whose crown covers a building corner hides the silhouette.
    const crowns = items.filter((i) => i.type === 'tree' && i.front);
    for (const m of items.filter((i) => i.type === 'mass')) {
      for (const t of crowns) {
        const coversX = (t.x0 < m.x0 && t.x1 > m.x0 + 0.3) || (t.x0 < m.x1 - 0.3 && t.x1 > m.x1);
        if (coversX && t.cy0 < m.y1) warnings.push(`tree at x=${f(t.cx)} covers a corner of the mass ${f(m.x0)}..${f(m.x1)}; move it clear of the outline or use layer: 'back'`);
      }
    }
    // A tree crossing a cut wall: in a section the space between the cut walls is open, so a tree
    // behind the building shows through and its crown runs over the wall. Applies to trees on
    // both layers.
    for (const c of items.filter((i) => i.type === 'cut')) {
      for (const t of items.filter((i) => i.type === 'tree')) {
        if (t.x0 < c.x1 && t.x1 > c.x0 && t.cy0 < c.y1 && t.y1 > c.y0) {
          warnings.push(`tree at x=${f(t.cx)} crosses the cut wall at x=${f(c.x0)}..${f(c.x1)}; in a section keep trees outside the cut walls`);
          break;
        }
      }
    }
    // Nothing but boats stands over the water beyond a quay edge.
    for (const q of items.filter((i) => i.type === 'quay')) {
      for (const it of items.filter((i) => ['figure', 'tree', 'mass', 'chimney'].includes(i.type))) {
        if (it.x1 > q.water0 + 0.05 && it.x0 < q.water1) errors.push(`${it.type} at x=${f((it.x0 + it.x1) / 2)} stands over the water (quay edge at x=${f(q.water0)}); move it onto the quay`);
      }
    }
    // Masses and chimneys must stand on the ground or on something.
    const supports = items.filter((i) => i.type === 'mass' || i.type === 'roof');
    for (const m of items.filter((i) => (i.type === 'mass' || i.type === 'chimney') && i.y0 > 0.01)) {
      const onTop = supports.some((o) => o !== m && Math.abs(o.y1 - m.y0) < 0.05 && o.x0 < m.x1 && m.x0 < o.x1)
        || supports.some((o) => o !== m && o.type === 'roof' && m.y0 >= o.y0 - 0.01 && m.y0 <= o.y1 && m.x0 >= o.x0 && m.x1 <= o.x1);
      if (!onTop) errors.push(`${m.type} ${f(m.x0)}..${f(m.x1)} starts at ${f(m.y0)} m but stands on nothing`);
    }
    // Small display: people and text become unreadable.
    const px = displayWidth / width;
    if (L(1.75) * px < 14) warnings.push(`people will be ${f(L(1.75) * px)} px tall at ${displayWidth} px display width; show less of the scene (tighter extent) or a larger scale`);
    if (labels && 7 * px < 6) warnings.push(`labels will be ${f(7 * px)} px at ${displayWidth} px display width; pass labels: false`);
    if (L(1) < 3) warnings.push(`scale is ${s.toFixed(2)} units per metre; details under 1 m will not read, show less of the building or make the drawing larger`);
  }

  return d;
}

// One scale for a set of drawings: the largest extent fits, the others keep their true size.
//   const scale = A.sharedScale([extA, extB, ...], { width: 480, height: 300 });
//   A.drawing({ ..., extent: extA, scale })
export function sharedScale(extents, { width = 480, height = 300, margin = 14 } = {}) {
  return Math.min(...extents.map((e) => Math.min((width - 2 * margin) / (e.x1 - e.x0), (height - 2 * margin) / (e.top - (e.bottom ?? -2)))));
}

function f(n) { return String(Math.round(n * 100) / 100); }
function esc(t) { return String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }

export function write(file, svg) {
  fs.writeFileSync(file, svg);
  console.log(`wrote ${file} ${Buffer.byteLength(svg)} bytes`);
}

// Print the report and set a failing exit code on errors, so a generator run doubles as a check.
export function printReport(d) {
  const r = d.report();
  console.log(`scale ${r.scale_units_per_m} units/m, ${r.items} elements, accent used ${r.accents}x`);
  for (const w of r.warnings) console.log(`WARN  ${w}`);
  for (const e of r.errors) console.log(`ERROR ${e}`);
  console.log(r.errors.length ? 'FAIL' : 'PASS');
  if (r.errors.length) process.exitCode = 1;
  return r;
}

export { ALLOWED_WEIGHTS };
