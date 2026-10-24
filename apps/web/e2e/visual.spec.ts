import fs from 'node:fs';
import { test, expect } from 'playwright/test';
import { ACCENTS } from './visual-contract';
const local = process.env.VISUAL_FIXTURE === '1';
const accounts = process.env.VISUAL_ACCOUNTS ? JSON.parse(fs.readFileSync(process.env.VISUAL_ACCOUNTS, 'utf8')) : null;
const cases = [1,2,3,4].flatMap(grade => [
  { name:`home-g${grade}`, route:'/home', ready:'.og-player', grade, persona:`student-${grade}` },
  { name:`practice-g${grade}`, route:`/practice/g${grade}-u01`, ready:'[data-task-card]', grade, persona:`student-${grade}` },
  { name:`learn-g${grade}`, route:`/learn/g${grade}-u01`, ready:'main ol', grade, persona:`student-${grade}` },
  { name:`review-g${grade}`, route:'/review', ready:'main', grade, persona:`student-${grade}` },
  { name:`assignments-g${grade}`, route:'/assignments', ready:'main a[href^="/assignments/"]', grade, persona:`student-${grade}` },
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
    await page.addStyleTag({content:'*,*::before,*::after{animation:none!important;transition:none!important;caret-color:transparent!important}'});
    if (process.env.VISUAL_MUTANT === 'pixel') await page.addStyleTag({content:'main{transform:translateX(1px)!important}'});
    // Only server-date-dependent text. No task, navigation or whole card is hidden.
    const masks=row.name.startsWith('home')?['.og-word','.og-definition','.og-today-heading > span']:[];
    await expect(page).toHaveScreenshot(`${row.name}.png`,{fullPage:true,mask:masks.map(s=>page.locator(s))});
    expect(failures).toEqual([]);
  } finally { await context.close(); }
});
