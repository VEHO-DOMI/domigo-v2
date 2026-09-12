import React from "react";
import fs from "node:fs";
import { createRequire } from "node:module";
import { it, expect } from "vitest";
import { GameTasksFileV2 } from "../../content-schema/src/game-tasks.ts";
import CardGallery, { cageContextForTask } from "./dev/CardGallery.tsx";
import type { PaintLevel } from "./level.ts";
const { renderToStaticMarkup } = createRequire(new URL("../../../apps/web/package.json", import.meta.url))("react-dom/server");
const level = JSON.parse(fs.readFileSync(new URL("../../../content/corpus/stories/g1.st.lost-pages/paint/ch02.level.json", import.meta.url), "utf8")) as PaintLevel;
const tasks = GameTasksFileV2.parse(JSON.parse(fs.readFileSync(new URL("../../../content/corpus/stories/g1.st.lost-pages/paint/ch02.tasks.v2.json", import.meta.url), "utf8"))).items;
const render = (which: string, karte?: string, empty = false) => renderToStaticMarkup(React.createElement(CardGallery, {
  level, tasks: empty ? [] : tasks, art: { pinguin_a: "/penguin.png", hund_a: "/dog.png", l1_p1_a: "/background.png", l1_p2_a: "/background.png", zookaefig_a15: "/cage.png", zookaefig_a16: "/complete-pass.png", captive_ticket: "/captive-ticket.png" }, Overlay: () => React.createElement("div"), which, karte,
}));
it.each([["spell", "g1.paint.ch02.a15"], ["match", "g1.paint.ch02.b08"]])("shows the requested real %s card instead of a synthetic example", (kind, id) => {
  const html = render(kind!, id!);
  expect(html).toContain(`data-karte="${id}"`);
  expect(html).not.toContain("SYNTHETISCH");
});
it.each(["spell", "match"])("does not hide an unknown explicit %s card behind a synthetic example", kind => {
  const html = render(kind, "does-not-exist");
  expect(html).toContain("keine Karte mit der id");
  expect(html).toContain('data-karte=""');
});
it.each(["spell", "match"])("retains a clearly labelled %s example for an empty chapter", kind => {
  expect(render(kind, undefined, true)).toContain("SYNTHETISCH");
});
it("binds the real ticket to its named rescue sequence and paints it behind the cage", () => {
  expect(cageContextForTask(level, tasks.find(t => t.id.endsWith(".a15"))!)).toEqual({ captive: "ticket", captiveIsPerson: false });
  expect(render("spell", "g1.paint.ch02.a15")).toContain('src="/captive-ticket.png"');
});
it("keeps the same cage binding without doubling the ticket in a complete pass illustration", () => {
  expect(cageContextForTask(level, tasks.find(t => t.id.endsWith(".a16"))!)).toEqual({ captive: "ticket", captiveIsPerson: false });
  expect(render("choice", "g1.paint.ch02.a16")).not.toContain('src="/captive-ticket.png"');
});
it.each(["a06", "b05"])("shows the actual fully drained owner for restore %s", id => {
  expect(render("restore", `g1.paint.ch02.${id}`)).toContain("grayscale(1)");
});
