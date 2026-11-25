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
- Tags, sources, datelines and credits: JetBrains Mono caps, letter-spaced, on the dark chip, 20-24 px at 1080p.
- Keyword chips (TXT-024): Fraunces bold on paper chips, the one key word on the accent chip, 64 px; only spoken words.
- Running head top right (`3 · THE TALK`) on diagram and text shots only.

## Colour
- Accent `#00E0BE` (teal) on one focal thing: a highlight, the key chip, a lit outline; about 10% of the frame at most.
- Data colours (reported, imagined or simulated colours) are their own hex, never the accent.
- Text 4.5:1 or better on what is behind it.

## Motion and finish
- Calm motion: slow drift on held frames, eased moves, no overshoot except sticker pops; designed transitions between
  scenes (push, slide, band, match, morph, cut on action), hard cuts inside a scene.
- Cinematic finish on every act (LOK-030): light grain, warm grade, soft vignette.
- Drawn spectra and light patches are smooth gradients with feathered edges and fading ends, never stepped bands (PerspectiveGrid fan `smooth`; Designer, act 4, 25 Nov 2026).
- Props in a drawn room (boards, screens, tables) are shaded objects with texture, thickness and a contact shadow, never flat panel rectangles; name and credit tags are dark chips, also on the rail (TimelineRail `labelTone: "chip"`; Designer, act 4, 25 Nov 2026).
- Strike-throughs on keyword chips should be ink, keeping the accent for the one replacement chip (Designer SHOULD, act 4; not yet built).
- Spectrum rows and divisions sit straight on the ground, no black backing; a dimmed division is the same gradient at lower opacity, never a dark box over it (Designer, act 5, 25 Nov 2026).
