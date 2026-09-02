// L4-G1 · DIE PILOTEN VON KAPITEL 4 (Level-Welle, 2026-09-03).
//
// Ein Pilot ist ein handgeführtes Makro-Programm gegen die echte Sim; ein Pilot,
// der den Ausgang nicht erreicht, IST der Beweis, dass der Raum sein
// Spielbarkeits-Gesetz bricht. p1 »Der graue Marktplatz« ist das Kalibrier-
// Exemplar des Kapitels (Dossier ch04-dossiers-v2/p1.md §10); p2/p3/p4/p9 folgen
// mit L4-G2. Karten (Regel-Seite, Gabe, Restore, Käfig, Tür) legt der Rekorder
// ab bzw. löst sie auto (record-paint-tape.mjs `handle`), genau wie der CI-Replayer.
//
// DIE EINE STELLE, DIE DIESES KAPITEL AUSMACHT: der Sprung über die Markisen-
// Grube. Schweben greift, sobald die Sprungtaste NACH dem Apex noch gehalten
// wird (`player.ts:366`), und trägt den Sinkflug auf 1 px/t (`paint.ts:97`).
// Im Makro heißt das: ein langes `hold` — die Taste bleibt gedrückt, während die
// Figur die sechs Spalten quert. Ein kurzes `hold` fällt in die Tinte, und genau
// das ist die Gegenprobe im Report.
export const PILOTS = {
  // p1 »Der graue Marktplatz«: S (3,17) → Marktkiste r16 → Markise r13 mit dem
  // FEDER-ROTOR (14,12) → Blumenstand-Theke → Marktfrau (20,17) → Anker C (23,17)
  // → SCHWEBEN über die Grube c24–28 → Waggon-Reihe r14 (Mo…So, Tropfen darüber)
  // → Käsestand → Regel-Seite (50,17) → Regenkind (55,17) → Zaunlatten ^ c56–57
  // → Flasche mit dem Morgen (59,17) → Marktgatter (61,17) → X (62,17).
  p1: {
    abilities: ["jump", "run", "punch"], // hover kommt IM Raum, aus dem Feder-Rotor
    program: [
      ["walkTo", 8], ["settle"],
      ["jump", { dir: "right", hold: 8, steer: 8 }], ["settle"],
      ["walkTo", 12], ["settle"],
      ["jump", { dir: "right", hold: 16, steer: 12 }], ["settle"],
      ["walkTo", 15], ["wait", 40],
      ["walkTo", 16], ["settle"],
      ["hold", { right: true }, 30], ["settle"],
      ["walkTo", 19], ["settle"],
      ["hold", { up: true }, 8], ["wait", 40],
      ["walkTo", 21], ["wait", 40],
      ["walkTo", 23], ["settle"],
      ["jump", { dir: "right", hold: 80, steer: 80 }], ["settle"],
      ["walkTo", 31], ["settle"], ["jump", { hold: 16 }], ["settle"],
      ["walkTo", 33], ["settle"],
      ["waitPlatformAt", "p1-waggon-monday", 33, 0.6],
      ["jump", { hold: 16 }], ["settle"],
      ["rideUntil", "p1-waggon-monday", 36, 0.6],
      ["hold", { right: true }, 24], ["settle"],
      ["walkTo", 39], ["settle"], ["jump", { hold: 16 }], ["settle"],
      ["walkTo", 42], ["settle"], ["jump", { hold: 16 }], ["settle"],
      ["walkTo", 45], ["settle"], ["jump", { hold: 16 }], ["settle"],
      ["walkTo", 48], ["settle"], ["jump", { hold: 16 }], ["settle"],
      ["walkTo", 51], ["settle"], ["jump", { hold: 24 }], ["settle"], ["wait", 30],
      ["walkTo", 49], ["wait", 40],
      ["walkTo", 53], ["settle"],
      ["hold", { up: true }, 8], ["wait", 40],
      ["walkTo", 55], ["settle"],
      ["jump", { dir: "right", hold: 10, steer: 12 }], ["settle"],
      ["walkTo", 59], ["settle"],
      ["hold", { up: true }, 8], ["wait", 40],
      ["walkTo", 61], ["settle"], ["wait", 40],
      ["walkTo", 62], ["settle"], ["wait", 60],
    ],
  },
};
