// R5-W2 · H1 (Teil 3) · DIE KNOTEN-ERKLÄRUNG — der Auftrag vor dem Examen.
//
// Kokis Replay-Satz, wörtlich: „Why do we have knots? What is the idea again?"
// (doc 45 F1), und daneben F2: „Klare Arena-Anleitung. Wie besiegt man den Boss?
// Muss instruiert und gescaffoldet sein." Beides stand seit R5-P1 als
// DEKLARIERTER, leerer Platz im Dossier (`arena.md` §3, Zeile p4-objective:
// „Slot hier DEKLARIERT, damit der Bau ihn verdrahtet") — mit gemalter Tafel
// (`plate_ch01_goal`) und ohne eine einzige Zeile Inhalt.
//
// Die Form ist bewusst die des Kapitel-Auftakts (`cards/auftakt.ts`), und zwar
// aus dessen drittem, tragendem Grund: der Shell bekommt EINE Antwort auf die
// einzige Frage, die zählt — gibt das Weglegen dieses Taktes die Welt zurück?
// Als Arithmetik ist das eine Eigenschaft, die ein Test behaupten kann; als
// Kommentar in einem Zweig ist es ein Versprechen, und genau so ein Versprechen
// hat in diesem Paket schon einmal eine Phase eingefroren (die Freeze-Paarung
// am Käfig-Hinweis, `sim.ts` `nearOpenableCage`).
//
// ZWEI Takte, nicht vier. Der Kapitel-Auftakt darf vier haben — er ist der
// Einstieg und das Kind steht still. Hier steht ein Boss in der Luft und das
// Kind ist mitten im Spiel: was es braucht, ist WER SIE IST und WIE ES GEHT,
// und beides in je zwei Sätzen. (D-52 ist ausserdem ein offenes Koki-Tor: die
// Auftakt-Karte wird auf 375 × 812 oben UND unten beschnitten. Ein zweiter
// Vier-Takter würde dieselbe Schuld erben.)
//
// ── R5-W4 · H2 · WAS SICH GEÄNDERT HAT (Ruling R50, Koki 15.08.2026) ─────────
// Die Frage, die dieser Takt beantwortet, ist eine ANDERE geworden. Koki hat
// den ausgelieferten Takt gespielt und die Lore als Fremdkörper erkannt: „sie
// fliegt und ist über und über verknotet … die Knoten hat ihr die Tinte
// gemacht" — ein Rest der Vorgänger-Fassung, und für Zehnjährige archaisch.
// Neu: sie ist VOLLGEKRITZELT, niemand hat sie sauber gemacht, deshalb ist sie
// grantig, deshalb wirft sie Kreide — und die Aufgabe IST die Mechanik: das
// Kind wischt die Kritzel-Schichten weg („Clean the board!", ein Imperativ der
// Unit). Die STRUKTUR dieses Moduls bleibt unberührt; nur die sechs Zeilen und
// ihre Begründung wechseln. Interne Symbole (`knots`, `KNOT_*`) bleiben, weil
// ein Umbenennen Register-Runden ohne einen einzigen sichtbaren Gewinn kostet.

/** Die zwei Takte der Arena-Anleitung, in ihrer Reihenfolge. */
export type ArenaBeat = "wer" | "wie";

/** Erst wer sie IST, dann wie es geht.
 *
 *  Die Reihenfolge ist die Aussage des Kapitels, nicht Geschmack: die Tafel ist
 *  kein Gegner, sie ist verwunschen und wird ERLÖST (doc 45 F6 — „we're doing
 *  them a favor by restoring them"). Ein Kind, dem man zuerst sagt, wie man
 *  etwas besiegt, hat den Satz danach nicht mehr nötig. */
export const ARENA_BEATS: readonly ArenaBeat[] = ["wer", "wie"];

const isArenaBeat = (card: string): card is ArenaBeat =>
  (ARENA_BEATS as readonly string[]).includes(card);

/** Ein Schritt entlang der Kette, oder null an ihren Enden.
 *
 *  Null für jede Karte, die NICHT in der Kette ist — damit eine Aufgabenkarte
 *  niemals versehentlich in die Anleitung hineingelaufen werden kann. */
export const arenaStep = (card: string, d: 1 | -1): ArenaBeat | null => {
  if (!isArenaBeat(card)) return null;
  return ARENA_BEATS[ARENA_BEATS.indexOf(card) + d] ?? null;
};

/** Auf welchem Takt das Kind steht, 1-basiert — und wie viele es sind.
 *  Gezählt, nie getippt (doc 41 §7, das Buchstaben-Ehrlichkeitsgesetz). */
export const arenaPosition = (card: string): { at: number; of: number } | null =>
  isArenaBeat(card) ? { at: ARENA_BEATS.indexOf(card) + 1, of: ARENA_BEATS.length } : null;

/** Was der Shell tun muss, wenn ein Takt weggelegt wird. */
export interface ArenaExit {
  /** der nächste Takt, oder null wenn das der letzte war */
  next: ArenaBeat | null;
  /** darf der Shell hier die Welt zurückgeben? */
  unfreeze: boolean;
}

/** `unfreeze` ist für GENAU EINEN der Takte wahr, und es ist derselbe, der die
 *  Kette beendet. Das ist das ganze Gesetz dieses Moduls in einem Booleschen:
 *  eine Übergabe, die die Welt NICHT zurückgeben darf, und ein Ausgang, der es
 *  muss. Ein Kampf, der unter dem zweiten Takt schon läuft, wäre ein Boss, der
 *  wirft, während das Kind noch liest, wie man ihm ausweicht. */
export const arenaExit = (card: string): ArenaExit => {
  if (!isArenaBeat(card)) return { next: null, unfreeze: false };
  const next = arenaStep(card, 1);
  return { next, unfreeze: next === null };
};

// ── DIE ZEILEN ───────────────────────────────────────────────────────────────
//
// Ton nach `STORY_SPINE_CH01.md` §5: ein Erzähler, der neben dem Kind steht und
// auf Dinge zeigt — zwei Sätze, was zu SEHEN ist und was zu TUN ist. Geprüft:
// ≤ MAX_LINE_DE (56) je Zeile · kein Antagonisten-Name (Cloak-Gesetz, `chapter-
// copy` + `check-paint-copy`) · kein Angst-Register · KEIN Ruhe-Wort, denn diese
// Phase trägt seit Teil 2 eine Uhr (`cards/timer.ts` CALM_DE) · kein englisches
// Antwort-Wort. Die Zahl der Schichten steht bewusst in keiner Zeile: sie kommt
// aus dem Tier-Skript (E drei · M vier · S fünf) und wäre als getippte Zahl auf
// jeder anderen Stufe falsch (doc 41 §7). Deshalb sagt Takt 2 „eine Schicht"
// und nicht, wie viele es sind — die Anzahl zeigt der Kritzel-Zähler im HUD.
//
// Wortwahl nach K2s Lexikon (R5-W4): „wischen" ist die Erstwahl, „löschen" die
// Zweitwahl — und in einer Zeile, die neben einem Menü steht, klingt „löschen"
// nach Datei. „grantig" ist das Wort für ihre Laune; „böse" steht in BANNED_DE.

export interface ArenaLines {
  /** die Überschrift des Taktes */
  titleDe: string;
  /** was zu sehen ist */
  showsDe: string;
  /** was zu tun ist */
  storyDe: string;
}

/**
 * Was jeder Takt sagt.
 *
 * Takt 1 („wer") nennt den Zustand, nicht den Feind: sie ist vollgekritzelt,
 * niemand hat sie je geputzt, und DAVON ist sie grantig. Die Frage „warum wirft
 * sie mit Kreide?" ist damit beantwortet, bevor sie aufkommt — und die Antwort
 * enthält bereits den Auftrag, weil das Gegenteil von vollgekritzelt sauber ist.
 *
 * Takt 2 („wie") ist die Schleife in der Sprache des Kindes, in genau der
 * Reihenfolge, in der das Kind sie erlebt: ausweichen → sie kommt herunter →
 * antworten → hingehen → eine Schicht wegwischen. Das HINGEHEN steht drin, weil
 * es seit dieser Welle eine eigene Handlung ist: die gelöste Karte allein macht
 * die Tafel nicht sauber (Koki: „wenn sie unten ist und man zu ihr geht, wird
 * gewischt"). Der Bindestrich-Rhythmus ist derselbe wie auf den Tür-Karten.
 */
export const arenaLines = (beat: ArenaBeat): ArenaLines =>
  beat === "wer"
    ? {
      titleDe: "Die Tafel",
      showsDe: "Sie fliegt, vollgekritzelt und ziemlich grantig.",
      storyDe: "Niemand hat sie je geputzt. WISCH sie sauber!",
    }
    : {
      titleDe: "So geht es",
      showsDe: "Weich ihrer Kreide aus, dann kommt sie herunter.",
      storyDe: "ANTWORTE ihr, geh hin und WISCH eine Schicht weg!",
    };
