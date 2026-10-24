import { describe, it, expect } from "vitest";
import { gradeVocab } from "@domigo/engine";
import { listApprovedUnits, loadUnit } from "../../content-loader/src/index.ts";
import { advanceLive, answerElapsed, battleRoundWinner, liveScores, nextQuiz, quizPoints, selectLiveQuestions, startLive, LIVE_MODES, LIVE_POLL_MS, LIVE_PROCESSING_MS, liveReviewed, liveChapterAvailability, type LiveClock, type LiveReceipt } from "./live-rules.ts";
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
        expect(advanceLive(active, players, 16000).phase).toBe("active");
        const settled = 16000 + LIVE_PROCESSING_MS;
        const result = advanceLive(active, players, settled);
        expect(result.phase).toBe("result");
        expect(advanceLive(result, players, settled + 2999).phase).toBe("result");
        expect(advanceLive(result, players, settled + 3000).phase).toBe("complete");
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
    it("L08 every selectable question belongs to the closed reviewed bank; insufficient selections fail closed", () => {
        let checked = 0;
        for (const slug of listApprovedUnits()) for (const mode of LIVE_MODES) {
            const items = loadUnit(slug).vocab, grade = Number(slug[1]);
            if (liveChapterAvailability(slug, "quiz")[mode] < 5) {
                expect(() => selectLiveQuestions(items,grade,[slug],mode,5,"synthetic",new Set(), "quiz")).toThrow();
                continue;
            }
            const qs = selectLiveQuestions(items, grade, [slug], mode, 5, "synthetic", new Set(), "quiz");
            expect(qs).toHaveLength(5);
            expect(new Set(qs.map(q => q.prompt)).size).toBe(5);
            for (const q of qs) {
                const item = items.find(i => i.id === q.itemId)!;
                expect(liveReviewed(item,q.pool,"quiz")).toBe(true);
                expect(q.unitKey).toBe(slug);
                expect(q.options).toHaveLength(4);
                expect(q.options.filter(o => gradeVocab(item, o, q.pool).tier === "correct")).toHaveLength(1);
                checked++;
            }
        }
        expect(checked).toBeGreaterThan(0);
        for(const grade of [1,2,3,4]) for(const mode of LIVE_MODES) {
            const units=listApprovedUnits().filter(u=>u.startsWith(`g${grade}-`));
            const items=units.flatMap(u=>loadUnit(u).vocab);
            for(const seed of ["one","two","three"]) {
                const qs=selectLiveQuestions(items,grade,units,mode,5,seed,new Set(), "quiz");
                expect(qs.every(q=>liveReviewed(items.find(i=>i.id===q.itemId)!,q.pool,"quiz"))).toBe(true);
            }
        }
    });
    it("L10 unknown or edited content cannot inherit a former semantic approval", () => {
        const items=loadUnit("g1-u01").vocab;
        const edited=items.map(i=>({...i,g:i.g+" [changed]"}));
        expect(()=>selectLiveQuestions(edited,1,["g1-u01"],"translation",5,"x",new Set(), "quiz")).toThrow();
        for(const item of items.filter(i=>liveReviewed(i,"deToEn","quiz"))) {
            expect(liveReviewed({...item,mc:[...item.mc.slice(0,2),"new choice"]},"deToEn","quiz")).toBe(false);
            expect(liveReviewed({...item,difficulty:item.difficulty===1?2:1},"deToEn","quiz")).toBe(false);
        }
        for(const [unit,id,pool] of [["g4-u13","g4u13.w.artist","carrier"],["g2-u15","g2u15.w.to-keep-sb-company","carrier"],["g1-u11","g1u11.w.what-s-the-time","definition"]] as const) {
            expect(liveReviewed(loadUnit(unit).vocab.find(i=>i.id===id)!,pool,"quiz")).toBe(false);
        }
    });
    it("L09 reservation and year are enforced during selection", () => {
        const items = loadUnit("g1-u01").vocab;
        expect(() => selectLiveQuestions(items, 2, ["g1-u01"], "translation", 5, "x", new Set(), "quiz")).toThrow();
        expect(() => selectLiveQuestions(items, 1, ["g1-u01"], "translation", 5, "x", new Set(items.map(i => i.id)), "quiz")).toThrow();
        const eligible = items.filter(i=>liveReviewed(i,"deToEn","quiz"));
        const reserved = new Set(eligible.slice(0,Math.max(0,eligible.length-5)).map(i=>i.id));
        expect(selectLiveQuestions(items, 1, ["g1-u01"], "translation", 5, "x", reserved, "quiz").every(q => !reserved.has(q.itemId))).toBe(true);
    });
});
