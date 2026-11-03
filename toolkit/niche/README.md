# Niche scout (skill: gj581g-niche-scout)
- `scout.py [watchlist.json] [outdir]` gathers signals into `reports/<date>/` (YouTube demand per seed query, YouTube and Google autocomplete, peer-channel outliers, Google Trends daily searches for IN/US/CA/GB, Google News for the watchlist topics) and writes `signals.md`.
- `watchlist.json`: the niches (core / testing / paused), their seed queries, peer channels, news topics, trend countries and subreddits. Edit it as the channel learns.
- `yt_search.py queries.txt out.csv`: ad-hoc YouTube search scrape (title, views, age, channel).
- Reddit blocks the workspace (HTTP 403), so the skill reads Reddit through WebSearch/WebFetch or the built-in browser.
- First full study: `channel/GJ581g_niche_insights.md` on G: (project `claude/NICHE_INSIGHTS.md`), 3 Nov 2026.
