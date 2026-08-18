// R5-W5 · W4 · Typen für die EINE Quelle der Schlüsselfarb-Regeln.
//
// `key-fringe.mjs` ist reines JavaScript, weil es von Skripten UND von
// Import-Werkzeugen benutzt wird. Seit es die gemeinsame Quelle ist, liest es
// auch ein Test (`packages/game-paint/src/key-rules.test.ts`) — und ein
// Modul ohne Typen kommt dort als `any` an, was jede Zusicherung entwertet.
// Diese Datei beschreibt die öffentliche Oberfläche, mehr nicht.

export interface KeyImage {
  w: number;
  h: number;
  px: Uint8Array | Buffer;
  png?: unknown;
}
/** pngjs liefert `{data}`, `readPng` liefert `{px}` — beides wird akzeptiert. */
export type PixelSource = KeyImage | { data: Uint8Array | Buffer };

export const SKIN_PX: number;
export const CUT_ALPHA: number;
export const OUTLIER_MARGIN: number;
export const MIN_MAGENTA: number;
export const SPECK_MAX_PX: number;

export const KEY_RGB: readonly [number, number, number];
export const KEY_TOL: number;

/** M = min(r, b) − g: wie weit Grün unter BEIDEN Nachbarn liegt. */
export function magentaness(r: number, g: number, b: number): number;
/** Ist der Bildpunkt die Schlüsselfarbe? (der Importer-`isMagenta`) */
export function isKeyPixel(r: number, g: number, b: number, tol?: number): boolean;
/** Die Saumregel, die jeder Importer beim Schneiden anwendet. */
export function importerWouldDelete(r: number, g: number, b: number): boolean;

export function readPng(file: string): KeyImage;
export function writePng(file: string, img: KeyImage): void;
export function materialMagentaness(img: KeyImage): number | null;
export function fringeThreshold(img: KeyImage): number;
export function keyFringe(img: KeyImage, threshold?: number): { x: number; y: number; i: number }[];
export function keySpecks(img: KeyImage, maxPx?: number): { x: number; y: number; i: number }[];
export function stripKeyFringe(img: KeyImage): { healed: number; cut: number; total: number; threshold: number };
export function stripKeySpecks(img: KeyImage): { healed: number; cut: number; total: number };

/** Der nächste Abstand eines undurchsichtigen Bildpunkts zur Schlüsselfarbe. */
export function keyDistance(img: PixelSource): { euclid: number; manhattan: number };
/** Wie viele Bildpunkte Schlüsselfarbe sind, ohne EXAKT sie zu sein. */
export function impureKey(img: PixelSource): number;

export interface RuleFixtureEntry {
  readonly rgb: readonly [number, number, number];
  readonly was: string;
}
/** Der Prüf-Pixelsatz, an dem Modul und Importer verglichen werden. */
export const RULE_FIXTURE: readonly RuleFixtureEntry[];
