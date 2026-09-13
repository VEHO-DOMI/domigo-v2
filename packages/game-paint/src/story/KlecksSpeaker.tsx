import React from "react";

/** Keep the narrator's visible identity from the prologue beside his words. */
export function KlecksSpeaker({ art }: { art: Record<string, string> }): React.ReactElement {
  return <div style={{ display: "flex", alignItems: "center", gap: 8, margin: "4px 0" }}>
    <img src={art.klecks_mentor} alt="" aria-hidden style={{ width: 44, height: 44, objectFit: "contain" }} />
    <span>Klecks</span>
  </div>;
}
