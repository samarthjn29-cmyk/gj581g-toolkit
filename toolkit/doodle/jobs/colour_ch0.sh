#!/bin/bash
# Job: the whole Colour_v1 opening, silent (the workspace adds voice and music). $1 = output file.
bash "$(dirname "$0")/../render_colour_ch0.sh" "$1"
