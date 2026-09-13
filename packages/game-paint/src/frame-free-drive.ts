// ── L0e · DER FRAME-FREIE TREIBER (Werkstatt-Kritik R1b, K-1b.1, Weg c) ──────
//
// WARUM ES DIESE DATEI GIBT. Im versteckten Browser-Pane einer Sitzung gibt es
// keine Bildschirm-Frames (kein requestAnimationFrame) und gedrosselte
// Zeitgeber. Der Kampf-Treiber (`fight-drive.ts`) wartet zwischen den Takten
// mit `setTimeout` und auf eine Karte mit der Wanduhr — dort hing er (gemessen
// 06.09.). Und selbst wer die Takte selbst drückte, sah keine Karte aufgehen:
// die Hülle hebt eine Karte hinter `later(...)` (`PaintGame.tsx`), also hinter
// einem echten Zeitgeber, der im verborgenen Tab nicht feuert.
//
// DAS GESETZ DIESER DATEI. Keine Uhr, kein Zeitgeber, kein Frame: der Treiber
// bekommt einen GANZEN Bildschritt auf eigener Uhr (`frame`), die Möglichkeit,
// die aufgeschobenen Aufrufe der Hülle SOFORT auszuführen (`flushTimers`), und
// eine Pause, die der Aufrufer liefert (`settle` — im Browser ein
// MessageChannel-Tick, damit React die Karte zeichnen kann; im Test nichts).
// `frame-free-drive.test.ts` hält das als Quelltext-Wächter fest.
//
// WAS ER NICHT BEWEIST. Aufgeschobene Aufrufe laufen hier OHNE ihre Wartezeit.
// Eine Zeremonie, die im Spiel 2 s steht, steht hier null Takte — genau wie im
// kopflosen Simulator, der jede Karte im selben Takt beantwortet, in dem sie
// aufgeht (das Band ist so entstanden). Ein Bild aus diesem Treiber zeigt also
// den Zustand der Welt, nicht das Tempo eines Kindes.
//
// DIE GRENZE, dieselbe wie beim Kampf-Treiber: nur die Griffe des Kindes
// (Steuerkreuz, Takt, »liegt eine Karte oben?«, »richtig beantwortet«, Lesen).

import { decodePads, maskToPad } from "./tape.ts";
import type { Pad } from "./player.ts";

export interface FrameFreeReading {
  /** der Takt der Szene */
  tick: number;
  /** hält der Sim die Welt an (`sim.overlayOpen`)? */
  overlay: boolean;
  /** hält sich das Kind an einer Kante fest (`pose === "hang"`)? */
  griff?: boolean;
}

export interface FrameFreeSurfaces {
  /** das Steuerkreuz */
  press: (p: Partial<Pad>) => void;
  /** EIN ganzer Bildschritt (Rechnen UND Zeichnen) auf der eigenen Uhr des
   *  Treibers — im Browser `game.step(uhr, 1000 / 60)`, nie die Wanduhr */
  frame: () => void;
  /** führt jeden aufgeschobenen Aufruf der Hülle JETZT aus; gibt zurück, wie
   *  viele es waren (0 = nichts mehr offen) */
  flushTimers: () => number;
  /** liegt eine Karte auf dem Schirm (Buchhaltung der Hülle)? */
  cardOpen: () => boolean;
  /** die Karte beantworten, wie die Hülle es bei einer richtigen Antwort tut */
  solveCard: () => boolean;
  /** der Lesestand */
  read: () => FrameFreeReading | null;
  /** eine Runde für den Zeichner der Hülle — KEIN Zeitgeber (Browser:
   *  MessageChannel; Test: sofort) */
  settle: () => Promise<void>;
  /** die eigene Uhr der Welt anhalten / wieder anlaufen lassen */
  freeze?: () => void;
  thaw?: () => void;
}

export type FrameFreeStopReason =
  /** das Band ist zu Ende */
  | "band-ende"
  /** die bestellte Takt-Zahl ist aufgebraucht */
  | "takte-auf"
  /** das Kind hat eine Kante gegriffen (nur mit `haltAmGriff`) */
  | "griff"
  /** der Sim hält an, keine Karte liegt oben, und kein aufgeschobener Aufruf
   *  ist mehr offen — ohne Uhr kann hier nichts mehr kommen */
  | "stillstand";

export interface FrameFreeStop {
  reason: FrameFreeStopReason;
  /** Takte, die der Treiber insgesamt gespielt hat */
  played: number;
  /** Karten, die dieser Abschnitt beantwortet hat */
  cards: number;
  /** aufgeschobene Aufrufe, die dieser Abschnitt ohne Wartezeit ausgeführt hat */
  flushed: number;
  /** der Takt der Szene beim Halt */
  tick: number;
  done: boolean;
}

export interface FrameFreeOptions {
  /** höchstens so viele Takte in diesem Abschnitt */
  maxTicks?: number;
  /** am ersten Takt anhalten, in dem das Kind eine Kante greift */
  haltAmGriff?: boolean;
}

export interface FrameFreeDriver {
  load: (pads: ReadonlyArray<readonly [number, number]>) => number;
  drive: (opts?: FrameFreeOptions) => Promise<FrameFreeStop>;
  release: () => void;
}

/** Wie oft der Treiber zwischen zwei Takten höchstens aufräumt (Karte lösen,
 *  aufgeschobene Aufrufe ausführen), bevor er es als Stillstand MELDET. Eine
 *  Kette aus Karte → Zeremonie → nächster Karte ist kurz; eine, die nicht
 *  endet, ist ein Fehler, den der Treiber nennen muss, statt zu hängen. */
export const SETTLE_ROUND_CAP = 64;

export const createFrameFreeDriver = (s: FrameFreeSurfaces): FrameFreeDriver => {
  let masks: number[] = [];
  let cursor = 0;
  let played = 0;

  return {
    load: (pads) => {
      masks = decodePads(pads);
      cursor = 0;
      played = 0;
      return masks.length;
    },
    release: () => { s.thaw?.(); },
    drive: async (opts = {}) => {
      s.freeze?.();
      const maxTicks = opts.maxTicks ?? Number.POSITIVE_INFINITY;
      let cards = 0;
      let flushed = 0;
      let spent = 0;
      let griffVorher = s.read()?.griff === true;
      const stop = (reason: FrameFreeStopReason, done: boolean): FrameFreeStop => {
        if (done || reason === "stillstand") s.thaw?.();
        return { reason, played, cards, flushed, done, tick: s.read()?.tick ?? -1 };
      };

      while (spent < maxTicks) {
        // 1 · AUFRÄUMEN, bis nichts mehr offen ist: aufgeschobene Aufrufe
        //     ausführen, dem Zeichner eine Runde geben, eine Karte lösen.
        for (let runde = 0; ; runde++) {
          if (runde >= SETTLE_ROUND_CAP) return stop("stillstand", false);
          const liefen = s.flushTimers();
          flushed += liefen;
          await s.settle();
          if (s.cardOpen()) {
            s.solveCard();
            cards++;
            await s.settle();
            continue;
          }
          if (liefen > 0) continue;
          break;
        }
        // 2 · Der Sim hält an, und es kommt nichts mehr: ohne Uhr ist das das Ende.
        if (s.read()?.overlay === true) return stop("stillstand", false);
        // 3 · Ein Takt aus dem Band.
        if (cursor >= masks.length) return stop("band-ende", true);
        s.press(maskToPad(masks[cursor] ?? 0));
        s.frame();
        cursor++;
        played++;
        spent++;
        const griffJetzt = s.read()?.griff === true;
        if (opts.haltAmGriff === true && griffJetzt && !griffVorher) return stop("griff", cursor >= masks.length);
        griffVorher = griffJetzt;
      }
      return stop("takte-auf", cursor >= masks.length);
    },
  };
};
