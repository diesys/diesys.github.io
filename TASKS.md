# TASKS.md

List of tasks to build the portfolio. **One task at a time**: the agent executes one
task, stops, and waits for confirmation before moving to the next one (see `AGENTS.md`).

---

## Task 1 — Bootstrap from the personal fork of astro-starter-portfolio

The repo has already been **forked on GitHub** by the user from
[BracoZS/astro-starter-portfolio](https://github.com/BracoZS/astro-starter-portfolio)
into their own personal account. The agent works by cloning/using **the user's fork**,
not the original repo, and **keeps the git history and fork relationship as-is** (no
removing `.git`, no reinitializing).

- [x] Clone the user's personal fork (ask for the exact URL if not yet known).
- [x] Add the original template as a second remote named `upstream` (see AGENTS.md →
      "Branching strategy"):
      `bash
git remote add upstream https://github.com/BracoZS/astro-starter-portfolio.git
git fetch upstream
`
- [x] Create the `upstream-sync` branch tracking `upstream/main` (see AGENTS.md for the
      full workflow), for future potential upstream contributions.
- [x] Verify that the original `LICENSE` file (MIT) is present in the root and is not
      removed.
- [x] Add/verify a credit line in `README.md` pointing to the original source, e.g.
      _"Built on top of [astro-starter-portfolio](https://github.com/BracoZS/astro-starter-portfolio)
      by BracoZS, MIT licensed."_
- [x] Convert the project to **pnpm**:
  - Remove any non-pnpm lockfiles.
  - Verify/create `pnpm-workspace.yaml` if needed.
  - `pnpm install` and verify it generates a clean `pnpm-lock.yaml`.
- [x] Verify that `pnpm run dev` works and the site is reachable locally.
- [x] Verify that `pnpm run build` completes without errors (including type-check).
- [x] Update `src/site.config.ts` with clearly marked placeholder data (name, tagline,
      email, social links) to be replaced with the user's real data.
- [x] Update `astro.config.mjs`: set `site` to `https://<username>.github.io` (replace
      `<username>` with the user's real GitHub username — ask if not yet known), no
      `base`.

> **Done 2026-08-17**: repo renamed to `diesys.github.io` on GitHub (user action);
> `origin` remote URL updated locally; `upstream` remote added; `upstream-sync` branch
> created tracking `upstream/main`; README credit line added; `site` set to
> `https://diesys.github.io`. `site.config.ts` still holds John Doe placeholders (user
> asked to defer personal data).

---

## Task 2 — Orchestrator CLI (`portfolio-cli`)

Set up the single-entry-point CLI described in `AGENTS.md` → "Orchestrator CLI", before
building further features on top, so subsequent tasks can wire their own actions into it
as they go.

- [x] Create `cli-scripts/shared.sh` first, with:
  - `command -v gum` and `command -v rtk` detection (once, reused everywhere).
  - `confirm()` — asks yes/no, `gum confirm` backed if available, `read -p` fallback
    otherwise.
  - A menu-rendering function that takes a list of registry lines (`key|label|desc`)
    and prints them formatted (key, label, description in parentheses) — used for both
    the top-level menu and any submenu, no separate code path per level.
  - A search/filter function: given a query string, `grep -i` over the registry lines,
    matching against label and description.
  - The "print the equivalent direct command" helper (e.g. prints
    `Equivalent: ./portfolio-cli <key>`), called once from the dispatch logic before
    running any command.
- [x] Create the `portfolio-cli` executable at the repo root (`chmod +x`), containing:
  - The command registry as plain text, one `key|label|description` line per command
    (see AGENTS.md — no handler path field; the handler is always
    `cli-scripts/<key>.sh` by convention).
  - Grouping of the registry into the top-level menu ("Local dev", "Upstream", plus any
    ungrouped top-level commands) and submenus (see Tasks below for what goes in each).
  - Dispatch logic: given a key, print the equivalent direct command (via the
    `shared.sh` helper), then run `cli-scripts/<key>.sh`.
  - A no-argument case that shows the interactive top-level menu (gum-backed picker via
    `gum choose` if available, plain numbered list otherwise — same single dispatch
    logic underneath either way).
  - A search case (e.g. `./portfolio-cli search <query>`) that filters across the whole
    registry regardless of grouping.
- [x] Create `cli-scripts/dev.sh`, `build.sh`, `preview.sh`, `check.sh`, `format.sh` —
      thin wrappers around the equivalent `pnpm run` commands, and add their
      corresponding registry lines grouped under a "Local dev" submenu.
- [x] Verify every script and the menu/search logic run correctly **both with and
      without `gum` installed** (test by temporarily shadowing `gum` out of `PATH`), and
      confirm there's a single code path per action per the "bash is the engine, gum is
      only a skin" rule in `AGENTS.md` — not two parallel implementations.
- [x] If `rtk` is present on this system, wire it into `shared.sh` so scripts can use it
      wherever applicable (see AGENTS.md → "rtk"); if not present, leave the detection
      in place but don't hard-fail.
- [x] Update `README.md` with a short "CLI" section pointing to `./portfolio-cli` (no
      args, for the interactive menu) and `./portfolio-cli search <query>` as the main
      ways to interact with the repo.

> **Done 2026-08-17**: created `cli-scripts/shared.sh` (gum/rtk detection, `confirm`,
> `render_menu`, `pick_from_menu`, `search_commands`, `rtk_filter`, `print_equivalent`)
> and the `portfolio-cli` dispatcher with a plain-text registry + `SUBMENUS` grouping,
> plus the five Local dev wrapper scripts. Verified search, direct dispatch, and the
> interactive menu both with gum and with gum shadowed out of `PATH` (numbered fallback).
> Two bugs caught during verification: `GROUPS` is a reserved bash variable (renamed to
> `SUBMENUS`), and the numbered fallback was writing menu output to stdout instead of
> stderr (fixed so `$(pick_from_menu ...)` only captures the chosen key).
>
> **Consolidation (follow-up)**: the five near-identical local-dev wrappers were merged
> into one `cli-scripts/astro.sh` with a `case` switch on a subcommand, and the registry
> keys became two-word (`astro dev`, `astro build`, …). Dispatch now derives the handler
> from the key's first word and passes the rest as an argument. AGENTS.md "one file, one
> job" rule and the "handler by convention" wording were updated to match.

---

## Task 3 — CLI: "Upstream" submenu

A dedicated submenu in `portfolio-cli` for anything related to the forked upstream
template, separate from "Local dev" — so more upstream-related commands can be added
later without cluttering the top-level menu (see AGENTS.md → "Branching strategy" for
the underlying git workflow this wraps).

- [ ] Create `cli-scripts/upstream-status.sh`: fetches `upstream` and reports whether
      `upstream-sync` is behind `upstream/main` (i.e. whether there are new upstream
      commits not yet synced) — read-only, makes no changes.
- [ ] Create `cli-scripts/upstream-sync.sh`: fetches `upstream` and fast-forwards the
      local `upstream-sync` branch to `upstream/main` (see AGENTS.md workflow) — asks
      for confirmation (via the `shared.sh` `confirm()` helper) before switching
      branches if the working tree isn't clean.
- [ ] Add both as registry lines grouped under an "Upstream" submenu in `portfolio-cli`.
- [ ] Leave room in this submenu for future related commands (e.g. a helper to branch
      off `upstream-sync` for a new `feature/*`, once that workflow is actually used) —
      don't build those yet, just confirm the submenu structure doesn't need rework to
      add them later.

---

## Task 4 — Content Collection: extend the schema for the 3 project categories

- [ ] Open `src/content.config.ts` and extend the `work` collection's Zod schema by
      adding a field like:
      `ts
type: z.enum(["commissioned", "personal", "company"])
`
- [ ] Update any components that list projects (`WorkRow.astro`, the `work/[id].astro`
      page, the homepage) to display/filter by `type` where relevant.
- [ ] Create 1 example project for each category in `src/content/work/` to verify the
      schema works and the build passes.
- [ ] `pnpm run check` and `pnpm run build` to validate the schema.
- [ ] Add a `cli-scripts/new-project.sh` script wired into `portfolio-cli` that scaffolds
      a new Markdown file in `src/content/work/` with the correct frontmatter shape
      (including `type`), so adding future projects doesn't require remembering the
      schema by hand.

---

## Task 5 — Automatic deploy to GitHub Pages (`username.github.io`)

- [ ] Verify/create the repo with the exact name `<username>.github.io` (GitHub Pages
      requirement for a root/user site) — confirm the correct username with the user.
- [ ] Create `.github/workflows/deploy.yml`: build with pnpm, deploy to GitHub Pages on
      every push to `main`.
- [ ] **Do not create** `public/CNAME` (no custom domain attached to the repo — see
      AGENTS.md).
- [ ] Verify the workflow uses the correct Node/pnpm versions (consistent with
      `package.json` → `engines`).
- [ ] Document in `README.md`, purely for informational purposes, that an optional
      personal domain of the user's can be redirected with a permanent 301 redirect to
      `https://<username>.github.io` at the DNS/provider level — the agent does not
      perform this part, it's left entirely to the user.
- [ ] Add a `cli-scripts/deploy.sh` script wired into `portfolio-cli` (`./portfolio-cli
deploy`) that runs the pre-deploy checks (build + check) and pushes to `main`,
      with a confirmation prompt before pushing (gum-backed if available, per
      `AGENTS.md`).

---

## Task 6 — Add React as an islands framework

- [ ] `pnpm dlx astro add react` (or pnpm equivalent) to integrate the official
      `@astrojs/react` integration.
- [ ] Verify `astro.config.mjs` correctly includes the React integration.
- [ ] Create the `src/components/react/` subfolder for islands (see conventions in
      AGENTS.md).
- [ ] Create a minimal test React component (e.g. a counter or hello-world) and mount it
      on a page with `client:visible` to verify hydration works correctly in both build
      and dev.
- [ ] Remove the test component once verified (or leave it as an example — decide with
      the user at the end of the task).
- [ ] `pnpm run build` to confirm there are no regressions on the rest of the site
      (which should remain zero-JS where islands aren't needed).

---

## Task 7 — Interactive Letter Glitch component

- [ ] Source/adapt the `LetterGlitch` component (inspired by
      [ReactBits.dev](https://www.reactbits.dev/)) as a React component in
      `src/components/react/LetterGlitch.tsx`.
- [ ] Adapt styling/colors to the site's design tokens (`--paper`, `--ink`, `--ink-soft`,
      `--signal`, `--line` in `src/styles/global.css`) — don't leave hardcoded colors
      from the original component.
- [ ] Mount it as an island (`client:visible` recommended, since immediate interactivity
      on first paint likely isn't needed) in a position to be agreed on (e.g. homepage
      hero).
- [ ] Verify performance: the component must not noticeably degrade the homepage's
      Lighthouse score. If it does, flag it before proceeding further.
- [ ] Verify `prefers-reduced-motion`: the component must respect the user's preference
      and disable/reduce the effect if reduced motion is requested.

---

## Task 8 — Contact form (open decision)

The solution for the contact form hasn't been chosen yet. Before implementing,
**present options and let the user choose** among things like:

- Formspree (requires account + form ID)
- Web3Forms (requires access key)
- Netlify Forms (not applicable: the site is on GitHub Pages, not Netlify)
- Simple `mailto:` link (zero external dependencies, less "polished" UX)
- Another service proposed by the user

- [ ] Present the options (quick pros/cons) and wait for the user's decision.
- [ ] Implement the chosen solution with placeholders for any credentials/IDs, clearly
      commented.
- [ ] Verify basic form accessibility (associated labels, error/success states
      communicated not only through color).

---

## Backlog (unordered / to be turned into tasks when needed)

Ideas collected but not yet turned into concrete tasks — to be discussed when this point
is reached:

- Additional micro-interactions (hover on projects, transitions between case studies
  beyond the View Transitions already included by the template).
- A richer "About" page with custom CSS animations (skills show-off).
- Privacy-friendly analytics (evaluate whether and which one).
- Dark/light mode: already included in the BracoZS template — verify whether it just
  needs customizing or requires additional work.
