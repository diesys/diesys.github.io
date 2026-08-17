#!/usr/bin/env bash
# Run astro check only. Output is trimmed via rtk when available.
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=shared.sh
source "$SCRIPT_DIR/shared.sh"

pnpm run check 2>&1 | rtk_filter