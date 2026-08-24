// ── R5-W8 · S4 · R209d · DER KAMPF-TREIBER ───────────────────────────────────
//
// WARUM ES DIESE DATEI GIBT. Die Tafel trägt drei Kritzel-Schichten, und H5 hat
// dafür eine Lebensanzeige gebaut (R193b): ein Kästchen je Schicht. Der Chip
// zählt richtig — aber **kein Prüfer hat die Leiste je fallen sehen**. H5s drei
// Anläufe, den Kampf maschinell bis zum Wischen zu fahren, stehen mit ihren
// Takt-Zahlen in REPORT_H5 §5 (D-558); beide blinden Leser urteilten deshalb
// über einen Standbild-Zustand »3 von 3« und sagten Nein (D-551). Kokis Ruling
// R209(d) ordnet daraus die Reihenfolge: **erst der Treiber, dann die Form.**
//
// DAS GESETZ DIESER DATEI — und der Grund, warum sie so klein ist. Ein Treiber,
// der `hp` setzt, beweist gar nichts: er zeigt eine Zahl, die kein Kind je so
// erreicht. Dieser Treiber bekommt deshalb AUSSCHLIESSLICH die Oberflächen, die
// auch das Kind hat (Steuerkreuz, ein Takt, »liegt eine Karte oben?«, »Karte
// richtig beantwortet«, und die Lese-Naht der Szene). Er kennt die Welt nicht,
// hält keine Entität in der Hand und kann die Schichtzahl gar nicht erreichen —
// **das erzwingt die Signatur, nicht ein Vorsatz.** `fight-drive.test.ts` hält
// diese Grenze zusätzlich als Quelltext-Wächter fest (mit Tamper-Beweis).
//
// WAS ER SPIELT. Keine erfundene Eingabe, sondern das AUFGEZEICHNETE Band der
// Arena (`ch01.proof.json`, Phase `p4`) — dieselben Tastendrücke, die im Repo
// schon beweisen, dass die Fläche spielbar ist. Kopflos gefahren fallen damit
// die Schichten bei den Takten 777 · 1511 · 3173 auf 2 → 1 → 0 (gemessen,
// S4, 2026-08-22). Das Band liegt NICHT hier: der Aufrufer reicht es herein
// (`load`), damit Prüf-Inhalte nicht in das Bündel des Kindes wandern.
//
// ⚠ DIE FALLE, DIE H5 GEKOSTET HAT — und warum `advance` await-bar ist.
// Der Shell hebt die Boss-Karte NICHT im selben Takt: eine Karte, die nach
// geschriebenem Material fragt, wartet auf den Schreib-Beat (`writeEvidence`,
// dann `later(...)` = ein echter `setTimeout`). Wer die Takte in EINER
// synchronen Schleife durchdreht, lässt diesen Zeitgeber nie feuern — die Welt
// steht dann mit `overlay === true` und OHNE Karte, für immer. Genau dieses
// Bild hat H5 gemessen (Tafel ab Takt 1378 im Zustand `window`, dort noch bei
// 2578, keine Karte auf dem Schirm). Deshalb gibt dieser Treiber zwischen den
// Takten die Schleife frei und WARTET, wenn der Shell eine Karte schuldet —
// und wenn sie ausbleibt, meldet er einen benannten Stillstand statt zu hängen.

import { decodePads, maskToPad } from "./tape.ts";
import type { Pad } from "./player.ts";

/** Was die Szene diesem Treiber über den Kampf sagt — ein Ausschnitt aus
 *  `PaintScene#getState`, nichts Eigenes. */
export interface FightReading {
  /** der Takt der Szene (nicht der des Treibers) */
  tick: number;
  /** Schichten, die noch auf der Tafel stehen */
  knots: number;
  /** mit wie vielen sie angetreten ist (0, solange keine Tafel im Raum ist) */
  knotsTotal: number;
  /** Fortschritt des LAUFENDEN Wischens, 0…1 */
  wipeTeil: number;
  /** hält der Sim die Welt gerade an? (`sim.overlayOpen`) */
  overlay: boolean;
  /** die Tafel: ihr Zustand und ihre Lage in Bildpunkten — oder `null`, wo
   *  keine im Raum ist. Der Treiber braucht beides für den einen Augenblick,
   *  den ein aufgezeichnetes Band nicht zuverlässig trifft (siehe unten). */
  guardian: { state: string; x: number; y: number } | null;
  /** das Kind, in denselben Bildpunkten */
  hero: { x: number; y: number };
}

/**
 * Die fünf Griffe des KINDES. Mehr bekommt der Treiber nicht — und mehr braucht
 * er nicht. Alle fünf gibt es im Prüf-Handle schon; diese Datei erfindet keine.
 */
export interface FightSurfaces {
  /** das Steuerkreuz */
  press: (p: Partial<Pad>) => void;
  /** genau EIN Takt der Maschine */
  step: (ms?: number) => void;
  /** liegt gerade eine Karte auf dem Schirm? (die Buchhaltung des Shells, nicht
   *  die Anhalte-Fahne des Sims — die beiden sind verschieden, und die
   *  Verwechslung ist ein bezahlter Fehler: `state().overlay === true` bei
   *  `beat().overlay === null` IST der Stillstand, den wir suchen) */
  cardOpen: () => boolean;
  /** die Karte beantworten, wie der Shell es tut, wenn das Kind richtig liegt */
  solveCard: () => boolean;
  /** die Lese-Naht der Szene */
  read: () => FightReading | null;
  /**
   * Die EIGENE Uhr der Welt anhalten — optional, aber im Browser
   * unverzichtbar.
   *
   * ⚠ DIE FALLE, DIE DAS GEKOSTET HAT (gemessen, S4, 2026-08-22): im laufenden
   * Spiel taktet die Bildschirm-Schleife WEITER, während der Treiber taktet.
   * Ein Band von 627 gespielten Takten stand dann bei Szenen-Takt 782 — 155
   * Takte, die nie auf dem Band standen. Die Tafel fliegt in dieser Zeit
   * woanders hin als aufgezeichnet, die Reichweite zum Wischen wird verfehlt,
   * und derselbe Lauf endet zweimal verschieden (einmal bei Schicht 1 mit
   * Stillstand, einmal am Bandende, ebenfalls bei Schicht 1). **Ein Band ist
   * nur dann eine Aufzeichnung, wenn es die EINZIGE Taktquelle ist.**
   */
  freeze?: () => void;
  /** …und sie wieder anlaufen lassen, wenn der Lauf zu Ende ist. */
  thaw?: () => void;
}

/** Warum ein Abschnitt zu Ende ist. */
export type FightStopReason =
  /** eine Schicht ist WEG — der Augenblick, für den es diesen Treiber gibt */
  | "wisch"
  /** die Tafel ist sauber (0 Schichten) */
  | "sauber"
  /** das Band ist zu Ende */
  | "band-ende"
  /** die bestellte Takt-Zahl ist aufgebraucht */
  | "takte-auf"
  /** der Shell schuldet eine Karte und liefert sie nicht — H5s Bild */
  | "stillstand"
  /** sie liegt zum Wischen bereit, und das Kind kommt nicht hin */
  | "nicht-erreicht";

export interface FightStop {
  reason: FightStopReason;
  /** Takte, die der Treiber insgesamt gespielt hat */
  played: number;
  /** der Takt der Szene beim Halt */
  tick: number;
  knots: number;
  knotsTotal: number;
  /** die Schichtzahlen, die dieser Abschnitt hat fallen sehen */
  wipes: number[];
  /** Karten, die dieser Abschnitt beantwortet hat */
  cards: number;
  /** ist nichts mehr zu fahren? */
  done: boolean;
  /**
   * ★ T5 · D-702 · WIE LANGE DIESER ABSCHNITT AM STÜCK AUF EINE GESCHULDETE
   * KARTE GEWARTET HAT — die LÄNGSTE einzelne Wartezeit in Wanduhr-
   * Millisekunden, nicht ihre Summe.
   *
   * WARUM DIESE ZAHL AM BERICHT HÄNGT. `stillstand` ist die einzige Antwort
   * dieses Treibers, die von der WANDUHR abhängt und nicht vom Band: er wartet
   * `CARD_PATIENCE_MS` und gibt dann auf. Auf einer belasteten Maschine (oder
   * in einem verborgenen Tab, wo Chrome die Zeitgeber drosselt) kann dieselbe
   * gesunde Welt deshalb einen Stillstand melden — und ein Bericht liest das
   * als Aussage über das SPIEL. Genau so ist D-700 entstanden: zwei
   * Kontrollläufe meldeten Stillstand, und daraus wurde die Prämisse »der
   * Stand selbst ist kaputt«. Sie war falsch (T5 fährt denselben Befehl auf
   * demselben main 2/2 bis 0/3 durch).
   *
   * Also trägt jeder Halt ab jetzt seine eigene Wartezahl. Ein Stillstand
   * ohne `waitedMs`/`patienceMs` ist eine Behauptung; mit ihnen ist er eine
   * Messung, die man gegen die Maschine halten kann.
   */
  waitedMs: number;
  /** das Budget, gegen das gewartet wurde (`CARD_PATIENCE_MS`) — damit ein
   *  Bericht die Zahl nicht aus dem Quelltext abschreiben muss. */
  patienceMs: number;
}

export interface FightDriver {
  /** ein aufgezeichnetes Band laden (die lauflängenkodierten `pads` eines
   *  Proof-Bandes); gibt die Zahl der Takte zurück, die darin stehen */
  load: (pads: ReadonlyArray<readonly [number, number]>) => number;
  /** bis zum nächsten Wisch fahren — oder bis `maxTicks` verbraucht sind.
   *  Hält BEI einem Wisch an, damit ein stehender Augenblick fotografiert
   *  werden kann. */
  advance: (maxTicks?: number) => Promise<FightStop>;
  /** der Lesestand, ohne einen Takt zu fahren */
  read: () => FightReading | null;
  /** die eigene Uhr der Welt wieder anlaufen lassen — für einen Aufrufer, der
   *  mitten im Band aufhört und das Spiel einem Menschen zurückgibt. */
  release: () => void;
}

/**
 * Wie lange der Treiber auf eine geschuldete Karte wartet, bevor er den
 * Stillstand MELDET. 4 Sekunden Wanduhr: der längste Schreib-Beat des Kapitels
 * liegt weit darunter, und ein Treiber, der ewig wartet, ist von einem, der
 * hängt, nicht zu unterscheiden.
 */
export const CARD_PATIENCE_MS = 4000;

/**
 * Wie viele Takte der Treiber höchstens am Stück auf die liegende Tafel zugeht,
 * bevor er aufgibt und es SAGT. Die Maschine löst diesen Zustand von selbst auf
 * (`wipeWaitTicksFor` schickt sie nach der Wartezeit in `untie`), also ist das
 * keine Frist, die im gesunden Fall je greift — sondern die Versicherung dagegen,
 * dass eine spätere Änderung aus diesem Zweig eine Endlosschleife macht. Ein
 * Treiber, der hängt, ist von einem kaputten Spiel nicht zu unterscheiden.
 */
export const APPROACH_TICK_CAP = 600;

/** Eine Runde Makrotask — hier gibt der Treiber die Schleife frei, damit die
 *  Zeitgeber des Shells überhaupt feuern können (siehe Kopf). */
const yieldToTimers = (): Promise<void> => new Promise((r) => { setTimeout(r, 0); });

/**
 * Der Treiber. Rein und ohne Zustand ausserhalb seiner selbst — dieselbe
 * Funktion trägt den Browser-Lauf (`window.__domigoPaint.fight`) und den
 * kopflosen Test, weil beide dieselben fünf Griffe reichen können.
 */
export const createFightDriver = (s: FightSurfaces): FightDriver => {
  let masks: number[] = [];
  let cursor = 0;
  let played = 0;
  /** die längste Wartezeit dieses Abschnitts — siehe `FightStop.waitedMs`. */
  let laengsteWarteMs = 0;

  const stop = (reason: FightStopReason, wipes: number[], cards: number, done: boolean): FightStop => {
    // Am Ende bekommt die Welt ihre eigene Uhr zurück; zwischen zwei
    // Abschnitten bleibt sie ABSICHTLICH stehen — genau dafür hält der Treiber
    // bei jedem Wisch an (ein stehender Augenblick lässt sich fotografieren).
    if (done || reason === "stillstand") s.thaw?.();
    const r = s.read();
    return {
      reason, played, wipes, cards, done,
      waitedMs: laengsteWarteMs,
      patienceMs: CARD_PATIENCE_MS,
      tick: r?.tick ?? -1,
      knots: r?.knots ?? -1,
      knotsTotal: r?.knotsTotal ?? -1,
    };
  };

  return {
    load: (pads) => {
      masks = decodePads(pads);
      cursor = 0;
      played = 0;
      return masks.length;
    },
    read: () => s.read(),
    release: () => { s.thaw?.(); },
    advance: async (maxTicks = Number.POSITIVE_INFINITY) => {
      // Ab hier ist DAS BAND die einzige Taktquelle — siehe `freeze`.
      s.freeze?.();
      laengsteWarteMs = 0;
      const wipes: number[] = [];
      let cards = 0;
      let spent = 0;
      /** Takte am Stück im Zugeh-Zweig — siehe `APPROACH_TICK_CAP`. */
      let zugegangen = 0;
      let vorher = s.read()?.knots ?? -1;

      while (spent < maxTicks) {
        const r = s.read();
        // 1 · Liegt eine Karte oben? Dann wird sie beantwortet, nicht getaktet —
        //     eine offene Karte hält die ganze Welt an.
        if (r !== null && s.cardOpen()) {
          s.solveCard();
          cards++;
          await yieldToTimers();
          continue;
        }
        // 2 · Der Sim hält an, der Shell hat aber (noch) keine Karte: der
        //     Schreib-Beat läuft. WARTEN, nicht takten — und nach der Geduld
        //     den Stillstand beim Namen nennen.
        if (r !== null && r.overlay) {
          const seit = Date.now();
          const bis = seit + CARD_PATIENCE_MS;
          while (Date.now() < bis && !s.cardOpen()) await yieldToTimers();
          laengsteWarteMs = Math.max(laengsteWarteMs, Date.now() - seit);
          if (!s.cardOpen()) return stop("stillstand", wipes, cards, false);
          continue;
        }
        // 3 · SIE LIEGT UND WARTET AUFS WISCHEN — hier hört das Band auf zu
        //     gelten, und der Treiber schaut hin.
        //
        //     WARUM. Ein Band ist eine Folge von Tastendrücken, kein Plan. Im
        //     kopflosen Simulator trifft es die Reichweite zum Wischen genau,
        //     weil dort jede Karte im SELBEN Takt beantwortet wird, in dem sie
        //     aufgeht. Der echte Shell braucht dafür einen Beat (der Schreib-
        //     Takt der Tafel, dann die Karte), und schon ein paar Takte Versatz
        //     lassen dieselben Tastendrücke neben ihr landen: gemessen fiel im
        //     laufenden Spiel die erste Schicht bei Takt 852 statt 777, und die
        //     dritte fiel gar nicht. Also gilt in diesem einen Zustand nicht das
        //     Band, sondern das Ziel — mit demselben Steuerkreuz, das auch das
        //     Kind hat, und ohne einen einzigen Griff in die Welt.
        //
        //     `wipeable` ist genau der Zustand, in dem sie auf den Brettern
        //     liegt und die Berührung erwartet (entities.ts); dieselbe Antwort
        //     gibt `guardian-flight.test.ts` seit jeher, wenn es die Maschine
        //     über alle Knoten fährt.
        const g = r?.guardian ?? null;
        if (g !== null && g.state === "wipeable") {
          if (zugegangen >= APPROACH_TICK_CAP) return stop("nicht-erreicht", wipes, cards, false);
          const dx = g.x - (r?.hero.x ?? g.x);
          s.press(Math.abs(dx) < 2 ? {} : dx > 0 ? { right: true } : { left: true });
          s.step();
          zugegangen++;
          played++;
          spent++;
          await yieldToTimers();
        } else {
          zugegangen = 0;
          // 4 · Ein gewöhnlicher Takt aus dem Band.
          if (cursor >= masks.length) return stop("band-ende", wipes, cards, true);
          s.press(maskToPad(masks[cursor] ?? 0));
          s.step();
          cursor++;
          played++;
          spent++;
          await yieldToTimers();
        }

        const nach = s.read();
        if (nach !== null && vorher >= 0 && nach.knots < vorher) {
          wipes.push(nach.knots);
          vorher = nach.knots;
          if (nach.knots === 0) return stop("sauber", wipes, cards, true);
          return stop("wisch", wipes, cards, false);
        }
        if (nach !== null) vorher = nach.knots;
      }
      return stop("takte-auf", wipes, cards, cursor >= masks.length);
    },
  };
};
