/** Deterministic JSON I/O — byte-identical re-runs are a pipeline invariant. */
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

export function writeJson(filePath: string, value: unknown): boolean {
  const next = JSON.stringify(value, null, 2) + "\n";
  const prev = fs.existsSync(filePath) ? fs.readFileSync(filePath, "utf8") : null;
  if (prev === next) return false; // untouched → git stays quiet, mtimes stable
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, next, "utf8");
  return true;
}

export function readJsonIfExists<T>(filePath: string): T | null {
  if (!fs.existsSync(filePath)) return null;
  return JSON.parse(fs.readFileSync(filePath, "utf8")) as T;
}

export function sha256OfFile(filePath: string): string {
  return crypto.createHash("sha256").update(fs.readFileSync(filePath)).digest("hex");
}

export function sha256OfString(s: string): string {
  return crypto.createHash("sha256").update(s, "utf8").digest("hex");
}

export function writeText(filePath: string, text: string): boolean {
  const prev = fs.existsSync(filePath) ? fs.readFileSync(filePath, "utf8") : null;
  if (prev === text) return false;
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, text, "utf8");
  return true;
}
