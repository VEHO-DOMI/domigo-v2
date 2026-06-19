import { ItemRef } from "@domigo/content-schema";

export interface ParsedRef {
  grade: number;
  unitSlug: string; // dashed loader slug, e.g. g2-u03
  kind: "vocab" | "grammar";
}

/** Derive {grade, unitSlug, kind} from an item id. Never trust client-sent slug/grade. */
export function parseItemRef(id: string): ParsedRef | null {
  if (!ItemRef.safeParse(id).success) return null;
  const m = /^g([1-4])u(\d{2})\.(w|gi)\./.exec(id);
  if (!m) return null;
  return {
    grade: Number(m[1]),
    unitSlug: `g${m[1]}-u${m[2]}`,
    kind: m[3] === "w" ? "vocab" : "grammar",
  };
}
