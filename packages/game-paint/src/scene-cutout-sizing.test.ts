// CODEX DRAFT — NOT CANON · the SVG must use the world's declared drawing rectangles.
import React from "react";
import { createRequire } from "node:module";
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { SceneCutout } from "./cards/SceneCutout.tsx";
import { createSceneState, beginSceneBeat, snapshotScene, sceneDrawItems, type SceneSnapshot } from "./scene-v2.ts";
import { readZooJson } from "./test-fixtures/zoo/read-fixture.ts";
import type { PaintLevel } from "./level.ts";

// The web app owns the existing React DOM renderer; no new package dependency
// or alternative hand-written component renderer is introduced by this test.
const webRequire = createRequire(new URL("../../../apps/web/package.json", import.meta.url));
const { renderToStaticMarkup } = webRequire("react-dom/server") as {
  renderToStaticMarkup: (node: React.ReactNode) => string;
};
// A square full source canvas, with corner marks so its whole-frame bounds are
// explicit. This is a synthetic SVG source, not a claim about delivered art.
const squareSource = "data:image/svg+xml," + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512"><path fill="black" d="M0 0h16v16H0zM496 496h16v16h-16z"/></svg>');
const images = (html: string) => [...html.matchAll(/<image\b[^>]*>/g)].map(match => {
  const attrs = Object.fromEntries([...match[0].matchAll(/([\w:-]+)="([^"]*)"/g)].map(a => [a[1]!, a[2]!]));
  return { x: Number(attrs.x), y: Number(attrs.y), width: Number(attrs.width), height: Number(attrs.height),
    policy: attrs.preserveAspectRatio, href: attrs.href };
});
const render = (snapshot: SceneSnapshot) => {
  const items = sceneDrawItems(snapshot);
  const art = Object.fromEntries(items.map(item => [item.stem, squareSource]));
  return images(renderToStaticMarkup(React.createElement(SceneCutout, { snapshot, art })));
};
const picture = (): SceneSnapshot => {
  const level = readZooJson("ch02.level.json") as PaintLevel;
  const stage = structuredClone(level.phases.flatMap(p => p.entities).find(e => e.id === "p3-buehne-giraffe")!.params!.stageV2!);
  stage.props = [{ id: "comparison", skin: "tree_comparison", anchor: { x: .5, y: 1 }, canvas: { widthPx: 160, heightPx: 120 } }];
  const state = createSceneState(stage);
  beginSceneBeat(state, stage.beats.find(b => b.id === "c06")!);
  return snapshotScene("giraffe", 0, 0, state, stage);
};

describe("world/card source-canvas sizing", () => {
  it("renders the full square-source illustration into its authored 160×120 rectangle", () => {
    const snapshot = picture(); snapshot.actors = [];
    const nodes = render(snapshot);
    expect(nodes).toHaveLength(1);
    expect(nodes[0]).toMatchObject({ x: -80, y: -120, width: 160, height: 120, policy: "none" });
    expect(nodes[0]!.href).toBe(squareSource);
    // SVG meet would shrink the 512-square full frame to 120×120 and add
    // 20 pixels of horizontal space on both sides, unlike the world's 160×120.
  });

  it("keeps the real fixture actor's feet, height and narrow world width in the SVG image", () => {
    const snapshot = picture(); snapshot.props = [];
    const items = sceneDrawItems(snapshot), nodes = render(snapshot);
    expect(items).toHaveLength(1);
    expect(items[0]).toMatchObject({ id: "giraffe:0", w: 72.8, h: 112 });
    expect(nodes).toEqual(items.map(item => ({ x: item.x - item.w / 2, y: item.y - item.h,
      width: item.w, height: item.h, policy: "none", href: squareSource })));
    // meet would instead reduce this square source to 72.8×72.8, losing the
    // authored 112-pixel body height while keeping its feet at the same point.
  });

  it("keeps every registered square vehicle mask on the same 80×80 rectangle", () => {
    const snapshot = picture(); snapshot.actors = [];
    snapshot.props = [{ id: "car", skin: "auto", anchor: { x: .5, y: 1 }, canvas: { widthPx: 80, heightPx: 80 } }];
    const items = sceneDrawItems(snapshot), nodes = render(snapshot);
    expect(items.map(item => item.stem)).toEqual(["auto_base", "auto_interior", "auto_front"]);
    expect(nodes).toHaveLength(3);
    for (const node of nodes) expect(node).toMatchObject({ x: -40, y: -80, width: 80, height: 80 });
    // With matching square ratios, meet and none have identical geometry.
  });

  it("keeps this SVG contract tied to the actual world's feet-origin and declared-size renderer", () => {
    const source = readFileSync(new URL("./PaintScene.ts", import.meta.url), "utf8");
    const world = source.slice(source.indexOf("private renderZooScenes()"), source.indexOf("private renderEntities()"));
    expect(world).toContain("for (const item of sceneDrawItems(snapshot))");
    expect(world).toMatch(/setOrigin\(\.5,\s*1\)/);
    expect(world).toMatch(/setDisplaySize\(item\.w,\s*item\.h\)/);
  });
});
