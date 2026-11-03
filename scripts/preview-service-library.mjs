// Optional local browser QA: npm install --prefix .preview --no-save --package-lock=false playwright
// Start npm run dev -- --port 4173 --strictPort, then run this script.
import {chromium} from '../.preview/node_modules/playwright/index.mjs';
import {mkdir, readFile, writeFile} from 'node:fs/promises';
import {existsSync} from 'node:fs';
import assert from 'node:assert/strict';

const executablePath = process.env.PREVIEW_CHROME_PATH || [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
].find(existsSync);
const browser = await chromium.launch({headless: true, ...(executablePath ? {executablePath} : {})});
const base = process.env.PREVIEW_URL || 'http://127.0.0.1:4173';
const folder = 'artifacts/service-library-preview';
await mkdir(folder, {recursive: true});
const results = [], errors = [];
try {
  for (const theme of ['light', 'dark']) {
    const context = await browser.newContext({viewport: {width: 1440, height: 1050}, reducedMotion: 'reduce'});
    await context.addInitScript(value => {
      localStorage.setItem('aws-playground-theme', value);
      localStorage.setItem('aws-playground-builder-v1', 'preview-architecture-sentinel');
    }, theme);
    const page = await context.newPage();
    page.on('pageerror', error => errors.push(error.message));
    await page.route('**/api/**', route => {
      errors.push('Unexpected API request: ' + new URL(route.request().url()).pathname);
      return route.abort();
    });
    await page.goto(base + '/?view=services&exam=DVA-C03');
    await page.getByRole('button', {name: 'Read AWS Lambda guide', exact: true}).waitFor();
    await page.screenshot({path: `${folder}/library-${theme}.jpg`, type: 'jpeg', quality: 90});
    await page.locator('.atlas-results-heading').scrollIntoViewIfNeeded();
    await page.evaluate(() => window.scrollTo(0, document.querySelector('.atlas-results-heading').getBoundingClientRect().top + window.scrollY - 28));
    await page.screenshot({path: `${folder}/library-cards-${theme}.jpg`, type: 'jpeg', quality: 90});
    for (const width of [375, 768, 1440]) {
      await page.setViewportSize({width, height: 1000});
      assert(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1), `Library overflow at ${width}/${theme}`);
      results.push({page: 'library', theme, width, horizontalOverflow: false});
    }
    await page.getByLabel('Search service references').fill('Lambda');
    await page.getByRole('button', {name: 'Read AWS Lambda guide', exact: true}).click();
    await page.getByRole('heading', {name: 'AWS Lambda', level: 1, exact: true}).waitFor();
    assert.equal(new URL(page.url()).searchParams.get('service'), 'lambda');
    assert(await page.locator('#guide-decision').isVisible());
    await page.screenshot({path: `${folder}/lambda-${theme}.jpg`, type: 'jpeg', quality: 90});
    for (const width of [375, 768, 1440]) {
      await page.setViewportSize({width, height: 1000});
      assert(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1), `Detail overflow at ${width}/${theme}`);
      results.push({page: 'lambda', theme, width, horizontalOverflow: false});
      if (width === 375) await page.screenshot({path: `${folder}/lambda-mobile-${theme}.jpg`, type: 'jpeg', quality: 90});
    }
    await page.getByRole('button', {name: /03 Cost & operations/}).click();
    assert.equal(await page.evaluate(() => document.activeElement?.id), 'guide-cost');
    await page.screenshot({path: `${folder}/lambda-cost-${theme}.jpg`, type: 'jpeg', quality: 90});
    await page.getByRole('button', {name: 'All service references', exact: true}).click();
    assert.equal(await page.getByLabel('Search service references').inputValue(), 'Lambda');
    await page.getByRole('button', {name: 'English glossary', exact: true}).click();
    await page.getByLabel('Search glossary').fill('authentication');
    assert.equal(await page.locator('[lang="vi"]').count(), 0);
    assert.equal(await page.getByLabel('Glossary language').count(), 0);
    assert.equal(await page.evaluate(() => localStorage.getItem('aws-playground-builder-v1')), 'preview-architecture-sentinel');
    await context.close();
  }
  const contentFiles = await Promise.all(['src/serviceDeepDiveCore.ts', 'src/serviceDeepDiveTools.ts'].map(path => readFile(path, 'utf8')));
  const serviceIds = contentFiles.flatMap(text => [...text.matchAll(/serviceId:\s*['"]([^'"]+)['"]/g)].map(match => match[1]));
  assert.equal(new Set(serviceIds).size, 58);
  const allGuides = await browser.newContext({viewport: {width: 1440, height: 1000}});
  const guidePage = await allGuides.newPage();
  guidePage.on('pageerror', error => errors.push(error.message));
  for (const id of serviceIds) {
    await guidePage.goto(base + '/?view=services&exam=DVA-C03&service=' + id);
    await guidePage.locator('#guide-decision').waitFor();
    assert.equal(await guidePage.locator('.guide-steps > li').count(), 4, 'Walkthrough missing: ' + id);
    assert.equal(await guidePage.locator('dd[lang="vi"]').count(), 0, 'Non-English definition: ' + id);
  }
  await allGuides.close();
  assert.deepEqual(errors, []);
  await writeFile(`${folder}/browser-checks.json`, JSON.stringify({checkedAt: new Date().toISOString(), renderedGuides: serviceIds.length, results, errors, notes: ['Illustrative service reading only; no provider or AWS API calls.', 'Search restoration, deep linking, English-only glossary, section focus and architecture isolation passed.']}, null, 2));
  console.log(JSON.stringify({passed: true, renderedGuides: serviceIds.length, responsiveChecks: results.length, screenshots: folder}));
} finally {
  await browser.close();
}
