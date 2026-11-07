# Detail check before every render (from Sam's v8 notes, 7 Nov 2026)

Run after the gaze check, on full-size stills (render at `--scale=1`), never on downscaled sheets.

1. **Stills at 100%:** one frame per beat, plus the frames where each prop is largest on screen and 3-4 frames across a walk cycle.
2. **Crops:** crop every prop and every character's hands, feet, knees, hips and shoulders and look at them at 100% or 200%.
3. **Checks:**
   - **Physical logic:** every support touches what it holds (legs reach the floor or the table top and the underside of the board; stretchers meet both legs). Nothing floats or passes through anything else. Proportions are plausible.
   - **Character consistency:** both legs and both arms share the same colours (no darkened far limbs). There are no seams at the joints. Feet sit on the floor line. Hands really hold their props.
   - **Drawing defects:** stray outlines, leftovers from recolouring (e.g. tag outlines), doubled lines, blotches, mixed styles.
   - **Layering and shadows:** objects are in the right front-to-back order, and every object standing on the floor has a contact shadow.
   - **Text:** legible, not covering the focal point, at least 40 px from the frame edges.
4. **Independent review:** a fresh agent that hasn't seen how the frames were made reviews the same stills against this list and returns a numbered list of problems. Fix them, re-still, and re-check the fixed spots.
5. **Then render.**

Gaze check: `gaze/bin/python study/gaze.py <out_dir> <frames...>` (DeepGaze IIE). The 50% region should sit on what the narration names at that moment.
