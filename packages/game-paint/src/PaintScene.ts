// THE PAINTED BOOK — the phase scene: a THIN renderer over the pure brains.
// One instance renders ONE phase. All simulation runs on the fixed 60Hz
// accumulator (never wall-clock); the rig compositor applies rig.ts poses to
// the sliced parts; terrain is strips-over-tiles (painted strips along the
// surface runs, warm fills beneath, procedural fallbacks when art is absent —
// the only-present law). P-49 LAW: this scene NEVER starts/stops scenes —
// phase handoffs go through the React shell's handoff() (PaintGame.tsx).

import Phaser from "phaser";
import { glyphAt, isSlope, isSolid } from "./collide.ts";
import { type PaintLevel, type PhaseSpec } from "./level.ts";
import { LOGICAL_H, LOGICAL_W, MAX_TICKS_PER_FRAME, RENDER_SCALE, SUBS, TICK_MS, TILE, fromSubs } from "./paint.ts";
import { type FistState } from "./fist.ts";
import { type Pad, type PlayerState } from "./player.ts";
import { type EntityWorld } from "./entities.ts";
import { Sim, type SimEvent, type TaskRequest } from "./sim.ts";
import { rigPose, withFistAway } from "./rig.ts";
import {
  RIG_CELL,
  RIG_PART_ORDER,
  RIG_SRC_SCALE,
  type RigPartName,
  ROTOR_STEMS,
  bodyStemFor,
  faceFor,
  handStemsFor,
  hairStemFor,
  shoeStemFor,
} from "./rigSpec.ts";

/** What the scene asks React to put on screen — lives in sim.ts now (PB-T2);
 *  re-exported so PaintGame's import path stays stable. */
export { type TaskRequest } from "./sim.ts";

export interface PaintCallbacks {
  onExit: (next: string) => void;
  onLetters: (got: number, total: number) => void;
  onTask: (req: TaskRequest) => void;
  onPowerup: (grants: string) => void;
  onCageFreed: (id: string, skin: string, classmate: string | undefined, freedCount: number) => void;
  onGuardianDown: () => void;
}

export interface PaintSceneCfg {
  level: PaintLevel;
  phaseId: string;
  art: Record<string, string>; // stem → url (only-present)
  pad: Pad; // the SHARED mutable pad (touch/harness write here)
  callbacks: PaintCallbacks;
  reducedMotion: boolean;
  /** Abilities live in React (they persist across phase mounts — the Fibel
   *  grant must survive into p3); the scene reads, never owns. */
  grantedAbilities: () => readonly string[];
  /** Cages already freed in earlier mounts (ids) — they stay burst. */
  freedCageIds: () => readonly string[];
}

const EARTH = 0xa8794f;
const EARTH_DARK = 0x8a6140;
const ICE = 0xd7e9f2;
const INK = 0x243048;
const GRASS = 0x59a83c;

export class PaintScene extends Phaser.Scene {
  private cfg: PaintSceneCfg;
  /** PB-T2: ALL gameplay lives in the headless sim — the scene draws and
   *  routes events. The proof-tape replayer runs the same Sim in CI, so the
   *  scene may never grow gameplay logic of its own again. */
  private sim: Sim;

  // sim views (render + legacy call sites read through these)
  private get phase(): PhaseSpec { return this.sim.phase; }
  private get grid(): readonly string[] { return this.sim.grid; }
  private get worldWpx(): number { return this.sim.worldWpx; }
  private get worldHpx(): number { return this.sim.worldHpx; }
  private get player(): PlayerState { return this.sim.player; }
  private get fist(): FistState | null { return this.sim.fist; }
  private get world(): EntityWorld { return this.sim.world; }
  private get overlayOpen(): boolean { return this.sim.overlayOpen; }
  private get guardianDefeated(): boolean { return this.sim.guardianDefeated; }
  private get bonusLeftTicks(): number { return this.sim.bonusLeftTicks; }
  private get tickCount(): number { return this.sim.tickCount; }
  private get lettersGot(): number { return this.sim.lettersGot; }
  private get lettersTotal(): number { return this.sim.lettersTotal; }
  private get camX(): number { return this.sim.camX; }
  private get camY(): number { return this.sim.camY; }

  private entityImgs = new Map<string, Phaser.GameObjects.Image>();
  private projG!: Phaser.GameObjects.Graphics;
  private acc = 0;

  private parts = new Map<RigPartName, Phaser.GameObjects.Image>();
  private rigRoot!: Phaser.GameObjects.Container;
  private fistImg!: Phaser.GameObjects.Image;
  private ropeG!: Phaser.GameObjects.Graphics;
  private letterImgs = new Map<string, Phaser.GameObjects.Image>();
  private ringImgs: Array<{ img: Phaser.GameObjects.Image; baseY: number }> = [];
  private keys!: Record<string, Phaser.Input.Keyboard.Key>;

  constructor(cfg: PaintSceneCfg) {
    super({ key: "paint" });
    this.cfg = cfg;
    this.sim = new Sim({
      level: cfg.level,
      phaseId: cfg.phaseId,
      grantedAbilities: cfg.grantedAbilities,
      freedCageIds: cfg.freedCageIds,
    });
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
    this.ropeG = this.add.graphics().setDepth(9);

    // player/world/letters/bonus clock all spawned by the Sim in the constructor
    this.buildEntityImgs();
    this.projG = this.add.graphics().setDepth(8);

    const kb = this.input.keyboard;
    this.keys = kb
      ? (kb.addKeys("LEFT,RIGHT,UP,DOWN,A,D,W,S,SPACE,X,J") as Record<string, Phaser.Input.Keyboard.Key>)
      : {};

    this.cameras.main.setZoom(RENDER_SCALE);
    this.cameras.main.centerOn(fromSubs(this.player.x), fromSubs(this.player.y) - LOGICAL_H / 4);
    this.scale.refresh(); // the P-48 lesson: assert geometry at scene entry
  }

  /** The harness + HUD read through this (never Phaser internals). */
  getState(): {
    x: number; y: number; vx: number; vy: number; pose: string; grounded: boolean;
    phase: string; letters: number; hovering: boolean; overlay: boolean;
    knots: number; guardianDown: boolean; bonusLeft: number;
    entities: Array<{ id: string; role: string; state: string; redeemed: boolean; x: number; y: number }>;
    projectiles: Array<{ kind: string; x: number; y: number; deflected: boolean }>;
  } | null {
    if (!this.player) return null; // boot-safe: the HUD poll may fire pre-create
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
      overlay: this.overlayOpen,
      knots: this.world?.guardianKnots ?? -1,
      guardianDown: this.guardianDefeated,
      bonusLeft: this.bonusLeftTicks,
      entities: (this.world?.entities ?? []).map((e) => ({ id: e.id, role: e.role, state: e.state, redeemed: e.redeemed, x: fromSubs(e.x), y: fromSubs(e.y) })),
      projectiles: (this.world?.projectiles ?? []).map((p) => ({ kind: p.kind, x: fromSubs(p.x), y: fromSubs(p.y), deflected: p.deflected })),
    };
  }

  warp(c: number, r: number): void {
    this.sim.warp(c, r);
  }

  update(_time: number, delta: number): void {
    this.acc += Math.min(delta, 100);
    let ticks = 0;
    while (this.acc >= TICK_MS && ticks < MAX_TICKS_PER_FRAME) {
      this.acc -= TICK_MS;
      ticks++;
      this.handleSimEvents(this.sim.step(this.readPad()));
    }
    this.render();
  }

  /** Route the sim's events to Phaser/React — the only gameplay-adjacent
   *  code the scene keeps, and it must stay a dumb switch. */
  private handleSimEvents(evs: SimEvent[]): void {
    const cb = this.cfg.callbacks;
    for (const ev of evs) {
      switch (ev.type) {
        case "toast": this.toast(ev.msg); break;
        case "task": cb.onTask(ev.req); break;
        case "powerup": cb.onPowerup(ev.grants); break;
        case "cageFreed": cb.onCageFreed(ev.id, ev.skin, ev.classmate, ev.count); break;
        case "guardianDown": cb.onGuardianDown(); break;
        case "letters": cb.onLetters(ev.got, ev.total); break;
        case "letterTaken": {
          const img = this.letterImgs.get(`${ev.c},${ev.r}`);
          img?.destroy();
          this.letterImgs.delete(`${ev.c},${ev.r}`);
          break;
        }
        case "exit": cb.onExit(ev.to); break;
        default: break;
      }
    }
  }

  // ── the React contract: the overlay resolves tasks through these ──────────

  setOverlay(open: boolean): void {
    this.sim.setOverlay(open);
  }

  /** Called by React when the task for `ctx` is SOLVED. */
  resolveTask(ctx: TaskRequest["ctx"]): void {
    this.handleSimEvents(this.sim.solveTask(ctx));
  }

  /** Called by React when a task card is DISMISSED („Später") — the anti-
   *  softlock exit: no redeem, no reward, the world just resumes. */
  dismissTask(ctx: TaskRequest["ctx"]): void {
    this.sim.dismissTask(ctx);
  }

  spendLetters(n: number): boolean {
    const ok = this.sim.spendLetters(n);
    if (ok) this.cfg.callbacks.onLetters(this.sim.lettersGot, this.sim.lettersTotal);
    return ok;
  }

  bonusState(): { leftTicks: number; got: number; total: number } {
    return { leftTicks: this.sim.bonusLeftTicks, got: this.sim.lettersGot, total: this.sim.lettersTotal };
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
      jump: t.jump || down("SPACE"), // W0-F1: jump is its OWN button — UP/W never jump
      punch: t.punch || down("X") || down("J"),
    };
  }

  private buildEntityImgs(): void {
    for (const e of this.world.entities) {
      const img = this.add.image(fromSubs(e.x), fromSubs(e.y), this.entTex(e.skin, "a")).setDepth(7).setOrigin(0.5, 1);
      img.setVisible(!e.hidden);
      this.entityImgs.set(e.id, img);
    }
  }

  /** pb-<skin>_<state> → pb-<skin>_a → fb-ent-<skin> (the only-present law). */
  private entTex(skin: string, state: string): string {
    for (const k of [`pb-${skin}_${state}`, `pb-${skin}_a`, `fb-ent-${skin}`]) {
      if (this.textures.exists(k)) return k;
    }
    return "fb-ent-generic";
  }

  private entStateCell(e: { role: string; state: string; timer: number; redeemed: boolean }): string {
    if (e.redeemed || e.state === "dazed" || e.state === "consoled" || e.state === "shooed") return "dazed";
    if (e.state === "telegraph") return "telegraph";
    if (e.state === "act") return "act";
    if (e.state === "burst") return "burst";
    if (e.state === "shaking") return "shake";
    return (Math.floor(e.timer / 12) % 2 === 0) ? "a" : "b";
  }

  /** world-space display heights per role — painted cells arrive at 512px native */
  private entTargetH(e: { role: string; skin: string }): number {
    if (e.role === "guardian") return 52;
    if (e.role === "swarm") return 34;
    if (e.role === "crusher") return 30;
    if (e.role === "door.trigger") return e.skin === "klecksdoor" ? 30 : 34;
    if (e.role === "cage") return e.skin === "pencilcase" ? 24 : 22;
    if (e.role === "powerup") return 26;
    if (e.role.startsWith("platform")) return 10;
    return 24; // chasers, gunners, flyers, bouncers
  }

  private renderEntities(): void {
    for (const e of this.world.entities) {
      const img = this.entityImgs.get(e.id);
      if (!img) continue;
      img.setVisible(!e.hidden && !(e.role === "cage" && false));
      img.setPosition(fromSubs(e.x), fromSubs(e.y));
      img.setTexture(this.entTex(e.skin, this.entStateCell(e)));
      const targetH = this.entTargetH(e);
      const frameH = img.frame.height || 1;
      if (e.role.startsWith("platform")) img.setDisplaySize(40, targetH);
      else img.setScale(targetH / frameH);
      img.setFlipX(e.dir > 0);
      if (e.redeemed && !e.role.startsWith("platform")) img.setAlpha(0.85);
      if (e.state === "telegraph") img.setTint(0xfff2b0);
      else img.clearTint();
    }
    this.projG.clear();
    for (const pr of this.world.projectiles) {
      this.projG.fillStyle(pr.kind === "chalk" ? 0xf6f2e8 : 0x4f86c6, 1);
      this.projG.fillCircle(fromSubs(pr.x), fromSubs(pr.y) - 4, pr.kind === "chalk" ? 3 : 4);
      this.projG.lineStyle(1, 0x243048, 0.6).strokeCircle(fromSubs(pr.x), fromSubs(pr.y) - 4, pr.kind === "chalk" ? 3 : 4);
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
      swingLean: this.player.swing
        ? Math.max(-1, Math.min(1, (fromSubs(this.player.swing.anchorX) - fromSubs(this.player.x)) / 48)) * this.player.facing
        : 0,
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
    apply("hair", pose.hair.dx, pose.hair.dy, pose.hair.rot, pose.hair.hidden === true);
    apply("handF", pose.handF.dx, pose.handF.dy, pose.handF.rot, pose.handF.hidden === true);
    apply("handB", pose.handB.dx, pose.handB.dy, pose.handB.rot, pose.handB.hidden === true);
    apply("footF", pose.footF.dx, pose.footF.dy, pose.footF.rot, false);
    apply("footB", pose.footB.dx, pose.footB.dy, pose.footB.rot, false);
    apply("rotor", pose.rotor.dx, pose.rotor.dy, pose.rotor.rot, pose.rotor.hidden === true, pose.rotor.frame);

    this.parts.get("head")?.setTexture(this.tex(faceFor(this.player.pose, this.tickCount, false)));
    this.parts.get("body")?.setTexture(this.tex(bodyStemFor(this.player.pose)));
    const hands = handStemsFor(this.player.pose);
    this.parts.get("handF")?.setTexture(this.tex(hands.front));
    this.parts.get("handB")?.setTexture(this.tex(hands.back));
    const shoe = this.tex(shoeStemFor(this.player.pose));
    this.parts.get("footF")?.setTexture(shoe);
    this.parts.get("footB")?.setTexture(shoe);
    this.parts.get("hair")?.setTexture(this.tex(hairStemFor(this.player.pose, this.player.vx)));

    if (this.fist) {
      this.fistImg.setVisible(true).setPosition(fromSubs(this.fist.x), fromSubs(this.fist.y)).setFlipX(this.fist.dir < 0);
    } else {
      this.fistImg.setVisible(false);
    }

    // R7: the rope — without it the pendulum's arc extreme reads as floating
    this.ropeG.clear();
    if (this.player.swing) {
      const ax = fromSubs(this.player.swing.anchorX);
      const ay = fromSubs(this.player.swing.anchorY);
      const hx = fromSubs(this.player.x);
      const hy = fromSubs(this.player.y) - 29;
      this.ropeG.lineStyle(1.6, 0x243048, 0.9).lineBetween(ax, ay, hx, hy);
      this.ropeG.fillStyle(0x243048).fillCircle(ax, ay, 2.2);
    }

    this.renderEntities();

    for (const ring of this.ringImgs) {
      ring.img.y = ring.baseY + (this.cfg.reducedMotion ? 0 : Math.sin(this.tickCount / 22) * 1.5);
    }

    // the camera brain now ticks inside the Sim (deterministic — the screen
    // clamp is gameplay); the render just points the view at it
    this.cameras.main.centerOn(fromSubs(this.camX) + LOGICAL_W / 2, fromSubs(this.camY) + LOGICAL_H / 2);
  }

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

    // entity fallbacks: readable painted blobs until Batch AB lands (only-present law)
    const ENT_COLORS: Record<string, number> = {
      pencil: 0xd9a441, pen: 0x3b5ea8, paintbox: 0xb2543a, heft: 0x7a9e6b,
      eraser: 0x6fa8dc, ranzen: 0x8a5a3b, moths: 0xe8c34a, satchel: 0x9a7148,
      pencilcase: 0xc4657a, fibel: 0x4f7d4f, klecksdoor: 0x243048, door: 0x8a6140,
      satchelswing: 0xa8794f, ruler: 0xc9a36a, tafel: 0x3d4f3d, generic: 0x888888,
    };
    for (const [skin, color] of Object.entries(ENT_COLORS)) {
      make(`fb-ent-${skin}`, () => {
        const wpx = skin === "tafel" ? 44 : skin === "ruler" || skin === "satchelswing" ? 40 : 22;
        const hpx = skin === "tafel" ? 40 : skin === "ruler" || skin === "satchelswing" ? 8 : 24;
        g.fillStyle(color, 1);
        g.fillRoundedRect(2, 2, wpx - 4, hpx - 4, 4);
        g.lineStyle(2, 0x243048, 0.9);
        g.strokeRoundedRect(2, 2, wpx - 4, hpx - 4, 4);
        if (hpx > 12) { g.fillStyle(0x243048, 1); g.fillCircle(wpx * 0.35, hpx * 0.35, 1.6); g.fillCircle(wpx * 0.62, hpx * 0.35, 1.6); }
      }, skin === "tafel" ? 44 : skin === "ruler" || skin === "satchelswing" ? 40 : 22, skin === "tafel" ? 40 : skin === "ruler" || skin === "satchelswing" ? 8 : 24);
    }
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

    // a parallax plate must span viewport + (scroll range × its lag) or its
    // edge shows as a seam; +10% margin
    const plateCover = (img: Phaser.GameObjects.Image, sfX: number, sfY: number): void => {
      const needW = LOGICAL_W + Math.max(0, this.worldWpx - LOGICAL_W) * (1 - sfX);
      const needH = LOGICAL_H + Math.max(0, this.worldHpx - LOGICAL_H) * (1 - sfY);
      img.setScale(Math.max((needW * 1.1) / img.width, (needH * 1.1) / img.height));
    };
    const farStem = this.phase.plates.far && this.textures.exists(`pb-${this.phase.plates.far}`) ? `pb-${this.phase.plates.far}` : "pb-plate_far";
    if (this.textures.exists(farStem)) {
      const far = this.add.image(this.worldWpx / 2, this.worldHpx / 2 - 8, farStem).setDepth(-11).setScrollFactor(0.12, 0.06);
      plateCover(far, 0.12, 0.06);
    }
    if (this.textures.exists("pb-plate_sky")) {
      const sky = this.add.image(this.worldWpx / 2, this.worldHpx / 2 - 30, "pb-plate_sky").setDepth(-11.5).setScrollFactor(0.05, 0.02);
      plateCover(sky, 0.05, 0.02);
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
    if (this.textures.exists("pb-plate_near_loop")) {
      const src = this.textures.get("pb-plate_near_loop").getSourceImage() as HTMLImageElement;
      const dh = 62;
      const near = this.add
        .tileSprite(-LOGICAL_W, this.worldHpx - dh - 22, this.worldWpx + LOGICAL_W * 2, dh, "pb-plate_near_loop")
        .setOrigin(0, 0)
        .setDepth(0)
        .setAlpha(0.95)
        .setScrollFactor(0.8, 0.97);
      near.setTileScale(dh / src.height);
    }
  }

  private buildTerrain(): void {
    const fill = this.add.graphics().setDepth(1);
    const h = this.grid.length;
    const w = this.grid[0]?.length ?? 0;
    const CANOPY = 0x2e4d33;
    for (let r = 0; r < h; r++) {
      for (let c = 0; c < w; c++) {
        const g = glyphAt(this.grid, c, r);
        const isCanopy = isSolid(g) && r <= 1; // the closed top (W0-F7)
        if (isCanopy) {
          fill.fillStyle(CANOPY);
          fill.fillRect(c * TILE, r * TILE, TILE, TILE);
          if (!isSolid(glyphAt(this.grid, c, r + 1)) && !this.textures.exists("pb-canopy_fringe_loop")) {
            fill.fillCircle(c * TILE + 4, (r + 1) * TILE, 4); // fallback fringe
            fill.fillCircle(c * TILE + 11, (r + 1) * TILE + 2, 5);
          }
        } else if (isSolid(g)) {
          fill.fillStyle(g === "~" ? ICE : isSolid(glyphAt(this.grid, c, r - 1)) ? EARTH_DARK : EARTH);
          fill.fillRect(c * TILE, r * TILE, TILE, TILE);
        } else if (g === "=") {
          if (!this.textures.exists("pb-plank_loop")) {
            fill.fillStyle(0xc9a36a);
            fill.fillRoundedRect(c * TILE, r * TILE + 1, TILE, 5, 2);
          }
        } else if (g === "^") {
          if (!this.textures.exists("pb-spikes_nibs_loop")) {
            fill.fillStyle(INK);
            fill.fillTriangle(c * TILE + 1, (r + 1) * TILE, c * TILE + 8, r * TILE + 4, c * TILE + 15, (r + 1) * TILE);
          }
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
          // AA2: the painted bank wedge sits over the fill (30° pairs draw
          // once at their first tile, spanning both)
          const slopeStem = g === "/" ? "slope45_up" : g === "\\" ? "slope45_down" : g === "1" ? "slope30_up" : g === "3" ? "slope30_down" : null;
          if (slopeStem !== null && this.textures.exists(`pb-${slopeStem}`)) {
            const wpx = g === "1" || g === "3" ? TILE * 2 : TILE;
            this.add.image(x, y - 2, `pb-${slopeStem}`).setOrigin(0, 0).setDisplaySize(wpx, TILE + 2).setDepth(2);
          }
        }
      }
    }

    // AA2 run-based dressing: canopy fringe, planks, spikes, pool, pit soil
    const runs = (pred: (c: number, r: number) => boolean, draw: (c0: number, c1: number, r: number) => void): void => {
      for (let r = 0; r < h; r++) {
        let c = 0;
        while (c < w) {
          if (!pred(c, r)) { c++; continue; }
          let c1 = c;
          while (c1 + 1 < w && pred(c1 + 1, r)) c1++;
          draw(c, c1, r);
          c = c1 + 1;
        }
      }
    };
    const srcH = (stem: string): number => (this.textures.get(`pb-${stem}`).getSourceImage() as HTMLImageElement).height;
    if (this.textures.exists("pb-canopy_fringe_loop")) {
      const dh = 26;
      const ts = dh / srcH("canopy_fringe_loop");
      runs(
        (c, r) => r <= 1 && isSolid(glyphAt(this.grid, c, r)) && !isSolid(glyphAt(this.grid, c, r + 1)),
        (c0, c1, r) => { this.add.tileSprite(c0 * TILE, (r + 1) * TILE - 4, (c1 - c0 + 1) * TILE, dh, "pb-canopy_fringe_loop").setOrigin(0, 0).setDepth(2).setTileScale(ts); },
      );
    }
    if (this.textures.exists("pb-plank_loop")) {
      const dh = 9;
      const ts = dh / srcH("plank_loop");
      runs(
        (c, r) => glyphAt(this.grid, c, r) === "=",
        (c0, c1, r) => {
          this.add.tileSprite(c0 * TILE, r * TILE - 2, (c1 - c0 + 1) * TILE, dh, "pb-plank_loop").setOrigin(0, 0).setDepth(2).setTileScale(ts);
          if (this.textures.exists("pb-plank_cap_l")) this.add.image(c0 * TILE + 1, r * TILE - 2, "pb-plank_cap_l").setOrigin(1, 0).setScale(ts).setDepth(2);
          if (this.textures.exists("pb-plank_cap_r")) this.add.image((c1 + 1) * TILE - 1, r * TILE - 2, "pb-plank_cap_r").setOrigin(0, 0).setScale(ts).setDepth(2);
        },
      );
    }
    if (this.textures.exists("pb-spikes_nibs_loop")) {
      const dh = 15;
      const ts = dh / srcH("spikes_nibs_loop");
      runs(
        (c, r) => glyphAt(this.grid, c, r) === "^",
        (c0, c1, r) => { this.add.tileSprite(c0 * TILE, (r + 1) * TILE - dh, (c1 - c0 + 1) * TILE, dh, "pb-spikes_nibs_loop").setOrigin(0, 0).setDepth(3).setTileScale(ts); },
      );
    }
    if (this.textures.exists("pb-pool_ink_loop")) {
      const dh = 16;
      const ts = dh / srcH("pool_ink_loop");
      runs(
        (c, r) => glyphAt(this.grid, c, r) === "w" && glyphAt(this.grid, c, r - 1) !== "w",
        (c0, c1, r) => { this.add.tileSprite(c0 * TILE, r * TILE, (c1 - c0 + 1) * TILE, dh, "pb-pool_ink_loop").setOrigin(0, 0).setDepth(3).setTileScale(ts); },
      );
    }
    if (this.textures.exists("pb-pit_inner_tile")) {
      const scale = 0.055; // ~56px world pattern from the 1024 source
      runs(
        (c, r) => r > 1 && isSolid(glyphAt(this.grid, c, r)) && isSolid(glyphAt(this.grid, c, r - 1)) && glyphAt(this.grid, c, r) !== "~",
        (c0, c1, r) => {
          const t = this.add.tileSprite(c0 * TILE, r * TILE, (c1 - c0 + 1) * TILE, TILE, "pb-pit_inner_tile").setOrigin(0, 0).setDepth(1).setTileScale(scale);
          t.tilePositionX = (c0 * TILE) / scale;
          t.tilePositionY = (r * TILE) / scale;
        },
      );
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
            if (r <= 2) return false; // canopy rows carry fringe, never ground strips
            const g = glyphAt(this.grid, cc, r);
            if (!isSolid(g) || g === "~") return false;
            // R6: a lip under a near ceiling reads as a double strip — suppress
            for (let k = 1; k <= 3; k++) if (isSolid(glyphAt(this.grid, cc, r - k))) return false;
            return !isSlope(glyphAt(this.grid, cc, r - 1));
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
    if (this.textures.exists("pb-strip_ice_loop")) {
      const src = this.textures.get("pb-strip_ice_loop").getSourceImage() as HTMLImageElement;
      const dispH = 30;
      const ts = dispH / src.height;
      for (let r = 3; r < h; r++) {
        let c = 0;
        const icy = (cc: number): boolean => glyphAt(this.grid, cc, r) === "~" && !isSolid(glyphAt(this.grid, cc, r - 1));
        while (c < w) {
          if (!icy(c)) { c++; continue; }
          let c1 = c;
          while (c1 + 1 < w && icy(c1 + 1)) c1++;
          this.add.tileSprite(c * TILE, r * TILE - 7, (c1 - c + 1) * TILE, dispH, "pb-strip_ice_loop").setOrigin(0, 0).setDepth(2).setTileScale(ts);
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
          this.ringImgs.push({ img, baseY: cy }); // positions live in the Sim
        } else if (g === "*") {
          const img = this.add.image(cx, cy, this.tex("prop_letter")).setDepth(4);
          img.setScale(10 / img.height);
          this.letterImgs.set(`${c},${r}`, img); // count lives in the Sim
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
          if (this.textures.exists("pb-checkpoint_easel")) {
            const img = this.add.image(cx, (r + 1) * TILE, "pb-checkpoint_easel").setOrigin(0.5, 1).setDepth(3);
            img.setScale(24 / img.height);
          } else {
            const flag = this.add.graphics().setDepth(3);
            flag.fillStyle(0x8a6140).fillRect(cx - 1, cy - 10, 2, 26);
            flag.fillStyle(0xf0c040).fillTriangle(cx + 1, cy - 10, cx + 12, cy - 6, cx + 1, cy - 2);
          }
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
        : name.startsWith("hand") ? "hand_fist"
        : "shoe_neutral";
      // dossier: sprite-scale hands are ~half a head — 0.62× part scale
      const partScale = name.startsWith("hand") ? RIG_SRC_SCALE * 0.62 : RIG_SRC_SCALE;
      const img = this.add.image(0, 0, this.tex(stem)).setScale(partScale);
      if (name === "handB") img.setFlipX(true).setTint(0xd9cfc2); // the far hand sits a step darker — it welds to the body's light

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
