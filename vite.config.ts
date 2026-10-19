import { sveltekit } from '@sveltejs/kit/vite';
import adapter from '@sveltejs/adapter-static';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';

// While the packages are developed side by side, the site uses their sources from sibling
// checkouts when they exist (the CI has none and uses the published packages). Each entry of a
// package's exports map that has a source condition becomes an alias of its own, matched exactly:
// a prefix alias would also catch the subpaths (@ax-design/surface/schema) and point them inside
// index.ts.
const siblings = ['surface', 'shape', 'typed-om', 'reveal-highlight', 'acrylic', 'elevation', 'pressure', 'tile', 'tile-group', 'scroll', 'navigation'];
const here = dirname(fileURLToPath(import.meta.url));
const escape = (text: string) => text.replace(/[.*+?^${}()|[\]\\/]/g, '\\$&');
const alias = siblings.flatMap((name) => {
  const root = resolve(here, '..', name);
  const manifest = resolve(root, 'package.json');
  if (!existsSync(manifest)) return [];
  const exports: Record<string, unknown> = JSON.parse(readFileSync(manifest, 'utf8')).exports || {};
  return Object.entries(exports).flatMap(([subpath, target]) => {
    const source = target && typeof target === 'object' ? (target as { source?: string }).source : undefined;
    if (!source || !existsSync(resolve(root, source))) return [];
    const specifier = `@ax-design/${name}${subpath === '.' ? '' : subpath.slice(1)}`;
    return [{ find: new RegExp(`^${escape(specifier)}$`), replacement: resolve(root, source) }];
  });
});

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
