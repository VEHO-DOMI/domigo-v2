/** `content status` — per-unit state dashboard (review round + flags aware). */
import fs from "node:fs";
import path from "node:path";
import { readJsonIfExists } from "./json.ts";
import { UNITS_DIR } from "./paths.ts";

interface StateLogFile {
  transitions: Array<{ state: string; at: string; note: string | null }>;
}
interface BankFile {
  entries: unknown[];
}
interface FlagsFile {
  round: number;
  flags: Array<{ verdict: string }>;
  unit: { verdict: string };
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
  const tally = new Map<string, number>();
  console.log("unit      state               entries  round  flags         last change");
  for (const slug of slugs) {
    const state = readJsonIfExists<StateLogFile>(path.join(UNITS_DIR, slug, "state.json"));
    const bank = readJsonIfExists<BankFile>(path.join(UNITS_DIR, slug, "wordbank.json"));
    const flags = readJsonIfExists<FlagsFile>(path.join(UNITS_DIR, slug, "review", "wordbank.flags.json"));
    const last = state?.transitions[state.transitions.length - 1];
    const stateName = last?.state ?? "—";
    tally.set(stateName, (tally.get(stateName) ?? 0) + 1);
    const flagsCell =
      flags === null
        ? "—"
        : `${flags.flags.length} (${flags.flags.filter((f) => f.verdict === "fix").length} fix)`;
    console.log(
      `${slug.padEnd(10)}${stateName.padEnd(20)}${String(bank?.entries.length ?? 0).padStart(7)}  ${String(flags?.round ?? "—").padStart(5)}  ${flagsCell.padEnd(12)}  ${last?.at.slice(0, 10) ?? "—"}`,
    );
  }
  console.log(`\n${slugs.length} unit(s): ${[...tally.entries()].sort().map(([s, n]) => `${s}=${n}`).join(" · ")}`);
}
