#!/bin/bash
# Resize images proportionally so they are at most MAX_WIDTH pixels wide.
# Usage:
#   ./scripts/resize-images.sh                # resize all images in images/
#   ./scripts/resize-images.sh file1.jpg ...   # resize specific files
# Images are modified in place; files already within the limit are skipped.

set -euo pipefail

MAX_WIDTH="${MAX_WIDTH:-1600}"
ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
IMAGES_DIR="$ROOT_DIR/images"

if [ "$#" -gt 0 ]; then
  files=("$@")
else
  files=("$IMAGES_DIR"/*.{jpg,jpeg,png,webp})
fi

for file in "${files[@]}"; do
  [ -f "$file" ] || continue
  width=$(sips -g pixelWidth "$file" | awk '/pixelWidth/ {print $2}')
  if [ "$width" -le "$MAX_WIDTH" ]; then
    echo "skip  $file (${width}px wide, within limit)"
    continue
  fi
  sips --resampleWidth "$MAX_WIDTH" "$file" >/dev/null
  new_width=$(sips -g pixelWidth "$file" | awk '/pixelWidth/ {print $2}')
  new_height=$(sips -g pixelHeight "$file" | awk '/pixelHeight/ {print $2}')
  echo "ok    $file (${width}px -> ${new_width}x${new_height})"
done
