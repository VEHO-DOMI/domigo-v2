// Kontaktbogen: mehrere Ausschnitte nebeneinander, damit EIN Bild reicht.
import fs from "node:fs";
import path from "node:path";
import { PNG } from "pngjs";
const [dir, out] = process.argv.slice(2);
const files = fs.readdirSync(dir).filter((f) => f.endsWith(".png")).sort();
const imgs = files.map((f) => PNG.sync.read(fs.readFileSync(path.join(dir, f))));
const gap = 6;
const H = Math.max(...imgs.map((i) => i.height));
const W = imgs.reduce((s, i) => s + i.width + gap, gap);
const sheet = new PNG({ width: W, height: H + 2 * gap });
for (let i = 0; i < sheet.data.length; i += 4) { sheet.data[i] = 24; sheet.data[i+1] = 24; sheet.data[i+2] = 24; sheet.data[i+3] = 255; }
let x = gap;
for (const img of imgs) {
  for (let y = 0; y < img.height; y++) for (let xx = 0; xx < img.width; xx++) {
    const si = (y * img.width + xx) * 4, di = ((y + gap) * W + x + xx) * 4;
    sheet.data[di] = img.data[si]; sheet.data[di+1] = img.data[si+1]; sheet.data[di+2] = img.data[si+2]; sheet.data[di+3] = 255;
  }
  x += img.width + gap;
}
fs.writeFileSync(out, PNG.sync.write(sheet));
console.log(`${files.length} Ausschnitte -> ${out} (${W}x${H + 2*gap})`);
console.log(files.join("  |  "));
