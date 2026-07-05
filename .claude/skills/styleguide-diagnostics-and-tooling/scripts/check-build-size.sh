#!/bin/sh
# check-build-size.sh
#
# Runs `npm run build` and asserts the resulting dist/ stays under a size
# threshold (KB). Catches an accidental huge asset (unoptimized image, a
# font format added without subsetting, a debug bundle) before it ships to
# Cloudflare Pages.
#
# As of 2026-07-05 a clean build is 24 pages, ~492K total. Threshold below
# (1024K) gives ~2x headroom over that baseline — re-tune it deliberately
# (through styleguide-change-control) if the site legitimately grows, don't
# just raise the number to make a red run green.
#
# Exit code: 0 = build succeeded and dist/ is under threshold,
#            1 = build failed OR dist/ is over threshold, 2 = usage/setup error.

set -eu

REPO_ROOT="$(cd "$(dirname "$0")/../../../.." && pwd)"
cd "$REPO_ROOT"

THRESHOLD_KB=1024

if [ ! -f package.json ]; then
  echo "check-build-size.sh: expected 'package.json' not found (run from repo root)" >&2
  exit 2
fi

echo "-- running npm run build --"
if ! npm run build; then
  echo ""
  echo "check-build-size.sh: build FAILED — fix the build before size means anything."
  exit 1
fi

if [ ! -d dist ]; then
  echo "check-build-size.sh: build reported success but 'dist/' is missing" >&2
  exit 2
fi

size_kb=$(du -sk dist | cut -f1)
echo ""
echo "dist/ size: ${size_kb}K (threshold: ${THRESHOLD_KB}K)"

if [ "$size_kb" -le "$THRESHOLD_KB" ]; then
  echo "check-build-size.sh: OK — dist/ is under threshold"
  exit 0
else
  echo "check-build-size.sh: dist/ (${size_kb}K) exceeds the ${THRESHOLD_KB}K threshold. Find what grew: 'du -sh dist/_astro/*' | sort -h, check for a new unsubsetted font/image, then decide via styleguide-change-control whether to trim the asset or deliberately raise the threshold."
  exit 1
fi
