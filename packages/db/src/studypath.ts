/**
 * B1 Study Path — the per-unit node graph + node-completion persistence.
 *
 * The graph is DERIVED from a unit's items (not authored): `buildUnitNodes`
 * emits an ordered list, and node state is SPARSE — a `study_path_progress` row
 * exists iff a node is completed, so locked/available/stars are computed by the
 * pure `withProgress`. The pure half (buildUnitNodes / nodeItemIds /
 * checkpointItemIds / starsFor / withProgress) is unit-tested without a DB.
 */
import { and, eq, sql } from "drizzle-orm";
import { XP_WEIGHT } from "@domigo/engine";
import type { Tier } from "@domigo/engine";
import type { GrammarItem, VocabItem } from "@domigo/content-schema";
import { studyPathProgress } from "./schema.ts";
import type { Db } from "./index.ts";

// ── node model (string unions — erasableSyntaxOnly: no enums) ───────────────
export type NodeKind = "vocab-intro" | "vocab-practice" | "grammar-intro" | "grammar-practice" | "checkpoint";
export type NodeStatus = "locked" | "available" | "completed";

export interface NodeDef {
  id: string; // stable DB/API contract: "vocab-intro" | "vocab-practice-2" | "checkpoint" | …
  kind: NodeKind;
  graded: boolean;
  title: string;
  difficulty: 1 | 2 | 3 | null; // practice nodes only
  itemCount: number; // graded items the node serves (intro nodes: 0)
}
export interface NodeView extends NodeDef {
  status: NodeStatus;
  stars: number;
}

export const CHECKPOINT_SIZE = 10;
export const STUDY_PATH_MAX_NODE_ID_LEN = 32;

const DIFF_LABEL: Record<1 | 2 | 3, string> = { 1: "Easy", 2: "Medium", 3: "Hard" };

function presentDiffs(items: ReadonlyArray<{ difficulty: number }>): Array<1 | 2 | 3> {
  const out: Array<1 | 2 | 3> = [];
  for (const d of [1, 2, 3] as const) {
    if (items.some((it) => it.difficulty === d)) out.push(d);
  }
  return out;
}

/** Derive the ordered node graph for a unit from which difficulties have items. Pure. */
export function buildUnitNodes(vocab: VocabItem[], grammar: GrammarItem[]): NodeDef[] {
  const nodes: NodeDef[] = [];
  if (vocab.length > 0) {
    nodes.push({ id: "vocab-intro", kind: "vocab-intro", graded: false, title: "Vocabulary", difficulty: null, itemCount: 0 });
    for (const d of presentDiffs(vocab)) {
      nodes.push({
        id: `vocab-practice-${d}`, kind: "vocab-practice", graded: true,
        title: `Vocabulary practice · ${DIFF_LABEL[d]}`, difficulty: d,
        itemCount: vocab.filter((v) => v.difficulty === d).length,
      });
    }
  }
  if (grammar.length > 0) {
    nodes.push({ id: "grammar-intro", kind: "grammar-intro", graded: false, title: "Grammar", difficulty: null, itemCount: 0 });
    for (const d of presentDiffs(grammar)) {
      nodes.push({
        id: `grammar-practice-${d}`, kind: "grammar-practice", graded: true,
        title: `Grammar practice · ${DIFF_LABEL[d]}`, difficulty: d,
        itemCount: grammar.filter((g) => g.difficulty === d).length,
      });
    }
  }
  if (vocab.length + grammar.length > 0) {
    nodes.push({
      id: "checkpoint", kind: "checkpoint", graded: true, title: "Checkpoint", difficulty: null,
      itemCount: Math.min(CHECKPOINT_SIZE, vocab.length + grammar.length),
    });
  }
  return nodes;
}

/** Deterministic ~10-item mixed set: round-robin across difficulty buckets, corpus order within. Pure. */
export function checkpointItemIds(vocab: VocabItem[], grammar: GrammarItem[]): string[] {
  const buckets: Record<1 | 2 | 3, string[]> = { 1: [], 2: [], 3: [] };
  for (const v of vocab) if (v.difficulty === 1 || v.difficulty === 2 || v.difficulty === 3) buckets[v.difficulty].push(v.id);
  for (const g of grammar) if (g.difficulty === 1 || g.difficulty === 2 || g.difficulty === 3) buckets[g.difficulty].push(g.id);
  const out: string[] = [];
  const idx: Record<1 | 2 | 3, number> = { 1: 0, 2: 0, 3: 0 };
  let progressed = true;
  while (out.length < CHECKPOINT_SIZE && progressed) {
    progressed = false;
    for (const d of [1, 2, 3] as const) {
      if (out.length >= CHECKPOINT_SIZE) break;
      const b = buckets[d];
      if (idx[d] < b.length) {
        out.push(b[idx[d]]!);
        idx[d] += 1;
        progressed = true;
      }
    }
  }
  return out;
}

/** The ordered item ids a node serves (intro nodes: none). Pure + deterministic. */
export function nodeItemIds(node: NodeDef, vocab: VocabItem[], grammar: GrammarItem[]): string[] {
  if (node.kind === "vocab-practice") return vocab.filter((v) => v.difficulty === node.difficulty).map((v) => v.id);
  if (node.kind === "grammar-practice") return grammar.filter((g) => g.difficulty === node.difficulty).map((g) => g.id);
  if (node.kind === "checkpoint") return checkpointItemIds(vocab, grammar);
  return [];
}

/** Accuracy → stars. `correctEquiv` = Σ XP_WEIGHT[tier]; completing a graded node is always ≥1★. Pure. */
export function starsFor(correctEquiv: number, total: number): 0 | 1 | 2 | 3 {
  if (total <= 0) return 0;
  const acc = correctEquiv / total;
  if (acc >= 1) return 3;
  if (acc >= 0.8) return 2;
  return 1;
}

/** Stars from a per-item tier tally (used by the client runner; reuses the XP weights). Pure. */
export function starsForTiers(tiers: Tier[]): 0 | 1 | 2 | 3 {
  return starsFor(tiers.reduce((s, t) => s + XP_WEIGHT[t], 0), tiers.length);
}

/** Merge the node graph with completed-node state → view models with unlock + stars. Pure. */
export function withProgress(nodes: NodeDef[], completed: Map<string, { stars: number }>): NodeView[] {
  let availableGiven = false;
  return nodes.map((n): NodeView => {
    const done = completed.get(n.id);
    if (done) return { ...n, status: "completed", stars: done.stars };
    if (!availableGiven) {
      availableGiven = true;
      return { ...n, status: "available", stars: 0 };
    }
    return { ...n, status: "locked", stars: 0 };
  });
}

// ── persistence ─────────────────────────────────────────────────────────────
export interface NodeCompletionInput {
  userId: string;
  classId: string;
  unitSlug: string;
  grade: number;
  nodeId: string;
  kind: NodeKind;
  stars: number;
}

/** Idempotent + monotonic: keep the BEST stars for a (user, unit, node). */
export async function recordNodeCompletion(db: Db, a: NodeCompletionInput): Promise<{ stars: number }> {
  const now = new Date();
  const rows = await db
    .insert(studyPathProgress)
    .values({
      userId: a.userId, classId: a.classId, unitSlug: a.unitSlug, grade: a.grade,
      nodeId: a.nodeId, kind: a.kind, stars: a.stars, completedAt: now, updatedAt: now,
    })
    .onConflictDoUpdate({
      target: [studyPathProgress.userId, studyPathProgress.unitSlug, studyPathProgress.nodeId],
      set: { stars: sql`GREATEST(${studyPathProgress.stars}, ${a.stars})`, updatedAt: now },
    })
    .returning({ stars: studyPathProgress.stars });
  return { stars: rows[0]?.stars ?? a.stars };
}

/** Completed nodes (→ stars) for one unit — feeds `withProgress`. */
export async function getUnitPathProgress(db: Db, userId: string, unitSlug: string): Promise<Map<string, { stars: number }>> {
  const rows = await db
    .select({ nodeId: studyPathProgress.nodeId, stars: studyPathProgress.stars })
    .from(studyPathProgress)
    .where(and(eq(studyPathProgress.userId, userId), eq(studyPathProgress.unitSlug, unitSlug)));
  const m = new Map<string, { stars: number }>();
  for (const r of rows) m.set(r.nodeId, { stars: r.stars });
  return m;
}

export interface UnitPathSummary {
  completedNodes: number;
  totalStars: number;
}

/** Completed-node count + total stars per unit — feeds the /learn index. */
export async function getPathSummary(db: Db, userId: string): Promise<Map<string, UnitPathSummary>> {
  const rows = await db
    .select({
      unitSlug: studyPathProgress.unitSlug,
      completed: sql<number>`count(*)::int`,
      stars: sql<number>`coalesce(sum(${studyPathProgress.stars}),0)::int`,
    })
    .from(studyPathProgress)
    .where(eq(studyPathProgress.userId, userId))
    .groupBy(studyPathProgress.unitSlug);
  const m = new Map<string, UnitPathSummary>();
  for (const r of rows) m.set(r.unitSlug, { completedNodes: Number(r.completed), totalStars: Number(r.stars) });
  return m;
}
