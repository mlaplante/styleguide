#!/bin/sh
# check-single-gradient.sh
#
# Flags every linear-gradient()/radial-gradient() in src/, then subtracts the
# one known-canonical declaration: the blog sticky-nav gradient in
# src/styles/components.css (.lp-blog-nav). Anything left over needs a human
# to decide whether it's the same brand gradient reused in a different
# rendering context, or a genuinely new second gradient (a brand non-negotiable
# violation — "one gradient only").
#
# Exit code: 0 = only the canonical gradient exists, 1 = other gradient(s)
# found, 2 = usage/setup error.

set -eu

REPO_ROOT="$(cd "$(dirname "$0")/../../../.." && pwd)"
cd "$REPO_ROOT"

if [ ! -d src ]; then
  echo "check-single-gradient.sh: expected directory 'src' not found (run from repo root)" >&2
  exit 2
fi

CANONICAL_FILE="src/styles/components.css"
CANONICAL_PATTERN='linear-gradient(135deg, var(--lp-ink-2) 0%, var(--lp-blog-blue-700) 100%)'

all_hits=$(grep -rn 'linear-gradient(\|radial-gradient(' src --include='*.astro' --include='*.css' || true)

# Drop the one canonical line (exact file + exact declaration).
other_hits=$(echo "$all_hits" | grep -v "^${CANONICAL_FILE}:.*${CANONICAL_PATTERN}" || true)
other_hits=$(echo "$other_hits" | sed '/^$/d')

if [ -z "$other_hits" ]; then
  echo "check-single-gradient.sh: OK — only the canonical blog-nav gradient exists ($CANONICAL_FILE)"
  exit 0
else
  echo "$other_hits"
  echo ""
  echo "check-single-gradient.sh: gradient(s) found beyond the canonical $CANONICAL_FILE declaration."
  echo "Interpretation: a hit that reuses --lp-blog-blue-* tokens for the SAME .lp-blog-nav component in a different rendering context (e.g. a landing-page preview swatch, or a dark-mode variant) is lower risk but still worth a second look. A hit with new/raw colors (e.g. a second gradient built from neutrals/other tokens) is a real 'one gradient only' violation — gate it through styleguide-change-control."
  exit 1
fi
