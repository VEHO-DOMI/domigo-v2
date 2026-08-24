// ── R5-T6 · DER AUGEN-BODEN, ALS EIGENES MODUL ──────────────────────────────
//
// Warum getrennt von `PaintScene.ts`: die Geometrie des Bodens stand bis T6 im
// Rumpf einer privaten Methode. Sie war damit weder prüfbar (ein Test, der
// `PaintScene` importiert, zieht Phaser und stirbt an »window is not defined«)
// noch zitierbar — jedes Sitzungs-Lineal musste sie abschreiben. Genau daran
// ist die Prämisse von R229 zerbrochen: aus »der Boden räumt 37–47 % der
// KREIDE weg« wurde über drei Blätter hinweg »der Boden verdeckt 37–47 % des
// GESICHTS«, und niemand konnte es an einer Zeile nachschlagen.
//
// Hier stehen nur Zahlen und zwei reine Funktionen. Gezeichnet wird weiter in
// `PaintScene#renderFaceFloor`.

/* ── R5-T1 · DER AUGEN-BODEN: DAS GESICHT KÄMPFT SICHTBAR ────────────────────
 *
 * BEFUND, den zwei Bahnen unabhängig gemessen haben: der Boss liest in
 * Spielgröße nicht als Gegner, weil man sein Gesicht nicht sieht. Es IST gemalt
 * — AQ13B4 liefert eine Gesichtsquote von 0,58–0,92 je Zelle, und in
 * Handwerksgröße erkennen blinde Leser 2:0 zwei Augen, zwei Brauen, einen Mund
 * (H6 §6 / D-662). Was fehlt, ist die INSZENIERUNG: die Kritzel-Schichten
 * liegen mit 0,72 bzw. 0,95 Deckung darüber. F10s Panel hat denselben Grund von
 * der anderen Seite getroffen (D-644: ein Gesichts-Ausschnitt als Marke wurde
 * 0:2 abgelehnt, weil das Kind dieses Gesicht auf der Bühne nie gesehen hat).
 *
 * KOKIS ENTSCHEID (23.08., wörtlich bindend): das Gesicht WÄCHST mit dem
 * Wischen — Schicht für Schicht freier, im Sieg ganz frei —, aber **Augen und
 * Brauen sind ab dem Betreten der Arena IMMER lesbar**: die Kritzel liegen UM
 * die Augenpartie, nie darüber. R193: der Blick ist das Gegner-Signal.
 *
 * DIE ZAHLEN SIND GEMESSEN, NICHT GESETZT. Über alle zwanzig Kampf-Zellen ist
 * die Kreide (L > 240, S < 0,10) innerhalb der Schreibfläche ausgezählt und auf
 * die Fläche normiert worden. Das Spaltenprofil ist deutlich ZWEIGIPFLIG — die
 * zwei Augen — mit Gipfeln bei 0,35–0,45 und 0,60–0,70 und Rändern bei 0,25 und
 * 0,80; das Zeilenprofil trägt 95 % seiner Kreide zwischen 0,20 und 0,80, mit
 * dem Augen-Gipfel bei 0,40–0,55 und einem zweiten (dem Mund) bei 0,65–0,75.
 * Der Boden deckt deshalb die Spalten 0,24–0,80 und die Zeilen 0,28–0,62.
 *
 * WARUM EINE ELLIPSE UND KEIN RECHTECK: ein Rechteck hat Ecken, und Ecken lesen
 * sich als Aufkleber — dieselbe Klasse, an der F10s erste Marke gescheitert ist.
 * Eine Ellipse liest sich als das, was sie erzählt: hier ist gewischt worden.
 */
/** Mitte des Augen-Bodens, als Anteil der Schreibfläche (0,0 = links oben). */
export const FACE_FLOOR_CX = 0.52, FACE_FLOOR_CY = 0.45;
/** Halbachsen des Bodens bei VOLLER Lebensanzeige, als Anteil der Schreibfläche.
 *  0,52 / 0,38 um (0,52 / 0,45) deckt die Spalten 0,00–1,04 und die Zeilen
 *  0,07–0,83 — also beide Augen-Gipfel des gemessenen Profils (Spalten
 *  0,35–0,45 und 0,60–0,70), den Zeilen-Gipfel der Augen (0,40–0,55) und den
 *  Mund-Gipfel (0,65–0,75).
 *
 *  ★ HISTORIE, damit niemand den Sweep zweimal fährt. Fünf Böden sind unter
 *    T1 im laufenden Kampf fotografiert worden, alle am Halt »anfang« (3/3),
 *    dazu ein Kontrollbild ganz ohne Boden — und DREI davon haben ein blindes
 *    Panel gesehen (D-669):
 *      ohne Boden    die zwei Augen liegen unter der Kritzelei (H6 §6 / F10 §3)
 *      0,28 × 0,17   beide Augen sichtbar, aber klein im dunklen Feld
 *      0,36 × 0,24   Ellipse · Panel 0 : 2 »kein Gesicht« (20 % / 10 %)
 *      0,52 × 0,38   Ellipse · Panel 1 : 1 — der einzige »eher Gegner«-Ja
 *      0,42 × 0,34   eingerücktes Rechteck · Panel 1 : 1 — AUSGELIEFERT bis T6
 *      0,62 × 0,46   am deutlichsten, aber die Tafel liest bei 3/3 schon fast
 *                    sauber und verliert ihren Satz »über und über gekritzelt«
 *
 *  ⚠ ALTLAST, HIER KORRIGIERT (T6/D-716): dieser Block behauptete bis heute,
 *    »0,52 × 0,38« sei GEWÄHLT, und beschrieb daneben die Abdeckung von
 *    »0,28 × 0,17«. Ausgeliefert war seit #360 aber 0,42 × 0,34 — die Prosa
 *    beschrieb zwei Stände, von denen keiner im Code stand.
 */

export const FACE_FLOOR_RX = 0.42, FACE_FLOOR_RY = 0.34;
/** Halbachsen, wenn die letzte Schicht gefallen ist: die ganze Fläche frei. */
export const FACE_FULL_RX = 0.75, FACE_FULL_RY = 0.75;

/* ── R5-T6 · R229-KORREKTUR · DER BODEN WIRD GRÖSSER UND ÖFFNET FRÜHER ───────
 *   ★★ DEKLARIERTES INTERIM — es fällt ersatzlos, siehe unten.
 *
 * WAS ES REPARIERT — und was es ausdrücklich NICHT repariert.
 * R229 war auf der Annahme gebaut, der Augen-Boden VERDECKE das Gesicht
 * (»37–47 % bei 3/3«) und müsse deshalb kleiner werden. Am Code ist das
 * umgedreht: `faceMask.invertAlpha = true` — der Boden ist ein LOCH in der
 * Kreide, er legt das Gesicht FREI. Die 37–47 % sind der Anteil der
 * KREIDE-Blattfläche, den er wegräumt (T4s `mess-augenboden.mjs`), nicht ein
 * Anteil des Gesichts. Kleiner hätte die Gesichts-Frage also verschlechtert.
 *
 * DIE ZAHLEN, mit denen es gestellt ist (T6, beide Lineale, ganze Zellenreihe):
 *   Lineal B »wie viel des GESICHTS steht noch unter Kreide«
 *     0,42 × 0,34   3/3  0,24 %   ·   1/3  0,00 %
 *     0,52 × 0,38   3/3  0,05 %   ·   1/3  0,00 %
 *     ganz ohne Boden 3/3 4,52 %  ← die Obergrenze dessen, was hier je zu
 *                                   holen war: die Kreide lag nie über dem
 *                                   Gesicht, sie deckt 27 % der Fläche, aber
 *                                   nur 2,6–8,5 % der Gesichts-Pixel
 *   Lineal A »wie viel KREIDE der Boden wegräumt« (T4s Lineal, unverändert)
 *     0,42 × 0,34   3/3  37,2–46,9 %   ·   1/3  100 %
 *
 * WAS ES WISSENTLICH KOSTET: der grössere Boden räumt MEHR Kreide weg. Die
 * Frage »was ist auf der Tafel zu sehen?« wird dadurch schlechter, und das ist
 * kein Versehen, sondern die Rechnung dieses Interims. Diese Schuld bezahlt die
 * parallel laufende Band-Order (Kunst, deren Inhalt am RAND sitzt, D-675).
 *
 * WARUM DIE STÄRKE NICHT AN DER KENNZAHL OPTIMIERT IST (D-707, dieselbe Klasse
 * wie R227): beide Lineale sind hier Klippen, keine Rampen — Lineal B steht bei
 * 0,42 schon auf 0,24 % und kann sich nur noch um 0,24 Prozentpunkte bewegen.
 * Wer daran eicht, eicht gegen das Messgerät. Gewählt ist EINMAL und begründet:
 * das einzige Maß der T1-Reihe, das je ein »eher Gegner«-Ja getragen hat.
 *
 * WANN ES FÄLLT: sobald die gemalte Band-Antwort liegt ODER das Auflösungs-
 * Panel auch mit diesem Stand nicht kippt. Im zweiten Fall ist bewiesen, dass
 * das Stellrad tot ist, und der Block gehört ersatzlos zurückgebaut.
 *
 * ★ GENAU DAS IST EINGETRETEN — ZURÜCKGEBAUT (Koki, 24.08., D-719): das Panel
 *   las 2:0 »kein Unterschied«, und die Obergrenze (D-714: ohne Boden lägen nur
 *   4,52 % des Gesichts unter Kreide) beendet die Boden-Spur — die Gesichts-
 *   Frage gehört der KUNST (Band-Order), nicht der Inszenierung. Maß und Kurve
 *   stehen wieder auf dem Auslieferungs-Stand (0,42 × 0,34 · linear); die
 *   Messtabellen oben bleiben als Dokumentation, WARUM das Stellrad tot ist.
 */
/** Ab wann die Öffnung wächst — das ist die ZWEITE Stellgröße (»früher«).
 *
 *  ⚠ EHRLICH GESAGT, WEIL ES SONST FALSCH GELESEN WIRD: »das Gesicht ab
 *    Betreten der Arena sichtbar« hängt NICHT an dieser Kurve. Beim Betreten
 *    ist `frei` = 0, und da ist jede Kurve 0 — der Arena-Moment wird allein vom
 *    Maß oben bestimmt. Die Kurve regelt die Momente NACH dem ersten Wisch:
 *    linear gab der erste Wisch ein Drittel der Öffnung frei, `√frei` gibt 58 %.
 *    Das Gesicht gewinnt seine Fläche also am ersten Wisch statt am letzten. */
export const faceFloorOeffnung = (frei: number): number =>
  Math.max(0, Math.min(1, frei));

/** Die Halbachsen des Bodens für einen Öffnungsgrad, als Anteil der
 *  Schreibfläche. Eigene Funktion, damit die Geometrie EINE Quelle hat und
 *  geprüft werden kann — sie stand vorher nur in `renderFaceFloor`, und die
 *  Sitzungs-Lineale mussten sie abschreiben. */
export const faceFloorHalbachsen = (frei: number): { rx: number; ry: number } => {
  const o = faceFloorOeffnung(frei);
  return {
    rx: FACE_FLOOR_RX + (FACE_FULL_RX - FACE_FLOOR_RX) * o,
    ry: FACE_FLOOR_RY + (FACE_FULL_RY - FACE_FLOOR_RY) * o,
  };
};

