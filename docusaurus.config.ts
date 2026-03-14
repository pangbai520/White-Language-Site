import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'White Language',
  tagline: 'The safety of ARC, the precision of C.',
  favicon: 'img/favicon.ico',

  url: 'https://www.white-lang.org',
  baseUrl: '/',

  organizationName: 'pangbai520',
  projectName: 'White-Language-Site',

  onBrokenLinks: 'throw',
  markdown: {
    format: 'detect',
    mermaid: true,
    preprocessor: ({filePath, fileContent}) => {
      return fileContent;
    },
    mdx1Compat: {
      comments: true,
      admonitions: true,
      headingIds: true,
    },
  },

  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'zh-Hans'],
    localeConfigs: {
      en: {
        label: 'English',
        direction: 'ltr',
      },
      'zh-Hans': {
        label: '简体中文',
        direction: 'ltr',
      },
    },
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          editUrl: 'https://github.com/pangbai520/White-Language-Site/tree/main/',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    colorMode: {
      defaultMode: 'dark',
      disableSwitch: false,
      respectPrefersColorScheme: false,
    },
    image: 'img/docusaurus-social-card.jpg',
    navbar: {
      title: 'WhiteLang',
      logo: {
        alt: 'WhiteLang Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: 'Docs',
        },
        {
          href: 'https://github.com/pangbai520/White-Language-Extension',
          label: 'VS Code Extension',
          position: 'left',
        },
        {
          href: 'https://github.com/pangbai520/White-Language',
          label: 'GitHub',
          position: 'right',
        },
        {
          type: 'localeDropdown',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Learn',
          items: [
            {
              label: 'Introduction',
              to: '/docs/intro',
            },
          ],
        },
        {
          title: 'Ecosystem',
          items: [
            {
              label: 'Compiler (wlc)',
              href: 'https://github.com/pangbai520/White-Language',
            },
            {
              label: 'LSP & Langium',
              href: 'https://github.com/pangbai520/White-Language-Extension',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} White Language Team. Licensed under Apache-2.0. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['rust', 'c', 'cpp', 'bash'],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;