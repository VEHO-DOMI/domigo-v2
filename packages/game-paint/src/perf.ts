// THE PAINTED BOOK — perf.ts — the measuring instrument (teacher door, ?perf=1).
//
// R5-W1 · E1. The chapter had no way to answer "what is slow?" — no frame
// counter, no draw-call readout, no texture budget. This file is that answer,
// and it is built under three laws:
//
// 1. IT MEASURES, IT NEVER STEERS. Nothing computed here is read by the sim,
//    by a planner, or by any render path. A probe that is ON and a probe that
//    is OFF produce the SAME game. It reads `performance.now()` and nothing
//    else — never Math.random, never Date.now (the determinism law).
//
// 2. IT ATTACHES BY WRAPPING, NEVER BY EDITING THE HOT LOOP. The per-subsystem
//    breakdown comes from wrapping PaintScene's render* methods at runtime, the
//    draw-call count from wrapping the GL context, the art ledger from wrapping
//    TextureManager.exists. Deliberate: the render loop is a shared surface
//    that parallel lanes edit, and an instrument needing edits there would
//    fight them for exactly zero measurement gain. It also means a NEW
//    render* method is measured the day it is written, with no bookkeeping.
//
// 3. EVERY CAVEAT SHIPS INSIDE THE PAYLOAD. `notes[]` travels with the numbers,
//    so a report cannot be quoted without its own limits.
//
// Nesting is handled with exclusive ("self") time: renderContact calls
// renderImpact, and charging both the same milliseconds would inflate the
// total past 100 %. Each wrapper subtracts what its children spent.

import type Phaser from "phaser";

/** One measured distribution. All values in milliseconds. */
export interface FrameStats {
  n: number;
  min: number;
  p50: number;
  p95: number;
  max: number;
  mean: number;
}

export interface SubsystemStat {
  name: string;
  /** total self-time over the window ÷ frames in the window */
  msPerFrame: number;
  /** 95th percentile of a single call's self-time */
  p95: number;
  /** share of the measured render total */
  share: number;
  calls: number;
}

/** One stem the scene probed for. `resolved` = the texture was actually there. */
export interface ArtProbe {
  stem: string;
  probes: number;
  resolved: boolean;
  verdict: "art-gap" | "scope-bug" | "load-bug";
}

export interface ArtReport {
  /** distinct stems probed during the window */
  probed: number;
  resolved: number;
  /** stems that fell back because the art has not landed — sanctioned */
  artGaps: number;
  /** stems that exist on disk but this phase's scope never claimed — THE
   *  under-scoping class, and the one number that must stay zero */
  scopeBugs: number;
  /** in scope, on disk, still not loaded — the loader itself failed */
  loadBugs: number;
  misses: ArtProbe[];
}

export interface PerfReport {
  phase: string;
  renderer: "webgl" | "canvas" | "unknown";
  window: { frames: number; wallMs: number };
  frame: {
    /** CPU spent inside the engine step, prestep → postrender */
    cpu: FrameStats;
    /** wall-clock gap between frames (this is what fps is made of) */
    interval: FrameStats;
    actualFps: number;
    /** the fps this CPU cost alone would allow, if nothing else bound us */
    fpsFromCpu: number;
    over16: number;
    over33: number;
  };
  subsystems: SubsystemStat[];
  /** render total minus the sum of the measured parts — the honesty line */
  unattributed: { msPerFrame: number; share: number };
  gpu: {
    drawCallsPerFrame: number | null;
    glTextures: number;
    textureKeys: number;
    textureBytesEst: number;
    displayList: number;
    renderList: number;
  };
  heap: { usedMB: number | null; limitMB: number | null };
  art: ArtReport;
  overheadMsPerFrame: number;
  notes: string[];
}

export interface WeakEstimate {
  measuredP50Ms: number;
  measuredP95Ms: number;
  /** measured slope d(frameTime)/d(injectedMs), 0…1+ */
  cpuBoundness: number;
  /** a CHOSEN constant, not a measurement */
  factor: number;
  projectedP50Ms: number;
  projectedP95Ms: number;
  budgetMs: number;
  verdict: string;
  model: string;
  samples: Array<{ injectedMs: number; p50: number }>;
}

const RING_CAP = 4096;
const FRAME_BUDGET_MS = 1000 / 60;
const HALF_BUDGET_MS = 1000 / 30;
/** driven stepping yields this often — see advance() */
const YIELD_EVERY = 4;

/** Fixed-capacity sample buffer. Allocation-free after construction. */
class Ring {
  private buf = new Float64Array(RING_CAP);
  private len = 0;
  private head = 0;
  private total = 0;

  push(v: number): void {
    if (this.len === RING_CAP) {
      const dropped = this.buf[this.head] ?? 0;
      this.total -= dropped;
    } else {
      this.len++;
    }
    this.buf[this.head] = v;
    this.total += v;
    this.head = (this.head + 1) % RING_CAP;
  }

  clear(): void {
    this.len = 0;
    this.head = 0;
    this.total = 0;
  }

  get count(): number {
    return this.len;
  }

  get sum(): number {
    return this.total;
  }

  stats(): FrameStats {
    if (this.len === 0) return { n: 0, min: 0, p50: 0, p95: 0, max: 0, mean: 0 };
    const sorted = Array.from(this.buf.subarray(0, this.len)).sort((a, b) => a - b);
    const at = (q: number): number => sorted[Math.min(sorted.length - 1, Math.floor(q * sorted.length))] ?? 0;
    return {
      n: this.len,
      min: sorted[0] ?? 0,
      p50: at(0.5),
      p95: at(0.95),
      max: sorted[sorted.length - 1] ?? 0,
      mean: this.total / this.len,
    };
  }

  /** how many samples exceeded a threshold — needs a scan, only used at read time */
  over(limit: number): number {
    let n = 0;
    for (let i = 0; i < this.len; i++) if ((this.buf[i] ?? 0) > limit) n++;
    return n;
  }
}

/** What the probe needs to know about its host, without importing PaintScene. */
export interface PerfHost {
  game: Phaser.Game;
  /** the live scene, or null between phase mounts */
  scene: () => Phaser.Scene | null;
  phase: () => string;
  /** stems this phase claims it needs; null while no scoping exists yet */
  scope: () => ReadonlySet<string> | null;
  /** every stem the art map offers (i.e. what exists on disk) */
  artKeys: () => ReadonlySet<string>;
}

const round = (v: number, dp = 3): number => {
  const f = 10 ** dp;
  return Math.round(v * f) / f;
};

export class PerfProbe {
  private host: PerfHost;
  private installed = false;

  private cpu = new Ring();
  private interval = new Ring();
  private frames = 0;
  private windowStart = 0;
  private lastFrameEnd = 0;

  /** per-method exclusive time, name → ring of per-call self ms */
  private self = new Map<string, Ring>();
  private calls = new Map<string, number>();
  /** stack of accumulated child time, one entry per active wrapped call */
  private childStack: number[] = [];

  private drawCalls = 0;
  private drawCallRing = new Ring();

  private artProbes = new Map<string, { probes: number; resolved: boolean }>();

  /** milliseconds the instrument itself burned this window */
  private overhead = 0;

  private injectMs = 0;
  private notes: string[] = [];

  // saved originals, for a clean uninstall
  private protoPatched: Array<{ obj: Record<string, unknown>; key: string; orig: unknown }> = [];
  private glPatched: { gl: WebGLRenderingContext; drawArrays: unknown; drawElements: unknown } | null = null;
  private glTries = 0;
  private texturesPatched: { mgr: Record<string, unknown>; orig: unknown } | null = null;
  private onPreStep: (() => void) | null = null;
  private onPostRender: (() => void) | null = null;

  constructor(host: PerfHost) {
    this.host = host;
    this.windowStart = performance.now();
  }

  // ── installation ─────────────────────────────────────────────────────────

  /**
   * @param proto PaintScene.prototype — every own method named render* is
   *   wrapped, so a sub-render added later is measured without a code change.
   */
  install(proto: object): void {
    if (this.installed) return;
    this.installed = true;
    this.wrapRenderMethods(proto);
    this.wrapGl();
    this.wrapTextures();
    this.wrapLoop();
  }

  uninstall(): void {
    if (!this.installed) return;
    this.installed = false;
    for (const p of this.protoPatched) p.obj[p.key] = p.orig;
    this.protoPatched = [];
    if (this.glPatched !== null) {
      const g = this.glPatched.gl as unknown as Record<string, unknown>;
      g["drawArrays"] = this.glPatched.drawArrays;
      g["drawElements"] = this.glPatched.drawElements;
      this.glPatched = null;
    }
    if (this.texturesPatched !== null) {
      this.texturesPatched.mgr["exists"] = this.texturesPatched.orig;
      this.texturesPatched = null;
    }
    const ev = this.host.game.events;
    if (this.onPreStep !== null) ev.off("prestep", this.onPreStep);
    if (this.onPostRender !== null) ev.off("postrender", this.onPostRender);
    this.onPreStep = null;
    this.onPostRender = null;
  }

  private wrapRenderMethods(proto: object): void {
    const bag = proto as Record<string, unknown>;
    for (const key of Object.getOwnPropertyNames(proto)) {
      if (!key.startsWith("render")) continue;
      const orig = bag[key];
      if (typeof orig !== "function") continue;
      const fn = orig as (...a: unknown[]) => unknown;
      const probe = this;
      bag[key] = function (this: unknown, ...args: unknown[]): unknown {
        const t0 = performance.now();
        probe.childStack.push(0);
        try {
          return fn.apply(this, args);
        } finally {
          const total = performance.now() - t0;
          const child = probe.childStack.pop() ?? 0;
          probe.note(key, total - child);
          const depth = probe.childStack.length;
          if (depth > 0) probe.childStack[depth - 1] = (probe.childStack[depth - 1] ?? 0) + total;
        }
      };
      this.protoPatched.push({ obj: bag, key, orig });
    }
  }

  private note(name: string, selfMs: number): void {
    let ring = this.self.get(name);
    if (ring === undefined) {
      ring = new Ring();
      this.self.set(name, ring);
    }
    ring.push(selfMs);
    this.calls.set(name, (this.calls.get(name) ?? 0) + 1);
  }

  /** Phaser boots its renderer asynchronously, so the GL context may not exist
   *  when the probe installs. Retried from the frame hook until it takes. */
  private wrapGl(): void {
    if (this.glPatched !== null) return;
    const renderer = this.host.game.renderer as unknown as { gl?: WebGLRenderingContext };
    const gl = renderer.gl;
    if (gl === undefined || gl === null) return;
    const bag = gl as unknown as Record<string, unknown>;
    const origArrays = bag["drawArrays"];
    const origElements = bag["drawElements"];
    const dA = (origArrays as (...a: unknown[]) => unknown).bind(gl);
    const dE = (origElements as (...a: unknown[]) => unknown).bind(gl);
    const probe = this;
    bag["drawArrays"] = function (...a: unknown[]): unknown {
      probe.drawCalls++;
      return dA(...a);
    };
    bag["drawElements"] = function (...a: unknown[]): unknown {
      probe.drawCalls++;
      return dE(...a);
    };
    this.glPatched = { gl, drawArrays: origArrays, drawElements: origElements };
  }

  private wrapTextures(): void {
    const mgr = this.host.game.textures as unknown as Record<string, unknown>;
    const orig = mgr["exists"];
    if (typeof orig !== "function") return;
    const fn = orig as (key: string) => boolean;
    const probe = this;
    mgr["exists"] = function (this: unknown, key: string): boolean {
      const hit = fn.call(this, key);
      if (typeof key === "string" && key.startsWith("pb-")) {
        const stem = key.slice(3);
        const rec = probe.artProbes.get(stem);
        if (rec === undefined) probe.artProbes.set(stem, { probes: 1, resolved: hit });
        else {
          rec.probes++;
          if (hit) rec.resolved = true;
        }
      }
      return hit;
    };
    this.texturesPatched = { mgr, orig };
  }

  private wrapLoop(): void {
    const ev = this.host.game.events;
    let stepStart = 0;
    this.onPreStep = (): void => {
      stepStart = performance.now();
    };
    this.onPostRender = (): void => {
      const end = performance.now();
      const t0 = performance.now();
      if (this.glPatched === null && this.glTries < 120) {
        this.glTries++;
        this.wrapGl();
        if (this.glPatched === null && this.glTries === 120) {
          this.notes.push("drawCalls: unavailable — no WebGL context after 120 frames (Phaser.AUTO may have chosen Canvas).");
        }
      }
      this.cpu.push(end - stepStart);
      if (this.lastFrameEnd > 0) this.interval.push(end - this.lastFrameEnd);
      this.lastFrameEnd = end;
      this.frames++;
      this.drawCallRing.push(this.drawCalls);
      this.drawCalls = 0;
      if (this.injectMs > 0) burn(this.injectMs);
      this.overhead += performance.now() - t0 - this.injectMs;
    };
    ev.on("prestep", this.onPreStep);
    ev.on("postrender", this.onPostRender);
  }

  // ── reading ──────────────────────────────────────────────────────────────

  reset(): void {
    this.cpu.clear();
    this.interval.clear();
    this.drawCallRing.clear();
    this.self.clear();
    this.calls.clear();
    this.artProbes.clear();
    this.childStack = [];
    this.frames = 0;
    this.overhead = 0;
    this.drawCalls = 0;
    this.lastFrameEnd = 0;
    this.windowStart = performance.now();
  }

  read(): PerfReport {
    const game = this.host.game;
    const scene = this.host.scene();
    const frames = Math.max(1, this.frames);
    const notes = [...this.notes];

    // ── subsystems, exclusive time, sorted by cost ──
    const renderRing = this.self.get("render");
    const renderTotalMs = renderRing === undefined ? 0 : renderRing.sum;
    // `render`'s own self time excludes its children, so the true render total
    // is self(render) + Σ self(children). That sum IS the denominator.
    let partsMs = 0;
    const subsystems: SubsystemStat[] = [];
    for (const [name, ring] of this.self) {
      if (name === "render") continue;
      partsMs += ring.sum;
    }
    const totalMs = renderTotalMs + partsMs;
    for (const [name, ring] of this.self) {
      if (name === "render") continue;
      const s = ring.stats();
      subsystems.push({
        name,
        msPerFrame: round(ring.sum / frames),
        p95: round(s.p95),
        share: totalMs > 0 ? round(ring.sum / totalMs, 4) : 0,
        calls: this.calls.get(name) ?? 0,
      });
    }
    subsystems.sort((a, b) => b.msPerFrame - a.msPerFrame);

    // ── GPU ──
    const renderer = game.renderer as unknown as {
      gl?: unknown;
      glTextureWrappers?: Array<{ width?: number; height?: number }>;
    };
    const wrappers = renderer.glTextureWrappers ?? [];
    let bytes = 0;
    for (const w of wrappers) bytes += (w.width ?? 0) * (w.height ?? 0) * 4;
    const rendererKind: "webgl" | "canvas" | "unknown" =
      renderer.gl !== undefined && renderer.gl !== null ? "webgl" : this.glPatched === null ? "canvas" : "unknown";

    const cameras = scene?.cameras as unknown as { main?: { renderList?: unknown[] } } | undefined;
    const renderList = cameras?.main?.renderList?.length ?? 0;
    const displayList = (scene?.children as unknown as { length?: number } | undefined)?.length ?? 0;

    // ── heap (Chrome only, bucketed) ──
    const mem = (performance as unknown as { memory?: { usedJSHeapSize: number; jsHeapSizeLimit: number } }).memory;
    if (mem === undefined) notes.push("heap: performance.memory is Chrome-only — reported as null here.");

    // ── art ledger ──
    const scope = this.host.scope();
    const onDisk = this.host.artKeys();
    const misses: ArtProbe[] = [];
    let resolved = 0;
    let artGaps = 0;
    let scopeBugs = 0;
    let loadBugs = 0;
    const live = this.host.game.textures;
    for (const [stem, rec] of this.artProbes) {
      // A probe that answered "no" DURING the load and "yes" afterwards is not
      // a miss — it is the loader doing its job. Only the END STATE counts, so
      // re-ask the live manager before condemning anything. (Without this, p2
      // reported 66 phantom misses that were all present by the time anyone
      // looked.)
      if (rec.resolved || live.exists(`pb-${stem}`)) {
        resolved++;
        continue;
      }
      const exists = onDisk.has(stem);
      // THREE verdicts, and only the FIRST is allowed to be non-zero. Today
      // "the art has not landed yet" and "I forgot to load it" are the same
      // observation — tex() falls back to a procedural blob either way, and no
      // structural gate can see the difference. Splitting them is the whole
      // point of this ledger:
      //   art-gap   = no PNG on disk. Sanctioned; check-paint-art + the
      //               allowlist own this case (the keen-art law).
      //   scope-bug = the PNG exists but this phase's scope never claimed it.
      //               THE under-scoping defect class.
      //   load-bug  = in scope, on disk, still not loaded — the loader failed.
      const verdict: ArtProbe["verdict"] = !exists
        ? "art-gap"
        : scope !== null && !scope.has(stem)
          ? "scope-bug"
          : "load-bug";
      if (verdict === "art-gap") artGaps++;
      else if (verdict === "scope-bug") scopeBugs++;
      else loadBugs++;
      misses.push({ stem, probes: rec.probes, resolved: false, verdict });
    }
    misses.sort((a, b) => b.probes - a.probes);

    const cpu = this.cpu.stats();
    const interval = this.interval.stats();
    const loop = game.loop as unknown as { actualFps?: number };

    const overheadPerFrame = this.overhead / frames;
    notes.push(
      `instrument overhead measured at ${round(overheadPerFrame)} ms/frame; subsystem times are EXCLUSIVE (children subtracted).`,
    );
    notes.push(
      "performance.now() is coarsened to ~100 µs in Chrome without cross-origin isolation, so a sub-0.1 ms subsystem reads as noise; msPerFrame is averaged over the whole window to stay resolvable.",
    );
    if (renderTotalMs === 0) notes.push("render() was never observed — the probe was installed after the scene, or the phase is not drawing.");

    return {
      phase: this.host.phase(),
      renderer: rendererKind,
      window: { frames: this.frames, wallMs: round(performance.now() - this.windowStart, 1) },
      frame: {
        cpu: statRound(cpu),
        interval: statRound(interval),
        actualFps: round(loop.actualFps ?? 0, 1),
        fpsFromCpu: cpu.p50 > 0 ? round(1000 / cpu.p50, 1) : 0,
        over16: this.cpu.over(FRAME_BUDGET_MS),
        over33: this.cpu.over(HALF_BUDGET_MS),
      },
      subsystems,
      unattributed: {
        msPerFrame: round(renderTotalMs / frames),
        share: totalMs > 0 ? round(renderTotalMs / totalMs, 4) : 0,
      },
      gpu: {
        drawCallsPerFrame: this.glPatched === null ? null : Math.round(this.drawCallRing.stats().mean),
        glTextures: wrappers.length,
        textureKeys: Object.keys((game.textures as unknown as { list: object }).list).length,
        textureBytesEst: bytes,
        displayList,
        renderList,
      },
      heap: {
        usedMB: mem === undefined ? null : round(mem.usedJSHeapSize / 1048576, 1),
        limitMB: mem === undefined ? null : round(mem.jsHeapSizeLimit / 1048576, 1),
      },
      art: { probed: this.artProbes.size, resolved, artGaps, scopeBugs, loadBugs, misses },
      overheadMsPerFrame: round(overheadPerFrame),
      notes,
    };
  }

  /** Reset, let N frames go by, then report. The window is counted in FRAMES,
   *  never in wall-clock, so a slow machine measures the same amount of work. */
  async sample(frames = 180): Promise<PerfReport> {
    // discard mount + JIT warm-up before the window opens
    await waitFrames(30);
    this.reset();
    await waitFrames(frames);
    const r = this.read();
    r.notes.push(`window = ${frames} frames after a 30-frame warm-up discard.`);
    return r;
  }

  /**
   * DRIVEN measurement: step the engine by hand instead of waiting for the
   * browser's frame clock.
   *
   * Why this exists. An automated browser pane runs its tab HIDDEN, and a
   * hidden tab gets zero requestAnimationFrame callbacks — so `sample()` above
   * measures nothing there, and any fps read from it would be a fiction.
   * `game.step(time, delta)` runs the identical path a real frame runs
   * (PRE_STEP → scene.update → scene.render → real GL draws → POST_RENDER), so
   * the CPU cost measured here is the true cost of a frame.
   *
   * WHAT THIS DOES AND DOES NOT MEASURE — the honest boundary:
   *   IT DOES measure CPU milliseconds per frame, the per-subsystem split, GL
   *     draw calls, texture memory, and heap. Those are device-independent
   *     work, and they are what the weak-device projection is built on.
   *   IT DOES NOT measure achieved frames per second. There is no vsync here
   *     and no compositor, so "fps" is reported as a CEILING (1000 ÷ CPU ms) —
   *     the rate this CPU cost would allow if nothing else bound the frame.
   *
   * The clock is synthetic and advances by exactly `deltaMs` per step, so the
   * fixed-tick sim runs one tick per frame just as it does at 60 Hz, and two
   * runs of the same phase measure the same amount of work.
   */
  async drive(frames = 180, deltaMs = 1000 / 60): Promise<PerfReport> {
    await this.advance(30, deltaMs); // warm-up: JIT, first-touch textures, lazy caches
    this.reset();
    await this.advance(frames, deltaMs);
    const r = this.read();
    r.notes.push(
      `DRIVEN window: ${frames} hand-stepped frames at ${round(deltaMs, 2)} ms delta, after a 30-frame warm-up. ` +
        "Achieved fps was NOT measured (no vsync in a driven step); frame.fpsFromCpu is a CEILING, not an observation.",
    );
    return r;
  }

  /**
   * Nudge every scene's loader. Phaser's queue is known to stall around 96 %
   * on this chapter (290 separate image requests), and the existing recipe for
   * it reached the game through the dev-only harness — which does not exist in
   * a production build, i.e. exactly the build worth measuring.
   */
  pump(): void {
    const scenes = (this.host.game.scene as unknown as { scenes: Array<{ load?: { checkLoadQueue?: () => void } }> }).scenes;
    for (const s of scenes) s.load?.checkLoadQueue?.();
  }

  /** Is there anything to measure yet? Loader progress + scene readiness. */
  status(): Array<{ key: string; status: number; progress: number; toLoad: number; done: number; children: number }> {
    const scenes = (this.host.game.scene as unknown as {
      scenes: Array<{
        sys?: { settings?: { key?: string; status?: number } };
        load?: { progress?: number; totalToLoad?: number; totalComplete?: number };
        children?: { length?: number };
      }>;
    }).scenes;
    return scenes.map((s) => ({
      key: s.sys?.settings?.key ?? "?",
      status: s.sys?.settings?.status ?? -1,
      progress: round(s.load?.progress ?? 0, 3),
      toLoad: s.load?.totalToLoad ?? 0,
      done: s.load?.totalComplete ?? 0,
      children: s.children?.length ?? 0,
    }));
  }

  /**
   * Step the engine `n` times on a synthetic clock, yielding to the event loop
   * every `YIELD_EVERY` frames.
   *
   * The yield is not politeness, it is correctness. Stepping a WebGL game in a
   * tight synchronous loop queues command buffers that nothing drains — there
   * is no vsync in a driven step — so each successive frame blocks longer on
   * the driver and the measured "CPU" cost climbs away from anything the game
   * actually costs. Yielding lets the GPU process drain between batches, which
   * is the closest a driven step gets to how a real frame is paced.
   */
  private async advance(n: number, deltaMs: number): Promise<void> {
    const game = this.host.game as unknown as { step: (t: number, d: number) => void };
    let t = performance.now();
    for (let i = 0; i < n; i++) {
      t += deltaMs;
      game.step(t, deltaMs);
      if ((i + 1) % YIELD_EVERY === 0) await new Promise((r) => setTimeout(r, 0));
    }
  }

  /**
   * Is the frame CPU-bound? Inject a known scalar load and measure the slope.
   * A slope near 1 means added CPU cost lands 1:1 in frame time, which is the
   * only condition under which multiplying by a "slow device" factor is honest.
   */
  async sweep(factor = 4): Promise<WeakEstimate> {
    const deltaMs = 1000 / 60;
    const samples: Array<{ injectedMs: number; p50: number }> = [];
    for (const injectMs of [0, 1, 2, 4]) {
      this.injectMs = injectMs;
      await this.advance(20, deltaMs);
      this.reset();
      await this.advance(60, deltaMs);
      samples.push({ injectedMs: injectMs, p50: round(this.cpu.stats().p50) });
    }
    this.injectMs = 0;

    const first = samples[0];
    const last = samples[samples.length - 1];
    const slope = first !== undefined && last !== undefined && last.injectedMs > 0
      ? (last.p50 - first.p50) / last.injectedMs
      : 0;

    await this.advance(20, deltaMs);
    this.reset();
    await this.advance(120, deltaMs);
    const s = this.cpu.stats();
    const reliable = slope >= 0.8;
    return {
      measuredP50Ms: round(s.p50),
      measuredP95Ms: round(s.p95),
      cpuBoundness: round(slope, 2),
      factor,
      projectedP50Ms: round(s.p50 * factor),
      projectedP95Ms: round(s.p95 * factor),
      budgetMs: round(FRAME_BUDGET_MS, 1),
      verdict: !reliable
        ? "not CPU-bound — the projection over-predicts and must not be quoted as a device figure"
        : s.p50 * factor <= FRAME_BUDGET_MS
          ? "comfortable"
          : s.p50 * factor <= HALF_BUDGET_MS
            ? "tight (between 30 and 60 fps)"
            : "over budget",
      model:
        `Weak-device figure = measured CPU frame time × ${factor}. The factor ${factor} is a CHOSEN constant ` +
        "standing for a mid-range school device against this machine on single-threaded scalar JS; it is NOT measured here. " +
        "The projection models CPU time only — not GPU fill rate, not texture upload, not memory pressure, not GC, not bandwidth. " +
        "It is valid only while cpuBoundness ≥ 0.8; below that the frame has non-CPU slack and the number over-predicts. " +
        "A device that is fill-rate-bound will be WORSE than this predicts, not better.",
      samples,
    };
  }
}

const statRound = (s: FrameStats): FrameStats => ({
  n: s.n,
  min: round(s.min),
  p50: round(s.p50),
  p95: round(s.p95),
  max: round(s.max),
  mean: round(s.mean),
});

/** Burn approximately `ms` of CPU in a tight scalar loop (sweep only). */
const burn = (ms: number): void => {
  const t0 = performance.now();
  let sink = 0;
  while (performance.now() - t0 < ms) {
    for (let i = 0; i < 2000; i++) sink += i % 7;
  }
  if (sink === -1) throw new Error("unreachable");
};

const waitFrames = (n: number): Promise<void> =>
  new Promise((resolve) => {
    let left = n;
    const tick = (): void => {
      left--;
      if (left <= 0) resolve();
      else requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });
