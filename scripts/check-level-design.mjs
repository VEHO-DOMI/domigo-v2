// R5-P1 · CHECK-LEVEL-DESIGN — die Maschinen-Checks der Design-Gesetze (doc 45 B8/B11).
//
// Fünf Prüfungen gegen das shipped Level + die v2-Dossiers (4 und 5 kamen mit
// B1 dazu, aus Kokis Replay-Entscheid vom 2026-08-11):
//  1. STEM-DEDUP (B8): kein Asset-Stem zweimal unter den WESEN-Rollen
//     {chaser,gunner,flyer,bouncer,crusher,guardian} ∪ drained — Kapitel-weit.
//     (Kokis „zwei Bleistifte — warum nicht zwei unterschiedliche Dinge?")
//  2. VOKABEL-ABDECKUNG (B8): jede wordfile-Vokabel der Unit ist klassifiziert
//     (being/thing/architecture/cards/debt) und jede being/thing-Behauptung
//     löst sich in ≥1 Level-Entity auf. Die Claims-Tabelle unten SPIEGELT
//     docs/design/g1/paint/ch01-dossiers-v2/README.md §Abdeckung — Drift
//     zwischen beiden ist selbst ein Befund.
//  3. MANIFEST-ANKER (B11): jede Entity einer Phase hat eine Manifest-Zeile im
//     v2-Dossier (per id) mit übereinstimmender (c,r)-Koordinate — und
//     umgekehrt. „Jede Platzierung braucht einen Grund" wird damit hart.
//
//  4. SCHWELLEN-ANKER (B1): jede gekreuzte Tinten-Passage ist im §10-Bau-
//     Vertrag als `- THRESHOLD …`-Zeile BENANNT, mit ihrem Checkpoint, und
//     zwar in beiden Richtungen — die Physik hält level.ts, die ABSICHT hier.
//  5. ZWECK-PFLICHT (B11): jede Entity nennt in ihrer Manifest-Zeile eine
//     FIKTION und eine MECHANIK. Block 3 beweist nur, dass die Zeile da ist;
//     ob sie etwas SAGT, prüft erst dieser Block. »Jedes Element braucht
//     seinen Zweck« (Koki, 2026-08-11).
//
// Rot ist rot: der Check ist Teil der Standing Gates (package.json) und läuft
// seit B1 auch in CI — samt `--selftest`, damit sein rotes Licht bewiesen ist.

import fs from "node:fs";
import path from "node:path";

// L0 · D10 · DIESES TOR LAEUFT JETZT JEDES KAPITEL.
//
// Hier standen vier fest verdrahtete ch01-Pfade. Sie waren nicht falsch —
// es gab genau ein Kapitel — aber sie waren die Sorte Richtigkeit, die
// beim zweiten Kapitel still zur Luege wird: ein `ch02.level.json` haette
// neben diesem Tor gelegen und waere von ihm NIE gelesen worden, und das
// Tor haette weiter »OK« gedruckt. Die Kapitel-Liste kommt jetzt aus
// `paint-chapters.mjs` (die eine geteilte Aufloesung), und jedes Kapitel
// bringt seine eigenen Eingaben mit.
import { paintChapters, skipLedger } from "./paint-chapters.mjs";

const ROOT = path.resolve(import.meta.dirname, "..");

const fails = [];
const ledger = skipLedger();

// ── 1 · STEM-DEDUP ───────────────────────────────────────────────────────────
// L0c · P19 · `scene.stage` FEHLTE HIER. Die Buehne (L2-M-a, PR #411) traegt
// einen Darsteller-Skin wie jedes andere Wesen — der Dedup liest `e.skin`, und
// er las an ihr vorbei. Zwei Buehnen haetten sich einen Skin teilen koennen,
// ohne dass ein Tor es meldet; im Spiel waeren es zwei Raeume mit demselben
// Gesicht. Gemessen am Code, nicht geraten: die Rolle heisst `scene.stage`
// (level.ts ENTITY_ROLES), und ihr Stem steht in `skin`, nicht in `params`.
const BEING_ROLES = new Set(["chaser", "gunner", "flyer", "bouncer", "crusher", "guardian", "drained", "scene.stage"]);
/** @returns {{fails: string[], stems: Map<string,string>}} */
const dedupFails = (phases, ch) => {
  const out = [];
  const seenStems = new Map();
  for (const ph of phases) {
    for (const e of ph.entities) {
      if (!BEING_ROLES.has(e.role)) continue;
      const prev = seenStems.get(e.skin);
      if (prev) out.push(`${ch} dedup: Stem "${e.skin}" doppelt — ${prev} UND ${ph.id}/${e.id} (B8)`);
      else seenStems.set(e.skin, `${ph.id}/${e.id}`);
    }
  }
  return { fails: out, stems: seenStems };
};

// ── 2 · VOKABEL-ABDECKUNG ────────────────────────────────────────────────────
// Spiegel von README §Abdeckung (Vokabel → Klasse [+ erwartete Stems]).
//
// R5-W4 · G3 (D-77, Kokis Befund vom 15.08.: „alle Assets in terms of vocabulary
// … sind NIRGENDS im Level"). Bis heute war dieser Block in zwei Richtungen
// blind:
//   · `kind:"cards"` prüfte NICHTS. Neun Kleidungswörter und `projector` trugen
//     diese Klasse und hießen damit abgedeckt — gemessen an der Antwortfläche
//     aller 54 Karten produziert ein Kind kein einziges davon. Sechs stehen als
//     ABLENKER auf zwei oddone-Karten, vier stehen überhaupt nicht auf dem
//     Schirm. Ein Ablenker ist kein Wortschatz-Erwerb; ihn als Abdeckung zu
//     zählen ist genau die Behauptung, die dieser Block prüfen soll.
//   · Ein Schlüssel, der keinen Wortbank-Eintrag trifft, war stiller toter Code.
//     `"glue stick"` und `"sharpener"` standen hier, ohne dass die Unit die
//     Wörter lehrt (die Master-Vokabelliste kennt sie nicht — die Level-Objekte
//     `obj_gluestick`/`obj_sharpener` gibt es, das WORT nicht). Beide Schlüssel
//     konnten nie feuern und nie auffallen.
//
// Ab jetzt ist jeder Anspruch entweder WAHR oder eine DEKLARIERTE, DATIERTE
// Ausnahme mit Besitzer — Form und Bedeutung übernommen vom `vocabLedger` der
// Varietäts-Policy (Gesetz 17), damit das Projekt nicht zwei Ausnahme-Sprachen
// spricht. Die Ausnahme läuft ab und kommt dann als rotes Tor zurück.
//
// „Servierbar" wird hier nicht nachgebaut: check-game-tasks Gesetz 15a/15b macht
// eine Karte, die kein Kind je erreichen kann, zum harten Fehler. Solange dieses
// Tor grün ist, ist jede Karte der Datei servierbar — Prüfung durch Konstruktion
// statt durch eine zweite, driftende Kopie des Routers.
// L0 · D10 · DIE ANSPRUCHS-TABELLE LEBT JETZT NEBEN DEM KAPITEL.
//
// Hier stand die Tabelle »Vokabel → Klasse« von ch01, 26 Zeilen lang, mitten im
// Tor. Für ein Kapitel war das die kürzeste ehrliche Form; für fünf wäre es ein
// Zusammenstoss gewesen, denn jede Kapitel-Bahn hätte in DIESELBE Datei
// schreiben müssen — und wer als Letzter merged, hätte die Ansprüche der
// anderen im Konflikt gehabt. Die Tabelle liegt jetzt als
// `docs/design/g1/paint/chNN-dossiers-v2/claims.json` neben den Dossiers, aus
// denen sie ohnehin abgeschrieben ist (README §Abdeckung). Die BEDEUTUNG der
// Klassen bleibt hier, in `claimFails` — sie ist Gesetz und kein Inhalt.
//
// Geladen statt importiert, damit ein Tamper die Tabelle per SCHLÜSSEL
// verfälschen kann statt per Textsuche: ein Tamper, der die falsche Stelle
// trifft, beweist nichts.
// L0c · P20 (R271) · `?? {}` HATTE DREI GESICHTER, UND ALLE DREI LOGEN.
//
//  (a) Eine Datei, die ihre Woerter FLACH traegt statt unter `claims`, lieferte
//      eine LEERE Tabelle — das Gesetz mass danach nichts mehr und blieb gruen.
//      Gemessen an ch05 (#396) und ch06 (#402); der Defekt war im G1-PR
//      unsichtbar und machte erst den T1-Zwilling rot, also den falschen Sitz.
//  (b) Die Zaehlzeile am Dateiende zaehlte die WORTBANK, nicht die geprueften
//      Ansprueche — 45 vor UND nach der Reparatur (L6-G1b).
//  (c) Kaputtes JSON starb als nackter SyntaxError OHNE Dateinamen.
//
// Soll-Form (`ch03-dossiers-v2/claims.json`): `schema`, `chapter`, `claims`.
export const claimsOf = (cx) => {
  if (!cx.hasClaims) return null;
  const rel = path.relative(ROOT, cx.claimsPath);
  let roh;
  try {
    roh = JSON.parse(fs.readFileSync(cx.claimsPath, "utf8"));
  } catch (e) {
    fails.push(`${cx.chapter} claims: ${rel} ist kein gueltiges JSON — ${e.message}`);
    return null;
  }
  const fehlend = ["schema", "chapter", "claims"].filter((k) => roh?.[k] === undefined);
  if (fehlend.length > 0) {
    fails.push(`${cx.chapter} claims: ${rel} fehlt ${fehlend.join(", ")} — die Soll-Form ist `
      + "{ schema, chapter, claims }. Eine flache Datei liefert eine LEERE Anspruchstabelle, "
      + "und das Abdeckungs-Gesetz misst danach nichts mehr, ohne rot zu werden (R271)");
    return null;
  }
  if (roh.chapter !== cx.chapter) {
    fails.push(`${cx.chapter} claims: ${rel} nennt sich "${roh.chapter}" — eine Anspruchstabelle, `
      + "die ein anderes Kapitel behauptet, wird gegen die falschen Karten gehalten");
    return null;
  }
  return roh.claims;
};

/** Was ein Kind auf dieser Karte PRODUZIEREN muss. Bewusst schärfer als
 *  variety.ts `answerSurfaceOf`: dort zählt eine oddone-Karte ALLE ihre Items
 *  (wer den Fremden findet, hat die Familie gelesen) — hier zählt nur `correct`.
 *  Für „Verstehen im Vorbeigehen" ist die weite Lesart richtig; für die Frage
 *  »ist dieses Wort im Kapitel überhaupt erworben worden?« ist sie es nicht.
 *  Die Doppelung ist Absicht und liegt fest: check-level-design läuft in CI als
 *  reines `node` (ci.yml) und kann die TypeScript-Engine nicht importieren.
 *  Der Selbsttest unten pinnt genau die Stelle, an der beide Lesarten
 *  auseinandergehen. */
export const answerWordsOf = (t) => {
  switch (t.kind) {
    case "choice": case "spell": return [t.answer];
    case "typed": return [t.answer, ...(t.accept ?? [])];
    case "wheel": return [t.answer]; // `shown` ist der Anlass, nicht die Antwort
    case "oddone": return [...t.correct];
    // L0c · P18 (D-840, zweiter Fund): die Chips gingen EINZELN hinein und wurden
    // dann mit ` | ` verbunden — ein mehrteiliger Wortbank-Eintrag („right arm")
    // konnte von einer Legekarte per BAUART nie eingeloest werden, waehrend
    // `variety.ts#answerSurfaceOf` dieselben Chips mit Leerzeichen verbindet und
    // ihn sehr wohl fand. Zwei Tore, zwei Antworten auf dieselbe Frage.
    case "order": return [t.orderedChips.join(" ")];
    case "mistake": return [t.fix?.correction ?? ""];
    case "memory": return t.pairs.flatMap((p) => [p.a, p.b]);
    // L2-M-a: beide Spalten. Dieses Tor misst die Vokabel-DECKUNG des Kapitels
    // („welches Wort kommt auf einer Karte vor"), nicht den Verrat — dafuer
    // zaehlt jedes Wort, das das Kind auf der Karte liest.
    case "match": return t.pairs.flatMap((p) => [p.left, p.right]);
    case "restore": return [t.name, t.colour];
    default: return [];
  }
};

/** Wortgrenzen-Treffer (dieselbe Frage, die variety.ts `hasWord` stellt). */
const saysWord = (haystack, needle) =>
  new RegExp(`(^|[^a-z'])${needle.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}($|[^a-z'])`, "i").test(haystack);

/** Der eine Block, den auch der Selbsttest fährt: Ansprüche gegen Level UND
 *  Karten, plus die Hygiene der Ausnahmen selbst. */
export const claimFails = (claims, entries, skins, items, today, clothStems = new Set()) => {
  const out = [];
  const answerBlob = items.flatMap((t) => answerWordsOf(t)).join(" | ");
  const byEn = new Map(entries.filter((e) => e.kind === "wordfile").map((e) => [e.en, e]));

  // a) kein Schlüssel ohne Wortbank-Eintrag — ein Anspruch auf ein Wort, das die
  //    Unit nicht lehrt, konnte bisher nie feuern und nie auffallen (D-77).
  for (const en of Object.keys(claims)) {
    if (!byEn.has(en)) {
      out.push(`abdeckung: Anspruch "${en}" trifft keinen wordfile-Eintrag der Unit — toter Schlüssel (D-77)`);
    }
  }

  for (const entry of entries) {
    if (entry.kind !== "wordfile") continue;
    const claim = claims[entry.en];
    if (!claim) { out.push(`abdeckung: wordfile "${entry.en}" ist unklassifiziert (README §Abdeckung nachziehen)`); continue; }
    if ((claim.kind === "being" || claim.kind === "thing") && !claim.stems.some((s) => skins.has(s))) {
      out.push(`abdeckung: "${entry.en}" behauptet ${claim.kind} [${claim.stems.join("|")}], aber kein Stem im Level (B8)`);
    }
    // ── R5-W5 · G4 · `pickup`: das Wort liegt als Sammelobjekt IM Level UND
    // steht auf der genannten Benenn-Karte. Beide Hälften, weil jede einzeln
    // wertlos ist (Design §3) — dieselbe schärfere Lesart wie `cards`: ein
    // Ablenker ist keine Antwort.
    if (claim.kind === "pickup") {
      if (!claim.stems.some((st) => clothStems.has(st))) {
        out.push(`abdeckung: "${entry.en}" behauptet ein Sammelobjekt [${claim.stems.join("|")}], aber im Level liegt kein Kleidungsstueck mit diesem Stem — eine Karte ueber ein Ding, das nirgends liegt, fragt nach etwas, das das Kind nie gesehen hat (Design §3)`);
      }
      const card = items.find((t) => t.id === claim.card);
      if (!card) {
        out.push(`abdeckung: "${entry.en}" nennt die Benenn-Karte ${claim.card}, die es nicht gibt — der Anspruch zeigt ins Leere (Design §3)`);
      } else if (![entry.en, ...(entry.forms ?? [])].some((f) => saysWord(answerWordsOf(card).join(" | "), f.toLowerCase()))) {
        out.push(`abdeckung: "${entry.en}" nennt ${claim.card}, aber dort ist es nicht die ANTWORT (Ablenker zaehlt nicht) — ein Sammelobjekt ohne Abfrage ist Dekoration (Design §3)`);
      }
      continue;
    }
    if (claim.kind !== "cards") continue;

    const answered = [entry.en, ...(entry.forms ?? [])].some((f) => saysWord(answerBlob, f.toLowerCase()));
    const ex = claim.exception;
    if (ex === undefined) {
      if (!answered) {
        out.push(`abdeckung: "${entry.en}" behauptet Karten-Abdeckung, aber keine Karte lässt es ANTWORTEN (Ablenker zählt nicht) — beantworten oder mit { why, expires, owner } deklarieren (D-77)`);
      }
      continue;
    }
    // b) eine Ausnahme, die niemand mehr braucht, versteckt die nächste Lücke
    if (answered) {
      out.push(`abdeckung: "${entry.en}" trägt eine Ausnahme, wird aber inzwischen von einer Karte beantwortet — Ausnahme entfernen (D-77)`);
      continue;
    }
    if (!ex.why || !ex.expires || !ex.owner) {
      out.push(`abdeckung: die Ausnahme für "${entry.en}" braucht why, expires UND owner — eine Lücke ohne Termin und ohne Namen ist keine Entscheidung (D-77)`);
    } else if (ex.expires < today) {
      out.push(`abdeckung: die Ausnahme für "${entry.en}" ist am ${ex.expires} abgelaufen (Besitzer: ${ex.owner}) — beantworten oder mit frischem Grund erneuern (D-77)`);
    }
  }
  return out;
};

// Der Ablauf-Termin wird gegen ein Datum geprüft, das der CHECKER liefert —
// `claimFails` bleibt rein, damit sein Selbsttest nicht mit dem Kalender rottet
// (dieselbe Trennung wie variety.ts / check-game-tasks TODAY).
const TODAY = new Date().toISOString().slice(0, 10);

/** Block 2 für EIN Kapitel. Braucht drei Eingaben (Ansprüche, Wortbank, Karten);
 *  fehlt eine, wird das Gesetz NAMENTLICH übersprungen statt still. */
const coverageFails = (cx, claims) => {
  if (claims === null) { ledger.skip(cx.chapter, "abdeckung", `keine ${path.relative(ROOT, cx.claimsPath)}`); return []; }
  if (!cx.wordbankPath || !fs.existsSync(cx.wordbankPath)) { ledger.skip(cx.chapter, "abdeckung", `keine Wortbank für Unit ${cx.unit ?? "?"}`); return []; }
  if (!cx.hasTasks) { ledger.skip(cx.chapter, "abdeckung", `kein ${cx.chapter}.tasks.v2.json`); return []; }
  const wordbank = JSON.parse(fs.readFileSync(cx.wordbankPath, "utf8"));
  const allSkins = new Set(cx.phases.flatMap((ph) => ph.entities.map((e) => e.skin)));
  return claimFails(
    claims,
    wordbank.entries,
    allSkins,
    JSON.parse(fs.readFileSync(cx.tasksPath, "utf8")).items,
    TODAY,
    // nur die Stems, die wirklich als Rolle `cloth` liegen — `pickup` fragt nach
    // dem Sammelobjekt, nicht nach irgendeinem Stem gleichen Namens
    new Set(cx.phases.flatMap((ph) => ph.entities.filter((e) => e.role === "cloth").map((e) => e.skin))),
  ).map((f) => `${cx.chapter} ${f}`);
};

// ── 2b · L0c · P18 · DIE DIFFERENZ ZWISCHEN ZWEI LESARTEN VON »EINGELOEST« ──
//
// D-840, an den laufenden Toren gemessen: `check-level-design` (D-77) liest den
// ANTWORT-TEXT jeder Karte des Kapitels, Boss und Finale eingeschlossen. Gesetz
// 17c (`variety.ts`) liest die DEKLARATION `exercises`, und nur von FELD-Karten
// (`FIELD_USES`). Beleg im Bestand: „long" stand als Antwort-Chip auf der
// Boss-Karte `boss.o1` UND als datierte Ausnahme im Vokabel-Hauptbuch — beide
// Tore gruen, die Buchfuehrung trotzdem falsch.
//
// Die gemeinsame Lesart waere teuer und falsch: die Doppelung ist Absicht (eine
// oddone-Karte zaehlt hier nur `correct`, dort alle Items), und dieses Tor
// laeuft in CI als reines `node` und kann die TypeScript-Engine gar nicht
// importieren. Die Registerzeile von D-840 nennt deshalb selbst den billigeren
// Weg, und das ist dieser: ein Gesetz, das genau die DIFFERENZ meldet.
//
// Es BERICHTET mit Zahl, statt rot zu werden (Koki, 2026-09-05): der erste Lauf
// findet 16 solcher Stellen im ausgelieferten Bestand, und ihre Reparatur liegt
// in `chNN.policy.json` — Kapitel-Dateien, die dieser Bahn gesperrt sind. Die
// Zeilen gehen namentlich an die T2-Bahnen; wer sie abraeumt, dreht `BERICHTET`
// auf `fails.push`. Eine Zeile, ein Schalter, kein zweites Register.
const ledgerDifferenz = (cx) => {
  const out = [];
  if (!cx.hasTasks || !cx.hasPolicy || !cx.wordbankPath || !fs.existsSync(cx.wordbankPath)) return out;
  let pol;
  try {
    pol = JSON.parse(fs.readFileSync(cx.policyPath, "utf8"));
  } catch (e) {
    // Nie STILL. Das Urteil ueber eine kaputte Politik faellt `check-game-tasks`
    // (dort mit Exit-Code); hier waere ein zweites Urteil ein zweiter Besitzer.
    // Aber dieser Bericht sagt, dass er dieses Kapitel NICHT gelesen hat.
    out.push(`${cx.chapter}: die Kapitel-Politik ${path.relative(ROOT, cx.policyPath)} ist kein gueltiges JSON `
      + `(${e.message}) — die Differenz-Pruefung hat dieses Kapitel ausgelassen`);
    return out;
  }
  const buch = pol.vocabLedger ?? {};
  if (Object.keys(buch).length === 0) return out;
  const bank = new Map(JSON.parse(fs.readFileSync(cx.wordbankPath, "utf8")).entries.map((e) => [e.id, e]));
  const items = JSON.parse(fs.readFileSync(cx.tasksPath, "utf8")).items ?? [];
  for (const [id, eintrag] of Object.entries(buch)) {
    const entry = bank.get(id);
    if (entry === undefined) continue;
    const formen = [entry.en, ...(entry.forms ?? [])].filter(Boolean).map((x) => String(x).toLowerCase());
    for (const t of items) {
      const flaeche = answerWordsOf(t).join(" | ");
      const treffer = formen.find((f) => saysWord(flaeche, f));
      if (treffer === undefined) continue;
      out.push(`${cx.chapter}: "${id}" steht als Ausnahme im Hauptbuch (cards: ${eintrag.cards}), `
        + `aber die Karte ${t.id} [${t.use ?? "?"}/${t.kind}] laesst das Kind „${treffer}" antworten `
        + "— eine Ausnahme, die eine Karte laengst einloest, versteckt die naechste Luecke (D-77, D-840)");
      break;
    }
  }
  return out;
};

// ── 2c · L0c · P11 (D-868) · EINE SPERRE WIRD AN DER ENGINE GEMESSEN ────────
//
// Das Erreichbarkeits-Modell verspricht ABSICHTLICH weniger, als die Engine
// traegt: es rechnet mit rund 4 Zeilen Hub, gehalten schafft der Sprung 6–7,7.
// Fuer die Frage »kommt das Kind HINAUF?« ist das sicher — wer nach dem Modell
// baut, baut erreichbar. Fuer die Frage »kommt es NICHT hinauf?« ist es genau
// falsch herum: dreimal bezahlt (L4-G1/D-868, L6-G1, L2-M-a), zuletzt an einem
// Balkon, der »ohne die Feder nicht erreichbar« hiess und in vier von sechs
// Anlaeufen ohne Feder erreicht wurde.
//
// Ein Tor kann diese Aussage nicht selbst nachmessen — dafuer braucht es die
// Sim. Es kann aber verlangen, dass NEBEN der Behauptung ein Beweis steht. Das
// hier ist deshalb eine WARNUNG mit Zeile und Datei, kein Exit-Code: die
// Behauptung ist erlaubt, das Schweigen darueber nicht.
const SPERR_BEHAUPTUNG = /(unerreichbar ohne|nicht erreichbar ohne|ohne .{1,40} nicht (?:zu )?erreich)/i;
const BAND_BEWEIS = /(Band|proof\.json|Sim|gemessen|Messfahrt|Gegenprobe|Anlaeuf|Anläuf)/i;
const sperrWarnungen = (cx) => {
  const out = [];
  if (!cx.hasDossiers) return out;
  for (const df of fs.readdirSync(cx.dossiers).filter((f) => f.endsWith(".md"))) {
    const zeilen = fs.readFileSync(path.join(cx.dossiers, df), "utf8").split("\n");
    zeilen.forEach((zeile, i) => {
      if (!SPERR_BEHAUPTUNG.test(zeile)) return;
      // Der Beweis darf drei Zeilen ueber oder unter der Behauptung stehen —
      // ein Dossier ist Prosa, kein Formular.
      const umfeld = zeilen.slice(Math.max(0, i - 3), i + 4).join(" ");
      if (BAND_BEWEIS.test(umfeld)) return;
      out.push(`${cx.chapter} ${df}:${i + 1}: behauptet eine SPERRE ("${zeile.trim().slice(0, 70)}…"), `
        + "aber in den drei Zeilen darum steht kein Band-Beweis. Eine Sperre wird an der ENGINE gemessen "
        + "(Band/Sim-Gegenprobe), nie am Reach-Modell — das verspricht absichtlich weniger, als der Motor "
        + "traegt, und ist fuer »erreichbar« sicher und fuer »gesperrt« falsch herum (D-868, README §L0.6)");
    });
  }
  return out;
};

// ── 3 · MANIFEST-ANKER ───────────────────────────────────────────────────────
const DOSSIER_OF = { p1: "p1.md", p2: "p2.md", p3: "p3.md", p9: "p9.md", p4: "arena.md" };
/** Block 3 für EIN Kapitel: jede Entity hat eine Manifest-Zeile MIT Anker, und
 *  jede Manifest-Zeile trifft etwas, das es im Level gibt. Ein Kapitel ohne
 *  Dossier-Ordner wird namentlich übersprungen — ein Entwurf hat die Räume oft
 *  eher als ihre Beschreibung. */
const manifestFails = (cx) => {
  const out = [];
  if (!cx.hasDossiers) { ledger.skip(cx.chapter, "manifest", `kein ${path.relative(ROOT, cx.dossiers)}/`); return out; }
  for (const ph of cx.phases) {
    const df = DOSSIER_OF[ph.id];
    if (!df) { out.push(`${cx.chapter} manifest: Phase ${ph.id} hat keine Dossier-Zuordnung`); continue; }
    const dp = path.join(cx.dossiers, df);
    if (!fs.existsSync(dp)) { out.push(`${cx.chapter} manifest: ${df} fehlt für Phase ${ph.id}`); continue; }
    const text = fs.readFileSync(dp, "utf8");
    // Manifest-Zeilen: | <id> | <Was> | <Anker> | … — id aus Spalte 1, die
    // (c,r)-Anker aus der ANKER-Spalte (Spalte 3; die Was-Spalte nennt oft
    // fremde Zellen wie den Exit-Glyph). Sammelzeilen "name-1/2/3" tragen ihre
    // Anker in Reihenfolge in derselben Zelle.
    const anchors = new Map();
    for (const line of text.split("\n")) {
      const cells = line.split("|");
      if (cells.length < 4) continue;
      const idm = (cells[1] ?? "").trim().match(/^([a-z0-9-]+(?:\/\d+)*)/i);
      if (!idm || !idm[1].includes("-")) continue;
      const pairs = [...(cells[3] ?? "").matchAll(/\(\s*(\d+)\s*,\s*(\d+)\s*\)/g)]
        .map((m) => ({ c: Number(m[1]), r: Number(m[2]) }));
      if (pairs.length === 0) continue;
      const multi = idm[1].match(/^([a-z0-9-]+-)(\d+)((?:\/\d+)+)$/i);
      if (multi) {
        const nums = [multi[2], ...multi[3].split("/").filter(Boolean)];
        nums.forEach((n, i) => { if (pairs[i]) anchors.set(`${multi[1]}${n}`, pairs[i]); });
      } else {
        anchors.set(idm[1], pairs[0]);
      }
    }
    for (const e of ph.entities) {
      const a = anchors.get(e.id);
      if (!a) {
        // Zweit-Träger einer fremden Zeile (z. B. »merle hidden (65,13)« in der
        // Käfig-Zeile) oder ein §10-Eintrag außerhalb der Tabelle (tafel):
        // genügt, wenn IRGENDEINE Dossier-Zeile id UND exakten Anker trägt.
        const carried = text.split("\n").some((l) => l.includes(e.id) && l.includes(`(${e.c},${e.r})`));
        if (!carried) out.push(`${cx.chapter} manifest: ${ph.id}/${e.id} hat keine Manifest-Zeile mit Anker in ${df} (B11)`);
        continue;
      }
      if (a.c !== e.c || a.r !== e.r) {
        out.push(`${cx.chapter} manifest: ${ph.id}/${e.id} Anker (${a.c},${a.r}) ≠ Level (${e.c},${e.r}) (B11)`);
      }
    }
    for (const [id, a] of anchors) {
      if (ph.entities.some((e) => e.id === id)) continue;
      // Glyph-Zeilen (Krakel-Checkpoint, Exit): der Anker muss im Grid als
      // Marker-Glyph stehen — verifiziert, nicht verziehen.
      const glyph = ph.rows[a.r]?.[a.c] ?? ".";
      if ("SCXB*".includes(glyph)) continue;
      out.push(`${cx.chapter} manifest: ${df}-Zeile "${id}" existiert nicht im Level (B11)`);
    }
  }
  return out;
};

// ── 4 · SCHWELLEN-ANKER (B1 · Checkpoint-Doktrin, Koki 2026-08-11) ───────────
// level.ts hält die PHYSIK (Checkpoint steht hinter der Tinten-Passage, dicht,
// auf Steh-Boden). Hier wird die ABSICHT gehalten: jede schwere Stelle muss im
// §10-Bau-Vertrag BENANNT sein, in einer Zeile, die die Maschine liest —
// »jedes Element braucht seinen Zweck« gilt auch für die Schwierigkeit selbst.
// Format (eine Zeile je Passage, in §10):
//   - THRESHOLD <id> | cols <west>–<east> | checkpoint (<c>,<r>) | <Begründung>
// Geprüft in BEIDEN Richtungen, wie die Manifest-Anker darüber.
export const thresholdFails = (lvl, dossierDir) => {
  const out = [];
  const phs = [...lvl.phases, ...(lvl.bonus ? [lvl.bonus] : []), ...(lvl.arena ? [lvl.arena] : [])];
  const TH = /^-\s+THRESHOLD\s+([a-z0-9-]+)\s*\|\s*cols\s+(\d+)\s*[–-]\s*(\d+)\s*\|\s*checkpoint\s+\((\d+)\s*,\s*(\d+)\)\s*\|\s*(.+?)\s*$/i;
  for (const ph of phs) {
    const df = DOSSIER_OF[ph.id];
    if (!df) continue;
    const dp = path.join(dossierDir, df);
    if (!fs.existsSync(dp)) continue;
    const text = fs.readFileSync(dp, "utf8");

    const w = ph.rows[0]?.length ?? 0;
    const inkCol = (c) => ph.rows.some((row) => row[c] === "w");
    const runs = [];
    for (let c = 0, from = null; c <= w; c++) {
      if (c < w && inkCol(c)) { if (from === null) from = c; }
      else if (from !== null) { runs.push({ west: from, east: c - 1 }); from = null; }
    }
    const find = (g) => { for (const [r, row] of ph.rows.entries()) { const c = row.indexOf(g); if (c >= 0) return { c, r }; } return null; };
    const S = find("S"); const X = find("X") ?? find("B");
    if (!S || !X) continue;
    const eastward = X.c > S.c;
    const crossings = runs.filter((p) => (eastward ? S.c < p.west && X.c > p.east : S.c > p.east && X.c < p.west));

    const declared = [];
    for (const line of text.split("\n")) {
      const m = line.trim().match(TH);
      if (m) declared.push({ id: m[1], west: Number(m[2]), east: Number(m[3]), c: Number(m[4]), r: Number(m[5]), why: m[6] });
    }
    // a) jede echte Passage ist benannt
    for (const p of crossings) {
      const hit = declared.filter((d) => d.west === p.west && d.east === p.east);
      if (hit.length === 0) { out.push(`schwelle: ${ph.id} kreuzt Tinte c${p.west}–${p.east} ohne THRESHOLD-Zeile in ${df} §10 (B1)`); continue; }
      if (hit.length > 1) out.push(`schwelle: ${ph.id} nennt c${p.west}–${p.east} ${hit.length}× in ${df} (B1)`);
      const d = hit[0];
      const glyph = ph.rows[d.r]?.[d.c] ?? ".";
      if (glyph !== "C") out.push(`schwelle: ${df}-Zeile "${d.id}" deklariert Krakel (${d.c},${d.r}), das Grid trägt dort "${glyph}" (B1)`);
    }
    // b) …und keine Zeile erfindet eine Passage, die es nicht gibt
    for (const d of declared) {
      if (!crossings.some((p) => p.west === d.west && p.east === d.east)) {
        out.push(`schwelle: ${df}-Zeile "${d.id}" nennt c${d.west}–${d.east}, dort kreuzt ${ph.id} keine Tinte (B1)`);
      }
    }
  }
  return out;
};

// ── 6 · BUCHSTABEN-ANKER (R5-W4 · B4 · R45) ─────────────────────────────────
// Block 3 bindet jede ENTITY an ihre Manifest-Zeile. Die Buchstaben-Zeilen fielen
// dabei durch das Netz: ihre erste Zelle heißt „O·O·L", nicht „p1-moths-1", und
// der Parser dort verlangt ein „-" in der id. Ergebnis: die einzige Maschinen-
// Prüfung auf ein `*` war `collectible-reachable` in level.ts — WO die Zellen
// liegen, stand nur in der Prosa, und eine Prosa-Zeile, die niemand liest, ist
// nach dem ersten Umzug falsch. (Genau das war sie: diese Runde verschiebt zwei
// O, und ohne diesen Block hätten p1.md und p9.md still die alten Koordinaten
// weitergetragen.)
//
// Format (eine Zeile je Buchstaben-Gruppe, in der Manifest-Tabelle):
//   | A·B·C | … | **(c,r) (c,r) (c,r)** | …
// Geprüft in beiden Richtungen — und, WENN eine Schreibung mitgegeben wird, auch
// gegen sie: die Kette muss die Zeichen tragen, die letters.ts an genau diesen
// Zellen ausgibt. Dieses Skript läuft in CI mit blankem `node` und kann
// composition.ts (TypeScript) deshalb nicht importieren, also lässt es die
// Zeichen-Hälfte aus und prüft die KOORDINATEN — das ist die Klasse, die
// verrottet. Der Selbsttest unten reicht eine Schreibung herein und hat das rote
// Licht beider Hälften gesehen.
export const letterAnchorFails = (lvl, dossierDir, spellOf = () => "") => {
  const out = [];
  const phs = [...lvl.phases, ...(lvl.bonus ? [lvl.bonus] : []), ...(lvl.arena ? [lvl.arena] : [])];
  for (const ph of phs) {
    const df = DOSSIER_OF[ph.id];
    if (!df) continue;
    const dp = path.join(dossierDir, df);
    if (!fs.existsSync(dp)) continue;

    // every `*` of the phase, in the order letters.ts hands out the characters
    const stars = [];
    ph.rows.forEach((row, r) => [...row].forEach((g, c) => { if (g === "*") stars.push({ c, r }); }));
    stars.sort((a, b) => a.c - b.c || a.r - b.r);
    if (stars.length === 0) continue;
    const spelled = spellOf(ph.id);
    const charAt = (i) => (spelled.length > 0 ? (spelled[i % spelled.length] ?? "?") : "?");

    const claimed = new Map(); // "c,r" → the letter row that claims it
    for (const line of fs.readFileSync(dp, "utf8").split("\n")) {
      const cells = line.split("|");
      if (cells.length < 4) continue;
      const id = (cells[1] ?? "").trim();
      // a letter row is a chain of single characters joined by "·" — the one
      // shape Block 3's id rule can never match, which is why it was invisible
      if (!/^[A-Za-z](·[A-Za-z])*$/.test(id)) continue;
      const chain = id.split("·");
      // Only the FIRST bold group of the Anker cell counts. The dossiers bold
      // the live coordinates and then argue underneath them, and that argument
      // can itself quote cells — p3's E·S·T row carries the three anchors plus
      // the three pre-B1 ones it replaced, inside its own „ALS GEBAUT" note.
      // Reading the whole cell turned that history into six anchors.
      const anker = (cells[3] ?? "");
      const bold = anker.match(/\*\*([^*]+)\*\*/);
      const scope = bold ? bold[1] : anker;
      const pairs = [...scope.matchAll(/\(\s*(\d+)\s*,\s*(\d+)\s*\)/g)].map((m) => ({ c: Number(m[1]), r: Number(m[2]) }));
      if (pairs.length !== chain.length) {
        out.push(`buchstaben: ${df}-Zeile "${id}" nennt ${chain.length} Zeichen, aber ${pairs.length} Zelle(n)`);
        continue;
      }
      for (const [k, cell] of pairs.entries()) {
        const key = `${cell.c},${cell.r}`;
        if (claimed.has(key)) out.push(`buchstaben: ${df} nennt (${key}) zweimal ("${claimed.get(key)}" und "${id}")`);
        claimed.set(key, id);
        const glyph = ph.rows[cell.r]?.[cell.c] ?? ".";
        if (glyph !== "*") {
          out.push(`buchstaben: ${df}-Zeile "${id}" deklariert einen Buchstaben (${key}), das Grid trägt dort "${glyph}"`);
          continue;
        }
        if (spelled.length === 0) continue; // coordinates only — see the note above
        const idx = stars.findIndex((s) => s.c === cell.c && s.r === cell.r);
        const want = charAt(idx);
        if (chain[k].toUpperCase() !== want.toUpperCase()) {
          out.push(`buchstaben: ${df}-Zeile "${id}" nennt "${chain[k]}" bei (${key}), der Trail buchstabiert dort "${want}"`);
        }
      }
    }
    // …und keine Zelle bleibt unbenannt
    for (const [i, s] of stars.entries()) {
      if (!claimed.has(`${s.c},${s.r}`)) {
        const who = spelled.length > 0 ? ` "${charAt(i)}"` : ` #${i}`;
        out.push(`buchstaben: ${ph.id} trägt den Buchstaben${who} bei (${s.c},${s.r}), ${df} nennt die Zelle in keiner Buchstaben-Zeile`);
      }
    }
  }
  return out;
};

// ── SELBSTTEST (`--selftest`) ────────────────────────────────────────────────
// Bis heute hatte dieses Gate als EINZIGES dieser Spur keinen Tamper-Beweis.
// Ein Check, dessen rotes Licht nie jemand gesehen hat, ist eine Behauptung.
// Geprüft wird beides: die LOGIK und der Markdown-PARSER — an einem
// Regex-über-Markdown stirbt ein Gate lautlos.
if (process.argv.includes("--selftest")) {
  const os = await import("node:os");
  // L0 · D10 · DIE ECHT-DATEN-FÄLLE BRAUCHEN EIN ECHTES KAPITEL. Sie hingen an
  // den modulweiten ch01-Bindungen, die es nicht mehr gibt. Genommen wird das
  // erste FERTIGE Kapitel (nie ein Entwurf): ein Entwurf hat per Definition
  // keine vollständigen Eingaben, und ein Selbsttest, der auf halben Daten
  // grün wird, hat nichts bewiesen. Fehlt ein fertiges Kapitel, sagt der
  // Selbsttest das laut, statt seine Fälle stumm zu überspringen.
  const REAL = paintChapters().find((c) => !c.draft && c.hasClaims && c.hasTasks && c.wordbankPath && fs.existsSync(c.wordbankPath));
  if (!REAL) {
    console.error("check-level-design --selftest: kein fertiges Kapitel mit Ansprüchen, Karten und Wortbank — die Echt-Daten-Fälle können nicht laufen");
    process.exit(1);
  }
  const CLAIMS = claimsOf(REAL);
  const wordbank = JSON.parse(fs.readFileSync(REAL.wordbankPath, "utf8"));
  const allSkins = new Set(REAL.phases.flatMap((ph) => ph.entities.map((e) => e.skin)));
  const phases = REAL.phases;
  const TASKS = REAL.tasksPath;
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "cld-selftest-"));
  const rows = ["####################", ...Array.from({ length: 17 }, () => "....................")];
  rows.push("..S.........C.X.....", `${"#".repeat(8)}www${"#".repeat(9)}`, `${"#".repeat(8)}www${"#".repeat(9)}`);
  const lvl = { phases: [{ id: "p1", rows, entities: [] }] };
  const GOOD = "- THRESHOLD p1-becken | cols 8–10 | checkpoint (12,18) | die eine Tinte der Phase\n";
  const write = (body) => { fs.writeFileSync(path.join(tmp, "p1.md"), body); return thresholdFails(lvl, tmp); };
  const cases = [
    ["die wahre Zeile ist grün", write(GOOD), (f) => f.length === 0],
    ["THRESHOLD-Zeile gelöscht", write("kein Vertrag hier\n"), (f) => f.some((x) => /ohne THRESHOLD-Zeile/.test(x))],
    ["Spalten um eine verschoben", write("- THRESHOLD p1-becken | cols 8–11 | checkpoint (12,18) | x\n"), (f) => f.length === 2],
    ["Checkpoint zeigt auf eine leere Zelle", write("- THRESHOLD p1-becken | cols 8–10 | checkpoint (13,18) | x\n"), (f) => f.some((x) => /das Grid trägt dort/.test(x))],
    ["erfundene Passage", write(`${GOOD}- THRESHOLD p1-geist | cols 2–3 | checkpoint (12,18) | x\n`), (f) => f.some((x) => /kreuzt \w+ keine Tinte/.test(x))],
    ["Zeile doppelt", write(GOOD + GOOD), (f) => f.some((x) => /2×/.test(x))],
    ["Prosa fehlt → Zeile zählt NICHT als Deklaration", write("- THRESHOLD p1-becken | cols 8–10 | checkpoint (12,18) |\n"), (f) => f.some((x) => /ohne THRESHOLD-Zeile/.test(x))],
  ];

  // ── Block 2 · die Abdeckungs-Ansprüche (R5-W4 · G3, D-77) ──────────────────
  // Bis heute prüfte `kind:"cards"` NICHTS — ein Gesetz, dessen rotes Licht
  // niemand je gesehen hat, ist eine Behauptung. Die Fälle sind bewusst PAARE:
  // dieselbe Karte, dieselbe Wortbank, nur die eine Eigenschaft bewegt sich, um
  // die es geht. Ein Tamper, der auch bei falscher Logik feuert, beweist nichts.
  const ENTRY = (en, forms = [en]) => ({ id: `x.${en}`, kind: "wordfile", en, forms });
  const NOSKINS = new Set();
  const IN_2026 = "2026-08-15";
  const askShirt = { kind: "choice", answer: "shirt" };
  // die echte Form aus enc.ranzen.q3: `shirt` ist ITEM, aber nicht `correct`
  const oddoneShirt = { kind: "oddone", items: ["school tie", "shirt", "socks", "pencil"], correct: ["pencil"] };
  const EX = { why: "w", expires: "2026-12-31", owner: "Welle 5 / Uniform" };
  const claims2 = (claims, entries, items, today = IN_2026) => claimFails(claims, entries, NOSKINS, items, today);

  cases.push(
    ["ABDECKUNG · ein `cards`-Anspruch ohne Antwort-Karte ist rot",
      claims2({ shirt: { kind: "cards" } }, [ENTRY("shirt")], []),
      (f) => f.some((x) => /keine Karte lässt es ANTWORTEN/.test(x))],
    ["ABDECKUNG · derselbe Anspruch mit Antwort-Karte ist grün",
      claims2({ shirt: { kind: "cards" } }, [ENTRY("shirt")], [askShirt]),
      (f) => f.length === 0],
    // DAS Paar, um das es geht: identische Karte bis auf `correct`
    ["ABDECKUNG · ein ABLENKER ist keine Antwort (die Stelle, an der diese Lesart von variety.ts abweicht)",
      claims2({ shirt: { kind: "cards" } }, [ENTRY("shirt")], [oddoneShirt]),
      (f) => f.some((x) => /keine Karte lässt es ANTWORTEN/.test(x))],
    ["ABDECKUNG · …und dieselbe oddone-Karte wird grün, sobald das Wort die LÖSUNG ist",
      claims2({ shirt: { kind: "cards" } }, [ENTRY("shirt")], [{ ...oddoneShirt, correct: ["shirt"] }]),
      (f) => f.length === 0],
    ["ABDECKUNG · eine deklarierte, gültige Ausnahme schweigt",
      claims2({ shirt: { kind: "cards", exception: EX } }, [ENTRY("shirt")], []),
      (f) => f.length === 0],
    ["ABDECKUNG · eine ABGELAUFENE Ausnahme ist rot",
      claims2({ shirt: { kind: "cards", exception: { ...EX, expires: "2026-01-01" } } }, [ENTRY("shirt")], []),
      (f) => f.some((x) => /abgelaufen/.test(x))],
    ["ABDECKUNG · eine Ausnahme ohne Besitzer ist rot",
      claims2({ shirt: { kind: "cards", exception: { why: "w", expires: "2026-12-31" } } }, [ENTRY("shirt")], []),
      (f) => f.some((x) => /why, expires UND owner/.test(x))],
    ["ABDECKUNG · eine Ausnahme auf einem inzwischen beantworteten Wort ist rot (sie versteckt die nächste Lücke)",
      claims2({ shirt: { kind: "cards", exception: EX } }, [ENTRY("shirt")], [askShirt]),
      (f) => f.some((x) => /inzwischen von einer Karte beantwortet/.test(x))],
    // ── R5-W5 · G4 · der Anspruchstyp `pickup` (Design §3) ────────────────────
    // Wieder PAARE: `pickup` prüft ZWEI Hälften, also braucht jede Hälfte ihren
    // eigenen Fall, in dem nur sie sich bewegt — sonst könnte eine Hälfte kaputt
    // sein und das Tor bliebe grün, weil die andere trägt.
    ["PICKUP · ohne Sammelobjekt im Level ist rot (Karte allein reicht nicht)",
      claims2({ shirt: { kind: "pickup", stems: ["cloth_shirt"], card: "uni.shirt" } }, [ENTRY("shirt")],
        [{ id: "uni.shirt", kind: "choice", answer: "shirt" }]),
      (f) => f.some((x) => /kein Kleidungsstueck mit diesem Stem/.test(x))],
    ["PICKUP · mit Sammelobjekt UND Antwort-Karte ist grün",
      claimFails({ shirt: { kind: "pickup", stems: ["cloth_shirt"], card: "uni.shirt" } }, [ENTRY("shirt")], NOSKINS,
        [{ id: "uni.shirt", kind: "choice", answer: "shirt" }], IN_2026, new Set(["cloth_shirt"])),
      (f) => f.length === 0],
    ["PICKUP · ohne die genannte Karte ist rot (Sammelobjekt allein reicht nicht)",
      claimFails({ shirt: { kind: "pickup", stems: ["cloth_shirt"], card: "uni.shirt" } }, [ENTRY("shirt")], NOSKINS,
        [], IN_2026, new Set(["cloth_shirt"])),
      (f) => f.some((x) => /die es nicht gibt/.test(x))],
    ["PICKUP · das Wort nur als ABLENKER auf der genannten Karte ist rot",
      claimFails({ shirt: { kind: "pickup", stems: ["cloth_shirt"], card: "uni.shirt" } }, [ENTRY("shirt")], NOSKINS,
        [{ id: "uni.shirt", ...oddoneShirt }], IN_2026, new Set(["cloth_shirt"])),
      (f) => f.some((x) => /nicht die ANTWORT/.test(x))],
    ["PICKUP · eine ANDERE Karte, die das Wort beantwortet, rettet den Anspruch NICHT (er nennt seine Karte)",
      claimFails({ shirt: { kind: "pickup", stems: ["cloth_shirt"], card: "uni.shirt" } }, [ENTRY("shirt")], NOSKINS,
        [{ id: "irgendeine.andere", kind: "choice", answer: "shirt" }], IN_2026, new Set(["cloth_shirt"])),
      (f) => f.some((x) => /die es nicht gibt/.test(x))],
    ["ABDECKUNG · ein Anspruch auf ein Wort, das die Unit nicht lehrt, ist toter Schlüssel",
      claims2({ sharpener: { kind: "thing", stems: ["obj_sharpener"] }, shirt: { kind: "cards", exception: EX } }, [ENTRY("shirt")], []),
      (f) => f.some((x) => /toter Schlüssel/.test(x))],
    ["ABDECKUNG · die Pluralform zählt als Antwort (D-75: „shoes\" beantwortet `shoe`)",
      claims2({ shoe: { kind: "cards" } }, [ENTRY("shoe", ["shoe", "shoes"])], [{ kind: "choice", answer: "shoes" }]),
      (f) => f.length === 0],
    // ── R5-W6 · G5 · der Projektor, ohne Ausnahme (R148) ─────────────────────
    // Die datierte Ausnahme ist gestrichen, weil der Projektor als GELÄNDE im
    // Raum steht (p2, Turm c55–56 / r1–7) und deshalb `architecture` ist. Der
    // Fall unten ist der Beweis, dass sie nicht bloß weggeräumt wurde: gegen die
    // ECHTE Wortbank und die ECHTEN 70 Karten gemessen, beantwortet KEINE Karte
    // das Wort — wäre es anders, hätte der Anspruch `cards` heißen müssen, und
    // dieser Fall würde nicht mehr beißen. Rot zuerst gesehen.
    ["PROJEKTOR · als `cards` gegen die echten Karten ist rot — kein Kartenschluss beantwortet das Wort",
      claims2({ projector: { kind: "cards" } },
        wordbank.entries.filter((e) => e.en === "projector"),
        JSON.parse(fs.readFileSync(TASKS, "utf8")).items, TODAY),
      (f) => f.some((x) => /keine Karte lässt es ANTWORTEN/.test(x))],
    // Und die EHRLICHKEITS-GRENZE derselben Entscheidung, ausdrücklich gepinnt:
    // `architecture` prüft NICHTS (D-25 hat das an `ruler` schon einmal bezahlt,
    // als die Fähre aus dem Raum flog und der Anspruch stumm weiterlief). Der
    // Fall hält fest, dass diese Klasse ein Versprechen des MENSCHEN ist, kein
    // gemessenes — wer sie vergibt, muss das Ding im Level nachgeschlagen haben.
    ["PROJEKTOR · `architecture` schweigt auch ohne jedes Objekt im Level — die Klasse ist ein Versprechen, keine Messung (D-25)",
      claims2({ projector: { kind: "architecture" } },
        wordbank.entries.filter((e) => e.en === "projector"), []),
      (f) => f.length === 0],
    ["NICHT-TAMPER · der echte Anspruchssatz gegen die echte Wortbank und die echten Karten bleibt still",
      claimFails(CLAIMS, wordbank.entries, allSkins, JSON.parse(fs.readFileSync(TASKS, "utf8")).items, TODAY, new Set(phases.flatMap((ph) => ph.entities.filter((e) => e.role === "cloth").map((e) => e.skin)))),
      (f) => f.length === 0],
  );
  // ── Block 6 · Buchstaben-Anker (R45) ──────────────────────────────────────
  // Eigene Welt: drei `*` in bekannter Spalten-Ordnung, Wort „ABC".
  const lrows = ["####################", ...Array.from({ length: 17 }, () => "....................")];
  lrows[10] = "....*......*...*....";           // c4, c11, c15
  lrows.push("..S...............X.", "#".repeat(20), "#".repeat(20));
  const llvl = { phases: [{ id: "p1", rows: lrows, entities: [] }] };
  const spell = () => "ABC";
  const lwrite = (body) => { fs.writeFileSync(path.join(tmp, "p1.md"), body); return letterAnchorFails(llvl, tmp, spell); };
  const LGOOD = "| A·B·C | Buchstaben | **(4,10) (11,10) (15,10)** | Prosa | Mechanik |\n";
  cases.push(
    ["BUCHSTABEN: die wahre Zeile ist grün", lwrite(LGOOD), (f) => f.length === 0],
    ["BUCHSTABEN: eine Koordinate veraltet", lwrite("| A·B·C | Buchstaben | **(4,10) (12,10) (15,10)** | p | m |\n"),
      (f) => f.some((x) => /das Grid trägt dort "\."/.test(x)) && f.some((x) => /in keiner Buchstaben-Zeile/.test(x))],
    ["BUCHSTABEN: Zeile ganz gelöscht", lwrite("nichts hier\n"), (f) => f.length === 3],
    ["BUCHSTABEN: Zeichen und Trail widersprechen sich", lwrite("| A·C·B | Buchstaben | **(4,10) (11,10) (15,10)** | p | m |\n"),
      (f) => f.some((x) => /nennt "C" bei \(11,10\), der Trail buchstabiert dort "B"/.test(x))],
    ["BUCHSTABEN: Kette und Zellen zählen verschieden", lwrite("| A·B·C | Buchstaben | **(4,10) (11,10)** | p | m |\n"),
      (f) => f.some((x) => /nennt 3 Zeichen, aber 2 Zelle\(n\)/.test(x))],
  );
  // ── Block 7 · L0c · P19 · `scene.stage` im Stem-Dedup ─────────────────────
  // Ein SPIELZEUG-Level, nie ein echtes Kapitel: der Tamper soll die Regel
  // treffen, nicht den Bestand.
  const buehne = (id, skin) => ({ id, role: "scene.stage", skin, c: 5, r: 17, tier: "E" });
  cases.push(
    ["BUEHNE: zwei scene.stage mit demselben Darsteller-Skin sind ein Doppel",
      dedupFails([{ id: "p1", entities: [buehne("b1", "papagei"), buehne("b2", "papagei")] }], "ch99").fails,
      (f) => f.some((x) => /dedup: Stem "papagei" doppelt/.test(x))],
    ["BUEHNE: zwei scene.stage mit VERSCHIEDENEN Skins sind still",
      dedupFails([{ id: "p1", entities: [buehne("b1", "papagei"), buehne("b2", "loewe")] }], "ch99").fails,
      (f) => f.length === 0],
    ["…und der Dedup liest `skin`, nicht `params` — eine Buehne ohne Skin-Doppel bleibt gruen",
      dedupFails([{ id: "p1", entities: [{ ...buehne("b1", "papagei"), params: { actorSkin: "loewe" } },
                                          { ...buehne("b2", "loewe"), params: { actorSkin: "papagei" } }] }], "ch99").fails,
      (f) => f.length === 0],
  );

  // ── Block 8 · L0c · P20 · die drei Gesichter von `?? {}` ──────────────────
  // Jede Verfaelschung sitzt auf einer WEGWERF-Datei im Temp-Ordner, und die
  // Meldung wird aus `fails` gefischt: `claimsOf` urteilt dort, wo es liest.
  const claimsProbe = (inhalt) => {
    const p = path.join(tmp, "claims.json");
    fs.writeFileSync(p, inhalt);
    const vorher = fails.length;
    const ergebnis = claimsOf({ chapter: "ch99", hasClaims: true, claimsPath: p });
    const neue = fails.splice(vorher);   // aus dem echten Lauf wieder heraus
    return { ergebnis, neue };
  };
  cases.push(
    ["ANSPRUECHE: die Soll-Form ist gruen und liefert die Tabelle",
      claimsProbe(JSON.stringify({ schema: "paint-claims@1", chapter: "ch99", claims: { shirt: { kind: "cards" } } })),
      (r) => r.neue.length === 0 && Object.keys(r.ergebnis ?? {}).length === 1],
    ["ANSPRUECHE: eine FLACHE Datei faellt nicht mehr still auf leer",
      claimsProbe(JSON.stringify({ shirt: { kind: "cards" } })),
      (r) => r.ergebnis === null && r.neue.some((x) => /fehlt schema, chapter, claims/.test(x))],
    ["ANSPRUECHE: ein fremdes Kapitel im Kopf wird genannt",
      claimsProbe(JSON.stringify({ schema: "paint-claims@1", chapter: "ch07", claims: {} })),
      (r) => r.ergebnis === null && r.neue.some((x) => /nennt sich "ch07"/.test(x))],
    ["ANSPRUECHE: kaputtes JSON stirbt MIT Dateinamen, nicht als nackter SyntaxError",
      claimsProbe("{ das ist kein JSON"),
      (r) => r.ergebnis === null && r.neue.some((x) => /claims\.json ist kein gueltiges JSON/.test(x))],
  );

  let bad = 0;
  for (const [name, got, ok] of cases) {
    const pass = ok(got);
    if (!pass) bad++;
    console.log(`  ${pass ? "✓" : "✗"} ${name}${pass ? "" : ` → ${JSON.stringify(got)}`}`);
  }
  fs.rmSync(tmp, { recursive: true, force: true });
  console.log(bad ? `check-level-design --selftest: ${bad} Fälle bissen NICHT` : `check-level-design --selftest: OK — ${cases.length} Fälle, jedes rote Licht gesehen`);
  process.exit(bad ? 1 : 0);
}

// ── 5 · ZWECK-PFLICHT (B11 · Kokis Entscheid 2026-08-11) ────────────────────
// »…und jedes Element braucht seinen Zweck.« Block 3 beweist, dass jede Entity
// eine Manifest-Zeile MIT ANKER hat — er liest aber nie, ob die Zeile etwas
// SAGT. Eine Zeile mit leerer Mechanik-Spalte ist genau das Zweck-Loch, das
// B11 verbietet, und sie kam bisher durch jedes Gate.
// Spalten des Begründungs-Manifests: | id | Was | Anker | Fiktion | Mechanik | Gesetz | Kunst |
const EMPTY_CELL = /^(|—|-|–|\?+|tbd|TBD|n\/a)$/;
/** Block 5 für EIN Kapitel. */
const purposeFails = (cx) => {
  const out = [];
  if (!cx.hasDossiers) { ledger.skip(cx.chapter, "zweck", `kein ${path.relative(ROOT, cx.dossiers)}/`); return out; }
  for (const ph of cx.phases) {
    const df = DOSSIER_OF[ph.id];
    if (!df) continue;
    const dp = path.join(cx.dossiers, df);
    if (!fs.existsSync(dp)) continue;
    const rowOf = new Map();
    for (const line of fs.readFileSync(dp, "utf8").split("\n")) {
      const cells = line.split("|");
      if (cells.length < 7) continue;
      const idm = (cells[1] ?? "").trim().match(/^([a-z0-9-]+)/i);
      if (!idm || !idm[1].includes("-")) continue;
      rowOf.set(idm[1], { fiktion: (cells[4] ?? "").trim(), mechanik: (cells[5] ?? "").trim() });
    }
    for (const e of ph.entities) {
      const row = rowOf.get(e.id);
      if (!row) continue; // Block 3 meldet fehlende Zeilen bereits
      if (EMPTY_CELL.test(row.mechanik)) {
        out.push(`${cx.chapter} zweck: ${ph.id}/${e.id} nennt keinen MECHANISCHEN Zweck in ${df} §3 — jedes Element braucht seinen Zweck (B11)`);
      }
      if (EMPTY_CELL.test(row.fiktion)) {
        out.push(`${cx.chapter} zweck: ${ph.id}/${e.id} nennt keine FIKTION in ${df} §3 — warum steht es da, in der Welt? (B11)`);
      }
    }
  }
  return out;
};

// ── DER TREIBER · JEDES KAPITEL, IN DERSELBEN REIHENFOLGE ────────────────────
//
// Was für ein ENTWURF gilt (L0 · D10): die Gesetze, deren Eingaben dastehen,
// laufen. Was fehlt, wird über `ledger` NAMENTLICH gemeldet und unten neben der
// OK-Zeile gedruckt. Eine stille Auslassung ist von einem defekten Tor nicht
// zu unterscheiden — und ein Tor, das nur die Kapitel kennt, für die es je
// gelaufen ist, ist genau die Klasse, die diese Bahn schliesst.
const CHAPTERS = paintChapters();
const differenzen = [];
const warnungen = [];
let stemCount = 0;
let vocabCount = 0;
let phaseCount = 0;
for (const cx of CHAPTERS) {
  const dedup = dedupFails(cx.phases, cx.chapter);
  stemCount += dedup.stems.size;
  phaseCount += cx.phases.length;
  fails.push(...dedup.fails);
  // L0c · P20 (b): EINMAL laden, zweimal benutzt — eine kaputte Anspruchsdatei
  // wuerde sonst zweimal gemeldet, und zwei Zeilen fuer einen Defekt lesen sich
  // wie zwei Defekte.
  const claims = claimsOf(cx);
  fails.push(...coverageFails(cx, claims));
  // …und die Zahl kommt aus der GEPRUEFTEN Tabelle, nicht aus der Wortbank
  // daneben. Die alte Zeile zaehlte die Wortbank und stand deshalb bei 45 —
  // vor UND nach der Reparatur einer leeren Anspruchsdatei (L6-G1b).
  if (claims !== null) vocabCount += Object.keys(claims).length;
  differenzen.push(...ledgerDifferenz(cx));
  warnungen.push(...sperrWarnungen(cx));
  fails.push(...manifestFails(cx));
  fails.push(...purposeFails(cx));
  if (cx.hasDossiers) {
    fails.push(...thresholdFails(cx.level, cx.dossiers).map((f) => `${cx.chapter} ${f}`));
    fails.push(...letterAnchorFails(cx.level, cx.dossiers).map((f) => `${cx.chapter} ${f}`));
  } else {
    ledger.skip(cx.chapter, "schwellen+buchstaben-anker", `kein ${path.relative(ROOT, cx.dossiers)}/`);
  }
}

if (CHAPTERS.length === 0) {
  // Anti-Leerlauf: ein Tor, das nichts findet, muss das SAGEN. Sonst liest sich
  // ein kaputter Pfad wie ein grünes Tor (die Klasse, die der Wortfenster-Sweep
  // an seinem eigenen leeren Heuhaufen gefangen hat).
  console.error("check-level-design: KEIN Kapitel gefunden — content/corpus/stories/*/paint/chNN.level.json ist leer");
  process.exit(1);
}
// ★ L0 · DER SKIP-BERICHT STEHT VOR DEM URTEIL, NICHT DANACH.
// Ein blinder Leser fand ihn hinter `process.exit(1)`: im ROTEN Lauf wurde er
// nie gedruckt — ausgerechnet dann, wenn jemand wissen muss, welche Gesetze
// mangels Eingaben gar nicht liefen. Der Mechanismus gegen stille Auslassung
// war selbst still, sobald es darauf ankam.
// L0b · D-792 · EINE LÜCKE IN EINEM FERTIGEN KAPITEL IST ROT, NICHT NUR NOTIERT.
// L0 hat sie GESAGT und nicht GEURTEILT — beide Tore blieben grün. Ein
// Abschluss-PR, der `draft` entfernt und die Dossiers oder die Kartendatei
// vergisst, wäre hier still durchgegangen. `draft:true` bleibt der namentliche
// Skip; ohne die Flagge ist dasselbe Fehlen ein Loch.
for (const g of ledger.gaps()) {
  fails.push(`${g} — das Kapitel trägt KEINE draft-Flagge, ist also fertig: eine fehlende Eingabe ist hier ein Loch, keine Bauphase (D-792)`);
}

// L0c · P18: BERICHTET, mit Zahl — vor dem Urteil, damit ein roter Lauf sie
// auch zeigt (L0-Lehre: eine Diagnose hinter dem Exit-Code ist keine Diagnose).
if (differenzen.length > 0) {
  console.log(`check-level-design: ${differenzen.length} Hauptbuch-Ausnahmen, die eine Karte laengst einloest (D-840, berichtet — nicht rot):`);
  for (const d of differenzen) console.log(`  · ${d}`);
}
if (warnungen.length > 0) {
  console.log(`check-level-design: ${warnungen.length} Sperr-Behauptung(en) ohne Band-Beweis (WARNUNG — nicht rot):`);
  for (const w of warnungen) console.log(`  · ${w}`);
}
ledger.print();
if (fails.length) {
  console.error(`check-level-design: ${fails.length} Verstöße`);
  for (const f of fails) console.error("  ✗ " + f);
  process.exit(1);
}
console.log(`check-level-design: OK — ${CHAPTERS.length} Kapitel (${CHAPTERS.map((c) => c.chapter + (c.draft ? " [Entwurf]" : "")).join(", ")}): Dedup (${stemCount} Wesen-Stems einmalig), Abdeckung (${vocabCount} Vokabeln klassifiziert), Manifest-Anker deckungsgleich über ${phaseCount} Phasen, Schwellen benannt, Buchstaben-Anker deckungsgleich, jede Entity mit Zweck`);
