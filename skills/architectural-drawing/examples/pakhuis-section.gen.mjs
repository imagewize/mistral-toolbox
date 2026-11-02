// Worked example: a section through an existing warehouse with new floors inserted.
//   node examples/pakhuis-section.gen.mjs out.svg        (run from the skill folder)
// Shows the section parts: cut walls with openings, a cut roof with a skylight, floor slabs,
// a stair and people on two floors.
import * as A from '../scripts/arch.mjs';

const out = process.argv[2] || 'pakhuis-section.svg';

// ---------------- layout (metres) ----------------
const B = { x0: 0, x1: 16, wall: 0.5, eave: 9, ridge: 13, roof: 0.35 };  // the existing warehouse
const FLOORS = [3.2, 6.4];                                                 // the inserted floors
const EXTENT = { x0: -2.5, x1: 20.5, top: 15.6, bottom: -1.6 };

const d = A.drawing({ width: 560, height: 400, extent: EXTENT, displayWidth: 533, prefix: 'ps-' });

d.tree(18.4, { h: 9, layer: 'back' });
d.ground(EXTENT.x0, EXTENT.x1);

// cut walls, the cut roof with a skylight, and the floor slabs
d.cut(B.x0, 0, B.x0 + B.wall, B.eave);
d.cut(B.x1 - B.wall, 0, B.x1, B.eave);
const roof = d.gableRoof(B.x0, B.x1, B.eave, B.ridge, { cut: B.roof, overhang: 0.3 });
d.roofWindow(roof, { side: 'left', at: 0.5, len: 1.8, accent: true });
for (const lv of FLOORS) d.slab(B.x0 + B.wall, B.x1 - B.wall, lv, { t: 0.3 });

// openings in the cut walls, after the cuts: windows on every floor, a door on the right
for (const lv of [0, ...FLOORS]) {
  d.cutOpening(B.x0, B.x0 + B.wall, lv + 0.9, lv + 2.5);
  if (lv > 0) d.cutOpening(B.x1 - B.wall, B.x1, lv + 0.9, lv + 2.5);
}
d.cutOpening(B.x1 - B.wall, B.x1, 0, 2.4, { glass: false });

// stair from the ground floor to the first floor
d.stair(2.2, 0, 6.6, FLOORS[0]);

// people on two floors
d.figure(9.5);
d.figure(12.4, { base: FLOORS[0], pose: 'walk-left' });
d.figure(4.8, { base: FLOORS[1] });

d.dimension(B.x0, B.x1, 14.8, '16,0 m', { from: B.ridge });

A.write(out, d.svg({
  title: 'Section through the existing warehouse',
  desc: 'A 16 metre wide warehouse in section: cut brick walls with windows, a gable roof with a skylight, two inserted floors, a stair and three people.',
}));
A.printReport(d);
