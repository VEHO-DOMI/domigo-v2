// CODEX DRAFT — NOT CANON · B1 portraits use the same earned state as the world.
import React from "react";
import { createRequire } from "node:module";
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { GameTasksFileV2 } from "@domigo/content-schema";
import { CardHost } from "./cards/CardHost.tsx";
import { washAlphaFor } from "./anim.ts";
const { renderToStaticMarkup } = createRequire(new URL("../../../apps/web/package.json", import.meta.url))("react-dom/server");
const tasks = GameTasksFileV2.parse(JSON.parse(readFileSync(new URL("../../../content/corpus/stories/g1.st.lost-pages/paint/ch01.tasks.v2.json", import.meta.url), "utf8"))).items;
type Stage = "unnamed" | "named" | "coloured" | "peaceful";
function portrait(suffix: string, stage: Stage) {
  const task = tasks.find(t => t.id === "g1.paint.ch01.enc." + suffix)!;
  const wash = washAlphaFor({ role: "bouncer", redeemed: stage === "peaceful", timer: 0, liberation: stage, params: { fullDrain: true } });
  return renderToStaticMarkup(React.createElement(CardHost, {
    task, art: { eraser_a: "/eraser.png", eraser_act: "/eraser-act.png", eraser_b: "/eraser-rest.png", obj_book_a: "/book.png" },
    onResolve: () => {}, onWorldChange: () => {}, onDismiss: () => {},
    portraitWash: wash, liberationStage: stage, restoreNamed: stage === "named",
    knownName: stage === "unnamed" ? undefined : suffix.startsWith("eraser") ? "rubber" : "book",
  })) as string;
}
describe("B1 actual card portraits", () => {
  it.each(["eraser.r1", "obj-book.r1"])("%s keeps its name and colour plates fully grey; only the earned name appears", suffix => {
    const first = portrait(suffix, "unnamed");
    expect(first).toContain("grayscale(1)");
    expect(first).not.toContain("pb-liberation-name");
    const named = portrait(suffix, "named");
    expect(named).toContain("grayscale(1)");
    expect(named).toContain("pb-liberation-name");
    expect(named).toContain("data-liberation=\"named\"");
    expect(named).toContain("2 · die Farbe");
  });
  it("keeps the coloured eraser restless until the sentence is solved, then removes the curse movement", () => {
    const coloured = portrait("eraser.k1", "coloured");
    expect(coloured).not.toContain("grayscale(");
    expect(coloured).toContain("class=\"pb-liberation-call\"");
    const peaceful = portrait("eraser.k2", "peaceful");
    expect(peaceful).not.toContain("grayscale(");
    expect(peaceful).not.toContain("class=\"pb-liberation-call\"");
    expect(peaceful).toContain("data-liberation=\"peaceful\"");
  });
});
