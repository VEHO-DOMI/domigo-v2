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
  return <img className="pb-treasure-page" src={src} alt="" aria-hidden style={{ height: size, width: "auto" }} />;
};

/** BEAT 1 — the find. The torn page ALONE, in the light it was lying in.
 *
 *  The book is deliberately NOT here. It arrives in beat 2, once the page has
 *  been read — because the button that ends this card says „Ins Buch kleben",
 *  and showing the book at the moment of finding gives away the beat the child
 *  has not earned yet. What this frame has to say is: you found something. */
export const RuleFound = ({ art, skin, topicDe, got, total, onNext }: {
  art: Record<string, string>; skin: string; topicDe: string;
  got: number; total: number; onNext: () => void;
}): React.ReactElement => (
  <div style={{ textAlign: "center" }}>
    {/* R5-W2 · I1b (Didaktik-Kritikerin): the find beat says WHICH of how many.
        Her argument, and it is a good one: a collectible with no visible set is a
        weaker reward — knowing more pages exist is exactly what makes a child
        hunt them. The number comes from the level, like every other count in this
        game (the letter-honesty law), never from a literal. */}
    <p className="pb-eyebrow">
      Regel-Seite gefunden{total > 0 ? ` · ${got} von ${total}` : ""}
    </p>
    <div className="pb-treasure">
      <div className="pb-treasure-glow" aria-hidden />
      <span className="pb-treasure-tilt">
        <PageArt art={art} skin={skin} state="a" size={132} />
      </span>
    </div>
    <Quiet>{topicDe}</Quiet>
    <button className="pb-btn-primary" onClick={onNext}>Seite aufschlagen</button>
  </div>
);

/** BEAT 2 — the rule. The page is open; the lesson is the only thing moving. */
export const RuleRead = ({ art, plateUrl, skin, topicDe, merksatzDe, schluesselDe, beispielEn, belegDe, onDone }: {
  art: Record<string, string>; plateUrl?: string | undefined; skin: string; topicDe: string;
  merksatzDe: string; schluesselDe: string; beispielEn: string; belegDe: string;
  onDone: () => void;
}): React.ReactElement => {
  const [before, key, after] = splitKey(merksatzDe, schluesselDe);
  return (
    <div style={{ textAlign: "left" }}>
      <p className="pb-eyebrow">Die Regel</p>
      {/* the chapter's painted open book, as a band: the page is back where it
          belongs, and the rule is written on it. Cropped rather than shown
          whole — a 4:3 picture over four lines of text would BE the card. */}
      {plateUrl !== undefined && (
        <div className="pb-rule-band">
          <img src={plateUrl} alt="" aria-hidden />
        </div>
      )}
      {/* no icon beside the topic: the band above is already the book, and two
          pictures of the same object in 80 px is clutter, not richness. The
          `_open` cell still earns its keep — it is what the band degrades to
          when a chapter has no plate of its own (keen-art law). */}
      {plateUrl === undefined && (
        <div style={{ display: "flex", gap: 10, alignItems: "center", margin: "0 0 8px" }}>
          <PageArt art={art} skin={skin} state="open" size={46} />
        </div>
      )}
      <Quiet>{topicDe}</Quiet>
      {/* THE RULE, and the one phrase in it that carries the lesson.
          MEASURED, not assumed: wrapping the whole Merksatz in `Key` renders it
          as `pb-key-long` — display face at weight 600 — and a `KeyBit` inside
          THAT is 800 against 600 in the same ink, which on screen is no
          emphasis at all (measured: rgb(51,41,26) vs rgb(42,33,20)). The bit is
          built to carry a QUIET line, so the rule is set quiet and the key is
          the only marked thing in it. That also restores D1's own ranking: the
          English below is the strongest thing on the card, not the third. */}
      <p className="pb-quiet pb-rule-line">{before}<KeyBit>{key}</KeyBit>{after}</p>
      {/* …and the English the book itself prints, stroked, because it is the
          thing the child is here to learn to read */}
      <Key en>{beispielEn}</Key>
      <Quiet italic>{belegDe}</Quiet>
      <div style={{ height: 10 }} />
      <button className="pb-btn-primary" onClick={onDone}>Ins Buch kleben</button>
    </div>
  );
};

/** DIE MERKSEITE — the chapter's own page of rules, and the answer to a debt
 *  the game has been carrying since the first rule page shipped: the button
 *  says „Ins Buch kleben" and the child could never open that book.
 *
 *  doc 41 §5 promised it („collect all N = the chapter's Merkseite completes +
 *  reward") and it was never built — the only trace was a number on the score
 *  page. This is that page. It opens from the HUD chip at any time, so what has
 *  been found stays lookup-able, which was Koki's own didactic condition.
 *
 *  A slot that is still missing shows a TORN STUB and no text. Not an empty box
 *  with a topic name in it: what is on a page you have not found is not
 *  something the child knows, and printing it would both spoil the find and
 *  teach the rule for free. The gap is part of the fiction — the shadow tore
 *  these out, and you can see exactly how many are still gone. */
export const Merkseite = ({ art, plateUrl, found, total, onClose }: {
  art: Record<string, string>;
  plateUrl?: string | undefined;
  found: readonly { topicDe: string; merksatzDe: string; schluesselDe: string; beispielEn: string; belegDe: string }[];
  total: number;
  onClose: () => void;
}): React.ReactElement => {
  const complete = total > 0 && found.length >= total;
  const missing = Math.max(0, total - found.length);
  return (
    <div style={{ textAlign: "left" }}>
      <p className="pb-eyebrow">Deine Merkseite</p>
      {plateUrl !== undefined && (
        <div className="pb-rule-band">
          <img src={plateUrl} alt="" aria-hidden />
        </div>
      )}
      <Quiet>{complete
        ? "Alle Regel-Seiten sind wieder im Buch."
        : `${found.length} von ${total} Regel-Seiten sind wieder im Buch.`}</Quiet>
      <div className="pb-merk-list">
        {found.map((t) => {
          const [before, key, after] = splitKey(t.merksatzDe, t.schluesselDe);
          return (
            <div className="pb-merk-slot" key={t.topicDe}>
              <p className="pb-merk-topic">{t.topicDe}</p>
              <p className="pb-quiet pb-rule-line">{before}<KeyBit>{key}</KeyBit>{after}</p>
              <Key en>{t.beispielEn}</Key>
              <Quiet italic>{t.belegDe}</Quiet>
            </div>
          );
        })}
        {Array.from({ length: missing }, (_, i) => (
          <div className="pb-merk-slot pb-merk-gap" key={`gap-${i}`}>
            <PageArt art={art} skin="regelseite" state="a" size={38} />
            <Quiet italic>Diese Seite fehlt noch.</Quiet>
          </div>
        ))}
      </div>
      {complete && (
        <p className="pb-merk-done">Das Buch ist wieder ganz.</p>
      )}
      <div style={{ height: 10 }} />
      <button className="pb-btn-primary" onClick={onClose}>Weiterspielen</button>
    </div>
  );
};
