// R5-W4 · W2 · DIE BANK ZÄHLT, SIE TIPPT NICHT (D-103).
//
// Die Bilanz-Attrappe der Kartenbank stand als getippte Literale in
// `CardGallery.tsx`: 6 Käfige, 1 Bonusbuch. Das Kapitel hält aber 5 Käfige
// (4 in den Phasen + 1 in der Arena) und 3 Bücher — gemessen an
// `ch01.level.json`, nicht behauptet. Zwei der fünf Zahlen waren also schon
// falsch, bevor irgendjemand etwas geändert hatte, und ein blinder Kritiker
// beurteilte eine Punkte-Seite, die es im Spiel nie gab.
//
// Getippte Zahlen sind nicht bloß „gerade falsch", sie sind eine DRIFT-KLASSE:
// I2 setzt in dieser Welle die Regel-Seiten auf 5 und löscht die drei Bücher,
// und danach wären auch die heute noch richtigen Zahlen falsch. Deshalb werden
// alle fünf Paare aus dem geladenen Level ABGELEITET.
//
// Die Semantik ist nicht neu erfunden, sondern die des ausgelieferten Spiels
// (`PaintGame.tsx`, Bilanz-Aufbau): kidsTotal = Käfige, die eine `classmate`
// tragen · freedTotal = ALLE Käfige · tipsTotal = die Kapitel-Angabe, sonst die
// gesetzten Regel-Seiten · lettersTotal = die `*` in den Zeilen der Phasen und
// der Arena (die Kleckskammer bleibt draußen, sie hat ihre eigene Karte) ·
// booksTotal = alle Bücher.
//
// Warum eine ZWEITSCHRIFT und kein Import: der Zähler des Spiels
// (`chapterRoleCount`) ist modul-privat und gehört in dieser Welle einer
// anderen Lane — ihn zu exportieren wäre eine fremde Datei anzufassen. Die
// Doppelung ist bewusst und wird von `bench-fixture.test.ts` gegen das
// Kapitel gehalten, so dass sie nicht auseinanderlaufen kann.
import type { PaintLevel, PhaseSpec } from "../level.ts";

/** Die Zahlen, die die Punkte-Seite und die Zeremonien-Karten zeigen. */
export interface BenchBilanz {
  kids: number; kidsTotal: number;
  freed: number; freedTotal: number;
  tips: number; tipsTotal: number;
  letters: number; lettersTotal: number;
  books: number; booksTotal: number;
}

/** Die Räume, die das Kind im Kapitel spielt: die Phasen plus die Arena.
 *  Die Bonusräume bleiben draußen — genau wie im Spiel. */
const chapterPhases = (level: PaintLevel): PhaseSpec[] =>
  [...level.phases, ...(level.arena ? [level.arena] : [])];

/** Wie viele Wesen einer Rolle das Kapitel hält. */
export const roleCount = (level: PaintLevel, role: string): number =>
  chapterPhases(level).reduce((n, p) => n + p.entities.filter((e) => e.role === role).length, 0);

/** Wie viele Käfige ein Klassenkind halten — im Spiel gezählt, nicht angenommen. */
export const classmateCount = (level: PaintLevel): number =>
  chapterPhases(level).reduce(
    (n, p) => n + p.entities.filter((e) => e.role === "cage" && e.params?.classmate !== undefined).length,
    0,
  );

/** Wie viele Sammelobjekte in den Zeilen des Kapitels stehen. */
export const letterCount = (level: PaintLevel): number =>
  chapterPhases(level).reduce((n, p) => n + p.rows.join("").split("*").length - 1, 0);

/** Die Regel-Seiten: die Angabe des Kapitels, sonst die tatsächlich gesetzten. */
export const tipCount = (level: PaintLevel): number => level.tipsTotal ?? roleCount(level, "tip");

/**
 * Die Bilanz-Attrappe der Bank, vollständig aus dem Level abgeleitet.
 *
 * Die FORTSCHRITTS-Werte sind ebenfalls abgeleitet, nicht getippt: die Bank
 * soll eine Seite MITTEN im Kapitel zeigen (ein Kind, das schon etwas hat und
 * noch etwas offen hat) — eine Seite, auf der alles voll ist, verrät nichts
 * über die Zeile „3 von 4". Deshalb: ein Klassenkind ist befreit, von allem
 * anderen fehlt genau eines. So kann kein Fortschritt je über seiner Summe
 * stehen, egal wie das Kapitel sich ändert.
 */
export const benchBilanz = (level: PaintLevel): BenchBilanz => {
  const kidsTotal = classmateCount(level);
  const freedTotal = roleCount(level, "cage");
  const tipsTotal = tipCount(level);
  const lettersTotal = letterCount(level);
  const booksTotal = roleCount(level, "book");
  /** einen offen lassen, aber nie unter null und nie unter den befreiten Kindern */
  const nearly = (total: number, floor = 0): number => Math.max(floor, total - 1);
  return {
    kids: kidsTotal, kidsTotal,
    freed: nearly(freedTotal, Math.min(kidsTotal, freedTotal)), freedTotal,
    tips: nearly(tipsTotal), tipsTotal,
    letters: nearly(lettersTotal), lettersTotal,
    books: nearly(booksTotal), booksTotal,
  };
};
