// L6-G1 · DIE PILOTEN VON KAPITEL 6 (»Die falschen Hinweise«).
//
// Konvention wie ch01 (L0 · D10): ein Pilot ist ein handgeführtes Makro-Programm
// (»geh nach Spalte 42, spring, warte 40 Ticks«), das gegen die echte Sim fährt.
// Ein Pilot, der den Ausgang nicht erreicht, IST der Beweis, dass der Raum sein
// Spielbarkeits-Gesetz bricht.
//
// Heute liefert diese Datei p1 — das Kalibrier-Exemplar. Die Gerüst-Räume p2/p3/
// p4/p9 bekommen ihre Makros von L6-G2, wenn sie ihre echten Gitter haben; der
// Rekorder überspringt Phasen ohne Piloten anstandslos (`phases = Object.keys(PILOTS)`).
export const PILOTS = {
  // p1 »Die Markt-Gassen« (Dossier p1.md §10): Auftakt-Bogen → Regel-Seite 1 auf dem
  // Markisen-Absatz → Regel-Seite 2 → Sprungfeder → Balkon A (Schnipsel »runs«) →
  // Dachkante → über die WESTKANTE zurück auf die Gasse → Marktzone → Beweis-Glas
  // → Anker → Tinten-Rinne → Schnipsel »street« → Hausnummer 7 → Tür.
  //
  // Zwei gemessene Regeln stecken in der Reihenfolge: vor der Feder wird NICHT
  // gesettelt (der Feder-Zweig löscht `grounded`, ein `settle` liefe sein volles
  // Budget ab und machte die Spur unlesbar), und der Markisen-Absatz wird
  // gesprungen, nicht gelaufen — eine volle Kachel ist für den Mover eine WAND.
  p1: {
    abilities: ["jump", "run", "punch", "hang", "swing", "hover"],
    program: [
      ["walkTo", 6], ["settle"],
      ["jump", { dir: "right", hold: 6, steer: 12 }], ["settle"],   // der Auftakt-Bogen: der Scheitel-Funke (7,15)
      ["walkTo", 9], ["settle"],
      ["jump", { dir: "right", hold: 6, steer: 10 }], ["settle"],   // auf den Markisen-Absatz → Regel-Seite 1
      ["walkTo", 18], ["settle"],                                    // herunter auf die Gasse: Funken + Regel-Seite 2 (17,17)
      ["hold", { right: true }, 14],                                 // auf die Feder (20,17) — kein settle davor
      ["hold", {}, 26],                                              // der Wurf trägt senkrecht 5,94 Zeilen hinauf
      ["hold", { right: true }, 10],                                 // im Scheitel nach rechts auf Balkon A
      ["settle"],
      ["walkTo", 23], ["settle"],
      ["jump", { dir: "right", hold: 6, steer: 14 }], ["settle"],    // Balkon A → Dachkante (Δr3, Δc2)
      ["walkTo", 28], ["settle"],
      ["walkTo", 24], ["settle"],                                    // über die Westkante zurück auf die Gasse
      ["walkTo", 32], ["settle"],                                    // zurück auf der Gasse, Richtung Marktzone
      ["walkTo", 42], ["settle"],                                    // unter dem Obststand durch, nasses Pflaster
      ["jump", { dir: "right", hold: 6, steer: 12 }], ["settle"],    // Bogen über (44,15) → Schnipsel »down«
      ["walkTo", 49], ["settle"],                                    // Beweis-Glas, dann der stille Anker
      ["jump", { dir: "right", hold: 14, steer: 14 }], ["settle"],   // über die Tinten-Rinne c50–c52
      ["walkTo", 56], ["settle"],                                    // Schnipsel »street« auf der Lauflinie
      ["walkTo", 59], ["settle"],                                    // an Hausnummer 7 vorbei
      ["walkTo", 61], ["settle"], ["wait", 30],                      // die Ausgangstür
      ["walkTo", 62], ["settle"], ["wait", 60],
    ],
  },
};
