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
// ★★ R5-W9 · N1 · VON GRUND AUF NEU GESETZT — Kokis Durchspiel-Review vom
// 31.08. (Befund D-770, zwei Belege). Was er an der ausgelieferten Karte las:
//   1 · der Regel-TITEL war die unauffälligste Zeile — eine graue, gesperrte
//       Mini-Zeile in Versalien, kleiner als alles andere auf der Karte;
//   2 · das Schlüssel-Englisch (don't · What's · I'm) war nicht hervorgehoben —
//       paradoxerweise WEIL jede englische Zeile den Akzent trug;
//   3 · „Sit down!" und „Don't sit down!" sahen identisch aus, obwohl sie das
//       Gegenteil voneinander sagen — eine Liste kann keinen Gegensatz zeigen;
//   4 · am Merksatz sass ein Zitat-Balken: „KI-Optik", nicht die eines Buchs;
//   5 · die Erklärungen waren Grammatik-Sprech („Ein Befehl braucht kein du");
//   6 · und alle fünf Seiten trugen dasselbe Template, obwohl fünf verschiedene
//       Regeln darauf stehen.
// Punkt 5 ist im Level gelöst (die fünf Seiten sind einzeln neu geschnitten),
// Punkt 6 hier UND dort: die Seite deklariert ihre Lese-Form
// (»beispielMuster«), und diese Datei zeichnet vier verschiedene Formen.
import React from "react";
// `Struck` left with the trap it drew (R5-W4 · I2, Koki: „Wir wollen KEINE
// Fehler zeigen"). It stays exported from Glance for other cards; filed for D3
// as a dead export if none of them take it up.
import { BecomesMark, EnMark, KeyBit, Quiet } from "./Glance.tsx";
import { PaintedIcon } from "./PaintedIcons.tsx";
// R5-W9 · N1: die drei Textentscheidungen wohnen jetzt in EINER Datei, die auch
// das Hub-Brett liest — `splitKey` stand bis heute zweimal im Repo, Wort für
// Wort abgeschrieben, und genau diese Drift hat Kokis Review schon einmal
// gekostet („der Hub und die Karte lesen sich wie zwei Produkte").
import { markEn, paarTeile, splitKey } from "../rule-text.ts";

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
    {/* R5-W9 · N1: der Name der Seite steht auch HIER schon gross. Es ist das,
        was das Kind gefunden hat — auf dem Fund-Takt trug er bis heute die
        Flüster-Zeile, also die kleinste Type des Takts. */}
    <p className="pb-rule-titel">{topicDe}</p>
    <button className="pb-btn-primary" onClick={onNext}>Seite aufschlagen</button>
  </div>
);

/** Eine englische Beispielzeile mit ihren markierten Formen.
 *
 *  Die Entscheidung, WAS markiert wird, liegt in `rule-text.ts#markEn` und
 *  damit in einem Test — hier wird sie nur gezeichnet. */
const EnZeile = ({ text, lehrt }: { text: string; lehrt: readonly string[] }): React.ReactElement => {
  const stuecke = markEn(text, lehrt);
  return (
    <>
      {stuecke.map((s, i) => {
        if (s.markiert) return <EnMark key={i}>{s.text}</EnMark>;
        // R233 · F6: der Leerraum ZWISCHEN zwei Marken bekommt seine Breite
        // zurück. Der Wisch ragt über seine Buchstaben hinaus und holt sich den
        // Platz mit einem negativen Rand wieder — nebeneinander berühren sich
        // zwei Wische dadurch. Hier steht die Antwort darauf, und nicht mehr im
        // Markierer: der darf nicht entscheiden, WAS eine Marke ist.
        const zwischenMarken = s.text.trim() === ""
          && stuecke[i - 1]?.markiert === true && stuecke[i + 1]?.markiert === true;
        return zwischenMarken
          ? <span key={i} className="pb-en-luecke">{s.text}</span>
          : <React.Fragment key={i}>{s.text}</React.Fragment>;
      })}
    </>
  );
};

/** DIE BEISPIELE — vier Lese-Formen, eine je Art von Regel.
 *
 *  ★ R5-W9 · N1, Kokis Punkt 3 und 6. Bis heute war das eine Liste: vier Zeilen,
 *  gleiche Farbe, gleiche Grösse, untereinander. Auf der Befehls-Seite standen
 *  darin zwei Handlungen und ihre zwei Verbote, ununterscheidbar; auf der
 *  Plural-Seite vier Verwandlungen, deren rechte Hälfte die Lektion ist und
 *  nicht hervorstach; auf der Gruss-Seite ein Wortwechsel, der nicht wie einer
 *  aussah. Die Form der Beispiele IST hier die Didaktik.
 *
 *  ⚠ DER GEGENSATZ IST KEIN RICHTIG/FALSCH. „Don't sit down!" ist fehlerfreies
 *  Englisch. Es gibt deshalb kein Kreuz, keinen Durchstrich und kein Rot/Grün —
 *  Koki hat die durchgestrichene Falschform am 15.08. ausdrücklich abgeschafft
 *  („Wir wollen KEINE Fehler zeigen, nur die richtigen Notions und Beispiele").
 *  Die zwei Spalten tragen zwei Etiketten und einen Papierfalz, sonst nichts.
 *
 *  Geteilt von der Fundkarte und der Merkseite, damit die zwei Flächen nie in
 *  zwei Vorstellungen davon auseinanderlaufen, was ein Beispiel ist — genau die
 *  Drift, die Kokis Review am Hub-Brett schon einmal gefunden hat. */
const Beispiele = ({ lines, lehrt, muster }: {
  lines: readonly string[]; lehrt: readonly string[]; muster: string;
}): React.ReactElement => {
  if (muster === "wandel") {
    return (
      <ul className="pb-bsp pb-bsp-wandel">
        {lines.map((line) => {
          const paar = paarTeile(line);
          // keine Hälften? Dann die Zeile ganz — eine halb gezeichnete
          // Verwandlung wäre schlechter als gar keine. Dass es vorkommt, ist
          // bereits ein Befund von `tip-honesty`, kein Fall für einen Notbehelf.
          if (paar === null) return <li key={line}><EnZeile text={line} lehrt={lehrt} /></li>;
          return (
            <li key={line}>
              <span className="pb-bsp-von">{paar[0]}</span>
              <span className="pb-bsp-pfeil" aria-hidden><BecomesMark size={17} /></span>
              <span><EnZeile text={paar[1]} lehrt={lehrt} /></span>
            </li>
          );
        })}
      </ul>
    );
  }
  if (muster === "dialog") {
    return (
      <ul className="pb-bsp pb-bsp-dialog">
        {lines.map((line) => {
          const paar = paarTeile(line);
          if (paar === null) return <li key={line}><EnZeile text={line} lehrt={lehrt} /></li>;
          return (
            <li key={line}>
              <span className="pb-bsp-frage"><EnZeile text={paar[0]} lehrt={lehrt} /></span>
              <span className="pb-bsp-antwort"><EnZeile text={paar[1]} lehrt={lehrt} /></span>
            </li>
          );
        })}
      </ul>
    );
  }
  if (muster === "gegensatz") {
    // zeilenweise gefüllt: EIN Verb je Zeile, links seine Aufforderung, rechts
    // ihr Verbot. So liest ein Kind den Unterschied waagrecht (dasselbe Verb,
    // ein Wort davor) und die Sorte senkrecht (alles links ist ein Auftrag).
    return (
      <>
        <div className="pb-bsp pb-bsp-gegensatz" style={{ gap: 0, marginBottom: 2 }}>
          <p className="pb-bsp-etikett">Tun</p>
          <p className="pb-bsp-etikett" style={{ paddingLeft: 13 }}>Nicht tun</p>
        </div>
        <ul className="pb-bsp pb-bsp-gegensatz">
          {lines.map((line) => (
            <li key={line}><EnZeile text={line} lehrt={lehrt} /></li>
          ))}
        </ul>
      </>
    );
  }
  return (
    <ul className="pb-bsp pb-bsp-einzeln">
      {lines.map((line) => (
        <li key={line}><EnZeile text={line} lehrt={lehrt} /></li>
      ))}
    </ul>
  );
};

/** DER MERKZETTEL — die Regel selbst, auf einem eingeklebten Zettel.
 *
 *  ★ R5-W9 · N1, Kokis Punkt 4. Hier stand ein 3px-Balken links am Absatz, also
 *  die Optik eines Blockzitats — Koki las genau das als „KI-Optik". Und er hat
 *  recht: ein Buch zitiert sich nicht selbst. Es klebt einen Zettel hinein, auf
 *  dem Papier der Blätter darunter, mit vier ungleichen Ecken.
 *
 *  Die Tinte bleibt ruhig, denn genau das macht den KeyBit darin überhaupt
 *  sichtbar — I1 hatte die Gegenprobe gemessen und 800-auf-600 in einer Tinte
 *  gefunden, also gar keine Hervorhebung. */
const Merkzettel = ({ satz, schluessel }: { satz: string; schluessel: string }): React.ReactElement => {
  const [before, key, after] = splitKey(satz, schluessel);
  return (
    <div className="pb-rule-zettel">
      <p className="pb-quiet pb-rule-line">{before}<KeyBit>{key}</KeyBit>{after}</p>
    </div>
  );
};

/** Was auf JEDER Regel-Seite steht, in der Reihenfolge, in der es gelesen wird:
 *  der NAME der Seite, dann was passiert, dann die Regel, dann die Beispiele.
 *  Eine Funktion, weil die Fundkarte und das Archiv-Fach dieselbe Seite zeigen
 *  müssen — zwei Fassungen wären zwei Bilder derselben Regel. */
const Seiteninhalt = ({ topicDe, erklaerungDe, merksatzDe, schluesselDe, beispieleEn, lehrtEn, beispielMuster }: {
  topicDe: string; erklaerungDe: string; merksatzDe: string; schluesselDe: string;
  beispieleEn: readonly string[]; lehrtEn: readonly string[]; beispielMuster: string;
}): React.ReactElement => (
  <>
    {/* DER NAME DER SEITE — jetzt die Überschrift, die er immer war. */}
    <p className="pb-rule-titel">{topicDe}</p>
    {/* …WAS PASSIERT, in Kindersprache. Der Schritt, den die alte Karte nicht
        hatte, und den Koki beim Namen bestellt hat („mehr Notions"). */}
    <p className="pb-quiet pb-rule-line">{erklaerungDe}</p>
    {/* …DIE REGEL, mit der einen Wendung, die sie trägt. */}
    <Merkzettel satz={merksatzDe} schluessel={schluesselDe} />
    {/* …und das Englische, zwei- bis viermal, in der Form, die zu DIESER Regel
        gehört. Eine Regel, die einmal gezeigt wird, ist eine Regel, die
        behauptet wird (Kokis Ruling K-1: die Sätze sind unsere eigenen). */}
    <Beispiele lines={beispieleEn} lehrt={lehrtEn} muster={beispielMuster} />
  </>
);

/** BEAT 2 — the rule. The page is open; the lesson is the only thing moving.
 *
 *  R5-W4 · I2 · REBUILT ON KOKI'S REPLAY OF 2026-08-15. What left, in his words:
 *  the book reference („Die Regel soll NICHT aufs Buch verweisen — wir
 *  restaurieren unser eigenes Buch"), the pronunciation line („das ‚how to
 *  pronounce' ist unnötig") and the struck-through wrong form („Wir wollen KEINE
 *  Fehler zeigen, nur die richtigen Notions und Beispiele").
 *
 *  THE ORDER IS THE TEACHING, and it is four steps down: the page is NAMED,
 *  then what happens is EXPLAINED, then the rule is STATED with its one bold
 *  key, then it is SHOWN two to four times.
 *
 *  R5-W9 · N1: die Genre-Zeile „Die Regel" über dem Band ist WEG. Sie stand als
 *  graue Versalien-Zeile direkt über einer zweiten grauen Versalien-Zeile (dem
 *  Titel) — zwei Etiketten übereinander, von denen das wichtigere das kleinere
 *  war. Das gemalte aufgeschlagene Buch darüber sagt ohnehin, welche Karte das
 *  ist; jetzt sagt es das allein, und der Titel führt. */
export const RuleRead = ({ art, plateUrl, skin, topicDe, erklaerungDe, merksatzDe, schluesselDe, beispieleEn, lehrtEn, beispielMuster, onDone }: {
  art: Record<string, string>; plateUrl?: string | undefined; skin: string; topicDe: string;
  erklaerungDe: string; merksatzDe: string; schluesselDe: string; beispieleEn: readonly string[];
  lehrtEn: readonly string[]; beispielMuster: string;
  onDone: () => void;
}): React.ReactElement => {
  return (
    <div style={{ textAlign: "left" }}>
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
      <Seiteninhalt
        topicDe={topicDe}
        erklaerungDe={erklaerungDe}
        merksatzDe={merksatzDe}
        schluesselDe={schluesselDe}
        beispieleEn={beispieleEn}
        lehrtEn={lehrtEn}
        beispielMuster={beispielMuster}
      />
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
  found: readonly {
    topicDe: string; erklaerungDe: string; merksatzDe: string; schluesselDe: string;
    beispieleEn: readonly string[]; lehrtEn: readonly string[]; beispielMuster: string;
  }[];
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
        {/* R5-W4 · I2: the archive slot carries the SAME steps as the pickup
            card — name, Notion, rule, examples — and no book reference. Two
            renderings of one page taught a child two shapes of the same rule;
            that was Koki's „besser organisiert" in its smallest form. Seit
            R5-W9 · N1 ist es buchstäblich derselbe Baustein (`Seiteninhalt`),
            also kann es gar nicht mehr auseinanderlaufen. */}
        {found.map((t) => (
          <div className="pb-merk-slot" key={t.topicDe}>
            <Seiteninhalt
              topicDe={t.topicDe}
              erklaerungDe={t.erklaerungDe}
              merksatzDe={t.merksatzDe}
              schluesselDe={t.schluesselDe}
              beispieleEn={t.beispieleEn}
              lehrtEn={t.lehrtEn}
              beispielMuster={t.beispielMuster}
            />
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
