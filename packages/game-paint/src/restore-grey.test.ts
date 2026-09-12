import fs from "node:fs";
import React from "react";
import { createRequire } from "node:module";
import { it, expect } from "vitest";
import { washAlphaFor, greyLuma, COLOUR_FLOOD_TICKS, WASH_ALPHA } from "./anim.ts";
import { Plate } from "./cards/Glance.tsx";
import type { PaintLevel } from "./level.ts";

const { renderToStaticMarkup } = createRequire(new URL("../../../apps/web/package.json", import.meta.url))("react-dom/server");
const level = JSON.parse(fs.readFileSync(new URL("../../../content/corpus/stories/g1.st.lost-pages/paint/ch02.level.json", import.meta.url), "utf8")) as PaintLevel;

it.each(["p1-pinguin", "p2-hund"])("%s hides its missing colour in the world and in both restore steps", id => {
  const entity = level.phases.flatMap(p => p.entities).find(e => e.id === id)!;
  const wash = washAlphaFor({ role: entity.role, redeemed: false, timer: 999 });
  // The scene composites a grey copy over the coloured source. No residual
  // orange beak or brown fur may contradict the card's still-grey caption.
  const rgb = [160, 112, 60];
  const luma = greyLuma(...rgb as [number, number, number]);
  const channels = rgb.map(c => (1 - wash) * c + wash * luma);
  expect(Math.max(...channels) - Math.min(...channels)).toBe(0);
  expect(renderToStaticMarkup(React.createElement(Plate, { url: "/animal.png", altDe: "", wash }))).toContain("grayscale(1)");
});

it("restored colours return gradually and remain restored after later state timers restart", () => {
  const entity = { role: "drained", redeemed: true, timer: 0, freedTick: 0 };
  expect(washAlphaFor(entity)).toBe(1);
  expect(washAlphaFor({ ...entity, freedTick: COLOUR_FLOOD_TICKS / 2 })).toBe(.5);
  expect(washAlphaFor({ ...entity, freedTick: COLOUR_FLOOD_TICKS })).toBe(0);
  expect(washAlphaFor({ ...entity, freedTick: 999 })).toBe(0);
  expect(washAlphaFor(entity, true)).toBe(0);
  expect(washAlphaFor({ ...entity, redeemed: false }, true)).toBe(1);
});

it("keeps the established wash for fighting enemies and cages", () => {
  for (const role of ["chaser", "gunner", "flyer", "bouncer", "crusher", "swarm", "cage"])
    expect(washAlphaFor({ role, redeemed: false, timer: 0 })).toBe(WASH_ALPHA);
});
