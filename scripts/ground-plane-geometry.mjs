const OPAQUE = 128;
const tolerance = (p) => Math.max(4, Math.round(p.height * 0.02));
const opaque = (p, x, y) => (p.data[(y * p.width + x) * 4 + 3] ?? 0) >= OPAQUE;
const tilt = (points) => {
  if (points.length < 2) return 90;
  const mx = points.reduce((s, [x]) => s + x, 0) / points.length;
  const my = points.reduce((s, [, y]) => s + y, 0) / points.length;
  const den = points.reduce((s, [x]) => s + (x - mx) ** 2, 0);
  const num = points.reduce((s, [x, y]) => s + (x - mx) * (y - my), 0);
  return den ? Math.abs(Math.atan(num / den) * 180 / Math.PI) : 90;
};
const profile = (p, bottom = false) => Array.from({ length: p.width }, (_, x) => {
  for (let i = 0; i < p.height; i++) {
    const y = bottom ? p.height - 1 - i : i;
    if (opaque(p, x, y)) return y;
  }
  return -1;
});

/** Deck is a registration claim, not an instruction to search for any green row. */
export const measureDeck = (png, deck) => {
  const errors = [];
  if (!Number.isFinite(deck) || deck < 0 || deck >= 1) return { errors: ["deck muss endlich und 0 ≤ deck < 1 sein"] };
  const widths = Array.from({ length: png.height }, (_, y) => {
    let count = 0; for (let x = 0; x < png.width; x++) if (opaque(png, x, y)) count++;
    return count;
  });
  const maxWidth = Math.max(...widths);
  if (!maxWidth) return { errors: ["Laufkante: leeres Bild"] };
  const first90 = widths.findIndex((n) => n >= maxWidth * 0.9);
  const d = deck * png.height, row = Math.round(d), tol = tolerance(png);
  const coverage = (widths[row] ?? 0) / maxWidth;
  // The renderer mounts the whole PNG across the declared cells, including
  // transparent margins. A tiny central painting must not pass as a full ledge.
  const canvasCoverage = (widths[row] ?? 0) / png.width;
  if (Math.abs(d - first90) > tol) errors.push(`deck-Zeile ${d.toFixed(2)} statt erster 90%-Zeile ${first90}`);
  if (coverage < 0.9) errors.push(`Laufkante an deck nur ${(coverage * 100).toFixed(1)}% der maximalen opaken Zeilenbreite < 90%`);
  if (canvasCoverage < 0.8) errors.push(`gemalte Laufbreite ${(canvasCoverage * 100).toFixed(1)}% des montierten Bildrahmens < 80%`);
  let run = 0, gap = 0, longest = 0;
  for (let x = 0; x < png.width; x++) {
    // A surface needs material below it, not just a one-pixel paint stroke.
    const supported = row + 2 < png.height && [0, 1, 2].every((dy) => opaque(png, x, row + dy));
    // The same spatial tolerance admits isolated painted pinholes; a larger
    // internal gap separates the carrier. Do not let total alpha hide a hole.
    if (supported) { run += gap + 1; gap = 0; longest = Math.max(longest, run); }
    else if (run && ++gap > tol) { run = 0; gap = 0; }
  }
  if (longest / png.width < 0.8) errors.push(`zusammenhängend getragene Laufkante ${(100 * longest / png.width).toFixed(1)}% des montierten Bildrahmens < 80%`);
  const tops = profile(png).map((y, x) => [x, y]).filter(([, y]) => y >= 0);
  // An authored backrest/lectern can rise ABOVE deck. It is not the walk edge.
  // Both outside wings must still expose the real edge: discarding the high end
  // of a sloping plank cannot manufacture a horizontal sample on one side.
  const exposed = tops.filter(([, y]) => y >= d - tol);
  const left = tops[0]?.[0] ?? 0, right = tops.at(-1)?.[0] ?? 0;
  const quarter = (right - left) / 4;
  if (!exposed.some(([x]) => x <= left + quarter) || !exposed.some(([x]) => x >= right - quarter)) {
    errors.push("Laufkante nicht auf beiden Außenseiten prüfbar — Aufsatz/Kontur ausdrücklich prüfen");
  }
  const reach = exposed.length ? exposed.filter(([, y]) => Math.abs(y - d) <= tol).length / exposed.length : 0;
  const tiltDeg = tilt(exposed);
  if (reach < 0.8) errors.push(`ebene Laufkontur ${(reach * 100).toFixed(1)}% < 80% (V/Stufe)`);
  if (tiltDeg > 3) errors.push(`Laufkontur kippt ${tiltDeg.toFixed(2)}° > 3°`);
  return { row: d, first90, coverage, canvasCoverage, supportedSpan: longest, reach, tiltDeg, errors };
};

/** Separate feet retain their complete lower silhouettes and a shared baseline. */
export const measureContacts = (png, contract, sha256) => {
  const errors = [];
  if (sha256 !== contract.sha256) errors.push("Kontaktregister: Bildhash stimmt nicht — Kontakte neu messen");
  if (png.width !== contract.width || png.height !== contract.height) errors.push("Kontaktregister: Bildrahmen stimmt nicht");
  if (errors.length) return { errors, feet: [] };
  const tol = tolerance(png), baseline = contract.baseline;
  const band = png.height - 1 - 2 * tol;
  if (!Number.isInteger(baseline) || baseline < png.height - 1 - tol || baseline >= png.height) errors.push("Kontaktregister: Grundlinie außerhalb des ursprünglichen Rand-Toleranzbands");
  const lows = profile(png, true);
  const owner = new Set(), feet = [];
  if (!Array.isArray(contract.spans) || contract.spans.length < 2) return { errors: [...errors, "Kontaktregister: mindestens zwei vollständige Fußspannen erforderlich"], feet };
  for (const span of contract.spans) {
    if (!Array.isArray(span) || span.length !== 2 || !span.every(Number.isInteger) || span[0] < 0 || span[1] >= png.width || span[1] <= span[0]) {
      errors.push("Kontaktregister: ungültige Fußspanne"); continue;
    }
    const [l, r] = span, points = [];
    for (let x = l; x <= r; x++) {
      if (owner.has(x)) errors.push(`Kontaktregister: überlappende Fußspanne bei x${x}`);
      owner.add(x); points.push([x, lows[x]]);
      if (lows[x] < band) errors.push(`Fuß ${l}–${r}: Kontaktspanne bei x${x} im unteren Prüfband nicht vollständig`);
    }
    const reach = points.filter(([, y]) => Math.abs(y - baseline) <= tol).length / points.length;
    // Fit ALL columns of the declared foot, not only already touching pixels.
    const tiltDeg = tilt(points);
    if (reach < 0.8) errors.push(`Fuß ${l}–${r}: Reichweite ${(reach * 100).toFixed(1)}% < 80%`);
    if (tiltDeg > 3) errors.push(`Fuß ${l}–${r}: Kontaktkante kippt ${tiltDeg.toFixed(2)}° > 3°`);
    feet.push({ span, reach, tiltDeg, minY: Math.min(...points.map(([, y]) => y)), maxY: Math.max(...points.map(([, y]) => y)) });
  }
  // Never hide the sloping part of a V or an unregistered third foot.
  for (let x = 0; x < png.width; x++) if (lows[x] >= band && !owner.has(x)) errors.push(`untere Silhouette bei x${x} fehlt im Kontaktregister`);
  return { baseline, band, feet, errors };
};
