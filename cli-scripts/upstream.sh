#!/usr/bin/env bash
# Upstream template tooling: check for new upstream commits and fast-forward the
# local upstream-sync branch. One script, one cohesive job — both subcommands
# fetch upstream and share the same scaffolding, so they live here as a `case`
# switch rather than in two near-identical files (see AGENTS.md → "Orchestrator
# CLI", one-file-one-job rule).
#
#   upstream.sh status   # read-only: report whether upstream-sync is behind
#   upstream.sh sync     # fast-forward upstream-sync to upstream/main
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=shared.sh
source "$SCRIPT_DIR/shared.sh"

# Refresh the upstream remote-tracking ref; both subcommands need it.
git fetch upstream --quiet

case "${1:-}" in
  status)
    # Commits upstream/main has that upstream-sync doesn't (behind) and vice
    # versa (ahead — defensive: upstream-sync should never be ahead).
    behind=$(git rev-list --count upstream-sync..upstream/main)
    ahead=$(git rev-list --count upstream/main..upstream-sync)

    if [ "$behind" = "0" ] && [ "$ahead" = "0" ]; then
      echo "upstream-sync is up to date with upstream/main."
    elif [ "$behind" = "0" ]; then
      echo "upstream-sync is $ahead commit(s) ahead of upstream/main (unexpected)."
    else
      echo "upstream-sync is $behind commit(s) behind upstream/main."
      echo "Run: ./portfolio-cli upstream sync"
      if [ "$ahead" != "0" ]; then
        echo "Warning: upstream-sync is also $ahead commit(s) ahead (diverged)."
      fi
    fi
    ;;
  sync)
    # If the working tree is dirty we must switch branches, so ask first
    # (shared.sh confirm(): gum-backed, read -p fallback). Clean tree → silent.
    if [ -n "$(git status --porcelain)" ]; then
      confirm "Working tree not clean — switch branches to update upstream-sync anyway?" || {
        echo 'Sync aborted.'
        exit 0
      }
    fi

    # Record the current branch so we can restore it after the fast-forward.
    current="$(git rev-parse --abbrev-ref HEAD)"
    trap 'git checkout --quiet "$current" 2>/dev/null || true' EXIT

    git checkout --quiet upstream-sync
    git merge --ff-only upstream/main
    echo "upstream-sync is now at upstream/main."
    ;;
  *)
    echo "Usage: upstream.sh {status|sync}" >&2
    exit 1
    ;;
esac