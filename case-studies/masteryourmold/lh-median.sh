#!/bin/bash
# Median-of-5 Lighthouse, desktop + mobile. Single runs on this site swing ~20 points
# on mobile, so one run is not a number you can publish.
#   URL=https://... OUT=runs-after ./lh-median.sh
set -u
HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
URL="${URL:-https://www.masteryourmold.com/}"
OUT="$HERE/lighthouse/${OUT:-runs}"
RUNS="${RUNS:-5}"
FLAGS='--headless=new --no-sandbox --disable-gpu'

mkdir -p "$OUT"
for form in desktop mobile; do
  PRESET=""
  [ "$form" = "desktop" ] && PRESET="--preset=desktop"
  for i in $(seq 1 "$RUNS"); do
    npx --no-install lighthouse "$URL" $PRESET \
      --output=json --output-path="$OUT/$form-$i.json" \
      --chrome-flags="$FLAGS" --quiet >/dev/null 2>&1
    echo "done $form-$i"
  done
done
echo "ALL RUNS COMPLETE → $OUT"
