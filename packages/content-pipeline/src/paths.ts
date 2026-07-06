/**
 * Source-material registry. All generation stages read MORE! sources from the
 * iCloud tree (read-only!); committed artifacts live under content/ in this
 * repo so CI never needs iCloud.
 *
 * WARNING: several folder names carry TRAILING SPACES ("MORE 1 ",
 * "MORE 2 Materials & Resources "). They are intentional below — do not trim.
 */
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { Grade } from "@domigo/content-schema";

/** iCloud base for the MORE! source materials (override via DOMIGO_SOURCE_BASE). */
export const SOURCE_BASE =
  process.env["DOMIGO_SOURCE_BASE"] ??
  path.join(
    process.env["HOME"] ?? "~",
    "Library/Mobile Documents/com~apple~CloudDocs/Domi Gym/Domi Gym 2025:26",
  );

/** Repo root (this file lives at packages/content-pipeline/src/paths.ts). */
export const REPO_ROOT = path.resolve(fileURLToPath(import.meta.url), "../../../..");

export const CONTENT_DIR = path.join(REPO_ROOT, "content");
export const TRANSCRIPTS_DIR = path.join(CONTENT_DIR, "build", "transcripts");
export const SOURCES_LOCK_PATH = path.join(CONTENT_DIR, "build", "sources.lock.json");
export const UNITS_DIR = path.join(CONTENT_DIR, "corpus", "units");
export const OVERLAYS_DIR = path.join(CONTENT_DIR, "overlays");
export const TRAPS_PATH = path.join(CONTENT_DIR, "corpus", "traps", "traps.json");

/** v1 working copy (parity oracle; READ-ONLY — never run git there). */
export const V1_BASE =
  process.env["DOMIGO_V1_BASE"] ??
  path.join(
    process.env["HOME"] ?? "~",
    "Library/Mobile Documents/com~apple~CloudDocs/Domi Gym/Claude/Cowork Space/Claude Code/domigo",
  );
export const V1_SNAPSHOT_DIR = path.join(CONTENT_DIR, "build", "v1", "vocab");
export const V1_GRAMMAR_SNAPSHOT_DIR = path.join(CONTENT_DIR, "build", "v1", "grammar");
export const V1_LOCK_PATH = path.join(CONTENT_DIR, "build", "v1", "v1.lock.json");

/** Per-grade grammar-structures catalogs (stage 4). */
export const STRUCTURES_DIR = path.join(CONTENT_DIR, "corpus", "structures");

/** Pinned generation/verification prompts (versioned; hashes stamped in briefs). */
export const PROMPTS_DIR = path.resolve(
  fileURLToPath(import.meta.url),
  "../../prompts",
);

export interface GradeSources {
  grade: Grade;
  /** Master vocabulary list docx (canonical word-bank source). */
  masterList: string;
  /** Dirs of per-unit transcript docx files. `role` fixed per dir, or "auto" → from filename. */
  transcriptDirs: Array<{ dir: string; role: "sb-transcript" | "wb-transcript" | "auto" }>;
}

/** Verified 2026-06-10 (see reference_more_master_vocab_lists memory + plan). */
export const GRADE_SOURCES: Record<Grade, GradeSources> = {
  1: {
    grade: 1,
    masterList: path.join(
      SOURCE_BASE,
      "1ABC (2025:26)/MORE 1 /MORE1_Master_Vocabulary_List_Units_1-15.docx",
    ),
    transcriptDirs: [
      { dir: path.join(SOURCE_BASE, "1ABC (2025:26)/MORE 1 /MORE 1 SB Transcription"), role: "sb-transcript" },
      { dir: path.join(SOURCE_BASE, "1ABC (2025:26)/MORE 1 /MORE 1 WB Transcription"), role: "wb-transcript" },
    ],
  },
  2: {
    grade: 2,
    masterList: path.join(
      SOURCE_BASE,
      "2A (2025:26)/MORE 2 Materials & Resources /Full Vocabulary List MORE 2 Units 1-15.docx",
    ),
    transcriptDirs: [
      { dir: path.join(SOURCE_BASE, "2A (2025:26)/MORE 2 Materials & Resources /MORE 2 TRANSCRIPT"), role: "auto" },
    ],
  },
  3: {
    grade: 3,
    masterList: path.join(
      SOURCE_BASE,
      "3A (2025:26)/MORE 3 Materials & Resources/Full Vocabulary List MORE 3 Units 1-14.docx",
    ),
    transcriptDirs: [
      {
        dir: path.join(
          SOURCE_BASE,
          "3A (2025:26)/MORE 3 Materials & Resources/MORE 3 NEW EDITION/MORE Transcript SB & WB Units",
        ),
        role: "auto",
      },
    ],
  },
  4: {
    grade: 4,
    masterList: path.join(
      SOURCE_BASE,
      "4B (2025:26)/MORE 4 Materials & Resources/Full Vocabulary List MORE 4 Units 1-13.docx",
    ),
    transcriptDirs: [
      {
        dir: path.join(
          SOURCE_BASE,
          "4B (2025:26)/MORE 4 Materials & Resources/MORE 4 AKTUELLE EDITION/MORE 4 Transcript SB & WB Units",
        ),
        role: "auto",
      },
    ],
  },
};
