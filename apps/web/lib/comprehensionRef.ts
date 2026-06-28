import { StoryComprehensionRef } from "@domigo/content-schema";

export interface ParsedComprehensionRef {
  grade: number;
  unitSlug: string; // dashed loader slug, e.g. g2-u04
  key: string;
}

/** Derive {grade, unitSlug, key} from a story-comprehension (`.ci.`) item id. Sibling to parseItemRef. */
export function parseComprehensionRef(id: string): ParsedComprehensionRef | null {
  if (!StoryComprehensionRef.safeParse(id).success) return null;
  const m = /^g([1-4])u(\d{2})\.ci\.([a-z0-9-]+)\./.exec(id);
  if (!m) return null;
  return { grade: Number(m[1]), unitSlug: `g${m[1]}-u${m[2]}`, key: m[3]! };
}
