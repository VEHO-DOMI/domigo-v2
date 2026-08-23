/**
 * K2a · The teacher journal — what it writes, what it refuses to write, and the one
 * database error it is allowed to shrug off.
 *
 * Three properties matter here and each is asserted on the ACTUAL insert payload
 * rather than on the function's return value:
 *   1. the row says whose account AND whose hand,
 *   2. nothing secret rides along in the payload,
 *   3. a database that has not had migration 0016 applied yet degrades — and every
 *      other failure still surfaces, because a silent journal is worse than none.
 */
import { describe, expect, it, vi } from "vitest";
import type { Db } from "./index.ts";
import { isMissingDbObject, scrubPayload, writeTeacherEvent } from "./teacher-events.ts";

/** Write-side mock: records every inserted value, or rejects with a given error. */
function insertDb(fail?: Error) {
  const written: unknown[] = [];
  const db = {
    insert: () => ({
      values: (v: unknown) => {
        if (fail) return Promise.reject(fail);
        written.push(v);
        return Promise.resolve(undefined);
      },
    }),
  };
  return { db: db as unknown as Db, written };
}

const TEACHER = "0a1b2c3d-0000-4000-8000-000000000001";
const OPERATOR = "0a1b2c3d-0000-4000-8000-000000000002";

describe("writeTeacherEvent", () => {
  it("records whose account AND whose hand — the two ids the roster journal could not carry", async () => {
    const { db, written } = insertDb();
    const landed = await writeTeacherEvent(db, {
      teacherId: TEACHER,
      kind: "pin_reset_by_grandmaster",
      actorId: OPERATOR,
      payload: { transitional: true },
    });
    expect(landed).toBe(true);
    expect(written).toHaveLength(1);
    const row = written[0] as Record<string, unknown>;
    expect(row.teacherId).toBe(TEACHER);
    expect(row.actorId).toBe(OPERATOR);
    // The whole point of the second column: these are NOT the same person here.
    expect(row.actorId).not.toBe(row.teacherId);
    expect(row.kind).toBe("pin_reset_by_grandmaster");
  });

  it("carries the hand as equal to the account on self-service", async () => {
    const { db, written } = insertDb();
    await writeTeacherEvent(db, { teacherId: TEACHER, kind: "pin_change", actorId: TEACHER, payload: {} });
    const row = written[0] as Record<string, unknown>;
    expect(row.actorId).toBe(TEACHER);
  });
});

describe("the payload never carries a secret", () => {
  it("redacts a bcrypt hash, an address and a bare PIN — and shouts about it", () => {
    const shout = vi.spyOn(console, "error").mockImplementation(() => {});
    const out = scrubPayload({
      hash: "$2b$12$abcdefghijklmnopqrstuv",
      address: "frau.huber@example.invalid",
      pin: "471203",
      teacherId: TEACHER,
      ttlMinutes: 60,
      emailSet: true,
    });
    expect(out.hash).toBe("[redacted]");
    expect(out.address).toBe("[redacted]");
    expect(out.pin).toBe("[redacted]");
    // What the journal legitimately needs survives untouched.
    expect(out.teacherId).toBe(TEACHER);
    expect(out.ttlMinutes).toBe(60); // a NUMBER is not a PIN-shaped string
    expect(out.emailSet).toBe(true);
    expect(shout).toHaveBeenCalledTimes(3);
    shout.mockRestore();
  });

  it("scrubs on the way into the insert, not merely in the helper", async () => {
    const shout = vi.spyOn(console, "error").mockImplementation(() => {});
    const { db, written } = insertDb();
    await writeTeacherEvent(db, {
      teacherId: TEACHER,
      kind: "email_set",
      actorId: TEACHER,
      payload: { emailSet: true, leaked: "frau.huber@example.invalid" },
    });
    const row = written[0] as { payload: Record<string, unknown> };
    expect(row.payload.leaked).toBe("[redacted]");
    expect(JSON.stringify(row)).not.toContain("example.invalid");
    shout.mockRestore();
  });

  // CONTROL — the negative assertion above is only worth something if it CAN fail.
  // Writing the same payload without the scrubber makes the address visible, which
  // shows the "not.toContain" line is reading the row and not passing vacuously.
  // (The real tamper — breaking scrubPayload itself on a copy — is run separately.)
  it("control: an unscrubbed address IS visible in the row", async () => {
    const { db, written } = insertDb();
    await db.insert!(null as never).values({ payload: { leaked: "frau.huber@example.invalid" } });
    expect(JSON.stringify(written[0])).toContain("example.invalid");
  });
});

describe("isMissingDbObject — the one error that is a state, not a fault", () => {
  it("sees a missing TABLE by code, by wrapped cause, and by message text", () => {
    expect(isMissingDbObject({ code: "42P01" })).toBe(true);
    expect(isMissingDbObject({ cause: { code: "42P01" } })).toBe(true);
    expect(isMissingDbObject(new Error('relation "domigo_v2.teacher_events" does not exist'))).toBe(true);
  });

  it("sees a missing COLUMN too — users.email before 0016 is applied by hand", () => {
    expect(isMissingDbObject({ code: "42703" })).toBe(true);
    expect(isMissingDbObject(new Error('column "email" does not exist'))).toBe(true);
  });

  it("does NOT swallow other database errors", () => {
    expect(isMissingDbObject({ code: "23505" })).toBe(false);
    expect(isMissingDbObject(new Error("duplicate key value violates unique constraint"))).toBe(false);
    expect(isMissingDbObject(new Error("connection terminated"))).toBe(false);
    expect(isMissingDbObject(null)).toBe(false);
    expect(isMissingDbObject(undefined)).toBe(false);
  });
});

describe("degradation is narrow", () => {
  it("returns false instead of throwing when the table is not there yet", async () => {
    const shout = vi.spyOn(console, "error").mockImplementation(() => {});
    const { db } = insertDb(new Error('relation "domigo_v2.teacher_events" does not exist'));
    await expect(
      writeTeacherEvent(db, { teacherId: TEACHER, kind: "pin_change", actorId: TEACHER, payload: {} }),
    ).resolves.toBe(false);
    expect(shout).toHaveBeenCalled(); // silence would be the real bug
    shout.mockRestore();
  });

  it("RE-THROWS every other failure, so a caller never applies an unjournalled change", async () => {
    const { db } = insertDb(new Error("connection terminated unexpectedly"));
    await expect(
      writeTeacherEvent(db, { teacherId: TEACHER, kind: "pin_change", actorId: TEACHER, payload: {} }),
    ).rejects.toThrow(/connection terminated/);
  });
});
