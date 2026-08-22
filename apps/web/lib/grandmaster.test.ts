/**
 * P3 · the grandmaster allowlist, proved without a DB (node --test, like
 * lib/grade-scope.test.ts — apps/web has no vitest).
 *
 * The rank is the platform's widest reach, so the properties under test are the
 * ones that would silently hand it out or silently withhold it: a blank/unset
 * variable grants it to NOBODY, whitespace and empty entries in the list are
 * harmless, letter case never decides, and an unresolved (empty) identity can
 * never fall into the rank.
 */
import assert from "node:assert/strict";
import { afterEach, describe, it } from "node:test";
import { GRANDMASTER_ENV_VAR, grandmasterIds, isGrandmaster } from "./grandmaster.ts";

const A = "891dfdd3-e6e5-4e94-850a-13c7afe9dea3";
const B = "4f0e2c11-7bd3-4a52-9d61-0c2b8e5a7f34";

/** Set (or, with undefined, unset) the allowlist variable for one case. */
function setList(value: string | undefined): void {
  if (value === undefined) delete process.env[GRANDMASTER_ENV_VAR];
  else process.env[GRANDMASTER_ENV_VAR] = value;
}

afterEach(() => { delete process.env[GRANDMASTER_ENV_VAR]; });

describe("isGrandmaster — the rank is granted ONLY by the env allowlist", () => {
  it("grants the rank to a single listed id", () => {
    setList(A);
    assert.equal(isGrandmaster(A), true);
  });

  it("grants it to EVERY id of a comma-separated list, and to nobody else", () => {
    setList(`${A},${B}`);
    assert.equal(isGrandmaster(A), true);
    assert.equal(isGrandmaster(B), true);
    assert.equal(isGrandmaster("00000000-0000-0000-0000-000000000000"), false);
  });

  it("tolerates whitespace, empty entries and a trailing comma", () => {
    setList(`  ${A} , , ${B},  `);
    assert.deepEqual(grandmasterIds(), [A, B]);
    assert.equal(isGrandmaster(A), true);
    assert.equal(isGrandmaster(B), true);
  });

  it("ignores letter case on BOTH sides — a uuid pasted in caps is the same id", () => {
    setList(A.toUpperCase());
    assert.equal(isGrandmaster(A), true);
    setList(A);
    assert.equal(isGrandmaster(A.toUpperCase()), true);
  });

  it("grants the rank to NOBODY when the variable is unset (fail closed)", () => {
    setList(undefined);
    assert.deepEqual(grandmasterIds(), []);
    assert.equal(isGrandmaster(A), false);
  });

  it("grants the rank to NOBODY when the variable is empty or only separators", () => {
    for (const empty of ["", "   ", ",", " , , "]) {
      setList(empty);
      assert.deepEqual(grandmasterIds(), [], `list was ${JSON.stringify(empty)}`);
      assert.equal(isGrandmaster(A), false, `list was ${JSON.stringify(empty)}`);
    }
  });

  it("never grants the rank to an unresolved identity, even against a list", () => {
    setList(`${A},`);
    for (const nobody of ["", "   ", null, undefined]) assert.equal(isGrandmaster(nobody), false);
  });

  it("re-reads the variable on EVERY call (emptying it really does close the door)", () => {
    setList(A);
    assert.equal(isGrandmaster(A), true);
    setList("");
    assert.equal(isGrandmaster(A), false); // no module-load cache standing in the way
  });
});
