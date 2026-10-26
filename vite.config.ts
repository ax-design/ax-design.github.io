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
const siblings = ['surface', 'shape', 'typed-om', 'reveal-highlight', 'acrylic', 'elevation', 'pressure', 'tile', 'tile-group', 'scroll', 'scrollbar', 'navigation'];
const here = dirname(fileURLToPath(import.meta.url));
const escape = (text: string) => text.replace(/[.*+?^${}()|[\]\\/]/g, '\\$&');

// AX_DEBUG_PACKAGES=1 serves the sibling checkouts from their build output (run "bun run build" in
// each) instead of their sources, to record or measure what would ship. Unset, the default, is the
// sources the dev server always served. One variable turns it on and off; nothing else in the
// repository knows about it.
const debugPackages = process.env.AX_DEBUG_PACKAGES === '1';

// A package that has a sibling checkout but no target for the mode asks for: the site then keeps
// the published copy, and a recording would quietly mix the two.
const unresolved = new Set<string>();

const alias = siblings.flatMap((name) => {
  const root = resolve(here, '..', name);
  const manifest = resolve(root, 'package.json');
  if (!existsSync(manifest)) return [];
  const exports: Record<string, unknown> = JSON.parse(readFileSync(manifest, 'utf8')).exports || {};
  const found = Object.entries(exports).flatMap(([subpath, target]) => {
    const entry = target && typeof target === 'object' ? (target as { source?: string; import?: string; default?: string }) : undefined;
    const file = debugPackages ? entry?.import ?? entry?.default : entry?.source;
    if (!file || !existsSync(resolve(root, file))) return [];
    const specifier = `@ax-design/${name}${subpath === '.' ? '' : subpath.slice(1)}`;
    return [{ find: new RegExp(`^${escape(specifier)}$`), replacement: resolve(root, file) }];
  });
  if (!found.length) unresolved.add(name);
  return found;
});

if (debugPackages && unresolved.size) {
  console.warn(
    `[ax-design] AX_DEBUG_PACKAGES=1, but these siblings have no build output and will come from node_modules: ${[...unresolved].join(', ')}. Run "bun run build" in each before recording.`
  );
}

// Watched as directories: the watcher of Vite follows only the files it has served, and loses them
// when git or an editor replaces a file, so the dev server would keep serving the old module.
// The sources of the sibling checkouts, and the build output a debug run serves instead (a rebuild
// replaces the output directory, which a watcher does not pick up again by itself).
const watched = [...siblings.map((name) => resolve(here, '..', name, 'src')), ...alias.map((a) => dirname(a.replacement))]
  .filter((dir, index, all) => all.indexOf(dir) === index && existsSync(dir));
const watchSiblings = {
  name: 'watch-siblings',
  configureServer(server: { watcher: { add(paths: string[]): void } }) {
    server.watcher.add(watched);
  }
};

export default defineConfig({
  resolve: { alias },
  server: { fs: { allow: ['..'] } },
  plugins: [
    watchSiblings,
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
