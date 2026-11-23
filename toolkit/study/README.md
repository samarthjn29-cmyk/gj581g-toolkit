# Similar-videos study tools (skill `gj581g-similar-videos`)
- `frame_capture.js`: paste into the built-in browser on a YouTube watch page, then `await window.__run(8)` (one frame every 8 s, plus a 90 s cut-rate measure at the start and the middle at 2x). Skips ads. `JSON.stringify(window.__cap.frames)` returns the frames; `window.__metrics()` returns cuts/min, median shot, motion and still shares. Return frames as JSON text, never build sheets inside the browser (a hidden tab hung on image decode, 4 Nov 2026).
- `contact_sheets.py out_dir frames1.json [...]`: builds 8x6 contact sheets with timestamps from the saved JSON.
- `script_metrics.py transcript.txt minutes [--first 90]`: the script measurements (wpm, numbers/min, sentences, questions, you/I).
Frames, sheets and transcripts stay in the run folder (`/home/claude/study/<topic>/`); only the analysis goes into channel docs.

## sound/ (Johnny Harris sound study, 23 Nov 2026)
- `capture_youtube.js`: silent capture in the built-in browser (audio routed to a recorder only, 2x, frame sheets).
- `sound_map.py FILE.webm START 2`: real-time wav -> demucs (voice / rest) -> whisper words -> 4 s level, brightness, percussion, key blocks, events (drops, entries, hits, risers), a spectrogram PNG with the voice marked. Needs `pip install demucs torch` (CPU). One thread under a render (`-j 1`), nice 19.
- `run_queue.sh [DIR]`: maps every `raw/JHsound_*.webm` in DIR without a map. Start it with a 2 h timeout.
