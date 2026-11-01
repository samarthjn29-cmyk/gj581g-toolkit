#!/usr/bin/env bash
# Local preview only: LibreOffice in the workspace lacks the Windows/Office fonts the themes use, so map each to the
# closest installed font. The real deck keeps the real font names (PowerPoint on Windows has them). Run once per session.
mkdir -p ~/.config/fontconfig/conf.d
alias() { echo "<alias binding=\"same\"><family>$1</family><prefer><family>$2</family></prefer></alias>"; }
{ echo '<?xml version="1.0"?><!DOCTYPE fontconfig SYSTEM "fonts.dtd"><fontconfig>'
  alias "Georgia" "Lora"; alias "Garamond" "GFS Baskerville"; alias "Rockwell" "Bitstream Charter"; alias "Courier New" "Liberation Mono"
  alias "Century Gothic" "Inter"; alias "Bahnschrift" "Inter Display"; alias "Segoe UI" "Inter"; alias "Trebuchet MS" "DejaVu Sans"
  alias "Franklin Gothic Medium" "Inter SemiBold"; alias "Gill Sans MT" "Inter"; alias "Arial" "Liberation Sans"
  echo '</fontconfig>'; } > ~/.config/fontconfig/conf.d/60-decked-out-preview.conf
fc-cache -f >/dev/null 2>&1; echo "preview font aliases installed"
