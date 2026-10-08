import assert from "node:assert/strict";
import { readFileSync, existsSync, readdirSync } from "node:fs";
import { describe, it } from "node:test";
import { TRAINER_MODES, memoryPairCount, modeDetails } from "./catalog.ts";
import { huntRounds, spellingWords, fullAnswer } from "./decks.ts";
import { loadUnit } from "@domigo/content-loader";
import { gradeVocab, spellingLayout, spellingAnswer } from "@domigo/engine";
import { validModeInput } from "./attempt-policy.ts";
import ts from "typescript";
const read = (name: string) => readFileSync(new URL(`../../app/modi/${name}`, import.meta.url), "utf8");

describe("cgo-109 mode contracts", () => {
  it("C01 every tile has a real route, in original order", () => {
    for (const mode of TRAINER_MODES) assert.ok(existsSync(new URL(`../../app/modi/${mode}/page.tsx`, import.meta.url)));
    const picker = read("ModePicker.tsx");
    const ordered = ["full", "sprint", "speed", "mc", "flashcards", "memory", "spelling", "wordhunt", "grammar"];
    let last = -1;
    for (const mode of ordered) { const index = picker.indexOf(`"${mode}"`, picker.indexOf("const modes:")); assert.ok(index > last, mode); last = index; }
    assert.match(picker, /Dictionary &amp; Flashcards/);
  });
  it("C02 reserve and Chapter selection are shared with practice", () => {
    assert.match(read("ModePage.tsx"), /await loadPracticeWords\(view, grade, chapters\)/);
    assert.match(read("ModePage.tsx"), /selectedChapters\(chaptersRaw, listApprovedUnits\(\)\.filter/);
    const practice = readFileSync(new URL("../../app/practice/load-practice.ts", import.meta.url), "utf8");
    assert.match(practice, /await listReservedForClass\(getDb\(\), acting\.classScope, acting\.classId\)/);
    assert.match(practice, /assignPool\(item\.id, reserved\) !== "mock"/);
    assert.doesNotMatch(practice, /listReservedForClass[^;]*\.catch/);
  });
  it("C03 only server receipts supply points, never client reward formulas", () => {
    const root = new URL("../../app/modi/", import.meta.url);
    const files = readdirSync(root, { recursive: true }).map(String).filter((p) => /\.(ts|tsx)$/.test(p) && !p.includes(".test."));
    for (const file of files) {
      const source = read(file);
      assert.doesNotMatch(source, /\bxpForTier\b/, file);
      const tree = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
      const arithmetic = new Set([ts.SyntaxKind.PlusToken, ts.SyntaxKind.MinusToken, ts.SyntaxKind.AsteriskToken, ts.SyntaxKind.SlashToken, ts.SyntaxKind.PlusEqualsToken, ts.SyntaxKind.MinusEqualsToken]);
      function visit(node: ts.Node) {
        if (ts.isBinaryExpression(node) && arithmetic.has(node.operatorToken.kind)) {
          const text = ts.isVariableDeclaration(node.parent) ? node.parent.getText(tree) : node.getText(tree);
          assert.doesNotMatch(text, /\bxp(?:Awarded|Total)?\b/i, file);
        }
        ts.forEachChild(node, visit);
      }
      visit(tree);
    }
    const session = read("ModeSession.tsx");
    assert.match(session, /confirmed\.map\(\(receipt\) => receipt\.xpAwarded \?\? 0\)/);
    assert.match(session, /all\.filter\(\(receipt\) => receipt\.ok\)/);
    assert.match(session, /subscribeOutboxReplies/);
  });
  it("C04 flashcards use both directions, empty Again, swipe and review", () => {
    const source = read("flashcards/Flashcards.tsx");
    assert.match(source, /setDirection\("enToDe"\)/); assert.match(source, /setDirection\("deToEn"\)/);
    assert.match(source, /value: got \? fullAnswer\(word, direction\) : "", pool: direction/);
    assert.match(source, /onPointerUp/); assert.match(source, /Math\.abs\(distance\) > 70/);
    assert.match(read("ModeSession.tsx"), /href=\{`\/review\$\{suffix\}`\}/);
  });
  it("C05 memory pairs follow the grade ruling and only matches submit", () => {
    assert.deepEqual([1, 2, 3, 4].map(memoryPairCount), [8, 12, 10, 12]);
    const source = read("memory/Memory.tsx");
    assert.match(source, /a\.pair === b\.pair && a\.side !== b\.side/);
    assert.equal((source.match(/await submit\(/g) ?? []).length, 1);
    assert.match(source, /kind: "choice", value: fullAnswer\(word\)/);
    assert.match(source, /setTimeout\(\(\) => \{ setOpen\(\[\]\); lock\.current = false; \}, 900\)/);
  });
  it("C06 spelling is at most eighteen and uses engine-owned phrase input", () => {
    const words = [1, 2, 3, 4].flatMap((grade) => loadUnit(`g${grade}-u01`).vocab);
    assert.equal(spellingWords(words).length, 18);
    for (const item of spellingWords(words)) {
      const layout = spellingLayout(fullAnswer(item, "deToEn"));
      const letters = layout.filter((slot) => !slot.fixed).map((slot) => slot.text).join("");
      assert.equal(gradeVocab(item, spellingAnswer(layout, letters), "deToEn").tier, "correct", item.id);
    }
    const source = read("spelling/Spelling.tsx");
    assert.match(source, /import \{ spellingAnswer, spellingLayout \} from "@domigo\/engine"/);
    assert.match(source, /value: spellingAnswer\(layout, letters\), pool: "deToEn" \}, hint/);
    assert.match(source, /setHint\(true\)/);
  });
  it("C07 hunt has eight Chapter rounds, 8–12 choices, all self-grade through engine", () => {
    for (let grade = 1; grade <= 4; grade++) {
      const words = [1, 2, 3].flatMap((chapter) => loadUnit(`g${grade}-u0${chapter}`).vocab);
      const rounds = huntRounds(words, () => 0.5);
      assert.equal(rounds.length, 8, `grade ${grade}`);
      for (const round of rounds) {
        assert.ok(round.tiles.length >= 8 && round.tiles.length <= 12);
        let right = 0, wrong = 0;
        for (const tile of round.tiles) {
          assert.ok(tile.item.id.startsWith(`g${grade}u${String(round.chapter).padStart(2, "0")}.`));
          const tier = gradeVocab(tile.item, tile.word).tier;
          assert.ok(["correct", "wrong"].includes(tier));
          if (tier === "correct") right++; else wrong++;
        }
        assert.ok(right >= 3 && wrong >= 2);
      }
    }
    assert.deepEqual(huntRounds(loadUnit("g2-u01").vocab), []);
    assert.match(read("wordhunt/WordHunt.tsx"), /kind: "choice", value: tile\.word/);
  });
  it("C08 speed displays sixty seconds, obtains server start only outside preview", () => {
    const session = read("ModeSession.tsx");
    assert.match(session, /mode === "speed" && !preview/);
    assert.match(session, /fetch\("\/modi\/speed\/start", \{ cache: "no-store" \}\)/);
    assert.match(session, /context: \{ speedSession \}/);
    assert.match(read("speed/Speed.tsx"), /max=\{60_000\}/);
    assert.match(read("speed/Speed.tsx"), /performance\.now\(\) >= deadline\.current/);
    assert.match(read("speed/Speed.tsx"), /if \(left === 0\)/);
  });
  it("C09 new mode tags only accept their vocab/input contract", () => {
    assert.equal(validModeInput("memory", "g1u01.w.cat", { kind: "choice" }), true);
    assert.equal(validModeInput("memory", "g1u01.w.cat", { kind: "vocab" }), false);
    assert.equal(validModeInput("speed", "g1u01.gi.cat", { kind: "vocab", pool: "deToEn" }), false);
    assert.equal(validModeInput("spelling", "g1u01.w.cat", { kind: "vocab", pool: "enToDe" }), false);
    assert.equal(validModeInput("flashcards", "g1u01.w.cat", { kind: "vocab", pool: "enToDe" }), true);
    assert.equal(validModeInput("practice", "g1u01.gi.cat", { kind: "text" }), true);
  });
  it("C10 first year instructions are German and rewards make no bonus promises", () => {
    assert.match(modeDetails(1).flashcards.sub, /Lernmodus/);
    for (const grade of [1, 2, 3, 4]) for (const info of Object.values(modeDetails(grade))) assert.doesNotMatch(info.sub + info.reward, /bonus|halves|halbiert|Speed Demon/i);
    assert.match(read("ModeSession.tsx"), /lang=\{de \? "de" : "en"\}/);
  });
});
