/**
 * K7a · Die Kurve, Sprosse für Sprosse. Ohne DB, ohne React (node --test, wie
 * lib/grade-scope.test.ts — apps/web hat kein vitest).
 *
 * Zwei Sorten Prüfung, und beide braucht es:
 *
 *   1. GRENZWERT-PAARE. Jede Schwelle wird zweimal befragt — einen Punkt davor
 *      und genau auf ihr. Eine Kurve, die nur "irgendwo dazwischen" geprüft ist,
 *      kann um eins verrutscht sein, ohne dass ein Test es merkt.
 *   2. BYTE-GLEICHE TITEL. Die Titel und Vibe-Zeilen sind Design-Bytes aus
 *      `docs/handover/design-study-og-trainers.md`. Die Stichproben hier sind
 *      aus DEN ZEILEN DER STUDIE kopiert (:234-253, :260-279, :288-301,
 *      :306-315), nicht aus levels.ts abgeschrieben — sonst prüfte die Datei
 *      sich selbst.
 */
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  LEVEL_XP,
  MAX_LEVEL,
  MAX_XP,
  PRESTIGE_XP,
  barFraction,
  formatXp,
  grammarTitle,
  levelFor,
  overallLevelFor,
  prestigeStars,
  registerFor,
  vocabTitle,
  zoneOfLevel,
} from "./levels.ts";

/**
 * Die Kurve, wie die Studie sie in :219-221 schreibt — HIER ausgeschrieben und
 * nicht aus levels.ts geholt. Ein Grenzwert-Test, der seine Schwellen aus dem
 * Prüfling selbst zieht, wandert mit jedem Fehler mit: er beweist dann nur noch,
 * dass die Funktion zu IRGENDEINER Tabelle passt. (Genau das ist beim ersten
 * Tamper aufgefallen — eine verschobene Schwelle liess ihn grün.)
 */
const CURVE = [
  0, 50, 120, 220, 350, 500, 700, 950, 1250, 1600,
  2000, 2700, 3500, 5000, 6500, 8000, 11000, 15000, 20000, 30000,
];

/** Die fünf Prestige-Schwellen, ebenso ausgeschrieben (Studie :222). */
const PRESTIGE = [30000, 45000, 65000, 90000, 120000];

describe("die Kurve — jede Schwelle als Grenzwert-Paar", () => {
  it("trägt die 20 Schwellen der Studie, in genau dieser Reihenfolge", () => {
    assert.deepEqual([...LEVEL_XP], CURVE);
    assert.equal(MAX_LEVEL, CURVE.length);
  });

  it("hebt an JEDER Schwelle um genau eine Stufe — und keinen Punkt früher", () => {
    // Level 20 fällt mit P1 zusammen (beide 30.000) und wird unten eigens geprüft.
    for (let level = 2; level < 20; level += 1) {
      const at = CURVE[level - 1];
      assert.equal(levelFor(at - 1).level, level - 1, `${at - 1} XP muss noch Level ${level - 1} sein`);
      assert.equal(levelFor(at).level, level, `${at} XP muss Level ${level} sein`);
    }
  });

  it("beginnt bei null Punkten auf Level 1 und lässt sich nicht unter null drücken", () => {
    assert.equal(levelFor(0).level, 1);
    assert.equal(levelFor(0).xpIntoLevel, 0);
    assert.equal(levelFor(-500).level, 1);
    assert.equal(levelFor(Number.NaN).level, 1);
  });

  it("zählt die Punkte über der Schwelle und die Punkte bis zur nächsten", () => {
    const s = levelFor(2700); // genau Level 12
    assert.equal(s.level, 12);
    assert.equal(s.xpIntoLevel, 0);
    assert.equal(s.xpToNext, 800); // 3500 − 2700
    const t = levelFor(3000);
    assert.equal(t.level, 12);
    assert.equal(t.xpIntoLevel, 300);
    assert.equal(t.xpToNext, 500);
  });

  it("führt von Level 19 aus auf die 30.000 zu", () => {
    assert.equal(levelFor(29999).level, 19);
    assert.equal(levelFor(29999).xpToNext, 1);
    assert.equal(levelFor(20000).xpToNext, 10000);
  });
});

describe("die Zonen — die Farbe der Pill", () => {
  it("teilt die Leiter in Fünferblöcke (Studie :225)", () => {
    for (let l = 1; l <= 5; l += 1) assert.equal(zoneOfLevel(l), "bronze");
    for (let l = 6; l <= 10; l += 1) assert.equal(zoneOfLevel(l), "silver");
    for (let l = 11; l <= 15; l += 1) assert.equal(zoneOfLevel(l), "gold");
    for (let l = 16; l <= 20; l += 1) assert.equal(zoneOfLevel(l), "diamond");
  });

  it("gibt jedem Zonen-Wechsel seinen Grenzwert", () => {
    assert.equal(levelFor(350).zone, "bronze"); // L5
    assert.equal(levelFor(500).zone, "silver"); // L6
    assert.equal(levelFor(1599).zone, "silver"); // noch L10
    assert.equal(levelFor(2000).zone, "gold"); // L11
    assert.equal(levelFor(6499).zone, "gold"); // noch L15
    assert.equal(levelFor(8000).zone, "diamond"); // L16
  });
});

describe("Prestige — die zweite Achse über dem Deckel", () => {
  it("trägt die fünf Schwellen der Studie", () => {
    assert.deepEqual([...PRESTIGE_XP], PRESTIGE);
    assert.equal(MAX_XP, 120000);
  });

  it("macht die 30.000 zu Level 20 UND zum ersten Prestige-Rang", () => {
    assert.equal(levelFor(29999).prestige, 0);
    const cap = levelFor(30000);
    assert.equal(cap.level, 20);
    assert.equal(cap.prestige, 1);
    assert.equal(cap.zone, "prestige");
    assert.equal(cap.xpIntoLevel, 0);
    assert.equal(cap.xpToNext, 15000); // 45000 − 30000
  });

  it("hebt an jeder Prestige-Schwelle um genau einen Rang — und keinen Punkt früher", () => {
    for (let rank = 2; rank <= 5; rank += 1) {
      const at = PRESTIGE[rank - 1];
      assert.equal(levelFor(at - 1).prestige, rank - 1, `${at - 1} XP muss noch P${rank - 1} sein`);
      assert.equal(levelFor(at).prestige, rank, `${at} XP muss P${rank} sein`);
      assert.equal(levelFor(at).level, 20, "die Stufe bleibt 20, quer durch alle Ränge");
      assert.equal(levelFor(at).zone, "prestige");
    }
  });

  it("setzt einen Stern je Rang, und unter Prestige keinen", () => {
    assert.equal(prestigeStars(0), "");
    assert.equal(prestigeStars(1), "⭐");
    assert.equal(prestigeStars(3), "⭐⭐⭐");
    assert.equal(prestigeStars(5), "⭐⭐⭐⭐⭐");
  });
});

describe("der Deckel — wo es nichts mehr zu erreichen gibt", () => {
  it("lässt xpToNext NUR am absoluten Deckel auf null fallen", () => {
    assert.equal(levelFor(119999).xpToNext, 1);
    assert.equal(levelFor(120000).xpToNext, null);
    assert.equal(levelFor(500000).xpToNext, null);
    assert.equal(levelFor(500000).prestige, 5);
  });

  it("hat unterhalb des Deckels IMMER eine Restzahl", () => {
    for (const xp of [0, 49, 50, 1599, 29999, 30000, 44999, 89999, 119999]) {
      assert.notEqual(levelFor(xp).xpToNext, null, `${xp} XP darf kein Deckel sein`);
    }
  });

  it("füllt den Balken am Deckel ganz", () => {
    const cap = levelFor(120000);
    assert.equal(barFraction(cap.xpIntoLevel, cap.xpToNext), 1);
    assert.equal(barFraction(0, 100), 0);
    assert.equal(barFraction(25, 75), 0.25);
  });
});

describe("das Register — welche Leiter ein Kind liest", () => {
  it("gibt der 1. Klasse die sanfte Leiter, allen anderen die Gamer-Leiter", () => {
    assert.equal(registerFor(1), "gentle");
    assert.equal(registerFor(2), "gamer");
    assert.equal(registerFor(3), "gamer");
    assert.equal(registerFor(4), "gamer");
  });

  it("fällt bei unbekannter Stufe auf die Gamer-Leiter zurück — die Mehrheit", () => {
    assert.equal(registerFor(null), "gamer");
    assert.equal(registerFor(undefined), "gamer");
  });
});

describe("Vokabel-Titel — byte-gleich mit der Studie (:234-253 / :260-279)", () => {
  it("liest die sanfte Leiter der 1. Klasse", () => {
    assert.deepEqual(vocabTitle(1, 0, "gentle"), { name: "Wordling", vibe: "just spawned in" });
    assert.deepEqual(vocabTitle(3, 0, "gentle"), { name: "Spelling Bee", vibe: "letter by letter" });
    assert.deepEqual(vocabTitle(7, 0, "gentle"), { name: "Phrase Finder", vibe: "finding the right words" });
    assert.deepEqual(vocabTitle(13, 0, "gentle"), { name: "Word Master", vibe: "mastering words" });
    assert.deepEqual(vocabTitle(18, 0, "gentle"), { name: "Vocab Sovereign", vibe: "sovereign in all situations" });
    assert.deepEqual(vocabTitle(20, 0, "gentle"), { name: "Grandmaster", vibe: "GG" });
  });

  it("liest die Gamer-Leiter der 2. bis 4. Klasse", () => {
    assert.deepEqual(vocabTitle(1, 0, "gamer"), { name: "Wordling", vibe: "just spawned in" });
    assert.deepEqual(vocabTitle(4, 0, "gamer"), { name: "Letter Looter", vibe: "grabbing the first loot" });
    assert.deepEqual(vocabTitle(8, 0, "gamer"), { name: "Syntax Striker", vibe: "landing clean hits" });
    assert.deepEqual(vocabTitle(12, 0, "gamer"), { name: "Word Wizard", vibe: "spells are getting real" });
    assert.deepEqual(vocabTitle(17, 0, "gamer"), { name: "Sentence Sovereign", vibe: "ruling the syntax realm" });
    assert.deepEqual(vocabTitle(20, 0, "gamer"), { name: "Grandmaster", vibe: "GG" });
  });

  it("hält die beiden Leitern dort auseinander, wo sie sich unterscheiden", () => {
    assert.notDeepEqual(vocabTitle(3, 0, "gentle"), vocabTitle(3, 0, "gamer"));
    assert.notDeepEqual(vocabTitle(12, 0, "gentle"), vocabTitle(12, 0, "gamer"));
    // und lässt sie dort gleich, wo die Studie sie gleich schreibt
    assert.deepEqual(vocabTitle(1, 0, "gentle"), vocabTitle(1, 0, "gamer"));
    assert.deepEqual(vocabTitle(2, 0, "gentle"), vocabTitle(2, 0, "gamer"));
  });

  it("friert den Titel am Deckel ein und zieht nur die Vibe-Zeile mit (:222/:254)", () => {
    assert.deepEqual(vocabTitle(20, 1, "gamer"), { name: "Grandmaster", vibe: "prestige unlocked" });
    assert.deepEqual(vocabTitle(20, 2, "gamer"), { name: "Grandmaster", vibe: "rising legend" });
    assert.deepEqual(vocabTitle(20, 3, "gentle"), { name: "Grandmaster", vibe: "elite status" });
    assert.deepEqual(vocabTitle(20, 4, "gamer"), { name: "Grandmaster", vibe: "mythic tier" });
    assert.deepEqual(vocabTitle(20, 5, "gentle"), { name: "Grandmaster", vibe: "ultimate master" });
  });
});

describe("Grammatik-Titel — eigener Topf, gleiche Schwellen (:288-301)", () => {
  it("liest die Leiter, die alle vier Klassen teilen", () => {
    assert.deepEqual(grammarTitle(3, 0, "gamer"), { name: "Tense Cadet", vibe: "past, present, future..." });
    assert.deepEqual(grammarTitle(9, 0, "gamer"), { name: "Grammar Gladiator", vibe: "arena-tested" });
    assert.deepEqual(grammarTitle(12, 0, "gentle"), { name: "Grammar Goat", vibe: "greatest of all time" });
    assert.deepEqual(grammarTitle(14, 0, "gamer"), { name: "Punctuation Pirate", vibe: "stealing commas everywhere" });
    assert.deepEqual(grammarTitle(19, 0, "gamer"), { name: "Language Lich", vibe: "undying grammar power" });
    assert.deepEqual(grammarTitle(20, 0, "gamer"), { name: "Grammar God", vibe: "GG" });
  });

  it("weicht NUR auf Stufe 1 zwischen den Registern ab (:284-285)", () => {
    assert.deepEqual(grammarTitle(1, 0, "gamer"), { name: "Rule Noob", vibe: "just spawned in" });
    assert.deepEqual(grammarTitle(1, 0, "gentle"), { name: "Rule Rookie", vibe: "first rule learned" });
    for (let l = 2; l <= 20; l += 1) {
      assert.deepEqual(grammarTitle(l, 0, "gentle"), grammarTitle(l, 0, "gamer"), `Stufe ${l} darf nicht abweichen`);
    }
  });

  it("friert auch hier am Deckel ein", () => {
    assert.deepEqual(grammarTitle(20, 1, "gentle"), { name: "Grammar God", vibe: "prestige unlocked" });
    assert.deepEqual(grammarTitle(20, 5, "gamer"), { name: "Grammar God", vibe: "ultimate master" });
  });
});

describe("die Gesamt-Leiter — Vokabel plus Grammatik (:306-315)", () => {
  const LADDER = [
    { xp: 0, name: "First Steps", zone: "bronze", vibe: "every journey starts here" },
    { xp: 300, name: "Listener", zone: "bronze", vibe: "tuning in to English" },
    { xp: 1000, name: "Communicator", zone: "silver", vibe: "starting to get your point across" },
    { xp: 3000, name: "Storyteller", zone: "silver", vibe: "finding your voice in English" },
    { xp: 6000, name: "Translator", zone: "gold", vibe: "bridging two languages" },
    { xp: 12000, name: "Globetrotter", zone: "gold", vibe: "English takes you places" },
    { xp: 20000, name: "Polyglot", zone: "gold", vibe: "fluency is within reach" },
    { xp: 35000, name: "Native Speaker", zone: "diamond", vibe: "sounds like you grew up with it" },
    { xp: 55000, name: "Language Architect", zone: "diamond", vibe: "building English like a pro" },
    { xp: 80000, name: "English GOAT", zone: "diamond", vibe: "greatest English learner of all time" },
  ];

  it("nennt auf jeder Schwelle Namen, Zone und Vibe-Zeile byte-gleich", () => {
    LADDER.forEach((rung, i) => {
      const s = overallLevelFor(rung.xp);
      assert.equal(s.level, i + 1);
      assert.equal(s.name, rung.name);
      assert.equal(s.zone, rung.zone);
      assert.equal(s.vibe, rung.vibe);
      assert.equal(s.xpIntoLevel, 0);
    });
  });

  it("hebt an jeder Schwelle um genau eine Stufe — und keinen Punkt früher", () => {
    for (let i = 1; i < LADDER.length; i += 1) {
      assert.equal(overallLevelFor(LADDER[i].xp - 1).level, i, `${LADDER[i].xp - 1} XP muss noch Stufe ${i} sein`);
      assert.equal(overallLevelFor(LADDER[i].xp).level, i + 1);
    }
  });

  it("hat auf der letzten Sprosse kein Danach mehr", () => {
    assert.equal(overallLevelFor(79999).xpToNext, 1);
    assert.equal(overallLevelFor(80000).xpToNext, null);
    assert.equal(overallLevelFor(999999).name, "English GOAT");
    assert.equal(overallLevelFor(0).xpToNext, 300);
    assert.equal(overallLevelFor(-10).level, 1);
  });
});

describe("die Zahlen, wie das Kind sie liest", () => {
  it("setzt den englischen Tausender-Trenner (:511)", () => {
    assert.equal(formatXp(0), "0");
    assert.equal(formatXp(999), "999");
    assert.equal(formatXp(1234), "1,234");
    assert.equal(formatXp(30000), "30,000");
    assert.equal(formatXp(-5), "0");
  });
});
