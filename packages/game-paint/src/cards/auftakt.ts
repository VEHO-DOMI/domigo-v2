// R5-W2 · J1-B · THE OPENING IS A LINE, NOT A GRAPH.
//
// Koki, on the shipped chapter opening: „der level start sollte ein bisschen
// mehr story mode like eingeführt werden mit mehreren visuellen cards und
// teasern und konkreter story beschreibung und expliziter aufgaben (nicht nur
// eine simple karte mit allen listungen)."
//
// Four beats replace one card. The ORDER of them lives here — once — for three
// reasons, and the third is the one that earns the file:
//
//   · »weiter« and »zurück« cannot disagree about what comes next, because
//     both read the same array from opposite directions;
//   · a test can walk the chain from both ends with no DOM, which PaintGame.tsx
//     cannot offer (it imports Phaser, so this package cannot render it — the
//     emphasis and icon tests already scan it as TEXT for exactly that reason);
//   · the shell gets ONE answer to the only question that actually matters —
//     does putting THIS beat down give the world back? Stated as arithmetic, it
//     is a property a test can assert. Stated as a comment in a 480-line switch,
//     it is a promise, and the promise this replaces was already broken once
//     (pickups.test.ts: „a Regel-Seite FREEZES the world").

/** The beats of a chapter opening.
 *
 *  R5-W3 · J2 · R29 — FIVE, because the task beat split in two. Two blind
 *  didactics critics, run months and sessions apart and each blind to the other,
 *  independently called one card carrying all five task lines too much for a
 *  six-year-old (75 % and 90 %), and both named the same second fault: with
 *  every line in the same weight, nothing said which job was the chapter's and
 *  which was a bonus. Convergence is what turned that from an opinion into a
 *  finding, and the architect's standing ruling was: split on convergence.
 *
 *  The seam is DO versus GATHER. »aufgaben« carries what the chapter asks the
 *  child to do — give the colour back (which is where the whole English
 *  mechanic lives) and open the cages. »sammeln« carries what they pick up
 *  along the way. That split answers both critics at once: two or three lines a
 *  card instead of five, and the mechanic no longer shares a weight with the
 *  bonus book. */
export type AuftaktCard = "goal" | "schatten" | "aufgaben" | "sammeln" | "los";

/** The beats in order.
 *
 *  `goal` keeps its name deliberately, and it is not sentiment: it is the value
 *  the boot state writes, the ceremony beat `sim.ts` already carries, and the
 *  address the card bench is photographed at (`?karten=goal`). Renaming it for
 *  tidiness would rename all three and buy a label. */
export const AUFTAKT: readonly AuftaktCard[] = ["goal", "schatten", "aufgaben", "sammeln", "los"];

const isAuftakt = (card: string): card is AuftaktCard =>
  (AUFTAKT as readonly string[]).includes(card);

/** Which beats THIS chapter has.
 *
 *  A task beat with no lines is not a beat, it is a blank page — and ch02–15
 *  will not all have both kinds. So the chain is COMPUTED from the same counts
 *  the lines are, and every step, position and exit is asked about that chain
 *  rather than about the full list. (The alternative — a static five and an
 *  empty card when a chapter lacks a group — is the bug this signature exists
 *  to make unrepresentable.) */
export const auftaktChain = (c: AuftaktCounts): readonly AuftaktCard[] =>
  AUFTAKT.filter((b) =>
    b === "aufgaben" || b === "sammeln" ? auftaktTasks(c, b).length > 0 : true);

/** One step along the chain, or null at its ends.
 *
 *  Null for any card that is not IN the chain, so a task card can never be
 *  walked into the opening by a stray call — and a beat this chapter skipped is
 *  not in the chain, so it cannot be stepped into either. */
export const auftaktStep = (card: string, d: 1 | -1, chain: readonly AuftaktCard[] = AUFTAKT): AuftaktCard | null => {
  if (!isAuftakt(card) || !chain.includes(card)) return null;
  return chain[chain.indexOf(card) + d] ?? null;
};

/** Which beat a child is on, 1-based — and how many there are. The foot prints
 *  these, and like every other number the book shows they are COUNTED, never
 *  typed (doc 41 §7, the letter-honesty law). »4 von 5« on a chapter that skips
 *  a beat would be a typed number wearing a count's clothes. */
export const auftaktPosition = (card: string, chain: readonly AuftaktCard[] = AUFTAKT): { at: number; of: number } | null =>
  isAuftakt(card) && chain.includes(card) ? { at: chain.indexOf(card) + 1, of: chain.length } : null;

/** What the shell must DO when a beat is put down.
 *
 *  `unfreeze` is true for exactly one of the four, and it is the same one that
 *  raises the world. That is the whole law of this packet in one boolean:
 *  three hand-overs that must NOT give the world back, and one exit that must.
 *  The opening's freeze is stricter than the reading card's, because the world
 *  has never been un-frozen at all — the boot ceremony is the first thing
 *  rendered, so the freeze exists before the first tick. Un-freezing between
 *  beat 2 and beat 3 would start the chapter running underneath a card a child
 *  is still reading. */
export interface AuftaktExit {
  /** the next beat, or null if this was the last */
  next: AuftaktCard | null;
  /** may the shell give the world back here? */
  unfreeze: boolean;
  /** does the chapter start here? (the world fades up, the flag is remembered) */
  boot: boolean;
}

export const auftaktExit = (card: string, chain: readonly AuftaktCard[] = AUFTAKT): AuftaktExit => {
  if (!isAuftakt(card) || !chain.includes(card)) return { next: null, unfreeze: false, boot: false };
  const next = auftaktStep(card, 1, chain);
  const last = next === null;
  return { next, unfreeze: last, boot: last };
};

// ── BEAT 3'S TASK LINES ──────────────────────────────────────────────────────
//
// The lines live here rather than in the renderer for one reason: German has a
// singular. A line built as `Nimm {n} Bonus-Bücher mit` is correct for every n
// the chapter happens to ship and wrong the day one of them is 1 — which is the
// SAME defect the old objective card carried in the other direction („3
// Klassenkinder STECKT fest"), found then by a critic rather than by a check.
// Out here it is five pure strings a test can walk at n = 0, 1 and 2.

/** What the opening counts. Structural on purpose — the renderer hands it the
 *  live Bilanz, the test hands it a literal. */
export interface AuftaktCounts {
  letters: number;
  collectNounDe: string;
  drained: number;
  cages: number;
  kids: number;
  tips: number;
  books: number;
}

export interface AuftaktTask {
  key: string;
  /** the painted mark AQ8 delivered for this row, if it has one */
  mark?: string;
  /** the code-drawn icon that stands in when it has none */
  icon: "spark" | "palette" | "cage" | "rule" | "book";
  askDe: string;
  whyDe: string;
}

/** The chapter's contract with the child, one line per task.
 *
 *  EVERY NUMBER IS PASSED IN, never typed (doc 41 §7): this page is the promise
 *  the chapter makes, and a promise with a typed number in it is the one thing
 *  it may not be. A category the chapter does not have draws no line at all. */
export const auftaktTasks = (c: AuftaktCounts, group?: "aufgaben" | "sammeln"): AuftaktTask[] => {
  const GROUP_OF: Record<string, "aufgaben" | "sammeln"> = {
    // what the chapter asks a child to DO — and »drained« is first because it is
    // the one line that names the mechanic the whole game runs on
    drained: "aufgaben", cages: "aufgaben",
    // …and what they gather on the way
    letters: "sammeln", tips: "sammeln", books: "sammeln",
  };
  const out: AuftaktTask[] = [];
  if (c.letters > 0) {
    // ⚠ `collectNounDe` is AUTHORED AND PLURAL („Buchstaben"), and its singular
    // is not derivable: the article and the ending depend on the noun's gender,
    // which the level never declares — and the next chapter's collectible may be
    // feminine or neuter. So at one, this line does not invent a singular; it
    // drops the number instead and lets the quiet line carry it with the
    // gender-free indefinite pronoun. A chapter that really ships ONE
    // collectible should declare a singular noun of its own; until one does,
    // guessing would be worse than not counting out loud.
    out.push({
      key: "letters", mark: "auftakt_mark_letters", icon: "spark",
      askDe: c.letters === 1 ? `Sammle ${c.collectNounDe}.` : `Sammle ${c.letters} ${c.collectNounDe}.`,
      whyDe: c.letters === 1 ? "Es fehlt nur noch eines." : "Sie liegen überall verstreut.",
    });
  }
  if (c.drained > 0) {
    out.push({
      key: "drained", icon: "palette",
      askDe: c.drained === 1
        ? "Gib einer entfärbten Schulsache die Farbe zurück."
        : `Gib ${c.drained} entfärbten Schulsachen die Farbe zurück.`,
      // R5-W2 · J1-B · Didaktik-Kritiker (80 %, hoch): der ganze Mechanismus des
      // Spiels — auf Englisch sagen, dann kommt die Farbe zurück — stand NUR in
      // Takt 1 und nirgends auf der Seite, auf der das Kind handeln soll. Eine
      // einmalige Nennung, zwei Tipps bevor sie gebraucht wird. Jetzt steht sie
      // dort, wo die Aufgabe steht.
      whyDe: c.drained === 1 ? "Sag auf Englisch, was sie ist." : "Sag auf Englisch, was sie sind.",
    });
  }
  if (c.cages > 0) {
    // the classmate is this row's SUBLINE and not a sixth row: „ein Klassenkind"
    // plus „fünf Käfige" is six things to a six-year-old when the child is one
    // OF the five (the old objective card made that argument; it still holds)
    out.push({
      key: "cages", mark: "auftakt_mark_cages", icon: "cage",
      askDe: c.cages === 1 ? "Mach den Käfig auf." : `Mach ${c.cages} Käfige auf.`,
      whyDe: c.kids === 0
        ? (c.cages === 1 ? "Er ist zu." : "Sie sind alle zu.")
        : c.kids === 1
          ? (c.cages === 1 ? "Darin steckt ein Klassenkind." : "In einem steckt ein Klassenkind.")
          : `In ${c.kids} davon stecken Klassenkinder.`,
    });
  }
  if (c.tips > 0) {
    // named rather than „er": the antecedent would sit two beats back with four
    // other nouns in between — a long hunt for a first-grader tracking a pronoun
    out.push({
      key: "tips", mark: "auftakt_mark_tips", icon: "rule",
      askDe: c.tips === 1 ? "Finde die Regel-Seite." : `Finde ${c.tips} Regel-Seiten.`,
      // „sie" carries both numbers here (die Seite / die Seiten), so this line
      // needs no branch — and a branch whose two arms are identical is a lie
      // about where the variation is.
      whyDe: "Der Tinten-Schatten hat sie herausgerissen.",
    });
  }
  if (c.books > 0) {
    out.push({
      key: "books", icon: "book",
      askDe: c.books === 1 ? "Nimm das Bonus-Buch mit." : `Nimm ${c.books} Bonus-Bücher mit.`,
      whyDe: c.books === 1 ? "Es liegt versteckt." : "Sie liegen versteckt.",
    });
  }
  // filtered at the END, not while building, so each group keeps the order the
  // lines are authored in and a group is never silently reordered by its filter
  return group === undefined ? out : out.filter((t) => GROUP_OF[t.key] === group);
};

// ── DIE SAMMEL-LEGENDE (R5-W7 · D5 · R165 / ch01.md §9 Frage 2, D-275) ───────
//
// Der Spielkanon verspricht dem ersten Kapitel einen Auftragsschirm mit einer
// SAMMEL-LEGENDE. Der Schirm steht seit J1-B; die Legende fehlte, und mit ihr
// fehlten die neun Uniform-Teile, die seit Welle 5 im Kapitel liegen: die Seite,
// die einem Kind sagt, was es sammelt, erwähnte sie mit keinem Wort. Kokis
// Entscheid vom 18.08.: die Legende ja, die drei zusätzlichen Kartenposten nein.
//
// WARUM DIE ZEILEN HIER LIEGEN UND NICHT IM RENDERER — derselbe Grund wie bei
// den Aufgaben-Zeilen darüber: was auf der Seite STEHT, soll ein Test ohne DOM
// abgehen können. Der Renderer entscheidet nur, wie eine Zelle aussieht.

/** Das deutsche Kinderwort zu jedem der neun englischen Uniform-Wörter.
 *
 *  KOKIS ENTSCHEID (21.08.): unter jedem Bild steht das DEUTSCHE Wort, nicht das
 *  englische. Die Legende sagt dem Kind, WAS es suchen soll; das englische Wort
 *  ist die Belohnung — es erscheint beim Aufheben als Wort-Flash und noch einmal
 *  in der Schluss-Zeremonie (UNIFORM_SAMMELN_DESIGN §1: „erst begegnen, dann
 *  abfragen"). Neun englische Vokabeln auf einer Seite, die das Kind sieht,
 *  BEVOR es ein einziges Teil gefunden hat, nähmen dem Fund seinen Wert.
 *
 *  ⚠ Diese neun Wörter sind SICHTBARE deutsche Spielzeilen und gehören damit
 *  unter LEXIKON_AT — dort steht heute nur Schulmaterial, keine Kleidung. Der
 *  Nachtrag ist für die Kanon-Bahn abgelegt; geprüft sind sie hier gegen das
 *  Maschinen-Tor (`check-copy-register`), das sie als österreichisches Deutsch
 *  durchgelassen hat. */
export const UNIFORM_DE: Readonly<Record<string, string>> = {
  hairband: "Haarband",
  hat: "Hut",
  sunglasses: "Sonnenbrille",
  shirt: "Hemd",
  "school tie": "Krawatte",
  sweater: "Pullover",
  skirt: "Rock",
  socks: "Socken",
  shoe: "Schuh",
};

/** Ein Uniform-Teil, wie es im Level steht: sein Blatt und sein englisches Wort. */
export interface UniformPiece {
  /** der Skin, aus dem das gemalte Blatt `<skin>_a` wird */
  skin: string;
  /** das englische Wort, das dieses Teil lehrt — der Schlüssel des Ledgers */
  wordEn: string;
}

/** Eine Zelle der Legende. */
export interface LegendCell extends UniformPiece {
  /** das deutsche Wort, oder null, wenn für dieses Teil keines geschrieben ist */
  de: string | null;
  /** hat das Kind es schon? */
  found: boolean;
}

/**
 * Die Legende aus dem LEVEL und dem Ledger — nichts davon ist getippt.
 *
 * `pieces` kommt aus der gebauten Welt (die Reihenfolge des Levels ist die
 * Reihenfolge der Stockwerke, drei je Stockwerk — das Raster der Seite ist
 * damit die Verteilung des Designs und keine Layout-Laune), `found` ist der
 * Ledger der aufgehobenen WÖRTER. Ein Teil ohne deutsches Wort bekommt `null`
 * und nicht etwa sein englisches: eine Legende, die stillschweigend die Sprache
 * wechselt, lehrt das Kind das falsche Wort. Dass für die ausgelieferten neun
 * kein `null` entsteht, hält ein Test fest.
 */
export const uniformLegend = (
  pieces: readonly UniformPiece[],
  found: readonly string[] = [],
): LegendCell[] =>
  pieces.map((p) => ({
    ...p,
    de: UNIFORM_DE[p.wordEn] ?? null,
    found: found.includes(p.wordEn),
  }));

/** Die Zeile über der Legende — und wie jede Zahl auf dieser Seite ist sie
 *  GEZÄHLT und nicht getippt (doc 41 §7). Deutsch hat einen Singular, also hat
 *  diese Funktion einen Zweig dafür; ein Kapitel mit genau einem Fundstück wird
 *  es geben, und `1 Kleider` wäre dann kompiliert und trotzdem falsch. */
/** L0 · N2 · die vier deutschen Wörter dieser Zeile, aufgelöst aus dem Level.
 *  EINE Stelle, damit HUD, Bilanz und Legende nicht dreimal dieselbe Vorgabe
 *  buchstabieren — und weil eine Vorgabe, die dreimal dasteht, dreimal driftet. */
export interface ClothWordsDe {
  /** Nominativ Plural — „Deine 9 KLEIDER sind …" */
  pl: string;
  /** Dativ Plural — „Du hast 4 von 9 KLEIDERN." */
  plDat: string;
  /** Singular — „Ein KLEIDUNGSSTÜCK liegt …" */
  sg: string;
  /** der Ort — „… über das SCHULHAUS verstreut." */
  ort: string;
}

/** Die Vorgaben sind Kapitel 1, Zeichen für Zeichen. Ein Level ohne Deklaration
 *  liest sich damit unverändert; wer nur den Plural setzt, bekommt ihn auch in
 *  den anderen Nomen-Rollen (richtig für „Federn", zu wenig für „Schnipsel" —
 *  dafür gibt es `clothNounDatDe`). */
export const clothWordsDe = (level: {
  clothNounDe?: string; clothNounDatDe?: string; clothNounSgDe?: string; clothPlaceDe?: string;
}): ClothWordsDe => ({
  pl: level.clothNounDe ?? "Kleider",
  plDat: level.clothNounDatDe ?? level.clothNounDe ?? "Kleidern",
  sg: level.clothNounSgDe ?? level.clothNounDe ?? "Kleidungsstück",
  ort: level.clothPlaceDe ?? "Schulhaus",
});

export const uniformLegendLine = (total: number, found: number, w: ClothWordsDe = clothWordsDe({})): string => {
  if (total === 1) return found === 0 ? `Ein ${w.sg} liegt irgendwo im ${w.ort}.` : "Du hast es.";
  if (found === 0) return `Deine ${total} ${w.pl} sind über das ${w.ort} verstreut.`;
  if (found >= total) return `Du hast alle ${total} ${w.pl}.`;
  return `Du hast ${found} von ${total} ${w.plDat}.`;
};
