import React from "react";

/** Registered to the unobstructed green rectangle of the painted 384×512 board. */
export const CH01_CHALK_WINDOW = { x: 80, y: 264, width: 230, height: 96, frameWidth: 384, frameHeight: 512 } as const;
export function ChalkGreeting({ art, word }: { art: Record<string, string>; word: string }): React.ReactElement {
  return <div style={{ position: "relative", width: 210, maxWidth: "100%", margin: "0 auto" }}>
    <img src={art.tafel_win} alt="Die Tafel lächelt." style={{ display: "block", width: "100%", height: "auto" }} />
    <span data-chalk-greeting="true" style={{ position: "absolute", left: "20.833333%", top: "51.5625%", width: "59.895833%", height: "18.75%", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Chalkboard SE, Comic Sans MS, cursive", fontSize: 30, color: "#fff6d8", textShadow: "0.4px 0.4px #f4e6b788", transform: "rotate(-2deg)" }}>{word}</span>
  </div>;
}
