/**
 * R5 · S1 · DER KLANG-DIREKTOR — ein Modul, das in dieser Runde niemand aufruft.
 *
 * S1 baut die Fabrik und das Modul; **S2 verdrahtet es** (nach Welle 5). Dieser
 * PR ändert das Spielverhalten deshalb nicht, und das ist beweisbar: weder
 * `PaintScene` noch `PaintGame` importieren irgendetwas von hier, und
 * `pnpm check:bundle` liefert dieselbe Zahl wie vorher.
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
  type Reaction, type StemSpec,
} from "./audioManifest.ts";
import { AUDIO_FILES } from "./audioFiles.ts";
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

// ── Der Direktor ─────────────────────────────────────────────────────────────

const DUCKING_FAMILIES = new Set(["positive"]);

export interface AudioDirector {
  /** false, solange es keine Tonmaschine oder keine Dateien gibt */
  readonly enabled: boolean;
  /** Bank und Musik der Phase holen — NACH create(), nie im preload */
  decodeAfterCreate(phaseId: string): Promise<void>;
  /** ein Ereignis aus einer der drei Unionen */
  on(union: EventUnion, event: string, payload?: Readonly<Record<string, unknown>>): void;
  /** der Schritt-Takt: der Untergrund kommt aus der Phase, die Wucht aus dem Fall */
  footstep(surface: "paper" | "garden" | "board", speed01?: number): void;
  /** die Landung, nach derselben Schwelle wie der Kreidestaub */
  land(hard: boolean): void;
  /** die Musik einer Phase, des Auftakts oder der Bilanz */
  music(which: string | null): Promise<void>;
  setMuted(v: boolean): void;
  setMusic(v: boolean): void;
  setSfx(v: boolean): void;
  readonly settings: AudioSettings;
  /** alles anhalten und freigeben (Szenen-Ende) */
  dispose(): void;
}

export const createAudioDirector = (deps: DirectorDeps = {}): AudioDirector => {
  const host = deps.sound ?? null;
  const now = deps.now ?? (() => Date.now());
  const hasFile = deps.hasFile ?? ((f: string) => AUDIO_FILES[f] !== undefined);
  const fetchAudio = deps.fetchAudio
    ?? (async (url: string) => (await fetch(url)).arrayBuffer());

  let settings: AudioSettings = deps.settings ?? readAudioSettings() ?? AUDIO_DEFAULTS;

  const playable = STEMS.filter((s) => filesOf(s).some((f) => hasFile(f)));
  const enabled = host !== null && playable.length > 0;

  const loaded = new Set<string>();
  const lastAt = new Map<string, number>();
  const lastVariant = new Map<string, number>();
  let currentMusic: { key: string; sound: HostSound } | null = null;
  let duckUntil = 0;

  const filesFor = (spec: StemSpec): readonly string[] => filesOf(spec).filter((f) => hasFile(f));

  const decode = async (file: string): Promise<void> => {
    if (host === null || loaded.has(file)) return;
    try {
      const data = await fetchAudio(audioUrl(file));
      host.decodeAudio(file, data);
      loaded.add(file);
    } catch {
      /* eine fehlende Datei macht das Spiel leiser, nicht kaputt */
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
    } catch {
      /* eine Tonmaschine, die gerade nicht kann, macht das Spiel nicht kaputt */
    }
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
        const got = Number(payload.got ?? 1);
        const files = filesFor(stemSpec(stem) as StemSpec);
        const file = files[Math.min(files.length - 1, Math.max(0, got - 1))];
        if (file !== undefined && loaded.has(file) && host !== null && !settings.muted && settings.sfx) {
          try { host.add(file, { volume: BUSES.sfx }).play(); } catch { /* siehe oben */ }
        }
        return;
      }
      playStem(stem);
    },

    footstep(surface: "paper" | "garden" | "board", speed01 = 1): void {
      playStem(`step-${surface}`, 0.35 + 0.65 * Math.min(1, Math.max(0, speed01)));
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

    dispose(): void {
      if (currentMusic !== null) {
        try { currentMusic.sound.stop(); currentMusic.sound.destroy(); } catch { /* egal */ }
        currentMusic = null;
      }
      loaded.clear();
      lastAt.clear();
      lastVariant.clear();
    },
  };
};
