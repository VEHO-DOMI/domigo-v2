/**
 * K-3 · "Tintenlauf" rebuilt to the Arcade Design Bible (doc 25). The scene is
 * the THIN layer: physics numbers, verbs, creature brains and level laws all
 * live in arcade.ts (pure, tested); this file wires them into Phaser.
 *
 * The verb set (bible §2.8): run · thrust-fuel jump · pogo (toggle, auto-
 * rebounce, tiny-gravity hold) · ledge-grab + pull-up · look up/down ·
 * drop-through · checkpoints. Camera = Keen doctrine (dead-band, grounded-
 * gated vertical, look offsets). Simulation steps on Phaser arcade's fixed
 * 60Hz timestep (fps: 60, fixedStep) — never wall-clock delta.
 *
 * Task economy (bible §5): contact with a TASKABLE creature freezes the world
 * for a quickfire. Correct → the creature is STUNNED (dizzy stars — the Keen
 * 5/6 doctrine: nothing dies) and releases its seal if it guards one. Wrong →
 * it escapes WITH a letter. Hearts belong to the physical world only (spikes,
 * ink bolts); losing the last one hands React the Rettungsaufgabe.
 */
import Phaser from "phaser";
import { paintCreatures, paintHero, paintMoverBook, paintPlatformProp, paintSkyline, paintTerrain, resolvePlatformTheme, terrainMask, type HeroPose } from "@domigo/art-gen";
import { playSfx } from "@domigo/game-feel";
import {
  airVx,
  ARCADE,
  cameraTargetX,
  cameraTargetY,
  canJump,
  comboPoints,
  flyerOffset,
  flyerPhase,
  gravityFor,
  helpersFor,
  ledgeGrabAt,
  hangPx,
  placementsFor,
  pogoGravityScale,
  pullUpPx,
  startJump,
  stepCloud,
  stepFuel,
  slopeSurfaceY,
  thiefTarget,
  TASKABLE,
  TILE_PX as TILE,
  walkerShouldTurn,
  type ArcadeLevel,
  type CloudState,
  type CreatureKind,
  type FuelState,
  type HangSpot,
  type Tier,
} from "./arcade.ts";
import { rasterize } from "./rasterize.ts";

// refoundation W3: 12×9 tiles (was 15×11) — Koki's zoom verdict; FIT upscales
const VIEW_W = 12 * TILE;
const VIEW_H = 9 * TILE;

export interface ArcadePad {
  left: boolean;
  right: boolean;
  up: boolean;
  down: boolean;
  jump: boolean;
  pogo: boolean;
  /** the Federstab swing (doc 29 combat verb) */
  swing: boolean;
}

export interface ArcadeConfig {
  level: ArcadeLevel;
  tier: Tier;
  seed: number;
  playerSeed?: number;
  reducedMotion?: boolean;
  /** doc 28 §5: generated-art URL map (stem → /art/g1/keen/...). Only-present
   *  law: any missing stem keeps its procedural fallback. Chapter stems
   *  (bg_far, bg_mid, walker-0…) + hero_<pose> + acc_<id>. */
  art?: Record<string, string>;
  /** v2.2: boot with the world held — the goal card is showing. */
  startFrozen?: boolean;
  pad?: ArcadePad;
  onQuickfire: (contactIdx: number) => void;
  onLetters: (count: number) => void;
  onHearts: (hearts: number) => void;
  onCombo: (streak: number, points: number) => void;
  onSeals: (collected: number, total: number) => void;
  /** doc 29 §4: seal posts hold typed story tasks. Return true to take over —
   *  the scene freezes; `solve` releases the seal, `cancel` walks away. */
  onSealTask?: (sealIdx: number, solve: () => void, cancel: () => void) => boolean;
  /** the last heart is gone → React runs the Rettungsaufgabe (§5.3) */
  onRescue: (deathCount: number) => void;
  onComplete: (stats: { ms: number; maxCombo: number; letters: number; words: number; seals: number; deaths: number; gluehwoerter: number }) => void;
  /** v2.1 (bible 27 §5.2): a Glühwort was collected (count so far). */
  onGluehwoerter?: (count: number) => void;
  /** v2.1 (bible 27 §2b): the player entered the UNSEALED boss door —
   *  React swaps to the duel. Only fires on 'B' levels with all seals. */
  onBossDoor?: (carry: { hearts: number; letters: number; gluehwoerter: number; words: number; maxCombo: number; seals: number; deaths: number; ms: number }) => void;
}

interface Creature {
  kind: CreatureKind;
  sprite: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  dir: 1 | -1;
  homeY: number;
  nextHopAt: number;
  /** stunned = frozen with dizzy stars (the non-violent defeat) */
  stunned: boolean;
  /** escaped = slunk away after a wrong answer */
  escaped: boolean;
  idx: number;
  cloud: CloudState;
  stars: Phaser.GameObjects.Text | null;
}

interface LetterEntry {
  c: number;
  r: number;
  taken: boolean;
  stolenBy: number | null; // creature idx that ate it (restored if he's stunned)
  bits: Phaser.GameObjects.GameObject[];
  zone: Phaser.Types.Physics.Arcade.SpriteWithStaticBody;
}

type PlayerState =
  | { kind: "normal" }
  | { kind: "hang"; spot: HangSpot; side: -1 | 1 }
  // pull-up advances on the fixed update tick, NOT a tween — state-carrying
  // motion must survive asleep-loop stepping (the tween system doesn't)
  | { kind: "pullup"; fromX: number; fromY: number; toX: number; toY: number; p: number }
  | { kind: "climb"; poleC: number } // v2.2: on a pole (up climbs, down slides)
  | { kind: "dying" };



/** The artifact pedestal (inactive → glowing) — the torn page fragment. */

/** The guardian's door (v2.1 'B' exit) — sealed dark until the seals open it. */

/** A Glühwort — a word Jona never managed to erase, still glowing (§5.2). */

/** A Tintensiegel (ink seal) — the gem-socket key, re-themed. */

/** In-level door (v2.2): an arched frame with a pair-colored gem, so kids can
 *  SEE which two doors connect before ever stepping through one. */
const DOOR_GEMS: Record<string, string> = { "1": "#ffc857", "2": "#5fd4c4", "3": "#f28ab2", "4": "#a88bfa" };
function paintLevelDoor(id: string): HTMLCanvasElement {
  const c = document.createElement("canvas");
  c.width = 48;
  c.height = 72;
  const g = c.getContext("2d")!;
  g.fillStyle = "#2b2742";
  g.beginPath();
  g.moveTo(6, 72); g.lineTo(6, 26); g.quadraticCurveTo(24, 2, 42, 26); g.lineTo(42, 72);
  g.closePath();
  g.fill();
  g.fillStyle = "#171429";
  g.beginPath();
  g.moveTo(12, 72); g.lineTo(12, 30); g.quadraticCurveTo(24, 12, 36, 30); g.lineTo(36, 72);
  g.closePath();
  g.fill();
  g.strokeStyle = "#8b7cf5";
  g.lineWidth = 2;
  g.beginPath();
  g.moveTo(6, 72); g.lineTo(6, 26); g.quadraticCurveTo(24, 2, 42, 26); g.lineTo(42, 72);
  g.stroke();
  g.fillStyle = DOOR_GEMS[id] ?? "#ffc857";
  g.beginPath(); g.arc(24, 22, 5, 0, Math.PI * 2); g.fill();
  g.strokeStyle = "#f6f5ff";
  g.lineWidth = 1.5;
  g.stroke();
  return c;
}

/** Floating platform slab (v2.2 movers) — glowing underside marks it as alive. */

/** Climbing pole tile (v2.2) — a rune-etched rod with a rung. */

export class ArcadeScene extends Phaser.Scene {
  private cfg: ArcadeConfig;
  private player!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  private pstate: PlayerState = { kind: "normal" };
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys | null = null;
  private wasd: Record<"W" | "A" | "S" | "D", Phaser.Input.Keyboard.Key> | null = null;
  private pogoKey: Phaser.Input.Keyboard.Key | null = null;
  private creatures: Creature[] = [];
  private letterEntries: LetterEntry[] = [];
  private sealSprites: Array<{ img: Phaser.GameObjects.Image; taken: boolean; guard: number | null; idx: number; pending?: boolean }> = [];
  private pedestal!: Phaser.Types.Physics.Arcade.SpriteWithStaticBody;
  private pedestalActive = false;
  private oneWayCollider: Phaser.Physics.Arcade.Collider | null = null;
  private dropThroughUntil = 0;
  private frozen = false;
  private over = false;
  private facing: 1 | -1 = 1;
  private lastGroundedAt = -9999;
  private jumpPressedAt = -9999;
  private jumpHeld = false;
  private pogoHeld = false;
  private onPogo = false;
  private fuel: FuelState | null = null;
  private regrabLockUntil = 0;
  private lookHeldSince = 0;
  private lookWant: -1 | 0 | 1 = 0;
  private lookDir: -1 | 0 | 1 = 0;
  private invulnUntil = 0;
  private wasMovingBeforeStand = false;
  private safePos = { x: 0, y: 0 };
  private checkpoint = { x: 0, y: 0 };
  private hearts = 3;
  private gluehwoerter = 0;
  private letters = 0;
  private words = 0;
  private combo = 0;
  private maxCombo = 0;
  private deaths = 0;
  private sealsCollected = 0;
  private contactIdx = 0;
  private startedAt = 0;
  private burst: Phaser.GameObjects.Particles.ParticleEmitter | null = null;
  private dust: Phaser.GameObjects.Particles.ParticleEmitter | null = null;
  private wasGrounded = false;
  private landingVy = 0;
  private baseScale = 1;
  private swingKey: Phaser.Input.Keyboard.Key | null = null;
  private swingHeld = false;
  private swingUntil = 0;
  private swingCooldownUntil = 0;
  private freedBySwing = 0;
  private camY = 0;
  private worldGravity: number = ARCADE.gravity;
  private bolts!: Phaser.Physics.Arcade.Group;
  // v2.2 verbs
  private poleCells = new Set<string>();
  private doorPairs: Array<{ id: string; aPx: { x: number; y: number }; bPx: { x: number; y: number } }> = [];
  private moverPlatforms: Array<{ s: Phaser.Types.Physics.Arcade.ImageWithDynamicBody; ax: number; ay: number; bx: number; by: number; toB: boolean; speed: number }> = [];
  private doorCooldownUntil = 0;
  private spaceHeld = false;
  private goalArrow: Phaser.GameObjects.Triangle | null = null;
  // v2.3 feel (source audit 2026-07-16)
  private slopeCells: Array<{ c: number; r: number; dir: 1 | -1 }> = [];
  private onSlope: { c: number; r: number; dir: 1 | -1 } | null = null;
  private spaceAirPress = false; // Keen's latch: held press fires on landing
  private lastPogoBounceAt = -9999;
  private sealedHintUntil = 0;
  private accessory: Phaser.GameObjects.Image | null = null;

  constructor(cfg: ArcadeConfig) {
    super("arcade");
    this.cfg = cfg;
  }

  static dimensions(): { width: number; height: number } {
    return { width: VIEW_W, height: VIEW_H };
  }

  /** Image-first (doc 28 §5): load every provided stem; a failed load simply
   *  leaves the procedural fallback in place (the OverworldScene doctrine). */
  preload(): void {
    for (const [stem, url] of Object.entries(this.cfg.art ?? {})) {
      this.load.image(`img-${stem}`, url);
    }
  }

  /** Image-over-procedural texture pick. */
  private itex(stem: string, fallback: string): string {
    const key = `img-${stem}`;
    return this.textures.exists(key) ? key : fallback;
  }

  create(): void {
    const { level, tier } = this.cfg;
    const motion = this.cfg.reducedMotion !== true;
    // v3 look: the platformer's OWN side-view art (auto-tiled terrain, posed
    // hero, themed cast) — resolved from the level's theme, never hardcoded
    const ptheme = resolvePlatformTheme(level.header.theme);
    const terrain = paintTerrain(this.cfg.seed, ptheme);
    const cast = paintCreatures(ptheme);
    const hero = paintHero(this.cfg.playerSeed ?? this.cfg.seed);
    const tex = (k: string): string => `ka-${k}`;
    const addCanvas = (key: string, cv: HTMLCanvasElement): void => {
      if (!this.textures.exists(key)) this.textures.addCanvas(key, cv);
    };
    for (const [key, img] of Object.entries(terrain.tiles)) addCanvas(tex(key), rasterize(img, 1));
    for (const [key, img] of Object.entries(cast.frames)) addCanvas(tex(key), rasterize(img, 1));
    for (const [pose, img] of Object.entries(hero.frames)) addCanvas(`h-${pose}`, rasterize(img, 1));
    for (const prop of ["pole", "seal", "gluehwort", "checkpoint", "checkpoint-lit", "pedestal", "pedestal-lit"] as const) {
      addCanvas(tex(prop), rasterize(paintPlatformProp(prop, ptheme, this.cfg.seed), 1));
    }
    addCanvas(tex("bossdoor"), rasterize(paintPlatformProp("bossdoor", ptheme, this.cfg.seed), 1));
    addCanvas(tex("bossdoor-on"), rasterize(paintPlatformProp("bossdoor-open", ptheme, this.cfg.seed), 1));

    // backdrop: sky gradient + the far page-hills silhouette (soft parallax —
    // a sanctioned deviation: Keen 4 has none, but our canvas can afford it)
    const bg = document.createElement("canvas");
    bg.width = 256; bg.height = 24 * TILE;
    const bgg = bg.getContext("2d")!;
    const grad = bgg.createLinearGradient(0, 0, 0, bg.height);
    grad.addColorStop(0, ptheme.sky[0]); grad.addColorStop(0.7, ptheme.sky[1]); grad.addColorStop(1, ptheme.sky[2]);
    bgg.fillStyle = grad; bgg.fillRect(0, 0, 256, bg.height);
    bgg.fillStyle = "rgba(120,110,200,0.08)";
    for (const [x, y, r] of [[40, 90, 26], [150, 60, 18], [210, 160, 30], [90, 230, 22], [30, 330, 16], [180, 300, 28], [120, 420, 20], [200, 520, 24], [60, 620, 18]] as const) {
      bgg.beginPath(); bgg.arc(x, y, r, 0, Math.PI * 2); bgg.fill();
    }
    addCanvas("ka-bg", bg);
    // the ink gradient ALWAYS paints the sky; generated layers sit on the
    // horizon as BANDS (the art is horizon-strip art, never full-bleed)
    this.add.tileSprite(0, 0, level.w * TILE, level.h * TILE, "ka-bg").setOrigin(0).setScrollFactor(0.35, 0.7);
    const horizonY = level.h * TILE - TILE * 5 - 120;
    const groundY = level.h * TILE - TILE * 5;
    if (this.textures.exists("img-bg_far")) {
      const src = this.textures.get("img-bg_far").getSourceImage() as HTMLImageElement;
      this.add.tileSprite(0, groundY - src.height, level.w * TILE * 2, src.height, "img-bg_far").setOrigin(0).setScrollFactor(0.35, 0.7).setAlpha(0.95);
    }
    if (this.textures.exists("img-bg_mid")) {
      const src = this.textures.get("img-bg_mid").getSourceImage() as HTMLImageElement;
      this.add.tileSprite(0, groundY - src.height, level.w * TILE * 2, src.height, "img-bg_mid").setOrigin(0).setScrollFactor(0.5, 0.85);
    } else if (!this.textures.exists("img-bg_far")) {
      addCanvas("ka-skyline", rasterize(paintSkyline(this.cfg.seed, ptheme), 1));
      // the silhouette band ends where the level's base ground begins
      this.add.tileSprite(0, horizonY, level.w * TILE * 2, 120, "ka-skyline").setOrigin(0).setScrollFactor(0.5, 0.85).setAlpha(0.9);
    }

    // ── the world (auto-tiled terrain: variants by edge exposure) ──
    const solidHere = new Set(level.solids.map((s) => `${s.c},${s.r}`));
    const slopeHere = new Map(level.slopes.map((s) => [`${s.c},${s.r}`, s] as const));
    const covered = (c: number, r: number): boolean => solidHere.has(`${c},${r}`) || slopeHere.has(`${c},${r}`);
    const solids = this.physics.add.staticGroup();
    for (const s of level.solids) {
      const mask = terrainMask(!covered(s.c, s.r - 1), !covered(s.c, s.r + 1), !covered(s.c - 1, s.r), !covered(s.c + 1, s.r));
      const b = solids.create(s.c * TILE + TILE / 2, s.r * TILE + TILE / 2, tex(`earth-${mask}`)) as Phaser.Types.Physics.Arcade.SpriteWithStaticBody;
      b.setDisplaySize(TILE, TILE).refreshBody();
      const sb = b.body as Phaser.Physics.Arcade.StaticBody;
      // a solid flanking a slope must not WALL the ramp (Keen skips the feet
      // row on slopes, ck_phys.c:316) — drop collision on the slope-facing side
      if (slopeHere.has(`${s.c - 1},${s.r}`)) sb.checkCollision.left = false;
      if (slopeHere.has(`${s.c + 1},${s.r}`)) sb.checkCollision.right = false;
    }
    // slopes render as wedges; NO arcade body — update() ground-follows them
    for (const s of level.slopes) {
      this.slopeCells.push(s);
      this.add.image(s.c * TILE + TILE / 2, s.r * TILE + TILE / 2, tex(`slope-${s.dir}`));
    }
    const oneWays = this.physics.add.staticGroup();
    const addOneWay = (c: number, r: number, helper: boolean): void => {
      const b = oneWays.create(c * TILE + TILE / 2, r * TILE + TILE / 2 - 14, tex("oneway")) as Phaser.Types.Physics.Arcade.SpriteWithStaticBody;
      b.setDisplaySize(TILE, 20).refreshBody();
      if (helper) b.setTint(0x9fd8a4); // easy-mode scaffolding reads as such
      const body = b.body as Phaser.Physics.Arcade.StaticBody;
      body.checkCollision.down = false;
      body.checkCollision.left = false;
      body.checkCollision.right = false;
    };
    for (const p of level.oneWays) addOneWay(p.c, p.r, false);
    for (const hp of helpersFor(level.header, tier)) {
      for (let i = 0; i < hp.w; i += 1) addOneWay(hp.c + i, hp.r, true);
    }
    const spikes = this.physics.add.staticGroup();
    for (const hz of level.hazards) {
      const b = spikes.create(hz.c * TILE + TILE / 2, hz.r * TILE + TILE / 2, tex("spikes")) as Phaser.Types.Physics.Arcade.SpriteWithStaticBody;
      b.setDisplaySize(TILE, TILE).refreshBody();
      (b.body as Phaser.Physics.Arcade.StaticBody).setSize(TILE - 12, 22).setOffset(6, TILE - 22);
    }

    // ── v2.2: poles (the vertical switchboard — climb up, slide down) ──
    for (const p of level.poles) {
      this.poleCells.add(`${p.c},${p.r}`);
      this.add.image(p.c * TILE + TILE / 2, p.r * TILE + TILE / 2, tex("pole")).setDepth(1);
    }

    // ── v2.2: in-level door pairs (sub-rooms on one canvas, Keen 4 grammar) ──
    for (const d of level.doors) {
      addCanvas(tex(`door-${d.id}`), paintLevelDoor(d.id));
      const px = (cell: { c: number; r: number }): { x: number; y: number } => ({ x: cell.c * TILE + TILE / 2, y: cell.r * TILE + TILE / 2 });
      const aPx = px(d.a);
      const bPx = px(d.b);
      for (const at of [aPx, bPx]) {
        // refoundation W3 (Koki): the hero renders IN FRONT of the arch —
        // the over-player sandwich read as "I'm stuck behind the door"
        this.add.image(at.x, at.y + TILE / 2 - 36, tex(`door-${d.id}`)).setDepth(3);
        const hint = this.add.text(at.x, at.y - TILE * 0.9, "↑", { fontFamily: "system-ui, sans-serif", fontSize: "16px", fontStyle: "bold", color: "#cfc7ff" }).setOrigin(0.5).setDepth(7).setAlpha(0.85);
        if (motion) this.tweens.add({ targets: hint, y: hint.y - 5, duration: 900, yoyo: true, repeat: -1, ease: "Sine.easeInOut" });
      }
      this.doorPairs.push({ id: d.id, aPx, bPx });
    }

    // ── v2.2: movers (patrolling platforms; one-way — ride on top) ──
    const moverGroup = this.physics.add.group({ allowGravity: false, immovable: true });
    for (const m of level.header.movers ?? []) {
      addCanvas(tex(`mover-${m.w}`), rasterize(paintMoverBook(m.w, ptheme), 1));
      const ax = m.c1 * TILE + (m.w * TILE) / 2;
      const ay = m.r1 * TILE + 10;
      const bx = m.c2 * TILE + (m.w * TILE) / 2;
      const by = m.r2 * TILE + 10;
      const s = moverGroup.create(ax, ay, tex(`mover-${m.w}`)) as Phaser.Types.Physics.Arcade.ImageWithDynamicBody;
      s.setDepth(2);
      s.body.setSize(m.w * TILE, 12); // ride the book's COVER; pages hang below
      s.body.setOffset(0, 2);
      s.body.checkCollision.down = false;
      s.body.checkCollision.left = false;
      s.body.checkCollision.right = false;
      const dist = Math.hypot(bx - ax, by - ay);
      this.moverPlatforms.push({ s, ax, ay, bx, by, toB: true, speed: (dist / (m.periodMs / 2)) * 1000 });
    }

    // letters — real glyphs being rescued
    const letterGroup = this.physics.add.staticGroup();
    const GLYPHS = "TINTENWORT";
    level.letters.forEach((l, i) => {
      const x = l.c * TILE + TILE / 2;
      const y = l.r * TILE + TILE / 2;
      const disc = this.add.circle(x, y, 14, 0x8b7cf5, 0.28);
      const t = this.add.text(x, y, GLYPHS[i % GLYPHS.length]!, { fontFamily: "system-ui, sans-serif", fontSize: "20px", fontStyle: "bold", color: "#e8e6f5" }).setOrigin(0.5);
      const zone = letterGroup.create(x, y, undefined as unknown as string) as Phaser.Types.Physics.Arcade.SpriteWithStaticBody;
      zone.setVisible(false).setDisplaySize(64, 64).refreshBody(); // W3: forgiving pickup
      const entry: LetterEntry = { c: l.c, r: l.r, taken: false, stolenBy: null, bits: [disc, t], zone };
      zone.setData("entry", entry);
      this.letterEntries.push(entry);
      if (motion) this.tweens.add({ targets: [disc, t], y: y - 4, duration: 900 + (i % 3) * 120, yoyo: true, repeat: -1, ease: "Sine.easeInOut" });
    });

    // Glühwörter — words Jona never erased, still glowing (bible 27 §5.2);
    // off the beaten path by authoring, free-hint sparks by economy
    const gluehGroup = this.physics.add.staticGroup();
    level.gluehwoerter.forEach((gw, i) => {
      const x = gw.c * TILE + TILE / 2;
      const y = gw.r * TILE + TILE / 2;
      const img = this.add.image(x, y, tex("gluehwort")).setDepth(3);
      const zone = gluehGroup.create(x, y, undefined as unknown as string) as Phaser.Types.Physics.Arcade.SpriteWithStaticBody;
      zone.setVisible(false).setDisplaySize(64, 56).refreshBody(); // W3: forgiving pickup
      zone.setData("img", img).setData("taken", false);
      if (motion) {
        this.tweens.add({ targets: img, y: y - 5, duration: 1000 + (i % 3) * 140, yoyo: true, repeat: -1, ease: "Sine.easeInOut" });
        this.tweens.add({ targets: img, alpha: { from: 1, to: 0.65 }, duration: 760, yoyo: true, repeat: -1 });
      }
    });
    // (the pickup overlap registers AFTER the player exists — see below)

    // checkpoints — banner poles (grey until reached, the chapter color after)
    const cpGroup = this.physics.add.staticGroup();
    for (const cp of level.checkpoints) {
      const x = cp.c * TILE + TILE / 2;
      const y = cp.r * TILE + TILE / 2;
      const img = this.add.image(x, y, tex("checkpoint")).setDepth(1);
      const zone = cpGroup.create(x, y, undefined as unknown as string) as Phaser.Types.Physics.Arcade.SpriteWithStaticBody;
      zone.setVisible(false).setDisplaySize(TILE, TILE * 1.5).refreshBody();
      zone.setData("img", img);
    }

    // seals + pedestal (the gem-socket grammar)
    level.header.seals.forEach((s, i) => {
      const img = this.add.image(s.c * TILE + TILE / 2, s.r * TILE + TILE / 2, tex("seal")).setDepth(5);
      if (motion) this.tweens.add({ targets: img, y: img.y - 5, duration: 1100 + i * 150, yoyo: true, repeat: -1, ease: "Sine.easeInOut" });
      this.sealSprites.push({ img, taken: false, guard: s.guard, idx: i });
    });
    this.cfg.onSeals(0, level.header.seals.length);
    // the exit: legacy pedestal ('A') or the guardian's sealed door ('B')
    const exitCell = level.bossDoor ?? level.pedestal;
    this.pedestal = this.physics.add.staticGroup().create(exitCell.c * TILE + TILE / 2, exitCell.r * TILE, tex(level.bossDoor ? "bossdoor" : "pedestal")) as Phaser.Types.Physics.Arcade.SpriteWithStaticBody;
    this.pedestal.setDisplaySize(TILE, TILE * 2).refreshBody();

    // ── the player ──
    const startPx = { x: level.start.c * TILE + TILE / 2, y: level.start.r * TILE + TILE / 2 };
    this.safePos = { ...startPx };
    this.checkpoint = { ...startPx };
    this.player = this.physics.add.sprite(startPx.x, startPx.y, "h-stand");
    this.player.setDisplaySize(TILE, TILE);
    this.player.setDepth(4); // Keen's z-ladder: terrain 0 · props 1-2 · items 3 · player 4 · fore-foreground 6
    // doc 28 §4: the first provided accessory overlay (unlockables wave adds selection)
    const accStem = Object.keys(this.cfg.art ?? {}).find((s) => s.startsWith("acc_"));
    if (accStem !== undefined && this.textures.exists(`img-${accStem}`)) {
      this.accessory = this.add.image(startPx.x, startPx.y, `img-${accStem}`).setDepth(5).setDisplaySize(TILE, TILE);
    }
    this.baseScale = this.player.scaleY;
    this.syncHeroBody();
    this.player.body.setMaxVelocityY(ARCADE.maxFall);
    this.worldGravity = gravityFor(tier);
    this.physics.world.gravity.y = this.worldGravity;
    this.physics.world.setBounds(0, 0, level.w * TILE, level.h * TILE);
    this.player.setCollideWorldBounds(true);
    this.physics.add.collider(this.player, solids);
    this.oneWayCollider = this.physics.add.collider(this.player, oneWays, undefined, () => {
      // drop-through: the collider stands down while passing (look-down + jump);
      // pole rides pass straight through platforms too (v2.2)
      return this.time.now >= this.dropThroughUntil && this.player.body.velocity.y >= 0 && this.pstate.kind !== "climb";
    });
    this.physics.add.collider(this.player, moverGroup);
    this.physics.add.overlap(this.player, spikes, () => this.hurt("spikes"));
    this.physics.add.overlap(this.player, letterGroup, (_p, zone) => this.collectLetter((zone as Phaser.Types.Physics.Arcade.SpriteWithStaticBody).getData("entry") as LetterEntry));
    this.physics.add.overlap(this.player, gluehGroup, (_p, z) => {
      const zone = z as Phaser.Types.Physics.Arcade.SpriteWithStaticBody;
      if (zone.getData("taken") === true) return;
      zone.setData("taken", true);
      zone.disableBody(true, false);
      const img = zone.getData("img") as Phaser.GameObjects.Image;
      this.gluehwoerter += 1;
      this.cfg.onGluehwoerter?.(this.gluehwoerter);
      playSfx("chime-close");
      this.tweens.killTweensOf(img);
      if (this.cfg.reducedMotion === true) img.setVisible(false);
      else {
        this.burst?.explode(10, img.x, img.y);
        this.tweens.add({ targets: img, y: img.y - 50, alpha: 0, scale: 1.5, duration: 560, ease: "Back.easeIn", onComplete: () => img.setVisible(false) });
      }
    });
    this.physics.add.overlap(this.player, cpGroup, (_p, zone) => this.reachCheckpoint(zone as Phaser.Types.Physics.Arcade.SpriteWithStaticBody));
    this.physics.add.overlap(this.player, this.pedestal, () => this.tryComplete());

    // ── creatures (population = the tier's placements) ──
    this.bolts = this.physics.add.group({ allowGravity: false });
    this.physics.add.overlap(this.player, this.bolts, (_p, b) => {
      (b as Phaser.Types.Physics.Arcade.SpriteWithDynamicBody).destroy();
      this.hurt("bolt");
    });
    placementsFor(level.header, tier).forEach((e, i) => {
      const s = this.physics.add.sprite(e.c * TILE + TILE / 2, e.r * TILE + TILE / 2 + 5, this.itex(`${e.kind}-0`, tex(`${e.kind}-0`)));
      s.setDisplaySize(TILE, TILE);
      s.setDepth(4);
      // alignment law: 30×26 DISPLAY px, feet 10px above the drawn bottom —
      // converted per texture (generated 256px frames shrank the old fixed body)
      {
        const csx = Math.abs(s.scaleX) || 1;
        const csy = Math.abs(s.scaleY) || 1;
        const cw = 30 / csx;
        const chh = 26 / csy;
        s.body.setSize(cw, chh).setOffset((s.frame.realWidth - cw) / 2, s.frame.realHeight - chh - 10 / csy);
      }
      if (e.kind === "flyer" || e.kind === "cloud" || e.kind === "thief") s.body.setAllowGravity(false);
      else this.physics.add.collider(s, solids);
      const creature: Creature = { kind: e.kind, sprite: s, dir: i % 2 === 0 ? 1 : -1, homeY: s.y, nextHopAt: 800 + i * 400, stunned: false, escaped: false, idx: i, cloud: { kind: "sleep" }, stars: null };
      this.creatures.push(creature);
      this.physics.add.overlap(this.player, s, () => this.contact(creature));
      if (motion && e.kind !== "flyer" && e.kind !== "cloud") {
        this.tweens.add({ targets: s, scaleY: { from: s.scaleY, to: s.scaleY * 0.92 }, duration: 700 + i * 90, yoyo: true, repeat: -1, ease: "Sine.easeInOut" });
      }
    });

    // fx
    const spark = document.createElement("canvas");
    spark.width = 8; spark.height = 8;
    const sg = spark.getContext("2d")!;
    sg.fillStyle = "#cfc7ff"; sg.beginPath(); sg.arc(4, 4, 3, 0, Math.PI * 2); sg.fill();
    addCanvas("ka-spark", spark);
    this.burst = this.add.particles(0, 0, "ka-spark", { speed: { min: 60, max: 240 }, angle: { min: 0, max: 360 }, scale: { start: 1.2, end: 0 }, alpha: { start: 1, end: 0 }, lifespan: { min: 240, max: 520 }, gravityY: 300, emitting: false }).setDepth(5);
    this.dust = this.add.particles(0, 0, "ka-spark", { speed: { min: 20, max: 70 }, angle: { min: 200, max: 340 }, scale: { start: 0.7, end: 0 }, alpha: { start: 0.5, end: 0 }, lifespan: 260, tint: 0x9aa0b8, emitting: false }).setDepth(4);

    const kb = this.input.keyboard;
    if (kb) {
      this.cursors = kb.createCursorKeys();
      this.wasd = kb.addKeys("W,A,S,D") as typeof this.wasd;
      // refoundation W3: X = Federstab swing (the combat verb), C = pogo
      this.swingKey = kb.addKey(Phaser.Input.Keyboard.KeyCodes.X);
      this.pogoKey = kb.addKey(Phaser.Input.Keyboard.KeyCodes.C);
    }

    // Keen camera: MANUAL — dead-band horizontal, grounded-gated vertical
    this.cameras.main.setBounds(0, 0, level.w * TILE, level.h * TILE);
    this.camY = Phaser.Math.Clamp(cameraTargetY(this.player.y, VIEW_H, 0), 0, level.h * TILE - VIEW_H);
    this.cameras.main.setScroll(Phaser.Math.Clamp(this.player.x - VIEW_W / 2, 0, level.w * TILE - VIEW_W), this.camY);
    if (motion) this.cameras.main.fadeIn(240, 20, 18, 33);
    this.startedAt = this.time.now;
    this.frozen = this.cfg.startFrozen === true; // the goal card releases it
  }

  /** v2.2: the goal card holds the world until the student says go. Only
   *  valid before first contact (quickfire owns `frozen` after that). */
  setRunning(running: boolean): void {
    this.frozen = !running;
  }

  /** Dev-harness only: teleport to a cell — headless playtests can't air-steer
   *  (P-37b), so route setup needs a warp. */
  debugWarp(c: number, r: number): void {
    this.player.setPosition(c * TILE + TILE / 2, r * TILE + TILE / 2);
    this.player.body.setVelocity(0, 0);
  }

  /** Dev-harness only: force the seal gate open so the boss-door handoff is
   *  drivable headless (earning both seals needs real quickfire play). */
  debugUnseal(): void {
    this.sealsCollected = this.cfg.level.header.seals.length;
    this.cfg.onSeals(this.sealsCollected, this.sealsCollected);
    if (!this.pedestalActive) this.activatePedestal();
  }

  /** The Federstab swing (doc 29 combat verb): a short quill sweep that
   *  UNKNOTS one nearby creature — the word is freed, never killed. Contact
   *  task-duels (quickfire) stay for creatures you touch; the swing is the
   *  fight verb Koki asked for, kid-safe by fiction. */
  private doSwing(now: number): void {
    if (now < this.swingCooldownUntil || this.frozen || this.over) return;
    if (this.pstate.kind !== "normal" || this.onPogo) return;
    this.swingCooldownUntil = now + 450;
    this.swingUntil = now + 240;
    const dir: 1 | -1 = this.player.flipX ? -1 : 1;
    // visual: generated swing frames when present (batch T), else squash + arc
    if (this.textures.exists("img-hero_swing1")) {
      this.swapHeroTexture("img-hero_swing1");
      this.time.delayedCall(120, () => {
        if (this.textures.exists("img-hero_swing2") && this.time.now < this.swingUntil + 80) this.swapHeroTexture("img-hero_swing2");
      });
    } else if (this.cfg.reducedMotion !== true) {
      this.squashStretch(1.06, 1.14);
    }
    const ax = this.player.x + dir * TILE * 0.9;
    this.burst?.explode(10, ax, this.player.y - 4);
    for (const c of this.creatures) {
      if (c.stunned || c.escaped) continue;
      if (Math.abs(c.sprite.x - ax) < TILE * 0.8 && Math.abs(c.sprite.y - this.player.y) < TILE * 0.75) {
        this.freeCreature(c);
        break; // one word per swing
      }
    }
  }

  /** Unknot: the creature dissolves into freed letters (kid-safe defeat). */
  private freeCreature(c: Creature): void {
    c.escaped = true; // reuses every existing "gone" guard (contact, counters)
    this.freedBySwing += 1;
    this.burst?.explode(14, c.sprite.x, c.sprite.y);
    c.stars?.destroy();
    this.tweens.add({ targets: c.sprite, alpha: 0, y: c.sprite.y - 26, duration: 300, onComplete: () => c.sprite.destroy() });
  }

  /** Texture swap + display size + baseScale + body resync in one move. */
  private swapHeroTexture(key: string): void {
    this.player.setTexture(key);
    this.player.setDisplaySize(TILE, TILE);
    this.baseScale = this.player.scaleY;
    this.syncHeroBody();
  }

  /** THE ALIGNMENT LAW (refoundation W3): the hero's body is authored in
   *  DISPLAY pixels (20×40, feet 2px above the drawn bottom) and re-derived in
   *  texture units for the CURRENT texture. Without this, a 256px generated
   *  frame at scale ~0.19 shrank the once-set 20×40 texture-unit body to
   *  ~4×8px — the drawn hero hung below the physics feet and read as standing
   *  UNDER platforms and BEHIND doors (Koki's playthrough verdict). */
  private syncHeroBody(): void {
    const sx = Math.abs(this.player.scaleX) || 1;
    const sy = Math.abs(this.player.scaleY) || 1;
    const fw = this.player.frame.realWidth;
    const fh = this.player.frame.realHeight;
    const bw = 20 / sx;
    const bh = 40 / sy;
    this.player.body.setSize(bw, bh).setOffset((fw - bw) / 2, fh - bh - 2 / sy);
  }

  /** Swap the hero pose texture (48×48 frames share one display size).
   *  Generated hero (doc 28 §4: `hero_<pose>` stems) wins over procedural. */
  private setPose(pose: HeroPose): void {
    const key = this.itex(`hero_${pose}`, `h-${pose}`);
    if (this.player.texture.key !== key && this.textures.exists(key)) {
      this.player.setTexture(key);
      this.player.setDisplaySize(TILE, TILE);
      // texture sizes differ (procedural 48px vs generated 256px) — baseScale
      // must follow the CURRENT texture or squashStretch restores a giant
      this.baseScale = this.player.scaleY;
      this.syncHeroBody(); // alignment law: the body follows the texture too
    }
    // doc 28 §4: the unlockable accessory rides every pose (overlay sprite)
    if (this.accessory) {
      this.accessory.setPosition(this.player.x, this.player.y);
      this.accessory.setFlipX(this.player.flipX);
      this.accessory.setAlpha(this.player.alpha);
    }
  }

  /** Read-only snapshot for the `__domigoArcade` machine-playtest harness. */
  debugState(): Record<string, number | boolean | string> {
    return {
      x: Math.round(this.player?.x ?? 0),
      y: Math.round(this.player?.y ?? 0),
      vx: Math.round(this.player?.body?.velocity.x ?? 0),
      vy: Math.round(this.player?.body?.velocity.y ?? 0),
      grounded: this.player?.body?.blocked.down ?? false,
      state: this.pstate.kind,
      onPogo: this.onPogo,
      fuelMs: Math.round(this.fuel?.fuelMs ?? 0),
      hearts: this.hearts,
      letters: this.letters,
      gluehwoerter: this.gluehwoerter,
      words: this.words,
      combo: this.combo,
      seals: this.sealsCollected,
      sealsTotal: this.cfg.level.header.seals.length,
      deaths: this.deaths,
      pedestalActive: this.pedestalActive,
      frozen: this.frozen,
      over: this.over,
      creaturesLeft: this.creatures.filter((e) => !e.stunned && !e.escaped).length,
      freedBySwing: this.freedBySwing,
      // alignment-law probes: the drawn feet and the physics feet must agree
      drawnFeetY: Math.round(this.player ? this.player.y + this.player.displayHeight / 2 : 0),
      bodyFeetY: Math.round(this.player?.body ? this.player.body.y + this.player.body.height : 0),
      tier: this.cfg.tier,
      fps: Math.round(this.game.loop.actualFps),
      camY: Math.round(this.cameras.main.scrollY),
      lookDir: this.lookDir,
      // v2.2: mover positions ("x,y|x,y") — playtest harnesses assert patrol
      movers: this.moverPlatforms.map((m) => `${Math.round(m.s.x)},${Math.round(m.s.y)}`).join("|"),
      onSlope: this.onSlope !== null,
      tex: this.player.texture.key,
      dispW: Math.round(this.player.displayWidth),
      accW: this.accessory ? Math.round(this.accessory.displayWidth) : -1,
      heroObjs: this.children.list
        .filter((o) => "texture" in o && /hero|h-/.test((o as Phaser.GameObjects.Image).texture?.key ?? ""))
        .map((o) => `${(o as Phaser.GameObjects.Image).texture.key}:${Math.round((o as Phaser.GameObjects.Image).displayWidth)}@${Math.round((o as Phaser.GameObjects.Image).x)},${Math.round((o as Phaser.GameObjects.Image).y)}`)
        .join(" | "),
    };
  }

  private collectLetter(entry: LetterEntry): void {
    if (entry.taken) return;
    entry.taken = true;
    entry.stolenBy = null;
    entry.zone.disableBody(true, false);
    this.letters += 1;
    this.cfg.onLetters(this.letters);
    playSfx("tick");
    if (this.cfg.reducedMotion === true) entry.bits.forEach((b) => (b as Phaser.GameObjects.Image).setAlpha(0.15));
    else {
      this.burst?.explode(8, entry.zone.x, entry.zone.y);
      this.tweens.add({ targets: entry.bits, y: "-=26", alpha: 0, duration: 320, ease: "Back.easeIn" });
    }
  }

  private reachCheckpoint(zone: Phaser.Types.Physics.Arcade.SpriteWithStaticBody): void {
    if (zone.getData("done") === true) return;
    zone.setData("done", true);
    this.checkpoint = { x: zone.x, y: zone.y };
    const img = zone.getData("img") as Phaser.GameObjects.Image;
    img.setTexture("ka-checkpoint-lit");
    playSfx("chime-correct");
    if (this.cfg.reducedMotion !== true) {
      this.burst?.explode(10, zone.x, zone.y - 10);
      this.tweens.add({ targets: img, angle: { from: -8, to: 0 }, duration: 400, ease: "Back.easeOut" });
    }
  }

  /** Contact with a creature: taskable → freeze + quickfire; cushion → bounce. */
  private contact(creature: Creature): void {
    if (creature.stunned || creature.escaped || this.frozen || this.over || this.pstate.kind === "dying") return;
    if (creature.kind === "cushion") {
      // Sprungkissen: land on top → a pogo-grade launch (harmless rideable)
      if (this.player.body.velocity.y > 40 && this.player.y < creature.sprite.y - 8) {
        this.player.setVelocityY(ARCADE.cushionBounceVy);
        playSfx("whoosh");
        if (this.cfg.reducedMotion !== true) {
          this.tweens.add({ targets: creature.sprite, scaleY: { from: creature.sprite.scaleY * 0.6, to: creature.sprite.scaleY }, duration: 260, ease: "Back.easeOut" });
          this.dust?.explode(8, creature.sprite.x, creature.sprite.y - 10);
        }
      }
      return;
    }
    if (creature.kind === "cloud") return; // the body is harmless; only the bolt bites
    if (!TASKABLE[creature.kind] || this.time.now < this.invulnUntil) return;
    this.frozen = true;
    this.physics.world.pause();
    this.tweens.timeScale = 0.0001;
    creature.sprite.setData("engaged", true);
    if (this.cfg.reducedMotion !== true) this.cameras.main.zoomTo(1.18, 160, "Sine.easeOut");
    playSfx("pop");
    this.cfg.onQuickfire(this.contactIdx);
    this.contactIdx += 1;
  }

  /** React reports the verdict. Correct → STUN (dizzy stars, seal released).
   *  Wrong → the creature ESCAPES with a letter. No hearts either way (§5.2). */
  resolveQuickfire(correct: boolean): void {
    const creature = this.creatures.find((e) => e.sprite.getData("engaged") === true);
    this.frozen = false;
    this.physics.world.resume();
    this.tweens.timeScale = 1;
    if (this.cfg.reducedMotion !== true) this.cameras.main.zoomTo(1, 180, "Sine.easeOut");
    this.words += 1;
    if (creature) {
      creature.sprite.setData("engaged", false);
      if (correct) this.stunCreature(creature);
      else this.escapeCreature(creature);
    }
    if (correct) {
      this.combo += 1;
      this.maxCombo = Math.max(this.maxCombo, this.combo);
      const pts = comboPoints(this.combo);
      this.cfg.onCombo(this.combo, pts);
      playSfx(this.combo >= 3 ? "streak" : "chime-correct");
      if (this.cfg.reducedMotion !== true && creature) {
        const t = this.add.text(creature.sprite.x, creature.sprite.y - 20, `+${pts}`, { fontFamily: "system-ui, sans-serif", fontSize: "22px", fontStyle: "bold", color: "#ffe066" }).setOrigin(0.5).setDepth(6);
        this.tweens.add({ targets: t, y: t.y - 40, alpha: 0, duration: 700, ease: "Sine.easeOut", onComplete: () => t.destroy() });
      }
    } else {
      this.combo = 0;
      this.cfg.onCombo(0, 0);
    }
    this.invulnUntil = this.time.now + ARCADE.iframesMs;
  }

  /** The non-violent defeat: frozen in place with dizzy stars (Keen 5/6). */
  private stunCreature(creature: Creature): void {
    creature.stunned = true;
    const s = creature.sprite;
    s.body.stop();
    s.body.setAllowGravity(creature.kind === "walker" || creature.kind === "hopper");
    this.tweens.killTweensOf(s);
    s.setAlpha(0.85);
    creature.stars = this.add.text(s.x, s.y - 26, "✶ ✶ ✶", { fontFamily: "system-ui, sans-serif", fontSize: "13px", color: "#cfc7ff" }).setOrigin(0.5).setDepth(6);
    if (this.cfg.reducedMotion !== true) {
      this.burst?.explode(14, s.x, s.y);
      this.tweens.add({ targets: creature.stars, angle: { from: -8, to: 8 }, duration: 600, yoyo: true, repeat: -1, ease: "Sine.easeInOut" });
    }
    // a stunned thief returns everything it stole
    if (creature.kind === "thief") this.restoreStolen(creature.idx);
    // seal release: this creature guarded one → it flies free
    const seal = this.sealSprites.find((x) => !x.taken && x.guard !== null && this.creatures[x.guard]?.idx === creature.idx);
    if (seal) this.releaseSeal(seal, s.x, s.y);
  }

  /** Wrong answer: the creature slinks away WITH a letter (loss = theft, §5.2). */
  private escapeCreature(creature: Creature): void {
    creature.escaped = true;
    const s = creature.sprite;
    s.body.stop();
    s.body.setAllowGravity(false);
    s.body.enable = false;
    this.tweens.killTweensOf(s);
    // it grabs a letter on the way out (if there is one to grab)
    const held = this.letterEntries.filter((l) => l.taken && l.stolenBy === null);
    if (this.letters > 0 && held.length > 0) {
      this.letters -= 1;
      this.cfg.onLetters(this.letters);
      held[held.length - 1]!.stolenBy = creature.idx; // remembered, never restored (it's gone)
    }
    // its seal (if any) drops in place as a slow touch-pickup — never blocked (§4.3)
    const seal = this.sealSprites.find((x) => !x.taken && x.guard !== null && this.creatures[x.guard]?.idx === creature.idx);
    if (seal) {
      seal.guard = null;
      this.tweens.add({ targets: seal.img, x: s.x, y: s.y - 8, duration: this.cfg.reducedMotion === true ? 0 : 420, ease: "Sine.easeInOut" });
      seal.img.setPosition(s.x, s.y - 8);
    }
    playSfx("thud");
    if (this.cfg.reducedMotion === true) s.setVisible(false);
    else {
      this.tweens.add({ targets: s, x: s.x + (s.x < this.player.x ? -140 : 140), alpha: 0, duration: 460, ease: "Sine.easeIn", onComplete: () => s.setVisible(false) });
    }
  }

  private restoreStolen(thiefIdx: number): void {
    for (const entry of this.letterEntries) {
      if (entry.stolenBy !== thiefIdx) continue;
      entry.taken = false;
      entry.stolenBy = null;
      entry.zone.enableBody(false, entry.zone.x, entry.zone.y, true, true);
      entry.bits.forEach((b) => {
        const img = b as Phaser.GameObjects.Image;
        img.setAlpha(1);
        img.setY(entry.r * TILE + TILE / 2);
      });
    }
  }

  /** The seal gate (doc 29 §4): with a story-task pack, releasing a seal first
   *  asks its TYPED task (hint ladder, no timer) — the scene freezes while the
   *  DOM card resolves; without a pack, release is immediate (unchanged). */
  private releaseSeal(seal: { img: Phaser.GameObjects.Image; taken: boolean; idx: number; pending?: boolean }, fromX: number, fromY: number): void {
    if (seal.taken || seal.pending === true) return;
    const gate = this.cfg.onSealTask;
    if (gate) {
      seal.pending = true;
      const handled = gate(
        seal.idx,
        () => { seal.pending = false; this.frozen = false; this.doReleaseSeal(seal, fromX, fromY); },
        () => { seal.pending = false; this.frozen = false; },
      );
      if (handled) { this.frozen = true; return; }
      seal.pending = false;
    }
    this.doReleaseSeal(seal, fromX, fromY);
  }

  private doReleaseSeal(seal: { img: Phaser.GameObjects.Image; taken: boolean; idx: number }, fromX: number, fromY: number): void {
    seal.taken = true;
    this.sealsCollected += 1;
    this.cfg.onSeals(this.sealsCollected, this.cfg.level.header.seals.length);
    playSfx("streak");
    const img = seal.img;
    this.tweens.killTweensOf(img);
    if (this.cfg.reducedMotion === true) img.setVisible(false);
    else {
      img.setPosition(fromX, fromY - 10);
      this.tweens.add({ targets: img, y: img.y - 60, alpha: 0, scale: 1.6, duration: 620, ease: "Back.easeIn", onComplete: () => img.setVisible(false) });
      this.burst?.explode(12, fromX, fromY);
    }
    if (this.sealsCollected >= this.cfg.level.header.seals.length) this.activatePedestal();
  }

  private activatePedestal(): void {
    this.pedestalActive = true;
    this.pedestal.setTexture(this.cfg.level.bossDoor ? "ka-bossdoor-on" : "ka-pedestal-lit");
    playSfx("whoosh");
    if (this.cfg.reducedMotion !== true) {
      this.burst?.explode(18, this.pedestal.x, this.pedestal.y);
      this.tweens.add({ targets: this.pedestal, alpha: { from: 0.7, to: 1 }, duration: 500, yoyo: true, repeat: -1 });
    }
  }

  private tryComplete(): void {
    if (!this.pedestalActive) {
      // the sealed door TALKS (goal-clarity law): silence here read as a bug
      if (!this.over && this.time.now >= this.sealedHintUntil) {
        this.sealedHintUntil = this.time.now + 2500;
        playSfx("thud");
        const missing = this.cfg.level.header.seals.length - this.sealsCollected;
        const t = this.add
          .text(this.pedestal.x, this.pedestal.y - 60, `Noch versiegelt!\n⬧ ${missing} Siegel fehl${missing === 1 ? "t" : "en"}`, {
            fontFamily: "system-ui, sans-serif", fontSize: "15px", fontStyle: "bold", color: "#ffe082", align: "center",
            stroke: "#191624", strokeThickness: 4,
          })
          .setOrigin(0.5, 1)
          .setDepth(30);
        this.tweens.add({ targets: t, y: t.y - 14, alpha: { from: 1, to: 0 }, duration: this.cfg.reducedMotion === true ? 600 : 1900, ease: "Sine.easeIn", onComplete: () => t.destroy() });
      }
      return;
    }
    if (this.over) return;
    this.over = true;
    this.player.setVelocity(0, 0);
    playSfx("chime-correct");
    if (this.cfg.reducedMotion !== true) {
      this.burst?.explode(24, this.pedestal.x, this.pedestal.y - 30);
      this.cameras.main.fadeOut(500, 20, 18, 33);
    }
    // v2.1 boss-door levels hand over to the duel instead of completing —
    // the stats CARRY (one pool, one run; bible 27 §2b)
    if (this.cfg.level.bossDoor !== null && this.cfg.onBossDoor) {
      this.cfg.onBossDoor({ hearts: this.hearts, letters: this.letters, gluehwoerter: this.gluehwoerter, words: this.words, maxCombo: this.maxCombo, seals: this.sealsCollected, deaths: this.deaths, ms: this.time.now - this.startedAt });
      return;
    }
    this.cfg.onComplete({ ms: this.time.now - this.startedAt, maxCombo: this.maxCombo, letters: this.letters, words: this.words, seals: this.sealsCollected, deaths: this.deaths, gluehwoerter: this.gluehwoerter });
  }

  private hurt(source: "spikes" | "bolt"): void {
    if (this.over || this.pstate.kind === "dying" || this.time.now < this.invulnUntil) return;
    this.invulnUntil = this.time.now + ARCADE.iframesMs;
    this.hearts -= 1;
    this.cfg.onHearts(this.hearts);
    playSfx("thud");
    this.onPogo = false;
    if (this.hearts <= 0) {
      this.die();
      return;
    }
    if (source === "spikes") {
      this.player.setVelocity(0, -430);
      this.time.delayedCall(260, () => {
        if (!this.over && this.pstate.kind !== "dying") this.player.setPosition(this.safePos.x, this.safePos.y).setVelocity(0, 0);
      });
    } else {
      // ink bolt: knockback away from the strike
      this.player.setVelocity(this.player.body.velocity.x > 0 ? -ARCADE.knockbackX : ARCADE.knockbackX, ARCADE.knockbackY);
    }
    if (this.cfg.reducedMotion !== true) {
      this.player.setTintFill(0xff6b6b);
      this.time.delayedCall(140, () => this.player.clearTint());
      this.cameras.main.shake(90, 0.006);
    }
  }

  /** The Keen death doctrine: a watched physics event — pop up-and-away, then
   *  the Rettungsaufgabe (§5.3). Never an instant cut. */
  private die(): void {
    this.pstate = { kind: "dying" };
    this.deaths += 1;
    this.fuel = null;
    this.player.body.checkCollision.none = true;
    this.player.setVelocity(this.facing * -160, -520);
    if (this.cfg.reducedMotion !== true) {
      this.tweens.add({ targets: this.player, angle: this.facing * -200, duration: 900, ease: "Sine.easeIn" });
      this.cameras.main.shake(140, 0.008);
    }
    this.time.delayedCall(this.cfg.reducedMotion === true ? 400 : 950, () => {
      this.physics.world.pause();
      this.cfg.onRescue(this.deaths);
    });
  }

  /** The rescue was earned: back at the checkpoint with 2 hearts (§5.3). */
  respawn(): void {
    this.physics.world.resume();
    this.player.body.checkCollision.none = false;
    this.player.setAngle(0);
    this.player.setPosition(this.checkpoint.x, this.checkpoint.y).setVelocity(0, 0);
    this.safePos = { ...this.checkpoint };
    this.pstate = { kind: "normal" };
    this.hearts = 2;
    this.cfg.onHearts(2);
    this.invulnUntil = this.time.now + 1500;
    if (this.cfg.reducedMotion !== true) this.cameras.main.flash(220, 26, 23, 51);
  }

  /** Idempotent squash/stretch (P-38: scale drives the body). */
  private squashStretch(sy: number, sx: number): void {
    this.tweens.killTweensOf(this.player);
    this.player.setScale(this.baseScale);
    this.tweens.add({
      targets: this.player,
      scaleY: this.baseScale * sy,
      scaleX: this.baseScale * sx,
      duration: 80,
      yoyo: true,
      onComplete: () => this.player.setScale(this.baseScale),
      onStop: () => this.player.setScale(this.baseScale),
    });
  }

  update(): void {
    if (!this.player || this.frozen || this.over) return;
    const now = this.time.now;
    const body = this.player.body;
    const level = this.cfg.level;

    if (this.pstate.kind === "dying") return;

    // ── input (keyboard OR'd with the virtual pad/harness) ──
    const pad = this.cfg.pad;
    const left = this.cursors?.left.isDown === true || this.wasd?.A.isDown === true || pad?.left === true;
    const right = this.cursors?.right.isDown === true || this.wasd?.D.isDown === true || pad?.right === true;
    const upDown = this.cursors?.up.isDown === true || this.wasd?.W.isDown === true || pad?.up === true;
    const downDown = this.cursors?.down.isDown === true || this.wasd?.S.isDown === true || pad?.down === true;
    const spaceDown = this.cursors?.space?.isDown === true || pad?.jump === true;
    const jumpDown = spaceDown || upDown;
    const pogoDown = this.pogoKey?.isDown === true || pad?.pogo === true;
    const swingDown = this.swingKey?.isDown === true || pad?.swing === true;
    const heldDir: -1 | 0 | 1 = left === right ? 0 : left ? -1 : 1;
    // Federstab swing (doc 29): fresh press, on the ground or in the air
    if (swingDown && !this.swingHeld) this.doSwing(now);
    this.swingHeld = swingDown;

    // ── HANG state (bible §2.5): up/toward = pull up · down/away = drop ──
    if (this.pstate.kind === "hang") {
      const { spot, side } = this.pstate;
      body.setVelocity(0, 0);
      body.setAllowGravity(false);
      const toward = heldDir === side;
      if (upDown || toward) {
        const target = pullUpPx(spot);
        playSfx("tick");
        this.pstate = { kind: "pullup", fromX: this.player.x, fromY: this.player.y, toX: target.x, toY: target.y, p: this.cfg.reducedMotion === true ? 1 : 0 };
      } else if (downDown || (heldDir !== 0 && !toward)) {
        body.setAllowGravity(true);
        this.pstate = { kind: "normal" };
        this.regrabLockUntil = now + ARCADE.regrabLockMs;
      }
      this.setPose("hang");
      this.stepMovers(); // platforms keep patrolling while we hang
      return; // hanging: no other verbs
    }
    if (this.pstate.kind === "pullup") {
      // scripted 4-step pull-up, advanced on the fixed tick — inputs wait
      const ps = this.pstate;
      ps.p = Math.min(1, ps.p + 16.7 / ARCADE.pullUpMs);
      const e = ps.p < 0.5 ? 2 * ps.p * ps.p : 1 - 2 * (1 - ps.p) * (1 - ps.p); // easeInOutQuad
      this.player.setPosition(ps.fromX + (ps.toX - ps.fromX) * e, ps.fromY + (ps.toY - ps.fromY) * e);
      body.setVelocity(0, 0);
      if (ps.p >= 1) {
        body.setAllowGravity(true);
        this.pstate = { kind: "normal" };
      }
      this.setPose("climb2"); // the scramble-up read
      this.stepMovers();
      return;
    }

    // ── CLIMB state (v2.2): up climbs, down SLIDES, jump-key hops off ──
    if (this.pstate.kind === "climb") {
      const { poleC } = this.pstate;
      body.setAllowGravity(false);
      this.player.x = poleC * TILE + TILE / 2;
      const rr = Math.floor(this.player.y / TILE);
      const exitClimb = (vy: number, vx: number): void => {
        body.setAllowGravity(true);
        body.setVelocity(vx, vy);
        this.pstate = { kind: "normal" };
        this.regrabLockUntil = now + ARCADE.regrabLockMs;
      };
      if (spaceDown && !this.spaceHeld) {
        // the dedicated jump key hops off (up must stay free for climbing)
        exitClimb(ARCADE.poleExitVy, heldDir * 160);
        playSfx("tick");
      } else if (!this.poleCells.has(`${poleC},${rr}`)) {
        // ran off an end: top → courtesy hop (onto the ledge the pole serves);
        // bottom → just fall
        exitClimb(body.velocity.y < 0 ? ARCADE.poleTopVy : 0, 0);
      } else if (body.blocked.down && downDown) {
        exitClimb(0, 0); // feet on the floor — step off
      } else {
        body.setVelocity(0, upDown ? -ARCADE.poleClimbVy : downDown ? ARCADE.poleSlideVy : 0);
      }
      this.spaceHeld = spaceDown;
      this.jumpHeld = jumpDown;
      this.jumpPressedAt = -9999;
      // frame alternates by DISTANCE climbed (Keen's 8-tic ladder rhythm)
      this.setPose(Math.floor(this.player.y / 26) % 2 === 0 ? "climb1" : "climb2");
      this.player.setAlpha(now < this.invulnUntil ? (Math.floor(now / 90) % 2 === 0 ? 0.45 : 1) : 1);
      this.stepMovers();
      this.updateCamera(true); // the pole IS an anchor — the camera rides along
      this.updateGoalArrow();
      return;
    }

    const grounded = body.blocked.down || body.touching.down || this.onSlope !== null; // mover ride + slope footing count

    // Keen's input latch (ck_play.c:1326): a jump pressed MID-AIR and still
    // held fires the instant you land — kids hold buttons; reward it.
    if (spaceDown && !this.spaceHeld && !grounded) this.spaceAirPress = true;
    if (!spaceDown) this.spaceAirPress = false;
    if (grounded && this.spaceAirPress) {
      this.jumpPressedAt = now;
      this.spaceAirPress = false;
    }

    // ── v2.2 door pairs: fresh UP in front of a door walks through it ──
    if (grounded && upDown && !this.jumpHeld && now >= this.doorCooldownUntil) {
      for (const d of this.doorPairs) {
        // generous zone (refoundation W3): overlapping the arch is enough —
        // never "standing perfectly" (the old 22px window felt broken)
        const near = (p: { x: number; y: number }): boolean => Math.abs(p.x - this.player.x) < 34 && Math.abs(p.y - this.player.y) < 46;
        const from = near(d.aPx) ? d.aPx : near(d.bPx) ? d.bPx : null;
        if (!from) continue;
        this.travelDoor(from === d.aPx ? d.bPx : d.aPx);
        return;
      }
    }

    // ── v2.2 pole grab: up at a pole (or down onto one below) latches on ──
    if (!this.onPogo && now >= this.regrabLockUntil && this.pstate.kind === "normal") {
      const pc = Math.floor(this.player.x / TILE);
      const pr = Math.floor(this.player.y / TILE);
      const poleAt = (c: number, r: number): boolean => this.poleCells.has(`${c},${r}`);
      const grabUp = upDown && !this.jumpHeld && (poleAt(pc, pr) || poleAt(pc, pr - 1));
      const grabDown = downDown && !grounded && poleAt(pc, pr);
      const grabHole = downDown && grounded && poleAt(pc, pr + 1); // pole through a floor hole
      if (grabUp || grabDown || grabHole) {
        this.pstate = { kind: "climb", poleC: pc };
        if (grabHole) this.player.y += TILE * 0.6; // dip into the hole so the slide starts
        body.setVelocity(0, 0);
        body.setAllowGravity(false);
        this.fuel = null;
        this.jumpPressedAt = -9999;
        this.spaceHeld = spaceDown;
        playSfx("pop");
        return;
      }
    }

    // ── ground: DIGITAL · air: ANALOG (the signature split, §2.1) ──
    if (grounded && !this.onPogo) {
      let target = heldDir * ARCADE.runSpeed;
      // slope coupling (ck_keen.c:757): downhill pushes, uphill drags
      if (heldDir !== 0 && this.onSlope) target += -this.onSlope.dir * ARCADE.slopePush;
      // Keen's ¼-strength first step out of standing
      const firstStep = target !== 0 && Math.abs(body.velocity.x) < 4 && this.wasMovingBeforeStand === false;
      body.setVelocityX(firstStep ? target * ARCADE.firstStepScale : target);
      this.wasMovingBeforeStand = target !== 0;
    } else {
      body.setVelocityX(airVx(body.velocity.x, heldDir, this.onPogo, this.game.loop.delta));
      if (heldDir === 0 && grounded) this.wasMovingBeforeStand = false;
    }
    if (heldDir !== 0) this.facing = heldDir;
    this.player.setFlipX(this.facing === -1);

    // v2.2 movers patrol + carry their rider (arcade has no platform friction)
    this.stepMovers();

    // ── the pogo toggle (§2.4) ──
    if (pogoDown && !this.pogoHeld) {
      if (this.onPogo) {
        this.onPogo = false; // dismount mid-air or on ground
      } else {
        this.onPogo = true;
        if (grounded) {
          body.setVelocityY(ARCADE.pogoThrust * 0.4); // the mount hop
          this.fuel = null;
        }
      }
    }
    this.pogoHeld = pogoDown;

    // ── jump / pogo bounce (thrust-fuel, §2.2) ──
    if (grounded) this.lastGroundedAt = now;
    if (jumpDown && !this.jumpHeld) this.jumpPressedAt = now;
    if (this.onPogo) {
      // auto-rebounce every landing — hands-free, forever (Keen doctrine)
      if (grounded && this.fuel === null && body.velocity.y >= -1) {
        this.fuel = startJump("pogo");
        this.lastPogoBounceAt = now;
        playSfx("tick");
        if (this.cfg.reducedMotion !== true) {
          this.squashStretch(0.8, 1.15);
          this.dust?.explode(6, this.player.x, this.player.y + 20);
        }
      }
    } else if (canJump(now, this.lastGroundedAt, this.jumpPressedAt) && body.velocity.y >= -1) {
      this.fuel = startJump("jump");
      // running jump carries 60% of run speed; air accel closes the gap (§2.3)
      if (Math.abs(body.velocity.x) > 4) body.setVelocityX(body.velocity.x * ARCADE.jumpRunCarry);
      this.lastGroundedAt = -9999;
      this.jumpPressedAt = -9999;
      playSfx("tick");
      if (this.cfg.reducedMotion !== true) {
        this.squashStretch(1.12, 0.9);
        this.dust?.explode(5, this.player.x, this.player.y + 20);
      }
    }
    // feed the fuel: held = thrust vy; release/ceiling = fuel dies, vy stays
    const fuelHeld = this.onPogo ? true : jumpDown; // the pogo bounce is hands-free
    const r = stepFuel(this.fuel, fuelHeld, body.blocked.up, this.game.loop.delta);
    this.fuel = r.next;
    if (r.vy !== null) body.setVelocityY(r.vy);
    // the impossible pogo: holding jump while rising weakens gravity (§2.4)
    const scale = pogoGravityScale(this.onPogo, body.velocity.y < 0, jumpDown);
    body.setGravityY(scale === 1 ? 0 : -this.worldGravity * (1 - scale));
    this.jumpHeld = jumpDown;
    this.spaceHeld = spaceDown;

    // ── drop-through (look down + jump on a one-way, §2.6) ──
    if (grounded && downDown && jumpDown && !body.blocked.none) {
      this.dropThroughUntil = now + 260;
      this.player.y += 6;
    }

    // ── ledge grab (falling + toward + lip, §2.5) ──
    if (!grounded && !this.onPogo && now >= this.regrabLockUntil && this.fuel === null) {
      const spot = ledgeGrabAt(level, this.player.x, this.player.y, body.velocity.y, heldDir);
      if (spot) {
        const side = heldDir as -1 | 1;
        const at = hangPx(spot, side);
        this.pstate = { kind: "hang", spot, side };
        this.player.setPosition(at.x, at.y);
        body.setVelocity(0, 0);
        body.setAllowGravity(false);
        this.fuel = null;
        playSfx("pop");
        if (this.cfg.reducedMotion !== true) this.dust?.explode(4, at.x + side * 10, at.y - 14);
      }
    }

    // ── v2.3 SLOPES: single-point ground-follow (Keen's mid-column sample,
    // ck_phys.c:268 — snap the feet to the diagonal, bounded by what this
    // frame's motion could plausibly have crossed) ──
    this.onSlope = null;
    if (body.velocity.y >= -1 && !this.onPogo) {
      const c = Math.floor(this.player.x / TILE);
      const fx = (this.player.x - c * TILE) / TILE;
      const feetY = this.player.y + 20;
      const dt = 1 / 60;
      for (const s of this.slopeCells) {
        if (s.c !== c) continue;
        const surf = slopeSurfaceY(s, fx);
        const crossBound = Math.max(30, (Math.abs(body.velocity.x) + Math.max(body.velocity.y, 0)) * dt + 10);
        if (feetY >= surf - 8 && feetY <= surf + crossBound) {
          this.player.y = surf - 20;
          body.setVelocityY(0);
          this.onSlope = s;
          break;
        }
      }
    }

    // ── look up / down (held while standing still → camera peek, §2.6) ──
    // GM-A1: up doubles as jump, so look-up gates on the press being STALE —
    // held past the input buffer without a fresh jump press. (The previous
    // `upDown && !jumpDown` was a contradiction: upDown implies jumpDown.)
    const upStale = upDown && now - this.jumpPressedAt > ARCADE.bufferMs;
    const standingStill = grounded && heldDir === 0 && !this.onPogo && this.fuel === null;
    const wantLook: -1 | 0 | 1 = standingStill && upStale ? -1 : standingStill && downDown && !jumpDown ? 1 : 0;
    if (wantLook !== 0) {
      if (this.lookHeldSince === 0 || this.lookWant !== wantLook) this.lookHeldSince = now;
      this.lookWant = wantLook;
      if (now - this.lookHeldSince >= ARCADE.lookDelayMs) this.lookDir = wantLook;
    } else {
      this.lookHeldSince = 0;
      this.lookWant = 0;
      this.lookDir = 0;
    }
    // Kids discover the peek by pausing — exactly the "scout before you
    // commit" behavior the verb exists for (§2.6).

    // W3 pickup forgiveness: nearby letters drift to the hero and collect —
    // Koki: "I'm jumping on them and there's only a small field that gets them"
    for (const e of this.letterEntries) {
      if (e.taken || e.stolenBy !== null) continue;
      const bx = (e.bits[0] as unknown as { x: number; y: number }).x;
      const by = (e.bits[0] as unknown as { x: number; y: number }).y;
      const d = Math.hypot(this.player.x - bx, this.player.y - by);
      if (d < TILE * 1.6) {
        for (const bit of e.bits) {
          const b = bit as unknown as { x: number; y: number };
          b.x += (this.player.x - b.x) * 0.22;
          b.y += (this.player.y - b.y) * 0.22;
        }
        if (d < 30) this.collectLetter(e);
      }
    }

    // free seals (guard null — authored free, or dropped by an escaped guard)
    // are touch-pickups; a walk-by collects them (never blocked, §4.3)
    for (const seal of this.sealSprites) {
      if (seal.taken || seal.guard !== null) continue;
      if (Math.abs(seal.img.x - this.player.x) < 30 && Math.abs(seal.img.y - this.player.y) < 34) {
        this.releaseSeal(seal, seal.img.x, seal.img.y);
      }
    }

    // safe footing memory (REAL ground only — a mover's midair position must
    // never become the spike-respawn point)
    if (body.blocked.down && now >= this.invulnUntil) {
      const c = Math.floor(this.player.x / TILE);
      const rr = Math.floor(this.player.y / TILE);
      if (level.rows[rr + 1]?.[c] !== "^" && level.rows[rr]?.[c] !== "^") {
        this.safePos = { x: this.player.x, y: this.player.y };
      }
    }

    // landing squash
    if (grounded && !this.wasGrounded && this.landingVy > 250 && this.cfg.reducedMotion !== true && !this.onPogo) {
      this.squashStretch(0.86, 1.1);
      this.dust?.explode(6, this.player.x, this.player.y + 20);
    }
    if (!grounded) this.landingVy = body.velocity.y;
    this.wasGrounded = grounded;

    // pose machine (Keen's action grammar: velocity picks the pose, the run
    // cycles 4 frames at 86ms — ACTION.CK4 run actions, 6 tics/frame)
    const moving = Math.abs(body.velocity.x) > 30 && grounded;
    if (now < this.swingUntil && this.textures.exists("img-hero_swing1")) {
      // hold the swing frames for their moment (the pose machine would swap back)
    } else
    this.setPose(
      this.onPogo
        ? (now - this.lastPogoBounceAt < 200 ? "pogo2" : "pogo1")
        : !grounded
          ? (body.velocity.y < -40 ? "jump" : "fall")
          : moving
            ? (["run1", "run2", "run3", "run4"] as const)[Math.floor(now / 86) % 4]!
            : "stand",
    );
    this.player.setAlpha(now < this.invulnUntil ? (Math.floor(now / 90) % 2 === 0 ? 0.45 : 1) : 1);

    // ── creatures ──
    for (const e of this.creatures) {
      if (e.stunned) { e.stars?.setPosition(e.sprite.x, e.sprite.y - 26); continue; }
      if (e.escaped) continue;
      const s = e.sprite;
      // 2-frame life at ~320ms, phase-offset per creature (Keen's item shimmer
      // doctrine — never a lockstep cast); generated frames win when present
      const frame = `${e.kind}-${Math.floor((now + e.idx * 137) / 320) % 2}`;
      const animKey = this.itex(frame, `ka-${frame}`);
      if (s.texture.key !== animKey) {
        s.setTexture(animKey);
        s.setDisplaySize(TILE, TILE);
      }
      if (e.kind === "walker") {
        const c = Math.floor(s.x / TILE);
        const rr = Math.floor(s.y / TILE);
        if (walkerShouldTurn(level, c, rr, e.dir)) e.dir = e.dir === 1 ? -1 : 1;
        s.setVelocityX(e.dir * ARCADE.walkerSpeed);
        s.setFlipX(e.dir === -1);
      } else if (e.kind === "hopper") {
        if (s.body.blocked.down) {
          s.setVelocityX(0);
          if (now >= e.nextHopAt) {
            const toward = Math.sign(this.player.x - s.x) || 1;
            s.setVelocity(toward * ARCADE.hopperVx, ARCADE.hopperVy);
            e.nextHopAt = now + 1400;
          }
        }
      } else if (e.kind === "flyer") {
        if (flyerPhase(now, e.idx) === "rest") {
          // rests near its ceiling line — the readable pogo window (§3)
          s.setVelocity(0, 0);
          s.y = Phaser.Math.Linear(s.y, e.homeY - ARCADE.flyerAmp, 0.1);
        } else {
          s.y = e.homeY + flyerOffset(now, e.idx);
          s.x += Math.sin(now / 900 + e.idx) * 0.4;
        }
      } else if (e.kind === "thief") {
        const target = thiefTarget(this.letterEntries, s.x, s.y);
        if (target === null) { s.setVelocity(0, 0); continue; }
        const tx = target.c * TILE + TILE / 2;
        const ty = target.r * TILE + TILE / 2;
        const d = Math.abs(tx - s.x) + Math.abs(ty - s.y);
        if (d > ARCADE.thiefTeleportAt) {
          // too far — vanish and reappear near the prize (Treasure Eater)
          s.setPosition(tx + (tx > this.player.x ? 90 : -90), ty - 30);
          if (this.cfg.reducedMotion !== true) this.burst?.explode(6, s.x, s.y);
        } else {
          const ang = Math.atan2(ty - s.y, tx - s.x);
          s.setVelocity(Math.cos(ang) * ARCADE.thiefSpeed, Math.sin(ang) * ARCADE.thiefSpeed);
          s.setFlipX(tx < s.x);
        }
        if (d < 24) {
          const entry = this.letterEntries.find((l) => l.c === target.c && l.r === target.r && !l.taken);
          if (entry) {
            entry.taken = true;
            entry.stolenBy = e.idx;
            entry.zone.disableBody(true, false);
            entry.bits.forEach((b) => (b as Phaser.GameObjects.Image).setAlpha(0.15));
            playSfx("thud");
          }
        }
      } else if (e.kind === "cloud") {
        const step = stepCloud(e.cloud, { x: s.x, y: s.y }, { x: this.player.x, y: this.player.y }, now, this.game.loop.delta);
        e.cloud = step.next;
        s.setVelocityX(step.vx);
        s.setAlpha(e.cloud.kind === "sleep" ? 0.6 : 1);
        if (e.cloud.kind === "telegraph") {
          s.setTintFill(Math.floor(now / 90) % 2 === 0 ? 0xcfc7ff : 0x8b7cf5); // the readable tell
        } else s.clearTint();
        if (step.spawnBolt) {
          const bolt = this.bolts.create(s.x, s.y + 24, "ka-spark") as Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
          bolt.setDisplaySize(10, 34).setTint(0x8b7cf5);
          bolt.setVelocityY(ARCADE.boltSpeed);
          playSfx("thud");
          this.time.delayedCall(2400, () => bolt.destroy());
        }
      }
    }

    // ── the Keen camera (manual, §2.6) ──
    this.updateCamera(grounded || this.pstate.kind === "hang");
    this.updateGoalArrow();
  }

  /** v2.2: step through an in-level door pair — a CUT, not a pan. */
  private travelDoor(to: { x: number; y: number }): void {
    this.doorCooldownUntil = this.time.now + 700;
    this.jumpPressedAt = -9999;
    this.jumpHeld = true; // the up press was spent on the door, not a jump
    this.player.body.setVelocity(0, 0);
    playSfx("whoosh");
    if (this.cfg.reducedMotion !== true) this.dust?.explode(8, this.player.x, this.player.y);
    this.player.setPosition(to.x, to.y - 4);
    this.safePos = { x: to.x, y: to.y - 4 };
    const level = this.cfg.level;
    this.camY = Phaser.Math.Clamp(cameraTargetY(this.player.y, VIEW_H, 0), 0, Math.max(level.h * TILE - VIEW_H, 0));
    this.cameras.main.setScroll(
      Phaser.Math.Clamp(this.player.x - VIEW_W / 2, 0, Math.max(level.w * TILE - VIEW_W, 0)),
      this.camY,
    );
    if (this.cfg.reducedMotion !== true) {
      this.dust?.explode(8, to.x, to.y);
      this.cameras.main.flash(140, 20, 18, 33);
    }
  }

  /** v2.2: patrol the mover platforms and hand-carry whoever rides them. */
  private stepMovers(): void {
    const pb = this.player.body;
    for (const m of this.moverPlatforms) {
      const tx = m.toB ? m.bx : m.ax;
      const ty = m.toB ? m.by : m.ay;
      const dx = tx - m.s.x;
      const dy = ty - m.s.y;
      const dist = Math.hypot(dx, dy);
      if (dist < 6) {
        m.toB = !m.toB;
        m.s.body.setVelocity(0, 0);
      } else {
        m.s.body.setVelocity((dx / dist) * m.speed, (dy / dist) * m.speed);
      }
      if (pb.touching.down && m.s.body.touching.up) {
        // Keen's EXACT carry (ck_keen.c:627): inherit the platform's frame
        // delta as position, not velocity — riders never drift or slide off
        this.player.x += m.s.body.velocity.x / 60;
      }
    }
  }

  /** Manual Keen camera. `anchored` = vertical is allowed to re-target
   *  (grounded, hanging, or climbing a pole — v2.2). */
  private updateCamera(anchored: boolean): void {
    const level = this.cfg.level;
    const cam = this.cameras.main;
    const maxX = level.w * TILE - VIEW_W;
    const maxY = level.h * TILE - VIEW_H;
    const targetX = Phaser.Math.Clamp(cameraTargetX(cam.scrollX, this.player.x, VIEW_W), 0, Math.max(maxX, 0));
    if (anchored) {
      this.camY = Phaser.Math.Clamp(cameraTargetY(this.player.y, VIEW_H, this.lookDir), 0, Math.max(maxY, 0));
    }
    if (this.cfg.reducedMotion === true) {
      cam.setScroll(targetX, this.camY);
    } else {
      cam.setScroll(
        Phaser.Math.Linear(cam.scrollX, targetX, ARCADE.camLerp),
        Phaser.Math.Linear(cam.scrollY, this.camY, ARCADE.camLerp),
      );
    }
    // Keen's MID-AIR safety clamp (ck_play.c:2176): even airborne, the feet
    // never leave the view band — long falls chase the player, no blind drops
    if (!anchored) {
      const feetY = this.player.y + 20;
      const lo = feetY - VIEW_H * ARCADE.camAirClampLo;
      const hi = feetY - VIEW_H * ARCADE.camAirClampHi;
      const clamped = Phaser.Math.Clamp(cam.scrollY, lo, hi);
      if (clamped !== cam.scrollY) {
        cam.setScroll(cam.scrollX, Phaser.Math.Clamp(clamped, 0, Math.max(maxY, 0)));
        this.camY = cam.scrollY; // keep the grounded target in sync — no snap on landing
      }
    }
  }

  /** Once the exit is unsealed, an edge arrow points the way whenever the
   *  door is off-screen — the "take the student by the hand" law (v2.2). */
  private updateGoalArrow(): void {
    if (!this.pedestalActive || this.over) {
      this.goalArrow?.setVisible(false);
      return;
    }
    const cam = this.cameras.main;
    const ex = this.pedestal.x;
    const ey = this.pedestal.y;
    const onScreen = ex >= cam.scrollX - 20 && ex <= cam.scrollX + VIEW_W + 20 && ey >= cam.scrollY - 20 && ey <= cam.scrollY + VIEW_H + 20;
    if (onScreen) {
      this.goalArrow?.setVisible(false);
      return;
    }
    if (!this.goalArrow) {
      this.goalArrow = this.add.triangle(0, 0, 0, 0, 26, 9, 0, 18, 0xffe066).setScrollFactor(0).setDepth(30).setAlpha(0.9);
      if (this.cfg.reducedMotion !== true) {
        this.tweens.add({ targets: this.goalArrow, alpha: { from: 0.9, to: 0.5 }, duration: 520, yoyo: true, repeat: -1 });
      }
    }
    const dx = ex - (cam.scrollX + VIEW_W / 2);
    const dy = ey - (cam.scrollY + VIEW_H / 2);
    const ang = Math.atan2(dy, dx);
    const margin = 34;
    const px = Phaser.Math.Clamp(VIEW_W / 2 + Math.cos(ang) * VIEW_W, margin, VIEW_W - margin);
    const py = Phaser.Math.Clamp(VIEW_H / 2 + Math.sin(ang) * VIEW_H, margin, VIEW_H - margin);
    this.goalArrow.setVisible(true).setPosition(px, py).setRotation(ang);
  }
}
