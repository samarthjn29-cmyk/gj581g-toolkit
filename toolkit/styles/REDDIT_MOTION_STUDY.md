# Reddit motion study (14 Nov 2026)

Sam, 14 Nov 2026: "Can you go through reddit and check what other motions or ideas we can incorporate in our videos?"
Threads read: r/vfx "Animate from a static image using VFX?"; r/VideoEditing "How do you make a video engaging when all you
have is images?"; r/AfterEffects "Motion graphics people! What are your little tricks..."; r/animation "How would I turn a
completed illustration into an animation?"; r/AfterEffects 3D/parallax thread; r/aitubers "best image-to-video AI tool for 2D
animated style"; r/PromptEngineering "subtle, seamless looping animation from an image"; r/comfyui "How to make AI videos feel cinematic".

## What the threads agree on (and what we already do)
- Cut out, animate, then paint the revealed background (= our part.py + Firefly clean plate). "Be subtle... it can look cheap easily."
- Split the art into chunks rather than puppet-warping one image (= our parts; the writing hand failed when one big piece slid).
- 2.5D layers + camera move for parallax (= layers.py), "always have something moving, even if it's just the camera creeping".
- Sound sells motion: foley/SFX "validates the magic trick" (= our picture sounds in pauses).

## New ideas worth building (painted-friendly)
| # | Idea | What it is | Fit for us | Cost |
|---|---|---|---|---|
| R1 | **Squigglevision / line boil** | trace or redraw the outline 3 times and flick between them, so a still "breathes" like hand animation | every painted still, very subtle; or a sketch version before the full painting appears | M (3 Firefly variants or a displacement boil) |
| R2 | **Echo smear on fast moves** | trailing copies on whips/crash zooms instead of plain motion blur, "mimics traditional animation" | our whip / crash / spin moves | S |
| R3 | **Real elements shot on black** | composite real fire, smoke, dust, light-leak, bird footage over the painting | only if painted-looking; most real footage breaks the gouache look, so painted-graded only | M |
| R4 | **Overshoot on every pop** | things land past their mark and settle (we use it on cards; extend to every part move) | needle, spanners, tags | S |
| R5 | **Cut at the fastest point of a move** | hide or match a cut by cutting mid-whip/zoom where the speed peaks | chapter joins, match cuts | S |
| R6 | **Sketch-to-paint reveal** | the still first appears as a pencil sketch, then the paint fills in | first look at the homemade guitar, the alien drawings | M (Firefly sketch version + wipe) |
| R7 | **Light sweep to pick out edges** | a soft light passes over a key object's edge | hero objects, the poster | S (we have lightsweep) |
| R8 | **Grain + a touch of lens softness on everything** | unifies stills and cards | already have paper grain and vignette; keep chromatic aberration off (not painted) | S |
| R9 | **One primary motion per shot** | animating everything makes a shot feel fake | rule for our motion pass | rule |

## AI image-to-video (for the next video, Kling)
- Always image-to-video from our finished still, never text-to-video.
- Prompt only the change ("the needle swings to the right, nothing else moves"), not the scene; add "keep the flat gouache
  illustration style, no 3D depth, no camera move".
- Kling 3.0 is ranked best for keeping a flat 2D style; for character gestures, paint the start and end poses as two stills and
  let Kling interpolate between them (start + end frame), which drifts far less than describing the action.
- Feed the 2752x1536 still (high resolution helps flat art keep detail).
- Everything else locked: ask for no drifting, no warping; trim to the cleanest 2-3 s.
- Still the rule: AI paintings only, never a real photo or a real person.
