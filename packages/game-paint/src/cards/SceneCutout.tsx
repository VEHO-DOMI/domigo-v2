// CODEX DRAFT — NOT CANON · intentionally simple draft scene view.
import React from "react";
import { sceneCutoutBounds } from "../scene-bounds.ts";
import { sceneDrawItems, type SceneSnapshot } from "../scene-v2.ts";
export function SceneCutout({ snapshot, art }: { snapshot: SceneSnapshot; art?: Record<string, string> }): React.ReactElement {
  const items = sceneDrawItems(snapshot);
  const bounds = sceneCutoutBounds(snapshot, items);
  return <svg role="img" aria-label="Die Szene aus dem Spiel" viewBox={`${bounds.x} ${bounds.y} ${bounds.width} ${bounds.height}`} style={{ width: "100%", maxHeight: 240, background: "#f1eadb", borderRadius: 12 }}>
    {items.map(p => art?.[p.stem]
      ? p.sourceRect
        ? <svg key={p.id} x={p.x-p.w/2} y={p.y-p.h} width={p.w} height={p.h} viewBox={`${p.sourceRect.x} ${p.sourceRect.y} ${p.sourceRect.width} ${p.sourceRect.height}`} preserveAspectRatio="none" overflow="hidden"><image href={art[p.stem]} x={0} y={0} width={1} height={1} preserveAspectRatio="none" style={p.wash ? { filter: `grayscale(${p.wash})` } : undefined} /></svg>
        : <image key={p.id} href={art[p.stem]} x={p.x-p.w/2} y={p.y-p.h} width={p.w} height={p.h} preserveAspectRatio="none" style={p.wash ? { filter: `grayscale(${p.wash})` } : undefined} />
      : <g key={p.id} data-scene-body={p.id}>
        <rect x={p.x-p.w/2} y={p.y-p.h} width={p.w} height={p.h} rx={p.kind === "actor" ? 9 : 3} fill={p.kind === "actor" ? "#cfad73" : "#839b92"} stroke="#423c32" strokeWidth={1.5} />
        {p.kind === "actor" && <circle cx={p.x+p.w*.15} cy={p.y-p.h*.75} r={2} fill="#423c32" />}
      </g>)}
  </svg>;
}
