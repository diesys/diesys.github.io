#!/usr/bin/env bash
# Thin wrappers around the local-dev pnpm commands. One script, one cohesive job:
# the commands share the same scaffolding and differ only by a single word, so
# they live here as a `case` switch on a subcommand rather than in N near-identical
# files (see AGENTS.md → "Orchestrator CLI", one-file-one-job rule).
#
#   astro.sh dev|build|preview|check|format
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=shared.sh
source "$SCRIPT_DIR/shared.sh"

case "${1:-}" in
  dev) pnpm run dev ;;
  build) pnpm run build 2>&1 | rtk_filter ;;
  preview) pnpm run preview ;;
  check) pnpm run check 2>&1 | rtk_filter ;;
  format) pnpm run format ;;
  *)
    echo "Usage: astro.sh {dev|build|preview|check|format}" >&2
    exit 1
    ;;
esac
