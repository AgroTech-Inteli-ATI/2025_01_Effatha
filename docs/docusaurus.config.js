// @ts-check
import {themes as prismThemes} from 'prism-react-renderer';

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'AgroTech Inteli - Effatha',
  tagline: 'Plataforma de Análise Agrícola via Imagens de Satélite',
  favicon: 'img/favicon.ico',

  url: 'https://agrotech-inteli-ati.github.io',
  baseUrl: '/2025_01_Effatha/',

  organizationName: 'AgroTech-Inteli-ATI',
  projectName: '2025_01_Effatha',

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: './sidebars.js',
          editUrl:
            'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
          routeBasePath: '/',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],
  
  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      image: 'img/docusaurus-social-card.jpg',
      navbar: {
        title: 'AgroTech Inteli',
        logo: {
          alt: 'AgroTech Inteli',
          src: 'img/logo.png',
        },
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'tutorialSidebar',
            position: 'left',
            label: 'Documentação',
          },
          {
            href: 'https://github.com/AgroTech-Inteli-ATI/2025_01_Effatha', // Atualize para o URL correto do seu repositório
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Documentação',
            items: [
              {
                label: 'Introdução',
                to: '/',
              },
              {
                label: 'Guia de Uso',
                to: '/guia/como-usar',
              },
              {
                label: 'Instalação',
                to: '/suporte/instalacao',
              },
            ],
          },
          {
            title: 'Comunidade',
            items: [
              {
                label: 'Inteli',
                href: 'https://www.inteli.edu.br/',
              },
              {
                label: 'Liga AgroTech',
                href: 'mailto:agrotech@inteli.edu.br',
              },
            ],
          },
          {
            title: 'Recursos',
            items: [
              {
                label: 'GitHub',
                href: 'https://github.com/AgroTech-Inteli-ATI/2025_01_Effatha',
              },
              {
                label: 'Google Earth Engine',
                href: 'https://earthengine.google.com/',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} AgroTech Inteli - Effatha. Desenvolvido com Docusaurus.`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
      },
    }),
};

export default config;