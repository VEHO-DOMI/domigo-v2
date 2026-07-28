// THE PAINTED BOOK — the phase scene: a THIN renderer over the pure brains.
// One instance renders ONE phase. All simulation runs on the fixed 60Hz
// accumulator (never wall-clock); the rig compositor applies rig.ts poses to
// the sliced parts. P-49 LAW: this scene NEVER starts/stops scenes — phase
// handoffs go through the React shell's handoff() (PaintGame.tsx).
//
// PB-C1 · COMPOSITION (doc 36). The backdrop is no longer one painting behind
// the play space and terrain is no longer strips-over-fill: a phase with a
// composition manifest renders FIVE PLANES (layers.ts) over a CARVED MASS
// (mass.ts), both planned by pure functions this scene merely places. A phase
// with no manifest — or whose kit art has not landed — renders exactly as it
// did before (the fallback law), so nothing breaks while art is pending.

import Phaser from "phaser";
import { glyphAt, isSlope, isSolid } from "./collide.ts";
import { type CompositionSpec, type MassKit, compositionFor } from "./composition.ts";
import { type LayerPiece, coverFit, planLayers } from "./layers.ts";
import { type MassPiece, planMass } from "./mass.ts";
import { LETTER_STYLE, letterGlyphs } from "./letters.ts";
import { type PaintLevel, type PhaseSpec } from "./level.ts";
import { type AirModel, LOGICAL_H, LOGICAL_W, MAX_TICKS_PER_FRAME, RENDER_SCALE, SUBS, TICK_MS, TILE, fromSubs } from "./paint.ts";
import { type FistState } from "./fist.ts";
import { type Pad, type PlayerState } from "./player.ts";
import { type EntityWorld } from "./entities.ts";
import { Sim, type SimEvent, type TaskRequest } from "./sim.ts";
import { type EntPoseInput, entPoseCell } from "./anim.ts";
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
  onGuardianDown: (id: string, skin: string) => void;
  /** PB-F3 · F2-8: the first cage the fist can open, once per phase. */
  onCageHint: () => void;
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
  /** PB-R1 · R3-1: chapter state again — has the fist hint already been taught?
   *  The sim must not freeze the world for a card the shell will not open. */
  cageHintShown?: () => boolean;
  /** PB-F2 jump-feel candidate (dev only; undefined = the shipped model). */
  airModel?: AirModel;
}

// ── R3-12 · THE GUARDIAN'S WRITING SURFACE (doc 41 §4) ───────────────────────
// Each guardian SKIN declares where on its body chalk appears, in world px
// relative to the sprite's feet (its origin is bottom-centre). A skin with no
// entry has no board, and its cards simply open without a writing beat — the
// only-present law again, so a new guardian can never render text into thin air.
// Measured against the shipped sprite at its 52 px display height in the live
// arena: the writing face is ~26 world px across, centred 33 px above the feet.
// The wrap width sits just inside that so a six-letter word („window") stays on
// the slate instead of hanging over its wooden frame.
export const GUARDIAN_BOARDS: Record<string, { dy: number; w: number; h: number }> = {
  tafel: { dy: -33, w: 24, h: 22 },
};
/** How long the guardian spends writing before its card opens (doc 41 §4 asks
 *  for a 30–45 t readability telegraph). */
export const EVIDENCE_BEAT_TICKS = 36;

/** Display heights in world px for the duel's two newly-wired sheets (R3-4). */
const CHALK_DISPLAY_H = 9;
const HAND_DISPLAY_H = 18;
const HAND_OFFSET_X = 15;
const HAND_OFFSET_Y = 30;

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
  /** R3-4: pooled chalk sprites (one per live projectile, reused per frame). */
  private projImgs: Phaser.GameObjects.Image[] = [];
  /** R3-4: the guardian's throwing hand, shown only during its windup. */
  private handImg!: Phaser.GameObjects.Image;
  /** R3-12: chalk on the guardian's own board — the card's evidence. */
  private evidenceText: Phaser.GameObjects.Text | null = null;
  private evidenceOwner: string | null = null;
  private evidenceFull = "";
  private evidenceTick = 0;
  private acc = 0;

  private parts = new Map<RigPartName, Phaser.GameObjects.Image>();
  private rigRoot!: Phaser.GameObjects.Container;
  private fistImg!: Phaser.GameObjects.Image;
  private ropeG!: Phaser.GameObjects.Graphics;
  private letterImgs = new Map<string, Phaser.GameObjects.Image>();
  /** PB-F3: checkpoint art by column, so the ACTIVE one can light up. */
  private checkpointImgs = new Map<string, Phaser.GameObjects.Image>();
  private ringImgs: Array<{ img: Phaser.GameObjects.Image; baseY: number }> = [];
  private keys!: Record<string, Phaser.Input.Keyboard.Key>;
  /** PB-C1: this phase's art direction, or null ⇒ the pre-C1 render path. */
  private comp: CompositionSpec | null;

  constructor(cfg: PaintSceneCfg) {
    super({ key: "paint" });
    this.cfg = cfg;
    this.comp = compositionFor(cfg.level.chapter, cfg.phaseId);
    this.sim = new Sim({
      level: cfg.level,
      phaseId: cfg.phaseId,
      grantedAbilities: cfg.grantedAbilities,
      freedCageIds: cfg.freedCageIds,
      cageHintShown: cfg.cageHintShown,
      airModel: cfg.airModel,
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
    // R3-4: the guardian's throwing hand — built once, shown only on the windup
    this.handImg = this.add.image(0, 0, "fb-ent-generic").setDepth(9).setOrigin(0.5, 0.5).setVisible(false);

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
    onSlide: boolean;
    phase: string; letters: number; hovering: boolean; overlay: boolean;
    knots: number; guardianDown: boolean; bonusLeft: number;
    camX: number;
    entities: Array<{ id: string; role: string; skin: string; state: string; redeemed: boolean; x: number; y: number }>;
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
      onSlide: this.player.onSlide, // D1 spike visibility
      phase: this.cfg.phaseId,
      letters: this.lettersGot,
      hovering: this.player.hovering,
      overlay: this.overlayOpen,
      knots: this.world?.guardianKnots ?? -1,
      guardianDown: this.guardianDefeated,
      bonusLeft: this.bonusLeftTicks,
      camX: fromSubs(this.camX),
      entities: (this.world?.entities ?? []).map((e) => ({ id: e.id, role: e.role, skin: e.skin, state: e.state, redeemed: e.redeemed, x: fromSubs(e.x), y: fromSubs(e.y) })),
      projectiles: (this.world?.projectiles ?? []).map((p) => ({ kind: p.kind, x: fromSubs(p.x), y: fromSubs(p.y), deflected: p.deflected })),
    };
  }

  warp(c: number, r: number): void {
    this.sim.warp(c, r);
  }

  /** Where a being sits across the view, 0 (left edge) … 1 (right edge), or
   *  null if it is not in this phase. PB-F1/F2-20: the task card docks to the
   *  OPPOSITE side, so a card that says „schau sie an" never covers her. */
  screenFracOf(id: string): number | null {
    const e = this.world?.entities.find((x) => x.id === id);
    if (!e) return null;
    return (fromSubs(e.x) - fromSubs(this.camX)) / LOGICAL_W;
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
        case "guardianDown": cb.onGuardianDown(ev.id, ev.skin); break;
        case "cageHint": cb.onCageHint(); break;
        case "letters": cb.onLetters(ev.got, ev.total); break;
        case "letterTaken": {
          const img = this.letterImgs.get(`${ev.c},${ev.r}`);
          img?.destroy();
          this.letterImgs.delete(`${ev.c},${ev.r}`);
          break;
        }
        case "puff": this.puff(fromSubs(ev.x), fromSubs(ev.y), ev.kind); break;
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

  /** doc 40 §4 · how many painted idle cells a skin actually owns. Counted from
   *  the loaded textures (the only-present law), memoised per skin, so a sheet
   *  that later gains `_c/_d` enriches the idle with no code change — and one
   *  that never does keeps exactly today's two-cell cadence. */
  private idleFrameCache = new Map<string, number>();
  private idleFramesOf(skin: string): number {
    const hit = this.idleFrameCache.get(skin);
    if (hit !== undefined) return hit;
    let n = 1;
    for (const c of ["b", "c", "d"]) {
      if (!this.textures.exists(`pb-${skin}_${c}`)) break;
      n++;
    }
    const frames = Math.max(n, 1);
    this.idleFrameCache.set(skin, frames);
    return frames;
  }

  /** W4: delegated to the pure hook in anim.ts (unit-tested there). */
  private entStateCell(e: EntPoseInput): string {
    return entPoseCell(e);
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
      img.setTexture(this.entTex(e.skin, this.entStateCell({ ...e, idleFrames: this.idleFramesOf(e.skin) })));
      const targetH = this.entTargetH(e);
      const frameH = img.frame.height || 1;
      if (e.role.startsWith("platform")) img.setDisplaySize(40, targetH);
      else img.setScale(targetH / frameH);
      img.setFlipX(e.dir > 0);
      // THE TRANSPARENCY GRAMMAR (PB-F2, Fable's PK-F1 review ruling 3):
      // SOLID = you can act on this now · TRANSPARENT = not yet. A cage whose
      // opening verb has not been granted is a promise, not a puzzle — it is
      // drawn ghosted so „it only rattles" reads as intended rather than as a
      // broken pickup. It solidifies the moment the fist is yours.
      const ghosted = e.role === "cage" && !e.redeemed && !this.cfg.grantedAbilities().includes("punch");
      if (ghosted) img.setAlpha(0.45);
      else if (e.redeemed && !e.role.startsWith("platform")) img.setAlpha(0.85);
      else img.setAlpha(1);
      if (e.state === "telegraph") img.setTint(0xfff2b0);
      else img.clearTint();
    }
    // R3-4 · THE PROJECTILE IS CHALK, not a white ball. `tafel_chalk` was
    // painted and drawn by nothing (doc 38 §2) while the duel threw a circle;
    // it now flies as the stick it is, tumbling so the arc reads.
    this.projG.clear();
    let used = 0;
    for (const pr of this.world.projectiles) {
      const thrower = this.world.entities.find((e) => e.id === pr.fromId);
      const key = thrower ? `pb-${thrower.skin}_chalk` : "";
      if (pr.kind === "chalk" && key !== "" && this.textures.exists(key)) {
        let img = this.projImgs[used];
        if (!img) {
          img = this.add.image(0, 0, key).setDepth(8).setOrigin(0.5, 0.5);
          this.projImgs[used] = img;
        }
        used++;
        img.setVisible(true).setTexture(key).setPosition(fromSubs(pr.x), fromSubs(pr.y) - 4);
        img.setScale(CHALK_DISPLAY_H / (img.frame.height || 1));
        img.setRotation(this.cfg.reducedMotion ? 0 : (pr.deflected ? -1 : 1) * pr.age * 0.14);
        continue;
      }
      // the ink blob keeps its dot (no painted sheet — the only-present law)
      this.projG.fillStyle(pr.kind === "chalk" ? 0xf6f2e8 : 0x4f86c6, 1);
      this.projG.fillCircle(fromSubs(pr.x), fromSubs(pr.y) - 4, pr.kind === "chalk" ? 3 : 4);
      this.projG.lineStyle(1, 0x243048, 0.6).strokeCircle(fromSubs(pr.x), fromSubs(pr.y) - 4, pr.kind === "chalk" ? 3 : 4);
    }
    for (let i = used; i < this.projImgs.length; i++) this.projImgs[i]?.setVisible(false);

    // R3-4 · the WINDUP shows the hand that throws (`tafel_hand`, also painted
    // and never shown). It appears only while the guardian is telegraphing, on
    // the side it is facing — so the tell and the aim are the same picture.
    const winding = this.world.entities.find((e) => e.role === "guardian" && e.state === "telegraph" && !e.redeemed);
    const handKey = winding ? `pb-${winding.skin}_hand` : "";
    if (winding && handKey !== "" && this.textures.exists(handKey)) {
      this.handImg.setVisible(true).setTexture(handKey);
      this.handImg.setPosition(fromSubs(winding.x) + winding.dir * HAND_OFFSET_X, fromSubs(winding.y) - HAND_OFFSET_Y);
      this.handImg.setScale(HAND_DISPLAY_H / (this.handImg.frame.height || 1));
      this.handImg.setFlipX(winding.dir > 0);
    } else {
      this.handImg.setVisible(false);
    }
  }

  // ── R3-12 · the boss-evidence beat (doc 41 §4) ────────────────────────────
  /**
   * Write a card's evidence onto the guardian's own board, and report how long
   * (ms) the card must wait before opening. Returns 0 when this skin declares no
   * writing surface, in which case the card opens at once — a guardian without a
   * board is a design choice, never a silent blank.
   */
  writeEvidence(entityId: string, lines: readonly string[]): number {
    const e = this.world?.entities.find((x) => x.id === entityId);
    const board = e ? GUARDIAN_BOARDS[e.skin] : undefined;
    if (!e || !board) return 0;
    this.clearEvidence();
    this.evidenceOwner = entityId;
    this.evidenceFull = lines.join("  ");
    this.evidenceTick = 0;
    this.evidenceText = this.add
      .text(fromSubs(e.x), fromSubs(e.y) + board.dy, "", {
        fontFamily: "system-ui, sans-serif",
        fontSize: "6px",
        color: "#f6f2e8", // chalk on slate
        align: "center",
        wordWrap: { width: board.w },
      })
      .setOrigin(0.5, 0.5)
      .setDepth(8)
      .setResolution(RENDER_SCALE * 2);
    return EVIDENCE_BEAT_TICKS * TICK_MS;
  }

  /** The board wipes itself once its card is answered or put down. */
  clearEvidence(): void {
    this.evidenceText?.destroy();
    this.evidenceText = null;
    this.evidenceOwner = null;
    this.evidenceFull = "";
    this.evidenceTick = 0;
  }

  /** The chalk appears as it is WRITTEN — that stroke-by-stroke beat is the
   *  readability telegraph the card waits for. Driven from render, not the sim
   *  clock, because the world is deliberately frozen while a card is pending. */
  private renderEvidence(): void {
    const t = this.evidenceText;
    if (!t || this.evidenceOwner === null) return;
    const e = this.world?.entities.find((x) => x.id === this.evidenceOwner);
    const board = e ? GUARDIAN_BOARDS[e.skin] : undefined;
    if (!e || !board) return;
    t.setPosition(fromSubs(e.x), fromSubs(e.y) + board.dy);
    this.evidenceTick++;
    const shown = this.cfg.reducedMotion
      ? this.evidenceFull.length
      : Math.ceil((this.evidenceFull.length * Math.min(this.evidenceTick, EVIDENCE_BEAT_TICKS)) / EVIDENCE_BEAT_TICKS);
    t.setText(this.evidenceFull.slice(0, shown));
  }

  /** R3-4/R3-6 · a puff of chalk dust at an impact. Pure decoration with a
   *  lifetime — under reduced motion it still appears, it just does not drift. */
  private puff(xPx: number, yPx: number, kind: "chalk" | "hit"): void {
    const colour = kind === "chalk" ? 0xf6f2e8 : 0xe8dcc0;
    for (let i = 0; i < 5; i++) {
      const g = this.add.circle(xPx, yPx - 4, 1.6 + (i % 3) * 0.5, colour, 0.9).setDepth(9);
      const dx = (i - 2) * 3.5;
      const dy = -3 - (i % 2) * 3;
      if (this.cfg.reducedMotion) {
        this.time.delayedCall(220, () => g.destroy());
      } else {
        this.tweens.add({ targets: g, x: xPx + dx, y: yPx - 4 + dy, alpha: 0, scale: 0.4, duration: 260, onComplete: () => g.destroy() });
      }
    }
  }

  // ── rendering ──────────────────────────────────────────────────────────────

  private render(): void {
    this.renderReadability();
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
    this.renderEvidence();

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

  /** Source pixel size of a stem, or null when the texture never loaded. */
  private srcSize(stem: string): { w: number; h: number } | null {
    const key = `pb-${stem}`;
    if (!this.textures.exists(key)) return null;
    const src = this.textures.get(key).getSourceImage() as HTMLImageElement;
    return src.width > 0 && src.height > 0 ? { w: src.width, h: src.height } : null;
  }

  /** Place one planned plane piece (doc 36 §1). */
  private placeLayerPiece(p: LayerPiece): void {
    const pY = p.parallaxY;
    if (p.kind === "wash") {
      // L0 AIR: the room's light, engine-drawn — 2–3 stops top→bottom
      const cols = p.colors ?? [0xffffff, 0xffffff];
      const a = cols[0] ?? 0xffffff;
      const b = cols[1] ?? a;
      const c = cols[2] ?? b;
      const g = this.add.graphics().setDepth(p.depth).setScrollFactor(p.parallax, pY);
      const half = p.h / 2;
      g.fillGradientStyle(a, a, b, b, 1);
      g.fillRect(p.x, p.y, p.w, half);
      g.fillGradientStyle(b, b, c, c, 1);
      g.fillRect(p.x, p.y + half, p.w, p.h - half);
      return;
    }
    const stem = p.stem;
    if (stem === undefined) return;
    const key = `pb-${stem}`;
    if (!this.textures.exists(key)) return; // only-present law
    if (p.kind === "loop") {
      const src = this.textures.get(key).getSourceImage() as HTMLImageElement;
      const t = this.add.tileSprite(p.x, p.y, p.w, p.h, key).setOrigin(0, 0).setDepth(p.depth).setScrollFactor(p.parallax, pY);
      t.setTileScale(p.h / src.height);
      if (p.alpha !== undefined) t.setAlpha(p.alpha);
      if (p.tint !== undefined) t.setTint(p.tint);
      return;
    }
    const img = this.add.image(p.x, p.y, key).setOrigin(0, 0).setDepth(p.depth).setScrollFactor(p.parallax, pY);
    img.setDisplaySize(p.w, p.h);
    if (p.alpha !== undefined) img.setAlpha(p.alpha);
    if (p.tint !== undefined) img.setTint(p.tint);
  }

  private buildBackdrop(): void {
    if (this.comp !== null) {
      for (const piece of planLayers(this.comp, this.worldWpx, this.worldHpx, (s) => this.srcSize(s))) {
        this.placeLayerPiece(piece);
      }
      return;
    }
    this.buildBackdropLegacy();
  }

  /** The pre-C1 backdrop: one far plate + two fixed bands. Kept as the
   *  fallback for any phase without a composition manifest. */
  private buildBackdropLegacy(): void {
    const skyG = this.add.graphics().setScrollFactor(0).setDepth(-12);
    skyG.fillGradientStyle(0xf9edd2, 0xf9edd2, 0xf3ddb0, 0xf3ddb0, 1);
    skyG.fillRect(-LOGICAL_W, -LOGICAL_H, LOGICAL_W * 3, LOGICAL_H * 3);

    // THE COVER LAW (doc 36 §3, PB-C1): a full-bleed piece is scaled to cover
    // the camera's TRAVEL BOX and anchored on the world floor. The pre-C1
    // version used (1 − parallax) and centred the image on the world, so on a
    // short level its left edge drifted right of the camera and the page
    // showed through — Build-D's F-6 (the p4 cream void). Fixed here too, so
    // the fallback path obeys the same law as the compositor.
    const plateCover = (img: Phaser.GameObjects.Image, sfX: number, sfY: number): void => {
      const box = coverFit({ w: img.width, h: img.height }, this.worldWpx, this.worldHpx, sfX, sfY);
      img.setOrigin(0, 0).setPosition(box.x, box.y).setDisplaySize(box.w, box.h);
    };
    const farStem = this.phase.plates.far && this.textures.exists(`pb-${this.phase.plates.far}`) ? `pb-${this.phase.plates.far}` : "pb-plate_far";
    if (this.textures.exists(farStem)) {
      const far = this.add.image(0, 0, farStem).setDepth(-11).setScrollFactor(0.12, 0.06);
      plateCover(far, 0.12, 0.06);
    }
    if (this.textures.exists("pb-plate_sky")) {
      const sky = this.add.image(0, 0, "pb-plate_sky").setDepth(-11.5).setScrollFactor(0.05, 0.02);
      plateCover(sky, 0.05, 0.02);
    }
    // W2: per-phase parallax bands — the phase names its own mid/near band
    // (grids-v2 sets plates.mid per phase); the fixed stems stay the fallback,
    // so a phase that names nothing renders exactly as before.
    const bandStem = (named: string | undefined, fixed: string): string | null => {
      if (named && this.textures.exists(`pb-${named}`)) return `pb-${named}`;
      return this.textures.exists(`pb-${fixed}`) ? `pb-${fixed}` : null;
    };
    const midStem = bandStem(this.phase.plates.mid, "strip_mid_loop");
    if (midStem !== null) {
      const src = this.textures.get(midStem).getSourceImage() as HTMLImageElement;
      const dispH = 86; // sits at the horizon; the far plate + sky stay visible above
      const mid = this.add
        .tileSprite(0, this.worldHpx - dispH - 34, this.worldWpx + LOGICAL_W * 2, dispH, midStem)
        .setOrigin(0, 0)
        .setDepth(-9)
        .setScrollFactor(0.5, 0.9)
        .setAlpha(0.92);
      mid.setTileScale(dispH / src.height);
      mid.x = -LOGICAL_W;
    }
    const nearStem = bandStem(this.phase.plates.near, "plate_near_loop");
    if (nearStem !== null) {
      const src = this.textures.get(nearStem).getSourceImage() as HTMLImageElement;
      const dh = 62;
      const near = this.add
        .tileSprite(-LOGICAL_W, this.worldHpx - dh - 22, this.worldWpx + LOGICAL_W * 2, dh, nearStem)
        .setOrigin(0, 0)
        .setDepth(0)
        .setAlpha(0.95)
        .setScrollFactor(0.8, 0.97);
      near.setTileScale(dh / src.height);
    }
  }

  /** The phase's mass kit — but ONLY if its core art actually loaded. A kit
   *  whose crust/body/fade/sediment are missing would place empty textures, so
   *  it falls back to the pre-C1 strips-over-fill path instead. */
  private massKit(): MassKit | null {
    const kit = this.comp?.mass;
    if (kit === undefined) return null;
    const core = [kit.crust[0], kit.body[0], kit.fade, kit.sediment];
    for (const stem of core) {
      if (stem === undefined || !this.textures.exists(`pb-${stem}`)) return null;
    }
    return kit;
  }

  /** Place one planned mass piece (doc 36 §2). */
  private placeMassPiece(p: MassPiece): void {
    if (p.stem === null) return; // fallbackFill — the graphics pass drew it
    const key = `pb-${p.stem}`;
    if (!this.textures.exists(key)) return; // only-present law
    if (p.tile === true) {
      const src = this.textures.get(key).getSourceImage() as HTMLImageElement;
      const scale = p.h / src.height;
      const t = this.add.tileSprite(p.x, p.y, p.w, p.h, key).setOrigin(0, 0).setDepth(p.depth);
      t.setTileScale(scale);
      // anchor the pattern in WORLD space so neighbouring runs stay seamless
      t.tilePositionX = p.x / scale;
      t.tilePositionY = p.y / scale;
      return;
    }
    const img = this.add.image(p.x, p.y, key).setOrigin(p.originX ?? 0, p.originY ?? 0).setDepth(p.depth);
    img.setDisplaySize(p.w, p.h);
    if (p.rot !== undefined) img.setRotation(p.rot);
  }

  private buildTerrain(): void {
    const kit = this.massKit();
    const fill = this.add.graphics().setDepth(1);
    const h = this.grid.length;
    const w = this.grid[0]?.length ?? 0;
    const CANOPY = 0x2e4d33;
    for (let r = 0; r < h; r++) {
      for (let c = 0; c < w; c++) {
        const g = glyphAt(this.grid, c, r);
        // with a kit present the carved mass owns every solid and every slope;
        // the graphics pass keeps only the hazard/one-way fallbacks below
        const isCanopy = kit === null && isSolid(g) && r <= 1; // the closed top (W0-F7)
        if (kit !== null && (isSolid(g) || isSlope(g))) continue;
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
          // D1: `z` is the slippery slide — same 45°-down wedge as `\`
          else if (g === "\\" || g === "z") fill.fillTriangle(x, y, x, y + TILE, x + TILE, y + TILE);
          else if (g === "1") fill.fillTriangle(x, y + TILE, x + TILE, y + TILE, x + TILE, y + TILE / 2);
          else if (g === "2") { fill.fillTriangle(x, y + TILE, x + TILE, y + TILE, x + TILE, y); fill.fillRect(x, y + TILE / 2, TILE, TILE / 2); }
          else if (g === "3") { fill.fillTriangle(x, y, x, y + TILE, x + TILE, y + TILE); fill.fillRect(x, y + TILE / 2, TILE, TILE / 2); }
          else if (g === "4") fill.fillTriangle(x, y + TILE / 2, x, y + TILE, x + TILE, y + TILE);
          fill.lineStyle(2, GRASS);
          if (g === "/") fill.lineBetween(x, y + TILE, x + TILE, y);
          if (g === "\\" || g === "z") fill.lineBetween(x, y, x + TILE, y + TILE);
          // AA2: the painted bank wedge sits over the fill (30° pairs draw
          // once at their first tile, spanning both)
          const slopeStem = g === "/" ? "slope45_up" : g === "\\" || g === "z" ? "slope45_down" : g === "1" ? "slope30_up" : g === "3" ? "slope30_down" : null;
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
    // the interior fill + the surface strips are the RETIRED model — with a
    // kit present the carved mass draws body/fade/sediment and crust instead
    if (kit === null && this.textures.exists("pb-pit_inner_tile")) {
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
    if (kit === null && this.textures.exists("pb-strip_ground_loop")) {
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
        // A-6 (pre-C1): the `z` slide wore the same blackboard art as a flat
        // `~` run. With a kit the slide is its OWN object (mass.ts, doc 36 §2),
        // so `z` leaves this path entirely.
        const icy = (cc: number): boolean => {
          const g = glyphAt(this.grid, cc, r);
          return (g === "~" || (kit === null && g === "z")) && !isSolid(glyphAt(this.grid, cc, r - 1));
        };
        while (c < w) {
          if (!icy(c)) { c++; continue; }
          let c1 = c;
          while (c1 + 1 < w && icy(c1 + 1)) c1++;
          this.add.tileSprite(c * TILE, r * TILE - 7, (c1 - c + 1) * TILE, dispH, "pb-strip_ice_loop").setOrigin(0, 0).setDepth(2).setTileScale(ts);
          c = c1 + 1;
        }
      }
    }

    // ── the carved mass (doc 36 §2) — crust + caps + trims + corners + body
    // + fade + sediment, ramps, the slide, and complete platform objects ─────
    if (kit !== null) {
      for (const piece of planMass(this.grid, kit)) this.placeMassPiece(piece);
    }
  }

  /** World-px size of a drawn trail letter (matches the retired `prop_letter`). */
  private static readonly LETTER_PX = 14;

  /**
   * PB-C1 · a texture per CHARACTER, drawn in the painted stem's own key
   * (warm gold gradient, amber contour, soft shadow). `prop_letter` is a
   * painted capital A, so it can only ever spell A — it is retired from the
   * letter face and the engine draws the real glyph instead (doc 36 §3).
   */
  /** PB-F3 · THE READABILITY PASS (F2-6 · F2-8/16 · F2-31). Three things a
   *  six-year-old must be able to SEE, all drawn from state the sim already
   *  owns — no new art, no gameplay change:
   *  · the checkpoint you have actually reached is the LIT Krakel, the others
   *    are the waiting one, so „Krakel skizziert dich!" has a picture;
   *  · trail letters breathe and glint, because a static gold glyph on a warm
   *    wall reads as wallpaper (his „I felt I collected all", F2-31);
   *  · a cage you can open NOW rocks when you come close — the fist has a
   *    target, instead of scenery you walk past (F2-8/16). */
  private renderReadability(): void {
    const t = this.tickCount;
    // ── the active checkpoint ──
    const activeCol = this.sim.respawnCell?.c;
    if (this.checkpointImgs.size > 0 && this.textures.exists("pb-krakel_active")) {
      for (const [col, img] of this.checkpointImgs) {
        const lit = Number(col) === activeCol;
        const want = lit ? "pb-krakel_active" : "pb-krakel_a";
        if (img.texture.key !== want) {
          const h = img.displayHeight;
          img.setTexture(want);
          img.setScale(h / (img.frame.height || 1));
        }
        // the lit one breathes; the waiting ones sit still
        img.setAlpha(lit && !this.cfg.reducedMotion ? 0.92 + Math.sin(t / 14) * 0.08 : 1);
      }
    }
    // ── the letters ──
    if (!this.cfg.reducedMotion) {
      for (const [key, img] of this.letterImgs) {
        const parts = key.split(",");
        const phase = (Number(parts[0]) + Number(parts[1])) * 0.7; // per-letter offset
        const baseY = img.getData("baseY") as number | undefined;
        if (baseY === undefined) continue;
        img.y = baseY + Math.sin(t / 18 + phase) * 1.6;
        const glint = 0.9 + Math.abs(Math.sin(t / 26 + phase)) * 0.1;
        img.setScale((PaintScene.LETTER_PX / (img.frame.width || 1)) * glint);
      }
    }
    // ── the cages that can be opened NOW ──
    const canPunch = this.cfg.grantedAbilities().includes("punch");
    if (canPunch && !this.cfg.reducedMotion) {
      for (const e of this.world?.entities ?? []) {
        if (e.role !== "cage" || e.redeemed) continue;
        const img = this.entityImgs.get(e.id);
        if (!img) continue;
        const near = Math.abs(fromSubs(e.x) - fromSubs(this.player.x)) < 42 && Math.abs(fromSubs(e.y) - fromSubs(this.player.y)) < 40;
        img.setRotation(near ? Math.sin(t / 5) * 0.07 : 0);
      }
    }
  }

  private letterTex(char: string): string {
    const key = `pb-glyph-${char}`;
    if (this.textures.exists(key)) return key;
    const S = 128;
    const tex = this.textures.createCanvas(key, S, S);
    if (!tex) return this.tex("prop_letter"); // headless/canvas-less safety
    const ctx = tex.getContext();
    ctx.clearRect(0, 0, S, S);
    ctx.font = LETTER_STYLE.font;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.shadowColor = LETTER_STYLE.shadow;
    ctx.shadowBlur = 7;
    ctx.shadowOffsetY = 4;
    ctx.lineJoin = "round";
    ctx.lineWidth = LETTER_STYLE.strokeWidth * 2;
    ctx.strokeStyle = LETTER_STYLE.stroke;
    ctx.strokeText(char, S / 2, S / 2 + 3);
    ctx.shadowColor = "transparent";
    ctx.shadowBlur = 0;
    ctx.shadowOffsetY = 0;
    const grad = ctx.createLinearGradient(0, S * 0.18, 0, S * 0.86);
    grad.addColorStop(0, LETTER_STYLE.fill);
    grad.addColorStop(1, LETTER_STYLE.fillDeep);
    ctx.fillStyle = grad;
    ctx.fillText(char, S / 2, S / 2 + 3);
    tex.refresh();
    return key;
  }

  /**
   * The world-y a ground-standing prop rests on: the TOP of the first solid
   * cell at or below the marker, not the marker cell's own bottom edge.
   * PK-C2b: p3's second checkpoint is marked at row 18 with ground only at row
   * 22, so the easel hung three cells up in the air. Every other marker in
   * ch01 sits directly on its surface, so this is behaviour-neutral for them —
   * it just stops the class from recurring whenever a marker drifts.
   */
  private standLineBelow(c: number, r: number): number {
    for (let k = r + 1; k < this.grid.length; k++) {
      if (isSolid(glyphAt(this.grid, c, k))) return k * TILE;
    }
    return (r + 1) * TILE;
  }

  private buildProps(): void {
    const h = this.grid.length;
    const w = this.grid[0]?.length ?? 0;
    const glyphs = new Map(letterGlyphs(this.grid, this.comp?.words).map((g) => [`${g.c},${g.r}`, g.char]));
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
          const char = glyphs.get(`${c},${r}`) ?? "A";
          const img = this.add.image(cx, cy, this.letterTex(char)).setDepth(4);
          img.setDisplaySize(PaintScene.LETTER_PX, PaintScene.LETTER_PX);
          img.setData("baseY", cy); // PB-F3: the rest line its bob returns to
          this.letterImgs.set(`${c},${r}`, img); // count lives in the Sim
        } else if (g === "X" || g === "B") {
          const img = this.add.image(cx, this.standLineBelow(c, r), this.tex("prop_exit")).setOrigin(0.5, 1).setDepth(3);
          img.setScale(24 / img.height);
        } else if (g === "s") {
          const img = this.add.image(cx, this.standLineBelow(c, r), this.tex("prop_spring")).setOrigin(0.5, 1).setDepth(3);
          img.setScale(13 / img.height);
        } else if (g === "V") {
          const img = this.add.image(cx, cy, this.tex("prop_vine")).setDepth(3);
          img.setScale(TILE / img.height);
        } else if (g === "C") {
          // PB-F3 · F2-6: KRAKEL, not a nameless easel. `krakel_a` is the easel
          // WITH him standing beside it waving; `krakel_active` is the same
          // scene with his sketch lit warm gold. The game has always said
          // „Krakel skizziert dich!" — now the sentence has someone in it.
          const krakelStem = this.textures.exists("pb-krakel_a") ? "pb-krakel_a" : "pb-checkpoint_easel";
          if (this.textures.exists(krakelStem)) {
            const img = this.add.image(cx, this.standLineBelow(c, r), krakelStem).setOrigin(0.5, 1).setDepth(3);
            img.setScale(26 / img.height);
            this.checkpointImgs.set(`${c}`, img);
          } else if (this.textures.exists("pb-checkpoint_easel")) {
            const img = this.add.image(cx, this.standLineBelow(c, r), "pb-checkpoint_easel").setOrigin(0.5, 1).setDepth(3);
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
