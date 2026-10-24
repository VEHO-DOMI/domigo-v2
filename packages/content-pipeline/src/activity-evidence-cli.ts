import fs from "node:fs";
import path from "node:path";
import { z } from "zod";
import { GRADES, UNITS_PER_GRADE, VocabFile, VocabItem, unitSlug } from "@domigo/content-schema";
import { applyItemFixes, ITEM_FIXES_PATH, type ItemFixes } from "./gen-items.ts";
import { REPO_ROOT, UNITS_DIR } from "./paths.ts";
import { reportOutputPath } from "./vocabulary-intake-cli.ts";
import { activityHash, ActivityEvidenceError, buildActivityEvidence, SourceAlias } from "./activity-evidence.ts";

const File=z.object({alias:SourceAlias,path:z.string().min(1)}).strict();
const Manifest=z.object({schema:z.literal("activity-evidence-input@1"),sources:z.array(z.object({grade:z.union([z.literal(1),z.literal(2),z.literal(3),z.literal(4)]),data:File,audit:File.optional(),overrides:File.optional(),notes:z.array(File).optional()}).strict()).length(4)}).strict();
const fail=(message:string):never=>{throw new ActivityEvidenceError(message);};

/** Only explicit local source paths. Neither directory discovery nor learner/production stores. */
export function loadActivityEvidence(manifestPath:string) {
  const privatePins:Array<{requested:string;physical:string;sha256:string}>=[];
  const privateLocations=new Set<string>();
  const readPrivate=(requested:string)=>{
    const absolute=path.resolve(requested);
    const physical=fs.realpathSync(absolute);const bytes=fs.readFileSync(physical);
    privatePins.push({requested:absolute,physical,sha256:activityHash(bytes)});
    for(const filename of [absolute,physical]) {
      privateLocations.add(filename);privateLocations.add(path.basename(filename));
      const directory=path.dirname(filename);
      if(directory!==path.parse(directory).root)privateLocations.add(directory);
    }
    return bytes;
  };
  const manifest=Manifest.parse(JSON.parse(readPrivate(manifestPath).toString("utf8")));
  const load=(entry:z.infer<typeof File>,extensions:string[])=>{
    const filename=path.resolve(path.dirname(manifestPath),entry.path);
    if(!extensions.includes(path.extname(filename).toLowerCase()))fail("unsupported activity evidence file type");
    return {alias:entry.alias,bytes:readPrivate(filename)};
  };
  const sources=manifest.sources.map(s=>({grade:s.grade,data:load(s.data,[".js"]),audit:s.audit?load(s.audit,[".csv"]):null,overrides:s.overrides?load(s.overrides,[".csv"]):null,notes:(s.notes??[]).map(n=>load(n,[".md",".txt",".html"]))}));
  const corpusPins:Array<{path:string;sha256:string}>=[];
  const readCorpus=(filename:string):unknown=>{
    const bytes=fs.readFileSync(filename);
    corpusPins.push({path:path.relative(REPO_ROOT,filename).split(path.sep).join("/"),sha256:activityHash(bytes)});
    return JSON.parse(bytes.toString("utf8"));
  };
  const savedMap=readCorpus(path.join(REPO_ROOT,"apps/web/lib/activity/categories.json"));
  if(!savedMap||typeof savedMap!=="object"||Array.isArray(savedMap))fail("invalid current activity map");
  const map=savedMap as Record<string,unknown>;
  if(map.version!==1||!Array.isArray(map.sources)||!map.entries||typeof map.entries!=="object"||Array.isArray(map.entries))fail("invalid current activity map");
  const expectedSources=(map.sources as unknown[]).map(raw=>{
    if(!raw||typeof raw!=="object"||Array.isArray(raw))fail("invalid declared activity source");
    const r=raw as Record<string,unknown>;
    // The legacy map also has a private source path. It is intentionally unreachable here.
    return {grade:r.grade,sha256:r.sha256,originalEntries:r.originalEntries,matched:r.matched,canonicalEntries:r.canonicalEntries};
  });
  const classifications=Object.entries(map.entries as Record<string,unknown>).map(([id,raw])=>{
    if(!raw||typeof raw!=="object"||Array.isArray(raw))fail("invalid saved activity classification");
    const r=raw as Record<string,unknown>;
    if(Object.keys(r).some(k=>!["word","mode"].includes(k)))fail("unexpected saved activity classification field");
    return {id,word:r.word,mode:r.mode};
  });
  const fixes=readCorpus(ITEM_FIXES_PATH) as ItemFixes;
  if(!fixes||typeof fixes!=="object"||Array.isArray(fixes))fail("invalid vocabulary item overlay");
  const tasks=[];
  for(const grade of GRADES)for(let unit=1;unit<=UNITS_PER_GRADE[grade];unit++) {
    const slug=unitSlug(grade,unit);
    const base=VocabFile.parse(readCorpus(path.join(UNITS_DIR,slug,"vocab.json")));
    if(base.slug!==slug||base.grade!==grade||base.unit!==unit)fail("activity task folder and placement disagree");
    const effective=applyItemFixes(slug,{vocab:base.items,grammar:[]},fixes);
    for(const raw of effective.vocab) {
      const item=VocabItem.parse(raw);
      tasks.push({id:item.id,grade,unit,w:item.w,g:item.g,taskFingerprint:activityHash(Buffer.from(JSON.stringify(item)))});
    }
  }
  const report=buildActivityEvidence({sources,expectedSources,classifications,tasks,corpusPins});
  for(const pin of privatePins) {
    const current=fs.realpathSync(pin.requested);
    if(current!==pin.physical||activityHash(fs.readFileSync(current))!==pin.sha256)fail("activity source changed while reading");
  }
  for(const pin of corpusPins)if(activityHash(fs.readFileSync(path.join(REPO_ROOT,pin.path)))!==pin.sha256)fail("activity corpus changed while reading");
  const text=JSON.stringify(report,null,2)+"\n";
  // A source rationale can itself contain a private location. Fail rather than redact evidence.
  for(const location of privateLocations)if(location&&(text.includes(location)||text.includes(JSON.stringify(location).slice(1,-1))))fail("activity report contains an input location; use a neutral source bundle");
  return report;
}

export function runActivityEvidence(args:string[]):void {
  try {
    const values=new Map<string,string>();let verify=false;
    for(let i=0;i<args.length;i++) {
      const flag=args[i]!;
      if(flag==="--verify") {if(verify)fail("duplicate activity argument");verify=true;continue;}
      if(!["--manifest","--out"].includes(flag)||values.has(flag)||!args[i+1]||args[i+1]!.startsWith("--"))fail("invalid activity evidence argument");
      values.set(flag,args[++i]!);
    }
    if(!values.has("--manifest")||!values.has("--out"))fail("activity-evidence requires --manifest and --out");
    const output=reportOutputPath(values.get("--out")!,REPO_ROOT);
    const report=loadActivityEvidence(path.resolve(values.get("--manifest")!));
    const bytes=JSON.stringify(report,null,2)+"\n";
    if(verify) {if(fs.readFileSync(output,"utf8")!==bytes)fail("activity verification failed: source, corpus or report changed");}
    else {fs.mkdirSync(path.dirname(output),{recursive:true});fs.writeFileSync(output,bytes,{flag:"wx"});}
    console.log(JSON.stringify({mode:verify?"verified":"review-only",...report.counts}));
  } catch(error) {
    if(error instanceof ActivityEvidenceError)throw error;
    if((error as NodeJS.ErrnoException)?.code==="EEXIST")throw Error("activity output already exists; use another output or --verify");
    if(typeof(error as NodeJS.ErrnoException)?.code==="string")throw Error("activity evidence could not read or write its files");
    if(error instanceof SyntaxError)throw Error("invalid activity input JSON");
    // Do not forward Zod values, filesystem paths, native exceptions or private aliases.
    throw Error("invalid activity evidence input or output boundary");
  }
}
