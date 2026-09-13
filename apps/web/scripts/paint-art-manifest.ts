import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

/** Build-time index: the browser gets the PNG; the function needs only its URL. */
export function collectPaintArt(root: string): Record<string, Record<string, string>> {
  const chapters: Record<string, Record<string, string>> = {};
  // Missing root is a broken build, not permission to ship an empty art index.
  for (const dir of fs.readdirSync(root, { withFileTypes: true })) {
    if (!dir.isDirectory()) continue;
    const files: Record<string, string> = {};
    for (const file of fs.readdirSync(path.join(root, dir.name))) {
      if (!file.endsWith(".png")) continue;
      const bytes = fs.readFileSync(path.join(root, dir.name, file));
      const hash = crypto.createHash("sha1").update(bytes).digest("hex").slice(0, 8);
      files[file.replace(/\.png$/, "")] = `/art/g1/paint/${dir.name}/${file}?v=${hash}`;
    }
    chapters[dir.name] = files;
  }
  return chapters;
}

export function writePaintArtManifest(appRoot: string): void {
  const manifest = collectPaintArt(path.join(appRoot, "public/art/g1/paint"));
  const dest = path.join(appRoot, "lib/paint-art-manifest.json");
  const text = `${JSON.stringify(manifest, null, 2)}\n`;
  if (fs.existsSync(dest) && fs.readFileSync(dest, "utf8") === text) return;
  const temporary = `${dest}.${process.pid}.tmp`;
  fs.writeFileSync(temporary, text);
  fs.renameSync(temporary, dest);
}
