import type { LiveView } from "./live-server";
/** Entirely synthetic, ungraded view. No author answer keys or request route. */
export function exampleLive(grade: number, teacher = false): LiveView {
    const now = Date.now(), label = grade === 1 ? "Beispiel" : "Example";
    return { id: "example", kind: teacher ? "quiz" : "battle", mode: "translation", phase: "complete", grade, round: 4, total: 5,
        serverNow: now, phaseAt: now, expiresAt: now, code: null, teacher, invited: false, canStart: false, canNext: false, canClose: false,
        answered: true, answerCount: 2, xp: 0, question: null,
        players: [{ seat: 0, name: `${label} 1`, avatar: 1, me: !teacher, score: teacher ? 3750 : 3, correct: true }, { seat: 1, name: `${label} 2`, avatar: 2, me: false, score: teacher ? 3000 : 2, correct: true }] };
}
