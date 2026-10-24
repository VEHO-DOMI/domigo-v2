/** CODEX DRAFT — NOT CANON. cgo-155: real selection, explicit surface boundaries. */
import { it, expect } from "vitest";
import { listApprovedUnits, loadUnit } from "../../content-loader/src/index.ts";
import { LIVE_REVIEWED_BANK, type LiveReviewApproval } from "./live-reviewed-bank.ts";
import { liveReviewed, liveChapterAvailability, selectLiveQuestions, LIVE_MODES } from "./live-rules.ts";

it("F01 2400 selections: each year/mode/kind uses only its explicit approval", () => {
    let selected = 0, blocked = 0;
    for (const kind of ["battle", "quiz"] as const) for (const grade of [1, 2, 3, 4]) for (const mode of LIVE_MODES) {
        const units = listApprovedUnits().filter(u => u.startsWith(`g${grade}-`));
        const items = units.flatMap(u => loadUnit(u).vocab);
        for (let seed = 0; seed < 100; seed++) {
            const choose = () => selectLiveQuestions(items, grade, units, mode, 5, `format-${seed}`, new Set(), kind);
            if (kind === "battle" && mode === "context") {
                expect(choose).toThrow(expect.objectContaining({ code: "live_not_enough_questions" }));
                blocked++;
            } else {
                const questions = choose();
                expect(questions).toHaveLength(5);
                for (const question of questions) {
                    expect(LIVE_REVIEWED_BANK[`${question.itemId}:${question.pool}`]?.[kind === "battle" ? "duel" : "quiz"]).toBe(question.fingerprint);
                    selected++;
                }
            }
        }
        for (const unit of units) if (kind === "battle") expect(liveChapterAvailability(unit, kind).context).toBe(0);
    }
    expect(selected).toBe(10000);
    expect(blocked).toBe(400);
}, 30000);

it("F02 the five original free-text counterexamples have quiz-only carrier approval", () => {
    for (const [unit, id] of [
        ["g3-u13", "g3u13.w.to-tell-on-sb"], ["g4-u01", "g4u01.w.be-aware-of-sth"],
        ["g4-u08", "g4u08.w.auction"], ["g4-u05", "g4u05.w.trust"], ["g4-u08", "g4u08.w.judge"],
    ]) {
        const item = loadUnit(unit!).vocab.find(i => i.id === id)!;
        expect(liveReviewed(item, "carrier", "quiz")).toBe(true);
        expect(liveReviewed(item, "carrier", "battle")).toBe(false);
    }
});

it("F03 no approval inheritance in either direction, even for translation", () => {
    const bank = LIVE_REVIEWED_BANK as Record<string, LiveReviewApproval>;
    const items = loadUnit("g1-u01").vocab;
    const saved = { ...bank };
    try {
        for (const surface of ["duel", "quiz"] as const) {
            for (const [key, approval] of Object.entries(saved)) bank[key] = { ...approval, [surface]: null };
            const blocked = surface === "duel" ? "battle" : "quiz", other = blocked === "battle" ? "quiz" : "battle";
            expect(() => selectLiveQuestions(items, 1, ["g1-u01"], "translation", 5, "surface", new Set(), blocked)).toThrow();
            expect(selectLiveQuestions(items, 1, ["g1-u01"], "translation", 5, "surface", new Set(), other)).toHaveLength(5);
            expect(liveChapterAvailability("g1-u01", blocked).translation).toBe(0);
        }
    } finally { Object.assign(bank, saved); }
});

it("F04 small combined quiz pools remain rejected by the server", () => {
    for (const grade of [2, 3]) {
        const units = listApprovedUnits().filter(u => u.startsWith(`g${grade}-`));
        const items = units.flatMap(u => loadUnit(u).vocab);
        expect(selectLiveQuestions(items, grade, units, "context", 10, "combined", new Set(), "quiz")).toHaveLength(10);
        expect(() => selectLiveQuestions(items, grade, units, "context", 15, "combined", new Set(), "quiz")).toThrow();
    }
});
