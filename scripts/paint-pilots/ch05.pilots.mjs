// ch05 · handgeführte Piloten-Makros für die Beweis-Bänder (L0-Konvention).
// Getunt, indem `scripts/record-paint-tape.mjs --chapter ch05` gefahren und die
// gedruckte Zell-Spur gelesen wird — ein Pilot, der den Ausgang nicht erreicht,
// IST der Beweis, dass der Raum das Spielbarkeits-Gesetz bricht.
//
// p1 „Die Trommel-Hügel": die Route zeigt beide Lehren des Raums —
// über die Rutsch-Bänder (~ c12–c18) in die weiche Tasche, und von der Pauke
// (Feder s auf c27) hinauf auf die Trommel-Platte mit dem Noten-Lohn.
export const PILOTS = {
  p1: {
    abilities: ["jump", "run", "punch", "hang", "swing", "hover"],
    program: [
      ["walkTo", 5], ["settle"],
      ["jump", { dir: "right", hold: 1, steer: 8 }], ["settle"],   // Auftakt-Bogen über die Trommelkante
      ["walkTo", 10], ["settle"],                                   // Regel-Seite 1 (can / can't)
      ["walkTo", 18], ["settle"],                                   // die Rutsch-Bänder
      ["walkTo", 21], ["settle"],                                   // in der weichen Tasche
      ["jump", { dir: "right", hold: 14, steer: 30 }],              // aus der Tasche heraus, direkt auf die Pauke
      ["hold", { right: true }, 50],                                // die Feder feuert von selbst; die gehaltene Richtung trägt hinauf auf die
      //                                                            Trommel-Platte. NIE `settle` auf einer Feder: sie löscht `grounded`
      //                                                            bei jedem Aufsetzen, der Pilot bliebe 240 Ticks am Hüpfen.
      ["settle"],
      ["walkTo", 34], ["settle"],                                   // die drei Noten oben auf der Trommel-Platte
      ["jump", { dir: "right", hold: 1, steer: 30 }], ["settle"],
      ["walkTo", 39], ["settle"],
      ["walkTo", 43], ["settle"],
      ["jump", { dir: "right", hold: 1, steer: 30 }], ["settle"],   // über die Saiten-Reihe
      ["walkTo", 49], ["settle"],
      ["hold", { up: true }, 6], ["settle"],                        // ↑ vor dem Notenständer: das Keyboard frei
      ["walkTo", 54], ["settle"],                                   // Regel-Seite 2, dann der Anker
      ["jump", { dir: "right", hold: 20, steer: 40 }], ["settle"],  // über den Lack-See
      ["walkTo", 61], ["settle"], ["wait", 30],                     // die Tür
      ["walkTo", 62], ["settle"], ["wait", 60],
    ],
  },
};
