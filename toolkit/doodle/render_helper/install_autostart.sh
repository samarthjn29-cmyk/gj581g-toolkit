#!/bin/bash
# Make the render helper start by itself whenever Sam logs in to this Mac, with no Terminal window (20 Nov 2026).
# Run once:   bash ~/gj581g-toolkit/toolkit/doodle/render_helper/install_autostart.sh
# Undo:       bash ~/gj581g-toolkit/toolkit/doodle/render_helper/install_autostart.sh --remove
# It keeps the Mac awake only while a render is running. A closed lid still sends the Mac to sleep (renders wait until it wakes).
set -e
L="com.gj581g.renderhelper"; P="$HOME/Library/LaunchAgents/$L.plist"; H="$HOME/gj581g-toolkit/toolkit/doodle/render_helper/render_helper.sh"
launchctl bootout "gui/$(id -u)/$L" 2>/dev/null || true
if [ "${1:-}" = "--remove" ]; then rm -f "$P"; echo "Autostart removed. The helper now runs only when you start it in Terminal."; exit 0; fi
mkdir -p "$HOME/Library/LaunchAgents" "$HOME/Library/Logs"
cat > "$P" <<PLIST
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0"><dict>
  <key>Label</key><string>$L</string>
  <key>ProgramArguments</key><array><string>/bin/bash</string><string>$H</string></array>
  <key>RunAtLoad</key><true/>
  <key>KeepAlive</key><true/>
  <key>ThrottleInterval</key><integer>60</integer>
  <key>EnvironmentVariables</key><dict><key>PATH</key><string>/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin</string></dict>
  <key>StandardOutPath</key><string>$HOME/Library/Logs/gj581g_render_helper.log</string>
  <key>StandardErrorPath</key><string>$HOME/Library/Logs/gj581g_render_helper.log</string>
</dict></plist>
PLIST
launchctl bootstrap "gui/$(id -u)" "$P"
echo "Done. The render helper now starts by itself at login and runs in the background. You can close Terminal."
echo "If macOS asks whether 'bash' may access files in Google Drive, click Allow."
