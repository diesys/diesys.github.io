#!/usr/bin/env bash
# Start the local dev server. Long-running and interactive, so output is kept raw.
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=shared.sh
source "$SCRIPT_DIR/shared.sh"

pnpm run dev