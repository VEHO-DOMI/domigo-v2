/**
 * B-2 — per-campaign overworld chrome (the WorldCopy pack PhaserGame renders).
 * The engine carries NO campaign strings anymore; this module is where the app
 * decides them, per story. Two invariants:
 *  - G1 "Lost Pages" gets its EXACT former hardcoded strings (byte-identical
 *    rendered output — the B-2 generalization must not change G1 by a glyph).
 *  - G2 "The Spill" is German-first chrome (doc 22 §2.6 / L-1 g2 rules); its
 *    npc hint names the zone's F NPC (doc 22 §3's F column — presentation data,
 *    verbatim from the gated design doc, falling back to a neutral line).
 */
import type { WorldCopy } from "@domigo/game-2d";

/** G1 "The Lost Pages" — the exact strings PhaserGame hardcoded before B-2. */
const G1_COPY: WorldCopy = {
  moveHintCoarse: "Tipp dorthin, wo du hinwillst",
  moveHintFine: "Tippen oder Pfeiltasten / WASD",
  encounterHint: "geh zu einem ✦ zum Üben",
  npcHint: "sprich mit Finn",
  encounterLabel: "Ein Wort verblasst — hol es zurück!",
  continueLabel: "Weiter →",
  nextLabel: "Weiter →",
  closeLabel: "Schließen",
  stageSkin: "book", // G-A1: the book world battles among fluttering pages
  victoryLabel: "Zurückgeholt!",
};

/** The engine's former non-G1 fallback strings (kept for an unknown map story). */
const DEFAULT_COPY: WorldCopy = {
  moveHintCoarse: "Tap where you want to go",
  moveHintFine: "Tap or use arrow keys / WASD",
  encounterHint: "walk into a ✦ to practise",
  npcHint: "talk to your guide",
  encounterLabel: "A word is fading — bring it back!",
  continueLabel: "Continue →",
  nextLabel: "Next →",
  closeLabel: "Close",
  stageSkin: "ink",
  victoryLabel: "Recovered!",
};

/** Doc 22 §3, the F column: the NPC waiting in each zone of "The Spill". */
const SPILL_NPC: Record<string, string> = {
  z01: "Frau Berger", z02: "Emma", z03: "Tarik", z04: "Jona", z05: "Emma",
  z06: "Finn", z07: "Jona", z08: "Tarik", z09: "Frau Berger", z10: "Jona",
  z11: "Emma", z12: "Jona", z13: "Tarik", z14: "Emma", z15: "Frau Berger",
};

/** G2 "The Spill" — German-first school-campaign chrome. */
function spillCopy(zoneShort: string): WorldCopy {
  const npc = SPILL_NPC[zoneShort];
  return {
    moveHintCoarse: "Tipp dorthin, wo du hinwillst",
    moveHintFine: "Tippen oder Pfeiltasten / WASD",
    encounterHint: "geh zu einem ✦ und hol das Wort zurück",
    npcHint: npc ? `sprich mit ${npc}` : "sprich mit deiner Klasse",
    encounterLabel: "Die leere Stelle hat ein Wort genommen — hol es zurück!",
    continueLabel: "Weiter →",
    nextLabel: "Weiter →",
    closeLabel: "Schließen",
    stageSkin: "ink", // G-A1: the Blank's strays battle in ink and dark glass
    victoryLabel: "Zurückgeholt!",
  };
}

/** The WorldCopy pack for a story's overworld zone. */
export function worldCopyFor(storyId: string, zoneShort: string): WorldCopy {
  if (storyId === "g1.st.lost-pages") return G1_COPY;
  if (storyId === "g2.st.the-spill") return spillCopy(zoneShort);
  return DEFAULT_COPY;
}
