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

- [ ] Clone the user's personal fork (ask for the exact URL if not yet known).
- [ ] Add the original template as a second remote named `upstream` (see AGENTS.md →
      "Branching strategy"):
      ```bash
      git remote add upstream https://github.com/BracoZS/astro-starter-portfolio.git
      git fetch upstream
      ```
- [ ] Create the `upstream-sync` branch tracking `upstream/main` (see AGENTS.md for the
      full workflow), for future potential upstream contributions.
- [ ] Verify that the original `LICENSE` file (MIT) is present in the root and is not
      removed.
- [ ] Add/verify a credit line in `README.md` pointing to the original source, e.g.
      *"Built on top of [astro-starter-portfolio](https://github.com/BracoZS/astro-starter-portfolio)
      by BracoZS, MIT licensed."*
- [ ] Convert the project to **pnpm**:
  - Remove any non-pnpm lockfiles.
  - Verify/create `pnpm-workspace.yaml` if needed.
  - `pnpm install` and verify it generates a clean `pnpm-lock.yaml`.
- [ ] Verify that `pnpm run dev` works and the site is reachable locally.
- [ ] Verify that `pnpm run build` completes without errors (including type-check).
- [ ] Update `src/site.config.ts` with clearly marked placeholder data (name, tagline,
      email, social links) to be replaced with the user's real data.
- [ ] Update `astro.config.mjs`: set `site` to `https://<username>.github.io` (replace
      `<username>` with the user's real GitHub username — ask if not yet known), no
      `base`.

---

## Task 2 — Content Collection: extend the schema for the 3 project categories

- [ ] Open `src/content.config.ts` and extend the `work` collection's Zod schema by
      adding a field like:
      ```ts
      type: z.enum(["commissioned", "personal", "company"])
      ```
- [ ] Update any components that list projects (`WorkRow.astro`, the `work/[id].astro`
      page, the homepage) to display/filter by `type` where relevant.
- [ ] Create 1 example project for each category in `src/content/work/` to verify the
      schema works and the build passes.
- [ ] `pnpm run check` and `pnpm run build` to validate the schema.

---

## Task 3 — Automatic deploy to GitHub Pages (`username.github.io`)

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

---

## Task 4 — Add React as an islands framework

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

## Task 5 — Interactive Letter Glitch component

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

## Task 6 — Contact form (open decision)

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
