import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createRequire} from 'node:module';
import vm from 'node:vm';

// Freeze the application's calendar helper in the disposable fixture copy.
// Never replace the Next/webpack process clock: it tracks source file mtimes.
export const FIXTURE_TIME = '2026-10-24T10:00:00Z';
export function pinFixtureCalendar(source) {
  const anchor = 'export function viennaDateKey(now: Date = new Date()): string {';
  assert.equal(source.split(anchor).length, 2, 'VISUAL_CALENDAR_ANCHOR');
  return source.replace(anchor, `${anchor}\n  now = new Date('${FIXTURE_TIME}'); // synthetic visual calendar only`);
}

if (process.argv.includes('--selftest')) {
  const source=fs.readFileSync(new URL('../../../apps/web/lib/wort-des-tages.ts',import.meta.url),'utf8');
  const ts=createRequire(new URL('../../../apps/web/package.json',import.meta.url))('typescript');
  const evaluate=(text,wall)=>{
    const fn=text.slice(text.indexOf('export function viennaDateKey'),text.indexOf('/** Pure selection'));
    const js=ts.transpileModule(fn.replace('export ',''),{compilerOptions:{target:ts.ScriptTarget.ES2022}}).outputText;
    class Clock extends Date {constructor(...args){super(...(args.length?args:[wall]));}}
    return vm.runInNewContext(js+'\nviennaDateKey()',{Date:Clock,Intl});
  };
  for(const wall of [FIXTURE_TIME,'2026-10-31T10:00:00Z'])assert.equal(evaluate(pinFixtureCalendar(source),wall),'2026-10-24','VISUAL_CALENDAR_STABLE');
  assert.throws(()=>assert.equal(evaluate(source,'2026-10-31T10:00:00Z'),'2026-10-24','VISUAL_CALENDAR_STABLE'),/VISUAL_CALENDAR_STABLE/);
  assert.throws(()=>pinFixtureCalendar(source.replace('viennaDateKey','renamedCalendar')),/VISUAL_CALENDAR_ANCHOR/);
  console.log('fixture-clock: 2 dates stable; removed freeze and missing anchor rejected');
}
