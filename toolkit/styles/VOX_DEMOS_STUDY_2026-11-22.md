# Two Vox-style Remotion demos, 22 Nov 2026 (analysis only)

Sam: "Analyze this in detail for the effects which we can copy and recreate" (RandomAI, *Claude Opus 5.5 Is INSANE at Vox-Style Motion Graphics*, 13:33, 20 Oct 2026, 97k views), then "Analyze this in detail too" (MoSidd, *I Made Vox-Style Motion Graphics Using Only Claude Code & Remotion*, 13:11, 28 Jun 2026, 281k views).

Both are tutorials with a finished demo up front. The effects are in the demos: RandomAI 0:09-0:40 (US debt, about 31 s) and 12:24-12:39 (CO2, 15 s); MoSidd 0:05-0:52 (US-Iran, 47 s). Studied in the built-in browser from frame sheets (every 0.5-1.5 s, finer around the transitions) and the captions. The sound was measured in the page (five bands every 50 ms, routed to a muted output) against the frame changes. Nothing of theirs is kept.

## 1. RandomAI: the debt and CO2 demos

**The look**
- One shared ground: off-white paper with a fine graph grid, a soft vignette and grain. It stays for the whole piece; only the closing beat goes dark.
- Type is mixed on purpose. An italic serif carries the spoken line, revealed word by word on the voice, with one word on a yellow marker ("borrow", "speeding up", "biggest bill", "paying"). A condensed heavy face is used for hero numbers. Typewriter mono caps are used for labels, tags and source lines.
- Every data beat has a tiny mono source line at the bottom left (Treasury, CBO, Census).
- Accent colours: signal red for the bad number, yellow marker for the key word, black ink for the rest.

**Effects, in order**
1. **Live tally.** A hero counter, "BORROWED SINCE YOU HIT PLAY", ticks up from $0. It sits above a NOW-to-END track whose red fill grows toward a finish flag, and a tilted torn red label reads "BY THE END · OVER $2 MILLION". After about 5 s it docks into a small torn-paper chip in the top-right corner and keeps ticking through every later scene, up to $2,367,125 at the end. It is the piece's thread.
2. **A cutout photo object.** A Capitol cutout with a soft shadow slides in beside the counter.
3. **Letter drop.** "$40 TRILLION" drops in letter by letter, the last letters still landing. At the same time, cutout money stacks build up stack by stack on a spring.
4. **Share-out.** The stacks burst into flying bills that settle on a grid of person icons, one share each. The old title racks out of focus as "$117,000" arrives in red. One icon turns red with a ring, and the crowd slides apart to isolate it.
5. **Rescaling chart.**
   - A line chart draws on, with small dated event ticks and a black value chip riding the line's head.
   - When the line outgrows the frame, the axis zooms out: the $20 trillion reference line slides down, a $40 trillion line appears, and the chip keeps riding.
6. **Ledger card.**
   - A torn receipt card ("U.S. FEDERAL BUDGET · FISCAL YEAR 2026") lists its rows in typewriter type with dotted leaders and grey placeholder bars.
   - The INTEREST row gets a marker and "$1 TRILLION / YEAR" types in.
   - Beside it, two bars grow, each topped with a cutout object: a fighter jet on defence, money on interest.
7. **Odometer year.** A year in an inverted stamp box rolls from 2042 to 2048.
8. **Rank swap.**
   - Rough-edged ink bars carry icons and mono labels.
   - The red INTEREST bar grows and slides from last place up to first while the others shuffle down.
   - A red "#1" badge pops, and a tilted yellow tape label lands on the bar: "BIGGEST BILL".
9. **Into the dark.** A quick cut takes the piece from paper to a near-black ground with an engraved hourglass cutout. Then:
   - "FUTURE" in heavy type gets a hand-drawn red strike-through and greys back.
   - "PAST" lands on a yellow slab.
   - The tally chip's final number sits under it in red.
10. **CO2 demo.**
    - A torn-edge colour illustration (a windmill village) sits as a sticker beside a glass jar with a cork. The jar fills with black dots as "280" counts up, with a small "CO2" string tag.
    - A torn vertical paper divider slides in for "TODAY": a factory sticker and a second jar fill with red dots to 420.
    - The 800,000-year record is a long wiggly line with a red spike at the end.
    - Three torn cards fill in turn, each an illustration with a two-tone title (HOTTER SUMMERS, RISING SEAS, DYING REEFS).

**Sound (measured)**
- A narration-led mix over a low, steady bed.
- A sub thump with an air swish lands on almost every beat change: 14.7, 23.7 (the axis rescale), 27.8, 31.0 (the odometer), 34.8 (the rank swap), 36.8 (into the dark) and 39.2 s (PAST).
- That is about one hit every 3-4 s. Most smaller moves have no sound.

## 2. MoSidd: the US-Iran demo

**The look and system** (from his walkthrough)
- **One locked background in every scene:** pale grey paper with a faint grid. "It looks like it's one continuous shot instead of a lot of different cuts."
- **Three layers in each scene:**
  - the background;
  - a **midground** of black-and-white halftone cutouts of people, each with an **offset red-orange marker stroke** behind it ("a little bit of a 3D illusion");
  - a **foreground** of colour structure cutouts (a building, a tanker).
- **The script table drives everything:** one row per beat, with the voiceover line, the foreground and midground assets, and the image prompt. That is our beat sheet.
- **Two animation verbs:** spring for pop-ups, interpolate for everything else. Pop-ups are staggered "so they don't all move at once".
- **Studio prop controls** for scale and x/y, so he nudges each cutout by hand and saves the values.

**Effects, in order**
1. **Rise from behind.** The White House rises on a spring, then the two leaders rise from behind it, masked by the building and staggered.
2. **Newspaper.** A tilted newspaper front page with a soft shadow; one headline phrase gets the yellow marker.
3. **Moving water.** A tanker cutout floats on a real moving-water clip (green-screen ocean footage). A price chip (orange barrel icon) counts "$40" to "$116 PER BARREL".
4. **Push-off.** Every layer slides off to the left together while the paper background stays still.
5. **Chart card.** A rounded cream card draws an orange line against a grey "previous trend" line, with a value callout. The card then scales down and moves left to make room.
6. **Extruded map.** A flag-filled country with thickness and a floating shadow appears under a heavy "$39 TRILLION" label. Halftone worker and soldier cutouts with props pop up from the bottom on either side ("Interest: $1 trillion").
7. **Speech bubbles.** Hand-lettered bubbles are put on two real leaders.
8. **Typewriter line.** "EMPIRES DON'T END WITH A WAR. THEY END WITH A BILL THEY CAN NO LONGER PAY" types in mono caps with a block cursor, while a dollar-bill cutout burns in from one edge.
9. **Light-leak finish.** A warm light-leak wash ends the piece.
10. **Progress bar.** A thin orange bar along the bottom fills across the whole piece.

**Sound (measured)**
- A bright pop or air hit on nearly every entrance: 6.95, 7.85, 9.05, 11.4, 13.0, 16.4, 19.2, 22.6, 25.0, 31.0, 33.7, 37.0, 41.2, 42.4, 43.7 and 45.9 s.
- That is one every 1.5-3 s, with almost no sub.
- It is much denser than our hierarchy rule.

## 3. What we take, and what we don't

**Logged as our own builds (Planned, with best use and limit):**

| ID | Name | From | Best use for us |
|---|---|---|---|
| VIS-036 | LiveTally | RandomAI 1 | A sourced rate that grows while the viewer watches; max 1 per episode |
| VIS-037 | ShareOut | RandomAI 4 | A total as a per-person share, or 1 in N people ("1 in 12 men"); extends VIS-024 |
| VIS-038 | RescalingChart | RandomAI 5 | Growth that speeds up; extends VIS-002 |
| VIS-039 | LedgerCard | RandomAI 6 | A few named items from one real document |
| VIS-040 | RankSwap | RandomAI 8 | A change in ranking |
| VIS-041 | JarFill | RandomAI 10 | A then-versus-now share |
| VIS-042 | RiseFromBehind | MoSidd 1 | People tied to a place (real photos, credited) |
| VIS-043 | FootageLayer | MoSidd 3 | One moving part in a held collage (sea, smoke) |
| VIS-044 | ExtrudedRegion | MoSidd 6 | One region named in the narration |
| LOK-025 | OffsetMarkerStroke | MoSidd | Paper-cut depth on halftone figure cutouts |
| TXT-019 | LetterDrop | RandomAI 3 | One hero number card per act |
| TXT-020 | StrikeThrough | RandomAI 9 | Correcting a misconception said out loud |
| TXT-021 | TypewriterLine | both | A closing or documentary line |
| SFX-026 | SoftPop | MoSidd (as a contrast) | The one entrance that matters in a shot |
| SFX-027 | TypewriterKeys | both | Under TXT-021 only |

**Filled in on existing Planned rows:**
- **TRN-004:** the locked stage (the paper never moves; layers slide out together).
- **LOK-006:** tilted torn labels.
- **TEX-001:** the grid-paper ground with vignette, grain and source lines.

**Already ours:**
- the marker word (TXT-017);
- the word-by-word line (VIS-020 KineticLine);
- the counters (TXT-003, VIS-018);
- the halftone one-ink cutouts (VIS-028 DuotoneCollage);
- spring entrances (MOT-002/003);
- the KeywordSlab (TXT-012, Planned);
- the scale field (VIS-024, Planned);
- the light-leak finish (LOK-015, Planned).

**Not taken:**
- **Invented speech bubbles and quotes on real people (MoSidd 7):** our rule is real people only in real photos, and no words they didn't say.
- **A mock front page under a real outlet's name (MoSidd 2):** we show real scans with ArchivalScanCard plus the marker.
- **AI-generated cutouts of real people:** we use real photos only, re-screened where the licence allows.
- **A pop on every entrance:** we keep the hierarchy rule (sound the most important move, about one hero sound per shot). RandomAI's rate of one hit every 3-4 s is closer to ours.
- **The burning dollar bill:** loud for our calm look, and no use in the colour series.
- **The full-length progress bar:** it competes with YouTube's own; not logged.

**Workflow notes worth keeping**
- **Both build an instruction system from reference clips first, then iterate.** That is what our register, studies and skills already are.
- **MoSidd's script table (VO line, foreground, midground, prompt) is our beat sheet.** One idea is worth borrowing: Studio prop controls for cutout scale and position, so Sam can nudge a cutout in Remotion Studio himself (remotion-interactivity). It is logged as a backlog idea, not built.
