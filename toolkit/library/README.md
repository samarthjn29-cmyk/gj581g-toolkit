# GJ 581g library studio (Remotion, 30 fps, calm version)

Built 22 Nov 2026 for the library-build workflow (skill `gj581g-library-build`).

- `src/registry/registry.json` is the render manifest, generated from the Master_Asset_Registry
  (Library - Clip Tracker). Only Active entries render; `src/registry/index.tsx` is the only place that calls `staticFile()`.
- `src/themes/` one file per Theme_Library row in use: `warmGraphite.ts` (LOK-009, default), `archivalDesk.ts` (LOK-001).
- `src/layers/OpticalStack.tsx` (LOK-010) five-layer frame; `src/motion.ts` (MOT-001..003) calm motion presets.
- `src/components/` the seven starter components (VIS-001..007) and `PushThrough.tsx` (TRN-006); `catalog.json` maps names to IDs.
- `src/episodes/<ep>-<act>.json` act files (beats with times, component, props, asset IDs); `Episode` composes them.
- `rules/beat-routing.md` beat types, pace and the eye-trace cut rule (TRN-001).

## Commands
```
node scripts/registry-build.mjs scripts/data/registry_values.json   # manifest from a get_values dump of Master_Asset_Registry!A1:G
node scripts/registry-check.mjs [act.json]                          # "Unregistered assets: N" and the other guards
node scripts/library-stills.mjs render 1.2,3.5                       # every library preview, both themes -> qa/library/
node scripts/gate2-qa.mjs src/episodes/ep01-act01.json --voice v.wav # Gate 2 stills, contact sheet, checks.txt, report
npx remotion studio                                                  # browse the library
npx remotion render Episode out/x.mp4 --props=src/episodes/ep01-act01.json --concurrency=1 --gl=swangle
```
Scale renders only to whole-pixel sizes (`--scale=0.6667` fails on 1080 -> 720.036); render 1080 and downscale with ffmpeg.
