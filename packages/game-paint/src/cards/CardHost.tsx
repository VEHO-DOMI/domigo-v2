// CARD HOST (PB-T8 / Build-B-skins) — the glue between a v2 task and its
// painted skin. Owns the machine state + the wrong-attempt counter; on each
// dispatch it folds the action(s) over the current state, grades, and either
// RESOLVES (correct), escalates the hint + resets to a clean retry (wrong), or
// updates (pending). Mount fresh per task via a `key={task.id}` at the call site.
//
// PK-R3a · R3-8 added the two BEATS the mined choreography asks for (doc 42 §1):
// the verdict beat, and the chalk clock. Running the clock out is „Später",
// never a failure: no penalty, no redeem, the world simply resumes (the
// anti-softlock law, PB-T1). Under reduced motion the clock is not shown AND
// not run: an invisible countdown would be unfair.
//
// PK-R6 · C · OVERLAY 2.0 (doc 44 §3.1) changes two things here:
//
//  · THE CLOCK now comes from the POLICY (cards/timer.ts, doc 44 §2.9) instead
//    of from a hard-coded `use === "quickfire"`: quickfire and boss windows are
//    urgent, everything calm is untimed, and the class is read from the pool
//    that actually ASKED (`servedUse`) so a rescue answered out of the unbound
//    quickfire pool does not sprout a 45-second clock over a cage ceremony.
//
//  · THE RESOLUTION was three beats in the order doc 44 §3.1.7 sets (answer
//    flies home → the world's change is watched under a held world → the card
//    celebrates). N7B · KOKIS WALK, 02.09.: die drei Beats zusammen sind rund
//    zwei Sekunden, in denen die Welt steht — »nach den Aufgaben ist noch immer
//    ein delay mit dem Danke-Screen und danach ist man kurz in der freeze pose;
//    es sollte genauso seamless und instant sein wie bei den Regel-Seiten«.
//    Die richtige Antwort gibt die Welt deshalb SOFORT zurück. Der Jubel ist
//    nicht gestrichen, er ist umgezogen: Farbflut, der Jubel der Figur
//    (`cheerMs`, Wanduhr) und der Toast laufen in der LEBENDEN Welt weiter,
//    während das Kind schon losläuft. Was wegfällt, ist ausschliesslich das
//    Warten. ⚠ Das ändert doc 44 §3.1.7 — die Dokument-Seite zieht der
//    Architekt nach.
import React, { useState } from "react";
import type { GameTaskV2 } from "@domigo/content-schema";
import { MACHINES, type Grade } from "./machines.ts";
import { CardShell, type CardAlign } from "./CardShell.tsx";
import { QUICKFIRE_MS } from "./overlay-css.ts";
import { prefersReducedMotion } from "./motion.ts";
import { armedClockMs, clockMsFor } from "./timer.ts";
import { answerTextOf } from "./resolution.ts";
import {
  ChoiceCard, TypedCard, SpellCard, OrderCard, OddCard, WheelCard, MistakeCard, MemoryCard,
  RestoreCard, type Dispatch,
} from "./skins.tsx";
import type {
  ChoiceState, ChoiceAction, TypedState, TypedAction, SpellState, SpellAction,
  OrderState, OrderAction, OddState, OddAction, WheelState, WheelAction,
  MistakeState, MistakeAction, MemoryState, MemoryAction, RestoreState, RestoreAction,
} from "./machines.ts";

/**
 * PK-R6 · H1 · WHAT THE CHILD ACTUALLY WROTE (round-1 critique, finding 1).
 *
 * `answerTextOf` reads the answer KEY, which is the right thing for the letter
 * flight (the letters that come home are the word the book was missing). It is
 * the wrong thing for a world change that displays the answer: the ch01 finale
 * accepts „hello", „hi" and their „!" forms, and the console beat then promises
 * „Jetzt steht DEIN Wort da". A child who typed „hi" and watched „hello" appear
 * would be reading a card that lies about them.
 *
 * So: if the machine kept the child's own text (the typed and spell cards both
 * hold it in `value`), that is what comes back. Every other kind has no text the
 * child authored — a choice is a pick, an order is an arrangement — and falls
 * back to the key, which for those kinds IS what the child chose.
 */
export function writtenTextOf(state: unknown, task: GameTaskV2): string {
  const v = (state as { value?: unknown } | null)?.value;
  return typeof v === "string" && v.trim() !== "" ? v.trim() : answerTextOf(task);
}

export function CardHost({
  task, onResolve, onWorldChange, onDismiss, onGrade, align = "center", art, portraitWash, captive, captiveIsPerson, servedUse, clockMs: clockMsProp, round,
}: {
  task: GameTaskV2;
  /** the card is finished: close it (and hand on any beat it opened) */
  onResolve: () => void;
  /** the answer is home — CHANGE THE WORLD now, while the card is out of the
   *  way. Optional: a caller that has no world (a test, a story card) simply
   *  gets the change folded into onResolve as before.
   *
   *  PK-R6 · H1: it is handed WHAT THE CHILD WROTE (see `writtenTextOf`), so a
   *  world change that puts the answer on screen can put the child's own words
   *  there rather than the answer key's. */
  onWorldChange?: (written: string) => void;
  onDismiss: () => void;
  /** R5-W6b · D4 · D-371 — DAS URTEIL, NACH OBEN GEMELDET.
   *
   *  Die Bewertung liegt hier drin (die Maschine gradet, die Hülle sieht nur das
   *  Ergebnis), und deshalb war der weiche Ton auf eine falsche Antwort der
   *  einzige gemasterte Klang ohne Auslöser: die Hülle erfuhr nie, dass daneben
   *  gegriffen wurde. Genau EIN Rückkanal, mit dem Vokabular der Maschine — die
   *  Karte meldet ihr Urteil, nie einen Klangnamen. Was daraus wird, entscheidet
   *  `audio/director.ts#CARD_GRADE_STEMS`.
   *
   *  Optional: eine Bank, ein Test, eine Story-Karte hat keinen Direktor. */
  onGrade?: (grade: Exclude<Grade, "pending">) => void;
  /** which side of the canvas to sit on (PB-F1/F2-20) */
  align?: CardAlign;
  /** the level's only-present art map (stem → url) for the portrait slot */
  art?: Record<string, string>;
  /** how drained the asker is right now — the portrait matches the world */
  portraitWash?: number;
  /** R5-W4 · D3 · F-14 · the art stem of whoever is inside the cage this card is
   *  about, so the picture shows what is in there (R54). Undefined for every
   *  card that is not about a cage. */
  captive?: string;
  /** L0 · D7 — siehe CardShell: Ding-Schlüssel oder Kindername. */
  captiveIsPerson?: boolean;
  /** the pool the WORLD asked for, which is not always the card's authored
   *  `use` (the unbound-quickfire fallback). The fallback when no shell decided
   *  a length — a bench, a story card, a test. */
  servedUse?: string;
  /** R5-W2 · H1 · wie lang das Fenster dieser Karte ist, in ms; 0 = keine Uhr.
   *  Der Shell rechnet es in `openCard`, wo Pool, Wesen und Level zugleich
   *  bekannt sind — die Stufe (E 6 s · M 5 s · S 4 s) hängt am WESEN, und die
   *  Karte kennt ihr Wesen nicht. */
  clockMs?: number;
  /** PK-R6 · D: „Runde n/6" when this card is one beat of a reawakening
   *  (doc 44 §3.3) — a ceremony a child can see the end of. */
  round?: { n: number; of: number };
}): React.ReactElement {
  const m = MACHINES[task.kind];
  const [state, setState] = useState<unknown>(() => m.init(task));
  const [attempts, setAttempts] = useState(0);
  /** the card may only end ONCE — a late timer must not fire after an answer,
   *  and a second tap during the resolution must not resolve twice */
  const endedRef = React.useRef(false);
  const cbRef = React.useRef({ onResolve, onDismiss, onWorldChange, onGrade });
  cbRef.current = { onResolve, onDismiss, onWorldChange, onGrade };
  // doc 44 §2.9 · the timer policy, from the one map every reader shares. The
  // shell decides the LENGTH (it knows which being is asking, and the tier lives
  // on the being); the fallback keeps a bench or a test honest.
  const clockMs = clockMsProp ?? clockMsFor(servedUse ?? task.use, task.kind, prefersReducedMotion(), QUICKFIRE_MS);

  // ── R5-W2 · H1 · DIE STEH-UHR (Kokis Ruling, 14.08.2026) ──────────────────
  // „Der Kreide-Ring wird voll und STILL gezeichnet, solange das Kind liest; er
  // startet beim ERSTEN Antippen der Karte und beginnt bei JEDEM weiteren
  // Tippen von vorn. Lesen ist gratis, nur Zögern mitten in der Antwort kostet."
  //
  // Deshalb ist die Zahl oben das Budget EINES ZUGES, nicht das der ganzen
  // Karte — und genau das macht sechs Sekunden überhaupt erst tragbar: die
  // Memory-Karte des Bosses braucht acht Aufdecker bei perfektem Gedächtnis und
  // wäre unter einer Karten-Uhr per Konstruktion unlösbar.
  //
  // ⚠ Gezählt wird ROHE EINGABE, niemals `dispatch`. Das Kreide-Rad ist ein
  // Scroll-Wähler, der erst nach 180 ms Stillstand meldet (skins.tsx) — ein Kind,
  // das sieben Sekunden am Rad sucht, löst NICHTS aus und würde mitten in der
  // eigenen Antwort abgeschnitten.
  const [armCount, setArmCount] = React.useState(0);
  const onActivity = React.useCallback(() => {
    if (endedRef.current) return;
    setArmCount((n) => n + 1);
  }, []);

  const runMs = armedClockMs(clockMs, armCount);
  React.useEffect(() => {
    if (runMs === 0) return; // ungestartet = voll und still
    const t = window.setTimeout(() => {
      if (endedRef.current) return;
      endedRef.current = true;
      cbRef.current.onDismiss(); // the swarm gives up: no reward, no penalty
    }, runMs);
    return () => window.clearTimeout(t);
  }, [runMs, armCount]);

  const dispatch: Dispatch<unknown> = (a) => {
    if (endedRef.current) return;
    const actions = Array.isArray(a) ? a : [a];
    let next = state;
    for (const act of actions) next = m.act(next, act);
    const g = m.grade(next);
    if (g === "correct") {
      endedRef.current = true;
      // ── N7B · DIE RICHTIGE ANTWORT GIBT DIE WELT SOFORT ZURÜCK ─────────────
      // Die Welt ändert sich und die Karte geht — in DERSELBEN Runde, ohne eine
      // einzige Uhr dazwischen. Das war bisher nur der Weg für »reduzierte
      // Bewegung« („a beat you cannot see may not be waited on"); seit Kokis
      // Walk ist es der Weg für alle: ein Beat, den man nicht spielen kann, ist
      // dasselbe Warten, ob man ihn sieht oder nicht.
      const written = writtenTextOf(next, task);
      cbRef.current.onWorldChange?.(written);
      cbRef.current.onResolve();
      return;
    }
    if (g === "wrong") {
      // R5-W6b · D4 · D-371 · BLUEPRINT :371 — der weiche neutrale Thud, und zwar
      // GENAU hier: eine Stelle tiefer (im Zurücksetzen) käme er auch beim
      // Neuaufbau der Karte, eine Stelle höher bei jedem `pending`.
      cbRef.current.onGrade?.("wrong");
      setAttempts((x) => x + 1); setState(m.init(task)); return;
    }
    setState(next);
  };

  const dismiss = (): void => {
    if (endedRef.current) return;
    endedRef.current = true;
    cbRef.current.onDismiss();
  };

  // R5-W1 · D1: the shell ranks the card's lines (glance.ts), and on a two-step
  // card WHICH line is the ask changes with the step — so the step and its own
  // question travel from the machine state, which is held here, to the shell.
  const step = (state as { step?: string } | null)?.step;
  const colourAskDe = task.kind === "restore" && step === "colour"
    ? (state as { colourAskDe?: string }).colourAskDe
    : undefined;

  return (
    <CardShell
      task={task}
      attempts={attempts}
      onDismiss={dismiss}
      align={align}
      clockMs={clockMs}
      armCount={armCount}
      onActivity={onActivity}
      art={art}
      portraitWash={portraitWash}
      captive={captive}
      captiveIsPerson={captiveIsPerson}
      round={round}
      colourAskDe={colourAskDe}
      actStep={step}
    >
      <Skin task={task} state={state} dispatch={dispatch} />
    </CardShell>
  );
}

function Skin({ task, state, dispatch }: { task: GameTaskV2; state: unknown; dispatch: Dispatch<unknown> }): React.ReactElement {
  const d = dispatch as Dispatch<never>;
  switch (task.kind) {
    case "choice": return <ChoiceCard state={state as ChoiceState} dispatch={d as Dispatch<ChoiceAction>} />;
    case "typed": return <TypedCard state={state as TypedState} dispatch={d as Dispatch<TypedAction>} />;
    case "spell": return <SpellCard state={state as SpellState} dispatch={d as Dispatch<SpellAction>} />;
    case "order": return <OrderCard state={state as OrderState} dispatch={d as Dispatch<OrderAction>} />;
    case "oddone": return <OddCard state={state as OddState} dispatch={d as Dispatch<OddAction>} />;
    case "wheel": return <WheelCard state={state as WheelState} dispatch={d as Dispatch<WheelAction>} />;
    case "mistake": return <MistakeCard state={state as MistakeState} dispatch={d as Dispatch<MistakeAction>} />;
    case "memory": return <MemoryCard state={state as MemoryState} dispatch={d as Dispatch<MemoryAction>} />;
    case "restore": return <RestoreCard state={state as RestoreState} dispatch={d as Dispatch<RestoreAction>} />;
  }
}
