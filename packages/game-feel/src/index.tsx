/**
 * @domigo/game-feel — the juice kit (ALIVE-0, BLUEPRINT Part VII.2).
 *
 * A LEAF package: zero workspace deps, react peer only — task-ui, the games,
 * the Phaser overlay chrome, hub boards and the future arcade all consume feel
 * without pulling an item renderer. Everything here is presentation: nothing
 * imports @domigo/engine, nothing can touch a tier or XP.
 *
 * Settings live in localStorage `domigo:feel:v1`, DEVICE-scoped on purpose:
 * a shared classroom tablet stays silent no matter who signs in; a kid's own
 * phone keeps the preference across sign-ins. Losing it costs one tap (the
 * cosmetic-save philosophy). A future profile may SEED the default; the device
 * always wins. OS prefers-reduced-motion always wins over our toggle.
 *
 * Every primitive renders its END STATE instantly when motion is off, and the
 * CSS layer (globals.css `dgf-*`) carries @media/[data-motion] kill-switches as
 * the second belt. All randomness is seeded (core.ts) — deterministic confetti.
 *
 * Components are client-side by usage contract: they mount inside the games /
 * task surfaces (already client trees) or after user interaction, so the
 * conservative server snapshot (no sound, no motion) never causes a visible
 * hydration flip on SSR'd markup.
 */
"use client";

import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import type { ReactNode } from "react";
import {
  confettiPieces,
  DEFAULT_SETTINGS,
  graphemes,
  HAPTIC_PATTERNS,
  motionOK,
  parseSettings,
  SFX_RECIPES,
  sfxForTier,
  type FeelSettings,
  type SfxName,
  type Tier,
} from "./core.ts";

export { diffWords, sfxForTier, type DiffToken, type Tier } from "./core.ts";

// ---------------------------------------------------------------------------
// the settings store (module-level; useSyncExternalStore; no provider)
// ---------------------------------------------------------------------------

const KEY = "domigo:feel:v1";

export interface FeelSnapshot {
  sound: boolean;
  haptics: boolean;
  /** True when animations may run (user toggle AND the OS agree). */
  motionOK: boolean;
  /** The raw user choice, for the gear UI. */
  motion: "auto" | "reduce";
}

const SERVER_SNAPSHOT: FeelSnapshot = { sound: false, haptics: false, motionOK: false, motion: "auto" };

let settings: FeelSettings = DEFAULT_SETTINGS;
let osReduced = false;
let snapshot: FeelSnapshot = SERVER_SNAPSHOT;
let initialized = false;
const listeners = new Set<() => void>();

function recompute(): void {
  snapshot = {
    sound: settings.sound,
    haptics: settings.haptics,
    motionOK: motionOK(settings, osReduced),
    motion: settings.motion,
  };
  for (const l of listeners) l();
}

function init(): void {
  if (initialized || typeof window === "undefined") return;
  initialized = true;
  settings = parseSettings(window.localStorage.getItem(KEY));
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  osReduced = mq.matches;
  mq.addEventListener("change", (e) => {
    osReduced = e.matches;
    recompute();
  });
  window.addEventListener("storage", (e) => {
    if (e.key === KEY) {
      settings = parseSettings(e.newValue);
      recompute();
    }
  });
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) suspendAudio();
  });
  recompute();
}

function subscribe(cb: () => void): () => void {
  init();
  listeners.add(cb);
  return () => listeners.delete(cb);
}

/** Imperative snapshot — for Phaser scenes and other non-React code. */
export function feel(): FeelSnapshot {
  init();
  return snapshot;
}

/** Reactive snapshot for components. */
export function useGameFeel(): FeelSnapshot {
  return useSyncExternalStore(subscribe, () => {
    init();
    return snapshot;
  }, () => SERVER_SNAPSHOT);
}

export function setFeel(patch: Partial<FeelSettings>): void {
  init();
  settings = { ...settings, ...patch };
  try {
    window.localStorage.setItem(KEY, JSON.stringify(settings));
  } catch {
    /* private mode etc. — the in-memory setting still applies this session */
  }
  recompute();
}

// ---------------------------------------------------------------------------
// SFX synth (lazy AudioContext; zero asset bytes; master gain = classroom-soft)
// ---------------------------------------------------------------------------

let ctx: AudioContext | null = null;
let master: GainNode | null = null;

function audio(): { ctx: AudioContext; master: GainNode } | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = 0.25; // the classroom-soft ceiling
    master.connect(ctx.destination);
  }
  if (ctx.state === "suspended") void ctx.resume();
  return { ctx, master: master! };
}

/** Suspend the shared AudioContext (game pause veils + tab-hide call this). */
export function suspendAudio(): void {
  if (ctx && ctx.state === "running") void ctx.suspend();
}

let noiseBuffer: AudioBuffer | null = null;
function getNoise(c: AudioContext): AudioBuffer {
  if (!noiseBuffer) {
    // Deterministic-enough: a fixed LCG fills the buffer once (not Math.random —
    // the repo determinism rule applies even to noise).
    noiseBuffer = c.createBuffer(1, c.sampleRate * 0.3, c.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    let s = 0x2f6e2b1;
    for (let i = 0; i < data.length; i++) {
      s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
      data[i] = (s / 2147483648 - 1) * 0.6;
    }
  }
  return noiseBuffer;
}

/** Play a named recipe. No-ops unless sound is opted in. Safe to call anywhere. */
export function playSfx(name: SfxName): void {
  init();
  if (!snapshot.sound) return;
  const a = audio();
  if (!a) return;
  const { ctx: c, master: m } = a;
  const t0 = c.currentTime;
  for (const step of SFX_RECIPES[name]) {
    const at = t0 + step.at / 1000;
    const dur = step.dur / 1000;
    const gain = c.createGain();
    gain.gain.setValueAtTime(0, at);
    gain.gain.linearRampToValueAtTime(step.peak, at + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, at + dur);
    gain.connect(m);
    if ("noise" in step) {
      const src = c.createBufferSource();
      src.buffer = getNoise(c);
      let node: AudioNode = src;
      if (step.band) {
        const bp = c.createBiquadFilter();
        bp.type = "bandpass";
        bp.Q.value = 0.8;
        bp.frequency.setValueAtTime(step.band[0], at);
        bp.frequency.linearRampToValueAtTime(step.band[1], at + dur);
        node.connect(bp);
        node = bp;
      } else if (step.highpass) {
        const hp = c.createBiquadFilter();
        hp.type = "highpass";
        hp.frequency.value = step.highpass;
        node.connect(hp);
        node = hp;
      }
      node.connect(gain);
      src.start(at);
      src.stop(at + dur);
    } else {
      const osc = c.createOscillator();
      osc.type = step.wave;
      osc.frequency.setValueAtTime(step.freq, at);
      if (step.to !== undefined) osc.frequency.exponentialRampToValueAtTime(step.to, at + dur);
      osc.connect(gain);
      osc.start(at);
      osc.stop(at + dur);
    }
  }
}

/** Tier-audible feedback: ascending chimes per tier; wrong = the neutral thud. */
export function playTier(tier: Tier): void {
  playSfx(sfxForTier(tier));
}

/** Opt-in vibration. Wrong answers deliberately vibrate NOTHING. */
export function haptic(name: "correct" | "partial" | "close" | "stamp" | "found"): void {
  init();
  if (!snapshot.haptics) return;
  const pattern = HAPTIC_PATTERNS[name];
  if (pattern && typeof navigator !== "undefined" && "vibrate" in navigator) {
    navigator.vibrate(pattern);
  }
}

// ---------------------------------------------------------------------------
// <FeelGear/> — the sound/motion/vibration popover (mounts on game headers)
// ---------------------------------------------------------------------------

export function FeelGear(): ReactNode {
  const f = useGameFeel();
  const [open, setOpen] = useState(false);
  const popRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent): void => {
      if (e.key === "Escape") setOpen(false);
    };
    const onDown = (e: PointerEvent): void => {
      if (popRef.current && !popRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDown);
    };
  }, [open]);
  const canVibrate = typeof navigator !== "undefined" && "vibrate" in navigator;
  const row = { display: "flex", alignItems: "center", gap: 8, fontSize: 14, padding: "4px 0" } as const;
  return (
    <div ref={popRef} style={{ position: "relative", display: "inline-block" }}>
      <button
        type="button"
        className="dg-chip"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label="Sound & motion settings"
        onClick={() => setOpen((o) => !o)}
      >
        {f.sound ? "🔊" : "🔈"} <span aria-hidden="true">⚙︎</span>
      </button>
      {open && (
        <div
          role="dialog"
          aria-label="Sound & motion"
          className="dg-card"
          style={{ position: "absolute", right: 0, top: "calc(100% + 6px)", zIndex: 30, minWidth: 200, padding: "10px 14px", boxShadow: "var(--shadow-elevated)" }}
        >
          <label style={row}>
            <input type="checkbox" checked={f.sound} onChange={(e) => { setFeel({ sound: e.target.checked }); if (e.target.checked) playSfx("pop"); }} />
            Sound
          </label>
          {canVibrate && (
            <label style={row}>
              <input type="checkbox" checked={f.haptics} onChange={(e) => { setFeel({ haptics: e.target.checked }); if (e.target.checked) haptic("found"); }} />
              Vibration
            </label>
          )}
          <label style={row}>
            <input type="checkbox" checked={f.motion === "reduce"} onChange={(e) => setFeel({ motion: e.target.checked ? "reduce" : "auto" })} />
            Weniger Animation
          </label>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// celebration + transition primitives (all: end-state instantly when motion off)
// ---------------------------------------------------------------------------

const HUES = ["var(--accent)", "var(--correct)", "var(--partial)"] as const;

/** ≤5 seeded confetti pieces; self-clearing; decorative only (aria-hidden). */
export function Confetti({ seed, count = 5 }: { seed: string; count?: number }): ReactNode {
  const f = useGameFeel();
  const [gone, setGone] = useState(false);
  const pieces = useMemo(() => confettiPieces(seed, Math.min(count, 5)), [seed, count]);
  useEffect(() => {
    const t = setTimeout(() => setGone(true), 900);
    return () => clearTimeout(t);
  }, []);
  if (!f.motionOK || gone) return null;
  return (
    <span aria-hidden="true" style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
      {pieces.map((p, i) => (
        <span
          key={i}
          className="dgf-fall"
          style={{
            position: "absolute",
            left: `calc(50% + ${p.dx}%)`,
            top: 0,
            width: 8,
            height: 8,
            borderRadius: i % 2 ? 999 : 2,
            background: HUES[p.hue],
            animationDelay: `${p.delay}ms`,
            ["--dgf-rot" as string]: `${p.rot}deg`,
          }}
        />
      ))}
    </span>
  );
}

/** Scale-bounce entrance for stamps/slates (CASE CLOSED, EPISODE UPLOADED, TAKE 2). */
export function StampBounce({ children, sfx }: { children: ReactNode; sfx?: boolean }): ReactNode {
  const f = useGameFeel();
  useEffect(() => {
    if (sfx) {
      playSfx("stamp");
      haptic("stamp");
    }
    // fire once on mount by design
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return <span className={f.motionOK ? "dgf-stamp" : undefined} style={{ display: "inline-block" }}>{children}</span>;
}

/** Animated number ticker. Screen readers get ONE final announcement, not 12. */
export function CountUp({ from = 0, to, duration = 500, format, tick }: { from?: number; to: number; duration?: number; format?: (n: number) => string; tick?: boolean }): ReactNode {
  const f = useGameFeel();
  const [value, setValue] = useState(f.motionOK ? from : to);
  const [done, setDone] = useState(!f.motionOK);
  const fmt = format ?? ((n: number) => String(n));
  useEffect(() => {
    if (!f.motionOK) {
      setValue(to);
      setDone(true);
      return;
    }
    const steps = 12;
    let step = 0;
    const id = setInterval(() => {
      step++;
      const v = Math.round(from + ((to - from) * step) / steps);
      setValue(v);
      if (tick && step % 3 === 0) playSfx("tick");
      if (step >= steps) {
        clearInterval(id);
        setDone(true);
      }
    }, Math.max(16, duration / steps));
    return () => clearInterval(id);
    // restart only when the target changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [to]);
  return (
    <>
      <span aria-hidden="true">{fmt(value)}</span>
      <span className="dgf-sr-only" role="status">{done ? fmt(to) : ""}</span>
    </>
  );
}

/** Streak label pop ("🔥 Hot trail!") with sound + a confetti pinch at big milestones. */
export function StreakPop({ label, big }: { label: string; big?: boolean }): ReactNode {
  const f = useGameFeel();
  useEffect(() => {
    playSfx("streak");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [label]);
  return (
    <span style={{ position: "relative", display: "inline-block" }}>
      <span key={label} className={f.motionOK ? "dgf-pop-in" : undefined} style={{ display: "inline-block" }}>{label}</span>
      {big && <Confetti seed={label} count={3} />}
    </span>
  );
}

/** 200ms fade+rise on key change (scene/panel transitions). Instant when motion off. */
export function FadeSwap({ stateKey, children }: { stateKey: string; children: ReactNode }): ReactNode {
  const f = useGameFeel();
  return (
    <div key={stateKey} className={f.motionOK ? "dgf-fade-up" : undefined}>
      {children}
    </div>
  );
}

/** Tier-colored sweep across the feedback pill (transform-only — layout-safe). */
export function SweepBar({ tier }: { tier: Tier }): ReactNode {
  const f = useGameFeel();
  if (!f.motionOK) return null;
  const color = tier === "correct" ? "var(--correct)" : tier === "wrong" ? "var(--ink-soft, var(--muted))" : "var(--partial)";
  return (
    <span aria-hidden="true" style={{ position: "absolute", inset: 0, overflow: "hidden", borderRadius: "inherit", pointerEvents: "none" }}>
      <span className="dgf-sweep" style={{ position: "absolute", inset: 0, background: `linear-gradient(90deg, transparent, ${color}33, transparent)` }} />
    </span>
  );
}

/**
 * Grapheme-safe typewriter. The FULL text is present for screen readers from
 * frame 0; the animation is decoration. Tap the line (or Enter/Space when
 * focused) to complete instantly — skip always costs ≤1 tap.
 */
export function Typewriter({ text, cps = 55, onDone, tick }: { text: string; cps?: number; onDone?: () => void; tick?: boolean }): ReactNode {
  const f = useGameFeel();
  const chars = useMemo(() => graphemes(text), [text]);
  const [shown, setShown] = useState(f.motionOK ? 0 : chars.length);
  const doneRef = useRef(false);
  const done = shown >= chars.length;
  useEffect(() => {
    setShown(f.motionOK ? 0 : chars.length);
    doneRef.current = false;
    // restart per text; motion setting participates via the initial value only
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);
  useEffect(() => {
    if (done) {
      if (!doneRef.current) {
        doneRef.current = true;
        onDone?.();
      }
      return;
    }
    const id = setInterval(() => {
      setShown((s) => {
        const next = Math.min(s + 1, chars.length);
        if (tick && next % 4 === 0) playSfx("tick");
        return next;
      });
    }, 1000 / cps);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [done, text]);
  const skip = (): void => setShown(chars.length);
  return (
    <span
      onClick={done ? undefined : skip}
      onKeyDown={done ? undefined : (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          skip();
        }
      }}
      role={done ? undefined : "button"}
      tabIndex={done ? undefined : 0}
      aria-label={done ? undefined : "Show the whole line"}
      style={{ cursor: done ? undefined : "pointer" }}
    >
      <span className="dgf-sr-only">{text}</span>
      <span aria-hidden="true">{chars.slice(0, shown).join("")}</span>
      {!done && <span aria-hidden="true" className="dgf-caret">▏</span>}
    </span>
  );
}
