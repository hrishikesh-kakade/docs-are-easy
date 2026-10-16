import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

// The live address is not decided yet, so it is not written here.
// When it is confirmed, build with it set, for example in PowerShell:
//   $env:SITE_URL="https://your-final-address"; npm run build
export default defineConfig({ site: process.env.SITE_URL || undefined, integrations: [react()] });
