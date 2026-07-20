/**
 * entities — the chapter's living things, as PURE BRAINS (the arcade.ts law:
 * fixed 60 Hz ticks, integer subpixels, Phaser-free, fully unit-testable).
 *
 * Roles per the frozen ch01 sheet §4: chaser · gunner · flyer · bouncer ·
 * crusher · swarm · platform.move/fall/swing · cage · powerup · door.trigger ·
 * guardian. Encounters NEVER kill (doc 31 §1): touching a cross being opens a
 * TASK; solving it redeems the being (dazed-happy, out of play). The fist only
 * shoos and deflects — it never redeems (§3).
 *
 * Source-adopted numbers (audit r3): the G3 ride contract lands scene-side
 * (land tolerance max(|Δvy|+2, 4) px, detach at ≥9 px); G11 arena grammar
 * (camera lock + clock-gated pattern states + exit-on-victory) lives in the
 * guardian machine here.
 */
import { PAINT, SUBS, TILE } from "./paint.ts";
import { groundSurfaceAt } from "./collide.ts";
import type { EntitySpec, LinkSpec } from "./level.ts";

export interface EntityState {
  id: string;
  role: EntitySpec["role"] | "guardian";
  skin: string;
  tier: "E" | "M" | "S";
  /** feet-center position in subs (the player convention). */
  x: number;
  y: number;
  vx: number;
  vy: number;
  dir: 1 | -1;
  /** role FSM: patrol|telegraph|act|recover|dazed — cages: closed|shaking|burst
   *  — guardian: idle|telegraph|throw|stagger|window|consoled. */
  state: string;
  timer: number;
  hp: number;
  homeX: number;
  homeY: number;
  redeemed: boolean;
  hidden: boolean; // revealed via links
  params: Record<string, unknown>;
}

export interface ProjectileState {
  id: number;
  kind: "chalk" | "blob";
  x: number;
  y: number;
  vx: number;
  vy: number;
  deflected: boolean;
  fromId: string;
  dead: boolean;
}

export type EntityEvent =
  | { type: "encounter"; id: string; role: string; skin: string }
  | { type: "cageHit"; id: string; hpLeft: number }
  | { type: "cageBurst"; id: string; skin: string }
  | { type: "doorTouched"; id: string; kind: string }
  | { type: "powerupTaken"; id: string; grants: string }
  | { type: "guardianStagger"; id: string }
  | { type: "guardianKnot"; id: string; knotsLeft: number }
  | { type: "guardianDown"; id: string }
  | { type: "projectileDeflected"; id: number }
  | { type: "shooed"; id: string };

export interface WorldInput {
  playerX: number; // subs
  playerY: number;
  playerIframes: number;
  playerOverlayOpen: boolean; // world frozen while a task is up
  fist: { active: boolean; x: number; y: number } | null;
}

export interface EntityWorld {
  entities: EntityState[];
  projectiles: ProjectileState[];
  links: LinkSpec[];
  nextProjectileId: number;
  guardianKnots: number; // knots remaining on the arena guardian (0 = down)
}

const BODY_HALF_PX = 8;
const AGGRO_X_PX = 72;
const ENEMY_WALK = Math.round(0.6 * SUBS);
const ENEMY_LUNGE = Math.round(1.6 * SUBS);
const GRAVITY = PAINT.gravity;

/** Per-tier guardian script (sheet §6: telegraph/window shrink E→S, knots ≤5). */
export const GUARDIAN_SCRIPT = {
  E: { knots: 3, telegraphTicks: 60, throwEvery: 150, staggerTicks: 90 },
  M: { knots: 4, telegraphTicks: 45, throwEvery: 120, staggerTicks: 75 },
  S: { knots: 5, telegraphTicks: 32, throwEvery: 96, staggerTicks: 60 },
} as const;

export const spawnEntities = (specs: EntitySpec[], links: LinkSpec[]): EntityWorld => ({
  entities: specs.map((s) => ({
    id: s.id,
    role: s.role,
    skin: s.skin,
    tier: s.tier,
    x: (s.c * TILE + TILE / 2) * SUBS,
    y: (s.r + 1) * TILE * SUBS,
    vx: 0,
    vy: 0,
    dir: -1,
    state: s.role === "cage" ? "closed" : s.role.startsWith("platform") ? "carry" : s.role === "guardian" ? "idle" : "patrol",
    timer: 0,
    hp: s.role === "cage" ? 2 : s.role === "guardian" ? GUARDIAN_SCRIPT[s.tier].knots : 1,
    homeX: (s.c * TILE + TILE / 2) * SUBS,
    homeY: (s.r + 1) * TILE * SUBS,
    redeemed: false,
    hidden: s.params?.hidden === true,
    params: s.params ?? {},
  })),
  projectiles: [],
  links,
  nextProjectileId: 1,
  guardianKnots: -1,
});

const overlapsPlayer = (e: EntityState, inp: WorldInput, wPx = 14, hPx = 26): boolean => {
  const dx = Math.abs(e.x - inp.playerX) / SUBS;
  const pTop = inp.playerY / SUBS - 30;
  const eTop = e.y / SUBS - hPx;
  const vOverlap = e.y / SUBS > pTop && inp.playerY / SUBS > eTop;
  return dx < wPx && vOverlap;
};

const fistHits = (e: EntityState, fist: WorldInput["fist"], wPx = 14): boolean => {
  if (!fist || !fist.active) return false;
  return Math.abs(e.x - fist.x) / SUBS < wPx && Math.abs(e.y - SUBS * 14 - fist.y) / SUBS < 18;
};

/** Ground snap for walking enemies (thin wrapper over the mover's surface probe). */
const groundAt = (grid: readonly string[], xSubs: number, ySubs: number): number | null => {
  const fromRow = Math.max(Math.floor(ySubs / SUBS / TILE) - 1, 0);
  const s = groundSurfaceAt(grid, xSubs / SUBS, fromRow, 4);
  return s === null ? null : s.yPx * SUBS;
};

export const stepEntities = (
  w: EntityWorld,
  grid: readonly string[],
  inp: WorldInput,
): EntityEvent[] => {
  const events: EntityEvent[] = [];
  if (inp.playerOverlayOpen) return events; // the world holds its breath during a task

  for (const e of w.entities) {
    if (e.redeemed || e.hidden) continue;
    e.timer += 1;
    switch (e.role) {
      case "chaser": {
        if (e.state === "patrol") {
          e.vx = ENEMY_WALK * e.dir;
          const aheadX = e.x + e.vx * 8;
          const g = groundAt(grid, aheadX, e.y);
          if (g === null) { e.dir = (e.dir * -1) as 1 | -1; e.vx = 0; } // ledge turn
          else {
            e.x += e.vx;
            const snap = groundAt(grid, e.x, e.y);
            if (snap !== null) e.y = snap;
          }
          const sameBand = Math.abs(e.y - inp.playerY) / SUBS < 24;
          if (sameBand && Math.abs(e.x - inp.playerX) / SUBS < AGGRO_X_PX) { e.state = "telegraph"; e.timer = 0; }
        } else if (e.state === "telegraph") {
          if (e.timer > 24) { e.state = "act"; e.timer = 0; e.dir = (inp.playerX >= e.x ? 1 : -1) as 1 | -1; }
        } else if (e.state === "act") {
          const g = groundAt(grid, e.x + ENEMY_LUNGE * e.dir * 4, e.y);
          if (g !== null) { e.x += ENEMY_LUNGE * e.dir; const s2 = groundAt(grid, e.x, e.y); if (s2 !== null) e.y = s2; }
          if (e.timer > 40 || g === null) { e.state = "patrol"; e.timer = 0; }
        }
        break;
      }
      case "gunner": {
        const every = e.tier === "E" ? 210 : e.tier === "M" ? 160 : 120;
        const inRange = Math.abs(e.x - inp.playerX) / SUBS < 140;
        if (e.state === "patrol" && inRange && e.timer > every) { e.state = "telegraph"; e.timer = 0; }
        else if (e.state === "telegraph" && e.timer > 30) {
          e.state = "patrol"; e.timer = 0;
          const dir = inp.playerX >= e.x ? 1 : -1;
          w.projectiles.push({
            id: w.nextProjectileId++, kind: "blob", x: e.x, y: e.y - 10 * SUBS,
            vx: Math.round(1.4 * SUBS) * dir, vy: -Math.round(2.2 * SUBS), deflected: false, fromId: e.id, dead: false,
          });
        }
        break;
      }
      case "flyer": {
        // sine patrol around home altitude; dive when the player is below
        const t = e.timer;
        if (e.state === "patrol") {
          e.x = e.homeX + Math.round(Math.sin(t / 40) * 40 * SUBS);
          e.y = e.homeY + Math.round(Math.sin(t / 23) * 6 * SUBS);
          const below = inp.playerY > e.y && Math.abs(e.x - inp.playerX) / SUBS < 24;
          if (below && t > 90) { e.state = "telegraph"; e.timer = 0; }
        } else if (e.state === "telegraph") {
          if (e.timer > 20) { e.state = "act"; e.timer = 0; }
        } else if (e.state === "act") {
          e.y += Math.round(2.2 * SUBS);
          if (e.y >= inp.playerY || e.timer > 40) { e.state = "recover"; e.timer = 0; }
        } else if (e.state === "recover") {
          e.y -= Math.round(1.2 * SUBS);
          if (e.y <= e.homeY) { e.y = e.homeY; e.state = "patrol"; e.timer = 0; }
        }
        break;
      }
      case "bouncer": {
        e.vy += GRAVITY;
        e.y += e.vy;
        const g = groundAt(grid, e.x, e.y);
        if (g !== null && e.y >= g && e.vy > 0) {
          e.y = g;
          e.vy = -Math.round(3.2 * SUBS);
          const aheadG = groundAt(grid, e.x + 20 * SUBS * e.dir, e.y);
          if (aheadG === null) e.dir = (e.dir * -1) as 1 | -1;
        }
        e.x += Math.round(0.5 * SUBS) * e.dir;
        break;
      }
      case "crusher": {
        // rests high at home; slams when the player passes beneath
        if (e.state === "patrol") {
          const under = Math.abs(e.x - inp.playerX) / SUBS < 16 && inp.playerY > e.y;
          if (under) { e.state = "telegraph"; e.timer = 0; }
        } else if (e.state === "telegraph") {
          if (e.timer > 28) { e.state = "act"; e.timer = 0; }
        } else if (e.state === "act") {
          e.y += Math.round(4 * SUBS);
          const g = groundAt(grid, e.x, e.y);
          if (g !== null && e.y >= g) { e.y = g; e.state = "recover"; e.timer = 0; }
        } else if (e.state === "recover") {
          if (e.timer > 45) { e.y -= SUBS; if (e.y <= e.homeY) { e.y = e.homeY; e.state = "patrol"; } }
        }
        break;
      }
      case "swarm": {
        // the moth cloud drifts around home, leaning gently toward the player
        const t = e.timer;
        const lean = Math.sign(inp.playerX - e.x) * Math.min(Math.abs(inp.playerX - e.x) / 8, 0.4 * SUBS);
        e.x = e.homeX + Math.round(Math.sin(t / 30) * 24 * SUBS) + Math.round(lean * Math.min(t, 240) / 240);
        e.y = e.homeY + Math.round(Math.sin(t / 17) * 10 * SUBS);
        break;
      }
      case "platform.move": {
        const dxT = Number(e.params.dxTiles ?? 4);
        const dyT = Number(e.params.dyTiles ?? 0);
        const period = Number(e.params.periodTicks ?? 240);
        const ph = (e.timer % period) / period;
        const wave = ph < 0.5 ? ph * 2 : 2 - ph * 2; // triangle 0→1→0
        const nx = e.homeX + Math.round(dxT * TILE * SUBS * wave);
        const ny = e.homeY + Math.round(dyT * TILE * SUBS * wave);
        e.vx = nx - e.x; e.vy = ny - e.y; // per-tick delta for the ride contract
        e.x = nx; e.y = ny;
        break;
      }
      case "platform.swing": {
        const rope = Number(e.params.ropePx ?? 48);
        const period = Number(e.params.periodTicks ?? 180);
        const a = Math.sin((e.timer % period) / period * Math.PI * 2) * 0.9;
        const nx = e.homeX + Math.round(Math.sin(a) * rope * SUBS);
        const ny = e.homeY + Math.round((Math.cos(a) - 1) * -rope * SUBS * 0.25) + rope * SUBS;
        e.vx = nx - e.x; e.vy = ny - e.y;
        e.x = nx; e.y = ny;
        break;
      }
      case "platform.fall": {
        if (e.state === "armed") {
          if (e.timer > 24) { e.state = "falling"; e.timer = 0; }
        } else if (e.state === "falling") {
          e.vy = Math.min(e.vy + GRAVITY, 3 * SUBS);
          e.y += e.vy;
          if ((e.y - e.homeY) / SUBS > 160) { e.state = "gone"; e.vy = 0; }
        }
        break;
      }
      case "cage": {
        if (e.state === "closed" && fistHits(e, inp.fist, 16)) {
          e.hp -= 1;
          if (e.hp <= 0) { e.state = "burst"; e.redeemed = true; events.push({ type: "cageBurst", id: e.id, skin: e.skin }); }
          else { e.state = "shaking"; e.timer = 0; events.push({ type: "cageHit", id: e.id, hpLeft: e.hp }); }
        } else if (e.state === "shaking" && e.timer > 30) e.state = "closed";
        break;
      }
      case "powerup": {
        if (overlapsPlayer(e, inp, 14, 20)) {
          e.redeemed = true;
          events.push({ type: "powerupTaken", id: e.id, grants: String(e.params.grants ?? "punch") });
        }
        break;
      }
      case "door.trigger": {
        if (overlapsPlayer(e, inp, 12, 26) && e.state !== "cooling") {
          e.state = "cooling"; e.timer = 0;
          events.push({ type: "doorTouched", id: e.id, kind: String(e.params.kind ?? "exit") });
        } else if (e.state === "cooling" && e.timer > 90) e.state = "patrol";
        break;
      }
      case "guardian": {
        const script = GUARDIAN_SCRIPT[e.tier];
        if (w.guardianKnots < 0) w.guardianKnots = script.knots;
        if (e.state === "idle") {
          if (e.timer > script.throwEvery) { e.state = "telegraph"; e.timer = 0; }
        } else if (e.state === "telegraph") {
          if (e.timer > script.telegraphTicks) {
            e.state = "idle"; e.timer = 0;
            const dir = inp.playerX >= e.x ? 1 : -1;
            w.projectiles.push({
              id: w.nextProjectileId++, kind: "chalk", x: e.x + 14 * SUBS * dir, y: e.y - 24 * SUBS,
              vx: Math.round(2.5 * SUBS) * dir, vy: -3 * SUBS, deflected: false, fromId: e.id, dead: false,
            });
          }
        } else if (e.state === "stagger") {
          if (e.timer > script.staggerTicks) { e.state = "idle"; e.timer = 0; }
        }
        // "window" (the counter-task) and "consoled" are scene-driven states.
        break;
      }
      default:
        break;
    }

    // ── contact: cross beings open ENCOUNTERS (never damage-kill) ──
    const hostile = ["chaser", "gunner", "flyer", "bouncer", "crusher", "swarm"].includes(e.role);
    if (hostile && !e.redeemed && inp.playerIframes === 0 && overlapsPlayer(e, inp)) {
      events.push({ type: "encounter", id: e.id, role: e.role, skin: e.skin });
    }
    // the fist SHOOS hostiles (turn + brief daze), never redeems (§3)
    if (hostile && fistHits(e, inp.fist)) {
      if (e.state !== "shooed") { e.state = "shooed"; e.timer = 0; e.dir = (e.dir * -1) as 1 | -1; events.push({ type: "shooed", id: e.id }); }
    }
    if (e.state === "shooed" && e.timer > 40) e.state = "patrol";
  }

  // ── projectiles ──
  for (const p of w.projectiles) {
    if (p.dead) continue;
    // chalk floats on a long readable arc (the deflect window); blobs drop fast
    p.vy += Math.round(GRAVITY / (p.kind === "chalk" ? 4 : 2));
    p.x += p.vx;
    p.y += p.vy;
    const g = groundAt(grid, p.x, p.y);
    if (g !== null && p.y >= g && !p.deflected) p.dead = true; // a deflected piece flies home over the floor
    if (Math.abs(p.x) / SUBS > 4096 || p.y / SUBS > 4096) p.dead = true;
    // deflect: the fist bats a chalk piece back (§6 the deflect law)
    if (!p.deflected && inp.fist?.active && Math.abs(p.x - inp.fist.x) / SUBS < 20 && Math.abs(p.y - 8 * SUBS - inp.fist.y) / SUBS < 26) {
      p.deflected = true;
      p.vx = -p.vx * 2;
      p.vy = -SUBS; // a flat, fast return — it must CROSS the thrower's window, not sail over it
      // events for juice
      (p as ProjectileState).deflected = true;
      eventsPushDeflect(events, p.id);
    }
    // a deflected chalk piece staggers its guardian
    if (p.deflected && p.kind === "chalk") {
      const g0 = w.entities.find((e) => e.id === p.fromId && e.role === "guardian" && !e.redeemed);
      if (g0 && Math.abs(p.x - g0.x) / SUBS < 30 && Math.abs(p.y - (g0.y - 20 * SUBS)) / SUBS < 40) {
        p.dead = true;
        if (g0.state !== "stagger" && g0.state !== "window") {
          g0.state = "stagger";
          g0.timer = 0;
          eventsPushStagger(events, g0.id);
        }
      }
    }
    // an undeflected projectile touching the player = encounter (no death)
    if (!p.deflected && inp.playerIframes === 0 &&
      Math.abs(p.x - inp.playerX) / SUBS < 10 && Math.abs(p.y - (inp.playerY - 15 * SUBS)) / SUBS < 16) {
      p.dead = true;
      const src = w.entities.find((e) => e.id === p.fromId);
      events.push({ type: "encounter", id: p.fromId, role: src?.role ?? "gunner", skin: src?.skin ?? p.kind });
    }
  }
  w.projectiles = w.projectiles.filter((p) => !p.dead);

  return events;
};

const eventsPushDeflect = (events: EntityEvent[], id: number): void => { events.push({ type: "projectileDeflected", id }); };
const eventsPushStagger = (events: EntityEvent[], id: string): void => { events.push({ type: "guardianStagger", id }); };

/** The scene calls this when the counter-window task is SOLVED: one knot unties. */
export const guardianKnotSolved = (w: EntityWorld, id: string): EntityEvent[] => {
  const g = w.entities.find((e) => e.id === id && e.role === "guardian");
  if (!g || g.redeemed) return [];
  g.hp -= 1;
  w.guardianKnots = g.hp;
  if (g.hp <= 0) {
    g.state = "consoled";
    return [{ type: "guardianDown", id }];
  }
  g.state = "idle";
  g.timer = 0;
  return [{ type: "guardianKnot", id, knotsLeft: g.hp }];
};

/** Redeem after a solved encounter task: cross → dazed-happy, out of play. */
export const redeemEntity = (w: EntityWorld, id: string): void => {
  const e = w.entities.find((x) => x.id === id);
  if (e) { e.redeemed = true; e.state = "dazed"; }
};

/** Fire link actions when a trigger event lands (spawn/open/reveal → unhide). */
export const applyLinks = (w: EntityWorld, on: LinkSpec["on"], triggerId: string): string[] => {
  const revealed: string[] = [];
  for (const l of w.links) {
    if (l.trigger !== triggerId || l.on !== on) continue;
    for (const t of l.targets) {
      const e = w.entities.find((x) => x.id === t);
      if (e && e.hidden) { e.hidden = false; revealed.push(t); }
    }
  }
  return revealed;
};

/** G3 ride contract, scene-side helper: should the player attach to this platform? */
export const rideAttachCheck = (
  e: EntityState,
  playerFeetSubs: number,
  playerXSubs: number,
  playerVySubs: number,
): boolean => {
  if (!e.role.startsWith("platform")) return false;
  if (e.state === "gone") return false;
  const tolPx = Math.max(Math.abs(playerVySubs) / SUBS + 2, 4); // G3 verbatim
  const topPx = (e.y - 6 * SUBS) / SUBS;
  const dx = Math.abs(e.x - playerXSubs) / SUBS;
  return dx <= 20 && playerVySubs >= 0 && Math.abs(playerFeetSubs / SUBS - topPx) <= tolPx;
};
