# GJ 581g toolkit

**Version 3.0, 7 Nov 2026: vector-animation videos only.** The legacy deck, footage, Banknote, hand-drawn, Heckler and money-alert code was removed in the skills audit (it is in git history before commit "Toolkit 3.0"). The channel's skills are `gj581g-producer`, `decked-out-research-story`, `gj581g-vector-world`, `gj581g-voice`, `decked-out-youtube-packaging` and `gj581g-scout`; they say when to use each tool.

| Folder | What it does |
|---|---|
| `build/` | `build.py project.json`: the one-command build (voice -> align -> mix -> listen -> qa -> lint -> render -> check -> deliver -> avcheck), resumable; `av_check.py` checks a finished clip |
| `tts/` | Sam's clone (Chatterbox) in scene mode (`clone_scenes.py`), line fixes (`clone_lines.py`, `patch_line.py`), the join (`assemble_scenes.py`), pacing (`breathe.py`), the MP3 check (`qa_final.py`), Kokoro (`kokoro_lines.py`, `setup.sh`), second voices (`heckler_lines.py`, generic despite the name) |
| `story/` | `factcheck_sync.py` + `FACTCHECK_CHECKLIST.md` (the fact-check gate), `simple_lint.py` (plain words), `pace_lint.py` (picture changes, vector treatments), `voice_lint.py`, `cue_lint.py`, `scene_lint.py`, `timing_srt.py` (captions) |
| `media/` | `recolour_png.py` / `recolour_svg.py` (palettes `ember`, `dawn`; add one per world), `stock_to_svg.sh` (Adobe Stock .ai -> palette SVG), `fluent_props.sh` (Fluent Emoji Flat props), `ambient_bed.py` (in-house music beds) |
| `remotion/kits/vector_world/` | `vw.jsx` (camera, layers, light, devices, figures), `cave.jsx` (the Plato's Cave reference video), `stills_cave.mjs` (many stills from one bundle), `folk/` (Folk II rig for close character scenes), `public/grain0.png` |
| `graphics/` | `icons.py` (Lucide/Tabler/Phosphor icons), `mapmaker.py` (Natural Earth maps) |
| `thumbs/` | `sheets.py`, `shoot.js`, `templates_v2/feed.html` (the dark feed mock) |
| `study/` | same-topic study tools: `heat_comments.py`, `frame_capture.js`, `contact_sheets.py`, `script_metrics.py`, `scorecard.md` |
| `niche/` | the weekly idea scout (`scout.py`, `watchlist.json`, `calendar.json`, reports) |
| `peerwatch/` | the weekly peer watch (`peer_watch.py`, `peers.json`, `ledger.json`, reports) |
| `fetch/` | `fetch_pdf.js` for PDFs behind a browser check |

`LESSONS.md` is the mistakes log: read it at the start of every session. The working Remotion project (node_modules installed) is set up per session; copy `remotion/kits/vector_world/` into its `src/` and `public/`.
