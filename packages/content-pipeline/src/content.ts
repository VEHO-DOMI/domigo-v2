/**
 * DomiGo v2 content pipeline CLI.
 *
 *   pnpm content extract       [--grade N]      stage 1: docx → committed text + sources.lock
 *   pnpm content wordbank      [--grade N]      stage 2: master lists → per-unit wordbank.json
 *   pnpm content v1-snapshot                    v1 vocab corpus → content/build/v1 (parity oracle)
 *   pnpm content review-doc    --wordbank [--grade N|--unit g2-u03]   generate review docs
 *   pnpm content review-doc    --allowlist                            core-allowlist review doc
 *   pnpm content ingest-review --wordbank [--grade N|--unit slug] [--dry-run]
 *   pnpm content ingest-review --allowlist [--dry-run]
 *   pnpm content validate                       CI-safe checks over committed artifacts
 *   pnpm content status                         per-unit state dashboard
 */
import type { Grade } from "@domigo/content-schema";
import { runIngestAllowlist, runReviewDocAllowlist } from "./allowlist.ts";
import { runExtract } from "./extract.ts";
import { runIngestWordbank } from "./ingest-wordbank.ts";
import { runReviewDocWordbank } from "./review-wordbank.ts";
import { runStatus } from "./status.ts";
import { runV1Snapshot } from "./v1snapshot.ts";
import { runValidate } from "./validate.ts";
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
  case "review-doc":
    if (rest.includes("--allowlist")) runReviewDocAllowlist();
    else if (rest.includes("--wordbank")) runReviewDocWordbank({ grade: parseGrade(rest), unit: parseUnit(rest) });
    else throw new Error("review-doc needs --wordbank or --allowlist");
    break;
  case "ingest-review":
    if (rest.includes("--allowlist")) runIngestAllowlist(rest.includes("--dry-run"));
    else if (rest.includes("--wordbank")) runIngestWordbank({ grade: parseGrade(rest), unit: parseUnit(rest) }, rest.includes("--dry-run"));
    else throw new Error("ingest-review needs --wordbank or --allowlist");
    break;
  case "validate":
    runValidate();
    break;
  case "status":
    runStatus();
    break;
  default:
    console.error(
      `unknown command: ${command ?? "(none)"}\nusage: pnpm content <extract|wordbank|v1-snapshot|review-doc|ingest-review|validate|status> [flags]`,
    );
    process.exitCode = 2;
}
