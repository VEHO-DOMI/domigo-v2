/**
 * The G1 overworld scene — a small walkable "classroom" room built as code (no
 * Tiled file), painted from art-gen procedural textures. Encounter nodes + the
 * Finn NPC are overlap zones that call back into React (the DOM task/dialogue
 * overlay). Phaser is imported statically; this module only ever loads in the
 * client chunk (the app mounts PhaserGame via next/dynamic ssr:false).
 */
import Phaser from "phaser";
import { paintPlayerSprite, paintTileset, FACINGS, type Facing } from "@domigo/art-gen";
import { rasterize } from "./rasterize.ts";

const SCALE = 3;
const SRC = 16;
const TILE = SRC * SCALE; // 48px display tile

// 15×11 room. # wall · . floor · E encounter node · F Finn NPC · P player start.
const ROOM = [
  "###############",
  "#......F......#",
  "#.............#",
  "#..#.......#..#",
  "#...E.....E...#",
  "#......P......#",
  "#.............#",
  "#...E.....E...#",
  "#..#.......#..#",
  "#.............#",
  "###############",
];

/** Cosmetic save state — player position (px) + which node positions look cleared. */
export interface OverworldState {
  pos: [number, number];
  cleared: number[];
}

export interface OverworldConfig {
  seed: number;
  encounterCount: number;
  onEncounter: (idx: number) => void;
  onNpc: () => void;
  /** Restore cosmetic state on boot (resume). */
  initial?: OverworldState | null;
  /** Reports cosmetic state (throttled) for checkpointing. */
  onState?: (s: OverworldState) => void;
}

export class OverworldScene extends Phaser.Scene {
  private cfg: OverworldConfig;
  private player!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys | null = null;
  private wasd: Record<"W" | "A" | "S" | "D", Phaser.Input.Keyboard.Key> | null = null;
  private nodes = new Map<number, Phaser.GameObjects.Image>();
  private paused = false;
  private facing: Facing = "down";
  private tick = 0;
  private lastReport = { x: 0, y: 0 };

  constructor(cfg: OverworldConfig) {
    super("overworld");
    this.cfg = cfg;
  }

  static dimensions(): { width: number; height: number } {
    return { width: ROOM[0]!.length * TILE, height: ROOM.length * TILE };
  }

  create(): void {
    // textures from art-gen (deterministic per seed)
    const tileset = paintTileset(this.cfg.seed);
    for (const [key, img] of Object.entries(tileset.tiles)) {
      const tex = `t-${key}`;
      if (!this.textures.exists(tex)) this.textures.addCanvas(tex, rasterize(img, SCALE));
    }
    const sprite = paintPlayerSprite(this.cfg.seed);
    FACINGS.forEach((f, i) => {
      const tex = `p-${f}`;
      if (!this.textures.exists(tex)) this.textures.addCanvas(tex, rasterize(sprite.frames[i]!, SCALE));
    });

    // pass 1 — paint floor everywhere; collect walls + node/npc positions + start
    const walls = this.physics.add.staticGroup();
    const nodeCells: Array<{ idx: number; x: number; y: number }> = [];
    const npcCells: Array<{ x: number; y: number }> = [];
    let start = { x: TILE * 7.5, y: TILE * 5.5 };
    let nodeIdx = 0;
    for (let r = 0; r < ROOM.length; r += 1) {
      const row = ROOM[r]!;
      for (let c = 0; c < row.length; c += 1) {
        const ch = row[c]!;
        const x = c * TILE + TILE / 2;
        const y = r * TILE + TILE / 2;
        this.add.image(x, y, "t-floor").setDisplaySize(TILE, TILE);
        if (ch === "#") {
          const w = walls.create(x, y, "t-wall") as Phaser.Types.Physics.Arcade.SpriteWithStaticBody;
          w.setDisplaySize(TILE, TILE).refreshBody();
        } else if (ch === "E" && nodeIdx < this.cfg.encounterCount) {
          nodeCells.push({ idx: nodeIdx, x, y });
          nodeIdx += 1;
        } else if (ch === "F") {
          npcCells.push({ x, y });
        } else if (ch === "P") {
          start = { x, y };
        }
      }
    }

    // pass 2 — player, then overlaps against the real player
    const initPos = this.cfg.initial?.pos;
    this.player = this.physics.add.sprite(initPos?.[0] ?? start.x, initPos?.[1] ?? start.y, "p-down");
    this.player.setDisplaySize(TILE, TILE).setCollideWorldBounds(true);
    this.player.body.setSize(SRC * 0.6, SRC * 0.6).setOffset(SRC * 0.2, SRC * 0.3);
    this.physics.add.collider(this.player, walls);
    this.lastReport = { x: this.player.x, y: this.player.y };
    const cleared = new Set(this.cfg.initial?.cleared ?? []);

    for (const { idx, x, y } of nodeCells) {
      const node = this.add.image(x, y, "t-encounter").setDisplaySize(TILE, TILE);
      this.physics.add.existing(node, true);
      node.setData("idx", idx);
      if (cleared.has(idx)) { node.setData("done", true); node.setAlpha(0.25); }
      this.nodes.set(idx, node);
      this.physics.add.overlap(this.player, node, () => this.tryEncounter(idx));
    }
    for (const { x, y } of npcCells) {
      const npc = this.add.image(x, y, "t-accent2").setDisplaySize(TILE, TILE);
      this.physics.add.existing(npc, true);
      this.physics.add.overlap(this.player, npc, () => this.tryNpc());
    }

    const kb = this.input.keyboard;
    if (kb) {
      this.cursors = kb.createCursorKeys();
      this.wasd = kb.addKeys("W,A,S,D") as typeof this.wasd;
    }
  }

  private tryEncounter(idx: number): void {
    const node = this.nodes.get(idx);
    if (this.paused || node === undefined || node.getData("done") === true) return;
    this.paused = true;
    this.player.setVelocity(0);
    this.cfg.onEncounter(idx);
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
    this.cfg.onState({ pos: [Math.round(this.player.x), Math.round(this.player.y)], cleared: clearedIdx });
  }

  /** Called by React after an encounter is answered: fade the node, leave it cleared. */
  clearEncounter(idx: number): void {
    const node = this.nodes.get(idx);
    if (node) {
      node.setData("done", true);
      node.setAlpha(0.25);
    }
    this.reportState(); // cleared set changed → checkpoint
  }

  /** Called by React when an overlay closes — hand control back to the player. */
  resumePlayer(): void {
    this.paused = false;
  }

  update(): void {
    if (!this.player || this.cursors === null || this.wasd === null) return;
    if (this.paused) {
      this.player.setVelocity(0);
      return;
    }
    const speed = 150;
    let vx = 0;
    let vy = 0;
    if (this.cursors.left.isDown || this.wasd.A.isDown) vx = -speed;
    else if (this.cursors.right.isDown || this.wasd.D.isDown) vx = speed;
    if (this.cursors.up.isDown || this.wasd.W.isDown) vy = -speed;
    else if (this.cursors.down.isDown || this.wasd.S.isDown) vy = speed;
    this.player.setVelocity(vx, vy);

    const next: Facing = vx < 0 ? "left" : vx > 0 ? "right" : vy < 0 ? "up" : vy > 0 ? "down" : this.facing;
    if (next !== this.facing) {
      this.facing = next;
      this.player.setTexture(`p-${next}`);
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
