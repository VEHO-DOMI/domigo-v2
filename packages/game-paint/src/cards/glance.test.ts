// The glance grammar's decisions, unit-tested (R5-W1 · D1). What renders is
// photographed by the bench; what DECIDES is tested here.
import { describe, expect, it } from "vitest";
import type { GameTaskV2 } from "@domigo/content-schema";
import {
  ACT_LABEL_DE, FOLD_START, actMarkFor, foldFor, foldToggled, hintRungsAt, keyLineOf,
} from "./glance.ts";
import { MACHINES } from "./machines.ts";

const task = (over: Record<string, unknown>): GameTaskV2 => ({
  id: "t1", use: "encounter", kind: "choice",
  stimulus: { type: "entity", showsDe: "Ein grauer Bleistift" },
  storyDe: "Sag, was er ist!",
  ...over,
} as unknown as GameTaskV2);

describe("actMarkFor — one painted verb per card kind", () => {
  it("gives every shipped kind a mark", () => {
    // machine-generated from the kind list the game actually routes, so a kind
    // added later cannot quietly ship without a verb
    for (const kind of Object.keys(MACHINES) as GameTaskV2["kind"][]) {
      const mark = actMarkFor(kind);
      expect(ACT_LABEL_DE[mark], kind).toBeTruthy();
    }
  });

  it("distinguishes the kinds a child must tell apart", () => {
    expect(actMarkFor("choice")).toBe("tap");
    expect(actMarkFor("oddone")).toBe("odd");
    expect(actMarkFor("order")).toBe("order");
    expect(actMarkFor("spell")).toBe("letters");
    expect(actMarkFor("wheel")).toBe("wheel");
    expect(actMarkFor("mistake")).toBe("fix");
    expect(actMarkFor("memory")).toBe("pairs");
    expect(actMarkFor("typed")).toBe("write");
  });

  it("the restore card changes its verb between its two halves", () => {
    // step 1 asks for a name (a tap), step 2 for the colour — two different
    // acts on one card, and the mark is what says which one is open
    expect(actMarkFor("restore")).toBe("tap");
    expect(actMarkFor("restore", "name")).toBe("tap");
    expect(actMarkFor("restore", "colour")).toBe("colour");
  });

  it("every mark has a German name for assistive technology, and none is drawn", () => {
    for (const [mark, label] of Object.entries(ACT_LABEL_DE)) {
      expect(label.length, mark).toBeGreaterThan(4);
    }
  });
});

describe("keyLineOf — WHICH of the card's own lines leads", () => {
  it("prefers the English ask, because that is the lesson", () => {
    const k = keyLineOf(task({ promptEn: "What is it?" }));
    expect(k).toEqual({ source: "en", text: "What is it?" });
  });

  it("falls back to the German ask when a card has no English one", () => {
    const k = keyLineOf(task({}));
    expect(k).toEqual({ source: "de", text: "Sag, was er ist!" });
  });

  it("an open second step outranks the card's opening ask", () => {
    // the restore card's colour question: while that half runs, THAT is what
    // the child has to read — the opening ask is already answered
    const k = keyLineOf(task({ promptEn: "What is it?" }), "„Ich war blau wie das Meer!“");
    expect(k).toEqual({ source: "de", text: "„Ich war blau wie das Meer!“" });
  });

  it("never invents or trims a line — the text is the card's own, verbatim", () => {
    const story = "Sag, wer er ist — dann gib ihm die Farbe!";
    expect(keyLineOf(task({ storyDe: story })).text).toBe(story);
  });

  it("an empty second step does not hijack the key line", () => {
    expect(keyLineOf(task({ promptEn: "What is it?" }), "   ").source).toBe("en");
  });
});

describe("hintRungsAt — what the help fold is currently offering", () => {
  const withHints = task({ hints: { deDesc: "Grau und dünn.", deWord: "a pencil" } });

  it("offers nothing before the first wrong answer", () => {
    expect(hintRungsAt(withHints, 0)).toBe(0);
  });

  it("climbs one rung per wrong answer", () => {
    expect(hintRungsAt(withHints, 1)).toBe(1);
    expect(hintRungsAt(withHints, 2)).toBe(2);
  });

  it("counts the letter ladder as its own rung", () => {
    expect(hintRungsAt(withHints, 1, true)).toBe(2);
  });

  it("counts nothing a card does not carry", () => {
    expect(hintRungsAt(task({}), 5)).toBe(0);
  });
});

describe("the help fold — open when earned, then the child's to keep", () => {
  it("starts shut, because unearned help is noise", () => {
    expect(FOLD_START.open).toBe(false);
  });

  it("opens itself the moment a rung is earned", () => {
    expect(foldFor(FOLD_START, 1).open).toBe(true);
  });

  it("opens again when a SECOND rung lands, even if it was folded away", () => {
    const shut = { open: false, shownRungs: 1 };
    expect(foldFor(shut, 2).open).toBe(true);
  });

  it("does not re-open on a re-render with no new rung", () => {
    const shut = { open: false, shownRungs: 2 };
    expect(foldFor(shut, 2)).toEqual({ open: false, shownRungs: 2 });
  });

  it("keeps what the child chose", () => {
    expect(foldToggled({ open: false, shownRungs: 1 }).open).toBe(true);
    expect(foldToggled({ open: true, shownRungs: 1 }).open).toBe(false);
  });

  it("tracks the rung count downwards too (a fresh card resets the ladder)", () => {
    expect(foldFor({ open: true, shownRungs: 2 }, 0).shownRungs).toBe(0);
  });
});
