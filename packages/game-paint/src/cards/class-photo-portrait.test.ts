import fs from "node:fs";
import { createRequire } from "node:module";
import React from "react";
import { describe, expect, it } from "vitest";
import { GameTaskV2 } from "../../../content-schema/src/game-tasks.ts";
import { CardShell } from "./CardShell.tsx";
import { CLASS_PHOTO_WINDOW, containInPictureWindow } from "../story/picture-windows.ts";
const require = createRequire(new URL("../../../../apps/web/package.json", import.meta.url));
const { renderToStaticMarkup } = require("react-dom/server");
const { PNG } = require("pngjs");
const read = (stem: string) => PNG.sync.read(fs.readFileSync(new URL(`../../../../apps/web/public/art/g1/paint/ch01/${stem}.png`, import.meta.url)));
const task = GameTaskV2.parse(JSON.parse(fs.readFileSync(new URL("../../../../content/corpus/stories/g1.st.lost-pages/paint/ch01.tasks.v2.json", import.meta.url), "utf8")).items.find((t: {id: string}) => t.id === "g1.paint.ch01.rsc.picture.r1"));
const art = { photo_frame_cage_a: "/new-frame.png", klassenfoto_a: "/whole-class.png", captive_picture: "/old-captive.png", obj_picture: "/old-picture.png", device_locker_a: "/locker.png", obj_tablet: "/tablet.png" };
const draw = (t = task, captive = "picture") => renderToStaticMarkup(React.createElement(CardShell, { task: t, captive, attempts: 0, onDismiss: () => {}, children: null, art }));
const images = (html: string) => [...html.matchAll(/<img\b[^>]*>/g)].map(m => m[0]);
describe("actual class photo behind its registered frame", () => {
  it("keeps the complete high-resolution class photo within the real opening with its two foreground bars", () => {
    const photo = read("klassenfoto_a"), frame = read("photo_frame_cage_a");
    expect([photo.width, photo.height]).toEqual([1408, 972]);
    expect([frame.width, frame.height]).toEqual([768, 674]);
    const box = containInPictureWindow(CLASS_PHOTO_WINDOW, photo);
    expect(box.width / box.height).toBeCloseTo(photo.width / photo.height, 12);
    expect(box.x).toBeGreaterThanOrEqual(163);
    expect(box.y).toBeGreaterThanOrEqual(161);
    expect(box.x + box.width).toBeLessThanOrEqual(593 + 1e-9);
    expect(box.y + box.height).toBeCloseTo(465);
    // The source frame has two continuous foreground bars. Their measured
    // columns are structural occlusion, not background inside the photo.
    let bars = 0, unexpected = 0, clear = 0;
    for (let y = Math.ceil(box.y); y < box.y + box.height; y++)
      for (let x = Math.ceil(box.x); x < box.x + box.width; x++) {
        const a = frame.data[(y * frame.width + x) * 4 + 3];
        const bar = (x >= 243 && x <= 264) || (x >= 495 && x <= 516);
        if (a !== 0) { if (bar) bars++; else unexpected++; } else clear++;
      }
    expect(unexpected).toBe(0);
    expect(bars).toBeGreaterThan(12000);
    expect(clear).toBeGreaterThan(110000);
  });
  it("emits the whole class before the frame, in the larger registered plate without old bag art", () => {
    const html = draw(), tags = images(html);
    expect(tags).toHaveLength(2);
    expect(tags[0]).toContain("/whole-class.png");
    expect(tags[0]).toContain("object-fit:contain");
    expect(tags[1]).toContain("/new-frame.png");
    expect(html).toContain('data-picture-frame="768x674"');
    expect(html).toContain("height:210px");
    expect(html).not.toContain("old-captive"); expect(html).not.toContain("old-picture");
  });
  it("does not add class children to a tablet or a foreign captive", () => {
    const wrong = draw(task, "tablet"); expect(wrong).not.toContain("/whole-class.png");
    const device = GameTaskV2.parse({ ...task, stimulus: { ...task.stimulus, art: "device_locker_a" } });
    const html = draw(device, "tablet"), tags = images(html);
    expect(tags).toHaveLength(2); expect(tags[0]).toContain("/tablet.png");
    expect(html).toContain('data-picture-frame="820x736"');
    expect(html).not.toContain("height:210px"); expect(html).not.toContain("whole-class");
  });
});
