# Icons

The site uses [LineMD](https://icon-sets.iconify.design/line-md/) (Material Line
Icons, MIT) loaded at build time via [unplugin-icons](https://github.com/unplugin/unplugin-icons).
Icons are inlined as SVG (no runtime requests) and tree-shaken: only imported
icons ship to the client.

## Setup (already done)

- `unplugin-icons` + `@iconify-json/line-md` in devDependencies.
- `Icons({ compiler: 'astro' })` registered in `astro.config.mjs` → `vite.plugins`.
- Type declarations in `src/env.d.ts` (component imports plus the exact `?raw`
  modules used in React islands).

## Using an icon in an `.astro` component

```astro
---
import IconMoon from '~icons/line-md/moon';
---

<IconMoon class="h-4 w-4" />
```

LineMD icons are monotone (`currentColor`), so they inherit the surrounding
text color — style them with the usual Tailwind `text-*` classes.

## Using an icon in a React island

React JSX cannot render the Astro-compiled components, so import the raw SVG
string with the `?raw` suffix and inject it:

```tsx
import rawMenu from '~icons/line-md/menu?raw';

<span
  className="block h-4 w-4 [&>svg]:h-full [&>svg]:w-full"
  dangerouslySetInnerHTML={{ __html: rawMenu }}
/>;
```

Every new `?raw` icon needs a matching exact declaration in `src/env.d.ts`
(`declare module '~icons/line-md/<name>?raw' { … }`). Exact module declarations
always win over the wildcard `~icons/*`, so they never clash with the
component-import types.

Animated icons replay only when (re)mounted: add a `key` prop that changes on
the state you want to animate, so React remounts the element and the SMIL
timeline restarts.

## Icon variants

- **base** (`menu`, `moon`, `sunny`) — one-shot stroke draw-in on mount, then static.
- **`-transition`** (`menu-to-close-alt-transition`, `moon-to-sunny-outline-transition`) —
  morphs between two states on mount (one direction only; most morphs are not reversible).
- **`-loop`** (`sunny-loop`) — animates indefinitely.

Browse icons at <https://icones.js.org> or with the Iconify IntelliSense VS Code
extension.

## Reduced motion

A `prefers-reduced-motion: reduce` handler in `BaseHead.astro` freezes all SMIL
animations (seek to the end + `pauseAnimations`), covering both server-rendered
and React-injected icons. No per-icon work is required.
