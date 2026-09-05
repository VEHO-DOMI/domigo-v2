// L2-P1v2 · DIE PILOTEN VON KAPITEL 2 (Level-Welle, 2026-09-05).
//
// Ein Pilot ist ein handgeführtes Makro-Programm gegen die echte Sim; ein Pilot,
// der den Ausgang nicht erreicht, IST der Beweis, dass der Raum sein
// Spielbarkeits-Gesetz bricht. p1 »Das Zoo-Tor« v2 ist das Kalibrier-Exemplar
// MIT der Signatur (Dossier ch02-dossiers-v2/p1.md §10); p2/p3/p4/p9 folgen mit L2-G2.
// Karten (Poster, Käfig, Bühnen, Pinguin, Tür, Faust-Gabe) legt der Recorder ab
// bzw. löst sie auto (record-paint-tape.mjs `handle`), genau wie der CI-Replayer.
//
// DER GRIFF (gemessen 05.09., Sonde #411 + Reach-Modell): eine 7-Zeilen-Mauer
// schafft der Halte-Sprung NICHT (6,06 Zeilen Fuss-Hub) — das Kind fällt an der
// Kante vorbei, greift sie (`hangAt`), und der zweite Sprung aus dem Griff trägt
// es hinauf. Makro-Form: hold {right,jump} 12 · hold {right} 60 (Fall + Griff) ·
// hold {right,jump} 12 (Absprung aus dem Griff) · hold {right} 30 (Landung).
const GRIFF = [
  ["hold", { right: true, jump: true }, 12], ["hold", { right: true }, 60],
  ["hold", { right: true, jump: true }, 12], ["hold", { right: true }, 30], ["settle"],
];
export const PILOTS = {
  // p1 „Das Zoo-Tor" v2: S (2,17) → Park-Poster (5,17) → GRIFF 1 Kassenmauer c8 (7 Zeilen)
  // → Affenhaus-Dach r10: Käfig (11,10) ↑ → Bühne Papagei × Auto (18,10) wird enthüllt,
  // läuft 5 Stationen = 4 Abschnitte (360 Takte) und fragt → GRIFF 2 Voliere c28 (7 Zeilen über dem Dach)
  // → Krone r3 → Abgang c34 auf den Boulevard → Läufer-Band c37–42 (Kontakt = Karte +
  // iframes, ehrlich im Band) → nasse Fliesen c43–47 (Rutscher) → Pinguin (48,17) ↑ →
  // Bühne Buddy × Baum (52,17) wird enthüllt, läuft 4 Stationen und fragt → GRIFF 3
  // Faust-Turm c55 → Faust (56,10) → Abgang auf den Anker C (58,17) → Tinten-Graben
  // c59–60 (Doppel-Tap wie ch01 Lücke 2) → Drehkreuz (61,17) → X (62,17).
  p1: {
    abilities: ["jump", "run", "hang"],
    program: [
      ["walkTo", 7], ["settle"], ["wait", 20],                  // Poster (5,17) im Vorbeigehen; Regelseite legt der Recorder ab
      ...GRIFF,                                                  // GRIFF 1 → Dach (8,10); Feder (7,11) im Hangeln
      ["walkTo", 11], ["settle"],
      ["hold", { up: true }, 8], ["wait", 30],                   // ↑ am Käfig (11,10) → Rettungs-Karte (auto-gelöst) → Link enthüllt die Papagei-Bühne
      ["walkTo", 15], ["settle"], ["wait", 480],                 // ZUSCHAUEN: 4 Abschnitte à 90 Takte (Sonde: 359), dann fragt sie (auto-gelöst)
      ["walkTo", 27], ["settle"],                                 // Dach-Federn r9
      ...GRIFF,                                                  // GRIFF 2 → Volieren-Krone (28,3); Feder (27,4) im Hangeln
      ["walkTo", 33], ["settle"],                                 // Kronen-Federn r2
      ["hold", { right: true }, 14], ["settle"],                 // Abgang c34 → Boulevard (Tape 1: hold 40 trug bis c40, mitten ins Läufer-Band)
      ["walkTo", 47], ["settle"],                                 // Läufer-Band, Fliesen, Federn r16
      ["walkTo", 48], ["settle"],
      ["hold", { up: true }, 8], ["wait", 30],                   // ↑ am Pinguin (48,17) → restore (auto-gelöst) → Link enthüllt Buddy
      ["walkTo", 50], ["settle"], ["wait", 400],                 // ZUSCHAUEN: 3 Abschnitte à 90 Takte (Sonde: 269), dann fragt Buddy (auto-gelöst)
      ["walkTo", 54], ["settle"],                                 // Feder (52,16) AUF Buddy
      ["hold", { right: true, jump: true }, 12], ["hold", { right: true }, 60], // GRIFF 3: Fall + Griff an der Turmkante; Feder (54,11) im Hangeln
      ["hold", { right: true, jump: true }, 7], ["hold", {}, 40], ["settle"],   // KURZER Absprung aus dem Griff (die Krone liegt nur 1,6 Zeilen über den Griff-Füssen): ein voller Absprung trägt 5,56 Spalten und überflog den 2-Spalten-Turm samt Graben (Tape 1 bis c61, Tape 2 bis c58)
      ["walkTo", 56], ["settle"], ["wait", 20],                  // die Faust (56,10) — Gabe-Karte
      ["walkTo", 57], ["settle"],                                 // Abgang: vom Turm bei c57 SENKRECHT auf (57,17), Feder (57,15) — ein Halte-Abgang trug am Anker vorbei in den Graben (Tape 3: Warp zum Start, weil der Anker nie berührt war)
      ["walkTo", 58], ["settle"],                                 // Anker (58,17) — walkTo stoppt VOR dem Graben
      ["jump", { dir: "right", hold: 6, steer: 12 }], ["settle"], // über den Tinten-Graben c59–60
      ["walkTo", 61], ["settle"], ["wait", 30],                  // das Drehkreuz — Türkarte
      ["walkTo", 62], ["settle"], ["wait", 60],
    ],
  },
};
