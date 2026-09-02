// N7B2 · D-788 · WER TIPPT, TIPPT — DAS SPIEL HÄLT DIE FINGER STILL.
//
// Phaser hängt für jede Taste, die eine Szene anmeldet, einen Horcher ans ganze
// FENSTER und schaltet dort die Browser-Standardaktion ab
// (`KeyboardManager.onKeyDown`: `preventDefault()` für jeden erfassten
// `keyCode`) — OHNE zu prüfen, worauf der Schreibcursor gerade steht. Unser
// Spiel meldet `LEFT,RIGHT,UP,DOWN,A,D,W,S,SPACE,X,J` an; ein Kind, das »was«
// oder »a dog« in ein Karten-Antwortfeld tippt, verliert damit w, a, s und das
// Leerzeichen. Gemessen am gebauten Spiel (N7B-Report, Kandidat D-788):
// Leertaste/A/W/D/X/Pfeil-links kommen an einem FOKUSSIERTEN Eingabefeld als
// abgefangen zurück, die Kontrolltasten Q und E nicht.
//
// Solange eine Karte steht, gehört die Tastatur also dem Kind und nicht dem
// Spiel. Zwei Entscheidungen stecken in dieser Datei:
//
//   · NICHT `keyboard.enabled = false`. Das Spiel liest die Richtung jeden
//     Frame als `Key.isDown` (`PaintScene.readPad`); abgeschaltet wäre auch das
//     Polling tot, und die über die Karte GEHALTENE Richtungstaste — das Herz
//     der Resume-Naht aus N7B — griffe beim Schliessen nicht mehr sofort.
//     Abgeschaltet wird deshalb nur das Abfangen, nie das Lesen.
//   · EINE Quelle für die Tastenliste. `addKeys` und das Wiederherstellen
//     lesen dieselbe Konstante; zwei Listen wären ein stiller Drift, bei dem
//     eine später angemeldete Taste ihr Abfangen nie zurückbekäme.
//
// Diese Datei kennt Phaser NICHT (nur die zwei Methoden, die sie ruft): das
// Paket hat kein DOM-Testbett, und ein Gesetz, das man nicht laufen lassen
// kann, ist ein Wunsch. So ist es ein echter Verhaltens-Test (keyCapture.test.ts).

/** Die Tasten, die das Spiel selbst braucht — die EINE Quelle für `addKeys`
 *  und für das Wiederherstellen des Abfangens. */
export const PAD_KEYS = "LEFT,RIGHT,UP,DOWN,A,D,W,S,SPACE,X,J";

/** Genau der Ausschnitt von Phasers Tastatur-Steckplatz, den diese Regel
 *  anfasst. Klein gehalten, damit der Test ihn ehrlich nachbauen kann. */
export interface KeyCaptureTarget {
  clearCaptures(): unknown;
  addCapture(keys: string): unknown;
}

/**
 * Stellt das Abfangen auf den Zustand der Welt ein.
 *
 * `overlayOpen` = eine Karte steht ⇒ gar nichts abfangen, das Kind schreibt.
 * Karte weg ⇒ die eigene Liste wieder anmelden — erst leeren, dann setzen,
 * damit zweimaliges Rufen denselben Zustand ergibt wie einmaliges (die Hülle
 * ruft `setOverlay` bei jedem Karten-Wechsel, und ein Doppel-Ruf ist die Regel,
 * nicht die Ausnahme — siehe D-960).
 *
 * Ohne Tastatur (kopflose Läufe, Tape-Replays) passiert nichts.
 */
export const applyKeyCapture = (kb: KeyCaptureTarget | null | undefined, overlayOpen: boolean): void => {
  if (!kb) return;
  kb.clearCaptures();
  if (!overlayOpen) kb.addCapture(PAD_KEYS);
};
