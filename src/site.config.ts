// Edit this file to re-label the entire site. Header, Footer, the homepage
// and SEO defaults all read from here instead of hardcoding copy.
export const SITE = {
  name: 'Diego Turtulici',
  role: 'UI/UX designer & frontend developer',
  email: 'about@flowin.space',
  // tagline: 'Less is - more or less - more',
  tagline: 'You, I and UIs',
  description:
    'Portfolio of Diego Turtulici — UI/UX, product designer and frontend developer, with an emphasis on speed, clarity, and the details most people skip.',
  status: 'Currently self-employed · open to new work',
  social: [
    { label: 'GitHub', href: 'https://github.com/diesys' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/diego-turtulici-72307621b' },
    { label: 'CodePen', href: 'https://codepen.io/diesys' },
    // { label: 'CodePen', href: 'https://codepen.io/die-sys' },
    // { label: 'X', href: 'https://x.com/your-username' },
  ],
  locale: 'en',
} as const;

export const NAV_LINKS = [
  { label: 'Work', href: '/work' },
  { label: 'About', href: '/about' },
  { label: 'Blog', href: '/blog' },
] as const;

// ---------------------------------------------------------------------------
// TODO: real site content extracted from the old site
// (current_website_index.html). Replace the values above manually with these —
// kept commented on purpose so nothing changes until you're ready.
// ---------------------------------------------------------------------------
// name: 'Diego Turtulici',
// role: 'Web and Front-end Developer, UI/UX and Graphics Designer',
// email: 'turingsbite@gmail.com',
// tagline: 'Flow in space and get lost...',
// description:
//   'Born near the Iblei mountains, now based in Pisa, Toscana. Web and front-end developer, UI/UX and graphics designer; digital arts and photography.',
// status: 'Full-time employed at Geckosoft',
// social: [
//   { label: 'GitHub', href: 'https://github.com/diesys' },
//   { label: 'GitLab', href: 'https://git.eigenlab.org/sbiego' },
//   { label: 'Instagram', href: 'https://www.instagram.com/diegoturtu/' },
//   { label: 'Flickr', href: 'https://www.flickr.com/photos/diesys/' },
// ],
