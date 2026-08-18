/// <reference types="unplugin-icons/types/astro" />

// unplugin-icons `?raw` imports return the raw SVG markup as a string. The
// library ships a `types/raw` declaration for `~icons/*` that would clash with
// the Astro-component declaration above, so raw icons are declared explicitly
// (exact modules always win over the wildcard `~icons/*`). Add one line per
// raw icon used in React islands (see docs/icons.md).
declare module '~icons/line-md/menu?raw' {
  const content: string;
  export default content;
}
declare module '~icons/line-md/menu-to-close-alt-transition?raw' {
  const content: string;
  export default content;
}
