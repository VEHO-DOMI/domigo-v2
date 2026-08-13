// R5-W2 · I1 · THE READING CARD — a Regel-Seite, in two beats.
//
// WHY TWO. Koki's replay called the collectible „lackluster": the page was a
// small icon in the world and a single panel on pickup, and the whole find —
// the one moment in the chapter that is purely a GIFT, with nothing asked back —
// went past in the time it takes to read one line. Splitting it gives the find
// its own beat (a torn page, held up, still glowing from the world) before the
// rule arrives. The child turns the page themselves; no clock does it for them,
// because a timer would skip the very moment this card exists to create.
//
// WHY NOT CardHost. That path exists to GRADE a child's answer: it owns
// attempts, the hint ladder, the letters-flight/hold/cheer beats and a
// „no reward" dismissal. A rule page asks nothing and grades nothing, so
// routing it there would mean inventing a fake task, kind, act mark and grade
// for a card that has none. It stays on the shell's own `staged()` panel path,
// and the two beats are two `OverlayState.card` values — the same device the
// score → door hand-off has used since M-B.
//
// THE EMPHASIS. One phrase is set in the book's accent ink, and it is a phrase
// OF the rule (`schluesselDe`, which `tip-honesty` proves is a substring of the
// Merksatz). That is deliberate repair work: every shipped Merksatz is 60–72
// characters and `Key` drops its stroke over 56, so until this card the rule
// pages rendered with NO emphasis at all. The rule now leads as a long Key and
// carries one KeyBit inside it — the house device, used as designed.
import React from "react";
import { Key, KeyBit, Quiet } from "./Glance.tsx";
import { PaintedIcon } from "./PaintedIcons.tsx";

/** The Merksatz split around its key phrase: [before, key, after].
 *
 *  Pure and exported because it is the one piece of this card with an opinion,
 *  and an opinion belongs in a test rather than in JSX. A key that is not in the
 *  sentence returns the sentence whole and unmarked — the card never mangles a
 *  line to satisfy a marker, and `tip-honesty` is what stops that case shipping. */
export const splitKey = (satz: string, key: string): readonly [string, string, string] => {
  if (key === "") return [satz, "", ""];
  const at = satz.indexOf(key);
  if (at < 0) return [satz, "", ""];
  return [satz.slice(0, at), key, satz.slice(at + key.length)];
};

/** The painted page, with the keen-art fallback chain stated once:
 *  the asked-for cell → the page as it lay in the world → the drawn icon.
 *  A card may never break on a file that has not landed yet. */
const PageArt = ({ art, skin, state, size }: {
  art: Record<string, string>; skin: string; state: "a" | "open"; size: number;
}): React.ReactElement => {
  const src = art[`${skin}_${state}`] ?? art[`${skin}_a`];
  if (src === undefined) return <PaintedIcon name="rule" size={size} art={art} />;
  return <img src={src} alt="" aria-hidden style={{ height: size, width: "auto", display: "block" }} />;
};

/** BEAT 1 — the find. The torn page, held up, and nothing else to read yet. */
export const RuleFound = ({ art, skin, topicDe, onNext }: {
  art: Record<string, string>; skin: string; topicDe: string; onNext: () => void;
}): React.ReactElement => (
  <div style={{ textAlign: "center" }}>
    <p className="pb-eyebrow">Regel-Seite gefunden</p>
    {/* the page sits in its own light — the same warm bloom the door-out beat
        uses, so a find reads like the payoff it is and not like a notice */}
    <div className="pb-treasure">
      <div className="pb-treasure-glow" aria-hidden />
      <PageArt art={art} skin={skin} state="a" size={132} />
    </div>
    <Quiet>{topicDe}</Quiet>
    <button className="pb-btn-primary" onClick={onNext}>Seite aufschlagen</button>
  </div>
);

/** BEAT 2 — the rule. The page is open; the lesson is the only thing moving. */
export const RuleRead = ({ art, skin, topicDe, merksatzDe, schluesselDe, beispielEn, belegDe, onDone }: {
  art: Record<string, string>; skin: string; topicDe: string;
  merksatzDe: string; schluesselDe: string; beispielEn: string; belegDe: string;
  onDone: () => void;
}): React.ReactElement => {
  const [before, key, after] = splitKey(merksatzDe, schluesselDe);
  return (
    <div style={{ textAlign: "left" }}>
      <p className="pb-eyebrow">Die Regel</p>
      <div style={{ display: "flex", gap: 12, alignItems: "center", margin: "0 0 10px" }}>
        <PageArt art={art} skin={skin} state="open" size={62} />
        <Quiet>{topicDe}</Quiet>
      </div>
      {/* the rule leads; ONE phrase inside it carries the accent */}
      <Key>{before}<KeyBit>{key}</KeyBit>{after}</Key>
      {/* …and the English the book itself prints, stroked, because it is the
          thing the child is here to learn to read */}
      <Key en>{beispielEn}</Key>
      <Quiet italic>{belegDe}</Quiet>
      <div style={{ height: 10 }} />
      <button className="pb-btn-primary" onClick={onDone}>Ins Buch kleben</button>
    </div>
  );
};
