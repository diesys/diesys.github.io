#!/usr/bin/env bash
# Shared logic for portfolio-cli and its cli-scripts/*.sh — the single home for
# anything reused across scripts (menu rendering, selection, confirm prompts,
# gum/rtk detection, the "equivalent command" echo). Never duplicate it.

# --- Optional tool detection (once, reused everywhere) ---
# gum and rtk are enhancements, never requirements: scripts must work without
# them. Detection is centralized here so no script re-implements `command -v`.
command -v gum >/dev/null 2>&1 && GUM_AVAILABLE=1 || GUM_AVAILABLE=0
command -v rtk >/dev/null 2>&1 && RTK_AVAILABLE=1 || RTK_AVAILABLE=0

# --- confirm() — yes/no prompt ---
# gum confirm when available, plain read -p fallback otherwise. One helper, two
# backends: call sites never branch on gum themselves.
confirm() {
  local prompt="$1" answer
  if [ "$GUM_AVAILABLE" = "1" ]; then
    gum confirm "$prompt"
    return $?
  fi
  printf '%s [y/N] ' "$prompt"
  read -r answer
  case "$answer" in
    y | Y | yes | Yes | YES) return 0 ;;
    *) return 1 ;;
  esac
}

# --- render_menu — format registry lines (key|label|desc) from stdin ---
# Used for the top-level menu, submenus, and search results alike — one code
# path for every level, no separate menu renderer per menu.
render_menu() {
  local key label desc
  while IFS='|' read -r key label desc; do
    [ -z "$key" ] && continue
    printf '  %-12s %s (%s)\n' "$key" "$label" "$desc"
  done
}

# --- pick_from_menu <lines> — interactive selection from registry lines ---
# Prints the chosen key to stdout. gum choose backed when available, plain
# numbered list otherwise. The chosen key maps to cli-scripts/<key>.sh by
# convention (see AGENTS.md — the handler is never written down).
# The registry lines arrive as $1 (not stdin) so the user's choice can still be
# read from stdin — the terminal — without colliding with the data.
pick_from_menu() {
  local -a keys=() labels=()
  local key label desc chosen i n
  while IFS='|' read -r key label desc; do
    [ -z "$key" ] && continue
    keys+=("$key")
    labels+=("$label ($desc)")
  done <<<"$1"

  if [ "${#keys[@]}" = "0" ]; then
    echo 'No commands available.' >&2
    return 1
  fi

  if [ "$GUM_AVAILABLE" = "1" ]; then
    chosen="$(printf '%s\n' "${labels[@]}" | gum choose --header='Pick a command:')" || return 1
    for i in "${!labels[@]}"; do
      if [ "${labels[$i]}" = "$chosen" ]; then
        printf '%s\n' "${keys[$i]}"
        return 0
      fi
    done
    return 1
  fi

  n="${#keys[@]}"
  for i in "${!labels[@]}"; do
    printf '  %2d) %s\n' "$((i + 1))" "${labels[$i]}" >&2
  done
  while :; do
    printf 'Select 1-%d (q to quit): ' "$n" >&2
    read -r chosen
    case "$chosen" in
      q | Q) return 1 ;;
      '' | *[!0-9]*) echo 'Invalid selection.' >&2 ;;
      *)
        if [ "$chosen" -ge 1 ] 2>/dev/null && [ "$chosen" -le "$n" ] 2>/dev/null; then
          printf '%s\n' "${keys[$((chosen - 1))]}"
          return 0
        fi
        echo 'Selection out of range.' >&2
        ;;
    esac
  done
}

# --- search_commands <query> — filter registry lines from stdin ---
# Plain grep -i over the registry, matching label and description. Works across
# the whole registry regardless of menu grouping.
search_commands() {
  local query="$1"
  local line key label desc
  while IFS='|' read -r key label desc; do
    [ -z "$key" ] && continue
    if printf '%s %s' "$label" "$desc" | grep -qi -- "$query"; then
      printf '%s|%s|%s\n' "$key" "$label" "$desc"
    fi
  done
}

# --- rtk_filter — trim verbose output through rtk when available ---
# Pipes stdin through `rtk pipe` to cut token-heavy output (build/check logs);
# plain cat fallback when rtk isn't installed. Never a hard dependency.
rtk_filter() {
  if [ "$RTK_AVAILABLE" = "1" ]; then
    rtk pipe
  else
    cat
  fi
}

# --- print_equivalent <key> — echo the direct CLI invocation ---
# Printed by the dispatch logic before any command runs, so navigating the menu
# and running ./portfolio-cli <key> are visibly the same thing.
print_equivalent() {
  echo "Equivalent: ./portfolio-cli $1"
}
