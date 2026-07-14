import Phaser from "phaser";
import { FACINGS, paintPlayerSprite, type Facing } from "@domigo/art-gen";
import type { WorldArea, WorldAsset, WorldConnection, WorldDefinition, WorldInteractable } from "@domigo/content-schema";
import type { ProjectedWorldState } from "@domigo/game-core";
import { walkFrameKey } from "./anim.ts";
import { findPath, nearestWalkable, type Cell, type GridSpec } from "./path.ts";
import { rasterize } from "./rasterize.ts";

const TILE = 32;
const VIEW_W = 15 * TILE;
const VIEW_H = 11 * TILE;
const PLAYER_SPEED = 120;
const INTERACTION_RADIUS = 54;

export interface WorldPadState { up: boolean; down: boolean; left: boolean; right: boolean }
export interface WorldLocation { areaId: string; spawnId: string; position: [number, number] }
export interface WorldDebugState {
  areaId: string; x: number; y: number; cell: Cell; facing: Facing; collision: boolean;
  nearbyInteractionId: string | null; spawnId: string; storyFlags: string[];
  mapVariant: string | null; paused: boolean; blurred: boolean; pathLeft: number; fps: number;
}

export interface WorldSceneConfig {
  world: WorldDefinition;
  initialState: ProjectedWorldState;
  playerSeed: number;
  pad: WorldPadState;
  reducedMotion: boolean;
  onNearby: (item: WorldInteractable | null) => void;
  onInteract: (item: WorldInteractable) => void;
  onLocation: (location: WorldLocation) => void;
  onArea: (area: WorldArea) => void;
}

function textureKey(assetId: string): string { return `world-${assetId}`; }
function px(cell: number): number { return cell * TILE + TILE / 2; }

function paintAsset(asset: WorldAsset): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = asset.width; canvas.height = asset.height;
  const ctx = canvas.getContext("2d")!;
  const { base, accent, shadow, shape } = asset.recipe;
  ctx.imageSmoothingEnabled = false;
  ctx.fillStyle = base; ctx.fillRect(0, 0, canvas.width, canvas.height);
  const w = canvas.width, h = canvas.height;
  if (shape === "floor" || shape === "path") {
    ctx.fillStyle = accent; ctx.globalAlpha = 0.22;
    for (let y = 3; y < h; y += 8) for (let x = (y % 16) + 2; x < w; x += 12) ctx.fillRect(x, y, 2, 2);
  } else if (shape === "wall") {
    ctx.fillStyle = shadow; ctx.fillRect(0, h - 5, w, 5); ctx.fillStyle = accent;
    for (let y = 5; y < h - 5; y += 9) { ctx.fillRect(0, y, w, 2); ctx.fillRect((y / 9) % 2 ? 8 : 20, y - 7, 2, 7); }
  } else if (shape === "rug") {
    ctx.fillStyle = accent; ctx.fillRect(2, 3, w - 4, h - 6); ctx.strokeStyle = shadow; ctx.lineWidth = 2; ctx.strokeRect(4, 5, w - 8, h - 10);
  } else if (shape === "plant") {
    ctx.clearRect(0, 0, w, h); ctx.fillStyle = shadow; ctx.fillRect(9, 20, 14, 10); ctx.fillStyle = base;
    [[16,6,6],[9,11,6],[23,12,6],[15,15,7]].forEach(([x,y,r]) => { ctx.beginPath(); ctx.arc(x!, y!, r!, 0, Math.PI * 2); ctx.fill(); });
  } else if (shape === "desk") {
    ctx.fillStyle = accent; ctx.fillRect(2, 4, w - 4, 17); ctx.fillStyle = shadow; ctx.fillRect(4, 21, 5, h - 21); ctx.fillRect(w - 9, 21, 5, h - 21); ctx.fillStyle = base; ctx.fillRect(5, 7, w - 10, 3);
  } else if (shape === "shelf") {
    ctx.fillStyle = shadow; ctx.fillRect(1, 1, w - 2, h - 2); ctx.fillStyle = base; ctx.fillRect(4, 4, w - 8, h - 8); ctx.fillStyle = accent;
    for (let y = 9; y < h; y += 9) ctx.fillRect(3, y, w - 6, 3);
    [6,11,17,23].forEach((x, i) => { ctx.fillStyle = i % 2 ? "#31583f" : "#c7774b"; ctx.fillRect(x, 4, 4, 6); });
  } else if (shape === "door") {
    ctx.clearRect(0, 0, w, h); ctx.fillStyle = shadow; ctx.fillRect(4, 1, w - 8, h - 1); ctx.fillStyle = base; ctx.fillRect(7, 4, w - 14, h - 5); ctx.strokeStyle = accent; ctx.lineWidth = 2; ctx.strokeRect(10, 7, w - 20, h - 14); ctx.fillStyle = accent; ctx.fillRect(w - 11, h / 2, 3, 3);
  } else if (shape === "page") {
    ctx.clearRect(0, 0, w, h); ctx.fillStyle = base; ctx.fillRect(4, 2, w - 8, h - 4); ctx.fillStyle = accent;
    for (let y = 8; y < h - 5; y += 5) ctx.fillRect(8, y, w - 16, 2);
    if (asset.id.includes("damaged")) { ctx.fillStyle = shadow; ctx.beginPath(); ctx.moveTo(w / 2, 2); ctx.lineTo(w / 2 - 4, 12); ctx.lineTo(w / 2 + 3, 19); ctx.lineTo(w / 2 - 2, h - 2); ctx.lineTo(w / 2 + 4, h - 2); ctx.closePath(); ctx.fill(); }
  } else if (shape === "barrier") {
    ctx.clearRect(0, 0, w, h); ctx.strokeStyle = base; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(4, 26); ctx.bezierCurveTo(8, 2, 25, 5, 28, 24); ctx.stroke(); ctx.strokeStyle = accent; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(16, 16, 8, 0, Math.PI * 1.7); ctx.stroke();
  } else if (shape === "fountain") {
    ctx.clearRect(0, 0, w, h); ctx.fillStyle = shadow; ctx.beginPath(); ctx.ellipse(16, 23, 15, 7, 0, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = base; ctx.beginPath(); ctx.ellipse(16, 20, 12, 5, 0, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = accent; ctx.fillRect(14, 6, 4, 15); ctx.fillRect(10, 10, 12, 3);
  } else if (shape === "npc") {
    ctx.clearRect(0, 0, w, h); ctx.fillStyle = accent; ctx.fillRect(9, 14, 14, 13); ctx.fillStyle = base; ctx.fillRect(11, 4, 10, 10); ctx.fillStyle = shadow; ctx.fillRect(10, 2, 12, 5); ctx.fillRect(10, 27, 5, 5); ctx.fillRect(18, 27, 5, 5); ctx.fillStyle = "#273126"; ctx.fillRect(13, 8, 2, 2); ctx.fillRect(19, 8, 2, 2);
  } else if (shape === "sparkle" || shape === "collectible") {
    ctx.clearRect(0, 0, w, h); ctx.fillStyle = accent; ctx.beginPath(); ctx.moveTo(w/2,2); ctx.lineTo(w/2+4,h/2-4); ctx.lineTo(w-2,h/2); ctx.lineTo(w/2+4,h/2+4); ctx.lineTo(w/2,h-2); ctx.lineTo(w/2-4,h/2+4); ctx.lineTo(2,h/2); ctx.lineTo(w/2-4,h/2-4); ctx.closePath(); ctx.fill(); ctx.fillStyle = base; ctx.fillRect(w/2-2, h/2-7, 4, 14);
  }
  ctx.globalAlpha = 1;
  return canvas;
}

export class WorldScene extends Phaser.Scene {
  private cfg: WorldSceneConfig;
  private state: ProjectedWorldState;
  private area!: WorldArea;
  private spawnId: string;
  private player!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  private areaObjects: Phaser.GameObjects.GameObject[] = [];
  private colliders: Phaser.GameObjects.Rectangle[] = [];
  private interactionObjects = new Map<string, Phaser.GameObjects.Image>();
  private blockedCells = new Set<number>();
  private nearby: WorldInteractable | null = null;
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys | null = null;
  private wasd: Record<"W"|"A"|"S"|"D", Phaser.Input.Keyboard.Key> | null = null;
  private actionKeys: Phaser.Input.Keyboard.Key[] = [];
  private pathQueue: Cell[] = [];
  private facing: Facing = "down";
  private walkTimer = 0;
  private paused = false;
  private blurred = false;
  private debugCollision = false;
  private tick = 0;
  private lastReport = { x: 0, y: 0 };

  constructor(cfg: WorldSceneConfig) {
    super("connected-world"); this.cfg = cfg; this.state = cfg.initialState; this.spawnId = cfg.initialState.currentSpawnId;
  }
  static dimensions(): { width: number; height: number } { return { width: VIEW_W, height: VIEW_H }; }

  create(): void {
    for (const asset of this.cfg.world.assets) if (!this.textures.exists(textureKey(asset.id))) this.textures.addCanvas(textureKey(asset.id), paintAsset(asset));
    const sprite = paintPlayerSprite(this.cfg.playerSeed);
    FACINGS.forEach((f, i) => {
      const rest = `world-p-${f}`;
      if (!this.textures.exists(rest)) this.textures.addCanvas(rest, rasterize(sprite.frames[i]!, 1));
      sprite.walk[f].forEach((img, step) => { const key = `world-p-${f}-${step + 1}`; if (!this.textures.exists(key)) this.textures.addCanvas(key, rasterize(img, 1)); });
    });
    const kb = this.input.keyboard;
    if (kb) { this.cursors = kb.createCursorKeys(); this.wasd = kb.addKeys("W,A,S,D") as typeof this.wasd; this.actionKeys = [kb.addKey("E"), kb.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)]; }
    this.input.on(Phaser.Input.Events.POINTER_UP, (p: Phaser.Input.Pointer) => this.tapAt(p.worldX, p.worldY));
    this.loadArea(this.state.currentAreaId, this.state.currentSpawnId, this.state.position);
  }

  private remember<T extends Phaser.GameObjects.GameObject>(object: T): T { this.areaObjects.push(object); return object; }
  private clearArea(): void { for (const object of this.areaObjects) object.destroy(); this.areaObjects = []; this.colliders = []; this.interactionObjects.clear(); this.blockedCells.clear(); }

  private loadArea(areaId: string, spawnId: string, position?: [number, number]): void {
    const area = this.cfg.world.areas.find((candidate) => candidate.id === areaId);
    if (!area) return;
    this.clearArea(); this.area = area; this.spawnId = spawnId; this.nearby = null; this.cfg.onNearby(null);
    const worldW = area.width * TILE, worldH = area.height * TILE;
    this.physics.world.setBounds(0, 0, worldW, worldH); this.cameras.main.setBounds(0, 0, worldW, worldH);
    const paintLayer = (layer: WorldArea["layers"]["ground"], foreground = false) => {
      layer.rows.forEach((row, y) => [...row].forEach((token, x) => {
        const assetId = layer.legend[token]; if (!assetId) return;
        const image = this.remember(this.add.image(px(x), px(y), textureKey(assetId)).setDisplaySize(TILE, TILE));
        image.setDepth(foreground ? 20000 + y : (foreground ? 20000 : y * TILE));
      }));
    };
    paintLayer(area.layers.ground); paintLayer(area.layers.objects);
    area.layers.collision.rows.forEach((row, y) => [...row].forEach((token, x) => {
      if (!area.layers.collision.blockedTokens.includes(token)) return;
      this.blockedCells.add(y * area.width + x);
      const wall = this.remember(this.add.rectangle(px(x), px(y), TILE, TILE, 0xff3158, this.debugCollision ? 0.28 : 0));
      this.physics.add.existing(wall, true); this.colliders.push(wall);
    }));
    for (const item of area.interactables) this.renderInteractable(item);
    const spawn = area.spawns.find((candidate) => candidate.id === spawnId) ?? area.spawns[0]!;
    const start: [number, number] = position && position[0] >= 0 && position[0] <= worldW && position[1] >= 0 && position[1] <= worldH ? position : [px(spawn.position.x), px(spawn.position.y)];
    this.facing = spawn.facing;
    this.player = this.remember(this.physics.add.sprite(start[0], start[1], `world-p-${this.facing}`));
    this.player.setDisplaySize(TILE, TILE).setCollideWorldBounds(true).setDepth(this.player.y + 20);
    this.player.body.setSize(22, 15).setOffset(13, 28);
    for (const wall of this.colliders) this.physics.add.collider(this.player, wall);
    paintLayer(area.layers.foreground, true);
    this.cameras.main.startFollow(this.player, true, 0.14, 0.14); this.cameras.main.setZoom(1);
    if (!this.cfg.reducedMotion) this.cameras.main.fadeIn(180, 23, 53, 37);
    this.lastReport = { x: this.player.x, y: this.player.y }; this.pathQueue = [];
    this.cfg.onArea(area); this.reportLocation();
  }

  private itemPosition(item: WorldInteractable): { x: number; y: number } {
    const moved = item.moveWhenFlag && this.state.storyFlags[item.moveWhenFlag.flag] ? item.moveWhenFlag.position : item.position;
    return { x: px(moved.x), y: px(moved.y) };
  }
  private itemVisible(item: WorldInteractable): boolean {
    if (item.hiddenUntilFlag && !this.state.storyFlags[item.hiddenUntilFlag]) return false;
    if (item.kind === "collectible" && item.eventId && this.state.collectedItemIds.includes(item.eventId)) return false;
    return true;
  }
  private renderInteractable(item: WorldInteractable): void {
    if (!this.itemVisible(item) || !item.assetId) return;
    const pos = this.itemPosition(item);
    const assetId = item.assetWhenFlag && this.state.storyFlags[item.assetWhenFlag.flag] ? item.assetWhenFlag.assetId : item.assetId;
    const image = this.remember(this.add.image(pos.x, pos.y, textureKey(assetId)).setDisplaySize(TILE, TILE).setDepth(pos.y + 8));
    image.setData("interactableId", item.id); this.interactionObjects.set(item.id, image);
    if (item.kind === "npc") {
      const marker = this.remember(this.add.text(pos.x, pos.y - 27, "…", { color: "#173525", backgroundColor: "#f3c969", fontFamily: "sans-serif", fontSize: "14px", fontStyle: "bold", padding: { x: 6, y: 1 } }).setOrigin(0.5).setDepth(pos.y + 9));
      if (!this.cfg.reducedMotion) this.tweens.add({ targets: [image, marker], y: "-=2", duration: 1050, yoyo: true, repeat: -1, ease: "Sine.easeInOut" });
    } else if (item.kind === "collectible" && !this.cfg.reducedMotion) {
      this.tweens.add({ targets: image, alpha: { from: 1, to: .55 }, scale: { from: 1, to: 1.12 }, duration: 650, yoyo: true, repeat: -1 });
    } else if (item.kind === "object" || item.kind === "page") {
      this.remember(this.add.rectangle(pos.x, pos.y, TILE - 3, TILE - 3).setStrokeStyle(1, 0xf3c969, .38).setDepth(pos.y + 9));
    }
  }

  private gridSpec(): GridSpec { return { w: this.area.width, h: this.area.height, blocked: (c, r) => this.blockedCells.has(r * this.area.width + c) }; }
  tapAt(worldX: number, worldY: number): void {
    if (this.paused || this.blurred || !this.player) return;
    const target = nearestWalkable(this.gridSpec(), Math.floor(worldX / TILE), Math.floor(worldY / TILE)); if (!target) return;
    const from = { c: Math.floor(this.player.x / TILE), r: Math.floor(this.player.y / TILE) };
    this.pathQueue = findPath(this.gridSpec(), from, target) ?? [];
  }
  interact(): void { if (!this.paused && !this.blurred && this.nearby) this.cfg.onInteract(this.nearby); }
  setPaused(value: boolean): void { this.paused = value; if (value) { this.player?.setVelocity(0); this.pathQueue = []; } }
  setBlurred(value: boolean): void { this.blurred = value; if (value) { this.player?.setVelocity(0); this.pathQueue = []; this.walkTimer = 0; } }
  setDebugCollision(value: boolean): void { this.debugCollision = value; for (const wall of this.colliders) wall.setAlpha(value ? .28 : 0); }

  transition(connectionId: string): boolean {
    const connection = this.cfg.world.connections.find((candidate) => candidate.id === connectionId && candidate.from.areaId === this.area.id);
    if (!connection || (connection.requiredFlag && !this.state.storyFlags[connection.requiredFlag])) return false;
    const targetArea = this.cfg.world.areas.find((candidate) => candidate.id === connection.to.areaId); const spawn = targetArea?.spawns.find((candidate) => candidate.id === connection.to.spawnId);
    if (!targetArea || !spawn) return false;
    if (!this.cfg.reducedMotion) this.cameras.main.fadeOut(130, 23, 53, 37, (_camera: Phaser.Cameras.Scene2D.Camera, progress: number) => { if (progress === 1) this.loadArea(targetArea.id, spawn.id); });
    else this.loadArea(targetArea.id, spawn.id);
    return true;
  }
  jumpTo(areaId: string, spawnId?: string): boolean { const area = this.cfg.world.areas.find((candidate) => candidate.id === areaId); if (!area) return false; this.loadArea(area.id, spawnId ?? area.spawns[0]!.id); return true; }
  applyState(state: ProjectedWorldState): void { this.state = state; const pos: [number, number] = [this.player.x, this.player.y]; this.loadArea(this.area.id, this.spawnId, pos); }

  private reportLocation(): void { if (!this.player) return; this.lastReport = { x: this.player.x, y: this.player.y }; this.cfg.onLocation({ areaId: this.area.id, spawnId: this.spawnId, position: [Math.round(this.player.x), Math.round(this.player.y)] }); }
  private updateNearby(): void {
    let best: { item: WorldInteractable; distance: number } | null = null;
    for (const item of this.area.interactables) {
      if (!this.itemVisible(item)) continue;
      if (item.kind !== "door" && item.requiresFlag && !this.state.storyFlags[item.requiresFlag]) continue;
      const pos = this.itemPosition(item); const distance = Phaser.Math.Distance.Between(this.player.x, this.player.y, pos.x, pos.y);
      if (distance <= INTERACTION_RADIUS && (!best || distance < best.distance)) best = { item, distance };
    }
    const next = best?.item ?? null;
    if (next?.id !== this.nearby?.id) { this.nearby = next; this.cfg.onNearby(next); }
  }
  private maybeEdgeTransition(): void {
    const c = Math.floor(this.player.x / TILE), r = Math.floor(this.player.y / TILE);
    const edge = this.cfg.world.connections.find((connection) => connection.from.areaId === this.area.id && connection.from.trigger === "edge" && connection.from.position.x === c && connection.from.position.y === r);
    if (edge && (!edge.requiredFlag || this.state.storyFlags[edge.requiredFlag])) this.transition(edge.id);
  }

  debugState(): WorldDebugState {
    const c = Math.floor((this.player?.x ?? 0) / TILE), r = Math.floor((this.player?.y ?? 0) / TILE);
    return { areaId: this.area?.id ?? "", x: Math.round(this.player?.x ?? 0), y: Math.round(this.player?.y ?? 0), cell: { c, r }, facing: this.facing, collision: this.blockedCells.has(r * (this.area?.width ?? 1) + c), nearbyInteractionId: this.nearby?.id ?? null, spawnId: this.spawnId, storyFlags: Object.keys(this.state.storyFlags).filter((flag) => this.state.storyFlags[flag]), mapVariant: this.state.mapVariants[this.area?.id ?? ""] ?? null, paused: this.paused, blurred: this.blurred, pathLeft: this.pathQueue.length, fps: Math.round(this.game.loop.actualFps) };
  }

  update(): void {
    if (!this.player) return;
    if (this.paused || this.blurred) { this.player.setVelocity(0); return; }
    if (this.actionKeys.some((key) => Phaser.Input.Keyboard.JustDown(key))) this.interact();
    const pad = this.cfg.pad;
    const left = this.cursors?.left.isDown || this.wasd?.A.isDown || pad.left, right = this.cursors?.right.isDown || this.wasd?.D.isDown || pad.right;
    const up = this.cursors?.up.isDown || this.wasd?.W.isDown || pad.up, down = this.cursors?.down.isDown || this.wasd?.S.isDown || pad.down;
    let vx = left ? -PLAYER_SPEED : right ? PLAYER_SPEED : 0, vy = up ? -PLAYER_SPEED : down ? PLAYER_SPEED : 0;
    if (vx || vy) this.pathQueue = [];
    else if (this.pathQueue.length) {
      const target = this.pathQueue[0]!, dx = px(target.c) - this.player.x, dy = px(target.r) - this.player.y;
      if (Math.abs(dx) <= 5 && Math.abs(dy) <= 5) this.pathQueue.shift();
      else { if (Math.abs(dx) > 5) vx = dx < 0 ? -PLAYER_SPEED : PLAYER_SPEED; if (Math.abs(dy) > 5) vy = dy < 0 ? -PLAYER_SPEED : PLAYER_SPEED; }
    }
    this.player.setVelocity(vx, vy);
    this.facing = vx < 0 ? "left" : vx > 0 ? "right" : vy < 0 ? "up" : vy > 0 ? "down" : this.facing;
    const moving = Boolean(vx || vy); this.walkTimer = moving ? this.walkTimer + Math.min(this.game.loop.delta, 100) : 0;
    const frame = walkFrameKey(this.facing, this.walkTimer, moving, this.cfg.reducedMotion);
    const actualFrame = frame.replace(/^p-/, "world-p-");
    if (this.textures.exists(actualFrame) && this.player.texture.key !== actualFrame) this.player.setTexture(actualFrame).setDisplaySize(TILE, TILE);
    this.player.setDepth(this.player.y + 20);
    this.tick += 1; if (this.tick % 6 === 0) { this.updateNearby(); this.maybeEdgeTransition(); }
    if (this.tick % 90 === 0 && Math.abs(this.player.x - this.lastReport.x) + Math.abs(this.player.y - this.lastReport.y) > 5) this.reportLocation();
  }
}
