// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  // Update this to your production domain before deploying.
  site: 'https://biogenaisolutions.netlify.app',
  output: 'static',
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'es', 'fr', 'de', 'ar'],
    routing: {
      prefixDefaultLocale: false, // English stays at "/", others at "/es/", "/fr/", ...
    },
  },
  build: {
    assets: 'assets',
  },
});
