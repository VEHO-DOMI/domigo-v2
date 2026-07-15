/**
 * `content gen-journeys` — J-2 · draft a deterministic journey spine per unit.
 *
 * The default spine (same unit → same draft): a LESSON (intro to the unit's new
 * words + grammar) → PRACTICE (the unit's practice pool) → GAME (the unit's
 * canonical released campaign stop — an overworld zone for g1, a story chapter for
 * g2–g4) → REVIEW (spaced retrieval). Every draft is schema- + corpus-validated
 * (gamePointer resolves, pools non-empty) — so the wave that writes all 57 is
 * green by construction. The g2 pilot (`content/corpus/units/g2-u03/journey.json`)
 * is the hand-polished exemplar Koki gates BEFORE that wave runs.
 *
 *   pnpm content gen-journeys --unit g2-u03      # print one draft (dry)
 *   pnpm content gen-journeys --all              # validate all 57 drafts (dry)
 *   pnpm content gen-journeys --all --write      # write journey.json for all (the WAVE)
 *   pnpm content gen-journeys --unit g1-u04 --write
 */
import fs from "node:fs";
import path from "node:path";
import { Journey } from "@domigo/content-schema";
import { readUnitItems } from "./gen-items.ts";
import { UNITS_DIR } from "./paths.ts";
import { buildReleasedStops, validateJourney } from "./validate-journeys.ts";

/** The default per-unit journey draft. `stops` is buildReleasedStops() (so the
 *  game node is added only when the unit's campaign stop is actually released). */
export function draftJourney(slug: string, stops: Map<number, Set<string>>): Record<string, unknown> | null {
  const m = /^g([1-4])-u(\d{2})$/.exec(slug);
  if (!m) return null;
  const grade = Number(m[1]);
  const unit = Number(m[2]);
  const short = grade === 1 ? `z${m[2]}` : `ch${m[2]}`; // g1 overworld zone; g2–4 story chapter

  const nodes: Record<string, unknown>[] = [
    { id: "lektion", kind: "lesson", titleDe: "Neue Wörter & Grammatik", titleEn: "New words & grammar" },
    { id: "ueben", kind: "practice", titleDe: "Üben", titleEn: "Practice", itemPool: "practice" },
  ];
  if (stops.get(grade)?.has(short)) {
    nodes.push({ id: "spiel", kind: "game", titleDe: "Weiter in der Geschichte", titleEn: null, gamePointer: { grade, zoneOrChapter: short } });
  }
  nodes.push({ id: "wiederholung", kind: "review", titleDe: "Wiederholung", titleEn: "Review" });

  return { schema: "journey@1", grade, unit, slug, nodes };
}

export function runGenJourneys(argv: string[]): void {
  const write = argv.includes("--write");
  const unitIdx = argv.indexOf("--unit");
  const one = unitIdx >= 0 ? argv[unitIdx + 1] : null;

  const stops = buildReleasedStops();
  const canResolve = (g: number, s: string): boolean => stops.get(g)?.has(s) ?? false;
  const slugs = one ? [one] : fs.readdirSync(UNITS_DIR).filter((n) => /^g[1-4]-u\d{2}$/.test(n)).sort();

  let okCount = 0;
  let fail = 0;
  for (const slug of slugs) {
    const draft = draftJourney(slug, stops);
    if (!draft) {
      console.error(`✗ ${slug}: not a unit slug`);
      fail++;
      continue;
    }
    const parsed = Journey.safeParse(draft);
    if (!parsed.success) {
      console.error(`✗ ${slug}: schema — ${parsed.error.issues[0]?.path.join(".")}: ${parsed.error.issues[0]?.message}`);
      fail++;
      continue;
    }
    let ids: string[] = [];
    try {
      const it = readUnitItems(slug);
      ids = [...it.vocab.map((v) => v.id), ...it.grammar.map((g) => g.id)];
    } catch {
      /* no items */
    }
    const errs = validateJourney(parsed.data, canResolve, ids);
    if (errs.length > 0) {
      console.error(`✗ ${slug}: ${errs.join("; ")}`);
      fail++;
      continue;
    }
    okCount++;
    if (write) {
      fs.writeFileSync(path.join(UNITS_DIR, slug, "journey.json"), JSON.stringify(draft, null, 2) + "\n");
    } else if (one) {
      console.log(JSON.stringify(draft, null, 2));
    }
  }
  console.log(`gen-journeys: ${okCount} valid draft(s), ${fail} failed${write ? " — WRITTEN" : " (dry)"}.`);
  if (fail > 0) process.exit(1);
}
