// CODEX DRAFT — NOT CANON
// R1a · L2-P1v2 · DIE PILOTEN VON KAPITEL 2 (Level-Welle, 2026-09-05).
//
// Die Programme stammen aus R1a und wurden in R1b um die Zoo-Beobachtungen
// erweitert. Der Recorder fährt die echte Simulation und beantwortet Karten
// automatisch. Verglichen werden Ausgang, Aufgaben-IDs und beobachtete Szenen;
// Bildsemantik und selbstständiges Lösen durch ein Kind sind damit nicht geprüft.
// Zellgenaue Bau- und Spielanleitung: docs/design/g1/paint/ch02-dossiers-v2/.
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
  // p1: Ticket und fünf Auto-Halte, drei Griffe, Pinguin/Buddy, Faust,
  // Drehkreuz auf der Westbank und tatsächliche kurze Wagenfahrt.
  p1: {
    abilities: ["jump", "run", "hang"],
    program: [
      ["walkTo", 7], ["settle"], ["wait", 20],
      ...GRIFF,
      ["walkTo", 11], ["settle"],
      ["hold", { up: true }, 8], ["wait", 30],
      ["walkTo", 14], ["settle"], ["watch", "p1-buehne-papagei", "car-west"],
      ["walkTo", 22], ["settle"], ["watch", "p1-buehne-papagei", "car-east"],
      ["walkTo", 27], ["settle"],
      ...GRIFF,
      ["walkTo", 33], ["settle"],
      ["hold", { right: true }, 14], ["settle"],
      ["walkTo", 40], ["settle"], ["talk", "p1-schubkarre"],
      ["walkTo", 47], ["settle"],
      ["walkTo", 48], ["settle"],
      ["hold", { up: true }, 8], ["wait", 30],
      ["walkTo", 50], ["settle"], ["watch", "p1-buehne-buddy"],
      ["walkTo", 54], ["settle"],
      ["hold", { right: true, jump: true }, 12], ["hold", { right: true }, 60],
      ["hold", { right: true, jump: true }, 7], ["hold", {}, 40], ["settle"],
      ["walkTo", 56], ["settle"], ["wait", 20],
      ["walkTo", 57], ["settle"],
      ["walkTo", 57], ["settle"],
      ["walkTo", 58], ["settle"], ["waitPlatformAt", "p1-zug", 58.5, 0.01],
      ["jump", { hold: 6 }], ["rideToEnd", "p1-zug"],
      ["jump", { dir: "right", hold: 3, steer: 6 }], ["settle"],
      ["walkTo", 61], ["settle"], ["wait", 30],
      ["walkTo", 61], ["settle"], ["wait", 60],
    ],
  },
  // R1a: Griff, Dachblick, Zug-Käfig, Bus-Unterweg, Hund, Rückrampe,
  // Besucherinsel, Tinte, Fenns sechs Runden und Bahnhof.
  p2: {
    abilities: ["jump", "run", "hang", "punch"],
    program: [
      ["walkTo", 9], ["settle"], ...GRIFF,
      ["walkTo", 16], ["settle"], ["talk", "p2-affe"],
      ["walkTo", 19], ["settle"], ["watch", "p2-buehne-bus", "bus-roof"],
      ["walkTo", 32], ["settle"], ["hold", { up: true }, 8], ["wait", 30],
      ["walkTo", 34], ["hold", { left: true }, 6], ["settle"],
      ["walkTo", 18], ["settle"], ["hold", { up: true }, 8], ["wait", 30],
      ["walkTo", 23], ["settle"], ["walkTo", 33], ["settle"], ["watch", "p2-buehne-bus", "bus-under"],
      ["walkTo", 39], ["settle"], ["walkTo", 35], ["settle"],
      ["walkTo", 37], ["settle"], ["jump", {hold:6}], ["settle"], ["watch", "p2-parkgruppe"], ["walkTo", 40], ["settle"], ["watch", "p2-gehege"],
      ["walkTo", 44], ["settle"],
      ["jump", { dir: "right", hold: 6, steer: 12 }], ["settle"],
      ["walkTo", 50], ["settle"], ["hold", { up: true }, 8], ["wait", 30],
      ["walkTo", 51], ["settle"],
      ...Array.from({ length: 6 }, () => [["hold", { up: true }, 8], ["wait", 20]]).flat(),
      ["walkTo", 58], ["settle"], ["talk", "p2-schaffner"],
      ["waitPlatformAt", "p2-zug", 58.5, 0.01], ["jump", { hold: 6 }],
      ["rideToEnd", "p2-zug"], ["walkTo", 69], ["wait", 60],
    ],
  },
  // R1a: zwei schwingende Äste und zwei fallende Schilder über trockenem
  // Fangboden, dann Balkon, Stein, Gruppe und zwei sieben Reihen hohe Griffe.
  p3: {
    abilities: ["jump", "run", "hang", "punch"],
    program: [
      ["walkTo", 9], ["settle"], ["waitPlatformAt", "p3-ast-1", 13, 0.3],
      ["hold", { right: true }, 16], ["rideUntil", "p3-ast-1", 16.4, 0.4],
      // Je Übergang eine Richtung, dann loslassen; 176 Takte = Flug + Astfahrt.
      ["hold", {"right": true, "jump": true}, 12],
      ["hold", {"right": true}, 10],
      ["hold", {}, 176],
      ["hold", {"right": true, "jump": true}, 4],
      ["hold", {"right": true}, 2],
      ["hold", {}, 35],
      ["hold", {"right": true, "jump": true}, 4],
      ["hold", {"right": true}, 12],
      ["hold", {}, 36],
      ["hold", {"left": true, "jump": true}, 4],
      ["hold", {"left": true}, 14],
      ["hold", {}, 34],
      ["hold", {"right": true}, 47],
      ["hold", {}, 19],
      ["walkTo", 28], ["settle"], ["talk", "p3-papagei"],
      ["jump", { dir: "right", hold: 8, steer: 10 }], ["settle"],
      ["jump", { dir: "right", hold: 8, steer: 10 }], ["settle"],
      ["jump", {hold:12}], ["settle"], ["walkTo", 33], ["settle"], ["watch", "p3-buehne-giraffe"],
      ["walkTo", 39], ["settle"], ["walkTo", 39], ["settle"],
      ["hold", { up: true }, 8], ["wait", 30],
      ["walkTo", 40], ["settle"], ["watch", "p3-buehne-stein"],
      ["walkTo", 43], ["settle"], ["watch", "p3-baumhaus-gruppe", "treehouse-lower"],
      ["jump", { hold: 6 }], ["settle"], ["watch", "p3-baumhaus-gruppe", "treehouse-passes"],
      ["walkTo", 46], ["settle"], ["walkTo", 46], ["settle"],
      ["walkTo", 47], ["settle"],
      ["jump", { dir: "right", hold: 6, steer: 12 }], ["settle"],
      ["walkTo", 53], ["settle"], ...GRIFF,
      ["walkTo", 58], ["settle"], ...GRIFF,
      ["walkTo", 61], ["wait", 60],
    ],
  },
  p4: {
    abilities: ["jump", "run", "hang", "punch"],
    program: [
      ["walkTo", 5], ["jump", { dir: "right", hold: 6, steer: 14 }], ["settle"],
      ["walkTo", 12], ["settle"], ["zooFight", 6000], ["walkTo", 26],
      ["jump", { dir: "right", hold: 6, steer: 14 }], ["settle"],
      ["walkTo", 33], ["wait", 120],
    ],
  },
  p9: {
    abilities: ["jump", "run", "hang", "punch"],
    program: [
      ["walkTo", 6], ["jump", { dir: "right", hold: 6, steer: 18 }], ["settle"],
      ["walkTo", 12], ["jump", { dir: "right", hold: 4, steer: 18 }], ["settle"],
      ["walkTo", 18], ["jump", { dir: "right", hold: 3, steer: 12 }], ["settle"],
      ["walkTo", 20], ["settle"], ["jump", { hold: 4 }], ["settle"],
      ["walkTo", 24], ["jump", { dir: "right", hold: 12, steer: 20 }], ["settle"],
      ["walkTo", 31], ["jump", { dir: "right", hold: 3, steer: 10 }], ["settle"], ["walkTo", 41], ["wait", 30],
    ],
  },
};
