// THE CARD GALLERY (R5-W1 · D1) — dev-only, never reachable in production.
//
// Why it exists: this packet rebuilds NINE card kinds and ELEVEN ceremony
// panels. Reaching each of them in the running game costs a play-through per
// item and can only ever photograph the ones ch01 happens to place — the
// `spell` kind is not in ch01's palette at all (doc 41 §1), so it has no frame
// in any replay Koki has ever recorded. A bench that mounts every surface from
// its own fixtures turns „prove it looks better" from a day into a minute, and
// makes the before/after gallery HONEST: the same bench photographs both sides.
//
// Three rules it follows, so it stays a measuring instrument rather than a
// second reality:
//  · REAL COMPONENTS ONLY. It renders the shipped `CardHost` and the shipped
//    ceremony `Overlay` (handed in as a prop, so this file never imports
//    PaintGame and Phaser can never leak into a second chunk — the bundle law).
//  · REAL CONTENT WHERE IT EXISTS. The cards come from the chapter's own
//    tasks file and the ceremonies from the chapter's own level; only `spell`
//    is synthetic, and it says so on the tile.
//  · ONE SURFACE PER URL. `?karten=<id>` renders exactly one stage at the
//    game's own size, which is what a screenshot wants; `?karten=1` lists them.
import React from "react";
import type { GameTaskV2 } from "@domigo/content-schema";
import type { PaintLevel } from "../level.ts";
import { CardHost } from "../cards/CardHost.tsx";
import { CardShell } from "../cards/CardShell.tsx";
import { answerTextOf } from "../cards/resolution.ts";
import { PAINT_OVERLAY_CSS } from "../cards/overlay-css.ts";
import { LOGICAL_H, LOGICAL_W, RENDER_SCALE } from "../paint.ts";
import { benchBilanz } from "./bench-counts.ts";

/** The ceremony renderer, handed in by PaintGame. Typed structurally — the
 *  gallery must not import PaintGame (see the bundle note above). */
export type OverlayRenderer = (props: Record<string, unknown>) => React.ReactElement;

export interface GalleryProps {
  level: PaintLevel;
  art: Record<string, string>;
  tasks: GameTaskV2[];
  Overlay: OverlayRenderer;
  /** which surface to show; "1" (or undefined) shows the index */
  which?: string;
  /** R5-W6b · W5 · WELCHE Karte eine Karten-Flaeche zeigt (`?karte=<task-id>`).
   *  Ohne sie nimmt die Bank die erste Karte ihrer Art. */
  karte?: string;
}

/** the stage a card is judged on: the game's own viewport, with the chapter's
 *  own painted backdrop behind it. A card judged over white is a card judged
 *  over a world that does not exist. */
const STAGE_W = LOGICAL_W * RENDER_SCALE;
const STAGE_H = LOGICAL_H * RENDER_SCALE;

/** the chapter's own rooms, rotated behind the surfaces */
const BACKDROPS = ["l1_p1_a", "l1_p2_a", "l1_p3_a", "l1_p4_a", "l1_p1_b", "l1_p2_b", "l1_p3_b", "l1_p4_b"];

const SYNTHETIC_SPELL: GameTaskV2 = {
  id: "gallery.synthetic.spell",
  use: "encounter",
  kind: "spell",
  stimulus: { type: "entity", showsDe: "Ein grauer Bleistift hält Buchstaben hoch", art: "pencil_a" },
  storyDe: "Leg die Buchstaben in die richtige Reihenfolge!",
  promptEn: "What is it?",
  answer: "pen",
  extraLetters: "rt",
  skins: ["pencil"],
  phases: ["p1"],
  hints: { deDesc: "Das Schreibgerät mit Tinte.", deWord: "a pen" },
} as unknown as GameTaskV2;

/** L2-M-a: die Zuordnungs-Karte, bis L2-G2 eine echte ins Kapitel traegt.
 *  Wortlaut nach dem Vertrag in ch02-dossiers-v2/pending-tasks.md. */
const SYNTHETIC_MATCH: GameTaskV2 = {
  id: "gallery.synthetic.match",
  use: "encounter",
  kind: "match",
  form: "match-it",
  exercises: ["g1u02.s.prepositions-place"],
  stimulus: { type: "entity", showsDe: "Die Erdmännchen halten vier Schilder hoch" },
  storyDe: "Bring die Schilder zu ihren Tieren zurück!",
  pairs: [
    { left: "The monkey", right: "in the tree" },
    { left: "The penguin", right: "in the water" },
    { left: "The lion", right: "under the tree" },
    { left: "The parrot", right: "on the car" },
  ],
  skins: ["erdmaennchen"],
  phases: ["p1"],
} as unknown as GameTaskV2;

/** The bonus room's phrase, laid out the way the room lays it out: the first
 *  `caught` letters inked, the rest left blank. Deterministic — the bench may
 *  never draw a different card twice. */
const phraseOf = (text: string, caught: number): { char: string; taken: boolean }[][] => {
  let n = 0;
  return text.split(" ").map((word) => [...word].map((char) => {
    n += 1;
    return { char, taken: n <= caught };
  }));
};

/** one entry of the bench */
interface Surface {
  id: string;
  label: string;
  note?: string;
  /** R5-W6b · W5: WELCHE Karte diese Flaeche wirklich zeigt (nur Karten-
   *  Flaechen haben eine; Zeremonien-Panels nicht). Das Werkzeug liest sie
   *  ueber `data-karte` — ohne sie wuerde ein Zeremonien-Panel eine
   *  `--card`-Bestellung stumm bestaetigen und das Bild traege im Dateinamen
   *  eine Karte, die darauf nicht zu sehen ist. */
  taskId?: string;
  render: () => React.ReactElement;
}

const noop = (): void => {};

/**
 * R5-W6b · W5 · WELCHE Karte eine Flaeche zeigt, wenn eine namentlich bestellt
 * wurde. Die volle id oder ihr Ende: `obj-book.r1` genuegt,
 * `g1.paint.ch01.enc.obj-book.r1` geht auch.
 *
 * Mehrdeutig und unbekannt sind FEHLER, nie ein Zufallstreffer und nie ein
 * stiller Rueckfall auf die erste Karte der Art: D-206 hat einmal gekostet,
 * dass ein Pruefer ein anderes Ding beurteilt hat, als er angefordert hatte,
 * ohne es zu merken. Eigene Funktion, damit dieses Gesetz einen Test hat.
 */
export const waehleKarte = (
  tasks: readonly GameTaskV2[],
  karte: string | undefined,
): { gewaehlt: GameTaskV2 | undefined; kartenFehler: string | null } => {
  if (karte === undefined) return { gewaehlt: undefined, kartenFehler: null };
  const treffer = tasks.filter((t) => t.id === karte || t.id.endsWith(`.${karte}`));
  if (treffer.length === 1) return { gewaehlt: treffer[0], kartenFehler: null };
  return {
    gewaehlt: undefined,
    kartenFehler: treffer.length === 0
      ? `keine Karte mit der id »${karte}« im Kapitel (${tasks.length} Karten)`
      : `»${karte}« trifft ${treffer.length} Karten: ${treffer.map((t) => t.id).join(" · ")}`,
  };
};

export default function CardGallery({ level, art, tasks, Overlay, which, karte }: GalleryProps): React.ReactElement {
  // R5-W6b · W5 · C5s Befund (D-386-Nachbar): `byKind` nimmt die ERSTE Karte
  // ihrer Art. Bei `restore` ist das immer der Radiergummi — ein Schirmbild der
  // BUCH-Karte war deshalb nicht herstellbar, und eine Farb-Lieferung liess
  // sich nie in der Karte ansehen, in der das Kind sie sieht.
  //
  // `?karte=<task-id>` waehlt sie namentlich, und zwar OHNE Rueckfall: eine
  // unbekannte id zeigt eine sichtbare Fehlzeile statt der ersten Karte. Eine
  // stille Ersatzkarte waere genau der Bank-Fehler, den D-206 schon einmal
  // gekostet hat — ein Pruefer beurteilt sonst ein anderes Ding, als er
  // angefordert hat, und merkt es nicht.
  const { gewaehlt, kartenFehler } = waehleKarte(tasks, karte);
  const byKind = (kind: string): GameTaskV2 | undefined => {
    if (gewaehlt !== undefined) return gewaehlt.kind === kind ? gewaehlt : undefined;
    return tasks.find((t) => t.kind === kind);
  };

  // the chapter's own rule pages, so the tip panels show real Merksätze.
  // R5-W4 · I2: found by ROLE, not by „carries a merksatzDe" — the old predicate
  // would have handed the bench any future entity that happened to grow that
  // param, and a bench fixture picked by accident is a bench that reviews the
  // wrong thing.
  //
  // ★ R5-W9 · N1 · ALLE Regel-Seiten, nicht nur die erste. Die Bank suchte
  // `.find(e => e.role === "tip")` und hat damit VIER VON FÜNF Seiten nie
  // gesehen: Kokis Befund D-770 („die Regel-Seiten sind didaktisch flach") war
  // an genau EINER Seite fotografierbar und an vier nicht. Dieselbe Klasse wie
  // D-518 und D-525 — eine Fläche, die es nicht gibt, wird nie geprüft.
  //
  // Die PHASE reist mit dem Eintrag, weil der Schnitt durch die Karte auf die
  // Platte ihres Raums schaut (D2): fünf Regel-Seiten im selben Flur wären
  // wieder die eine Kulisse, gegen die ein blinder Kritiker schon einmal
  // geurteilt hat („the identical hallway reused across five ceremonies").
  const tipEntries = [...level.phases, ...(level.arena ? [level.arena] : [])]
    .flatMap((p) => p.entities.filter((e) => e.role === "tip").map((e) => ({ e, phaseId: p.id })));
  /** Die Attrappe der n-ten Regel-Seite. Fehlt sie im Kapitel, sagt die Bank das
   *  LAUT (sichtbarer Fehl-Titel) statt still die erste zu zeigen — D-206s
   *  Gesetz, hier auf die Seiten angewandt. */
  const tipFixtureAt = (i: number): Record<string, unknown> => {
    const e = tipEntries[i]?.e;
    return {
      id: String(e?.id ?? `tip-${i + 1}`),
      skin: String(e?.skin ?? "regelseite"),
      topicDe: String(e?.params?.topicDe ?? `⚠ keine ${i + 1}. Regel-Seite im Kapitel`),
      erklaerungDe: String(e?.params?.erklaerungDe ?? ""),
      merksatzDe: String(e?.params?.merksatzDe ?? "—"),
      schluesselDe: String(e?.params?.schluesselDe ?? ""),
      beispieleEn: Array.isArray(e?.params?.beispieleEn)
        ? e.params.beispieleEn.filter((x): x is string => typeof x === "string")
        : [],
      // R5-W9 · N1: die zwei Felder, die die neue Seite zeichnen — ohne sie
      // fotografierte die Bank eine Karte ohne Marken und ohne Lese-Form, also
      // nicht die ausgelieferte.
      lehrtEn: Array.isArray(e?.params?.lehrtEn)
        ? e.params.lehrtEn.filter((x): x is string => typeof x === "string")
        : [],
      beispielMuster: String(e?.params?.beispielMuster ?? "einzeln"),
      belegDe: String(e?.params?.belegDe ?? ""),
    };
  };
  /** der Raum, in dem die n-te Regel-Seite liegt (Vorgabe p1, wie bei jeder Fläche) */
  const tipPhaseAt = (i: number): string => String(tipEntries[i]?.phaseId ?? "p1");
  const tipFixture = tipFixtureAt(0);
  const doorEntity = [...level.phases, ...(level.arena ? [level.arena] : [])]
    .flatMap((p) => p.entities)
    .find((e) => e.params?.price !== undefined);
  // R5-W4b · D3b · D-206: the cage the Käfig surface photographs, and the card
  // that belongs to it. The ENTITY is picked first and the task is found by its
  // key, so the panel can never show one cage's shell with another cage's
  // occupant behind it — the exact confusion the occupant layer exists to end.
  const cageEntity = [...level.phases, ...(level.arena ? [level.arena] : [])]
    .flatMap((p) => p.entities)
    .find((e) => e.role === "cage" && typeof e.params?.captive === "string");
  const cageCaptive = cageEntity === undefined ? undefined : String(cageEntity.params?.captive);
  const cageTask = cageCaptive === undefined
    ? undefined
    : tasks.find((t) => t.use === "rescue" && t.id.includes(cageCaptive));

  // R5-W4 · W2 · D-103: aus dem LEVEL abgeleitet, nicht getippt. Die alten
  // Literale sagten 6 Käfige und 1 Bonusbuch; das Kapitel hält 5 und 3 — der
  // blinde Kritiker beurteilte also eine Punkte-Seite, die es nie gab. Und
  // sobald I2 die Regel-Seiten auf 5 setzt und die Bücher löscht, wären auch
  // die heute noch richtigen Zahlen falsch. Herleitung + Begründung stehen in
  // `bench-counts.ts`, geprüft gegen `ch01.level.json` in `bench-fixture.test.ts`.
  const bilanz = benchBilanz(level);

  // R5-W1 · D2: WHICH ROOM a ceremony happens in. The scene cut looks through
  // the card at the phase's own plate, so a bench that runs every panel in p1
  // shows the same hallway five times — a blind critic counted that against the
  // panels („the identical hallway reused across five unrelated ceremonies").
  // In play they happen in different rooms; the bench says which.
  const ceremony = (id: string, label: string, o: Record<string, unknown>, note?: string, phase = "p1"): Surface => ({
    id, label, note,
    render: () => (
      <Overlay
        o={{ req: { use: "quickfire", ctx: { type: "ceremony", beat: "goal" } }, item: null, attempts: 0, typed: "", align: "center", ...o }}
        level={level}
        art={art}
        phaseId={phase}
        onResolve={noop}
        onWorldChange={noop}
        onDismiss={noop}
        onPay={noop}
        letters={24}
        bonusTotal={12}
        bilanz={bilanz}
        hubHref="/play/1"
        onRestart={noop}
      />
    ),
  });

  /** THE BENCH MUST NOT FLATTER OR SLANDER. A blind critic on the first full
   *  round wrote that the restore card „shows the eraser in full saturated
   *  colour, so ‚give it its colour back' has no visible payoff" — and it was
   *  right about the picture and wrong about the game: in play that portrait
   *  carries the being's live wash (the desaturation law, doc 41 §2) and IS
   *  grey. The bench was handing the verifier a projection the game never
   *  shows. It passes the world's own WASH_ALPHA now. */
  const DRAINED_WASH = 0.72;

  const card = (id: string, label: string, task: GameTaskV2 | undefined, extra?: Record<string, unknown>, note?: string): Surface => ({
    id, label, note, taskId: task?.id,
    render: () =>
      task === undefined ? (
        <p style={{ padding: 24, fontSize: 15 }}>
          {kartenFehler ?? (karte !== undefined
            ? `die Karte »${karte}« ist keine ${label}-Karte (sie ist ${gewaehlt?.kind})`
            : `keine ${label}-Karte im Kapitel`)}
        </p>
      ) : (
        <CardHost
          key={id}
          task={task}
          onResolve={noop}
          onDismiss={noop}
          align="right"
          art={art}
          servedUse={task.use}
          {...extra}
        />
      ),
  });

  /**
   * R5-W7 · W6 · DER VERDIKT-TAKT — »Zurück im Buch!«
   *
   * D4 hat die Fläche vermisst und den Grund genannt: die Bank kannte den
   * dritten Takt der Auflösung nicht, also war das einzige bildgetragene Stück
   * dieser Runde nicht fotografierbar.
   *
   * WAS AN DIESEM BILD ECHT IST, und was nicht — offen gesagt, weil ein
   * Bankbild, dessen Herkunft niemand kennt, die Bank selbst entwertet:
   *  · ECHT ist die ausgelieferte `CardShell` mit der ausgelieferten
   *    `AnswerHome`-Tafel darin, mit der ECHTEN Antwort der ECHTEN Karte des
   *    Kapitels (`answerTextOf`) — also genau das, was das Kind sieht.
   *  · NICHT gerendert ist der Karten-Rumpf dahinter. Er wäre auch unsichtbar:
   *    `AnswerHome` liegt mit `inset: 0` und deckendem Grund darüber. Statt
   *    einen Rumpf zu ERFINDEN, zeichnet diese Fläche gar keinen — eine leere
   *    Stelle ist ehrlich, eine nachgebaute wäre eine zweite Wirklichkeit.
   *
   * DIE NAHT, DIE HIER FEHLT (Route: die nächste Karten-Bahn). Der Weg über den
   * ausgelieferten `CardHost` wäre der bessere, und er ist HEUTE nicht möglich:
   * `CardHost` setzt seinen Takt ausschließlich selbst (`setBeat("letters")`
   * nach einer richtigen Antwort) und hat keine Naht, an der eine Bank ihn
   * setzen könnte — und `cards/**` gehört in dieser Welle einer anderen Bahn
   * (Eigentums-Karte). Ein `benchBeat`-Prop an `CardHost`, dev-only, würde diese
   * Fläche durch den echten Wirt führen; dann fällt der Absatz oben weg.
   */
  const answerHome = (id: string, label: string, task: GameTaskV2 | undefined, note?: string): Surface => ({
    id, label, note, taskId: task?.id,
    render: () =>
      task === undefined ? (
        <p style={{ padding: 24, fontSize: 15 }}>
          {kartenFehler ?? `keine Karte für den Verdikt-Takt im Kapitel`}
        </p>
      ) : (
        <CardShell
          key={id}
          task={task}
          attempts={0}
          onDismiss={noop}
          align="right"
          art={art}
          flight={answerTextOf(task)}
        >
          {/* bewusst leer — siehe den Block darüber */}
          <div aria-hidden />
        </CardShell>
      ),
  });

  const surfaces: Surface[] = [
    // ── the nine card kinds ────────────────────────────────────────────────
    card("choice", "choice", byKind("choice")),
    card("oddone", "oddone", byKind("oddone")),
    card("restore", "restore", byKind("restore"), { portraitWash: DRAINED_WASH },
      "der Radiergummi ist im Spiel GRAU, bis das Kind ihm die Farbe zurückgibt"),
    card("wheel", "wheel", byKind("wheel")),
    card("order", "order", byKind("order")),
    card("mistake", "mistake", byKind("mistake")),
    card("memory", "memory", byKind("memory")),
    // L2-M-a: bis L2-G2 die Karten ins Kapitel traegt, liefert kein Kapitel eine
    // `match`-Karte — also eine SYNTHETISCHE, nach dem Vorbild von `spell`.
    // Ohne sie zeigt die Bank eine Fehlzeile statt einer Flaeche.
    card("match", "match", SYNTHETIC_MATCH, undefined, "SYNTHETISCH — noch traegt kein Kapitel eine match-Karte (L2-G2 liefert sie)"),
    card("typed", "typed", byKind("typed")),
    card("spell", "spell", SYNTHETIC_SPELL, undefined, "SYNTHETISCH — ch01 führt keine spell-Karte (doc 41 §1)"),
    // the two states a card also has to survive: the hint ladder open, and a
    // reawakening round counter above it
    card("choice-hints", "choice · Hinweis-Ebene", byKind("choice"), { round: { n: 3, of: 6 } },
      "Hinweise erscheinen erst nach Fehlversuchen — im Bench über die Runden-Zeile sichtbar gemacht"),
    // R5-W4b · D3b · D-206 · DIE KÄFIG-KARTE HAT JETZT EINE FLÄCHE.
    // D3a baute das Insassen-Portrait (Käfig-Hülle + Insasse dahinter) und
    // konnte es nirgends fotografieren: die Bank kannte keine Käfig-Karte, also
    // ist die einzige bildgetragene Neuerung der Runde ungeprüft geblieben.
    // Karte UND Insasse werden aus dem Kapitel abgeleitet und über den
    // Schlüssel aneinandergebunden (W2s D-103: was die Bank tippt, kann sie
    // falsch tippen) — findet sich kein Paar, sagt die Fläche das laut.
    card("kaefig", "Käfig · Insasse im Portrait", cageTask, { captive: cageCaptive },
      "das Portrait zeigt die Käfig-Hülle mit dem Insassen dahinter (R54)"),
    // R5-W7 · W6 · D4s Befund 4: der dritte Takt der Auflösung hatte keine
    // Fläche. Die Karte ist die des Kapitels, die Antwort ihre eigene.
    answerHome("answer-home", "Verdikt · »Zurück im Buch!«", byKind("choice"),
      "der Takt, in dem die Antwort ins Buch zurückfliegt — der Rumpf dahinter ist bewusst nicht gezeichnet"),
    // ── the eleven ceremony panels ─────────────────────────────────────────
    // R5-W2 · J1-B · the opening's four beats, each photographable on its own.
    // `goal` keeps its id: it is the address the bench has always used for beat 1.
    ceremony("goal", "Auftakt · 1 · Das Buch schlägt auf", { card: "goal" }),
    ceremony("auftakt-schatten", "Auftakt · 2 · Was geschehen ist", { card: "schatten" }),
    ceremony("auftakt-aufgaben", "Auftakt · 3 · Dein Auftrag", { card: "aufgaben" }),
    // R5-W7 · D5: die VIERTE Fläche, die seit J2/R29 fehlte. Der Auftakt-Takt hat
    // sich damals in »Dein Auftrag« und »Was du sammelst« geteilt; die Bank hat
    // die zweite Hälfte nie bekommen, also war der Takt, der die Sammel-Legende
    // trägt, schlicht nicht fotografierbar. (Eine angehängte Zeile, wie es die
    // Flächenliste ausdrücklich vorsieht — an W6 gemeldet.)
    ceremony("auftakt-sammeln", "Auftakt · 4 · Was du sammelst", { card: "sammeln" }),
    ceremony("auftakt-los", "Auftakt · 5 · Los geht's", { card: "los" }),
    // R5-W2 · I1: the reading card has TWO beats, so the bench has two surfaces.
    // Both read the chapter's OWN page — a bench fixture that invents its copy
    // photographs a card nobody ships.
    ceremony("tip", "Regel-Seite · gefunden", { card: "tip", tip: tipFixture }, undefined, tipPhaseAt(0)),
    // ★ R5-W9 · N1: fünf Regel-Seiten, fünf Flächen. Bis hierher trug die Liste
    // EINE Lese-Fläche, und die zeigte immer die erste Seite des Kapitels —
    // vier Seiten waren nicht fotografierbar und damit nicht überprüfbar.
    // Angehängt, wie es die Flächenliste ausdrücklich vorsieht; die id
    // `tip-regel` bleibt die Adresse der ERSTEN Seite, damit ältere Aufrufe
    // weiter dasselbe Bild bekommen.
    ceremony("tip-regel", "Regel-Seite 1 · die Regel", { card: "regel", tip: tipFixtureAt(0) }, undefined, tipPhaseAt(0)),
    ceremony("tip-regel-2", "Regel-Seite 2 · die Regel", { card: "regel", tip: tipFixtureAt(1) }, undefined, tipPhaseAt(1)),
    ceremony("tip-regel-3", "Regel-Seite 3 · die Regel", { card: "regel", tip: tipFixtureAt(2) }, undefined, tipPhaseAt(2)),
    ceremony("tip-regel-4", "Regel-Seite 4 · die Regel", { card: "regel", tip: tipFixtureAt(3) }, undefined, tipPhaseAt(3)),
    ceremony("tip-regel-5", "Regel-Seite 5 · die Regel", { card: "regel", tip: tipFixtureAt(4) }, undefined, tipPhaseAt(4)),
    ceremony("score", "Bilanz-Seite", { card: "score" }),
    ceremony("out", "Tür hinaus", { card: "out" }),
    ceremony("grant", "Die Gabe", { card: "grant" }, undefined, "p2"),
    ceremony("cagehint", "Käfig-Hinweis", { card: "cagehint" }),
    ceremony("bonuspay", "Kleckskammer-Tür", { card: "bonuspay", price: Number(doorEntity?.params?.price ?? 6) }, undefined, "p2"),
    // R5-W1 · D2: the payload C1 ships, not the one the bench was still guessing.
    // A blind critic read „Der Käfig springt auf — ist frei!" as a broken text
    // interpolation in the GAME; it was the bench handing the panel a captive
    // with no name (the old `classmate` field). The level law „cage-captive"
    // makes that state unreachable in play — the bench had invented it.
    // R5-W4b · D3b · R54: …and the OCCUPANT's key, which the payload grew this
    // wave. Without it the bench would photograph the fallback mark and a critic
    // would judge the one thing the panel is not: the ceremony draws who came
    // out of the cage, and these two fixtures are how that gets reviewed. Both
    // values are the level's own („merle" is the classmate the person-cage
    // names, „soundsystem" the captive key the p3 cage carries).
    ceremony("ceremony-merle", "Rettung · Klassenkind", {
      card: "ceremony",
      ceremony: { skin: "satchel", captiveDe: "Merle", person: true, first: true, captive: "merle" },
    }, "Personen-Käfig — die Klassenkameradin"),
    ceremony("ceremony-wisp", "Rettung · Ding", {
      card: "ceremony",
      ceremony: { skin: "satchel", captiveDe: "die Musikanlage", person: false, first: false, captive: "soundsystem" },
    }, "Objekt-Käfig — ch01 hält vier davon", "p3"),
    ceremony("console", "Trost-Karte", { card: "console", typed: "hello" }, undefined, "p4"),
    // R5-W1 · D2: the payload the SHIPPED card takes, not the one the bench
    // once guessed. C1 gave this ceremony the room's own phrase and its leftover
    // seconds; the bench kept handing it the old three fields and the panel
    // simply stopped rendering — which is the bench failing loudly, exactly as
    // it should. The phrase is built the way the room builds it: the letters
    // this run caught are inked, the ones it missed stay blank.
    ceremony("bonusend-perfect", "Kleckskammer · perfekt", {
      card: "bonusend",
      bonusend: { got: 12, total: 12, timeout: false, secsLeft: 14, phrase: phraseOf("SCHOOL THINGS", 12) },
    }),
    ceremony("bonusend-timeout", "Kleckskammer · Zeit aus", {
      card: "bonusend",
      bonusend: { got: 7, total: 12, timeout: true, secsLeft: 0, phrase: phraseOf("SCHOOL THINGS", 7) },
    }),
  ];

  const one = surfaces.find((s) => s.id === which);

  return (
    <div style={{ fontFamily: "var(--font-body, system-ui, sans-serif)", color: "#3b3122" }}>
      <style>{PAINT_OVERLAY_CSS}</style>
      {/* the dev server's own floating badge sits in the corner of every frame
          the bench shoots; a blind critic listed it as a defect of the GAME
          („a generic black N circle … identical across all 10 images"). The
          instrument may not put its own furniture in the evidence. */}
      <style>{"nextjs-portal{display:none!important}"}</style>
      {one === undefined ? (
        <>
          <h1 style={{ fontSize: 20, margin: "0 0 4px", fontFamily: "var(--font-display, inherit)" }}>
            Karten-Bench — {surfaces.length} Flächen
          </h1>
          <p style={{ fontSize: 13, color: "#7a6a4a", margin: "0 0 14px" }}>
            Eine Fläche pro Adresse: <code>?karten=&lt;id&gt;</code>. Nur Entwicklung, nie in Produktion.
          </p>
          <ul style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 6, listStyle: "none", padding: 0 }}>
            {surfaces.map((s) => (
              <li key={s.id}>
                <a href={`?karten=${s.id}`} style={{ color: "#8a5a2b" }}>
                  {s.label} <span style={{ color: "#b7a980" }}>({s.id})</span>
                </a>
              </li>
            ))}
          </ul>
        </>
      ) : (
        // ONE surface, full bleed on a neutral ground: a screenshot of the bench
        // must be a screenshot of the CARD, not of the app's header and padding
        // around it. The label sits outside the stage and is cropped away by the
        // capture script, so nothing on the judged image is bench furniture.
        <div style={{ position: "fixed", inset: 0, background: "#171310", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8 }}>
          <p style={{ fontSize: 12, margin: 0, color: "#8d7f66" }}>
            <a href="?karten=1" style={{ color: "#b4884f" }}>← Bench</a>
            {"  ·  "}
            <b>{one.label}</b> <span style={{ color: "#6f6552" }}>({one.id})</span>
            {/* R5-W6b · W5: die Randnotiz einer Flaeche gilt der Karte, die die
                Flaeche VON SICH AUS zeigt. Wer eine andere waehlt, darf nicht
                die Notiz der ersten mitbekommen — sie wuerde ueber das falsche
                Bild reden, und ein Schirmbild traegt sie mit. */}
            {one.note !== undefined && gewaehlt === undefined && <>{"  ·  "}<i>{one.note}</i></>}
            {gewaehlt !== undefined && <>{"  ·  "}<i>Karte namentlich gewaehlt: {gewaehlt.id}</i></>}
          </p>
          <div
            data-testid="gallery-stage"
            /* R5-W6b · W5: maschinenlesbar, damit `shoot-card-bench --card` nicht
               eine Fehlzeile fotografiert und Exit 0 meldet. Steht hier die
               gewuenschte id NICHT, bricht das Werkzeug ab. */
            data-karte={gewaehlt !== undefined && one.taskId === gewaehlt.id ? gewaehlt.id : ""}
            style={{
              position: "relative", width: STAGE_W, height: STAGE_H, overflow: "hidden",
              borderRadius: 10, background: "#e9dcbc", flex: "0 0 auto",
            }}
          >
            {/* a DIFFERENT room behind each surface. One backdrop for all 22
                made every frame look like the same inert wall, and two blind
                critics counted that against the cards themselves („~50 % of
                every frame is inert"). The world a card interrupts is a
                different room every time; the bench says so. */}
            <img
              src={art[BACKDROPS[surfaces.findIndex((s) => s.id === one.id) % BACKDROPS.length]!] ?? art.l1_p1_a ?? ""}
              alt=""
              aria-hidden
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
            />
            {one.render()}
          </div>
        </div>
      )}
    </div>
  );
}
