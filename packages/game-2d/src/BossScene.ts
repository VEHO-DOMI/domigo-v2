/**
 * The boss duel scene (bible 27 §3, doc 25 §5.4) — Punch-Out re-keyed to
 * language production, first instance: Der Stundenplan-Schlinger.
 *
 * The scene renders and times; the FSM is pure (boss.ts); the task overlay,
 * grading and attempts live in ArcadeGame (one brain, one pipe). Three lanes,
 * legible telegraphs, dodge = leave the lane, every dodge opens a counter
 * window. Hearts carry in from the level (one stamina pool, §2b); losing the
 * last one hands over to the standing Rettungsaufgabe, and the duel restarts
 * with two hearts (respawn at the boss door).
 *
 * All visuals procedural (visuals-last, doc 25 §9): the guardian is a serpent
 * of timetable cards — knots remaining ARE its body.
 */
import Phaser from "phaser";
import { paintHero } from "@domigo/art-gen";
import { rasterize } from "./rasterize.ts";
import { playSfx } from "@domigo/game-feel";
import { TILE_PX, type Tier } from "./arcade.ts";
import { BOSS_TIMING, LANES, stepBoss, windowResolved, type BossPhase, type BossScript } from "./boss.ts";
import type { ArcadePad } from "./ArcadeScene.ts";

const VIEW_W = 15 * TILE_PX;
const VIEW_H = 11 * TILE_PX;
const FLOOR_R = 9;
const LANE_X = [2.5, 7.5, 12.5].map((c) => c * TILE_PX);
const LANE_TINT = [0xf59e0b, 0x8b7cf5, 0x38bdf8]; // amber · violet · sky — the tell colors
const CARD_WORDS = ["MATHE", "ENGLISCH", "SPORT", "KUNST", "MUSIK", "PAUSE", "DEUTSCH", "SACHE"];

export interface BossConfig {
  script: BossScript;
  /** doc 28 §5: generated-art URL map (boss_head_idle, boss_head_tell,
   *  boss_card, hero_stand…); missing stems keep the procedural pieces. */
  art?: Record<string, string>;
  tier: Tier;
  /** hearts carried in from the level (§2b: one pool) */
  hearts: number;
  seed: number;
  playerSeed?: number;
  reducedMotion?: boolean;
  pad: ArcadePad;
  onHearts: (hearts: number) => void;
  /** a dodged attack opened the counter window (React mounts the task) */
  onWindow: () => void;
  onKnots: (left: number, total: number) => void;
  onBeaten: () => void;
  /** the last heart fell — React opens the Rettungsaufgabe */
  onRescue: () => void;
}

export class BossScene extends Phaser.Scene {
  private cfg: BossConfig;
  private phaseState: BossPhase = { kind: "enter", untilMs: 0 };
  private attackIdx = 0;
  private knotsLeft: number;
  private hearts: number;
  private lane = 1;
  private player!: Phaser.GameObjects.Image;
  private head!: Phaser.GameObjects.Container;
  private segments: Phaser.GameObjects.Container[] = [];
  private laneFlash!: Phaser.GameObjects.Rectangle;
  private frozen = false; // true while the task overlay / rescue owns time
  private lastLeft = false;
  private lastRight = false;
  private invulnUntil = 0;

  constructor(cfg: BossConfig) {
    super("boss");
    this.cfg = cfg;
    this.knotsLeft = cfg.script.knots;
    this.hearts = cfg.hearts;
  }

  static dimensions(): { width: number; height: number } {
    return { width: VIEW_W, height: VIEW_H };
  }

  preload(): void {
    // image-first (doc 28 §5); failed loads keep the procedural pieces
    for (const [stem, url] of Object.entries(this.cfg.art ?? {})) {
      this.load.image(`img-${stem}`, url);
    }
  }

  create(): void {
    // batch V: the painted attic arena behind the duel (procedural veil stays on top)
    if (this.textures.exists("img-bgp_schoolhouse_arena")) {
      const bg = this.add.image(0, 0, "img-bgp_schoolhouse_arena").setOrigin(0).setDepth(0);
      bg.setDisplaySize(Math.max(bg.width, VIEW_W), Math.max((bg.height * VIEW_W) / bg.width, VIEW_H));
      bg.setDisplaySize(VIEW_W, VIEW_H * 1.05);
      bg.setAlpha(0.92);
    }
    const motion = this.cfg.reducedMotion !== true;
    // backdrop: the level's ink dark, floor strip
    this.add.rectangle(0, 0, VIEW_W, VIEW_H, 0x141221).setOrigin(0);
    for (let i = 0; i < 7; i += 1) {
      const x = (this.cfg.seed * 37 + i * 149) % VIEW_W;
      const y = 40 + ((this.cfg.seed * 91 + i * 211) % (FLOOR_R * TILE_PX - 120));
      this.add.circle(x, y, 14 + (i % 3) * 8, 0x786ec8, 0.07);
    }
    this.add.rectangle(0, FLOOR_R * TILE_PX, VIEW_W, (11 - FLOOR_R) * TILE_PX, 0x2c2a44).setOrigin(0);
    this.add.rectangle(0, FLOOR_R * TILE_PX, VIEW_W, 6, 0x8b7cf5, 0.35).setOrigin(0);

    // lane guides (faint) + the flash rect
    for (const x of LANE_X) this.add.rectangle(x, FLOOR_R * TILE_PX - 2, TILE_PX * 2.4, 4, 0xffffff, 0.06);
    this.laneFlash = this.add.rectangle(LANE_X[1]!, VIEW_H / 2, TILE_PX * 3.2, VIEW_H, 0xffffff, 0).setDepth(2);

    // the player
    const hero = paintHero(this.cfg.playerSeed ?? this.cfg.seed);
    if (!this.textures.exists("h-stand")) this.textures.addCanvas("h-stand", rasterize(hero.frames.stand, 1));
    this.player = this.add.image(LANE_X[1]!, FLOOR_R * TILE_PX - 30, this.textures.exists("img-hero_stand") ? "img-hero_stand" : "h-stand").setDisplaySize(48, 48).setDepth(5);

    // the guardian: head + knot segments (timetable cards)
    this.segments = [];
    for (let i = 0; i < this.cfg.script.knots; i += 1) this.segments.push(this.makeCard(CARD_WORDS[i % CARD_WORDS.length]!, i));
    this.head = this.makeHead();
    this.layoutSerpent(0);

    // tap thirds move between lanes (touch parity)
    this.input.on(Phaser.Input.Events.POINTER_DOWN, (p: Phaser.Input.Pointer) => {
      const third = Math.floor((p.x / this.scale.width) * LANES);
      this.lane = Math.max(0, Math.min(LANES - 1, third));
    });

    this.phaseState = { kind: "enter", untilMs: this.time.now + BOSS_TIMING.enterMs };
    this.cfg.onKnots(this.knotsLeft, this.cfg.script.knots);
    if (motion) this.cameras.main.fadeIn(420, 20, 18, 33);
  }

  private makeCard(word: string, i: number): Phaser.GameObjects.Container {
    const parts: Phaser.GameObjects.GameObject[] = [];
    if (this.textures.exists("img-boss2_card") || this.textures.exists("img-boss_card")) {
      parts.push(this.add.image(0, 0, this.textures.exists("img-boss2_card") ? "img-boss2_card" : "img-boss_card").setDisplaySize(64, 44));
    } else {
      const g = this.add.graphics();
      g.fillStyle(0x2c2a44, 1).fillRoundedRect(-30, -20, 60, 40, 8);
      g.lineStyle(2, 0x8b7cf5, 0.8).strokeRoundedRect(-30, -20, 60, 40, 8);
      parts.push(g);
    }
    parts.push(this.add.text(0, 0, word, { fontFamily: "monospace", fontSize: "10px", color: "#e8e6f5", fontStyle: "bold" }).setOrigin(0.5));
    const c = this.add.container(VIEW_W / 2 + i * 40, TILE_PX * 2, parts).setDepth(4);
    return c;
  }

  private headImg: Phaser.GameObjects.Image | null = null;

  private makeHead(): Phaser.GameObjects.Container {
    // generated guardian head when present (idle; the telegraph tint still
    // signals the tell — the dedicated tell frame swaps in at PR-4 wiring)
    if (this.textures.exists("img-boss2_head_idle") || this.textures.exists("img-boss_head_idle")) {
      const v2 = this.textures.exists("img-boss2_head_idle");
      const img = this.add.image(0, 0, v2 ? "img-boss2_head_idle" : "img-boss_head_idle").setDisplaySize(v2 ? 150 : 84, v2 ? 78 : 84);
      this.headImg = img; // the tell frame swaps on telegraph (batch U)
      return this.add.container(VIEW_W / 2, TILE_PX * 2, [img]).setDepth(5);
    }
    const g = this.add.graphics();
    g.fillStyle(0x1b1930, 1).fillCircle(0, 0, 34);
    g.lineStyle(3, 0x8b7cf5, 0.9).strokeCircle(0, 0, 34);
    // eyes — googly, worried (never a monster; the register holds even here)
    g.fillStyle(0xf6f5ff, 1).fillCircle(-12, -6, 9).fillCircle(12, -6, 9);
    g.fillStyle(0x0c0b14, 1).fillCircle(-10, -5, 4).fillCircle(14, -5, 4);
    // the mouth: a clenched card
    g.fillStyle(0x2c2a44, 1).fillRoundedRect(-16, 10, 32, 14, 4);
    const c = this.add.container(VIEW_W / 2, TILE_PX * 2, [g]).setDepth(5);
    return c;
  }

  /** Serpent idle layout: head + remaining knots in a sine chain. */
  private layoutSerpent(tMs: number): void {
    const baseY = TILE_PX * 2.1;
    const spacing = Math.min(64, (VIEW_W - 160) / Math.max(this.segments.length, 1));
    const startX = VIEW_W / 2 - ((this.segments.length - 1) * spacing) / 2;
    this.segments.forEach((seg, i) => {
      if (!seg.active) return;
      seg.x = startX + i * spacing;
      seg.y = baseY + Math.sin(tMs / 620 + i * 0.9) * 14;
    });
    if (this.phaseState.kind !== "telegraph" && this.phaseState.kind !== "attack") {
      this.head.x = startX - spacing * 0.9;
      this.head.y = baseY + Math.sin(tMs / 620 - 0.9) * 14;
    }
  }

  /** React resolves the open counter window (one brain answered). */
  /** dev-only (the step-harness cannot dodge in real time, P-37b family):
   *  jump straight to the beaten state — used ONLY to prove the win→finale
   *  transition; never reachable from gameplay. */
  debugWin(): void {
    if (process.env.NODE_ENV === "production") return;
    this.knotsLeft = 0;
    this.cfg.onKnots(0, this.cfg.script.knots);
    this.beaten();
  }

  resolveWindow(correct: boolean): void {
    if (this.phaseState.kind !== "window") return;
    const r = windowResolved(correct, this.knotsLeft, this.time.now);
    this.knotsLeft = r.knotsLeft;
    this.phaseState = r.next;
    this.frozen = false;
    if (correct) {
      playSfx("pop");
      const seg = this.segments.filter((s) => s.active).at(-1);
      if (seg) {
        this.tweens.add({ targets: seg, scale: 1.6, alpha: 0, angle: 40, duration: this.cfg.reducedMotion === true ? 0 : 520, ease: "Back.easeIn", onComplete: () => seg.setActive(false).setVisible(false) });
      }
      this.cfg.onKnots(this.knotsLeft, this.cfg.script.knots);
      if (this.phaseState.kind === "beaten") this.beaten();
    }
  }

  /** The rescue solved: the duel restarts at the door with two hearts (§2b). */
  resetDuel(): void {
    this.hearts = 2;
    this.cfg.onHearts(2);
    this.knotsLeft = this.cfg.script.knots;
    this.attackIdx = 0;
    this.segments.forEach((s) => s.setActive(true).setVisible(true).setAlpha(1).setScale(1).setAngle(0));
    this.cfg.onKnots(this.knotsLeft, this.cfg.script.knots);
    this.frozen = false;
    this.phaseState = { kind: "enter", untilMs: this.time.now + BOSS_TIMING.enterMs };
  }

  private beaten(): void {
    this.frozen = true;
    playSfx("chime-correct");
    const motion = this.cfg.reducedMotion !== true;
    this.tweens.add({ targets: this.head, y: this.head.y - 40, alpha: 0, scale: 1.4, duration: motion ? 900 : 0, ease: "Sine.easeIn" });
    this.time.delayedCall(motion ? 1000 : 0, () => this.cfg.onBeaten());
  }

  debugState(): Record<string, number | string | boolean> {
    return {
      phase: this.phaseState.kind,
      lane: this.lane,
      attackLane: this.phaseState.kind === "telegraph" || this.phaseState.kind === "attack" ? this.phaseState.lane : -1,
      knotsLeft: this.knotsLeft,
      hearts: this.hearts,
      frozen: this.frozen,
      fps: Math.round(this.game.loop.actualFps),
    };
  }

  update(): void {
    const now = this.time.now;
    this.layoutSerpent(now);
    if (this.frozen) return;

    // lane input: edge-triggered left/right (digital lanes)
    const pad = this.cfg.pad;
    if (pad.left && !this.lastLeft) this.lane = Math.max(0, this.lane - 1);
    if (pad.right && !this.lastRight) this.lane = Math.min(LANES - 1, this.lane + 1);
    this.lastLeft = pad.left;
    this.lastRight = pad.right;
    // ease the player to the lane
    this.player.x += (LANE_X[this.lane]! - this.player.x) * 0.28;

    const before = this.phaseState;
    const { next, events } = stepBoss(before, now, this.lane, this.cfg.script, this.cfg.tier, this.attackIdx);
    this.phaseState = next;

    if (events.tell && next.kind === "telegraph") {
      this.attackIdx += 1;
      playSfx("tick");
      // the dedicated tell frame (batch U): mouth open, threads taut
      if (this.headImg && this.textures.exists("img-boss2_head_tell")) this.headImg.setTexture("img-boss2_head_tell").setDisplaySize(150, 78);
      const lane = next.lane;
      // the head rears above the lane; the lane strip flashes its color
      this.tweens.add({ targets: this.head, x: LANE_X[lane]!, y: TILE_PX * 1.4, duration: Math.min(this.cfg.script.telegraphMs[this.cfg.tier] * 0.7, 500), ease: "Sine.easeOut" });
      this.laneFlash.x = LANE_X[lane]!;
      this.laneFlash.fillColor = LANE_TINT[lane]!;
      this.laneFlash.setAlpha(0);
      this.tweens.add({ targets: this.laneFlash, alpha: 0.22, yoyo: true, repeat: 2, duration: this.cfg.script.telegraphMs[this.cfg.tier] / 6 });
    }
    if (before.kind === "attack" && next.kind !== "attack" && this.headImg && this.textures.exists("img-boss2_head_idle")) {
      this.headImg.setTexture("img-boss2_head_idle").setDisplaySize(150, 78);
    }
    if (before.kind === "telegraph" && next.kind === "attack") {
      // the sweep: head dives down the lane and returns
      this.tweens.add({ targets: this.head, y: FLOOR_R * TILE_PX - 46, duration: this.cfg.script.attackMs * 0.55, yoyo: true, ease: "Quad.easeIn" });
    }
    if (events.hit) {
      if (now >= this.invulnUntil) {
        this.invulnUntil = now + 900;
        this.hearts -= 1;
        this.cfg.onHearts(this.hearts);
        playSfx("thud");
        if (this.cfg.reducedMotion !== true) this.cameras.main.shake(220, 0.012);
        this.player.setAlpha(0.5);
        this.time.delayedCall(700, () => this.player.setAlpha(1));
        if (this.hearts <= 0) {
          this.frozen = true;
          this.cfg.onRescue();
        }
      }
    }
    if (events.openWindow) {
      this.frozen = true; // the FSM waits for resolveWindow()
      playSfx("pop");
      // the serpent stretches out, vulnerable
      if (this.cfg.reducedMotion !== true) {
        this.tweens.add({ targets: this.head, y: TILE_PX * 2.8, angle: -8, duration: 380, ease: "Sine.easeOut" });
      }
      this.cfg.onWindow();
    }
  }
}
