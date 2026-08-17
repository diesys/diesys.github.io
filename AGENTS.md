# AGENTS.md

This file guides any agent (including Claude Code) working on this repository: a UI/UX
developer & designer portfolio site, built with Astro.

## Project stack

- **Framework**: Astro (base: [BracoZS/astro-starter-portfolio](https://github.com/BracoZS/astro-starter-portfolio) template)
- **Package manager**: **pnpm** — never use `npm` or `yarn`. Every command, script
  example, and instruction in the README must use `pnpm`.
- **Styling**: Tailwind CSS v4 (CSS-first, `@theme` in `src/styles/global.css`) — **do
  not migrate to v3, do not introduce a `tailwind.config.js`**.
- **Linting/Formatting**: Prettier, final choice — Biome was evaluated and dropped (see
  "Formatting and linting" section below).
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
- **Biome**: evaluated and dropped — support for `.astro` files isn't mature enough. Do
  not re-propose the migration unless the user explicitly asks again in the future.

## Useful commands (pnpm)

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
- Do not re-propose Biome as a Prettier replacement (already evaluated and dropped for
  insufficient `.astro` support).
- Do not create `public/CNAME` or set `base` in `astro.config.mjs` (the site is served
  from `<username>.github.io`, not from a custom domain attached to the repo).
- Do not edit `upstream-sync` by hand, and do not mix personal customizations into
  `feature/*` branches meant for potential upstream contribution.
