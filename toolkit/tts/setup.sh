#!/usr/bin/env bash
# One-time setup for narration: Kokoro v1.0 ONNX model + voices, the kokoro-onnx config, and the CMU Pronouncing Dictionary.
# Usage: tts/setup.sh [target_dir]   (default: tts/dl; or set KOKORO_DIR to reuse an existing download)
set -eo pipefail
DL="${1:-${KOKORO_DIR:-$(cd "$(dirname "$0")" && pwd)/dl}}"
mkdir -p "$DL"; cd "$DL"
pip install --quiet --break-system-packages onnxruntime numpy scipy lxml pillow 2>/dev/null || pip install --quiet onnxruntime numpy scipy lxml pillow
[ -f kokoro-v1.0.onnx ] || curl -sfL -o kokoro-v1.0.onnx https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/kokoro-v1.0.onnx
[ -f voices-v1.0.bin ] || curl -sfL -o voices-v1.0.bin https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/voices-v1.0.bin
[ -d repo ] || git clone --depth 1 -q https://github.com/thewh1teagle/kokoro-onnx repo
[ -d cmud ] || git clone --depth 1 -q https://github.com/cmusphinx/cmudict cmud
ls -la "$DL"; echo "Kokoro ready in $DL (export KOKORO_DIR=$DL if not using the default)"
