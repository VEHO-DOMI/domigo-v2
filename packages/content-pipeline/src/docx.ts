/**
 * Minimal, dependency-free .docx reader.
 *
 * Reads word/document.xml via `unzip -p` and walks the body in document
 * order, yielding paragraphs (text) and tables (rows × cells of text).
 * Table structure comes from the XML (<w:tbl>/<w:tr>/<w:tc>), which is far
 * sturdier than parsing flattened text exports.
 */
import { execFileSync } from "node:child_process";

export interface DocxTextRun { text: string; bold: boolean }

export type DocxBlock =
  | { kind: "paragraph"; text: string; runs?: DocxTextRun[] }
  | { kind: "table"; rows: string[][] };

export function readDocumentXml(docxPath: string, quietErrors = false): string {
  // execFileSync passes the path as a single argv entry — trailing spaces and
  // ampersands in iCloud folder names survive intact.
  const out = execFileSync("unzip", ["-p", docxPath, "word/document.xml"], {
    maxBuffer: 256 * 1024 * 1024,
    // Explicit pipe suppresses execFileSync's automatic stderr forwarding on
    // failure. Intake catches the error and emits only a grade, never a path.
    ...(quietErrors ? { stdio: "pipe" as const } : {}),
  });
  return out.toString("utf8");
}

const ENTITIES: Record<string, string> = {
  "&amp;": "&",
  "&lt;": "<",
  "&gt;": ">",
  "&quot;": '"',
  "&apos;": "'",
};

function decodeEntities(s: string): string {
  return s
    .replace(/&(?:amp|lt|gt|quot|apos);/g, (m) => ENTITIES[m] ?? m)
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex: string) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, dec: string) => String.fromCodePoint(parseInt(dec, 10)));
}

/** Concatenate the text runs (<w:t>) of an XML fragment. */
export function fragmentText(xml: string): string {
  let text = "";
  const re = /<w:(t|tab|br|cr)(?:\s[^>]*)?(\/)?>/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(xml)) !== null) {
    const tag = m[1];
    if (tag === "tab") {
      text += "\t";
      continue;
    }
    if (tag === "br" || tag === "cr") {
      text += "\n";
      continue;
    }
    if (m[2] === "/") continue; // self-closing <w:t/>
    const close = xml.indexOf("</w:t>", re.lastIndex);
    if (close === -1) break;
    text += decodeEntities(xml.slice(re.lastIndex, close));
    re.lastIndex = close + "</w:t>".length;
  }
  return text.normalize("NFC");
}

/** Find the end index of an element that may nest itself (e.g. w:tbl). */
function findElementEnd(xml: string, openTagRe: RegExp, closeTag: string, from: number): number {
  let depth = 1;
  let cursor = from;
  const open = new RegExp(openTagRe.source, "g");
  while (depth > 0) {
    open.lastIndex = cursor;
    const nextOpen = open.exec(xml);
    const nextClose = xml.indexOf(closeTag, cursor);
    if (nextClose === -1) return xml.length;
    if (nextOpen !== null && nextOpen.index < nextClose) {
      depth += 1;
      cursor = nextOpen.index + nextOpen[0].length;
    } else {
      depth -= 1;
      cursor = nextClose + closeTag.length;
    }
  }
  return cursor;
}

function parseRow(rowXml: string): string[] {
  const cells: string[] = [];
  const cellOpen = /<w:tc[ >]/g;
  let m: RegExpExecArray | null;
  while ((m = cellOpen.exec(rowXml)) !== null) {
    const end = findElementEnd(rowXml, /<w:tc[ >]/, "</w:tc>", m.index + m[0].length);
    const cellXml = rowXml.slice(m.index, end);
    // Join multi-paragraph cells with \n; downstream keeps raw + splits safely.
    const parts: string[] = [];
    const pOpen = /<w:p[ >/]/g;
    let pm: RegExpExecArray | null;
    while ((pm = pOpen.exec(cellXml)) !== null) {
      if (pm[0].endsWith("/")) continue;
      const pEnd = cellXml.indexOf("</w:p>", pm.index);
      if (pEnd === -1) break;
      parts.push(fragmentText(cellXml.slice(pm.index, pEnd)));
      pOpen.lastIndex = pEnd;
    }
    cells.push(parts.join("\n").trim());
    cellOpen.lastIndex = end;
  }
  return cells;
}

function parseTable(tblXml: string): string[][] {
  const rows: string[][] = [];
  const rowOpen = /<w:tr[ >]/g;
  let m: RegExpExecArray | null;
  while ((m = rowOpen.exec(tblXml)) !== null) {
    const end = findElementEnd(tblXml, /<w:tr[ >]/, "</w:tr>", m.index + m[0].length);
    rows.push(parseRow(tblXml.slice(m.index, end)));
    rowOpen.lastIndex = end;
  }
  return rows;
}

/** Direct formatting only. Unsupported wrappers/styles never become boundary evidence. */
export function paragraphTextRuns(xml: string): DocxTextRun[] | undefined {
  if (/<w:(?:hyperlink|ins|del|moveFrom|moveTo|rPrChange|pPrChange|sdt|fldSimple|rStyle|pStyle|fldChar|instrText)\b/u.test(xml)) return undefined;
  const runs: DocxTextRun[] = [];
  for (const match of xml.matchAll(/<w:r(?:\s[^>]*)?>[\s\S]*?<\/w:r>/gu)) {
    const body = match[0];
    const properties = /<w:rPr(?:\s[^>]*)?>([\s\S]*?)<\/w:rPr>/u.exec(body)?.[1] ?? "";
    const boldTag = /<w:b(?=[\s/>])([^>]*)>/u.exec(properties);
    const value = boldTag && /\bw:val\s*=\s*["']([^"']+)["']/u.exec(boldTag[1]!)?.[1];
    if (value && !["0", "1", "true", "false", "on", "off"].includes(value)) return undefined;
    runs.push({ text: fragmentText(body), bold: !!boldTag && !["0", "false", "off"].includes(value || "") });
  }
  // Text not represented by the direct runs would otherwise silently disappear.
  if (runs.map(r => r.text).join("") !== fragmentText(xml)) return undefined;
  return runs;
}

/** Walk the document body in order, yielding paragraphs and tables. */
export function parseDocxBlocks(docxPath: string, quietErrors = false, preserveRuns = false): DocxBlock[] {
  const xml = readDocumentXml(docxPath, quietErrors);
  const bodyStart = xml.indexOf("<w:body");
  const body = bodyStart === -1 ? xml : xml.slice(bodyStart);
  const blocks: DocxBlock[] = [];
  const next = /<w:(p|tbl)[ >/]/g;
  let m: RegExpExecArray | null;
  while ((m = next.exec(body)) !== null) {
    if (m[1] === "tbl") {
      const end = findElementEnd(body, /<w:tbl[ >]/, "</w:tbl>", m.index + m[0].length);
      blocks.push({ kind: "table", rows: parseTable(body.slice(m.index, end)) });
      next.lastIndex = end;
    } else {
      if (m[0].endsWith("/")) continue; // empty <w:p/>
      const end = body.indexOf("</w:p>", m.index);
      if (end === -1) break;
      const text = fragmentText(body.slice(m.index, end)).trim();
      if (text.length > 0) {
        const runs = preserveRuns ? paragraphTextRuns(body.slice(m.index, end)) : undefined;
        blocks.push({ kind: "paragraph", text, ...(runs ? { runs } : {}) });
      }
      next.lastIndex = end;
    }
  }
  return blocks;
}

/** Plain-text rendering for the committed transcript snapshots. */
export function docxToText(docxPath: string): string {
  const lines: string[] = [];
  for (const block of parseDocxBlocks(docxPath)) {
    if (block.kind === "paragraph") {
      lines.push(block.text);
    } else {
      for (const row of block.rows) lines.push(row.join("\t"));
      lines.push("");
    }
  }
  return lines.join("\n").replace(/\n{3,}/g, "\n\n").trimEnd() + "\n";
}
