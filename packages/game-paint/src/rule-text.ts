// R5-W9 · N1 · DIE REGEL-SEITE, IN REINEM TEXT.
//
// Die drei Entscheidungen, die JEDE Fläche einer Regel-Seite trifft — die
// Fundkarte im Spiel, die Merkseite hinter dem HUD-Chip und das Regelbuch-Brett
// im Hub. Bis zu dieser Runde lebte die erste davon (`splitKey`) zweimal: einmal
// in `cards/RulePage.tsx` und einmal, Wort für Wort abgeschrieben, im Hub-Brett.
// Genau diese Drift hat Kokis Review schon einmal gekostet („der Hub und die
// Karte lesen sich wie zwei Produkte"), und sie wächst mit jedem neuen Mittel.
// Also: eine Datei, drei Leser, ein Test.
//
// WARUM NICHT UNTER `cards/`. `level.ts` braucht die Trennmarke für sein
// Muster-Gesetz und darf die Kartenschicht nicht importieren (die Node-Tore
// strippen es ohne React). Diese Datei trägt keine Oberfläche, nur Text — sie
// wohnt deshalb neben `level.ts`, nicht darunter, und alle drei Schichten
// dürfen sie lesen.

/** Das Trennzeichen eines Beispiel-PAARES: Leerzeichen · Halbgeviertstrich ·
 *  Leerzeichen, wie die ausgelieferten Seiten es schreiben (an
 *  `ch01.level.json` gemessen, U+2013). Die Leerzeichen gehören zur Marke,
 *  damit der Bindestrich in »twenty-five« kein Paar vortäuscht. */
export const BEISPIEL_PAAR_TRENNER = " – ";

/** Die vier Lese-Formen, die eine Regel-Seite deklarieren darf.
 *  Geschlossen wie `TIP_PARAM_KEYS` und aus demselben Grund: ein Tippfehler
 *  wäre sonst eine Karte, die still auf die langweiligste Form zurückfällt —
 *  genau die Flachheit, gegen die diese Runde gebaut ist. */
export const BEISPIEL_MUSTER: ReadonlySet<string> = new Set(["wandel", "gegensatz", "dialog", "einzeln"]);

/** Der Merksatz, aufgeteilt um seine Schlüsselstelle: [davor, Schlüssel, danach].
 *
 *  Ein Schlüssel, der nicht im Satz steht, gibt den Satz GANZ und unmarkiert
 *  zurück — die Karte verstümmelt nie eine Zeile, nur damit eine Marke sitzt;
 *  `tip-honesty` ist das Tor, das diesen Fall gar nicht erst ausliefern lässt. */
export const splitKey = (satz: string, key: string): readonly [string, string, string] => {
  if (key === "") return [satz, "", ""];
  const at = satz.indexOf(key);
  if (at < 0) return [satz, "", ""];
  return [satz.slice(0, at), key, satz.slice(at + key.length)];
};

/** Ein Stück einer englischen Beispielzeile: markiert oder nicht. */
export interface EnStueck {
  readonly text: string;
  readonly markiert: boolean;
}

/** DIE SCHLÜSSEL-ENGLISCH-MARKE (Kokis Befund D-770, Punkt 2).
 *
 *  Markiert werden die Formen aus `lehrtEn` — also genau das, was die Seite zu
 *  lehren VERSPRICHT und was `tip-honesty` ohnehin gegen die Beispiele prüft.
 *  Das Feld lag seit Wochen geprüft daneben und wurde von keiner Fläche
 *  gezeichnet; es brauchte kein neues Feld, nur einen Leser.
 *
 *  Drei Regeln, und die zweite ist die, die man vergisst:
 *    · GROSS/KLEIN egal beim Suchen, aber die Schreibweise der ZEILE bleibt
 *      stehen — die Karte zeigt das Englisch, wie das Kind es liest.
 *    · An derselben Stelle gewinnt die LÄNGERE Form. Sonst schluckt »It« das
 *      »It's«, und die Marke sässe auf der halben Form.
 *    · Überlappungen werden verworfen, nicht verschachtelt: zwei Marken
 *      ineinander sind keine Auszeichnung mehr, sondern ein Fleck.
 *
 *  Findet sich nichts, kommt die Zeile als EIN unmarkiertes Stück zurück —
 *  eine Zeile ohne gelehrte Form ist ein Befund für das Tor, kein Grund, hier
 *  etwas zu erfinden. */
export const markEn = (zeile: string, formen: readonly string[]): readonly EnStueck[] => {
  const tief = zeile.toLowerCase();
  const treffer: { von: number; bis: number }[] = [];
  for (const form of formen) {
    if (typeof form !== "string" || form.trim() === "") continue;
    const nadel = form.toLowerCase();
    for (let at = tief.indexOf(nadel); at >= 0; at = tief.indexOf(nadel, at + 1)) {
      treffer.push({ von: at, bis: at + nadel.length });
    }
  }
  // erst nach Anfang, bei gleichem Anfang die längere zuerst
  treffer.sort((a, b) => (a.von - b.von) || (b.bis - a.bis));
  const genommen: { von: number; bis: number }[] = [];
  for (const t of treffer) {
    if (genommen.length > 0 && t.von < genommen[genommen.length - 1]!.bis) continue;
    genommen.push(t);
  }
  if (genommen.length === 0) return [{ text: zeile, markiert: false }];
  // ★★ R233 · F6 · BENACHBARTE MARKEN BLEIBEN GETRENNT — und die vorige Runde
  // hatte hier das Gegenteil stehen.
  //
  // Die erste Fassung verschmolz zwei Treffer, zwischen denen nur Leerraum lag:
  // »Don't sit down!« bekam EINEN durchgehenden Wisch. Das löste ein optisches
  // Problem (zwei Wische mit einer Lücke lasen sich wie ein Fleck) und zerstörte
  // dabei die Lektion — die Codex-Runde hat es am Bild gefangen: die Regel
  // dieser Seite ist »Don't vor das Verb«, und wenn »Don't sit down« EIN Wisch
  // ist, ist genau das nicht mehr einzeln ablesbar. Auf der Nachbarzeile wurde
  // aus »Don't close« ein Wisch, also verschmolz die Marke sogar quer über die
  // Grenze zweier verschiedener gelehrter Formen.
  //
  // Das optische Problem bleibt echt und wird dort gelöst, wo es entsteht: die
  // Fläche gibt dem Leerraum ZWISCHEN zwei Marken seine Breite zurück
  // (`.pb-en-luecke`), statt zwei Lektionen zu einer zu machen. Eine Marke, die
  // eine Regel unlesbar macht, ist keine Auszeichnung mehr.
  const stuecke: EnStueck[] = [];
  let hier = 0;
  for (const t of genommen) {
    if (t.von > hier) stuecke.push({ text: zeile.slice(hier, t.von), markiert: false });
    stuecke.push({ text: zeile.slice(t.von, t.bis), markiert: true });
    hier = t.bis;
  }
  if (hier < zeile.length) stuecke.push({ text: zeile.slice(hier), markiert: false });
  return stuecke;
};

/** Die zwei Hälften eines Paares, oder `null`, wenn die Zeile keines ist.
 *
 *  `null` statt eines Notbehelfs, weil die aufrufende Fläche dann die Zeile
 *  ganz zeichnet: eine halb gezeichnete Verwandlung wäre schlechter als eine
 *  Zeile ohne Verwandlung. Dass es überhaupt vorkommen kann, ist bereits ein
 *  Tor-Befund (`tip-honesty` prüft Muster gegen Daten) — hier steht nur, was
 *  die Karte in der Sekunde tut, in der ihr trotzdem so etwas untergeschoben
 *  wird. */
export const paarTeile = (zeile: string): readonly [string, string] | null => {
  const teile = zeile.split(BEISPIEL_PAAR_TRENNER);
  if (teile.length !== 2) return null;
  const [links, rechts] = teile as [string, string];
  if (links.trim() === "" || rechts.trim() === "") return null;
  return [links, rechts];
};
