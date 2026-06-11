/**
 * DomiGo v2 content pipeline CLI.
 *
 *   pnpm content extract   [--grade N]   stage 1: docx → committed text + sources.lock
 *   pnpm content wordbank  [--grade N]   stage 2: master lists → per-unit wordbank.json
 *   pnpm content validate                CI-safe checks over committed artifacts
 *   pnpm content status                  per-unit state dashboard
 *
 * Later stages (gen / verify / validate / review-doc / ingest-review /
 * compile) are specified in the approved kickoff plan.
 */
import type { Grade } from "@domigo/content-schema";
import { runExtract } from "./extract.ts";
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
  case "validate":
    runValidate();
    break;
  case "status":
    runStatus();
    break;
  default:
    console.error(`unknown command: ${command ?? "(none)"}\nusage: pnpm content <extract|wordbank|status> [--grade N]`);
    process.exitCode = 2;
}
