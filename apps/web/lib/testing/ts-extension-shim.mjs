// L0d · WARUM ES DIESE ZWEITE DATEI GIBT (und nicht eine Zeile mehr im
// server-only-Haken nebenan).
//
// `lib/paint-art.ts` schreibt `import { stamped } from "./art-fingerprint";` —
// ohne Endung. TypeScript und Next loesen das auf, `node --test` nicht: es sucht
// eine Datei namens `art-fingerprint`, findet keine und stirbt mit
// ERR_MODULE_NOT_FOUND, bevor eine einzige Behauptung laeuft.
//
// Der Nachbar-Haken (`server-only-shim.mjs`) traegt in seinem Kopf das Gesetz
// „bewusst eng: NUR dieser eine Name". Das ist richtig und bleibt so — deshalb
// steht die zweite Regel hier und nicht dort.
//
// Diese hier kann keinen Import-Fehler verstecken, und das ist der ganze
// Entwurf: sie greift NUR, wenn (1) der Name relativ ist, (2) er keine Endung
// hat, (3) die Datei ohne Endung NICHT existiert und (4) dieselbe Datei mit
// `.ts` existiert. Fehlt beides, faellt der Aufruf durch auf Nodes eigenen
// Fehler — mit Nodes eigener Meldung. Ein falsch geschriebener Pfad bleibt also
// ein falsch geschriebener Pfad.
import fs from "node:fs";

export async function resolve(spec, ctx, next) {
  if (spec.startsWith(".") && /\.[a-z]+$/i.test(spec) === false && ctx.parentURL !== undefined) {
    const ohne = new URL(spec, ctx.parentURL);
    const mit = new URL(`${spec}.ts`, ctx.parentURL);
    if (fs.existsSync(ohne) === false && fs.existsSync(mit) === true) return next(`${spec}.ts`, ctx);
  }
  return next(spec, ctx);
}
