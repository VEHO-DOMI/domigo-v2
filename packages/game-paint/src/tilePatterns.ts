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
 *
 * ── R5-W7 · E8 · D-431 · GEFRAGT WIRD JETZT VORHER, NICHT NACHHER ───────────
 *
 * E5 hat das Duplikat ZURUECKGEGEBEN — gebaut und zur Grafikkarte gefahren war
 * es da schon. E7 hat gemessen, was dieses Bauen kostet: Phasers TileSprite-
 * Konstruktor 30–107 ms je Raum (145–331 Sprites), gegen 0,1–0,7 ms fuer das
 * Zurueckgeben. Der Speicher war repariert, die BAUZEIT nicht.
 *
 * Deshalb heisst die Frage jetzt `serve(key)` und sie wird gestellt, BEVOR
 * gebaut wird: kommt ein Muster zurueck, findet der Bau nicht statt; kommt
 * `null`, baut der Aufrufer einmal und legt das Ergebnis mit `keep` hierher.
 * Dieselbe Buchhaltung, dieselbe Eigentumsregel — nur eine Runde frueher.
 */

/**
 * Keeps one pattern per texture key and reports how many builds it spared, so
 * the saving is a number a test can assert rather than a claim in a comment.
 */
export class PatternLedger<T> {
  private readonly byKey = new Map<string, T>();
  private servedCount = 0;

  /**
   * Ask BEFORE building. `null` means: nothing is held for this key yet — build
   * the pattern once and hand the result to `keep`. Anything else is the
   * pattern to draw with, and **the build must not happen at all**.
   */
  serve(key: string): T | null {
    const held = this.byKey.get(key);
    if (held === undefined) return null;
    this.servedCount += 1;
    return held;
  }

  /**
   * Record the one pattern every later sprite of this key will share. The first
   * one wins; a second `keep` for the same key would orphan a texture the scene
   * still owes the renderer, so it is refused loudly rather than silently.
   */
  keep(key: string, own: T): void {
    if (this.byKey.has(key)) {
      throw new Error(`PatternLedger: ${key} is already kept — ask serve() before building`);
    }
    this.byKey.set(key, own);
  }

  /** every pattern the scene owns and must delete at shutdown */
  owned(): T[] {
    return [...this.byKey.values()];
  }

  /** how many distinct patterns are resident */
  get kept(): number {
    return this.byKey.size;
  }

  /** how many power-of-two canvases + GPU uploads never happened */
  get served(): number {
    return this.servedCount;
  }

  clear(): void {
    this.byKey.clear();
    this.servedCount = 0;
  }
}

/**
 * R5-W7 · E8 · D-431 · DIE GANZE ENTSCHEIDUNG, AN EINER STELLE.
 *
 * `build` läuft NUR, wenn für diesen Schlüssel noch nichts da ist; was es
 * zurückgibt, wird behalten und geteilt. Für jedes spätere Stück desselben
 * Blattes läuft `reuse` — und `build` findet nicht statt.
 *
 * Sie steht hier und nicht in der Szene, weil ein Test sie dann ohne
 * Grafikkarte fahren kann: dieselbe Funktion, die im Browser läuft, nicht eine
 * zweite Abschrift davon.
 */
export function buildOncePerKey<T>(
  ledger: PatternLedger<T>,
  key: string,
  build: () => T | null,
  reuse: (pattern: T) => void,
): void {
  const held = ledger.serve(key);
  if (held !== null) {
    reuse(held);
    return;
  }
  const own = build();
  if (own !== null) ledger.keep(key, own);
}
