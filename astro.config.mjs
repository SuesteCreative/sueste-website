// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';
import cloudflare from '@astrojs/cloudflare';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://sueste-creative.pt',
  // The old combined Desportos Náuticos case study was superseded by the split
  // site/merch and CRM pages. Keep the old URLs alive rather than 404ing them.
  redirects: {
    '/portfolio/desportos-nauticos-alvor': '/portfolio/dna-site-fardas',
    '/en/work/desportos-nauticos-alvor': '/en/work/dna-site-fardas',
  },
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