#!/usr/bin/env bash
# Scaffold a new project Markdown file in src/content/work/ with the correct
# frontmatter shape (see src/content.config.ts), including the `type` enum.
# Run interactively to be asked for each field, or non-interactively via flags —
# defaults apply for anything not supplied, so scripts and the agent can call
# this without a TTY.
#
#   new-project.sh <slug> [--type TYPE] [--title TITLE] [--summary SUMMARY]
#                   [--role ROLE] [--tags a,b,c] [--publish] [--featured] [--force]
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=shared.sh
source "$SCRIPT_DIR/shared.sh"

WORK_DIR="$SCRIPT_DIR/../src/content/work"

# ask <var> <prompt> <default> — fill a variable from gum input when interactive
# (stdin is a TTY), falling back to read -p; when stdin isn't a TTY the default
# is used without prompting. Same gum-is-only-a-skin rule as shared.sh confirm().
ask() {
  local var="$1" prompt="$2" default="$3" answer
  if [ ! -t 0 ]; then
    printf -v "$var" '%s' "$default"
    return 0
  fi
  if [ "$GUM_AVAILABLE" = "1" ]; then
    answer="$(gum input --prompt "$prompt: " --value "$default")"
  else
    printf '%s [%s]: ' "$prompt" "$default"
    read -r answer
  fi
  [ -n "$answer" ] || answer="$default"
  printf -v "$var" '%s' "$answer"
}

slug=''
type='personal'
title=''
summary='Project overview — describe the problem, your role, and the outcome.'
role='Role'
tags=''
publish=0
featured=0
force=0

while [ "$#" -gt 0 ]; do
  case "$1" in
    --type) type="$2"; shift 2 ;;
    --title) title="$2"; shift 2 ;;
    --summary) summary="$2"; shift 2 ;;
    --role) role="$2"; shift 2 ;;
    --tags) tags="$2"; shift 2 ;;
    --publish) publish=1; shift ;;
    --featured) featured=1; shift ;;
    --force) force=1; shift ;;
    --*) echo "Unknown option: $1" >&2; exit 1 ;;
    *)
      if [ -z "$slug" ]; then
        slug="$1"
      else
        echo "Unexpected argument: $1" >&2
        exit 1
      fi
      shift
      ;;
  esac
done

# Interactive: prompt for anything not supplied as a flag.
if [ -t 0 ]; then
  ask slug 'Project slug (filename)' "${slug:-my-project}"
  ask type 'Type (commissioned|personal|company)' "$type"
  ask title 'Title' "${title:-$slug}"
  ask summary 'Summary (max 160 chars)' "$summary"
  ask role 'Role' "$role"
  ask tags 'Tags (comma-separated)' "$tags"
fi

# Validate the slug (becomes the filename and URL) and the type enum.
if ! printf '%s' "$slug" | grep -qE '^[a-z0-9]+(-[a-z0-9]+)*$'; then
  echo "Invalid slug: '$slug' (use lowercase letters, digits, and hyphens)" >&2
  exit 1
fi
case "$type" in
  commissioned | personal | company) ;;
  *) echo "Invalid type: '$type' (expected commissioned|personal|company)" >&2; exit 1 ;;
esac

[ -n "$title" ] || title="$slug"
[ -n "$summary" ] || summary='Project overview — describe the problem, your role, and the outcome.'
[ -n "$role" ] || role='Role'

file="$WORK_DIR/$slug.md"
if [ -e "$file" ] && [ "$force" != "1" ]; then
  echo "Refusing to overwrite $file (use --force)." >&2
  exit 1
fi
mkdir -p "$WORK_DIR"

# Comma-separated input → inline YAML array, e.g. "Astro, Design" → [Astro, Design].
# Each item is edge-trimmed so "a, b" doesn't leak its whitespace into the file.
tag_list=''
if [ -n "$tags" ]; then
  IFS=',' read -ra parts <<<"$tags"
  for part in "${parts[@]}"; do
    part="${part#"${part%%[![:space:]]*}"}" # trim leading whitespace
    part="${part%"${part##*[![:space:]]}"}" # trim trailing whitespace
    [ -n "$part" ] || continue
    tag_list="$tag_list, $part"
  done
  [ -n "$tag_list" ] && tag_list="[${tag_list#", "}]"
fi

featured_val=false; [ "$featured" = "1" ] && featured_val=true
draft_val=true; [ "$publish" = "1" ] && draft_val=false

cat > "$file" <<EOF
---
title: $title
summary: $summary
type: $type
role: $role
date: $(date +%F)
tags: ${tag_list:-[]}
featured: $featured_val
draft: $draft_val
---

Project overview — describe the problem, your role, and the outcome.
EOF

echo "Created $file"
