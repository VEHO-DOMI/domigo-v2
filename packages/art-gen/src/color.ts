/**
 * Tiny hex-colour math so the tileset can DERIVE shading (highlights, shadows,
 * outlines) from each zone's base palette — one crafted painter, every zone
 * recoloured. Pure + deterministic; no DOM.
 */

function parse(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
}

function toHex(r: number, g: number, b: number): string {
  const c = (n: number) => Math.max(0, Math.min(255, Math.round(n))).toString(16).padStart(2, "0");
  return `#${c(r)}${c(g)}${c(b)}`;
}

/** Lighten toward white by `amt` (0..1). */
export function lighten(hex: string, amt: number): string {
  const [r, g, b] = parse(hex);
  return toHex(r + (255 - r) * amt, g + (255 - g) * amt, b + (255 - b) * amt);
}

/** Darken toward black by `amt` (0..1). */
export function darken(hex: string, amt: number): string {
  const [r, g, b] = parse(hex);
  return toHex(r * (1 - amt), g * (1 - amt), b * (1 - amt));
}

/** Linear blend a→b by `t` (0..1). */
export function mix(a: string, b: string, t: number): string {
  const [ar, ag, ab] = parse(a);
  const [br, bg, bb] = parse(b);
  return toHex(ar + (br - ar) * t, ag + (bg - ag) * t, ab + (bb - ab) * t);
}
