// L0 · D10 · DIE PILOTEN VON KAPITEL 1.
//
// Ursprung: VERBATIM aus `scripts/record-paint-tape.mjs` hierher gezogen (Level-Welle,
// 2026-09-02) — Zeile für Zeile dieselben Makros, dieselben Kommentare, dieselbe
// Reihenfolge. p2/p3 sind seit dem Story-Spielpass neu aufgenommen.
// Sie standen im Aufnahme-Werkzeug, weil es nur ein Kapitel gab;
// mit fünf Kapiteln wäre dieses Werkzeug die heisseste Datei des Programms
// geworden, denn jede Gitter-Bahn tunt ihre Piloten gegen die gedruckte
// Zell-Spur, oft mehrmals am Tag.
//
// Ein Pilot ist ein handgeführtes Makro-Programm: »geh nach Spalte 42, spring,
// warte 40 Ticks«. Es fährt gegen die echte Sim, und ein Pilot, der den Ausgang
// nicht erreicht, IST der Beweis, dass der Raum sein Spielbarkeits-Gesetz
// bricht.
// ── the pilots (ch01-dossiers-v2 §10 layouts; tuned against the printed traces) ──
export const PILOTS = {
  // p1 „Die Eingangshalle" (R5-P1, Dossier p1.md §10): GESTRANDET-HOCH.
  // Trail SCHOOLBAG 9/9 in drei Läufen: S/C/H im Bank-Lauf (der Bogen über
  // der 2-Spalten-Lücke zahlt C im Flug) · O/O/L in der Brett-Lektion · B/A/G
  // in der Spind-Leiter.
  // R5-W4 · B4 · R45: die Brett-Lektion zahlt jetzt VERSETZT, weil das erste O
  // von der Stufe (29,14) auf den Hallenboden (24,16) gezogen ist — es lagen
  // zwei O in einem Blick beieinander (Kokis Bild 07.18.30). Gemessen am
  // aufgenommenen Band: O(24,16) Tick 223 im Läufer-Flur · O(31,11) Tick 286
  // beim Δr2-Tap auf die Stufe · L(33,11) Tick 335 im 48-px-HALTE-Sprung.
  // Die Tastenfolge ist dabei BYTE-GLEICH geblieben — der Magnet zahlt die neue
  // Zelle im Vorbeigehen, der Lauf musste nicht neu hergeleitet werden. Die Keller-Grube wird per Doppel-Tap gequert (B zahlt die
  // Landung). Läufer-/Hüpfer-Kontakt = Karte + iframes, ehrlich im Band.
  p1: {
    abilities: ["jump", "run"],
    program: [
      ["walkTo", 4], ["settle"],
      ["jump", { dir: "right", hold: 6 }], ["settle"], // über den Bücherstapel (erster Sprung)
      ["walkTo", 9], ["settle"],
      ["jump", { dir: "right", hold: 6 }], ["settle"], // Bank-Bogen 1 → S, C im Flug
      ["jump", { dir: "right", hold: 6 }], ["settle"], // Bank-Bogen 2 → H
      ["walkTo", 27], ["settle"], // der Läufer-Flur (Band c20–28) → das ERSTE O (24,16) im Gehen
      ["jump", { dir: "right", hold: 6, steer: 10 }], ["settle"], // AUF die Stufe → das zweite O (31,11)
      ["jump", { dir: "right", hold: 26, steer: 12 }], ["settle"], // HALTE aufs Brett-Podest → L
      ["walkTo", 33], ["settle"],
      ["walkTo", 38], ["settle"], // runter zum Krakel-Checkpoint
      ["walkTo", 39], ["settle"],
      ["jump", { dir: "right", hold: 6, steer: 12 }], ["settle"], // Lücke 1 → Steg
      ["jump", { dir: "right", hold: 6, steer: 12 }], ["settle"], // Lücke 2 → B zahlt die Landung
      ["talk", "p1-eraser"], // Nach dem Satz noch den Radiergummi färben.
      ["walkTo", 50], ["settle"], // durchs Hüpfer-Band
      ["jump", { dir: "right", hold: 6, steer: 8 }], ["settle"], // auf die Truhe → A
      ["jump", { dir: "right", hold: 6, steer: 10 }], ["settle"], // über c53 aufs Spind-Top → G
      ["hold", { right: true }, 30], ["settle"], // runter auf den Hallenboden
      ["walkTo", 61], ["settle"], ["wait", 30], // die Tür „Come in!"
      ["walkTo", 62], ["settle"], ["wait", 60],
    ],
  },
  // p2 „Das Klassenzimmer bei Nacht" (R5-P1, Dossier p2.md §10): PROJECTOR
  // 9/9 — P/R/O treppauf (Halte an Stufe 3) · Arch-TAP (Halte bonkt am
  // Sturz!) · J im Loch-Bogen, E/C im Korridor, drei Schwarm-Karten ehrlich ·
  // Kavernen-Tritt und Terrassen-Abstieg zahlen die letzten Buchstaben.
  // Der verbreiterte untere Rettungsraum führt über Klecks und Schere zu Merle.
  p2: {
    abilities: ["jump", "run"],
    program: [
      ["walkTo",3], ["settle"],
      ["jump",{"dir":"right","hold":6,"steer":10}], ["settle"],
      ["walkTo",9], ["talk", "p2-pen"], ["settle"],
      ["walkTo",11], ["settle"],
      ["jump",{"dir":"right","hold":6,"steer":8}], ["settle"],
      ["walkTo",14], ["settle"],
      ["jump",{"dir":"right","hold":6,"steer":8}], ["settle"],
      ["jump",{"dir":"right","hold":26,"steer":8}], ["settle"],
      ["jump",{"dir":"right","hold":6,"steer":10}], ["settle"],
      ["jump",{"dir":"right","hold":6,"steer":10}], ["settle"],
      ["runJump",31.2,6], ["settle"],
      ["walkTo",53], ["settle"],
      ["hold",{"right":true},20], ["settle"],
      ["hold",{"right":true},20], ["settle"],
      ["walkTo",63], ["settle"],
      ["walkTo",68], ["settle"],
      ["walkTo",75], ["settle"],
      ["hold",{"up":true},8],
      ["wait",30],
      ["walkTo",81], ["settle"],
      ["walkTo",85], ["settle"],
      ["walkTo",89], ["settle"],
      ["wait",60],
      ["walkTo",90], ["settle"],
      ["wait",60],
    ],
  },
  // p3 „Der Schulhof" (R5-P1, Dossier ch01-dossiers-v2/p3.md §10):
  // das terrassierte V. Die Rutsche zahlt G/L/U im Tempo (Magnet), die
  // FAHRT zahlt E/S/T (Deck-Fußlinie 282, Buchstaben r16 → dy 8), der
  // Anstieg zahlt I/C/K im Lauf-Magneten (je dy 14). Tape-Pflicht laut
  // Dossier: 9/9 — Schaukel und Bonus-Buch sind ausdrücklich tape-frei
  // (H2 beweist sie). Der Block wird UNTEN durchquert (Köder-Mut am
  // Stampfer vorbei: Querung 24 t < Reifezeit ~37 t — deshalb dort KEIN
  // settle). Der Pier-Abtritt ist der A4-Fang: WARTEN bis die Fähre am
  // West-Umkehrpunkt steht (A-3, closed loop), dann im GEHEN abtreten —
  // Attach bei Tick ~5 mit vy 2 ≤ Toleranz 4.
  p3: {
    abilities: ["jump", "run"],
    program: [
      ["walkTo",9], ["settle"],
      ["hold",{"right":true},140], ["settle"],
      ["hold", {"left":true}, 10], ["talk", "p3-heft"], ["settle"],
      ["walkTo",26], ["settle"],
      ["jump",{"dir":"right","hold":10}], ["settle"],
      ["walkTo",29], ["settle"],
      ["jump",{"dir":"right","hold":6,"steer":5}], ["settle"],
      ["walkTo",33], ["settle"],
      ["jump",{"dir":"right","hold":6,"steer":5}], ["settle"],
      ["walkTo",37], ["settle"],
      ["jump",{"dir":"right","hold":6,"steer":5}], ["settle"],
      ["walkTo",49],
      ["jump",{"dir":"right","hold":18}], ["settle"],
      ["walkTo",55], ["settle"],
      ["jump",{"dir":"right","hold":18}], ["settle"],
      ["walkTo",59], ["settle"],
      ["walkTo",60], ["settle"],
      ["wait",60],
    ],
  },
  // p4 „Die Tafel-Bühne" (R5-P1, arena.md §10): faustlos ausweichen von
  // LINKS der Bühne; die Podeste sind jetzt VOLL-Säulen c5–7/c28–30 (Δr2,
  // je zu überspringen). NEU: Käfig #5 (31,15) — VOR dem Sieg ist ↑ gegated
  // (cagesGated-Toast), NACH dem Sieg zahlt die Rettung; beides läuft hier
  // in Reihenfolge aufs Band.
  p4: {
    abilities: ["jump", "run"],
    program: [
      ["walkTo", 3], ["settle"],
      ["paceUntilDown", 40],
      ["walkTo", 4], ["settle"],
      ["jump", { dir: "right", hold: 14 }], ["settle"], // über das West-Podest
      ["walkTo", 26], ["settle"],
      ["jump", { dir: "right", hold: 14, steer: 10 }], ["settle"], // über das Ost-Podest, VOR dem Käfig landen
      ["walkTo", 31], ["settle"],
      ["hold", { up: true }, 8], ["wait", 30], // Käfig #5: das Klassenfoto (nach dem Sieg entsperrt)
      ["walkTo", 33], ["settle"], ["wait", 40],
    ],
  },
  // p9 „Die Kleckskammer" (R5-P1, p9.md §10): DIE WELLE — Tape A, der
  // PERFEKT-Lauf: 12/12 (SCHOOLTHINGS) tap-traversierbar vor Uhr-Ablauf,
  // R5-W4 · B4 · R45: die beiden O liegen nicht mehr auf EINER Reihe zwei
  // Spalten nebeneinander, sondern als Diagonale über den Kamm — (17,6) und
  // (21,8), Tick 172 und 218. Tastenfolge byte-gleich; der Kamm-Lauf zahlt das
  // zweite O weiterhin im Gehen, das erste fällt jetzt in den Steigflug.
  // dann ✕. (Tape B/Timeout + Rückkehr-Band: deklarierte Schuld — D-23. Der frühere
  // Zusatz »hängt am offenen D-5-Koki-Tor« ist seit K1/2026-08-14 gestrichen: D-5 ist
  // seit B1 nicht nur genickt, sondern GEBAUT; es fehlt nur noch die Schema-Erweiterung.)
  p9: {
    abilities: ["jump", "run"],
    program: [
      ["walkTo", 10], ["settle"],
      ["jump", { dir: "right", hold: 6, steer: 8 }], ["settle"], // auf A → S im Stand
      ["walkTo", 12], ["settle"],
      ["jump", { dir: "right", hold: 6, steer: 8 }], ["settle"], // Bogen → C → auf B
      ["walkTo", 15], ["settle"],
      ["jump", { dir: "right", hold: 6, steer: 8 }], ["settle"], // Bogen → H, dann O (17,6) im Steigflug → auf den KAMM
      ["walkTo", 21], ["settle"], // → das zweite O (21,8) am Ost-Ende des Kamms
      ["jump", { dir: "right", hold: 6, steer: 8 }], ["settle"], // Bogen → L, T im Fall → auf E
      ["walkTo", 25], ["settle"],
      ["jump", { dir: "right", hold: 6, steer: 8 }], ["settle"], // Bogen → H, I im Fall → auf F
      ["walkTo", 30], ["settle"],
      ["jump", { dir: "right", hold: 6, steer: 8 }], ["settle"], // Bogen → N, G im Fall → Boden
      ["walkTo", 37], ["settle"], // → S
      ["walkTo", 42], ["settle"], ["wait", 40], // ✕
    ],
  },
};
