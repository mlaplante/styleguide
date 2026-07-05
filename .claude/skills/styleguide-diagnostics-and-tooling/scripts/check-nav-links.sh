#!/bin/sh
# check-nav-links.sh
#
# src/data/nav.ts is the single source of truth for the sidebar AND the
# landing-page card grid. This checks both directions:
#   1. dead link  — an href in nav.ts's `nav` array with no matching
#      src/pages/<href>.astro file.
#   2. orphan page — a src/pages/**/*.astro file (other than index.astro and
#      404.astro, which are not supposed to be in the sidebar) with no
#      matching href in nav.ts's `nav` array.
#
# Exit code: 0 = every nav href resolves and every page is registered,
#            1 = dead link(s) or orphan(s) found, 2 = usage/setup error.

set -eu

REPO_ROOT="$(cd "$(dirname "$0")/../../../.." && pwd)"
cd "$REPO_ROOT"

NAV_FILE="src/data/nav.ts"
if [ ! -f "$NAV_FILE" ]; then
  echo "check-nav-links.sh: expected file '$NAV_FILE' not found (run from repo root)" >&2
  exit 2
fi
if [ ! -d src/pages ]; then
  echo "check-nav-links.sh: expected directory 'src/pages' not found (run from repo root)" >&2
  exit 2
fi

# Pull every `href: '/...'` string out of the `nav` array (sidebar groups).
# nav.ts also has a `landing` array with its own `href:` fields, but those are
# a curated subset of the same routes for the card grid, not a second
# registry — cross-check against `nav`, not `landing`.
nav_hrefs=$(grep -oE "href: '[^']+'" "$NAV_FILE" | sed -E "s/href: '//; s/'$//" | sort -u)

dead=0
echo "-- checking nav.ts hrefs resolve to a page --"
for href in $nav_hrefs; do
  page="src/pages${href}.astro"
  if [ ! -f "$page" ]; then
    echo "DEAD LINK: nav.ts has '$href' but '$page' does not exist"
    dead=1
  fi
done
[ "$dead" -eq 0 ] && echo "OK — every nav.ts href resolves to a page"

orphan=0
echo ""
echo "-- checking every page is registered in nav.ts --"
pages=$(find src/pages -name '*.astro' | sort)
for p in $pages; do
  # src/pages/foo/bar.astro -> /foo/bar
  href="/$(echo "$p" | sed -E 's#^src/pages/##; s#\.astro$##')"
  case "$href" in
    /index|/404) continue ;; # not sidebar pages by design
  esac
  if ! echo "$nav_hrefs" | grep -qx "$href"; then
    echo "ORPHAN PAGE: '$p' has no matching href in nav.ts (would be unreachable from the sidebar)"
    orphan=1
  fi
done
[ "$orphan" -eq 0 ] && echo "OK — every page (except index/404) is registered in nav.ts"

if [ "$dead" -eq 0 ] && [ "$orphan" -eq 0 ]; then
  exit 0
else
  echo ""
  echo "check-nav-links.sh: fix by adding/removing the page file or the nav.ts entry so both stay in lockstep — nav.ts is the single source of truth (see styleguide-architecture-contract)."
  exit 1
fi
