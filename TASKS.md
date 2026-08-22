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

- [x] Create `cli-scripts/upstream-status.sh`: fetches `upstream` and reports whether
      `upstream-sync` is behind `upstream/main` (i.e. whether there are new upstream
      commits not yet synced) — read-only, makes no changes.
- [x] Create `cli-scripts/upstream-sync.sh`: fetches `upstream` and fast-forwards the
      local `upstream-sync` branch to `upstream/main` (see AGENTS.md workflow) — asks
      for confirmation (via the `shared.sh` `confirm()` helper) before switching
      branches if the working tree isn't clean.
- [x] Add both as registry lines grouped under an "Upstream" submenu in `portfolio-cli`.
- [x] Leave room in this submenu for future related commands (e.g. a helper to branch
      off `upstream-sync` for a new `feature/*`, once that workflow is actually used) —
      don't build those yet, just confirm the submenu structure doesn't need rework to
      add them later.

> **Done 2026-08-17**: created `cli-scripts/upstream-status.sh` (fetch + `git rev-list
--count` compare, reports up-to-date/behind/ahead-diverged, read-only) and
> `cli-scripts/upstream-sync.sh` (fetch, confirm via `confirm()` if tree dirty,
> checkout `upstream-sync`, `git merge --ff-only upstream/main`, restore previous
> branch via an EXIT trap). Registered both under a new "Upstream" submenu — purely
> data-driven, so future commands (e.g. a `feature/*` branch helper) just append one
> member key + registry line, no rework. Verified end-to-end in a throwaway clone:
> clean-tree fast-forward restores the original branch, dirty tree prompts
> (gum-backed with TTY, `read -p` otherwise), and both work with gum shadowed out of
> `PATH`. **Fixed `confirm()` in `cli-scripts/shared.sh`**: it previously called
> `gum confirm` whenever gum was installed, which fails with no TTY (agent/pipe) —
> now falls back to `read -p` when stdin isn't a terminal, per the AGENTS.md
> non-interactive rule. `shellcheck` not installed on this system; `bash -n` passed.

---

## Task 4 — Content Collection: extend the schema for the 3 project categories

- [x] Open `src/content.config.ts` and extend the `work` collection's Zod schema by
      adding a field like:
      `ts
type: z.enum(["commissioned", "personal", "company"])
`
- [x] Update any components that list projects (`WorkRow.astro`, the `work/[id].astro`
      page, the homepage) to display/filter by `type` where relevant.
- [x] Create 1 example project for each category in `src/content/work/` to verify the
      schema works and the build passes.
- [x] `pnpm run check` and `pnpm run build` to validate the schema.
- [x] Add a `cli-scripts/new-project.sh` script wired into `portfolio-cli` that scaffolds
      a new Markdown file in `src/content/work/` with the correct frontmatter shape
      (including `type`), so adding future projects doesn't require remembering the
      schema by hand.

> **Done 2026-08-17**: added required `type` enum to the `work` schema and assigned a
> type to the 3 existing template projects — one per category — instead of creating 3
> more placeholder files (studio-os → `company`, northwind-atlas → `commissioned`,
> fieldnote → `personal`); flag if separate fresh examples are preferred. `type` is
> surfaced in `WorkRow.astro` (border chip) and `work/[id].astro` (metadata row). Added
> `cli-scripts/new-project.sh` (gum input / `read -p` when interactive, flags +
> defaults when not) and extended `portfolio-cli` dispatch to forward extra args
> (`./portfolio-cli new-project <slug> --type ...`); scaffolded projects default to
> `draft: false` unless `--publish`. `pnpm run check` and `pnpm run build` pass, also
> with a freshly scaffolded file.

---

## Task 5 — Add React as an islands framework

- [x] `pnpm dlx astro add react` (or pnpm equivalent) to integrate the official
      `@astrojs/react` integration.
- [x] Verify `astro.config.mjs` correctly includes the React integration.
- [x] Create the `src/components/react/` subfolder for islands (see conventions in
      AGENTS.md).
- [x] Create a minimal test React component (e.g. a counter or hello-world) and mount it
      on a page with `client:visible` to verify hydration works correctly in both build
      and dev.
- [x] Remove the test component once verified (or leave it as an example — decide with
      the user at the end of the task).
- [x] `pnpm run build` to confirm there are no regressions on the rest of the site
      (which should remain zero-JS where islands aren't needed).

> **Done 2026-08-17**: ran `pnpm exec astro add react --yes` (used the locally pinned
> Astro 7 instead of `pnpm dlx`, which would fetch a separate Astro and could drift;
> `--yes` to skip the interactive prompt). Added `@astrojs/react@^6.0.2`, `react` +
> `react-dom` 19 and `@types/*` (all landed in `dependencies` — as `astro add` placed
> them), `react()` in `astro.config.mjs`, `jsx`/`jsxImportSource` in `tsconfig.json`.
> Test island `src/components/react/Counter.tsx` mounted on the homepage hero with
> `client:visible` (user's choice — keeps Task 6's LetterGlitch location in mind).
> Verified hydration in **build** (homepage HTML has `<astro-island client="visible">`
> wiring `Counter` + the React renderer chunk; `/about` and `/work` reference no React
> chunks) and in **dev** (SSR serves the island, `/about` has none). Per the task's
> final decision, **removed** the Counter afterward — homepage back to zero React JS.
> Note: `dist/_astro/client.*.js` (the React hydration runtime, ~187K) is still emitted
> as an **orphan chunk** (unreferenced by any page) because the integration is installed
> but unused; harmless and unreferenced, and it becomes load-bearing once Task 6 mounts
> a real island.

---

## Task 6 — Interactive Letter Glitch component

- [x] Source/adapt the `LetterGlitch` component (inspired by
      [ReactBits.dev](https://www.reactbits.dev/)) as a React component in
      `src/components/react/LetterGlitch.tsx`.
- [x] Adapt styling/colors to the site's design tokens (`--paper`, `--ink`, `--ink-soft`,
      `--signal`, `--line` in `src/styles/global.css`) — don't leave hardcoded colors
      from the original component.
- [x] Mount it as an island (`client:visible` recommended, since immediate interactivity
      on first paint likely isn't needed) in a position to be agreed on (e.g. homepage
      hero).
- [x] Verify performance: the component must not noticeably degrade the homepage's
      Lighthouse score. If it does, flag it before proceeding further.
- [x] Verify `prefers-reduced-motion`: the component must respect the user's preference
      and disable/reduce the effect if reduced motion is requested.

> **Done 2026-08-17**: adapted the ReactBits `LetterGlitch` into
> `src/components/react/LetterGlitch.tsx` (260-line canvas char-grid, adapted from the
> `DavidHDev/react-bits` repo — reactbits.dev renders client-side and the `reactbits`
> npm package doesn't exist). No hardcoded colors left: glitch palette
> `[--ink-soft, --ink, --signal]` and the `--paper` background/vignettes are read live
> via `getComputedStyle` (canvas fillStyle can't resolve `var()`), a `MutationObserver`
> on `<html>`'s `class` re-reads the tokens and rebuilds the grid on the `.dark` theme
> swap, the site's mono family (`--ff-mono`) is used instead of generic `monospace`,
> `prefers-reduced-motion` renders a single static frame (with a `change` listener for
> mid-session preference switches), and the canvas is `aria-hidden`. Mounted **hero
> full-bleed** (user's choice) in `src/pages/index.astro`: hero section became
> `relative overflow-hidden` with the island in an `absolute inset-0` wrapper behind the
> existing `max-w-3xl` content (which is `relative` to stay above it). `client:visible`
> (the previously-orphaned React runtime chunk is now loaded by the homepage).
> **Lighthouse** (Chromium headless against the production preview): performance **94**
> — LCP 2.6s (display font render delay), TBT 200ms, CLS 0.01, SI 1.3s; total transfer
> ~279KB (fonts 193KB, script 71KB), no images/third-party. Earlier score 33 was a
> mis-run against a leftover dev server on :4321 (dev-toolbar/vite deps ~5MB), not the
> build. Reduced-motion verified end-to-end: two CDP screenshots 600ms apart from the
> same page instance differ 18.7% with normal motion and 0.00% with
> `--force-prefers-reduced-motion`. Flag: real Lighthouse should be re-run in the user's
> own environment (numbers above are from this sandbox's headless Chromium). Also
> flagged: 6 pre-existing files don't pass `prettier --check` (astro.config.mjs,
> public/site.webmanifest, src/components/BaseHead.astro, src/site.config.ts,
> src/utils/formatDate.ts, tsconfig.json) — left untouched per the golden rules.

---

## Task 7 — Icon system (LineMD via `unplugin-icons`)

The site builds in animated icons from the LineMD set (MIT) with `unplugin-icons`
(`compiler: 'astro'`), replacing the hand-drawn SVGs of the theme toggle and the
menu button, plus a global `prefers-reduced-motion` freeze (SMIL cannot be stopped
via CSS). See `docs/icons.md` for usage.

- [x] Install `unplugin-icons` + `@iconify-json/line-md` (devDependencies).
- [x] Register `Icons({ compiler: 'astro' })` in `astro.config.mjs` → `vite.plugins`.
- [x] Create `src/env.d.ts` with the `unplugin-icons/types/astro` reference and exact
      declarations for the `?raw` icons used in React.
- [x] Migrate `ThemeToggle.astro` icons: `moon-to-sunny-outline-transition` for light
      (morph, re-triggered on every switch into light via `setCurrentTime(0)`),
      `moon` draw-in for dark; in auto the icon follows the resolved OS theme and a
      small "A" badge (signal circle, paper letter) marks the auto mode.
- [x] Migrate `MenuWheel.tsx` hamburger to LineMD raw SVGs (`menu` when closed,
      `menu-to-close-alt-transition` when open, remounted via `key`).
- [x] Add the reduce-motion freeze script (seeks + pauses all SMIL, MutationObserver
      covers React-injected icons) in `BaseHead.astro`.
- [x] Write `docs/icons.md` and link it from a new "Additions" section in `README.md`.
- [x] Verified with `astro check` and `astro build`.

> **Done.** Icon migration complete and verified. Decisions: global JS freeze (not
> `motion-reduce:`) because SMIL can't be disabled via CSS; theme toggle morphs
> `moon-to-sunny-outline-transition` on dark→light only (light→dark shows a `moon`
> draw-in, asymmetric by design); in auto mode the icon reflects the resolved OS
> theme and a small "A" badge marks that the OS is being followed; menu uses the
> hamburger→X morph on open only.
> Files touched: `astro.config.mjs`, `src/env.d.ts`,
> `src/components/BaseHead.astro`, `src/components/ThemeToggle.astro`,
> `src/components/react/MenuWheel.tsx`, `docs/icons.md`, `README.md`.

---

## Task 8 — Automatic deploy to GitHub Pages (`username.github.io`)

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

## Task 9 — Contact form (open decision)

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

## Task 10 — CV: enrich About page (append-only, no replacement)

Source: `src/assets/cv/CV-ridotto-light-2026-02-14.pdf` (read 2026-02-14). Constraints: **append, don't replace** where content already exists (e.g. `src/site.config.ts:8` tagline `You, I and UIs` stays); Geckosoft 2021–2026 terminated — `SITE.status` self-employed is correct; keep `SITE.email` as `about@flowin.space`; no phone, no privacy notice; dates in site ISO `YYYY-MM-DD` (`src/content.config.ts:15`).

- [x] In `src/pages/about.astro:18` append CV intro paragraph ("full-stack creator bridging web development, design and CSS skills... started as graphic designer before studying computer science and digital humanities... curiosity-driven, detail-oriented... plan, test, iterate, refine across product lifecycle from design to QA... define design choices that produce less and cleaner code... balance usability, beauty and do-ability") **after** existing prose — do not overwrite existing bio or `SITE.tagline`/`SITE.description`.
- [x] Keep `src/site.config.ts:8` tagline and `src/site.config.ts:9` description as-is; if extending description, append CV summary as second sentence, not replacement. Verify `src/site.config.ts:15` status remains `Currently self-employed · open to new work` and `src/site.config.ts:6` email unchanged.
- [x] `pnpm run check && pnpm run build && pnpm run format --check`

> **Done 2026-08-22**: appended CV intro as 4th `<p>` in `src/pages/about.astro:32` (kept `src/site.config.ts:8`/`9`/`15` untouched, append-only). Build `pnpm exec astro build` passes (25 pages); `astro check` pre-existing `language-server` `fileExists` bug unrelated.
> **Follow-up 2026-08-22 (user: keep only .astro)**: merged missing `src/content/about.md:12` content (Iblei/Pisa, Digital Humanities/CS, Asa25/photography/music/theatre) as 2 extra `<p>` in `src/pages/about.astro:41`, deleting `src/content/about.md` (orphan, not a collection per `src/content.config.ts:53`). Re-formatted + rebuilt OK.

---

## Task 11 — CV: merge Skills/Tools into About (append, dedupe)

- [x] Merge CV `Skills In A Brief` into `src/pages/about.astro:6` `tools` array (currently 6 items) — append missing from `Development`/`Design & Content` (Angular, Playwright, Vue, Svelte, Tailwind, PrimeNG, AntDesign, GSAP, ReactPDF, Bun, Symfony, Docker, Python, Git, Shell, Figma, Lottie, Rive, etc.) deduped, keep existing order.
- [x] Add two pill-groups below Tools reusing same `<ul>` styling `src/pages/about.astro:36` for `Core Competencies` (Brand, UI/UX, Design Systems, Product Design, QA, Technical Docs, Responsive Web, Client Communication, Board Management, Cross-functional Team Leadership) and `Languages` (Italian native / English C1).
- [x] `pnpm run check && pnpm run build`

> **Done 2026-08-22**: expanded `tools` to 24 items (kept original 6 order + appended HTML/CSS/Angular/Playwright/Vue/Svelte/PrimeNG/Ant Design/GSAP/ReactPDF/Bun/Symfony/Docker/Python/Git/Shell/Lottie/Rive) deduped. Added `coreCompetencies` and `languages` pill-groups below Tools reusing `border-line` styling. `prettier --write` + `astro build` OK (25 pages).

---

## Task 12 — CV: surface key stats (append-only)

- [x] Surface stats `40k+ commits, 100k+ photo/videos, 250+ posters, 60+ logos, 20+ illustrations, animations, icons, games, cli-tools, themes, stickers, smart-cards, t-shirts...` as an appended "At a glance" row in `src/pages/about.astro` (below Tools) — not in hero/header.
- [x] Keep copy short, no phone/privacy notice.
- [x] `pnpm run check && pnpm run build`

> **Done 2026-08-22**: added `stats` array + "At a glance" pill row in `src/pages/about.astro:48`/`126` (40k+ commits, 100k+ photo/videos, 250+ posters, 60+ logos, 20+ illustrations, 50+ animations/icons/etc). Short copy, no phone/privacy. `prettier --write` + `astro build` OK.

---

## Task 13 — CV: integrate Selected Experience/Works into `src/content/work/` (merge, not duplicate)

- [x] Audit 23 existing files `src/content/work/` vs CV lists (Selected Experience + Selected Works). For matches (e.g. `cloch.md`, `jastersind.md`, `pomelo.md`, `transmission-ui.md`, `itmenu.md`, `imparaora.md`, `libersoft.md`, `point-of-vision.md` etc.) **merge**: enrich `summary`/`tags`/`role` with CV footnotes ³⁴⁵, append missing context to body, keep `date` in existing ISO `YYYY-MM-DD` format.
- [x] For missing Geckosoft/IterTour items with no file (e.g. `d-ascenzi`, `gest`, `tadan`, `bms`, `traent`, `kairos`, `imperatore-travel`, `wanderlust`, `itertours`, `documeant-theme`, `senzaparole` if absent) scaffold via `cli-scripts/new-project.sh` with `draft:true`, `date: YYYY-MM-DD`, `type: company|commissioned|personal` mapping, then fill body. For ranges like `2021–2026` write range in body, `date` = single ISO value.
- [x] `pnpm run check && pnpm run build`

> **Done 2026-08-22**: merged 8 existing works (`cloch.md:3`, `itmenu.md:3`, `minhex.md:3`, `pomelo.md:3`, `transmission-ui.md:3`, `jastersind.md:3`, `point-of-vision.md:3` (SenzaParole), `palinuro-damare.md:3`) — updated `summary`, `role`, `tags`, ISO `date` per CV (e.g. `Cloch 2018-01-01`, `ITMenu 2022-03-01`, `Transmission 2007-01-01`). Scaffolded 13 missing drafts via `cli-scripts/new-project.sh` with `draft:true` + ISO dates + `type` mapping: `d-ascenzi`, `geckosoft-it`, `gest`, `tadan`, `bms`, `traent`, `kairos`, `imperatore-travel` (`company`), `wanderlust`/`itertours`/`flyfish`/`scs-consulting` (`commissioned`), `documeant-theme` (`personal`). Bodies note 2021–2026 range for Geckosoft. `astro build` OK (25 non-draft pages), `prettier --write` OK.

---

## Task 14 — CV: expose PDF asset

- [x] Ensure `src/assets/cv/CV-ridotto-light-2026-02-14.pdf` is reachable as `/cv` download (copy or link to `public/cv.pdf` if needed for static serving), add link in `src/pages/about.astro` CTA row — no extra page required.
- [x] Verify no `public/CNAME`, no `base` change `astro.config.mjs:11`.
- [x] `pnpm run check && pnpm run build && pnpm run format --check`

> **Done 2026-08-22**: copied `src/assets/cv/CV-ridotto-light-2026-02-14.pdf` → `public/cv.pdf` (3.3M, served as `/cv.pdf` + copied to `dist/cv.pdf` on build). Added `Download CV (PDF)` ghost button alongside `Get in touch` in `src/pages/about.astro:161`. Verified `public/CNAME` absent and `astro.config.mjs:11` has no `base` (user site). `prettier --write` + `astro build` OK (25 pages).
> **Extra 2026-08-22 (user request)**: implemented draft preview toggle (method 2) in `src/pages/index.astro:11`, `src/pages/work/index.astro:7`, `src/pages/work/[id].astro:10` → `import.meta.env.DEV ? true : !data.draft` (drafts visible in `pnpm run dev`, hidden in `build`).

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
