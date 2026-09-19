import { availableStation } from "@domigo/game-2d/school";
import { gradeSchoolCard, schoolView, type SchoolBatteryData } from "./school-contract.ts";
/** Teachers never call either ledger operation. Student progress is read back
 * after saving, including duplicate UUIDs; client-provided progress is ignored. */
export async function schoolAttempt(b: SchoolBatteryData, body: { station: string; value: string; previewSolved: string[] }, preview: boolean, ledger: {
  solvedIds: () => Promise<Set<string>>;
  save: (card: SchoolBatteryData["cards"][number], result: ReturnType<typeof gradeSchoolCard>) => Promise<void>;
}) {
  const card = b.cards.find(c => c.station === body.station);
  if (!card) return null;
  const stations = (ids: Set<string>) => b.cards.filter(c => ids.has(c.item.id)).map(c => c.station);
  const solved = preview ? body.previewSolved.filter(s => b.cards.some(c => c.station === s)) : stations(await ledger.solvedIds());
  if (!availableStation(card.station, solved)) return null;
  const result = gradeSchoolCard(card, body.value);
  if (!preview) await ledger.save(card, result);
  const next = preview ? result.tier === "correct" ? [...new Set([...solved, card.station])] : solved : stations(await ledger.solvedIds());
  return { result, view: schoolView(b, next, preview) };
}
