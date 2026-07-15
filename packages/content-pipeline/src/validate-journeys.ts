/**
 * `content validate-journeys` — the J-1 journey gate. Opt-in (like validate-story
 * / validate-listening): the main `content validate` stays blind to journey files.
 * The pure `validateJourney(journey, canResolve, unitItemIds)` is fixture-tested;
 * the runner wires the real corpus (released-stop resolution + item existence).
 *
 * Schema-level rules — node-id/mode-length ≤ 40, gamePointer-iff-game,
 * itemPool-only-on-practice/side-quest, mock-not-authorable — are enforced by
 * Journey's zod. This validator checks the things that need the CORPUS:
 *   J1  every gamePointer resolves to a RELEASED stop in its grade's CANONICAL
 *       campaign (overworld z-zone or chapter-game ch). Unreleased bundles — the
 *       Spill (no release.json), Lost-for-Words (0 released chapters) — FAIL.
 *   J2  every referenced itemPool is NON-EMPTY for its unit under the STATIC
 *       partition (empty reserved; homework/classwork/arcade come only from
 *       poolOverrides; practice is the default remainder).
 *   J3  every poolOverrides key is a real item in the unit.
 */
import fs from "node:fs";
import path from "node:path";
import { GameMap, Journey, Story, type AuthorablePool } from "@domigo/content-schema";
import { readUnitItems } from "./gen-items.ts";
import { readJsonIfExists } from "./json.ts";
import { UNITS_DIR } from "./paths.ts";
import { STORIES_DIR } from "./story-common.ts";

// ── released-stop resolver ────────────────────────────────────────────────────
// content-pipeline has no content-loader dep, so we read STORIES_DIR here — the
// SAME release.json / map.json the loader's storyIdForGrade reads. Deliberately
// replicated (not a second grade→story MAP, which the loader warns 400'd the g3
// `.ci.` attempts): we resolve from the files, canonical-only, ≤1 per grade.

/** grade → the short stop-ids (z07 / ch03) of that grade's CANONICAL released
 *  campaign. A grade with only unreleased/bonus stories yields an empty set. */
export function buildReleasedStops(): Map<number, Set<string>> {
  const byGrade = new Map<number, Set<string>>();
  if (!fs.existsSync(STORIES_DIR)) return byGrade;
  for (const id of fs.readdirSync(STORIES_DIR).filter((n) => /^g[1-4]\.st\.[a-z0-9-]+$/.test(n)).sort()) {
    const dir = path.join(STORIES_DIR, id);
    const rel = readJsonIfExists<{ releasedChapters?: string[]; role?: string }>(path.join(dir, "release.json"));
    if (!rel || !rel.releasedChapters || rel.releasedChapters.length === 0) continue; // unreleased
    if (rel.role === "bonus") continue; // only the canonical campaign is deep-linkable via /play
    const storyRaw = readJsonIfExists<unknown>(path.join(dir, "story.json"));
    const story = storyRaw === null ? null : Story.safeParse(storyRaw);
    if (!story || !story.success) continue;
    const stops = byGrade.get(story.data.grade) ?? new Set<string>();
    const mapRaw = readJsonIfExists<unknown>(path.join(dir, "map.json"));
    const map = mapRaw === null ? null : GameMap.safeParse(mapRaw);
    if (map && map.success) {
      for (const z of map.data.zones) { const s = z.id.split(".").pop(); if (s) stops.add(s); } // overworld zones
    } else {
      for (const cid of rel.releasedChapters) { const s = cid.split(".").pop(); if (s) stops.add(s); } // chapter game
    }
    byGrade.set(story.data.grade, stops);
  }
  return byGrade;
}

// ── pure core ─────────────────────────────────────────────────────────────────

/** An item's pool under the STATIC (validate-time) partition — no reserved set, so
 *  `mock` never appears here; homework/classwork/arcade come from overrides only. */
function staticPool(id: string, overrides?: Record<string, AuthorablePool>): string {
  return overrides?.[id] ?? "practice";
}

/** Corpus-level checks over a PARSED journey. Pure — fixture-tested. */
export function validateJourney(
  journey: Journey,
  canResolve: (grade: number, short: string) => boolean,
  unitItemIds: readonly string[],
): string[] {
  const errors: string[] = [];
  const idset = new Set(unitItemIds);

  // J3 · poolOverrides keys must be real unit items
  for (const key of Object.keys(journey.poolOverrides ?? {})) {
    if (!idset.has(key)) errors.push(`poolOverrides key "${key}" is not an item in ${journey.slug}`);
  }

  for (const n of journey.nodes) {
    // J1 · gamePointer resolves to a released stop
    if (n.kind === "game" && n.gamePointer && !canResolve(n.gamePointer.grade, n.gamePointer.zoneOrChapter)) {
      errors.push(`node "${n.id}": gamePointer /play/${n.gamePointer.grade}/${n.gamePointer.zoneOrChapter} does not resolve to a released stop`);
    }
    // J2 · a referenced itemPool must be non-empty for this unit (static partition)
    if ((n.kind === "practice" || n.kind === "side-quest") && n.itemPool) {
      if (!unitItemIds.some((id) => staticPool(id, journey.poolOverrides) === n.itemPool)) {
        errors.push(`node "${n.id}": itemPool "${n.itemPool}" is empty for ${journey.slug} (no items assigned)`);
      }
    }
  }
  return errors;
}

// ── runner ────────────────────────────────────────────────────────────────────

export function runValidateJourneys(): void {
  if (!fs.existsSync(UNITS_DIR)) {
    console.log("content validate-journeys: no units dir — nothing to check");
    return;
  }
  const stops = buildReleasedStops();
  const canResolve = (grade: number, short: string): boolean => stops.get(grade)?.has(short) ?? false;

  let files = 0;
  let fail = 0;
  const errors: string[] = [];
  for (const slug of fs.readdirSync(UNITS_DIR).filter((n) => /^g[1-4]-u\d{2}$/.test(n)).sort()) {
    const p = path.join(UNITS_DIR, slug, "journey.json");
    if (!fs.existsSync(p)) continue;
    files++;
    const parsed = Journey.safeParse(JSON.parse(fs.readFileSync(p, "utf8")));
    if (!parsed.success) {
      fail++;
      console.error(`✗ ${slug}/journey.json:\n${parsed.error.issues.map((i) => `   ${i.path.join(".")}: ${i.message}`).join("\n")}`);
      continue;
    }
    if (parsed.data.slug !== slug) errors.push(`${slug}: journey.json slug is "${parsed.data.slug}" (file is in ${slug}/)`);
    let ids: string[] = [];
    try {
      const it = readUnitItems(slug);
      ids = [...it.vocab.map((v) => v.id), ...it.grammar.map((g) => g.id)];
    } catch {
      /* unit has no items yet */
    }
    for (const e of validateJourney(parsed.data, canResolve, ids)) errors.push(`${slug}: ${e}`);
  }
  for (const e of errors) console.error(`  ✗ ${e}`);
  if (errors.length > 0) fail += 1;
  console.log(`content validate-journeys: ${files} journey file(s) checked, ${errors.length} error(s).`);
  if (fail > 0) process.exit(1);
}
