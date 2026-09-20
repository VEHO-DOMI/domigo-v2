// CI gate for the Year-3 audience curve (welle-049, REVIEWPLAN_YEAR3 §3): every audience
// number a child sees in FOURTEEN comes from ONE table and the table tells a consistent story.
//
//   node --experimental-strip-types scripts/check-g3-economy.mjs
//   node --experimental-strip-types scripts/check-g3-economy.mjs --selftest   (proves the red light works)
//
// The table: content/corpus/stories/g3.st.fourteen/economy.json (economy@1) — per chapter
// views · likeRate · subscribers. Story numbers, identical for every child; performance never
// moves them (VISION 3: the one hidden XP stays the only economy; band ceiling untouched).
//
// Laws:
//   E1  one row per story chapter, in chapter order — no episode without its numbers
//   E2  views/subscribers are whole numbers ≥ 0; 0 < likeRate ≤ 1
//   E3  likes ≤ views per episode (likes = round(views × likeRate), display only)
//   E4  channel views (running sum) never fall
//   E5  the curve Koki ruled (welle-043, 16.09.): views and subscribers RISE every episode
//       except the authorised dips ep09 · ep12 · ep13, which must FALL; ep11 is the views peak
//   E6  the upload screen shows the table: views + likes on every episode; the "channel just
//       hit N subscribers" boast only ep01–10 on a rise; a dip and ep11–14 get the quiet line
//   E7  no audience number literal in the story (textEn, scaffoldDe, glosses): a number next
//       to views/likes/subscribers/comments/followers/Aufrufe/Abonnenten/Kommentare — before
//       it or up to three words after it — must be a placeholder {{views}} · {{likes}} · {{subscribers}}
//   E8  only known placeholders, only in the two filled fields; after filling none is left and
//       the filled line carries exactly the table number (en "60,000" · de "60.000")
//
// The art library's baked-in counts are checked against the same table by gate 13b in
// docs/art/build-g3-prompts.mjs (run by check-story-art.mjs).
//
// SELBSTTEST: das Urteil ist eine REINE FUNKTION. Der Selbsttest reicht ihr die ECHTEN Dateien
// mit genau EINER Verfaelschung im Speicher herein (P-71: Tamper gegen den Messwert; die Platte
// wird nicht angefasst) und prueft, dass GENAU der eingespeiste Fehler gemeldet wird
// (E5-Lehre). Der letzte Fall: der ECHTE Stand ist gruen.
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { STAT_PLACEHOLDERS, fillChapterStats, formatCount, likesFor, uploadStats } from "../packages/game-novel/src/novel-copy.ts";

const REPO = join(dirname(fileURLToPath(import.meta.url)), "..");
const STORY_DIR = join(REPO, "content/corpus/stories/g3.st.fourteen");

/** The authorised dips of the ruled curve (REVIEWPLAN_YEAR3 §3 table, Koki via GG 16.09.). */
export const AUTHORISED_DIPS = new Set([9, 12, 13]);
export const PEAK_EP = 11;
const LAST_BOAST_EP = 10;

const STAT_NOUN = String.raw`(?:views?|likes?|subscribers?|comments?|followers?|Aufrufe|Abonnenten|Kommentare|Follower)`;
// Both word orders (blind review 16.09.: "Subscribers now stand at 60,000" slipped through a
// number-first-only pattern): number → noun, and noun → up to three words or a colon → number.
const LITERAL = new RegExp(String.raw`(?:\d[\d.,]*\s*k?|\b(?:hundreds?|thousands?|millions?|tausend|Tausende)(?:\s+of)?)\s+${STAT_NOUN}\b`
  + String.raw`|\b${STAT_NOUN}\b[:\s]+(?:[\p{L}']+\s+){0,3}?(?:\d[\d.,]*|hundreds?|thousands?|millions?|tausend|Tausende)`, "iu");
const PLACEHOLDER = /\{\{\s*([^}]*?)\s*\}\}/g;

const epOf = (chapterId) => Number(chapterId.slice(-2));

export const analyse = ({ economy, story, render = uploadStats, fill = fillChapterStats }) => {
  const failures = [];
  const bad = (m) => failures.push(m);
  const eps = economy.episodes ?? [];

  // E1
  if (economy.storyId !== story.id) bad(`E1: economy.json is for "${economy.storyId}", the story is "${story.id}"`);
  const chapterIds = story.chapters.map((c) => c.id);
  for (const [i, id] of chapterIds.entries()) {
    if (eps[i]?.chapterId !== id) bad(`E1: ${id.slice(-4)} has no economy row at position ${i + 1} (found ${eps[i]?.chapterId ?? "nothing"})`);
  }
  if (eps.length > chapterIds.length) bad(`E1: economy.json has ${eps.length} rows for ${chapterIds.length} chapters`);

  let cumulative = 0;
  for (const [i, e] of eps.entries()) {
    const ep = epOf(e.chapterId);
    const tag = e.chapterId.slice(-4);
    // E2
    if (!Number.isInteger(e.views) || e.views < 0) bad(`E2: ${tag} views must be a whole number ≥ 0 (is ${e.views})`);
    if (!Number.isInteger(e.subscribers) || e.subscribers < 0) bad(`E2: ${tag} subscribers must be a whole number ≥ 0 (is ${e.subscribers})`);
    if (typeof e.likeRate !== "number" || !(e.likeRate > 0 && e.likeRate <= 1)) bad(`E2: ${tag} likeRate must be in (0, 1] (is ${e.likeRate})`);
    for (const field of ["shares", "comments"]) {
      if (!Number.isInteger(e[field]) || e[field] < 0) bad(`E2: ${tag} ${field} must be a whole number ≥ 0 (is ${e[field]})`);
    }
    // E3
    const likes = likesFor(e);
    if (likes > e.views) bad(`E3: ${tag} likes ${formatCount(likes, "en")} > views ${formatCount(e.views, "en")}`);
    // E4
    const next = cumulative + e.views;
    if (next < cumulative) bad(`E4: ${tag} channel views fall (${formatCount(cumulative, "en")} → ${formatCount(next, "en")})`);
    cumulative = next;
    // E5
    if (i > 0) {
      const p = eps[i - 1];
      for (const field of ["views", "subscribers"]) {
        const rose = e[field] > p[field];
        if (AUTHORISED_DIPS.has(ep) && rose) bad(`E5: ${tag} ${field} must fall (authorised dip), but rises ${formatCount(p[field], "en")} → ${formatCount(e[field], "en")}`);
        if (!AUTHORISED_DIPS.has(ep) && !rose) bad(`E5: ${tag} ${field} ${formatCount(p[field], "en")} → ${formatCount(e[field], "en")} is an unauthorised dip (only ep09 · ep12 · ep13 may fall)`);
      }
    }
  }
  const peak = eps.find((e) => epOf(e.chapterId) === PEAK_EP);
  if (peak && eps.some((e) => e !== peak && e.views >= peak.views)) bad(`E5: ch11 must be the views peak (${formatCount(peak.views, "en")})`);

  // E6
  for (const [i, e] of eps.entries()) {
    const ep = epOf(e.chapterId);
    const tag = e.chapterId.slice(-4);
    const shown = render(eps, e.chapterId);
    if (!shown) { bad(`E6: ${tag} upload screen shows no numbers`); continue; }
    const want = `${formatCount(e.views, "en")} views · ${formatCount(likesFor(e), "en")} likes`;
    if (shown.statsLine !== want) bad(`E6: ${tag} upload screen shows "${shown.statsLine}", the table says "${want}"`);
    const rose = e.subscribers > (i > 0 ? eps[i - 1].subscribers : 0);
    const subs = formatCount(e.subscribers, "en");
    if (ep <= LAST_BOAST_EP && rose) {
      if (shown.milestone !== subs) bad(`E6: ${tag} upload screen milestone "${shown.milestone}", the table says ${subs}`);
    } else {
      if (shown.milestone !== null) bad(`E6: ${tag} upload screen boasts "${shown.milestone} subscribers" — no boast on a dip or after the reckoning`);
      if (!shown.quietLine?.includes(`Subscribers: ${subs} `)) bad(`E6: ${tag} upload screen quiet line "${shown.quietLine}" does not carry the table's ${subs}`);
    }
  }

  // E7 + E8
  const rowById = new Map(eps.map((e) => [e.chapterId, e]));
  for (const chapter of story.chapters) {
    const row = rowById.get(chapter.id);
    const filled = row ? fill(chapter, eps) : null;
    for (const [si, scene] of chapter.scenes.entries()) {
      const texts = [["textEn", scene.textEn], ["scaffoldDe", scene.scaffoldDe]];
      for (const [gi, g] of (scene.glosses ?? []).entries()) texts.push([`glosses[${gi}].word`, g.word], [`glosses[${gi}].de`, g.de]);
      for (const [field, text] of texts) {
        if (typeof text !== "string") continue;
        const lit = text.match(LITERAL);
        if (lit) bad(`E7: ${scene.id} ${field} carries the number literal "${lit[0]}" — use {{views}} · {{likes}} · {{subscribers}}`);
        for (const m of text.matchAll(PLACEHOLDER)) {
          if (!STAT_PLACEHOLDERS.includes(m[1])) bad(`E8: ${scene.id} ${field} has an unknown placeholder "${m[0]}"`);
          else if (field !== "textEn" && field !== "scaffoldDe") bad(`E8: ${scene.id} ${field} has a placeholder the game never fills`);
          else if (row) {
            const lang = field === "textEn" ? "en" : "de";
            const n = m[1] === "likes" ? likesFor(row) : row[m[1]];
            const out = filled.scenes[si][field];
            if (!out.includes(formatCount(n, lang))) bad(`E8: ${scene.id} ${field} filled as "${out}", but the table says ${formatCount(n, lang)} ${m[1]}`);
          }
        }
      }
      if (filled) {
        for (const field of ["textEn", "scaffoldDe"]) {
          const out = filled.scenes[si][field];
          if (typeof out === "string" && /\{\{|\}\}/.test(out)) bad(`E8: ${scene.id} ${field} still shows a placeholder after filling: "${out}"`);
        }
      }
    }
  }
  return { failures, episodes: eps.length, cumulative };
};

const economyOnDisk = JSON.parse(readFileSync(join(STORY_DIR, "economy.json"), "utf8"));
const storyOnDisk = JSON.parse(readFileSync(join(STORY_DIR, "story.json"), "utf8"));

// ── SELBSTTEST ───────────────────────────────────────────────────────────────
if (process.argv.includes("--selftest")) {
  const klon = (o) => JSON.parse(JSON.stringify(o));
  const row = (eco, ch) => eco.episodes.find((e) => e.chapterId.endsWith(ch));
  const scene = (st, id) => st.chapters.flatMap((c) => c.scenes).find((s) => s.id.endsWith(id));
  const faelle = [
    ["Likes > Views (likeRate 1.5 an ch05)", () => {
      const eco = klon(economyOnDisk); row(eco, "ch05").likeRate = 1.5;
      return analyse({ economy: eco, story: storyOnDisk });
    }, "E3: ch05 likes", "> views"],
    ["eine Zahl kleiner als die vorige (Abonnenten ch03 unter ch02)", () => {
      const eco = klon(economyOnDisk); row(eco, "ch03").subscribers = row(eco, "ch02").subscribers - 1;
      return analyse({ economy: eco, story: storyOnDisk });
    }, "E5: ch03 subscribers", "unauthorised dip"],
    ["autorisierter Einbruch steigt (Views ch12 ueber ch11)", () => {
      const eco = klon(economyOnDisk); row(eco, "ch12").views = row(eco, "ch11").views + 1;
      return analyse({ economy: eco, story: storyOnDisk });
    }, "E5: ch12 views", "must fall"],
    ["negative Views (ch04)", () => {
      const eco = klon(economyOnDisk); row(eco, "ch04").views = -1;
      return analyse({ economy: eco, story: storyOnDisk });
    }, "E2: ch04 views", "whole number"],
    ["Literal »60,000 subscribers« zurueck in ch07.s008", () => {
      const st = klon(storyOnDisk); const s = scene(st, "ch07.s008");
      s.textEn = s.textEn.replace("{{subscribers}}", "60,000");
      return analyse({ economy: economyOnDisk, story: st });
    }, "E7: g3.st.fourteen.ch07.s008 textEn", "60,000 subscribers"],
    ["Literal im deutschen Geruest (ch01.s009 »47 Aufrufe«)", () => {
      const st = klon(storyOnDisk); const s = scene(st, "ch01.s009");
      s.scaffoldDe = s.scaffoldDe.replace("{{views}}", "47");
      return analyse({ economy: economyOnDisk, story: st });
    }, "E7: g3.st.fourteen.ch01.s009 scaffoldDe", "47 Aufrufe"],
    ["Literal nach dem Wort (ch07.s008 »Subscribers now stand at 60,000«)", () => {
      const st = klon(storyOnDisk); const s = scene(st, "ch07.s008");
      s.textEn = s.textEn.replace("We have {{subscribers}} subscribers now.", "Subscribers now stand at 60,000.");
      return analyse({ economy: economyOnDisk, story: st });
    }, "E7: g3.st.fourteen.ch07.s008 textEn", "Subscribers now stand at 60"],
    ["unbekannter Platzhalter {{followers}} in ch08.s007", () => {
      const st = klon(storyOnDisk); const s = scene(st, "ch08.s007");
      s.textEn = s.textEn.replace("{{subscribers}}", "{{followers}}");
      return analyse({ economy: economyOnDisk, story: st });
    }, "E8: g3.st.fourteen.ch08.s007 textEn", "unknown placeholder"],
    ["fehlende Zeile ch14", () => {
      const eco = klon(economyOnDisk); eco.episodes = eco.episodes.filter((e) => !e.chapterId.endsWith("ch14"));
      return analyse({ economy: eco, story: storyOnDisk });
    }, "E1: ch14", "no economy row"],
    ["Anzeige um eine Episode verrutscht (ch07 zeigt ch06)", () => {
      const render = (eps, id) => uploadStats(eps, id.endsWith("ch07") ? id.replace("ch07", "ch06") : id);
      return analyse({ economy: economyOnDisk, story: storyOnDisk, render });
    }, "E6: ch07 upload screen shows", "the table says"],
    ["Jubel nach der Abrechnung (ch12 boasts)", () => {
      const render = (eps, id) => {
        const r = uploadStats(eps, id);
        return id.endsWith("ch12") && r ? { ...r, milestone: "95,000" } : r;
      };
      return analyse({ economy: economyOnDisk, story: storyOnDisk, render });
    }, "E6: ch12 upload screen boasts", "after the reckoning"],
    ["Fuellung aus der falschen Zeile (ch10 mit ch09 gefuellt)", () => {
      const fill = (chapter, eps) => fillChapterStats(chapter.id.endsWith("ch10")
        ? { ...chapter, id: chapter.id.replace("ch10", "ch09") } : chapter, eps);
      return analyse({ economy: economyOnDisk, story: storyOnDisk, fill });
    }, "E8: g3.st.fourteen.ch10.s010 textEn", "the table says 70,000"],
    ["fehlende Shares-Zahl", () => {
      const eco = klon(economyOnDisk); delete row(eco, "ch02").shares;
      return analyse({ economy: eco, story: storyOnDisk });
    }, "E2: ch02 shares", "whole number"],
    ["negative Kommentar-Zahl", () => {
      const eco = klon(economyOnDisk); row(eco, "ch11").comments = -1;
      return analyse({ economy: eco, story: storyOnDisk });
    }, "E2: ch11 comments", "whole number"],
    ["NICHT-TAMPER: der echte Stand ist gruen", () => analyse({ economy: economyOnDisk, story: storyOnDisk }), null, null],
  ];
  let schlecht = 0;
  for (const [name, lauf, muss, mussAuch] of faelle) {
    const { failures } = lauf();
    const rot = failures.length > 0;
    const sollRot = muss !== null;
    if (rot !== sollRot) {
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
      console.log(`  ✓ ${name} — rot, und genau der eingespeiste Fehler (${failures.length} Meldung/en)`);
    } else console.log(`  ✓ ${name} — gruen`);
  }
  if (schlecht > 0) { console.error("check-g3-economy --selftest: FEHLGESCHLAGEN"); process.exit(1); }
  console.log(`check-g3-economy --selftest: OK — ${faelle.length - 1} Verfaelschungen rot, der echte Stand gruen`);
  process.exit(0);
}

// ── ECHTER LAUF ──────────────────────────────────────────────────────────────
const { failures, episodes, cumulative } = analyse({ economy: economyOnDisk, story: storyOnDisk });
if (failures.length) {
  console.error(`✗ check-g3-economy: ${failures.length} problem(s)\n`);
  for (const m of failures) console.error("  - " + m);
  process.exit(1);
}
console.log(`✓ check-g3-economy: ${episodes} episodes, one table — curve as ruled (dips ep09·ep12·ep13, peak ep11), `
  + `likes ≤ views, upload screen = table, no number literal in the prose (channel total ${formatCount(cumulative, "en")} views)`);
