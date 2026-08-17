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
