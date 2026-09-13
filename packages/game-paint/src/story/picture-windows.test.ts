import fs from "node:fs";
import { createRequire } from "node:module";
import React from "react";
import { describe, expect, it } from "vitest";
import { GameTaskV2 } from "../../../content-schema/src/game-tasks.ts";
import { Plate } from "../cards/Glance.tsx";
import { CardShell } from "../cards/CardShell.tsx";
import { containInPictureWindow, DEVICE_WINDOW, PENCILCASE_WINDOW, pictureWindowPercent } from "./picture-windows.ts";

const require = createRequire(new URL("../../../../apps/web/package.json", import.meta.url));
const { renderToStaticMarkup } = require("react-dom/server") as { renderToStaticMarkup: (node: React.ReactNode) => string };
const { PNG } = require("pngjs") as { PNG: { sync: { read: (bytes: Buffer) => { width: number; height: number; data: Buffer } } } };
const png = (stem: string) => PNG.sync.read(fs.readFileSync(new URL(`../../../../apps/web/public/art/g1/paint/ch01/${stem}.png`, import.meta.url)));
const tasks = JSON.parse(fs.readFileSync(new URL("../../../../content/corpus/stories/g1.st.lost-pages/paint/ch01.tasks.v2.json", import.meta.url), "utf8")).items as GameTaskV2[];
const imageTags = (html: string) => [...html.matchAll(/<img\b[^>]*>/g)].map(m => m[0]);

describe("registered picture geometry", () => {
  it.each(["obj_soundsystem", "obj_tablet"])("contains the full %s with its original aspect ratio in both real locker PNGs", stem => {
    const content = png(stem), box = containInPictureWindow(DEVICE_WINDOW, content);
    expect(box.width / box.height).toBeCloseTo(content.width / content.height, 10);
    expect(box.x).toBeGreaterThanOrEqual(164);
    expect(box.y).toBeGreaterThanOrEqual(155);
    expect(box.x + box.width).toBeLessThanOrEqual(391 + 1e-10);
    expect(box.y + box.height).toBeCloseTo(548);
    for (const shell of ["device_locker_a", "device_locker_open"]) {
      const image = png(shell);
      expect([image.width, image.height]).toEqual([820, 736]);
      // Every pixel of the resulting image box is clear in BOTH real textures.
      let opaque = 0;
      for (let y = Math.ceil(box.y); y < box.y + box.height; y++)
        for (let x = Math.ceil(box.x); x < box.x + box.width; x++)
          if (image.data[(y * image.width + x) * 4 + 3] !== 0) opaque++;
      expect(opaque).toBe(0);
    }
  });

  it("keeps the whole registered Merle cell inside the case's outer opening", () => {
    const body = png("merle_caged0"), shell = png("pencilcase_a");
    expect([shell.width, shell.height]).toEqual([744, 440]);
    const box = containInPictureWindow(PENCILCASE_WINDOW, body);
    expect(box.width / box.height).toBeCloseTo(body.width / body.height, 10);
    expect(box.x).toBeGreaterThanOrEqual(130);
    expect(box.y).toBeGreaterThanOrEqual(123);
    expect(box.x + box.width).toBeLessThanOrEqual(549 + 1e-10);
    expect(box.y + box.height).toBeCloseTo(324);
    // The case is a grille: painted bars MUST remain in front of the occupant.
    let transparent = 0, bars = 0;
    for (let y = 123; y < 324; y++) for (let x = 130; x < 549; x++) {
      const a = shell.data[(y * shell.width + x) * 4 + 3]!;
      if (a === 0) transparent++;
      if (a > 200) bars++;
    }
    expect(transparent).toBeGreaterThan(50000);
    expect(bars).toBeGreaterThan(5000);
  });

  it.each([{ width: 1600, height: 100 }, { width: 100, height: 1600 }])("contains wide and tall whole pictures without cropping", content => {
    const box = containInPictureWindow(PENCILCASE_WINDOW, content);
    expect(box.width / box.height).toBeCloseTo(content.width / content.height, 10);
    expect(box.width).toBeLessThanOrEqual(419 + 1e-10);
    expect(box.height).toBeLessThanOrEqual(201 + 1e-10);
  });

  it("rejects impossible geometry instead of producing out-of-window or NaN dimensions", () => {
    expect(() => containInPictureWindow(DEVICE_WINDOW, { width: 0, height: 100 })).toThrow(RangeError);
    expect(() => containInPictureWindow(DEVICE_WINDOW, { width: 100, height: NaN })).toThrow(RangeError);
    expect(() => containInPictureWindow(DEVICE_WINDOW, { width: 100, height: 100 }, 120)).toThrow(RangeError);
    expect(() => pictureWindowPercent({ ...DEVICE_WINDOW, window: { x: 800, y: 0, width: 100, height: 100 } })).toThrow(RangeError);
  });
});

const choice = (stem: string, complete = false) => GameTaskV2.parse({
  id: "test.picture-window", use: "rescue", kind: "choice", form: "state-it",
  stimulus: { type: "entity", showsDe: "Schau auf das Bild.", art: stem, ...(complete ? { artComposition: "complete" } : {}) },
  skins: ["satchel"], storyDe: "Was siehst du?", promptEn: "What is it?",
  options: ["A tablet.", "A book.", "A pen."], answer: "A tablet.",
});
const draw = (task: GameTaskV2, captive = "tablet", person = false) => renderToStaticMarkup(React.createElement(CardShell, {
  task, attempts: 0, onDismiss: () => {}, children: null, captive, captiveIsPerson: person, portraitWash: 1,
  art: { device_locker_a: "/locker.png", pencilcase_a: "/case.png", obj_tablet: "/real-tablet.png", obj_soundsystem: "/real-sound-system.png", captive_tablet: "/legacy-tablet.png", captive_soundsystem: "/legacy-sound-system.png", merle_caged0: "/extra-merle.png", merle_act_books1: "/complete-books-scene.png", curse_violet: "/painted-ink.png", fountainpen_a: "/black-pen.png" },
}));

describe("card picture emission", () => {
  it.each(["tablet", "soundsystem"])("places the actual %s behind its registered device window", captive => {
    const tags = imageTags(draw(choice("device_locker_a"), captive));
    expect(tags).toHaveLength(2);
    expect(tags[0]).toContain(captive === "tablet" ? "/real-tablet.png" : "/real-sound-system.png");
    expect(tags[0]).not.toContain("legacy");
    expect(tags[0]).toContain("object-fit:contain");
    expect(tags[0]).toContain("height:53.39673913043478%");
    expect(tags[1]).toContain("/locker.png");
    expect(draw(choice("device_locker_a"), captive)).toContain('data-picture-frame="820x736"');
  });

  it("places one Merle behind the pencil case, not behind her complete action scene", () => {
    expect(imageTags(draw(choice("pencilcase_a"), "merle", true))).toHaveLength(2);
    for (const complete of [false, true]) {
      const tags = imageTags(draw(choice("merle_act_books1", complete), "merle", true));
      expect(tags).toHaveLength(1);
      expect(tags[0]).toContain("/complete-books-scene.png");
    }
  });

  it("emits registered percentages inside the image-sized wrapper, with the mark outside", () => {
    const html = renderToStaticMarkup(React.createElement(Plate, { url: "/case.png", behindUrl: "/merle.png", behindWindow: PENCILCASE_WINDOW, altDe: "", mark: "write" }));
    expect(html).toContain('data-picture-frame="744x440"');
    expect(html).toContain("width:223.2px");
    expect(imageTags(html)[0]).toContain("left:17.473118279569892%");
    expect(imageTags(html)[0]).toContain("height:45.68181818181818%");
    expect(html.indexOf('class="pb-stamp"')).toBeGreaterThan(html.indexOf('data-picture-layer="shell"'));
  });

  it("shows authored violet ink above a neutral restore object without washing the ink", () => {
    const original = tasks.find(t => t.kind === "restore" && t.curseVisual === "violet-ink")!;
    const task = GameTaskV2.parse({ ...original, stimulus: { type: "entity", showsDe: "Die Tinte klebt an der Füllfeder.", art: "fountainpen_a" } });
    const tags = imageTags(draw(task, ""));
    expect(tags).toHaveLength(2);
    expect(tags[0]).toContain("/black-pen.png");
    expect(tags[0]).toContain("grayscale(1)");
    expect(tags[1]).toContain("/painted-ink.png");
    expect(tags[1]).not.toContain("grayscale");
    expect(draw(choice("pencilcase_a"), "merle", true)).not.toContain("painted-ink.png");
  });
});
