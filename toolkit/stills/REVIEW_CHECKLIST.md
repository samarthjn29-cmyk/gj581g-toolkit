# Chapter review checklist (fresh reviewer agent, before Sam sees a clip)

Sam, 11 Nov 2026 (workflow change 4): a separate agent that has not seen the build watches each chapter as a viewer,
so Sam's review time goes on taste, not defects. The builder never grades its own clip.

**The builder gives the reviewer only:** the 720p clip path, `review_sheet.py` sheets + `_lines.txt`, the `gag_frames.py` sheets + `_timing.txt`, the
`visible_lint.py` output, the voice precheck/audit report, and this checklist. Not the plan, not the prompts, not the
builder's notes.

**The reviewer reports, per finding: time, what is wrong, how sure (certain / likely / taste), the fix it suggests.**
Under 400 words. It never edits files.

1. **Flicker and pacing:** any picture or card up under about 1.5 s; any shot that feels stuck (over about 9 s with
   nothing moving); three or more similar shots in a row; a cut that lands mid-word instead of on the cue.
2. **Picture vs words:** each picture shows what the line says or plainly illustrates it; nothing shows a different
   thing as the thing named; a real person appears only in a real photo; a date, number or name on screen matches
   the line spoken under it.
3. **Cards:** text verbatim from the spoken line; no punchline written out before it is said; readable at phone size
   (open one sheet frame at full size); never over a busy part of the picture; colours keep their roles.
4. **AI stills:** extra fingers or limbs, melted faces, garbled lettering that reads as real text, modern objects in
   a period scene, the same place looking different from shot to shot.
5. **Sound** (from the reports): bed never stops, drops only on punchlines, level about -16 LUFS, any confirmed word
   slip with its time.
6. **First 15 seconds** (opening or first chapter only): does the picture and line give a reason to keep watching?

7. **Gag placement on the picture** (Sam, 11 Nov 2026, Aliens ch3: "a reviewer is required which reviews the placement of
   visual elements on the pictures too"). Uses `gag_frames.py` sheets: every gag at lands / middle / leaves, every cut
   before / after. For each overlay gag (circle, arrow, stamp, tag, label, bubble, starburst, aside, loading, lens...):
   - it points at or sits on **the thing it is about** (a circle round the actual line, a stamp on the sign, not beside it);
   - it never covers a face, the subject of the picture, another gag, a name tag, or text in the picture;
   - it stays inside the frame and clear of the edges (40 px), and is readable at phone size against what is behind it;
   - the camera move does not slide the thing out from under the gag before it leaves;
   - tags and labels name what is on screen at that moment, not the previous or next picture;
   - two gags on the same shot do not crowd each other; one idea at a time.
8. **Gag timing:** each gag lands on the word it plays on (within about 0.3 s), never before a punchline is spoken,
   and leaves before the picture changes. Full-screen cards come and go on a word, not mid-word.
9. **Cuts:** read `OUT_timing.txt` (CUT-MIDWORD, CUT-EARLY/LATE, SFX-ON-WORD are mechanical and always count as certain).
   Then judge each before/after pair: does the cut land on the idea change, is there a jarring jump between two
   similar pictures, does a picture appear for a line it does not illustrate.

**Report format for 7-9:** one line per finding: `ID (G# or C#) · time · problem · certain/likely/taste · fix`, where a
fix for placement gives the new position as a fraction of the frame (x, y from the top-left) or the word to move to.
The builder applies every certain and likely fix, re-renders, regenerates the pack, and a **new** reviewer checks
again until nothing certain or likely is left. Only then does the clip go to Sam.

The builder fixes every certain and likely finding (with `patch_render.py` for picture-only fixes) before sending,
and lists the taste ones for Sam in one line each.
