#!/bin/sh
# check-single-gradient.sh
#
# Flags every linear-gradient()/radial-gradient() in src/, then subtracts the
# two known-canonical brand gradient motifs:
#   1. the blog sticky-nav "reading mode" gradient in src/styles/components.css
#      (.lp-blog-nav), and
#   2. the portfolio hero "briefing-cover" blueprint grid in
#      src/pages/ui-kits/portfolio.astro (.p-hero, two --lp-grid-line lines).
# Both are sanctioned brand motifs (see laplante-brand-reference). Anything left
# over needs a human to decide whether it's one of those motifs reused in a
# different rendering context, or a genuinely new gradient (a brand
# non-negotiable violation — "gradients are reserved for the two named motifs").
#
# Note: the hero's rotating amber radar sweep is a conic-gradient(), which this
# check does not match (it scans only linear-/radial-gradient) — no whitelist
# entry is needed for it.
#
# Exit code: 0 = only the canonical gradients exist, 1 = other gradient(s)
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

# The hero blueprint grid: two linear-gradient() declarations, both keyed to
# the --lp-grid-line token, in the portfolio UI-kit composition.
HERO_FILE="src/pages/ui-kits/portfolio.astro"
HERO_PATTERN='--lp-grid-line'

all_hits=$(grep -rn 'linear-gradient(\|radial-gradient(' src --include='*.astro' --include='*.css' || true)

# Drop the known-canonical brand gradient lines.
other_hits=$(echo "$all_hits" \
  | grep -v "^${CANONICAL_FILE}:.*${CANONICAL_PATTERN}" \
  | grep -v "^${HERO_FILE}:.*${HERO_PATTERN}" \
  || true)
other_hits=$(echo "$other_hits" | sed '/^$/d')

if [ -z "$other_hits" ]; then
  echo "check-single-gradient.sh: OK — only the two canonical brand gradients exist (blog-nav in $CANONICAL_FILE; hero grid in $HERO_FILE)"
  exit 0
else
  echo "$other_hits"
  echo ""
  echo "check-single-gradient.sh: gradient(s) found beyond the two canonical brand motifs."
  echo "Interpretation: a hit that reuses --lp-blog-blue-* tokens for the SAME .lp-blog-nav component, or the --lp-grid-line hero grid, in a different rendering context (e.g. a landing-page preview swatch, or a dark-mode variant) is lower risk but still worth a second look. A hit with new/raw colors (a THIRD gradient built from neutrals/other tokens) is a real brand violation — gate it through styleguide-change-control."
  exit 1
fi
