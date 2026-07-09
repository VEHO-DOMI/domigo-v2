/**
 * The G1 overworld scene — a small walkable "classroom" room built as code (no
 * Tiled file), painted from art-gen procedural textures. Encounter nodes + the
 * Finn NPC are overlap zones that call back into React (the DOM task/dialogue
 * overlay). Phaser is imported statically; this module only ever loads in the
 * client chunk (the app mounts PhaserGame via next/dynamic ssr:false).
 */
import Phaser from "phaser";
import { paintPlayerSprite, paintTileset, resolveZoneTheme, DOMIGO_GREEN, TILE_KINDS, FACINGS, type Facing } from "@domigo/art-gen";
import { walkFrameKey } from "./anim.ts";
import { findPath, nearestWalkable, type Cell, type GridSpec } from "./path.ts";
import { rasterize } from "./rasterize.ts";

const SRC = 48; // art-gen source resolution — crafted 1:1 (was 16px upscaled 3× = chunky)
const SCALE = 1; // rasterize scale; 1:1 keeps the crisp GBA pixels (no interpolation)
const TILE = SRC * SCALE; // 48px display tile — grid/save/camera/tap math all unchanged
const GRID_W = 15;
const GRID_H = 11; // grid frozen for save-compat (the cosmetic save stores the player's pixel position)

/** Cosmetic save state — the zone it belongs to + player position (px) + cleared nodes. */
export interface OverworldState {
  zoneId: string;
  pos: [number, number];
  cleared: number[];
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
  /** map@1 zone's `render.generator` → picks the per-zone theme (palette + layout + props). */
  generator: string;
  encounterCount: number;
  onEncounter: (idx: number) => void;
  onNpc: () => void;
  /** Restore cosmetic state on boot (resume) — applied only if it's THIS zone. */
  initial?: OverworldState | null;
  /** Reports cosmetic state (throttled) for checkpointing. */
  onState?: (s: OverworldState) => void;
  /** Floating d-pad state (coarse-pointer devices); OR'd with the keyboard. */
  pad?: PadState;
  /** A1-3: OS/user reduced-motion — when true the walk cycle never plays (the
   *  player stays on the resting frame). Set by PhaserGame from the media query. */
  reducedMotion?: boolean;
  /** A1-4: stable per-STUDENT avatar seed (fnv1a32 of userId). The player sprite
   *  used to be painted from `seed` (the ZONE seed), so the avatar's hair/shirt
   *  changed in every zone — an identity bug. Falls back to `seed` for old
   *  callers/tests. Cosmetic only (the sprite isn't saved) → no migration. */
  playerSeed?: number;
}

export class OverworldScene extends Phaser.Scene {
  private cfg: OverworldConfig;
  private player!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys | null = null;
  private wasd: Record<"W" | "A" | "S" | "D", Phaser.Input.Keyboard.Key> | null = null;
  private nodes = new Map<number, Phaser.GameObjects.Image>();
  private paused = false;
  // A1-2: pause-on-blur (Law 9). Distinct from `paused` (which is the React
  // overlay's turn): while backgrounded the sim halts but no encounter fires, so
  // resuming can't jump or trigger a stale overlap. Audio suspend is handled
  // globally by @domigo/game-feel's own visibilitychange hook (not re-done here).
  private blurred = false;
  private facing: Facing = "down";
  private tick = 0;
  // A1-3 walk cycle: ms accumulated while moving; drives the foot-lift phase.
  private walkTimer = 0;
  private lastReport = { x: 0, y: 0 };
  // A1-1 tap-to-move: the zone's walkable grid + the waypoint queue being walked.
  private blockedCells = new Set<number>();
  private pathQueue: Cell[] = [];

  constructor(cfg: OverworldConfig) {
    super("overworld");
    this.cfg = cfg;
  }

  static dimensions(): { width: number; height: number } {
    return { width: GRID_W * TILE, height: GRID_H * TILE };
  }

  create(): void {
    // per-zone theme + texture namespace. Phaser textures are GLOBAL; namespacing the
    // tileset keys by zone fixes the "first zone to load wins" collision so each zone
    // renders its own palette + props (not zone 1's). Player sprite stays shared.
    const theme = resolveZoneTheme(this.cfg.generator);
    const ns = this.cfg.zoneId.split(".").pop() ?? "z";
    const tex = (key: string): string => `t-${key}-${ns}`;

    const tileset = paintTileset(this.cfg.seed, {
      palette: theme.palette,
      accent: DOMIGO_GREEN,
      kinds: [...TILE_KINDS, ...theme.extraKinds],
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

    // pass 1 — paint floor everywhere; collect walls + node/npc positions + start; place props
    const walls = this.physics.add.staticGroup();
    const nodeCells: Array<{ idx: number; x: number; y: number }> = [];
    const npcCells: Array<{ x: number; y: number }> = [];
    let start = { x: TILE * 7.5, y: TILE * 5.5 };
    let nodeIdx = 0;
    for (let r = 0; r < theme.layout.length; r += 1) {
      const row = theme.layout[r]!;
      for (let c = 0; c < row.length; c += 1) {
        const ch = row[c]!;
        const x = c * TILE + TILE / 2;
        const y = r * TILE + TILE / 2;
        this.add.image(x, y, tex("floor")).setDisplaySize(TILE, TILE);
        if (ch === "#") {
          const w = walls.create(x, y, tex("wall")) as Phaser.Types.Physics.Arcade.SpriteWithStaticBody;
          w.setDisplaySize(TILE, TILE).refreshBody();
          this.blockedCells.add(r * GRID_W + c);
        } else if (ch === "E" && nodeIdx < this.cfg.encounterCount) {
          nodeCells.push({ idx: nodeIdx, x, y });
          nodeIdx += 1;
        } else if (ch === "F") {
          npcCells.push({ x, y });
        } else if (ch === "P") {
          start = { x, y };
        } else {
          const prop = theme.props[ch];
          if (prop?.solid) {
            const w = walls.create(x, y, tex(prop.tile)) as Phaser.Types.Physics.Arcade.SpriteWithStaticBody;
            w.setDisplaySize(TILE, TILE).refreshBody();
            this.blockedCells.add(r * GRID_W + c);
          } else if (prop) {
            this.add.image(x, y, tex(prop.tile)).setDisplaySize(TILE, TILE);
          }
        }
      }
    }

    // pass 2 — player, then overlaps against the real player
    // restore only if the save belongs to THIS zone (one save slot per grade-game)
    const resume = this.cfg.initial?.zoneId === this.cfg.zoneId ? this.cfg.initial : null;
    const initPos = resume?.pos;
    this.player = this.physics.add.sprite(initPos?.[0] ?? start.x, initPos?.[1] ?? start.y, "p-down");
    this.player.setDisplaySize(TILE, TILE).setCollideWorldBounds(true);
    // Collision body: a compact box around the lower body/feet (not the whole 48px
    // frame) so the head/shoulders can overlap walls above — the top-down convention.
    // Authored in the sprite's 48px source space (display scale is 1).
    this.player.body.setSize(22, 16).setOffset(13, 26);
    this.physics.add.collider(this.player, walls);
    this.lastReport = { x: this.player.x, y: this.player.y };
    const cleared = new Set(resume?.cleared ?? []);

    for (const { idx, x, y } of nodeCells) {
      const node = this.add.image(x, y, tex("encounter")).setDisplaySize(TILE, TILE);
      this.physics.add.existing(node, true);
      node.setData("idx", idx);
      if (cleared.has(idx)) { node.setData("done", true); node.setAlpha(0.25); }
      this.nodes.set(idx, node);
      this.physics.add.overlap(this.player, node, () => this.tryEncounter(idx));
    }
    for (const { x, y } of npcCells) {
      const npc = this.add.image(x, y, tex("accent2")).setDisplaySize(TILE, TILE);
      this.physics.add.existing(npc, true);
      this.physics.add.overlap(this.player, npc, () => this.tryNpc());
    }

    const kb = this.input.keyboard;
    if (kb) {
      this.cursors = kb.createCursorKeys();
      this.wasd = kb.addKeys("W,A,S,D") as typeof this.wasd;
    }

    // A1-1 tap-to-move: a tap anywhere in the world walks the player there
    // (point-and-click). Tapping a node/NPC paths INTO its cell, so the
    // EXISTING overlap fires the encounter — no second trigger path.
    this.input.on(Phaser.Input.Events.POINTER_UP, (p: Phaser.Input.Pointer) => this.tapAt(p.worldX, p.worldY));

    // A1-5 encounter staging: bound the camera to the room so the punch-in
    // (zoom 1.3 + pan to the ✦) never reveals black past the walls.
    this.cameras.main.setBounds(0, 0, GRID_W * TILE, GRID_H * TILE);
  }

  /** A1-5: punch the camera in on the ✦ (pan + zoom); a no-op under reduced-motion. */
  private focusOn(x: number, y: number): void {
    if (this.cfg.reducedMotion === true) return;
    const cam = this.cameras.main;
    cam.pan(x, y, 220, "Sine.easeInOut");
    cam.zoomTo(1.3, 220, "Sine.easeInOut");
  }

  /** A1-5: return the camera to the full-room view after an overlay closes. */
  private unfocus(): void {
    if (this.cfg.reducedMotion === true) return; // never zoomed in reduced-motion
    const cam = this.cameras.main;
    cam.pan((GRID_W * TILE) / 2, (GRID_H * TILE) / 2, 220, "Sine.easeInOut");
    cam.zoomTo(1, 220, "Sine.easeInOut");
  }

  /** The walkable-grid view for the pure pathfinder. */
  private gridSpec(): GridSpec {
    return { w: GRID_W, h: GRID_H, blocked: (c, r) => this.blockedCells.has(r * GRID_W + c) };
  }

  /**
   * The ONE tap entry point (pointer handler + the non-prod `__domigo.tap`
   * harness call the same code). World px → cell → fat-finger retarget →
   * deterministic BFS → waypoint queue consumed by update().
   */
  tapAt(worldX: number, worldY: number): void {
    if (this.paused || !this.player) return;
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
  debugState(): { x: number; y: number; cell: Cell; facing: Facing; frame: string; paused: boolean; blurred: boolean; pathLeft: number; fps: number; zoom: number; cleared: number[] } {
    const cleared: number[] = [];
    this.nodes.forEach((node, idx) => { if (node.getData("done") === true) cleared.push(idx); });
    return {
      x: Math.round(this.player?.x ?? 0),
      y: Math.round(this.player?.y ?? 0),
      cell: { c: Math.floor((this.player?.x ?? 0) / TILE), r: Math.floor((this.player?.y ?? 0) / TILE) },
      facing: this.facing,
      frame: this.player?.texture?.key ?? "", // A1-3: current walk frame (p-down / p-down-1 / …)
      paused: this.paused,
      blurred: this.blurred,
      pathLeft: this.pathQueue.length,
      fps: Math.round(this.game.loop.actualFps),
      zoom: Math.round((this.cameras?.main?.zoom ?? 1) * 100) / 100, // A1-5 punch-in verify
      cleared,
    };
  }

  private tryEncounter(idx: number): void {
    const node = this.nodes.get(idx);
    if (this.paused || node === undefined || node.getData("done") === true) return;
    this.paused = true;
    this.player.setVelocity(0);
    // A1-5: punch in on the ✦, then raise the task card after the ~200ms move so
    // the staging reads as an event. Reduced-motion → the card opens instantly.
    if (this.cfg.reducedMotion === true) {
      this.cfg.onEncounter(idx);
    } else {
      this.focusOn(node.x, node.y);
      this.time.delayedCall(180, () => this.cfg.onEncounter(idx));
    }
  }

  private tryNpc(): void {
    if (this.paused) return;
    this.paused = true;
    this.player.setVelocity(0);
    this.cfg.onNpc();
  }

  /** Build + emit the cosmetic save state (player px + cleared node positions). */
  private reportState(): void {
    if (this.cfg.onState === undefined || !this.player) return;
    const clearedIdx: number[] = [];
    this.nodes.forEach((node, idx) => { if (node.getData("done") === true) clearedIdx.push(idx); });
    this.lastReport = { x: this.player.x, y: this.player.y };
    this.cfg.onState({ zoneId: this.cfg.zoneId, pos: [Math.round(this.player.x), Math.round(this.player.y)], cleared: clearedIdx });
  }

  /** Called by React after an encounter is answered: fade the node, leave it cleared.
   *  A1-5: the fade is a scale-pop reveal (motion-gated) — the "solved!" beat.
   *  The `done` flag + checkpoint are byte-identical to before (tier gates flavor only). */
  clearEncounter(idx: number): void {
    const node = this.nodes.get(idx);
    if (node) {
      node.setData("done", true);
      if (this.cfg.reducedMotion === true) {
        node.setAlpha(0.25);
      } else {
        const s = node.scaleX;
        this.tweens.add({ targets: node, alpha: { from: 1, to: 0.25 }, scale: { from: s * 1.35, to: s }, duration: 300, ease: "Back.easeOut" });
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
    if (this.paused || this.blurred) {
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

    // throttled position checkpoint (~every 1.5s, only if meaningfully moved)
    this.tick += 1;
    if (this.tick % 90 === 0) {
      const moved = Math.abs(this.player.x - this.lastReport.x) + Math.abs(this.player.y - this.lastReport.y);
      if (moved > 4) this.reportState();
    }
  }
}
