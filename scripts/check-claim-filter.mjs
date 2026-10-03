#!/usr/bin/env node
// dach-018 · DIE KLASSENWAND, MASCHINELL — SPEC konto V1.1-FINAL §5 L3, Nachtrag N-10.
//
// Die Regel lautet: jede Klassenabfrage in packages/db filtert ZUERST auf den
// Ausschnitt der Sitzung. Eine Regel ohne Tor rutscht bei der 27. Datei durch —
// genau dafuer steht dieses Blatt.
//
// Sechs Pruefungen; `herkunft` ist die, ohne die die anderen Deko sind, `liste`
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
//               null Zeilen geaendert, Erfolg gemeldet.
//   herkunft  · `classScope(` wird in apps/web NUR in lib/identity.ts gerufen.
//               Der Typ kann nicht beweisen, woher seine Kennungen kommen:
//               `classScope([params.id])` uebersetzt sich tadellos und ist
//               genau das Loch. Was bleibt, ist EINE Baustelle — und diese
//               Pruefung ist es, die sie zu einer macht.
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
// GRENZEN, ehrlich: das Tor beweist, dass die gefilterte Abfrage verbraucht wird,
// nicht, dass sie die Antwort entscheidet (`return roh ?? gefiltert` waere gruen —
// dafuer gibt es claim-filter-laufzeit.test.ts und den Review). Konstante Zweige
// (`if (false)`) werden nicht ausgewertet. Filter in Rueckruf-Funktionen (`v2Safe(() =>
// …)`) zaehlen nicht; eine solche Funktion braeuchte eine eigene Regel.
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
function beruehrtKlassenTabelle(k, tabellen) {
  if (tabellen.size === 0) return false;
  const re = new RegExp(`\\.(?:from|update|insert|delete|innerJoin|leftJoin|rightJoin)\\(\\s*(?:${[...tabellen].join("|")})\\b`);
  return re.test(k);
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

function dbDateien() {
  return fs
    .readdirSync(path.join(R, DB_SRC))
    .filter((f) => f.endsWith(".ts") && !f.endsWith(".test.ts"))
    .map((f) => `${DB_SRC}/${f}`);
}

function webDateien(dir = WEB, out = []) {
  for (const e of fs.readdirSync(path.join(R, dir), { withFileTypes: true })) {
    if (e.name === "node_modules" || e.name === ".next") continue;
    const rel = `${dir}/${e.name}`;
    if (e.isDirectory()) webDateien(rel, out);
    else if (/\.tsx?$/.test(e.name)) out.push(rel);
  }
  return out;
}

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
  const sf = ts.createSourceFile(rel, src, ts.ScriptTarget.ES2022, true, ts.ScriptKind.TS);
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
  const exportiert = (st) => !!st.modifiers?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword);
  const funcs = [];
  const nimm = (name, node, exp) => {
    if (!node.body) return;
    funcs.push({
      name,
      exportiert: exp,
      node,
      koerper: ohne.slice(node.body.getStart(sf), node.body.end),
    });
  };
  // Oberste Ebene: `function f` (auch generisch — der alte Regex sah `f<T>(` nicht)
  // und `const f = (…) => …` / `const f = function …`.
  for (const st of sf.statements) {
    if (ts.isFunctionDeclaration(st) && st.name) nimm(st.name.text, st, exportiert(st));
    else if (ts.isVariableStatement(st)) {
      for (const d of st.declarationList.declarations) {
        if (ts.isIdentifier(d.name) && d.initializer && (ts.isArrowFunction(d.initializer) || ts.isFunctionExpression(d.initializer))) {
          nimm(d.name.text, d.initializer, exportiert(st));
        }
      }
    }
  }
  const a = { rel, sf, c, funcs };
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
    for (const f of a.funcs) idx.set(`${path.basename(rel)}#${f.name}`, { a, f });
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
/** Verwendungen, die den Wert LESEN (nicht `x = …`, nicht `x;`, nicht `void x`). */
function gelesen(c, nameId, fn) {
  return referenzen(c, nameId, fn).filter(
    (r) =>
      !(ts.isBinaryExpression(r.parent) && r.parent.left === r && r.parent.operatorToken.kind === ts.SyntaxKind.EqualsToken) &&
      !ts.isExpressionStatement(r.parent) &&
      !ts.isVoidExpression(r.parent),
  );
}
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
  if (ts.isVariableDeclaration(p) && p.initializer === n) return gebundeneNamen(p.name).some((id) => gelesen(a.c, id, fn).length > 0);
  if (ts.isBinaryExpression(p) && p.right === n && p.operatorToken.kind === ts.SyntaxKind.EqualsToken && ts.isIdentifier(p.left)) {
    const d = decl(a.c, p.left);
    return !!d && ts.isVariableDeclaration(d) && umschliessendeFunktion(d) === fn && gelesen(a.c, d.name, fn).length > 0;
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
  while (ts.isPropertyAccessExpression(oben.parent) && oben.parent.expression === oben && ts.isCallExpression(oben.parent.parent) && oben.parent.parent.expression === oben.parent) oben = oben.parent.parent;
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
  if (ts.isFunctionDeclaration(d) && d.name) return `${path.basename(a.rel)}#${d.name.text}`;
  if (ts.isImportSpecifier(d)) {
    const modul = d.parent.parent.parent.moduleSpecifier.text;
    if (!modul.startsWith("./")) return null;
    return `${path.basename(modul)}#${(d.propertyName ?? d.name).text}`;
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
    !!p.type && ts.isTypeReferenceNode(p.type) && p.type.typeName.getText() === "ClassScope"
  );
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
    ...[...state.web].filter(([rel]) => !/\.(?:test|spec)\.tsx?$/.test(rel)).map(([rel, src]) => [rel, src, "web"]),
    ...[...state.db].map(([rel, src]) => [rel, src, "db"]),
  ];
  for (const [rel, src, art] of quellen) {
    if (![...namen.keys()].some((n) => src.includes(n))) continue;
    const sf = ts.createSourceFile(rel, src, ts.ScriptTarget.ES2022, true, rel.endsWith(".tsx") ? ts.ScriptKind.TSX : ts.ScriptKind.TS);
    // Welcher lokale Name zeigt auf welche festgehaltene Funktion? In apps/web nur,
    // was aus @domigo/db kommt (auch umbenannt, auch als Namensraum); in packages/db
    // der eigene Name und jeder relative Import.
    const lokal = new Map();
    const raeume = new Set();
    if (art === "db") for (const [n, s] of namen) lokal.set(n, s);
    for (const st of sf.statements) {
      if (!ts.isImportDeclaration(st) || !st.importClause) continue;
      const modul = st.moduleSpecifier.text;
      if (art === "web" ? !modul.startsWith("@domigo/db") : !modul.startsWith("./")) continue;
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
      return art === "db" && name ? `${path.basename(rel)}#${name}` : null;
    };
    const notiere = (knoten, s) => {
      const p = knoten.parent;
      const ruf = ts.isCallExpression(p) && p.expression === knoten;
      raus.get(s).push({ text: `${rel} · ${ruf ? (p.arguments[1] ? normal(p.arguments[1].getText(sf)) : "—") : "WEITERGEREICHT"}`, von: von(knoten) });
    };
    (function lauf(x) {
      if (ts.isPropertyAccessExpression(x) && ts.isIdentifier(x.expression) && raeume.has(x.expression.text) && namen.has(x.name.text)) {
        notiere(x, namen.get(x.name.text));
        return;
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
      } else if (f.exportiert && !bestand.has(schluessel) && beruehrtKlassenTabelle(f.koerper, tabellen)) {
        raus.push(`${schluessel}: liest oder schreibt eine Klassen-Tabelle ohne Ausschnitt und steht in keiner Liste — Ausschnitt nehmen, oder Ausnahme mit Satz`);
      }
    }
    // Rost: der Bestand darf nur schrumpfen.
    for (const schluessel of bestand) {
      const e = k.idx.get(schluessel);
      if (!e) raus.push(`${schluessel}: steht im Bestand, die Funktion gibt es aber nicht mehr — Eintrag streichen`);
      else if (schluessel in pflicht || erlaubt[schluessel]) raus.push(`${schluessel}: steht im Bestand UND in einer anderen Liste — aus dem Bestand streichen`);
      else if (!beruehrtKlassenTabelle(e.f.koerper, tabellen)) raus.push(`${schluessel}: steht im Bestand, beruehrt aber keine Klassen-Tabelle mehr — Eintrag streichen`);
    }
    return raus;
  },

  pflicht(state) {
    const raus = [];
    const erlaubt = lade(state).ausnahmen;
    const k = kontext(state);
    for (const [schluessel, { f }] of k.idx) {
      if (!f.exportiert) continue;
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
    const raus = [];
    for (const [schluessel, { f }] of kontext(state).idx) {
      if (!f.exportiert || !f.koerper.includes("classScope")) continue;
      const schreibt = /db\s*\.\s*(insert|update|delete)\(/.test(f.koerper);
      if (schreibt && !f.koerper.includes("assertWritableScope")) {
        raus.push(`${schluessel}: schreibt mit einem Ausschnitt, ruft aber keinen assertWritableScope — ein leerer Ausschnitt aendert null Zeilen und meldet Erfolg`);
      }
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
