#!/bin/sh
# check-hardcoded-colors.sh
#
# Flags raw hex (#abc / #aabbcc) and rgb()/rgba() literals used as CSS VALUES
# (inside a <style> block or a style="..." attribute) in src/pages/ and
# src/components/. Themed values must use var(--lp-*) instead.
#
# Deliberately does NOT flag hex literals sitting in plain JS/TS data (e.g.
# the { hex: '#3F51B5' } swatch-catalog arrays in src/pages/colors/*.astro) —
# those pages exist specifically to document hex values as content, not to
# style themselves with them. Restricting the match to <style>/style="" scope
# avoids that false-positive class.
#
# Exit code: 0 = clean, 1 = violations found, 2 = usage/setup error.

set -eu

REPO_ROOT="$(cd "$(dirname "$0")/../../../.." && pwd)"
cd "$REPO_ROOT"

TARGETS="src/pages src/components"
for d in $TARGETS; do
  if [ ! -d "$d" ]; then
    echo "check-hardcoded-colors.sh: expected directory '$d' not found (run from repo root)" >&2
    exit 2
  fi
done

violations=0

# shellcheck disable=SC2044
for f in $(find $TARGETS -name '*.astro' | sort); do
  hits=$(awk '
    /<style/ { instyle=1 }
    /<\/style>/ { instyle=0; next }
    {
      inline = ($0 ~ /style="/)
      if ((instyle || inline) && ($0 ~ /#[0-9A-Fa-f]{3}([0-9A-Fa-f]{3,5})?([^0-9A-Fa-f]|$)/ || $0 ~ /rgba?\(/)) {
        print FNR ": " $0
      }
    }
  ' "$f")
  if [ -n "$hits" ]; then
    violations=1
    echo "== $f =="
    echo "$hits" | sed 's/^/  /'
  fi
done

if [ "$violations" -eq 0 ]; then
  echo "check-hardcoded-colors.sh: OK — no raw hex/rgb() found in <style>/style=\"\" scope under $TARGETS"
  exit 0
else
  echo ""
  echo "check-hardcoded-colors.sh: violations found above. Replace raw hex/rgb() with var(--lp-*) tokens from src/styles/global.css, or confirm with styleguide-change-control that the raw value is an intentional, reviewed exception."
  exit 1
fi
