# Peer watch (GJ 581g, from 3 Nov 2026)

Follows channels like ours and gathers what is needed to learn from them. Used by the `gj581g-peer-watch` skill; topic demand stays with `niche/scout.py` (`gj581g-niche-scout`).

- `peers.json`: the channels (handle, tier rising / incumbent / craft, why), `outlier_x` (2.0) and `learn_per_run` (8).
- `python3 peer_watch.py [peers.json] [outdir]` (about 10-15 minutes for 15 channels) writes `reports/<date>/`:
  - `digest.md`: new uploads since the last run (on the first run, the last 14 days), outliers (2x+ the channel median, last 12 months), the fastest-growing videos since the last run (views per day), cadence and length per channel, and title patterns vs performance.
  - `learn/<id>.json`: one card per video worth studying (new uploads and outliers, biggest first). Each card holds the publish date, length, likes, description size, links, sources line, sponsor, chapters and the top 20 comments.
  - `thumbs/<id>.jpg`: the thumbnails, to look at with the Read tool.
  - `data.json`: every row.
- `ledger.json`: every video seen, with one views reading per run, so a video's growth (day 1, 7, 28) can be read across runs. Commit it after each run.
- **What plain requests can't get:**
  - Captions and the watch page's player data are behind YouTube's bot check. For a transcript, use the built-in browser method (hook `/api/timedtext` while the captions toggle; see REFERENCE_ANALYSIS's how-studied notes) or one vidIQ transcript (5 credits; the free plan has 150 a month).
  - Keep transcripts in the run folder only; channel docs hold analysis, never transcripts.
- If YouTube answers with thin pages, the script backs off and retries; if a whole channel returns nothing (OBF on 3 Nov), check its handle.
