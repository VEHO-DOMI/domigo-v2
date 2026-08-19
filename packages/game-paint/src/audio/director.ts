/**
 * R5 · S1/S2 · DER KLANG-DIREKTOR.
 *
 * S1 hat die Fabrik gebaut und bewusst niemanden angeklemmt; **S2 (R5-W6) hat
 * sie verdrahtet**. Vier Anschlussstellen führen herein — der SimEvent-Trichter
 * in `PaintScene#handleSimEvents`, der Durchreicher für die gefalteten
 * EntityEvents in `sim.ts#onEntityEvent`, der Szenen-Takt in
 * `PaintScene#footwork` und die React-Hülle in `PaintGame.tsx`. Dass alle vier
 * noch angeklemmt sind, hält `director.test.ts` fest: ein stummes Spiel sieht
 * in keinem Diff anders aus als ein klingendes.
 *
 * ── Warum eine eigene schmale Schnittstelle statt eines Phaser-Imports ──────
 * Der Direktor sitzt auf Phasers `WebAudioSoundManager` auf, kennt ihn aber nur
 * über `SoundHost` — die fünf Methoden, die er wirklich braucht. Das hat drei
 * Gründe: er ist ohne Browser prüfbar (die Tests reichen eine Attrappe herein),
 * er zieht Phaser nicht in ein Bündel, das ihn sonst nicht hätte, und er
 * überlebt einen Phaser-Wechsel, solange diese fünf Methoden bleiben.
 *
 * ── Warum EIN AudioContext und decodierte Puffer, kein <audio>-Element ──────
 * Auf iPadOS ist `HTMLMediaElement.volume` schreibgeschützt (ein Musik-Bus wäre
 * nicht einstellbar), jedes Element braucht seine eigene Geste, Element-Quellen
 * kommen nach einer Unterbrechung (Sperrbildschirm, Siri) oft stumm zurück, und
 * Medien-Elemente melden sich beim Betriebssystem als »Now Playing«. Phasers
 * WebAudio-Weg liefert dagegen das Entsperren über eine beliebige Berührung
 * (auch für das Kind, das den Auftakt überspringt), `masterMuteNode`/
 * `masterVolumeNode` als echte Busse und Marker mit sample-genauer, gaploser
 * Schleife.
 *
 * ── No-op ist der Normalfall, nicht der Fehlerfall ─────────────────────────
 * Ohne `sound` (Server-Rendering, Test ohne Attrappe) und ohne Dateien auf der
 * Platte tut der Direktor nichts und wirft nie. Ein Spiel darf nicht daran
 * scheitern, dass eine MP3 fehlt.
 */

import {
  BUSES, ENTITY_REACTIONS, MUSIC_BY_PHASE, PLAYER_REACTIONS, SIM_REACTIONS,
  STEMS, TOAST_MATCHES, audioUrl, filesOf, isPlay, isReserved, isSilent, stemSpec,
  type Bus, type CueStem, type Reaction, type StemSpec, type Surface,
} from "./audioManifest.ts";
import { AUDIO_FILES } from "./audioFiles.ts";
import { AUDIO_DECODED_MB, decodedBytes } from "./audioBudget.ts";
import { AUDIO_DEFAULTS, readAudioSettings, writeAudioSettings, type AudioSettings } from "./settings.ts";

// ── Die Schnittstelle zur Tonmaschine ────────────────────────────────────────

export interface HostSound {
  addMarker(marker: { name: string; start: number; duration: number; config?: { loop?: boolean } }): boolean;
  play(marker?: string, config?: { volume?: number; detune?: number }): boolean;
  stop(): boolean;
  destroy(): void;
  setVolume?(value: number): unknown;
}

export interface SoundHost {
  add(key: string, config?: { volume?: number }): HostSound;
  /** Phasers WebAudio-Weg: decodieren, ohne durch den Loader zu gehen. */
  decodeAudio(key: string, data: ArrayBuffer): void;
  /**
   * R5-W6 · S2 · Wann das Decodieren FERTIG ist.
   *
   * `decodeAudio` ist asynchron: Phaser legt den Puffer erst im Cache ab, wenn
   * `context.decodeAudioData` zurückkommt, und meldet das über
   * `Phaser.Sound.Events.DECODED` mit dem Schlüssel als Nutzlast. Bis dahin
   * wirft `add(key)` — die Datei gibt es aus Sicht des Cache noch nicht.
   *
   * S1 hat diese Lücke benannt und bewusst offengelassen (»für S2 die Stelle,
   * an der ein `once(DECODED)` das letzte Prozent holt«). Sie ist kein
   * letztes Prozent: der Beweislauf hat gezeigt, dass die Musik des ersten
   * Raums IMMER dagegen läuft — sie wird in dem Augenblick angefordert, in dem
   * die Tonmaschine entsperrt, und ihr Decodieren hat gerade erst begonnen.
   * Ohne dieses Signal bleibt der erste Raum stumm, und zwar zuverlässig.
   *
   * Optional, damit der Direktor ohne Phaser prüfbar bleibt: fehlt der Haken,
   * gilt eine Datei wie bisher mit dem Abschicken als da.
   */
  onDecoded?(cb: (key: string) => void): void;
  removeByKey?(key: string): unknown;
  mute: boolean;
  volume: number;
}

export interface DirectorDeps {
  readonly sound?: SoundHost | null;
  /** wie die Bytes geholt werden — trennbar, damit Tests ohne Netz laufen */
  readonly fetchAudio?: (url: string) => Promise<ArrayBuffer>;
  readonly now?: () => number;
  readonly settings?: AudioSettings;
  /** ob eine Datei überhaupt existiert; Vorgabe: was audioFiles.ts kennt */
  readonly hasFile?: (file: string) => boolean;
  /**
   * R5-W6 · S2 · Wer wirklich geklungen hat (Beweis-Griff, nicht Betrieb).
   *
   * Gemeldet wird NACH dem Ratenlimit, NACH der Varianten-Rotation und nach
   * der Stumm-Prüfung — also das, was aus dem Lautsprecher kam, nicht das, was
   * jemand angefordert hat. Genau das ist der Unterschied, auf den es beim
   * Beweis ankommt: die Verdrahtung ruft bei jedem Schritt-Takt, aber nur jeder
   * dritte darf klingen. Ein Protokoll der AUFRUFE hätte das Ratenlimit nie
   * gezeigt und ein fehlendes Limit nie verraten.
   *
   * Ohne diesen Rückruf entsteht kein Puffer und kostet es nichts.
   */
  readonly onPlayed?: (played: { stem: string; file: string; bus: Bus }) => void;
}

// ── Die Kontext-Fabrik (S2 setzt sie in die Phaser-Konfiguration) ────────────

/**
 * Der EINE AudioContext des Malbuchs. S2 reicht ihn als `audio: { context }` in
 * die Game-Config; Phaser übernimmt ihn dann, statt sich einen zweiten zu bauen.
 * Gibt `null` zurück, wo es keinen gibt (Server, Test) — der Aufrufer lässt das
 * Feld dann einfach weg und Phaser baut seinen eigenen.
 */
export const createSharedContext = (): AudioContext | null => {
  const Ctor = (globalThis as { AudioContext?: typeof AudioContext }).AudioContext;
  if (typeof Ctor !== "function") return null;
  try {
    return new Ctor({ latencyHint: "interactive" });
  } catch {
    return null;
  }
};

// ── Die Zuordnung Ereignis → Klang ───────────────────────────────────────────

export type EventUnion = "sim" | "player" | "entity";

const TABLES: Record<EventUnion, Readonly<Record<string, readonly Reaction[]>>> = {
  sim: SIM_REACTIONS,
  player: PLAYER_REACTIONS,
  entity: ENTITY_REACTIONS,
};

/**
 * Welcher Stem gehört zu diesem Ereignis — oder keiner, mit Grund.
 *
 * Die Union MUSS mitkommen: `encounter`, `guardianDown` und `puff` heissen in
 * zwei Unionen gleich und bedeuten Verschiedenes. Ein Klang am falschen
 * `encounter` wäre lautlos und niemandem aufgefallen.
 *
 * `payload` entscheidet die Fälle mit Bedingung (`layersLeft`, `kind`,
 * `hazard`, `got`/`total`, `msg`). Fehlt das Feld, gewinnt der erste Eintrag —
 * ein Klang zu viel ist besser als ein Absturz.
 */
export const mapEvent = (
  union: EventUnion,
  event: string,
  payload: Readonly<Record<string, unknown>> = {},
): { readonly stem: string | null; readonly why: string } => {
  const rs = TABLES[union]?.[event];
  if (rs === undefined) return { stem: null, why: `unbekanntes Ereignis ${union}/${event}` };

  // Der Torschluss und die Tinte melden sich als Toast mit einem bestimmten
  // Text — die einzige Stelle, an der die Spiel-Logik sie nach oben gibt.
  if (union === "sim" && event === "toast" && typeof payload.msg === "string") {
    const hit = TOAST_MATCHES.find((m) => m.pattern.test(payload.msg as string));
    if (hit !== undefined) return { stem: hit.stem, why: `Toast-Klasse ${hit.stem}` };
  }

  const pick = ((): Reaction | undefined => {
    if (union === "sim" && event === "guardianWipe") {
      return rs[Number(payload.layersLeft) === 0 ? 1 : 0];
    }
    if (union === "sim" && event === "letters") {
      return rs[payload.got !== undefined && payload.got === payload.total ? 0 : 1];
    }
    if (union === "sim" && event === "puff") {
      return rs[payload.kind === "hit" ? 1 : 0];
    }
    if (union === "player" && event === "encounter") {
      return rs[payload.hazard === "^" ? 1 : 0];
    }
    if (union === "player" && event === "landed") {
      return rs[payload.hard === true ? 1 : 0];
    }
    return rs[0];
  })();

  if (pick === undefined) return { stem: null, why: "keine Reaktion hinterlegt" };
  if (isPlay(pick)) return { stem: pick.play, why: pick.note ?? "" };
  if (isSilent(pick)) return { stem: null, why: pick.silent };
  if (isReserved(pick)) return { stem: null, why: pick.reserved };
  return { stem: null, why: "keine Reaktion hinterlegt" };
};

/**
 * R5-W6b · D4 · D-371 — DIE WERTUNG EINER KARTE, ALS KLANG.
 *
 * `solve-thud` war der einzige fertig gemasterte Klang OHNE Auslöser: die
 * Bewertung liegt seit R5-W3 in `cards/` (die Karten-Maschinen melden nur das
 * Richtige nach oben), und die Audio-Session S2 durfte dort nicht hin. Diese
 * Tabelle ist die eine Schnittstelle, die das schliesst — die Karte sagt, WIE
 * es ausgegangen ist, und was das klingt, entscheidet weiterhin die Audio-Bahn.
 *
 * `correct: null` ist eine ENTSCHEIDUNG, kein Loch: die Hülle spielt die
 * richtige Antwort bereits selbst (`PaintGame#resolveCorrect` ruft
 * `cue("solve-ok", …)` mit der Stufe aus den Versuchen). Ein zweiter Klang von
 * hier wäre ein Doppelklang auf demselben Beat — und der Sinn dieser Runde ist
 * der FEHLENDE Ton, nicht ein zusätzlicher.
 *
 * Sie steht hier und nicht in der Karte, damit `coverage.test.ts` sie lesen
 * kann: das Abdeckungs-Gesetz („jeder Stem hat einen Weg") beweist den Auslöser
 * dann an der Verdrahtung selbst statt an einer Behauptung daneben.
 *
 * BLUEPRINT :371 — falsch klingt neutral und weich, nie absteigend. Die Bank
 * ist gemessen (`check-audio.mjs`), hier wird nur verdrahtet.
 */
export const CARD_GRADE_STEMS = {
  correct: null,
  wrong: "solve-thud",
} as const satisfies Readonly<Record<CardGrade, string | null>>;

/** wie eine Karte ausgegangen ist — dieselben zwei Wörter wie `machines.ts#grade`,
 *  ohne das dritte („pending" ist kein Ereignis, sondern der Normalzustand) */
export type CardGrade = "correct" | "wrong";

// ── Der Direktor ─────────────────────────────────────────────────────────────

const DUCKING_FAMILIES = new Set(["positive"]);

/** wie lange auf eine decodierte Datei gewartet wird, bevor sie als weg gilt */
const DECODE_TIMEOUT_MS = 5000;

/**
 * R5 · S2 · Was gerade im Speicher liegt — für die Perf-Zeile (`?perf=1`).
 *
 * Die decodierte Spitze ist die eine Audio-Zahl, die ein Tor NICHT erzwingen
 * kann: `check-audio.mjs` rechnet sie deterministisch aus den Dauern der
 * Dateien, die das Manifest verspricht, aber ob zur LAUFZEIT wirklich nur eine
 * Phase gleichzeitig im Speicher steht, sieht man erst am laufenden Spiel.
 * Genau dafür steht sie in der Lehrer-Zeile — gegen `AUDIO_DECODED_MB`
 * gerechnet, damit die Zahl ohne Nachschlagen lesbar ist.
 */
export interface AudioReport {
  readonly enabled: boolean;
  /** decodierte Dateien im Speicher */
  readonly filesLoaded: number;
  /** ihre Summe in MB, nach derselben Formel wie `audioBudget.decodedBytes` */
  readonly decodedMb: number;
  /** die Decke, gegen die sie zu lesen ist */
  readonly decodedLimitMb: number;
  /** welches Musikstück gerade läuft (Datei-Name), oder `null` */
  readonly music: string | null;
}

export interface AudioDirector {
  /** false, solange es keine Tonmaschine oder keine Dateien gibt */
  readonly enabled: boolean;
  /** Bank und Musik der Phase holen — NACH create(), nie im preload */
  decodeAfterCreate(phaseId: string): Promise<void>;
  /** ein Ereignis aus einer der drei Unionen */
  on(union: EventUnion, event: string, payload?: Readonly<Record<string, unknown>>): void;
  /** der Schritt-Takt: der Untergrund kommt aus der Phase, die Wucht aus dem Fall */
  footstep(surface: Surface, speed01?: number): void;
  /**
   * Ein Klang, der an keinem Ereignis hängt (AUDIO_SPINE §2, `scene`/`shell`).
   *
   * `stage` wählt bei den gestuften Klängen die Variante statt der Rotation:
   * `solve-ok` hat drei Stufen (nah · teilweise · richtig), `merle-round` drei
   * über ihre sechs Runden. Ohne `stage` gilt die normale Rotation.
   */
  cue(stem: CueStem, stage?: number): void;
  /**
   * R5-W6b · D4 · D-371 — eine Karte ist bewertet worden.
   *
   * Die EINZIGE Stelle, an der `cards/**` den Direktor anspricht: die Karte
   * meldet ihr Urteil, nicht einen Klangnamen. Was daraus klingt (und dass
   * „richtig" hier still bleibt, weil die Hülle es selbst spielt), steht in
   * `CARD_GRADE_STEMS`.
   */
  card(grade: CardGrade): void;
  /** die Landung, nach derselben Schwelle wie der Kreidestaub */
  land(hard: boolean): void;
  /** die Musik einer Phase, des Auftakts oder der Bilanz */
  music(which: string | null): Promise<void>;
  setMuted(v: boolean): void;
  setMusic(v: boolean): void;
  setSfx(v: boolean): void;
  readonly settings: AudioSettings;
  /** was gerade decodiert im Speicher liegt (Lehrer-Zeile `?perf=1`) */
  report(): AudioReport;
  /** alles anhalten und freigeben (Ende des Spiels, nicht der Szene) */
  dispose(): void;
}

export const createAudioDirector = (deps: DirectorDeps = {}): AudioDirector => {
  const host = deps.sound ?? null;
  const now = deps.now ?? (() => Date.now());
  const hasFile = deps.hasFile ?? ((f: string) => AUDIO_FILES[f] !== undefined);
  const fetchAudio = deps.fetchAudio
    ?? (async (url: string) => (await fetch(url)).arrayBuffer());
  const played = (stem: string, file: string, bus: Bus): void => deps.onPlayed?.({ stem, file, bus });

  let settings: AudioSettings = deps.settings ?? readAudioSettings() ?? AUDIO_DEFAULTS;

  const playable = STEMS.filter((s) => filesOf(s).some((f) => hasFile(f)));
  const enabled = host !== null && playable.length > 0;

  const loaded = new Set<string>();
  /** abgeschickt, aber vielleicht noch nicht fertig decodiert */
  const sent = new Set<string>();
  const waiters = new Map<string, Array<() => void>>();
  let hooked = false;
  const lastAt = new Map<string, number>();
  const lastVariant = new Map<string, number>();
  let currentMusic: { key: string; sound: HostSound } | null = null;
  let duckUntil = 0;

  const filesFor = (spec: StemSpec): readonly string[] => filesOf(spec).filter((f) => hasFile(f));

  /** einmal an Phasers DECODED hängen — der Haken meldet JEDE fertige Datei */
  const hookDecoded = (): boolean => {
    if (hooked) return true;
    if (host === null || host.onDecoded === undefined) return false;
    host.onDecoded((key: string) => {
      loaded.add(key);
      const list = waiters.get(key);
      if (list === undefined) return;
      waiters.delete(key);
      for (const w of list) w();
    });
    hooked = true;
    return true;
  };

  /**
   * Eine Datei holen und decodieren — und WARTEN, bis sie wirklich da ist.
   *
   * Die Wartezeit ist gedeckelt: eine Datei, die nach fünf Sekunden nicht
   * decodiert ist, kommt nicht mehr. Ohne Deckel hinge `music()` für immer an
   * einer kaputten MP3, und mit ihr der Phasenwechsel, der sie angefordert hat.
   * Danach ist sie einfach nicht `loaded`, und der Direktor bleibt still —
   * dieselbe Antwort wie auf eine fehlende Datei.
   */
  const decode = async (file: string): Promise<void> => {
    if (host === null || loaded.has(file) || sent.has(file)) return;
    sent.add(file);
    try {
      const data = await fetchAudio(audioUrl(file));
      if (!hookDecoded()) { host.decodeAudio(file, data); loaded.add(file); return; }
      const done = new Promise<void>((res) => {
        waiters.set(file, [...(waiters.get(file) ?? []), res]);
      });
      const timeout = new Promise<void>((res) => { setTimeout(res, DECODE_TIMEOUT_MS); });
      host.decodeAudio(file, data);
      await Promise.race([done, timeout]);
      waiters.delete(file);
    } catch {
      /* eine fehlende Datei macht das Spiel leiser, nicht kaputt */
      sent.delete(file);
    }
  };

  const musicVolume = (): number =>
    settings.muted || !settings.music ? 0 : BUSES.music * (now() < duckUntil ? BUSES.duckTo : 1);

  const applyMusicVolume = (): void => {
    currentMusic?.sound.setVolume?.(musicVolume());
  };

  const playStem = (stem: string, gain = 1): void => {
    if (!enabled || host === null) return;
    if (settings.muted || !settings.sfx) return;
    const spec = stemSpec(stem);
    if (spec === undefined) return;

    // Ratenlimit: die Regel steht im Manifest, die Zahl hier.
    const minGap = spec.family === "foot" ? 90 : stem === "puff-chalk" ? 120 : stem === "bump" ? 400 : 0;
    const t = now();
    if (minGap > 0 && t - (lastAt.get(stem) ?? -Infinity) < minGap) return;
    lastAt.set(stem, t);

    // Varianten-Rotation ohne unmittelbare Wiederholung — dieselbe Datei
    // zweimal hintereinander ist genau das, was ein Ohr als »Sample« hört.
    //
    // Reihum, NICHT zufällig: das Haus verlangt gesäte Zufälligkeit (Blueprint
    // VII.0.4), und `Math.random()` ist weder gesät noch garantiert
    // wiederholungsfrei — es könnte dreimal dieselbe Datei ziehen, also genau
    // den Fehler machen, gegen den die Varianten existieren. Reihum ist
    // deterministisch, wiederholt nie unmittelbar und klingt gleich lebendig.
    const files = filesFor(spec);
    if (files.length === 0) return;
    const idx = ((lastVariant.get(stem) ?? -1) + 1) % files.length;
    lastVariant.set(stem, idx);

    const file = files[idx] as string;
    if (!loaded.has(file)) return; // noch nicht decodiert: lieber still als stotternd

    // Fanfaren ziehen die Musik zurück, damit der Augenblick des Kindes obenauf liegt.
    if (DUCKING_FAMILIES.has(spec.family) && spec.durationSec >= 1) {
      duckUntil = t + spec.durationSec * 1000 + BUSES.duckReleaseMs;
      applyMusicVolume();
    }

    // Schritte werden unter einer Fanfare gedämpft (AUDIO_SPINE §1).
    const ducked = spec.family === "foot" && t < duckUntil ? 0.5 : 1;
    // ±3 % Verstimmung, damit vier Dateien nicht wie vier Dateien klingen —
    // auch das reihum aus dem Varianten-Index abgeleitet statt gewürfelt.
    const detune = spec.family === "foot" ? ((idx % 3) - 1) * 30 : 0;
    try {
      const s = host.add(file, { volume: BUSES.sfx * gain * ducked });
      s.play(undefined, { detune });
      played(stem, file, "sfx");
    } catch {
      /* eine Tonmaschine, die gerade nicht kann, macht das Spiel nicht kaputt */
    }
  };

  /**
   * Eine BESTIMMTE Stufe eines Stems, statt der Rotation.
   *
   * Drei Klänge sind gestuft statt variiert: `letter-take` steigt mit der Zahl
   * der Buchstaben, `solve-ok` mit der Güte der Antwort, `merle-round` mit der
   * Runde. Bei ihnen wäre die Rotation nicht nur egal, sondern falsch — sie
   * würde die Stufe verwürfeln, die das Kind hören soll. Über die höchste Stufe
   * hinaus bleibt es bei der höchsten (die siebte Runde klingt wie die sechste,
   * statt wieder von vorn anzufangen).
   */
  const playStage = (stem: string, stage: number): void => {
    if (!enabled || host === null) return;
    if (settings.muted || !settings.sfx) return;
    const spec = stemSpec(stem);
    if (spec === undefined) return;
    const files = filesFor(spec);
    const file = files[Math.min(files.length - 1, Math.max(0, Math.floor(stage)))];
    if (file === undefined || !loaded.has(file)) return;
    try { host.add(file, { volume: BUSES.sfx }).play(); played(stem, file, "sfx"); } catch { /* siehe playStem */ }
  };

  return {
    enabled,

    async decodeAfterCreate(phaseId: string): Promise<void> {
      if (!enabled) return;
      // Die Effekt-Bank als Ganzes — sie ist klein und wird überall gebraucht.
      //
      // Aber NICHT alle auf einmal: 69 gleichzeitige Anfragen sind auf einer
      // Schulleitung ein Stoß, der genau in dem Augenblick kommt, in dem die
      // Phase gerade fertig aufgebaut hat. Sechs auf einmal halten die Leitung
      // beschäftigt, ohne sie zu verstopfen — und weil der Direktor still
      // bleibt, solange eine Datei nicht decodiert ist, kostet ein später
      // eintreffender Schritt-Klang höchstens diesen einen Schritt.
      const bank = playable.filter((s) => s.bus === "sfx").flatMap((s) => filesFor(s));
      const queue = [...bank];
      const worker = async (): Promise<void> => {
        for (;;) {
          const next = queue.shift();
          if (next === undefined) return;
          await decode(next);
        }
      };
      await Promise.all(Array.from({ length: Math.min(6, queue.length) }, worker));
      // Von der Musik NUR die dieser Phase (Budget: decodiert ≤ 16 MB).
      const key = MUSIC_BY_PHASE[phaseId];
      if (key !== undefined) await decode(key);
    },

    on(union: EventUnion, event: string, payload: Readonly<Record<string, unknown>> = {}): void {
      const { stem } = mapEvent(union, event, payload);
      if (stem === null) return;
      if (stem === "letter-take") {
        // drei Stufen, die Stufe steigt mit `got` — die Rotation gilt hier NICHT
        playStage(stem, Number(payload.got ?? 1) - 1);
        return;
      }
      playStem(stem);
    },

    footstep(surface: Surface, speed01 = 1): void {
      playStem(`step-${surface}`, 0.35 + 0.65 * Math.min(1, Math.max(0, speed01)));
    },

    cue(stem: CueStem, stage?: number): void {
      if (stage === undefined) { playStem(stem); return; }
      playStage(stem, stage);
    },

    card(grade: CardGrade): void {
      const stem = CARD_GRADE_STEMS[grade];
      if (stem === null) return; // „richtig" klingt schon aus der Hülle — siehe oben
      playStem(stem);
    },

    land(hard: boolean): void {
      playStem(hard ? "land-hard" : "land-soft");
    },

    async music(which: string | null): Promise<void> {
      if (!enabled || host === null) return;
      const key = which === null ? null : (MUSIC_BY_PHASE[which] ?? (which.startsWith("music-") ? which : null));
      if (key === currentMusic?.key) return;

      // Die vorige Phase wird FREIGEGEBEN — sonst stünden zwei decodierte
      // Stücke gleichzeitig im Heap und das 16-MB-Budget wäre Makulatur.
      if (currentMusic !== null) {
        try { currentMusic.sound.stop(); currentMusic.sound.destroy(); } catch { /* egal */ }
        host.removeByKey?.(currentMusic.key);
        loaded.delete(currentMusic.key);
        sent.delete(currentMusic.key);
        currentMusic = null;
      }
      if (key === null) return;

      await decode(key);
      if (!loaded.has(key)) return;
      const info = AUDIO_FILES[key];
      try {
        const s = host.add(key, { volume: musicVolume() });
        const loop = !key.startsWith("music-title") && !key.startsWith("music-win");
        if (loop && info !== undefined) {
          // Die DATEI ist die Schleife (master.mjs schneidet sie so), also
          // deckt der Marker sie ganz ab — keine Innengrenzen, die driften
          // könnten, und MP3-Encoder-Lücken sind gegenstandslos.
          s.addMarker({ name: "loop", start: 0, duration: info.durationSec, config: { loop: true } });
          s.play("loop");
        } else {
          s.play();
        }
        currentMusic = { key, sound: s };
        played(key, key, "music");
      } catch {
        currentMusic = null;
      }
    },

    setMuted(v: boolean): void {
      settings = { ...settings, muted: v };
      writeAudioSettings(settings);
      if (host !== null) host.mute = v;
      applyMusicVolume();
    },
    setMusic(v: boolean): void {
      settings = { ...settings, music: v };
      writeAudioSettings(settings);
      applyMusicVolume();
    },
    setSfx(v: boolean): void {
      settings = { ...settings, sfx: v };
      writeAudioSettings(settings);
    },

    get settings(): AudioSettings {
      return settings;
    },

    report(): AudioReport {
      let bytes = 0;
      for (const file of loaded) {
        const info = AUDIO_FILES[file];
        if (info !== undefined) bytes += decodedBytes(info.durationSec);
      }
      return {
        enabled,
        filesLoaded: loaded.size,
        decodedMb: Math.round((bytes / (1024 * 1024)) * 100) / 100,
        decodedLimitMb: AUDIO_DECODED_MB,
        music: currentMusic?.key ?? null,
      };
    },

    dispose(): void {
      if (currentMusic !== null) {
        try { currentMusic.sound.stop(); currentMusic.sound.destroy(); } catch { /* egal */ }
        currentMusic = null;
      }
      loaded.clear();
      sent.clear();
      waiters.clear();
      lastAt.clear();
      lastVariant.clear();
    },
  };
};
