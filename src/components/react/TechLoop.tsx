import LogoLoop, { type LogoItem } from './LogoLoop';
import rawTypeScript from '~icons/simple-icons/typescript?raw';
import rawAngular from '~icons/simple-icons/angular?raw';
import rawGithub from '~icons/simple-icons/github?raw';
import rawReact from '~icons/simple-icons/react?raw';
import rawHtml5 from '~icons/simple-icons/html5?raw';
import rawCss from '~icons/simple-icons/css?raw';
import rawDocker from '~icons/simple-icons/docker?raw';
import rawFigma from '~icons/simple-icons/figma?raw';
import rawTailwindcss from '~icons/simple-icons/tailwindcss?raw';
import rawNodedotjs from '~icons/simple-icons/nodedotjs?raw';
import rawNextdotjs from '~icons/simple-icons/nextdotjs?raw';
import rawAstro from '~icons/simple-icons/astro?raw';
import rawSass from '~icons/simple-icons/sass?raw';
import rawVite from '~icons/simple-icons/vite?raw';
import rawGit from '~icons/simple-icons/git?raw';
import rawLinux from '~icons/simple-icons/linux?raw';

const logos: LogoItem[] = [
  {
    node: (
      <span
        className="inline-flex items-center"
        aria-hidden="true"
        dangerouslySetInnerHTML={{ __html: rawTypeScript }}
      />
    ),
    href: 'https://www.typescriptlang.org',
    title: 'TypeScript',
    ariaLabel: 'TypeScript',
  },
  {
    node: (
      <span
        className="inline-flex items-center"
        aria-hidden="true"
        dangerouslySetInnerHTML={{ __html: rawAngular }}
      />
    ),
    href: 'https://angular.io',
    title: 'Angular',
    ariaLabel: 'Angular',
  },
  {
    node: (
      <span
        className="inline-flex items-center"
        aria-hidden="true"
        dangerouslySetInnerHTML={{ __html: rawGithub }}
      />
    ),
    href: 'https://github.com',
    title: 'GitHub',
    ariaLabel: 'GitHub',
  },
  {
    node: (
      <span
        className="inline-flex items-center"
        aria-hidden="true"
        dangerouslySetInnerHTML={{ __html: rawReact }}
      />
    ),
    href: 'https://react.dev',
    title: 'React',
    ariaLabel: 'React',
  },
  {
    node: (
      <span
        className="inline-flex items-center"
        aria-hidden="true"
        dangerouslySetInnerHTML={{ __html: rawHtml5 }}
      />
    ),
    href: 'https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/HTML5',
    title: 'HTML5',
    ariaLabel: 'HTML5',
  },
  {
    node: (
      <span
        className="inline-flex items-center"
        aria-hidden="true"
        dangerouslySetInnerHTML={{ __html: rawCss }}
      />
    ),
    href: 'https://developer.mozilla.org/en-US/docs/Web/CSS',
    title: 'CSS',
    ariaLabel: 'CSS',
  },
  {
    node: (
      <span
        className="inline-flex items-center"
        aria-hidden="true"
        dangerouslySetInnerHTML={{ __html: rawDocker }}
      />
    ),
    href: 'https://www.docker.com',
    title: 'Docker',
    ariaLabel: 'Docker',
  },
  {
    node: (
      <span
        className="inline-flex items-center"
        aria-hidden="true"
        dangerouslySetInnerHTML={{ __html: rawFigma }}
      />
    ),
    href: 'https://www.figma.com',
    title: 'Figma',
    ariaLabel: 'Figma',
  },
  {
    node: (
      <span
        className="inline-flex items-center"
        aria-hidden="true"
        dangerouslySetInnerHTML={{ __html: rawTailwindcss }}
      />
    ),
    href: 'https://tailwindcss.com',
    title: 'Tailwind CSS',
    ariaLabel: 'Tailwind CSS',
  },
  {
    node: (
      <span
        className="inline-flex items-center"
        aria-hidden="true"
        dangerouslySetInnerHTML={{ __html: rawNodedotjs }}
      />
    ),
    href: 'https://nodejs.org',
    title: 'Node.js',
    ariaLabel: 'Node.js',
  },
  {
    node: (
      <span
        className="inline-flex items-center"
        aria-hidden="true"
        dangerouslySetInnerHTML={{ __html: rawNextdotjs }}
      />
    ),
    href: 'https://nextjs.org',
    title: 'Next.js',
    ariaLabel: 'Next.js',
  },
  {
    node: (
      <span
        className="inline-flex items-center"
        aria-hidden="true"
        dangerouslySetInnerHTML={{ __html: rawAstro }}
      />
    ),
    href: 'https://astro.build',
    title: 'Astro',
    ariaLabel: 'Astro',
  },
  {
    node: (
      <span
        className="inline-flex items-center"
        aria-hidden="true"
        dangerouslySetInnerHTML={{ __html: rawSass }}
      />
    ),
    href: 'https://sass-lang.com',
    title: 'Sass',
    ariaLabel: 'Sass',
  },
  {
    node: (
      <span
        className="inline-flex items-center"
        aria-hidden="true"
        dangerouslySetInnerHTML={{ __html: rawVite }}
      />
    ),
    href: 'https://vite.dev',
    title: 'Vite',
    ariaLabel: 'Vite',
  },
  {
    node: (
      <span
        className="inline-flex items-center"
        aria-hidden="true"
        dangerouslySetInnerHTML={{ __html: rawGit }}
      />
    ),
    href: 'https://git-scm.com',
    title: 'Git',
    ariaLabel: 'Git',
  },
  {
    node: (
      <span
        className="inline-flex items-center"
        aria-hidden="true"
        dangerouslySetInnerHTML={{ __html: rawLinux }}
      />
    ),
    href: 'https://www.kernel.org',
    title: 'Linux',
    ariaLabel: 'Linux',
  },
];

export default function TechLoop() {
  return (
    <LogoLoop
      logos={logos}
      speed={28}
      direction="left"
      logoHeight={24}
      gap={60}
      fadeOut
      ariaLabel="Technologies I work with"
    />
  );
}
