// THE PAINTED BOOK — the phase scene: a THIN renderer over the pure brains.
// One instance renders ONE phase. All simulation runs on the fixed 60Hz
// accumulator (never wall-clock); the rig compositor applies rig.ts poses to
// the sliced parts; terrain is strips-over-tiles (painted strips along the
// surface runs, warm fills beneath, procedural fallbacks when art is absent —
// the only-present law). P-49 LAW: this scene NEVER starts/stops scenes —
// phase handoffs go through the React shell's handoff() (PaintGame.tsx).

import Phaser from "phaser";
import { glyphAt, isSlope, isSolid } from "./collide.ts";
import { findGlyph, type PaintLevel, type PhaseSpec } from "./level.ts";
import { LOGICAL_H, LOGICAL_W, MAX_TICKS_PER_FRAME, PAINT, RENDER_SCALE, SUBS, TICK_MS, TILE, fromSubs } from "./paint.ts";
import { clampScroll, cameraTargetX, stepCameraAxis, stepCameraY } from "./camera.ts";
import { type FistState, stepFist, throwFist } from "./fist.ts";
import { IDLE_PAD, type Pad, type PlayerEvent, type PlayerState, spawnPlayer, stepPlayer } from "./player.ts";
import { rigPose, withFistAway } from "./rig.ts";
import {
  RIG_CELL,
  RIG_PART_ORDER,
  RIG_SRC_SCALE,
  type RigPartName,
  ROTOR_STEMS,
  bodyStemFor,
  faceFor,
  handStemFor,
  hairStemFor,
  shoeStemFor,
} from "./rigSpec.ts";

export interface PaintCallbacks {
  onExit: (next: string) => void;
  onLetters: (got: number, total: number) => void;
  onEncounter: (hazard: string) => void;
}

export interface PaintSceneCfg {
  level: PaintLevel;
  phaseId: string;
  art: Record<string, string>; // stem → url (only-present)
  pad: Pad; // the SHARED mutable pad (touch/harness write here)
  callbacks: PaintCallbacks;
  reducedMotion: boolean;
}

const EARTH = 0xa8794f;
const EARTH_DARK = 0x8a6140;
const ICE = 0xd7e9f2;
const INK = 0x243048;
const GRASS = 0x59a83c;

export class PaintScene extends Phaser.Scene {
  private cfg: PaintSceneCfg;
  private phase: PhaseSpec;
  private grid: readonly string[];
  private worldWpx: number;
  private worldHpx: number;

  private player!: PlayerState;
  private prevPad: Pad = { ...IDLE_PAD };
  private fist: FistState | null = null;
  private acc = 0;
  private tickCount = 0;
  private exitFired = false;
  private lettersTotal = 0;
  private lettersGot = 0;

  private parts = new Map<RigPartName, Phaser.GameObjects.Image>();
  private rigRoot!: Phaser.GameObjects.Container;
  private fistImg!: Phaser.GameObjects.Image;
  private letterImgs = new Map<string, Phaser.GameObjects.Image>();
  private ringImgs: Array<{ img: Phaser.GameObjects.Image; baseY: number }> = [];
  private rings: Array<{ x: number; y: number }> = [];
  private exitCell: { c: number; r: number };
  private keys!: Record<string, Phaser.Input.Keyboard.Key>;

  constructor(cfg: PaintSceneCfg) {
    super({ key: "paint" });
    this.cfg = cfg;
    const phase = cfg.level.phases.find((p) => p.id === cfg.phaseId);
    if (!phase) throw new Error(`PaintScene: unknown phase ${cfg.phaseId}`);
    this.phase = phase;
    this.grid = phase.rows;
    this.worldWpx = (phase.rows[0]?.length ?? 0) * TILE;
    this.worldHpx = phase.rows.length * TILE;
    const exit = findGlyph(phase.rows, "X") ?? findGlyph(phase.rows, "B");
    this.exitCell = exit ?? { c: 0, r: 0 };
  }

  preload(): void {
    for (const [stem, url] of Object.entries(this.cfg.art)) {
      if (!this.textures.exists(`pb-${stem}`)) this.load.image(`pb-${stem}`, url);
    }
  }

  create(): void {
    this.buildFallbackTextures();
    this.buildBackdrop();
    this.buildTerrain();
    this.buildProps();
    this.buildRig();
    this.fistImg = this.add.image(0, 0, this.tex("hand_fist")).setScale(RIG_SRC_SCALE).setDepth(11).setVisible(false);

    const start = findGlyph(this.grid, "S") ?? { c: 2, r: 2 };
    this.player = spawnPlayer(start.c * TILE + TILE / 2, (start.r + 1) * TILE);

    const kb = this.input.keyboard;
    this.keys = kb
      ? (kb.addKeys("LEFT,RIGHT,UP,DOWN,A,D,W,S,SPACE,X,J") as Record<string, Phaser.Input.Keyboard.Key>)
      : {};

    this.cameras.main.setZoom(RENDER_SCALE);
    this.cameras.main.centerOn(fromSubs(this.player.x), fromSubs(this.player.y) - LOGICAL_H / 4);
    this.scale.refresh(); // the P-48 lesson: assert geometry at scene entry
  }

  /** The harness + HUD read through this (never Phaser internals). */
  getState(): { x: number; y: number; vx: number; vy: number; pose: string; grounded: boolean; phase: string; letters: number; hovering: boolean } {
    return {
      x: fromSubs(this.player.x),
      y: fromSubs(this.player.y),
      vx: this.player.vx,
      vy: this.player.vy,
      pose: this.player.pose,
      grounded: this.player.grounded,
      phase: this.cfg.phaseId,
      letters: this.lettersGot,
      hovering: this.player.hovering,
    };
  }

  warp(c: number, r: number): void {
    this.player = { ...this.player, x: (c * TILE + TILE / 2) * SUBS, y: (r + 1) * TILE * SUBS, vx: 0, vy: 0, grounded: false };
  }

  update(_time: number, delta: number): void {
    this.acc += Math.min(delta, 100);
    let ticks = 0;
    while (this.acc >= TICK_MS && ticks < MAX_TICKS_PER_FRAME) {
      this.acc -= TICK_MS;
      ticks++;
      this.stepOnce();
    }
    this.render();
  }

  private stepOnce(): void {
    this.tickCount++;
    const pad = this.readPad();
    const near = this.nearestRing();
    const out = stepPlayer(this.player, pad, this.prevPad, this.grid, {
      slippery: this.phase.surface === "slippery",
      canRun: this.cfg.level.abilities.includes("run"),
      canHover: this.cfg.level.abilities.includes("hover"),
      canPunch: this.cfg.level.abilities.includes("punch"),
      canHang: this.cfg.level.abilities.includes("hang"),
      fistBusy: this.fist !== null,
      ringAt: this.cfg.level.abilities.includes("swing") ? near : null,
    });
    this.player = out.st;
    this.prevPad = { ...pad };
    for (const ev of out.events) this.onEvent(ev);

    if (this.fist) {
      const tipC = Math.floor(fromSubs(this.fist.x + this.fist.dir * 8 * SUBS) / TILE);
      const tipR = Math.floor(fromSubs(this.fist.y) / TILE);
      const bounced = isSolid(glyphAt(this.grid, tipC, tipR));
      const res = stepFist(this.fist, this.player.x, this.player.y, bounced);
      this.fist = res.caught || !res.fist.active ? null : res.fist;
    }

    this.collectLetters();
    this.checkExit();
  }

  private onEvent(ev: PlayerEvent): void {
    if (ev.type === "fistThrown") {
      this.fist = throwFist(this.player.x, this.player.y, this.player.facing, ev.charge, ev.speedSubs);
    } else if (ev.type === "encounter") {
      this.cfg.callbacks.onEncounter(ev.hazard);
      this.toast(ev.hazard === "^" ? "Autsch!" : "Platsch!");
    }
  }

  private readPad(): Pad {
    const k = this.keys;
    const down = (n: string): boolean => k[n]?.isDown === true;
    const t = this.cfg.pad; // touch/harness writes
    return {
      left: t.left || down("LEFT") || down("A"),
      right: t.right || down("RIGHT") || down("D"),
      up: t.up || down("UP") || down("W"),
      down: t.down || down("DOWN") || down("S"),
      jump: t.jump || down("SPACE") || down("W") || down("UP"),
      punch: t.punch || down("X") || down("J"),
    };
  }

  private nearestRing(): { x: number; y: number } | null {
    for (const g of this.rings) {
      if (Math.abs(g.x - this.player.x) <= 14 * SUBS && Math.abs(g.y - (this.player.y - 30 * SUBS)) <= 28 * SUBS) return g;
    }
    return null;
  }

  private collectLetters(): void {
    const px = fromSubs(this.player.x);
    const py = fromSubs(this.player.y);
    for (const [key, img] of this.letterImgs) {
      const [c, r] = key.split(",").map(Number) as [number, number];
      const cx = c * TILE + TILE / 2;
      const cy = r * TILE + TILE / 2;
      if (Math.abs(px - cx) < 11 && Math.abs(py - 10 - cy) < 16) {
        img.destroy();
        this.letterImgs.delete(key);
        this.lettersGot++;
        this.cfg.callbacks.onLetters(this.lettersGot, this.lettersTotal);
      }
    }
  }

  private checkExit(): void {
    if (this.exitFired) return;
    const px = fromSubs(this.player.x);
    const py = fromSubs(this.player.y);
    const cx = this.exitCell.c * TILE + TILE / 2;
    const cy = (this.exitCell.r + 1) * TILE;
    if (Math.abs(px - cx) < 10 && Math.abs(py - cy) < 22) {
      this.exitFired = true;
      this.cfg.callbacks.onExit(this.phase.exit.to); // React owns the handoff (P-49)
    }
  }

  // ── rendering ──────────────────────────────────────────────────────────────

  private render(): void {
    const pose0 = rigPose({
      pose: this.player.pose,
      walkTime: this.player.walkTime,
      tick: this.tickCount,
      vxSubs: this.player.vx,
      vySubs: this.player.vy,
      charge: this.player.charge,
      landedAgo: this.player.landedAgo,
      reducedMotion: this.cfg.reducedMotion,
    });
    const pose = this.fist ? withFistAway(pose0) : pose0;

    this.rigRoot.setPosition(fromSubs(this.player.x), fromSubs(this.player.y) - 15);
    this.rigRoot.setScale(this.player.facing * pose.scaleX, pose.scaleY);
    const flicker = this.player.iframes > 0 && this.player.iframes % 8 < 4;
    this.rigRoot.setAlpha(flicker ? 0.45 : 1);

    const apply = (name: RigPartName, dx: number, dy: number, rot: number, hidden: boolean, frame?: number): void => {
      const img = this.parts.get(name);
      if (!img) return;
      img.setPosition(dx, dy).setRotation(rot).setVisible(!hidden);
      if (name === "rotor" && frame !== undefined) img.setTexture(this.tex(ROTOR_STEMS[frame] ?? "rotor_a"));
    };
    apply("body", pose.body.dx, pose.body.dy, pose.body.rot, false);
    apply("head", pose.head.dx, pose.head.dy, pose.head.rot, false);
    apply("hair", pose.hair.dx, pose.hair.dy, pose.hair.rot, false);
    apply("handF", pose.handF.dx, pose.handF.dy, pose.handF.rot, pose.handF.hidden === true);
    apply("handB", pose.handB.dx, pose.handB.dy, pose.handB.rot, pose.handB.hidden === true);
    apply("footF", pose.footF.dx, pose.footF.dy, pose.footF.rot, false);
    apply("footB", pose.footB.dx, pose.footB.dy, pose.footB.rot, false);
    apply("rotor", pose.rotor.dx, pose.rotor.dy, pose.rotor.rot, pose.rotor.hidden === true, pose.rotor.frame);

    this.parts.get("head")?.setTexture(this.tex(faceFor(this.player.pose, this.tickCount, false)));
    this.parts.get("body")?.setTexture(this.tex(bodyStemFor(this.player.pose)));
    const hand = this.tex(handStemFor(this.player.pose));
    this.parts.get("handF")?.setTexture(hand);
    this.parts.get("handB")?.setTexture(hand);
    const shoe = this.tex(shoeStemFor(this.player.pose));
    this.parts.get("footF")?.setTexture(shoe);
    this.parts.get("footB")?.setTexture(shoe);
    this.parts.get("hair")?.setTexture(this.tex(hairStemFor(this.player.pose, this.player.vx)));

    if (this.fist) {
      this.fistImg.setVisible(true).setPosition(fromSubs(this.fist.x), fromSubs(this.fist.y)).setFlipX(this.fist.dir < 0);
    } else {
      this.fistImg.setVisible(false);
    }

    for (const ring of this.ringImgs) {
      ring.img.y = ring.baseY + (this.cfg.reducedMotion ? 0 : Math.sin(this.tickCount / 22) * 1.5);
    }

    // the camera brain drives the view (centerOn handles the zoom math)
    const tx = cameraTargetX(this.player.x, this.player.facing);
    this.camX = clampScroll(stepCameraAxis(this.camX, tx), this.worldWpx, LOGICAL_W);
    this.camY = clampScroll(stepCameraY(this.camY, this.player.y), this.worldHpx, LOGICAL_H);
    this.cameras.main.centerOn(fromSubs(this.camX) + LOGICAL_W / 2, fromSubs(this.camY) + LOGICAL_H / 2);
  }

  private camX = 0;
  private camY = 0;

  // ── builders ───────────────────────────────────────────────────────────────

  private tex(stem: string): string {
    return this.textures.exists(`pb-${stem}`) ? `pb-${stem}` : `fb-${stem}`;
  }

  private buildFallbackTextures(): void {
    const g = this.add.graphics();
    const make = (key: string, draw: () => void, w: number, h: number): void => {
      if (this.textures.exists(key)) return;
      g.clear();
      draw();
      g.generateTexture(key, w, h);
    };
    // rig fallbacks are drawn at CELL size so RIG_SRC_SCALE applies uniformly
    const cell = RIG_CELL;
    make("fb-body_idle", () => { g.fillStyle(0x2e5faa); g.fillEllipse(cell / 2, cell / 2, 250, 240); }, cell, cell);
    for (const s of ["body_lean", "body_crouch"]) make(`fb-${s}`, () => { g.fillStyle(0x2e5faa); g.fillEllipse(cell / 2, cell / 2 + 10, 250, 220); }, cell, cell);
    for (const s of ["head_neutral", "head_blink", "head_determined", "head_hurt", "head_celebrate"]) {
      make(`fb-${s}`, () => { g.fillStyle(0xf2c58f); g.fillCircle(cell / 2, cell / 2, 140); g.fillStyle(0x6b4a2a); g.fillEllipse(cell / 2, cell / 2 - 70, 260, 130); }, cell, cell);
    }
    for (const s of ["hand_open", "hand_fist", "hand_grip"]) make(`fb-${s}`, () => { g.fillStyle(0xf6e7c8); g.fillCircle(cell / 2, cell / 2, 55); }, cell, cell);
    for (const s of ["shoe_neutral", "shoe_tucked"]) make(`fb-${s}`, () => { g.fillStyle(0x9c3f2c); g.fillEllipse(cell / 2, cell / 2, 130, 75); }, cell, cell);
    for (const s of ["hair_still", "hair_wind"]) make(`fb-${s}`, () => { g.fillStyle(0x6b4a2a); g.fillEllipse(cell / 2, cell / 2, 150, 80); }, cell, cell);
    for (const s of ["rotor_a", "rotor_b", "rotor_c"]) make(`fb-${s}`, () => { g.fillStyle(0xfdf7e6, 0.9); g.fillEllipse(cell / 2, cell / 2, 260, 60); }, cell, cell);
    make("fb-satchel", () => { g.fillStyle(0x7a5230); g.fillRoundedRect(cell / 2 - 70, cell / 2 - 55, 140, 110, 24); }, cell, cell);
    // prop fallbacks at content-ish sizes
    make("fb-prop_ring", () => { g.lineStyle(26, 0xf0c040); g.strokeCircle(150, 150, 110); }, 300, 300);
    make("fb-prop_letter", () => { g.fillStyle(0xf0c040); g.fillCircle(110, 110, 90); }, 220, 220);
    make("fb-prop_exit", () => { g.fillStyle(0x8a6140); g.fillRect(150, 60, 30, 270); g.fillStyle(0xd9b98a); g.fillRoundedRect(60, 60, 220, 110, 18); }, 340, 340);
    make("fb-prop_spring", () => { g.lineStyle(20, 0xd9b98a); for (let i = 0; i < 4; i++) g.strokeEllipse(130, 60 + i * 55, 180, 44); }, 260, 260);
    make("fb-prop_vine", () => { g.fillStyle(0x3f7d33); g.fillRect(50, 0, 24, 384); }, 124, 384);
    g.destroy();
  }

  private buildBackdrop(): void {
    const skyG = this.add.graphics().setScrollFactor(0).setDepth(-12);
    skyG.fillGradientStyle(0xf9edd2, 0xf9edd2, 0xf3ddb0, 0xf3ddb0, 1);
    skyG.fillRect(-LOGICAL_W, -LOGICAL_H, LOGICAL_W * 3, LOGICAL_H * 3);

    if (this.textures.exists("pb-plate_far")) {
      const far = this.add.image(this.worldWpx / 2, this.worldHpx / 2 - 8, "pb-plate_far").setDepth(-11).setScrollFactor(0.12, 0.06);
      const sc = Math.max((LOGICAL_W * 1.5) / far.width, (LOGICAL_H * 1.35) / far.height);
      far.setScale(sc);
    }
    if (this.textures.exists("pb-strip_mid_loop")) {
      const src = this.textures.get("pb-strip_mid_loop").getSourceImage() as HTMLImageElement;
      const dispH = 86; // sits at the horizon; the far plate + sky stay visible above
      const mid = this.add
        .tileSprite(0, this.worldHpx - dispH - 34, this.worldWpx + LOGICAL_W * 2, dispH, "pb-strip_mid_loop")
        .setOrigin(0, 0)
        .setDepth(-9)
        .setScrollFactor(0.5, 0.9)
        .setAlpha(0.92);
      mid.setTileScale(dispH / src.height);
      mid.x = -LOGICAL_W;
    }
  }

  private buildTerrain(): void {
    const fill = this.add.graphics().setDepth(1);
    const h = this.grid.length;
    const w = this.grid[0]?.length ?? 0;
    for (let r = 0; r < h; r++) {
      for (let c = 0; c < w; c++) {
        const g = glyphAt(this.grid, c, r);
        if (isSolid(g)) {
          fill.fillStyle(g === "~" ? ICE : isSolid(glyphAt(this.grid, c, r - 1)) ? EARTH_DARK : EARTH);
          fill.fillRect(c * TILE, r * TILE, TILE, TILE);
        } else if (g === "=") {
          fill.fillStyle(0xc9a36a);
          fill.fillRoundedRect(c * TILE, r * TILE + 1, TILE, 5, 2);
        } else if (g === "^") {
          fill.fillStyle(INK);
          fill.fillTriangle(c * TILE + 1, (r + 1) * TILE, c * TILE + 8, r * TILE + 4, c * TILE + 15, (r + 1) * TILE);
        } else if (g === "w") {
          fill.fillStyle(0x2c3a58, 0.92);
          fill.fillRect(c * TILE, r * TILE + 3, TILE, TILE - 3);
          fill.fillStyle(0x51689a);
          fill.fillRect(c * TILE, r * TILE + 3, TILE, 2);
        } else if (isSlope(g)) {
          fill.fillStyle(EARTH);
          const x = c * TILE;
          const y = r * TILE;
          if (g === "/") fill.fillTriangle(x, y + TILE, x + TILE, y + TILE, x + TILE, y);
          else if (g === "\\") fill.fillTriangle(x, y, x, y + TILE, x + TILE, y + TILE);
          else if (g === "1") fill.fillTriangle(x, y + TILE, x + TILE, y + TILE, x + TILE, y + TILE / 2);
          else if (g === "2") { fill.fillTriangle(x, y + TILE, x + TILE, y + TILE, x + TILE, y); fill.fillRect(x, y + TILE / 2, TILE, TILE / 2); }
          else if (g === "3") { fill.fillTriangle(x, y, x, y + TILE, x + TILE, y + TILE); fill.fillRect(x, y + TILE / 2, TILE, TILE / 2); }
          else if (g === "4") fill.fillTriangle(x, y + TILE / 2, x, y + TILE, x + TILE, y + TILE);
          fill.lineStyle(2, GRASS);
          if (g === "/") fill.lineBetween(x, y + TILE, x + TILE, y);
          if (g === "\\") fill.lineBetween(x, y, x + TILE, y + TILE);
        }
      }
    }

    // painted strips along every exposed surface run (strips-over-tiles)
    if (this.textures.exists("pb-strip_ground_loop")) {
      const src = this.textures.get("pb-strip_ground_loop").getSourceImage() as HTMLImageElement;
      const dispH = 30;
      const tileScale = dispH / src.height;
      for (let r = 0; r < h; r++) {
        let c = 0;
        while (c < w) {
          const surface = (cc: number): boolean => {
            const g = glyphAt(this.grid, cc, r);
            return isSolid(g) && g !== "~" && !isSolid(glyphAt(this.grid, cc, r - 1)) && !isSlope(glyphAt(this.grid, cc, r - 1));
          };
          if (!surface(c)) { c++; continue; }
          let c1 = c;
          while (c1 + 1 < w && surface(c1 + 1)) c1++;
          const runW = (c1 - c + 1) * TILE;
          this.add
            .tileSprite(c * TILE, r * TILE - 7, runW, dispH, "pb-strip_ground_loop")
            .setOrigin(0, 0)
            .setDepth(2)
            .setTileScale(tileScale);
          if (this.textures.exists("pb-strip_cap_l") && c > 0) {
            this.add.image(c * TILE + 2, r * TILE - 7, "pb-strip_cap_l").setOrigin(1, 0).setScale(tileScale).setDepth(2);
          }
          if (this.textures.exists("pb-strip_cap_r") && c1 < w - 1) {
            this.add.image((c1 + 1) * TILE - 2, r * TILE - 7, "pb-strip_cap_r").setOrigin(0, 0).setScale(tileScale).setDepth(2);
          }
          c = c1 + 1;
        }
      }
    }
  }

  private buildProps(): void {
    const h = this.grid.length;
    const w = this.grid[0]?.length ?? 0;
    for (let r = 0; r < h; r++) {
      for (let c = 0; c < w; c++) {
        const g = glyphAt(this.grid, c, r);
        const cx = c * TILE + TILE / 2;
        const cy = r * TILE + TILE / 2;
        if (g === "o") {
          const img = this.add.image(cx, cy, this.tex("prop_ring")).setDepth(3);
          img.setScale(15 / img.height);
          this.ringImgs.push({ img, baseY: cy });
          this.rings.push({ x: cx * SUBS, y: cy * SUBS });
        } else if (g === "*") {
          const img = this.add.image(cx, cy, this.tex("prop_letter")).setDepth(4);
          img.setScale(10 / img.height);
          this.letterImgs.set(`${c},${r}`, img);
          this.lettersTotal++;
        } else if (g === "X" || g === "B") {
          const img = this.add.image(cx, (r + 1) * TILE, this.tex("prop_exit")).setOrigin(0.5, 1).setDepth(3);
          img.setScale(24 / img.height);
        } else if (g === "s") {
          const img = this.add.image(cx, (r + 1) * TILE, this.tex("prop_spring")).setOrigin(0.5, 1).setDepth(3);
          img.setScale(13 / img.height);
        } else if (g === "V") {
          const img = this.add.image(cx, cy, this.tex("prop_vine")).setDepth(3);
          img.setScale(TILE / img.height);
        } else if (g === "C") {
          const flag = this.add.graphics().setDepth(3);
          flag.fillStyle(0x8a6140).fillRect(cx - 1, cy - 10, 2, 26);
          flag.fillStyle(0xf0c040).fillTriangle(cx + 1, cy - 10, cx + 12, cy - 6, cx + 1, cy - 2);
        }
      }
    }
    this.cfg.callbacks.onLetters(0, this.lettersTotal);
  }

  private buildRig(): void {
    this.rigRoot = this.add.container(0, 0).setDepth(10);
    for (const name of RIG_PART_ORDER) {
      const stem =
        name === "body" ? "body_idle"
        : name === "head" ? "head_neutral"
        : name === "hair" ? "hair_still"
        : name === "rotor" ? "rotor_a"
        : name.startsWith("hand") ? "hand_open"
        : "shoe_neutral";
      const img = this.add.image(0, 0, this.tex(stem)).setScale(RIG_SRC_SCALE);
      if (name === "rotor") img.setVisible(false);
      this.parts.set(name, img);
      this.rigRoot.add(img);
    }
  }

  private toast(text: string): void {
    const t = this.add
      .text(fromSubs(this.player.x), fromSubs(this.player.y) - 42, text, {
        fontFamily: "system-ui, sans-serif",
        fontSize: "10px",
        color: "#243048",
        backgroundColor: "#fdf7e6",
        padding: { x: 4, y: 2 },
      })
      .setOrigin(0.5, 1)
      .setDepth(20)
      .setResolution(RENDER_SCALE * 2);
    this.time.delayedCall(900, () => t.destroy());
  }
}
