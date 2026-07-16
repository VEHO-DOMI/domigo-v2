/**
 * VS · MapScene — the book's world map as a Keen hub (bible 27 §2–§3;
 * keen-metagame §1). Deliberately a SEPARATE scene from OverworldScene: zero
 * regression surface on the live game. The scene renders world.json's layout
 * procedurally (ground, buildings, brambles, flags, NPCs, notes) and reports
 * intents upward (onPrompt/onEnter/onNote/onMove); React owns beats, saves
 * and navigation. The Keen grammar carried here: walk onto a door + confirm
 * enters (§1.5), flags over beaten chapters with the thrown-flag parabola for
 * the just-beaten one (§1.6), and TOPOLOGICAL unlock — beaten chapters clear
 * their blocking brambles; the map is the progress bar (§1.8).
 */
import Phaser from "phaser";
import { paintPlayerSprite, paintTileset, resolveZoneTheme, DOMIGO_GREEN, TILE_KINDS } from "@domigo/art-gen";
import { playSfx } from "@domigo/game-feel";
import type { ArcadePad } from "./ArcadeScene.ts";
import { TILE_PX as TILE } from "./arcade.ts";
import { rasterize } from "./rasterize.ts";

const VIEW_TILES_W = 15;
const VIEW_TILES_H = 11;
const WALK_SPEED = 200;

export interface MapEntrance { chapter: string; c: number; r: number; label: string }

export interface MapConfig {
  /** world.json layout.rows */
  rows: string[];
  legend: Record<string, { enter?: string; label?: string; prop?: string; solid?: boolean; clearedBy?: string }>;
  buildings: Record<string, { chapter: string; cell: { c: number; r: number }; label: string; ground: { c: number; r: number; w: number; h: number } }>;
  notes: Array<{ c: number; r: number; text: string }>;
  /** e.g. ["ch01"] — cleared brambles, warm buildings, flags */
  chaptersDone: string[];
  /** plays the thrown-flag parabola once (keen-metagame §1.6) */
  justDone?: string;
  /** resume position (else the 'P' glyph) */
  startPos?: { c: number; r: number } | null;
  seed: number;
  playerSeed?: number;
  reducedMotion?: boolean;
  /** shared with React's touch controls / the dev harness (ArcadePad shape) */
  pad: ArcadePad;
  /** player stands on/next to an entrance (null = left it) */
  onPrompt: (entrance: MapEntrance | null) => void;
  /** action pressed on an UNLOCKED entrance */
  onEnter: (chapter: string) => void;
  /** stepped onto a note cell (once per session) */
  onNote: (text: string) => void;
  /** fires on tile change — debounced-ish position for saving */
  onMove: (c: number, r: number) => void;
}

/** A spiky dark ink tangle — Jona's blocking terrain (cleared topologically). */
function paintBramble(): HTMLCanvasElement {
  const c = document.createElement("canvas");
  c.width = TILE;
  c.height = TILE;
  const g = c.getContext("2d")!;
  g.lineCap = "round";
  g.strokeStyle = "#141221";
  g.lineWidth = 5;
  g.beginPath(); g.moveTo(6, 38); g.bezierCurveTo(18, 8, 30, 44, 42, 12); g.stroke();
  g.beginPath(); g.moveTo(4, 16); g.bezierCurveTo(20, 40, 26, 6, 44, 34); g.stroke();
  g.strokeStyle = "#221f36";
  g.lineWidth = 4;
  g.beginPath(); g.moveTo(10, 44); g.bezierCurveTo(22, 20, 34, 40, 40, 24); g.stroke();
  g.beginPath(); g.moveTo(8, 28); g.bezierCurveTo(24, 34, 28, 16, 40, 40); g.stroke();
  g.fillStyle = "#0c0b14";
  for (const [x, y] of [[12, 22], [22, 30], [32, 18], [38, 30], [18, 12]] as const) {
    g.beginPath(); g.moveTo(x, y - 4); g.lineTo(x + 3, y + 2); g.lineTo(x - 3, y + 2); g.closePath(); g.fill();
  }
  return c;
}

/** The chapter building: warm schoolhouse when reachable, silhouette later. */
function paintHouse(silhouette: boolean): HTMLCanvasElement {
  const c = document.createElement("canvas");
  c.width = 72;
  c.height = 84;
  const g = c.getContext("2d")!;
  g.fillStyle = silhouette ? "#3a3654" : "#d8b46a";
  g.fillRect(8, 34, 56, 46);
  g.fillStyle = silhouette ? "#332f4e" : "#a86f3e";
  g.beginPath(); g.moveTo(2, 36); g.lineTo(36, 6); g.lineTo(70, 36); g.closePath(); g.fill();
  // the door, bottom-center — the walk-onto spot (keen-metagame §1.5)
  g.fillStyle = silhouette ? "#2b2745" : "#5c3a1e";
  g.beginPath(); g.moveTo(28, 80); g.lineTo(28, 54); g.quadraticCurveTo(36, 44, 44, 54); g.lineTo(44, 80); g.closePath(); g.fill();
  g.strokeStyle = silhouette ? "#4a4668" : "#8a6d1f";
  g.lineWidth = 1.5;
  g.strokeRect(8, 34, 56, 46);
  if (!silhouette) {
    g.fillStyle = "#fff3c4";
    g.fillRect(14, 42, 12, 12);
    g.strokeStyle = "#8a6d1f";
    g.strokeRect(14, 42, 12, 12);
  }
  return c;
}

/** The completion flag — a restored page, planted where everyone can see it. */
function paintFlag(): HTMLCanvasElement {
  const c = document.createElement("canvas");
  c.width = 30;
  c.height = 44;
  const g = c.getContext("2d")!;
  g.fillStyle = "#6b6880";
  g.fillRect(4, 2, 3, 40);
  g.fillStyle = "#8b7cf5";
  g.beginPath(); g.moveTo(7, 4); g.lineTo(28, 10); g.lineTo(7, 17); g.closePath(); g.fill();
  g.strokeStyle = "#cfc7ff";
  g.lineWidth = 1;
  g.beginPath(); g.moveTo(7, 4); g.lineTo(28, 10); g.lineTo(7, 17); g.closePath(); g.stroke();
  return c;
}

/** Finn — a floating open book with two dot-eyes (a PERSON, not furniture). */
function paintFinn(): HTMLCanvasElement {
  const c = document.createElement("canvas");
  c.width = 44;
  c.height = 34;
  const g = c.getContext("2d")!;
  const page = (dir: -1 | 1): void => {
    g.beginPath();
    g.moveTo(22, 8);
    g.quadraticCurveTo(22 + dir * 14, 2, 22 + dir * 19, 8);
    g.lineTo(22 + dir * 19, 26);
    g.quadraticCurveTo(22 + dir * 12, 22, 22, 27);
    g.closePath();
  };
  g.fillStyle = "#f6f2e4";
  page(-1); g.fill();
  page(1); g.fill();
  g.strokeStyle = "#37325c";
  g.lineWidth = 2;
  page(-1); g.stroke();
  page(1); g.stroke();
  g.beginPath(); g.moveTo(22, 8); g.lineTo(22, 27); g.stroke();
  g.strokeStyle = "#b9b2d6";
  g.lineWidth = 1.2;
  for (const y of [20, 23] as const) {
    g.beginPath(); g.moveTo(8, y); g.lineTo(17, y); g.moveTo(27, y); g.lineTo(36, y); g.stroke();
  }
  g.fillStyle = "#0c0b14";
  g.beginPath(); g.arc(14, 14, 2.4, 0, Math.PI * 2); g.arc(30, 14, 2.4, 0, Math.PI * 2); g.fill();
  return c;
}

/** Pixel — a small black cat silhouette (body + ears; the tail is its own image). */
function paintPixel(): HTMLCanvasElement {
  const c = document.createElement("canvas");
  c.width = 40;
  c.height = 34;
  const g = c.getContext("2d")!;
  g.fillStyle = "#0c0b14";
  g.beginPath(); g.ellipse(16, 24, 13, 9, 0, 0, Math.PI * 2); g.fill();
  g.beginPath(); g.arc(28, 14, 7, 0, Math.PI * 2); g.fill();
  g.beginPath(); g.moveTo(22, 10); g.lineTo(23, 2); g.lineTo(27, 8); g.closePath(); g.fill();
  g.beginPath(); g.moveTo(29, 8); g.lineTo(33, 2); g.lineTo(34, 10); g.closePath(); g.fill();
  g.fillStyle = "#ffe082";
  g.beginPath(); g.arc(26, 14, 1.4, 0, Math.PI * 2); g.arc(31, 14, 1.4, 0, Math.PI * 2); g.fill();
  return c;
}

function paintPixelTail(): HTMLCanvasElement {
  const c = document.createElement("canvas");
  c.width = 18;
  c.height = 22;
  const g = c.getContext("2d")!;
  g.strokeStyle = "#0c0b14";
  g.lineWidth = 4;
  g.lineCap = "round";
  g.beginPath(); g.moveTo(14, 20); g.quadraticCurveTo(2, 14, 6, 3); g.stroke();
  return c;
}

/** A folded note — Jona's pinned paper (doc 18's note canon on the map). */
function paintPaper(): HTMLCanvasElement {
  const c = document.createElement("canvas");
  c.width = 26;
  c.height = 22;
  const g = c.getContext("2d")!;
  g.save();
  g.translate(13, 11);
  g.rotate(-0.12);
  g.fillStyle = "#f6f2e4";
  g.fillRect(-10, -7, 20, 14);
  g.strokeStyle = "#8f8ab0";
  g.lineWidth = 1.2;
  g.strokeRect(-10, -7, 20, 14);
  g.fillStyle = "#dcd7c4";
  g.beginPath(); g.moveTo(4, -7); g.lineTo(10, -7); g.lineTo(10, -1); g.closePath(); g.fill();
  g.strokeStyle = "#6b6880";
  g.lineWidth = 1;
  for (const y of [-2, 1, 4] as const) { g.beginPath(); g.moveTo(-7, y); g.lineTo(5, y); g.stroke(); }
  g.restore();
  return c;
}

export class MapScene extends Phaser.Scene {
  private cfg: MapConfig;
  private player!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys | null = null;
  private wasd: Record<"W" | "A" | "S" | "D", Phaser.Input.Keyboard.Key> | null = null;
  private actionKeys: Phaser.Input.Keyboard.Key[] = [];
  private padActionHeld = false;
  private entrances: MapEntrance[] = [];
  private current: MapEntrance | null = null;
  private unlockedSet = new Set<string>();
  private lastTile = { c: -1, r: -1 };
  private facing: 1 | -1 = 1;
  private shakeLockUntil = 0;

  constructor(cfg: MapConfig) {
    super("map");
    this.cfg = cfg;
  }

  /** Viewport (a camera window over the larger world) — MapGame derives the
   *  canvas aspect from this, the ArcadeScene.dimensions() pattern. */
  static dimensions(rows: string[]): { width: number; height: number } {
    const cols = rows[0]?.length ?? VIEW_TILES_W;
    return { width: Math.min(cols, VIEW_TILES_W) * TILE, height: Math.min(rows.length, VIEW_TILES_H) * TILE };
  }

  create(): void {
    const { rows, legend, buildings } = this.cfg;
    const motion = this.cfg.reducedMotion !== true;
    const cleared = new Set(this.cfg.chaptersDone);
    const worldW = (rows[0]?.length ?? 0) * TILE;
    const worldH = rows.length * TILE;

    // ── textures (the ArcadeScene tex()/addCanvas idiom, key-prefix "map-") ──
    const theme = resolveZoneTheme("schoolyard");
    const tileset = paintTileset(this.cfg.seed, { palette: theme.palette, accent: DOMIGO_GREEN, kinds: [...TILE_KINDS, "tree"] });
    const tex = (k: string): string => `map-${k}`;
    const addCanvas = (key: string, cv: HTMLCanvasElement): void => {
      if (!this.textures.exists(key)) this.textures.addCanvas(key, cv);
    };
    const floorImg = tileset.tiles["floor"];
    const wallImg = tileset.tiles["wall"];
    const treeImg = tileset.tiles["tree"];
    if (!floorImg || !wallImg || !treeImg) throw new Error("map: tileset missing floor/wall/tree");
    addCanvas(tex("tree"), rasterize(treeImg, 1));
    addCanvas(tex("bramble"), paintBramble());
    addCanvas(tex("house"), paintHouse(false));
    addCanvas(tex("house-dark"), paintHouse(true));
    addCanvas(tex("flag"), paintFlag());
    addCanvas(tex("finn"), paintFinn());
    addCanvas(tex("pixel"), paintPixel());
    addCanvas(tex("pixeltail"), paintPixelTail());
    addCanvas(tex("paper"), paintPaper());

    // ── the ground, blitted ONCE (1000+ tile images would drown the fps floor) ──
    const ground = document.createElement("canvas");
    ground.width = worldW;
    ground.height = worldH;
    const gg = ground.getContext("2d")!;
    gg.imageSmoothingEnabled = false;
    const floorCv = rasterize(floorImg, 1);
    const wallCv = rasterize(wallImg, 1);
    rows.forEach((row, r) => {
      for (let c = 0; c < row.length; c += 1) gg.drawImage(row[c] === "#" ? wallCv : floorCv, c * TILE, r * TILE, TILE, TILE);
    });
    addCanvas(tex("ground"), ground);
    this.add.image(0, 0, tex("ground")).setOrigin(0).setDepth(0);

    // ── solids + props from the layout glyphs ──
    const solids = this.physics.add.staticGroup();
    const addSolid = (c: number, r: number): void => {
      const b = solids.create(c * TILE + TILE / 2, r * TILE + TILE / 2, undefined as unknown as string) as Phaser.Types.Physics.Arcade.SpriteWithStaticBody;
      b.setVisible(false).setDisplaySize(TILE, TILE).refreshBody();
    };
    rows.forEach((row, r) => {
      for (let c = 0; c < row.length; c += 1) {
        const glyph = row[c] ?? ".";
        if (glyph === "#") { addSolid(c, r); continue; }
        const entry = legend[glyph];
        if (!entry || entry.enter !== undefined) continue; // entrances stay WALKABLE (the Keen door)
        const x = c * TILE + TILE / 2;
        const y = r * TILE + TILE / 2;
        if (entry.prop === "bramble") {
          // topological unlock (§1.8): beaten chapter ⇒ the tangle is GONE
          if (entry.clearedBy !== undefined && cleared.has(entry.clearedBy)) continue;
          this.add.image(x, y, tex("bramble")).setDepth(3);
          addSolid(c, r);
        } else if (entry.prop === "tree") {
          this.add.image(x, y, tex("tree")).setDisplaySize(TILE, TILE).setDepth(3);
          addSolid(c, r);
        } else if (entry.prop === "npc:finn" || entry.prop === "npc:pixel") {
          const finn = entry.prop === "npc:finn";
          const img = this.add.image(x, y, tex(finn ? "finn" : "pixel")).setDepth(3);
          if (finn && motion) this.tweens.add({ targets: img, y: y - 5, duration: 1100, yoyo: true, repeat: -1, ease: "Sine.easeInOut" });
          if (!finn) {
            const tail = this.add.image(x - 12, y + 6, tex("pixeltail")).setOrigin(0.8, 0.9).setDepth(3);
            if (motion) this.tweens.add({ targets: tail, angle: { from: -10, to: 8 }, duration: 900, yoyo: true, repeat: -1, ease: "Sine.easeInOut", delay: 300 });
          }
          const bubble = this.add.text(x, y - 28, "…", { fontFamily: "system-ui, sans-serif", fontSize: "16px", fontStyle: "bold", color: "#e8e6f5" }).setOrigin(0.5).setDepth(4);
          if (motion) this.tweens.add({ targets: bubble, alpha: { from: 0.3, to: 1 }, duration: 800, yoyo: true, repeat: -1 });
          addSolid(c, r);
        } else if (entry.prop === "note") {
          continue; // papers come from cfg.notes (the authored text source)
        } else if (entry.solid === true) {
          addSolid(c, r);
        }
      }
    });

    // ── notes (folded papers; overlap → onNote once per session) ──
    const noteGroup = this.physics.add.staticGroup();
    for (const n of this.cfg.notes) {
      const x = n.c * TILE + TILE / 2;
      const y = n.r * TILE + TILE / 2;
      const img = this.add.image(x, y, tex("paper")).setDepth(3);
      const zone = noteGroup.create(x, y, undefined as unknown as string) as Phaser.Types.Physics.Arcade.SpriteWithStaticBody;
      zone.setVisible(false).setDisplaySize(30, 26).refreshBody();
      zone.setData("text", n.text).setData("img", img);
    }

    // ── the player (free 8-direction walk — the map-Keen actor, §1.4) ──
    const findP = (): { c: number; r: number } | null => {
      for (let r = 0; r < rows.length; r += 1) {
        const c = rows[r]?.indexOf("P") ?? -1;
        if (c >= 0) return { c, r };
      }
      return null;
    };
    const sp = this.cfg.startPos;
    const spawnOk = sp != null && rows[sp.r]?.[sp.c] !== undefined && rows[sp.r]?.[sp.c] !== "#";
    const spawnCell = spawnOk && sp != null ? sp : findP() ?? { c: 1, r: 1 };
    const spawn = { x: spawnCell.c * TILE + TILE / 2, y: spawnCell.r * TILE + TILE / 2 };
    const sprite = paintPlayerSprite(this.cfg.playerSeed ?? this.cfg.seed);
    if (!this.textures.exists("p-right")) {
      this.textures.addCanvas("p-right", rasterize(sprite.frames[3]!, 1));
      sprite.walk.right.forEach((img, s) => addCanvas(`p-right-${s + 1}`, rasterize(img, 1)));
    }
    this.player = this.physics.add.sprite(spawn.x, spawn.y, "p-right");
    this.player.setDisplaySize(TILE, TILE).setDepth(6);
    this.player.body.setSize(24, 30).setOffset(12, 14);
    this.physics.world.setBounds(0, 0, worldW, worldH);
    this.player.setCollideWorldBounds(true);
    this.physics.add.collider(this.player, solids);
    this.physics.add.overlap(this.player, noteGroup, (_p, z) => {
      const zone = z as Phaser.Types.Physics.Arcade.SpriteWithStaticBody;
      if (zone.getData("taken") === true) return;
      zone.setData("taken", true);
      zone.disableBody(true, false);
      const img = zone.getData("img") as Phaser.GameObjects.Image;
      if (motion) this.tweens.add({ targets: img, alpha: 0.25, duration: 500 });
      else img.setAlpha(0.25);
      playSfx("chime-close");
      this.cfg.onNote(zone.getData("text") as string);
    });

    // ── buildings, restoration grey, flags ──
    const chapters = Object.values(buildings).map((b) => b.chapter).sort();
    const firstOpen = chapters.find((c) => !cleared.has(c)) ?? null;
    this.unlockedSet = new Set([...cleared, ...(firstOpen !== null ? [firstOpen] : [])]);
    for (const b of Object.values(buildings)) {
      const done = cleared.has(b.chapter);
      const warm = done || this.unlockedSet.has(b.chapter);
      const x = b.cell.c * TILE + TILE / 2;
      const bottom = b.cell.r * TILE + TILE;
      const img = this.add.image(x, bottom, tex(warm ? "house" : "house-dark")).setOrigin(0.5, 1).setDepth(2);
      if (!warm) img.setAlpha(0.8);
      this.add.text(x, bottom + 2, b.label, { fontFamily: "system-ui, sans-serif", fontSize: "10px", color: "#c9c4e4" }).setOrigin(0.5, 0).setDepth(2);
      if (!done) {
        // restoration grey: the drained ground patch, above tiles, below sprites
        this.add.rectangle(b.ground.c * TILE, b.ground.r * TILE, b.ground.w * TILE, b.ground.h * TILE, 0x141221, 0.45).setOrigin(0).setDepth(1);
      }
      this.entrances.push({ chapter: b.chapter, c: b.cell.c, r: b.cell.r, label: b.label });
      if (!done) continue;

      // the flag over a beaten building (keen-metagame §1.6)
      const fx = x;
      const fy = (b.cell.r - 1) * TILE + TILE / 2;
      const flag = this.add.image(fx, fy, tex("flag")).setDepth(4);
      const wave = (): void => {
        if (motion) this.tweens.add({ targets: flag, angle: { from: -4, to: 4 }, duration: 900, yoyo: true, repeat: -1, ease: "Sine.easeInOut" });
      };
      if (this.cfg.justDone === b.chapter && motion) {
        // the celebratory THROW: player's spot → the pole, one parabola + spin
        flag.setPosition(spawn.x, spawn.y - TILE / 2);
        this.tweens.addCounter({
          from: 0,
          to: 1,
          duration: 600,
          delay: 250,
          onUpdate: (tw) => {
            const t = tw.getValue() ?? 0;
            flag.x = Phaser.Math.Linear(spawn.x, fx, t);
            flag.y = Phaser.Math.Linear(spawn.y - TILE / 2, fy, t) - Math.sin(Math.PI * t) * TILE * 3;
            flag.angle = 540 * t;
          },
          onComplete: () => {
            flag.setPosition(fx, fy).setAngle(0);
            playSfx("streak");
            wave();
          },
        });
      } else {
        if (this.cfg.justDone === b.chapter) playSfx("streak");
        wave();
      }
    }

    // ── input + camera ──
    const kb = this.input.keyboard;
    if (kb) {
      this.cursors = kb.createCursorKeys();
      this.wasd = kb.addKeys("W,A,S,D") as typeof this.wasd;
      this.actionKeys = [
        kb.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER),
        kb.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE),
        kb.addKey(Phaser.Input.Keyboard.KeyCodes.E),
      ];
    }
    this.cameras.main.setBounds(0, 0, worldW, worldH);
    this.cameras.main.startFollow(this.player, false, 0.12, 0.12);
    if (motion) this.cameras.main.fadeIn(240, 20, 18, 33);
  }

  /** Read-only snapshot for the `__domigoMap` harness (the ArcadeGame pattern). */
  debugState(): Record<string, number | boolean | string | null> {
    return {
      c: Math.floor((this.player?.x ?? 0) / TILE),
      r: Math.floor((this.player?.y ?? 0) / TILE),
      x: Math.round(this.player?.x ?? 0),
      y: Math.round(this.player?.y ?? 0),
      prompt: this.current?.chapter ?? null,
      fps: Math.round(this.game.loop.actualFps),
    };
  }

  update(): void {
    if (!this.player) return;
    const now = this.time.now;

    // ── input (keyboard OR'd with the shared pad, every frame — the ArcadeScene read) ──
    const pad = this.cfg.pad;
    const left = this.cursors?.left.isDown === true || this.wasd?.A.isDown === true || pad.left === true;
    const right = this.cursors?.right.isDown === true || this.wasd?.D.isDown === true || pad.right === true;
    const up = this.cursors?.up.isDown === true || this.wasd?.W.isDown === true || pad.up === true;
    const down = this.cursors?.down.isDown === true || this.wasd?.S.isDown === true || pad.down === true;
    const dx = (right ? 1 : 0) - (left ? 1 : 0);
    const dy = (down ? 1 : 0) - (up ? 1 : 0);
    const norm = dx !== 0 && dy !== 0 ? Math.SQRT1_2 : 1; // diagonals never outrun the walk
    this.player.setVelocity(dx * WALK_SPEED * norm, dy * WALK_SPEED * norm);
    if (dx !== 0) this.facing = dx > 0 ? 1 : -1;
    this.player.setFlipX(this.facing === -1);
    const moving = dx !== 0 || dy !== 0;
    const frame = moving ? (Math.floor(now / 130) % 2 === 0 ? "p-right-1" : "p-right-2") : "p-right";
    if (this.player.texture.key !== frame && this.textures.exists(frame)) {
      this.player.setTexture(frame);
      this.player.setDisplaySize(TILE, TILE);
    }

    // ── tile change → onMove (the save cursor) ──
    const c = Math.floor(this.player.x / TILE);
    const r = Math.floor(this.player.y / TILE);
    if (c !== this.lastTile.c || r !== this.lastTile.r) {
      this.lastTile = { c, r };
      this.cfg.onMove(c, r);
    }

    // ── entrance proximity (on the door cell or 1-tile adjacent) ──
    const near = this.entrances.find((e) => Math.abs(e.c - c) <= 1 && Math.abs(e.r - r) <= 1) ?? null;
    if ((near?.chapter ?? null) !== (this.current?.chapter ?? null)) {
      this.current = near;
      this.cfg.onPrompt(near);
    }

    // ── the confirm press (pad jump/pogo edge OR Enter/Space/E) ──
    const padAction = pad.jump === true || pad.pogo === true;
    const padEdge = padAction && !this.padActionHeld;
    this.padActionHeld = padAction;
    const keyEdge = this.actionKeys.some((k) => Phaser.Input.Keyboard.JustDown(k));
    if ((padEdge || keyEdge) && this.current !== null) {
      if (this.unlockedSet.has(this.current.chapter)) {
        playSfx("pop");
        this.cfg.onEnter(this.current.chapter);
      } else if (now >= this.shakeLockUntil) {
        // locked: a small head-shake, no door (topological order holds)
        this.shakeLockUntil = now + 500;
        playSfx("thud");
        if (this.cfg.reducedMotion !== true) {
          this.tweens.add({ targets: this.player, angle: { from: -8, to: 8 }, duration: 70, yoyo: true, repeat: 2, onComplete: () => this.player.setAngle(0) });
        }
      }
    }
  }
}
