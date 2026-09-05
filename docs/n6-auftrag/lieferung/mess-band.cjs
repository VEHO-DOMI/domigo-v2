// Wareneingang fuer eine SHELL-BAHN (l2_p2): Luminanz, Saettigung, Mittel-rgb,
// Alpha-Deckung, Kachel-Naht an der x-Kante.
// Die Formel ist ZEICHEN FUER ZEICHEN die von check-composition.mjs:113-135
// (3-px-Schritt, Alpha >= 128). Der Selbstbeweis steht im Aufruf: das heutige
// Blatt MUSS 17,5 / 64,1 liefern, sonst ist der Massstab gedriftet.
const fs = require("fs");
const { PNG } = require("pngjs");
const lumOf = (r, g, b) => (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
const satOf = (r, g, b) => { const M = Math.max(r, g, b); return M === 0 ? 0 : (M - Math.min(r, g, b)) / M; };

const file = process.argv[2];
const vergleich = process.argv[3] || null;
const png = PNG.sync.read(fs.readFileSync(file));
const A = (p, x, y) => p.data[((y * p.width + x) * 4) + 3];

let n = 0, L = 0, S = 0, r = 0, g = 0, b = 0;
for (let y = 0; y < png.height; y += 3) for (let x = 0; x < png.width; x += 3) {
  const i = (png.width * y + x) << 2;
  if (png.data[i + 3] < 128) continue;
  L += lumOf(png.data[i], png.data[i + 1], png.data[i + 2]);
  S += satOf(png.data[i], png.data[i + 1], png.data[i + 2]);
  r += png.data[i]; g += png.data[i + 1]; b += png.data[i + 2]; n++;
}
console.log(`Blatt      : ${file}`);
console.log(`Mass       : ${png.width}x${png.height}`);
console.log(`Luminanz   : ${(L / n * 100).toFixed(2)} %`);
console.log(`Saettigung : ${(S / n * 100).toFixed(2)} %`);
console.log(`Mittel-rgb : ${Math.round(r / n)},${Math.round(g / n)},${Math.round(b / n)}   (${n} Proben)`);

// Alpha-Deckung des ganzen Blattes
let op = 0, tot = png.width * png.height;
for (let y = 0; y < png.height; y++) for (let x = 0; x < png.width; x++) if (A(png, x, y) >= 128) op++;
console.log(`Alpha-Deckung: ${(op / tot * 100).toFixed(1)} % des Blattes deckend`);

// Kachel-Naht: linke Spalte gegen rechte Spalte (loop:true kachelt x)
let dSum = 0, dMax = 0, dN = 0, beideDeckend = 0;
for (let y = 0; y < png.height; y++) {
  const li = (y * png.width + 0) * 4, ri = (y * png.width + (png.width - 1)) * 4;
  const la = png.data[li + 3], ra = png.data[ri + 3];
  if (la < 128 && ra < 128) continue;
  dN++;
  if (la >= 128 && ra >= 128) {
    beideDeckend++;
    const d = Math.abs(lumOf(png.data[ri], png.data[ri+1], png.data[ri+2]) - lumOf(png.data[li], png.data[li+1], png.data[li+2])) * 100;
    dSum += d; if (d > dMax) dMax = d;
  }
}
console.log(`Naht x-Kante: ${dN} Zeilen mit Materie, ${beideDeckend} beidseitig deckend, `
  + `mittlerer Luminanz-Sprung ${beideDeckend ? (dSum / beideDeckend).toFixed(2) : "-"} Punkte, groesster ${dMax.toFixed(2)}`);

if (vergleich) {
  const alt = PNG.sync.read(fs.readFileSync(vergleich));
  if (alt.width !== png.width || alt.height !== png.height) { console.log(`Silhouette : NICHT vergleichbar (${alt.width}x${alt.height})`); }
  else {
    let gleich = 0, union = 0;
    for (let y = 0; y < png.height; y++) for (let x = 0; x < png.width; x++) {
      const a1 = A(png, x, y) >= 128, a0 = A(alt, x, y) >= 128;
      if (a1 || a0) { union++; if (a1 && a0) gleich++; }
    }
    console.log(`Silhouette : ${(gleich / union * 100).toFixed(1)} % Deckungsgleichheit mit ${vergleich}`);
  }
}
