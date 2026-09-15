// welle-041 · the memory card's face-down backs carry painted marks, never digits.
// The welle-033 re-check put ch01 `boss.me1` (3/three, 7/seven, 9/nine, 12/twelve)
// before two blind solvers, and both read the back numbers 1–8 as the task.
import fs from "node:fs";
import { createRequire } from "node:module";
import React from "react";
import { describe, expect, it } from "vitest";
import { CARD_BACK_MARKS, CardBack, cardBackMarkOf } from "./Glance.tsx";
import { MemoryCard } from "./skins.tsx";
const require = createRequire(new URL("../../../../apps/web/package.json", import.meta.url));
const { renderToStaticMarkup } = require("react-dom/server");

describe("memory backs are nameable without a number (welle-041)", () => {
  it("eight distinct marks, each with its own German name", () => {
    expect(CARD_BACK_MARKS).toHaveLength(8);
    expect(new Set(CARD_BACK_MARKS.map((m) => m.name)).size).toBe(8);
    expect(new Set(CARD_BACK_MARKS.map((m) => m.d)).size).toBe(8);
    for (const m of CARD_BACK_MARKS) expect(m.name, m.name).not.toMatch(/\d/);
  });

  it("a back draws no text and no digit — not in the picture, not in its label", () => {
    for (let i = 0; i < 8; i++) {
      const html = renderToStaticMarkup(React.createElement(CardBack, { mark: i }));
      expect(html).not.toContain("<text");
      expect(html.replace(/<[^>]*>/g, ""), "text content").not.toMatch(/\d/);
      expect([...html.matchAll(/aria-label="([^"]*)"/g)].map((x) => x[1]).join(" ")).not.toMatch(/\d/);
      expect(html).toContain(`umgedrehte Karte, ${cardBackMarkOf(i).name}`);
    }
  });

  it("the shipped number memory (ch01 boss.me1) renders eight backs with no digit a child could take for the task", () => {
    const tasks = JSON.parse(fs.readFileSync(new URL("../../../../content/corpus/stories/g1.st.lost-pages/paint/ch01.tasks.v2.json", import.meta.url), "utf8")).items;
    const me1 = tasks.find((t: { id: string }) => t.id === "g1.paint.ch01.boss.me1");
    const tray = me1.pairs.flatMap((p: { a: string; b: string }) => [{ v: p.a }, { v: p.b }]);
    expect(tray).toHaveLength(8);
    const state = { tray, up: [], matched: [] } as unknown as Parameters<typeof MemoryCard>[0]["state"];
    const html = renderToStaticMarkup(React.createElement(MemoryCard, { state, dispatch: () => {} }));
    const labels = [...html.matchAll(/aria-label="([^"]*)"/g)].map((m) => m[1]);
    expect(labels.filter((l) => l!.startsWith("umgedrehte Karte, "))).toHaveLength(16);
    expect(labels.join(" ")).not.toMatch(/\d/);
    expect(html).not.toContain("<text");
  });
});
