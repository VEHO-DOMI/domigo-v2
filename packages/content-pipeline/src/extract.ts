/**
 * Stage 1 — `content extract`
 *
 * Reads the MORE! master vocab lists + SB/WB unit transcripts from iCloud and
 * commits deterministic text snapshots under content/build/transcripts/, plus
 * content/build/sources.lock.json (sha256 provenance / drift detection).
 * iCloud is read-only to this stage; CI never needs it.
 */
import fs from "node:fs";
import path from "node:path";
import type { Grade, SourceLockEntry, SourcesLock } from "@domigo/content-schema";
import { GRADES } from "@domigo/content-schema";
import { docxToText } from "./docx.ts";
import { sha256OfFile, writeJson, writeText } from "./json.ts";
import { GRADE_SOURCES, SOURCE_BASE, SOURCES_LOCK_PATH, TRANSCRIPTS_DIR } from "./paths.ts";

/** iCloud duplicate artifacts ("Unit 3 2.docx"), Word locks, hidden files. */
function isJunk(basename: string): boolean {
  if (basename.startsWith(".") || basename.startsWith("~$")) return true;
  const stem = basename.replace(/\.[^.]+$/, "");
  return /\s\d+$/.test(stem) && / 2$| 3$/.test(stem);
}

function roleFromName(basename: string): "sb-transcript" | "wb-transcript" | "other" {
  if (/\bSB\b/i.test(basename)) return "sb-transcript";
  if (/\bWB\b/i.test(basename)) return "wb-transcript";
  return "other";
}

const ROLE_SUBDIR: Record<SourceLockEntry["role"], string> = {
  "master-list": ".",
  "sb-transcript": "sb",
  "wb-transcript": "wb",
  other: "misc",
};

function extractOne(
  absPath: string,
  role: SourceLockEntry["role"],
  grade: Grade,
  outName: string,
): { entry: SourceLockEntry; changed: boolean } {
  const stat = fs.statSync(absPath);
  const text = docxToText(absPath);
  const outPath = path.join(TRANSCRIPTS_DIR, `g${grade}`, ROLE_SUBDIR[role], outName);
  const changed = writeText(outPath, text);
  return {
    entry: {
      relPath: path.relative(SOURCE_BASE, absPath),
      sha256: sha256OfFile(absPath),
      bytes: stat.size,
      mtime: stat.mtime.toISOString(),
      role,
      grade,
    },
    changed,
  };
}

export function runExtract(onlyGrade?: Grade): void {
  const entries: SourceLockEntry[] = [];
  let written = 0;
  let files = 0;

  for (const grade of GRADES) {
    if (onlyGrade !== undefined && grade !== onlyGrade) continue;
    const src = GRADE_SOURCES[grade];

    if (!fs.existsSync(src.masterList)) {
      throw new Error(`[g${grade}] master list not found: ${src.masterList}`);
    }
    const master = extractOne(src.masterList, "master-list", grade, "master-vocabulary-list.txt");
    entries.push(master.entry);
    files += 1;
    if (master.changed) written += 1;

    for (const { dir, role } of src.transcriptDirs) {
      if (!fs.existsSync(dir)) throw new Error(`[g${grade}] transcript dir not found: ${dir}`);
      const names = fs.readdirSync(dir).filter((n) => n.toLowerCase().endsWith(".docx") && !isJunk(n));
      names.sort((a, b) => a.localeCompare(b, "en"));
      for (const name of names) {
        const fileRole = role === "auto" ? roleFromName(name) : role;
        const stem = name.replace(/\.docx$/i, "").trim();
        const res = extractOne(path.join(dir, name), fileRole, grade, `${stem}.txt`);
        entries.push(res.entry);
        files += 1;
        if (res.changed) written += 1;
      }
    }
  }

  if (onlyGrade === undefined) {
    entries.sort((a, b) => a.grade - b.grade || a.relPath.localeCompare(b.relPath, "en"));
    const lock: SourcesLock = {
      schema: "sources-lock@1",
      base: SOURCE_BASE,
      // deterministic: latest source mtime, not wall-clock
      extractedAt: entries.reduce((max, e) => (e.mtime > max ? e.mtime : max), ""),
      sources: entries,
    };
    writeJson(SOURCES_LOCK_PATH, lock);
  } else {
    console.log("(partial extract — sources.lock.json not rewritten; run a full extract for that)");
  }

  console.log(`extract: ${files} docx read, ${written} snapshot(s) updated.`);
  const byRole = new Map<string, number>();
  for (const e of entries) byRole.set(e.role, (byRole.get(e.role) ?? 0) + 1);
  for (const [role, n] of [...byRole.entries()].sort()) console.log(`  ${role}: ${n}`);
}
