import React from "react";
import { createRequire } from "node:module";
import { it, expect } from "vitest";
import { GameTaskV2 } from "../../content-schema/src/game-tasks.ts";
import { CardShell } from "./cards/CardShell.tsx";

const { renderToStaticMarkup } = createRequire(new URL("../../../apps/web/package.json", import.meta.url))("react-dom/server");
const task = {
  id: "test.complete-pass", use: "rescue", kind: "choice", form: "state-it",
  stimulus: { type: "entity", showsDe: "Ein Pass mit einem Ticket.", art: "pass" },
  skins: ["cage"], storyDe: "Schau auf den Pass!", promptEn: "What is it?",
  options: ["A ticket.", "A train.", "A stone."], answer: "A ticket.",
};
const draw = (composition?: string) => {
  const parsed = GameTaskV2.parse({ ...task, stimulus: { ...task.stimulus, ...(composition ? { artComposition: composition } : {}) } });
  return renderToStaticMarkup(React.createElement(CardShell, {
    task: parsed, attempts: 0, onDismiss: () => {}, children: null,
    captive: "ticket", portraitWash: .6, art: { pass: "/full-pass.png", captive_ticket: "/extra-ticket.png" },
  }));
};
it("keeps a complete evidence picture bound to its entity without adding another captive", () => {
  const html = draw("complete");
  expect(html).toContain("/full-pass.png");
  expect(html).not.toContain("/extra-ticket.png");
  expect(html).toContain("grayscale(0.6)");
});
it.each([undefined, "portrait"])("preserves existing cage layering for %s", composition => {
  const html = draw(composition);
  expect(html).toContain("/full-pass.png");
  expect(html).toContain("/extra-ticket.png");
});
it("rejects unknown composition values rather than stripping an author's intended mode", () => {
  expect(() => draw("invented")).toThrow();
});
