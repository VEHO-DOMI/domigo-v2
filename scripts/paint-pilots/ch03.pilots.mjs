// L3-G1 · DIE PILOTEN VON KAPITEL 3.
//
// Ein Pilot ist ein handgefuehrtes Makro-Programm gegen die echte Sim: »geh nach
// Spalte 14, spring, warte 59 Ticks, druecke Sprung«. Es faehrt geschlossen
// (closed-loop) und wird danach OFFEN nachgespielt — nur wenn beide Laeufe
// dieselbe Welt erzeugen, ist das Band ein Beweis.
//
// Nur p1 traegt hier ein Programm: ch03 ist ein Kalibrier-Stand, die vier
// anderen Raeume sind Gerueste ohne Inhalt. Der Rekorder nimmt genau die Phasen
// auf, die hier stehen.
//
// ⚠ DER RING HAT KEIN MAKRO. Das Greifen passiert von selbst, sobald das Kind in
// der Luft nah genug am Ring ist (Reichweite 14 px waagrecht, 28 px senkrecht
// zum KOPF); das Loslassen ist ein frischer Sprung-Tastendruck waehrend des
// Schwungs. Beides ist hier aus `hold`-Pulsen komponiert und in Ticks gemessen,
// nicht geschaetzt — die Zahlen unten stammen aus dem Band selbst.
export const PILOTS = {
  p1: {
    // Eintritts-Faehigkeiten: OHNE swing. Der Ring-Schwung wird in diesem Raum
    // vergeben (powerup p1-ringgabe), und der Rekorder haengt ihn beim Aufheben
    // an — genau wie die Spiel-Shell.
    abilities: ["jump", "run", "punch", "hang"],
    program: [
      ["walkTo", 4], ["settle"],                                    // Muenzen am Kai
      ["walkTo", 5], ["settle"], ["wait", 12],                      // DIE RING-GABE am Kranfuss
      ["walkTo", 6], ["settle"],
      ["jump", { dir: "right", hold: 10, steer: 6 }], ["settle"],    // auf die Frachtkiste
      ["walkTo", 9], ["settle"],
      ["walkTo", 10], ["settle"], ["wait", 24],                     // Regel-Seite 1 (have got)
      ["walkTo", 9], ["settle"],
      ["jump", { dir: "right", hold: 10, steer: 6 }], ["settle"],    // auf den Kranarm
      ["walkTo", 13], ["settle"],
      ["walkTo", 14], ["settle"], ["hold", { up: true }, 8], ["wait", 40], // Kaefig #2
      ["settle"],
      // ── DIE QUERUNG (am Band gemessen: Griff Tick 59, Loslassen Tick 89, Landung 109) ──
      ["hold", { right: true, jump: true }, 6],
      ["hold", { right: true }, 83],
      ["hold", { right: true, jump: true }, 1],
      ["hold", { right: true }, 30], ["settle"],
      // ── Ponton ──
      ["walkTo", 30], ["settle"], ["walkTo", 32], ["settle"], ["walkTo", 34], ["settle"],
      ["jump", { dir: "left", hold: 8, steer: 4 }], ["settle"], ["walkTo", 34], ["settle"],
      // ── das Ruderboot ──
      ["walkTo", 34], ["settle"],
      ["waitPlatformAt", "p1-ruderboot", 36.5, 0.8], ["jump", { dir: "right", hold: 10, steer: 8 }], ["settle"],
      ["rideUntil", "p1-ruderboot", 42, 0.8],
      ["jump", { dir: "right", hold: 12, steer: 10 }], ["settle"],
      // ── Pier ──
      ["walkTo", 45], ["settle"], ["wait", 24],                     // Regel-Seite 2 (Plurale)
      ["walkTo", 48], ["settle"], ["hold", { up: true }, 8], ["wait", 40], // das Holzbein
      ["settle"], ["walkTo", 50], ["settle"], ["wait", 150],       // dem Streit-Papagei Zeit fuer seinen Stossflug geben
      ["walkTo", 51], ["settle"], ["wait", 30],
      ["walkTo", 54], ["settle"], ["walkTo", 58], ["settle"], ["walkTo", 53], ["settle"],
      ["jump", { dir: "right", hold: 10, steer: 5 }], ["settle"],    // Kanonen-Podest
      ["walkTo", 57], ["settle"],
      ["hold", { right: true }, 30], ["settle"],                     // hinab auf den Pier
      ["walkTo", 60], ["settle"],
      ["walkTo", 61], ["settle"], ["hold", { up: true }, 8], ["wait", 40], // die Tuer
      ["settle"],
      ["jump", { dir: "right", hold: 8, steer: 6 }], ["settle"], ["wait", 60],
    ],
  },
};
