// R5-W6 · L1 — Typen fuer das Messgeraet, damit es aus TypeScript heraus als
// EIN Lineal benutzt werden kann (der Unit-Test der Buchstaben-Gesetze misst
// mit genau derselben Rechnung wie die Schirm-Messung und wie das CI-Tor).
// Die Umsetzung bleibt .mjs: sie laeuft in CI ohne Uebersetzungsschritt.
export declare const lum: (r: number, g: number, b: number) => number;
export declare const hue: (r: number, g: number, b: number) => number | null;
export declare const hueGap: (a: number, b: number) => number;
export declare const separates: (dL: number, dH: number | null) => boolean;
export declare const CRITERION: string;
export declare const TARGET_ABS_DL: number;
export declare const TARGET_MIXED_DL: number;
export declare const TARGET_MIXED_DH: number;
export declare const TARGET_DL: number;
export declare const EDGE_RING: { inner: number; outer: number };
export declare const WALL_RING: { inner: number; outer: number };
