// WHO RAISES WHICH POOL — the one table (R5-W2 · G1).
//
// WHY THIS FILE EXISTS. Three places needed to know "which being asks which
// kind of card, and in which phase": the sim (which routes the event), the
// gate (which proves every asker has cards) and now the variety laws (which
// have to REPLAY the serve to see what a child actually meets). Until this
// file, the gate kept its own copy with the honest but doomed comment "these
// two tables mirror packages/game-paint/src/sim.ts and must move with it" —
// a rule with two copies is a rule with one enforced copy (PK-R3b). The
// variety laws would have been the third copy, so the table moved here and
// everybody imports it.
//
// It is deliberately DATA plus three tiny functions: no Sim, no Phaser, no
// runtime import at all beyond the level's types, so the .mjs gate can load it
// under `node --experimental-strip-types` the same way it already loads
// `timer.ts` and `AWAKEN_ROUNDS`.
import type { EntityRole, EntitySpec, PaintLevel, PhaseSpec } from "../level.ts";
import type { Tier } from "./timer.ts";

/** The beings that come AT the child. `sim.ts` sends their contact through the
 *  `encounter` event; which pool that becomes is `askerUsesOf` below. */
export const HOSTILE_ROLES: readonly EntityRole[] = ["chaser", "gunner", "flyer", "bouncer", "crusher", "swarm"];

/** A pool is served two different ways, and the difference is a LAW, not a
 *  detail: a playlist advances a cursor, a ceremony is asked for BY INDEX
 *  because round 3's picture is the pose the classmate is striking right now
 *  (doc 44 §3.3; `orderedTask` in ./routing.ts). Anything that checks the
 *  served sequence has to honour the split or it will "find" defects the game
 *  does not have. */
export type ServeMode = "playlist" | "ordered";

/**
 * The uses this entity can raise, mirroring `sim.ts onEntityEvent` exactly:
 *  - `encounter` on a hostile → "quickfire" for a swarm, "boss" if the being is
 *    the guardian, "encounter" otherwise (sim.ts:634)
 *  - `engaged` on a drained object, i.e. the ↑ press → "encounter" (sim.ts:644)
 *  - `cageBurst` → "rescue"; with a classmate the same pool is served ORDERED,
 *    and she goes on raising it herself round after round (sim.ts:672, :437)
 *  - `doorTouched` → "bonuspay" for Klecks' door, else "door" (sim.ts:689)
 *  - `guardianStagger` → "boss", and the shell fires "finale" once the console
 *    resolves (sim.ts:721, PaintGame.tsx:549)
 *
 * Returns [] for a being that raises no card at all — the pickups, the
 * platforms, and (since R3-11's speaker law) every hazard.
 */
export function askerUsesOf(e: Pick<EntitySpec, "role" | "params">): readonly string[] {
  if (e.role === "guardian") return ["boss", "finale"];
  if (e.role === "swarm") return ["quickfire"];
  if (HOSTILE_ROLES.includes(e.role)) return ["encounter"];
  if (e.role === "drained") return ["encounter"];
  // L2-M-a · R249: die Tier-Buehne hebt `quickfire`, nicht `encounter`. Der
  // Unterschied ist die FIKTION: eine Begegnung ist ein Wesen, das dem Kind in
  // den Weg tritt; die Buehne tritt niemandem in den Weg — sie spielt etwas vor
  // und fragt danach. Der Schnell-Schirm ist der Pool dieser kurzen
  // Welt-Fragen („Where is it?"), und er ist getaktet, was hier passt: die
  // Antwort steht sichtbar im Bild.
  if (e.role === "scene.stage") return ["quickfire"];
  // she is the asker of every round after the latch, from the cage's own pool
  if (e.role === "cage" || e.role === "classmate") return ["rescue"];
  if (e.role === "door.trigger") return [String(e.params?.kind ?? "exit") === "bonus" ? "bonuspay" : "door"];
  // R5-W5 · G4: a uniform piece raises the naming pool. It is the only asker in
  // the chapter that is no longer standing in the world when its card opens —
  // the piece is in the child's hands by then, and the card fires at every third
  // find (PaintGame `onClothCard`), not on contact. The speaker law's question is
  // still the right one and still answered: could any being in this chapter ever
  // raise this pool? These nine can, and nothing else does.
  if (e.role === "cloth") return ["pickupset"];
  return [];
}

/** A cage holding a classmate opens a CEREMONY, not a playlist — and so does
 *  she. Everything else cycles. */
export const serveModeOf = (e: Pick<EntitySpec, "role" | "params">): ServeMode =>
  e.role === "classmate" || (e.role === "cage" && e.params?.classmate !== undefined) ? "ordered" : "playlist";

/** Every phase a level plays, arena and bonus room included — they carry
 *  entities and therefore askers, and a check that walks only `phases` is blind
 *  to the boss and to Klecks. */
export const allPhasesOf = (level: Pick<PaintLevel, "phases" | "arena" | "bonus">): PhaseSpec[] => [
  ...(level.phases ?? []),
  ...(level.arena ? [level.arena] : []),
  ...(level.bonus ? [level.bonus] : []),
];

/** One request a real being can make: this pool, in this phase, for this skin.
 *  `mode` decides whether a checker may replay it as a playlist. */
export interface ServeContext {
  use: string;
  phase: string;
  skin: string;
  mode: ServeMode;
  role: EntityRole;
  /** How many beings of this skin stand in this phase at once — the floor the
   *  coverage law already uses, and the reason a pool needs more than one card. */
  simultaneous: number;
}

/**
 * Every serve a level can actually produce, de-duplicated by (use, phase, skin).
 * This is the honest enumeration: it comes from the beings the level PLACES, not
 * from the cards that happen to exist — so a card bound to nobody shows up as a
 * pool with no context rather than quietly passing.
 */
export function serveContextsOf(level: Pick<PaintLevel, "phases" | "arena" | "bonus">): ServeContext[] {
  const out: ServeContext[] = [];
  const seen = new Set<string>();
  for (const ph of allPhasesOf(level)) {
    const countOf = (skin: string, role: EntityRole) =>
      (ph.entities ?? []).filter((x) => x.skin === skin && x.role === role).length;
    for (const e of ph.entities ?? []) {
      for (const use of askerUsesOf(e)) {
        const key = `${use}|${ph.id}|${e.skin}`;
        if (seen.has(key)) continue;
        seen.add(key);
        out.push({
          use,
          phase: ph.id,
          skin: e.skin,
          mode: serveModeOf(e),
          role: e.role,
          simultaneous: countOf(e.skin, e.role),
        });
      }
    }
  }
  return out;
}

/** The uses SOMEBODY in this chapter can raise — the speaker law's own set.
 *  `quickfire` rides along as the shell's universal fallback whenever any being
 *  can raise a card at all (PaintGame.tsx: an empty pool drops to it). */
export function raisedUsesOf(level: Pick<PaintLevel, "phases" | "arena" | "bonus">): Set<string> {
  const uses = new Set<string>();
  for (const ph of allPhasesOf(level)) for (const e of ph.entities ?? []) for (const u of askerUsesOf(e)) uses.add(u);
  if (uses.size > 0) uses.add("quickfire");
  return uses;
}

/** R5-W2 · H1 · WELCHE STUFE FRAGT HIER? (Kokis Tier-Uhren, Ruling 14.08.2026)
 *
 *  Die Stufe steht auf dem WESEN (`ch01.level.json`: die Tafel trägt `"tier":
 *  "E"`), nicht auf der Karte — ein Kapitel stellt seinen Schwierigkeitsgrad an
 *  seinen Bewohnern ein. Sie darf deshalb auch nicht in `TaskRequest` wandern:
 *  zwei der sieben ctx-Arten haben überhaupt kein Wesen, und ein Feld, das
 *  meistens leer ist, wird von seinen Lesern geraten statt gelesen.
 *
 *  Rein, damit dieselbe Funktion die Laufzeit UND das Tor bedienen kann: was das
 *  Kind sieht und was `check-game-tasks` prüft, ist dann per Konstruktion
 *  dieselbe Zahl. Die Arena hängt an `level.arena`, nicht an `phases` — dafür
 *  gibt es `allPhasesOf`, das genau diese Blindheit schon einmal geschlossen hat.
 *
 *  Ohne bekanntes Wesen: `"E"` — die LÄNGSTE Uhr. Eine unklare Herkunft darf ein
 *  Kind nie härter treffen als eine bekannte. */
export function tierOfAsker(
  level: Pick<PaintLevel, "phases" | "arena" | "bonus">,
  phaseId: string,
  askerId: string | null | undefined,
): Tier {
  if (askerId === null || askerId === undefined) return "E";
  for (const ph of allPhasesOf(level)) {
    if (ph.id !== phaseId) continue;
    const e = (ph.entities ?? []).find((x) => x.id === askerId);
    if (e !== undefined) return e.tier;
  }
  return "E";
}
