import { describe, expect, it } from "vitest";
import {
  INVITE_CODE_ALPHABET,
  INVITE_CODE_LENGTH,
  generateInviteCode,
  nextInviteCode,
  pickIdentity,
} from "./identity.ts";

// The exact allowed-character set, as a regex, kept independent of the source
// constant so a silent change to the alphabet is CAUGHT here rather than waved
// through. Ambiguous glyphs (0 O 1 I L) must never appear.
const ALLOWED = /^[ABCDEFGHJKMNPQRSTUVWXYZ23456789]+$/;
const AMBIGUOUS = /[0O1IL]/;

/** A rand() value that makes generateInviteCode pick `idx` for that position. */
const randFor = (idx: number) => (idx + 0.5) / INVITE_CODE_ALPHABET.length;

/** A scripted rand() that replays `values` in order (for deterministic codes). */
function scriptedRand(values: number[]): () => number {
  let i = 0;
  return () => values[i++]!;
}

describe("pickIdentity — the ordered dual-read precedence", () => {
  it("prefers the v2-native row when present", () => {
    expect(pickIdentity("v2", "v1")).toBe("v2");
    expect(pickIdentity({ id: "a" }, { id: "b" })).toEqual({ id: "a" });
  });

  it("falls back to the v1 mirror when v2 is null/undefined", () => {
    expect(pickIdentity(null, "v1")).toBe("v1");
    expect(pickIdentity(undefined, "v1")).toBe("v1");
  });

  it("is null when both are absent", () => {
    expect(pickIdentity(null, null)).toBeNull();
    expect(pickIdentity(undefined, undefined)).toBeNull();
    expect(pickIdentity(null, undefined)).toBeNull();
  });

  it("honors a falsy-but-present v2 value (uses ?? not ||)", () => {
    // grade 0 / empty string are real values, not "missing" — must win over v1.
    expect(pickIdentity(0, 5)).toBe(0);
    expect(pickIdentity("", "x")).toBe("");
    expect(pickIdentity(false, true)).toBe(false);
  });
});

describe("generateInviteCode", () => {
  it("is exactly INVITE_CODE_LENGTH chars from the allowed alphabet", () => {
    for (let n = 0; n < 1000; n++) {
      const code = generateInviteCode();
      expect(code).toHaveLength(INVITE_CODE_LENGTH);
      expect(code).toMatch(ALLOWED);
      expect(code).not.toMatch(AMBIGUOUS);
    }
  });

  it("never contains a visually ambiguous glyph (0 O 1 I L)", () => {
    // Exhaustive over the source alphabet itself — the guarantee at the source.
    expect(INVITE_CODE_ALPHABET).not.toMatch(AMBIGUOUS);
    for (const ch of "0O1IL") expect(INVITE_CODE_ALPHABET).not.toContain(ch);
  });

  it("maps rand() deterministically to alphabet indices", () => {
    // all-zero rand → the first alphabet char repeated; index-1 rand → the second.
    expect(generateInviteCode(() => 0)).toBe(INVITE_CODE_ALPHABET[0]!.repeat(6));
    expect(generateInviteCode(() => randFor(1))).toBe(INVITE_CODE_ALPHABET[1]!.repeat(6));
  });

  it("clamps the rand() === 1 edge to the last index (no out-of-range char)", () => {
    const last = INVITE_CODE_ALPHABET[INVITE_CODE_ALPHABET.length - 1]!;
    expect(generateInviteCode(() => 1)).toBe(last.repeat(6));
  });
});

describe("nextInviteCode", () => {
  it("returns a fresh code that avoids the taken set", () => {
    const code = nextInviteCode(new Set<string>(), () => 0);
    expect(code).toBe(INVITE_CODE_ALPHABET[0]!.repeat(6)); // "AAAAAA"
  });

  it("skips a taken code and retries until it finds a free one", () => {
    const firstCode = INVITE_CODE_ALPHABET[0]!.repeat(6); // "AAAAAA" — will be taken
    const freeCode = INVITE_CODE_ALPHABET[1]!.repeat(6); // "BBBBBB" — free
    // 6 rand() calls per code: first code collides, second is free.
    const rand = scriptedRand([
      ...Array<number>(INVITE_CODE_LENGTH).fill(randFor(0)),
      ...Array<number>(INVITE_CODE_LENGTH).fill(randFor(1)),
    ]);
    const out = nextInviteCode(new Set([firstCode]), rand);
    expect(out).toBe(freeCode);
    expect(out).not.toBe(firstCode);
  });

  it("produces a code of the right length from the allowed alphabet", () => {
    const out = nextInviteCode(new Set<string>());
    expect(out).toHaveLength(INVITE_CODE_LENGTH);
    expect(out).toMatch(ALLOWED);
  });

  it("throws after 50 collisions (defensive exhaustion guard)", () => {
    // A rand that always yields "AAAAAA", with that code already taken → every
    // one of the 50 tries collides → throw.
    const always = INVITE_CODE_ALPHABET[0]!.repeat(6);
    expect(() => nextInviteCode(new Set([always]), () => 0)).toThrow(/50 attempts/);
  });
});
