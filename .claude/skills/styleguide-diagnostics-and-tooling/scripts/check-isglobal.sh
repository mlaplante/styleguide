#!/bin/sh
# check-isglobal.sh
#
# Flags `<style is:global>` in src/pages/**/*.astro. Astro scoped styles
# (plain `<style>`) hash selectors per-component so they can't leak; is:global
# opts a page out of that safety net.
#
# Exit code: 0 = clean, 1 = violations found, 2 = usage/setup error.

set -eu

REPO_ROOT="$(cd "$(dirname "$0")/../../../.." && pwd)"
cd "$REPO_ROOT"

if [ ! -d src/pages ]; then
  echo "check-isglobal.sh: expected directory 'src/pages' not found (run from repo root)" >&2
  exit 2
fi

hits=$(grep -rn 'is:global' src/pages --include='*.astro' || true)

if [ -z "$hits" ]; then
  echo "check-isglobal.sh: OK — no is:global found in src/pages"
  exit 0
else
  echo "$hits"
  echo ""
  echo "check-isglobal.sh: violations found above. is:global in a page breaks the scoped-style guarantee (README 'Adding a page' rule). If the page needs global scope for a body-class dark-mode toggle or similar, that is a documented exception, not a silent allow — route it through styleguide-change-control."
  exit 1
fi
