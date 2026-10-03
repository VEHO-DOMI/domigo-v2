#!/usr/bin/env node
// dach-018 · DIE KLASSENWAND, MASCHINELL — SPEC konto V1.1-FINAL §5 L3, Nachtrag N-10.
//
// Die Regel lautet: jede Klassenabfrage in packages/db filtert ZUERST auf den
// Ausschnitt der Sitzung. Eine Regel ohne Tor rutscht bei der 27. Datei durch —
// genau dafuer steht dieses Blatt.
//
// Sieben Pruefungen; `herkunft` ist die, ohne die die anderen Deko sind, `liste`
// die, ohne die ein GANZ gestrichener Ausschnitt unsichtbar bliebe, und
// `aufrufer` die, ohne die eine Ausnahme ihren Grund still verlieren koennte:
//
//   pflicht   · jede Funktion mit einer Klassen-Bedingung nimmt `classScope:
//               ClassScope` als zweiten Parameter (direkt hinter `db`), ohne
//               Vorgabewert. Ein Vorgabewert waere »alles«, und »alles« ist die
//               Luecke, die diese Karte schliesst.
//   zuerst    · der Ausschnitt steht als ERSTES Glied im `and(…)` der Abfrage,
//               und NIE in der verneinten Form. Gemessen an drizzle-orm 0.45.2:
//               `inArray(spalte, [])` ergibt `false` (leerer Ausschnitt ⇒ kein
//               Ergebnis), `notInArray(spalte, [])` dagegen `true` — die
//               verneinte Form kehrt die Wand um, statt sie zu schliessen.
//   wache     · jeder Schreibweg mit Ausschnitt ruft `assertWritableScope`.
//               Ein leerer Ausschnitt macht aus einem UPDATE ein `where false`:
//               null Zeilen geaendert, Erfolg gemeldet. (dach-100: als Anweisung
//               auf oberster Ebene vor dem ersten Schreiben, nicht als Text.)
//   parameter · dach-100 · `db` baut nur Abfragen (select/insert/update/delete)
//               oder geht als Argument weiter; `classScope` wird nie ueber-
//               schrieben, mutiert oder umgewandelt. Sonst sieht keine Pruefung
//               mehr, was gefragt wird.
//   herkunft  · `classScope(` wird in apps/web NUR in lib/identity.ts gerufen.
//               Der Typ kann nicht beweisen, woher seine Kennungen kommen:
//               `classScope([params.id])` uebersetzt sich tadellos und ist
//               genau das Loch. Was bleibt, ist EINE Baustelle — und diese
//               Pruefung ist es, die sie zu einer macht. (dach-100: auch im
//               Syntaxbaum — kein Import des Konstruktors, keine Umwandlung
//               `as ClassScope` ausserhalb von lib/identity.ts und scope.ts.)
//   liste     · dach-063 · die Positiv-Liste claim-filter-required.json nennt
//               jede Funktion, die heute auf den Ausschnitt filtert, mit der
//               Zahl ihrer Filterstellen. Die Pruefungen oben sehen nur, was
//               NOCH eine Klassen-Bedingung traegt: wer den Ausschnitt ganz
//               streicht (GG-Review 18.09., assignment-service.ts#
//               getAssignmentWithSections), hinterlaesst eine Funktion, die
//               keine von ihnen mehr beruehrt. Jetzt fehlt dort eine
//               Filterstelle, und das ist rot.
//   aufrufer  · dach-100 · eine Ausnahme ohne Ausschnitt ist nur so gut wie die
//               Herkunft ihrer Kennung: »liest nur die eigene Zeile« stimmt, solange
//               jeder Aufrufer session.user.id uebergibt — und keiner `params.id`.
//               claim-filter-aufrufer.json haelt je Ausnahme dieser Art JEDEN
//               Aufruf fest (Datei · Ausdruck der Kennung); ein neuer Aufruf, ein
//               anderer Ausdruck oder ein Weiterreichen als Wert ist rot, bis ein
//               Mensch die Herkunft gelesen und eingetragen hat. Eine Funktion ohne
//               Aufrufer (»TOT«) muss ohne bleiben.
//
// dach-100 · DER SYNTAXBAUM STATT DES TEXTES. Bis hierher zaehlte `liste` Text: ein
// Regex auf `inArray(…, [...classScope])`. Zwei Umgehungen blieben gruen (Befund des
// blinden Lesers von dach-063): (a) der Filter wandert in eine Variable, und die
// Variable steht in `or(…)` oder `not(…)`; (b) eine tote Zusatzabfrage traegt den
// Filter, waehrend die echte ihn verloren hat. Jetzt zaehlt eine Filterstelle nur,
// wenn sie im TypeScript-Syntaxbaum die Abfrage wirklich einschraenkt:
//   · `inArray(spalte, classScope | [...classScope])` erreicht `.where(…)` bzw. die
//     Bedingung eines `.innerJoin(…)` NUR ueber `and(…)` — jedes andere Glied
//     dazwischen (or, not, sql, Ternaer, Array, ein fremder Aufruf) hebt sie auf.
//     `and`/`inArray` muessen die Importe aus drizzle-orm sein (`const and = or`
//     zaehlt nicht), `classScope` der zweite Parameter der Funktion selbst.
//   · Laeuft sie ueber eine `const`, zaehlt sie nur, wenn JEDE Verwendung der
//     Konstanten wirksam ist (transitiv); `let`/`var` zaehlen nie.
//   · Die Abfrage muss LEBEN: zurueckgegeben, an eine Bindung gebunden, die gelesen
//     wird, oder als `await`-ter Schreibweg eine eigene Anweisung. Ein select, dessen
//     Ergebnis verworfen wird, ist tot (drizzle baut faul: ein nicht abgewartetes
//     update laeuft gar nicht).
//   · `inScope(classScope, …)` zaehlt nur als `if (!inScope(…)) throw/return` auf
//     oberster Ebene der Funktion, VOR dem ersten Schreiben.
//   · `fn(db, classScope, …)` zaehlt nur, wenn `fn` selbst in der Positiv-Liste steht
//     und ihr Ergebnis verbraucht wird (oder sie ein abgewarteter Schreibweg ist).
// Kommentare gibt es im Syntaxbaum nicht; die verbleibenden Text-Pruefungen (pflicht,
// wache, Tabellen) lesen eine Fassung ohne Kommentare, Zeichen fuer Zeichen gleich lang.
//
//   · Ein spaeteres `.where` oder eine `union` an derselben Abfrage hebt den Filter
//     auf; ein Wert, der nur verworfen gelesen wird (`x;`, `x.length;`, `[x];`,
//     `console.log(x)`), gilt nicht als benutzt; eine `let`-Bindung mit Neuzuweisung
//     zaehlt nie.
//
// GRENZEN, ehrlich (blinder Leser dach-100, zwei Runden): das Tor beweist, dass die
// gefilterte Abfrage BENUTZT wird, nicht, dass sie die Antwort entscheidet — `return
// roh ?? gefiltert` und `if (!gefiltert) return; return roh` sind gruen (ein `if` ist
// das Muster jeder Besitz-Pruefung und muss zaehlen). Konstante Zweige (`if (false)`)
// werden nicht ausgewertet. Die Spalte im `inArray` wird nicht geprueft (eine falsche
// Spalte schliesst eher zu als auf), ebensowenig, welchen Wert `inScope` prueft. Filter
// in Rueckruf-Funktionen (`v2Safe(() => …)`) zaehlen nicht. `aufrufer` vergleicht den
// TEXT des Ausdrucks: `acting.userId` bleibt gruen, wenn jemand `acting` in derselben
// Datei aus der URL baut. Gelesen werden packages/db/src und apps/web; ein drittes
// Paket, das @domigo/db ruft, saehe dieses Tor nicht.
// Und grundsaetzlich: ein statisches Tor haelt Versehen auf, keinen Entwickler, der
// es absichtlich taeuscht. Was der blinde Leser von dach-100 in Runde 2 noch gruen
// bekam, ist bewusst NICHT geschlossen, weil jede Schliessung echten Code rot machte
// oder die Tarnung nur eine Stufe weiter schob: Umwandlungen ohne den Namen
// ClassScope (`as never`, `as any`, `// @ts-expect-error`, `JSON.parse`, Typ-Alias),
// eine zusaetzliche ungefilterte Abfrage NEBEN der gefilterten in einer Pflicht-
// Funktion (gemessen: die Regel »jede Klassen-Abfrage traegt selbst den Filter«
// machte 14 korrekte Abfragen rot — Joins, v1-Rueckfaelle), Tabellen ueber lokale
// Konstanten/Namensraum/Ternaer/Parameter, unerreichbarer Code nach `return`,
// Aliase von `classScope` oder einer gespeicherten Abfrage (`const q2 = q`),
// `Object.assign`/`Reflect`/`eval`, Getter und Konstruktoren, Tabellen ohne
// classId, Dateien ausserhalb packages/db/src, die Rümpfe von scope.ts selbst.
// Dafuer gibt es claim-filter-laufzeit.test.ts und den Review.
//
// Was nicht filtern KANN, steht in claim-filter-allowlist.json, je mit einem
// Satz. Und die Liste rostet nicht: ein Eintrag, dessen Funktion inzwischen
// einen Ausschnitt nimmt oder die es nicht mehr gibt, macht dieses Tor rot.
//
// Der Selbsttest verbiegt je eine Kopie IM SPEICHER und verlangt, dass die
// zustaendige Pruefung rot wird (Muster check-roster-twins.mjs); Gegenproben
// verlangen, dass ALLE gruen bleiben. Ein rotes Licht, das auch ohne
// Manipulation brennt, beweist nichts.
//
// Lauf: node scripts/check-claim-filter.mjs            (exit 1 bei jedem Verstoss)
//       node scripts/check-claim-filter.mjs --selftest (beweist die roten Lichter)

import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";

const R = process.cwd();
const selftest = process.argv.includes("--selftest");
const DB_SRC = "packages/db/src";
const ALLOWLIST = "scripts/claim-filter-allowlist.json";
const WEB = "apps/web";
const SCOPE_HEIMAT = "apps/web/lib/identity.ts";
const SATZ_MIN = 40;
const REQUIRED = "scripts/claim-filter-required.json";
const AUFRUFER = "scripts/claim-filter-aufrufer.json";

// Der Uebersetzer kommt aus packages/db (devDependency); die Wurzel hat keinen. In CI
// laeuft `pnpm install` vorher (Job content-validate). Ohne ihn gibt es kein Tor.
let ts;
try {
  ts = createRequire(path.join(R, "packages/db/package.json"))("typescript");
} catch {
  console.error("✗ check-claim-filter: typescript fehlt (devDependency von packages/db) — erst pnpm install");
  process.exit(1);
}

/** Die Tabellen mit einer Klassen-Spalte (plus die Klassen-Tabellen selbst) — aus dem Schema gelesen, nicht getippt. */
function klassenTabellen(state) {
  const raus = new Set();
  for (const [, roh] of state.db) {
    const src = ohneKommentare(roh);
    const re = /^export const ([A-Za-z0-9_]+) = (?:v2\.table|pgTable)\(/gm;
    const starts = [];
    let m;
    while ((m = re.exec(src))) starts.push([m[1], m.index]);
    starts.forEach(([name, ab], i) => {
      const block = src.slice(ab, i + 1 < starts.length ? starts[i + 1][1] : src.length);
      if (/\bclassId\s*:/.test(block) || /Classes$/.test(name)) raus.add(name);
    });
  }
  return raus;
}
const TABELLEN_METHODEN = new Set(["from", "update", "insert", "delete", "innerJoin", "leftJoin", "rightJoin", "fullJoin", "crossJoin"]);
/**
 * Fasst die Funktion eine Klassen-Tabelle an? dach-100: ueber das Symbol, nicht den
 * Text — `import { assignments as a2 }` und `.from(a2)` ist dieselbe Tabelle.
 */
function beruehrtKlassenTabelle(f, tabellen) {
  if (tabellen.size === 0) return false;
  let ja = false;
  (function lauf(x) {
    if (ja) return;
    if (ts.isCallExpression(x) && ts.isPropertyAccessExpression(x.expression) && TABELLEN_METHODEN.has(x.expression.name.text) && x.arguments[0] && ts.isIdentifier(x.arguments[0])) {
      const id = x.arguments[0];
      const d = decl(f.a.c, id);
      if (tabellen.has(d && ts.isImportSpecifier(d) ? (d.propertyName ?? d.name).text : id.text)) ja = true;
    }
    ts.forEachChild(x, lauf);
  })(f.node.body);
  return ja;
}

// Eine Bedingung auf einer Klassen-Spalte. Absichtlich STRUKTURELL (ein Praedikat
// auf einer Spalte), nicht textuell: eine Pruefung auf »erwaehnt v2Classes« fuellt
// die Ausnahme-Liste mit Lehrer-Funktionen, und eine Liste, die niemand liest,
// ist keine Kontrolle mehr.
const KLASSEN_PRAEDIKAT =
  /\b(?:eq|ne|inArray|notInArray)\(\s*(?:[A-Za-z0-9_]+\.classId|v2Classes\.(?:id|inviteCode|teacherId)|v1Classes\.(?:id|inviteCode)|v2IdentityUsers\.classId)/;
// Roh-SQL, das eine Klasse nennt (writing-review gehoertZuLehrkraft).
const KLASSEN_ROHSQL = /sql`[^`]*\$\{v2Classes\.id\}/;

const lies = (rel) => fs.readFileSync(path.join(R, rel), "utf8");

/**
 * Kommentare weg, Zeichenketten bleiben (KLASSEN_ROHSQL liest in sql`…`). dach-063,
 * blinder Leser: `// alter Filter: inArray(x.classId, [...classScope])` zaehlte als
 * Filterstelle, nachdem der echte Filter geloescht war. dach-100: jedes Kommentar-
 * zeichen wird ein Leerzeichen, die Fassung ist also Zeichen fuer Zeichen so lang wie
 * die Quelle — damit liegen die Positionen des Syntaxbaums auf ihr.
 */
const OHNE = new Map();
function ohneKommentare(src) {
  const gemerkt = OHNE.get(src);
  if (gemerkt !== undefined) return gemerkt;
  let raus = "";
  let str = null;
  for (let i = 0; i < src.length; i++) {
    const c = src[i];
    if (str) {
      raus += c;
      if (c === "\\") { raus += src[++i] ?? ""; continue; }
      if (c === str) str = null;
      continue;
    }
    if (c === "/" && src[i + 1] === "/") {
      while (i < src.length && src[i] !== "\n") { raus += " "; i++; }
      if (i < src.length) raus += "\n";
      continue;
    }
    if (c === "/" && src[i + 1] === "*") {
      const ende = src.indexOf("*/", i + 2);
      const stueck = src.slice(i, ende < 0 ? src.length : ende + 2);
      raus += stueck.replace(/[^\n]/g, " ");
      i += stueck.length - 1;
      continue;
    }
    if (c === "'" || c === '"' || c === "`") str = c;
    raus += c;
  }
  OHNE.set(src, raus);
  return raus;
}

// dach-100, blinder Leser: eine Datei in einem Unterordner oder mit der Endung .mts
// war fuer das Tor nicht da. Jetzt: rekursiv, jede Quell-Endung, ohne Tests.
const QUELLE = /\.(?:ts|mts|cts|tsx|js|mjs|cjs|jsx)$/;
const TEST = /\.(?:test|spec)\.[a-z]+$/;
function dbDateien(dir = DB_SRC, out = []) {
  for (const e of fs.readdirSync(path.join(R, dir), { withFileTypes: true })) {
    if (e.name === "node_modules") continue;
    const rel = `${dir}/${e.name}`;
    if (e.isDirectory()) dbDateien(rel, out);
    else if (QUELLE.test(e.name) && !TEST.test(e.name) && !e.name.endsWith(".d.ts")) out.push(rel);
  }
  return out;
}
/** `datei.ts` bzw. `unter/datei.ts` — der Name einer Datei in packages/db/src, wie die Listen ihn schreiben. */
const dbName = (rel) => path.posix.relative(DB_SRC, rel);

function webDateien(dir = WEB, out = []) {
  for (const e of fs.readdirSync(path.join(R, dir), { withFileTypes: true })) {
    if (e.name === "node_modules" || e.name === ".next") continue;
    const rel = `${dir}/${e.name}`;
    if (e.isDirectory()) webDateien(rel, out);
    else if (QUELLE.test(e.name) && !e.name.endsWith(".d.ts")) out.push(rel);
  }
  return out;
}
/** Ein geparster Baum je Quelltext, gemerkt — der Selbsttest liest apps/web sonst 60-mal. */
const BAEUME = new Map();
function baum(rel, src) {
  const k = `${rel}\0${src}`;
  let sf = BAEUME.get(k);
  if (!sf) { sf = ts.createSourceFile(rel, src, ts.ScriptTarget.ES2022, true, skriptArt(rel)); BAEUME.set(k, sf); }
  return sf;
}
const skriptArt = (rel) => (/\.(?:tsx|jsx)$/.test(rel) ? ts.ScriptKind.TSX : /\.(?:m|c)?js$/.test(rel) ? ts.ScriptKind.JS : ts.ScriptKind.TS);

// ── Der Syntaxbaum ──────────────────────────────────────────────────────────

/**
 * Eine Datei, geparst und mit einem Pruefer fuer Namen versehen. Ein Programm aus
 * genau dieser Datei (ohne Aufloesung, ohne lib) genuegt: gebraucht wird nur, worauf
 * ein Name zeigt — Parameter, Import, lokale Konstante —, und das ist lexikalisch.
 * Gemerkt je Quelltext, damit der Selbsttest nur die eine verbogene Datei neu liest.
 */
const ANALYSEN = new Map();
function analyse(rel, src) {
  const schluessel = `${rel}\0${src}`;
  const gemerkt = ANALYSEN.get(schluessel);
  if (gemerkt) return gemerkt;
  const sf = ts.createSourceFile(rel, src, ts.ScriptTarget.ES2022, true, skriptArt(rel));
  const host = {
    getSourceFile: (n) => (n === rel ? sf : undefined),
    getDefaultLibFileName: () => "lib.d.ts",
    writeFile: () => {},
    getCurrentDirectory: () => R,
    getDirectories: () => [],
    fileExists: (n) => n === rel,
    readFile: (n) => (n === rel ? src : undefined),
    getCanonicalFileName: (n) => n,
    useCaseSensitiveFileNames: () => true,
    getNewLine: () => "\n",
  };
  const c = ts.createProgram({ rootNames: [rel], options: { noResolve: true, noLib: true, types: [], noEmit: true }, host }).getTypeChecker();
  const ohne = ohneKommentare(src);
  // Jede Funktion, die in keiner anderen steckt: `function f`, `const f = (…) => …`,
  // `export const f = wrap(async (…) => …)`, `export const api = { f: … }`, Methoden
  // einer Klasse, `export default …`. dach-100, blinder Leser: alles ausser
  // `function f` war unsichtbar, ebenso `async function f …; export { f }`.
  const exportNamen = new Set();
  for (const st of sf.statements) {
    if (ts.isExportDeclaration(st) && !st.moduleSpecifier && st.exportClause && ts.isNamedExports(st.exportClause)) {
      for (const e of st.exportClause.elements) exportNamen.add((e.propertyName ?? e.name).text);
    }
    if (ts.isExportAssignment(st) && ts.isIdentifier(st.expression)) exportNamen.add(st.expression.text);
  }
  const oben = (n) => { let x = n; while (x.parent && x.parent !== sf) x = x.parent; return x; };
  const mitExport = (st) => !!(ts.canHaveModifiers(st) && ts.getModifiers(st)?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword || m.kind === ts.SyntaxKind.DefaultKeyword)) || ts.isExportAssignment(st);
  const nameVon = (fn) => {
    const teile = [];
    if ((ts.isFunctionDeclaration(fn) || ts.isFunctionExpression(fn) || ts.isMethodDeclaration(fn)) && fn.name) teile.unshift(fn.name.getText(sf));
    for (let p = fn.parent; p && p !== sf; p = p.parent) {
      if (ts.isPropertyAssignment(p) || ts.isMethodDeclaration(p)) teile.unshift(p.name.getText(sf));
      else if (ts.isVariableDeclaration(p) && ts.isIdentifier(p.name)) teile.unshift(p.name.text);
      else if (ts.isClassDeclaration(p) || ts.isClassExpression(p)) teile.unshift(p.name?.text ?? "default");
      else if (ts.isExportAssignment(p)) teile.unshift("default");
    }
    if (ts.isFunctionDeclaration(fn) && !fn.name) teile.unshift("default");
    return teile.join(".") || "default";
  };
  const funcs = [];
  (function lauf(x) {
    if ((ts.isFunctionDeclaration(x) || ts.isFunctionExpression(x) || ts.isArrowFunction(x) || ts.isMethodDeclaration(x)) && x.body && !umschliessendeFunktion(x)) {
      const name = nameVon(x);
      const st = oben(x);
      funcs.push({
        name,
        exportiert: mitExport(st) || exportNamen.has(name.split(".")[0]),
        node: x,
        koerper: ohne.slice(x.body.getStart(sf), x.body.end),
      });
      return;
    }
    ts.forEachChild(x, lauf);
  })(sf);
  const a = { rel, sf, c, funcs };
  for (const f of funcs) f.a = a;
  ANALYSEN.set(schluessel, a);
  return a;
}

/** Alle Funktionen des Zustands, je unter `datei.ts#name`. Einmal je Zustand. */
const KONTEXTE = new WeakMap();
function kontext(state) {
  let k = KONTEXTE.get(state);
  if (k) return k;
  const idx = new Map();
  for (const [rel, src] of state.db) {
    const a = analyse(rel, src);
    for (const f of a.funcs) idx.set(`${dbName(rel)}#${f.name}`, { a, f });
  }
  const pflicht = JSON.parse(state.files.get(REQUIRED)).pflicht;
  k = { idx, pflicht };
  KONTEXTE.set(state, k);
  return k;
}

const decl = (c, id) => c.getSymbolAtLocation(id)?.declarations?.[0];
/** Ist `id` der Import `name` aus `modul` (auch unter anderem Namen importiert)? */
function importiert(c, id, modul, name) {
  const d = decl(c, id);
  return !!d && ts.isImportSpecifier(d) && d.parent.parent.parent.moduleSpecifier.text === modul && (d.propertyName ?? d.name).text === name;
}
const drizzle = (a, call, name) =>
  ts.isCallExpression(call) && ts.isIdentifier(call.expression) && importiert(a.c, call.expression, "drizzle-orm", name);
/**
 * Fuer `zuerst` (das ROT finden will) gilt auch ein Name, der auf nichts zeigt: ein
 * `notInArray` ohne Import uebersetzt sich nicht, und ein Tor, das ihn deshalb
 * uebersieht, waere an der falschen Stelle grosszuegig.
 */
const dieserName = (a, id, name) => ts.isIdentifier(id) && id.text === name && (importiert(a.c, id, "drizzle-orm", name) || !decl(a.c, id));
const drizzleOderFrei = (a, call, name) => ts.isCallExpression(call) && dieserName(a, call.expression, name);
/** Zeigt `id` auf den i-ten Parameter von `fn`? Der zweite muss `classScope` heissen. */
const istParam = (c, id, fn, i) =>
  !!id && ts.isIdentifier(id) && !!fn.parameters[i] && decl(c, id) === fn.parameters[i] && (i !== 1 || (ts.isIdentifier(fn.parameters[1].name) && fn.parameters[1].name.text === "classScope"));
/** `classScope` oder `[...classScope]` — der eigene Ausschnitt der Funktion, nichts anderes. */
function istAusschnitt(c, e, fn) {
  if (istParam(c, e, fn, 1)) return true;
  return ts.isArrayLiteralExpression(e) && e.elements.length === 1 && ts.isSpreadElement(e.elements[0]) && istParam(c, e.elements[0].expression, fn, 1);
}
function umschliessendeFunktion(n) {
  let p = n.parent;
  while (p && !ts.isFunctionLike(p)) p = p.parent;
  return p;
}
/** Jede Verwendung des Namens im Koerper von `fn` (ueber das Symbol, nicht den Text). */
function referenzen(c, nameId, fn) {
  const s = c.getSymbolAtLocation(nameId);
  const raus = [];
  (function lauf(x) {
    if (ts.isIdentifier(x) && x !== nameId) {
      const t = ts.isShorthandPropertyAssignment(x.parent) && x.parent.name === x ? c.getShorthandAssignmentValueSymbol(x.parent) : c.getSymbolAtLocation(x);
      if (t === s) raus.push(x);
    }
    ts.forEachChild(x, lauf);
  })(fn.body);
  return raus;
}
const istZuweisung = (r) =>
  (ts.isBinaryExpression(r.parent) && r.parent.left === r && r.parent.operatorToken.kind >= ts.SyntaxKind.FirstAssignment && r.parent.operatorToken.kind <= ts.SyntaxKind.LastAssignment) ||
  ((ts.isPrefixUnaryExpression(r.parent) || ts.isPostfixUnaryExpression(r.parent)) && (r.parent.operator === ts.SyntaxKind.PlusPlusToken || r.parent.operator === ts.SyntaxKind.MinusMinusToken));
/**
 * Wird der Wert an dieser Stelle verworfen? `x;`, `x.length;`, `[x];`, `void x`,
 * `console.log(x)` — gelesen, aber ohne Folge. dach-100, blinder Leser: genau so lief
 * eine gefilterte Abfrage als Attrappe neben der ungefilterten, die zurueckging.
 */
function verworfen(r) {
  for (let n = r; ;) {
    const p = n.parent;
    if (
      ts.isParenthesizedExpression(p) || ts.isNonNullExpression(p) || ts.isAsExpression(p) || ts.isArrayLiteralExpression(p) || ts.isSpreadElement(p) ||
      ts.isAwaitExpression(p) || ts.isTypeOfExpression(p) ||
      ((ts.isPropertyAccessExpression(p) || ts.isElementAccessExpression(p)) && p.expression === n) ||
      (ts.isCallExpression(p) && p.expression === n)
    ) { n = p; continue; }
    if (ts.isExpressionStatement(p) || ts.isVoidExpression(p)) return true;
    if (ts.isCallExpression(p) && p.arguments.includes(n) && ts.isPropertyAccessExpression(p.expression) && ts.isIdentifier(p.expression.expression) && p.expression.expression.text === "console") return true;
    return false;
  }
}
/** Verwendungen, die den Wert LESEN und benutzen (nicht `x = …`, nicht verworfen). */
function gelesen(c, nameId, fn) {
  return referenzen(c, nameId, fn).filter((r) => !istZuweisung(r) && !verworfen(r));
}
// Ein spaeteres `.where` ERSETZT ein frueheres (drizzle, mit toSQL() gemessen); eine
// Mengen-Verknuepfung haengt eine zweite, ungefilterte Abfrage an.
const UEBERSCHREIBT = new Set(["where", "union", "unionAll", "intersect", "intersectAll", "except", "exceptAll"]);
const MENGE = new Set([...UEBERSCHREIBT].filter((m) => m !== "where"));
const wirdUeberschrieben = (r) => ts.isPropertyAccessExpression(r.parent) && r.parent.expression === r && UEBERSCHREIBT.has(r.parent.name.text);
function gebundeneNamen(b) {
  if (ts.isIdentifier(b)) return [b];
  const raus = [];
  for (const e of b.elements) if (!ts.isOmittedExpression(e)) raus.push(...gebundeneNamen(e.name));
  return raus;
}

/**
 * Wird der Wert des Ausdrucks verbraucht? Zurueckgegeben, an eine gelesene Bindung
 * gebunden (auch `let x; … x = await …`), oder — nur fuer Schreibwege — abgewartet
 * als eigene Anweisung. Alles andere (nackte Anweisung, ungelesene Konstante, `void`,
 * Promise.all ohne Bindung) ist tot.
 */
function verbraucht(a, e, fn, schreib) {
  let n = e;
  let abgewartet = false;
  for (;;) {
    const p = n.parent;
    if (ts.isParenthesizedExpression(p) || ts.isNonNullExpression(p) || ts.isAsExpression(p)) { n = p; continue; }
    if (ts.isAwaitExpression(p)) { abgewartet = true; n = p; continue; }
    if (ts.isElementAccessExpression(p) && p.expression === n) { n = p; continue; }
    if (ts.isPropertyAccessExpression(p) && p.expression === n && !(ts.isCallExpression(p.parent) && p.parent.expression === p)) { n = p; continue; }
    break;
  }
  const p = n.parent;
  if (ts.isReturnStatement(p)) return true;
  if (ts.isVariableDeclaration(p) && p.initializer === n) {
    const namen = gebundeneNamen(p.name);
    const refs = namen.flatMap((id) => referenzen(a.c, id, fn));
    // `let q = gefiltert; q = roh;` — eine neu zugewiesene Bindung zaehlt nie.
    if (!(p.parent.flags & ts.NodeFlags.Const) && refs.some(istZuweisung)) return false;
    if (refs.some(wirdUeberschrieben)) return false;
    return namen.some((id) => gelesen(a.c, id, fn).length > 0);
  }
  if (ts.isBinaryExpression(p) && p.right === n && p.operatorToken.kind === ts.SyntaxKind.EqualsToken && ts.isIdentifier(p.left)) {
    // `let x; … x = await …` (gradeSubmission): nur die EINE Zuweisung, ohne Startwert.
    const d = decl(a.c, p.left);
    if (!d || !ts.isVariableDeclaration(d) || d.initializer || umschliessendeFunktion(d) !== fn) return false;
    const refs = referenzen(a.c, d.name, fn);
    if (refs.filter(istZuweisung).length !== 1 || refs.some(wirdUeberschrieben)) return false;
    return gelesen(a.c, d.name, fn).length > 0;
  }
  if (ts.isExpressionStatement(p)) return abgewartet && schreib;
  return false;
}

const LESEN = new Set(["select", "selectDistinct"]);
const BAUEN = new Set([...LESEN, "insert", "update", "delete"]);
/** Die Abfrage, an deren `.where`/`.innerJoin` der Filter haengt: auf `db` gebaut, in `fn` selbst, und lebendig. */
function lebendigeAbfrage(a, call, fn) {
  let e = call.expression;
  let methode = null;
  while (ts.isPropertyAccessExpression(e) || ts.isCallExpression(e)) {
    if (ts.isPropertyAccessExpression(e) && ts.isIdentifier(e.expression)) methode = e.name.text;
    e = e.expression;
  }
  if (!istParam(a.c, e, fn, 0) || !BAUEN.has(methode) || umschliessendeFunktion(call) !== fn) return false;
  let oben = call;
  const danach = [];
  while (ts.isPropertyAccessExpression(oben.parent) && oben.parent.expression === oben && ts.isCallExpression(oben.parent.parent) && oben.parent.parent.expression === oben.parent) {
    danach.push(oben.parent.name.text);
    oben = oben.parent.parent;
  }
  const istWhere = ts.isPropertyAccessExpression(call.expression) && call.expression.name.text === "where";
  if (danach.some((m) => (istWhere ? UEBERSCHREIBT : MENGE).has(m))) return false;
  return verbraucht(a, oben, fn, !LESEN.has(methode));
}

const istMethode = (p, name) => ts.isCallExpression(p) && ts.isPropertyAccessExpression(p.expression) && p.expression.name.text === name;

/** Schraenkt dieser Filter die Abfrage wirklich ein? Nur ueber `and(…)` bis `.where`, oder ueber eine `const`, deren JEDE Verwendung es tut. */
function wirksam(a, node, fn, gesehen = new Set()) {
  for (let n = node; ;) {
    const p = n.parent;
    if (ts.isParenthesizedExpression(p)) { n = p; continue; }
    if (drizzle(a, p, "and") && p.arguments.includes(n)) { n = p; continue; }
    if (istMethode(p, "where") && p.arguments[0] === n) return lebendigeAbfrage(a, p, fn);
    if (istMethode(p, "innerJoin") && p.arguments[1] === n) return lebendigeAbfrage(a, p, fn);
    if (ts.isVariableDeclaration(p) && p.initializer === n && ts.isIdentifier(p.name) && p.parent.flags & ts.NodeFlags.Const && !gesehen.has(p)) {
      gesehen.add(p);
      const refs = referenzen(a.c, p.name, fn);
      return refs.length > 0 && refs.every((r) => wirksam(a, r, fn, gesehen));
    }
    return false;
  }
}

const verlaesst = (s) => ts.isThrowStatement(s) || ts.isReturnStatement(s) || (ts.isBlock(s) && s.statements.some((x) => ts.isThrowStatement(x) || ts.isReturnStatement(x)));
const SCHREIBT = /\bdb\s*\.\s*(?:insert|update|delete)\s*\(/;
/** `if (!inScope(classScope, …)) { throw | return }` auf oberster Ebene, vor dem ersten Schreiben. */
function wache(a, call, fn) {
  let n = call;
  while (ts.isParenthesizedExpression(n.parent)) n = n.parent;
  const u = n.parent;
  if (!(ts.isPrefixUnaryExpression(u) && u.operator === ts.SyntaxKind.ExclamationToken)) return false;
  let m = u;
  while (ts.isParenthesizedExpression(m.parent)) m = m.parent;
  const wenn = m.parent;
  if (!(ts.isIfStatement(wenn) && wenn.expression === m && wenn.parent === fn.body && verlaesst(wenn.thenStatement))) return false;
  const vorher = fn.body.statements.slice(0, fn.body.statements.indexOf(wenn));
  return !vorher.some((s) => SCHREIBT.test(ohneKommentare(s.getText(a.sf))));
}

/** Die gerufene Funktion des Pakets, lokal oder per `./datei.ts` importiert. */
function gerufene(k, a, id) {
  const d = decl(a.c, id);
  if (!d) return null;
  if (ts.isFunctionDeclaration(d) && d.name) return `${dbName(a.rel)}#${d.name.text}`;
  if (ts.isImportSpecifier(d)) {
    const modul = d.parent.parent.parent.moduleSpecifier.text;
    if (!modul.startsWith(".")) return null;
    return `${dbName(path.posix.join(path.posix.dirname(a.rel), modul))}#${(d.propertyName ?? d.name).text}`;
  }
  return null;
}
const istSchreibweg = (f) =>
  ts.isBlock(f.node.body) &&
  f.node.body.statements.some((s) => ts.isExpressionStatement(s) && ts.isCallExpression(s.expression) && ts.isIdentifier(s.expression.expression) && s.expression.expression.text === "assertWritableScope");

/**
 * Die wirksamen Filterstellen einer Funktion. Eine Filterstelle: der Ausschnitt
 * schraenkt eine lebendige Abfrage ein (`inArray`), eine Einfuegung prueft ihre
 * Klasse (`inScope` als Wache), oder die Funktion reicht ihn an eine gelistete
 * weiter und verbraucht deren Antwort. Blosses Durchreichen an assertWritableScope
 * zaehlt NICHT — die Wache verweigert einen leeren Ausschnitt, sie filtert nicht.
 */
function filterstellen(k, a, f) {
  const fn = f.node;
  let n = 0;
  (function lauf(x) {
    if (ts.isCallExpression(x) && ts.isIdentifier(x.expression)) {
      const id = x.expression;
      if (importiert(a.c, id, "drizzle-orm", "inArray") && x.arguments.length === 2 && istAusschnitt(a.c, x.arguments[1], fn)) {
        if (wirksam(a, x, fn)) n++;
      } else if (importiert(a.c, id, "./scope.ts", "inScope") && istParam(a.c, x.arguments[0], fn, 1)) {
        if (wache(a, x, fn)) n++;
      } else if (x.arguments.length >= 2 && istParam(a.c, x.arguments[0], fn, 0) && istParam(a.c, x.arguments[1], fn, 1) && umschliessendeFunktion(x) === fn) {
        const ziel = gerufene(k, a, id);
        if (ziel && ziel in k.pflicht && k.idx.has(ziel) && verbraucht(a, x, fn, istSchreibweg(k.idx.get(ziel).f))) n++;
      }
    }
    ts.forEachChild(x, lauf);
  })(fn.body);
  return n;
}

/** Nimmt die Funktion einen Ausschnitt — als Parameter oder als Name im Koerper? */
function nimmtAusschnitt(f) {
  if (f.node.parameters.some((p) => ts.isIdentifier(p.name) && p.name.text === "classScope")) return true;
  let ja = false;
  (function lauf(x) {
    if (ja) return;
    if (ts.isIdentifier(x) && x.text === "classScope") ja = true;
    else ts.forEachChild(x, lauf);
  })(f.node.body);
  return ja;
}

/** Nimmt die Funktion `classScope: ClassScope` als ZWEITEN Parameter, ohne Vorgabe, nicht optional? */
function hatPflichtScope(f) {
  const p = f.node.parameters[1];
  return (
    !!p && ts.isIdentifier(p.name) && p.name.text === "classScope" && !p.initializer && !p.questionToken && !p.dotDotDotToken &&
    !!p.type && ts.isTypeReferenceNode(p.type) && ts.isIdentifier(p.type.typeName) && p.type.typeName.text === "ClassScope" && ausScope(f, p.type.typeName, "ClassScope")
  );
}
/** Kommt der Name als Import aus scope.ts? (Ein lokales `type ClassScope = string[]` ersetzt die Marke.) */
function ausScope(f, id, name) {
  const e = f.a ?? null;
  const c = e ? e.c : null;
  if (!c) return true;
  const d = decl(c, id);
  return !!d && ts.isImportSpecifier(d) && /(^|\/)scope\.ts$/.test(d.parent.parent.parent.moduleSpecifier.text) && (d.propertyName ?? d.name).text === name;
}

/** Steht der Ausschnitt als ERSTES Glied jedes `and(…)`, nie verneint — auch ueber Konstanten hinweg? */
function zuerstGefiltert(a, f) {
  const fn = f.node;
  const fehler = new Set();
  const hoch = (node, gesehen) => {
    for (let n = node; ;) {
      const p = n.parent;
      if (ts.isParenthesizedExpression(p)) { n = p; continue; }
      if (drizzleOderFrei(a, p, "not")) { fehler.add("der Ausschnitt steht unter not(…) — ein leerer Ausschnitt waere damit »alles«"); return; }
      if (drizzleOderFrei(a, p, "and") && p.arguments.includes(n)) {
        if (p.arguments[0] !== n) fehler.add("der Ausschnitt ist nicht das ERSTE Glied der Bedingung");
        n = p;
        continue;
      }
      if (ts.isVariableDeclaration(p) && p.initializer === n && ts.isIdentifier(p.name) && !gesehen.has(p)) {
        gesehen.add(p);
        for (const r of referenzen(a.c, p.name, fn)) hoch(r, gesehen);
      }
      return;
    }
  };
  (function lauf(x) {
    if (ts.isCallExpression(x) && ts.isIdentifier(x.expression) && x.arguments.length === 2 && istAusschnitt(a.c, x.arguments[1], fn)) {
      if (dieserName(a, x.expression, "notInArray")) fehler.add("der Ausschnitt steht in der VERNEINTEN Form — ein leerer Ausschnitt waere damit »alles«");
      else if (dieserName(a, x.expression, "inArray")) hoch(x, new Set());
    }
    ts.forEachChild(x, lauf);
  })(fn.body);
  return [...fehler];
}

function lade(state) {
  return JSON.parse(state.files.get(ALLOWLIST));
}

// ── Aufrufer: woher die Kennung einer Ausnahme kommt ───────────────────────

const normal = (s) => s.replace(/\s+/g, " ").trim();
/**
 * Jeder Aufruf der festgehaltenen Funktionen in apps/web und packages/db (ohne
 * Tests), als `datei · Ausdruck des zweiten Arguments` — das Argument hinter `db`
 * ist die Kennung. Ein Name, der nicht gerufen, sondern weitergereicht wird, heisst
 * `datei · WEITERGEREICHT`: dessen Herkunft kann niemand mehr lesen.
 */
function aufrufeVon(state, namen) {
  const raus = new Map([...namen.values()].map((s) => [s, []]));
  const quellen = [
    ...[...state.web].map(([rel, src]) => [rel, src, "web"]),
    ...[...state.db].map(([rel, src]) => [rel, src, "db"]),
  ];
  for (const [rel, src, art] of quellen) {
    // Kein Vorfilter auf den Rohtext: ein Name mit Unicode-Escape (`get\u0047ameSave`)
    // stuende nicht darin (dach-100, blinder Leser Runde 2).
    const sf = baum(rel, src);
    // Welcher lokale Name zeigt auf welche festgehaltene Funktion? In apps/web nur,
    // was aus @domigo/db kommt (auch umbenannt, auch als Namensraum); in packages/db
    // der eigene Name und jeder relative Import.
    const lokal = new Map();
    const raeume = new Set();
    if (art === "db") for (const [n, s] of namen) lokal.set(n, s);
    for (const st of sf.statements) {
      if (!ts.isImportDeclaration(st) || !st.importClause) continue;
      const modul = st.moduleSpecifier.text;
      // In apps/web: JEDES Modul — auch ein relativer Pfad nach packages/db/src.
      if (art === "db" && !modul.startsWith(".")) continue;
      const b = st.importClause.namedBindings;
      if (b && ts.isNamespaceImport(b)) raeume.add(b.name.text);
      if (b && ts.isNamedImports(b)) for (const e of b.elements) {
        const s = namen.get((e.propertyName ?? e.name).text);
        if (s) lokal.set(e.name.text, s);
      }
    }
    // In packages/db: aus welcher Funktion der obersten Ebene gerufen wird — ein Ruf
    // aus einer selbst TOTEN Funktion belebt nichts wieder.
    const von = (n) => {
      let x = n;
      while (x.parent && x.parent !== sf) x = x.parent;
      const name = ts.isFunctionDeclaration(x) && x.name ? x.name.text
        : ts.isVariableStatement(x) && ts.isIdentifier(x.declarationList.declarations[0]?.name) ? x.declarationList.declarations[0].name.text : "";
      return art === "db" && name ? `${dbName(rel)}#${name}` : null;
    };
    const notiere = (knoten, s) => {
      const p = knoten.parent;
      const ruf = ts.isCallExpression(p) && p.expression === knoten;
      // Die Kennung steht hinter `db` (zweites Argument); eine Funktion ohne `db` nimmt sie als erstes.
      const arg = ruf ? (p.arguments.length >= 2 ? p.arguments[1] : p.arguments[0]) : null;
      raus.get(s).push({ text: `${rel} · ${ruf ? (arg ? normal(arg.getText(sf)) : "—") : "WEITERGEREICHT"}`, von: von(knoten) });
    };
    (function lauf(x) {
      // In apps/web zaehlt JEDER Zugriff unter dem Namen: `ns.f`, `(await import(…)).f`,
      // `require(…).f`, `ns["f"]`, `const { f } = ns`, `export { f } from …`. Was kein
      // erkannter Aufruf ist, heisst WEITERGEREICHT und ist rot (dach-100, blinder Leser).
      if (art === "web" || (ts.isPropertyAccessExpression(x) && ts.isIdentifier(x.expression) && raeume.has(x.expression.text))) {
        if (ts.isPropertyAccessExpression(x) && namen.has(x.name.text)) {
          notiere(x, namen.get(x.name.text));
          ts.forEachChild(x.expression, lauf);
          return;
        }
      }
      if (art === "web") {
        if (ts.isElementAccessExpression(x) && ts.isStringLiteralLike(x.argumentExpression) && namen.has(x.argumentExpression.text)) {
          notiere(x, namen.get(x.argumentExpression.text));
          ts.forEachChild(x.expression, lauf);
          return;
        }
        if (ts.isBindingElement(x) && namen.has((x.propertyName ?? x.name).getText(sf))) {
          raus.get(namen.get((x.propertyName ?? x.name).getText(sf))).push({ text: `${rel} · WEITERGEREICHT`, von: null });
        }
        if (ts.isExportSpecifier(x) && namen.has((x.propertyName ?? x.name).text)) {
          raus.get(namen.get((x.propertyName ?? x.name).text)).push({ text: `${rel} · WEITERGEREICHT`, von: null });
        }
      }
      if (ts.isIdentifier(x) && lokal.has(x.text)) {
        const p = x.parent;
        const deklaration =
          ((ts.isFunctionDeclaration(p) || ts.isVariableDeclaration(p)) && p.name === x) ||
          ts.isImportSpecifier(p) || ts.isExportSpecifier(p) ||
          (ts.isPropertyAccessExpression(p) && p.name === x) ||
          (ts.isPropertyAssignment(p) && p.name === x);
        if (!deklaration) notiere(x, lokal.get(x.text));
      }
      ts.forEachChild(x, lauf);
    })(sf);
  }
  return raus;
}

const PRUEFUNGEN = {
  liste(state) {
    const raus = [];
    const soll = JSON.parse(state.files.get(REQUIRED));
    const pflicht = soll.pflicht;
    const bestand = new Set(soll.bestand.funktionen);
    const erlaubt = lade(state).ausnahmen;
    const tabellen = klassenTabellen(state);
    const k = kontext(state);
    for (const [schluessel, n] of Object.entries(pflicht)) {
      const e = k.idx.get(schluessel);
      if (!Number.isInteger(n) || n < 1) { raus.push(`${schluessel}: die Positiv-Liste sagt ${n} Filterstellen — mindestens 1; eine Funktion ohne Filter gehoert mit Satz in ${ALLOWLIST}`); continue; }
      if (!e) { raus.push(`${schluessel}: steht in der Positiv-Liste, die Funktion gibt es aber nicht mehr — Eintrag streichen`); continue; }
      const ist = filterstellen(k, e.a, e.f);
      if (ist < n) raus.push(`${schluessel}: hat ${n - ist} von ${n} Filterstellen auf den Klassen-Ausschnitt verloren — die Abfrage liest jetzt ueber die Klassenwand hinweg (oder der Filter steht in or/not, in einer toten Abfrage, in einer ungelesenen Variablen)`);
      else if (ist > n) raus.push(`${schluessel}: filtert jetzt an ${ist} Stellen, die Positiv-Liste sagt ${n} — Eintrag nachziehen`);
    }
    for (const [schluessel, { f }] of k.idx) {
      if (schluessel in pflicht || erlaubt[schluessel]) continue;
      if (nimmtAusschnitt(f)) {
        raus.push(`${schluessel}: nimmt einen Ausschnitt, steht aber nicht in ${REQUIRED} — mit der Zahl ihrer Filterstellen eintragen`);
      } else if (!bestand.has(schluessel) && beruehrtKlassenTabelle(f, tabellen)) {
        raus.push(`${schluessel}: liest oder schreibt eine Klassen-Tabelle ohne Ausschnitt und steht in keiner Liste — Ausschnitt nehmen, oder Ausnahme mit Satz`);
      }
    }
    // dach-100, blinder Leser Runde 2: `export { getGameSave as leseJeden }` oder
    // `export * as ns from …` gibt einer Funktion einen zweiten Namen, unter dem keine
    // Liste sie kennt. In packages/db heisst jede Funktion so, wie sie deklariert ist.
    for (const [rel, src] of state.db) {
      for (const st of analyse(rel, src).sf.statements) {
        if (!ts.isExportDeclaration(st) || !st.exportClause) continue;
        if (ts.isNamespaceExport(st.exportClause)) raus.push(`${dbName(rel)}: »export * as ${st.exportClause.name.text}« — ein Namensraum verbirgt die Namen, unter denen die Listen Funktionen kennen`);
        else for (const e of st.exportClause.elements) if (e.propertyName && e.propertyName.text !== e.name.text) raus.push(`${dbName(rel)}: exportiert ${e.propertyName.text} unter dem zweiten Namen ${e.name.text} — unter ihm kennt sie keine Liste`);
      }
    }
    // Eine Produktionsdatei, die aus einer Testdatei importiert, holt Code herein,
    // den dieses Tor nicht liest (Testdateien sind ausgenommen).
    for (const [rel, src] of state.db) {
      for (const st of analyse(rel, src).sf.statements) {
        if ((ts.isImportDeclaration(st) || ts.isExportDeclaration(st)) && st.moduleSpecifier && ts.isStringLiteral(st.moduleSpecifier) && TEST.test(st.moduleSpecifier.text)) {
          raus.push(`${dbName(rel)}: importiert aus ${st.moduleSpecifier.text} — Testdateien liest dieses Tor nicht; Produktionscode gehoert in eine Produktionsdatei`);
        }
      }
    }
    // Rost: der Bestand darf nur schrumpfen.
    for (const schluessel of bestand) {
      const e = k.idx.get(schluessel);
      if (!e) raus.push(`${schluessel}: steht im Bestand, die Funktion gibt es aber nicht mehr — Eintrag streichen`);
      else if (schluessel in pflicht || erlaubt[schluessel]) raus.push(`${schluessel}: steht im Bestand UND in einer anderen Liste — aus dem Bestand streichen`);
      else if (!beruehrtKlassenTabelle(e.f, tabellen)) raus.push(`${schluessel}: steht im Bestand, beruehrt aber keine Klassen-Tabelle mehr — Eintrag streichen`);
    }
    return raus;
  },

  pflicht(state) {
    const raus = [];
    const erlaubt = lade(state).ausnahmen;
    const k = kontext(state);
    // dach-100, blinder Leser: auch NICHT exportierte Funktionen — ein Helfer ohne
    // Export hinter einem exportierten Mantel war sonst fuer jede Pruefung unsichtbar.
    for (const [schluessel, { f }] of k.idx) {
      const beruehrt = KLASSEN_PRAEDIKAT.test(f.koerper) || KLASSEN_ROHSQL.test(f.koerper);
      if (!beruehrt) continue;
      if (hatPflichtScope(f)) {
        if (erlaubt[schluessel]) raus.push(`${schluessel}: steht in der Ausnahme-Liste, nimmt aber laengst einen Ausschnitt — Eintrag streichen`);
        continue;
      }
      const satz = erlaubt[schluessel];
      if (!satz) raus.push(`${schluessel}: filtert auf eine Klasse, nimmt aber keinen Pflicht-Ausschnitt (und steht in keiner Ausnahme)`);
    }
    for (const [schluessel, satz] of Object.entries(erlaubt)) {
      if (!k.idx.has(schluessel)) raus.push(`${schluessel}: Ausnahme fuer eine Funktion, die es nicht mehr gibt`);
      else if (typeof satz !== "string" || satz.length < SATZ_MIN) raus.push(`${schluessel}: die Ausnahme braucht einen Satz, keine Notiz (mindestens ${SATZ_MIN} Zeichen)`);
    }
    return raus;
  },

  zuerst(state) {
    const raus = [];
    for (const [schluessel, { a, f }] of kontext(state).idx) {
      for (const fehler of zuerstGefiltert(a, f)) raus.push(`${schluessel}: ${fehler}`);
    }
    return raus;
  },

  /**
   * WACHE — der blinde Leser von dach-018 fand `releaseItems` ohne
   * `assertWritableScope`, waehrend jeder andere Schreibweg ihn ruft. Das war
   * kein Einzelfall, sondern eine Regel ohne Tor: `where false` aendert null
   * Zeilen und meldet Erfolg, und genau davor warnt der Kopf von scope.ts.
   * Seit diesem Befund haelt eine Pruefung die Regel statt einer Gewohnheit.
   */
  wache(state) {
    // dach-100, blinder Leser: der Text »assertWritableScope« genuegte — als Zeichen-
    // kette, in try/catch verschluckt, unter if (false). Jetzt: ein echter Aufruf des
    // Imports aus scope.ts, als Anweisung auf OBERSTER Ebene, vor dem ersten Schreiben.
    const raus = [];
    for (const [schluessel, { a, f }] of kontext(state).idx) {
      const fn = f.node;
      if (!f.exportiert || !fn.parameters.some((p) => ts.isIdentifier(p.name) && p.name.text === "classScope")) continue;
      if (!SCHREIBT.test(f.koerper)) continue;
      const saetze = ts.isBlock(fn.body) ? fn.body.statements : [];
      const istWache = (st) =>
        ts.isExpressionStatement(st) && ts.isCallExpression(st.expression) && ts.isIdentifier(st.expression.expression) &&
        importiert(a.c, st.expression.expression, "./scope.ts", "assertWritableScope") && istParam(a.c, st.expression.arguments[0], fn, 1);
      const w = saetze.findIndex(istWache);
      const s1 = saetze.findIndex((st) => SCHREIBT.test(ohneKommentare(st.getText(a.sf))));
      if (w < 0 || (s1 >= 0 && s1 < w)) {
        raus.push(`${schluessel}: schreibt mit einem Ausschnitt, ruft assertWritableScope(classScope, …) aber nicht als Anweisung auf oberster Ebene VOR dem ersten Schreiben — ein leerer Ausschnitt aendert null Zeilen und meldet Erfolg`);
      }
    }
    return raus;
  },

  /**
   * PARAMETER — dach-100, blinder Leser: `classScope = alleKlassen as …`, `(classScope as
   * string[]).push(id)`, `const d = db; d.update(…)`, `db.query.…`, `db.execute(sql…)`.
   * Hinter jedem davon sieht keine Pruefung mehr, was gefragt wird. `db` darf nur
   * Abfragen bauen (select/insert/update/delete) oder als Argument weitergehen;
   * `classScope` darf gelesen und weitergereicht, nie veraendert oder umgemuenzt werden.
   */
  parameter(state) {
    const raus = [];
    const MUTIERT = new Set(["push", "pop", "shift", "unshift", "splice", "sort", "reverse", "fill", "copyWithin", "length"]);
    for (const [schluessel, { a, f }] of kontext(state).idx) {
      const fn = f.node;
      const dbP = fn.parameters[0];
      // Der Datenbank-Parameter heisst `db` ODER ist vom Typ `Db` (Runde 2: `client: Db`).
      const istDb = dbP && ts.isIdentifier(dbP.name) && (dbP.name.text === "db" || (dbP.type && ts.isTypeReferenceNode(dbP.type) && dbP.type.typeName.getText(a.sf) === "Db"));
      if (istDb) {
        for (const r of referenzen(a.c, dbP.name, fn)) {
          const p = r.parent;
          const baut = ts.isPropertyAccessExpression(p) && p.expression === r && BAUEN.has(p.name.text) && ts.isCallExpression(p.parent) && p.parent.expression === p;
          // Weitergeben nur an eine Funktion dieses Pakets, deren erster Parameter selbst
          // `Db` ist — sie steht dann unter derselben Pruefung (`same(db)` nicht).
          const ziel = ts.isCallExpression(p) && p.arguments[0] === r && ts.isIdentifier(p.expression) ? gerufene(kontext(state), a, p.expression) : null;
          const zf = ziel && kontext(state).idx.get(ziel)?.f.node.parameters[0];
          const reicht = !!zf && !!zf.type && ts.isTypeReferenceNode(zf.type) && zf.type.typeName.getText() === "Db";
          if (!baut && !reicht) {
            raus.push(`${schluessel}: benutzt db anders als zum Bauen einer Abfrage (»${normal(p.getText(a.sf)).slice(0, 60)}«) — dahinter sieht das Tor nicht, was gefragt wird`);
            break;
          }
        }
      }
      const sc = fn.parameters.find((p) => ts.isIdentifier(p.name) && p.name.text === "classScope");
      if (!sc) continue;
      // (Grenze: ein Alias `const sc = classScope` wird nicht weiter verfolgt.)
      for (const r of referenzen(a.c, sc.name, fn)) {
        let n = r;
        while (ts.isParenthesizedExpression(n.parent) || ts.isNonNullExpression(n.parent)) n = n.parent;
        const p = n.parent;
        const veraendert =
          istZuweisung(r) || (n !== r && ts.isBinaryExpression(p) && p.left === n) ||
          ts.isAsExpression(p) || ts.isTypeAssertionExpression(p) || ts.isSatisfiesExpression?.(p) ||
          (ts.isPropertyAccessExpression(p) && p.expression === n && MUTIERT.has(p.name.text) && (ts.isCallExpression(p.parent) || (ts.isBinaryExpression(p.parent) && p.parent.left === p))) ||
          (ts.isElementAccessExpression(p) && p.expression === n && ts.isBinaryExpression(p.parent) && p.parent.left === p) ||
          ts.isDeleteExpression(p);
        if (veraendert) {
          raus.push(`${schluessel}: veraendert oder ummuenzt den Ausschnitt (»${normal(p.getText(a.sf)).slice(0, 60)}«) — der Ausschnitt kommt aus lib/identity.ts und wird nie umgebogen`);
          break;
        }
      }
    }
    // apps/web: `getDb()` geht nur als Argument an eine Funktion aus packages/db. Eine
    // Abfrage direkt in einer Seite (`getDb().select().from(v2Classes)`, `getDb().query…`)
    // saehe keine Liste (dach-100, blinder Leser Runde 2; gemessen: heute 0 Stellen).
    for (const [rel, src] of state.web) {
      if (TEST.test(rel) || !src.includes("getDb")) continue;
      const sf = baum(rel, src);
      const melde = (x) => raus.push(`${rel}:${sf.getLineAndCharacterOfPosition(x.getStart(sf)).line + 1} benutzt getDb() anders als als Argument (»${normal(x.parent.getText(sf)).slice(0, 60)}«) — Abfragen gehoeren nach packages/db, hinter die Klassenwand`);
      const alsArgument = (x) => ts.isCallExpression(x.parent) && x.parent.arguments.includes(x);
      (function lauf(x) {
        if (ts.isCallExpression(x) && ts.isIdentifier(x.expression) && x.expression.text === "getDb" && !alsArgument(x)) {
          // `const db = getDb()` ist erlaubt, wenn `db` danach NUR als Argument vorkommt
          // (ohne Typ-Pruefer: jeder gleichnamige Bezeichner im selben Rumpf zaehlt — strenger).
          const d = x.parent;
          if (ts.isVariableDeclaration(d) && d.initializer === x && ts.isIdentifier(d.name) && d.parent.flags & ts.NodeFlags.Const) {
            const rumpf = umschliessendeFunktion(d)?.body ?? sf;
            let gut = true;
            (function such(y) {
              if (ts.isIdentifier(y) && y !== d.name && y.text === d.name.text && !alsArgument(y) && !(ts.isPropertyAccessExpression(y.parent) && y.parent.name === y) && !(ts.isPropertyAssignment(y.parent) && y.parent.name === y)) gut = false;
              ts.forEachChild(y, such);
            })(rumpf);
            if (!gut) melde(x);
          } else melde(x);
        }
        ts.forEachChild(x, lauf);
      })(sf);
    }
    return raus;
  },

  herkunft(state) {
    const raus = [];
    for (const [rel, src] of state.web) {
      if (rel === SCOPE_HEIMAT) continue;
      src.split("\n").forEach((zeile, i) => {
        if (/\bclassScope\(/.test(zeile)) {
          raus.push(`${rel}:${i + 1} baut einen Ausschnitt — das darf nur ${SCOPE_HEIMAT}`);
        }
      });
    }
    // dach-100, blinder Leser: am Zeilen-Text vorbei — `import { classScope as mk }`,
    // `const cs = classScope`, ein Zeilenumbruch vor `(`, oder die Marke ganz ohne
    // Konstruktor: `[params.id] as unknown as ClassScope`. Im Syntaxbaum: kein Import des
    // Konstruktors und keine Umwandlung in ClassScope ausserhalb seiner Heimat
    // (Testdateien duerfen sich einen Ausschnitt bauen, sie liefern nichts aus).
    // In packages/db baut ihn nur scope.ts.
    const quellen = [...[...state.web].map(([rel, src]) => [rel, src, rel === SCOPE_HEIMAT]), ...[...state.db].map(([rel, src]) => [rel, src, rel === `${DB_SRC}/scope.ts`])];
    for (const [rel, src, heimat] of quellen) {
      if (heimat || TEST.test(rel)) continue;
      const sf = baum(rel, src);
      const zeile = (n) => sf.getLineAndCharacterOfPosition(n.getStart(sf)).line + 1;
      (function lauf(x) {
        if (ts.isImportSpecifier(x) && (x.propertyName ?? x.name).text === "classScope" && !x.isTypeOnly && !x.parent.parent.isTypeOnly) {
          raus.push(`${rel}:${zeile(x)} importiert den Konstruktor classScope — einen Ausschnitt baut nur ${SCOPE_HEIMAT}`);
        }
        if ((ts.isAsExpression(x) || ts.isTypeAssertionExpression(x)) && ts.isTypeReferenceNode(x.type) && /\bClassScope$/.test(x.type.typeName.getText(sf))) {
          raus.push(`${rel}:${zeile(x)} muenzt einen Wert per Umwandlung zu ClassScope — die Marke entsteht nur in ${SCOPE_HEIMAT}`);
        }
        ts.forEachChild(x, lauf);
      })(sf);
    }
    return raus;
  },

  aufrufer(state) {
    const raus = [];
    const soll = JSON.parse(state.files.get(AUFRUFER)).funktionen;
    const erlaubt = lade(state).ausnahmen;
    const k = kontext(state);
    const namen = new Map();
    for (const [schluessel, aufrufe] of Object.entries(soll)) {
      const name = schluessel.split("#")[1];
      const satz = erlaubt[schluessel];
      if (!satz) raus.push(`${schluessel}: steht in ${AUFRUFER}, aber in keiner Ausnahme — ohne Ausnahme gibt es nichts festzuhalten`);
      else if (/^TOT\b/.test(satz) !== (aufrufe.length === 0)) raus.push(`${schluessel}: der Ausnahme-Satz und ${AUFRUFER} widersprechen sich — »TOT« heisst: keine Aufrufe, und keine Aufrufe heisst: der Satz beginnt mit »TOT«`);
      if (!k.idx.has(schluessel)) raus.push(`${schluessel}: steht in ${AUFRUFER}, die Funktion gibt es aber nicht mehr — Eintrag streichen`);
      if ([...k.idx.keys()].filter((s) => s.endsWith(`#${name}`)).length > 1) raus.push(`${schluessel}: der Name ${name} ist in packages/db nicht eindeutig — die Aufrufe lassen sich nicht zuordnen`);
      namen.set(name, schluessel);
    }
    for (const [schluessel, satz] of Object.entries(erlaubt)) {
      if (/^TOT\b/.test(satz) && !(schluessel in soll)) raus.push(`${schluessel}: die Ausnahme sagt »TOT«, steht aber nicht in ${AUFRUFER} — ohne Eintrag haelt niemand fest, dass sie tot bleibt`);
    }
    const ist = aufrufeVon(state, namen);
    const tot = new Set(Object.entries(soll).filter(([s, a]) => a.length === 0 && /^TOT\b/.test(erlaubt[s] ?? "")).map(([s]) => s));
    for (const [schluessel, aufrufe] of Object.entries(soll)) {
      const offen = [...aufrufe];
      for (const { text: a, von } of ist.get(schluessel) ?? []) {
        if (von && tot.has(von)) continue;
        const i = offen.indexOf(a);
        if (i >= 0) { offen.splice(i, 1); continue; }
        raus.push(
          aufrufe.length === 0
            ? `${schluessel}: ist als TOT ausgenommen, wird aber gerufen (${a}) — eine tote Funktion ohne Ausschnitt darf nicht still wiederbelebt werden: Ausschnitt nehmen, oder Herkunft pruefen und Satz + Eintrag neu schreiben`
            : `${schluessel}: neuer oder geaenderter Aufruf ${a} — die Ausnahme gilt nur, solange die Kennung aus der Sitzung kommt; Herkunft lesen und in ${AUFRUFER} eintragen`,
        );
      }
      for (const a of offen) raus.push(`${schluessel}: ${AUFRUFER} nennt den Aufruf ${a}, den es nicht mehr gibt — Eintrag streichen`);
    }
    return raus;
  },
};

function laden() {
  const files = new Map([[ALLOWLIST, lies(ALLOWLIST)], [REQUIRED, lies(REQUIRED)], [AUFRUFER, lies(AUFRUFER)]]);
  const db = new Map(dbDateien().map((rel) => [rel, lies(rel)]));
  const web = new Map(webDateien().map((rel) => [rel, lies(rel)]));
  return { files, db, web };
}

function lauf(state) {
  const befunde = {};
  for (const [name, fn] of Object.entries(PRUEFUNGEN)) befunde[name] = fn(state);
  return befunde;
}

const klon = (s) => ({ files: new Map(s.files), db: new Map(s.db), web: new Map(s.web) });

/** Eine Zeile ersetzen — und laut scheitern, wenn sie nicht mehr dasteht. */
function verbiege(c, rel, vorher, nachher) {
  const src = c.db.get(rel);
  const neu = typeof vorher === "string" ? src.replace(vorher, nachher) : src.replace(vorher, nachher);
  if (neu === src) throw new Error(`Selbsttest: ${rel} traegt die erwartete Stelle nicht mehr (${String(vorher).slice(0, 60)}…)`);
  c.db.set(rel, neu);
  return c;
}
const AS = `${DB_SRC}/assignment-service.ts`;
// getAssignmentWithSections, wie sie heute dasteht, und dieselbe Abfrage ohne Filter.
const GW = "  const [a] = await db\n    .select()\n    .from(assignments)\n    .where(and(inArray(assignments.classId, [...classScope]), eq(assignments.id, id)))";
const ROH = "  const [a] = await db\n    .select()\n    .from(assignments)\n    .where(eq(assignments.id, id))";
const ROH_WHERE = (w) => `  const [a] = await db\n    .select()\n    .from(assignments)\n    .where(${w})`;
const FILTER = "inArray(assignments.classId, [...classScope])";
const WACHE_CA = /if \(!inScope\(classScope, draft\.classId\)\) \{\n[^\n]*\n  \}/;
const webDazu = (c, rel, src) => { c.web.set(rel, src); return c; };

const FAELLE = [
  {
    // Der Befund des GG-Reviews 18.09., woertlich nachgestellt: der Ausschnitt
    // verschwindet GANZ, und keine der anderen Pruefungen sieht es.
    name: "eine Klassenabfrage verliert ihren Ausschnitt ganz (assignment-service.ts#getAssignmentWithSections)",
    pruefung: "liste",
    mach: (s) => verbiege(klon(s), AS, "and(inArray(assignments.classId, [...classScope]), eq(assignments.id, id))", "eq(assignments.id, id)"),
  },
  {
    // Der Umgehungsweg des blinden Lesers (dach-063): der Ausschnitt bleibt als Text
    // stehen, ein umschliessendes or() hebt ihn auf.
    name: "ein or() hebt den Ausschnitt auf, der Text bleibt stehen",
    pruefung: "liste",
    mach: (s) => verbiege(klon(s), AS, "and(inArray(assignments.classId, [...classScope]), eq(assignments.id, id))", "or(eq(assignments.id, id), and(inArray(assignments.classId, [...classScope]), eq(assignments.id, id)))"),
  },
  {
    // Zweiter Umgehungsweg des blinden Lesers: Filter geloescht, sein Text bleibt
    // als Kommentar stehen. Der Syntaxbaum kennt keine Kommentare — der Fall laeuft
    // jetzt mit dem ROHEN Quelltext.
    name: "der Filter ist geloescht, sein Text steht noch im Kommentar",
    pruefung: "liste",
    mach: (s) => verbiege(klon(s), AS, "and(inArray(assignments.classId, [...classScope]), eq(assignments.id, id))", "eq(assignments.id, id) // alt: inArray(assignments.classId, [...classScope])"),
  },
  // dach-100 · die beiden offenen Wege aus dach-063 und ihre Verwandten.
  {
    name: "der Filter steht in einer Variablen, die Variable in or()",
    pruefung: "liste",
    mach: (s) => verbiege(klon(s), AS, GW, `  const w = ${FILTER};\n${ROH_WHERE("or(eq(assignments.id, id), w)")}`),
  },
  {
    name: "der Filter steht in einer Variablen, die Variable in not()",
    pruefung: "liste",
    mach: (s) => verbiege(klon(s), AS, GW, `  const w = ${FILTER};\n${ROH_WHERE("and(eq(assignments.id, id), not(w))")}`),
  },
  {
    name: "and(Variable) steht in einem or()",
    pruefung: "liste",
    mach: (s) => verbiege(klon(s), AS, GW, `  const w = ${FILTER};\n${ROH_WHERE("or(and(w, eq(assignments.id, id)), eq(assignments.createdBy, id))")}`),
  },
  {
    name: "eine Konstante and(Filter, …) steht in einem or()",
    pruefung: "liste",
    mach: (s) => verbiege(klon(s), AS, GW, `  const w = and(${FILTER}, eq(assignments.id, id));\n${ROH_WHERE("or(w, eq(assignments.id, id))")}`),
  },
  {
    name: "die zweite Verwendung einer gefilterten Konstanten steht in or() (writing-review.ts#listSubmissionsForClass)",
    pruefung: "liste",
    mach: (s) => {
      const c = klon(s);
      const rel = `${DB_SRC}/writing-review.ts`;
      const src = c.db.get(rel);
      const i = src.lastIndexOf(".where(wem)");
      if (i < 0) throw new Error(`Selbsttest: ${rel} traegt .where(wem) nicht mehr`);
      c.db.set(rel, `${src.slice(0, i)}.where(or(wem, eq(writingSubmissions.classId, classId)))${src.slice(i + ".where(wem)".length)}`);
      return c;
    },
  },
  {
    name: "eine tote Zusatzabfrage traegt den Filter, die echte ist ungefiltert (nackte Anweisung)",
    pruefung: "liste",
    mach: (s) => verbiege(klon(s), AS, GW, `  await db.select().from(assignments).where(${FILTER});\n${ROH}`),
  },
  {
    name: "eine tote Zusatzabfrage traegt den Filter (an eine ungelesene Konstante gebunden)",
    pruefung: "liste",
    mach: (s) => verbiege(klon(s), AS, GW, `  const pruef = await db.select().from(assignments).where(${FILTER});\n${ROH}`),
  },
  {
    name: "der Filter steht in einer ungelesenen Variablen",
    pruefung: "liste",
    mach: (s) => verbiege(klon(s), AS, GW, `  const w = ${FILTER};\n${ROH}`),
  },
  {
    name: "ein lokales `and` ist in Wahrheit or",
    pruefung: "liste",
    mach: (s) => verbiege(klon(s), AS, GW, `  const and = or;\n${GW}`),
  },
  {
    name: "die inScope-Wache wird zur Anweisung ohne Folge (assignment-service.ts#createAssignment)",
    pruefung: "liste",
    mach: (s) => verbiege(klon(s), AS, WACHE_CA, "inScope(classScope, draft.classId);"),
  },
  {
    name: "die inScope-Wache landet in einer ungelesenen Konstanten",
    pruefung: "liste",
    mach: (s) => verbiege(klon(s), AS, WACHE_CA, "const imAusschnitt = inScope(classScope, draft.classId);"),
  },
  {
    name: "die inScope-Wache ist umgedreht",
    pruefung: "liste",
    mach: (s) => verbiege(klon(s), AS, "if (!inScope(classScope, draft.classId))", "if (inScope(classScope, draft.classId))"),
  },
  {
    name: "die inScope-Wache steht hinter dem Schreiben (persist.ts#recordWritingSubmission)",
    pruefung: "liste",
    mach: (s) => {
      const c = klon(s);
      const rel = `${DB_SRC}/persist.ts`;
      const src = c.db.get(rel);
      const kopf = src.indexOf("export async function recordWritingSubmission");
      const w = /\n  if \(!inScope\(classScope, [^\n]*\n(?:[^\n]*\n)*?  \}\n/.exec(src.slice(kopf));
      if (kopf < 0 || !w) throw new Error(`Selbsttest: ${rel} traegt die Wache von recordWritingSubmission nicht mehr`);
      const ab = kopf + w.index;
      const rest = src.slice(ab + w[0].length);
      const ins = /\n  (?:const [^=]+= )?await db\s*\.insert\([\s\S]*?;\n/.exec(rest);
      if (!ins) throw new Error(`Selbsttest: ${rel} — kein insert hinter der Wache gefunden`);
      const nach = ins.index + ins[0].length;
      c.db.set(rel, src.slice(0, ab) + "\n" + rest.slice(0, nach) + w[0].slice(1) + rest.slice(nach));
      return c;
    },
  },
  {
    name: "das Durchreichen an eine gelistete Funktion wird verworfen (roster-service.ts#resetStudentPin)",
    pruefung: "liste",
    mach: (s) => verbiege(klon(s), `${DB_SRC}/roster-service.ts`, /const owned = await ownedStudent\(db, classScope, ([^)]*)\);/, "await ownedStudent(db, classScope, $1);\n  const owned = { classId: studentId };"),
  },
  {
    name: "ein Schreibweg wird nicht abgewartet und laeuft nie (assignment-service.ts#archiveAssignment)",
    pruefung: "liste",
    mach: (s) => verbiege(klon(s), AS, 'assertWritableScope(classScope, "archiveAssignment");\n  await db', 'assertWritableScope(classScope, "archiveAssignment");\n  db'),
  },
  {
    name: "die Positiv-Liste traegt eine Funktion mit 0 Filterstellen",
    pruefung: "liste",
    mach: (s) => {
      const c = klon(s);
      const j = JSON.parse(c.files.get(REQUIRED));
      j.pflicht["class-service.ts#renameClass"] = 0;
      c.files.set(REQUIRED, JSON.stringify(j, null, 2));
      return c;
    },
  },
  {
    name: "eine neue Funktion nimmt einen Ausschnitt, filtert aber nicht und steht in keiner Liste",
    pruefung: "liste",
    mach: (s) => {
      const c = klon(s);
      c.db.set(AS, c.db.get(AS) + "\nexport async function __selbsttest(db: Db, classScope: ClassScope, id: string) {\n  return db.select().from(assignments).where(eq(assignments.id, id));\n}\n");
      return c;
    },
  },
  {
    name: "eine neue Funktion liest eine Klassen-Tabelle ohne Ausschnitt und steht in keiner Liste",
    pruefung: "liste",
    mach: (s) => {
      const c = klon(s);
      c.db.set(AS, c.db.get(AS) + "\nexport async function __selbsttest(db: Db, id: string) {\n  return db.select().from(reservedItems).where(eq(reservedItems.id, id));\n}\n");
      return c;
    },
  },
  {
    // Der Kopf-Leser: ownedStudent gibt Promise<{ … }> zurueck. Vor dach-063 las
    // das Tor diesen Typ als Koerper und sah die Funktion gar nicht.
    name: "eine Funktion mit Objekt-Rueckgabetyp verliert ihren Ausschnitt (roster-service.ts#ownedStudent)",
    pruefung: "liste",
    mach: (s) => verbiege(klon(s), `${DB_SRC}/roster-service.ts`, "and(inArray(v2Classes.id, [...classScope]), eq(v2IdentityUsers.id, studentId), eq(v2Classes.teacherId, teacherId))", "and(eq(v2IdentityUsers.id, studentId), eq(v2Classes.teacherId, teacherId))"),
  },
  {
    // dach-100 · eine generische Funktion war fuer den alten Regex unsichtbar.
    name: "eine neue GENERISCHE Funktion liest eine Klassen-Tabelle ohne Ausschnitt",
    pruefung: "liste",
    mach: (s) => {
      const c = klon(s);
      c.db.set(AS, c.db.get(AS) + "\nexport async function __selbsttest<T>(db: Db, id: string): Promise<T> {\n  return db.select().from(reservedItems).where(eq(reservedItems.id, id)) as T;\n}\n");
      return c;
    },
  },
  {
    name: "die Positiv-Liste nennt eine Funktion, die es nicht mehr gibt",
    pruefung: "liste",
    mach: (s) => {
      const c = klon(s);
      const j = JSON.parse(c.files.get(REQUIRED));
      j.pflicht["assignment-service.ts#gibtEsNicht"] = 1;
      c.files.set(REQUIRED, JSON.stringify(j, null, 2));
      return c;
    },
  },
  {
    name: "ein Pflicht-Ausschnitt wird optional gemacht",
    pruefung: "pflicht",
    mach: (s) => verbiege(klon(s), `${DB_SRC}/class-progress.ts`, "classScope: ClassScope, classId: string", "classScope: ClassScope = EMPTY_SCOPE, classId: string"),
  },
  {
    name: "die Wand wird verneint geschrieben",
    pruefung: "zuerst",
    mach: (s) => verbiege(klon(s), `${DB_SRC}/class-progress.ts`, "inArray(practiceAttempts.classId, [...classScope])", "notInArray(practiceAttempts.classId, [...classScope])"),
  },
  {
    // dach-100 · der alte Text-Leser sah die Reihenfolge nur bei `[...classScope]`.
    name: "der Ausschnitt OHNE Spread ist nicht mehr das erste Glied (class-service.ts#renameClass)",
    pruefung: "zuerst",
    mach: (s) => verbiege(klon(s), `${DB_SRC}/class-service.ts`, "and(inArray(v2Classes.id, classScope), eq(v2Classes.id, id), ", "and(eq(v2Classes.id, id), inArray(v2Classes.id, classScope), "),
  },
  {
    name: "die Wand steht als Variable unter not()",
    pruefung: "zuerst",
    mach: (s) => verbiege(klon(s), AS, GW, `  const w = ${FILTER};\n${ROH_WHERE("and(not(w), eq(assignments.id, id))")}`),
  },
  {
    name: "ein Ausschnitt wird ausserhalb von lib/identity.ts gebaut",
    pruefung: "herkunft",
    mach: (s) => webDazu(klon(s), "apps/web/app/__selftest-scope.tsx", "const s = classScope([params.id]);"),
  },
  {
    name: "ein Schreibweg verliert seinen Waechter",
    pruefung: "wache",
    mach: (s) => verbiege(klon(s), AS, 'assertWritableScope(classScope, "releaseItems");', ""),
  },
  {
    name: "eine Ausnahme verliert ihren Satz",
    pruefung: "pflicht",
    mach: (s) => {
      const c = klon(s);
      const j = JSON.parse(c.files.get(ALLOWLIST));
      j.ausnahmen["ops-links.ts#loadOpsClass"] = "geht schon";
      c.files.set(ALLOWLIST, JSON.stringify(j, null, 2));
      return c;
    },
  },
  {
    name: "eine Ausnahme ueberlebt ihren Grund",
    pruefung: "pflicht",
    mach: (s) => {
      const c = klon(s);
      const j = JSON.parse(c.files.get(ALLOWLIST));
      j.ausnahmen["class-progress.ts#listClassTraps"] = "Diese Funktion nimmt laengst einen Ausschnitt; der Eintrag haette gestrichen werden muessen.";
      c.files.set(ALLOWLIST, JSON.stringify(j, null, 2));
      return c;
    },
  },
  // dach-100 · aufrufer: die Herkunft der Kennung einer Ausnahme.
  {
    name: "eine TOTE Ausnahme wird aus apps/web gerufen (bootstrap-teacher.ts#adoptAssignments)",
    pruefung: "aufrufer",
    mach: (s) => webDazu(klon(s), "apps/web/app/__selftest/page.tsx", 'import { adoptAssignments, getDb } from "@domigo/db";\nexport default async function P({ params }: { params: { id: string } }) {\n  await adoptAssignments(getDb(), params.id);\n}\n'),
  },
  {
    name: "eine Ausnahme bekommt ihre Kennung aus der URL (gamesave.ts#getGameSave mit params.id)",
    pruefung: "aufrufer",
    mach: (s) => webDazu(klon(s), "apps/web/app/__selftest/page.tsx", 'import { getDb, getGameSave } from "@domigo/db";\nexport default async function P({ params }: { params: { id: string } }) {\n  return getGameSave(getDb(), params.id, "game:g1");\n}\n'),
  },
  {
    name: "eine Ausnahme wird umbenannt importiert und so gerufen",
    pruefung: "aufrufer",
    mach: (s) => webDazu(klon(s), "apps/web/app/__selftest/page.tsx", 'import { getDb, getPathSummary as zusammenfassung } from "@domigo/db";\nexport default async function P({ params }: { params: { id: string } }) {\n  return zusammenfassung(getDb(), params.id);\n}\n'),
  },
  {
    name: "eine Ausnahme wird als Wert weitergereicht (Herkunft unlesbar)",
    pruefung: "aufrufer",
    mach: (s) => webDazu(klon(s), "apps/web/lib/__selftest.ts", 'import { getUnitPathProgress } from "@domigo/db";\nexport const leser = getUnitPathProgress;\n'),
  },
  {
    name: "ein festgehaltener Aufruf aendert den Ausdruck seiner Kennung (studypath.ts#getPathSummary)",
    pruefung: "aufrufer",
    mach: (s) => {
      const c = klon(s);
      const rel = "apps/web/app/learn/page.tsx";
      const src = c.web.get(rel);
      const neu = src.replace("getPathSummary(getDb(), session.user.id)", "getPathSummary(getDb(), (await searchParams).kind ?? session.user.id)");
      if (neu === src) throw new Error(`Selbsttest: ${rel} traegt den Aufruf von getPathSummary nicht mehr`);
      c.web.set(rel, neu);
      return c;
    },
  },
  {
    name: "eine Ausnahme heisst TOT, steht aber nicht in der Aufrufer-Liste",
    pruefung: "aufrufer",
    mach: (s) => {
      const c = klon(s);
      const j = JSON.parse(c.files.get(AUFRUFER));
      delete j.funktionen["bootstrap-teacher.ts#adoptAssignments"];
      c.files.set(AUFRUFER, JSON.stringify(j, null, 2));
      return c;
    },
  },
  // dach-100 · blinder Leser, Runde 1: Umgehungen um die Abfrage herum.
  {
    name: "ein zweites .where ersetzt das gefilterte (drizzle nimmt das letzte)",
    pruefung: "liste",
    mach: (s) => verbiege(klon(s), AS, GW, `${GW}\n    .where(eq(assignments.id, id))`),
  },
  {
    name: "ein .where hinter .$dynamic() ersetzt das gefilterte",
    pruefung: "liste",
    mach: (s) => verbiege(klon(s), AS, GW, `${GW}\n    .$dynamic()\n    .where(eq(assignments.id, id))`),
  },
  {
    name: "eine union haengt eine ungefilterte Abfrage an",
    pruefung: "liste",
    mach: (s) => verbiege(klon(s), AS, GW, `${GW}\n    .union(db.select().from(assignments))`),
  },
  {
    name: "die gefilterte Abfrage wird nur verworfen gelesen (x.length;), die ungefilterte geht hinaus",
    pruefung: "liste",
    mach: (s) => verbiege(klon(s), AS, GW, `  const x = await db.select().from(assignments).where(${FILTER});\n  x.length;\n${ROH}`),
  },
  {
    name: "die gefilterte Abfrage wird nur geloggt, die ungefilterte geht hinaus",
    pruefung: "liste",
    mach: (s) => verbiege(klon(s), AS, GW, `  const x = await db.select().from(assignments).where(${FILTER});\n  console.log(x);\n${ROH}`),
  },
  {
    name: "let q = gefiltert; q = ungefiltert",
    pruefung: "liste",
    mach: (s) => verbiege(klon(s), AS, GW, `  let q = db.select().from(assignments).where(and(${FILTER}, eq(assignments.id, id)));\n  q = db.select().from(assignments).where(eq(assignments.id, id));\n  const [a] = await q`),
  },
  {
    name: "der Ausschnitt wird vor dem Filter ueberschrieben",
    pruefung: "parameter",
    mach: (s) => verbiege(klon(s), AS, GW, `  classScope = [id] as unknown as ClassScope;\n${GW}`),
  },
  {
    name: "der Ausschnitt wird per Umwandlung erweitert (push)",
    pruefung: "parameter",
    mach: (s) => verbiege(klon(s), AS, GW, `  (classScope as unknown as string[]).push(id);\n${GW}`),
  },
  {
    name: "db wird umbenannt (const d = db), dahinter sieht keine Pruefung",
    pruefung: "parameter",
    mach: (s) => verbiege(klon(s), AS, GW, `  const d = db;\n  void d;\n${GW}`),
  },
  {
    name: "rohes SQL ueber db.execute",
    pruefung: "parameter",
    mach: (s) => verbiege(klon(s), AS, GW, `  await db.execute(sql\`select 1\`);\n${GW}`),
  },
  {
    name: "ein NICHT exportierter Helfer filtert auf eine Klasse, ein Mantel exportiert ihn",
    pruefung: "pflicht",
    mach: (s) => {
      const c = klon(s);
      c.db.set(AS, c.db.get(AS) + "\nasync function __innen(db: Db, classId: string) {\n  return db.select().from(assignments).where(eq(assignments.classId, classId));\n}\nexport async function __mantel(db: Db, classId: string) {\n  return __innen(db, classId);\n}\n");
      return c;
    },
  },
  {
    name: "eine Klassen-Tabelle unter anderem Namen importiert (.from(a2))",
    pruefung: "liste",
    mach: (s) => {
      const c = klon(s);
      c.db.set(AS, c.db.get(AS) + '\nimport { reservedItems as r2 } from "./schema.ts";\nexport async function __selbsttest(db: Db, id: string) {\n  return db.select().from(r2).where(eq(r2.id, id));\n}\n');
      return c;
    },
  },
  {
    name: "eine Funktion als Eigenschaft eines exportierten Objekts",
    pruefung: "liste",
    mach: (s) => {
      const c = klon(s);
      c.db.set(AS, c.db.get(AS) + "\nexport const __api = { f: async (db: Db, id: string) => db.select().from(reservedItems).where(eq(reservedItems.id, id)) };\n");
      return c;
    },
  },
  {
    name: "eine neue Datei in einem Unterordner von packages/db/src",
    pruefung: "liste",
    mach: (s) => {
      const c = klon(s);
      c.db.set(`${DB_SRC}/unter/leck.mts`, 'import { eq } from "drizzle-orm";\nimport type { Db } from "../index.ts";\nimport { reservedItems } from "../schema.ts";\nexport async function leck(db: Db, id: string) {\n  return db.select().from(reservedItems).where(eq(reservedItems.id, id));\n}\n');
      return c;
    },
  },
  {
    name: "Produktionscode importiert aus einer Testdatei",
    pruefung: "liste",
    mach: (s) => {
      const c = klon(s);
      c.db.set(AS, 'export { leck } from "./leck.test.ts";\n' + c.db.get(AS));
      return c;
    },
  },
  {
    name: "ClassScope ist ein lokaler Typ statt der Marke aus scope.ts",
    pruefung: "pflicht",
    mach: (s) => verbiege(klon(s), AS, 'import { assertWritableScope, inScope, type ClassScope } from "./scope.ts";', 'import { assertWritableScope, inScope } from "./scope.ts";\ntype ClassScope = string[];'),
  },
  {
    name: "die Wache steht nur noch als Zeichenkette da",
    pruefung: "wache",
    mach: (s) => verbiege(klon(s), AS, 'assertWritableScope(classScope, "releaseItems");', '"assertWritableScope(classScope)";'),
  },
  {
    name: "die Wache steht unter if (false)",
    pruefung: "wache",
    mach: (s) => verbiege(klon(s), AS, 'assertWritableScope(classScope, "releaseItems");', 'if (false) assertWritableScope(classScope, "releaseItems");'),
  },
  {
    name: "apps/web muenzt eine Kennung aus der URL per Umwandlung zu ClassScope",
    pruefung: "herkunft",
    mach: (s) => webDazu(klon(s), "apps/web/app/__selftest/page.tsx", 'import type { ClassScope } from "@domigo/db";\nexport default async function P({ params }: { params: { id: string } }) {\n  const s = [params.id] as unknown as ClassScope;\n  return s;\n}\n'),
  },
  {
    name: "apps/web importiert den Konstruktor unter anderem Namen",
    pruefung: "herkunft",
    mach: (s) => webDazu(klon(s), "apps/web/lib/__selftest.ts", 'import { classScope as mk } from "@domigo/db";\nexport const s = (id: string) => mk\n  ([id]);\n'),
  },
  {
    name: "eine Ausnahme wird in apps/web re-exportiert",
    pruefung: "aufrufer",
    mach: (s) => webDazu(klon(s), "apps/web/lib/__selftest.ts", 'export { getGameSave } from "@domigo/db";\n'),
  },
  {
    name: "eine Ausnahme wird per import() gerufen",
    pruefung: "aufrufer",
    mach: (s) => webDazu(klon(s), "apps/web/app/__selftest/route.ts", 'export async function GET(req: Request) {\n  const m = await import("@domigo/db");\n  return Response.json(await m.getGameSave(m.getDb(), new URL(req.url).searchParams.get("u") ?? "", "game:g1"));\n}\n'),
  },
  {
    name: "eine TOTE Ausnahme wird ueber einen relativen Pfad aus einer .mjs-Datei gerufen",
    pruefung: "aufrufer",
    mach: (s) => webDazu(klon(s), "apps/web/scripts/__selftest.mjs", 'import { claimClassAsTeacher } from "../../../packages/db/src/teacher-claim.ts";\nawait claimClassAsTeacher(db, process.argv[2]);\n'),
  },
  {
    name: "eine Ausnahme wird per Destrukturierung aus dem Namensraum geholt",
    pruefung: "aufrufer",
    mach: (s) => webDazu(klon(s), "apps/web/lib/__selftest.ts", 'import * as dbm from "@domigo/db";\nconst { getPathSummary: g } = dbm;\nexport const f = (id: string) => g(dbm.getDb(), id);\n'),
  },
  // dach-100 · blinder Leser, Runde 2.
  {
    name: "eine Seite in apps/web fragt die Datenbank direkt (getDb().select().from(v2Classes))",
    pruefung: "parameter",
    mach: (s) => webDazu(klon(s), "apps/web/app/__selftest/page.tsx", 'import { getDb, v2Classes } from "@domigo/db";\nexport default async function P() {\n  return getDb().select().from(v2Classes);\n}\n'),
  },
  {
    name: "eine Seite bindet getDb() und fragt ueber db.query",
    pruefung: "parameter",
    mach: (s) => webDazu(klon(s), "apps/web/app/__selftest/page.tsx", 'import { getDb } from "@domigo/db";\nexport default async function P() {\n  const db = getDb();\n  return db.query.v2Classes.findMany();\n}\n'),
  },
  {
    name: "der Datenbank-Parameter heisst anders und fuehrt rohes SQL aus",
    pruefung: "parameter",
    mach: (s) => {
      const c = klon(s);
      c.db.set(AS, c.db.get(AS) + "\nexport async function __selbsttest(client: Db) {\n  return client.execute(sql`select * from domigo_v2.classes`);\n}\n");
      return c;
    },
  },
  {
    name: "db wird durch eine Hilfsfunktion ohne Db-Parameter gereicht (const d = same(db))",
    pruefung: "parameter",
    mach: (s) => verbiege(klon(s), AS, GW, `  const d = ((x: unknown) => x)(db);\n  void d;\n${GW}`),
  },
  {
    name: "packages/db exportiert eine Ausnahme unter einem zweiten Namen",
    pruefung: "liste",
    mach: (s) => { const c = klon(s); const rel = `${DB_SRC}/gamesave.ts`; c.db.set(rel, c.db.get(rel) + "\nexport { getGameSave as leseJedenSpielstand };\n"); return c; },
  },
  {
    name: "packages/db exportiert einen Namensraum (export * as)",
    pruefung: "liste",
    mach: (s) => { const c = klon(s); const rel = `${DB_SRC}/index.ts`; c.db.set(rel, c.db.get(rel) + '\nexport * as gsNs from "./gamesave.ts";\n'); return c; },
  },
  {
    name: "eine aeltere Ausnahme (syncKontoStudentClass) wird mit Kennungen aus der URL gerufen",
    pruefung: "aufrufer",
    mach: (s) => webDazu(klon(s), "apps/web/app/__selftest/page.tsx", 'import { getDb, syncKontoStudentClass } from "@domigo/db";\nexport default async function P({ params }: { params: { id: string; k: string } }) {\n  await syncKontoStudentClass(getDb(), params.id, params.k);\n}\n'),
  },
  {
    name: "eine Ausnahme wird mit Unicode-Escape im Namen gerufen",
    pruefung: "aufrufer",
    mach: (s) => webDazu(klon(s), "apps/web/app/__selftest/page.tsx", 'import { getDb, getGameSave } from "@domigo/db";\nexport default async function P({ params }: { params: { id: string } }) {\n  return get\\u0047ameSave(getDb(), params.id, "game:g1");\n}\n'),
  },
  {
    name: "eine Ausnahme wird aus einer .jsx-Datei gerufen",
    pruefung: "aufrufer",
    mach: (s) => webDazu(klon(s), "apps/web/app/__selftest/page.jsx", 'import { getDb, getPathSummary } from "@domigo/db";\nexport default async function P({ params }) {\n  const s = await getPathSummary(getDb(), params.id);\n  return <p>{s.size}</p>;\n}\n'),
  },
  // Gegenproben: dieselben Werkzeuge, ehrlich benutzt — ALLES muss gruen bleiben.
  {
    name: "Gegenprobe: der Filter laeuft ueber eine Konstante and(…) in .where",
    gruen: true,
    mach: (s) => verbiege(klon(s), AS, GW, `  const w = and(${FILTER}, eq(assignments.id, id));\n${ROH_WHERE("w")}`),
  },
  {
    name: "Gegenprobe: der Filter steht in einer Variablen, die als erstes Glied in and() geht",
    gruen: true,
    mach: (s) => verbiege(klon(s), AS, GW, `  const w = ${FILTER};\n${ROH_WHERE("and(w, eq(assignments.id, id))")}`),
  },
  {
    name: "Gegenprobe: ein Kommentar ueber dem Filter aendert nichts",
    gruen: true,
    mach: (s) => verbiege(klon(s), AS, GW, `  // die Wand: ${FILTER}\n${GW}`),
  },
];

const echt = laden();
const befunde = lauf(echt);

if (selftest) {
  let schlecht = 0;
  for (const [name, liste] of Object.entries(befunde)) {
    if (liste.length) {
      console.error(`✗ Selbsttest unbrauchbar: ${name} ist schon ohne Manipulation rot`);
      for (const z of liste) console.error(`    ${z}`);
      schlecht++;
    }
  }
  let rot = 0;
  let gruen = 0;
  for (const fall of FAELLE) {
    const r = lauf(fall.mach(echt));
    if (fall.gruen) {
      const brennt = Object.entries(r).filter(([, l]) => l.length);
      if (brennt.length) {
        console.error(`✗ Selbsttest: Gegenprobe »${fall.name}« macht ${brennt.map(([n]) => n).join(", ")} rot:`);
        for (const [, l] of brennt) for (const z of l) console.error(`    ${z}`);
        schlecht++;
      } else {
        console.log(`  ok   alles bleibt gruen: ${fall.name}`);
        gruen++;
      }
    } else if (r[fall.pruefung].length === 0) {
      console.error(`✗ Selbsttest: »${fall.name}« liess ${fall.pruefung} gruen`);
      schlecht++;
    } else {
      console.log(`  ok   ${fall.pruefung} wird rot: ${fall.name}`);
      rot++;
    }
  }
  if (schlecht) process.exit(1);
  console.log(`check-claim-filter --selftest: OK — ${rot} rote Lichter bewiesen, ${gruen} Gegenproben gruen`);
  process.exit(0);
}

let fehler = 0;
for (const [name, liste] of Object.entries(befunde)) {
  if (liste.length === 0) console.log(`  ok   ${name}`);
  for (const z of liste) {
    console.error(`✗ ${name}: ${z}`);
    fehler++;
  }
}
if (fehler) {
  console.error(`check-claim-filter: ${fehler} Verstoesse`);
  process.exit(1);
}
const k = kontext(echt);
const gezaehlt = [...k.idx.values()].filter(({ f }) => nimmtAusschnitt(f)).length;
const soll = JSON.parse(echt.files.get(REQUIRED));
const fest = Object.values(JSON.parse(echt.files.get(AUFRUFER)).funktionen);
console.log(
  `check-claim-filter: OK — ${gezaehlt} Funktionen nehmen den Ausschnitt (Positiv-Liste: ${Object.keys(soll.pflicht).length} Funktionen, ${Object.values(soll.pflicht).reduce((a, b) => a + b, 0)} wirksame Filterstellen im Syntaxbaum), ${Object.keys(lade(echt).ausnahmen).length} begruendete Ausnahmen (davon ${fest.length} mit festgehaltenen Aufrufern: ${fest.filter((a) => a.length === 0).length} tot, ${fest.reduce((n, a) => n + a.length, 0)} Aufrufe), ${soll.bestand.funktionen.length} Bestand ohne Ausschnitt`,
);
