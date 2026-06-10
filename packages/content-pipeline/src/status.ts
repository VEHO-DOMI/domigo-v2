/** `content status` — per-unit state dashboard. */
import fs from "node:fs";
import path from "node:path";
import { readJsonIfExists } from "./json.ts";
import { UNITS_DIR } from "./paths.ts";

interface StateLogFile {
  transitions: Array<{ state: string; at: string }>;
}
interface BankFile {
  entries: unknown[];
}

export function runStatus(): void {
  if (!fs.existsSync(UNITS_DIR)) {
    console.log("no units yet — run `pnpm content extract` then `pnpm content wordbank`");
    return;
  }
  const slugs = fs
    .readdirSync(UNITS_DIR)
    .filter((n) => /^g[1-4]-u\d{2}$/.test(n))
    .sort();
  console.log("unit      state               entries  last change");
  for (const slug of slugs) {
    const state = readJsonIfExists<StateLogFile>(path.join(UNITS_DIR, slug, "state.json"));
    const bank = readJsonIfExists<BankFile>(path.join(UNITS_DIR, slug, "wordbank.json"));
    const last = state?.transitions[state.transitions.length - 1];
    console.log(
      `${slug.padEnd(10)}${(last?.state ?? "—").padEnd(20)}${String(bank?.entries.length ?? 0).padStart(7)}  ${last?.at.slice(0, 10) ?? "—"}`,
    );
  }
  console.log(`\n${slugs.length} unit(s) on disk.`);
}
