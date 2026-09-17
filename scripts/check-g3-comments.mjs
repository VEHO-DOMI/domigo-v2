// CI gate for the Year-3 comment banks (welle-053, GG-Entscheid 17.09.): a comment under a
// FOURTEEN video may never claim something the scenes do not show.
//
//   node --experimental-strip-types scripts/check-g3-comments.mjs
//   node --experimental-strip-types scripts/check-g3-comments.mjs --selftest   (proves the red light works)
//
// WHY: two blind readers (Leser-Tor V2) hit the same wall twice — `musicfan_07: "Ben explains
// it so well!"` under an episode in which Ben explains nothing; he reads one scripted line.
// A fixed text bank is content the child reads as story, but no gate ever opened it: the level
// gate, VS-8 and blind-solve all stop at story.json and the item files. It is the classic blind
// spot (P-65): the artefact class the rule is about is never loaded by the checker.
//
// Laws (over packages/game-novel/src/novel-copy.ts against content/corpus/stories/g3.st.fourteen/story.json):
//   G1 · Meta-talk — no EN_META word (grammar, exercise, lesson, …) in a comment. Mirrors VS-8;
//        the list is imported from content-schema, never copied (D-123).
//   G2 · Claim — when a comment names a cast member (Ben · Leah · Leo · Sara), the verb it
//        attributes to that name must occur in some scene line of the story. "Ben explains" is
//        a claim the scenes never back; "Ben reads" is one they do.
//   G3 · Quote — a quoted string inside a comment ("…" or “…”) must occur verbatim in a scene
//        line. An invented quote puts words in a character's mouth.
//   G4 · The gate must actually see the banks: fewer than MIN_COMMENTS parsed = red, so a
//        renamed const can never turn this check into a silent no-op.
//
// NOT a law here: taste. "This helped me with my homework" is a style question for the reading
// round, not a false claim about the scene — the readers may keep flagging it as S.
//
// SELBSTTEST: das Urteil ist eine REINE FUNKTION über (Quelltext, Story). Der Selbsttest reicht
// ihr die ECHTEN Dateien mit genau EINER Verfälschung im Speicher herein (P-71: Tamper gegen den
// Messwert, nicht gegen eine erfundene Konfiguration) und prüft, dass GENAU der eingespeiste
// Fehler gemeldet wird. Der letzte Fall: der ECHTE Stand ist grün.
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { EN_META } from "../packages/content-schema/src/game-tasks.ts";

const REPO = join(dirname(fileURLToPath(import.meta.url)), "..");
const COPY_PATH = join(REPO, "packages/game-novel/src/novel-copy.ts");
const STORY_PATH = join(REPO, "content/corpus/stories/g3.st.fourteen/story.json");
const CAST = ["Ben", "Leah", "Leo", "Sara"];
const MIN_COMMENTS = 8;
/** Words that may follow a name without being a claim about that character. */
const NOT_A_VERB = new Set(["and", "or", "but", "the", "a", "an", "we", "i", "you", "they", "he", "she", "it", "his", "her", "their", "so", "too", "again", "now", "still", "just", "really", "always", "never", "also", "here", "there", "why", "how", "what", "when", "if", "that", "this", "s"]);

/** Crude lemma set for a verb surface: reads → read/reads/reading/read. */
const forms = (v) => new Set([v, v + "s", v + "es", v.replace(/e$/, "") + "ing", v + "ing", v.replace(/y$/, "ies"), v.replace(/y$/, "ied"), v + "ed", v.replace(/e$/, "") + "ed"]);

/** Pure: the whole verdict as a function of the two loaded files. */
export const analyse = ({ copySource, story }) => {
  const failures = [];
  const fail = (where, msg) => failures.push(`${where}: ${msg}`);

  // every English line a child can read in this story, lower-cased
  const lines = story.chapters.flatMap((c) => c.scenes.map((s) => s.textEn));
  const sceneText = " " + lines.join(" ").toLowerCase().replace(/\s+/g, " ") + " ";
  const sceneWords = new Set(sceneText.match(/[a-z']+/g) ?? []);

  // the comment banks, parsed out of the copy module (they are module-private by design)
  const comments = [...copySource.matchAll(/\{\s*author:\s*"([^"]+)",\s*text:\s*"([^"]+)"/g)].map((m) => ({ author: m[1], text: m[2] }));
  if (comments.length < MIN_COMMENTS) {
    fail("G4", `only ${comments.length} comment(s) parsed from novel-copy.ts — the gate is not seeing the banks`);
    return { failures, comments: comments.length };
  }

  for (const { author, text } of comments) {
    const where = `${author}: "${text}"`;
    const lower = text.toLowerCase();

    // G1 · meta-talk
    for (const w of EN_META) {
      if (new RegExp(`\\b${w}\\b`, "i").test(text)) fail(where, `G1 — meta-talk "${w}" in a comment the child reads`);
    }

    // G3 · quotes must be real scene text
    for (const m of text.matchAll(/[“"]([^”"]{3,})[”"]/g)) {
      const quoted = m[1].toLowerCase().replace(/\s+/g, " ").trim();
      if (!sceneText.includes(quoted)) fail(where, `G3 — quoted "${m[1]}" appears in no scene line`);
    }

    // G2 · a claim attributed to a named character
    for (const name of CAST) {
      const re = new RegExp(`\\b${name}(?:'s)?\\b([^.!?]*)`, "i");
      const m = lower.match(re);
      if (!m) continue;
      const rest = (m[1] ?? "").match(/[a-z']+/g) ?? [];
      const verb = rest.find((w) => !NOT_A_VERB.has(w));
      if (verb === undefined) continue;                       // no claim, just the name
      if (sceneWords.has(verb)) continue;                      // the scenes show it
      if ([...sceneWords].some((w) => forms(w).has(verb) || forms(verb).has(w))) continue;
      fail(where, `G2 — claims "${name} ${verb}", but no scene line shows it`);
    }
  }
  return { failures, comments: comments.length };
};

const copyOnDisk = readFileSync(COPY_PATH, "utf8");
const storyOnDisk = JSON.parse(readFileSync(STORY_PATH, "utf8"));

if (process.argv.includes("--selftest")) {
  const faelle = [
    ["G1 — Meta-Wort im Kommentar", { copySource: copyOnDisk.replace(/text: "Great video\. Keep going! 👏"/, 'text: "Great grammar! 👏"'), story: storyOnDisk }, "G1", "grammar"],
    ["G2 — erfundene Handlung einer Figur", { copySource: copyOnDisk.replace(/text: "Ben reads it so well! 🎸"/, 'text: "Ben explains it so well! 🎸"'), story: storyOnDisk }, "G2", "explains"],
    ["G3 — erfundenes Zitat", { copySource: copyOnDisk.replace(/text: "one wrong word 😅 still charming"/, 'text: "Ben said “the Beatles was” 😅"'), story: storyOnDisk }, "G3", "Beatles"],
    ["G4 — die Bank ist nicht mehr sichtbar", { copySource: copyOnDisk.replace(/author:/g, "autor:"), story: storyOnDisk }, "G4", "not seeing the banks"],
    ["der ECHTE Stand", { copySource: copyOnDisk, story: storyOnDisk }, null, null],
  ];
  let schlecht = 0;
  for (const [name, welt, muss, mussAuch] of faelle) {
    const { failures } = analyse(welt);
    const sollRot = muss !== null;
    if (failures.length === 0 !== !sollRot) {
      schlecht++;
      console.error(sollRot
        ? `  ✗ ${name} — KEIN rotes Licht, das Gesetz ist blind`
        : `  ✗ ${name} — der Stand ist rot, obwohl er gruen sein muss: ${failures.join(" | ")}`);
      continue;
    }
    if (sollRot) {
      const treffer = failures.filter((f) => f.includes(muss) && f.includes(mussAuch));
      if (treffer.length !== 1) {
        schlecht++;
        console.error(`  ✗ ${name} — rot, aber nicht genau an der eingespeisten Stelle (${treffer.length} Treffer): ${failures.join(" | ")}`);
        continue;
      }
      console.log(`  ✓ ${name} — rot, und genau der eingespeiste Fehler`);
    } else console.log(`  ✓ ${name} — gruen`);
  }
  if (schlecht > 0) { console.error("check-g3-comments --selftest: FEHLGESCHLAGEN"); process.exit(1); }
  console.log(`check-g3-comments --selftest: OK — ${faelle.length - 1} Verfaelschungen rot, der echte Stand gruen`);
  process.exit(0);
}

const { failures, comments } = analyse({ copySource: copyOnDisk, story: storyOnDisk });
if (failures.length) {
  console.error(`✗ check-g3-comments: ${failures.length} problem(s)\n`);
  for (const m of failures) console.error("  - " + m);
  process.exit(1);
}
console.log(`✓ check-g3-comments: ${comments} comments in the FOURTEEN banks — no meta-talk, no invented quote, every claim about Ben/Leah/Leo/Sara backed by a scene line`);
