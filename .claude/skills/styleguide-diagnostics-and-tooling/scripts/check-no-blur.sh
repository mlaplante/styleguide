#!/bin/sh
# check-no-blur.sh
#
# Flags backdrop-filter or filter: blur(...) anywhere under src/ — the brand
# non-negotiable is "no backdrop-filter/blur anywhere."
#
# Exit code: 0 = clean, 1 = violations found, 2 = usage/setup error.

set -eu

REPO_ROOT="$(cd "$(dirname "$0")/../../../.." && pwd)"
cd "$REPO_ROOT"

if [ ! -d src ]; then
  echo "check-no-blur.sh: expected directory 'src' not found (run from repo root)" >&2
  exit 2
fi

hits=$(grep -rn 'backdrop-filter\|blur(' src --include='*.astro' --include='*.css' --include='*.ts' || true)

if [ -z "$hits" ]; then
  echo "check-no-blur.sh: OK — no backdrop-filter/blur() found under src/"
  exit 0
else
  echo "$hits"
  echo ""
  echo "check-no-blur.sh: violations found above. backdrop-filter/blur is a brand non-negotiable — do not introduce it. Gate any exception through styleguide-change-control."
  exit 1
fi
