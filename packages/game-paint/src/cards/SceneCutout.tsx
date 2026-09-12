// CODEX DRAFT — NOT CANON · intentionally simple draft scene view.
import React from "react";
import { sceneDrawItems, type SceneSnapshot } from "../scene-v2.ts";
export function SceneCutout({ snapshot, art }: { snapshot: SceneSnapshot; art?: Record<string, string> }): React.ReactElement {
  return <svg role="img" aria-label="Die Szene aus dem Spiel" viewBox={`${snapshot.view.x - 16} ${snapshot.view.y - 16} ${snapshot.view.width + 32} ${snapshot.view.height + 32}`} style={{ width: "100%", maxHeight: 240, background: "#f1eadb", borderRadius: 12 }}>
    {sceneDrawItems(snapshot).map(p => art?.[p.stem]
      ? <image key={p.id} href={art[p.stem]} x={p.x-p.w/2} y={p.y-p.h} width={p.w} height={p.h} preserveAspectRatio="xMidYMax meet" />
      : <g key={p.id} data-scene-body={p.id}>
        <rect x={p.x-p.w/2} y={p.y-p.h} width={p.w} height={p.h} rx={p.kind === "actor" ? 9 : 3} fill={p.kind === "actor" ? "#cfad73" : "#839b92"} stroke="#423c32" strokeWidth={1.5} />
        {p.kind === "actor" && <circle cx={p.x+p.w*.15} cy={p.y-p.h*.75} r={2} fill="#423c32" />}
      </g>)}
  </svg>;
}
