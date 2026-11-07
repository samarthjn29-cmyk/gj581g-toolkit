# Scene spec and validator (7 Nov 2026)

Each scene is written once as data in `<scene>.scene.json`. That one file holds:
- **Stage:** lanes and the metres-to-pixels scale.
- **Objects:** each one's real size, what it rests on, and its parts, with the stand's legs and stretchers as geometry.
- **Props:** every state they pass through.
- **Characters:** moves, actions and poses.
- **Camera:** the shots.
- **Devices:** each one's screen box, timing and backing.
- **Beats:** each beat's focal subject.
- **Prop cards:** size ranges.
- **Rules.**

`core.mjs` turns the spec into every number the scene needs: easing, word-cue times, projection, stand geometry, rack slots, character forward kinematics (hand, feet, bounding box), camera and prop positions.
- **Readers:** the Remotion scene (`pilot_room10.example.jsx`) and the asset builder read only the spec and the core, so the plan and the build can't drift.
- **Debug overlay:** `--props '{"debug":true}'` draws the core's hand, feet, bounding box and rack slots on the render, which proves the checks and the picture agree.

## Checks
`node validate.mjs <scene.json> [--variant name] [--json out.json]` runs on the same core, and exits 1 on any FAIL. Its checks:

| Code | What it checks |
|---|---|
| G1-G6 | supports and contact: legs on the cabinet, legs meeting the board, back legs hidden, stretchers meeting both legs, draw order, the board supported at both ends |
| Z1-Z3 | real sizes against the prop cards; the scroll against the rack art |
| C1-C4 | one prop has one size; hands touch what they take (in screen space, across parallax layers); the slot reached is the slot that empties; prop states change at the hand-over |
| R1-R2 | rig rules: no darkened limbs; the shoulder pivot at the top of the sleeve |
| M1-M4 | screen direction; planted-foot slip; hand speed at human pace; one action at a time, no grab or release mid-walk |
| E1 | characters enter at an entrance or the frame edge |
| F1-F6 | the focal subject in frame at every beat; text not covering it; no awkward foot crops in held shots; floor share and figure size in wide shots; no slivers at the frame edge |
| T1-T5 | text: safe margins, minimum duration, ends with its scene, a solid backing when drawings pass behind it, no overlaps |
| L1 | nothing hides a wall painting |
| S1 | a scroll opens along its line of columns, with its rollers at the left and right ends |
| G7 | the open scroll's rollers and stubs stay on the board |
| C5 | a tagged prop comes from a tagged slot |
| F7 | the camera never shows past the edge of the art |
| W1 | every cue word exists in the aligned narration |

## Tools
- **Tuning:** `tune.mjs` searches spec values (stop position, reach pose, walk cycle) that make the contact and slip checks pass.
- **Regression:** `regression_variants.json` holds the mistakes from the scroll-room pilots, including the v10 independent review, each as a small patch to the spec (22 so far). Every one of them must fail. Run them all with:
  `for v in $(python3 -c "import json;print(' '.join(json.load(open('regression_variants.json'))))"); do node validate.mjs room.scene.json --variant $v >/dev/null || echo "caught $v"; done`

## Rig test (holes and seams in every pose the scene uses)
- **Setup:** `PoseSheet.jsx` draws the character in every pose the scene uses (sampled from the core) on magenta, with the caps from the spec.
- **Joints:** `node pose_joints.mjs joints.json` writes where each joint sits.
- **Find the gaps:** `python3 rig_holes.py sheet.png 6 2 <rest cell> joints.json` reports:
  - enclosed holes, where the background shows through: these FAIL;
  - new notches at joints compared with the rest pose: these are CHECK, because they may be the natural gap between two limbs.
- **Caps:** they live in the spec (`characters[].caps`), each with its reason, so the scene and the test use the same ones.

## Prevented by construction
- **Camera:** the core clamps it so the wall plate always covers the frame. F7 still checks this, and the `camera_past_art` variant turns the clamp off to prove the check works.

## Not covered here
These problems are caught by the other gates:
- **Art defects** (stray outlines, recolouring leftovers): `study/DETAIL_CHECKLIST.md` plus the independent reviewer.
- **Attention:** `study/gaze.py`.
- **Meaning and history:** an independent read of the director's pack.
