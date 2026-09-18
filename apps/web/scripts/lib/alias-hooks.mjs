// dach-018 · `@/…` fuer `node --test` aufloesen.
//
// apps/web faehrt seine Tests unter plain `node --test`, ohne Bundler — deshalb
// sind lib/grade-scope.ts, lib/le-werkzeuge.ts und ihre Nachbarn bewusst frei
// von `@/…`-Pfad-Aliassen. Die ROUTEN sind es nicht: sie sind Next-Dateien und
// benutzen den Alias wie jede andere Route im Repo.
//
// Damit eine Route trotzdem geprueft werden kann, loest dieser Haken `@/x` auf
// `apps/web/x` auf — genau das, was tsconfig.json fuer den Bundler tut. Nichts
// sonst: jeder andere Spezifizierer geht unveraendert an Node weiter.
import { pathToFileURL } from "node:url";
import path from "node:path";

const WEB = path.resolve(import.meta.dirname, "..", "..");

export function resolve(spezifizierer, kontext, weiter) {
  if (spezifizierer.startsWith("@/")) {
    const ziel = path.join(WEB, spezifizierer.slice(2));
    // Die Quelle liegt als .ts vor; Next haengt die Endung selbst an.
    const mitEndung = /\.[a-z]+$/.test(ziel) ? ziel : `${ziel}.ts`;
    return weiter(pathToFileURL(mitEndung).href, kontext);
  }
  return weiter(spezifizierer, kontext);
}
