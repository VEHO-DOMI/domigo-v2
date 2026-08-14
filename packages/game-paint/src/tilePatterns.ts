/**
 * R5-W3 · E5 · ONE FILL PATTERN PER PICTURE, NOT ONE PER PIECE (debt D-32).
 *
 * WHAT PHASER DOES, read out of its own source (3.90.0,
 * `gameobjects/tilesprite/TileSprite.js`): every TileSprite, in its
 * constructor, calls `setFrame` → `updateTileTexture`, which draws its source
 * frame into a private power-of-two canvas and then calls
 * `renderer.canvasToTexture(...)`. That is **a dedicated GL texture per tile
 * sprite**, sized to the power-of-two of the SOURCE — not of the piece. Two
 * hundred pieces cut from the same 512×512 painting therefore hold two hundred
 * identical 512×512 textures on the graphics card, one megabyte each.
 *
 * WHAT THAT COST, MEASURED (2026-08-14, production build, own Chrome, Apple M1):
 * phase p2 held **933 GL textures / 452 MB** while its texture manager held only
 * 527 keys / 111 MB of source pixels. The gap — 331 tile sprites in the display
 * list, ~341 MB — is this defect and nothing else. In the same run the frame was
 * measured NOT to be CPU-bound (injecting 4 ms of scalar work per frame moved
 * frame time by 0.0–0.4 ms), and the phases ranked by fps exactly as they rank
 * by tile-sprite count: p4 (11 draws) 28 fps · p1 (32) 12 fps · p2 (49) 9 fps,
 * against a blank-page control in the same browser reading 60.2 fps.
 *
 * WHAT THIS DOES. The pattern is identical for every sprite that shares a
 * source frame — same picture, same power-of-two box, same repeat wrapping — so
 * exactly one is kept per texture key and every duplicate is handed straight
 * back to the renderer. Tile scale, tile offset, tint and alpha are per-object
 * uniforms applied at draw time, so sharing the source changes nothing about
 * how any single piece looks.
 *
 * WHY THE SCENE OWNS THEM, NOT THE FIRST SPRITE. If the first sprite owned the
 * shared pattern, destroying it would delete a texture its siblings still draw
 * with. So the ledger below holds ownership, every sprite's `preDestroy` is
 * taught to let go first, and the scene deletes the patterns once at shutdown.
 *
 * This file is deliberately free of Phaser: it is the bookkeeping, and the
 * bookkeeping is what a test can prove without a graphics card.
 */

export interface Claim<T> {
  /** the pattern this sprite should draw with */
  use: T;
  /** the duplicate to hand back to the renderer, or null if this one is kept */
  handBack: T | null;
}

/**
 * Keeps one pattern per texture key and reports what it handed back, so the
 * saving is a number a test can assert rather than a claim in a comment.
 */
export class PatternLedger<T> {
  private readonly byKey = new Map<string, T>();
  private handedBackCount = 0;

  /**
   * Offer a freshly built sprite's own pattern. The first one for a key is
   * kept and used; every later one is handed back and the kept one is used.
   */
  claim(key: string, own: T): Claim<T> {
    const held = this.byKey.get(key);
    if (held === undefined) {
      this.byKey.set(key, own);
      return { use: own, handBack: null };
    }
    this.handedBackCount += 1;
    return { use: held, handBack: own };
  }

  /** every pattern the scene owns and must delete at shutdown */
  owned(): T[] {
    return [...this.byKey.values()];
  }

  /** how many distinct patterns are resident */
  get kept(): number {
    return this.byKey.size;
  }

  /** how many duplicate GPU textures were never left to accumulate */
  get handedBack(): number {
    return this.handedBackCount;
  }

  clear(): void {
    this.byKey.clear();
    this.handedBackCount = 0;
  }
}
