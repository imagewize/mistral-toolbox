// Worked example: a converted warehouse on a quay, as an elevation.
//   node examples/pakhuis-quay.gen.mjs out.svg        (run from the skill folder)
// Read it as the template for a new drawing: extent -> ground and water -> masses back to front
// -> roofs -> texture -> openings -> people, trees, boat -> annotations -> svg + report.
import * as A from '../scripts/arch.mjs';

const out = process.argv[2] || 'pakhuis-quay.svg';

// ---------------- layout (metres; x along the quay, y up from quay level) ----------------
const PAKHUIS = { x0: 0, x1: 16, eave: 14, ridge: 21 };      // old warehouse, stepped gable to the quay
const LEVELS = [4.0, 7.3, 10.6];                             // ground floor studios are tall
const SHED = { x0: 16, x1: 30, eave: 6, tooth: 2.6, n: 5 };  // former shed, now studios
const QUAY = { edge: 36, end: 50, water: -1.2 };

const d = A.drawing({ width: 480, height: 300, extent: { x0: -4, x1: QUAY.end, top: 23.5, bottom: -3 }, prefix: 'pk-' });

// ground and water first
d.ground(-4, QUAY.edge);
d.quay(QUAY.edge, QUAY.end, { level: QUAY.water });
d.tree(33, { h: 16, type: 'poplar', layer: 'back' });

// masses, back to front, then roofs
d.mass(SHED.x0, SHED.x1, SHED.eave);
d.sawtoothRoof(SHED.x0, SHED.x1, SHED.eave, SHED.tooth, SHED.n);
d.mass(PAKHUIS.x0, PAKHUIS.x1, PAKHUIS.eave);
d.stepGable(PAKHUIS.x0, PAKHUIS.x1, PAKHUIS.eave, PAKHUIS.ridge, { steps: 4 });

// facade texture before openings, so openings cover it
d.coursing(PAKHUIS.x0, PAKHUIS.x1, 0, PAKHUIS.eave);

// warehouse: a column of loading doors in the middle, lofts either side
for (const [i, lv] of LEVELS.entries()) {
  d.door(8, 1.8, 2.5, { type: 'loading', base: lv + 0.3 });
  d.window(3.2, lv + 0.8, 1.5, 2.0);
  d.window(12.8, lv + 0.8, 1.5, 2.0);
  if (i === LEVELS.length - 1) d.hoist(8, lv + 3.3);           // beam just above the top loading door
}
d.window(8, 17.2, 1.2, 1.4, { mullion: false });              // attic window in the gable
d.door(8, 3.0, 3.3, { type: 'double', accent: true });        // studio entrance: the accent
d.window(3.2, 0.6, 3.2, 2.9, { transom: true });
d.window(12.8, 0.6, 3.2, 2.9, { transom: true });

// shed: tall studio glazing
d.windowRow(SHED.x0 + 0.6, SHED.x1 - 0.6, 0.5, 4.6, 4, { transom: true });

// boat, people, trees in front
d.barge(38, 49, QUAY.water);
d.figure(5.5);
d.figure(21);
d.figure(34.2);
d.tree(-1.8, { h: 8 });

// annotations
d.dimension(PAKHUIS.x0, PAKHUIS.x1, 22.6, '16,0 m');
d.levelMark(PAKHUIS.x1 + 0.8, PAKHUIS.eave, '+14,0');

A.write(out, d.svg({
  title: 'Pakhuis Keilewerf, quay elevation',
  desc: 'A brick warehouse with a stepped gable and a column of loading doors, converted into loft homes, beside a sawtooth shed with studios. A barge is moored at the quay.',
}));
A.printReport(d);
