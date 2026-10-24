import { describe, it, expect } from "vitest";
import { gradeVocab } from "@domigo/engine";
import { listApprovedUnits, loadUnit } from "../../content-loader/src/index.ts";
import { advanceLive, answerElapsed, battleRoundWinner, liveScores, nextQuiz, quizPoints, selectLiveQuestions, startLive, LIVE_MODES, LIVE_POLL_MS, type LiveClock, type LiveReceipt } from "./live-rules.ts";
const base: LiveClock = { kind: "battle", phase: "pending", round: 0, questionCount: 5, phaseAt: 1000, expiresAt: 3601000 };
const receipt = (correct = true, elapsedMs = 1000): LiveReceipt => ({ attemptId: "synthetic", correct, elapsedMs, xp: correct ? 10 : 0 });
describe("live server rules", () => {
    it("L01 server timing accepts only the active question window", () => {
        const active = { ...base, phase: "active" as const };
        expect(answerElapsed(active, 1000)).toBe(0);
        expect(answerElapsed(active, 15999)).toBe(14999);
        for (const time of [999, 16000, NaN, Infinity])
            expect(() => answerElapsed(active, time)).toThrow();
        for (const phase of ["countdown", "pending", "result", "complete", "cancelled"] as const)
            expect(() => answerElapsed({ ...active, phase }, 1001)).toThrow();
    });
    it("L02 invitation expires at thirty seconds; countdown comes from server time", () => {
        expect(startLive(base, 2, 30999)).toMatchObject({ phase: "countdown", phaseAt: 34999 });
        expect(() => startLive(base, 2, 31000)).toThrow();
        expect(advanceLive(base, [], 31000).phase).toBe("cancelled");
        expect(() => startLive(base, 1, 1001)).toThrow();
        expect(() => startLive(base, 3, 1001)).toThrow();
        const clock = startLive(base, 2, 1001);
        expect(advanceLive(clock, [], 5000).phase).toBe("countdown");
        expect(advanceLive(clock, [], 5001).phase).toBe("active");
    });
    it("L03 faster correct wins; wrong never beats correct; exact ties draw", () => {
        expect(battleRoundWinner(receipt(true, 2), receipt(true, 3))).toBe(0);
        expect(battleRoundWinner(receipt(false, 1), receipt(true, 3000))).toBe(1);
        expect(battleRoundWinner(receipt(true, 3), receipt(true, 3))).toBe(null);
        expect(battleRoundWinner(null, receipt(false))).toBe(null);
        expect(battleRoundWinner(receipt(true), null)).toBe(0);
    });
    it("L04 quiz uses speed points with floor500 and keeps XP separate", () => {
        expect(quizPoints(true, 0)).toBe(1000);
        expect(quizPoints(true, 7500)).toBe(750);
        expect(quizPoints(true, 15000)).toBe(500);
        expect(quizPoints(true, 20000)).toBe(500);
        expect(quizPoints(false, 1)).toBe(0);
        expect(liveScores("quiz", [{ answers: [receipt(true, 7500), receipt(false)] }], 1)).toEqual([750]);
        for (const n of [-1, NaN, Infinity])
            expect(() => quizPoints(true, n)).toThrow();
    });
    it("L05 timeout needs no invented answers; unbeatable lead ends a battle", () => {
        const players = [{ answers: [receipt(), receipt(), receipt()] }, { answers: [null, null, null] }];
        const active = { ...base, phase: "active" as const, round: 2 };
        const result = advanceLive(active, players, 16000);
        expect(result.phase).toBe("result");
        expect(advanceLive(result, players, 18999).phase).toBe("result");
        expect(advanceLive(result, players, 19000).phase).toBe("complete");
        expect(players[1]!.answers).toEqual([null, null, null]);
    });
    it("L06 teacher advances quiz; polls cannot skip the result screen", () => {
        const quiz = { ...base, kind: "quiz" as const, phase: "result" as const };
        expect(advanceLive(quiz, [], 20000)).toEqual(quiz);
        expect(nextQuiz(quiz, 20000)).toMatchObject({ round: 1, phase: "countdown", phaseAt: 24000 });
        expect(nextQuiz({ ...quiz, round: 4 }, 20000).phase).toBe("complete");
        expect(() => nextQuiz({ ...quiz, phase: "active" }, 20000)).toThrow();
    });
    it("L07 one-hour expiry closes rooms, while completed results stay complete", () => {
        expect(advanceLive({ ...base, phase: "lobby" }, [], base.expiresAt).phase).toBe("cancelled");
        expect(advanceLive({ ...base, phase: "complete" }, [], base.expiresAt + 1).phase).toBe("complete");
        expect(LIVE_POLL_MS).toBe(2000);
    });
    it("L08 every approved Chapter and mode supplies five unique authored, self-gradable questions", () => {
        let checked = 0;
        for (const slug of listApprovedUnits())
            for (const mode of LIVE_MODES) {
                const items = loadUnit(slug).vocab, grade = Number(slug[1]);
                const qs = selectLiveQuestions(items, grade, [slug], mode, 5, "synthetic", new Set());
                expect(qs).toHaveLength(5);
                expect(new Set(qs.map(q => q.prompt)).size).toBe(5);
                for (const q of qs) {
                    const item = items.find(i => i.id === q.itemId)!;
                    expect(q.unitKey).toBe(slug);
                    expect(q.options).toHaveLength(4);
                    expect(q.options.filter(o => gradeVocab(item, o, q.pool).tier === "correct")).toHaveLength(1);
                    checked++;
                }
            }
        expect(checked).toBe(57 * 3 * 5);
    });
    it("L09 reservation and year are enforced during selection", () => {
        const items = loadUnit("g1-u01").vocab;
        expect(() => selectLiveQuestions(items, 2, ["g1-u01"], "translation", 5, "x", new Set())).toThrow();
        expect(() => selectLiveQuestions(items, 1, ["g1-u01"], "translation", 5, "x", new Set(items.map(i => i.id)))).toThrow();
        const reserved = new Set(items.slice(0, 4).map(i => i.id));
        expect(selectLiveQuestions(items, 1, ["g1-u01"], "translation", 5, "x", reserved).every(q => !reserved.has(q.itemId))).toBe(true);
    });
});
