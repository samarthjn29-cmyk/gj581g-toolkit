#!/bin/bash
# Job: Colour_v1 chapter 1 "The geranium", silent (the workspace adds voice and music). $1 = output file.
bash "$(dirname "$0")/../render_colour_ch1.sh" "$1"
