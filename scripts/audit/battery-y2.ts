#!/usr/bin/env node
/**
 * Aufgaben-Batterie-Tore für Year 2–4 (RULING_TANDEM §3, Karte welle-042) —
 * prüft eine `storyBattery@1`-Datei, bevor Codex sie ins Spiel setzt.
 *
 * Warum ein eigenes Skript: die Batterie ist Eingabe für Codex, nicht Spiel-
 * Inhalt. Sie liegt an der Story-Wurzel (kein `paint/`, kein `level.json`), also
 * sieht sie kein Kapitel-Tor; und ihre Aufgaben sind `grammar@1`-Items, die der
 * Top-down-Motor über `@domigo/engine` bewertet — nicht `gameTasks@2`-Karten.
 *
 * Tore (Exit 1 bei jedem Befund):
 *   HÜLLE  Kopf, Stationen, Zeilen wohlgeformt; jedes `item` parst als GrammarItem.
 *   S1     jedes englische Wort (Aufgabe, Antworten, Distraktoren, freigelegter
 *          Satz, Dialogzeilen, englische Zitate in deutschen Zeilen) ∈ kumulatives
 *          Register der Unit (alle Wortbanken bis einschließlich `unit` + Kern-
 *          Allowlist, regelmäßige Flexion) · unregelmäßige Formen nur, wenn ihr
 *          Grundwort im Register steht · Besetzungsnamen aus `cast` · je Karte
 *          höchstens zwei Glossen.
 *   S2     `structureId` gehört zur Unit der Batterie.
 *   S3/S5  deutsche Zeilen ≤ 2 Sätze, ≤ 200 Wörter je Szene, österreichisches
 *          Lexikon (scripts/lexikon-at.json), keine Grammatik-Namen vor dem Kind.
 *   S6     jede Schlüssel-Antwort grade `correct` (partial: `partial`) durch
 *          `gradeGrammar`, jeder Distraktor `wrong` — der Motor, nicht eine Kopie.
 *   POS    das Kinder-Paket entsteht aus einer Positiv-Liste benannter Felder und
 *          trägt keinen Lösungstext (auch nicht im Tipp).
 *
 * Aufrufe (Repo-Wurzel, Node ≥ 24):
 *   node scripts/audit/battery-y2.ts <datei>
 *   node scripts/audit/battery-y2.ts <datei> --selftest            je Tor ein absichtlicher Bruch muss rot werden
 *   node scripts/audit/battery-y2.ts <datei> --export-frames <out>  Kinderansicht als Markdown, ohne Schlüssel
 *   node scripts/audit/battery-y2.ts <datei> --candidates <in.json> fremde Antworten bewerten
 *                                    ({"<karten-id>": ["antwort", …]})
 *   node scripts/audit/battery-y2.ts <datei> --lesefassung <out.md> Lesefassung (Kinderansicht + Schlüssel am Ende)
 *   node scripts/audit/battery-y2.ts --probe g2-u01 "<text>"        welche Wörter fehlen im Register?
 */
import fs from "node:fs";
import { GrammarItem } from "../../packages/content-schema/src/index.ts";
import { buildAllowedMatcher } from "../../packages/content-pipeline/src/cumulative-bank.ts";
import { wordTokens } from "../../packages/content-pipeline/src/tokenize.ts";
import { shuffledOptions } from "../../packages/content-pipeline/src/blind-solve.ts";
import { canonical, gradeGrammar } from "../../packages/engine/src/index.ts";

// ---------------------------------------------------------------------------
// Form der Datei (storyBattery@1)
// ---------------------------------------------------------------------------

type Line = { speaker: string | null; de?: string; en?: string };
type Card = {
  id: string;
  station: string;
  required: boolean;
  placeDe: string;
  situationDe: string;
  before: Line[];
  revealEn: string | null;
  after: Line[];
  /** error-correction only: the one deliberately wrong token in the prompt (exempt from S1, nowhere in the key). */
  plantedError: string | null;
  item: GrammarItem;
};
/** `counters`: Anzeige-Daten der Bilanz (Spuren x/y …) — Codex rendert sie als Leiste, nie als Erzählzeile. */
type Scene = { id: string; lines: Line[]; counters?: Record<string, string | number> };
type Battery = {
  schema: "storyBattery@1";
  story: string;
  chapter: string;
  unit: string;
  titleDe: string;
  sources: Record<string, string>;
  cast: string[];
  scenes: Scene[];
  cards: Card[];
};

const STATIONS = /^(verdacht|spur-[1-4]|alibi|zettel|frei-\d)$/;
const CHOICE = new Set(["multiple-choice", "context-picker"]);
const CHIPS = new Set(["sentence-building"]);
const TEXT = new Set(["gap-fill", "error-correction", "question-formation", "transformation", "translation", "free-form"]);

/**
 * Unregelmäßige Formen → Grundwort. Sprachliche Tatsache, keine Freigabe: eine
 * Form zählt nur, wenn ihr Grundwort selbst im kumulativen Register steht
 * (RULING_TANDEM §3 S1: »Flexionsformen zählen zum Lemma«). Die Wortbanken tragen
 * unregelmäßige Formen nicht in `forms[]` (gezählt 16.09.: 0 Treffer für went/saw/came).
 */
const IRREGULAR: Record<string, string> = {
  went: "go", gone: "go", sat: "sit", said: "say", had: "have", has: "have", put: "put", did: "do", does: "do",
  done: "do", swam: "swim", wrote: "write", written: "write", came: "come", saw: "see", seen: "see", got: "get",
  took: "take", taken: "take", made: "make", ate: "eat", eaten: "eat", drank: "drink", ran: "run", gave: "give",
  given: "give", found: "find", knew: "know", known: "know", thought: "think", told: "tell", left: "leave",
  felt: "feel", brought: "bring", bought: "buy", began: "begin", drew: "draw", flew: "fly", forgot: "forget",
  heard: "hear", kept: "keep", lost: "lose", met: "meet", paid: "pay", read: "read", rode: "ride", sang: "sing",
  slept: "sleep", spoke: "speak", stood: "stand", taught: "teach", understood: "understand", woke: "wake",
  wore: "wear", won: "win", fell: "fall", hid: "hide", held: "hold", let: "let", sent: "send", spent: "spend",
  shut: "shut", cut: "cut", hit: "hit", became: "become", built: "build", broke: "break", chose: "choose",
  meant: "mean", sold: "sell", showed: "show", shown: "show", threw: "throw", was: "be", were: "be", been: "be",
};

/** Grammatik wird nie vor dem Kind benannt (VS-8). */
const GRAMMAR_NAMES = /\b(past simple|present simple|simple past|simple present|grammar|grammatik|zeitform|mitvergangenheit|gegenwart|vergangenheitsform|grundform|tunwort|tunwörter|zeitwort|verb(en|s)?|3\. person|dritte person)\b/i;
/**
 * S2 misst die GRAMMATIK, nicht nur das Etikett: eine Karte mit structureId g2u01.s.past-simple,
 * deren Schlüssel eine Did-Frage ist, prüft in Wahrheit g2u02.s.past-simple-questions.
 * Nur Strukturen mit eindeutiger Oberfläche; ein Treffer zählt, wenn die Struktur zu einer
 * SPÄTEREN Unit desselben Jahrgangs gehört (Leser A, welle-042, 16.09.: die Did-Frage lief grün durch).
 */
const LATER_STRUCTURE_MARKERS: Array<[string, RegExp]> = [
  ["g2u02.s.past-simple-questions", /\bdid\s+(?!n't)\w+[^.!?]*\?/i],
  ["g2u02.s.why-because", /\bwhy\b/i],
  ["g2u03.s.should", /\bshould(n't)?\b/i],
  ["g2u04.s.comparatives", /\b\w+er than\b|\bmore \w+ than\b/i],
  ["g2u04.s.superlatives", /\bthe (most \w+|\w+est)\b/i],
  ["g2u04.s.as-as", /\bas \w+ as\b/i],
  ["g2u06.s.have-to", /\b(have|has|had|don't have|doesn't have|didn't have) to \w+/i],
  ["g2u07.s.going-to-negative", /\b(am|is|are|'m|'s|'re|isn't|aren't)( not)? going to (?!bed\b|school\b)\w+/i],
  ["g2u07.s.might", /\bmight\b/i],
  ["g2u10.s.must", /\bmust(n't)?\b/i],
  ["g2u11.s.who-whose", /\bwhose\b/i],
  ["g2u11.s.possessive-pronouns", /\b(mine|yours|hers|ours|theirs)\b/i],
  ["g2u12.s.present-perfect", /\b(have|has|haven't|hasn't|'ve)\s+(just\s+|already\s+|ever\s+|never\s+)?(been|seen|done|gone|\w+ed)\b/i],
  ["g2u13.s.will-future", /\b(will|won't)\b|\w'll\b/i],
  ["g2u15.s.so-do-i", /\b(so|neither) (do|does|have|am|is|can) i\b/i],
];
const MAX_GLOSSES = 2;
const MAX_SCENE_WORDS = 200;

// ---------------------------------------------------------------------------
// Hilfen
// ---------------------------------------------------------------------------

const lines = (c: Card): Line[] => [...c.before, ...c.after];
const sentences = (de: string): number =>
  de.replace(/„[^“]*“|»[^«]*«|"[^"]*"/g, "Q").split(/(?<=[.!?…])\s+/).filter((s) => s.trim().length > 0).length;
const quotedEnglish = (de: string): string[] =>
  [...de.matchAll(/„([^“]+)“|»([^«]+)«/g)].map((m) => (m[1] ?? m[2])!).filter((q) => /[a-z]/i.test(q));

function castTokens(b: Battery): Set<string> {
  const s = new Set<string>();
  for (const name of b.cast) for (const t of wordTokens(name)) { s.add(t); s.add(`${t}'s`); }
  return s;
}

/** Kinderansicht der Aufgabe: was vor dem ersten Versuch sichtbar ist. */
function inputOf(item: GrammarItem): { kind: "choice"; options: string[] } | { kind: "chips"; chips: string[] } | { kind: "text"; blanks: number } {
  const fulls = item.answers.filter((a) => a.tier === "full").map((a) => a.text);
  if (CHOICE.has(item.format)) return { kind: "choice", options: shuffledOptions([...new Set([...fulls, ...item.distractors])], item.id) };
  if (CHIPS.has(item.format)) return { kind: "chips", chips: shuffledOptions(item.prompt.text.split(" / "), item.id) };
  return { kind: "text", blanks: Math.max(1, (fulls[0] ?? "").split("|").length) };
}

/**
 * S1-Kern: Wörter außerhalb des Registers. Unregelmäßige Formen zählen zum Grundwort — auch
 * mitten in einer Wendung (»went for a walk« ⇒ »go for a walk«): ein Token ist nur dann fremd,
 * wenn es in der Originalzeile UND in der Grundwort-Zeile fehlt.
 */
export function unknownTokens(matcher: ReturnType<typeof buildAllowedMatcher>, text: string, gloss: string[], granted: Set<string>): string[] {
  const toks = wordTokens(text);
  const lemma = (t: string) => IRREGULAR[t] ?? t;
  const inOrig = new Set(matcher.unknownTokens(text, { extraPhrases: gloss, grantedTokens: granted }));
  const inLem = new Set(matcher.unknownTokens(toks.map(lemma).join(" "), { extraPhrases: gloss, grantedTokens: granted }));
  return [...new Set(toks.filter((t) => inOrig.has(t) && inLem.has(lemma(t))))];
}

// ---------------------------------------------------------------------------
// POS · Positiv-Liste: das Kinder-Paket nennt jedes Feld einzeln
// ---------------------------------------------------------------------------

export const KID_FIELDS = ["before", "glosses", "hintDe", "id", "input", "placeDe", "prompt", "situationDe", "station"] as const;

export function kidPackage(c: Card): Record<(typeof KID_FIELDS)[number], unknown> {
  const input = inputOf(c.item);
  return {
    id: c.id,
    station: c.station,
    placeDe: c.placeDe,
    situationDe: c.situationDe,
    before: c.before.map((l) => ({ speaker: l.speaker, de: l.de ?? null, en: l.en ?? null })),
    prompt: CHIPS.has(c.item.format) ? null : c.item.prompt.text,
    input,
    glosses: c.item.gloss.map((g) => `${g.word} = ${g.de}`),
    hintDe: c.item.hintDe,
  };
}

/** Lösungstext im Paket? Wahl-Formate zeigen die Antwort zwangsläufig als Option — nur dort erlaubt. */
export function leaks(pkg: Record<string, unknown>, c: Card): string[] {
  const out: string[] = [];
  const texts: string[] = [];
  const walk = (v: unknown, at: string) => {
    if (typeof v === "string") { texts.push(at === "prompt" ? v.replace(/\([^)]*\)/g, " ") : v); return; }
    if (Array.isArray(v)) { v.forEach((x) => walk(x, at)); return; }
    if (v && typeof v === "object") for (const [k, x] of Object.entries(v)) {
      if (at === "input" && (k === "options" || k === "chips")) {
        if (k === "chips") texts.push((x as string[]).join(" "));
        continue;
      }
      walk(x, at === "" ? k : at);
    }
  };
  walk(pkg, "");
  // deutsche Anführungszeichen („…“, »…«) entfernt canonical nicht — ohne diese Zeile rutscht „have“ im Tipp durch (Selbstprüfung 16.09.)
  const hay = ` ${texts.map((t) => canonical(t.replace(/[„“”»«‚‘]/g, " "))).join(" ¦ ")} `;
  const answers = c.item.answers.map((a) => a.text);
  for (const a of answers) {
    for (const part of a.split("|").map(canonical).filter(Boolean)) {
      if (CHOICE.has(c.item.format) && !part.includes(" ")) continue;
      const needle = ` ${part} `;
      if (hay.replace(/[¦]/g, " ").includes(needle) || hay.includes(needle)) out.push(`Lösung »${part}« steht im Kinder-Paket`);
    }
  }
  const extra = Object.keys(pkg).filter((k) => !(KID_FIELDS as readonly string[]).includes(k));
  if (extra.length > 0) out.push(`Felder außerhalb der Positiv-Liste: ${extra.join(", ")}`);
  return out;
}

// ---------------------------------------------------------------------------
// die Tore
// ---------------------------------------------------------------------------

type Report = { gate: string; where: string; msg: string };

export function runGates(b: Battery): { findings: Report[]; stats: Record<string, number | string> } {
  const f: Report[] = [];
  const add = (gate: string, where: string, msg: string) => f.push({ gate, where, msg });

  // HÜLLE
  if (b.schema !== "storyBattery@1") add("HÜLLE", "schema", `erwartet storyBattery@1, steht ${b.schema}`);
  if (!/^g[2-4]\.st\.[a-z0-9-]+$/.test(b.story)) add("HÜLLE", "story", b.story);
  if (!/^ch\d{2}$/.test(b.chapter)) add("HÜLLE", "chapter", b.chapter);
  const um = /^g([1-4])-u(\d{2})$/.exec(b.unit);
  if (!um) add("HÜLLE", "unit", b.unit);
  const unitPrefix = um ? `g${um[1]}u${um[2]}` : "?";
  if (b.cards.length < 12 || b.cards.length > 16) add("HÜLLE", "cards", `${b.cards.length} Karten, verlangt 12–16`);
  const ids = new Set<string>();
  const itemIds = new Set<string>();
  const req = ["verdacht", "spur-1", "spur-2", "spur-3", "spur-4", "alibi", "zettel"];
  for (const r of req) if (!b.cards.some((c) => c.station === r && c.required)) add("HÜLLE", "cards", `Pflicht-Station ${r} fehlt`);
  for (const c of b.cards) {
    if (ids.has(c.id)) add("HÜLLE", c.id, "doppelte Karten-Id");
    ids.add(c.id);
    if (itemIds.has(c.item?.id)) add("HÜLLE", c.id, `doppelte Item-Id ${c.item?.id}`);
    itemIds.add(c.item?.id);
    if (!STATIONS.test(c.station)) add("HÜLLE", c.id, `unbekannte Station ${c.station}`);
    if (c.required !== req.includes(c.station)) add("HÜLLE", c.id, `required=${c.required} passt nicht zu Station ${c.station}`);
    for (const l of lines(c)) if ((l.de === undefined) === (l.en === undefined)) add("HÜLLE", c.id, "Zeile braucht genau eines von de/en");
    const parsed = GrammarItem.safeParse(c.item);
    if (!parsed.success) for (const i of parsed.error.issues) add("HÜLLE", c.id, `GrammarItem: ${i.message} bei ${i.path.join(".")}`);
    if (c.item?.provenance?.narrative?.storyId !== b.story || c.item?.provenance?.narrative?.chapterId !== `${b.story}.${b.chapter}`)
      add("HÜLLE", c.id, "provenance.narrative zeigt nicht auf diese Story/dieses Kapitel");
    if (c.item?.strict !== true && !CHOICE.has(c.item?.format)) add("HÜLLE", c.id, "Text-/Chip-Formate laufen strict (sonst wertet der Motor Nah-Treffer wie stays/stayed)");
    if (!CHOICE.has(c.item?.format) && !CHIPS.has(c.item?.format) && !TEXT.has(c.item?.format)) add("HÜLLE", c.id, `Format ${c.item?.format} nicht vorgesehen`);
    const isEc = c.item?.format === "error-correction";
    if (isEc !== (typeof c.plantedError === "string")) add("HÜLLE", c.id, "plantedError steht genau bei error-correction");
    if (isEc && typeof c.plantedError === "string") {
      const pe = wordTokens(c.plantedError)[0] ?? "";
      if (!wordTokens(c.item.prompt.text).includes(pe)) add("HÜLLE", c.id, `plantedError »${c.plantedError}« steht nicht in der Aufgabe`);
      if (c.item.answers.some((a) => wordTokens(a.text).includes(pe))) add("HÜLLE", c.id, `plantedError »${c.plantedError}« steht im Schlüssel`);
    }
  }
  for (const s of b.scenes) for (const l of s.lines) if ((l.de === undefined) === (l.en === undefined)) add("HÜLLE", s.id, "Zeile braucht genau eines von de/en");
  if (f.length > 0 && f.some((x) => x.msg.startsWith("GrammarItem"))) return { findings: f, stats: {} };

  // S1
  const matcher = buildAllowedMatcher(b.unit, { nouns: false });
  const cast = castTokens(b);
  const unknownIn = (text: string, gloss: string[] = []): string[] => unknownTokens(matcher, text, gloss, cast);
  let s1Words = 0;
  const s1 = (where: string, text: string, gloss: string[] = []) => {
    s1Words += wordTokens(text).length;
    for (const t of unknownIn(text, gloss)) add("S1", where, `»${t}« steht nicht im kumulativen Register ${b.unit} (Text: ${text})`);
  };
  for (const s of b.scenes) for (const l of s.lines) {
    if (l.en) s1(s.id, l.en);
    if (l.de) for (const q of quotedEnglish(l.de)) s1(s.id, q);
  }
  for (const c of b.cards) {
    const gloss = c.item.gloss.map((g) => g.word);
    if (gloss.length > MAX_GLOSSES) add("S1", c.id, `${gloss.length} Glossen, höchstens ${MAX_GLOSSES}`);
    if (c.item.prompt.lang === "en") {
      // Lückentext: das Kind liest den Satz am Ende vollständig — geprüft wird er mit der ersten Schlüssel-Antwort in den Lücken.
      const fill = (c.item.answers.find((a) => a.tier === "full")?.text ?? "").split("|");
      let k = 0;
      const text = c.item.prompt.text.replace(/_{3,}/g, () => ` ${fill[k++] ?? ""} `).replace(/ \/ /g, " ");
      const exempt = c.plantedError ? new Set(wordTokens(c.plantedError)) : new Set<string>();
      for (const t of unknownIn(text, gloss)) if (!exempt.has(t)) add("S1", c.id, `»${t}« steht nicht im kumulativen Register ${b.unit} (Text: ${text})`);
      s1Words += wordTokens(text).length;
    }
    for (const a of c.item.answers) s1(c.id, a.text.replace(/\|/g, " "), gloss);
    for (const d of c.item.distractors) s1(c.id, d, gloss);
    for (const d of c.item.presentation.gameMeta?.distractorPool ?? []) s1(c.id, d, gloss);
    if (c.revealEn) s1(c.id, c.revealEn, gloss);
    for (const l of lines(c)) if (l.en) s1(c.id, l.en, gloss);
    for (const de of [c.situationDe, c.placeDe, c.item.hintDe, c.item.explainDe, ...lines(c).map((l) => l.de ?? "")])
      for (const q of quotedEnglish(de)) s1(c.id, q, gloss);
  }

  // S2
  const structures = new Map<string, number>();
  for (const c of b.cards) {
    const sid = c.item.structureId;
    structures.set(sid, (structures.get(sid) ?? 0) + 1);
    if (!sid.startsWith(`${unitPrefix}.s.`)) add("S2", c.id, `structureId ${sid} gehört nicht zu ${b.unit}`);
    const keyTexts = [c.item.prompt.lang === "en" ? c.item.prompt.text : "", ...c.item.answers.map((a) => a.text)];
    for (const [later, re] of LATER_STRUCTURE_MARKERS) {
      const lm = /^g(\d)u(\d{2})/.exec(later)!;
      if (!um || lm[1] !== um[1] || Number(lm[2]) <= Number(um[2])) continue;
      for (const t of keyTexts) if (re.test(t)) add("S2", c.id, `»${t}« braucht ${later} — eine spätere Unit`);
    }
  }

  // S3 / S5
  const lex = JSON.parse(fs.readFileSync("scripts/lexikon-at.json", "utf8")) as {
    eintraege: Array<{ kern: string; verboten: string[] }>;
    muster: Array<{ id: string; re: string; felder: string[] }>;
  };
  const deCheck = (where: string, de: string) => {
    if (sentences(de) > 2) add("S3", where, `mehr als 2 Sätze: ${de}`);
    if (GRAMMAR_NAMES.test(de)) add("S3", where, `Grammatik benannt (VS-8): ${de}`);
    for (const e of lex.eintraege) for (const v of e.verboten)
      if (new RegExp(`\\b${v}\\b`).test(de)) add("S5", where, `»${v}« ist deutschländisch — ${e.kern}`);
    for (const m of lex.muster) if (m.felder.includes("*") && new RegExp(m.re).test(de)) add("S5", where, `${m.id}: ${de}`);
  };
  const enCheck = (where: string, en: string) => {
    if (sentences(en) > 2) add("S3", where, `mehr als 2 Sätze: ${en}`);
    if (GRAMMAR_NAMES.test(en)) add("S3", where, `Grammatik benannt (VS-8): ${en}`);
  };
  for (const s of b.scenes) {
    let words = 0;
    for (const l of s.lines) { if (l.de) deCheck(s.id, l.de); if (l.en) enCheck(s.id, l.en); words += (l.de ?? l.en ?? "").split(/\s+/).length; }
    if (words > MAX_SCENE_WORDS) add("S3", s.id, `${words} Wörter, höchstens ${MAX_SCENE_WORDS}`);
  }
  for (const c of b.cards) {
    let words = 0;
    for (const de of [c.situationDe, c.placeDe, c.item.hintDe, c.item.explainDe]) { deCheck(c.id, de); words += de.split(/\s+/).length; }
    for (const l of lines(c)) { if (l.de) deCheck(c.id, l.de); if (l.en) enCheck(c.id, l.en); words += (l.de ?? l.en ?? "").split(/\s+/).length; }
    if (c.revealEn) enCheck(c.id, c.revealEn);
    if (words > MAX_SCENE_WORDS) add("S3", c.id, `${words} Wörter, höchstens ${MAX_SCENE_WORDS}`);
  }

  // S6 · Schlüssel durch den echten Motor
  let s6Keys = 0;
  let s6Distractors = 0;
  for (const c of b.cards) {
    const input = inputOf(c.item);
    const grade = (value: string) =>
      gradeGrammar(c.item, input.kind === "choice" ? { kind: "choice", value } : { kind: "text", value }).tier;
    for (const a of c.item.answers) {
      s6Keys++;
      const want = a.tier === "full" ? "correct" : "partial";
      const got = grade(a.text);
      if (got !== want) add("S6", c.id, `Schlüssel »${a.text}« gibt ${got}, erwartet ${want}`);
    }
    const wrongs = [...c.item.distractors, ...(CHOICE.has(c.item.format) ? [] : c.item.presentation.gameMeta?.distractorPool ?? [])];
    for (const d of wrongs) {
      s6Distractors++;
      const got = grade(d);
      if (got !== "wrong") add("S6", c.id, `Distraktor »${d}« gibt ${got}, muss wrong sein`);
    }
    if (input.kind === "chips") {
      const chipSet = [...input.chips].map(canonical).sort().join(" ");
      for (const a of c.item.answers.filter((x) => x.tier === "full")) {
        const want = a.text.split(/\s+/).map(canonical).sort().join(" ");
        if (want !== chipSet) add("S6", c.id, `Chips bauen »${a.text}« nicht genau (Chips: ${input.chips.join(" / ")})`);
      }
      if (c.item.answers.some((a) => canonical(a.text) === canonical(input.chips.join(" ")))) add("POS", c.id, "Chips stehen schon in Lösungsreihenfolge");
    }
  }

  // POS
  for (const c of b.cards) for (const l of leaks(kidPackage(c), c)) add("POS", c.id, l);

  return {
    findings: f,
    stats: {
      karten: b.cards.length,
      pflicht: b.cards.filter((c) => c.required).length,
      s1Woerter: s1Words,
      strukturen: [...structures].map(([k, n]) => `${k} ${n}`).join(" · "),
      formate: Object.entries(b.cards.reduce<Record<string, number>>((m, c) => ((m[c.item.format] = (m[c.item.format] ?? 0) + 1), m), {}))
        .map(([k, n]) => `${k} ${n}`).join(" · "),
      s6Schluessel: s6Keys,
      s6Distraktoren: s6Distractors,
    },
  };
}

// ---------------------------------------------------------------------------
// Selbstprüfung: je Tor ein Bruch, der rot werden MUSS
// ---------------------------------------------------------------------------

function selftest(b: Battery): number {
  const clone = (): Battery => structuredClone(b);
  const base = runGates(b).findings.length;
  const cases: Array<[string, (x: Battery) => void, (r: Report[]) => boolean]> = [
    ["S1 · ein Wort außerhalb (handwriting)", (x) => { x.cards[0]!.revealEn = "It was not her handwriting."; }, (r) => r.some((y) => y.gate === "S1" && y.msg.includes("handwriting"))],
    ["S1 · unregelmäßige Form ohne Grundwort (fought)", (x) => { x.scenes[0]!.lines.push({ speaker: "Fenn", en: "They fought." }); }, (r) => r.some((y) => y.gate === "S1" && y.msg.includes("fought"))],
    ["S2 · fremde Struktur", (x) => { const it = x.cards[0]!.item; it.structureId = "g2u02.s.past-simple"; it.id = it.id.replace(/^g2u01/, "g2u02"); }, (r) => r.some((y) => y.gate === "S2" || y.msg.includes("GrammarItem"))],
    ["S2 · Grammatik einer späteren Unit im Schlüssel (Did-Frage)", (x) => { const c = x.cards.find((k) => k.item.format === "question-formation")!; c.item.answers.push({ text: "Did you play football yesterday?", tier: "partial" }); }, (r) => r.some((y) => y.gate === "S2" && y.msg.includes("past-simple-questions"))],
    ["S6 · vertauschter Schlüssel", (x) => { const c = x.cards.find((k) => CHOICE.has(k.item.format))!; c.item.answers[0]!.text = c.item.distractors[0]!; }, (r) => r.some((y) => y.gate === "S6")],
    ["S6 · fehlender Nah-Treffer-Schutz (strict aus)", (x) => { x.cards.find((k) => TEXT.has(k.item.format))!.item.strict = false; }, (r) => r.some((y) => y.gate === "HÜLLE" && y.msg.includes("strict"))],
    ["S3 · Grammatik benannt", (x) => { x.cards[0]!.item.hintDe = "Das ist Past simple."; }, (r) => r.some((y) => y.gate === "S3")],
    ["S5 · deutschländisches Wort", (x) => { x.cards[0]!.situationDe = "Im Federmäppchen liegt ein Zettel."; }, (r) => r.some((y) => y.gate === "S5")],
    ["POS · Lösung im Tipp", (x) => { const c = x.cards.find((k) => TEXT.has(k.item.format))!; c.item.hintDe = `Schreib „${c.item.answers[0]!.text.split("|")[0]}“.`; }, (r) => r.some((y) => y.gate === "POS")],
  ];
  let bad = 0;
  if (base !== 0) { console.error(`✗ Selbstprüfung braucht eine grüne Batterie, gefunden: ${base} Befunde`); return 1; }
  for (const [name, tamper, isRed] of cases) {
    const x = clone();
    tamper(x);
    const r = runGates(x).findings;
    const ok = isRed(r);
    console.log(`${ok ? "✓" : "✗"} ${name} → ${ok ? "rot erkannt" : "NICHT erkannt"}`);
    if (!ok) bad++;
  }
  // Positiv-Liste: ein eingeschleustes Lösungsfeld erreicht das Paket nicht …
  const x = clone();
  const c = x.cards.find((k) => TEXT.has(k.item.format))!;
  (c as unknown as Record<string, unknown>).answers = c.item.answers;
  (c.item as unknown as Record<string, unknown>).solution = c.item.answers[0]!.text;
  const pkg = kidPackage(c);
  const pickOk = leaks(pkg, c).length === 0 && Object.keys(pkg).sort().join() === [...KID_FIELDS].sort().join();
  console.log(`${pickOk ? "✓" : "✗"} POS · eingeschleustes Lösungsfeld bleibt draußen → ${pickOk ? "Paket sauber" : "LECK"}`);
  // … und ein Spread-Paket (die Form, die jedes neue Feld ausliefert) wird rot.
  const spread = { ...(c as unknown as Record<string, unknown>) };
  const spreadRed = leaks(spread, c).length > 0;
  console.log(`${spreadRed ? "✓" : "✗"} POS · Spread-Paket statt Positiv-Liste → ${spreadRed ? "rot erkannt" : "NICHT erkannt"}`);
  if (!pickOk) bad++;
  if (!spreadRed) bad++;
  console.log(`Selbstprüfung: ${cases.length + 2 - bad}/${cases.length + 2} Brüche richtig erkannt`);
  return bad === 0 ? 0 : 1;
}

// ---------------------------------------------------------------------------
// Ausgaben: Kinderansicht, Lesefassung, fremde Antworten
// ---------------------------------------------------------------------------

const speak = (l: Line) => `${l.speaker ? `**${l.speaker}:** ` : ""}${l.en ?? l.de}`;

function kidMarkdown(b: Battery, withKey: boolean): string {
  const out: string[] = [];
  out.push(`# ${b.titleDe} — ${withKey ? "Lesefassung" : "Kinderansicht (ohne Schlüssel)"}`, "");
  if (withKey) {
    out.push(`_${b.story} · ${b.chapter} · ${b.unit} · ${b.cards.length} Karten (${b.cards.filter((c) => c.required).length} Pflicht). Erzeugt aus der JSON-Datei mit \`scripts/audit/battery-y2.ts --lesefassung\` — nie von Hand ändern._`, "");
    out.push(`_Quellen: ${Object.entries(b.sources).map(([k, v]) => `${k} ${v}`).join(" · ")}_`, "");
  }
  const scene = (id: string) => b.scenes.find((s) => s.id === id);
  const vorfall = scene("vorfall");
  if (vorfall) { out.push("## Vorfall", ""); for (const l of vorfall.lines) out.push(`- ${speak(l)}`); out.push(""); }
  for (const c of b.cards) {
    const k = kidPackage(c);
    const input = k.input as ReturnType<typeof inputOf>;
    out.push(`## ${c.id} · ${c.placeDe}${c.required ? "" : " (freiwillig)"}`, "");
    for (const l of c.before) out.push(`- ${speak(l)}`);
    if (c.before.length) out.push("");
    out.push(`**${c.situationDe}**`, "");
    if (k.prompt) out.push(`> ${k.prompt}`, "");
    if (input.kind === "choice") out.push(...input.options.map((o) => `- [ ] ${o}`), "");
    if (input.kind === "chips") out.push(`Wortkarten: ${input.chips.map((ch) => `\`${ch}\``).join(" ")}`, "");
    if (input.kind === "text") out.push(input.blanks > 1 ? `_(${input.blanks} Felder)_` : "_(ein Feld)_", "");
    if ((k.glosses as string[]).length) out.push(`Wort-Hilfe: ${(k.glosses as string[]).join(" · ")}`, "");
    out.push(`_Tipp nach einem Fehlversuch:_ ${k.hintDe}`, "");
  }
  const bilanz = scene("bilanz");
  if (bilanz) { out.push("## Bilanz", ""); for (const l of bilanz.lines) out.push(`- ${speak(l)}`); out.push(""); }
  if (withKey) {
    out.push("---", "", "## Schlüssel (nur für Codex, Review und Lehrkraft — nie ins Kinder-Paket)", "");
    out.push("| Karte | Format · Struktur | richtig | teilweise | falsch (Distraktoren) | danach frei | Erklärung |", "|---|---|---|---|---|---|---|");
    const esc = (s: string) => s.replace(/\|/g, "\\|");
    for (const c of b.cards) {
      const full = c.item.answers.filter((a) => a.tier === "full").map((a) => esc(a.text)).join(" · ");
      const part = c.item.answers.filter((a) => a.tier === "partial").map((a) => esc(a.text)).join(" · ") || "—";
      const after = [c.revealEn, ...c.after.map(speak)].filter(Boolean).map((s) => esc(s!)).join(" ") || "—";
      out.push(`| ${c.id} | ${c.item.format} · ${c.item.structureId.split(".s.")[1]} | ${full} | ${part} | ${c.item.distractors.map(esc).join(" · ") || "—"} | ${after} | ${esc(c.item.explainDe)} |`);
    }
    out.push("");
  }
  return `${out.join("\n")}\n`;
}

function gradeCandidates(b: Battery, file: string): number {
  const cand = JSON.parse(fs.readFileSync(file, "utf8")) as Record<string, string[]>;
  let wrong = 0;
  for (const c of b.cards) {
    const input = inputOf(c.item);
    const answers = cand[c.id];
    if (!answers?.length) { console.log(`– ${c.id}: keine Antwort geliefert`); wrong++; continue; }
    for (const a of answers) {
      const tier = gradeGrammar(c.item, input.kind === "choice" ? { kind: "choice", value: a } : { kind: "text", value: a }).tier;
      if (tier !== "correct") wrong++;
      console.log(`${tier === "correct" ? "✓" : "✗"} ${c.id}: »${a}« → ${tier}`);
    }
  }
  return wrong;
}

// ---------------------------------------------------------------------------
// main
// ---------------------------------------------------------------------------

function main(): number {
  const argv = process.argv.slice(2);
  if (argv[0] === "--probe") {
    const m = buildAllowedMatcher(argv[1]!, { nouns: false });
    const miss = unknownTokens(m, argv.slice(2).join(" "), [], new Set(["merle", "fenn", "klecks", "frau", "berger", "oswin"]));
    console.log(miss.length ? `außerhalb ${argv[1]}: ${miss.join(", ")}` : `alles in ${argv[1]}`);
    return miss.length ? 1 : 0;
  }
  const file = argv[0];
  if (!file || !fs.existsSync(file)) { console.error("usage: node scripts/audit/battery-y2.ts <batterie.json> [--selftest|--export-frames out|--candidates in|--lesefassung out]"); return 2; }
  const b = JSON.parse(fs.readFileSync(file, "utf8")) as Battery;
  const opt = (name: string) => { const i = argv.indexOf(name); return i >= 0 ? argv[i + 1] ?? null : null; };
  if (argv.includes("--selftest")) return selftest(b);
  const frames = opt("--export-frames");
  if (frames) { fs.writeFileSync(frames, kidMarkdown(b, false)); console.log(`Kinderansicht → ${frames}`); return 0; }
  const lese = opt("--lesefassung");
  if (lese) { fs.writeFileSync(lese, kidMarkdown(b, true)); console.log(`Lesefassung → ${lese}`); return 0; }
  const cand = opt("--candidates");
  if (cand) { const n = gradeCandidates(b, cand); console.log(`nicht correct: ${n}`); return 0; }
  const { findings, stats } = runGates(b);
  for (const x of findings) console.log(`✗ ${x.gate} · ${x.where} · ${x.msg}`);
  console.log(Object.entries(stats).map(([k, v]) => `${k}: ${v}`).join("\n"));
  const byGate = ["HÜLLE", "S1", "S2", "S3", "S5", "S6", "POS"].map((g) => `${g} ${findings.filter((x) => x.gate === g).length}`).join(" · ");
  console.log(`Befunde: ${byGate}`);
  return findings.length === 0 ? 0 : 1;
}

process.exit(main());
