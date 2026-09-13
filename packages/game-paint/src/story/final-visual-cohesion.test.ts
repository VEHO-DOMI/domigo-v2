// CODEX DRAFT — NOT CANON
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { createRequire } from "node:module";
import { describe, expect, it } from "vitest";
import { paintedInkRects, paintedInkOffset } from "./ink-paint.ts";
import { CLASS_PHOTO_WINDOW, CLASS_PHOTO_OPEN_WINDOW, CLASS_PHOTO_ORIGIN, containInPictureWindow } from "./picture-windows.ts";
import { CH01_COMIC } from "./ch01-story.ts";
import { domArtStems, phaseArtScope, phaseRequiredStems, type ScopeLevel } from "../artScope.ts";
import { TILE } from "../paint.ts";

const require = createRequire(new URL("../../../../apps/web/package.json", import.meta.url));
const { PNG } = require("pngjs") as { PNG: { sync: { read: (bytes: Buffer) => { width: number; height: number; data: Buffer } } } };
const root = new URL("../../../../", import.meta.url);
const level = JSON.parse(fs.readFileSync(new URL("content/corpus/stories/g1.st.lost-pages/paint/ch01.level.json", root), "utf8")) as ScopeLevel;
const artDir = new URL("apps/web/public/art/g1/paint/ch01/", root);
const present = fs.readdirSync(artDir).filter(n => n.endsWith(".png")).map(n => n.slice(0, -4));
const png = (stem: string) => PNG.sync.read(fs.readFileSync(new URL(`${stem}.png`, artDir)));

describe("final chapter-one visual connections", () => {
  it("covers every liquid cell exactly once, including stepped bottoms and separated pools", () => {
    const grids = [
      ...level.phases.map(p => p.rows),
      [".wwww..ww.", ".wwww..ww.", ".www...ww.", ".ww......", ".w......."],
      ["ww.ww", "ww.ww", "..www", "wwwww"],
    ];
    for (const grid of grids) {
      const coverage = new Map<string, number>();
      for (const rect of paintedInkRects(grid)) {
        for (let y = rect.y; y < rect.y + rect.height; y += TILE) for (let x = rect.x; x < rect.x + rect.width; x += TILE) {
          const key = `${x / TILE},${y / TILE}`;
          expect(grid[y / TILE]?.[x / TILE]).toBe("w");
          coverage.set(key, (coverage.get(key) ?? 0) + 1);
        }
      }
      grid.forEach((row, r) => [...row].forEach((glyph, c) => {
        expect(coverage.get(`${c},${r}`) ?? 0).toBe(glyph === "w" ? 1 : 0);
      }));
    }
  });

  it("shares liquid texture coordinates at every joined edge, before and after drift", () => {
    for (const tick of [0, 120, 3600]) {
      const left = paintedInkOffset(16, 32, 0.16, tick, false);
      const right = paintedInkOffset(48, 48, 0.16, tick, false);
      expect(left.x + 32 / 0.16).toBeCloseTo(right.x);
      expect(left.y + 16 / 0.16).toBeCloseTo(right.y);
      expect(paintedInkOffset(16, 32, 0.16, tick, false)).toEqual(left);
    }
    expect(paintedInkOffset(16, 32, 0.16, 0, true)).toEqual(paintedInkOffset(16, 32, 0.16, 9999, true));
  });

  it("uses a fully opaque actual painted ink image, so the previous body cannot show through", () => {
    const image = png("ink_liquid");
    let transparent = 0;
    for (let i = 3; i < image.data.length; i += 4) if (image.data[i] !== 255) transparent++;
    expect(transparent).toBe(0);
  });

  it("fits the complete real class photo in the dedicated frame, visible behind narrow bars and wholly visible after opening", () => {
    const photo = png("klassenfoto_a"), cage = png("photo_frame_cage_a");
    expect([cage.width, cage.height]).toEqual([CLASS_PHOTO_WINDOW.frame.width, CLASS_PHOTO_WINDOW.frame.height]);
    const box = containInPictureWindow(CLASS_PHOTO_WINDOW, photo);
    expect(box.width / box.height).toBeCloseTo(photo.width / photo.height);
    expect(box.y).toBeGreaterThan(110);
    expect(box.y + box.height).toBeLessThan(468);
    let visible = 0, bars = 0;
    for (let y = Math.ceil(box.y); y < box.y + box.height; y++) for (let x = Math.ceil(box.x); x < box.x + box.width; x++) {
      if (cage.data[(y * cage.width + x) * 4 + 3] === 0) visible++;
      else bars++;
    }
    expect(visible / (visible + bars)).toBeGreaterThan(0.85);
    expect(bars).toBeGreaterThan(2000);
    expect(phaseArtScope(level, "p4", present)).toContain("klassenfoto_a");
    const opened = png("photo_frame_cage_open"), openBox = containInPictureWindow(CLASS_PHOTO_OPEN_WINDOW, photo);
    expect(openBox.width).toBe(box.width);
    expect(openBox.height).toBe(box.height);
    expect(openBox.y).toBe(box.y);
    expect(box.x + box.width / 2 - CLASS_PHOTO_ORIGIN.closed.x * cage.width)
      .toBeCloseTo(openBox.x + openBox.width / 2 - CLASS_PHOTO_ORIGIN.open.x * opened.width);
    for (let y = Math.ceil(openBox.y); y < openBox.y + openBox.height; y++) for (let x = Math.ceil(openBox.x); x < openBox.x + openBox.width; x++) {
      expect(opened.data[(y * opened.width + x) * 4 + 3]).toBe(0);
    }
    expect(phaseRequiredStems(level, "p4").has("klassenfoto_a")).toBe(true);
  });

  it("detects a genuinely deleted registered frame PNG in an isolated copy", () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "ch01-photo-frame-missing-"));
    const frames = [...phaseRequiredStems(level, "p4").keys()].filter(stem => stem.startsWith("photo_frame_cage_"));
    expect(frames.sort()).toEqual(["photo_frame_cage_a", "photo_frame_cage_open"]);
    try {
      for (const stem of frames) fs.copyFileSync(new URL(`${stem}.png`, artDir), path.join(dir, `${stem}.png`));
      const missing = () => frames.filter(stem => !fs.existsSync(path.join(dir, `${stem}.png`)));
      expect(missing()).toEqual([]);
      fs.unlinkSync(path.join(dir, "photo_frame_cage_open.png"));
      expect(missing()).toEqual(["photo_frame_cage_open"]);
    } finally { fs.rmSync(dir, { recursive: true, force: true }); }
  });

  it("registers every current comic panel as DOM art, including the seventh-shot transformation", () => {
    const scope = domArtStems(level);
    expect(CH01_COMIC).toHaveLength(7);
    for (const panel of CH01_COMIC) {
      expect(scope).toContain(panel.stem);
      expect(png(panel.stem).width).toBe(1536);
    }
  });

  it("counts every dynamically reachable Merle texture in the audit ceiling and only loads her when earned", () => {
    const merle = present.filter(n => n.startsWith("merle_"));
    expect(merle.length).toBeGreaterThan(5);
    for (const phase of ["p1", "p3", "p4"]) {
      const max = phaseArtScope(level, phase, present);
      const before = phaseArtScope(level, phase, present, { freedCageIds: [] });
      const after = phaseArtScope(level, phase, present, { freedCageIds: ["p2-cage-merle"] });
      for (const stem of merle) {
        expect(max).toContain(stem);
        expect(after).toContain(stem);
        expect(before).not.toContain(stem);
      }
      for (const stem of after) expect(max).toContain(stem);
    }
  });
});
