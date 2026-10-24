import { afterAll, beforeAll, beforeEach, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";
import * as schema from "./schema.ts";
import type { Db } from "./index.ts";
import { classScope, EMPTY_SCOPE } from "./scope.ts";
import { getStudentBadges } from "./badge-service.ts";
const pg = new PGlite(), db = drizzle(pg, { schema }) as unknown as Db;
const id = (n: number) => `00000000-0000-4000-8000-${String(n).padStart(12,"0")}`;
const U=id(1), C=id(2), OTHER=id(3), FOREIGN=id(4), scope=classScope([C]);
const read = () => getStudentBadges(db,scope,C,U);
beforeAll(async()=>{
  await pg.exec("CREATE SCHEMA domigo_v2");
  const snapshot=JSON.parse(readFileSync(new URL("../drizzle/meta/0027_snapshot.json",import.meta.url),"utf8"));
  for(const t of Object.values(snapshot.tables) as Array<{name:string;columns:Record<string,{name:string;type:string;primaryKey:boolean;notNull:boolean;default?:string}>}>){
    if(!["users","user_progress","duels","practice_attempts"].includes(t.name))continue;
    const columns=Object.values(t.columns).map(c=>`"${c.name}" ${c.type}${c.primaryKey?" PRIMARY KEY":""}${c.notNull?" NOT NULL":""}${"default" in c?` DEFAULT ${c.default}`:""}`);
    await pg.exec(`CREATE TABLE domigo_v2."${t.name}" (${columns.join(",")})`);
  }
});
beforeEach(async()=>{
  await pg.exec("TRUNCATE domigo_v2.users,domigo_v2.user_progress,domigo_v2.duels,domigo_v2.practice_attempts");
  await pg.query("INSERT INTO domigo_v2.users(id,class_id,role,display_name,pin_hash,claimed_at) VALUES($1,$2,'student','synthetic','not-a-credential',now())",[U,C]);
});
afterAll(()=>pg.close());
it("no confirmed activity gives zero badges; one read never writes",async()=>{
  expect(await read()).toEqual([]);
  const tables=["users","user_progress","duels","practice_attempts"];
  const count=async()=>Promise.all(tables.map(t=>pg.query(`SELECT count(*) FROM domigo_v2.${t}`)));
  const before=await count();await read();expect(await count()).toEqual(before);
});
for(const [column,threshold,badge] of [["streak",3,"streak-3"],["streak",7,"streak-7"],["xp",30000,"prestige-1"],["xp",45000,"prestige-2"],["xp",65000,"prestige-3"]] as const){
  it(`${badge}: ${threshold-1} is locked, ${threshold} earned`,async()=>{
    await pg.query(`INSERT INTO domigo_v2.user_progress(user_id,${column}) VALUES($1,$2)`,[U,threshold-1]);
    expect(await read()).not.toContain(badge);
    await pg.query(`UPDATE domigo_v2.user_progress SET ${column}=$1 WHERE user_id=$2`,[threshold,U]);
    expect(await read()).toContain(badge);
  });
}
async function duel(winner:string|null, status="complete", classId=C, mode="vocab"){
  await pg.query("INSERT INTO domigo_v2.duels(class_id,grade,p1,p2,mode,status,winner) VALUES($1,1,$2,$3,$4,$5,$6)",[classId,U,OTHER,mode,status,winner]);
}
it("four wins do not qualify, five own completed Word Duels do",async()=>{
  for(let n=0;n<4;n++)await duel(U);
  expect(await read()).not.toContain("duo-champion");
  await duel(OTHER);await duel(null);await duel(null,"expired");await duel(null,"active");await duel(U,"complete",FOREIGN);
  expect(await read()).not.toContain("duo-champion");
  await duel(U,"complete",C,"grammar");expect(await read()).toEqual(["duo-champion"]);
});
async function attempt({userId=U,classId=C,mode="daily",booked=true}:{userId?:string;classId?:string;mode?:string;booked?:boolean}={}){
  await pg.query("INSERT INTO domigo_v2.practice_attempts(user_id,class_id,item_id,kind,unit_slug,grade,mode,tier,correct,booked_at) VALUES($1,$2,'synthetic','vocab','g1-u01',1,$3,'wrong',false,$4)",[userId,classId,mode,booked?new Date("2026-10-24T10:00:00Z"):null]);
}
it("daily requires an own confirmed attempt, never an inferred completed round",async()=>{
  expect(await read()).not.toContain("daily-first");
  await attempt({booked:false});await attempt({mode:"practice"});await attempt({classId:FOREIGN});await attempt({userId:OTHER});
  expect(await read()).not.toContain("daily-first");
  await attempt();expect(await read()).toEqual(["daily-first"]);
});
it("all seven derive from their existing server sources, grammar XP is not vocabulary XP",async()=>{
  await pg.query("INSERT INTO domigo_v2.user_progress(user_id,xp,grammar_xp,streak) VALUES($1,0,999999,7)",[U]);
  expect(await read()).toEqual(["streak-3","streak-7"]);
  await pg.query("UPDATE domigo_v2.user_progress SET xp=65000 WHERE user_id=$1",[U]);
  for(let n=0;n<5;n++)await duel(U);await attempt();
  expect(await read()).toEqual(["streak-3","streak-7","prestige-1","prestige-2","prestige-3","duo-champion","daily-first"]);
});
it("scope, current class, own identity, claimed student are all required",async()=>{
  await pg.query("INSERT INTO domigo_v2.user_progress(user_id,xp,streak) VALUES($1,65000,7)",[U]);
  expect(await getStudentBadges(db,EMPTY_SCOPE,C,U)).toBeNull();
  expect(await getStudentBadges(db,scope,FOREIGN,U)).toBeNull();
  expect(await getStudentBadges(db,scope,C,OTHER)).toBeNull();
  await pg.query("UPDATE domigo_v2.users SET class_id=$1 WHERE id=$2",[FOREIGN,U]);expect(await read()).toBeNull();
  await pg.query("UPDATE domigo_v2.users SET class_id=$1,role='teacher' WHERE id=$2",[C,U]);expect(await read()).toBeNull();
  await pg.query("UPDATE domigo_v2.users SET role='student',claimed_at=null WHERE id=$1",[U]);expect(await read()).toBeNull();
});
