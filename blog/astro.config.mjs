import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';

export default defineConfig({
  integrations: [mdx()],
  site: 'https://yimore7.github.io',
  base: '/blog',
  build: {
    format: 'directory',
  },
});
