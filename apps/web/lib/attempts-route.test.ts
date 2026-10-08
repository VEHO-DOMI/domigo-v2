// cgo-047 Welle 2 · N6 (GG-DomiGo): the POSITIVE child case next to the teacher
// refusal — a child's answer is graded on the server and booked under the
// child's own class; a teacher session (the preview) books nothing. The real
// route, identity, grader and content; session and storage replaced (harness).
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { beforeEach, describe, it } from "node:test";
import { fixture, resetSchoolFixture } from "../scripts/lib/school-test-harness.mjs";
import { loadUnit } from "@domigo/content-loader";
import { vocabAnswers } from "@domigo/engine";
const { POST } = await import("../app/api/attempts/route.ts");

const item = loadUnit("g2-u01").vocab[0]!;
const answer = vocabAnswers(item, "carrier").find((a) => a.tier === "full")!.text;
const attempt = (value: string, ownerId: string | undefined = "child-own", itemId = item.id) => new Request("https://attempts.invalid/api/attempts", {
  method: "POST", headers: { "content-type": "application/json" },
  body: JSON.stringify({ clientAttemptId: "22222222-2222-4222-8222-222222222222", ownerId: ownerId || undefined, itemId, mode: "practice", input: { kind: "vocab", value, pool: "carrier" }, latencyMs: null, hintUsed: false }),
});

beforeEach(() => {
  resetSchoolFixture();
  fixture.recordReturn = { duplicate: false, box: 1, dueAt: new Date("2026-10-03T00:00:00Z"), streak: 1 };
});

describe("POST /api/attempts — a child books, a teacher does not", () => {
  it("grades a child's right answer on the server and books it under the child's class", async () => {
    fixture.session = { user: { id: "child-own", classId: "class-own", role: "student", scope: ["class-own"] } };
    const res = await POST(attempt(answer));
    const body = await res.json();
    assert.equal(res.status, 200, JSON.stringify({ body, itemId: item.id, answer }));
    assert.equal(body.ok, true, JSON.stringify(body));
    assert.equal(body.tier, "correct");
    assert.equal(fixture.writes.length, 1);
    assert.equal(fixture.writes[0]!.data.userId, "child-own");
    assert.equal(fixture.writes[0]!.data.classId, "class-own");
    assert.deepEqual(fixture.writes[0]!.scope, ["class-own"]);
  });
  it("refuses a teacher session (the preview) with 401 and books nothing", async () => {
    fixture.session = { user: { id: "teacher-own", classId: null, role: "teacher", scope: ["class-own"] } };
    const res = await POST(attempt(answer));
    assert.equal(res.status, 401);
    assert.equal(fixture.storageCalls, 0);
  });
});

for (const [ownerId, status, error, retryAfter] of [
  ["child-foreign", 409, "wrong_owner", null],
  ["", 503, "legacy_client", "60"],
] as const) {
  it(`refuses ${ownerId || "ownerless legacy"} before content lookup, grading or booking`, async () => {
    fixture.session = { user: { id: "child-own", classId: "class-own", role: "student", scope: ["class-own"] } };
    // A syntactically valid but nonexistent item: reaching content/grading would return 400.
    const res = await POST(attempt(answer, ownerId, "g2u01.w.fixture-missing"));
    assert.equal(res.status, status);
    assert.deepEqual(await res.json(), { ok: false, error });
    assert.equal(res.headers.get("Retry-After"), retryAfter);
    assert.equal(fixture.storageCalls, 0);
    assert.equal(fixture.writes.length, 0);
  });
}
it("a direct A payload cannot book as B, then succeeds after A signs back in", async () => {
  fixture.session = { user: { id: "child-b", classId: "class-b", role: "student", scope: ["class-b"] } };
  assert.equal((await POST(attempt(answer, "child-own"))).status, 409);
  assert.equal(fixture.storageCalls, 0);
  fixture.session = { user: { id: "child-own", classId: "class-own", role: "student", scope: ["class-own"] } };
  assert.equal((await POST(attempt(answer, "child-own"))).status, 200);
  assert.equal(fixture.writes.length, 1);
  assert.equal(fixture.writes[0]!.data.userId, "child-own");
});
it("a storage error stays unconfirmed with persist_failed", async () => {
  fixture.session = { user: { id: "child-own", classId: "class-own", role: "student", scope: ["class-own"] } };
  fixture.writeError = new Error("fixture storage unavailable");
  const res = await POST(attempt(answer));
  const data = await res.json();
  assert.equal(data.ok, false);
  assert.equal(data.error, "persist_failed");
});

// welle-068: raw Paint answers must travel through the existing route and
// engine. These independent expected pairs cover all six cards / four items;
// the wording and distractors come from the actual book, not copied fixtures.
const paintPairs = [
  ["door.p1.d1", "g1u01.gi.imperatives.mc.001"],
  ["door.p1.d3", "g1u01.gi.questions-personal-info.mc.001"],
  ["door.p2.d3", "g1u01.gi.questions-personal-info.cp.001"],
  ["enc.pen.k1", "g1u01.gi.questions-personal-info.cp.001"],
  ["awk.merle.r4", "g1u01.gi.imperatives.cp.002"],
  ["boss.k3", "g1u01.gi.questions-personal-info.mc.001"],
] as const;
const paintFile = JSON.parse(readFileSync(new URL(
  "../../../content/corpus/stories/g1.st.lost-pages/paint/ch01.tasks.v2.json", import.meta.url,
), "utf8")) as { items: Array<{ id: string; kind: string; answer?: string; options?: string[] }> };
const paintCards = paintPairs.map(([suffix, itemId]) => {
  const task = paintFile.items.find((candidate) => candidate.id === `g1.paint.ch01.${suffix}`);
  assert.ok(task, suffix);
  assert.equal(task.kind, "choice");
  assert.equal(typeof task.answer, "string");
  assert.ok(task.options);
  assert.ok(task.options.includes(task.answer!));
  assert.equal(task.options.length, 3);
  return { task, itemId, answer: task.answer!, distractors: task.options.filter((option) => option !== task.answer) };
});
const paintClientAttemptId = "33333333-3333-4333-8333-333333333333";
const paintAttempt = (itemId: string, value: string, ownerId: string | undefined = "child-own") => new Request("https://attempts.invalid/api/attempts", {
  method: "POST", headers: { "content-type": "application/json" },
  body: JSON.stringify({
    clientAttemptId: paintClientAttemptId, ownerId: ownerId || undefined, itemId,
    mode: "game:g1", input: { kind: "choice", value }, latencyMs: 1234, hintUsed: false,
  }),
});
const paintStudent = () => {
  fixture.grade = 1;
  fixture.session = { user: { id: "child-own", classId: "class-own", role: "student", scope: ["class-own"] } };
};

describe("POST /api/attempts — Paint uses the same server grading and learner ledger", () => {
  for (const { task, itemId, answer, distractors } of paintCards) {
    const submissions: Array<{ value: string; tier: "correct" | "wrong" }> = [
      { value: answer, tier: "correct" }, ...distractors.map((value) => ({ value, tier: "wrong" as const })),
    ];
    for (const { value, tier } of submissions) {
      it(`${task.id}: ${JSON.stringify(value)} is ${tier} and books exactly once`, async () => {
        paintStudent();
        const res = await POST(paintAttempt(itemId, value));
        const body = await res.json();
        assert.equal(res.status, 200, JSON.stringify(body));
        assert.equal(body.ok, true);
        assert.equal(body.tier, tier);
        assert.equal(body.duplicate, false);
        if (tier === "wrong") assert.equal(body.xpAwarded, 0);
        else assert.ok(body.xpAwarded > 0);
        assert.equal(fixture.storageCalls, 1);
        assert.equal(fixture.writes.length, 1);
        const write = fixture.writes[0]!;
        assert.deepEqual(write.scope, ["class-own"]);
        assert.deepEqual(write.data, {
          userId: "child-own", classId: "class-own", itemId,
          kind: "grammar", unitSlug: "g1-u01", grade: 1, mode: "game:g1",
          tier, xpAwarded: body.xpAwarded, latencyMs: 1234, hintUsed: false,
          context: undefined, clientAttemptId: paintClientAttemptId,
        });
      });
    }
  }

  it("refuses a teacher's valid Paint answer with 401 and no storage call", async () => {
    fixture.session = { user: { id: "teacher-own", classId: null, role: "teacher", scope: ["class-own"] } };
    const card = paintCards[0]!;
    const res = await POST(paintAttempt(card.itemId, card.answer));
    assert.equal(res.status, 401);
    assert.deepEqual(await res.json(), { ok: false, error: "no_identity" });
    assert.equal(fixture.storageCalls, 0);
    assert.equal(fixture.writes.length, 0);
  });

  it("rejects the Paint task ID as an item ID with 400 and no storage call", async () => {
    paintStudent();
    const card = paintCards[0]!;
    const res = await POST(paintAttempt(card.task.id, card.answer));
    assert.equal(res.status, 400);
    assert.deepEqual(await res.json(), { ok: false, error: "bad_request" });
    assert.equal(fixture.storageCalls, 0);
    assert.equal(fixture.writes.length, 0);
  });

  for (const [ownerId, status, error] of [
    ["child-foreign", 409, "wrong_owner"],
    ["", 503, "legacy_client"],
  ] as const) {
    it(`refuses a Paint answer for ${ownerId || "an unstamped owner"} without booking`, async () => {
      paintStudent();
      const card = paintCards[0]!;
      const res = await POST(paintAttempt(card.itemId, card.answer, ownerId));
      assert.equal(res.status, status);
      assert.deepEqual(await res.json(), { ok: false, error });
      assert.equal(fixture.storageCalls, 0);
      assert.equal(fixture.writes.length, 0);
    });
  }

  it("passes the same client UUID on replay and returns the ledger's duplicate flag", async () => {
    paintStudent();
    const card = paintCards[0]!;
    const first = await POST(paintAttempt(card.itemId, card.answer));
    const firstBody = await first.json();
    assert.equal(first.status, 200);
    assert.equal(firstBody.duplicate, false);
    fixture.recordReturn = { ...fixture.recordReturn, duplicate: true };
    const replay = await POST(paintAttempt(card.itemId, card.answer));
    const body = await replay.json();
    assert.equal(replay.status, 200);
    assert.equal(body.ok, true);
    assert.equal(body.tier, "correct");
    assert.equal(body.duplicate, true);
    // The existing route returns the computed XP even for duplicates; the
    // outbox turns duplicate replies into 0. Storage idempotency is not mocked
    // here: two route calls reach the ledger with the same client UUID.
    assert.ok(body.xpAwarded > 0);
    assert.equal(body.xpAwarded, firstBody.xpAwarded);
    assert.equal(fixture.storageCalls, 2);
    assert.deepEqual(fixture.writes.map((write) => write.data.clientAttemptId), [paintClientAttemptId, paintClientAttemptId]);
  });
});

// cgo-095: original story grammar uses the existing grammar ledger and review context.
const storyAttempt = (itemId: string, value: string, clientAttemptId = "55555555-5555-4555-8555-555555555555") => new Request("https://attempts.invalid/api/attempts", {
  method: "POST", headers: { "content-type": "application/json" },
  body: JSON.stringify({ ownerId: "child-own", clientAttemptId, itemId, mode: "game:g3", input: { kind: itemId.includes(".mc.") ? "choice" : "text", value }, hintUsed: false }),
});
const storyChild = () => {
  fixture.grade = 3;
  fixture.session = { user: { id: "child-own", classId: "class-own", role: "student", scope: ["class-own"] } };
};
describe("FOURTEEN scene grammar — same server grader, separate review context", () => {
  for (const [value, tier] of [["would stop", "correct"], ["stops", "wrong"]]) {
    it(`structure-tagged ci books grammar/story for ${tier}`, async () => {
      storyChild();
      const response = await POST(storyAttempt("g3u13.ci.listen-if-he-asks.gf.001", value!));
      const body = await response.json();
      assert.equal(response.status, 200);
      assert.equal(body.tier, tier);
      assert.equal(body.xpAwarded, tier === "wrong" ? 0 : 20);
      assert.equal(fixture.writes.length, 1);
      assert.equal(fixture.writes[0]!.data.kind, "grammar");
      assert.equal(fixture.writes[0]!.data.reviewContext, "story");
      assert.equal(fixture.writes[0]!.data.unitSlug, "g3-u13");
      assert.equal(fixture.writes[0]!.data.xpAwarded, body.xpAwarded);
    });
  }
  it("untagged ci stays reading and does not request story grammar review", async () => {
    storyChild();
    const response = await POST(storyAttempt("g3u13.ci.sara-advice.mc.001", "Make it about something real."));
    assert.equal((await response.json()).tier, "correct");
    assert.equal(fixture.writes[0]!.data.kind, "reading");
    assert.equal(fixture.writes[0]!.data.reviewContext, undefined);
  });
  it("teacher story answer returns 401 without storage", async () => {
    fixture.session = { user: { id: "teacher-own", role: "teacher", classId: null, scope: ["class-own"] } };
    assert.equal((await POST(storyAttempt("g3u13.ci.listen-if-he-asks.gf.001", "would stop"))).status, 401);
    assert.equal(fixture.storageCalls, 0);
  });
  it("preserves the receipt identity on retries and reports a duplicate", async () => {
    storyChild();
    const id = "66666666-6666-4666-8666-666666666666";
    await POST(storyAttempt("g3u13.ci.listen-if-he-asks.gf.001", "would stop", id));
    fixture.recordReturn = { duplicate: true, box: 2, dueAt: new Date(), streak: 1 };
    const response = await POST(storyAttempt("g3u13.ci.listen-if-he-asks.gf.001", "would stop", id));
    assert.equal((await response.json()).duplicate, true);
    assert.equal(fixture.writes[0]!.data.clientAttemptId, id);
    assert.equal(fixture.writes[1]!.data.clientAttemptId, id);
  });
});
