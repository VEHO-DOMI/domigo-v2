// PK-R6 · C · THE TIMER POLICY (doc 44 §2.9 — Koki's Decision ④), in ONE place.
//
// „Der Kreide-Wecker überlebt nur dort, wo die Fiktion Eile IST." Before this
// module the rule lived as a single expression inside CardHost (`task.use ===
// "quickfire"`), which is a rule with one reader and no witness: nothing could
// state the policy, nothing could check content against it, and a boss window —
// urgent by fiction — silently had no clock at all.
//
// So the map is data here, and it has three readers:
//   · CardHost          — what clock THIS card gets (the runtime)
//   · cards/timer.test  — the map itself, asserted
//   · check-game-tasks  — layer 12, which fails authored content that
//                         contradicts the map (guardrails by construction)
//
// The map keys on the SERVED use — the pool the world asked for — not on the
// card's authored `use`. They differ exactly where it matters: when a being's
// own pool runs dry the shell falls through to the UNBOUND quickfire cards
// (PaintGame.pickTask), so a calm rescue could be answered by a card whose
// authored use is „quickfire" and a 45-second clock would appear over a cage
// ceremony. The pool that ASKED is the one whose fiction is on screen.
// Deliberately import-light (a type only): scripts/check-game-tasks.mjs loads
// this module under --experimental-strip-types, so the policy may not drag a
// stylesheet, a scene or Phaser in behind it.
import type { GameTaskV2 } from "@domigo/content-schema";
import { PAINT } from "../paint.ts";

export type TimerClass = "timed" | "calm";
export type Tier = "E" | "M" | "S";

/** The pools where urgency IS the fiction (doc 44 §2.9, verbatim): the
 *  quickfire/swarm pestering, and the guardian's attack windows. */
export const TIMED_USES: ReadonlySet<string> = new Set(["quickfire", "boss"]);

/** The calm classes doc 44 §2.9 names — restore · rescue · door · ceremony ·
 *  story. Three of those are pools (absent from TIMED_USES, so calm by
 *  default) and two are shell beats with no card kind at all; `restore` is the
 *  one that is a KIND, so it is the one that needs saying: a two-step colour
 *  card is calm even if a swarm being is the one asking it. */
export const CALM_KINDS: ReadonlySet<string> = new Set(["restore"]);

/** German that PROMISES a running clock. A card that tells a six-year-old to
 *  hurry while no clock exists is the countdown-to-nothing lie the door-price
 *  law was written for, pointed the other way. */
export const URGENCY_DE = /(schnell|beeil|sofort|husch|Zeit läuft|keine Zeit|bevor die Zeit)/i;
/** German that promises there is NO clock — equally a lie under a chalk ring. */
export const CALM_DE = /(lass dir Zeit|nimm dir Zeit|in aller Ruhe|ganz in Ruhe|ohne Eile)/i;

/** The policy itself: does this card, served from this pool, carry a clock? */
export const timerClassFor = (use: string, kind: string): TimerClass =>
  CALM_KINDS.has(kind) ? "calm" : TIMED_USES.has(use) ? "timed" : "calm";

/** How long that clock runs, given the chalk ring's own duration — 0 means „no
 *  clock at all", which is also what reduced motion always answers: an
 *  invisible countdown would be unfair (the ring is suppressed, so the timer
 *  must be too — PK-R3a's rule, kept). The duration is PASSED IN rather than
 *  imported so this module stays free of the stylesheet (see the header). */
export const clockMsFor = (use: string, kind: string, reducedMotion: boolean, ringMs: number): number =>
  reducedMotion || timerClassFor(use, kind) === "calm" ? 0 : ringMs;

/** R5-W2 · H1 · WIE LANG DAS FENSTER IST — Kokis Ruling vom 14.08.2026, wörtlich.
 *
 *  `PAINT.quickfireSeconds` (E 6 · M 5 · S 4) steht seit jeher im Repo, ist von
 *  `paint.test.ts` festgeschrieben — und hatte in `game-paint` NULL Leser. Die
 *  Uhr lief statt dessen für JEDE getaktete Karte auf einer einzigen Zahl
 *  (45 s), die als CSS-Rückfall gedacht war. Dieselbe Tabelle fährt im
 *  Schwester-Paket (`game-2d`) längst echt; hier war sie eine Zusage ohne Leser.
 *
 *  Die Stufe kommt vom WESEN, das fragt (`tierOfAsker`), nicht von der Karte:
 *  ein Kapitel stellt seinen Schwierigkeitsgrad an seinen Bewohnern ein, nicht
 *  an seinem Text. Ohne bekanntes Wesen gilt E — die längste Uhr; eine unklare
 *  Herkunft darf ein Kind nie härter treffen.
 *
 *  ⚠ Die Zahl ist die Zahl EINES ZUGES, nicht die der ganzen Karte: die Uhr
 *  steht still, solange gelesen wird, und beginnt bei jeder Berührung von vorn
 *  (siehe CardHost). Ohne diese Lesart wäre die Memory-Karte des Bosses bei
 *  sechs Sekunden per Konstruktion unlösbar — acht Aufdecker bei perfektem
 *  Gedächtnis. */
export const windowMsFor = (use: string, kind: string, tier: Tier, reducedMotion: boolean): number =>
  clockMsFor(use, kind, reducedMotion, PAINT.quickfireSeconds[tier] * 1000);

/** R5-W2 · H1 · DIE STEH-UHR, als Entscheidung statt als Verhalten.
 *
 *  Kokis Ruling wörtlich: die Uhr steht voll und still, solange gelesen wird —
 *  sie startet beim ERSTEN Antippen der Karte und beginnt bei JEDEM weiteren
 *  Tippen von vorn. Lesen ist gratis; nur Zögern mitten in der Antwort kostet.
 *
 *  Die Regel steht hier und nicht als `if` in einem Effekt, weil dieses Paket
 *  keinen DOM prüfen kann (kein jsdom, keine Testing-Library — jedes Gesetz hier
 *  ist kopflos). Als Funktion ist sie behauptbar; als Effekt wäre sie ein
 *  Versprechen. Dasselbe Muster wie `cards/auftakt.ts`: die Entscheidung wandert
 *  dorthin, wo ein Test sie ohne Bildschirm gehen kann.
 *
 *  `armCount` ist ein ZÄHLER, kein Schalter: derselbe Wert treibt den Wecker und
 *  den `key` des Balkens, also können Bild und Maschine nicht auseinanderlaufen
 *  — die häufigste Art, wie eine Uhr lügt. */
export const armedClockMs = (clockMs: number, armCount: number): number =>
  clockMs <= 0 || armCount <= 0 ? 0 : clockMs;

/** The German a card actually speaks, for the copy half of the policy check. */
export const spokenDeOf = (t: GameTaskV2): string[] =>
  [
    t.storyDe,
    t.stimulus.type === "entity" ? t.stimulus.showsDe : "",
    t.stimulus.type === "image" ? t.stimulus.altDe : "",
    t.hints?.deDesc ?? "",
    t.hints?.deWord ?? "",
    t.kind === "restore" ? t.colourAskDe : "",
  ].filter((s) => s.length > 0);
