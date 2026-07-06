/**
 * classifyWrong — names WHAT KIND of wrong a text answer was, in trap-registry
 * terms (content/corpus/traps/traps.json, trap-registry@1 ids), so feedback,
 * review and analytics can speak the kid trap names ("Wilde Verben",
 * "Gestern-Falle", …).
 *
 * Pure heuristics over the item's authored full answers + the student input.
 * It NEVER changes grading: the tier is decided before this runs, and a null
 * result is always fine. Rules are deliberately conservative — return a
 * confident single match or null, because a wrong trap name mis-teaches.
 * Choice formats don't come through here (their traps are authored via
 * distractorMeta); this classifier covers typed input only.
 */
import type { TieredAnswer } from "@domigo/content-schema";
import { canonical } from "./grade.ts";

/**
 * Structural view of a classifiable item — GrammarItem satisfies it; the
 * attempts route can adapt a vocab answer set the same way.
 */
export interface ClassifiableItem {
  answers: TieredAnswer[];
  structureId?: string;
}

/** Base → irregular past/participle forms (the MORE! 1–4 verb range). */
const IRREGULAR: Record<string, string[]> = {
  be: ["was", "were", "been"],
  begin: ["began", "begun"],
  break: ["broke", "broken"],
  bring: ["brought"],
  build: ["built"],
  buy: ["bought"],
  catch: ["caught"],
  choose: ["chose", "chosen"],
  come: ["came", "come"],
  cost: ["cost"],
  cut: ["cut"],
  do: ["did", "done"],
  draw: ["drew", "drawn"],
  drink: ["drank", "drunk"],
  drive: ["drove", "driven"],
  eat: ["ate", "eaten"],
  feel: ["felt"],
  find: ["found"],
  fly: ["flew", "flown"],
  forget: ["forgot", "forgotten"],
  get: ["got"],
  give: ["gave", "given"],
  go: ["went", "gone"],
  grow: ["grew", "grown"],
  have: ["had"],
  hear: ["heard"],
  hit: ["hit"],
  hold: ["held"],
  hurt: ["hurt"],
  keep: ["kept"],
  know: ["knew", "known"],
  leave: ["left"],
  let: ["let"],
  lose: ["lost"],
  make: ["made"],
  meet: ["met"],
  put: ["put"],
  read: ["read"],
  ride: ["rode", "ridden"],
  run: ["ran", "run"],
  say: ["said"],
  see: ["saw", "seen"],
  send: ["sent"],
  sing: ["sang", "sung"],
  sit: ["sat"],
  sleep: ["slept"],
  speak: ["spoke", "spoken"],
  spend: ["spent"],
  stand: ["stood"],
  swim: ["swam", "swum"],
  take: ["took", "taken"],
  teach: ["taught"],
  tell: ["told"],
  think: ["thought"],
  understand: ["understood"],
  wake: ["woke", "woken"],
  wear: ["wore", "worn"],
  win: ["won"],
  write: ["wrote", "written"],
};

/**
 * German-transfer word → the English word(s) the answer would use instead.
 * Fires only when the right word actually appears in an answer — "spend" or
 * "brave" alone is far too common to be evidence of the trap.
 */
const FALSE_FRIENDS = new Map<string, string[]>([
  ["become", ["get", "gets", "got", "receive"]],
  ["becomes", ["gets", "get", "receives"]],
  ["became", ["got", "received"]],
  ["handy", ["phone", "mobile"]],
  ["chef", ["boss"]],
  ["brave", ["good", "well-behaved"]],
  ["actually", ["currently", "at the moment", "right now"]],
  ["sensible", ["sensitive"]],
  ["spend", ["donate"]],
  ["spends", ["donates", "donate"]],
  ["gift", ["poison"]],
]);

/** Negation done right (canonical() strips apostrophes: don't → dont). */
const NEG_OK =
  /\b(dont|doesnt|didnt|isnt|arent|wasnt|werent|cant|cannot|wont|havent|hasnt|hadnt|(?:do|does|did|is|are|am|was|were|can|will|would|have|has|had) not)\b/;

const PROG = /\b(?:am|is|are|was|were) (\w+ing)\b/;
const BE_AUX = /\b(?:am|is|are|was|were)\b/;
const IF_WILL = /\bif (?:\w+ ){0,2}will\b/;

function fullAnswers(item: ClassifiableItem): string[] {
  return item.answers.filter((a) => a.tier === "full").map((a) => canonical(a.text));
}

/** Candidate base verbs for a regularised past form: goed→go, comed→come, runned→run, flied→fly. */
function edBases(w: string): string[] {
  if (!w.endsWith("ed") || w.length < 4) return [];
  const stem = w.slice(0, -2);
  const bases = [stem, w.slice(0, -1)];
  if (stem.length > 2 && stem[stem.length - 1] === stem[stem.length - 2]) bases.push(stem.slice(0, -1));
  if (stem.endsWith("i")) bases.push(`${stem.slice(0, -1)}y`);
  return bases;
}

/** Candidate base verbs for an -ing form: playing→play, writing→write, running→run. */
function ingBases(w: string): string[] {
  const stem = w.slice(0, -3);
  const bases = [stem, `${stem}e`];
  if (stem.length > 2 && stem[stem.length - 1] === stem[stem.length - 2]) bases.push(stem.slice(0, -1));
  return bases;
}

/** x + 3rd-person/plural s → y (play→plays, watch→watches, study→studies). */
function sForm(x: string, y: string): boolean {
  return y === `${x}s` || y === `${x}es` || (x.endsWith("y") && y === `${x.slice(0, -1)}ies`);
}

function hasWord(haystack: string, word: string): boolean {
  return new RegExp(`\\b${word}\\b`).test(haystack);
}

function sameWords(a: string[], b: string[]): boolean {
  return a.length === b.length && [...a].sort().join(" ") === [...b].sort().join(" ");
}

/**
 * Returns a trap id from trap-registry@1, or null when no rule is confident.
 * `input` is the student's raw text; the caller has already graded it wrong.
 */
export function classifyWrong(item: ClassifiableItem, input: string): string | null {
  const inp = canonical(input);
  if (inp === "") return null;
  const answers = fullAnswers(item);
  if (answers.length === 0 || answers.includes(inp)) return null;
  const structure = item.structureId ?? "";
  const inpWords = inp.split(" ");

  // wilde-verben: an irregular verb got the regular -ed ("goed", "runned",
  // "buyed") — the -ed word is in no answer, but its base's irregular form is.
  for (const w of inpWords) {
    if (!w.endsWith("ed") || answers.some((a) => hasWord(a, w))) continue;
    for (const base of edBases(w)) {
      const pasts = IRREGULAR[base];
      if (pasts?.some((p) => answers.some((a) => hasWord(a, p)))) return "wilde-verben";
    }
  }

  // falsche-freunde: a German-transfer word where the answer uses the real one.
  for (const w of inpWords) {
    const rights = FALSE_FRIENDS.get(w);
    if (!rights || answers.some((a) => hasWord(a, w))) continue;
    if (answers.some((a) => rights.some((r) => hasWord(a, r)))) return "falsche-freunde";
  }

  for (const a of answers) {
    const aWords = a.split(" ");

    // Single-token substitutions — the most confident family of rules.
    if (aWords.length === inpWords.length) {
      const diffs = aWords
        .map((w, i) => [w, inpWords[i]!] as const)
        .filter(([want, got]) => want !== got);
      if (diffs.length === 1) {
        const [want, got] = diffs[0]!;
        // a-oder-an: the article form is the ONLY difference.
        if ((want === "an" && got === "a") || (want === "a" && got === "an")) return "a-oder-an";
        // wem-gehoerts: his/her swapped.
        if ((want === "his" && got === "her") || (want === "her" && got === "his")) return "wem-gehoerts";
        // wie-ly: the adverb -ly missing (careful→carefully, happy→happily).
        if (want === `${got}ly` || (got.endsWith("y") && want === `${got.slice(0, -1)}ily`)) return "wie-ly";
        // he-she-it-s vs zaehl-falle: a missing/extra s — the structure decides
        // which lesson it is (plural structures → Zähl-Falle, else 3rd-person s).
        if (sForm(got, want) || sForm(want, got)) {
          return structure.includes("plural") ? "zaehl-falle" : "he-she-it-s";
        }
        // gestern-falle: past wanted, base given — regular (+ed) or irregular.
        if (want === `${got}ed` || (got.endsWith("e") && want === `${got}d`)) return "gestern-falle";
        if (IRREGULAR[got]?.includes(want)) return "gestern-falle";
      }
    }

    // groesser-falle: "more good"-type comparatives.
    const mMore = /\bmore (\w+)\b/.exec(inp);
    if (mMore && !a.includes(`more ${mMore[1]!}`)) {
      const adj = mMore[1]!;
      const suppletive = adj === "good" ? "better" : adj === "bad" ? "worse" : null;
      if (suppletive && hasWord(a, suppletive)) return "groesser-falle";
      const stem = adj.endsWith("y") ? adj.slice(0, -1) : adj;
      if (new RegExp(`\\b${stem}[a-z]?er\\b`).test(a)) return "groesser-falle";
    }
    if (/\b(gooder|goodest|badder|baddest)\b/.test(inp) && /\b(better|best|worse|worst)\b/.test(a)) {
      return "groesser-falle";
    }

    // seit-falle: since/for swapped in front of the same time expression.
    const mFor = /\bfor (\S+(?: \S+)?)/.exec(a);
    if (mFor && inp.includes(`since ${mFor[1]!}`)) return "seit-falle";
    const mSince = /\bsince (\S+)/.exec(a);
    if (mSince && inp.includes(`for ${mSince[1]!}`)) return "seit-falle";

    // mischmasch / jetzt-oder-immer around the answer's progressive (or lack of it).
    const aProg = PROG.exec(a);
    if (aProg) {
      const bases = ingBases(aProg[1]!);
      // mischmasch: am/is/are + bare verb where the answer has am/is/are + -ing.
      if (new RegExp(`\\b(?:am|is|are|was|were) (?:${bases.join("|")})\\b`).test(inp)) return "mischmasch";
      // jetzt-oder-immer (inverse): simple form given, no be-auxiliary at all.
      if (!BE_AUX.test(inp) && bases.some((b) => hasWord(inp, b) || hasWord(inp, `${b}s`))) {
        return "jetzt-oder-immer";
      }
    } else {
      // jetzt-oder-immer: progressive given where the answer is a simple form
      // of the same verb.
      const iProg = PROG.exec(inp);
      if (iProg && ingBases(iProg[1]!).some((b) => hasWord(a, b) || hasWord(a, `${b}s`) || hasWord(a, `${b}es`))) {
        return "jetzt-oder-immer";
      }
    }

    // wenn-falle: will smuggled into the if-clause.
    if (IF_WILL.test(inp) && hasWord(a, "if") && !IF_WILL.test(a)) return "wenn-falle";

    // not-allein: a bare "not" without its auxiliary partner, on a negation item.
    if (hasWord(inp, "not") && !NEG_OK.test(inp) && NEG_OK.test(a)) return "not-allein";

    // do-falle: the answer is a do-question, the input has the same words minus the do.
    if (/^(do|does|did) /.test(a)) {
      const aux = aWords[0]!;
      if (!hasWord(inp, aux) && sameWords(inpWords, aWords.slice(1))) return "do-falle";
    }
  }

  return null;
}
