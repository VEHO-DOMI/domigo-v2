import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { afterEach, beforeEach, describe, it } from "node:test";
import { chapterRegelSeiten, refreshChapterRegelbuch, readRegelbuch, regelbuchSnapshot, rememberRegelSeite, subscribeRegelbuch, type RegelbuchEntry } from "./regelbuch.ts";

const KEY = "domigo:regelbuch:g1";
const level = JSON.parse(readFileSync(new URL("../../../content/corpus/stories/g1.st.lost-pages/paint/ch01.level.json", import.meta.url), "utf8"));
const authored = (id: string): RegelbuchEntry => {
  const entity = level.phases.flatMap((phase: { entities: { id: string; params: object }[] }) => phase.entities).find((entity: { id: string }) => entity.id === id);
  assert.ok(entity, `missing actual rule ${id}`);
  return { ...entity.params, chapter: level.chapter, ruleId: id, total: level.tipsTotal };
};
const legacy = (page: RegelbuchEntry, topicDe = page.topicDe): RegelbuchEntry => {
  const { ruleId: _ruleId, ...rest } = page;
  return { ...rest, topicDe, erklaerungDe: "Frühere Erklärung", merksatzDe: "Frühere Regel" };
};
let savedWindow: PropertyDescriptor | undefined;
let data: Map<string, string>;
let writes: number;
const store = (entries: RegelbuchEntry[]): void => { data.set(KEY, JSON.stringify({ v: 3, entries })); };

describe("collected rule pages survive copy and title corrections", () => {
  beforeEach(() => {
    savedWindow = Object.getOwnPropertyDescriptor(globalThis, "window");
    data = new Map(); writes = 0;
    Object.defineProperty(globalThis, "window", { configurable: true, value: { localStorage: {
      getItem: (key: string) => data.get(key) ?? null,
      setItem: (key: string, value: string) => { writes++; data.set(key, value); },
    } } });
  });
  afterEach(() => {
    if (savedWindow) Object.defineProperty(globalThis, "window", savedWindow);
    else Reflect.deleteProperty(globalThis, "window");
  });

  for (const [id, oldTitle] of [
    ["p1-regel-befehle", "Befehle — ohne you vor dem Verb"],
    ["p3-regel-plural", "Plural: aus einem werden viele"],
  ]) {
    it(`refreshes the actual ${id} legacy title after re-finding without losing other finds`, () => {
      const corrected = authored(id);
      const other = { ...authored("p1-regel-befehle"), chapter: "ch02" };
      const untouched = { ...corrected, ruleId: "another-rule", topicDe: "Andere Regel" };
      store([other, legacy(corrected, oldTitle), untouched]);
      assert.equal(readRegelbuch().length, 3); // Existing v3 saves are retained.
      assert.deepEqual(rememberRegelSeite(corrected), [other, corrected, untouched]);
      assert.deepEqual(readRegelbuch(), [other, corrected, untouched]);
      assert.equal(JSON.parse(data.get(KEY)!).v, 3);
    });
  }

  it("coalesces already duplicated old/new title copies at their first position", () => {
    const commands = authored("p1-regel-befehle");
    const plural = authored("p3-regel-plural");
    store([legacy(commands, "Befehle — ohne you vor dem Verb"), plural, legacy(commands), commands]);
    assert.deepEqual(rememberRegelSeite(commands), [commands, plural]);
    assert.deepEqual(readRegelbuch(), [commands, plural]);
  });

  it("preserves the existing same-topic text refresh for a legacy page without an alias", () => {
    const corrected = { ...authored("p1-regel-befehle"), ruleId: "stable-other", topicDe: "Unveränderter Titel" };
    store([legacy(corrected)]);
    assert.deepEqual(rememberRegelSeite(corrected), [corrected]);
    assert.equal(readRegelbuch()[0].erklaerungDe, corrected.erklaerungDe);
  });

  it("uses the stable identity for future title corrections and preserves it for an older caller", () => {
    const page = authored("p1-regel-befehle");
    store([page]);
    const corrected = { ...page, topicDe: "Künftig korrigierter Titel", merksatzDe: "Korrigierte Regel" };
    assert.deepEqual(rememberRegelSeite(corrected), [corrected]);
    const { ruleId: _ruleId, ...olderCaller } = corrected;
    assert.deepEqual(rememberRegelSeite(olderCaller), [corrected]);
  });

  it("never aliases another chapter or overwrites an explicit different identity", () => {
    const page = authored("p1-regel-befehle");
    const foreign = { ...legacy(page, "Befehle — ohne you vor dem Verb"), chapter: "ch02" };
    const sameTitleDifferentId = { ...page, ruleId: "different-rule" };
    const coincidentalOldTitle = { ...page, ruleId: "unrelated-rule", topicDe: "Befehle — ohne you vor dem Verb" };
    const untouched = { ...page, chapter: "ch03" };
    store([foreign, sameTitleDifferentId, coincidentalOldTitle, untouched]);
    assert.deepEqual(rememberRegelSeite(page), [foreign, sameTitleDifferentId, coincidentalOldTitle, untouched, page]);
    assert.deepEqual(rememberRegelSeite({ ...page, chapter: "ch02" }), [foreign, sameTitleDifferentId, coincidentalOldTitle, untouched, page, { ...page, chapter: "ch02" }]);
  });

  it("is idempotent, writes no duplicate and leaves other storage keys unchanged", () => {
    const page = authored("p3-regel-plural");
    data.set("unrelated-progress", "keep me");
    rememberRegelSeite(page);
    const firstRaw = data.get(KEY);
    rememberRegelSeite(page);
    assert.equal(writes, 1);
    assert.equal(data.get(KEY), firstRaw);
    assert.equal(data.get("unrelated-progress"), "keep me");
    assert.deepEqual(readRegelbuch(), [page]);
  });

  it("keeps running when storage access or writing is blocked", () => {
    const page = authored("p1-regel-befehle");
    Object.defineProperty(globalThis, "window", { configurable: true, value: { get localStorage() { throw Error("blocked"); } } });
    assert.deepEqual(readRegelbuch(), []);
    assert.deepEqual(rememberRegelSeite(page), [page]);
    const original = JSON.stringify({ v: 3, entries: [legacy(page)] });
    Object.defineProperty(globalThis, "window", { configurable: true, value: { localStorage: {
      getItem: () => original, setItem: () => { throw Error("quota"); },
    } } });
    assert.deepEqual(rememberRegelSeite(page), [page]);
    assert.deepEqual(readRegelbuch(), [legacy(page)]); // No false persistence claim.
  });

  it("reloads only genuinely collected archive pages and migrates both old titles from actual chapter text", () => {
    const commands = authored("p1-regel-befehle");
    const plural = authored("p3-regel-plural");
    const anotherChapter = { ...commands, chapter: "ch02", topicDe: "Eine fremde Seite" };
    const retired = { ...commands, ruleId: "retired-rule", topicDe: "Eine frühere Seite" };
    store([legacy(commands, "Befehle — ohne you vor dem Verb"), legacy(plural, "Plural: aus einem werden viele"), legacy(commands), anotherChapter, retired]);
    const before = data.get(KEY);
    const projected = chapterRegelSeiten(level, readRegelbuch());
    assert.deepEqual(projected.map(page => page.id), [commands.ruleId, plural.ruleId]);
    assert.equal(projected[0].erklaerungDe, commands.erklaerungDe);
    assert.equal(projected[1].topicDe, plural.topicDe);
    assert.equal(data.get(KEY), before, "reference projection itself never writes");
    refreshChapterRegelbuch(level);
    assert.deepEqual(readRegelbuch(), [commands, plural, anotherChapter, retired]);
    // A new visit constructs its archive exclusively from persisted values.
    assert.deepEqual(chapterRegelSeiten(level, readRegelbuch()), projected);
    assert.equal(chapterRegelSeiten(level, []).length, 0, "three unfound pages are never granted by loading chapter data");
    const writesAfterMount = writes;
    refreshChapterRegelbuch(level);
    assert.equal(writes, writesAfterMount, "a later mount is idempotent");
  });

  it("notifies the same-tab archive subscriber once for a real change and unsubscribes cleanly", () => {
    Object.assign(window, { addEventListener: () => {}, removeEventListener: () => {} });
    let changes = 0;
    const stop = subscribeRegelbuch(() => { changes++; });
    const page = authored("p1-regel-befehle");
    rememberRegelSeite(page);
    const snapshot = regelbuchSnapshot();
    assert.deepEqual(snapshot, [page]);
    assert.equal(regelbuchSnapshot(), snapshot, "unchanged snapshots keep React stable");
    rememberRegelSeite(page);
    assert.equal(changes, 1);
    stop();
    rememberRegelSeite(authored("p3-regel-plural"));
    assert.equal(changes, 1);
  });
});
