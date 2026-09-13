import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { cleanPaintDisplayName, createPaintRunSeed, paintPrologueSeen, readPaintStoryProfile, savePaintStoryProfile, withPaintClassmateRescued, withPaintPrologueRead, type PaintProfileStorage } from "./paint-story-profile.ts";
const memory = (): PaintProfileStorage => {
  const map = new Map<string, string>();
  return { getItem: key => map.get(key) ?? null, setItem: (key, value) => { map.set(key, value); } };
};
const allowedClassmateIds = ["merle", "fenn"];
describe("painted story profile", () => {
  it("keeps Unicode names, trims controls, normalizes accents and limits codepoints", () => {
    assert.equal(cleanPaintDisplayName("  A\u0308nne\n  O’Neill\u202e  "), "Änne O’Neill");
    assert.equal(cleanPaintDisplayName("李".repeat(40)), "李".repeat(32));
    assert.equal(cleanPaintDisplayName(null), "");
  });
  it("isolates two players on the same browser and rejects an absent scope", () => {
    const storage = memory();
    const a = { playerKey: "pupil/a", storage, allowedClassmateIds };
    const b = { ...a, playerKey: "pupil/b" };
    const profile = { ...readPaintStoryProfile(a), displayName: "Koki" };
    assert.equal(savePaintStoryProfile(a, profile).persisted, true);
    assert.equal(readPaintStoryProfile(a).displayName, "Koki");
    assert.equal(readPaintStoryProfile(b).displayName, "");
    assert.equal(savePaintStoryProfile({ ...a, playerKey: "" }, profile).persisted, false);
  });
  it("versions the actual prologue and only remembers known rescued classmates", () => {
    const ctx = { playerKey: "p", storage: memory(), allowedClassmateIds };
    let p = readPaintStoryProfile(ctx);
    p = withPaintPrologueRead(p, "comic-2026-09");
    p = withPaintClassmateRescued(p, "merle", allowedClassmateIds);
    p = withPaintClassmateRescued(p, "merle", allowedClassmateIds);
    p = withPaintClassmateRescued(p, "invented", allowedClassmateIds);
    savePaintStoryProfile(ctx, p);
    const actual = readPaintStoryProfile(ctx);
    assert.ok(paintPrologueSeen(actual, "comic-2026-09"));
    assert.equal(paintPrologueSeen(actual, "comic-2026-10"), false);
    assert.deepEqual(actual.rescuedClassmateIds, ["merle"]);
  });
  it("rejects corrupt/wrong-version content and sanitizes untrusted arrays", () => {
    for (const raw of ["{", "null", '{"version":9,"displayName":"other"}']) {
      const ctx = { playerKey: "p", allowedClassmateIds, storage: { getItem: () => raw, setItem: () => {} } };
      assert.equal(readPaintStoryProfile(ctx).displayName, "");
    }
    const ctx = { playerKey: "p", allowedClassmateIds, storage: { getItem: () => JSON.stringify({ version: 1, displayName: 2, rescuedClassmateIds: ["merle", "fake", "merle", 12], readPrologueVersions: ["v1", {}, "v1"] }), setItem: () => {} } };
    assert.deepEqual(readPaintStoryProfile(ctx), { version: 1, displayName: "", rescuedClassmateIds: ["merle"], readPrologueVersions: ["v1"], classPhotoFound: false });
  });
  it("survives blocked reads/writes and preserves the in-memory result", () => {
    const ctx = { playerKey: "p", allowedClassmateIds, storage: { getItem: () => { throw Error("blocked"); }, setItem: () => { throw Error("quota"); } } };
    const p = { ...readPaintStoryProfile(ctx), displayName: "Merle" };
    assert.deepEqual(savePaintStoryProfile(ctx, p), { profile: p, persisted: false });
    assert.equal(savePaintStoryProfile({ ...ctx, storage: null }, p).persisted, false);
  });
  it("reloads the name, photo discovery and Merle together in a fresh chapter context", () => {
    const storage = memory();
    const firstChapter = { playerKey: "pupil/photo-owner", storage, allowedClassmateIds };
    let profile = withPaintClassmateRescued(readPaintStoryProfile(firstChapter), "merle", allowedClassmateIds);
    profile = withPaintPrologueRead({ ...profile, displayName: "  Änne  ", classPhotoFound: true }, "comic-2026-09");
    assert.equal(savePaintStoryProfile(firstChapter, profile).persisted, true);
    // A newly constructed context models a reload and a different chapter mount.
    const nextChapter = { playerKey: "pupil/photo-owner", storage, allowedClassmateIds: [...allowedClassmateIds] };
    assert.deepEqual(readPaintStoryProfile(nextChapter), {
      version: 1, displayName: "Änne", classPhotoFound: true,
      rescuedClassmateIds: ["merle"], readPrologueVersions: ["comic-2026-09"],
    });
    const otherAccount = { ...nextChapter, playerKey: "pupil/other" };
    assert.deepEqual(readPaintStoryProfile(otherAccount), {
      version: 1, displayName: "", classPhotoFound: false, rescuedClassmateIds: [], readPrologueVersions: [],
    });
    savePaintStoryProfile(otherAccount, { ...readPaintStoryProfile(otherAccount), displayName: "Fenn" });
    assert.equal(readPaintStoryProfile(nextChapter).classPhotoFound, true);
    assert.equal(readPaintStoryProfile(nextChapter).displayName, "Änne");
    assert.deepEqual(readPaintStoryProfile(nextChapter).rescuedClassmateIds, ["merle"]);
  });
  it("loads older v1 profiles without a photo flag and preserves their progress when saving", () => {
    const storage = memory();
    storage.setItem("domigo:paint-story:v1:pupil%2Flegacy", JSON.stringify({
      version: 1, displayName: "Koki", readPrologueVersions: ["comic-old"], rescuedClassmateIds: ["merle"],
    }));
    const ctx = { playerKey: "pupil/legacy", storage, allowedClassmateIds };
    const legacy = readPaintStoryProfile(ctx);
    assert.equal(legacy.classPhotoFound, false);
    assert.equal(legacy.displayName, "Koki");
    assert.deepEqual(legacy.rescuedClassmateIds, ["merle"]);
    const saved = savePaintStoryProfile(ctx, { ...legacy, classPhotoFound: true });
    assert.equal(saved.persisted, true);
    assert.deepEqual(readPaintStoryProfile({ ...ctx }), { ...legacy, classPhotoFound: true });
    assert.ok(paintPrologueSeen(readPaintStoryProfile(ctx), "comic-old"));
  });
  it("accepts only a literal true photo flag and keeps blocked-storage progress in memory", () => {
    for (const flag of [undefined, null, false, 0, 1, "true", {}, []]) {
      const ctx = { playerKey: "p", allowedClassmateIds, storage: { getItem: () => JSON.stringify({ version: 1, classPhotoFound: flag }), setItem: () => {} } };
      assert.equal(readPaintStoryProfile(ctx).classPhotoFound, false);
    }
    const blocked = { playerKey: "p", allowedClassmateIds, storage: { getItem: () => null, setItem: () => { throw Error("blocked"); } } };
    const profile = { ...readPaintStoryProfile(blocked), displayName: "Änne", classPhotoFound: true, rescuedClassmateIds: ["merle"] };
    assert.deepEqual(savePaintStoryProfile(blocked, profile), { profile, persisted: false });
  });
  it("creates crypto seeds at the app boundary and handles unavailable crypto", () => {
    const source = { getRandomValues: <T extends ArrayBufferView | null>(array: T): T => { if (array instanceof Uint8Array) array.fill(42); return array; } };
    assert.equal(createPaintRunSeed(source), "2a".repeat(16));
    assert.equal(createPaintRunSeed(null), undefined);
    assert.equal(createPaintRunSeed({ getRandomValues: () => { throw Error("unavailable"); } }), undefined);
    assert.notEqual(createPaintRunSeed(), createPaintRunSeed());
  });
});
