// The librarian, built for animation (8 Nov 2026). Rig units: millimetres, ground at y = 0 under the hip, facing right.
// Every limb is a tapered capsule whose ends are circles centred on its joints, so a joint can turn any amount without
// opening a gap. Each depth group (far arm, far leg, near leg, body, near arm) is drawn outline-first then fill, so a
// group reads as one clean shape with no seams inside it, and groups are separated by their outer lines only.
// The head is the Recraft drawing (face and hair in the channel's look); everything else is drawn here.

export const COLORS = {skin: 'rgb(200,151,106)', tunic: 'rgb(220,198,174)', tunicShade: 'rgb(196,174,150)', belt: 'rgb(139,93,59)',
  sandal: 'rgb(110,70,40)', line: '#000'};
export const OUTLINE = 13;        // rig units of black around each group (about 3 px on screen at the pilot's scale)
export const DETAIL = 6;          // inner detail lines (sleeve hems, folds, straps)

const J = {hip: [8, -760], hipFar: [28, -760], knee: [10, -400], kneeFar: [30, -400], ankle: [8, -72], ankleFar: [28, -72],
  shoulder: [6, -1345], shoulderFar: [22, -1350], elbow: [6, -1075], elbowFar: [22, -1080], wrist: [6, -845], wristFar: [22, -850], neck: [42, -1437]};

// bones: name, parent, pivot (joint it turns about), bbox (rest pose) for framing checks
export const RIG = {name: 'librarian_v2', anchor: [0, 0], height: 1700, parts: [
  {name: 'torso', parent: null, pivot: J.hip, x: -140, y: -1440, w: 270, h: 805},
  {name: 'head', parent: 'torso', pivot: J.neck, x: -82, y: -1700, w: 214, h: 275},
  {name: 'upper_arm', parent: 'torso', pivot: J.shoulder, x: -50, y: -1400, w: 112, h: 360},
  {name: 'forearm', parent: 'upper_arm', pivot: J.elbow, x: -28, y: -1110, w: 68, h: 270},
  {name: 'hand', parent: 'forearm', pivot: J.wrist, x: -30, y: -850, w: 80, h: 135},
  {name: 'far_upper_arm', parent: 'torso', pivot: J.shoulderFar, x: -34, y: -1405, w: 112, h: 360},
  {name: 'far_forearm', parent: 'far_upper_arm', pivot: J.elbowFar, x: -12, y: -1115, w: 68, h: 270},
  {name: 'far_hand', parent: 'far_forearm', pivot: J.wristFar, x: -14, y: -855, w: 80, h: 135},
  {name: 'near_thigh', parent: 'torso', pivot: J.hip, x: -56, y: -825, w: 132, h: 480},
  {name: 'near_shin', parent: 'near_thigh', pivot: J.knee, x: -50, y: -452, w: 196, h: 462},
  {name: 'far_thigh', parent: 'torso', pivot: J.hipFar, x: -36, y: -825, w: 132, h: 480},
  {name: 'far_shin', parent: 'far_thigh', pivot: J.kneeFar, x: -30, y: -452, w: 196, h: 462}]};
export const POINTS = {palm: [6, -790], soleNear: [50, 0], soleFar: [68, 0], headImg: {x: -82, y: -1700, w: 214, h: 275}};

// ---- path helpers
const f = (n) => n.toFixed(1);
// a tapered capsule from p0 (radius r0) to p1 (radius r1): two arcs joined by straight tangents
export const capsule = (p0, p1, r0, r1) => { const dx = p1[0] - p0[0], dy = p1[1] - p0[1], L = Math.hypot(dx, dy), ux = dx / L, uy = dy / L;
  const a = Math.asin(Math.max(-1, Math.min(1, (r0 - r1) / L))), nx = -uy, ny = ux, c = Math.cos(a), s = Math.sin(a);
  const n1 = [nx * c + ux * s, ny * c + uy * s], n2 = [-nx * c + ux * s, -ny * c + uy * s];
  const A = [p0[0] + n1[0] * r0, p0[1] + n1[1] * r0], B = [p1[0] + n1[0] * r1, p1[1] + n1[1] * r1], C = [p1[0] + n2[0] * r1, p1[1] + n2[1] * r1], D = [p0[0] + n2[0] * r0, p0[1] + n2[1] * r0];
  return `M${f(A[0])},${f(A[1])} L${f(B[0])},${f(B[1])} A${r1},${r1} 0 0 0 ${f(C[0])},${f(C[1])} L${f(D[0])},${f(D[1])} A${r0},${r0} 0 0 0 ${f(A[0])},${f(A[1])} Z`; };
const circle = (c, r) => `M${f(c[0] - r)},${f(c[1])} a${r},${r} 0 1 0 ${2 * r},0 a${r},${r} 0 1 0 ${-2 * r},0 Z`;

// ---- shapes per part, in rest-pose rig coordinates. kind: 'fill' (part of the group silhouette), 'detail' (a line drawn
// after the fills), 'front' (drawn after the held prop: the fingers that wrap it)
const arm = (S, E, W, far) => ({
  upper: [{d: capsule(S, E, 47, 39), fill: COLORS.skin},
    {d: `M${S[0] - 64},${S[1] - 6} A64,64 0 0 1 ${S[0] + 64},${S[1] - 6} L${S[0] + 58},${S[1] + 132} Q${S[0]},${S[1] + 152} ${S[0] - 60},${S[1] + 132} Z`, fill: COLORS.tunic},
    {d: `M${S[0] - 60},${S[1] + 132} Q${S[0]},${S[1] + 152} ${S[0] + 58},${S[1] + 132}`, kind: 'detail', stroke: COLORS.line}],
  fore: [{d: capsule(E, W, 39, 29), fill: COLORS.skin}]});
export const GRIP_D = 70;   // the roll the grip closes on (mm): the pilot's scroll
const HANDS = (W) => ({
  relaxed: [{d: capsule([W[0] + 2, W[1] + 10], [W[0] + 6, W[1] + 70], 28, 26), fill: COLORS.skin},
    {d: capsule([W[0] + 24, W[1] + 18], [W[0] + 34, W[1] + 62], 11, 10), fill: COLORS.skin}],
  reach: [{d: capsule([W[0], W[1] + 8], [W[0], W[1] + 52], 28, 27), fill: COLORS.skin},
    ...[-17, -6, 5, 16].map((dx, i) => ({d: capsule([W[0] + dx, W[1] + 50], [W[0] + dx * 1.15, W[1] + 118 - Math.abs(i - 1.5) * 8], 9, 8), fill: COLORS.skin})),
    {d: capsule([W[0] + 24, W[1] + 18], [W[0] + 44, W[1] + 58], 11, 9), fill: COLORS.skin}],
  // grip: a fist closed round a roll whose axis runs across the hand (rig x). Seen from the side we see the back of the
  // fingers: a rounded block a hand wide along the roll and a little taller than the roll, finger seams running across
  // the roll, the thumb over the top. Palm behind the roll ('fill'), fist in front of it ('front').
  grip: (() => { const c = [W[0], W[1] + 64], hy = GRIP_D / 2 + 12, x0 = c[0] - 34, x1 = c[0] + 40, y0 = c[1] - hy, y1 = c[1] + hy, r = 24;
    return [{d: capsule([W[0], W[1] + 6], [W[0] + 2, W[1] + 40], 29, 29), fill: COLORS.skin},
      {d: `M${x0 + r},${y0} L${x1 - r},${y0} Q${x1},${y0} ${x1},${y0 + r} L${x1},${y1 - r} Q${x1},${y1} ${x1 - r},${y1} L${x0 + r},${y1} Q${x0},${y1} ${x0},${y1 - r} L${x0},${y0 + r} Q${x0},${y0} ${x0 + r},${y0} Z`, fill: COLORS.skin, kind: 'front'},
      {d: [-16, 2, 20].map((dx) => `M${c[0] + dx},${y0 + 14} L${c[0] + dx},${y1 - 8}`).join(' '), kind: 'front-detail', stroke: COLORS.line},
      {d: capsule([c[0] + 30, y0 - 4], [c[0] + 4, y0 + 2], 13, 12), fill: COLORS.skin, kind: 'front'}]; })()});
const leg = (H, K, A) => ({
  thigh: [{d: capsule(H, K, 64, 52), fill: COLORS.skin}],
  shin: [{d: capsule(K, A, 51, 34), fill: COLORS.skin},
    {d: `M${A[0] - 44},${-2} L${A[0] + 122},${-2} Q${A[0] + 142},${-4} ${A[0] + 134},${-28} Q${A[0] + 100},${-50} ${A[0] + 36},${A[1] - 4} L${A[0] - 30},${A[1] - 14} Q${A[0] - 52},${-40} ${A[0] - 44},${-2} Z`, fill: COLORS.skin},
    {d: `M${A[0] - 46},${-4} L${A[0] + 132},${-4} L${A[0] + 132},${8} L${A[0] - 46},${8} Z`, fill: COLORS.sandal},
    {d: `M${A[0] + 6},${A[1] + 8} L${A[0] + 56},${-24} M${A[0] - 28},${A[1] - 2} L${A[0] + 30},${A[1] - 8} M${A[0] + 70},${-10} L${A[0] + 92},${-34}`, kind: 'detail', stroke: COLORS.sandal, width: 12}]});

const TUNIC = `M-14,-1426 Q-92,-1426 -112,-1384 Q-128,-1300 -126,-1150 L-138,-640 Q-6,-626 128,-640 L114,-1150 Q112,-1300 98,-1364 Q80,-1412 46,-1422 Q16,-1404 -14,-1426 Z`;
export const SHAPES = (handShape = 'relaxed', farHandShape = 'relaxed') => { const nA = arm(J.shoulder, J.elbow, J.wrist), fA = arm(J.shoulderFar, J.elbowFar, J.wristFar);
  const nL = leg(J.hip, J.knee, J.ankle), fL = leg(J.hipFar, J.kneeFar, J.ankleFar);
  return {
    groups: [
      {id: 'far_arm', parts: {far_upper_arm: fA.upper, far_forearm: fA.fore, far_hand: HANDS(J.wristFar)[farHandShape]}},
      {id: 'far_leg', parts: {far_thigh: fL.thigh, far_shin: fL.shin}},
      {id: 'near_leg', parts: {near_thigh: nL.thigh, near_shin: nL.shin}},
      {id: 'body', parts: {torso: [
        {d: capsule([-6, -1440], [-8, -1405], 45, 46), fill: COLORS.skin, kind: 'under'},   // joins the head image's own neck (x -59..41) to the collar; its front edge sits on the throat line
        {d: TUNIC, fill: COLORS.tunic},
        {d: 'M-130,-905 L122,-905 L121,-871 L-131,-871 Z', fill: COLORS.belt},
        {d: circle([100, -888], 19), fill: COLORS.belt},
        {d: 'M98,-874 Q106,-842 112,-806 M92,-874 Q92,-842 86,-812', kind: 'detail', stroke: COLORS.belt, width: 15},
        {d: 'M-56,-860 Q-62,-760 -70,-652 M34,-860 Q40,-760 48,-652 M-14,-1330 Q-10,-1250 -16,-1180', kind: 'detail', stroke: COLORS.tunicShade, width: 8},
        {d: 'M-14,-1424 Q16,-1404 44,-1420', kind: 'detail', stroke: COLORS.line}]}, head: 'image'},
      {id: 'near_arm', parts: {upper_arm: nA.upper, forearm: nA.fore, hand: HANDS(J.wrist)[handShape]}}]}; };
