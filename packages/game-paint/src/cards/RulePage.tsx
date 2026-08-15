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
// `Struck` left with the trap it drew (R5-W4 · I2, Koki: „Wir wollen KEINE
// Fehler zeigen"). It stays exported from Glance for other cards; filed for D3
// as a dead export if none of them take it up.
import { KeyBit, Quiet } from "./Glance.tsx";
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
 *  A card may never break on a file that has not landed yet.
 *
 *  `stub` (R5-W4 · I2) is the torn remnant of a page still missing — a cell of
 *  its own rather than the whole page greyed down. It rides the same chain, so
 *  a chapter whose art batch has not landed shows the rule page instead of a
 *  hole, which is the keen-art law working as designed. */
const PageArt = ({ art, skin, state, size }: {
  art: Record<string, string>; skin: string; state: "a" | "open" | "stub"; size: number;
}): React.ReactElement => {
  const src = art[`${skin}_${state}`] ?? art[`${skin}_a`] ?? art.regelseite_a;
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

/** The examples, as a quiet list. Shared by the pickup card and the archive so
 *  the two can never drift into two different ideas of what an example looks
 *  like — that drift is exactly what made the hub board and the in-game card
 *  read as two products in Koki's replay.
 *
 *  ⚠ STYLED INLINE, ON PURPOSE. `cards/overlay-css.ts` belongs to another lane
 *  this wave (Rahmen §5), so this round adds no class names to it: everything
 *  new here is either an existing class or an inline rule that reads the same
 *  `--pb-*` tokens the sheet defines. Not a shortcut — a boundary. */
const Beispiele = ({ lines }: { lines: readonly string[] }): React.ReactElement => (
  <ul style={{ listStyle: "none", margin: "0 0 2px", padding: 0, display: "grid", gap: 5 }}>
    {lines.map((line) => (
      // `pb-key pb-key-long pb-key-en` — the house's own long-Key look: display
      // face, accent ink, and NO stroke. MEASURED, not chosen blind: a plain
      // `<Key en>` per line stroked all four of them, and four crayon strokes
      // stacked is the device saying „this is THE one thing" four times. The
      // stroke marks the single ask on a card; a list of examples is not that.
      // (The class pair is what `Key` itself switches to past 56 characters —
      // reused rather than re-invented, because `cards/overlay-css.ts` belongs
      // to another lane this wave and this round adds no class names to it.)
      <li key={line} className="pb-key pb-key-long pb-key-en" style={{ margin: 0 }}>{line}</li>
    ))}
  </ul>
);

/** The rule proper, set apart from the Notion above it by a ruled edge rather
 *  than by a second colour. The two lines do different jobs (what happens · the
 *  rule to keep) and the old card gave them identical weight, which is how a
 *  page with two prose lines starts reading as one line said twice. The ink
 *  stays QUIET because that is what makes the KeyBit inside it visible at all —
 *  I1 measured the alternative and found 800-on-600 in one ink, i.e. no
 *  emphasis. */
const Merksatz = ({ satz, schluessel }: { satz: string; schluessel: string }): React.ReactElement => {
  const [before, key, after] = splitKey(satz, schluessel);
  return (
    <p
      className="pb-quiet pb-rule-line"
      style={{ borderLeft: "3px solid var(--pb-ink-line)", borderRadius: "3px 0 0 4px / 4px 0 0 3px", padding: "1px 0 1px 10px" }}
    >
      {before}<KeyBit>{key}</KeyBit>{after}
    </p>
  );
};

/** BEAT 2 — the rule. The page is open; the lesson is the only thing moving.
 *
 *  R5-W4 · I2 · REBUILT ON KOKI'S REPLAY OF 2026-08-15. What left, in his words:
 *  the book reference („Die Regel soll NICHT aufs Buch verweisen — wir
 *  restaurieren unser eigenes Buch"), the pronunciation line („das ‚how to
 *  pronounce' ist unnötig") and the struck-through wrong form („Wir wollen KEINE
 *  Fehler zeigen, nur die richtigen Notions und Beispiele"). What arrived:
 *  „mehr Notions, Erklärungen, Beispiele — didaktisch reicher, besser
 *  organisiert."
 *
 *  THE ORDER IS THE TEACHING, and it is four steps down, not five things beside
 *  each other: the page is NAMED, then what happens is EXPLAINED, then the rule
 *  is STATED with its one bold key, then it is SHOWN two to four times. The old
 *  card put the topic in the same quiet ink as the rule and hung three helper
 *  lines under the example; a child had to work out which line was the lesson. */
export const RuleRead = ({ art, plateUrl, skin, topicDe, erklaerungDe, merksatzDe, schluesselDe, beispieleEn, onDone }: {
  art: Record<string, string>; plateUrl?: string | undefined; skin: string; topicDe: string;
  erklaerungDe: string; merksatzDe: string; schluesselDe: string; beispieleEn: readonly string[];
  onDone: () => void;
}): React.ReactElement => {
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
      {/* THE PAGE'S NAME. It reuses the archive's own topic style, which is what
          makes the pickup card and the Merkseite behind the HUD chip read as one
          book — the label face, quiet ink, AA-measured at 5,53 : 1 (J2). */}
      <p className="pb-merk-topic">{topicDe}</p>
      {/* …WHAT HAPPENS, in kid words. The step the old card never had, and the
          one Koki asked for by name („mehr Notions"). */}
      <p className="pb-quiet pb-rule-line">{erklaerungDe}</p>
      {/* …THE RULE, with the one phrase that carries the lesson. */}
      <Merksatz satz={merksatzDe} schluessel={schluesselDe} />
      {/* …and the English, two to four times, because a rule shown once is a
          rule asserted. Ours, not the book's (Koki's ruling K-1). */}
      <Beispiele lines={beispieleEn} />
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
  found: readonly { topicDe: string; erklaerungDe: string; merksatzDe: string; schluesselDe: string; beispieleEn: readonly string[] }[];
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
        {/* R5-W4 · I2: the archive slot now carries the SAME four steps as the
            pickup card — name, Notion, rule, examples — and no book reference.
            Two renderings of one page taught a child two shapes of the same
            rule; that was Koki's „besser organisiert" in its smallest form. */}
        {found.map((t) => (
          <div className="pb-merk-slot" key={t.topicDe}>
            <p className="pb-merk-topic">{t.topicDe}</p>
            <p className="pb-quiet pb-rule-line">{t.erklaerungDe}</p>
            <Merksatz satz={t.merksatzDe} schluessel={t.schluesselDe} />
            <Beispiele lines={t.beispieleEn} />
          </div>
        ))}
        {/* R5-W4 · I2: the missing slot finally shows the sheet PAINTED for it.
            `merkseite_stub` landed with batch AQ7 and had been loaded by nothing
            since (DEAD_ART group A); until now the gap borrowed the rule page's
            own cell greyed out, which is a different object wearing a filter.
            The keen-art chain still stands behind it — a stub that has not
            landed degrades to the page, then to the drawn icon. */}
        {Array.from({ length: missing }, (_, i) => (
          <div className="pb-merk-slot pb-merk-gap" key={`gap-${i}`}>
            <PageArt art={art} skin="merkseite" state="stub" size={38} />
            <Quiet italic>Diese Seite fehlt noch.</Quiet>
          </div>
        ))}
      </div>
      {/* R5-W4 · I2: the finished book gets its painted SEAL — the third AQ7 cell
          that had never been loaded. It is the one moment this card is allowed a
          picture that says nothing new: the sentence beside it is the news, the
          seal is the feeling. Degrades to no image at all rather than to a
          stand-in, because a wrong picture here would read as a fourth rule. */}
      {complete && (
        <p className="pb-merk-done" style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {art.merkseite_seal !== undefined && (
            <img src={art.merkseite_seal} alt="" aria-hidden style={{ height: 30, width: "auto" }} />
          )}
          Das Buch ist wieder ganz.
        </p>
      )}
      <div style={{ height: 10 }} />
      <button className="pb-btn-primary" onClick={onClose}>Weiterspielen</button>
    </div>
  );
};
