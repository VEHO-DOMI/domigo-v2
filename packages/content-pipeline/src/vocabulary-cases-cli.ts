import fs from "node:fs";
import path from "node:path";
import { loadVocabularySnapshot, reportOutputPath } from "./vocabulary-intake-cli.ts";
import { REPO_ROOT } from "./paths.ts";
import { buildVocabularyCases, applyCaseDecisions } from "./vocabulary-cases.ts";

/** Explicit local source manifest and review proposals; never reads a learner store. */
export function runVocabularyCases(args: string[]): void {
  try { run(args); }
  catch (error) {
    const code=(error as NodeJS.ErrnoException)?.code;
    if (code==="EEXIST") throw Error("vocabulary case output already exists; use a new output or --verify");
    if (typeof code==="string") throw Error("vocabulary cases could not read or write their files");
    if (error instanceof SyntaxError) throw Error("vocabulary case input contains invalid JSON");
    if (error instanceof Error&&error.name==="ZodError") throw Error("invalid vocabulary case evidence or decision format");
    throw error;
  }
}
function run(args: string[]): void {
  const values=new Map<string,string>();let verify=false;
  for (let i=0;i<args.length;i++) {
    const flag=args[i]!;
    if (flag==="--verify") {if(verify)throw Error("duplicate case argument");verify=true;continue;}
    if (!["--manifest","--out","--decisions"].includes(flag)||values.has(flag)||!args[i+1]||args[i+1]!.startsWith("--")) throw Error("invalid vocabulary case argument");
    values.set(flag,args[++i]!);
  }
  if (!values.has("--manifest")||!values.has("--out")) throw Error("vocabulary-cases requires --manifest and --out");
  const output=reportOutputPath(values.get("--out")!,REPO_ROOT);
  const {intake,evidence}=loadVocabularySnapshot(path.resolve(values.get("--manifest")!));
  const book=buildVocabularyCases(intake,evidence);
  const decisionsPath=values.get("--decisions");
  const reviewed=decisionsPath ? applyCaseDecisions(book,JSON.parse(fs.readFileSync(path.resolve(decisionsPath),"utf8"))) : null;
  const report=reviewed ?? book;
  const bytes=JSON.stringify(report,null,2)+"\n";
  if (verify) { if(fs.readFileSync(output,"utf8")!==bytes)throw Error("vocabulary case verification failed: source, corpus, decision or artifact changed"); }
  else {fs.mkdirSync(path.dirname(output),{recursive:true});fs.writeFileSync(output,bytes,{flag:"wx"});}
  console.log(JSON.stringify({mode:verify?"verified":"review-only",...book.counts,proposals:reviewed?.proposals.length ?? 0,verifiedMeanings:0}));
}
