import React from "react";
import { numberSwarmLayout, NUMBER_SWARM_BOUNDS } from "./number-swarm.ts";

/** The world pauses while reading; its paper numbers pause on the card too. */
export function NumberSwarmPlate({ seed }: { seed: string }): React.ReactElement {
  const glyphs = numberSwarmLayout({ runSeed: seed, entityId: "card", tick: 0, reducedMotion: true });
  const bounds = NUMBER_SWARM_BOUNDS;
  return <div className="pb-plate-wrap" aria-hidden="true">
    <div className="pb-plate" style={{ height: 132 }}>
      <div style={{ position: "relative", width: 146, height: 132 }}>
        {glyphs.map(glyph => <span key={glyph.value} style={{
          position: "absolute", left: `${(glyph.x - bounds.x) / bounds.width * 100}%`, top: `${(glyph.y - bounds.y) / bounds.height * 100}%`,
          transform: `translate(-50%, -50%) rotate(${glyph.rotation}rad)`,
          fontFamily: "Georgia, serif", fontSize: 34, color: "#f7cc66", textShadow: "1px 2px #574024, -1px -1px #fff1b4",
        }}>{glyph.text}</span>)}
      </div>
    </div>
  </div>;
}
