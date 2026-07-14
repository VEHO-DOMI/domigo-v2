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
import { paintPlayerSprite, paintTileset, resolveZoneTheme, DOMIGO_GREEN, TILE_KINDS } from "@domigo/art-gen";
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

const VIEW_W = 15 * TILE;
const VIEW_H = 11 * TILE;

export interface ArcadePad {
  left: boolean;
  right: boolean;
  up: boolean;
  down: boolean;
  jump: boolean;
  pogo: boolean;
}

export interface ArcadeConfig {
  level: ArcadeLevel;
  tier: Tier;
  seed: number;
  playerSeed?: number;
  reducedMotion?: boolean;
  pad?: ArcadePad;
  onQuickfire: (contactIdx: number) => void;
  onLetters: (count: number) => void;
  onHearts: (hearts: number) => void;
  onCombo: (streak: number, points: number) => void;
  onSeals: (collected: number, total: number) => void;
  /** the last heart is gone → React runs the Rettungsaufgabe (§5.3) */
  onRescue: (deathCount: number) => void;
  onComplete: (stats: { ms: number; maxCombo: number; letters: number; words: number; seals: number; deaths: number }) => void;
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

type PlayerState = { kind: "normal" } | { kind: "hang"; spot: HangSpot; side: -1 | 1 } | { kind: "pullup" } | { kind: "dying" };

function paintSmudge(kind: CreatureKind): HTMLCanvasElement {
  const c = document.createElement("canvas");
  c.width = 44;
  c.height = 38;
  const g = c.getContext("2d")!;
  const body = () => {
    g.beginPath();
    if (kind === "walker") g.ellipse(22, 25, 18, 11, 0, 0, Math.PI * 2);
    else if (kind === "hopper") g.ellipse(22, 21, 13, 15, 0, 0, Math.PI * 2);
    else if (kind === "thief") { g.ellipse(22, 22, 14, 12, 0, 0, Math.PI * 2); g.ellipse(30, 12, 6, 4, 0.6, 0, Math.PI * 2); }
    else if (kind === "cushion") g.ellipse(22, 26, 20, 10, 0, 0, Math.PI * 2);
    else if (kind === "cloud") { g.ellipse(22, 20, 19, 10, 0, 0, Math.PI * 2); g.ellipse(11, 16, 8, 6, 0, 0, Math.PI * 2); g.ellipse(33, 16, 8, 6, 0, 0, Math.PI * 2); }
    else { g.ellipse(22, 18, 15, 10, 0, 0, Math.PI * 2); g.ellipse(9, 12, 5, 3, -0.5, 0, Math.PI * 2); g.ellipse(35, 12, 5, 3, 0.5, 0, Math.PI * 2); }
  };
  const fills: Record<CreatureKind, string> = { walker: "#37325c", hopper: "#37325c", flyer: "#453a78", thief: "#4a3560", cushion: "#2f4a6b", cloud: "#26233f" };
  g.fillStyle = fills[kind];
  body();
  g.fill();
  g.strokeStyle = kind === "cushion" ? "#7cc4f5" : "#8b7cf5";
  g.lineWidth = 2;
  body();
  g.stroke();
  if (kind !== "cloud") {
    g.fillStyle = "#f6f5ff";
    g.beginPath(); g.ellipse(16, 18, 4.5, 5.5, 0, 0, Math.PI * 2); g.ellipse(28, 18, 4.5, 5.5, 0, 0, Math.PI * 2); g.fill();
    g.fillStyle = "#0c0b14";
    g.beginPath(); g.arc(17, 20, 2.2, 0, Math.PI * 2); g.arc(29, 20, 2.2, 0, Math.PI * 2); g.fill();
  } else {
    // the cloud sleeps — lidded eyes
    g.strokeStyle = "#b7aef7"; g.lineWidth = 2;
    g.beginPath(); g.moveTo(13, 20); g.lineTo(19, 20); g.moveTo(26, 20); g.lineTo(32, 20); g.stroke();
  }
  return c;
}

function paintSpikes(): HTMLCanvasElement {
  const c = document.createElement("canvas");
  c.width = TILE;
  c.height = TILE;
  const g = c.getContext("2d")!;
  g.fillStyle = "#191726";
  for (const x of [4, 20, 36] as const) {
    g.beginPath();
    g.moveTo(x, TILE);
    g.lineTo(x + 4, TILE - 22);
    g.lineTo(x + 8, TILE);
    g.closePath();
    g.fill();
  }
  g.fillStyle = "#2c2a44";
  g.fillRect(0, TILE - 6, TILE, 6);
  return c;
}

/** The artifact pedestal (inactive → glowing) — the torn page fragment. */
function paintPedestal(active: boolean): HTMLCanvasElement {
  const c = document.createElement("canvas");
  c.width = TILE;
  c.height = TILE * 2;
  const g = c.getContext("2d")!;
  g.fillStyle = "#4a3520";
  g.fillRect(14, 60, 20, 34);
  g.fillRect(8, 88, 32, 8);
  // the page fragment
  g.save();
  g.translate(24, 34);
  g.rotate(-0.08);
  g.fillStyle = active ? "#f6f2e4" : "#8d8a7e";
  g.beginPath();
  g.moveTo(-14, -18); g.lineTo(12, -20); g.lineTo(15, 6); g.lineTo(4, 10); g.lineTo(-2, 6); g.lineTo(-12, 12);
  g.closePath();
  g.fill();
  g.strokeStyle = active ? "#b7aef7" : "#5c5a6e";
  g.lineWidth = 2;
  g.stroke();
  g.strokeStyle = active ? "#6b6880" : "#75727f";
  g.lineWidth = 1.4;
  for (const y of [-10, -4, 2] as const) { g.beginPath(); g.moveTo(-9, y); g.lineTo(9, y); g.stroke(); }
  g.restore();
  if (active) {
    g.fillStyle = "rgba(183,174,247,0.25)";
    g.beginPath(); g.ellipse(24, 34, 22, 26, 0, 0, Math.PI * 2); g.fill();
  }
  return c;
}

/** A Tintensiegel (ink seal) — the gem-socket key, re-themed. */
function paintSeal(): HTMLCanvasElement {
  const c = document.createElement("canvas");
  c.width = 30;
  c.height = 30;
  const g = c.getContext("2d")!;
  g.fillStyle = "#8b7cf5";
  g.beginPath();
  g.moveTo(15, 2); g.lineTo(27, 15); g.lineTo(15, 28); g.lineTo(3, 15);
  g.closePath();
  g.fill();
  g.strokeStyle = "#cfc7ff";
  g.lineWidth = 2;
  g.stroke();
  g.fillStyle = "#141221";
  g.beginPath(); g.arc(15, 15, 4.5, 0, Math.PI * 2); g.fill();
  return c;
}

export class ArcadeScene extends Phaser.Scene {
  private cfg: ArcadeConfig;
  private player!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  private pstate: PlayerState = { kind: "normal" };
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys | null = null;
  private wasd: Record<"W" | "A" | "S" | "D", Phaser.Input.Keyboard.Key> | null = null;
  private pogoKey: Phaser.Input.Keyboard.Key | null = null;
  private creatures: Creature[] = [];
  private letterEntries: LetterEntry[] = [];
  private sealSprites: Array<{ img: Phaser.GameObjects.Image; taken: boolean; guard: number | null; idx: number }> = [];
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
  private lookDir: -1 | 0 | 1 = 0;
  private invulnUntil = 0;
  private wasMovingBeforeStand = false;
  private safePos = { x: 0, y: 0 };
  private checkpoint = { x: 0, y: 0 };
  private hearts = 3;
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
  private camY = 0;
  private worldGravity: number = ARCADE.gravity;
  private bolts!: Phaser.Physics.Arcade.Group;

  constructor(cfg: ArcadeConfig) {
    super("arcade");
    this.cfg = cfg;
  }

  static dimensions(): { width: number; height: number } {
    return { width: VIEW_W, height: VIEW_H };
  }

  create(): void {
    const { level, tier } = this.cfg;
    const motion = this.cfg.reducedMotion !== true;
    const theme = resolveZoneTheme("classroom");
    const tileset = paintTileset(this.cfg.seed, { palette: theme.palette, accent: DOMIGO_GREEN, kinds: [...TILE_KINDS] });
    const tex = (k: string): string => `ka-${k}`;
    const addCanvas = (key: string, cv: HTMLCanvasElement): void => {
      if (!this.textures.exists(key)) this.textures.addCanvas(key, cv);
    };
    for (const [key, img] of Object.entries(tileset.tiles)) {
      addCanvas(tex(key), rasterize(img, 1));
    }
    for (const kind of ["walker", "hopper", "flyer", "thief", "cushion", "cloud"] as const) addCanvas(tex(kind), paintSmudge(kind));
    addCanvas(tex("spikes"), paintSpikes());
    addCanvas(tex("pedestal"), paintPedestal(false));
    addCanvas(tex("pedestal-on"), paintPedestal(true));
    addCanvas(tex("seal"), paintSeal());
    const sprite = paintPlayerSprite(this.cfg.playerSeed ?? this.cfg.seed);
    if (!this.textures.exists("p-right")) {
      this.textures.addCanvas("p-right", rasterize(sprite.frames[3]!, 1));
      sprite.walk.right.forEach((img, s) => addCanvas(`p-right-${s + 1}`, rasterize(img, 1)));
    }

    // parallax ink backdrop
    const bg = document.createElement("canvas");
    bg.width = 256; bg.height = 24 * TILE;
    const bgg = bg.getContext("2d")!;
    const grad = bgg.createLinearGradient(0, 0, 0, bg.height);
    grad.addColorStop(0, "#232136"); grad.addColorStop(0.7, "#1b1930"); grad.addColorStop(1, "#141221");
    bgg.fillStyle = grad; bgg.fillRect(0, 0, 256, bg.height);
    bgg.fillStyle = "rgba(120,110,200,0.08)";
    for (const [x, y, r] of [[40, 90, 26], [150, 60, 18], [210, 160, 30], [90, 230, 22], [30, 330, 16], [180, 300, 28], [120, 420, 20], [200, 520, 24], [60, 620, 18]] as const) {
      bgg.beginPath(); bgg.arc(x, y, r, 0, Math.PI * 2); bgg.fill();
    }
    addCanvas("ka-bg", bg);
    this.add.tileSprite(0, 0, level.w * TILE, level.h * TILE, "ka-bg").setOrigin(0).setScrollFactor(0.35, 0.7);

    // ── the world ──
    const solids = this.physics.add.staticGroup();
    for (const s of level.solids) {
      const b = solids.create(s.c * TILE + TILE / 2, s.r * TILE + TILE / 2, tex("wall")) as Phaser.Types.Physics.Arcade.SpriteWithStaticBody;
      b.setDisplaySize(TILE, TILE).refreshBody();
    }
    const oneWays = this.physics.add.staticGroup();
    const addOneWay = (c: number, r: number, helper: boolean): void => {
      const b = oneWays.create(c * TILE + TILE / 2, r * TILE + TILE / 2 - 14, tex("path")) as Phaser.Types.Physics.Arcade.SpriteWithStaticBody;
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

    // letters — real glyphs being rescued
    const letterGroup = this.physics.add.staticGroup();
    const GLYPHS = "TINTENWORT";
    level.letters.forEach((l, i) => {
      const x = l.c * TILE + TILE / 2;
      const y = l.r * TILE + TILE / 2;
      const disc = this.add.circle(x, y, 14, 0x8b7cf5, 0.28);
      const t = this.add.text(x, y, GLYPHS[i % GLYPHS.length]!, { fontFamily: "system-ui, sans-serif", fontSize: "20px", fontStyle: "bold", color: "#e8e6f5" }).setOrigin(0.5);
      const zone = letterGroup.create(x, y, undefined as unknown as string) as Phaser.Types.Physics.Arcade.SpriteWithStaticBody;
      zone.setVisible(false).setDisplaySize(30, 30).refreshBody();
      const entry: LetterEntry = { c: l.c, r: l.r, taken: false, stolenBy: null, bits: [disc, t], zone };
      zone.setData("entry", entry);
      this.letterEntries.push(entry);
      if (motion) this.tweens.add({ targets: [disc, t], y: y - 4, duration: 900 + (i % 3) * 120, yoyo: true, repeat: -1, ease: "Sine.easeInOut" });
    });

    // checkpoints — small banner poles
    const cpGroup = this.physics.add.staticGroup();
    for (const cp of level.checkpoints) {
      const x = cp.c * TILE + TILE / 2;
      const y = cp.r * TILE + TILE / 2;
      const pole = this.add.rectangle(x - 6, y + 6, 4, 36, 0x6b6880);
      const flag = this.add.triangle(x + 4, y - 8, 0, 0, 22, 7, 0, 14, 0x5c5a6e).setOrigin(0.5);
      const zone = cpGroup.create(x, y, undefined as unknown as string) as Phaser.Types.Physics.Arcade.SpriteWithStaticBody;
      zone.setVisible(false).setDisplaySize(TILE, TILE * 1.5).refreshBody();
      zone.setData("bits", { pole, flag });
    }

    // seals + pedestal (the gem-socket grammar)
    level.header.seals.forEach((s, i) => {
      const img = this.add.image(s.c * TILE + TILE / 2, s.r * TILE + TILE / 2, tex("seal")).setDepth(5);
      if (motion) this.tweens.add({ targets: img, y: img.y - 5, duration: 1100 + i * 150, yoyo: true, repeat: -1, ease: "Sine.easeInOut" });
      this.sealSprites.push({ img, taken: false, guard: s.guard, idx: i });
    });
    this.cfg.onSeals(0, level.header.seals.length);
    this.pedestal = this.physics.add.staticGroup().create(level.pedestal.c * TILE + TILE / 2, level.pedestal.r * TILE, tex("pedestal")) as Phaser.Types.Physics.Arcade.SpriteWithStaticBody;
    this.pedestal.setDisplaySize(TILE, TILE * 2).refreshBody();

    // ── the player ──
    const startPx = { x: level.start.c * TILE + TILE / 2, y: level.start.r * TILE + TILE / 2 };
    this.safePos = { ...startPx };
    this.checkpoint = { ...startPx };
    this.player = this.physics.add.sprite(startPx.x, startPx.y, "p-right");
    this.player.setDisplaySize(TILE, TILE);
    this.baseScale = this.player.scaleY;
    this.player.body.setSize(20, 40).setOffset(14, 6);
    this.player.body.setMaxVelocityY(ARCADE.maxFall);
    this.worldGravity = gravityFor(tier);
    this.physics.world.gravity.y = this.worldGravity;
    this.physics.world.setBounds(0, 0, level.w * TILE, level.h * TILE);
    this.player.setCollideWorldBounds(true);
    this.physics.add.collider(this.player, solids);
    this.oneWayCollider = this.physics.add.collider(this.player, oneWays, undefined, () => {
      // drop-through: the collider stands down while passing (look-down + jump)
      return this.time.now >= this.dropThroughUntil && this.player.body.velocity.y >= 0;
    });
    this.physics.add.overlap(this.player, spikes, () => this.hurt("spikes"));
    this.physics.add.overlap(this.player, letterGroup, (_p, zone) => this.collectLetter((zone as Phaser.Types.Physics.Arcade.SpriteWithStaticBody).getData("entry") as LetterEntry));
    this.physics.add.overlap(this.player, cpGroup, (_p, zone) => this.reachCheckpoint(zone as Phaser.Types.Physics.Arcade.SpriteWithStaticBody));
    this.physics.add.overlap(this.player, this.pedestal, () => this.tryComplete());

    // ── creatures (population = the tier's placements) ──
    this.bolts = this.physics.add.group({ allowGravity: false });
    this.physics.add.overlap(this.player, this.bolts, (_p, b) => {
      (b as Phaser.Types.Physics.Arcade.SpriteWithDynamicBody).destroy();
      this.hurt("bolt");
    });
    placementsFor(level.header, tier).forEach((e, i) => {
      const s = this.physics.add.sprite(e.c * TILE + TILE / 2, e.r * TILE + TILE / 2 + 5, tex(e.kind));
      s.setDisplaySize(44, 38);
      s.body.setSize(30, 26).setOffset(7, 6);
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
      this.pogoKey = kb.addKey(Phaser.Input.Keyboard.KeyCodes.X);
    }

    // Keen camera: MANUAL — dead-band horizontal, grounded-gated vertical
    this.cameras.main.setBounds(0, 0, level.w * TILE, level.h * TILE);
    this.camY = Phaser.Math.Clamp(cameraTargetY(this.player.y, VIEW_H, 0), 0, level.h * TILE - VIEW_H);
    this.cameras.main.setScroll(Phaser.Math.Clamp(this.player.x - VIEW_W / 2, 0, level.w * TILE - VIEW_W), this.camY);
    if (motion) this.cameras.main.fadeIn(240, 20, 18, 33);
    this.startedAt = this.time.now;
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
      words: this.words,
      combo: this.combo,
      seals: this.sealsCollected,
      sealsTotal: this.cfg.level.header.seals.length,
      deaths: this.deaths,
      pedestalActive: this.pedestalActive,
      frozen: this.frozen,
      over: this.over,
      creaturesLeft: this.creatures.filter((e) => !e.stunned && !e.escaped).length,
      tier: this.cfg.tier,
      fps: Math.round(this.game.loop.actualFps),
      camY: Math.round(this.cameras.main.scrollY),
      lookDir: this.lookDir,
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
    const bits = zone.getData("bits") as { pole: Phaser.GameObjects.Rectangle; flag: Phaser.GameObjects.Triangle };
    bits.flag.setFillStyle(0x8b7cf5);
    playSfx("chime-correct");
    if (this.cfg.reducedMotion !== true) {
      this.burst?.explode(10, zone.x, zone.y - 10);
      this.tweens.add({ targets: bits.flag, angle: { from: -12, to: 0 }, duration: 400, ease: "Back.easeOut" });
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

  private releaseSeal(seal: { img: Phaser.GameObjects.Image; taken: boolean; idx: number }, fromX: number, fromY: number): void {
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
    this.pedestal.setTexture("ka-pedestal-on");
    playSfx("whoosh");
    if (this.cfg.reducedMotion !== true) {
      this.burst?.explode(18, this.pedestal.x, this.pedestal.y);
      this.tweens.add({ targets: this.pedestal, alpha: { from: 0.7, to: 1 }, duration: 500, yoyo: true, repeat: -1 });
    }
  }

  private tryComplete(): void {
    if (!this.pedestalActive || this.over) return;
    this.over = true;
    this.player.setVelocity(0, 0);
    playSfx("chime-correct");
    if (this.cfg.reducedMotion !== true) {
      this.burst?.explode(24, this.pedestal.x, this.pedestal.y - 30);
      this.cameras.main.fadeOut(500, 20, 18, 33);
    }
    this.cfg.onComplete({ ms: this.time.now - this.startedAt, maxCombo: this.maxCombo, letters: this.letters, words: this.words, seals: this.sealsCollected, deaths: this.deaths });
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
    const jumpDown = this.cursors?.space?.isDown === true || upDown || pad?.jump === true;
    const pogoDown = this.pogoKey?.isDown === true || pad?.pogo === true;
    const heldDir: -1 | 0 | 1 = left === right ? 0 : left ? -1 : 1;

    // ── HANG state (bible §2.5): up/toward = pull up · down/away = drop ──
    if (this.pstate.kind === "hang") {
      const { spot, side } = this.pstate;
      body.setVelocity(0, 0);
      body.setAllowGravity(false);
      const toward = heldDir === side;
      if (upDown || toward) {
        this.pstate = { kind: "pullup" };
        const target = pullUpPx(spot);
        playSfx("tick");
        this.tweens.add({
          targets: this.player,
          x: target.x,
          y: target.y,
          duration: this.cfg.reducedMotion === true ? 0 : ARCADE.pullUpMs,
          ease: "Sine.easeInOut",
          onComplete: () => {
            body.setAllowGravity(true);
            this.pstate = { kind: "normal" };
          },
        });
      } else if (downDown || (heldDir !== 0 && !toward)) {
        body.setAllowGravity(true);
        this.pstate = { kind: "normal" };
        this.regrabLockUntil = now + ARCADE.regrabLockMs;
      }
      return; // hanging: no other verbs
    }
    if (this.pstate.kind === "pullup") return; // scripted — inputs wait

    const grounded = body.blocked.down;

    // ── ground: DIGITAL · air: ANALOG (the signature split, §2.1) ──
    if (grounded && !this.onPogo) {
      const target = heldDir * ARCADE.runSpeed;
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

    // ── look up / down (held while standing still → camera peek, §2.6) ──
    const standingStill = grounded && heldDir === 0 && !this.onPogo;
    const wantLook: -1 | 0 | 1 = standingStill && upDown && !jumpDown ? -1 : standingStill && downDown ? 1 : 0;
    if (wantLook !== 0) {
      if (this.lookHeldSince === 0) this.lookHeldSince = now;
      if (now - this.lookHeldSince >= ARCADE.lookDelayMs) this.lookDir = wantLook;
    } else {
      this.lookHeldSince = 0;
      this.lookDir = 0;
    }
    // NOTE: up doubles as jump — looking up only engages when the jump didn't
    // (standing still, no fresh press). Kids discover it by pausing, which is
    // exactly the "scout before you commit" behavior the verb exists for.

    // free seals (guard null — authored free, or dropped by an escaped guard)
    // are touch-pickups; a walk-by collects them (never blocked, §4.3)
    for (const seal of this.sealSprites) {
      if (seal.taken || seal.guard !== null) continue;
      if (Math.abs(seal.img.x - this.player.x) < 30 && Math.abs(seal.img.y - this.player.y) < 34) {
        this.releaseSeal(seal, seal.img.x, seal.img.y);
      }
    }

    // safe footing memory (grounded, not over spikes)
    if (grounded && now >= this.invulnUntil) {
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

    // frames + i-frame blink
    const moving = Math.abs(body.velocity.x) > 30 && grounded;
    const frame = this.onPogo ? "p-right-1" : !grounded ? "p-right-1" : moving ? (Math.floor(now / 130) % 2 === 0 ? "p-right-1" : "p-right-2") : "p-right";
    if (this.player.texture.key !== frame && this.textures.exists(frame)) {
      this.player.setTexture(frame);
      this.player.setDisplaySize(TILE, TILE);
    }
    this.player.setAlpha(now < this.invulnUntil ? (Math.floor(now / 90) % 2 === 0 ? 0.45 : 1) : 1);

    // ── creatures ──
    for (const e of this.creatures) {
      if (e.stunned) { e.stars?.setPosition(e.sprite.x, e.sprite.y - 26); continue; }
      if (e.escaped) continue;
      const s = e.sprite;
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
    const cam = this.cameras.main;
    const maxX = level.w * TILE - VIEW_W;
    const maxY = level.h * TILE - VIEW_H;
    const targetX = Phaser.Math.Clamp(cameraTargetX(cam.scrollX, this.player.x, VIEW_W), 0, Math.max(maxX, 0));
    // vertical: only re-target while anchored (grounded or hanging)
    if (grounded || this.pstate.kind === "hang") {
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
  }
}
