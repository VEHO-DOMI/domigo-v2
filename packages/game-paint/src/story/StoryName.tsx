import React, { useState } from "react";
import { ChalkGreeting } from "./ChalkGreeting.tsx";

/** The child's own name is a story choice, never a marked English answer. */
export function StoryName({ initialName, onSubmit, art, word }: {
  initialName: string;
  art: Record<string, string>;
  word: string;
  onSubmit: (name: string) => void;
}): React.ReactElement {
  const [name, setName] = useState(initialName);
  return <form onSubmit={(event) => {
    event.preventDefault();
    const clean = Array.from(name.normalize("NFC").replace(/[\p{Cc}\p{Cf}]/gu, " ").replace(/\s+/gu, " ").trim()).slice(0, 32).join("");
    if (clean) onSubmit(clean);
  }}>
    <ChalkGreeting art={art} word={word} />
    <p>Die Tafel fragt dich nach deinem Namen.</p>
    <label htmlFor="paint-story-name" style={{ display: "block", fontSize: 24, fontWeight: 700 }}>Wie heißt du?</label>
    <input id="paint-story-name" name="storyName" autoComplete="given-name" value={name} maxLength={64}
      onChange={event => setName(event.target.value)} style={{ boxSizing: "border-box", width: "100%", padding: 12, fontSize: 22, margin: "12px 0", border: "2px solid #785531", borderRadius: 6 }} />
    <p style={{ fontSize: 14 }}>Du kannst auch einen Spitznamen nehmen.</p>
    <button type="submit" disabled={!name.trim()} className="pb-btn-primary" style={{ padding: "10px 18px", fontSize: 18 }}>Das ist mein Name</button>
  </form>;
}
