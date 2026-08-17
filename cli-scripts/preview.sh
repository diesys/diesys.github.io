#!/usr/bin/env bash
# Preview the production build locally. Long-running and interactive, so output
# is kept raw.
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=shared.sh
source "$SCRIPT_DIR/shared.sh"

pnpm run preview