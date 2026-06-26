// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  // Update this to your production domain before deploying.
  site: 'https://www.biogenaisolutions.com',
  output: 'static',
  build: {
    assets: 'assets',
  },
});
