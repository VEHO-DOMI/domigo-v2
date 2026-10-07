import { describe, expect, it } from "vitest";
import fs from "node:fs";
import { transpileModule } from "typescript";
import type { PaintAttemptSender } from "./cards/attempt.ts";
import { ACK_FLASH_MS, acknowledgeAttempt, attemptAckValue, emptyAttemptAck, type AttemptReply } from "./ack.ts";

describe("server receipt acknowledgement", () => {
  const receive = (reply: AttemptReply, id = "a", state = emptyAttemptAck()) =>
    acknowledgeAttempt(state, { clientAttemptId: id, reply });
  it("shows exactly the server award, irrespective of grading labels", () => {
    const state = receive({ ok: true, queued: false, xpAwarded: 7, tier: "partial" });
    expect([state.total, state.lastAward, state.revision]).toEqual([7, 7, 1]);
  });
  it.each([["correct", 3], ["wrong", 5]] as const)("uses only xpAwarded when tier is %s and the server awards %i", (tier, xpAwarded) => {
    const state = receive({ ok: true, queued: false, tier, xpAwarded });
    expect([state.total, state.lastAward, state.revision]).toEqual([xpAwarded, xpAwarded, 1]);
  });
  it.each([true, false])("marks durable queued delivery without awarding points (ok=%s)", ok => {
    const state = receive({ ok, queued: true, xpAwarded: 99 });
    expect([state.total, state.revision, [...state.pending]]).toEqual([0, 0, ["a"]]);
    expect(receive({ ok, queued: true }, "a", state)).toBe(state);
  });
  it("zero / duplicate awards neither add nor announce", () => {
    const state = receive({ ok: true, queued: false, xpAwarded: 7 });
    const next = receive({ ok: true, queued: false, xpAwarded: 0 }, "b", state);
    expect([next.total, next.lastAward, next.revision]).toEqual([7, 7, 1]);
    expect(receive({ ok: true, queued: false, xpAwarded: 0 }).total).toBe(0);
  });
  it("failed unqueued persistence never rewards, even with a grade and points", () => {
    const state = emptyAttemptAck();
    expect(receive({ ok: false, queued: false, tier: "correct", xpAwarded: 10 }, "a", state)).toBe(state);
  });
  it("preview without an award stays invisible", () => {
    const state = emptyAttemptAck();
    expect(receive({ ok: true, queued: false }, "a", state)).toBe(state);
  });
  it.each([-1, NaN, Infinity])("rejects an invalid award %s", xpAwarded => {
    const state = emptyAttemptAck();
    expect(receive({ ok: true, queued: false, xpAwarded }, "a", state)).toBe(state);
  });
  it("adds separate receipts, counts each attempt once, and never mutates earlier states", () => {
    const initial = emptyAttemptAck();
    const first = receive({ ok: true, queued: false, xpAwarded: 7 }, "a", initial);
    const second = receive({ ok: true, queued: false, xpAwarded: 3 }, "b", first);
    expect([initial.total, first.total, second.total, second.lastAward, second.revision]).toEqual([0, 7, 10, 3, 2]);
    expect([...initial.settled]).toEqual([]);
    expect([...first.settled]).toEqual(["a"]);
    expect(receive({ ok: true, queued: false, xpAwarded: 7 }, "a", second)).toBe(second);
    expect(receive({ ok: false, queued: true }, "a", second)).toBe(second);
    // React may replay the same reducer invocation with the same old state.
    expect(receive({ ok: true, queued: false, xpAwarded: 7 }, "a", initial)).toEqual(first);
  });
  it.each([0, 7])("a later receipt clears only its own pending marker (%s points)", points => {
    const a = receive({ ok: false, queued: true });
    const b = receive({ ok: false, queued: true }, "b", a);
    const next = receive({ ok: true, queued: false, xpAwarded: points }, "a", b);
    expect([...next.pending]).toEqual(["b"]);
    expect([...b.pending]).toEqual(["a", "b"]);
    expect(next.total).toBe(points);
  });
  it("an older pending attempt cannot hide the latest confirmed award", () => {
    const pending = receive({ ok: false, queued: true });
    const awarded = receive({ ok: true, queued: false, xpAwarded: 7 }, "b", pending);
    expect(attemptAckValue(awarded, true)).toBe("7 (+7)");
    expect(attemptAckValue(awarded, false)).toBe("Punkte folgen");
    const settled = receive({ ok: true, queued: false, xpAwarded: 3 }, "a", awarded);
    expect(attemptAckValue(settled, true)).toBe("10 (+3)");
    expect(attemptAckValue(settled, false)).toBe("10");
  });
});

const sources = ["PaintGame.tsx", "ack.ts"].map(name => fs.readFileSync(new URL(name, import.meta.url), "utf8"));

// Exercise the real hook's request lifetime with a minimal hook host: no game
// renderer, network, or React internals are replaced in the browser proof.
function hookHost(sender: PaintAttemptSender | undefined, source = sources[0]!) {
  const hook = source.slice(source.indexOf("function useAttemptAck("), source.indexOf("export default function PaintGame("));
  const js = transpileModule(hook, {}).outputText;
  const effects: Array<() => (() => void) | undefined> = [];
  let state = emptyAttemptAck();
  let writes = 0;
  const mount = new Function("React", "useRef", "useEffect", "useState", "acknowledgeAttempt", "emptyAttemptAck", `${js}; return useAttemptAck;`)(
    { useReducer: () => [state, (action: Parameters<typeof acknowledgeAttempt>[1]) => {
      writes++; state = acknowledgeAttempt(state, action);
    }], useMemo: (fn: () => unknown) => fn() },
    (current: boolean) => ({ current }), (effect: () => (() => void) | undefined) => effects.push(effect),
    (initial: boolean) => [initial, () => {}], acknowledgeAttempt, emptyAttemptAck,
  ) as (sender: PaintAttemptSender | undefined) => { send: PaintAttemptSender | undefined };
  const { send } = mount(sender);
  const cleanups = effects.map(effect => effect());
  return { send, state: () => state, writes: () => writes, unmount: () => cleanups.forEach(cleanup => cleanup?.()) };
}

describe("ack sender lifetime", () => {
  const body = { clientAttemptId: "a", itemId: "fixture", mode: "game:g1", input: { kind: "choice", value: "Open!" }, latencyMs: 1, hintUsed: false } as const;
  it("passes through the exact receipt and request; no sender means no wrapper", async () => {
    const reply = { ok: true, queued: false, xpAwarded: 7 };
    const host = hookHost(async input => { expect(input).toBe(body); return reply; });
    expect(await host.send!(body)).toBe(reply);
    expect(host.state().total).toBe(7);
    host.unmount();
    const absent = hookHost(undefined);
    expect(absent.send).toBeUndefined();
    expect(absent.writes()).toBe(0);
    absent.unmount();
  });
  it("an old tree receives no write after teardown, while its caller still gets the receipt", async () => {
    let resolve!: (reply: AttemptReply) => void;
    const host = hookHost(() => new Promise(r => { resolve = r; }));
    const waiting = host.send!(body);
    host.unmount();
    const reply = { ok: true, queued: false, xpAwarded: 7 };
    resolve(reply);
    expect(await waiting).toBe(reply);
    expect(host.writes()).toBe(0);
  });
  it("a rejected sender stays rejected and awards nothing", async () => {
    const error = new Error("offline without storage");
    const host = hookHost(() => Promise.reject(error));
    await expect(host.send!(body)).rejects.toBe(error);
    expect(host.writes()).toBe(0);
    host.unmount();
  });
  it("teardown tamper is red", async () => {
    const broken = sources[0]!.replace("if (alive.current) receive(", "receive(");
    expect(broken).not.toBe(sources[0]);
    const host = hookHost(async () => ({ ok: true, queued: false, xpAwarded: 7 }), broken);
    const waiting = host.send!(body);
    host.unmount();
    await waiting;
    expect(host.writes()).toBe(1); // The no-write law above would fail.
  });
});

const localScore = (src: string) => /@domigo\/engine|xpForTier|\.tier\b|\[\s*["'](?:correct|partial|close|wrong)["']\s*\]/.test(src);
describe("one scoring brain", () => {
  it("the game only reads server points", () => {
    for (const src of sources) expect(localScore(src)).toBe(false);
  });
  it.each([
    'import { xpForTier } from "@domigo/engine";',
    'const points = xpForTier(reply.tier);',
    'const points = reply.tier === "correct" ? 10 : 0;',
    'const points = awards["correct"];',
  ])("local-score tamper is red: %s", mutation => {
    expect(localScore(sources[1] + mutation)).toBe(true);
  });
});

const presentationLaws = [
  ["no empty chip", "ack.state.total > 0 || ack.state.pending.size > 0"],
  ["wrapped sender", "onAttempt={ack.send}"],
  ["short glow", '.pb-ack-flash[data-flash="true"] { animation: pb-ack-glow ${ACK_FLASH_MS}ms ease-out; }'],
  ["overlay suppresses glow", ".pb-game-hud.pb-hud-dim .pb-ack-flash { animation: none; }"],
  ["mobile overlay dims the acknowledgement", '.pb-game-shell[data-mobile="true"] .pb-hud-dim .pb-ack-flash { opacity: .26; filter: grayscale(.85) brightness(.86); }'],
  ["reduced motion suppresses glow", '@media (prefers-reduced-motion: reduce) { .pb-ack-flash[data-flash="true"] { animation: none; } }'],
] as const;
describe("ack presentation contracts", () => {
  it.each(presentationLaws)("%s, including its red tamper", (_law, required) => {
    expect(sources[0]).toContain(required);
    const broken = sources[0]!.replace(required, "REMOVED");
    expect(broken).not.toBe(sources[0]);
    expect(broken).not.toContain(required);
  });
});

const flashTimingErrors = (src: string): string[] => {
  const hook = src.slice(src.indexOf("function useAttemptAck("), src.indexOf("export default function PaintGame("));
  const errors: string[] = [];
  if (!hook.includes("window.setTimeout(() => setLit(false), ACK_FLASH_MS)")) errors.push("timer-duration");
  if (!src.includes('animation: pb-ack-glow ${ACK_FLASH_MS}ms ease-out;')) errors.push("css-duration");
  return errors;
};
describe("one short acknowledgement duration", () => {
  it("keeps the shared duration positive and at most 1500 ms", () => {
    expect(ACK_FLASH_MS).toBeGreaterThan(0);
    expect(ACK_FLASH_MS).toBeLessThanOrEqual(1500);
  });
  it("uses that same constant for both the hook timer and CSS", () => {
    expect(flashTimingErrors(sources[0]!)).toEqual([]);
  });
  it.each([
    ["timer-duration", "setLit(false), ACK_FLASH_MS)", "setLit(false), 3000)"],
    ["css-duration", "${ACK_FLASH_MS}ms", "3000ms"],
  ] as const)("duration tamper is red: %s", (law, before, after) => {
    const broken = sources[0]!.replace(before, after);
    expect(broken).not.toBe(sources[0]);
    expect(flashTimingErrors(broken)).toContain(law);
  });
});
