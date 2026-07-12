import { describe, expect, it } from "vitest";
import { MAX_CLASS_NAME_LENGTH, validateClassName, validateGrade } from "./class-service.ts";

describe("validateClassName", () => {
  it("accepts a normal name and returns null", () => {
    expect(validateClassName("2A")).toBeNull();
    expect(validateClassName("Englisch 3B (Nachmittag)")).toBeNull();
  });

  it("rejects an empty or whitespace-only name", () => {
    expect(validateClassName("")).toBe("Give the class a name.");
    expect(validateClassName("   ")).toBe("Give the class a name.");
    expect(validateClassName("\t\n")).toBe("Give the class a name.");
  });

  it("trims before checking, so a padded name is accepted (not empty)", () => {
    expect(validateClassName("  2A  ")).toBeNull();
  });

  it("accepts a name exactly at the max length but rejects one past it", () => {
    const atMax = "x".repeat(MAX_CLASS_NAME_LENGTH);
    const overMax = "x".repeat(MAX_CLASS_NAME_LENGTH + 1);
    expect(validateClassName(atMax)).toBeNull();
    expect(validateClassName(overMax)).toBe(`A class name can be at most ${MAX_CLASS_NAME_LENGTH} characters.`);
  });

  it("measures length AFTER trimming (trailing spaces don't push it over)", () => {
    const padded = "x".repeat(MAX_CLASS_NAME_LENGTH) + "     ";
    expect(validateClassName(padded)).toBeNull();
  });
});

describe("validateGrade — Austrian AHS lower cycle is 1..4", () => {
  it("accepts each of 1, 2, 3, 4", () => {
    expect(validateGrade(1)).toBe(true);
    expect(validateGrade(2)).toBe(true);
    expect(validateGrade(3)).toBe(true);
    expect(validateGrade(4)).toBe(true);
  });

  it("rejects the out-of-range boundaries 0 and 5", () => {
    expect(validateGrade(0)).toBe(false);
    expect(validateGrade(5)).toBe(false);
  });

  it("rejects non-integers and non-finite values", () => {
    expect(validateGrade(2.5)).toBe(false);
    expect(validateGrade(NaN)).toBe(false);
    expect(validateGrade(Infinity)).toBe(false);
  });
});
