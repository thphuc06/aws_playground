// Optional local QA: use the .preview Playwright installation described in the preview docs.
import {chromium} from '../.preview/node_modules/playwright/index.mjs';
import {mkdir, readFile, writeFile} from 'node:fs/promises';
import assert from 'node:assert/strict';

const base = process.env.PREVIEW_URL || 'http://127.0.0.1:4173';
const folder = process.env.PREVIEW_ARTIFACTS || 'artifacts/service-handbooks';
const requested = process.env.PREVIEW_PAGES?.split(',');
const routes = [
  ['home', '?view=home', '.home-hero'],
  ['library', '?view=services&exam=DVA-C03', '.atlas-results-heading'],
  ['lambda', '?view=services&exam=DVA-C03&service=lambda', '#guide-build'],
  ['builder', '?view=builder', '.react-flow'],
].filter(([name]) => !requested || requested.includes(name));
const browser = await chromium.launch({headless: true, executablePath: process.env.PREVIEW_CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe'});
await mkdir(folder, {recursive: true});
const results = [], contrast = [], errors = [], controls = [];
function luminance(value) {
  const rgb = value.startsWith('#') ? value.slice(1).match(/../g).map(v => parseInt(v,16)) : value.match(/[\d.]+/g).slice(0,3).map(Number);
  const linear = rgb.map(v => (v/=255) <= .04045 ? v/12.92 : ((v+.055)/1.055)**2.4);
  return linear[0]*.2126 + linear[1]*.7152 + linear[2]*.0722;
}
function ratio(a,b) {const x=luminance(a),y=luminance(b);return (Math.max(x,y)+.05)/(Math.min(x,y)+.05);}
let renderedGuides = 0;
try {
  for (const palette of ['slate', 'plum', 'forest']) for (const mode of ['light','dark']) {
    const context = await browser.newContext({viewport: {width:1440,height:1050}, reducedMotion:'reduce'});
    await context.addInitScript(({palette,mode}) => {
      if (!localStorage.getItem('aws-playground-palette')) localStorage.setItem('aws-playground-palette',palette);
      if (!localStorage.getItem('aws-playground-theme')) localStorage.setItem('aws-playground-theme',mode);
    }, {palette,mode});
    const page = await context.newPage();
    page.on('pageerror', error => errors.push(error.message));
    await page.route('**/api/**', route => {
      if (route.request().method() !== 'GET') errors.push('Unexpected mutation '+route.request().url());
      return route.fulfill({status:503,contentType:'application/json',body:'{"error":"Local visual-review fixture"}'});
    });
    for (const [name,query,ready] of routes) {
      await page.goto(base+'/'+query);
      await page.locator(ready).waitFor();
      assert.equal(await page.locator('html').getAttribute('data-theme'),mode);
      assert.equal(await page.locator('html').getAttribute('data-palette'),palette);
      if (name === 'home' || name === 'library') await page.screenshot({path:`${folder}/${name}-${palette}-${mode}.jpg`,type:'jpeg',quality:85});
      if (name === 'lambda') {
        await page.getByRole('button',{name:/02 Build & configure/}).click();
        assert.equal(await page.evaluate(()=>document.activeElement?.id),'guide-build');
        await page.screenshot({path:`${folder}/handbook-${palette}-${mode}.jpg`,type:'jpeg',quality:85});
        await page.getByRole('button',{name:/03 Example & troubleshoot/}).click();
        assert.equal(await page.evaluate(()=>document.activeElement?.id),'guide-diagnose');
        if (palette === 'slate') await page.screenshot({path:`${folder}/example-${mode}.jpg`,type:'jpeg',quality:85});
      }
      for (const width of [375,768,1440,1920]) {
        await page.setViewportSize({width,height:1050});
        assert(await page.evaluate(()=>document.documentElement.scrollWidth <= innerWidth+1),`${name} overflow ${palette}/${mode}/${width}`);
        for (const label of ['Color theme','Color palette']) {
          const box=await page.getByLabel(label).boundingBox();
          assert(box && box.width>=44 && box.height>=44,`${label} target ${palette}/${mode}/${width}`);
        }
        results.push({page:name,palette,mode,width,horizontalOverflow:false});
        if (name === 'lambda' && width === 375 && palette === 'slate') {
          await page.locator('#guide-build').scrollIntoViewIfNeeded();
          await page.screenshot({path:`${folder}/handbook-mobile-${mode}.jpg`,type:'jpeg',quality:85});
        }
      }
      await page.setViewportSize({width:1440,height:1050});
      if (name === 'home') {
        const actual = await page.locator('.home-actions .run-button').evaluate(el=>{const s=getComputedStyle(el);return {foreground:s.color,background:s.backgroundColor};});
        assert(ratio(actual.foreground,actual.background)>=4.5);
        controls.push({palette,mode,...actual,ratio:ratio(actual.foreground,actual.background)});
        const tokens=await page.evaluate(()=>{const s=getComputedStyle(document.documentElement);return Object.fromEntries([...s].filter(k=>k.startsWith('--')).map(k=>[k,s.getPropertyValue(k).trim()]));});
        const pairs=[];
        for(const fg of ['--text','--text-secondary','--text-muted']) for(const bg of ['--page','--surface','--surface-subtle','--surface-hover','--surface-selected']) pairs.push([fg,bg,4.5]);
        for(const role of ['success','danger','info','violet']) pairs.push([`--${role}-text`,`--${role}-soft`,4.5]);
        pairs.push(['--brand-on','--brand-solid',4.5],['--highlight-text','--highlight-soft',4.5],['--highlight-text','--surface-subtle',4.5],['--accent-text','--accent-soft',4.5],['--focus','--page',3],['--focus','--surface',3],['--accent-line','--surface',3]);
        for(const [fg,bg,minimum] of pairs) {
          const value=ratio(tokens[fg],tokens[bg]);
          assert(value>=minimum,`${palette}/${mode} ${fg}/${bg}: ${value}`);
          contrast.push({palette,mode,foreground:fg,background:bg,ratio:value,minimum});
        }
        assert.equal(await page.locator('meta[name="theme-color"]').getAttribute('content'),tokens['--page']);
      }
    }
    await page.getByLabel('Color palette').focus();
    assert(await page.getByLabel('Color palette').evaluate(el=>getComputedStyle(el).outlineStyle!=='none'));
    await page.getByLabel('Color theme').selectOption('system');
    for(const system of ['dark','light']) {
      await page.emulateMedia({colorScheme:system});
      await page.waitForFunction(system=>document.documentElement.dataset.theme===system,system);
      assert.equal(await page.locator('html').getAttribute('data-palette'),palette);
    }
    await page.reload();
    assert.equal(await page.locator('html').getAttribute('data-palette'),palette);
    assert.equal(await page.locator('html').getAttribute('data-theme'),'light');
    await context.close();
  }
  if (!requested) {
    const files=await Promise.all(['src/serviceHandbookComputeData.ts','src/serviceHandbookSecurityNetwork.ts','src/serviceHandbookDeliveryAI.ts'].map(path=>readFile(path,'utf8')));
    const ids=files.flatMap(file=>[...file.matchAll(/serviceId:\s*['"]([^'"]+)['"]/g)].map(m=>m[1]));
    assert.equal(new Set(ids).size,58);
    const context=await browser.newContext({viewport:{width:1440,height:1050}});
    const page=await context.newPage();
    page.on('pageerror',error=>errors.push(error.message));
    await page.route('**/api/**',route=>{errors.push('Unexpected API call during guide reading');return route.abort();});
    for(const id of ids) {
      await page.goto(base+'/?view=services&exam=DVA-C03&service='+id);
      await page.locator('#guide-build').waitFor();
      assert.equal(await page.locator('.handbook-setup > li').count(),4,id+': setup');
      assert.equal(await page.locator('.handbook-settings > article').count(),3,id+': configuration');
      assert.equal(await page.locator('.handbook-diagnostics > article').count(),3,id+': troubleshooting');
      assert(await page.locator('.handbook-code code').textContent(),id+': example');
      assert.equal(await page.locator('.guide-steps > li').count(),4,id+': existing scenario retained');
      renderedGuides++;
    }
    await context.close();
  }
  assert.deepEqual(errors,[]);
  const report={checkedAt:new Date().toISOString(),renderedGuides,results,contrast,controls,errors,notes:['Primary buttons and enumerated token pairs checked; not a full accessibility certification.','All provider calls intercepted; no AWS resources created.']};
  await writeFile(`${folder}/browser-checks.json`,JSON.stringify(report,null,2));
  console.log(JSON.stringify({passed:true,responsiveChecks:results.length,contrastChecks:contrast.length,renderedGuides,artifacts:folder}));
} finally {await browser.close();}
