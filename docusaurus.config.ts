import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'The White Programming Language',
  tagline: 'A statically typed language with a self-hosted compiler.',
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
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'White',
      logo: {
        alt: 'White',
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
          to: '/download',
          label: 'Download',
          position: 'left',
        },
        {
          href: 'https://github.com/whitelanguage/vscode-white',
          label: 'VS Code',
          position: 'right',
        },
        {
          href: 'https://github.com/whitelanguage/white',
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
          title: 'Language',
          items: [
            {
              label: 'Introduction',
              to: '/docs/intro',
            },
            {
              label: 'Download',
              to: '/download',
            },
          ],
        },
        {
          title: 'Source',
          items: [
            {
              label: 'Compiler and standard library',
              href: 'https://github.com/whitelanguage/white',
            },
            {
              label: 'Language server',
              href: 'https://github.com/whitelanguage/wlls',
            },
            {
              label: 'VS Code extension',
              href: 'https://github.com/whitelanguage/vscode-white',
            },
          ],
        },
        {
          title: 'Project',
          items: [
            {
              label: 'GitHub organization',
              href: 'https://github.com/whitelanguage',
            },
          ],
        },
      ],
      copyright: `<span class="wl-footer-meta"><span>Copyright © ${new Date().getFullYear()} White contributors.</span><a class="wl-footer-license" href="https://github.com/whitelanguage/white/blob/main/LICENSE">Apache-2.0</a></span>`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['rust', 'c', 'cpp', 'bash'],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
