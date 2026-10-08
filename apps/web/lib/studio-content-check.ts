/** Shared durable S-2b gate for Studio. The poll token binds the exact saved
 * bytes; editing while a run is pending cannot publish an untested revision. */
import type { GrammarItem, VocabItem } from "@domigo/content-schema";
import type { ItemKind } from "@domigo/content-loader";
import type { ContentCheckAccess } from "../../../packages/db/src/content-check-journal.ts";
import { checkupTaskKey, runCheckupGate, sandboxGatePorts } from "./checkup-gate.ts";
import { preGate } from "./studio-gate.ts";
import type { PreparedCheckupTask } from "./checkup.ts";

export async function checkStudioContent(access: ContentCheckAccess, kind: ItemKind, item: VocabItem | GrammarItem, unitSlug: string, expectedKey?: string) {
  const pre = preGate(kind, item);
  if (!pre.ok || !pre.frame) return { status: "blocked" as const, errors: pre.errors };
  const task: PreparedCheckupTask = { itemId: item.id, unitSlug, kind, revision: item.rev, item, frame: { ...pre.frame, structure: null, glosses: [] },
    pool: kind === "vocab" ? "carrier" : null, sectionPosition: 0, itemPosition: 0 };
  const key = checkupTaskKey(task);
  if (expectedKey && expectedKey !== key) return { status: "blocked" as const, errors: ["Der Entwurf wurde während der Prüfung geändert. Prüfe die neue Fassung vor dem Veröffentlichen."] };
  const ports = await sandboxGatePorts(access);
  if (expectedKey && !(await ports.read(key))) return { status: "blocked" as const, errors: ["Kein gespeicherter Prüflauf für diese Fassung."] };
  const result = await runCheckupGate([task], ports, { single: true, retryErrors: !expectedKey });
  return { ...result, runId: `studio:${key}:${item.id}` };
}
