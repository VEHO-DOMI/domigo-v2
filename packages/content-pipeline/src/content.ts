/**
 * DomiGo v2 content pipeline CLI.
 *
 *   pnpm content extract       [--grade N]      stage 1: docx → committed text + sources.lock
 *   pnpm content wordbank      [--grade N]      stage 2: master lists → per-unit wordbank.json
 *   pnpm content v1-snapshot                    v1 vocab+grammar corpus → content/build/v1 (parity oracle)
 *   pnpm content gen --structures --grade N --prepare           stage 4a: evidence brief (SB boxes + v1 floor)
 *   pnpm content gen --structures --grade N --ingest [--dry-run] stage 4c: draft → per-grade structures catalog
 *   pnpm content gen --prepare --unit g2-u03 [--fix]             stage 5a: generation briefs (vocab + grammar)
 *   pnpm content gen --ingest  --unit g2-u03 [--fix] [--dry-run] stage 5c: drafts → vocab.json/grammar.json
 *   pnpm content verify --prepare --unit g2-u03                  stage 6a: 4 adversarial lens briefs
 *   pnpm content verify --ingest  --unit g2-u03 [--dry-run]      stage 6c: merge lens flags, fix loop / escalate
 *   pnpm content harvest-nouns                                   proper-noun harvest → build/proper-nouns.json
 *   pnpm content review-doc    --items --unit g2-u03 [--full]    stage 8a: item review doc (validators must be green)
 *   pnpm content ingest-review --items --unit g2-u03 [--dry-run] stage 8c: verdicts/edits → item-fixes + state
 *   pnpm content review-doc    --wordbank [--grade N|--unit g2-u03]   generate review docs
 *   pnpm content review-doc    --allowlist                            core-allowlist review doc
 *   pnpm content ingest-review --wordbank [--grade N|--unit slug] [--dry-run]
 *   pnpm content ingest-review --allowlist [--dry-run]
 *   pnpm content story import --grade 1         Track C stage 1: legacy campaignLevels → story-draft@1
 *   pnpm content validate                       CI-safe checks over committed artifacts
 *   pnpm content validate-story                 opt-in: VS-1…VS-10 + release gate over story bundles
 *   pnpm content status                         per-unit state dashboard
 */
import type { Grade } from "@domigo/content-schema";
import { runIngestAllowlist, runReviewDocAllowlist } from "./allowlist.ts";
import { runExtract } from "./extract.ts";
import { runGenItemsIngest, runGenItemsPrepare } from "./gen-items.ts";
import { runGenStructuresIngest, runGenStructuresPrepare } from "./gen-structures.ts";
import { runHarvestNouns } from "./harvest-nouns.ts";
import { runIngestItems } from "./ingest-items.ts";
import { runIngestWordbank } from "./ingest-wordbank.ts";
import { runReviewDocItems } from "./review-items.ts";
import { runReviewDocWordbank } from "./review-wordbank.ts";
import { runStatus } from "./status.ts";
import { runStoryImport } from "./import-story.ts";
import { runStoryVariants } from "./mint-variants.ts";
import { runV1Snapshot } from "./v1snapshot.ts";
import { runValidate } from "./validate.ts";
import { runAuditVariants } from "./audit-variants.ts";
import { runValidateListening } from "./validate-listening.ts";
import { runValidateStory } from "./validate-story.ts";
import { runValidateTest } from "./validate-test.ts";
import { runVerifyIngest, runVerifyPrepare } from "./verify-items.ts";
import { runWordbank } from "./wordbank.ts";

function parseGrade(argv: string[]): Grade | undefined {
  const i = argv.indexOf("--grade");
  if (i === -1) return undefined;
  const value = Number(argv[i + 1]);
  if (value !== 1 && value !== 2 && value !== 3 && value !== 4) {
    throw new Error(`--grade must be 1..4, got: ${argv[i + 1]}`);
  }
  return value;
}

function parseUnit(argv: string[]): string | undefined {
  const i = argv.indexOf("--unit");
  if (i === -1) return undefined;
  const value = argv[i + 1];
  if (value === undefined || !/^g[1-4]-u\d{2}$/.test(value)) {
    throw new Error(`--unit must look like g2-u03, got: ${value}`);
  }
  return value;
}

function parseStoryId(argv: string[]): string | undefined {
  const i = argv.indexOf("--story");
  if (i === -1) return undefined;
  const value = argv[i + 1];
  if (value === undefined || !/^g[1-4]\.st\.[a-z0-9-]+$/.test(value)) {
    throw new Error(`--story must look like g2.st.wrong-name, got: ${value}`);
  }
  return value;
}

const [command, ...rest] = process.argv.slice(2);

switch (command) {
  case "extract":
    runExtract(parseGrade(rest));
    break;
  case "wordbank":
    runWordbank(parseGrade(rest));
    break;
  case "v1-snapshot":
    runV1Snapshot();
    break;
  case "gen": {
    if (rest.includes("--structures")) {
      const grade = parseGrade(rest);
      if (grade === undefined) throw new Error("gen --structures needs --grade N");
      if (rest.includes("--prepare")) runGenStructuresPrepare(grade);
      else if (rest.includes("--ingest")) runGenStructuresIngest(grade, rest.includes("--dry-run"));
      else throw new Error("gen --structures needs --prepare or --ingest");
      break;
    }
    const unit = parseUnit(rest);
    if (unit === undefined) throw new Error("gen needs --structures --grade N, or --unit g2-u03 for items");
    if (rest.includes("--prepare")) runGenItemsPrepare(unit, rest.includes("--fix"));
    else if (rest.includes("--ingest")) runGenItemsIngest(unit, rest.includes("--fix"), rest.includes("--dry-run"));
    else throw new Error("gen --unit needs --prepare or --ingest");
    break;
  }
  case "verify": {
    const unit = parseUnit(rest);
    if (unit === undefined) throw new Error("verify needs --unit g2-u03");
    if (rest.includes("--prepare")) runVerifyPrepare(unit);
    else if (rest.includes("--ingest")) runVerifyIngest(unit, rest.includes("--dry-run"));
    else throw new Error("verify needs --prepare or --ingest");
    break;
  }
  case "harvest-nouns":
    runHarvestNouns();
    break;
  case "review-doc":
    if (rest.includes("--allowlist")) runReviewDocAllowlist();
    else if (rest.includes("--wordbank")) runReviewDocWordbank({ grade: parseGrade(rest), unit: parseUnit(rest) });
    else if (rest.includes("--items")) {
      const unit = parseUnit(rest);
      if (unit === undefined) throw new Error("review-doc --items needs --unit g2-u03");
      runReviewDocItems(unit, rest.includes("--full"));
    } else throw new Error("review-doc needs --wordbank, --items or --allowlist");
    break;
  case "ingest-review":
    if (rest.includes("--allowlist")) runIngestAllowlist(rest.includes("--dry-run"));
    else if (rest.includes("--wordbank")) runIngestWordbank({ grade: parseGrade(rest), unit: parseUnit(rest) }, rest.includes("--dry-run"));
    else if (rest.includes("--items")) {
      const unit = parseUnit(rest);
      if (unit === undefined) throw new Error("ingest-review --items needs --unit g2-u03");
      runIngestItems(unit, rest.includes("--dry-run"));
    } else throw new Error("ingest-review needs --wordbank, --items or --allowlist");
    break;
  case "story": {
    const sub = rest[0];
    if (sub === "import") {
      const grade = parseGrade(rest);
      if (grade === undefined) throw new Error("story import needs --grade N (only g1 wired so far)");
      runStoryImport(grade);
    } else if (sub === "variants") {
      const id = parseStoryId(rest);
      if (id === undefined) throw new Error("story variants needs --story g2.st.<slug>");
      runStoryVariants(id, rest.includes("--dry-run"));
    } else {
      throw new Error(`story needs a subcommand: import | variants (got: ${sub ?? "(none)"})`);
    }
    break;
  }
  case "validate":
    runValidate();
    break;
  case "audit-variants":
    runAuditVariants();
    break;
  case "validate-listening":
    runValidateListening();
    break;
  case "validate-story":
    runValidateStory();
    break;
  case "validate-test":
    runValidateTest();
    break;
  case "status":
    runStatus();
    break;
  default:
    console.error(
      `unknown command: ${command ?? "(none)"}\nusage: pnpm content <extract|wordbank|v1-snapshot|gen|review-doc|ingest-review|story|validate|audit-variants|validate-listening|validate-story|validate-test|status> [flags]`,
    );
    process.exitCode = 2;
}
