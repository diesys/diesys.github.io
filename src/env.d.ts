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

// simple-icons (tech stack logos for TechLoop)
declare module '~icons/simple-icons/typescript?raw' {
  const content: string;
  export default content;
}
declare module '~icons/simple-icons/angular?raw' {
  const content: string;
  export default content;
}
declare module '~icons/simple-icons/github?raw' {
  const content: string;
  export default content;
}
declare module '~icons/simple-icons/react?raw' {
  const content: string;
  export default content;
}
declare module '~icons/simple-icons/html5?raw' {
  const content: string;
  export default content;
}
declare module '~icons/simple-icons/css?raw' {
  const content: string;
  export default content;
}
declare module '~icons/simple-icons/docker?raw' {
  const content: string;
  export default content;
}
declare module '~icons/simple-icons/figma?raw' {
  const content: string;
  export default content;
}
declare module '~icons/simple-icons/tailwindcss?raw' {
  const content: string;
  export default content;
}
declare module '~icons/simple-icons/nodedotjs?raw' {
  const content: string;
  export default content;
}
declare module '~icons/simple-icons/nextdotjs?raw' {
  const content: string;
  export default content;
}
declare module '~icons/simple-icons/astro?raw' {
  const content: string;
  export default content;
}
declare module '~icons/simple-icons/sass?raw' {
  const content: string;
  export default content;
}
declare module '~icons/simple-icons/vite?raw' {
  const content: string;
  export default content;
}
declare module '~icons/simple-icons/git?raw' {
  const content: string;
  export default content;
}
declare module '~icons/simple-icons/linux?raw' {
  const content: string;
  export default content;
}
