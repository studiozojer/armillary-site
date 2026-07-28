#!/usr/bin/env bash
#
# deploy-web.sh — build the site and publish it to the studio app box.
#
# The site is a static Astro build: pre-rendered HTML plus hashed assets,
# served by Caddy at armillary.zojer.studio. No CI, no vendor — build,
# rsync, done.
#
# Content comes from the `content/wiki` submodule (studiozojer/armillary-wiki).
# This script updates that pointer first, so publishing new prose is one
# command here after pushing there.
#
# Target box: the Nuremberg app cluster (ubuntu-8gb-nbg1-1), 91.98.204.141 —
# where zhouyi.zojer.studio, admin.zojer.studio and api.kairos.solar already
# terminate. NOTE: the studio's `kairos-vps` ssh alias points at the Hillsboro
# box, not this one, so we target the app box explicitly.
#
# Prereqs (one-time):
#   - SSH access to the app box as root
#   - the Caddy `armillary.zojer.studio` block deployed (scripts/armillary-site.Caddyfile)
#   - DNS A record armillary.zojer.studio -> 91.98.204.141
#
# Usage:
#   scripts/deploy-web.sh              # update content, build, deploy
#   scripts/deploy-web.sh --no-build   # deploy the existing dist/ as-is
#   scripts/deploy-web.sh --pin        # build the pinned submodule commit, don't update it

set -euo pipefail

cd "$(dirname "$0")/.."

REMOTE="${ARMILLARY_WEB_REMOTE:-root@91.98.204.141}"
REMOTE_DIR="${ARMILLARY_WEB_DIR:-/opt/armillary-site/web}"
EXPECTED_ESSAYS="${ARMILLARY_EXPECTED_ESSAYS:-5}"

MODE="${1:-}"

if [[ "$MODE" != "--pin" && "$MODE" != "--no-build" ]]; then
  echo "==> Updating content submodule to origin/main"
  git submodule update --init --remote content/wiki
fi

WIKI_COMMIT=$(git -C content/wiki rev-parse --short HEAD)
echo "==> Wiki content at $WIKI_COMMIT"

if [[ "$MODE" != "--no-build" ]]; then
  echo "==> Building (astro build)"
  rm -rf dist
  npx astro build
fi

if [[ ! -f dist/index.html ]]; then
  echo "!! dist/index.html missing — build did not produce a site" >&2
  exit 1
fi

if [[ ! -f dist/404.html ]]; then
  echo "!! dist/404.html missing — Caddy's error handler would have nothing to serve" >&2
  exit 1
fi

ESSAYS=$(find dist/wiki -mindepth 1 -maxdepth 1 -type d | wc -l | tr -d ' ')
if [[ "$ESSAYS" -ne "$EXPECTED_ESSAYS" ]]; then
  echo "!! expected $EXPECTED_ESSAYS essay pages, found $ESSAYS — aborting" >&2
  echo "   (if an essay was genuinely added or removed, set ARMILLARY_EXPECTED_ESSAYS)" >&2
  exit 1
fi
echo "==> Verified $ESSAYS essay pages"

echo "==> Ensuring remote dir exists: $REMOTE:$REMOTE_DIR"
ssh "$REMOTE" "mkdir -p '$REMOTE_DIR'"

echo "==> Syncing dist/ -> $REMOTE:$REMOTE_DIR"
rsync -avz --delete dist/ "$REMOTE:$REMOTE_DIR/"

echo "==> Deployed wiki@$WIKI_COMMIT. Verify:"
echo "    curl -sI https://armillary.zojer.studio/ | head -1"
echo "    curl -so /dev/null -w '%{http_code}\\n' https://armillary.zojer.studio/no-such-page"
