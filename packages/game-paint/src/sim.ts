// THE PAINTED BOOK — sim.ts: the headless phase runner (PB-T2).
//
// EVERYTHING gameplay is here, pure and Phaser-free: player step, screen
// clamp, fist, entities, the ride contract, checkpoints, letters, doors,
// guardian, bonus clock, exit — and the per-tick camera follow (the screen
// clamp is gameplay, so the camera must tick deterministically with it).
// PaintScene CONSUMES this module and only draws; the proof-tape replayer
// (proof-tapes.test.ts) runs the SAME code in CI. That identity is the whole
// point: a level is provably completable because this exact machine, fed a
// recorded pad stream, reached its exit — no model, no drift.
//
// Events out, mutations in: step() returns SimEvents; the shell (scene or
// replayer) reacts (toasts, task overlay, phase handoff) and calls back into
// solveTask()/dismissTask()/setOverlay() — the same contract React had.

import { glyphAt, isSolid } from "./collide.ts";
import { LOGICAL_H, LOGICAL_W, PAINT, SUBS, TILE } from "./paint.ts";
import { IDLE_PAD, type Pad, type PlayerEvent, type PlayerState, applyKnockback, spawnPlayer, stepPlayer } from "./player.ts";
import { type FistState, stepFist, throwFist } from "./fist.ts";
import {
  type EntityEvent,
  type EntityWorld,
  applyLinks,
  guardianKnotSolved,
  redeemEntity,
  rideAttachCheck,
  spawnEntities,
  stepEntities,
} from "./entities.ts";
import { cameraTargetX, clampScroll, stepCameraAxis, stepCameraY } from "./camera.ts";
import { type Ability, type PaintLevel, type PhaseSpec, allPhases, findGlyph } from "./level.ts";

export interface TaskRequest {
  use: "quickfire" | "encounter" | "door" | "rescue" | "boss" | "bonus" | "bonuspay";
  ctx:
    | { type: "entity"; id: string; skin: string }
    | { type: "cage"; id: string; skin: string; classmate?: string }
    | { type: "door"; id: string; kind: string }
    | { type: "guardian"; id: string }
    | { type: "hazard"; hazard: string };
}

export type SimEvent =
  | { type: "toast"; msg: string }
  | { type: "task"; req: TaskRequest }
  | { type: "powerup"; grants: string }
  | { type: "cageFreed"; id: string; skin: string; classmate: string | undefined; count: number }
  | { type: "guardianDown" }
  | { type: "letters"; got: number; total: number }
  | { type: "letterTaken"; c: number; r: number }
  | { type: "exit"; to: string };

export interface SimCfg {
  level: PaintLevel;
  phaseId: string;
  grantedAbilities: () => readonly string[];
  freedCageIds: () => readonly string[];
}

const fromSubs = (v: number): number => v / SUBS;

export class Sim {
  readonly phase: PhaseSpec;
  readonly grid: readonly string[];
  readonly worldWpx: number;
  readonly worldHpx: number;
  readonly exitCell: { c: number; r: number };
  readonly rings: Array<{ x: number; y: number }> = [];

  player: PlayerState;
  prevPad: Pad = { ...IDLE_PAD };
  fist: FistState | null = null;
  world: EntityWorld;
  overlayOpen = false;
  doorSolved = new Set<string>();
  guardianDefeated = false;
  ridingId: string | null = null;
  respawnCell: { c: number; r: number } | null = null;
  pendingPoolRespawn = false;
  bonusLeftTicks = -1; // ≥0 only in the Kleckskammer
  gateToastCooldown = 0;
  tickCount = 0;
  exitFired = false;
  lettersTotal = 0;
  lettersGot = 0;
  /** letter cells still uncollected, "c,r" keys (render mirrors this) */
  letterCells = new Set<string>();
  camX = 0;
  camY = 0;

  private cfg: SimCfg;

  constructor(cfg: SimCfg) {
    this.cfg = cfg;
    const phase = allPhases(cfg.level).find((p) => p.id === cfg.phaseId);
    if (!phase) throw new Error(`Sim: unknown phase ${cfg.phaseId}`);
    this.phase = phase;
    this.grid = phase.rows;
    this.worldWpx = (phase.rows[0]?.length ?? 0) * TILE;
    this.worldHpx = phase.rows.length * TILE;
    const exit = findGlyph(phase.rows, "X") ?? findGlyph(phase.rows, "B");
    this.exitCell = exit ?? { c: 0, r: 0 };

    for (const [r, row] of phase.rows.entries()) {
      for (let c = 0; c < row.length; c++) {
        if (row[c] === "o") this.rings.push({ x: (c * TILE + TILE / 2) * SUBS, y: (r * TILE + TILE / 2) * SUBS });
        if (row[c] === "*") { this.letterCells.add(`${c},${r}`); this.lettersTotal++; }
      }
    }

    const start = findGlyph(this.grid, "S") ?? { c: 2, r: 2 };
    this.player = spawnPlayer(start.c * TILE + TILE / 2, (start.r + 1) * TILE);
    this.respawnCell = start;

    this.world = spawnEntities(this.phase.entities, this.phase.links);
    for (const id of cfg.freedCageIds()) {
      const e = this.world.entities.find((x) => x.id === id);
      if (e) { e.redeemed = true; e.state = "burst"; }
    }
    if (cfg.phaseId === "p9") this.bonusLeftTicks = 35 * 60 + 120; // G1: budget + 2s grace

    this.camX = clampScroll(cameraTargetX(this.player.x, this.player.facing), this.worldWpx, LOGICAL_W);
    this.camY = clampScroll(this.player.y - Math.round(LOGICAL_H * 0.57) * SUBS, this.worldHpx, LOGICAL_H);
  }

  /** Advance ONE 60Hz tick. Returns the events the shell must react to. */
  step(pad: Pad): SimEvent[] {
    const events: SimEvent[] = [];
    if (this.overlayOpen) return events; // the world holds its breath during a task
    this.tickCount++;
    if (this.gateToastCooldown > 0) this.gateToastCooldown--;
    if (this.bonusLeftTicks > 0) {
      this.bonusLeftTicks--;
      if (this.bonusLeftTicks === 0) { events.push({ type: "exit", to: "bonus-timeout" }); return events; }
    }

    const near = this.nearestRing();
    const abilities = this.cfg.grantedAbilities();
    const out = stepPlayer(this.player, pad, this.prevPad, this.grid, {
      slippery: this.phase.surface === "slippery",
      canRun: abilities.includes("run"),
      canHover: abilities.includes("hover"),
      canPunch: abilities.includes("punch"),
      canHang: abilities.includes("hang"),
      fistBusy: this.fist !== null,
      ringAt: abilities.includes("swing") ? near : null,
    });
    this.player = out.st;
    // W0-F7 (canonical): the player is boxed inside the visible screen
    const minX = this.camX + 20 * SUBS;
    const maxX = this.camX + (LOGICAL_W - 36) * SUBS;
    if (this.player.x < minX) this.player = { ...this.player, x: minX, vx: Math.max(this.player.vx, 0) };
    if (this.player.x > maxX) this.player = { ...this.player, x: maxX, vx: Math.min(this.player.vx, 0) };
    this.prevPad = { ...pad };
    for (const ev of out.events) this.onPlayerEvent(ev, events);

    if (this.fist) {
      const tipC = Math.floor(fromSubs(this.fist.x + this.fist.dir * 8 * SUBS) / TILE);
      const tipR = Math.floor(fromSubs(this.fist.y) / TILE);
      const bounced = isSolid(glyphAt(this.grid, tipC, tipR));
      const res = stepFist(this.fist, this.player.x, this.player.y, bounced);
      this.fist = res.caught || !res.fist.active ? null : res.fist;
    }

    this.stepEntityWorld(events);
    this.touchCheckpoints(events);
    this.collectLetters(events);
    this.checkExit(events);

    // per-tick camera follow (gameplay: the screen clamp reads camX next tick)
    const tx = clampScroll(cameraTargetX(this.player.x, this.player.facing), this.worldWpx, LOGICAL_W);
    this.camX = clampScroll(stepCameraAxis(this.camX, tx), this.worldWpx, LOGICAL_W);
    this.camY = clampScroll(stepCameraY(this.camY, this.player.y), this.worldHpx, LOGICAL_H);
    return events;
  }

  setOverlay(open: boolean): void {
    this.overlayOpen = open;
  }

  /** The shell reports the task for `ctx` SOLVED. */
  solveTask(ctx: TaskRequest["ctx"], events: SimEvent[] = []): SimEvent[] {
    if (ctx.type === "entity") {
      const e = this.world.entities.find((x) => x.id === ctx.id);
      if (e?.role === "guardian") {
        events.push({ type: "toast", msg: "Weiter!" });
      } else {
        redeemEntity(this.world, ctx.id);
        applyLinks(this.world, "redeemed", ctx.id);
        events.push({ type: "toast", msg: "Danke!" });
      }
    } else if (ctx.type === "cage") {
      const freed = this.cfg.freedCageIds().length + 1;
      events.push({ type: "cageFreed", id: ctx.id, skin: ctx.skin, classmate: ctx.classmate, count: freed });
      applyLinks(this.world, "opened", ctx.id);
    } else if (ctx.type === "door") {
      this.doorSolved.add(ctx.id);
      applyLinks(this.world, "opened", ctx.id);
      events.push({ type: "toast", msg: "Die Tür freut sich!" });
    } else if (ctx.type === "guardian") {
      const out = guardianKnotSolved(this.world, ctx.id);
      for (const ev of out) {
        if (ev.type === "guardianDown") {
          this.guardianDefeated = true;
          events.push({ type: "guardianDown" });
        } else if (ev.type === "guardianKnot") {
          events.push({ type: "toast", msg: `Noch ${ev.knotsLeft} Knoten!` });
        }
      }
    } else if (ctx.type === "hazard") {
      if (this.pendingPoolRespawn && this.respawnCell) {
        this.warp(this.respawnCell.c, this.respawnCell.r - 1);
        this.pendingPoolRespawn = false;
      }
    }
    this.overlayOpen = false;
    return events;
  }

  /** The shell reports the task DISMISSED („Später") — no reward, no redeem. */
  dismissTask(ctx: TaskRequest["ctx"]): void {
    if (ctx.type === "hazard" && this.pendingPoolRespawn && this.respawnCell) {
      this.warp(this.respawnCell.c, this.respawnCell.r - 1);
      this.pendingPoolRespawn = false;
    }
    this.overlayOpen = false;
  }

  spendLetters(n: number): boolean {
    if (this.lettersGot < n) return false;
    this.lettersGot -= n;
    return true;
  }

  warp(c: number, r: number): void {
    // a warp always detaches and SNAPS the camera (the screen clamp would
    // otherwise drag the player back toward the stale view)
    this.player = {
      ...this.player,
      x: (c * TILE + TILE / 2) * SUBS,
      y: (r + 1) * TILE * SUBS,
      vx: 0,
      vy: 0,
      grounded: false,
      swing: null,
      hangAt: null,
      climbing: false,
      hovering: false,
    };
    this.camX = clampScroll(cameraTargetX(this.player.x, this.player.facing), this.worldWpx, LOGICAL_W);
    this.camY = clampScroll(this.player.y - Math.round(LOGICAL_H * 0.57) * SUBS, this.worldHpx, LOGICAL_H);
  }

  private onPlayerEvent(ev: PlayerEvent, events: SimEvent[]): void {
    if (ev.type === "fistThrown") {
      this.fist = throwFist(this.player.x, this.player.y, this.player.facing, ev.charge, ev.speedSubs);
    } else if (ev.type === "encounter") {
      events.push({ type: "toast", msg: ev.hazard === "^" ? "Autsch!" : "Platsch!" });
      if (ev.hazard === "w") this.pendingPoolRespawn = true;
      this.overlayOpen = true;
      events.push({ type: "task", req: { use: "quickfire", ctx: { type: "hazard", hazard: ev.hazard } } });
    }
  }

  private stepEntityWorld(events: SimEvent[]): void {
    const evs = stepEntities(this.world, this.grid, {
      playerX: this.player.x,
      playerY: this.player.y,
      playerIframes: this.player.iframes,
      playerOverlayOpen: this.overlayOpen,
      fist: this.fist ? { active: true, x: this.fist.x, y: this.fist.y } : null,
    });
    for (const ev of evs) this.onEntityEvent(ev, events);

    // ── the G3 ride contract: stand on a moving platform, inherit its motion ──
    if (this.ridingId !== null) {
      const e = this.world.entities.find((x) => x.id === this.ridingId);
      const gone = !e || e.state === "gone" || Math.abs((e?.x ?? 0) - this.player.x) / SUBS > 24 || this.player.vy < 0;
      if (gone) this.ridingId = null;
      else if (e) {
        this.player.x += e.vx;
        this.player.y = e.y - 6 * SUBS;
        this.player.vy = 0;
        this.player.grounded = true;
      }
    }
    if (this.ridingId === null && !this.player.grounded) {
      for (const e of this.world.entities) {
        if (e.hidden || e.redeemed || !rideAttachCheck(e, this.player.y, this.player.x, this.player.vy)) continue;
        this.ridingId = e.id;
        if (e.role === "platform.fall" && e.state === "carry") { e.state = "armed"; e.timer = 0; }
        this.player.y = e.y - 6 * SUBS;
        this.player.vy = 0;
        this.player.grounded = true;
        break;
      }
    }
  }

  private onEntityEvent(ev: EntityEvent, events: SimEvent[]): void {
    switch (ev.type) {
      case "encounter": {
        const src = this.world.entities.find((e) => e.id === ev.id);
        applyKnockback(this.player, this.player.x < (src?.x ?? this.player.x) ? -1 : 1, false);
        this.player.iframes = PAINT.iframeTicks;
        this.overlayOpen = true;
        events.push({ type: "task", req: { use: ev.role === "swarm" ? "quickfire" : "encounter", ctx: { type: "entity", id: ev.id, skin: ev.skin } } });
        break;
      }
      case "cageBurst": {
        const e = this.world.entities.find((x) => x.id === ev.id);
        this.overlayOpen = true;
        events.push({ type: "task", req: { use: "rescue", ctx: { type: "cage", id: ev.id, skin: ev.skin, classmate: e?.params.classmate as string | undefined } } });
        break;
      }
      case "cageHit":
        events.push({ type: "toast", msg: "Er wackelt!" });
        break;
      case "doorTouched": {
        const e = this.world.entities.find((x) => x.id === ev.id);
        if (this.doorSolved.has(ev.id)) break;
        this.overlayOpen = true;
        if (ev.kind === "bonus") events.push({ type: "task", req: { use: "bonuspay", ctx: { type: "door", id: ev.id, kind: ev.kind } } });
        else events.push({ type: "task", req: { use: "door", ctx: { type: "door", id: ev.id, kind: String(e?.params.kind ?? "exit") } } });
        break;
      }
      case "powerupTaken":
        this.overlayOpen = true;
        events.push({ type: "powerup", grants: ev.grants });
        break;
      case "guardianStagger": {
        const g = this.world.entities.find((x) => x.id === ev.id);
        if (g) g.state = "window";
        this.overlayOpen = true;
        events.push({ type: "task", req: { use: "boss", ctx: { type: "guardian", id: ev.id } } });
        break;
      }
      case "shooed":
        events.push({ type: "toast", msg: "Husch!" });
        break;
      default:
        break;
    }
  }

  private nearestRing(): { x: number; y: number } | null {
    for (const g of this.rings) {
      if (Math.abs(g.x - this.player.x) <= 14 * SUBS && Math.abs(g.y - (this.player.y - 30 * SUBS)) <= 28 * SUBS) return g;
    }
    return null;
  }

  private touchCheckpoints(events: SimEvent[]): void {
    const c = Math.floor(fromSubs(this.player.x) / TILE);
    const r = Math.floor((fromSubs(this.player.y) - 1) / TILE);
    if (glyphAt(this.grid, c, r) === "C" || glyphAt(this.grid, c, r + 1) === "C") {
      if (this.respawnCell?.c !== c) {
        this.respawnCell = { c, r: Math.max(r, 1) };
        events.push({ type: "toast", msg: "Krakel skizziert dich!" });
      }
    }
  }

  private collectLetters(events: SimEvent[]): void {
    const px = fromSubs(this.player.x);
    const py = fromSubs(this.player.y);
    for (const key of this.letterCells) {
      const [c, r] = key.split(",").map(Number) as [number, number];
      const cx = c * TILE + TILE / 2;
      const cy = r * TILE + TILE / 2;
      if (Math.abs(px - cx) < 11 && Math.abs(py - 10 - cy) < 16) {
        this.letterCells.delete(key);
        this.lettersGot++;
        events.push({ type: "letterTaken", c, r });
        events.push({ type: "letters", got: this.lettersGot, total: this.lettersTotal });
      }
    }
  }

  private checkExit(events: SimEvent[]): void {
    if (this.exitFired) return;
    const px = fromSubs(this.player.x);
    const py = fromSubs(this.player.y);
    const cx = this.exitCell.c * TILE + TILE / 2;
    const cy = (this.exitCell.r + 1) * TILE;
    // 18px: the screen-space clamp (right−36) can hold the body ~12px short
    // of a border-adjacent exit cell — the trigger must reach past the clamp
    if (Math.abs(px - cx) < 18 && Math.abs(py - cy) < 22) {
      // exit doors gate the X until their word is said (ch01 imperative law)
      const gate = this.phase.entities.find((e) => e.role === "door.trigger" && e.params?.kind === "exit");
      if (gate && !this.doorSolved.has(gate.id)) {
        if (this.gateToastCooldown === 0) { events.push({ type: "toast", msg: "Die Tür wartet auf ihr Wort!" }); this.gateToastCooldown = 120; }
        return;
      }
      if (this.phase.entities.some((e) => e.role === "guardian") && !this.guardianDefeated) {
        if (this.gateToastCooldown === 0) { events.push({ type: "toast", msg: "Die Tafel möchte noch reden!" }); this.gateToastCooldown = 120; }
        return;
      }
      this.exitFired = true;
      events.push({ type: "exit", to: this.phase.exit.to });
    }
  }
}
