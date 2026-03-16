// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';
import cloudflare from '@astrojs/cloudflare';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://sueste-creative.pt',
  integrations: [
    react(),
    sitemap({
      i18n: {
        defaultLocale: 'pt',
        locales: {
          pt: 'pt-PT',
          en: 'en-GB',
        },
      },
      filter: (page) =>
        !page.includes('/sucesso/') &&
        !page.includes('/en/success/'),
    }),
  ],
  adapter: cloudflare(),
});