# Style guide: Where Colour Lives (LOK-009 Warm Graphite)

The Designer's reference (rules/DESIGNER.md). Seeded 24 Nov 2026 from the theme file, the standing decisions on the
board and the locked acts 1-2 and act 3 v5. Each later line carries its date and who settled it.

## Grounds
- Default: warm graphite `#2F2D2C` with the soft corner light; at most 40% of an act on graphite (ground rule, 23 Nov).
- Documents lie on the paper desk (LOK-027, light or dark desk); places on lit period maps (MAP-011); a person or the
  person a line points to as a blur ground (LOK-028), dark and soft, never sharp enough to compete with what is on it.
- No ground three shots running; four or more grounds an act.

## Real pictures (always real first; never a photo alone on screen)
- Pages and scans: on the desk with a shadow, a highlight in accentSoft on the words being read, the source tag below.
- Objects and people from photos: cut-out stickers (white edge 6 px, soft shadow, 2-3 degree tilt) or, for a modern
  stand-in, a newspaper halftone cutting on newsprint (24 Nov, Sam: "a newpaper cutting or a picture cut"), tagged
  PHOTO TODAY with the photographer.
- Period portraits keep their engraving texture; never colourised, flipped or retouched.
- **Drawn diagrams only where a drawing explains what a picture cannot** (a cross-section, light paths, a tint filling
  the eye); a plain line drawing of something a real picture can show is replaced by the picture (24 Nov, Sam on the
  simple eye: "It's not looking good and i would like to drop it").

## Type
- Quotes and titles: Fraunces (serif), italic for quoted words; chapter titles at the slate size.
- Tags, sources and datelines: JetBrains Mono caps, letter-spaced, on the dark chip, 20-24 px at 1080p.
- **No credits on screen** (Sam, 25 Nov 2026: "Can we remove the onscreen credits from the videos? We will put them in the description."; "Credits only", all acts): no photographer, uploader, archive, museum, library or licence names (CC BY, Unsplash, Wellcome, NASA, Rijksmuseum ...) on screen; every one goes in the description's credits (Sources_&_Rights). What stays: what the viewer is looking at and when: book/page and map source tags (JOHN DALTON · 1798 · P. 29, KITCHIN · 1794), a likeness's maker (AFTER ENOCH SEEMAN), and the honesty tags TODAY, PHOTO TODAY, ILLUSTRATION, SIMULATION, RECOLOURED.
- Keyword chips (TXT-024): Fraunces bold on paper chips, the one key word on the accent chip, 64 px; only spoken words.
- Running head top right (`3 · THE TALK`) on diagram and text shots only.

## Colour
- Accent: the theme's one accent (LOK-033 Studio Cream: tomato `#FF4F2E`; LOK-009 graphite acts: teal `#00E0BE`) on one
  focal thing: a highlight, the key chip, a lit outline; about 10% of the frame at most.
- Data colours (reported, imagined or simulated colours) are their own hex, never the accent.
- Text 4.5:1 or better on what is behind it.

## Colour harmony (Sam, 26 Nov 2026: "colors on our videos should not feel too much"; background option A)
Every frame is built from a small palette that belongs together:
1. **60 / 30 / 10.** About 60% ground (cream or graphite), 30% neutrals (ink, paper, greyscale scans), at most 10% colour.
2. **One accent per act.** The theme's accent is the only invented colour. No second highlight colour, ever.
3. **Story colours only when they are the story.** A data colour (the geranium's pink, Dalton's sky-blue, a swatch)
   appears when the line is about it, at most two story colours on a frame; anything else on screen goes neutral.
4. **Colour fields are one family.** Moving background colour fields (OpticalStack blobs) are shades of one warm
   family around the accent (LOK-033: `#FF9A7A #FFC9A8 #F2B48C #FFD9C2`), or a tint of the shot's story colour; never
   unrelated hues side by side.
5. **The accent never fights a story colour.** No accent chip or highlight sitting on, or right beside, a photo or swatch
   whose own colour clashes with it (tomato on a pink petal): that chip goes paper/ink. A chip that names a story
   colour may take that colour instead of the accent.
6. **Footage and photos are graded part-way to the palette** (warmth, slightly lower saturation) unless their colour is
   the evidence (the geranium, the screen's sub-pixels, a spectrum).
7. **Checked:** `scripts/harmony-check.py CLIP ACT.json` at Gate 3 (and on the look-sheet frames at Gate 2): at most 3
   colour families on a frame (4 on a shot whose subject is colour itself), loud (very saturated) area at most 25%.
   It reports; the Designer reads it, and a frame over the limit needs a reason in the review or a fix.

## Motion and finish
- Calm motion: slow drift on held frames, eased moves, no overshoot except sticker pops; designed transitions between
  scenes (push, slide, band, match, morph, cut on action), hard cuts inside a scene.
- Cinematic finish on every act (LOK-030): light grain, warm grade, soft vignette.
- Drawn spectra and light patches are smooth gradients with feathered edges and fading ends, never stepped bands (PerspectiveGrid fan `smooth`; Designer, act 4, 25 Nov 2026).
- Props in a drawn room (boards, screens, tables) are shaded objects with texture, thickness and a contact shadow, never flat panel rectangles; name and credit tags are dark chips, also on the rail (TimelineRail `labelTone: "chip"`; Designer, act 4, 25 Nov 2026).
- Strike-throughs on keyword chips should be ink, keeping the accent for the one replacement chip (Designer SHOULD, act 4; not yet built).
- Spectrum rows and divisions sit straight on the ground, no black backing; a dimmed division is the same gradient at lower opacity, never a dark box over it (Designer, act 5, 25 Nov 2026).
