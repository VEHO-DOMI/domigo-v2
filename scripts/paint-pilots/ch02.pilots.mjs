// L2-P1 · DIE PILOTEN VON KAPITEL 2 (Level-Welle, 2026-09-03).
//
// Ein Pilot ist ein handgeführtes Makro-Programm gegen die echte Sim; ein Pilot,
// der den Ausgang nicht erreicht, IST der Beweis, dass der Raum sein
// Spielbarkeits-Gesetz bricht. p1 »Das Zoo-Tor« ist das Kalibrier-Exemplar des
// Kapitels (Dossier ch02-dossiers-v2/p1.md §10); p2/p3/p4/p9 folgen mit L2-G2.
// Karten (Regelseiten, Käfig, Tür, Faust-Gabe) legt der Recorder ab bzw. löst
// sie auto (record-paint-tape.mjs `handle`), genau wie der CI-Replayer.
export const PILOTS = {
  // p1 „Das Zoo-Tor": S (2,17) → Kassenmauer 4 hoch (Halte-Sprung; hang optional)
  // → Regel »Ortswörter« (14,17) → Baumkrone r13 (Federn r12) → Läufer-Band
  // c28–34 (Kontakt = Karte + iframes, ehrlich im Band) → Käfig-Podest r13
  // (↑ = Käfig-Karte) → Regel »there is/are« (44,17) → nasse Fliesen c45–49
  // (Rutscher) → Bus-Block r15 → Faust-Podest r14 (Gabe) → Anker C (58,17) →
  // Tinten-Graben c59–60 (Doppel-Tap wie ch01 Lücke 2) → Drehkreuz (61,17) → X (62,17).
  p1: {
    abilities: ["jump", "run", "hang"],
    program: [
      ["walkTo", 5], ["settle"],
      ["jump", { dir: "right", hold: 26, steer: 12 }], ["settle"], // HALTE-Sprung auf die Kassenmauer (Δr4) → Federn (7,14) (9,12)
      ["walkTo", 10], ["settle"],
      ["hold", { right: true }, 30], ["settle"], // von der Mauer runter → (11,15)
      ["walkTo", 18], ["settle"], // Regelseite »Ortswörter« (14,17) im Vorbeigehen; Federn (12,16) (15,16) (18,16)
      ["jump", { dir: "right", hold: 26, steer: 14 }], ["settle"], // HALTE-Sprung auf die Baumkrone (Δr4, Absprung c18: unter der Krone prallt man ab) → (22,12)
      ["walkTo", 26], ["settle"], // Krone entlang → (24,12) (26,12)
      ["hold", { right: true }, 30], ["settle"], // von der Krone runter
      ["walkTo", 38], ["settle"], // Läufer-Band c28–34 → (30,16) (33,16); dann (39,16)? nein: erst die Karte
      ["walkTo", 37], ["settle"],
      ["jump", { dir: "right", hold: 26, steer: 16 }], ["settle"], // HALTE-Sprung aufs Käfig-Podest r13 (Absprung c37: unter der Platte prallt man ab)
      ["walkTo", 41], ["settle"],
      ["hold", { up: true }, 8], ["wait", 30], // ↑ am Käfig (41,13) → Rettungs-Karte (auto-gelöst)
      ["walkTo", 42], ["settle"],
      ["hold", { right: true }, 30], ["settle"], // vom Podest runter → (43,14)
      ["walkTo", 50], ["settle"], // Regelseite »there is/are« (44,17), nasse Fliesen, Federn (46,16) (48,16)
      ["jump", { dir: "right", hold: 10, steer: 10 }], ["settle"], // auf den Bus (Δr2) → (53,14)
      ["walkTo", 54], ["settle"],
      ["jump", { dir: "right", hold: 6, steer: 6 }], ["settle"], // vom Bus-Dach (r15) aufs Faust-Podest (r14): Δr1, Δc2 — kurz, sonst überschießt man das 2-Spalten-Podest (Tape 3)
      ["walkTo", 57], ["settle"], ["wait", 20], // die Faust (57,14) — Gabe-Karte, Recorder legt sie ab
      ["walkTo", 58], ["settle"], // vom Podest auf den Anker (58,17) — walkTo stoppt bei c58,5, VOR dem Graben
      ["jump", { dir: "right", hold: 6, steer: 12 }], ["settle"], // über den Tinten-Graben c59–60 (wie ch01 Lücke 2)
      ["walkTo", 61], ["settle"], ["wait", 30], // das Drehkreuz — Türkarte
      ["walkTo", 62], ["settle"], ["wait", 60],
    ],
  },
};
