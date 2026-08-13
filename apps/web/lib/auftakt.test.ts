/**
 * R5-W2 · J1-B — the skip flag (node --test, like the rest of apps/web; there
 * is no vitest and no DOM here, so `window` is stood up by hand below).
 *
 * Six cases, and four of them are about the storage FAILING rather than
 * working. That ratio is the point: this module answers a question that must
 * never throw, because the answer only decides whether a child sees a good card
 * twice — while a throw would take the whole chapter page down with it.
 */
import assert from "node:assert/strict";
import { afterEach, describe, it } from "node:test";
import { auftaktSeen, forgetAuftakt, rememberAuftakt } from "./auftakt.ts";

const KEY = "domigo:auftakt:g1";

/** The smallest localStorage that satisfies this module, plus a switch to make
 *  it throw the way Safari's private mode does. */
const stubWindow = (opts: { throws?: boolean } = {}): Map<string, string> => {
  const store = new Map<string, string>();
  const boom = (): never => { throw new Error("QuotaExceededError"); };
  (globalThis as { window?: unknown }).window = {
    localStorage: {
      getItem: (k: string) => (opts.throws ? boom() : store.get(k) ?? null),
      setItem: (k: string, v: string) => { if (opts.throws) boom(); store.set(k, v); },
      removeItem: (k: string) => { store.delete(k); },
    },
  };
  return store;
};

const dropWindow = (): void => { delete (globalThis as { window?: unknown }).window; };

afterEach(dropWindow);

describe("R5-W2 · J1-B · has this child read the opening?", () => {
  it("an unseen chapter is not seen; a remembered one is", () => {
    stubWindow();
    assert.equal(auftaktSeen("ch01"), false);
    rememberAuftakt("ch01");
    assert.equal(auftaktSeen("ch01"), true);
  });

  it("is per CHAPTER — reading ch01's opening does not skip ch02's", () => {
    stubWindow();
    rememberAuftakt("ch01");
    assert.equal(auftaktSeen("ch02"), false, "ch02's opening must still play");
  });

  it("is idempotent — a chapter is remembered once, not appended forever", () => {
    const store = stubWindow();
    rememberAuftakt("ch01");
    rememberAuftakt("ch01");
    rememberAuftakt("ch01");
    const file = JSON.parse(store.get(KEY) ?? "{}") as { seen: string[] };
    assert.deepEqual(file.seen, ["ch01"]);
  });

  it("survives corrupt JSON, a wrong version and a wrong shape — answering SHOW", () => {
    // the safe direction: at worst a child sees a good opening twice; never a
    // child who has NOT read it being skipped past it
    for (const junk of ["", "{", "null", '{"v":99,"seen":["ch01"]}', '{"v":1,"seen":"ch01"}']) {
      const store = stubWindow();
      store.set(KEY, junk);
      assert.equal(auftaktSeen("ch01"), false, `junk: ${junk}`);
      dropWindow();
    }
  });

  it("survives a THROWING localStorage (private mode) without breaking the run", () => {
    stubWindow({ throws: true });
    assert.doesNotThrow(() => auftaktSeen("ch01"));
    assert.equal(auftaktSeen("ch01"), false);
    assert.doesNotThrow(() => rememberAuftakt("ch01"));
  });

  it("answers SHOW with no window at all (the SSR pass)", () => {
    // BuchClient is a client component, but it still gets a server render, and
    // the guard is what stops that pass from throwing on `window`.
    dropWindow();
    assert.equal(auftaktSeen("ch01"), false);
    assert.doesNotThrow(() => rememberAuftakt("ch01"));
    assert.doesNotThrow(() => forgetAuftakt());
  });
});
