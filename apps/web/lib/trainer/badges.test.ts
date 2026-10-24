import assert from "node:assert/strict";
import { it } from "node:test";
import { readFileSync } from "node:fs";
import * as React from "react";
import * as jsx from "react/jsx-runtime";
import * as ts from "typescript";
import { renderToStaticMarkup } from "react-dom/server";
import { loadTestModule } from "../arena/test-loader.ts";
import { STUDENT_BADGES } from "./badges.ts";
import * as register from "./register.ts";
const ids=["streak-3","streak-7","prestige-1","prestige-2","prestige-3","duo-champion","daily-first"];
it("all four years render exactly the seven authorized badges in every state",()=>{
  assert.deepEqual(STUDENT_BADGES.map(b=>b.id),ids);
  for(const grade of[1,2,3,4])for(const earned of[[],ids,null])for(const preview of[true,false]){
    const {default:Grid}=loadTestModule("apps/web/app/profil/BadgeGrid.tsx",{"react/jsx-runtime":jsx,"@/lib/trainer/preferences":{useTrainerLanguage:()=>grade===1?"de":"en"},"@/lib/trainer/badges":{STUDENT_BADGES},"./BadgeGrid.module.css":{default:{}}});
    const html=renderToStaticMarkup(React.createElement(Grid as React.ComponentType<{earned:string[]|null;grade:number;preview:boolean}>,{earned,grade,preview}));
    assert.deepEqual([...html.matchAll(/data-badge-id="([^"]+)"/g)].map(m=>m[1]),ids);
    assert.equal((html.match(/data-earned="true"/g)||[]).length,preview?0:earned?.length??0);
    assert.doesNotMatch(html,/\bsoon\b|\bbald\b/);
    if(!preview&&earned===null)assert.match(html,grade===1?/Nicht geladen/:/Not loaded/);
    if(grade===1)assert.match(html,/Deine Abzeichen/);
  }
});
it("profile reads only the authenticated owner and previews make no badge query",async()=>{
  for(const preview of[false,true])for(const fail of[false,true]){
    const calls:unknown[][]=[];const scope=["synthetic-class"];
    const view=preview?{kind:"preview",grades:[1]}:{kind:"student",player:{classScope:scope,classId:"synthetic-class",userId:"synthetic-owner"},grades:[1]};
    const props:unknown[]=[];
    const {default:Page}=loadTestModule("apps/web/app/profil/page.tsx",{
      "react/jsx-runtime":jsx,"next/link":{default:()=>null},"next/navigation":{redirect:()=>{throw Error("unexpected redirect");}},
      "@/lib/student-view":{resolveStudentView:async()=>view,trainerGrade:()=>1},
      "@/lib/trainer/preferences":{TrainerText:()=>null},"../home/TrainerShell":{default:({children}:{children:React.ReactNode})=>children},
      "../home/PlayerCard":{default:()=>null},"../home/trainer-data":{readTrainerProfile:async()=>({streak:0,avatar:1})},"./AvatarPicker":{default:()=>null},
      "./BadgeGrid":{default:(p:unknown)=>{props.push(p);return null;}},
      "@domigo/db":{getDb:()=>"synthetic-db",getStudentBadges:async(...args:unknown[])=>{calls.push(args);if(fail)throw Error("synthetic outage");return ["daily-first"];}}
    });
    renderToStaticMarkup(await (Page as unknown as (p:unknown)=>Promise<React.ReactNode>)({searchParams:Promise.resolve({})}));
    assert.deepEqual(calls,preview?[]:[["synthetic-db",scope,"synthetic-class","synthetic-owner"]]);
    assert.deepEqual(props,[{earned:preview?[]:fail?null:["daily-first"],grade:1,preview}]);
  }
});
function storageProbe(source:string){
  const io:string[]=[];const storage=new Proxy({}, {get(_t,key){io.push(`storage:${String(key)}`);return ()=>{};}});
  const document={};Object.defineProperty(document,"cookie",{get(){io.push("cookie:read");return "";},set(){io.push("cookie:write");}});
  const fakeWindow={localStorage:storage,sessionStorage:storage,document};
  const loaded={exports:{} as Record<string,(...args:unknown[])=>unknown>};
  const code=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.ReactJSX,target:ts.ScriptTarget.ES2022}}).outputText;
  const dependencies:Record<string,unknown>={"./register":register,"react/jsx-runtime":jsx,react:{useSyncExternalStore:(_subscribe:unknown,get:()=>unknown)=>get()}};
  new Function("require","module","exports","window","localStorage","sessionStorage","document","fetch",code)((id:string)=>{assert(id in dependencies);return dependencies[id];},loaded,loaded.exports,fakeWindow,storage,storage,document,()=>io.push("request"));
  const api=loaded.exports;
  for(const grade of[1,2,3,4])for(const theme of["light","dark"]){api.chooseTrainerTheme!(grade,theme);assert.equal(api.useTrainerTheme!(grade),theme);}
  api.chooseTrainerLanguage!("en");api.chooseTrainerLanguage!("de");assert.deepEqual(io,[],"THEME_NO_STORAGE");
}
it("actual theme store reads/writes no storage or cookies; persistence tamper is rejected",()=>{
  const source=readFileSync(new URL("./preferences.tsx",import.meta.url),"utf8");storageProbe(source);
  for(const inserted of['localStorage.setItem("theme",value);','document.cookie = "theme="+value;','window.sessionStorage.setItem("theme",value);','fetch("/preferences");']){
    const mutant=source.replace('themes.set(grade,value);',`themes.set(grade,value);${inserted}`);assert.notEqual(mutant,source);assert.throws(()=>storageProbe(mutant),/THEME_NO_STORAGE/);
  }
});
