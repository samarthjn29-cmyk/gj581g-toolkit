#!/bin/bash
# GJ 581g render helper for Sam's Mac (20 Nov 2026).
# Watches  <Google Drive>/Decked out Data/render_queue/jobs/  for job files that Claude drops there (from either laptop),
# renders them on this Mac's graphics chip from a clean copy of the toolkit, and puts the video in  render_queue/out/.
# Safety: a job can only name a script in toolkit/doodle/jobs/ or a card page in toolkit/doodle/cards/, both from the
# toolkit repo itself (git), with plain numbers and a short query string. Nothing else in a job file is ever run.
# Start it:  bash ~/gj581g-toolkit/toolkit/doodle/render_helper/render_helper.sh      (leave the Terminal window open)
set -u
REPO="$HOME/gj581g-toolkit"; DOODLE="$REPO/toolkit/doodle"
DRIVE=$(ls -d "$HOME"/Library/CloudStorage/GoogleDrive-*/"My Drive"/"Decked out Data" 2>/dev/null | head -1)
if [ -z "$DRIVE" ]; then echo "Can't find 'Decked out Data' in Google Drive. Install Google Drive for desktop, sign in, and check the folder shows in Finder."; exit 1; fi
Q="$DRIVE/render_queue"; mkdir -p "$Q/jobs" "$Q/done" "$Q/out" "$Q/working"
export PATH="/opt/homebrew/bin:/usr/local/bin:$PATH" GPU=1
log() { echo "$(date '+%Y-%m-%d %H:%M:%S') $*" | tee -a "$Q/helper_log.txt"; }
sync_repo() {
  git -C "$REPO" fetch -q origin && git -C "$REPO" reset -q --hard origin/main || { log "git sync failed"; return 1; }
  cd "$DOODLE"
  local h; h=$(shasum package-lock.json | cut -c1-12)
  if [ "$h" != "$(cat .lockhash 2>/dev/null)" ] || [ ! -d node_modules/three ]; then npm install --no-audit --no-fund -s && echo "$h" > .lockhash; fi
  node -e "require.resolve('playwright')" 2>/dev/null || { npm install --no-save --no-audit --no-fund -s playwright && npx playwright install chromium; }
}
field() { node -e "const j=require(process.argv[1]); const v=j[process.argv[2]]; process.stdout.write(v===undefined?'':String(v))" "$1" "$2"; }
log "render helper started; queue: $Q"
caffeinate -is -w $$ &
while true; do
  printf '{"alive":"%s","host":"%s"}\n' "$(date -u +%Y-%m-%dT%H:%M:%SZ)" "$(hostname -s)" > "$Q/helper_status.json"
  for J in "$Q"/jobs/*.json; do
    [ -e "$J" ] || continue
    ID=$(basename "$J" .json); [[ "$ID" =~ ^[A-Za-z0-9_-]{1,80}$ ]] || { log "bad job name $ID"; mv "$J" "$Q/done/"; continue; }
    mv "$J" "$Q/working/$ID.json"; J="$Q/working/$ID.json"; log "job $ID: start"
    sync_repo || { echo '{"status":"failed","why":"git"}' > "$Q/done/$ID.result.json"; mv "$J" "$Q/done/"; continue; }
    KIND=$(field "$J" kind); OUT="$Q/out/$ID.mp4"; PART="$Q/working/$ID.part.mp4"; rm -f "$PART"; T0=$(date +%s); RC=1
    if [ "$KIND" = "script" ]; then
      NAME=$(field "$J" name); S="$DOODLE/jobs/$NAME.sh"
      if [[ "$NAME" =~ ^[a-z0-9_]{1,60}$ ]] && [ -f "$S" ]; then (cd "$DOODLE" && bash "$S" "$PART") >> "$Q/helper_log.txt" 2>&1; RC=$?; else log "job $ID: unknown script '$NAME'"; fi
    elif [ "$KIND" = "card" ]; then
      PAGE=$(field "$J" page); QS=$(field "$J" query); A=$(field "$J" start); B=$(field "$J" end)
      if [[ "$PAGE" =~ ^[a-z0-9_]{1,60}$ ]] && [ -f "$DOODLE/cards/$PAGE.html" ] && [[ "$QS" =~ ^[A-Za-z0-9=\&._-]{0,200}$ ]] && [[ "$A" =~ ^[0-9]+(\.[0-9]+)?$ ]] && [[ "$B" =~ ^[0-9]+(\.[0-9]+)?$ ]]; then
        (cd "$DOODLE" && node render.js "cards/$PAGE.html" "$QS" "$A" "$B" "$PART") >> "$Q/helper_log.txt" 2>&1; RC=$?
      else log "job $ID: refused card job (page/query/times not allowed)"; fi
    else log "job $ID: unknown kind '$KIND'"; fi
    if [ $RC -eq 0 ] && [ -s "$PART" ]; then mv "$PART" "$OUT"; ST=ok; else ST=failed; rm -f "$PART"; fi
    printf '{"status":"%s","seconds":%s,"output":"out/%s.mp4","git":"%s"}\n' "$ST" "$(( $(date +%s) - T0 ))" "$ID" "$(git -C "$REPO" rev-parse --short HEAD)" > "$Q/done/$ID.result.json"
    mv "$J" "$Q/done/$ID.json"; log "job $ID: $ST in $(( $(date +%s) - T0 )) s"
  done
  sleep 15
done
