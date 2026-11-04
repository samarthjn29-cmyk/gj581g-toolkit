---
name: "gj581g-character-story"
description: "Use when a GJ 581g (Decked out Data) video tells its story through moving characters (Barbara, Ann, the Heckler, or a new cast): the Folk rig, voices, lip sync, pose tracks, camera and character scenes."
---

# GJ 581g: character-driven storytelling

Sam asked (3 Nov 2026) for explainers where characters move and the story develops, rather than only a board-style presentation. This skill is how a character scene is built. It sits under `gj581g-scene-quality` (drawing, layout, captions, pacing win there) and `gj581g-voice-music-montage` (everything the viewer hears wins there). Workflow and the build are in `gj581g-producer`.

## When to use characters
- The idea is personal (a raise, a purchase, a choice) and a person can live it on screen: Barbara out shopping, Ann sipping tea, the Heckler losing patience.
- Mix, don't replace (Sam, "mixed by design"): characters carry the story beats; charts, documents and numbers still appear as themselves (S8 Banknote frames, data morphs, kinetic type). A character can stand next to a chart, react to it or hold a pay slip, but the number is never only in the character's hand.
- Characters are illustrative and labelled as such where they could be mistaken for real people ("Barbara is illustrative").

## The kit
- **Rig:** `toolkit/remotion/kits/folk_banknote/rig.jsx` `Rig({x, y, s, look, face, mouth, blink, pose: {fa, fb, ba, bb, tilt, lean}, walk, turn, bob, eyeLook, frontItem, backItem})`. Origin between the feet; about 600 units tall before `s`. Articulated arms (`fa/fb` front arm swing and elbow, `ba/bb` back arm), head tilt, lean, a walk cycle (`walk` = phase in radians), a turn (`turn` -1..1, scaleX), blinks, Rhubarb mouth shapes A-H and X, items held in a hand (`slip(text, color, turnSign)` is a pay slip).
- **Faces (15):** neutral, happy, smile, sad, worried, thinking, surprised, smug, and the Heckler's moods impatient, pushy, deflated, exasperated, groan, envious, warm. Eye types: dot, smile, wide, side, lid, roll, shut.
- **Looks:** `{skin, hair: 'bob'|'bun'|'curly'|'short', hairColor, top, bottom, shoe, ink, glasses, earrings}`. The series cast is set in `gj581g-scene-quality` section 2 (video 1's looks: Barbara curly near-black hair, skin `#8D5B3E`, orange-red sweater `#C4623F`; Ann brown bob, skin `#F1C7A4`, slate-blue blazer `#2E4A5E`; import the video's own constants, never retype them; the prototype's light-skinned Barbara and bun-haired Ann are stale), cousin Sam (from video 2: short black hair, skin `#A86F4C`, banknote-green top; test look), the Heckler (`HECK` in `heckler.jsx`: `#C98B62`, bun (since 4 Nov 2026; it was a bob), gold top, gold hoops). New characters are told apart at phone size by hair and top colour; new hair styles are added to `Hair` in the rig.
- **Busts:** `folk.jsx` for portrait cards and thumbnails.
- **Reference scene:** `kits/folk_banknote/story_proto/story.jsx` (23 s, Ann and Barbara): pose tracks, a walk-in, a camera that follows the talk, captions, a title.

## Building a character scene
1. **Dialogue file** (`story/dialogue.json`): one entry per line with `id`, `who`, `text`, `gap` (seconds after), and for the Heckler `mood`. Narration lines are `who: "narrator"`.
2. **Voices:** the narrator is Sam's clone (`gj581g-voice-music-montage` section 0). Characters who speak need their own voice: synthetic only, never a real person's. In an animatic, Kokoro voices (Barbara `af_heart`, cousin Sam `hm_psi` (placeholders), Ann `bf_emma` in the prototype); in a final, Chatterbox conditioned on a Kokoro reference with moods, like the Heckler (`toolkit/tts/heckler/`). Each speaking character's voice is picked by Sam from a sampler.
3. **Lip sync:** Rhubarb Lip Sync 1.13 on each line's wav with the line's text as the dialog file (`-f json -q --extendedShapes GHX -r phonetic --dialogFile`); the cues, offset to the line's start, go into `dialogue_timing.json` (`voice_dialogue.py` in the prototype does voice + Rhubarb + timing in one pass). The rig shows the cue's mouth shape while the line plays, otherwise the face's own mouth.
4. **Pose tracks:** per character, keys `[[time, {fa, fb, ba, bb, tilt, lean, face, turn}]]`; numbers blend over about 0.35 s, the face switches a third of the way in (`track()` in the prototype). Key times come from the voiced lines (`st(id)`, `en(id)`, `tw(id, word, k)`), never from guesses: a reaction lands on the word that causes it ("prices" -> surprised).
5. **Life between keys:** blinks every 3-4 s (offset per character), a slight breathing `bob`, the listener reacts (turns, smiles, crosses arms) while the other talks. Nobody freezes for more than about 2 s.
6. **Walks:** move `x` with an eased ramp and set `walk` from the distance travelled (`(x + offset) / STEP`) so the feet don't slide; footstep sounds (if any) on the phase crossings.
7. **Camera:** keys `[time, cx, cy, zoom]` blended over about 0.7 s: wide to establish, push in on the speaker or on a reaction, back out for a reveal. One move at a time.
8. **Setting:** a real place (a shop, a street with a lamp post, a kitchen) drawn in the series style with straight-edged furniture (`gj581g-scene-quality` section 2); characters stand on a ground line with a soft shadow.
9. **Captions:** the narrator's and characters' lines are captioned as usual, except the Heckler's (never shown; the caption components skip `who: "heckler"`). Speaker tags (`BARBARA`, `ANN`) only where two characters talk in one shot.
10. **Check:** stills at each pose key and at the busiest frame, at full size and phone size: hands not clipping the head, items held upright, mouths visible, faces readable, no overlap with charts or captions.

## Comedy with characters
- One trait per character carries the jokes (`gj581g-voice-music-montage` section 1b): Barbara cheerfully overconfident, Ann dry and quietly smug, the Heckler blunt and secretly won over.
- Picture against voice: the narration stays deadpan and accurate while a character's reaction contradicts it.
- A running prop (Barbara's jet-ski fund jar) reappears unchanged and pays off at the end.

## The Heckler's job (from Dollar Yardstick video 3; Sam, 4 Nov 2026: "Apply maxinomics ideas from video 3")
In video 2 she was jokes only. From video 3 some of her slots also carry the video's questions (`styles/MAXINOMICS_STUDY.md` idea 4), inside the voice skill's limits (`gj581g-voice-music-montage` 0b: about 4-8 interjections a video, no numbers, no claims of fact, never the last word on a fact):
- **The open question:** she asks the viewer's "But why…?" or "So what?" at a chapter turn, and the next chapter answers it. A question she asks early is paid off later with a callback.
- **The top comment, asked first:** where a viewer would object, she asks it as a question, not a claim ("Which Americans, exactly?", "Didn't Nixon have something to do with this?"), and the narrator answers it with the facts.
- **The other side, prompted:** on a charged point she pushes ("Oh come on, that's the official version"), and the narrator states the opposing case fairly in his own lines (fact-checked like any claim) before weighing both. She prompts the steelman; the narrator delivers it.
- Unchanged: blunt and impatient, secretly won over; never captioned or shown in a bubble; a second voice stays optional per video.

## New characters
- A new recurring character starts with a sheet of at least 10 designs in different drawing manners, then the pick's mood sheet and an in-frame mock (`gj581g-scene-quality`), then a 5 s test with voice and lip sync. Sam picks at each step.
- Names follow the clone-safe naming rule (2-3 syllables, clear consonants, tested in the clone before the script locks).

## Performance
- Remotion renders at `--concurrency=2` (2 cores). Character scenes are pure SVG and render fast; keep footage windows small in the same shot.
- Never voice and render at the same time.