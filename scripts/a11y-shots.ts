// Takes the pictures of the Accessibility column: its own live preview, in forced colors (dark
// and light), which a page cannot turn on. The fallback needs no picture: the column shows it live.
// Run with a dev server up: bun scripts/a11y-shots.ts [base-url] [slug ...]
// Pictures go to static/a11y/<slug>-<mode>.png.
import { mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
// The Playwright of the sibling tile-group checkout (the site does not depend on it).
import { chromium } from '../../tile-group/node_modules/playwright';

const here = dirname(fileURLToPath(import.meta.url));
const outDir = resolve(here, '..', 'static', 'a11y');

const ALL = ['shape', 'surface', 'typed-om', 'reveal-highlight', 'acrylic', 'elevation', 'pressure', 'tile-group', 'scroll', 'navigation', 'tile'];
// Libraries without UI: nothing to show in a picture.
const NO_PICTURES = new Set(['shape', 'typed-om']);

const args = process.argv.slice(2);
const base = args.find((a) => a.startsWith('http')) ?? 'http://localhost:5182';
const requested = args.filter((a) => !a.startsWith('http'));
const slugs = requested.length ? requested : ALL;

await mkdir(outDir, { recursive: true });
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 1280, height: 900 }, deviceScaleFactor: 1 });
const page = await context.newPage();

const errors: string[] = [];
page.on('pageerror', (e) => errors.push(String(e)));

let failed = 0;
for (const slug of slugs) {
  if (NO_PICTURES.has(slug)) {
    console.log(`${slug}: no pictures (a library)`);
    continue;
  }
  const response = await page.goto(`${base}/components/${slug}`, { waitUntil: 'networkidle' });
  if (!response || response.status() !== 200) {
    console.log(`${slug}: skipped, the page answers ${response?.status() ?? 'nothing'}`);
    continue;
  }
  const main = page.locator('div.preview[data-example="accessibility"]');
  await main.waitFor({ state: 'visible' });
  await page.waitForTimeout(1200);

  const shoot = async (name: string) => {
    await page.waitForTimeout(700);
    await main.screenshot({ path: resolve(outDir, `${slug}-${name}.png`), type: 'png' });
    console.log(`${slug}: ${name}`);
  };

  try {
    await page.emulateMedia({ forcedColors: 'active', colorScheme: 'dark' });
    await shoot('forced-dark');
    await page.emulateMedia({ forcedColors: 'active', colorScheme: 'light' });
    await shoot('forced-light');
    await page.emulateMedia({ forcedColors: 'none', colorScheme: 'light' });

  } catch (error) {
    failed++;
    console.log(`${slug}: failed: ${error}`);
  }
}

await browser.close();
if (errors.length) console.log(`page errors:\n${errors.join('\n')}`);
if (failed) process.exit(1);
