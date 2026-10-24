/** Explicit local inputs; never searches personal directories, reads DB or rewrites corpus. */
import fs from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";
import { WordBank, VocabFile, VocabItem, GRADES, UNITS_PER_GRADE, unitSlug } from "@domigo/content-schema";
import { parseDocxBlocks } from "./docx.ts";
import { readUnitItems, applyItemFixes } from "./gen-items.ts";
import { UNITS_DIR, REPO_ROOT } from "./paths.ts";
import { buildVocabularyIntake, type AppendixSource, type BankOccurrence, type IntakeGrade, type TaskOccurrence } from "./vocabulary-intake.ts";

/** Resolve existing directory shortcuts before enforcing the report boundary. */
export function reportOutputPath(requested: string, repository: string): string {
  let ancestor = path.resolve(requested);
  const missing: string[] = [];
  while (!fs.existsSync(ancestor)) {
    missing.unshift(path.basename(ancestor));
    const parent = path.dirname(ancestor);
    if (parent === ancestor) throw Error("cannot resolve output ancestor");
    ancestor = parent;
  }
  const physical = path.join(fs.realpathSync(ancestor), ...missing);
  const root = fs.realpathSync(repository);
  const relative = path.relative(root, physical);
  if (relative === "" || (!relative.startsWith(`..${path.sep}`) && relative !== ".." && !path.isAbsolute(relative))) throw Error("intake output must be outside the repository");
  return physical;
}

const hash = (bytes: Buffer) => createHash("sha256").update(bytes).digest("hex");
export function runVocabularyIntake(args: string[]): void {
  try { runVocabularyIntakeInternal(args); }
  catch (error) {
    // Filesystem errors can contain the resolved target of an innocently named
    // output alias. No IO error may escape the public CLI with a private path.
    const code = (error as NodeJS.ErrnoException)?.code;
    if (code === "EEXIST") throw Error("intake output already exists; use a new output or --verify");
    if (typeof code === "string") throw Error("intake could not read or write its files");
    if (error instanceof SyntaxError) throw Error("intake input contains invalid JSON");
    throw error;
  }
}

function runVocabularyIntakeInternal(args: string[]): void {
  const value = (flag: string) => {
    const i = args.indexOf(flag);
    if (i < 0 || !args[i+1] || args[i+1]!.startsWith("--")) throw Error(`vocabulary-intake requires ${flag}`);
    return args[i+1]!;
  };
  const manifestPath = path.resolve(value("--manifest"));
  const outputPath = reportOutputPath(value("--out"), REPO_ROOT);
  if (args.filter(a=>a === "--manifest").length !== 1 || args.filter(a=>a === "--out").length !== 1 || args.filter(a=>a === "--verify").length > 1) throw Error("duplicate intake argument");
  for (let i=0;i<args.length;i++) {
    if (["--manifest","--out"].includes(args[i]!)) { i++; continue; }
    if (args[i] !== "--verify") throw Error("unknown vocabulary-intake argument");
  }
  // Reports can be large and contain source text. Keep them outside the repo.
  const manifest: unknown = JSON.parse(fs.readFileSync(manifestPath,"utf8"));
  if (!Array.isArray(manifest) || manifest.length !== 4) throw Error("manifest must list four explicit local appendix paths");
  const sources: AppendixSource[] = manifest.map((m: unknown) => {
    if (m === null || typeof m !== "object" || Array.isArray(m)) throw Error("invalid appendix manifest entry");
    const row = m as Record<string,unknown>;
    if (Object.keys(row).some(k => !["grade","path"].includes(k)) || ![1,2,3,4].includes(row.grade as number) || typeof row.path !== "string") throw Error("invalid appendix manifest entry");
    const input = path.resolve(path.dirname(manifestPath),row.path);
    if (!input.toLowerCase().endsWith(".docx")) throw Error("appendix input must be a DOCX file");
    // Do not put private directory names in output or caught error messages.
    try {
      const bytes = fs.readFileSync(input);
      const sha256 = hash(bytes);
      const blocks = parseDocxBlocks(input, true);
      if (hash(fs.readFileSync(input)) !== sha256) throw Error("source changed while reading");
      return { grade: row.grade as IntakeGrade, sha256, blocks };
    } catch { throw Error(`cannot read appendix for grade ${row.grade}`); }
  });
  const banks: BankOccurrence[] = []; const tasks: TaskOccurrence[] = []; const pins: Array<{path:string;sha256:string}> = [];
  const pin = (file: string) => pins.push({path:path.relative(REPO_ROOT,file).split(path.sep).join("/"),sha256:hash(fs.readFileSync(file))});
  const slugs = GRADES.flatMap(grade => Array.from({length:UNITS_PER_GRADE[grade]},(_,i)=>unitSlug(grade,i+1)));
  for (const slug of slugs) {
    const bankFile = path.join(UNITS_DIR,slug,"wordbank.json");
    const bank = WordBank.parse(JSON.parse(fs.readFileSync(bankFile,"utf8")));
    if (bank.slug !== slug) throw Error("bank folder and unit disagree");
    const vocabFile = path.join(UNITS_DIR,slug,"vocab.json");
    const base = VocabFile.parse(JSON.parse(fs.readFileSync(vocabFile,"utf8")));
    if (base.slug !== slug || base.grade !== bank.grade || base.unit !== bank.unit) throw Error("task source and bank unit disagree");
    pin(bankFile); pin(vocabFile);
    for (const e of bank.entries) banks.push({id:e.id,slug,grade:bank.grade,unit:bank.unit,en:e.en,deRaw:e.deRaw});
    const effective = applyItemFixes(slug,readUnitItems(slug));
    for (const candidate of effective.vocab) {
      const item = VocabItem.parse(candidate);
      tasks.push({id:item.id,slug,w:item.w});
    }
  }
  pin(path.join(REPO_ROOT,"content/overlays/item-fixes.json"));
  const report = buildVocabularyIntake(sources,banks,tasks,pins);
  const text = JSON.stringify(report,null,2)+"\n";
  if (args.includes("--verify")) {
    if (fs.readFileSync(outputPath,"utf8") !== text) throw Error("intake verification failed: artifact differs from pinned inputs/reconciliation");
  } else {
    fs.mkdirSync(path.dirname(outputPath),{recursive:true});
    // Never overwrite an unrelated report/source by accident.
    fs.writeFileSync(outputPath,text,{flag:"wx"});
  }
  console.log(JSON.stringify({mode:args.includes("--verify")?"verified":"review-only",...report.counts}));
}
