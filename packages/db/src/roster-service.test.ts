import { describe, expect, it } from "vitest";
import { claimLabel, parseRoster } from "./roster-service.ts";

describe("parseRoster — one name per line, forgiving of a pasted list", () => {
  it("splits on newlines and trims each name", () => {
    expect(parseRoster("Anna\nBen\nClara")).toEqual(["Anna", "Ben", "Clara"]);
    expect(parseRoster("  Anna  \n\tBen\t")).toEqual(["Anna", "Ben"]);
  });

  it("handles Windows CRLF line endings", () => {
    expect(parseRoster("Anna\r\nBen\r\nClara")).toEqual(["Anna", "Ben", "Clara"]);
  });

  it("drops blank and whitespace-only lines", () => {
    expect(parseRoster("Anna\n\n   \nBen\n\t\n")).toEqual(["Anna", "Ben"]);
    expect(parseRoster("")).toEqual([]);
    expect(parseRoster("\n\n")).toEqual([]);
  });

  it("dedupes case-insensitively, preserving the FIRST casing seen", () => {
    expect(parseRoster("Anna\nanna\nANNA\nBen")).toEqual(["Anna", "Ben"]);
    expect(parseRoster("ben\nBen")).toEqual(["ben"]);
  });

  it("is CSV-ish: strips a one-column trailing comma and surrounding quotes", () => {
    expect(parseRoster("Anna,\nBen,")).toEqual(["Anna", "Ben"]);
    expect(parseRoster('"Anna"\n"Ben"')).toEqual(["Anna", "Ben"]);
    expect(parseRoster('"Clara",')).toEqual(["Clara"]);
  });

  it("keeps a name with an internal space or comma (only ONE name per line)", () => {
    expect(parseRoster("Anna Müller\nBen Ostrowski")).toEqual(["Anna Müller", "Ben Ostrowski"]);
    // a quoted "Last, First" cell keeps its internal comma (quotes stripped, comma kept)
    expect(parseRoster('"Müller, Anna"')).toEqual(["Müller, Anna"]);
  });
});

describe("claimLabel — privacy: first name + last initial", () => {
  it("reduces a two-part name to first name + last initial", () => {
    expect(claimLabel("Anna Müller")).toBe("Anna M.");
    expect(claimLabel("Ben Ostrowski")).toBe("Ben O.");
  });

  it("returns a single-word name unchanged", () => {
    expect(claimLabel("Anna")).toBe("Anna");
    expect(claimLabel("Cher")).toBe("Cher");
  });

  it("uses the LAST token's initial when there is a middle name", () => {
    expect(claimLabel("Anna Maria Müller")).toBe("Anna M.");
    expect(claimLabel("Jean Luc Picard")).toBe("Jean P.");
  });

  it("uppercases the surname initial even when the source is lowercase", () => {
    expect(claimLabel("anna müller")).toBe("anna M.");
  });

  it("collapses extra whitespace and trims", () => {
    expect(claimLabel("   Anna    Müller   ")).toBe("Anna M.");
  });

  it("returns an empty string for an empty or whitespace-only name (never throws)", () => {
    expect(claimLabel("")).toBe("");
    expect(claimLabel("   ")).toBe("");
  });
});
