import fs from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";
import { z } from "zod";
import { loadVocabularySnapshot, reportOutputPath } from "./vocabulary-intake-cli.ts";
import { loadActivityEvidence } from "./activity-evidence-cli.ts";
import { REPO_ROOT } from "./paths.ts";
import { buildSourceWave } from "./vocabulary-source-wave.ts";
import { sourceWaveReviewFiles } from "./vocabulary-source-wave-review.ts";

const hash = (bytes: Uint8Array) => createHash("sha256").update(bytes).digest("hex");
const Prior = z.object({schema:z.literal("vocabulary-source-prior-sample@1"),label:z.literal("CODEX DRAFT — NOT CANON"),origin:z.string(),sourceArtifactSha256:z.string().regex(/^[a-f0-9]{64}$/u),cases:z.array(z.object({id:z.string(),sourceFingerprint:z.string().regex(/^[a-f0-9]{64}$/u)}).strict()).length(25)}).strict();
const Calibration = z.object({schema:z.literal("vocabulary-index@draft"),label:z.literal("CODEX DRAFT — NOT CANON"),runtime:z.literal(false),approved:z.literal(false),records:z.array(z.object({recordId:z.string(),task:z.object({fingerprint:z.string().regex(/^[a-f0-9]{64}$/u)})})).length(34)});
class SourceWaveError extends Error {}
const fail = (text: string): never => { throw new SourceWaveError(text); };

export function loadSourceWave(appendixManifest: string, activityManifest: string) {
  const pins: Array<{ requested: string; physical: string; sha256: string; privateLocation: boolean }> = [];
  const capture = (requested: string, privateLocation = true) => {
    const absolute = path.resolve(requested), physical = fs.realpathSync(absolute), bytes = fs.readFileSync(physical);
    pins.push({requested:absolute,physical,sha256:hash(bytes),privateLocation});return bytes;
  };
  for (const [manifest, kind] of [[appendixManifest,"appendix"],[activityManifest,"activity"]] as const) {
    const raw = JSON.parse(capture(manifest).toString("utf8"));
    const entries = kind === "appendix" ? raw : raw.sources;
    if (!Array.isArray(entries) || entries.length !== 4) fail("wave requires four explicit sources per manifest");
    for (const entry of entries) {
      const files = kind === "appendix" ? [entry] : [entry.data,entry.audit,entry.overrides,...(entry.notes??[])].filter(Boolean);
      for (const file of files) {
        if (!file || typeof file.path !== "string") fail("invalid explicit wave source");
        capture(path.resolve(path.dirname(manifest),file.path));
      }
    }
  }
  const snapshot = loadVocabularySnapshot(appendixManifest), activity = loadActivityEvidence(activityManifest);
  const relative = "docs/review/source-wave-prior-sample.json", raw = capture(path.join(REPO_ROOT,relative),false);
  const prior = Prior.parse(JSON.parse(raw.toString("utf8")));
  snapshot.intake.corpusPins.push({path:relative,sha256:hash(raw)});
  const calibrationPath="docs/review/vocabulary-calibration-g2-u03.json", calibrationBytes=capture(path.join(REPO_ROOT,calibrationPath),false);
  const calibration=Calibration.parse(JSON.parse(calibrationBytes.toString("utf8")));
  snapshot.intake.corpusPins.push({path:calibrationPath,sha256:hash(calibrationBytes)});
  const report = buildSourceWave(snapshot.intake,snapshot.evidence,activity,prior.cases,{artifact:calibrationPath,sha256:hash(calibrationBytes),records:calibration.records});
  for (const pin of pins) if (fs.realpathSync(pin.requested)!==pin.physical || hash(fs.readFileSync(pin.physical))!==pin.sha256) fail("wave source changed while reading");
  for (const pin of report.corpusPins) if (hash(fs.readFileSync(path.join(REPO_ROOT,pin.path)))!==pin.sha256) fail("wave corpus changed while reading");
  const text = JSON.stringify(report);
  // Keep private routing out of evidence, including source quotations that contain it.
  for (const pin of pins.filter(p=>p.privateLocation)) for (const filename of [pin.requested,pin.physical]) {
    for (const secret of [filename,path.basename(filename),path.dirname(filename)]) {
      if (secret !== path.parse(filename).root && (text.includes(secret) || text.includes(JSON.stringify(secret).slice(1,-1)))) fail("wave evidence contains a private input location; use neutral source names");
    }
  }
  return report;
}

export function runSourceWave(args: string[]) {
  try {
    const values = new Map<string,string>();let verify = false;
    for (let i=0;i<args.length;i++) {
      const flag=args[i]!;
      if (flag==="--verify") {if(verify)fail("duplicate wave flag");verify=true;continue;}
      if (!["--manifest","--activity-manifest","--out","--review-dir"].includes(flag) || values.has(flag) || !args[i+1] || args[i+1]!.startsWith("--")) fail("invalid wave argument");
      values.set(flag,args[++i]!);
    }
    if (!values.has("--manifest") || !values.has("--activity-manifest") || !values.has("--out")) fail("source-wave requires --manifest, --activity-manifest and --out");
    const output = reportOutputPath(values.get("--out")!,REPO_ROOT);
    const report = loadSourceWave(path.resolve(values.get("--manifest")!),path.resolve(values.get("--activity-manifest")!));
    const text = JSON.stringify(report,null,2)+"\n";
    const files: Array<[string,string]> = [[output,text]];
    if(values.has("--review-dir"))for(const [relative,bytes] of Object.entries(sourceWaveReviewFiles(report))) files.push([reportOutputPath(path.join(values.get("--review-dir")!,relative),REPO_ROOT),bytes]);
    if(new Set(files.map(([file])=>file)).size!==files.length)fail("wave output paths collide");
    if (verify) {for(const [file,bytes] of files)if(fs.readFileSync(file,"utf8")!==bytes)fail("wave verification failed: evidence or input changed");}
    else {
      if(files.some(([file])=>fs.existsSync(file)))fail("wave output already exists; use --verify or another output");
      for(const [file,bytes] of files){fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file,bytes,{flag:"wx"});}
    }
    console.log(JSON.stringify({mode:verify?"verified":"review-only",...report.counts}));
  } catch(error) {
    if (error instanceof SourceWaveError) throw error;
    if ((error as NodeJS.ErrnoException)?.code === "EEXIST") throw Error("wave output already exists; use --verify or another output");
    throw Error("invalid or unreadable source-wave input/output; no private paths are emitted");
  }
}
