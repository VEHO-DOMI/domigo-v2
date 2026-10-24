import assert from "node:assert/strict";
import { it } from "node:test";
import { readFileSync } from "node:fs";
import * as React from "react";
import * as jsx from "react/jsx-runtime";
import * as ts from "typescript";
import { renderToStaticMarkup } from "react-dom/server";
import * as register from "./register.ts";
import { trainerPreferences } from "./test-loader.ts";
import { modeDetails, memoryPairCount } from "../modi/catalog.ts";
import { activityCopy } from "../activity/copy.ts";
import { arenaCopy } from "../arena/copy.ts";
const source = (file: string) => readFileSync(new URL(file, import.meta.url), "utf8");
function yearRules(api: typeof register) {
  assert.deepEqual([1,2,3,4].map(api.defaultTrainerLanguage), ["de","en","en","en"]);
  assert.deepEqual([1,2,3,4].map(api.defaultTrainerTheme), ["light","light","dark","dark"]);
  for(const choice of ["de","en"] as const) assert.deepEqual([1,2,3,4].map(g=>api.trainerLanguage(g,choice)), [choice,"en","en","en"]);
}
it("W7 year defaults and a year-one choice never relabel an older year",()=>yearRules(register));
it("W7 store survives component navigation, isolates themes by year, notifies, and unsubscribes",()=>{
  const snapshots: (()=>unknown)[]=[];const stops: (()=>void)[]=[];let notifications=0;
  const api=trainerPreferences({react:{useSyncExternalStore(subscribe:(cb:()=>void)=>()=>void,get:()=>unknown){stops.push(subscribe(()=>notifications++));snapshots.push(get);return get();}},"react/jsx-runtime":jsx}) as unknown as {
    useTrainerLanguage:(g:number)=>string;useTrainerTheme:(g:number)=>string;chooseTrainerLanguage:(v:string)=>void;chooseTrainerTheme:(g:number,v:string)=>void;
  };
  assert.equal(api.useTrainerLanguage(1),"de");assert.equal(api.useTrainerLanguage(3),"en");
  api.chooseTrainerLanguage("en");assert.deepEqual(snapshots.map(f=>f()),["en","en"]);assert.equal(notifications,2);
  api.chooseTrainerLanguage("de");assert.deepEqual(snapshots.map(f=>f()),["de","en"]);
  api.chooseTrainerLanguage("invalid");assert.deepEqual(snapshots.map(f=>f()),["de","en"]);
  assert.equal(api.useTrainerTheme(1),"light");assert.equal(api.useTrainerTheme(4),"dark");api.chooseTrainerTheme(1,"dark");assert.equal(api.useTrainerTheme(1),"dark");assert.equal(api.useTrainerTheme(2),"light");api.chooseTrainerTheme(4,"light");assert.equal(api.useTrainerTheme(3),"dark");
  stops.forEach(stop=>stop());const before=notifications;api.chooseTrainerLanguage("en");assert.equal(notifications,before);
});
it("W7 server and first browser output agree, including German-first text",()=>{
  const api=trainerPreferences({react:React,"react/jsx-runtime":jsx}) as unknown as {TrainerText:React.ComponentType<{grade:number;de:string;en:string}>};
  for(const grade of [1,2,3,4])assert.equal(renderToStaticMarkup(React.createElement(api.TrainerText,{grade,de:"Zurück",en:"Back"})),grade===1?"Zurück":"Back");
});
it("W7 language choices change orientation, never the year-specific deck size",()=>{
  assert.deepEqual([1,2,3,4].map(memoryPairCount),[8,12,10,12]);
  assert.equal(modeDetails(1,"de").spelling.title,"Buchstabier-Biene");assert.equal(modeDetails(1,"en").spelling.title,"Spelling Bee");
  assert.equal(modeDetails(2).flashcards.title,"Karteikarten");
  assert.notDeepEqual(activityCopy(1,"de"),activityCopy(1,"en"));assert.deepEqual(activityCopy(1,"en"),activityCopy(3,"en"));
  assert.notDeepEqual(arenaCopy(1,"de"),arenaCopy(1,"en"));
});
it("W7 presentation store has no device persistence or request boundary",()=>{
  const code=source("./preferences.tsx").replace(/\/\/[^\n]*/g,"");
  assert.doesNotMatch(code,/localStorage|sessionStorage|indexedDB|document\.cookie|fetch\s*\(|XMLHttpRequest|WebSocket|sendBeacon/);
});
it("W7 rule mutations fail the year contract",()=>{
  const original=source("./register.ts");
  const mutants=[
    original.replace('grade === 1 ? "de" : "en"','grade === 1 ? "en" : "en"'),
    original.replace('grade >= 3 ? "dark" : "light"','grade >= 2 ? "dark" : "light"'),
    original.replace('grade >= 3 ? "dark" : "light"','grade >= 4 ? "dark" : "light"'),
    original.replace('grade === 1 ? chosen : "en"','chosen'),
    original.replace('grade === 1 ? chosen : "en"','"de"'),
  ];
  for(const mutant of mutants){assert.notEqual(mutant,original,"mutation must change production source");const m={exports:{}};const js=ts.transpileModule(mutant,{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText;new Function("exports",js)(m.exports);assert.throws(()=>yearRules(m.exports as typeof register));}
});
