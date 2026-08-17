# AGENTS.md

This file guides any agent (including Claude Code) working on this repository: a UI/UX
developer & designer portfolio site, built with Astro.

## Golden rules

These rules override convenience in every other section of this file.

- **DRY — Don't Repeat Yourself.** Never duplicate logic across two places (e.g. the
  same command written once for a "gum path" and once for a "bash path", the same list
  of steps copy-pasted into two scripts, the same value hardcoded in multiple files).
  If two things need to happen the same way, write it once and call it from both places.
  When editing `cli-scripts/`, check whether existing logic can be reused before writing
  new logic.
- **Don't edit or delete unless explicitly asked for.** Never modify, refactor, rename,
  reorganize, or delete existing files, scripts, content, or configuration that isn't
  part of the current task — even if it looks improvable, outdated, or redundant. Flag
  it to the user instead of touching it. This applies to code, content, and to
  `cli-scripts/` itself: don't "clean up" a script you weren't asked to touch.
- **Don't over-engineer.** DRY and modularity are goals, not excuses to add abstraction,
  configuration, or indirection beyond what the task actually needs. Prefer the simplest
  structure that avoids real duplication over a more "flexible" one that solves problems
  that don't exist yet. When it's genuinely unclear whether something warrants more
  structure (a new shared helper, a new abstraction layer, splitting a script into
  several) versus keeping it simple and direct, **stop and ask the user** rather than
  guessing — this is exactly the kind of judgment call that's cheap to ask about and
  expensive to get wrong.
- **Comments and file content are always in English.** Every file written to the repo —
  code, comments, scripts, commit messages, `README.md`, this file, `TASKS.md` — is
  always in English, no exceptions. Code must be meaningfully commented (why, not just
  what) in English. Conversation with the user can be in Italian or English, the user's
  choice — this rule only applies to what gets written to files.

## Project stack

- **Framework**: Astro (base: [BracoZS/astro-starter-portfolio](https://github.com/BracoZS/astro-starter-portfolio) template)
- **Package manager**: **pnpm** — never use `npm` or `yarn`. Every command, script
  example, and instruction in the README must use `pnpm`.
- **Styling**: Tailwind CSS v4 (CSS-first, `@theme` in `src/styles/global.css`) — **do
  not migrate to v3, do not introduce a `tailwind.config.js`**.
- **TypeScript**: strict mode, as shipped by the template. Do not loosen `tsconfig.json`.
- **Content**: Astro Content Collections (`src/content/work/*.md`) with a Zod schema in
  `src/content.config.ts`. Every project (commissioned, personal, company) is a Markdown
  file in this collection.
- **Hosting/Deploy**: GitHub Pages on `<username>.github.io` (user site, no custom domain
  attached to the repo), automatic deploy on push to `main` via GitHub Actions.
- **Code origin**: this repo is the user's **personal GitHub fork** of
  [BracoZS/astro-starter-portfolio](https://github.com/BracoZS/astro-starter-portfolio).
  The git history and fork relationship must be kept as-is — never reinitialize the git
  repo from scratch. The original `LICENSE` file (MIT) stays in the root; the README
  includes a credit line to the source.
- **Orchestrator CLI**: `portfolio-cli` is the main entry point for working on this repo
  — see "Orchestrator CLI" section below. Prefer it over raw commands whenever an action
  it covers applies.

## Orchestrator CLI

This repo has a single, unified command-line entry point: **`portfolio-cli`**, an
executable at the repo root, backed by a **`cli-scripts/`** folder containing one script
per cohesive job (modular — a script may expose closely-related subcommands via a
`case` switch).

### Why this exists

A single interface for everything that matters for this repo (builds, deploy, upstream
checks, formatting, and anything added later) so nothing gets forgotten and there's one
place to look instead of having to remember a growing list of loose commands and tool
invocations.

### Structure

```
portfolio-cli              # executable entry point at repo root, dispatches to cli-scripts/
cli-scripts/
  shared.sh                # shared logic: menu rendering, search/filter, gum/rtk
                            # detection, confirm() helper, "equivalent command" echo —
                            # ANY logic reused across scripts belongs here, not copied
  astro.sh                 # local dev commands (dev/build/preview/check/format), one
                            # `case` switch on a subcommand — they share scaffolding
  deploy.sh                # trigger/verify deploy (push to main, or check GH Actions status)
  upstream-sync.sh          # fetch upstream, fast-forward the upstream-sync branch
  upstream-status.sh        # show if upstream has new commits not yet synced
  new-project.sh            # scaffold a new Markdown file in src/content/work/ with the
                             # right frontmatter shape (see content collection schema)
```

This list is a starting point, not fixed — see "Keeping it up to date" below.

### Command registry: key, label, description

Every leaf command (an entry that maps to a real `cli-scripts/*.sh` file) is declared in
**one place**, as one line of `key|label|description`, in a plain text registry variable
in `portfolio-cli`. This keeps the three pieces of information about a command — its
key, its short menu label, and its longer description shown in parentheses — always
together and never duplicated elsewhere.

```bash
# example shape — one line per command, "|"-delimited.
# The key's first word is the script name; the rest is an optional subcommand.
astro dev|Dev server|Start the local dev server on :4321
astro build|Build|Type-check and build the site to ./dist/
deploy|Deploy|Run pre-deploy checks and push to main
```

**The handler is never written down as a separate field.** It's found by convention:
the key's first word is the script name and the rest is an optional subcommand, so
`astro dev` maps to `cli-scripts/astro.sh` invoked as `astro.sh dev`, while `deploy`
maps to `cli-scripts/deploy.sh`. Renaming a script means renaming its key to match —
there is nothing else to keep in sync, and nothing to accidentally mismatch. Do not add
a fourth "handler path" field to the registry; that would duplicate information already
implied by the key.

Because the registry is plain text (not bash arrays or functions), **searching/filtering
by content is a plain `grep -i` over the registry lines** — matching against both the
label and the description. Keep it this simple; don't reach for `fzf` or another
dependency unless the user asks for it.

### Nested menus / submenus

A submenu is just another registry list, grouped logically, rendered by the exact same
menu-rendering function in `shared.sh` (no separate code path for "top-level menu" vs
"submenu" — that would violate DRY). For example:

- Top-level menu shows grouped entries like "Local dev" and "Upstream", each of which
  opens its own submenu.
- The "Local dev" submenu lists `astro dev`, `astro build`, `astro preview`,
  `astro check`, `astro format`.
- The "Upstream" submenu lists `upstream-sync`, `upstream-status`, and any future
  upstream-related command — this submenu exists specifically so more upstream-related
  commands can be added later without cluttering the top-level menu (see Task for
  upstream tooling in TASKS.md).

Keep nesting to a maximum of one level deep (top-level → submenu → command) unless the
user explicitly asks for more — deeper nesting adds navigation friction for little
benefit at this project's size (see "Don't over-engineer" golden rule).

### Showing the equivalent direct command

Every time a command is run through the CLI (whether picked from an interactive menu or
passed directly as an argument), **print the equivalent direct invocation** before
running it, e.g.:

```
$ ./portfolio-cli astro build
Equivalent: ./portfolio-cli astro build
```

The point is that navigating menus and running `./portfolio-cli <key>` directly are
always equivalent and the user learns the direct form over time. Implement this once as
a shared helper in `shared.sh`, called by the dispatch logic — not repeated per script.

### Design: bash is the engine, gum is only a skin

- **The actual logic of every action is plain, portable `bash`/`sh`.** Every script must
  work correctly with no dependencies beyond standard Unix tools, so the CLI is fully
  usable in any environment (including inside an agent's sandboxed shell where `gum`
  isn't installed).
- **[gum](https://github.com/charmbracelet/gum) is used only to make the interactive,
  human-facing experience nicer when it's available** — spinners around long-running
  commands (`gum spin -- <command>`), styled confirmations before destructive actions
  (`gum confirm`), styled output (`gum style`), and an interactive menu picker
  (`gum choose`) when browsing commands instead of typing a key directly. Gum wraps a
  command that already works on its own; it must never be the only place logic lives.
- **Never duplicate logic into a "gum version" and a "bash version" of the same action**
  (see DRY golden rule). Detect gum once in `shared.sh` (`command -v gum`), and have each
  script's core logic be a single code path that optionally gets a gum wrapper around
  output/prompts, not two parallel implementations.
- Concretely: if a script needs to ask "proceed? y/n", write it as a small helper in
  `shared.sh` that uses `gum confirm` when available and falls back to `read -p` when not
  — one call site in the script, one helper, two possible backends.

### Rules for the agent

- **Prefer `portfolio-cli` over raw commands** for anything it already covers (builds,
  deploy, checks, upstream sync, etc.). Use raw `pnpm`/`git` commands directly only for
  one-off things genuinely outside the CLI's scope.
- **When a task in `TASKS.md` introduces a new recurring action** (a new build step, a
  new check, a new deploy variant, anything you'd otherwise expect the user to have to
  remember as a separate command), **add a corresponding script to `cli-scripts/`, a
  registry line, and wire it into the right menu (top-level or submenu)** as part of
  that task, so the CLI stays the single source of truth over time.
- Keep each script in `cli-scripts/` focused on one **cohesive job**. Distinct,
  unrelated actions still get their own script (`deploy.sh`, `new-project.sh`, …). But
  a group of closely-related commands that share the same scaffolding — e.g. the
  local-dev `pnpm run` wrappers — may live in one script as a `case` switch on a
  subcommand (`astro.sh dev`, `astro.sh build`, …). Don't grow a script to cover
  multiple _unrelated_ jobs.
- Any logic that ends up needed by more than one script (menu rendering, search,
  confirm prompts, gum/rtk detection, the "equivalent command" echo, anything else)
  belongs in `shared.sh` — never copy it between scripts.
- Every script must support being run non-interactively (no hard dependency on a TTY or
  on gum being present), since the agent itself may need to invoke these scripts.
- Keep the registry and the submenu grouping as simple as the project actually needs
  (see "Don't over-engineer" golden rule) — if unsure whether something warrants a new
  submenu, a new shared helper, or more structure, ask the user first.

### Keeping it up to date

The CLI is meant to grow with the project. Whenever a new tool, workflow, or repeated
manual step becomes useful (e.g. a new lint tool, a new deploy target, a Lighthouse
check), evaluate whether it belongs in `portfolio-cli`/`cli-scripts/` rather than being a
one-off command mentioned only in a task or in conversation. If it does, add it and
update this section's script list above to reflect the new addition.

### rtk (rust token killer)

If **`rtk`** is present on the system (`command -v rtk`), it must **always** be used
wherever it applies (e.g. reducing/processing token-heavy output, logs, or other places
`rtk` is suited for) — this applies both inside `cli-scripts/` and in the agent's own
direct shell usage outside the CLI. Do not skip it silently if it's available; if it's
not installed, proceed without it.

## Branching strategy (for potential upstream contributions)

The user may want to contribute generic fixes/improvements back to the upstream template
in the future. To keep that possible without ever having to untangle personal work from
generic work later, follow this structure from the start:

- **`main`** — the user's actual site: content, personal customizations, everything
  specific to this portfolio. This is the branch that gets deployed.
- **`upstream-sync`** — a mirror of the original template's `main` branch. Never edit
  this branch by hand; it only ever gets fast-forwarded from `upstream`.
- **`feature/*`** — short-lived branches for changes that are generic enough to
  potentially be proposed upstream (e.g. a bug fix in a shared component, an
  accessibility improvement, a general enhancement not tied to the user's personal
  content or branding).

Practical workflow:

1. Add the original template as a second remote (in addition to `origin`, which is the
   user's fork):
   ```bash
   git remote add upstream https://github.com/BracoZS/astro-starter-portfolio.git
   ```
2. To sync with upstream changes:
   ```bash
   git fetch upstream
   git checkout upstream-sync
   git pull upstream main
   ```
3. When a change is generic (not specific to the user's personal site) and could be
   useful to anyone using the template:
   - Branch off `upstream-sync`, not `main`:
     ```bash
     git checkout -b feature/short-description upstream-sync
     ```
   - Make only that isolated change on this branch — no personal customizations mixed in.
   - This branch is what would be opened as a PR against the upstream repo (the user
     handles opening the actual PR; the agent's job is to keep the branch clean and
     ready).
   - Cherry-pick the same commit(s) onto `main` so the user's own site also gets the fix
     without waiting for the upstream PR to be merged.
4. Purely personal work (content, branding, site-specific components like Letter Glitch,
   the contact form, design tokens, etc.) always happens directly on `main` (or a regular
   short-lived branch off `main`) — it never needs to go through `upstream-sync`.

This structure only needs to be actively used when a genuinely generic change comes up.
Day-to-day work on personal content and features happens normally on `main`.

## Working through TASKS.md

**Main rule: one task at a time.**

- Work on a single task from `TASKS.md` at a time. When done, stop, summarize what was
  done, and **wait for explicit user confirmation** before moving to the next task.
- Do not get ahead of yourself or "batch" multiple tasks together, even if they seem
  related or quick.
- If a task has listed sub-steps, you can execute them in sequence without stopping
  between each sub-step, but always stop at the end of the whole task.
- When starting a task, announce it explicitly (e.g. "Starting Task 3: ...").
- When completing a task, update `TASKS.md` by checking the checkbox (`- [x]`) and add,
  if relevant, a short note under the task (e.g. decisions made, files touched, commands
  run) before stopping.

## When to stop and ask

Beyond the pause between tasks, stop **during** a task and ask if:

- You need to make an architectural decision not specified in TASKS.md (e.g. which
  library to choose among equivalent alternatives).
- A task requires credentials, IDs, API keys, or external accounts not yet provided —
  leave a clearly commented placeholder (e.g. `YOUR_FORM_ID_HERE`) and flag it, don't
  block waiting, unless the task explicitly requires it.
- You notice that completing the task as described would break something already
  working.
- A command fails for reasons that aren't a simple typo/syntax error.

## Code conventions

- Astro components in `src/components/`, PascalCase (`WorkRow.astro`, `ThemeToggle.astro`).
- Interactive islands (React) in a dedicated subfolder, e.g. `src/components/react/`, to
  clearly distinguish them from static `.astro` components.
- Always use the lightest Astro client directive suitable for each island (prefer
  `client:visible` over `client:load` when immediate interactivity on page load isn't
  needed).
- Path alias `@/*` already configured in `tsconfig.json` — use it instead of deep
  relative imports (`../../../`).
- Every new portfolio project is added as a Markdown file in `src/content/work/`, never
  hardcoded in a `.astro` component.
- Keep the Zod schema (`src/content.config.ts`) as the source of truth for required/
  optional frontmatter fields. If you add a field (e.g. `type: "commissioned" |
"personal" | "company"`), update the schema first, then existing files.

## Formatting and linting

- **Prettier is the project's standard, final.** Run `pnpm run format` before every
  commit.

## Useful commands

Prefer `portfolio-cli` (see "Orchestrator CLI" above) for these. Raw `pnpm` commands
below are what the CLI scripts call under the hood, and remain valid for one-off use:

```bash
./portfolio-cli astro dev     # → cli-scripts/astro.sh dev     → pnpm run dev
./portfolio-cli astro build   # → cli-scripts/astro.sh build   → pnpm run build
./portfolio-cli astro preview # → cli-scripts/astro.sh preview → pnpm run preview
./portfolio-cli astro check   # → cli-scripts/astro.sh check   → pnpm run check
./portfolio-cli astro format  # → cli-scripts/astro.sh format  → pnpm run format
./portfolio-cli deploy        # → cli-scripts/deploy.sh
./portfolio-cli upstream-sync # → cli-scripts/upstream-sync.sh
```

```bash
pnpm install          # install dependencies
pnpm run dev           # local dev server
pnpm run build         # type-check + production build into ./dist/
pnpm run preview       # preview the build
pnpm run check         # astro check only
pnpm run format        # Prettier
```

## Deploy

- The site is published on **`<username>.github.io`** (GitHub Pages "user site", root
  domain, no custom domain attached to the repo):
  - `astro.config.mjs` → `site` must be `https://<username>.github.io`, **no `base`**
    (it's a user/org site, not a project site with a sub-path).
  - **No `public/CNAME` file** — it must not be created, since there's no custom domain
    attached on the GitHub Pages side.
  - Redirecting an optional personal domain to `<username>.github.io` is handled by the
    user at the DNS/provider level (permanent 301 redirect), **outside the scope of this
    repo and of the agent**.
- Deploy is automatic on push to `main` via GitHub Actions
  (`.github/workflows/deploy.yml`), which builds with pnpm and publishes to GitHub Pages.
- Never commit `dist/` or `node_modules/` — verify they're in `.gitignore`.

## What NOT to do

- Do not introduce a CMS, state management library, or UI kit unless explicitly
  requested in a task (consistent with the minimal philosophy of the starting template).
- Do not move from Tailwind v4 to v3.
- Do not use `npm`/`yarn` in commands, scripts, or documentation.
- Do not add a contact form with a specific service until the user explicitly decides
  (see TASKS.md — this task is open across multiple options).
- Do not make automatic commits/pushes to `main` without the user explicitly requesting
  it for that task.
- Do not create `public/CNAME` or set `base` in `astro.config.mjs` (the site is served
  from `<username>.github.io`, not from a custom domain attached to the repo).
- Do not edit `upstream-sync` by hand, and do not mix personal customizations into
  `feature/*` branches meant for potential upstream contribution.
- Do not duplicate the same logic in multiple scripts or files (DRY golden rule) —
  reuse `cli-scripts/shared.sh` helpers instead of re-implementing them.
- Do not edit, refactor, rename, or delete existing files/scripts/content that aren't
  part of the current task, even if they look improvable (see golden rules above).
- Do not write a "gum version" and a separate "bash version" of the same
  `cli-scripts/` action — one code path, gum as an optional wrapper only.
- Do not skip `rtk` when it's available and applicable — see "rtk" section above.
- Do not add a "handler path" field to the command registry — the handler is always
  `cli-scripts/<first-word-of-key>.sh` by convention, never written down separately.
- Do not add abstraction, configuration, or new shared helpers "for the future" without
  a concrete current need — ask the user first if unsure (see "Don't over-engineer"
  golden rule).
- Do not write comments, scripts, or any committed file content in Italian — always
  English (see golden rules above). This doesn't apply to conversation with the user.
