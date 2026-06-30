/**
 * The G1 overworld scene — a small walkable "classroom" room built as code (no
 * Tiled file), painted from art-gen procedural textures. Encounter nodes + the
 * Finn NPC are overlap zones that call back into React (the DOM task/dialogue
 * overlay). Phaser is imported statically; this module only ever loads in the
 * client chunk (the app mounts PhaserGame via next/dynamic ssr:false).
 */
import Phaser from "phaser";
import { paintPlayerSprite, paintTileset, resolveZoneTheme, DOMIGO_GREEN, TILE_KINDS, FACINGS, type Facing } from "@domigo/art-gen";
import { rasterize } from "./rasterize.ts";

const SCALE = 3;
const SRC = 16;
const TILE = SRC * SCALE; // 48px display tile
const GRID_W = 15;
const GRID_H = 11; // grid frozen for save-compat (the cosmetic save stores the player's pixel position)

/** Cosmetic save state — the zone it belongs to + player position (px) + cleared nodes. */
export interface OverworldState {
  zoneId: string;
  pos: [number, number];
  cleared: number[];
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
    const sprite = paintPlayerSprite(this.cfg.seed);
    FACINGS.forEach((f, i) => {
      const k = `p-${f}`;
      if (!this.textures.exists(k)) this.textures.addCanvas(k, rasterize(sprite.frames[i]!, SCALE));
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
    this.player.body.setSize(SRC * 0.6, SRC * 0.6).setOffset(SRC * 0.2, SRC * 0.3);
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
    this.cfg.onState({ zoneId: this.cfg.zoneId, pos: [Math.round(this.player.x), Math.round(this.player.y)], cleared: clearedIdx });
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
