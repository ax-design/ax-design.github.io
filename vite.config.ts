import { sveltekit } from '@sveltejs/kit/vite';
import adapter from '@sveltejs/adapter-static';
import { existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';

// While the packages are developed side by side, the site uses their sources from sibling
// checkouts when they exist (the CI has none and uses the published packages).
const siblings = ['surface', 'shape', 'typed-om', 'reveal-highlight', 'acrylic', 'elevation', 'pressure', 'tile-group', 'scroll'];
const alias = Object.fromEntries(
  siblings
    .map((name) => [`@ax-design/${name}`, resolve(dirname(fileURLToPath(import.meta.url)), '..', name, 'src/index.ts')])
    .filter(([, path]) => existsSync(path))
);

export default defineConfig({
  resolve: { alias },
  server: { fs: { allow: ['..'] } },
  plugins: [
    sveltekit({
      adapter: adapter({
        pages: 'build',
        assets: 'build',
        fallback: '404.html',
        precompress: false,
        strict: true
      }),
      prerender: {
        handleHttpError: 'warn'
      }
    })
  ]
});
