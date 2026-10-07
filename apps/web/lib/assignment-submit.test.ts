import assert from "node:assert/strict";
import { it } from "node:test";
import { assignmentSubmissionId } from "./assignment-submit.ts";

it("retains exact retries through reloads, isolates teachers and stores no draft", async () => {
  const map = new Map<string, string>();
  const storage = { getItem: (key: string) => map.get(key) ?? null, setItem: (key: string, value: string) => { map.set(key, value); } };
  const draft = { title: "Synthetic task", classId: "synthetic-own" };
  const first = await assignmentSubmissionId("teacher-a", draft, storage);
  assert.equal(await assignmentSubmissionId("teacher-a", structuredClone(draft), storage), first);
  assert.notEqual(await assignmentSubmissionId("teacher-b", draft, storage), first);
  assert.notEqual(await assignmentSubmissionId("teacher-a", { ...draft, title: "Intentional new task" }, storage), first);
  assert.ok(!JSON.stringify([...map]).includes("Synthetic task"));
  assert.ok(!JSON.stringify([...map]).includes("synthetic-own"));
});

it("refuses to send without a durable tab-local retry identity", async () => {
  await assert.rejects(assignmentSubmissionId("teacher-a", {}, { getItem: () => null, setItem: () => { throw new Error("storage refused"); } }));
});
