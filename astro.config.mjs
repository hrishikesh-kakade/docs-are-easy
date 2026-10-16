
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: process.env.SITE_URL || 'https://docs-are-easy.hkdev.workers.dev',
  integrations: [react(), sitemap()],
});
