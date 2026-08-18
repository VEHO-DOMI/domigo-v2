/**
 * R5 · S1 · DAS KLANG-MANIFEST — welcher Klang an welchem Ereignis hängt.
 *
 * Kanon: `docs/design/g1/paint/AUDIO_SPINE_CH01.md` §2b (die Stems) und §2d
 * (der Abdeckungs-Vertrag). Die Prompts, aus denen die Dateien entstanden sind,
 * stehen wörtlich in `docs/audio/prompts.ch01.json`; `scripts/check-audio.mjs`
 * erzwingt, dass Kanon, Prompts, dieses Manifest und die Platte dieselben Stems
 * nennen.
 *
 * ── Warum die Abdeckung ein TYP ist und keine Liste ─────────────────────────
 * Die drei Ereignis-Tabellen unten sind mit `satisfies Record<…Kind, …>`
 * gebunden. Kommt im Spiel eine neue Ereignis-Art dazu, geht `pnpm typecheck`
 * rot — genau in dem Augenblick, in dem jemand entscheiden muss, wie sie klingt.
 * Eine handgepflegte Liste hätte diese Eigenschaft nicht: sie wäre am Tag ihrer
 * Entstehung vollständig und danach nie wieder. Ein blinder Prüfer fand in der
 * ersten Fassung dieses Kanons SIEBEN Ereignisse, die niemand klassifiziert
 * hatte — darunter `task`, aus dem jede einzelne Karte kommt.
 *
 * ── Drei Zustände, kein vierter ─────────────────────────────────────────────
 *   `play`     — es klingt, und die Datei liegt auf der Platte
 *   `silent`   — es klingt bewusst nicht, MIT Grund
 *   `reserved` — es kann in ch01 gar nicht feuern; der Grund nennt das Kapitel
 *                das es freischaltet. Für `reserved` wird KEINE Datei erzeugt:
 *                keine Bytes, keine toten Klänge, und die Pipeline bleibt
 *                kapitelfähig.
 *
 * ── Warum jeder Eintrag die UNION nennt ─────────────────────────────────────
 * Drei Namen kommen zweimal vor, in verschiedenen Unionen mit verschiedener
 * Bedeutung: `encounter` (Spieler = Tinte/Spitzen · Entity = ein Wesen),
 * `guardianDown` und `puff`. Ein Klang am falschen `encounter` wäre lautlos und
 * niemandem aufgefallen.
 *
 * ── Warum die Importe hier `import type` sind ───────────────────────────────
 * Sie verschwinden beim Bauen, es entsteht keine Laufzeit-Kante von diesem
 * Manifest zurück in die Spiel-Logik, und ohne sie liessen sich die Unionen
 * nicht ableiten — die Abdeckung müsste abgetippt werden und wäre am Tag ihrer
 * Entstehung vollständig und danach nie wieder. (In S1 hatte dieses Modul gar
 * keinen Aufrufer; seit S2 · R5-W6 ist es verdrahtet.)
 */

import type { EntityEvent } from "../entities.ts";
import type { PlayerEvent } from "../player.ts";
import type { SimEvent } from "../sim.ts";
import { AUDIO_FILES } from "./audioFiles.ts";

// ── Vokabular ────────────────────────────────────────────────────────────────

export type AudioFamily = "foot" | "body" | "ui" | "positive" | "neutral" | "world" | "music" | "voice";
export type Pedagogy = "info" | "positive" | "neutral";
export type Bus = "sfx" | "music";

/** Wo S2 den Hörer anklemmt (AUDIO_SPINE §2). */
export type Tap = "sim" | "entity" | "scene" | "shell";

export interface StemSpec {
  readonly stem: string;
  readonly family: AudioFamily;
  readonly pedagogy: Pedagogy;
  readonly bus: Bus;
  /** Zielfenster in Sekunden — `scripts/check-audio.mjs` prüft die Dateien dagegen. */
  readonly durationSec: number;
  /** wie viele Dateien es gibt: 1 ⇒ `<stem>.mp3`, n>1 ⇒ `<stem>-1.mp3` … `<stem>-n.mp3` */
  readonly variants: number;
  readonly tap: Tap;
  /** Abspiel-Regel in Worten — S2 setzt sie um, `check-audio` liest sie nicht. */
  readonly rule?: string;
}

/** Ein Ereignis klingt, schweigt, oder kann hier gar nicht feuern. */
export type Reaction =
  | { readonly play: string; readonly when?: string; readonly note?: string }
  | { readonly silent: string; readonly when?: string }
  | { readonly reserved: string; readonly when?: string };

export const isPlay = (r: Reaction): r is { play: string; when?: string; note?: string } => "play" in r;
export const isSilent = (r: Reaction): r is { silent: string; when?: string } => "silent" in r;
export const isReserved = (r: Reaction): r is { reserved: string; when?: string } => "reserved" in r;

// ── Busse (AUDIO_SPINE §1) ───────────────────────────────────────────────────

/**
 * `master` ist die Klassenraum-Decke: dieselbe 0,25, die `@domigo/game-feel`
 * seit ALIVE-0 benutzt, damit ein Tablet in der letzten Reihe niemanden stört.
 * Die Musik liegt DEUTLICH darunter — sie soll tragen, nicht decken.
 */
export const BUSES = {
  master: 0.25,
  sfx: 1.0,
  music: 0.12,
  /** wie weit die Musik unter einer Fanfare zurücktritt, und wie lange zurück */
  duckTo: 0.5,
  duckReleaseMs: 300,
} as const;

// ── Die Stems (AUDIO_SPINE §2b) ──────────────────────────────────────────────

export const STEMS: readonly StemSpec[] = [
  // Bewegung — das Kind selbst
  { stem: "step-paper", family: "foot", pedagogy: "info", bus: "sfx", durationSec: 0.25, variants: 4, tap: "scene", rule: "≥ 90 ms Ratenlimit · Rotation ohne Wiederholung · Lautstärke 0,35 + 0,65·min(1,|vx|/vmax) · ±3 % Detune · unter einer Fanfare auf 0,5" },
  { stem: "step-garden", family: "foot", pedagogy: "info", bus: "sfx", durationSec: 0.25, variants: 4, tap: "scene", rule: "wie step-paper, Phase p3" },
  { stem: "step-board", family: "foot", pedagogy: "info", bus: "sfx", durationSec: 0.25, variants: 4, tap: "scene", rule: "wie step-paper, Phase p4" },
  { stem: "jump", family: "body", pedagogy: "info", bus: "sfx", durationSec: 0.3, variants: 3, tap: "scene", rule: "jumpedAgo === 0" },
  { stem: "land-soft", family: "body", pedagogy: "info", bus: "sfx", durationSec: 0.3, variants: 2, tap: "scene", rule: "landedAgo === 0 und fallVy < LAND_DUST_VY·2 — dieselbe Schwelle wie der Staub" },
  { stem: "land-hard", family: "body", pedagogy: "info", bus: "sfx", durationSec: 0.45, variants: 2, tap: "scene", rule: "landedAgo === 0 und fallVy ≥ LAND_DUST_VY·2" },
  { stem: "slide", family: "body", pedagogy: "info", bus: "sfx", durationSec: 0.5, variants: 2, tap: "scene", rule: "steigende Flanke von onSlide, einmalig je Rutschbeginn" },

  // Die Welt
  { stem: "cage-open", family: "world", pedagogy: "info", bus: "sfx", durationSec: 0.6, variants: 2, tap: "entity" },
  { stem: "cage-locked", family: "neutral", pedagogy: "neutral", bus: "sfx", durationSec: 0.35, variants: 1, tap: "entity" },
  { stem: "cage-free", family: "positive", pedagogy: "positive", bus: "sfx", durationSec: 1.5, variants: 2, tap: "sim", rule: "duckt die Musik" },
  { stem: "door-open", family: "world", pedagogy: "info", bus: "sfx", durationSec: 0.6, variants: 2, tap: "sim", rule: "R48: die Tür freut sich nicht, sie geht auf" },
  { stem: "gate-waits", family: "neutral", pedagogy: "neutral", bus: "sfx", durationSec: 0.3, variants: 1, tap: "sim", rule: "Torschluss-Toasts, siehe TOAST_MATCHES" },
  { stem: "letter-take", family: "positive", pedagogy: "positive", bus: "sfx", durationSec: 0.3, variants: 3, tap: "sim", rule: "drei Stufen, die Stufe steigt mit `got` (1–3, dann zyklisch die höchste)" },
  { stem: "letters-all", family: "positive", pedagogy: "positive", bus: "sfx", durationSec: 1.5, variants: 1, tap: "sim", rule: "duckt die Musik" },
  { stem: "page-take", family: "ui", pedagogy: "info", bus: "sfx", durationSec: 0.4, variants: 2, tap: "sim" },
  { stem: "wipe", family: "world", pedagogy: "info", bus: "sfx", durationSec: 0.5, variants: 3, tap: "sim", rule: "drei Schichten, drei Varianten in Folge" },
  { stem: "board-bloom", family: "positive", pedagogy: "positive", bus: "sfx", durationSec: 1.5, variants: 1, tap: "sim", rule: "duckt die Musik. Der Ereignis-Name ist ein Code-Relikt — sie wird sauber, nicht besiegt (R50)" },
  { stem: "arena-brief", family: "world", pedagogy: "info", bus: "sfx", durationSec: 1.5, variants: 1, tap: "sim", rule: "duckt die Musik" },
  { stem: "boss-window", family: "world", pedagogy: "info", bus: "sfx", durationSec: 0.5, variants: 1, tap: "entity" },
  { stem: "ink-splash", family: "neutral", pedagogy: "neutral", bus: "sfx", durationSec: 0.4, variants: 2, tap: "sim", rule: "siehe TOAST_MATCHES" },
  { stem: "bump", family: "neutral", pedagogy: "neutral", bus: "sfx", durationSec: 0.35, variants: 2, tap: "entity", rule: "≥ 400 ms Ratenlimit — die Iframes dauern länger als der Klang" },
  { stem: "shoo", family: "world", pedagogy: "info", bus: "sfx", durationSec: 0.35, variants: 2, tap: "entity" },
  { stem: "puff-chalk", family: "world", pedagogy: "info", bus: "sfx", durationSec: 0.25, variants: 2, tap: "sim", rule: "≥ 120 ms Ratenlimit — der Staub kommt in Fünferbüscheln" },
  { stem: "being-answered", family: "positive", pedagogy: "positive", bus: "sfx", durationSec: 0.8, variants: 2, tap: "sim" },
  { stem: "merle-round", family: "positive", pedagogy: "positive", bus: "sfx", durationSec: 0.6, variants: 3, tap: "shell", rule: "drei Stufen über ihre sechs Runden (je zwei Runden eine Stufe)" },

  // Hülle und Karten
  { stem: "card-open", family: "ui", pedagogy: "info", bus: "sfx", durationSec: 0.3, variants: 3, tap: "sim" },
  { stem: "card-close", family: "ui", pedagogy: "info", bus: "sfx", durationSec: 0.3, variants: 3, tap: "shell" },
  { stem: "page-turn", family: "ui", pedagogy: "info", bus: "sfx", durationSec: 0.4, variants: 2, tap: "shell" },
  { stem: "toast", family: "ui", pedagogy: "info", bus: "sfx", durationSec: 0.2, variants: 2, tap: "sim", rule: "der Standardfall — die per TOAST_MATCHES erkannten Zeilen gehen woandershin" },
  { stem: "solve-ok", family: "positive", pedagogy: "positive", bus: "sfx", durationSec: 0.5, variants: 3, tap: "shell", rule: "drei Stufen: nah · teilweise · richtig" },
  { stem: "solve-thud", family: "neutral", pedagogy: "neutral", bus: "sfx", durationSec: 0.3, variants: 2, tap: "shell", rule: "BLUEPRINT :371 — der weiche neutrale Thud, nie ein Urteil" },

  // Musik (AUDIO_SPINE §3). `durationSec` ist der Richtwert; die wirkliche
  // Schleifenlänge wird gemessen und steht in audioFiles.ts.
  { stem: "music-p1", family: "music", pedagogy: "info", bus: "music", durationSec: 45, variants: 1, tap: "scene", rule: "Marker-Loop über die ganze Datei" },
  { stem: "music-p2", family: "music", pedagogy: "info", bus: "music", durationSec: 45, variants: 1, tap: "scene", rule: "Marker-Loop über die ganze Datei" },
  { stem: "music-p3", family: "music", pedagogy: "info", bus: "music", durationSec: 45, variants: 1, tap: "scene", rule: "Marker-Loop über die ganze Datei" },
  { stem: "music-p4", family: "music", pedagogy: "info", bus: "music", durationSec: 45, variants: 1, tap: "scene", rule: "Marker-Loop über die ganze Datei" },
  { stem: "music-p9", family: "music", pedagogy: "info", bus: "music", durationSec: 45, variants: 1, tap: "scene", rule: "Marker-Loop über die ganze Datei" },
  { stem: "music-title", family: "music", pedagogy: "info", bus: "music", durationSec: 8, variants: 1, tap: "shell", rule: "einmal, kein Loop" },
  { stem: "music-win", family: "music", pedagogy: "info", bus: "music", durationSec: 3, variants: 1, tap: "shell", rule: "einmal, kein Loop" },
] as const;

/** Welches Musikstück gehört zu welcher Phase. */
export const MUSIC_BY_PHASE: Readonly<Record<string, string>> = {
  p1: "music-p1", p2: "music-p2", p3: "music-p3", p4: "music-p4", p9: "music-p9",
} as const;

/**
 * R5 · S2 · Der Untergrund einer Phase.
 *
 * Der Schritt-Klang kommt aus dem RAUM, nicht aus dem Glyph: in ch01 gibt es
 * genau zwei begehbare Glyphen (`#` und die Rutsche `z`), aber vier Materialien
 * unter den Füssen. Die Tabelle stand bisher nur als Prosa in `audio/index.ts`;
 * hier ist sie Daten, und `manifest.test.ts` prüft sie gegen die Phasen des
 * Levels — eine Phase ohne Eintrag geht auf `paper`, statt still zu sein.
 */
export type Surface = "paper" | "garden" | "board";
export const SURFACE_BY_PHASE: Readonly<Record<string, Surface>> = {
  p1: "paper", p2: "paper", p3: "garden", p4: "board", p9: "paper",
} as const;

export const surfaceOfPhase = (phaseId: string): Surface => SURFACE_BY_PHASE[phaseId] ?? "paper";

/**
 * R5 · S2 · Die Klänge, die an KEINEM Ereignis hängen.
 *
 * Fünf Stems tragen im Manifest die Anschlussstelle `scene` oder `shell` und
 * kommen in keiner der drei Ereignis-Tabellen vor — weil es das Ereignis nicht
 * gibt: die Rutsche ist ein ZUSTAND (`player.onSlide`), und „Karte zu",
 * „Seite geblättert", „richtig!" und Merles Runde passieren in React, wo die
 * Spiel-Logik nicht hinsieht.
 *
 * Sie brauchen also einen eigenen Weg herein — aber einen SCHMALEN. Diese
 * geschlossene Union ist er: der Direktor bleibt die einzige Stelle, die
 * entscheidet, was klingt und wie laut; die Hülle sagt nur, DASS etwas passiert
 * ist. Ein Aufrufer kann sich keinen beliebigen Stem greifen, und
 * `coverage.test.ts` prüft die andere Richtung mit — jeder Stem mit Dateien auf
 * der Platte muss entweder in einer Reaktions-Tabelle, in dieser Union oder in
 * `MUSIC_BY_PHASE` stehen, sonst ist er ein toter Klang.
 */
export const CUE_STEMS = ["slide", "card-close", "page-turn", "solve-ok", "merle-round"] as const;
export type CueStem = (typeof CUE_STEMS)[number];

/**
 * Zwei Klänge hängen an einem SimEvent `toast` mit einem BESTIMMTEN Text — der
 * einzigen Stelle, an der die Spiel-Logik diese Beats nach oben meldet
 * (`sim.ts#checkExit` und der Tinten-Kontakt in `onPlayerEvent`).
 *
 * Ein Text-Vergleich ist brüchig: die Copy-Bahn darf jeden dieser Sätze
 * jederzeit umformulieren, und der Klang verschwände still. Deshalb prüft
 * `scripts/check-audio.mjs`, dass jedes Muster hier noch auf ein Literal in
 * `sim.ts` passt — wird eine Zeile umgeschrieben, geht das TOR rot, statt dass
 * der Klang aufhört.
 *
 * *(Filed für Fable: sauberer wäre ein eigenes SimEvent für den Torschluss.
 * `sim.ts` gehört dieser Session nicht.)*
 */
export const TOAST_MATCHES: readonly { readonly stem: string; readonly pattern: RegExp }[] = [
  { stem: "gate-waits", pattern: /wartet auf ihr Wort|noch voller Kritzel|noch etwas Wichtiges|Erst die Tafel sauber/ },
  { stem: "ink-splash", pattern: /Platsch/ },
] as const;

// ── Der Abdeckungs-Vertrag (AUDIO_SPINE §2d) ─────────────────────────────────

type SimKind = SimEvent["type"];
type PlayerKind = PlayerEvent["type"];
type EntityKind = EntityEvent["type"];

/** Alle 15 SimEvent-Arten. Fehlt eine, geht der Typecheck rot. */
export const SIM_REACTIONS = {
  toast: [{ play: "toast", note: "die per TOAST_MATCHES erkannten Zeilen gehen an gate-waits bzw. ink-splash" }],
  task: [{ play: "card-open", note: "jede Karte kommt hier heraus — auch die von cageHint, engaged, cageAsk, awakenAsk" }],
  powerup: [{ reserved: "ch01 hat kein powerup-Entity; der Prompt liegt als `powerup-take` bereit" }],
  cageFreed: [{ play: "cage-free" }],
  guardianDown: [{ play: "board-bloom" }],
  guardianWipe: [
    { play: "wipe", when: "layersLeft > 0" },
    { silent: "feuert im selben Augenblick wie guardianDown — board-bloom trägt den Beat, zwei Klänge auf einem Beat sind einer zu viel", when: "layersLeft === 0" },
  ],
  cageHint: [{ silent: "hebt ausschliesslich eine Karte (sim.ts setzt overlayOpen) — card-open klingt bereits" }],
  arenaBrief: [{ play: "arena-brief" }],
  letters: [
    { play: "letters-all", when: "got === total" },
    { silent: "letter-take hat denselben Augenblick schon beklungen", when: "got < total" },
  ],
  letterTaken: [{ play: "letter-take" }],
  cloth: [{ play: "letter-take", note: "R5-W5 · G4 (nach S1 gemergt): ein Kleidungsstueck ist gefunden, das Wort steht 2 s am Fundort — bis ein eigener Stem bestellt ist, klingt der Fund wie ein Buchstabe (positiv, 0,3 s); Nachbestellung `cloth-take` = S2/AUDIO_SPINE §2b" }],
  entityResolved: [{ play: "being-answered" }],
  tip: [{ play: "page-take" }],
  book: [{ reserved: "ch01 hat kein book-Entity (nur fünf tip); der Prompt liegt als `book-take` bereit" }],
  puff: [
    { play: "puff-chalk", when: 'kind === "chalk"' },
    { reserved: 'entsteht nur an der Faust; der Prompt liegt als `fist-hit` bereit', when: 'kind === "hit"' },
  ],
  exit: [{ play: "door-open" }],
} as const satisfies Record<SimKind, readonly Reaction[]>;

/** Alle 8 PlayerEvent-Arten. */
export const PLAYER_REACTIONS = {
  jumped: [{ play: "jump", note: "über den Szenen-Takt: jumpedAgo === 0" }],
  landed: [
    { play: "land-soft", when: "fallVy < LAND_DUST_VY·2" },
    { play: "land-hard", when: "fallVy ≥ LAND_DUST_VY·2" },
  ],
  hoverStart: [{ reserved: "canHover ist in ch01 false (Federkiel-Rotor, ch04); Prompt `hover` liegt bereit" }],
  sprung: [{ reserved: "kein s-Glyph im Kapitel; Prompt `spring` liegt bereit" }],
  fistThrown: [{ reserved: "ch01 vergibt keine Faust; Prompt `fist-throw` liegt bereit" }],
  encounter: [
    { play: "ink-splash", when: 'hazard === "w"', note: "erreicht die Szene als toast »Platsch!«" },
    { reserved: 'kein ^-Glyph im Kapitel; Prompt `spike-touch` liegt bereit', when: 'hazard === "^"' },
  ],
  grabbedLedge: [{ reserved: "canHang ist in ch01 false (ch02); Prompt `ledge-grab` liegt bereit" }],
  swingStart: [{ reserved: "kein o-Glyph im Kapitel; Prompt `swing-start` liegt bereit" }],
} as const satisfies Record<PlayerKind, readonly Reaction[]>;

/** Alle 16 EntityEvent-Arten. */
export const ENTITY_REACTIONS = {
  encounter: [{ play: "bump", note: "ein WESEN berührt das Kind — nicht zu verwechseln mit dem gleichnamigen PlayerEvent (Tinte/Spitzen)" }],
  engaged: [{ silent: "hebt nur die Wiederherstellungs-Karte → card-open" }],
  cageHit: [{ reserved: "die Zwei-Schlag-Grammatik gehört der Faust (entities.ts: »↑ opens a cage in a chapter with no fist«); Prompt `cage-hit` liegt bereit" }],
  cageBurst: [{ play: "cage-open" }],
  cageAsk: [{ silent: "hebt nur die Karte erneut; das Bersten hat schon gespielt" }],
  cageGated: [{ play: "cage-locked" }],
  awakenAsk: [{ silent: "hebt nur Merles Runde erneut → card-open" }],
  doorTouched: [{ silent: "hebt die Tür-Karte → card-open; das Aufgehen klingt am SimEvent exit" }],
  powerupTaken: [{ reserved: "wie SimEvent powerup — kein powerup-Entity in ch01" }],
  pickupTaken: [{ silent: "gefaltet — die SimEvents tip / book tragen den Klang" }],
  guardianStagger: [{ play: "boss-window" }],
  guardianKnot: [{ silent: "gefaltet — das SimEvent guardianWipe trägt den Klang" }],
  guardianDown: [{ silent: "gefaltet — das gleichnamige SimEvent trägt den Klang" }],
  projectileDeflected: [{ reserved: "braucht die Faust; Prompt `deflect` liegt bereit" }],
  puff: [{ silent: "gefaltet — das gleichnamige SimEvent trägt den Klang" }],
  shooed: [{ play: "shoo" }],
} as const satisfies Record<EntityKind, readonly Reaction[]>;

// ── Nachschlagen ─────────────────────────────────────────────────────────────

const STEM_BY_NAME = new Map(STEMS.map((s) => [s.stem, s]));

export const stemSpec = (stem: string): StemSpec | undefined => STEM_BY_NAME.get(stem);

/** Die Dateinamen eines Stems: `x.mp3` bei einer Variante, sonst `x-1.mp3` … */
export const filesOf = (spec: StemSpec): readonly string[] =>
  spec.variants <= 1
    ? [spec.stem]
    : Array.from({ length: spec.variants }, (_, i) => `${spec.stem}-${i + 1}`);

/**
 * Die Adresse einer Klang-Datei, mit dem Fingerabdruck ihres eigenen Inhalts.
 *
 * `next.config.ts` liefert alles unter `/audio/*` mit `immutable` aus. Dieses
 * Versprechen ist nur haltbar, wenn eine neu gemasterte Datei unter einer NEUEN
 * Adresse ankommt — sonst behält ein Kind, das die alte einmal geladen hat, sie
 * ein Jahr lang.
 *
 * Für die Bilder erledigt das `apps/web/lib/art-fingerprint.ts#stamped()`. Das
 * geht hier NICHT: `stamped()` liest die Datei mit `node:fs`, es ist Server-Code,
 * und der Klang-Lader läuft im Browser. Also trägt das generierte
 * `audioFiles.ts` den sha1 jeder Datei bei sich — dieselbe Wirkung, ohne
 * Dateisystem, und die Zahl entsteht beim Mastern statt bei jeder Anfrage.
 */
export const audioUrl = (file: string): string => {
  const info = AUDIO_FILES[file];
  const dir = file.startsWith("music-") ? "music" : "sfx";
  const base = `/audio/g1/paint/ch01/${dir}/${file}.mp3`;
  return info === undefined ? base : `${base}?v=${info.v}`;
};

/** Jede Datei, die das Manifest verspricht — die Liste, gegen die das Tor prüft. */
export const manifestFiles = (): readonly { readonly file: string; readonly spec: StemSpec }[] =>
  STEMS.flatMap((spec) => filesOf(spec).map((file) => ({ file, spec })));

/** Alle Reaktionen aller drei Unionen, flach — für Tests und für `mapEvent`. */
export const allReactions = (): readonly { readonly union: "sim" | "player" | "entity"; readonly event: string; readonly reaction: Reaction }[] => [
  ...Object.entries(SIM_REACTIONS).flatMap(([event, rs]) => rs.map((reaction) => ({ union: "sim" as const, event, reaction }))),
  ...Object.entries(PLAYER_REACTIONS).flatMap(([event, rs]) => rs.map((reaction) => ({ union: "player" as const, event, reaction }))),
  ...Object.entries(ENTITY_REACTIONS).flatMap(([event, rs]) => rs.map((reaction) => ({ union: "entity" as const, event, reaction }))),
];
