import fs from 'node:fs';
import path from 'node:path';
import {createRequire} from 'node:module';
const {assignmentTarget}=createRequire(path.join(process.cwd(),'package.json'))('./scripts/lib/visual/assignment-target.mjs');
const {measure}=createRequire(path.join(process.cwd(),'package.json'))('./scripts/lib/trainer-display-measure.mjs');
import { test, expect } from 'playwright/test';
import { ACCENTS } from './visual-contract';
const local = process.env.VISUAL_FIXTURE === '1';
const accounts = process.env.VISUAL_ACCOUNTS ? JSON.parse(fs.readFileSync(process.env.VISUAL_ACCOUNTS, 'utf8')) : null;
const cases = [1,2,3,4].flatMap(grade => [
  { name:`home-g${grade}`, route:'/home', ready:'.og-player', grade, persona:`student-${grade}` },
  { name:`practice-g${grade}`, route:`/practice/g${grade}-u01`, ready:'[data-task-card]', grade, persona:`student-${grade}` },
  { name:`learn-g${grade}`, route:`/learn/g${grade}-u01`, ready:'main ol', grade, persona:`student-${grade}` },
  { name:`review-g${grade}`, route:'/review', ready:'main', grade, persona:`student-${grade}` },
  { name:`assignments-g${grade}`, route:'/assignments', ready:'main', grade, persona:`student-${grade}` },
]).concat([
  {name:'admin',route:'/admin',ready:'main',grade:0,persona:'teacher'},
  {name:'signin',route:'/signin',ready:'form input[name="joinCode"]',grade:0,persona:'guest'},
  {name:'game',route:'/play/3/ch01',ready:'.fourteen[data-card]',grade:3,persona:'teacher'},
]);
for (const row of cases) test(row.name, async ({browser}, info) => {
  const scheme = info.project.use.colorScheme as 'light'|'dark';
  const context = await browser.newContext({ ...info.project.use,
    extraHTTPHeaders: local ? {'x-visual-persona':row.persona} : undefined,
    storageState: !local && row.persona !== 'guest' ? accounts?.states[row.persona] : undefined,
  });
  const failures: string[] = [];
  const base = new URL(process.env.VISUAL_URL!);
  await context.route('**/*', route => {
    const request=route.request(), url=new URL(request.url());
    if (url.origin !== base.origin || !['GET','HEAD'].includes(request.method())) { failures.push(`forbidden ${request.method()} ${url.pathname}`); return route.abort(); }
    return route.continue();
  });
  const page = await context.newPage(); page.on('pageerror', error => failures.push(error.message));
  try {
    await page.clock.setFixedTime(new Date('2026-10-24T10:00:00Z'));
    const response = await page.goto(new URL(row.route,base).href);
    expect(response?.status()).toBe(200);
    expect(new URL(page.url()).pathname).toBe(row.route);
    await expect(page.locator(row.ready).first()).toBeVisible();
    await expect(page.locator('.dg-app-header')).toBeVisible();
    // Wait for the real client takeover; no mocked Next navigation or fonts.
    await page.waitForFunction(() => { const el=document.querySelector('[data-task-card] button,.og-footer button,.fourteen,.dg-app-header');return el && Object.keys(el).some(key=>key.startsWith('__reactFiber$')); });
    const shell = page.locator('.og-root');
    if (await shell.count()) {
      if (await shell.getAttribute('data-theme') !== scheme) await shell.locator('.og-footer button').click();
      await expect(shell).toHaveAttribute('data-theme',scheme);
      await expect(shell).toHaveAttribute('data-grade',String(row.grade));
      if (process.env.VISUAL_MUTANT === 'accent') await shell.evaluate(el => (el as HTMLElement).style.setProperty('--accent','#010203'));
      const actual=await shell.evaluate(el=>Object.fromEntries(['--accent','--accent-light','--accent-deep','--accent-glow'].map(k=>[k,getComputedStyle(el).getPropertyValue(k).replace(/\s+/g,'').toLowerCase()])));
      expect(actual).toEqual(ACCENTS[`${row.grade}-${scheme}` as keyof typeof ACCENTS]);
    }
    await page.evaluate(async()=>{await document.fonts.ready;await Promise.all([...document.images].map(image=>image.decode()));});
    if(await page.locator('.og-learning').count()) {
      if(process.env.VISUAL_MUTANT==='tap')await page.addStyleTag({content:'body:has(.og-learning)>.le-kopf button{min-height:0!important;height:17px!important;padding:0!important}'});
      const targets=await page.locator('.le-kopf button,.le-kopf a').evaluateAll(elements=>elements.filter(e=>e.getClientRects().length&&e.checkVisibility({visibilityProperty:true})).map(e=>{const r=e.getBoundingClientRect();return {label:e.textContent,width:r.width,height:r.height,y:r.y+scrollY};}));
      expect(targets.length).toBeGreaterThan(0);
      expect(targets.filter(t=>t.width<43.99||t.height<43.99||t.y<0),'V1_HEADER_TARGET').toEqual([]);
    }
    if(row.name.startsWith('learn-')) {
      if(process.env.VISUAL_MUTANT==='path-width')await page.addStyleTag({content:'.og-learning .learning-path-link{width:100px!important}'});
      if(process.env.VISUAL_MUTANT==='path-contrast')await page.addStyleTag({content:'.learning-path-action{color:#16a34a!important}'});
      const rows=await page.locator('.learning-path-link').evaluateAll(elements=>elements.map(e=>({width:e.getBoundingClientRect().width,parent:e.parentElement!.getBoundingClientRect().width,height:e.getBoundingClientRect().height})));
      expect(rows.length).toBeGreaterThan(0);expect(rows.filter(r=>Math.abs(r.width-r.parent)>1||r.height<44),'V1_PATH_WIDTH').toEqual([]);
      const measured=await measure(page), actions=measured.contrast.filter((r:{selector:string})=>r.selector==='learning-path-action');
      fs.writeFileSync(path.join(process.env.VISUAL_OUT!,`${info.project.name}-${row.name}-accessibility.json`),JSON.stringify({rows,actions},null,2));
      expect(actions.length).toBeGreaterThan(0);expect(actions.filter((r:{pass:boolean})=>!r.pass),'V1_PATH_CONTRAST').toEqual([]);
    }
    // Resolve before the screenshot: a missing synthetic task must report its cause,
    // rather than masquerade as an unrelated pixel difference.
    const assignment = row.name==='assignments-g1' ? assignmentTarget({baseUrl:base.href,
      links:await page.locator('main a[href^="/assignments/"]').evaluateAll(nodes=>nodes.map(node=>(node as HTMLAnchorElement).getAttribute('href')!)),
      local,provided:process.env.VISUAL_ASSIGNMENT_URL || accounts?.assignmentUrls?.['student-1']}) : null;
    await page.addStyleTag({content:'*,*::before,*::after{animation:none!important;transition:none!important;caret-color:transparent!important}'});
    if (process.env.VISUAL_MUTANT === 'pixel') await page.addStyleTag({content:'main{transform:translateX(1px)!important}'});
    // Only server-date-dependent text. No task, navigation or whole card is hidden.
    const masks=row.name.startsWith('home')?['.og-word','.og-definition','.og-today-heading > span']:[];
    await expect(page).toHaveScreenshot(`${row.name}.png`,{fullPage:true,mask:masks.map(s=>page.locator(s))});
    if(row.name==='assignments-g1') {
      await page.getByRole('button',{name:'English',exact:true}).click();
      if(await shell.getAttribute('data-theme')!=='dark')await shell.locator('.og-footer button').click();
      await page.evaluate(()=>Reflect.set(window,'__visualNavigationMark','kept'));
      const historyBefore = await page.evaluate(()=>history.length);
      await page.getByRole('link',{name:'← Home',exact:true}).click();await expect(page).toHaveURL(/\/home$/);
      await expect(page.locator('.og-player')).toBeVisible();
      expect(await page.evaluate(()=>Reflect.get(window,'__visualNavigationMark')),'V1_NAV_STATE').toBe('kept');
      await expect(page.locator('.og-root')).toHaveAttribute('lang','en');await expect(page.locator('.og-root')).toHaveAttribute('data-theme','dark');
      await expect.poll(()=>page.evaluate(()=>history.length),{message:'V1_NAV_HISTORY: Home must create a return entry'}).toBeGreaterThan(historyBefore);
      await page.goBack();await expect(page).toHaveURL(/\/assignments$/);
      await expect(page.locator('.og-root')).toHaveAttribute('lang','en');
      // Open the real detail route with a synthetic assignment and no sitting.
      // Navigation must keep the same document and in-memory preferences.
      const links = await page.locator('main a[href^="/assignments/"]').evaluateAll(nodes => nodes.map(node => (node as HTMLAnchorElement).getAttribute('href')!));
      const target = assignmentTarget({baseUrl:base.href,links,local,provided:assignment!.href});
      expect(target.href).toBe(assignment!.href);
      await page.locator('main a[href^="/assignments/"]').nth(target.index).click();await expect(page).toHaveURL(target.href);
      await expect(page.getByRole('button',{name:'Begin',exact:true})).toBeVisible();
      await expect(page.locator('.og-root')).toHaveAttribute('lang','en');await expect(page.locator('.og-root')).toHaveAttribute('data-theme','dark');
      expect(await page.evaluate(()=>Reflect.get(window,'__visualNavigationMark')),'V1_NAV_STATE').toBe('kept');
      await page.goBack();await expect(page.locator('.og-root')).toHaveAttribute('lang','en');await expect(page.locator('.og-root')).toHaveAttribute('data-theme','dark');
    }
    expect(failures).toEqual([]);
  } finally { await context.close(); }
});
