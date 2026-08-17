#!/usr/bin/env bash
# Type-check and build the site into ./dist/. Verbose output is trimmed via
# rtk when available to keep the log token-light.
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=shared.sh
source "$SCRIPT_DIR/shared.sh"

pnpm run build 2>&1 | rtk_filter