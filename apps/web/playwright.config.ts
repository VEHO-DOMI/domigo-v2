import { defineConfig } from 'playwright/test';
import path from 'node:path';
const output = process.env.VISUAL_OUT;
const baseline = process.env.VISUAL_BASELINE;
if (!output || !baseline || !process.env.VISUAL_URL) throw Error('Use scripts/verify-design.mjs with explicit external evidence paths');
export default defineConfig({
  testDir: './e2e', testMatch: 'visual.spec.ts', workers: 1, retries: 0, timeout: 60_000,
  outputDir: path.join(output, 'test-results'), reporter: [['list'], ['json', { outputFile: path.join(output, 'playwright.json') }]],
  snapshotPathTemplate: path.join(baseline, '{projectName}', '{arg}{ext}'),
  updateSnapshots: process.env.VISUAL_CAPTURE === '1' ? 'all' : 'none',
  expect: { timeout: 15_000, toHaveScreenshot: { animations: 'disabled', caret: 'hide', scale: 'css', threshold: 0, maxDiffPixels: 0 } },
  use: { baseURL: process.env.VISUAL_URL, locale: 'en-GB', timezoneId: 'Europe/Vienna', deviceScaleFactor: 1, reducedMotion: 'reduce', serviceWorkers: 'block',
    launchOptions: { executablePath: process.env.CHROME_BIN || undefined, args: ['--disable-background-networking','--force-color-profile=srgb','--disable-gpu','--disable-skia-runtime-opts','--disable-partial-raster'] }, trace: 'off' },
  projects: [360,1280].flatMap(width => (['light','dark'] as const).map(colorScheme => ({ name: `${width}-${colorScheme}`, use: {viewport:{width,height:width===360?740:800},colorScheme} }))),
});
