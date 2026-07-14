/**
 * The overworld scene — W-1 WORLD-ALIVE: no longer a single fixed screen.
 * A zone renders either its DATA floor plan (map@1 `zone.layout` — variable
 * size, scrolling follow-camera, doors into neighbouring zones) or its legacy
 * art-gen THEMES room (G1 until its retrofit — byte-identical behavior).
 * Encounter nodes + the zone NPC are overlap zones that call back into React
 * (the BattleStage / dialogue overlay). Phaser is imported statically; this
 * module only ever loads in the client chunk (next/dynamic ssr:false).
 */
import Phaser from "phaser";
import { paintPlayerSprite, paintTileset, resolveZoneTheme, DOMIGO_GREEN, TILE_KINDS, FACINGS, type Facing, type TileKind } from "@domigo/art-gen";
import { playSfx } from "@domigo/game-feel";
import { walkFrameKey } from "./anim.ts";
import { drainAlpha } from "./battle.ts";
import { findPath, nearestWalkable, type Cell, type GridSpec } from "./path.ts";
import { rasterize } from "./rasterize.ts";
import { cellKey, type ParsedZone } from "./world.ts";

/** G-A1 depth plan (the scene otherwise relies on insertion order): the drain
 *  veil sits above the drained WORLD (floor/walls/props) but below everything
 *  ALIVE (player, nodes, NPC) — the kid and the magic keep their color while
 *  the room around them is washed out until words are won back. */
const DEPTH_VEIL = 1;
const DEPTH_ALIVE = 2;
const DEPTH_FX = 3;

const SRC = 48; // art-gen source resolution — crafted 1:1 (was 16px upscaled 3× = chunky)
const SCALE = 1; // rasterize scale; 1:1 keeps the crisp GBA pixels (no interpolation)
const TILE = SRC * SCALE; // 48px display tile — grid/save/camera/tap math all unchanged
// W-1: the VIEWPORT (what the canvas shows) stays the FireRed-ish 15×11 frame;
// the WORLD behind it is whatever size the zone's layout declares — the camera
// follows the player through it. Legacy THEMES rooms are exactly one viewport,
// so G1's framing is unchanged by construction.
const VIEW_W = 15 * TILE;
const VIEW_H = 11 * TILE;

/** Cosmetic save state for ONE zone — position (px) + cleared node cells.
 *  W-1: `cleared` entries are CELL KEYS ("c,r" — layout-stable); legacy v1
 *  node INDICES (numbers) are still accepted and self-heal to cell keys on
 *  the next checkpoint. */
export interface OverworldState {
  zoneId: string;
  pos: [number, number];
  cleared: Array<string | number>;
}

/** D-pad state, written by the React overlay, read every tick (A1-1). Sharing a
 *  mutable object keeps the d-pad and the keyboard in the SAME axis expressions
 *  in update() — touch parity with keys by construction, never a second path. */
export interface PadState {
  up: boolean;
  down: boolean;
  left: boolean;
  right: boolean;
}

export interface OverworldConfig {
  seed: number;
  zoneId: string;
  /** map@1 zone's `render.generator` → the per-zone theme (palette + props —
   *  and, for legacy zones without a data layout, the room layout too). */
  generator: string;
  /** W-1: the parsed data floor plan; null/absent ⇒ the legacy THEMES room. */
  layout?: ParsedZone | null;
  /** W-1: zone shorts whose chapters are released. Doors to anything else are
   *  ink-SEALED (solid; bump feedback) until the story opens them. */
  unlockedZones?: readonly string[];
  /** W-1: entering through a door spawns HERE (world px), beating the save pos. */
  spawnPx?: [number, number] | null;
  /** W-1: the player stepped on an open door → travel (React fades + navigates). */
  onDoor?: (targetZoneShort: string) => void;
  /** W-1: the player bumped a sealed door (throttled) — React shows the copy line. */
  onSealedDoor?: () => void;
  encounterCount: number;
  onEncounter: (idx: number) => void;
  onNpc: () => void;
  /** Restore cosmetic state on boot — position may be null (fresh entry);
   *  cleared applies regardless (zone progress is world-persistent now). */
  initial?: { pos: [number, number] | null; cleared: Array<string | number> } | null;
  /** Reports cosmetic state (throttled) for checkpointing. */
  onState?: (s: OverworldState) => void;
  /** Floating d-pad state (coarse-pointer devices); OR'd with the keyboard. */
  pad?: PadState;
  /** A1-3: OS/user reduced-motion — walk cycle, tweens, burst and camera GLIDE
   *  are stilled (the follow camera tracks instantly; tracking is function,
   *  not decoration — without it a scrolling map is unplayable). */
  reducedMotion?: boolean;
  /** A1-4: stable per-STUDENT avatar seed (fnv1a32 of userId). Falls back to
   *  the zone seed for old callers/tests. Cosmetic only → no migration. */
  playerSeed?: number;
  /** LOOK-1: real-art stems present on disk (stem → URL), resolved server-side
   *  by apps/web/lib/tile-art.ts. preload() queues them; tex() prefers a loaded
   *  image over the procedural paint PER KIND — fully incremental, zero risk. */
  tileArt?: Record<string, string>;
}

/** Prompt-library filename stems → engine texture kinds (everything else is
 *  already kind-named: floor, wall, path, door, grass, …). `finn_down` drives
 *  the NPC — landing that one PNG retires the Finn-as-desk placeholder. */
const STEM_ALIAS: Record<string, string> = {
  blackboard: "board",
  desk: "accent2",
  sparkle: "encounter",
  finn_down: "npc",
  door_sealed: "door-sealed",
};

/** W-1: how each encounter-node family renders. Every style is the same
 *  overlap → the same BattleStage → the one grading brain; only the fiction
 *  changes (✦ sparkles in classrooms, tall grass rustles outdoors, …).
 *  Families whose art lands in later waves fall back to the sparkle. */
const NODE_KIND: Record<string, TileKind> = {
  sparkle: "encounter",
  grass: "grass",
  puddle: "encounter",
  page: "encounter",
  mote: "encounter",
  wanderer: "encounter",
};

export class OverworldScene extends Phaser.Scene {
  private cfg: OverworldConfig;
  private player!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys | null = null;
  private wasd: Record<"W" | "A" | "S" | "D", Phaser.Input.Keyboard.Key> | null = null;
  private nodes = new Map<number, Phaser.GameObjects.Image>();
  private paused = false;
  // A1-2: pause-on-blur (Law 9). Distinct from `paused` (which is the React
  // overlay's turn): while backgrounded the sim halts but no encounter fires,
  // so resuming can't jump or trigger a stale overlap.
  private blurred = false;
  private facing: Facing = "down";
  private tick = 0;
  // A1-3 walk cycle: ms accumulated while moving; drives the foot-lift phase.
  private walkTimer = 0;
  private lastReport = { x: 0, y: 0 };
  // A1-1 tap-to-move: the zone's walkable grid + the waypoint queue being walked.
  private blockedCells = new Set<number>();
  private pathQueue: Cell[] = [];
  // W-1: the world is layout-sized now (legacy rooms = exactly one viewport).
  private mapW = 15;
  private mapH = 11;
  // W-1 doors: open-door cell index → target zone short; sealed cells (subset
  // of blocked) deliver the bump line. Armed only after the player has stood
  // OFF every door cell, so a door-adjacent spawn can't instantly bounce back.
  private doorByCell = new Map<number, string>();
  private sealedCells = new Set<number>();
  private doorArmed = false;
  private traveling = false;
  private lastSealedBump = 0;
  // G-A1 Word-Battle: the drained-world veil + the node burst emitter (one per
  // scene, reused via explode() — per-encounter emitters would leak).
  private veil: Phaser.GameObjects.Rectangle | null = null;
  private burst: Phaser.GameObjects.Particles.ParticleEmitter | null = null;

  constructor(cfg: OverworldConfig) {
    super("overworld");
    this.cfg = cfg;
  }

  /** The CANVAS size — the fixed viewport, NOT the world (W-1). */
  static dimensions(): { width: number; height: number } {
    return { width: VIEW_W, height: VIEW_H };
  }

  /** LOOK-1: queue whatever real art exists; a failed load just leaves the
   *  procedural fallback in place (Phaser logs a warning, nothing breaks). */
  preload(): void {
    const ns = this.cfg.zoneId.split(".").pop() ?? "z";
    for (const [stem, url] of Object.entries(this.cfg.tileArt ?? {})) {
      if (stem.startsWith("player_") || stem.startsWith("_")) continue; // player HOLD; _style_key is a reference, not a tile
      const kind = STEM_ALIAS[stem] ?? stem;
      this.load.image(`img-${kind}-${ns}`, url);
    }
  }

  create(): void {
    // per-zone theme + texture namespace. Phaser textures are GLOBAL; namespacing
    // the tileset keys by zone fixes the "first zone to load wins" collision so
    // each zone renders its own palette + props. Player sprite stays shared.
    const theme = resolveZoneTheme(this.cfg.generator);
    const ns = this.cfg.zoneId.split(".").pop() ?? "z";
    const zone = this.cfg.layout ?? null;
    const nodeStyle = zone?.nodeStyle ?? "sparkle";
    const nodeKind: TileKind = NODE_KIND[nodeStyle] ?? "encounter";
    // Real art wins PER KIND when its image actually loaded; art-gen paint is
    // the fallback for every other kind.
    const tex = (key: string): string =>
      this.textures.exists(`img-${key}-${ns}`) ? `img-${key}-${ns}` : `t-${key}-${ns}`;

    // W-1: a data zone's tile vocabulary = its legend props + doors + its node
    // kind; a legacy zone keeps its theme's extraKinds. Unknown kinds paint
    // blank — VS-18 is the authoring gate; the runtime never throws over art.
    const extraKinds = zone
      ? ([...new Set([
          ...Object.values(zone.legend).flatMap((e) => ("prop" in e ? [e.prop] : [])),
          "door", "door-sealed", nodeKind,
        ])] as TileKind[])
      : theme.extraKinds;
    const tileset = paintTileset(this.cfg.seed, {
      palette: theme.palette,
      accent: DOMIGO_GREEN,
      kinds: [...new Set([...TILE_KINDS, ...extraKinds])],
    });
    for (const [key, img] of Object.entries(tileset.tiles)) {
      if (!this.textures.exists(tex(key))) this.textures.addCanvas(tex(key), rasterize(img, SCALE));
    }
    const sprite = paintPlayerSprite(this.cfg.playerSeed ?? this.cfg.seed);
    FACINGS.forEach((f, i) => {
      const k = `p-${f}`;
      if (!this.textures.exists(k)) this.textures.addCanvas(k, rasterize(sprite.frames[i]!, SCALE));
      // A1-3 walk cycle: two step frames per facing (`p-down-1`, `p-down-2`, …).
      sprite.walk[f].forEach((img, s) => {
        const wk = `p-${f}-${s + 1}`;
        if (!this.textures.exists(wk)) this.textures.addCanvas(wk, rasterize(img, SCALE));
      });
    });

    // ── pass 1: the world — data floor plan, or the legacy THEMES room ──────
    const rows = zone ? zone.rows : theme.layout;
    this.mapH = rows.length;
    this.mapW = zone ? zone.w : rows.reduce((m, r) => Math.max(m, r.length), 0);
    const unlocked = new Set(this.cfg.unlockedZones ?? []);

    const walls = this.physics.add.staticGroup();
    const nodeCells: Array<{ idx: number; x: number; y: number; cell: Cell }> = [];
    const npcCells: Array<{ x: number; y: number }> = [];
    let start = { x: TILE * (this.mapW / 2), y: TILE * (this.mapH / 2) };
    let nodeIdx = 0;
    const addWall = (x: number, y: number, texKey: string, c: number, r: number): void => {
      const w = walls.create(x, y, texKey) as Phaser.Types.Physics.Arcade.SpriteWithStaticBody;
      w.setDisplaySize(TILE, TILE).refreshBody();
      this.blockedCells.add(r * this.mapW + c);
    };

    for (let r = 0; r < this.mapH; r += 1) {
      const row = rows[r]!;
      for (let c = 0; c < this.mapW; c += 1) {
        const ch = c < row.length ? row[c]! : "#"; // short row ⇒ wall padding
        const x = c * TILE + TILE / 2;
        const y = r * TILE + TILE / 2;
        this.add.image(x, y, tex("floor")).setDisplaySize(TILE, TILE);
        if (ch === "#") {
          addWall(x, y, tex("wall"), c, r);
        } else if (ch === "E" && nodeIdx < this.cfg.encounterCount) {
          nodeCells.push({ idx: nodeIdx, x, y, cell: { c, r } });
          nodeIdx += 1;
        } else if (ch === "F") {
          npcCells.push({ x, y });
        } else if (ch === "P") {
          start = { x, y };
        } else if (ch !== ".") {
          const entry = zone ? zone.legend[ch] : null;
          if (entry && "door" in entry) {
            // W-1 doors: open = a walkable travel cell; sealed = the Blank's ink
            // (solid — the collider delivers the bump; un-inks on release).
            if (unlocked.has(entry.door)) {
              this.add.image(x, y, tex("door")).setDisplaySize(TILE, TILE);
              this.doorByCell.set(r * this.mapW + c, entry.door);
            } else {
              addWall(x, y, tex("door-sealed"), c, r);
              this.sealedCells.add(r * this.mapW + c);
            }
          } else if (entry && "prop" in entry) {
            if (entry.solid) addWall(x, y, tex(entry.prop), c, r);
            else this.add.image(x, y, tex(entry.prop)).setDisplaySize(TILE, TILE);
          } else if (!zone) {
            const prop = theme.props[ch];
            if (prop?.solid) addWall(x, y, tex(prop.tile), c, r);
            else if (prop) this.add.image(x, y, tex(prop.tile)).setDisplaySize(TILE, TILE);
          }
        }
      }
    }

    // G-A1 drain veil: the zone starts washed out and literally re-colors one
    // step per solved node. Above the world, below everything alive; alpha
    // derives from the SAVE's cleared nodes so a resumed zone shows exactly
    // the progress the kid earned.
    this.veil = this.add
      .rectangle(0, 0, this.mapW * TILE, this.mapH * TILE, 0xaeb4bf)
      .setOrigin(0, 0)
      .setDepth(DEPTH_VEIL);

    // ── pass 2: the player, then overlaps against the real player ───────────
    // Spawn priority (W-1): door spawn (walked in from a neighbour zone) >
    // saved position (resume — CLAMPED to walkable so a re-authored map can
    // never strand anyone) > the authored P start.
    const resume = this.cfg.initial ?? null;
    let px: [number, number] | null = this.cfg.spawnPx ?? resume?.pos ?? null;
    if (px) {
      const clamped = nearestWalkable(this.gridSpec(), Math.floor(px[0] / TILE), Math.floor(px[1] / TILE));
      px = clamped ? [clamped.c * TILE + TILE / 2, clamped.r * TILE + TILE / 2] : null;
    }
    this.player = this.physics.add.sprite(px?.[0] ?? start.x, px?.[1] ?? start.y, "p-down");
    this.player.setDepth(DEPTH_ALIVE);
    this.player.setDisplaySize(TILE, TILE).setCollideWorldBounds(true);
    // Collision body: a compact box around the lower body/feet (not the whole
    // 48px frame) so the head can overlap walls above — the top-down convention.
    this.player.body.setSize(22, 16).setOffset(13, 26);
    this.physics.add.collider(this.player, walls, () => this.maybeSealedBump());
    this.physics.world.setBounds(0, 0, this.mapW * TILE, this.mapH * TILE);
    this.lastReport = { x: this.player.x, y: this.player.y };

    // W-1 cleared matching: cell keys are canonical; legacy v1 numbers match by
    // node order and self-heal to cell keys on the next checkpoint.
    const clearedRaw = resume?.cleared ?? [];
    const isCleared = (idx: number, cell: Cell): boolean =>
      clearedRaw.includes(cellKey(cell.c, cell.r)) || clearedRaw.includes(idx);

    for (const { idx, x, y, cell } of nodeCells) {
      const node = this.add.image(x, y, tex(nodeKind)).setDisplaySize(TILE, TILE).setDepth(DEPTH_ALIVE);
      this.physics.add.existing(node, true);
      node.setData("idx", idx);
      node.setData("cell", cellKey(cell.c, cell.r));
      const done = isCleared(idx, cell);
      if (done) { node.setData("done", true); node.setAlpha(0.25); }
      this.nodes.set(idx, node);
      this.physics.add.overlap(this.player, node, () => this.tryEncounter(idx));
      // LOOK-5 → W-1: the node breathes per its family — the ✦ pulses its glow,
      // tall grass sways. Visual only; never on cleared nodes; killed on clear;
      // skipped under reduced-motion.
      if (this.cfg.reducedMotion !== true && !done) {
        if (nodeStyle === "grass") {
          this.tweens.add({ targets: node, scaleY: { from: node.scaleY, to: node.scaleY * 0.9 }, duration: 1100, yoyo: true, repeat: -1, ease: "Sine.easeInOut" });
        } else {
          this.tweens.add({ targets: node, alpha: { from: 1, to: 0.55 }, duration: 900, yoyo: true, repeat: -1, ease: "Sine.easeInOut" });
        }
      }
    }
    const npcSpots = zone ? zone.npcCells.map((c) => ({ x: c.c * TILE + TILE / 2, y: c.r * TILE + TILE / 2 })) : npcCells;
    for (const { x, y } of npcSpots) {
      // LOOK-1: `finn_down.png` (→ kind "npc") renders the real guide the moment
      // it lands; until then the desk tile stays the honest placeholder.
      const npcTex = this.textures.exists(`img-npc-${ns}`) ? `img-npc-${ns}` : tex("accent2");
      const npc = this.add.image(x, y, npcTex).setDisplaySize(TILE, TILE).setDepth(DEPTH_ALIVE);
      this.physics.add.existing(npc, true);
      this.physics.add.overlap(this.player, npc, () => this.tryNpc());
      // LOOK-5: the guide hovers gently — zero assets; skipped under reduced-motion.
      if (this.cfg.reducedMotion !== true) {
        this.tweens.add({ targets: npc, y: y - 3, duration: 1200, yoyo: true, repeat: -1, ease: "Sine.easeInOut" });
      }
    }

    // G-A1: the veil opens at exactly the progress the save proves; the burst
    // emitter is created ONCE and fired via explode() per encounter.
    this.veil.setAlpha(this.currentDrain());
    const sparkKey = "fx-spark";
    if (!this.textures.exists(sparkKey)) {
      const spark = document.createElement("canvas");
      spark.width = 8;
      spark.height = 8;
      const sctx = spark.getContext("2d");
      if (sctx) {
        sctx.fillStyle = "#fff7cc";
        sctx.beginPath();
        sctx.arc(4, 4, 3, 0, Math.PI * 2);
        sctx.fill();
        sctx.fillStyle = "#ffe066";
        sctx.beginPath();
        sctx.arc(4, 4, 1.6, 0, Math.PI * 2);
        sctx.fill();
      }
      this.textures.addCanvas(sparkKey, spark);
    }
    this.burst = this.add
      .particles(0, 0, sparkKey, {
        speed: { min: 60, max: 220 },
        angle: { min: 0, max: 360 },
        scale: { start: 1.3, end: 0 },
        alpha: { start: 1, end: 0 },
        lifespan: { min: 260, max: 520 },
        gravityY: 70,
        emitting: false,
      })
      .setDepth(DEPTH_FX);

    const kb = this.input.keyboard;
    if (kb) {
      this.cursors = kb.createCursorKeys();
      this.wasd = kb.addKeys("W,A,S,D") as typeof this.wasd;
    }

    // A1-1 tap-to-move: a tap anywhere in the world walks the player there
    // (point-and-click). Tapping a node/NPC paths INTO its cell, so the
    // EXISTING overlap fires the encounter — no second trigger path.
    this.input.on(Phaser.Input.Events.POINTER_UP, (p: Phaser.Input.Pointer) => this.tapAt(p.worldX, p.worldY));

    // W-1: the camera FOLLOWS the player through the world (the FireRed frame).
    // Bounds clamp at the map edges, so a one-viewport legacy room never
    // scrolls — G1 keeps its exact framing by construction. Reduced-motion
    // tracks instantly (lerp 1): following is function, only the EASE is motion.
    this.cameras.main.setBounds(0, 0, this.mapW * TILE, this.mapH * TILE);
    const lerp = this.cfg.reducedMotion === true ? 1 : 0.15;
    this.cameras.main.startFollow(this.player, true, lerp, lerp);

    // LOOK-5: arriving in a zone gets a beat of theater — a short fade-in, like
    // stepping through a door in FireRed. No-op under reduced-motion.
    if (this.cfg.reducedMotion !== true) this.cameras.main.fadeIn(240, 30, 41, 59);
  }

  /** A1-5: punch the camera in on the node (pan + zoom); the punch-in briefly
   *  takes the wheel from the follow. No-op under reduced-motion. */
  private focusOn(x: number, y: number): void {
    if (this.cfg.reducedMotion === true) return;
    const cam = this.cameras.main;
    cam.stopFollow();
    cam.pan(x, y, 220, "Sine.easeInOut");
    cam.zoomTo(1.3, 220, "Sine.easeInOut");
  }

  /** A1-5 → W-1: hand the camera back to the follow — its lerp IS the glide home. */
  private unfocus(): void {
    if (this.cfg.reducedMotion === true) return; // never zoomed in reduced-motion
    const cam = this.cameras.main;
    cam.zoomTo(1, 220, "Sine.easeInOut");
    cam.startFollow(this.player, true, 0.15, 0.15);
  }

  /** The walkable-grid view for the pure pathfinder. */
  private gridSpec(): GridSpec {
    return { w: this.mapW, h: this.mapH, blocked: (c, r) => this.blockedCells.has(r * this.mapW + c) };
  }

  /**
   * The ONE tap entry point (pointer handler + the non-prod `__domigo.tap`
   * harness call the same code). World px → cell → fat-finger retarget →
   * deterministic BFS → waypoint queue consumed by update().
   */
  tapAt(worldX: number, worldY: number): void {
    if (this.paused || this.traveling || !this.player) return;
    const spec = this.gridSpec();
    const target = nearestWalkable(spec, Math.floor(worldX / TILE), Math.floor(worldY / TILE));
    if (target === null) return;
    const from: Cell = { c: Math.floor(this.player.x / TILE), r: Math.floor(this.player.y / TILE) };
    const path = findPath(spec, from, target);
    this.pathQueue = path ?? [];
  }

  /** A1-2 pause-on-blur: React (PhaserGame) toggles this on visibilitychange.
   *  Halts the sim + drops any tap path so a backgrounded game never drifts and
   *  resuming can't fire a stale overlap. */
  setBlurred(b: boolean): void {
    this.blurred = b;
    if (b) {
      this.pathQueue = [];
      this.walkTimer = 0; // resume on the resting frame, not mid-stride
      this.player?.setVelocity(0);
    }
  }

  /** Read-only snapshot for the non-prod `__domigo.state()` dev harness. */
  debugState(): { x: number; y: number; cell: Cell; facing: Facing; frame: string; paused: boolean; blurred: boolean; pathLeft: number; fps: number; zoom: number; drain: number; map: { w: number; h: number }; doors: number; sealed: number; cleared: string[] } {
    const cleared: string[] = [];
    this.nodes.forEach((node) => { if (node.getData("done") === true) cleared.push(String(node.getData("cell"))); });
    return {
      x: Math.round(this.player?.x ?? 0),
      y: Math.round(this.player?.y ?? 0),
      cell: { c: Math.floor((this.player?.x ?? 0) / TILE), r: Math.floor((this.player?.y ?? 0) / TILE) },
      facing: this.facing,
      frame: this.player?.texture?.key ?? "", // A1-3: current walk frame
      paused: this.paused,
      blurred: this.blurred,
      pathLeft: this.pathQueue.length,
      fps: Math.round(this.game.loop.actualFps),
      zoom: Math.round((this.cameras?.main?.zoom ?? 1) * 100) / 100, // A1-5 punch-in verify
      drain: Math.round((this.veil?.alpha ?? 0) * 1000) / 1000, // G-A1 color-return verify
      map: { w: this.mapW, h: this.mapH }, // W-1 world-size verify
      doors: this.doorByCell.size, // W-1 open doors
      sealed: this.sealedCells.size, // W-1 sealed doors
      cleared,
    };
  }

  /** G-A1: veil alpha from the nodes actually marked done among the nodes
   *  actually rendered — stale saves and empty zones can never overshoot. */
  private currentDrain(): number {
    let done = 0;
    this.nodes.forEach((node) => { if (node.getData("done") === true) done += 1; });
    return drainAlpha(done, this.nodes.size);
  }

  private tryEncounter(idx: number): void {
    const node = this.nodes.get(idx);
    if (this.paused || this.traveling || node === undefined || node.getData("done") === true) return;
    this.paused = true;
    this.player.setVelocity(0);
    // A1-5 → G-A1: the node BURSTS (particle scatter) while the camera punches
    // in, and the battle opens on the beat after the burst reads (~420ms).
    // Reduced-motion → no burst, no zoom, the battle opens instantly.
    if (this.cfg.reducedMotion === true) {
      this.cfg.onEncounter(idx);
    } else {
      this.burst?.explode(22, node.x, node.y);
      playSfx("spark-burst"); // no-op unless the device opted into sound
      this.focusOn(node.x, node.y);
      this.time.delayedCall(420, () => this.cfg.onEncounter(idx));
    }
  }

  private tryNpc(): void {
    if (this.paused || this.traveling) return;
    this.paused = true;
    this.player.setVelocity(0);
    this.cfg.onNpc();
  }

  /** W-1: the sealed-door bump. The collider fires for EVERY wall touch, so
   *  only speak when the cell the player FACES is actually a sealed door,
   *  throttled to a calm once-per-1.5s. */
  private maybeSealedBump(): void {
    if (!this.cfg.onSealedDoor || this.traveling) return;
    const now = this.time.now;
    if (now - this.lastSealedBump < 1500) return;
    const c = Math.floor(this.player.x / TILE);
    const r = Math.floor(this.player.y / TILE);
    const ahead: Record<Facing, Cell> = {
      up: { c, r: r - 1 },
      down: { c, r: r + 1 },
      left: { c: c - 1, r },
      right: { c: c + 1, r },
    };
    const f = ahead[this.facing];
    if (this.sealedCells.has(f.r * this.mapW + f.c)) {
      this.lastSealedBump = now;
      this.cfg.onSealedDoor();
    }
  }

  /** Build + emit the cosmetic save state (player px + cleared node CELL KEYS). */
  private reportState(): void {
    if (this.cfg.onState === undefined || !this.player) return;
    const cleared: string[] = [];
    this.nodes.forEach((node) => { if (node.getData("done") === true) cleared.push(String(node.getData("cell"))); });
    this.lastReport = { x: this.player.x, y: this.player.y };
    this.cfg.onState({ zoneId: this.cfg.zoneId, pos: [Math.round(this.player.x), Math.round(this.player.y)], cleared });
  }

  /** Called by React after an encounter is answered: fade the node, leave it
   *  cleared. A1-5: the fade is a scale-pop reveal (motion-gated). */
  clearEncounter(idx: number): void {
    const node = this.nodes.get(idx);
    if (node) {
      node.setData("done", true);
      this.tweens.killTweensOf(node); // stop the idle pulse before the solved-pop
      if (this.cfg.reducedMotion === true) {
        node.setAlpha(0.25);
      } else {
        const s = node.scaleX;
        this.tweens.add({ targets: node, alpha: { from: 1, to: 0.25 }, scale: { from: s * 1.35, to: s }, duration: 300, ease: "Back.easeOut" });
      }
      // G-A1 color-return: one saturation step back per solved node — the drain
      // veil eases down to the new progress level (instant under reduced-motion).
      if (this.veil) {
        const target = this.currentDrain();
        if (this.cfg.reducedMotion === true) this.veil.setAlpha(target);
        else this.tweens.add({ targets: this.veil, alpha: target, duration: 650, ease: "Sine.easeOut" });
      }
    }
    this.reportState(); // cleared set changed → checkpoint
  }

  /** Called by React when an overlay closes — hand control back + return the camera. */
  resumePlayer(): void {
    this.paused = false;
    this.unfocus();
  }

  update(): void {
    if (!this.player) return;
    if (this.paused || this.blurred || this.traveling) {
      this.player.setVelocity(0);
      this.pathQueue = [];
      return;
    }
    const speed = 150;
    const pad = this.cfg.pad;
    // ONE axis expression for keyboard AND d-pad (touch parity by construction).
    const left = this.cursors?.left.isDown === true || this.wasd?.A.isDown === true || pad?.left === true;
    const right = this.cursors?.right.isDown === true || this.wasd?.D.isDown === true || pad?.right === true;
    const up = this.cursors?.up.isDown === true || this.wasd?.W.isDown === true || pad?.up === true;
    const down = this.cursors?.down.isDown === true || this.wasd?.S.isDown === true || pad?.down === true;

    let vx = 0;
    let vy = 0;
    if (left) vx = -speed;
    else if (right) vx = speed;
    if (up) vy = -speed;
    else if (down) vy = speed;

    if (vx !== 0 || vy !== 0) {
      // Manual input always wins: steering a key or the d-pad cancels the tap target.
      this.pathQueue = [];
    } else if (this.pathQueue.length > 0) {
      // Tap-to-move: steer toward the next waypoint's cell center; a waypoint
      // counts as reached inside a small radius (physics never teleports).
      const wp = this.pathQueue[0]!;
      const tx = wp.c * TILE + TILE / 2;
      const ty = wp.r * TILE + TILE / 2;
      const dx = tx - this.player.x;
      const dy = ty - this.player.y;
      if (Math.abs(dx) <= 6 && Math.abs(dy) <= 6) {
        this.pathQueue.shift();
      } else {
        if (Math.abs(dx) > 6) vx = dx < 0 ? -speed : speed;
        if (Math.abs(dy) > 6) vy = dy < 0 ? -speed : speed;
      }
    }
    this.player.setVelocity(vx, vy);

    const next: Facing = vx < 0 ? "left" : vx > 0 ? "right" : vy < 0 ? "up" : vy > 0 ? "down" : this.facing;
    this.facing = next;

    // A1-3 walk cycle: accumulate move-time and pick the frame via the pure
    // selector (unit-tested in anim.test.ts). Idle → reset to the resting frame.
    const moving = vx !== 0 || vy !== 0;
    if (moving) this.walkTimer += Math.min(this.game.loop.delta, 100); // cap post-blur/throttle spikes
    else this.walkTimer = 0;
    const frameKey = walkFrameKey(next, this.walkTimer, moving, this.cfg.reducedMotion === true);
    if (this.player.texture.key !== frameKey) {
      this.player.setTexture(frameKey);
      this.player.setDisplaySize(TILE, TILE);
    }

    // W-1 door travel: stepping ONTO an open door cell (after having stood off
    // every door — an adjacent spawn never bounces straight back) hands over to
    // React for the fade + navigation. One shot; the scene freezes meanwhile.
    const cellIdx = Math.floor(this.player.y / TILE) * this.mapW + Math.floor(this.player.x / TILE);
    const doorTarget = this.doorByCell.get(cellIdx);
    if (doorTarget === undefined) {
      this.doorArmed = true;
    } else if (this.doorArmed && this.cfg.onDoor) {
      this.traveling = true;
      this.player.setVelocity(0);
      this.pathQueue = [];
      playSfx("whoosh"); // no-op unless sound is on
      this.cfg.onDoor(doorTarget);
      return;
    }

    // throttled position checkpoint (~every 1.5s, only if meaningfully moved)
    this.tick += 1;
    if (this.tick % 90 === 0) {
      const moved = Math.abs(this.player.x - this.lastReport.x) + Math.abs(this.player.y - this.lastReport.y);
      if (moved > 4) this.reportState();
    }
  }
}
