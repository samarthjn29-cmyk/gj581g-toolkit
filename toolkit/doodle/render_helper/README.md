# Render helper (Sam's Mac)

Claude drops a job file into `Decked out Data/render_queue/jobs/` on Google Drive. The Mac renders it on its graphics chip and puts the
video in `render_queue/out/<job>.mp4`, with `render_queue/done/<job>.result.json` (status, seconds, toolkit commit). `helper_status.json`
is rewritten every 15 s while the helper runs, and `helper_log.txt` keeps a log.

Job files (JSON), one of:
- `{"kind": "script", "name": "colour_ch0"}` runs `toolkit/doodle/jobs/colour_ch0.sh <output>`
- `{"kind": "card", "page": "colour_ch1_3d", "query": "shot=filter&t0=0", "start": 0, "end": 9}` runs `node render.js cards/<page>.html ...`

Only scripts in `jobs/` and pages in `cards/` from the toolkit repo can run; names, query and times are checked. Before every job the
helper resets its toolkit copy to GitHub's `main` (it is a mirror: don't edit files there) and installs packages when they change.

Start: `bash ~/gj581g-toolkit/toolkit/doodle/render_helper/render_helper.sh` and leave that Terminal window open (it keeps the Mac awake
while it runs). Stop: close the window or press Ctrl+C.
