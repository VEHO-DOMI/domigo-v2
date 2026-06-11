/**
 * Deterministic GRAMMAR-box extraction from committed SB transcripts —
 * stage-4 evidence. Heuristic by design; misses are repaired through the
 * audited overlay (content/overlays/grammar-boxes.json), never by editing
 * transcripts. Extraction errors cannot corrupt the structures catalog:
 * an agent authors the draft, ingest only checks that cited refs exist.
 */
import fs from "node:fs";
import path from "node:path";
import { readJsonIfExists } from "./json.ts";
import { OVERLAYS_DIR, TRANSCRIPTS_DIR } from "./paths.ts";

export interface GrammarBox {
  /** 1-based per file, assigned post-dedupe; stable as long as the transcript is. */
  ordinal: number;
  title: string | null;
  lines: string[];
  /** `g2/sb/More 2 SB Unit 3.txt#grammar-1` */
  ref: string;
}

/** Audited manual escape: drop misextracted boxes / add missed ones. */
export interface GrammarBoxesOverlay {
  [fileRel: string]: {
    drop?: number[];
    add?: Array<{ title: string | null; lines: string[] }>;
  };
}

const HEADING = /^GRAMMAR\b/;
const CHANT = /^GRAMMAR\s+CHANT/i;
const PAGE = /^Pages?\s+\d/;
/** Short all-caps section heading (e.g. SPEAKING, MORE FUN WITH FIDO!). */
const SECTION = /^[A-Z][A-Z0-9 !?'’&.,:–—-]{3,}$/;
const MAX_BODY_LINES = 60;

function isTerminator(trimmed: string): boolean {
  if (CHANT.test(trimmed)) return true;
  if (HEADING.test(trimmed)) return true;
  if (PAGE.test(trimmed)) return true;
  if (trimmed.length > 0 && trimmed.length <= 60 && SECTION.test(trimmed)) return true;
  return false;
}

/**
 * Extract GRAMMAR boxes from one transcript. Two observed heading forms:
 * bare `GRAMMAR` (title = next non-empty line) and inline
 * `GRAMMAR: <title>`. `GRAMMAR CHANT` activities are NOT boxes.
 * Verbatim-duplicated passages (observed in g2 unit 3) dedupe by content.
 */
export function extractGrammarBoxes(text: string, fileRel: string): GrammarBox[] {
  const lines = text.split("\n");
  const found: Array<{ title: string | null; lines: string[] }> = [];
  let i = 0;
  while (i < lines.length) {
    const trimmed = (lines[i] ?? "").trim();
    if (!HEADING.test(trimmed) || CHANT.test(trimmed)) {
      i += 1;
      continue;
    }
    let title: string | null = null;
    let bodyStart = i + 1;
    const inline = /^GRAMMAR\s*:?\s+(.+)$/.exec(trimmed);
    if (inline !== null) {
      title = inline[1]!.trim();
    } else {
      let j = i + 1;
      while (j < lines.length && (lines[j] ?? "").trim() === "") j += 1;
      if (j < lines.length) {
        title = (lines[j] ?? "").trim();
        bodyStart = j + 1;
      }
    }
    const body: string[] = [];
    let k = bodyStart;
    while (k < lines.length && body.length < MAX_BODY_LINES) {
      const t = (lines[k] ?? "").trim();
      if (isTerminator(t)) break;
      body.push(lines[k] ?? "");
      k += 1;
    }
    while (body.length > 0 && body[body.length - 1]!.trim() === "") body.pop();
    found.push({ title, lines: body });
    i = Math.max(k, i + 1);
  }

  // Dedupe transcription duplicates: same (normalized) title and one body is
  // a prefix of the other — robust to either occurrence absorbing extra
  // trailing text before its terminator. Boxes per file are few; O(n²) is fine.
  // (A genuinely distinct same-title box that merely extends another would
  // merge — the audited overlay is the escape for that unlikely case.)
  const normLines = (lines: string[]): string[] =>
    lines.map((l) => l.replace(/\s+/g, " ").trim()).filter((l) => l.length > 0);
  const normTitle = (t: string | null): string => (t ?? "").replace(/\s+/g, " ").trim();
  const out: GrammarBox[] = [];
  for (const b of found) {
    const bNorm = normLines(b.lines);
    const bTitle = normTitle(b.title);
    const isDup = out.some((kept) => {
      if (normTitle(kept.title) !== bTitle) return false;
      const kNorm = normLines(kept.lines);
      const n = Math.min(kNorm.length, bNorm.length);
      if (n === 0) return kNorm.length === bNorm.length;
      for (let i = 0; i < n; i += 1) {
        if (kNorm[i] !== bNorm[i]) return false;
      }
      return true;
    });
    if (isDup) continue;
    const ordinal = out.length + 1;
    out.push({ ordinal, title: b.title, lines: b.lines, ref: `${fileRel}#grammar-${ordinal}` });
  }
  return out;
}

/**
 * Apply the audited overlay. Drops keep remaining ordinals unchanged
 * (refs stay stable); adds continue numbering after the extraction max.
 */
export function applyBoxesOverlay(
  boxes: GrammarBox[],
  fileRel: string,
  overlay: GrammarBoxesOverlay | null,
): GrammarBox[] {
  const fix = overlay?.[fileRel];
  if (fix === undefined) return boxes;
  let out = boxes;
  if (fix.drop !== undefined) {
    const drop = new Set(fix.drop);
    out = out.filter((b) => !drop.has(b.ordinal));
  }
  if (fix.add !== undefined && fix.add.length > 0) {
    let next = boxes.reduce((m, b) => Math.max(m, b.ordinal), 0) + 1;
    const added: GrammarBox[] = [];
    for (const a of fix.add) {
      added.push({ ordinal: next, title: a.title, lines: a.lines, ref: `${fileRel}#grammar-${next}` });
      next += 1;
    }
    out = [...out, ...added];
  }
  return out;
}

export const APPENDIX_FILE = /grammar appendix/i;

export interface GradeBoxes {
  /** fileRel (`g2/sb/<name>.txt`) → boxes, post-overlay. Appendix files excluded. */
  byFile: Map<string, GrammarBox[]>;
  /** fileRel → unit number parsed from the filename (null = intro/other). */
  unitOf: Map<string, number | null>;
  /** Appendix files (fileRel → full text), included verbatim in the brief. */
  appendix: Map<string, string>;
}

export function readBoxesOverlay(): GrammarBoxesOverlay | null {
  return readJsonIfExists<GrammarBoxesOverlay>(
    path.join(OVERLAYS_DIR, "grammar-boxes.json"),
  );
}

/** Scan a grade's committed SB transcripts (CI-safe — no iCloud). */
export function loadGradeBoxes(grade: number): GradeBoxes {
  const sbDir = path.join(TRANSCRIPTS_DIR, `g${grade}`, "sb");
  if (!fs.existsSync(sbDir)) {
    throw new Error(`no committed SB transcripts at ${sbDir} (run \`content extract\`)`);
  }
  const overlay = readBoxesOverlay();
  const byFile = new Map<string, GrammarBox[]>();
  const unitOf = new Map<string, number | null>();
  const appendix = new Map<string, string>();
  for (const name of fs.readdirSync(sbDir).filter((n) => n.endsWith(".txt")).sort()) {
    const fileRel = `g${grade}/sb/${name}`;
    const text = fs.readFileSync(path.join(sbDir, name), "utf8");
    if (APPENDIX_FILE.test(name)) {
      appendix.set(fileRel, text);
      continue;
    }
    byFile.set(fileRel, applyBoxesOverlay(extractGrammarBoxes(text, fileRel), fileRel, overlay));
    const unitMatch = /unit\s*(\d+)/i.exec(name);
    unitOf.set(fileRel, unitMatch !== null ? parseInt(unitMatch[1]!, 10) : null);
  }
  return { byFile, unitOf, appendix };
}

/** Every valid sbRef for a grade: box refs + `<appendixFile>#appendix`. */
export function validSbRefs(boxes: GradeBoxes): Set<string> {
  const refs = new Set<string>();
  for (const list of boxes.byFile.values()) for (const b of list) refs.add(b.ref);
  for (const fileRel of boxes.appendix.keys()) refs.add(`${fileRel}#appendix`);
  return refs;
}
