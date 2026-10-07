import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanLiberation, readLiberation, saveLiberation } from "./liberation-store.ts";
afterEach(() => vi.unstubAllGlobals());
describe("local B1 progress", () => {
  it("keeps accounts apart, filters unrelated objects and preserves partial success", () => {
    const data = new Map<string, string>();
    vi.stubGlobal("localStorage", { getItem: (k: string) => data.get(k) ?? null, setItem: (k: string, v: string) => data.set(k, v) });
    expect(saveLiberation("test-a", "ch01", ["eraser"], { eraser: "named", other: "peaceful" })).toBe(true);
    expect(readLiberation("test-a", "ch01", ["eraser"])).toEqual({ eraser: "named" });
    expect(readLiberation("test-b", "ch01", ["eraser"])).toEqual({});
    expect(readLiberation("test-a", "ch02", ["eraser"])).toEqual({});
    saveLiberation("test-a", "ch01", ["eraser"], {});
    expect(readLiberation("test-a", "ch01", ["eraser"])).toEqual({});
  });
  it("rejects invalid saves and reports unavailable storage", () => {
    expect(cleanLiberation({ eraser: "done", other: "peaceful" }, ["eraser"])).toEqual({});
    vi.stubGlobal("localStorage", { getItem: () => "{broken", setItem: () => { throw new Error("blocked"); } });
    expect(readLiberation("test-a", "ch01", ["eraser"])).toEqual({});
    expect(saveLiberation("test-a", "ch01", ["eraser"], { eraser: "named" })).toBe(false);
  });
});
