import Phaser from "phaser";
import { schoolArt, type SCHOOL_ART } from "./school-art.ts";
import { SCHOOL_TILE, SCHOOL_START, SCHOOL_STATIONS, MERLE_ROAM, availableStation, schoolComplete, schoolPath, schoolStep, directionBetween, validSchoolPosition, type Direction } from "./school.ts";
import type { Cell } from "./path.ts";
const TILE = SCHOOL_TILE;
const frames: Record<Direction, number> = { down: 0, left: 1, right: 2, up: 3 };
type SchoolOptions = {
  solved: string[]; pos?: Cell; motion: boolean;
  onStation: (id: string) => void; onExit: () => void; onMove: (pos: Cell) => void;
};
/** The school shares Phaser and the existing orthogonal pathfinder. */
export class SchoolScene extends Phaser.Scene {
  private opts: SchoolOptions;
  private pos: Cell;
  private route: Cell[] = [];
  private destination: string | null = null;
  private hero!: Phaser.GameObjects.Image;
  private merle!: Phaser.GameObjects.Image;
  private markers = new Map<string, Phaser.GameObjects.Arc>();
  private walking = false;
  private paused = false;
  private nextStep = 0;
  private roamIndex = 0;
  private nextRoam = 0;
  private keys?: Phaser.Types.Input.Keyboard.CursorKeys;
  private direction: Direction = "up";
  public tape: Array<{ input: string; c: number; r: number }> = [];
  private record(input: string, c: number, r: number) {
    this.tape.push({ input, c, r });
    if (process.env.NODE_ENV !== "production") console.info("[school-input]", JSON.stringify({ input, c, r }));
  }
  constructor(opts: SchoolOptions) {
    super("school"); this.opts = opts; this.pos = validSchoolPosition(opts.pos);
  }
  preload() {
    this.load.image("school-room", schoolArt("classroom.png"));
    for (const who of ["du", "merle", "oswin", "berger", "klecks"]) {
      for (const dir of Object.keys(frames)) this.load.image(`school-${who}-${dir}`, schoolArt(`${who}-${dir}.png` as keyof typeof SCHOOL_ART));
    }
  }
  create() {
    this.add.image(360, 264, "school-room").setDisplaySize(720, 528);
    for (const [id, cell] of Object.entries(SCHOOL_STATIONS)) {
      const marker = this.add.circle(cell.c * TILE + 12, cell.r * TILE + 16, id.startsWith("frei-") ? 4 : 8, 0x8999ff, .9).setDepth(1);
      marker.setStrokeStyle(2, 0xe6e5ff, .9);
      this.markers.set(id, marker);
    }
    this.person("berger", { c: 10, r: 6 }, "down", 53);
    this.person("oswin", { c: 23, r: 16 }, "left", 42);
    this.person("klecks", { c: 12, r: 16 }, "right", 24);
    this.merle = this.person("merle", MERLE_ROAM[0]!, "left", 44);
    this.hero = this.person("du", this.pos, "up", 44);
    this.keys = this.input.keyboard?.createCursorKeys();
    this.input.on("pointerdown", (p: Phaser.Input.Pointer) => this.tap(Math.floor(p.x / TILE), Math.floor(p.y / TILE)));
    this.updateSolved(this.opts.solved);
  }
  private person(who: string, cell: Cell, dir: Direction, height: number) {
    const image = this.add.image(cell.c * TILE + 12, cell.r * TILE + 20, `school-${who}-${dir}`).setOrigin(.5, 1);
    image.setScale(height / image.height).setDepth(cell.r * TILE + 20);
    return image;
  }
  updateSolved(solved: string[]) {
    this.opts.solved = solved;
    for (const [id, marker] of this.markers) {
      const done = solved.includes(id);
      marker.setFillStyle(done ? 0xc1d790 : 0x839bff, done ? .5 : .95);
      marker.setVisible(availableStation(id, solved));
    }
  }
  setPaused(paused: boolean) { this.paused = paused; if (paused) { this.route = []; this.destination = null; } }
  tap(c: number, r: number) {
    if (this.paused || this.walking) return;
    const station = Object.entries(SCHOOL_STATIONS).find(([, cell]) => cell.c === c && cell.r === r)?.[0];
    if (station && !availableStation(station, this.opts.solved)) return;
    const route = schoolPath(this.pos, { c, r });
    if (!route) return;
    this.route = route;
    this.destination = station ?? (c === SCHOOL_START.c && r === SCHOOL_START.r ? "exit" : null);
    this.record("tap", c, r);
    if (!route.length) this.arrive();
  }
  move(direction: Direction) {
    if (this.paused || this.walking) return;
    this.route = []; this.destination = null;
    const next = schoolStep(this.pos, direction);
    this.direction = direction;
    this.hero.setTexture(`school-du-${direction}`);
    if (next === this.pos) return;
    this.record(direction, next.c, next.r);
    this.walk(next);
  }
  interact() {
    if (this.paused || this.walking) return;
    const station = Object.entries(SCHOOL_STATIONS).find(([id, p]) => availableStation(id, this.opts.solved) && p.c === this.pos.c && p.r === this.pos.r)?.[0];
    if (station) this.opts.onStation(station);
    else if (this.pos.c === SCHOOL_START.c && this.pos.r === SCHOOL_START.r && schoolComplete(this.opts.solved)) this.opts.onExit();
  }
  private arrive() {
    const target = this.destination; this.destination = null;
    if (target === "exit") { if (schoolComplete(this.opts.solved)) this.opts.onExit(); }
    else if (target) this.opts.onStation(target);
  }
  private walk(next: Cell) {
    this.walking = true;
    this.direction = directionBetween(this.pos, next);
    this.hero.setTexture(`school-du-${this.direction}`);
    this.tweens.add({ targets: this.hero, x: next.c * TILE + 12, y: next.r * TILE + 20, duration: this.opts.motion ? 100 : 0,
      onComplete: () => { this.pos = next; this.hero.setDepth(this.hero.y); this.walking = false; this.opts.onMove(next); if (!this.route.length) this.arrive(); } });
  }
  update(time: number) {
    // Freeze in-flight movement too, not only the scheduling of the next step.
    if (this.paused || document.hidden) this.tweens.pauseAll();
    else this.tweens.resumeAll();
    if (this.paused || document.hidden) return;
    if (!this.walking && this.route.length) this.walk(this.route.shift()!);
    if (!this.walking && time > this.nextStep && this.keys) {
      const dir = this.keys.up.isDown ? "up" : this.keys.down.isDown ? "down" : this.keys.left.isDown ? "left" : this.keys.right.isDown ? "right" : null;
      if (dir) { this.move(dir); this.nextStep = time + 155; }
      if (Phaser.Input.Keyboard.JustDown(this.keys.space)) this.interact();
    }
    if (this.opts.solved.includes("alibi") && time > this.nextRoam && this.opts.motion) {
      const from = MERLE_ROAM[this.roamIndex]!;
      this.roamIndex = (this.roamIndex + 1) % MERLE_ROAM.length;
      const to = MERLE_ROAM[this.roamIndex]!;
      this.merle.setTexture(`school-merle-${directionBetween(from, to)}`);
      this.tweens.add({ targets: this.merle, x: to.c * TILE + 12, y: to.r * TILE + 20, duration: 900, onComplete: () => this.merle.setDepth(this.merle.y) });
      this.nextRoam = time + 2200;
    }
  }
  snapshot() { return { pos: { ...this.pos }, direction: this.direction, solved: [...this.opts.solved], walking: this.walking, paused: this.paused, tape: [...this.tape] }; }
}
