# Chapter review checklist (fresh reviewer agent, before Sam sees a clip)

Sam, 11 Nov 2026 (workflow change 4): a separate agent that has not seen the build watches each chapter as a viewer,
so Sam's review time goes on taste, not defects. The builder never grades its own clip.

**The builder gives the reviewer only:** the 720p clip path, `review_sheet.py` sheets + `_lines.txt`, the
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

The builder fixes every certain and likely finding (with `patch_render.py` for picture-only fixes) before sending,
and lists the taste ones for Sam in one line each.
