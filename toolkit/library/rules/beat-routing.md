# Beat routing (GJ 581g library build, calm version)

Every beat on an episode's Beat_Sheet names its intent, one starter component, and every registry ID it uses.
Only Active assets render (Master_Asset_Registry); the Registry_Check column must read VALID.

| # | Intent | Component (ID) | Energy | Typical length |
|---|---|---|---|---|
| 1 | Document or quote proof | ArchivalScanCard (VIS-001) | Calm | 3-6 s, 1-2 highlights |
| 2 | Statistic or contrast | MinimalDataChart (VIS-002) | Peak | 2.5-4 s, 1-3 bars |
| 3 | Scale, media frenzy | HeadlineMatchCut (VIS-003, MOT-004) | Peak, rare | 1.5-3 s, once a chapter at most |
| 4 | Hero photo or subject | ParallaxCutout (VIS-004) | Calm | 3-6 s |
| 5 | Detail in a crowded frame | SpotlightIsolator (VIS-005) | Calm | 3-5 s |
| 6 | Web, spec or process evidence | CleanUICard (VIS-006) | Calm | 3-6 s, 2-5 rows |
| 7 | Chapter or thesis turn | ChapterSlate (VIS-007) | Reset | 2.5-4 s |

## Pace (Sam, 22 Nov 2026: "We will go for a calmer version")
- A change on every 2.0-3.5 s phrase, but a change can sit inside the shot (a highlight sweeps, a row lights, a number counts).
  A new layout or picture about every 2-4 beats (6-12 s).
- A calm beat after every peak beat. No two beats in a row with the same component and layout (no clones).
- One slow move per shot (MOT-001 drift, 1.00 -> 1.03 at most). Nothing static past 3.5 s.
- Entrances 0.6-0.9 s, slow-out, opacity with a rise or a wipe (never a fade alone); exits up to 1.35x faster.

## Eye trace (TRN-001 HardCutEyeTrace) {#eye-trace}
The default transition is a hard cut. Before a cut, find the focal point of the outgoing shot (the highlighted word,
the hero bar's end, the bracketed detail, the face). The incoming shot's focal point must land within 25% of the
screen (480 px across, 270 px down at 1920x1080) of it. If it can't, use the push-through (TRN-006): the new shot
opens from the old shot's key point (`transitionIn: "push"`, `focus: [x, y]` in the act file).
Gate 1 checks the focal points from the beat sheet; Gate 2 checks them on the stills.

## Sound
Every sharp visual event that carries a sound effect names its SFX-### ID on the beat; sounds sit within ±1 frame
of their keyframe and never on Sam's words. SFX rows stay Planned until their files are in public/sfx/ and registered.
