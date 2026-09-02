// THE PAINTED BOOK — the paintLevel@1 format: pure parse + THE LEVEL LAWS.
// The app-side zod loader (apps/web/lib/paint-content.ts) guarantees the JSON
// SHAPE; this module owns the SEMANTICS and throws loud on any violation
// (loud beats tolerant — the keen-content law). checkLevelLaws() is the
// machine gate every shipped level passes in CI: structure, exit chains, and
// an ability-parameterized reachability sweep (a cage or letter no child can
// reach is a defect, not a secret).

import { MAX_LINE_DE, cloakErrorsDe, registerErrorsDe } from "@domigo/content-schema";
import { BEISPIEL_MUSTER, BEISPIEL_PAAR_TRENNER } from "./rule-text.ts";
import { type Grid, glyphAt, isOneWay, isSlope, isSolid } from "./collide.ts";
import { PAINT, SUBS, TILE } from "./paint.ts";
import { platformPathAt } from "./entities.ts";
// R5-W4 · B4 · R45: READ-ONLY, both of them. The law has to see the trail the
// way the renderer sees it, and the renderer gets the characters from exactly
// these two places — deriving them a second time here is how a law starts
// policing a world nobody is playing. Neither module imports anything, so
// there is no cycle to worry about.
import { compositionFor } from "./composition.ts";
import { letterGlyphs } from "./letters.ts";

export const LEVEL_SCHEMA = "paintLevel@1";

// Geometry + marker glyphs (doc 31 §5). Anything with params is an ENTITY.
const LEGAL_GLYPHS = new Set([".", "#", "=", "/", "\\", "1", "2", "3", "4", "~", "^", "w", "V", "s", "U", "o", "*", "S", "C", "X", "B", "z"]);

/** L0 · D4 · DIE EINE ROLLENLISTE.
 *
 *  Diese Liste stand bis zur Level-Welle ZWEIMAL: hier als Union-Typ und in
 *  `apps/web/lib/paint-content.ts` als zod-Enum, das der Loader parst. Beide
 *  Kopien mussten von Hand nachgezogen werden, und die zod-Seite trug die
 *  Narben: `drained`, `classmate` und `cloth` fehlten dort je einmal, und jede
 *  Lücke war ein 500 auf dem ausgelieferten Kapitel, kein Typfehler. Als
 *  `as const`-Liste ist sie IMPORTIERBAR — `paint-content.ts` baut sein Enum
 *  jetzt aus genau diesen Bytes (`z.enum(ENTITY_ROLES)`), und
 *  `entity-roles.test.ts` beweist die Gleichheit in beide Richtungen. */
export const ENTITY_ROLES = [
  "chaser", "gunner", "flyer", "bouncer", "crusher", "swarm",
  "platform.move", "platform.fall", "platform.swing",
  "cage", "powerup", "door.trigger", "guardian",
  // PK-R6 · C1 (doc 44 §4 ch01): a DRAINED classroom object — one of the things
  // OSWIN rained the colour out of, standing grey where it fell. It has no
  // brain and no menace: it waits, wearing an ↑ cue, until the child steps up
  // and says what it is. The two-step `restore` card then gives it back its
  // name and its colour and the world keeps that colour. This is the ch01
  // rebuild's field identity — restoration spread across the whole level
  // instead of six anonymous cages in one room.
  "drained",
  // PK-R6 · D (doc 44 §3.3): THE BEWITCHED CLASSMATE. The person inside the
  // chapter's one person-cage, standing in the world as a being of her own the
  // moment the cage opens. Opening the cage does not free her: she is ghost-pale
  // and acts out the unit's wrong classroom actions round by round, and the
  // child answers each with the command that stops or guides it (six rounds,
  // §3.3). She is the only role whose redemption is EARNED IN STAGES — every
  // other being is drained-or-restored, she is restored by degrees.
  "classmate",
  // PK-R3b · R3-16 (doc 41 §5): the two static-state collectibles. `tip` is a
  // Regel-Seite — a rule page OSWIN tore out of the book, which shows its
  // Merksatz when picked up; `book` is a Bonus-Buch, the no-death adaptation of
  // an extra life, worth points and nothing else. Both are doc 40 §3
  // static-state: no rig, no orbit, no brain — they sit and wait.
  "tip", "book",
  // R5-W5 · G4 (UNIFORM_SAMMELN_DESIGN §1): a piece of the school UNIFORM. The
  // nine words of the unit's „Cool clothes" page lie scattered through the
  // school house — flung apart in the fall into the book, not drained of their
  // colour, which is why they lie there in colour while the chapter's things are
  // grey. Same static-state class as `tip`/`book`: no rig, no brain, taken on
  // contact. It differs from both in what the taking MEANS — the English word
  // appears at the find, and every third piece in the ledger opens a naming
  // card. It is NOT the chapter's collectible: it feeds no trail, pays no door,
  // and carries its own counter (doc 44 §2.7 amendment).
  "cloth",
] as const;

export type EntityRole = (typeof ENTITY_ROLES)[number];

/** The pickups that are simply TAKEN on contact (no card, no fight). */
export const PICKUP_ROLES = new Set<EntityRole>(["tip", "book", "cloth"]);

/**
 * Per-entity tuning. Open by design — every role brings its own knobs — but the
 * fields THE LAWS read are typed here, so a misspelt `pricee` is a compile error
 * instead of a level that ships with a door nobody can pay.
 */
export interface EntityParams {
  /** door.trigger: which door this is — "exit" | "bonus" | "seal". */
  kind?: string;
  /** door.trigger: what the door COSTS in letters. PB-R1 · R3-2 — Klecks' price
   *  was hardcoded at 10 in three places while p2 carries 8 reachable letters,
   *  so the door could be read and never paid. The `door-price` law now proves
   *  every price against the letters the child can actually hold on arrival. */
  price?: number;
  /** powerup: the ability this grant hands over. */
  grants?: string;
  /** powerup: this grant is REQUIRED later in the chapter. PB-R1 · R3-3 — the
   *  phase exit LOCKS until it has been collected; there is no backtracking
   *  between phases, so a missed essential is a dead run. */
  essential?: boolean;
  /** powerup: WHAT is lying there, as the German noun phrase WITH its article —
   *  „die Faust", „das Buch". R5-W8 · S4 (P7 §12.7): the essential-pickup gate
   *  was the one of five that did not name its cause („Du hast noch etwas
   *  Wichtiges vergessen!"), so a child stuck at it learned only that something
   *  was missing. The line is built from THIS field for the same reason the
   *  cage ceremony is built from `captiveDe`: a shell that writes one noun for
   *  all fifteen chapters is the defect, not the fix.
   *
   *  RENDERED MID-SENTENCE, always — the article stays lower-case, exactly like
   *  `captiveDe`. Absent, the toast falls back to its old wording (declared in
   *  sim.ts): a gate that says „undefined liegt noch in diesem Raum" would be
   *  worse than the gate it replaces.
   *
   *  ⚠ ch01 carries NO `powerup` entity at all (D-487, measured again by S4 on
   *  2026-08-22 over all four surfaces), so nothing in the shipped chapter can
   *  reach this field today. The law is chapter-spanning; ch02 is where it
   *  first pays. */
  gabeDe?: string;
  /** cage: WHO is inside — the classmate's name. Its presence is what makes a
   *  cage the chapter's one person-cage (doc 44 §2.3's `captive:"classmate"` is
   *  this field; the shipped data has carried the name itself since ch01, and a
   *  name says strictly more than a type tag). Exactly one per chapter. */
  classmate?: string;
  /** cage: WHAT is inside, as the German noun phrase WITH its article — „die
   *  Musikanlage", „der Stuhl", or a person's name. R5-C1: the ceremony beats
   *  used to know only the cage's SHELL, and every chapter-1 shell is the same
   *  satchel — which is how one card came to say „Da steckt jemand fest" over a
   *  sound system and another called a freed chair a „Buchstaben-Wesen". One
   *  datum, both beats.
   *
   *  RENDERED MID-SENTENCE, always („Der Käfig springt auf — die Musikanlage ist
   *  frei!"). German capitalises the article at a sentence start and this string
   *  carries a lower-case one, so a frame that opens with it reads wrong. The
   *  frames own the sentence; this field only ever names the thing. */
  captiveDe?: string;
  /** cage: WELCHES Blatt der Insasse trägt — der Stamm ist `captive_<key>`
   *  (L0 · D7). Getippt, weil das Gesetz `cage-captive-key` ihn liest: die
   *  Datei-Konvention dieser Schnittstelle ist, dass jedes Feld, das ein Gesetz
   *  liest, hier steht, damit ein Tippfehler ein Compilerfehler wird und kein
   *  stumm fehlendes Bild. */
  captive?: string;
  /** classmate: WHICH cage this person was locked in (PK-R6 · D). The pointer
   *  runs from the person to the cage rather than the other way round because
   *  the sim asks it in that direction — a cage bursts and has to find who
   *  steps out of it — and because the `classmate-pair` law can then prove both
   *  ends from one field. */
  cage?: string;
  /** tip: which of the unit's grammar topics this Regel-Seite carries. Unique
   *  per chapter — two pages of the same rule are one page and a duplicate. */
  topicDe?: string;
  /** tip: THE NOTION — what actually happens in this rule, in kid words, before
   *  the rule is stated as a rule (R5-W4 · I2, Koki's replay of 2026-08-15:
   *  „wir wollen mehr Notions, Erklärungen, Beispiele — didaktisch reicher").
   *
   *  It is a different job from `merksatzDe` and the two must not collapse into
   *  one sentence twice: the Erklärung says WHAT HAPPENS („Zwei Wörter rücken
   *  zusammen und werden eins."), the Merksatz gives the RULE with the one
   *  phrase worth carrying home. Roomier than the Merksatz because it may take
   *  two short sentences; still short enough to be read in one go. */
  erklaerungDe?: string;
  /** tip: the rule itself, kid-worded. Rendered verbatim on the pickup card, so
   *  it is authored content and passes the same register + length laws every
   *  other line a six-year-old reads does (the `tip-honesty` law). */
  merksatzDe?: string;
  /** tip: the ONE phrase of the Merksatz the card sets in bold — the thing to
   *  remember if nothing else survives the walk home. It must be a substring of
   *  `merksatzDe` (the law proves it), because a key that paraphrases the rule
   *  is a second rule, and a page teaches one. */
  schluesselDe?: string;
  /** tip: THE EXAMPLES — 2–4 English lines that show the rule at work.
   *
   *  ★ THEY ARE OURS, NOT THE BOOK'S (Koki's ruling of 2026-08-15, K-1):
   *  „nicht die exakt selben sätze aus dem buch (wir schreiben immer unsere
   *  eigenen beispiele – die natürlich aber zum kontext und level passen)".
   *  That RETIRES I1's verbatim-quotation gate. It is not a loosening: every
   *  other piece of English in this game — task prompts, scene lines, the boss —
   *  has always been our own, grounded against the unit lexicon
   *  (scripts/check-story-grounding.mjs §A). The rule pages were the one
   *  exception, and this brings them home. It also closes a real hole: `isn't`
   *  has NO groundable sentence in Unit 1 (the only one the book prints is
   *  „Number 8 isn't correct.", which fails grounding because »number« and
   *  »correct« are not Unit-1 vocabulary), so a borrowed example could never
   *  show the third contraction the page's own title promises.
   *
   *  WHAT STILL BINDS THEM, all machine-proved:
   *    · GROUNDING — every token in the unit lexicon (check-paint-copy.mjs);
   *    · COVERAGE + RELEVANCE — against `lehrtEn`, below;
   *    · English-only and one card line long, here.
   *  An ARRAY rather than one string because a rule with one example is a rule
   *  demonstrated once, and the shipped pages proved that reads as an alibi. */
  beispieleEn?: string[];
  /** tip: WIE die Beispiele dieser Seite gelesen werden — die didaktische Form,
   *  nicht die Dekoration.
   *
   *  ★ R5-W9 · N1 · KOKIS BEFUND D-770 (31.08.): auf der Befehls-Seite standen
   *  „Sit down!" und „Don't sit down!" in derselben Farbe, derselben Größe,
   *  untereinander — zwei Zeilen, die das Gegenteil voneinander sagen, sahen
   *  identisch aus. Dieselbe Liste trug auf der Plural-Seite Paare („one book –
   *  two books") und auf der Zahlen-Seite Einzelsätze. Eine Karte kann das nur
   *  unterscheiden, wenn die SEITE sagt, welche Form ihre Beispiele haben.
   *
   *  Vier Formen, weil das Kapitel vier Arten von Regel hat:
   *    · `wandel`    — links die Ausgangsform, rechts die gelehrte Form
   *                    („I am here. – I'm here."); die Karte zeigt den Weg.
   *    · `gegensatz` — zwei Handlungen nebeneinander, BEIDE richtig, eine davon
   *                    verneint. ⚠ Nie als richtig/falsch gezeichnet: Koki hat
   *                    die durchgestrichene Falschform am 15.08. abgeschafft
   *                    („Wir wollen KEINE Fehler zeigen").
   *    · `dialog`    — Frage und Antwort („What's your name? – I'm Merle.").
   *    · `einzeln`   — ein vollständiger Satz je Zeile, ohne Gegenüber.
   *
   *  Es ist eine DEKLARATION, die das Gesetz unten gegen die Daten prüft: eine
   *  Seite, die `wandel` sagt und Einzelsätze liefert, wird rot, statt still
   *  als Liste zu rendern. Ohne diese Prüfung wäre das Feld eine Notiz statt
   *  eines Vertrags — und die Karte zeichnete eine Form, die es nicht gibt. */
  beispielMuster?: string;
  /** tip: THE FORMS THIS PAGE TEACHES — declared, so the examples can be judged
   *  against something other than their author's intention.
   *
   *  This is what replaces the retired quotation gate, and it is stricter than
   *  the quotation ever was, because it checks BOTH directions:
   *    · COVERAGE — every form named here appears in at least one example. That
   *      kills the exact defect I1's teacher-critic caught by hand: the card
   *      titled „I'm · it's · isn't" showed two of the three, and no gate could
   *      see it. A title is a promise, and this is the gate that keeps it.
   *    · RELEVANCE — every example carries at least one of these forms, so no
   *      grounded-but-off-topic sentence can pad the list.
   *  Matched case-insensitively as substrings: the forms are written as a child
   *  meets them („I'm", „Don't", „How are you"), not as regexes. */
  lehrtEn?: string[];
  /** tip: which page of the unit this rule lives on („MORE! 1 · Unit 1 · Seite
   *  14"). ★ DATA, NOT DISPLAY since R5-W4 · I2 — Koki: „Die Regel soll NICHT
   *  aufs Buch verweisen … wir restaurieren unser eigenes Buch." It stays in the
   *  file for the teacher's and the register's sake; no surface renders it. */
  belegDe?: string;
  // R5-W4 · I2 · WHAT USED TO STAND HERE AND WHY IT IS GONE (Koki, 2026-08-15,
  // reading the three shipped pages): `ausspracheDe` + `ankerEn` (the spoken
  // anchor, „Sprich I'm wie das i in time") — „das ‚how to pronounce' ist
  // unnötig"; `falscheFormEn` + `richtigeFormEn` (the struck-through trap) —
  // „Wir wollen KEINE Fehler zeigen, nur die richtigen Notions und Beispiele —
  // es sei denn, das Buch zeigt es selbst so." Both were J1-D's answer to a
  // teacher critique and both were built well; they are removed because the
  // card they made is denser than the child it is for, not because they failed.
  //
  // They are kept OUT by construction, not by memory: `tip-honesty` rejects any
  // params key it does not know, so re-adding one of these turns the gate red
  // instead of quietly reaching a card that no longer renders it.
  /** classmate: DIE ÄUSSERSTEN SPALTEN IHRES RAUMS, einschliesslich — die
   *  Antwort auf F5s Frage an den Architekten (R85, Kokis Sims-Lesung: „Merle
   *  wie Sims: 4 Kacheln").
   *
   *  Vorher kam ihr Auslauf allein aus `ROAM_MAX_CELLS`, einer Konstante für
   *  ALLE Befreiten. Das war kein Entwurf, sondern ein Vorgabewert: in einem
   *  Vier-Kachel-Sims fiel er nicht auf, in einer langen Halle hätte er sie
   *  sechs Kacheln weit geschickt, ohne dass jemand es entschieden hätte.
   *
   *  Diese zwei Zahlen ersetzen die Konstante FÜR DIESE ENTITY — sie werden
   *  aber weiterhin mit der Boden- und Gefahr-Sonde VERSCHNITTEN
   *  (`entities.roamZone`), nie an ihr vorbei. Ein Autor kann sie also enger
   *  stellen oder in einer tragenden Halle weiter laufen lassen; er kann sie
   *  nicht in die Tinte oder über eine Kante schreiben. Der Grund ist F5s
   *  eigener: ein befreites Kind, das von der Kante fällt, wäre kein Geschenk,
   *  sondern ein Bug mit Gesicht — und diese Zusage darf nicht davon abhängen,
   *  dass ein Level-Autor sie nachrechnet. */
  roamMinC?: number;
  roamMaxC?: number;
  /** spawned hidden, revealed by a link. */
  hidden?: boolean;
  [key: string]: unknown;
}

export interface EntitySpec {
  id: string;
  role: EntityRole;
  skin: string;
  c: number;
  r: number;
  tier: "E" | "M" | "S";
  params?: EntityParams;
}

export interface LinkSpec {
  trigger: string; // entity id
  on: "redeemed" | "opened" | "collected" | "pressed";
  action: "spawn" | "open" | "reveal";
  targets: string[];
}

export type Ability = "jump" | "punch" | "hang" | "swing" | "hover" | "run";

/** W0-F3 · A DECLARED INK RETURN — the one legal way to answer the trap-pocket
 *  law with "yes, the ink IS the way out". Names the exact standing cell of a
 *  pocket the child can reach DRY and leave only by stepping into ink on
 *  purpose (the „Tinten-Dunk = Krakel-Rückweg" reading the p3 swing and the p2
 *  bonus book already carry in prose). The law proves the claim in BOTH
 *  directions, so a declaration cannot outlive the pocket it excuses. */
export interface InkReturnSpec {
  c: number;
  r: number;
  /** Why the dive is the design — in the language the dossiers are written in. */
  whyDe: string;
}

export interface PhaseSpec {
  id: string;
  nameDe: string;
  surface: "normal" | "slippery";
  /** R5-W5 · B4b · WELCHE SEITE DER SCHWELLE TRÄGT DEN ANKER (Kokis Entscheid
   *  2026-08-17) — Pflicht in jeder Phase, die ein `C` im Gitter hat.
   *
   *  `"far"` ist Kokis Entscheid vom 11.08. (Anti 3/6 v2): erst queren, dann
   *  gebankt. `"near"` ist die Gegenseite: der Anker steht VOR der Tinte, ein
   *  Fehlsprung wird also billig wiederholt.
   *
   *  Warum die Wahl JE PHASE steht und nicht kapitelweit: sie hängt an der
   *  BREITE der Querung, und die ist gemessen sehr verschieden. Gemessen am
   *  ausgelieferten ch01 (Rückweg nach einem Platsch, in Spalten):
   *
   *    Phase │ Querung │ far: Fehlsprung / später │ near: Fehlsprung / später
   *    ──────┼─────────┼──────────────────────────┼──────────────────────────
   *    p1    │  2 Sp.  │       41 / 2             │        1 / 2
   *    p2    │ 31 Sp.  │       22 / 4             │        1 / 31 + Querung
   *    p3    │ 10 Sp.  │       26 / 1             │        1 / 10 + Querung
   *
   *  Bei einer zwei Spalten breiten Grube (p1) ist `near` in BEIDE Richtungen
   *  billiger; bei einem 31 Spalten breiten Becken (p2) würde `near` jeden
   *  späten Fehltritt den ganzen Motten-Lauf wiederholen lassen. Ein einziger
   *  kapitelweiter Wert müsste eine der beiden Phasen falsch bedienen — deshalb
   *  ist es eine Deklaration und keine Konstante. Und sie ist PFLICHT, aus dem
   *  Grund, aus dem `checkpointStyle` es ist: ein späterer Leser muss „Absicht"
   *  von „hier hat jemand etwas verschoben" unterscheiden können. */
  checkpointSide?: "near" | "far";
  plates: Partial<Record<"sky" | "far" | "mid" | "near" | "fg", string>>;
  rows: string[];
  entities: EntitySpec[];
  links: LinkSpec[];
  exit: { to: string }; // a phase id, "boss", or "done"
  /** Declared dry-pocket ink exits. Absent on every phase that has none — an
   *  undeclared pocket whose only way out is a hazard is a softlock, not a
   *  design (Kokis Replay 2026-08-11, p1-Keller). */
  inkReturns?: InkReturnSpec[];
  /** L0 · D5 · DIE TRAIL-WÖRTER DER PHASE.
   *
   *  Die `*`-Kacheln eines Raums buchstabieren ein Wort, und bis zur Level-Welle
   *  stand dieses Wort AUSSCHLIESSLICH im Kunst-Manifest `composition.ts` —
   *  einem Kapitel-1-Register, das für ch02–ch06 bewusst leer bleibt
   *  (Platzhalter-Doktrin E4). Ohne Eintrag dort buchstabiert ein Trail stumm
   *  A→Z durch, also gerade nicht das Wort, das der Raum meint. Deshalb darf die
   *  Phase ihre Wörter selbst deklarieren; `trailWordsFor` gibt der Deklaration
   *  Vorrang und fällt für ch01 unverändert auf `composition.ts` zurück.
   *
   *  Ein deklariertes Wort ist eine PRÜFBARE Zusage: das Gesetz `trail-words`
   *  rechnet die Buchstaben gegen die Zahl der `*` im Gitter nach. */
  words?: readonly string[];
  /** L0 · N7 · WIE LANGE DIE KLECKSKAMMER LÄUFT (D-831 = D-927, zweimal
   *  unabhängig gemessen).
   *
   *  Nur auf der BONUS-Phase gelesen. Die Uhr war eine Konstante im Motor —
   *  35 Sekunden, plus zwei Sekunden Gnade —, und ch02 wie ch06 brauchen 30.
   *  Ohne dieses Feld hätte die erste Kapitel-Bahn, die eine andere Zahl will,
   *  eine Motor-Änderung bestellen müssen, also auf die Merge-Schlange warten.
   *
   *  Die zwei Sekunden Gnade bleiben im Motor: sie sind kein Design-Wert,
   *  sondern die Antwort auf die Reaktionszeit eines Sechsjährigen — dieselbe
   *  in jedem Kapitel. Ohne Angabe gilt 35 ⇒ ch01 byte-gleich. */
  budgetSec?: number;
}

export interface PaintLevel {
  schema: typeof LEVEL_SCHEMA;
  id: string;
  chapter: string;
  draft?: boolean; // drafts skip the chapter-shape laws (phase/cage counts)
  /** The one-screen guardian arena (sheet law: 3 phases + arena — the arena is
   *  NOT one of the 3; it rides beside them). Same shape as a phase. */
  arena?: PhaseSpec;
  /** Klecks' bonus room (one per chapter): entered via a door.trigger, timed
   *  scene-side, exits back to its source phase. */
  bonus?: PhaseSpec;
  name: string;
  goalDe: string;
  whyDe: string;
  hintsDe: string[];
  collectNounDe: string;
  /** L0 · N1 · R246 · WAS DIE `*`-ZELLEN EIGENTLICH SIND.
   *
   *  Der Motor zeichnet auf jeder `*`-Zelle einen BUCHSTABEN — immer, und ohne
   *  deklarierte Wörter zählt er stur A→Z durch. Für Kapitel 1 ist das die
   *  Fiktion selbst (die Buchstaben, die aus dem Buch gefallen sind), für jedes
   *  andere Kapitel ist es falsch: ch02 sammelt Federn, ch03 Goldmünzen, ch04
   *  Farbtropfen, ch05 Noten, ch06 Lupen-Funken. Die ZELLE bleibt `*` — alle
   *  Erreichbarkeits- und Abstands-Gesetze rechnen unverändert weiter —, nur
   *  ihr Aussehen und ihre Bedeutung hängen an diesem Feld.
   *
   *  Fehlt es, gilt `"letters"`: Kapitel 1 ist damit byte-gleich. Ein anderer
   *  Wert ist ein SKIN-Name; solange kein Blatt `collect_<skin>` auf der Platte
   *  liegt, zeichnet die Szene einen grauen Platzhalter mit dem Namen darauf
   *  (Keen-Kunst-Gesetz: fehlende Kunst bricht nie das Spiel).
   *
   *  Das HUD zählt weiter über `collectNounDe` — das Wort, das das Kind liest,
   *  war schon immer eine Deklaration. */
  collectSkin?: string;
  /** L0 · N2 · WIE DIE FUNDSTÜCKE DIESES KAPITELS HEISSEN (D-921).
   *
   *  Die `cloth`-Maschine — drei Fundstücke je Raum, Karte beim dritten Fund —
   *  ist kapitel-neutral gebaut, ihr WORT war es nicht: „Kleider" stand an vier
   *  Stellen hart im Code (HUD-Chip, Bilanz-Zeile, Legenden-Satz des Auftakts,
   *  und der Ort „Schulhaus" gleich mit). ch06 benutzt dieselbe Maschine für
   *  Hinweis-Schnipsel — „Kleider 3/9" wäre dort schlicht falsch.
   *
   *  VIER Felder und nicht zwei, und der Grund ist gemessen: die vier Stellen
   *  brauchen DREI deutsche Formen. „Deine 9 Kleider sind …" (Nominativ),
   *  „Du hast 4 von 9 Kleidern." (Dativ Plural), „Ein Kleidungsstück liegt …"
   *  (Singular). Ein Kapitel, das nur den Nominativ deklariert, bekäme „von 9
   *  Schnipsel" — genau die Sorte Deutsch, die das Register-Tor sonst rot färbt.
   *  Deshalb ist jede Form DEKLARIERBAR und keine wird aus einer Regel geraten.
   *
   *  Die Vorgaben sind die heutigen Wörter von Kapitel 1, Zeichen für Zeichen —
   *  ein Level ohne Deklaration liest sich unverändert. Wer nur `clothNounDe`
   *  setzt, bekommt dieses Wort auch in den anderen beiden Rollen (für „Federn"
   *  ist das richtig, für „Schnipsel" nicht — dann kommt `clothNounDatDe` dazu). */
  clothNounDe?: string;
  /** Dativ Plural („Du hast 4 von 9 …"). Ohne Angabe: `clothNounDe`, und ohne
   *  auch das die heutige Form „Kleidern". */
  clothNounDatDe?: string;
  /** Singular („Ein … liegt irgendwo im …"). Ohne Angabe: `clothNounDe`, und
   *  ohne auch das die heutige Form „Kleidungsstück". */
  clothNounSgDe?: string;
  /** Der ORT, über den die Fundstücke verstreut sind („das Schulhaus"). Steht
   *  im selben Satz und war genauso hart wie das Nomen.
   *
   *  ⚠ Der ARTIKEL steht im Satz und nicht im Feld: „… über das ${ort}
   *  verstreut". Ein Kapitel deklariert also ein Wort, das hinter „das" passt
   *  („Zoo-Gelände", nicht „Zoo"). Das ist Absicht — die Alternative wäre eine
   *  Genus-Regel im Motor, und die wäre für genau ein Wort je Kapitel teurer
   *  Aberglaube. `check-copy-register` liest diese Felder mit. */
  clothPlaceDe?: string;
  /** PK-R6 · C · THE OBJECTIVE SCREEN'S TITLE PLATE (doc 44 §2.6 / §3.4). The
   *  painted stem the goal card wears as its header — the chapter's own picture,
   *  with the chapter name set into the plate's lower band. DECLARED in the
   *  level rather than derived from the chapter id, because the plate is a
   *  commissioned piece with a name of its own; scripts/check-paint-art.mjs
   *  requires whatever is named here, so a level cannot promise a plate the
   *  disk does not hold. Optional: a chapter without one falls back to the
   *  plain painted page the goal card has always been. */
  goalPlate?: string;
  /** PK-R6 · H2: the score page's own painted plate (round-2 finding: score and
   *  door reused one staging). Declared only once the reviewed art is imported. */
  scorePlate?: string;
  /** …and the door-out ceremony's own plate — the chapter's biggest payoff
   *  gets the biggest picture (batch-ap `ceremony_plates`). */
  doorPlate?: string;
  /** R5-W2 · I1: the reading card's own plate. `plate_ch01_rule` was imported
   *  with the other two in batch-ap and then referenced by nothing for three
   *  waves — the third sheet of a set of three, paid for and never hung. */
  rulePlate?: string;
  /** L0 · D6 · DIE AUFTAKT-PLATTEN DES KAPITELS.
   *
   *  Der Auftakt — die vier Karten VOR dem ersten Raum — zeigte seine Bilder aus
   *  drei JSX-Literalen in `PaintGame.tsx`: `auftakt_ch01_b`, `schulhaus_ch01_b`,
   *  `schulhaus_ch01_a`, `auftakt_ch01_c`, `auftakt_ch01_d`. Ein zweites Kapitel
   *  hätte damit sein Buch mit dem SCHULHAUS aus Kapitel 1 aufgeschlagen, ohne
   *  dass irgendein Tor etwas zu bemängeln gehabt hätte. Dasselbe Muster wie
   *  `goalPlate` oben: die Platte ist ein bestelltes Bild mit eigenem Namen,
   *  also DEKLARIERT das Kapitel sie, statt sie aus der Kapitel-Id abzuleiten.
   *  `check-paint-art` verlangt danach genau die hier genannten Blätter, und
   *  `artScope.domArtStems` zählt sie zum beanspruchten Bestand — die Decke der
   *  toten Kunst bleibt dadurch unverändert.
   *
   *  `schatten` ist eine FALLBACK-KETTE (erstes vorhandenes Blatt gewinnt), weil
   *  die Auftakt-Karte 1 seit jeher drei Kandidaten in dieser Reihenfolge
   *  probiert. Ein Kapitel ohne Platten fällt auf die gezeichnete Szene zurück,
   *  wie es der Auftakt vor jeder Kunst tat. */
  auftaktPlates?: { schatten?: readonly string[]; auftrag?: string; los?: string };
  /** PK-R3b · R3-16 (doc 41 §5): how many Regel-Seiten this chapter hides — one
   *  per grammar topic of its unit. DECLARED here and PLACED in the phases, and
   *  the `tip-honesty` law proves the two agree; the HUD and the score page then
   *  read this one number, so „y von N" can never promise a page the world does
   *  not contain (the letter-honesty pattern, doc 41 §7). */
  tipsTotal?: number;
  /** R5-W4 · B4 · R44 — HOW A CHECKPOINT SHOWS ITSELF. Koki, 2026-08-15, on the
   *  Krakel easel: „so wie sie platziert sind, machen sie keinen Sinn,
   *  gequetscht neben die Gegner. Jetzt komplett raus, später besprechen wir,
   *  wo sie hingehören."
   *
   *  `"silent"` is the STILLE ANKER state: the `C` glyph, the warp target and
   *  every `checkpoint-*` law stay exactly as they are — the anchor still
   *  catches an ink splash — but nothing is drawn, nothing lights up and
   *  nothing is announced. `"krakel"` is the ceremony as it was.
   *
   *  This is a DECLARATION, not an amputation, and that is the whole point:
   *  the drawing code is still here and one word turns it back on, so the day
   *  Koki settles where the anchors belong is a one-line day. It is also why
   *  the law below makes the field mandatory wherever a `C` exists — a later
   *  reader must be able to tell „on purpose" from „someone broke it". */
  checkpointStyle?: "silent" | "krakel";
  abilities: Ability[];
  phases: PhaseSpec[];
}

const fail = (msg: string): never => {
  throw new Error(`paintLevel: ${msg}`);
};

/** Semantic validation — the shape is already zod-checked app-side. */
/** phases + arena + bonus, flattened for validation and law passes. */
export const allPhases = (level: PaintLevel): PhaseSpec[] => [
  ...level.phases,
  ...(level.arena ? [level.arena] : []),
  ...(level.bonus ? [level.bonus] : []),
];

/** L0 · D5 · WELCHE WÖRTER EIN BUCHSTABEN-TRAIL BUCHSTABIERT.
 *
 *  EINE Quelle für alle vier Verbraucher (dieses Gesetz, `PaintScene`s
 *  Buchstaben-Bau, die Bonus-Zeremonie und die Tore). Vorrang hat die
 *  Deklaration der Phase; fehlt sie, gilt das Kunst-Manifest wie bisher — so
 *  bleibt Kapitel 1, dessen Wörter in `composition.ts` stehen, unverändert,
 *  während ein Kapitel ohne Kunst-Eintrag trotzdem sein Wort buchstabiert
 *  statt stumm A→Z durchzuzählen.
 *
 *  Der Aufruf braucht die Phase, nicht nur ihre Id: `allPhases` schließt Arena
 *  und Bonusraum ein, und beide tragen Trails. */
export const trailWordsFor = (level: PaintLevel, phaseId: string): readonly string[] | undefined => {
  const phase = allPhases(level).find((p) => p.id === phaseId);
  return phase?.words ?? compositionFor(level.chapter, phaseId)?.words;
};

export const parsePaintLevel = (level: PaintLevel): PaintLevel => {
  if (level.schema !== LEVEL_SCHEMA) fail(`schema must be ${LEVEL_SCHEMA}`);
  if (level.phases.length === 0) fail("no phases");
  // R44: a typo'd style would silently fall through to the ceremony, which is
  // exactly the „looks configured, behaves absent" failure the zod loader taught
  // us to fear. Loud beats tolerant.
  if (level.checkpointStyle !== undefined && level.checkpointStyle !== "silent" && level.checkpointStyle !== "krakel") {
    fail(`checkpointStyle must be "silent" or "krakel" (got "${String(level.checkpointStyle)}")`);
  }
  const ids = new Set<string>();
  for (const ph of allPhases(level)) {
    if (ids.has(ph.id)) fail(`duplicate phase id ${ph.id}`);
    ids.add(ph.id);
    const w = ph.rows[0]?.length ?? 0;
    if (w === 0 || ph.rows.length < 8) fail(`${ph.id}: grid too small`);
    for (const [ri, row] of ph.rows.entries()) {
      if (row.length !== w) fail(`${ph.id}: row ${ri} is ragged (${row.length} ≠ ${w})`);
      for (const g of row) if (!LEGAL_GLYPHS.has(g)) fail(`${ph.id}: illegal glyph "${g}" in row ${ri}`);
    }
    const count = (g: string): number => ph.rows.join("").split(g).length - 1;
    if (count("S") !== 1) fail(`${ph.id}: needs exactly one start S (has ${count("S")})`);
    if (count("X") + count("B") !== 1) fail(`${ph.id}: needs exactly one exit (X or B)`);
    for (const e of ph.entities) {
      if (e.r < 0 || e.r >= ph.rows.length || e.c < 0 || e.c >= w) fail(`${ph.id}: entity ${e.id} off-grid`);
    }
    const entityIds = new Set(ph.entities.map((e) => e.id));
    if (entityIds.size !== ph.entities.length) fail(`${ph.id}: duplicate entity ids`);
    // W0-F3 · a declared ink return must be a real, singular, argued cell. The
    // SEMANTIC half (is it actually a dry pocket?) is checkLevelLaws' job.
    const inkKeys = new Set<string>();
    for (const d of ph.inkReturns ?? []) {
      if (!Number.isInteger(d.c) || !Number.isInteger(d.r) || d.r < 0 || d.r >= ph.rows.length || d.c < 0 || d.c >= w) {
        fail(`${ph.id}: inkReturns entry off-grid (${d.c},${d.r})`);
      }
      if (typeof d.whyDe !== "string" || d.whyDe.trim() === "") {
        fail(`${ph.id}: inkReturns (${d.c},${d.r}) needs a whyDe — a hazard used as an exit must say why`);
      }
      if (inkKeys.has(`${d.c},${d.r}`)) fail(`${ph.id}: duplicate inkReturns cell (${d.c},${d.r})`);
      inkKeys.add(`${d.c},${d.r}`);
    }
    for (const l of ph.links) {
      if (!entityIds.has(l.trigger)) fail(`${ph.id}: link trigger ${l.trigger} unknown`);
      for (const t of l.targets) if (!entityIds.has(t)) fail(`${ph.id}: link target ${t} unknown`);
    }
  }
  // the exit chain: every exit resolves; the chain from phase 1 terminates
  let cursor: string | undefined = level.phases[0]?.id; // non-empty is checked above
  const seen = new Set<string>();
  while (cursor !== undefined && cursor !== "done" && cursor !== "boss") {
    if (seen.has(cursor)) fail(`exit chain loops at ${cursor}`);
    seen.add(cursor);
    const ph = level.phases.find((p) => p.id === cursor);
    if (!ph) fail(`exit chain names unknown phase ${cursor}`);
    cursor = ph?.exit.to;
  }
  if (seen.size !== level.phases.length) fail("some phases are unreachable from the first");
  return level;
};

/** Find the marker cell of a glyph in a phase. */
export const findGlyph = (rows: readonly string[], glyph: string): { c: number; r: number } | null => {
  for (const [r, row] of rows.entries()) {
    const c = row.indexOf(glyph);
    if (c >= 0) return { c, r };
  }
  return null;
};

// ── REACHABILITY v2 (PB-T2: the honest UNDER-approximation of the physics) ──
// A node (c,r) = feet standing ON TOP of row r+1 at column c. Edges follow the
// real movement envelope: walk ±1 (with 1-tile step-up), jump ≤4 rows up and
// ≤3 columns across, hover stretches crossings to ≤7 columns, falls drift
// PROPORTIONALLY to depth (≈0.6 cols/row — v1's "any depth, 4 across" was the
// exact overshoot that green-lit the unreachable p3 exit), vines climb their
// column, rings bridge ≤8 columns, springs add ≤2 rows, and MOVING PLATFORMS
// are visible: their swept top cells (via entities.platformPathAt — the same
// formula the runtime rides) are boardable nodes with disembark envelopes.
//
// THE ENVELOPE LAW: every constant here must be ≤ what the real engine can do
// (level.test.ts derives the physics from stepPlayer and asserts the direction)
// — the BFS may miss a truly-reachable spot (author friction, safe) but must
// never bless an unreachable one. The PROOF of true reachability is the tape
// (proof-tapes.test.ts), never this model.

export const REACH_ENVELOPE = {
  JUMP_UP: 4,
  /** The widest jump the model may EVER bless. What it blesses HERE is
   *  `DX_BY_SKY` — a flat number was a lie in both directions (B3). */
  JUMP_DX: 4,
  HOVER_DX: 7,
  FALL_DRIFT_PER_ROW: 0.5, // cols of air-steer per row fallen (cap below; floor'd)
  FALL_DX_CAP: 4,
  RING_DX: 8,
} as const;

/** B3 · THE HEADROOM TABLE — indexed by clear rows of sky above the take-off
 *  feet, valued in columns the jump may cross. Measured off the real
 *  `stepPlayer` from a STANDSTILL (run-up buys nothing: air control SNAPS, so
 *  every distance saturates after ~1 tile of ground) and then FLOORED to the
 *  integer below, so the model always under-promises:
 *
 *    sky 2 rows → engine 1.98 cols → 1     sky 5 rows → 4.77 → 4
 *    sky 3 rows → engine 2.91 cols → 2     open sky   → 7.70 → 4 (capped)
 *    sky 4 rows → engine 3.45 cols → 3
 *
 *  The old flat `JUMP_DX: 3` blessed 3 columns everywhere — under a 3-row sky
 *  the engine crosses 1.98, so the model was promising jumps no child can make
 *  (doc 45 A7, "der Checker selbst ist verdächtig", now with numbers). It also
 *  under-promised under open sky, which is why every gap in the chapter sat at
 *  2 empty columns with a ~3.5× margin and no tension. One table fixes both. */
export const DX_BY_SKY = [0, 0, 1, 2, 3, 4] as const;

const { JUMP_UP, JUMP_DX, HOVER_DX, RING_DX } = REACH_ENVELOPE;
const fallDx = (depth: number, hover: boolean): number =>
  hover ? HOVER_DX : Math.min(REACH_ENVELOPE.FALL_DX_CAP, 1 + Math.floor(depth * REACH_ENVELOPE.FALL_DRIFT_PER_ROW));

const supportAt = (grid: Grid, c: number, r: number): boolean => {
  const below = glyphAt(grid, c, r + 1);
  return isSolid(below) || isOneWay(below) || isSlope(below) || isSlope(glyphAt(grid, c, r));
};

const headroom = (grid: Grid, c: number, r: number): boolean =>
  !isSolid(glyphAt(grid, c, r)) && !isSolid(glyphAt(grid, c, r - 1));

export const standable = (grid: Grid, c: number, r: number): boolean =>
  supportAt(grid, c, r) && headroom(grid, c, r);

/** W0-F3 · is a child standing on this node ALREADY in the ink? Mirrors
 *  moveBody's hazard scan, which reads the body rect — for a node (c,r) that is
 *  exactly rows r and r-1 of its own column (feet on top of r+1, body 30px tall
 *  over a 16px tile). Used by the trap-pocket law to tell "a hazard you are IN"
 *  (the warp fires by itself; nobody is stuck) from "a hazard you must CHOOSE"
 *  (a dry pocket — a softlock unless the phase declares the dive). */
/** B1 · How far past the far bank a checkpoint may sit. "Retry sits next to the
 *  challenge" (cookbook §8.6) — 4 columns is well inside the 22-column
 *  viewport, so the child can SEE the anchor from the landing. */
export const CHECKPOINT_AFTER_MAX = 4;

/** R5-W4 · B4 · R45: how far apart two cells carrying the SAME character must
 *  sit, measured as `max(|Δc|, |Δr|)` in tiles. Derivation and the measured
 *  chapter-wide spread that picked the number: the `letter-spread` law below. */
export const LETTER_MIN_SEPARATION = 4;

export const submerged = (grid: Grid, c: number, r: number): boolean =>
  glyphAt(grid, c, r) === "w" || glyphAt(grid, c, r - 1) === "w";

export const reachableCells = (
  rows: readonly string[],
  abilities: readonly Ability[],
  entities: readonly EntitySpec[] = [],
): Set<string> => {
  const start = findGlyph(rows, "S");
  if (!start) return new Set();
  return reachFrom(rows, abilities, start, entities);
};

// B1 · PURE-INPUT MEMOS. Both of the caches below key on OBJECT IDENTITY of
// data reachFrom only ever reads, never mutates — so they can never answer a
// question about one grid with another grid's answer, and they hold nothing
// alive that the caller has dropped (WeakMap). No semantics change: the same
// call returns the same set, it just stops re-deriving node-independent facts.
//
// Why it matters: the trap-pocket law calls reachFrom ONCE PER STANDING NODE
// (308 dry nodes on the shipped chapter). Without these, every one of those
// calls re-scanned the whole grid for springs/vines/rings and re-sampled every
// platform path over its full period — work that depends on (rows, entities)
// alone. Measured in one process on the same healed ch01, shipped law vs this
// one: 6849/6766 ms → 5227/5026 ms, i.e. ~25 % off the whole law despite the
// added gates. (The law still costs ~2 s standalone: healing the p1 cellar
// legitimately adds nodes, because a 4-node dead pocket became live graph.)
const sweepMemo = new WeakMap<EntitySpec, Array<{ c: number; r: number }>>();
const glyphScanMemo = new WeakMap<
  readonly string[],
  { springTops: Array<{ c: number; r: number }>; vines: Array<{ c: number; r: number }>; rings: Array<{ c: number; r: number }> }
>();

/** The swept top cells of a kinematic platform over one full period, sampled
 *  through the SAME path formula the runtime rides (platformPathAt). */
const platformSweepCells = (spec: EntitySpec): Array<{ c: number; r: number }> => {
  const memo = sweepMemo.get(spec);
  if (memo) return memo;
  const homeX = (spec.c * TILE + TILE / 2) * SUBS;
  const homeY = (spec.r + 1) * TILE * SUBS;
  const params = spec.params ?? {};
  const cells = new Set<string>();
  const period = Number(params.periodTicks ?? (spec.role === "platform.move" ? 240 : 180));
  for (let t = 0; t < period; t += 4) {
    const p = platformPathAt(spec.role as "platform.move" | "platform.swing", homeX, homeY, params, t);
    const cc = Math.floor(p.x / SUBS / TILE);
    const rr = Math.floor((p.y / SUBS - 1) / TILE);
    for (let dc = -1; dc <= 1; dc++) cells.add(`${cc + dc},${rr}`); // the 40px top spans ~3 cells
  }
  const out = [...cells].map((k) => {
    const [c, r] = k.split(",").map(Number) as [number, number];
    return { c, r };
  });
  sweepMemo.set(spec, out);
  return out;
};

/** Reachability from an arbitrary cell (settled onto its supporting node). */
export const reachFrom = (
  rows: readonly string[],
  abilities: readonly Ability[],
  from: { c: number; r: number },
  entities: readonly EntitySpec[] = [],
): Set<string> => {
  const grid = rows;
  const h = rows.length;
  const w = rows[0]?.length ?? 0;
  const hover = abilities.includes("hover");
  const crossDx = hover ? HOVER_DX : JUMP_DX;
  const key = (c: number, r: number): string => `${c},${r}`;
  const platforms = entities
    .filter((e) => e.role === "platform.move" || e.role === "platform.swing")
    .map((e) => ({ id: e.id, sweep: platformSweepCells(e), boarded: false }));

  const start = from;
  // settle to the supporting node under the cell
  let sr = start.r;
  while (sr < h - 1 && !supportAt(grid, start.c, sr)) sr++;

  // The spring/vine/ring census is a fact about the GRID, not about `from` —
  // memoized on the rows array (see sweepMemo above).
  let scan = glyphScanMemo.get(rows);
  if (!scan) {
    const springTops: Array<{ c: number; r: number }> = [];
    const vines: Array<{ c: number; r: number }> = [];
    const rings: Array<{ c: number; r: number }> = [];
    for (let r = 0; r < h; r++) {
      for (let c = 0; c < w; c++) {
        const g = glyphAt(grid, c, r);
        if (g === "s") springTops.push({ c, r });
        if (g === "V") vines.push({ c, r });
        if (g === "o") rings.push({ c, r });
      }
    }
    scan = { springTops, vines, rings };
    glyphScanMemo.set(rows, scan);
  }
  const { springTops, vines, rings } = scan;

  // R5-A7 · THE SCREEN BOX IS PHYSICS (sim.ts W0-F7). With the camera at the
  // world's edges the centre can never enter column 0 (camX ≥ 0 ⇒ min centre
  // = screenBoxLeftPx) nor the last two columns (max centre = worldW −
  // screenBoxRightPx); mid-world the box travels with the camera and only
  // adds friction. Excluding the edge columns is the exact always-true subset.
  const minCol = Math.floor(PAINT.screenBoxLeftPx / TILE);
  const maxCol = Math.floor((w * TILE - PAINT.screenBoxRightPx) / TILE);

  const queue: Array<{ c: number; r: number }> = [{ c: start.c, r: sr }];
  const seen = new Set<string>([key(start.c, sr)]);
  const push = (c: number, r: number): void => {
    if (c < minCol || c > maxCol || r < 0 || r >= h) return;
    if (!standable(grid, c, r)) return;
    const k = key(c, r);
    if (seen.has(k)) return;
    seen.add(k);
    queue.push({ c, r });
  };

  // R5-A7 · PATH-HONEST EDGES. An edge exists only if a tile-level corridor
  // for it exists — the old edges tunnelled through backed slides, walls,
  // even the floor underfoot (that one blessed p3's sealed G). Conservative
  // by the envelope law: removing edges is the safe direction.
  const colClear = (c: number, rA: number, rB: number): boolean => {
    for (let r = Math.min(rA, rB); r <= Math.max(rA, rB); r++) if (isSolid(glyphAt(grid, c, r))) return false;
    return true;
  };
  /** colClear for a DIRECTED range — an empty range (from > to) is clear,
   *  never silently re-ordered into checking rows it was not asked about. */
  const colClearDown = (c: number, from: number, to: number): boolean => (from > to ? true : colClear(c, from, to));
  /** the body is two tiles tall — a horizontal move needs the FOOT row and
   *  the HEAD row clear (R5 verify wave: a 16px slot let the model tunnel). */
  const rowClear = (r: number, cA: number, cB: number): boolean => {
    for (let c = Math.min(cA, cB); c <= Math.max(cA, cB); c++) {
      if (isSolid(glyphAt(grid, c, r)) || isSolid(glyphAt(grid, c, r - 1))) return false;
    }
    return true;
  };
  const jumpPathClear = (c1: number, r1: number, c2: number, r2: number): boolean =>
    (colClear(c1, r2, r1) && rowClear(r2, c1, c2)) || (rowClear(r1, c1, c2) && colClear(c2, r2, r1));

  /** B3 · Clear rows of SKY above a standing node's feet at column `c` — the
   *  body itself occupies the first two, so this counts the rise the jump can
   *  actually buy before a ceiling takes it. */
  const skyAt = (c: number, r: number): number => {
    let k = 0;
    for (let rr = r; rr >= 0 && !isSolid(glyphAt(grid, c, rr)); rr--) k++;
    return k;
  };
  /** …and the honest horizontal span under the WORST sky the arc must FLY
   *  THROUGH: the take-off column plus the columns strictly between it and the
   *  target. The TARGET column is deliberately excluded — the thing above the
   *  feet there is usually the very platform being landed on, and a destination
   *  is not a ceiling. (Getting this wrong turned the whole chapter red: even
   *  p9's open room, where every plate read as a lid over its own landing.)
   *  Clearance AT the target is already the job of jumpPathClear/rowClear.
   *  Table measured off the real stepPlayer; level.test.ts re-derives it and
   *  fails if the engine ever drops below a row of it. */
  const dxUnderSky = (c1: number, c2: number, r: number): number => {
    let sky = skyAt(c1, r);
    const lo = Math.min(c1, c2) + 1;
    const hi = Math.max(c1, c2) - 1;
    for (let c = lo; c <= hi; c++) sky = Math.min(sky, skyAt(c, r));
    return DX_BY_SKY[Math.min(sky, DX_BY_SKY.length - 1)] ?? JUMP_DX;
  };
  /** depth at which the drift can FIRST reach a column k away (the inverse of
   *  fallDx) — the honest cone a falling body actually sweeps. */
  const minDepthForDx = (k: number): number => {
    if (k <= 0) return 1;
    for (let d = 1; d <= h; d++) if (fallDx(d, hover) >= k) return d;
    return h + 1;
  };

  const visit = (n: { c: number; r: number }): void => {
    // walk + step-up + step-down
    for (const dc of [-1, 1]) {
      push(n.c + dc, n.r);
      push(n.c + dc, n.r - 1);
      push(n.c + dc, n.r + 1);
    }
    // jump: up to JUMP_UP rows up, and ACROSS as far as the real sky allows —
    // along at least one honest L-path (rise-then-cross or cross-then-rise).
    // B3 · THE HEADROOM RULE: how far a jump carries is set by how high it may
    // rise, and a ceiling steals the rise. A flat JUMP_DX was a lie in BOTH
    // directions at once — too generous under a low ceiling (the model blessed
    // 3 where the engine crosses 1.98), too mean under open sky (4 is honest).
    // The span is capped by the WORST sky over the columns the arc crosses, not
    // just the take-off column: a beam halfway across cuts the arc just as hard.
    for (let dc = -JUMP_DX; dc <= JUMP_DX; dc++) {
      if (Math.abs(dc) > dxUnderSky(n.c, n.c + dc, n.r)) continue;
      for (let dr = -JUMP_UP; dr <= 0; dr++) {
        if (jumpPathClear(n.c, n.r, n.c + dc, n.r + dr)) push(n.c + dc, n.r + dr);
      }
    }
    // fall: drift grows with depth (never v1's flat "4 across at any depth") —
    // and the descent sweeps an honest CONE: every transit column must be
    // solid-free from the depth the drift can first enter it down to the
    // landing (R5 verify wave: checking only the landing column let the model
    // tunnel HORIZONTALLY through full walls)
    for (let dr = 1; dr <= h; dr++) {
      const dx = fallDx(dr, hover);
      for (let dc = -dx; dc <= dx; dc++) {
        const c2 = n.c + dc;
        // a sideways fall LEAVES the source column horizontally (the walk-off)
        // — its own support row must not veto it; only a straight drop (dc=0)
        // has to clear its own column
        let clear = true;
        for (let k = dc === 0 ? 0 : 1; k <= Math.abs(dc) && clear; k++) {
          const cc = n.c + Math.sign(dc) * k;
          if (k === 1) {
            // R5-P1: a body enters the FIRST off-column one of two honest
            // ways — (a) the horizontal walk-off step (foot AND head row of
            // that column free), or (b) dropping through under its own feet
            // first (non-solid support: air nodes, one-ways) and drifting
            // over. Either way it occupies the neighbour column from the row
            // below the walking row on, so support there stops the fall
            // THERE. The old drift-depth entry (minDepthForDx starts at the
            // walk-off's own +1 step) skipped that row — the corner of a
            // one-row plate could be clipped diagonally into the sealed
            // void below it (p3 Spitzer-Tasche, trap-pocket (20,25)).
            const stepFree = !isSolid(glyphAt(grid, cc, n.r)) && !isSolid(glyphAt(grid, cc, n.r - 1));
            const dropFree = !isSolid(glyphAt(grid, n.c, n.r + 1));
            clear = (stepFree || dropFree) && colClearDown(cc, n.r + 1, n.r + dr - 1);
          } else {
            clear = colClearDown(cc, n.r + minDepthForDx(k), n.r + dr - 1);
          }
        }
        if (clear) push(c2, n.r + dr);
      }
    }
    // hover crossing at level height — a wall (foot OR head row) ends it
    for (const dir of [-1, 1] as const) {
      for (let d = 1; d <= crossDx; d++) {
        const c2 = n.c + d * dir;
        if (isSolid(glyphAt(grid, c2, n.r)) || isSolid(glyphAt(grid, c2, n.r - 1))) break;
        push(c2, n.r);
      }
    }
    // vines: adjacency latches (within the real jump rise); the whole column
    // then connects up + off the top — each dismount along an honest L-path
    // from the vine cell (R5 verify wave: the old push tunnelled walls)
    for (const v of vines) {
      if (Math.abs(v.c - n.c) <= 2 && v.r >= n.r - JUMP_UP && v.r <= n.r + h) {
        for (const v2 of vines.filter((x) => x.c === v.c)) {
          for (let dc = -2; dc <= 2; dc++) {
            for (let dr = -5; dr <= 2; dr++) {
              if (jumpPathClear(v2.c, v2.r, v2.c + dc, v2.r + dr)) push(v2.c + dc, v2.r + dr);
            }
          }
        }
      }
    }
    // rings bridge wide gaps — but only for a child who HOLDS the swing verb
    // (sim.ts passes ringAt only with the ability; the model must match), and
    // every landing along an honest L-path from the ring
    if (abilities.includes("swing")) {
      for (const g of rings) {
        if (Math.abs(g.c - n.c) <= RING_DX && Math.abs(g.r - n.r) <= 4) {
          for (let dc = -RING_DX; dc <= RING_DX; dc++) {
            for (let dr = -2; dr <= 6; dr++) {
              if (jumpPathClear(g.c, g.r, g.c + dc, g.r + dr)) push(g.c + dc, g.r + dr);
            }
          }
        }
      }
    }
    // springs boost a couple of rows — landings along an honest L-path from
    // the cell ABOVE the spring (the spring glyph itself may be solid)
    for (const sp of springTops) {
      if (Math.abs(sp.c - n.c) <= 1 && Math.abs(sp.r - n.r) <= 1) {
        for (let dc = -2; dc <= 2; dc++) {
          for (let dr = -3; dr <= 0; dr++) {
            if (jumpPathClear(sp.c, sp.r - 1, sp.c + dc, sp.r + dr)) push(sp.c + dc, sp.r + dr);
          }
        }
      }
    }
  };

  // drain-and-board: BFS over static nodes, then unlock any kinematic platform
  // whose swept path is boardable from a seen node, disembarking the jump
  // envelope from EVERY swept cell; repeat until nothing new unlocks
  for (;;) {
    while (queue.length > 0) {
      const n = queue.shift();
      if (!n) break;
      visit(n);
    }
    let unlocked = false;
    for (const p of platforms) {
      if (p.boarded) continue;
      const boardable = p.sweep.some((s) => {
        for (const k of seen) {
          const [c, r] = k.split(",").map(Number) as [number, number];
          if (Math.abs(s.c - c) <= JUMP_DX && s.r - r >= -JUMP_UP && s.r - r <= 6) return true;
        }
        return false;
      });
      if (!boardable) continue;
      p.boarded = true;
      unlocked = true;
      for (const s of p.sweep) {
        // R5-P1 (deklarierte Dossier-Vorleistung): die Sweep-Zellen einer
        // geboardeten Plattform sind Orte, an denen das Kind SEIN kann — sie
        // gehören in `seen`, damit die Collectible-/Entity-Toleranzen auf der
        // Fahrt selbst ankern können (E/S/T über der Tinte; das Tape beweist
        // per Ausführung, D-6).
        seen.add(key(s.c, s.r));
        visit({ c: s.c, r: s.r }); // ride + disembark anywhere along the sweep
      }
    }
    if (!unlocked && queue.length === 0) break;
  }
  return seen;
};

export interface LawFailure {
  phase: string;
  law: string;
  detail: string;
}

/** How long a Regel-Seite's Merksatz may be. Longer than a card's 56-char line
 *  (MAX_LINE_DE) because a rule page is something a child STOPS at and reads,
 *  not a framing clause they skim on the way to the ask — but still one
 *  sentence, out loud, in one breath. */
export const MAX_MERKSATZ = 78;

/** How long a Regel-Seite's Notion may be (R5-W4 · I2). Roomier than the
 *  Merksatz because it is allowed two short sentences — the Merksatz is one
 *  line to carry home, the Erklärung is the thing that makes it make sense. Not
 *  roomier than that: past ~120 characters the card stops being a page a child
 *  reads and becomes a paragraph they skip, which is the failure the whole
 *  round exists to undo. */
export const MAX_ERKLAERUNG = 120;

/** How many examples a Regel-Seite carries. At least two, because one example
 *  is a rule demonstrated once and that is what read as „ein Alibi"; at most
 *  four, because the card sets them as a list and a fifth line pushes the
 *  button off a phone screen. */
export const MIN_BEISPIELE = 2;
export const MAX_BEISPIELE = 4;

/** Die vier Lese-Formen und die Paar-Trennmarke wohnen in `rule-text.ts` —
 *  EIN Eigentümer, drei Leser (dieses Gesetz, die Karte, das Hub-Brett). Sie
 *  hier zu wiederholen wäre die Zwillings-Drift, die diese Runde gerade an
 *  `splitKey` abgeschafft hat; re-exportiert, damit die Gesetz-Leser sie
 *  weiterhin aus `level.ts` beziehen können. */
export { BEISPIEL_MUSTER, BEISPIEL_PAAR_TRENNER } from "./rule-text.ts";

/** Woran eine verneinte englische Zeile zu erkennen ist. Bewusst klein und
 *  benannt: das Gesetz sagt damit laut, WAS es für eine Verneinung hält,
 *  statt es zu erraten. */
const VERNEINUNG_EN = /(n't\b|\bnot\b|\bnever\b)/i;

/** Every params field a `role: "tip"` entity may carry. Stated as a closed set
 *  because this is the one payload rendered straight to a child: an open record
 *  turns a mistyped field name into a missing card line that nothing reports. */
export const TIP_PARAM_KEYS: ReadonlySet<string> = new Set([
  "topicDe", "erklaerungDe", "merksatzDe", "schluesselDe", "beispieleEn", "beispielMuster",
  "lehrtEn", "belegDe", "hidden",
]);

/** How long a Regel-Seite's bold key may be — bound to `cards/Glance.tsx`'s
 *  KEY_MAX_CHARS, not chosen beside it. A `Key` longer than that number silently
 *  drops its stroke, so a cap authored independently would be a cap that lies:
 *  every Merksatz shipped today is 60–72 chars and therefore renders with NO
 *  emphasis at all, which is the defect this field exists to end. `level.ts` may
 *  not import the card layer (the node gates type-strip this file without
 *  React), so `cards/glance-binding.test.ts` holds the two numbers together. */
export const MAX_SCHLUESSEL = 56;

/** What a Regel-Seite's English example may be made of: printable ASCII plus the
 *  typographic dashes and apostrophes the transcripts actually use. It is a
 *  NEGATIVE test for German — an umlaut or ß here means a Merksatz was pasted
 *  into the English slot, and the grounding gate downstream would then be
 *  checking a German sentence against an English lexicon. */
const ENGLISH_ONLY = /^[\x20-\x7E–—…‘’]+$/;

/** How long the objective screen's paragraph may run in total (R5-C1). It is
 *  the one place the book speaks in more than one sentence, so a card-line cap
 *  would be wrong — but the per-sentence cap above still applies to each of its
 *  sentences, which is the clause that actually bites: the shipped ch01 line
 *  ran 51 + 115 and no gate in the repo had ever looked at it. */
export const MAX_GOAL_DE = 200;

/** "Close enough to a reachable node to count" — the same tolerance every
 *  reachability law uses, lifted out so the staged sweeps can share it. */
const nearIn = (set: ReadonlySet<string>, c: number, r: number, dc: number, drUp: number, drDown: number): boolean => {
  for (let dr = -drUp; dr <= drDown; dr++) {
    for (let d = -dc; d <= dc; d++) if (set.has(`${c + d},${r + dr}`)) return true;
  }
  return false;
};

/** Every `*` cell of a phase. */
const letterCellsOf = (rows: readonly string[]): Array<{ c: number; r: number }> => {
  const out: Array<{ c: number; r: number }> = [];
  for (const [r, row] of rows.entries()) {
    for (let c = 0; c < row.length; c++) if (row[c] === "*") out.push({ c, r });
  }
  return out;
};

/**
 * PB-R1 · R3-3 · THE ABILITY LADDER. What the child holds ENTERING each phase:
 * the chapter's abilities minus every grant still ahead of them. PaintGame does
 * the same subtraction at chapter mount (grantSet from `params.grants`) and then
 * accumulates grants as they are taken, so a grant from an earlier phase is
 * already in hand and a grant from THIS phase is not.
 */
const abilitiesEnteringPhase = (level: PaintLevel, phaseId: string): Ability[] => {
  const order = allPhases(level).map((p) => p.id);
  const from = order.indexOf(phaseId);
  const stillAhead = new Set(
    allPhases(level)
      .filter((_, i) => i >= from)
      .flatMap((p) => p.entities.filter((e) => e.role === "powerup").map((e) => String(e.params?.grants ?? ""))),
  );
  return level.abilities.filter((a) => !stillAhead.has(a));
};

/** The machine gate. Strict for real chapters; drafts skip the shape laws. */
export const checkLevelLaws = (level: PaintLevel): LawFailure[] => {
  const failures: LawFailure[] = [];
  const draft = level.draft === true;

  if (!draft) {
    if (level.phases.length !== 3) {
      failures.push({ phase: "*", law: "phase-count", detail: `chapters are 3 phases + arena (has ${level.phases.length})` });
    }
    // R5-W4 · B4 · R44 · SILENCE MUST BE DECLARED.
    //
    // The checkpoint art is off in ch01 and the `C` glyphs stayed. Six months
    // from now that is indistinguishable from a renderer someone broke: the
    // grids carry anchors, the laws below police them, and nothing appears on
    // screen. So the chapter has to SAY which it is. This law is small on
    // purpose — it does not judge the choice, it only forbids leaving the
    // question unanswered wherever the question exists.
    //
    // Deliberately not a render check: whether the scene actually stays quiet is
    // a fact about GameObjects, and a grid law cannot see one. That half is
    // proven in checkpoint-silence.test.ts, which counts the objects a real
    // scene build makes and flips this very field to make the count move.
    const anchored = allPhases(level).filter((ph) => ph.rows.some((row) => row.includes("C")));
    if (anchored.length > 0 && level.checkpointStyle === undefined) {
      failures.push({
        phase: "*",
        law: "checkpoint-silent",
        detail: `${anchored.length} phase(s) carry a checkpoint (${anchored.map((p) => p.id).join(", ")}) but the chapter declares no checkpointStyle — an anchor that draws nothing must say it means to, or the next reader reads it as a bug`,
      });
    }
    // R4 · doc 44 §2.3 · THE CAGE LAW (replaces PB's „six-cages"). Cages are for
    // CLASSMATES: exactly ONE per chapter, and every child must meet it. The
    // unit's OTHER bewitched beings are freed in whatever form their fiction
    // asks — bound, drained, tangled, frozen — so a cage COUNT is not a law any
    // more; it was a number the design could only break by getting better, and
    // a law a good chapter fails is a broken law.
    //
    // What replaces the count is the letter-honesty shape (doc 41 §7): the WORLD
    // is the source of every number. Nothing here declares how many cages a
    // chapter has, and nothing downstream may either — the HUD's „Befreit y/N"
    // and the Bilanz both count N off the level itself (PaintGame's
    // chapterRoleCount), which is what closed the /6-vs-7 drift: the old law
    // counted the three field phases while the world also held the arena's cage,
    // so the HUD and the law disagreed about the same chapter by one.
    //
    // Counted over allPhases for that same reason — the arena and the
    // Kleckskammer are part of the world. A second classmate parked in either of
    // them was invisible to the old count, which looked at level.phases alone.
    const cages = allPhases(level).flatMap((p) => p.entities.filter((e) => e.role === "cage"));
    if (cages.length === 0) {
      failures.push({ phase: "*", law: "cage-law", detail: "a chapter frees at least one caged being (has none)" });
    }
    const classmates = cages.filter((e) => e.params?.classmate !== undefined);
    if (classmates.length !== 1) {
      const who = classmates.map((e) => e.id).join(", ");
      failures.push({
        phase: "*",
        law: "classmate-cage",
        detail: `exactly one cage holds a classmate (has ${classmates.length}${who === "" ? "" : `: ${who}`})`,
      });
    }
    // „on-path and findable by everyone" (§2.3) — the two ways a level can break
    // that promise which no reachability sweep would catch, because both leave
    // the cage perfectly reachable. Being reachable AT ALL is the
    // `entity-reachable` law's job further down, and it covers every cage.
    const bonusId = level.bonus?.id;
    for (const e of classmates) {
      if (e.params?.hidden === true) {
        failures.push({
          phase: "*",
          law: "classmate-cage",
          detail: `the classmate cage ${e.id} spawns hidden — the one cage every child must find may not wait behind a link`,
        });
      }
      const where = allPhases(level).find((p) => p.entities.includes(e));
      if (where !== undefined && bonusId !== undefined && where.id === bonusId) {
        failures.push({
          phase: where.id,
          law: "classmate-cage",
          detail: `the classmate cage ${e.id} sits in the bonus room — a door the child pays for is not „findable by everyone"`,
        });
      }
    }
    // ── PK-R6 · D · THE CLASSMATE PAIR (doc 44 §3.3) ───────────────────────
    // A person-cage and the person in it are ONE thing in two entities: the
    // cage the child opens, and the classmate who then stands there through
    // six rounds of reawakening. The sim reveals her by walking from the
    // burst cage to the `classmate` entity that points back at it — so a
    // cage with nobody pointing at it opens onto an empty spot and the
    // chapter's one rescue silently becomes a shrug. Proven from BOTH ends
    // (a cage needs its person, a person needs her cage, and they share a
    // phase), because either half alone is a level that loads and lies.
    const mates = allPhases(level).flatMap((p) => p.entities.filter((e) => e.role === "classmate").map((e) => ({ e, p })));
    for (const c of classmates) {
      const mine = mates.filter((m) => m.e.params?.cage === c.id);
      if (mine.length !== 1) {
        failures.push({
          phase: "*",
          law: "classmate-pair",
          detail: `the classmate cage ${c.id} needs exactly one \`classmate\` entity pointing at it (has ${mine.length}) — nobody would step out of it`,
        });
        continue;
      }
      const cagePhase = allPhases(level).find((p) => p.entities.includes(c));
      if (mine[0]!.p.id !== cagePhase?.id) {
        failures.push({
          phase: mine[0]!.p.id,
          law: "classmate-pair",
          detail: `${mine[0]!.e.id} stands in ${mine[0]!.p.id} but her cage ${c.id} is in ${cagePhase?.id ?? "?"} — she can never step out of it`,
        });
      }
    }
    for (const m of mates) {
      const cageId = m.e.params?.cage;
      if (cageId === undefined) {
        failures.push({ phase: m.p.id, law: "classmate-pair", detail: `classmate ${m.e.id} declares no cage — nothing can ever reveal her` });
      } else if (!cages.some((c) => c.id === cageId && c.params?.classmate !== undefined)) {
        failures.push({ phase: m.p.id, law: "classmate-pair", detail: `classmate ${m.e.id} points at "${cageId}", which is not a person-cage in this chapter` });
      }
    }
  }

  // PK-R3b · R3-16 · THE REGEL-SEITEN HONESTY LAW (doc 41 §5, §7). The same
  // shape as the letter-honesty law: DECLARED = PLACED = REACHABLE, plus the
  // copy laws, because a Regel-Seite is the one collectible whose payload a
  // child READS. A page that is promised and not placed, placed and not
  // reachable, or reachable and blank, is a broken promise in the HUD.
  if (level.tipsTotal !== undefined) {
    const tips = level.phases.flatMap((p) => p.entities.filter((e) => e.role === "tip"));
    if (tips.length !== level.tipsTotal) {
      failures.push({ phase: "*", law: "tip-honesty", detail: `the chapter declares ${level.tipsTotal} Regel-Seiten but places ${tips.length} — the HUD would count to a page nobody can find` });
    }
    const topics = new Set<string>();
    for (const t of tips) {
      const topic = t.params?.topicDe;
      const satz = t.params?.merksatzDe;
      if (topic === undefined || topic.trim() === "") {
        failures.push({ phase: "*", law: "tip-honesty", detail: `Regel-Seite ${t.id} names no grammar topic` });
      } else if (topics.has(topic)) {
        failures.push({ phase: "*", law: "tip-honesty", detail: `two Regel-Seiten carry the topic „${topic}" — one rule, one page` });
      } else topics.add(topic);
      if (satz === undefined || satz.trim() === "") {
        failures.push({ phase: "*", law: "tip-honesty", detail: `Regel-Seite ${t.id} has no Merksatz — the pickup would show an empty page` });
        continue;
      }
      // A Merksatz is READ, not skimmed past like a card's framing line, so it
      // gets its own (roomier) cap rather than the card lines' 56.
      if (satz.length > MAX_MERKSATZ) {
        failures.push({ phase: "*", law: "tip-honesty", detail: `Regel-Seite ${t.id}: Merksatz is ${satz.length} chars (max ${MAX_MERKSATZ}) — „${satz}"` });
      }
      for (const err of registerErrorsDe(satz)) failures.push({ phase: "*", law: "tip-honesty", detail: `Regel-Seite ${t.id}: ${err}` });

      // R5-W2 · I1 · THE ONE BOLD KEY. The card sets exactly one phrase in bold,
      // and it has to be a phrase OF the rule — a key that paraphrases is a
      // second rule on a page that teaches one.
      const key = t.params?.schluesselDe;
      if (key === undefined || key.trim() === "") {
        failures.push({ phase: "*", law: "tip-honesty", detail: `Regel-Seite ${t.id} names no Schlüssel — the card would set the whole Merksatz in bold, which is the same as setting none of it` });
      } else if (!satz.includes(key)) {
        failures.push({ phase: "*", law: "tip-honesty", detail: `Regel-Seite ${t.id}: der Schlüssel „${key}" steht nicht im Merksatz — ein Schlüssel, der die Regel umschreibt, ist eine zweite Regel` });
      } else if (key.length > MAX_SCHLUESSEL) {
        failures.push({ phase: "*", law: "tip-honesty", detail: `Regel-Seite ${t.id}: Schlüssel is ${key.length} chars (max ${MAX_SCHLUESSEL}) — over that the card drops the stroke and the bold key is silently not bold` });
      }

      // R5-W4 · I2 · THE NOTION (Koki, 2026-08-15: „wir wollen mehr Notions,
      // Erklärungen, Beispiele"). Checked separately from the Merksatz and NOT
      // allowed to be the same sentence twice: the reason the card carries both
      // is that they do different jobs, and two paraphrases of one rule is the
      // padding this round exists to remove.
      const erk = t.params?.erklaerungDe;
      if (erk === undefined || erk.trim() === "") {
        failures.push({ phase: "*", law: "tip-honesty", detail: `Regel-Seite ${t.id} has no Erklärung — the card would state a rule it never explains` });
      } else {
        if (erk.length > MAX_ERKLAERUNG) {
          failures.push({ phase: "*", law: "tip-honesty", detail: `Regel-Seite ${t.id}: Erklärung is ${erk.length} chars (max ${MAX_ERKLAERUNG}) — „${erk}"` });
        }
        if (erk.trim() === satz.trim()) {
          failures.push({ phase: "*", law: "tip-honesty", detail: `Regel-Seite ${t.id}: Erklärung und Merksatz sind derselbe Satz — die Erklärung sagt, WAS passiert, der Merksatz gibt die Regel; zweimal dasselbe ist eine Zeile zu viel` });
        }
        for (const err of registerErrorsDe(erk)) failures.push({ phase: "*", law: "tip-honesty", detail: `Regel-Seite ${t.id}: ${err}` });
      }

      // R5-W4 · I2 · THE EXAMPLES ARE OURS (Koki's ruling K-1, 2026-08-15 — see
      // `beispieleEn` in EntityParams for the full reasoning and for what it
      // retires). Presence, count, language and length live here; GROUNDING —
      // that every word is one this unit teaches — is
      // `scripts/check-paint-copy.mjs`, which can read the lexicon this pure
      // module may not.
      const bsp = t.params?.beispieleEn;
      if (!Array.isArray(bsp)) {
        failures.push({ phase: "*", law: "tip-honesty", detail: `Regel-Seite ${t.id} has no English examples — a rule page without them teaches a rule about nothing` });
      } else if (bsp.length < MIN_BEISPIELE || bsp.length > MAX_BEISPIELE) {
        failures.push({ phase: "*", law: "tip-honesty", detail: `Regel-Seite ${t.id} carries ${bsp.length} example(s) — the card wants ${MIN_BEISPIELE}–${MAX_BEISPIELE}; one example is a rule shown once, five push the button off the screen` });
      } else {
        for (const [i, ex] of bsp.entries()) {
          if (typeof ex !== "string" || ex.trim() === "") {
            failures.push({ phase: "*", law: "tip-honesty", detail: `Regel-Seite ${t.id}: beispieleEn[${i}] is empty` });
          } else if (!ENGLISH_ONLY.test(ex)) {
            failures.push({ phase: "*", law: "tip-honesty", detail: `Regel-Seite ${t.id}: beispieleEn[${i}] is not English — „${ex}"` });
          } else if (ex.length > MAX_SCHLUESSEL) {
            failures.push({ phase: "*", law: "tip-honesty", detail: `Regel-Seite ${t.id}: beispieleEn[${i}] is ${ex.length} chars (max ${MAX_SCHLUESSEL}) — the card sets it as a Key and it would lose its stroke` });
          }
        }
      }

      // R5-W4 · I2 · COVERAGE AND RELEVANCE — what replaces the retired
      // quotation gate, and stricter than it was, because it reads both ways.
      //
      // COVERAGE is the one that earns its keep. I1 shipped a card titled
      // „Kurzformen — I'm · it's · isn't" that explained two of the three, and
      // every machine gate in the repo was green; a human teacher caught it.
      // A title is a promise, and a promise a machine can check should be.
      const lehrt = t.params?.lehrtEn;
      const examples = Array.isArray(bsp) ? bsp.filter((x): x is string => typeof x === "string") : [];
      if (!Array.isArray(lehrt) || lehrt.length === 0) {
        failures.push({ phase: "*", law: "tip-honesty", detail: `Regel-Seite ${t.id} declares no lehrtEn — without it nothing can check that the examples show the rule the page is named after` });
      } else if (lehrt.length > MAX_BEISPIELE) {
        failures.push({ phase: "*", law: "tip-honesty", detail: `Regel-Seite ${t.id} claims to teach ${lehrt.length} forms — a page teaches one rule, so at most ${MAX_BEISPIELE} forms of it` });
      } else if (examples.length > 0) {
        const low = examples.map((e) => e.toLowerCase());
        for (const form of lehrt) {
          if (typeof form !== "string" || form.trim() === "") {
            failures.push({ phase: "*", law: "tip-honesty", detail: `Regel-Seite ${t.id}: lehrtEn holds an empty form` });
          } else if (!low.some((e) => e.includes(form.toLowerCase()))) {
            failures.push({ phase: "*", law: "tip-honesty", detail: `Regel-Seite ${t.id}: die Seite nennt „${form}", aber kein Beispiel zeigt es — der Titel verspricht dann mehr, als die Karte hält` });
          }
        }
        for (const [i, ex] of low.entries()) {
          if (!lehrt.some((f) => typeof f === "string" && f.trim() !== "" && ex.includes(f.toLowerCase()))) {
            failures.push({ phase: "*", law: "tip-honesty", detail: `Regel-Seite ${t.id}: beispieleEn[${i}] „${examples[i]}" zeigt keine der Formen, die diese Seite lehrt — ein Beispiel, das die Regel nicht vorführt, füllt nur die Liste` });
          }
        }
      }

      // ★ R5-W9 · N1 · DIE LESE-FORM IST EINE DEKLARATION, KEINE NOTIZ.
      //
      // Kokis Befund D-770: die vier Zeilen der Befehls-Seite sahen identisch
      // aus, obwohl zwei von ihnen das Gegenteil der anderen zwei sagen. Die
      // Karte kann sie nur trennen, wenn die Seite ihre Form NENNT — und dann
      // muss die Nennung stimmen, sonst zeichnet die Karte eine Form, die die
      // Daten nicht hergeben. Deshalb wird jede der vier Formen gegen die
      // Beispiele nachgerechnet, nicht geglaubt.
      const muster = t.params?.beispielMuster;
      const zeilen = Array.isArray(bsp) ? bsp.filter((x): x is string => typeof x === "string") : [];
      if (muster === undefined || muster.trim() === "") {
        failures.push({ phase: "*", law: "tip-honesty", detail: `Regel-Seite ${t.id} nennt kein beispielMuster — die Karte wüsste nicht, ob ihre Beispiele ein Wandel, ein Gegensatz, ein Wortwechsel oder Einzelsätze sind` });
      } else if (!BEISPIEL_MUSTER.has(muster)) {
        failures.push({ phase: "*", law: "tip-honesty", detail: `Regel-Seite ${t.id}: beispielMuster „${muster}" ist keine der vier Lese-Formen (${[...BEISPIEL_MUSTER].join(" · ")})` });
      } else if (muster === "wandel" || muster === "dialog") {
        // ein Paar heisst: links steht etwas, rechts steht etwas, und dazwischen
        // GENAU eine Trennmarke — zwei Marken wären zwei Paare in einer Zeile.
        for (const [i, ex] of zeilen.entries()) {
          const teile = ex.split(BEISPIEL_PAAR_TRENNER);
          if (teile.length !== 2 || teile.some((s) => s.trim() === "")) {
            failures.push({ phase: "*", law: "tip-honesty", detail: `Regel-Seite ${t.id}: beispieleEn[${i}] ist als „${muster}" erklärt, trägt aber kein Paar »links – rechts« — „${ex}"` });
          }
        }
      } else if (muster === "einzeln") {
        for (const [i, ex] of zeilen.entries()) {
          if (ex.includes(BEISPIEL_PAAR_TRENNER)) {
            failures.push({ phase: "*", law: "tip-honesty", detail: `Regel-Seite ${t.id}: beispieleEn[${i}] trägt eine Paar-Trennmarke, ist aber als „einzeln" erklärt — „${ex}"` });
          }
        }
      } else {
        // `gegensatz`: je zwei Zeilen sind EIN Paar — erst das Tun, dann sein
        // Nicht-Tun. Beide sind richtiges Englisch; was sie unterscheidet, ist
        // die Verneinung, und genau die muss in der zweiten Zeile stehen und in
        // der ersten fehlen. Sonst zeichnete die Karte ihre zwei Spalten über
        // Zeilen, die gar kein Gegensatzpaar sind.
        if (zeilen.length % 2 !== 0) {
          failures.push({ phase: "*", law: "tip-honesty", detail: `Regel-Seite ${t.id}: „gegensatz" braucht eine gerade Zahl von Beispielen — je ein Tun und sein Nicht-Tun; die Seite hat ${zeilen.length}` });
        }
        for (let i = 0; i + 1 < zeilen.length; i += 2) {
          const tun = zeilen[i]!;
          const nicht = zeilen[i + 1]!;
          if (VERNEINUNG_EN.test(tun) || !VERNEINUNG_EN.test(nicht)) {
            failures.push({ phase: "*", law: "tip-honesty", detail: `Regel-Seite ${t.id}: „${tun}" / „${nicht}" ist kein Tun-dann-Nicht-Tun-Paar — die erste Zeile eines Paares steht ohne Verneinung, die zweite mit` });
          }
        }
      }

      // `belegDe` is DATA, not display (Koki 2026-08-15: the card no longer
      // points at the book). Still required: the teacher and the register need
      // to know which page of the unit a rule came from, and a field nobody is
      // forced to fill is a field that rots.
      const beleg = t.params?.belegDe;
      if (beleg === undefined || beleg.trim() === "") {
        failures.push({ phase: "*", law: "tip-honesty", detail: `Regel-Seite ${t.id} names no Beleg — the teacher's view and the register need the unit page even though no card shows it` });
      }

      // R5-W4 · I2 · THE TYPO GATE. `params` is an open record everywhere else
      // in this file, which is right for a format where every role brings its
      // own knobs — and wrong for the one payload a child READS: a mistyped
      // `beispieleEN` would vanish silently and the card would render a page
      // with no examples on it. It is also what keeps J1-D's four retired
      // fields retired: re-adding `ausspracheDe` turns this red instead of
      // reaching a card that stopped rendering it.
      for (const k of Object.keys(t.params ?? {})) {
        if (!TIP_PARAM_KEYS.has(k)) {
          failures.push({ phase: "*", law: "tip-honesty", detail: `Regel-Seite ${t.id}: unknown params field „${k}" — a rule page carries ${[...TIP_PARAM_KEYS].join(", ")} and nothing else; a typo here reaches the child as a missing line` });
        }
      }
    }
  }

  // ── R5-C1 · THE CAPTIVE LAW (doc 44 §2.3, Koki's replay 2026-08-11) ────────
  // A cage that declares only its shell forces the ceremony to guess, and the
  // guess shipped: „Da steckt jemand fest!" over a sound system, and one
  // „Buchstaben-Wesen" line covering a tablet, a chair and a class photo. The
  // shell can only tell them apart if the level says so, so the level must.
  const cages = allPhases(level).flatMap((p) => p.entities.filter((e) => e.role === "cage").map((e) => ({ e, p })));
  const captives = new Set<string>();
  for (const { e, p } of cages) {
    const captive = e.params?.captiveDe;
    if (captive === undefined || captive.trim() === "") {
      failures.push({ phase: p.id, law: "cage-captive", detail: `cage ${e.id} declares no captive — the ceremony that opens it would have to guess what it freed` });
      continue;
    }
    // It lands inside a card line, so it obeys the card line's own cap.
    if (captive.length > MAX_LINE_DE) {
      failures.push({ phase: p.id, law: "cage-captive", detail: `cage ${e.id}: captive is ${captive.length} chars (max ${MAX_LINE_DE}) — „${captive}"` });
    }
    for (const err of registerErrorsDe(captive)) failures.push({ phase: p.id, law: "cage-captive", detail: `cage ${e.id}: ${err}` });
    for (const err of cloakErrorsDe(captive, level.chapter)) failures.push({ phase: p.id, law: "cage-captive", detail: `cage ${e.id}: ${err}` });
    // Two cages holding the same thing is a census defect, and it makes the two
    // liberation cards indistinguishable — the same reason topics are unique.
    if (captives.has(captive)) {
      failures.push({ phase: p.id, law: "cage-captive", detail: `two cages hold „${captive}" — one captive, one cage` });
    } else captives.add(captive);
  }
  for (const ph of allPhases(level)) {
    for (const e of ph.entities) {
      if (e.role !== "cage" && e.params?.captiveDe !== undefined) {
        failures.push({ phase: ph.id, law: "cage-captive", detail: `${e.role} ${e.id} declares a captive — only a cage holds one` });
      }
    }
  }

  // ── R5-C1 · THE CHAPTER-COPY LAWS ─────────────────────────────────────────
  // The chapter's own German — the title, the objective screen, the *Warum*,
  // the hints, the collectible noun, every phase name — was the one authored
  // surface no gate in this repo read, which is exactly why „OSWINs Tinte…"
  // reached a child's screen and stayed there through four packets. Same three
  // axes as the Regel-Seite copy above: the cloak, the register, the breath.
  const copyFields: Array<{ what: string; text: string; cap: number }> = [
    { what: "name", text: level.name, cap: MAX_LINE_DE },
    { what: "collectNounDe", text: level.collectNounDe, cap: MAX_LINE_DE },
    // The *Warum* and the hints are read at rest, like a Merksatz — one
    // sentence, out loud, in one breath — so they take the Merksatz cap.
    { what: "whyDe", text: level.whyDe, cap: MAX_MERKSATZ },
    ...level.hintsDe.map((h, i) => ({ what: `hintsDe[${i}]`, text: h, cap: MAX_MERKSATZ })),
    ...allPhases(level).map((p) => ({ what: `${p.id}.nameDe`, text: p.nameDe, cap: MAX_LINE_DE })),
  ];
  for (const f of copyFields) {
    if (f.text.length > f.cap) {
      failures.push({ phase: "*", law: "chapter-copy", detail: `${f.what} is ${f.text.length} chars (max ${f.cap}) — „${f.text}"` });
    }
    for (const err of registerErrorsDe(f.text)) failures.push({ phase: "*", law: "chapter-copy", detail: `${f.what}: ${err}` });
    for (const err of cloakErrorsDe(f.text, level.chapter)) failures.push({ phase: "*", law: "chapter-copy", detail: `${f.what}: ${err}` });
  }
  // goalDe is the objective screen's paragraph, not a card line — it gets room,
  // but every SENTENCE in it still has to be sayable in one breath. That clause
  // is the one with teeth: the shipped line was 51 + 115.
  if (level.goalDe.length > MAX_GOAL_DE) {
    failures.push({ phase: "*", law: "chapter-copy", detail: `goalDe is ${level.goalDe.length} chars (max ${MAX_GOAL_DE})` });
  }
  for (const s of level.goalDe.split(/(?<=[.!?:])\s+/)) {
    if (s.length > MAX_MERKSATZ) {
      failures.push({ phase: "*", law: "chapter-copy", detail: `goalDe sentence is ${s.length} chars (max ${MAX_MERKSATZ}) — „${s}"` });
    }
  }
  for (const err of registerErrorsDe(level.goalDe)) failures.push({ phase: "*", law: "chapter-copy", detail: `goalDe: ${err}` });
  for (const err of cloakErrorsDe(level.goalDe, level.chapter)) failures.push({ phase: "*", law: "chapter-copy", detail: `goalDe: ${err}` });

  for (const ph of allPhases(level)) {
    // W0-F8: worlds must be tall enough for the camera to breathe, and
    // W0-F7: the top row is authored solid — the world is CLOSED (no
    // reachable-looking painted "outside" above the playfield).
    if (ph.rows.length < 20) {
      failures.push({ phase: ph.id, law: "min-height", detail: `worlds are ≥20 rows (has ${ph.rows.length})` });
    }
    if (!(ph.rows[0] ?? "").split("").every((g) => g === "#")) {
      failures.push({ phase: ph.id, law: "closed-top", detail: "row 0 must be fully solid (the canopy)" });
    }

    // PB-T1 · THE SLOPE LAWS: ramps are carved INTO mass, never free-standing
    // wedges — the "looks standable, isn't solid" playtest class. Every slope
    // cell is backed by solid directly below; 30° halves come as adjacent
    // pairs (a lone half-ramp is meaningless geometry).
    for (const [r, row] of ph.rows.entries()) {
      for (let c = 0; c < row.length; c++) {
        const g = row[c] ?? ".";
        if (!isSlope(g)) continue;
        if (!isSolid(glyphAt(ph.rows, c, r + 1))) {
          failures.push({ phase: ph.id, law: "slope-backing", detail: `slope '${g}' at (${c},${r}) has no solid below — free wedges are banned` });
        }
        if (g === "1" && glyphAt(ph.rows, c + 1, r) !== "2") {
          failures.push({ phase: ph.id, law: "slope-pairing", detail: `'1' at (${c},${r}) is missing its '2' to the right` });
        }
        if (g === "2" && glyphAt(ph.rows, c - 1, r) !== "1") {
          failures.push({ phase: ph.id, law: "slope-pairing", detail: `'2' at (${c},${r}) is missing its '1' to the left` });
        }
        if (g === "3" && glyphAt(ph.rows, c + 1, r) !== "4") {
          failures.push({ phase: ph.id, law: "slope-pairing", detail: `'3' at (${c},${r}) is missing its '4' to the right` });
        }
        if (g === "4" && glyphAt(ph.rows, c - 1, r) !== "3") {
          failures.push({ phase: ph.id, law: "slope-pairing", detail: `'4' at (${c},${r}) is missing its '3' to the left` });
        }
        // PB-F2 · THE PURPOSE LAW FOR RAMPS (from Koki's F2-4 "small-ledge
        // glitch"): a 45° ramp exists to JOIN TWO WALK HEIGHTS. p1 carried a
        // single '/' between two stretches of floor at the same height — an
        // 8-px bump that led nowhere, put the hero's feet on a diagonal and
        // read on film as a glitched ledge. Scoped to the FULL ramps '/' and
        // '\': the 30° halves have their own pairing law above, and 'z' is the
        // slide — a long chute whose whole body is diagonal by design.
        if (g === "/" || g === "\\") {
          const walkTop = (col: number): number => {
            for (let rr = 0; rr < ph.rows.length; rr++) if (isSolid(glyphAt(ph.rows, col, rr)) || isSlope(glyphAt(ph.rows, col, rr))) return rr;
            return ph.rows.length;
          };
          if (walkTop(c - 1) === walkTop(c + 1)) {
            failures.push({ phase: ph.id, law: "slope-purpose", detail: `ramp '${g}' at (${c},${r}) joins two floors of the SAME height — a ramp must change the walk height` });
          }
        }
      }
    }
    // PB-T1 · walkers spawn standing on solid (the entity ground contract's
    // authoring side — a mid-air or slope spawn is a placement defect)
    for (const e of ph.entities) {
      // PK-R6 · C1: `drained` joins this law — a desk hovering an inch off the
      // floor is the same authoring defect as a mid-air chaser, and it is the
      // one the eye catches first because furniture is EXPECTED to rest.
      // PK-R6 · D: and `classmate` — she stands where she stepped out of her
      // cage and stays there for the rest of the chapter (doc 44 §1: freeing
      // changes state, never presence), so a floating spawn is a friend
      // hovering over the classroom floor for twenty minutes.
      if ((e.role === "chaser" || e.role === "bouncer" || e.role === "drained" || e.role === "classmate") && !isSolid(glyphAt(ph.rows, e.c, e.r + 1))) {
        failures.push({ phase: ph.id, law: "spawn-standable", detail: `${e.role} ${e.id} at (${e.c},${e.r}) must stand on solid ground` });
      }
    }

    const reach = reachableCells(ph.rows, level.abilities, ph.entities);
    const has = (c: number, r: number): boolean => reach.has(`${c},${r}`);
    const nearReachable = (c: number, r: number, dc: number, drUp: number, drDown: number): boolean =>
      nearIn(reach, c, r, dc, drUp, drDown);
    const exitCell = findGlyph(ph.rows, "X") ?? findGlyph(ph.rows, "B");
    if (exitCell && !nearReachable(exitCell.c, exitCell.r, 1, 1, 3)) {
      failures.push({ phase: ph.id, law: "exit-reachable", detail: `the exit at (${exitCell.c},${exitCell.r}) cannot be reached` });
    }
    for (const [r, row] of ph.rows.entries()) {
      for (let c = 0; c < row.length; c++) {
        if (row[c] === "*" && !nearReachable(c, r, 1, 1, 3)) {
          failures.push({ phase: ph.id, law: "collectible-reachable", detail: `letter at (${c},${r}) unreachable` });
        }
      }
    }

    // ── R5-W4 · B4 · R45 · THE TRAIL MAY NOT STUTTER ────────────────────────
    // Koki, 15.08.2026, over p1: »Zwei O direkt nebeneinander — nicht gut
    // geplant.« His screenshot (07.18.30) shows both of them and an L in one
    // glance: 2 columns and 3 rows apart, inside a 22×14-tile view. They do not
    // read as two collectibles, they read as a typo.
    //
    // WHY THIS IS A ROW LAW WHEN IT SOUNDS LIKE A COLUMN LAW. letters.ts hands
    // out the characters by COLUMN order, so the double letter of a word
    // („sch-OO-l") is always column-adjacent by construction. Pulling the pair
    // apart sideways would hand every other cell a different character and
    // respell the trail. The only axis actually free is the row — so the law is
    // stated as a Chebyshev distance, which a row move alone can satisfy.
    //
    // WHY 4. Two measurements set it, from opposite sides.
    //   · From ABOVE: every same-character pair in the chapter as built sits at
    //     Chebyshev 2, 3, 11, 26, 39 or 44. Koki's two are the 2 and the 3; the
    //     nearest pair nobody has ever complained about is the 11. So anything
    //     from 4 to 10 reddens exactly his two and nothing else.
    //   · From BELOW: p9's Kleckskammer decides which end of that band is real.
    //     Its double-O lives on one plateau whose letter window is five columns
    //     wide (c17–c21, pinned by the H and the L on either side) and three
    //     rows tall, so the widest honest pair it can hold is 4. Buying 5 or 6
    //     would mean sending one O down to the floor and back up again — in a
    //     room with a 35-second clock, which is the room's whole contract.
    // 4 is therefore the largest number the chapter can actually carry. It is
    // the FLOOR of the useful band, not the middle, and p9 now sits exactly on
    // it: filed as debt, because a later re-cut of that chamber should widen the
    // crest and buy the law some room rather than the law pretending it has any.
    //
    // Note it deliberately does NOT fire on same-character pairs at a distance
    // (p9 spells SCHOOLTHINGS and carries three): a word is allowed to use a
    // letter twice. What it forbids is using it twice IN ONE BREATH.
    const trail = letterGlyphs(ph.rows, trailWordsFor(level, ph.id));
    for (let i = 0; i < trail.length; i++) {
      for (let j = i + 1; j < trail.length; j++) {
        const a = trail[i]!;
        const b = trail[j]!;
        if (a.char !== b.char) continue;
        const dc = Math.abs(a.c - b.c);
        const dr = Math.abs(a.r - b.r);
        const apart = Math.max(dc, dr);
        if (apart < LETTER_MIN_SEPARATION) {
          failures.push({
            phase: ph.id,
            law: "letter-spread",
            detail: `two „${a.char}" sit at (${a.c},${a.r}) and (${b.c},${b.r}) — ${apart} tile(s) apart (Δc ${dc}, Δr ${dr}), the law needs ${LETTER_MIN_SEPARATION}; a repeat inside one glance reads as a mistake, not as a word`,
          });
        }
      }
    }

    // ── B1 · THE CHECKPOINT DOCTRINE (Koki, 2026-08-11) ─────────────────────
    // "Checkpoints gehören NACH schwere Abschnitte, nie davor, und jedes
    // Element braucht seinen Zweck." This REVERSES the cookbook's old §2/§8.6
    // ("≤1 per phase, placed BEFORE the risk spike") — that line, and the
    // "Anti 3/6" citations in the three dossiers, are amended with this law.
    //
    // What a checkpoint can honestly be measured against: ONLY ink warps.
    // sim.ts is glyph-precise — `ev.hazard === "w"` moves the child to
    // respawnCell; spikes do not, and enemy contact opens a card and never
    // relocates anybody. So a rule phrased over "gaps" or "enemy bands" would
    // police things a checkpoint cannot pay for, and would be gameable in both
    // directions. An INK PASSAGE is the honest unit — and you cannot hide ink
    // from a grid scan.
    if (exitCell) {
      const startCell = findGlyph(ph.rows, "S");
      const wCols = ph.rows[0]?.length ?? 0;
      const inkCol = (c: number): boolean => ph.rows.some((row) => row[c] === "w");
      const runs: Array<{ west: number; east: number }> = [];
      for (let c = 0, from: number | null = null; c <= wCols; c++) {
        if (c < wCols && inkCol(c)) { if (from === null) from = c; }
        else if (from !== null) { runs.push({ west: from, east: c - 1 }); from = null; }
      }
      // Only a passage the child must GET PAST counts: spawn on one side, exit
      // on the other. A decorative pool behind the exit is scenery, and
      // demanding a checkpoint for it would be the "dead scenery" failure mode.
      const eastward = startCell ? exitCell.c > startCell.c : true;
      const crossings = startCell
        ? runs.filter((p) => (eastward ? startCell.c < p.west && exitCell.c > p.east : startCell.c > p.east && exitCell.c < p.west))
        : [];
      const checkpoints: Array<{ c: number; r: number }> = [];
      for (const [r, row] of ph.rows.entries()) {
        for (let c = 0; c < row.length; c++) if (row[c] === "C") checkpoints.push({ c, r });
      }
      checkpoints.sort((a, b) => (eastward ? a.c - b.c : b.c - a.c));

      // A · COUNT — one per passage, no more and no fewer.
      if (checkpoints.length !== crossings.length) {
        failures.push({
          phase: ph.id,
          law: "checkpoint-count",
          detail: crossings.length === 0
            ? `${ph.id} crosses no ink but carries ${checkpoints.length} checkpoint(s) — only ink warps (sim.ts), so a checkpoint with nothing to catch is scenery`
            : `${ph.id} crosses ink ${crossings.length}× but carries ${checkpoints.length} checkpoint(s) — one checkpoint per hard passage, no more and no fewer`,
        });
      }
      crossings.sort((a, b) => (eastward ? a.west - b.west : b.west - a.west));
      for (const [i, p] of crossings.entries()) {
        const cp = checkpoints[i];
        if (!cp) continue; // the count law already spoke
        // B · PAIRING — next to the passage, on the DECLARED side.
        //
        // R5-W5 · B4b (Kokis Entscheid 2026-08-17): the side is no longer fixed
        // to „far". It is read off `ph.checkpointSide`, and the declaration is
        // MANDATORY here — see the field's own note for the measured reason a
        // single chapter-wide value cannot serve p1 and p2 at once. What did NOT
        // change is the distance: either side, the anchor sits WITHIN
        // CHECKPOINT_AFTER_MAX columns of the bank it belongs to. A retry that
        // starts a screen away is the defect this clause was written for, and
        // that is true on both banks.
        const side = ph.checkpointSide;
        if (side === undefined) {
          failures.push({
            phase: ph.id,
            law: "checkpoint-placement",
            detail: `${ph.id} carries a checkpoint but declares no checkpointSide — "near" (retry before the ink) or "far" (bank the crossing) is a design decision, and an undeclared one reads as a slip to the next person who moves a glyph`,
          });
        }
        // die Bank, an der der Anker hängt: bei „far" das Ufer, auf dem das Kind
        // ANKOMMT, bei „near" das, von dem es ABSPRINGT
        const bank = side === "near"
          ? (eastward ? p.west : p.east)
          : (eastward ? p.east : p.west);
        // …und die erlaubten Spalten liegen auf der jeweils ABGEWANDTEN Seite
        const outward = (side === "near") === eastward ? -1 : 1;
        const near1 = bank + outward;
        const nearMax = bank + outward * CHECKPOINT_AFTER_MAX;
        const lo = Math.min(near1, nearMax);
        const hi = Math.max(near1, nearMax);
        if (cp.c < lo || cp.c > hi) {
          const insideOrBeyond = cp.c >= Math.min(p.west, p.east) && cp.c <= Math.max(p.west, p.east)
            ? "IN the ink itself"
            : "on the wrong side of it";
          failures.push({
            phase: ph.id,
            law: "checkpoint-placement",
            detail: side === "near"
              ? `${ph.id} declares checkpointSide "near" and crosses ink at c${p.west}–${p.east}, but its checkpoint (${cp.c},${cp.r}) is not within ${CHECKPOINT_AFTER_MAX} columns of the take-off bank c${bank} — it sits ${insideOrBeyond}; a near anchor exists so a failed jump is retried AT the jump`
              : `${ph.id} declares checkpointSide "far" and crosses ink at c${p.west}–${p.east}, but its checkpoint (${cp.c},${cp.r}) is not within ${CHECKPOINT_AFTER_MAX} columns of the landing bank c${bank} — it sits ${insideOrBeyond}; a far anchor banks the crossing and must stand NEXT to it, not a screen away`,
          });
        }
        // C · FOOTING — Krakel sketches you where you can stand.
        if (!standable(ph.rows, cp.c, cp.r) || !reach.has(`${cp.c},${cp.r}`)) {
          failures.push({
            phase: ph.id,
            law: "checkpoint-footing",
            detail: `the checkpoint at (${cp.c},${cp.r}) is not a standing cell a child can reach — a respawn point in the air drops the child straight back into the passage`,
          });
        }
        // D · NO DEAD WALK — anti-law 3 survives the reversal. Moving anchors
        // to the far bank lengthens the walk after an UNBANKED splash; it may
        // not become a march across the world.
        const prev = i === 0 ? (startCell?.c ?? 0) : (checkpoints[i - 1]?.c ?? 0);
        if (Math.abs(cp.c - prev) > wCols) {
          failures.push({
            phase: ph.id,
            law: "checkpoint-walk",
            detail: `${ph.id}: ${Math.abs(cp.c - prev)} columns from the last anchor to (${cp.c},${cp.r}) in a ${wCols}-column world — no dead walks`,
          });
        }
      }
    }
    for (const e of ph.entities) {
      // PK-R3b: the two new pickups join this law rather than getting one of
      // their own — a Regel-Seite or a Bonus-Buch nobody can reach is exactly
      // the same defect as an unreachable cage, and „hidden" never means
      // „impossible" (doc 31's law: a collectible no child can reach is a
      // defect, not a secret).
      // PK-R6 · C1: a drained object joins this law for the same reason a cage
      // does — it is a being the chapter PROMISES the child can free, and the
      // HUD counts it. One standing on a ledge nobody can climb is a broken
      // promise, not a secret.
      if ((e.role === "cage" || e.role === "powerup" || e.role === "drained" || PICKUP_ROLES.has(e.role)) && !nearReachable(e.c, e.r, 2, 2, 4)) {
        failures.push({ phase: ph.id, law: "entity-reachable", detail: `${e.role} ${e.id} at (${e.c},${e.r}) unreachable` });
      }
    }

    const startCell = findGlyph(ph.rows, "S");
    const letters = letterCellsOf(ph.rows);

    // PB-R1 · R3-2 · THE LETTER ECONOMY LAW. A priced door may never ask for
    // more letters than the child can be holding when they meet it. Klecks'
    // door asked for 10 in a phase carrying 8 — readable, unpayable, and no
    // backtracking to fetch the rest. Letters are counted PER PHASE because the
    // sim counts them per phase: every phase mount builds a new Sim starting at
    // zero, so p1's letters buy nothing in p2.
    //
    // "Before the door" = reachable without ever standing on the door's cell.
    // For a door on open floor that cut removes almost nothing (the child can
    // hop over one cell), and the law then reduces to „price ≤ the letters this
    // phase actually offers" — which is the defect class Koki hit. Where a door
    // genuinely gates a corridor, the cut bites harder. It can only ever make
    // the law stricter, never more permissive.
    for (const e of ph.entities) {
      if (e.role !== "door.trigger") continue;
      const price = e.params?.price;
      if (e.params?.kind === "bonus" && price === undefined) {
        failures.push({ phase: ph.id, law: "door-price", detail: `bonus door ${e.id} must declare a price (the card renders it — copy may never state a number the data does not)` });
        continue;
      }
      if (price === undefined) continue;
      if (typeof price !== "number" || !Number.isInteger(price) || price <= 0) {
        failures.push({ phase: ph.id, law: "door-price", detail: `door ${e.id}: price must be a whole number ≥ 1 (is ${JSON.stringify(price)})` });
        continue;
      }
      if (!startCell) continue; // parse already failed on a phase without S
      const sealed = ph.rows.map((row, r) => (r === e.r ? row.slice(0, e.c) + "#" + row.slice(e.c + 1) : row));
      const before = reachFrom(sealed, level.abilities, startCell, ph.entities);
      const affordable = letters.filter((l) => nearIn(before, l.c, l.r, 1, 1, 3)).length;
      if (price > affordable) {
        failures.push({
          phase: ph.id,
          law: "door-price",
          detail: `door ${e.id} at (${e.c},${e.r}) costs ${price} but only ${affordable} ${level.collectNounDe} can be collected before it — the price is unpayable`,
        });
      }
    }

    // PB-R1 · R3-3 · THE ESSENTIAL-GRANT LAW (the authoring half; the runtime
    // half locks the exit in Sim.checkExit). A grant the chapter later REQUIRES
    // must be collectable before this phase's exit, under the abilities the
    // child can actually hold at that point — the staged double sweep: reach the
    // grant WITHOUT it, then reach the exit WITH it. Fibel's fist is the case:
    // the arena guardian can only be staggered by a deflected chalk piece, and
    // deflecting needs the fist, so leaving p2 fistless was a dead run.
    const essentials = ph.entities.filter((e) => e.role === "powerup" && e.params?.essential === true);
    if (essentials.length > 0 && startCell) {
      const entryAbilities = abilitiesEnteringPhase(level, ph.id);
      const preGrant = reachFrom(ph.rows, entryAbilities, startCell, ph.entities);
      for (const e of essentials) {
        if (!nearIn(preGrant, e.c, e.r, 2, 2, 4)) {
          failures.push({
            phase: ph.id,
            law: "essential-reachable",
            detail: `essential grant ${e.id} at (${e.c},${e.r}) cannot be reached with the abilities the child holds entering ${ph.id} (${entryAbilities.join("+") || "none"})`,
          });
          continue;
        }
        if (!exitCell) continue;
        const withGrant = [...new Set([...entryAbilities, String(e.params?.grants ?? "")])].filter((a): a is Ability =>
          (["jump", "punch", "hang", "swing", "hover", "run"] as string[]).includes(a),
        );
        const afterGrant = reachFrom(ph.rows, withGrant, { c: e.c, r: e.r }, ph.entities);
        if (!nearIn(afterGrant, exitCell.c, exitCell.r, 1, 1, 3)) {
          failures.push({
            phase: ph.id,
            law: "essential-reachable",
            detail: `from essential grant ${e.id} at (${e.c},${e.r}) the exit at (${exitCell.c},${exitCell.r}) is no longer reachable — collecting it must not strand the child`,
          });
        }
      }
    }

    // W0-F3 · THE TRAP-POCKET LAW: from every node the player can reach, the
    // exit must REMAIN reachable — no enterable pocket without an exit path.
    if (exitCell) {
      // Deliberately un-memoized: "reachable FROM a good node" does not imply
      // "can reach the exit" (falling into a pit is one-way). Worlds are small;
      // honesty beats cleverness here.
      const declaredDives = new Set((ph.inkReturns ?? []).map((d) => `${d.c},${d.r}`));
      const provenDives = new Set<string>();
      for (const k of reach) {
        const parts = k.split(",").map(Number);
        const c = parts[0] ?? 0;
        const r = parts[1] ?? 0;
        if (!standable(ph.rows, c, r)) continue;
        // GATE A runs BEFORE the sweep: it reads two glyphs, the sweep is a
        // whole BFS. A submerged node is excused unconditionally, so paying for
        // its sub-reach buys nothing (43 sweeps saved across the shipped
        // chapter — this law is O(nodes × BFS) and the basins are wide).
        if (submerged(ph.rows, c, r)) continue;
        const sub = reachFrom(ph.rows, level.abilities, { c, r }, ph.entities);
        let exitOk = false;
        for (let dr = -1; dr <= 3 && !exitOk; dr++) {
          for (let d = -1; d <= 1 && !exitOk; d++) {
            if (sub.has(`${exitCell.c + d},${exitCell.r + dr}`)) exitOk = true;
          }
        }
        if (exitOk) continue;

        // GATE A (the child is already IN the ink — the warp fires by itself)
        // was decided above, before the sweep. What is left here is dry.
        //
        // ── GATE B · DECLARATION. A pocket the child stands in DRY, with ink
        // only a deliberate step away, is a SOFTLOCK unless the phase says the
        // dive is the design. (R5-P1 excused this whole class blanket-style —
        // "the p1 Keller … one class". Kokis Replay 2026-08-11 refuted that
        // reading at the exact cell: he stood on the Buchdeckel, could only go
        // down, and the only way out was to walk into a hazard he could not
        // see was an exit. A hazard is not an affordance unless it is authored
        // as one.) Spikes "^" never warp (sim.ts is glyph-precise on "w") and
        // can therefore never satisfy either gate.
        let inkInReach = false;
        for (const k2 of sub) {
          const [c2, r2] = k2.split(",").map(Number) as [number, number];
          if (glyphAt(ph.rows, c2, r2) === "w" || glyphAt(ph.rows, c2, r2 + 1) === "w") { inkInReach = true; break; }
        }
        if (declaredDives.has(k) && inkInReach) { provenDives.add(k); continue; }

        failures.push({
          phase: ph.id,
          law: "trap-pocket",
          detail: inkInReach
            ? `standing at (${c},${r}) the exit is no longer reachable and the only way out is the ink — a hazard is not an exit unless the phase declares it (add {c,r,whyDe} to inkReturns)`
            : `standing at (${c},${r}) the exit is no longer reachable (softlock)`,
        });
        break; // one report per phase is enough to fail the gate
      }

      // …and the declaration must be TRUE. Runs OUTSIDE the break above, so a
      // healed pocket's stale excuse is still caught (the letter-honesty shape:
      // what a level PROMISES and what it CONTAINS are proven against each
      // other in both directions).
      for (const d of ph.inkReturns ?? []) {
        const key = `${d.c},${d.r}`;
        if (provenDives.has(key)) continue;
        const why = !standable(ph.rows, d.c, d.r)
          ? "which is not a standing cell — a dive is declared FROM somewhere a child can stand"
          : !reach.has(key)
            ? "which no child can reach — an excuse for a place nobody visits"
            : submerged(ph.rows, d.c, d.r)
              ? "which is already IN the ink — the warp fires by itself there, so nothing needs excusing"
              : "but the exit is reachable from there without ink — a stale excuse outlives the pocket it excused";
        failures.push({ phase: ph.id, law: "ink-return", detail: `inkReturns names (${d.c},${d.r}), ${why}` });
      }
    }
  }

  // ── L0 · D5 · trail-words · EIN DEKLARIERTES WORT IST EINE ZUSAGE ──────────
  //
  // Nur für Phasen, die ihre Wörter SELBST deklarieren. `letterGlyphs` verteilt
  // die Buchstaben zyklisch über die `*`-Zellen: sind es zu wenige Buchstaben,
  // fängt das Wort mittendrin von vorne an, sind es zu viele, bricht es ab.
  // Beides sieht im Spiel nach einem Wort aus und ist keines — genau die Klasse
  // Fehler, die niemand beim Durchlaufen bemerkt. Kapitel 1, dessen Wörter im
  // Kunst-Manifest stehen, ist bewusst NICHT betroffen: dort ist der Trail
  // gegen die gemalte Komposition geprüft (`check-composition`), und der
  // Bonusraum darf seine Nachlese-Phrase absichtlich wiederholen.
  // L0 · N1: nur ein BUCHSTABEN-Trail buchstabiert etwas. Ein Kapitel, das
  // Federn sammelt, hat kein Wort — und ein Gesetz, das dort trotzdem Buchstaben
  // gegen Sterne rechnet, wäre ein rotes Licht ohne Aussage.
  const zaehltBuchstaben = (level.collectSkin ?? "letters") === "letters";
  for (const ph of allPhases(level)) {
    if (ph.words === undefined) continue;
    if (!zaehltBuchstaben) {
      failures.push({ phase: ph.id, law: "trail-words", detail: `declares words ${JSON.stringify(ph.words)} but the chapter collects „${level.collectSkin}", not letters — the words would spell nothing anyone sees` });
      continue;
    }
    const stars = ph.rows.reduce((n, row) => n + [...row].filter((g) => g === "*").length, 0);
    const letters = ph.words.join("").toUpperCase().replace(/[^A-Z]/g, "").length;
    if (letters === 0) {
      failures.push({ phase: ph.id, law: "trail-words", detail: `words ${JSON.stringify(ph.words)} spells no letter at all — a declaration that spells nothing leaves the trail counting A→Z, which is what the declaration was for` });
    } else if (letters !== stars) {
      failures.push({ phase: ph.id, law: "trail-words", detail: `words ${JSON.stringify(ph.words)} spells ${letters} letter(s) but the grid carries ${stars} „*" — the trail would ${letters < stars ? "restart the word mid-trail" : "break off before the word ends"}` });
    }
  }

  // ── L0 · D7 · cage-captive-key · DIE FORM DES INSASSEN-SCHLÜSSELS ──────────
  //
  // `params.captive` wird zum Blatt-Namen `captive_<key>`. Bis zur Level-Welle
  // stand dahinter eine feste ch01-Liste von vier Schlüsseln; jedes weitere
  // Kapitel hätte seine eigenen gebraucht, also prüft der Motor jetzt die FORM
  // statt der Mitgliedschaft. Ein Großbuchstabe oder ein Leerzeichen ergäbe
  // einen Dateinamen, den keine Kunst-Bestellung je trifft — und weil fehlende
  // Kunst hier legal zurückfällt, wäre der Tippfehler unsichtbar.
  for (const ph of allPhases(level)) {
    for (const e of ph.entities) {
      const key = e.params?.captive;
      if (key === undefined) continue;
      if (typeof key !== "string" || !/^[a-z0-9]+$/.test(key)) {
        failures.push({ phase: ph.id, law: "cage-captive-key", detail: `cage ${e.id}: params.captive „${String(key)}" is no stem name — a captive key is lower-case letters and digits only, because it becomes the sheet captive_<key>` });
      }
    }
  }

  failures.push(...clothLawFailures(level));
  return failures;
};

// ── R5-W5 · G4 · THE SCATTERED UNIFORM (UNIFORM_SAMMELN_DESIGN §1/§5) ────────

/** What a uniform piece may carry, and nothing else. Same guard as the rule
 *  page's `TIP_PARAM_KEYS` and for the same reason: a typo in a params key does
 *  not fail a schema, it reaches the CHILD — as a word bubble with nothing in it,
 *  or as a Nachlese twin that stands there again after the piece was found. */
export const CLOTH_PARAM_KEYS: ReadonlySet<string> = new Set(["wordEn", "repeatOf", "hidden"]);

/** How far apart two pieces sit on one floor, in columns. The design's own
 *  spacing figure is „ein Teil je Bildschirm-Drittel, Abstand also ≈ 21" — but it
 *  says in the same breath that the column numbers are a GUARDRAIL and the real
 *  requirement is a named terrain moment per piece (which the dossier manifest,
 *  Block 5, makes hard). A law may only demand what terrain can actually give:
 *  ch01's floors put their landings where they put them, and the tightest honest
 *  pair in this chapter measures 8 columns. The law therefore holds the design's
 *  OWN hard floor — the 6 it states for the Nachlese — so that a later hand can
 *  still not drop two pieces on top of each other. */
export const CLOTH_MIN_SEPARATION = 6;

/** The Nachlese's own spacing. The design asks for ≥ 6 columns there too, and
 *  that number cannot be met: the Kleckskammer is 44 columns wide, of which 42
 *  are standable, and nine pieces at 6 columns apart need 49. Measured, not
 *  estimated. The room is laid out at the widest even spacing it can carry
 *  (4–5 columns) and the law holds THAT. Reported to the architect as a
 *  design↔geometry conflict rather than silently rounded away. */
export const CLOTH_P9_MIN_SEPARATION = 4;

/** The jump band: a piece meant as a jump target sits 2 to 4 tiles above its own
 *  run line. The upper bound is not a taste call — `REACH_ENVELOPE.JUMP_UP` is
 *  the proven jump height this chapter checks reachability against, so a piece
 *  at 5 would be a piece no child can take. */
export const CLOTH_JUMP_BAND: readonly [number, number] = [2, REACH_ENVELOPE.JUMP_UP];

/** The run line a piece sits above: the LOWEST standable row within five columns
 *  of it. A phase like p3 is a staircase, so one global floor line would call a
 *  piece on the third step „five tiles up" and a piece on the first step
 *  „ground" when both are simply on the path — the local reading is the one that
 *  matches what a child walking there experiences. */
const runLineBelow = (rows: readonly string[], c: number, r: number): number => {
  const width = rows[0]?.length ?? 0;
  let line = r;
  for (let cc = Math.max(0, c - 5); cc <= Math.min(width - 1, c + 5); cc++) {
    // `standable` alone is not enough here, and the shipped chapter proved it:
    // the SURFACE OF AN INK POOL passes it (a cell with something solid under it
    // and headroom above), so a piece lying beside a pool measured as though the
    // pool floor were its run line — p3's socks came out „5 tiles up" while lying
    // flat on the ground next to the pond. A run line is somewhere a child can
    // actually stand, and ink is the one place they cannot.
    for (let rr = r; rr < rows.length; rr++) {
      if (standable(rows, cc, rr) && !submerged(rows, cc, rr)) line = Math.max(line, rr);
    }
  }
  return line;
};

/**
 * The uniform's three laws, kept in their own function so the chapter's one big
 * law body does not grow a fourth page and so the lane that owns them owns one
 * place. Called from `checkLevelLaws` above.
 *
 *  · `cloth-honesty` — every piece names its word, every word lies on the floors
 *    exactly ONCE, the arena stays free, and every Nachlese twin truthfully names
 *    the piece it repeats. The last one is load-bearing: the engine silences a
 *    twin by looking its `repeatOf` up in the pickup ledger, so a twin that names
 *    nothing (or names the wrong piece) is a piece the child meets twice and a
 *    naming card fired on a word they already have.
 *  · `cloth-reach` — no piece stands IN the ink, and none sits with its back
 *    against it. Visible beside the danger is wanted (design §1); reachable only
 *    THROUGH it is forbidden. Full reachability is not repeated here: `cloth`
 *    joined `PICKUP_ROLES`, so `entity-reachable` already covers it.
 *  · `cloth-spacing` — per floor: exactly three pieces, at least one in the jump
 *    band, at least one on the run line, and no two closer than
 *    `CLOTH_MIN_SEPARATION`. In the Nachlese: all on the floor, spaced by
 *    `CLOTH_P9_MIN_SEPARATION`.
 */
export const clothLawFailures = (level: PaintLevel): LawFailure[] => {
  const out: LawFailure[] = [];
  const cloth = (p: PhaseSpec): EntitySpec[] => p.entities.filter((e) => e.role === "cloth");
  const wordOf = (e: EntitySpec): string =>
    typeof e.params?.wordEn === "string" ? e.params.wordEn.trim() : "";

  // ── honesty, on the floors ────────────────────────────────────────────────
  const homeOf = new Map<string, string>(); // piece id → its word
  const firstSeen = new Map<string, string>(); // word → the piece that owns it
  for (const ph of level.phases) {
    for (const e of cloth(ph)) {
      const w = wordOf(e);
      if (w === "") {
        out.push({ phase: ph.id, law: "cloth-honesty", detail: `${e.id} carries no params.wordEn — the find would flash an empty bubble and its card would ask about nothing` });
        continue;
      }
      homeOf.set(e.id, w);
      const first = firstSeen.get(w);
      if (first !== undefined) {
        out.push({ phase: ph.id, law: "cloth-honesty", detail: `„${w}" lies on the floors twice (${first} and ${e.id}) — each word is found exactly once, or the every-third-find card asks about a word the child already banked` });
      } else firstSeen.set(w, e.id);
      if (e.params?.repeatOf !== undefined) {
        out.push({ phase: ph.id, law: "cloth-honesty", detail: `${e.id} declares repeatOf on a FLOOR — repeating belongs to the Kleckskammer's Nachlese; a floor piece that repeats another would be silenced by the ledger and never found at all` });
      }
      for (const k of Object.keys(e.params ?? {})) {
        if (!CLOTH_PARAM_KEYS.has(k)) {
          out.push({ phase: ph.id, law: "cloth-honesty", detail: `${e.id}: unknown params field „${k}" — a uniform piece carries ${[...CLOTH_PARAM_KEYS].join(", ")} and nothing else; a typo here reaches the child as a missing word` });
        }
      }
    }
  }
  if (level.arena) {
    for (const e of cloth(level.arena)) {
      out.push({ phase: level.arena.id, law: "cloth-honesty", detail: `${e.id} lies in the arena — that room belongs to the boss, and a collectible there competes with a fight (design §8, answer 3)` });
    }
  }

  // ── the Nachlese: a second chance, never a second piece ───────────────────
  if (level.bonus) {
    for (const e of cloth(level.bonus)) {
      const rep = typeof e.params?.repeatOf === "string" ? e.params.repeatOf : "";
      if (rep === "") {
        out.push({ phase: level.bonus.id, law: "cloth-honesty", detail: `${e.id} repeats nothing — every piece down here is a SECOND chance at a piece from a floor and must name it in params.repeatOf, or the ledger cannot silence it once the original is found` });
        continue;
      }
      const home = homeOf.get(rep);
      if (home === undefined) {
        out.push({ phase: level.bonus.id, law: "cloth-honesty", detail: `${e.id} repeats „${rep}", which is no uniform piece on any floor — the ledger would never silence this twin, so a child who already has the piece meets it a second time` });
      } else if (home !== wordOf(e)) {
        out.push({ phase: level.bonus.id, law: "cloth-honesty", detail: `${e.id} says „${wordOf(e)}" but repeats ${rep}, which is „${home}" — the twin and its original must be the same word` });
      }
      for (const k of Object.keys(e.params ?? {})) {
        if (!CLOTH_PARAM_KEYS.has(k)) {
          out.push({ phase: level.bonus.id, law: "cloth-honesty", detail: `${e.id}: unknown params field „${k}" — see CLOTH_PARAM_KEYS` });
        }
      }
    }
  }

  // ── reach and placement ───────────────────────────────────────────────────
  const placed = [...level.phases.map((p) => ({ p, floor: true })), ...(level.bonus ? [{ p: level.bonus, floor: false }] : [])];
  for (const { p, floor } of placed) {
    const here = cloth(p);
    if (here.length === 0) continue;

    for (const e of here) {
      if (submerged(p.rows, e.c, e.r)) {
        out.push({ phase: p.id, law: "cloth-reach", detail: `${e.id} at (${e.c},${e.r}) stands IN the ink — the warp fires there, so the piece is taken by nobody` });
      }
      // the ground the piece rests on, and the ground either side of it: if any
      // of the three is ink, the child is picking it up on the very brink
      const brink = [-1, 0, 1].some((d) => glyphAt(p.rows, e.c + d, e.r + 1) === "w");
      if (brink) {
        out.push({ phase: p.id, law: "cloth-reach", detail: `${e.id} at (${e.c},${e.r}) sits on the very brink — the design allows a piece 1 to 4 tiles from an ink edge, but wants at least one tile of firm ground between, so a misstep while picking it up does not end in the ink` });
      }
    }

    const cols = here.map((e) => e.c).sort((a, b) => a - b);
    const min = floor ? CLOTH_MIN_SEPARATION : CLOTH_P9_MIN_SEPARATION;
    for (let i = 1; i < cols.length; i++) {
      if (cols[i]! - cols[i - 1]! < min) {
        out.push({ phase: p.id, law: "cloth-spacing", detail: `two pieces sit ${cols[i]! - cols[i - 1]!} columns apart (minimum ${min}) — pieces that share a screen are one find, not two` });
      }
    }

    const heights = here.map((e) => runLineBelow(p.rows, e.c, e.r) - e.r);
    if (floor) {
      if (here.length !== 3) {
        out.push({ phase: p.id, law: "cloth-spacing", detail: `${here.length} uniform pieces on this floor — the chapter places three per floor (3/3/3, design §1)` });
      }
      const [lo, hi] = CLOTH_JUMP_BAND;
      if (!heights.some((h) => h >= lo && h <= hi)) {
        out.push({ phase: p.id, law: "cloth-spacing", detail: `no piece sits ${lo}–${hi} tiles above its run line (measured: ${heights.join(", ")}) — height is the main axis of a jump-and-run, and a floor whose pieces all lie underfoot never asks for a jump` });
      }
      if (!heights.some((h) => h === 0)) {
        out.push({ phase: p.id, law: "cloth-spacing", detail: `no piece lies ON the run line (measured: ${heights.join(", ")}) — at least one find per floor must cost nothing but walking, or a child who cannot make the jump loses the word as well` });
      }
    } else if (heights.some((h) => h !== 0)) {
      out.push({ phase: p.id, law: "cloth-spacing", detail: `the Nachlese holds a piece off the floor (measured: ${heights.join(", ")}) — down here reachability comes before choreography (design §1)` });
    }
  }
  return out;
};
