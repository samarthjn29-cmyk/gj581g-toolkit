# The host: Monocle Egg (Mild Astonishment)

Picked by Sam on 15 Nov 2026, for use from the video after Gods_v1 onwards (not in Gods_v1).

## Who he is
- An original mascot: a smug little egg-shaped professor, cream body, dark ink outline.
- Fixed features: a monocle on his left eye, one huge dark raised eyebrow over it, tiny stubby arms and legs, a small brick-red (#77190D) waistcoat with buttons.
- Personality: smug, sceptical, the "well, actually" voice. He raises the eyebrow at shaky claims and is quietly delighted when something holds up.
- He never lip-syncs to Sam's voice. He reacts, points, holds tags and appears in about one or two shots a minute.
- He is not Sam and not any real person; no real face is ever put on him.

## How to make him
- The master sheet is `monocle_egg_sheet.jpg` (also on G: `brand\MildAstonishment_host_monocle_egg_sheet.jpg`). Every new pose is generated in Firefly (Nano Banana 2) with this sheet as the reference image: "Using this exact character (same egg body, monocle on his left eye, huge raised eyebrow, brick-red waistcoat, same outline and colours) ...".
- Check each new still against the sheet: monocle on the same eye, waistcoat colour, eyebrow shape. Regenerate any drift.
- Painted in the video's gouache style; no flat vector versions.

## Emotions (15 Nov 2026)
- `monocle_egg_emotions.jpg` (labelled) and `emotions_1..4.jpg` (raw): smug, shocked, unimpressed, thinking / delighted, angry, sad, confused / scared, laughing hard, embarrassed, bored / facepalm, mind blown, suspicious, proud.
- The monocle drops out in sad, laughing hard and facepalm; put it back when using those poses.

## 3D talking host (Sam, 16 Nov 2026: "I like your advice and recommendation")
- Plan: build the Monocle Egg in Blender (bpyenv in the workspace), a few mouth shapes, lip-sync from Sam's own audio with a free phoneme tool (e.g. Rhubarb), painterly shader.
- Use him only for short speaking moments (5-10 s intro, the odd aside, sign-off); the painted stills carry the rest.
- First step after Gods_v1: a rough 10 s test clip on one of Sam's lines for him to judge the look.

## Format decision (Sam, 16 Nov 2026: "Let's go with 2.5D")
- The host is 2.5D: a painted gouache cut-out split into layers (body, head, eyebrow, monocle, mouth) that move separately in a painted scene, with parallax, a small bob/tilt and an eyebrow that lifts on cue.
- Talking: painted mouth shapes on their own layer, switched from Rhubarb lip-sync cues on Sam's audio (rhub/ in the workspace); short speaking moments only.
- The 3D Blender test (host3d/egg.py) stays as a reference, not the look.
- Built 16 Nov 2026 (Sam: "Build our channel avatar now"): `parts25d/` holds the master pose (front, plain white ground) and matched Firefly edits of it: mouths A (closed), B (friendly talking), C (ee), D (ah), E (oh; F reuses E), blink, raised brow. `rig25d.py` keys the white out, cuts each variant's changed patch (mouth patches locked to the mouth box and kept off the waistcoat), switches mouths from Rhubarb cues on Sam's audio (G->B, H->C, X = master smile), blinks every 2.5-5 s, raises the brow on `--brow start:end` cues (the outline follows the brow), bobs, tilts, squashes on open vowels, and sits him over a softened, slowly drifting painted background.
- Run: `rhubarb -f json -d line.txt --extendedShapes GHX line.wav -o mouth.json`, then `python3 rig25d.py --dir parts25d --audio line.wav --cues mouth.json --bg BG.jpg --out out.mp4 [--side right|left|center] [--height 0.66] [--brow 6.0:7.6]`. About 1 s per frame at 1080p.
- First test: `MonocleEgg_25D_talk_test.mp4` (8 s, Gods op4-op4b "...way below my pay grade", brow up on "pay grade").
- Rejected parts kept in the workspace only: the huge first "ah", the lipped "oo", the teeth-gritted B (read as a grimace).
