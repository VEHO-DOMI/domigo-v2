/**
 * KA-1 · "Tintenlauf" — the side-scrolling arcade scene (Phaser, client-only).
 * A Keen-feel platformer re-expressed from scratch: run, variable-height jump
 * (coyote time + buffering from arcade.ts, unit-tested), one-way platforms,
 * three enemy patterns (edge-turn walker, hopper, sine flyer), ink spikes,
 * collectible letters, and a sealed exit that opens as words are won.
 *
 * Touching an enemy FREEZES the run and hands React a QUICKFIRE (one word,
 * three chips, one tap). The scene never grades — it only reacts to the
 * verdict (pop + combo, or heart lost). All motion honors reducedMotion.
 */
import Phaser from "phaser";
import { paintPlayerSprite, paintTileset, resolveZoneTheme, DOMIGO_GREEN, TILE_KINDS } from "@domigo/art-gen";
import { playSfx } from "@domigo/game-feel";
import { ARCADE, canJump, comboPoints, flyerOffset, jumpCut, walkerShouldTurn, type ArcadeLevel, type EnemyKind } from "./arcade.ts";
import { rasterize } from "./rasterize.ts";

const TILE = 48;
const VIEW_W = 15 * TILE;
const VIEW_H = 11 * TILE;

/** Virtual pad — the on-screen buttons AND the machine-playtest harness write
 *  here; update() reads it OR'd with the keyboard (one axis expression). */
export interface ArcadePad {
  left: boolean;
  right: boolean;
  jump: boolean;
}

export interface ArcadeConfig {
  level: ArcadeLevel;
  seed: number;
  playerSeed?: number;
  reducedMotion?: boolean;
  pad?: ArcadePad;
  /** Words needed to unseal the exit gate. */
  wordsNeeded: number;
  /** Enemy contact: freeze is done; React shows the quickfire for this contact. */
  onQuickfire: (contactIdx: number) => void;
  onLetters: (count: number) => void;
  onHearts: (hearts: number) => void;
  onCombo: (streak: number, points: number) => void;
  onWords: (won: number) => void;
  onGameOver: () => void;
  onComplete: (stats: { ms: number; maxCombo: number; letters: number; words: number }) => void;
}

interface Enemy {
  kind: EnemyKind;
  sprite: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  dir: 1 | -1;
  homeY: number;
  nextHopAt: number;
  alive: boolean;
  idx: number;
}

/** Paint a small ink-smudge enemy (per kind: silhouette varies) — inline
 *  procedural placeholder, replaced by generated art later. */
function paintSmudge(kind: EnemyKind): HTMLCanvasElement {
  const c = document.createElement("canvas");
  c.width = 40;
  c.height = 34;
  const g = c.getContext("2d")!;
  // a violet rim light so the ink reads against the dark backdrop
  const body = () => {
    g.beginPath();
    if (kind === "walker") g.ellipse(20, 22, 17, 11, 0, 0, Math.PI * 2);
    else if (kind === "hopper") g.ellipse(20, 19, 13, 14, 0, 0, Math.PI * 2);
    else { g.ellipse(20, 16, 15, 10, 0, 0, Math.PI * 2); g.ellipse(8, 10, 5, 3, -0.5, 0, Math.PI * 2); g.ellipse(32, 10, 5, 3, 0.5, 0, Math.PI * 2); }
  };
  g.fillStyle = kind === "flyer" ? "#453a78" : "#37325c";
  body();
  g.fill();
  g.strokeStyle = "#8b7cf5";
  g.lineWidth = 2;
  body();
  g.stroke();
  // eyes — big and wary (the Schluckwort family resemblance)
  g.fillStyle = "#f6f5ff";
  g.beginPath(); g.ellipse(14, 15, 4.5, 5.5, 0, 0, Math.PI * 2); g.ellipse(26, 15, 4.5, 5.5, 0, 0, Math.PI * 2); g.fill();
  g.fillStyle = "#0c0b14";
  g.beginPath(); g.arc(15, 17, 2.2, 0, Math.PI * 2); g.arc(27, 17, 2.2, 0, Math.PI * 2); g.fill();
  return c;
}

/** The exit gate (sealed → open) — inline so this PR stands alone on main
 *  (the W-1 reland ships tileset door kinds; the arcade keeps its own
 *  placeholders until Koki's generated sheets replace everything anyway). */
function paintGate(sealed: boolean): HTMLCanvasElement {
  const c = document.createElement("canvas");
  c.width = TILE;
  c.height = TILE;
  const g = c.getContext("2d")!;
  g.fillStyle = "#4a3520";
  g.fillRect(4, 2, 40, 44);
  g.fillStyle = "#b45309";
  g.fillRect(8, 5, 32, 39);
  g.fillStyle = "#d97a1f";
  g.fillRect(12, 10, 24, 13);
  g.fillRect(12, 27, 24, 12);
  if (sealed) {
    g.fillStyle = "#191726";
    g.beginPath();
    g.ellipse(24, 24, 15, 13, 0, 0, Math.PI * 2);
    g.ellipse(14, 15, 6, 5, 0, 0, Math.PI * 2);
    g.ellipse(33, 33, 7, 6, 0, 0, Math.PI * 2);
    g.fill();
    g.fillRect(20, 33, 3, 11);
    g.fillStyle = "#f6f5ff";
    g.beginPath();
    g.arc(20, 20, 2, 0, Math.PI * 2);
    g.fill();
  } else {
    g.fillStyle = "#ffe066";
    g.beginPath();
    g.arc(33, 25, 2.4, 0, Math.PI * 2);
    g.fill();
  }
  return c;
}

/** Ink spikes (hazard tile) — three drippy triangles. */
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

export class ArcadeScene extends Phaser.Scene {
  private cfg: ArcadeConfig;
  private player!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys | null = null;
  private wasd: Record<"W" | "A" | "S" | "D", Phaser.Input.Keyboard.Key> | null = null;
  private enemies: Enemy[] = [];
  private exitGate!: Phaser.Types.Physics.Arcade.SpriteWithStaticBody;
  private exitOpen = false;
  private frozen = false;
  private over = false;
  private facing: 1 | -1 = 1;
  private lastGroundedAt = -9999;
  private jumpPressedAt = -9999;
  private jumpHeld = false;
  private invulnUntil = 0;
  /** Last grounded, spike-free footing — a spike hit returns you HERE (the
   *  kind version of Keen's pit death: pits are un-jumpable by design, so
   *  damage-in-place would trap a kid into bleeding hearts). */
  private safePos = { x: 0, y: 0 };
  private hearts = 3;
  private letters = 0;
  private words = 0;
  private combo = 0;
  private maxCombo = 0;
  private contactIdx = 0;
  private startedAt = 0;
  private startPx = { x: 0, y: 0 };
  private burst: Phaser.GameObjects.Particles.ParticleEmitter | null = null;
  private dust: Phaser.GameObjects.Particles.ParticleEmitter | null = null;
  private wasGrounded = false;
  /** The player's true scale — every squash/stretch tween starts and ends
   *  HERE (multiplying the live scale let an interrupted tween capture a
   *  mid-squash value as its base, permanently shrinking sprite AND body —
   *  the embedded-in-the-floor bug the machine playtest caught). */
  private baseScale = 1;

  constructor(cfg: ArcadeConfig) {
    super("arcade");
    this.cfg = cfg;
  }

  static dimensions(): { width: number; height: number } {
    return { width: VIEW_W, height: VIEW_H };
  }

  create(): void {
    const { level } = this.cfg;
    const motion = this.cfg.reducedMotion !== true;
    // the ink-run wears the Gang's interior family (classroom palette)
    const theme = resolveZoneTheme("classroom");
    const tileset = paintTileset(this.cfg.seed, { palette: theme.palette, accent: DOMIGO_GREEN, kinds: [...TILE_KINDS] });
    const tex = (k: string): string => `ka-${k}`;
    for (const [key, img] of Object.entries(tileset.tiles)) {
      if (!this.textures.exists(tex(key))) this.textures.addCanvas(tex(key), rasterize(img, 1));
    }
    if (!this.textures.exists(tex("door"))) this.textures.addCanvas(tex("door"), paintGate(false));
    if (!this.textures.exists(tex("door-sealed"))) this.textures.addCanvas(tex("door-sealed"), paintGate(true));
    for (const kind of ["walker", "hopper", "flyer"] as const) {
      if (!this.textures.exists(tex(kind))) this.textures.addCanvas(tex(kind), paintSmudge(kind));
    }
    if (!this.textures.exists(tex("spikes"))) this.textures.addCanvas(tex("spikes"), paintSpikes());
    const sprite = paintPlayerSprite(this.cfg.playerSeed ?? this.cfg.seed);
    if (!this.textures.exists("p-right")) {
      // reuse the overworld's right-facing frames as the runner (flipX for left)
      this.textures.addCanvas("p-right", rasterize(sprite.frames[3]!, 1));
      sprite.walk.right.forEach((img, s) => this.textures.addCanvas(`p-right-${s + 1}`, rasterize(img, 1)));
    }

    // ── parallax ink backdrop (scrollFactor < 1 sells the depth) ──
    const bg = document.createElement("canvas");
    bg.width = 256; bg.height = 528;
    const bgg = bg.getContext("2d")!;
    const grad = bgg.createLinearGradient(0, 0, 0, 528);
    grad.addColorStop(0, "#232136"); grad.addColorStop(0.7, "#1b1930"); grad.addColorStop(1, "#141221");
    bgg.fillStyle = grad; bgg.fillRect(0, 0, 256, 528);
    bgg.fillStyle = "rgba(120,110,200,0.08)";
    for (const [x, y, r] of [[40, 90, 26], [150, 60, 18], [210, 160, 30], [90, 230, 22], [30, 330, 16], [180, 300, 28], [120, 420, 20]] as const) {
      bgg.beginPath(); bgg.arc(x, y, r, 0, Math.PI * 2); bgg.fill();
    }
    if (!this.textures.exists("ka-bg")) this.textures.addCanvas("ka-bg", bg);
    this.add.tileSprite(0, 0, level.w * TILE, level.h * TILE, "ka-bg").setOrigin(0).setScrollFactor(0.35, 0.7);

    // ── the world ──
    const solids = this.physics.add.staticGroup();
    for (const s of level.solids) {
      const b = solids.create(s.c * TILE + TILE / 2, s.r * TILE + TILE / 2, tex("wall")) as Phaser.Types.Physics.Arcade.SpriteWithStaticBody;
      b.setDisplaySize(TILE, TILE).refreshBody();
    }
    const oneWays = this.physics.add.staticGroup();
    for (const p of level.oneWays) {
      const b = oneWays.create(p.c * TILE + TILE / 2, p.r * TILE + TILE / 2 - 14, tex("path")) as Phaser.Types.Physics.Arcade.SpriteWithStaticBody;
      b.setDisplaySize(TILE, 20).refreshBody();
      const body = b.body as Phaser.Physics.Arcade.StaticBody;
      body.checkCollision.down = false;
      body.checkCollision.left = false;
      body.checkCollision.right = false;
    }
    const spikes = this.physics.add.staticGroup();
    for (const hz of level.hazards) {
      const b = spikes.create(hz.c * TILE + TILE / 2, hz.r * TILE + TILE / 2, tex("spikes")) as Phaser.Types.Physics.Arcade.SpriteWithStaticBody;
      b.setDisplaySize(TILE, TILE).refreshBody();
      (b.body as Phaser.Physics.Arcade.StaticBody).setSize(TILE - 12, 22).setOffset(6, TILE - 22);
    }

    // letters — glowing coins carrying real glyphs (the words being rescued)
    const letterGroup = this.physics.add.staticGroup();
    const GLYPHS = "TINTENWORT";
    level.letters.forEach((l, i) => {
      const x = l.c * TILE + TILE / 2;
      const y = l.r * TILE + TILE / 2;
      const disc = this.add.circle(x, y, 14, 0x8b7cf5, 0.28);
      const t = this.add.text(x, y, GLYPHS[i % GLYPHS.length]!, { fontFamily: "system-ui, sans-serif", fontSize: "20px", fontStyle: "bold", color: "#e8e6f5" }).setOrigin(0.5);
      const zone = letterGroup.create(x, y, undefined as unknown as string) as Phaser.Types.Physics.Arcade.SpriteWithStaticBody;
      zone.setVisible(false).setDisplaySize(30, 30).refreshBody();
      zone.setData("bits", [disc, t]);
      if (motion) this.tweens.add({ targets: [disc, t], y: y - 4, duration: 900 + (i % 3) * 120, yoyo: true, repeat: -1, ease: "Sine.easeInOut" });
    });

    // the sealed exit
    this.exitGate = this.physics.add.staticGroup().create(level.exit.c * TILE + TILE / 2, level.exit.r * TILE + TILE / 2, tex("door-sealed")) as Phaser.Types.Physics.Arcade.SpriteWithStaticBody;
    this.exitGate.setDisplaySize(TILE, TILE).refreshBody();

    // ── the player ──
    this.startPx = { x: level.start.c * TILE + TILE / 2, y: level.start.r * TILE + TILE / 2 };
    this.safePos = { ...this.startPx };
    this.player = this.physics.add.sprite(this.startPx.x, this.startPx.y, "p-right");
    this.player.setDisplaySize(TILE, TILE);
    this.baseScale = this.player.scaleY;
    this.player.body.setSize(20, 40).setOffset(14, 6);
    this.player.body.setMaxVelocityY(ARCADE.maxFall);
    this.physics.world.gravity.y = ARCADE.gravity;
    this.physics.world.setBounds(0, 0, level.w * TILE, level.h * TILE);
    this.player.setCollideWorldBounds(true);
    this.physics.add.collider(this.player, solids);
    this.physics.add.collider(this.player, oneWays);
    this.physics.add.overlap(this.player, spikes, () => this.hurt("spikes"));
    this.physics.add.overlap(this.player, letterGroup, (_p, zone) => this.collectLetter(zone as Phaser.Types.Physics.Arcade.SpriteWithStaticBody));

    // ── enemies ──
    level.enemies.forEach((e, i) => {
      const s = this.physics.add.sprite(e.c * TILE + TILE / 2, e.r * TILE + TILE / 2 + 7, tex(e.kind));
      s.setDisplaySize(40, 34);
      s.body.setSize(30, 24).setOffset(5, 6);
      if (e.kind === "flyer") s.body.setAllowGravity(false);
      else this.physics.add.collider(s, solids);
      const enemy: Enemy = { kind: e.kind, sprite: s, dir: i % 2 === 0 ? 1 : -1, homeY: s.y, nextHopAt: 800 + i * 400, alive: true, idx: i };
      this.enemies.push(enemy);
      this.physics.add.overlap(this.player, s, () => this.contact(enemy));
      if (motion && e.kind !== "flyer") {
        this.tweens.add({ targets: s, scaleY: { from: s.scaleY, to: s.scaleY * 0.9 }, duration: 700 + i * 90, yoyo: true, repeat: -1, ease: "Sine.easeInOut" });
      }
    });

    // fx
    const spark = document.createElement("canvas");
    spark.width = 8; spark.height = 8;
    const sg = spark.getContext("2d")!;
    sg.fillStyle = "#cfc7ff"; sg.beginPath(); sg.arc(4, 4, 3, 0, Math.PI * 2); sg.fill();
    if (!this.textures.exists("ka-spark")) this.textures.addCanvas("ka-spark", spark);
    this.burst = this.add.particles(0, 0, "ka-spark", { speed: { min: 60, max: 240 }, angle: { min: 0, max: 360 }, scale: { start: 1.2, end: 0 }, alpha: { start: 1, end: 0 }, lifespan: { min: 240, max: 520 }, gravityY: 300, emitting: false }).setDepth(5);
    this.dust = this.add.particles(0, 0, "ka-spark", { speed: { min: 20, max: 70 }, angle: { min: 200, max: 340 }, scale: { start: 0.7, end: 0 }, alpha: { start: 0.5, end: 0 }, lifespan: 260, tint: 0x9aa0b8, emitting: false }).setDepth(4);

    const kb = this.input.keyboard;
    if (kb) {
      this.cursors = kb.createCursorKeys();
      this.wasd = kb.addKeys("W,A,S,D") as typeof this.wasd;
    }

    this.cameras.main.setBounds(0, 0, level.w * TILE, level.h * TILE);
    this.cameras.main.startFollow(this.player, true, this.cfg.reducedMotion === true ? 1 : 0.14, this.cfg.reducedMotion === true ? 1 : 0.14);
    // Keen's camera: a ~3-tile horizontal dead band, and vertically LAZY so
    // the view never bobs with every hop (Keen gates vertical follow to
    // grounded states; a tall deadzone approximates that in Phaser).
    this.cameras.main.setDeadzone(130, 190);
    if (motion) this.cameras.main.fadeIn(240, 20, 18, 33);
    this.startedAt = this.time.now;
  }

  /** Read-only snapshot for the non-prod `__domigo` machine-playtest harness. */
  debugState(): { x: number; y: number; vx: number; vy: number; grounded: boolean; hearts: number; letters: number; words: number; combo: number; frozen: boolean; over: boolean; exitOpen: boolean; enemiesLeft: number; fps: number; scaleY: number; bodyBottom: number } {
    return {
      scaleY: Math.round((this.player?.scaleY ?? 0) * 1000) / 1000,
      bodyBottom: Math.round(this.player?.body?.bottom ?? 0),
      x: Math.round(this.player?.x ?? 0),
      y: Math.round(this.player?.y ?? 0),
      vx: Math.round(this.player?.body?.velocity.x ?? 0),
      vy: Math.round(this.player?.body?.velocity.y ?? 0),
      grounded: this.player?.body?.blocked.down ?? false,
      hearts: this.hearts,
      letters: this.letters,
      words: this.words,
      combo: this.combo,
      frozen: this.frozen,
      over: this.over,
      exitOpen: this.exitOpen,
      enemiesLeft: this.enemies.filter((e) => e.alive).length,
      fps: Math.round(this.game.loop.actualFps),
    };
  }

  private collectLetter(zone: Phaser.Types.Physics.Arcade.SpriteWithStaticBody): void {
    if (zone.getData("done") === true) return;
    zone.setData("done", true);
    zone.disableBody(true, false);
    const bits = zone.getData("bits") as Phaser.GameObjects.GameObject[];
    this.letters += 1;
    this.cfg.onLetters(this.letters);
    playSfx("tick");
    if (this.cfg.reducedMotion === true) bits.forEach((b) => (b as Phaser.GameObjects.Image).setAlpha(0.15));
    else {
      this.burst?.explode(8, zone.x, zone.y);
      this.tweens.add({ targets: bits, y: "-=26", alpha: 0, duration: 320, ease: "Back.easeIn" });
    }
  }

  /** Enemy contact → freeze the world, hand React the quickfire. */
  private contact(enemy: Enemy): void {
    if (!enemy.alive || this.frozen || this.over || this.time.now < this.invulnUntil) return;
    this.frozen = true;
    this.physics.world.pause();
    this.tweens.timeScale = 0.0001; // idle wobbles hold their breath too
    enemy.sprite.setData("engaged", true);
    if (this.cfg.reducedMotion !== true) this.cameras.main.zoomTo(1.18, 160, "Sine.easeOut");
    playSfx("pop");
    this.cfg.onQuickfire(this.contactIdx);
    this.contactIdx += 1;
  }

  /** React reports the quickfire verdict; the run resumes on the next frame. */
  resolveQuickfire(correct: boolean): void {
    const enemy = this.enemies.find((e) => e.sprite.getData("engaged") === true);
    this.frozen = false;
    this.physics.world.resume();
    this.tweens.timeScale = 1;
    if (this.cfg.reducedMotion !== true) this.cameras.main.zoomTo(1, 180, "Sine.easeOut");
    if (enemy) {
      enemy.sprite.setData("engaged", false);
      enemy.alive = false;
      enemy.sprite.disableBody(true, false);
      const s = enemy.sprite;
      if (this.cfg.reducedMotion === true) s.setVisible(false);
      else {
        this.burst?.explode(16, s.x, s.y);
        this.tweens.add({ targets: s, scale: s.scale * 1.5, alpha: 0, duration: 260, ease: "Back.easeIn", onComplete: () => s.setVisible(false) });
        this.cameras.main.shake(70, 0.004);
      }
    }
    // The word comes back EITHER WAY (the answer was shown — same doctrine as
    // the overworld battle: progress is never hostage to one tap). Skill is
    // rewarded through combo/points/hearts, not through lockout — a run can
    // always reach the exit.
    this.words += 1;
    this.cfg.onWords(this.words);
    if (correct) {
      this.combo += 1;
      this.maxCombo = Math.max(this.maxCombo, this.combo);
      const pts = comboPoints(this.combo);
      this.cfg.onCombo(this.combo, pts);
      playSfx(this.combo >= 3 ? "streak" : "chime-correct");
      if (this.cfg.reducedMotion !== true && enemy) {
        const t = this.add.text(enemy.sprite.x, enemy.sprite.y - 20, `+${pts}`, { fontFamily: "system-ui, sans-serif", fontSize: "22px", fontStyle: "bold", color: "#ffe066" }).setOrigin(0.5).setDepth(6);
        this.tweens.add({ targets: t, y: t.y - 40, alpha: 0, duration: 700, ease: "Sine.easeOut", onComplete: () => t.destroy() });
      }
    } else {
      this.combo = 0;
      this.cfg.onCombo(0, 0);
      this.hurt("quickfire");
    }
    if (!this.exitOpen && this.words >= this.cfg.wordsNeeded) this.openExit();
    this.invulnUntil = this.time.now + 1200;
  }

  private openExit(): void {
    this.exitOpen = true;
    this.exitGate.setTexture("ka-door");
    playSfx("whoosh");
    if (this.cfg.reducedMotion !== true) {
      this.burst?.explode(20, this.exitGate.x, this.exitGate.y);
      this.tweens.add({ targets: this.exitGate, scale: { from: this.exitGate.scale * 1.2, to: this.exitGate.scale }, duration: 300, ease: "Back.easeOut" });
    }
  }

  private hurt(source: "spikes" | "quickfire"): void {
    if (this.over || this.time.now < this.invulnUntil) return;
    this.invulnUntil = this.time.now + 1200;
    this.hearts -= 1;
    this.cfg.onHearts(this.hearts);
    playSfx("thud");
    if (source === "spikes") {
      // pop up out of the ink, then return to the last safe footing
      this.player.setVelocity(0, -430);
      this.time.delayedCall(260, () => {
        if (!this.over) this.player.setPosition(this.safePos.x, this.safePos.y).setVelocity(0, 0);
      });
    }
    if (this.cfg.reducedMotion !== true) {
      this.player.setTintFill(0xff6b6b);
      this.time.delayedCall(140, () => this.player.clearTint());
      this.cameras.main.shake(90, 0.006);
    }
    if (this.hearts <= 0) {
      this.over = true;
      this.player.setVelocity(0, 0);
      this.cfg.onGameOver();
    }
  }

  /** Fall speed at the moment of leaving the air (for the landing squash gate). */
  private landingVy = 0;

  /** Idempotent squash/stretch: kill any live scale tween, reset to the true
   *  base, tween out and ALWAYS restore the base — the body follows the scale,
   *  so a drifting scale physically shrinks the player into the floor. */
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

  /** Restart after game over: position + hearts reset; letters, popped enemies
   *  and won words are KEPT (kind to kids — progress is never taken back). */
  restartRun(): void {
    this.over = false;
    this.hearts = 3;
    this.cfg.onHearts(3);
    this.combo = 0;
    this.player.setPosition(this.startPx.x, this.startPx.y).setVelocity(0, 0);
    this.invulnUntil = this.time.now + 1500;
  }

  update(): void {
    if (!this.player || this.frozen || this.over) return;
    const now = this.time.now;
    const body = this.player.body;
    const grounded = body.blocked.down;

    // ── input (keyboard OR'd with the virtual pad/harness) ──
    const pad = this.cfg.pad;
    const left = this.cursors?.left.isDown === true || this.wasd?.A.isDown === true || pad?.left === true;
    const right = this.cursors?.right.isDown === true || this.wasd?.D.isDown === true || pad?.right === true;
    const jumpDown = this.cursors?.up.isDown === true || this.cursors?.space?.isDown === true || this.wasd?.W.isDown === true || pad?.jump === true;

    // Keen's "digital ground, analog air": grounded movement SNAPS to the
    // target speed (instant start/stop — precision lives here); mid-air the
    // velocity RAMPS toward the held direction and bleeds off when released.
    const target = left === right ? 0 : left ? -ARCADE.runSpeed : ARCADE.runSpeed;
    if (grounded) {
      body.setVelocityX(target);
    } else {
      const rate = target === 0 ? ARCADE.airFriction : ARCADE.airAccel;
      const dv = (rate * this.game.loop.delta) / 1000;
      const vx = body.velocity.x;
      body.setVelocityX(Math.abs(target - vx) <= dv ? target : vx + Math.sign(target - vx) * dv);
    }
    if (target !== 0) this.facing = target > 0 ? 1 : -1;
    this.player.setFlipX(this.facing === -1);

    // ── the jump (coyote + buffer + variable height — arcade.ts, unit-tested) ──
    if (grounded) this.lastGroundedAt = now;
    if (jumpDown && !this.jumpHeld) this.jumpPressedAt = now;
    if (canJump(now, this.lastGroundedAt, this.jumpPressedAt) && body.velocity.y >= -1) {
      body.setVelocityY(ARCADE.jumpVelocity);
      this.lastGroundedAt = -9999;
      this.jumpPressedAt = -9999;
      playSfx("tick");
      if (this.cfg.reducedMotion !== true) {
        this.squashStretch(1.12, 0.9); // stretch on take-off
        this.dust?.explode(5, this.player.x, this.player.y + 20);
      }
    }
    if (!jumpDown && this.jumpHeld) body.setVelocityY(jumpCut(body.velocity.y));
    this.jumpHeld = jumpDown;

    // remember safe footing (grounded, not standing over spikes)
    if (grounded && now >= this.invulnUntil) {
      const c = Math.floor(this.player.x / TILE);
      const r = Math.floor(this.player.y / TILE);
      if (this.cfg.level.rows[r + 1]?.[c] !== "^" && this.cfg.level.rows[r]?.[c] !== "^") {
        this.safePos = { x: this.player.x, y: this.player.y };
      }
    }

    // land squash + dust (only for a REAL landing, not boot-settle flicker)
    if (grounded && !this.wasGrounded && this.landingVy > 250 && this.cfg.reducedMotion !== true) {
      this.squashStretch(0.86, 1.1);
      this.dust?.explode(6, this.player.x, this.player.y + 20);
    }
    if (!grounded) this.landingVy = body.velocity.y;
    this.wasGrounded = grounded;

    // run frames (reuse the overworld walk cycle on the right-facing frames)
    const moving = Math.abs(body.velocity.x) > 30 && grounded;
    const frame = !grounded ? "p-right-1" : moving ? (Math.floor(now / 130) % 2 === 0 ? "p-right-1" : "p-right-2") : "p-right";
    if (this.player.texture.key !== frame && this.textures.exists(frame)) {
      this.player.setTexture(frame);
      this.player.setDisplaySize(TILE, TILE);
    }
    // i-frames blink
    this.player.setAlpha(now < this.invulnUntil ? (Math.floor(now / 90) % 2 === 0 ? 0.45 : 1) : 1);

    // ── enemies ──
    for (const e of this.enemies) {
      if (!e.alive) continue;
      const s = e.sprite;
      if (e.kind === "walker") {
        const c = Math.floor(s.x / TILE);
        const r = Math.floor(s.y / TILE);
        if (walkerShouldTurn(this.cfg.level, c, r, e.dir)) e.dir = e.dir === 1 ? -1 : 1;
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
      } else {
        s.y = e.homeY + flyerOffset(now, e.idx);
        s.x += Math.sin(now / 900 + e.idx) * 0.4;
      }
    }

    // exit
    if (this.exitOpen && Phaser.Math.Distance.Between(this.player.x, this.player.y, this.exitGate.x, this.exitGate.y) < 34) {
      this.over = true;
      this.player.setVelocity(0, 0);
      playSfx("chime-correct");
      if (this.cfg.reducedMotion !== true) this.cameras.main.fadeOut(400, 20, 18, 33);
      this.cfg.onComplete({ ms: now - this.startedAt, maxCombo: this.maxCombo, letters: this.letters, words: this.words });
    }
  }
}
