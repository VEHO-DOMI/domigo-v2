import type { VocabPool } from "@domigo/engine";
import type { Direction } from "../../app/practice/options.ts";

/** Original Speed uses the chosen practice type; Mix visits all four. */
export function speedPool(direction: Direction, index: number): VocabPool {
  return direction === "auto" ? (["carrier", "definition", "deToEn", "enToDe"] as const)[index % 4]! : direction;
}
