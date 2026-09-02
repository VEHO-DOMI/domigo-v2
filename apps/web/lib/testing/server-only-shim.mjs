// L0 · WARUM ES DIESE DATEI GIBT.
//
// `paint-content.ts` beginnt mit `import "server-only"`. Das ist kein Modul mit
// Inhalt, sondern ein WÄCHTER: Next.js löst den Namen beim Bauen auf und lässt
// den Bau platzen, wenn eine Client-Komponente die Datei anfasst. Zur Laufzeit
// tut er nichts, und als npm-Paket liegt er gar nicht auf der Platte — Next
// bringt die Auflösung selbst mit.
//
// Ein `node --test` hat diese Auflösung nicht und bricht mit ERR_MODULE_NOT_FOUND
// ab, bevor eine einzige Behauptung läuft. Dieser Haken gibt dem Namen ein
// leeres Modul, damit der Lader UNTER TEST die echte Datei bleibt — die
// Alternative wäre eine Kopie ohne die Zeile, und eine Kopie beweist nichts
// über das Original.
//
// Bewusst eng: NUR dieser eine Name wird abgefangen; alles andere geht den
// normalen Weg. Ein Haken, der mehr auflöst, als er soll, versteckt genau die
// Import-Fehler, die ein Test finden soll.
export async function resolve(spec, ctx, next) {
  if (spec === "server-only") return { url: "data:text/javascript,export{}", shortCircuit: true };
  return next(spec, ctx);
}
