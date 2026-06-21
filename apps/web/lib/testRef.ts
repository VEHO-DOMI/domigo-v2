import { TestRef } from "@domigo/content-schema";

export interface ParsedTestRef {
  grade: number;
  unitSlug: string; // dashed loader slug, e.g. g2-u03
  key: string;
}

/** Derive {grade, unitSlug, key} from a reading (`.ri.`) item id. Sibling to parseItemRef. */
export function parseTestRef(id: string): ParsedTestRef | null {
  if (!TestRef.safeParse(id).success) return null;
  const m = /^g([1-4])u(\d{2})\.ri\.([a-z0-9-]+)\./.exec(id);
  if (!m) return null;
  return { grade: Number(m[1]), unitSlug: `g${m[1]}-u${m[2]}`, key: m[3]! };
}
