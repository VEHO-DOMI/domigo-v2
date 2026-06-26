import { ListeningRef } from "@domigo/content-schema";

export interface ParsedListeningRef {
  grade: number;
  unitSlug: string; // dashed loader slug, e.g. g2-u03
  taskKey: string;
}

/** Derive {grade, unitSlug, taskKey} from a listening item id. Sibling to parseItemRef. */
export function parseListeningRef(id: string): ParsedListeningRef | null {
  if (!ListeningRef.safeParse(id).success) return null;
  const m = /^g([1-4])u(\d{2})\.li\.([a-z0-9-]+)\./.exec(id);
  if (!m) return null;
  return { grade: Number(m[1]), unitSlug: `g${m[1]}-u${m[2]}`, taskKey: m[3]! };
}
