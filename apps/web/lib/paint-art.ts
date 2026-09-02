import "server-only";
/**
 * paint-art — the only-present resolver for THE PAINTED BOOK's art tree
 * (apps/web/public/art/g1/paint/**): every PNG that EXISTS becomes a
 * stem → url entry; every missing stem keeps its procedural fallback inside
 * the scene (the keen-art law — art lands incrementally, batch by batch,
 * and the game never breaks on a missing file).
 */
import fs from "node:fs";
import path from "node:path";
import { stamped } from "./art-fingerprint";

/** L0 · D2 · DER AUFLÖSER BEKOMMT DAS KAPITEL.
 *
 *  Die Ordner standen fest als `["hero", "ch01"]`: `hero` sind die Blätter der
 *  Figur (in jedem Kapitel dieselben), `ch01` war der Raum-Ordner. Ein zweites
 *  Kapitel hätte damit die BILDER VON KAPITEL 1 bekommen — nicht keine, was der
 *  Keen-Kunst-Regel entspräche und grau ausginge, sondern die falschen, was auf
 *  dem Schirm wie ein fertiges Spiel aussieht und keines ist.
 *
 *  Die Reihenfolge bleibt hero → Kapitel (ein Kapitel-Blatt gleichen Namens
 *  gewinnt), und für ch01 ist die Karte damit Byte für Byte dieselbe wie zuvor.
 *  Ein Kapitel ohne Ordner bekommt die Hero-Karte allein: die graue Welt, die
 *  die Platzhalter-Doktrin will. */
const artDirsFor = (chapter: string): readonly string[] => ["hero", chapter];

/**
 * R5-N3 · E4 · THE CACHE KEY IS THE FILE, NOT THE COMMIT.
 *
 * E1 made these files `immutable` for a year and hung the build's commit sha on
 * every URL so a repaint could not be trapped behind that cache. Correct, and it
 * had a consequence nobody costed: the sha changes on EVERY merge, so every
 * merge gave all 298 paintings new addresses and threw away a cache that was
 * still perfectly good. A phase is 17–29 MB of art. Koki plays right after each
 * merge, which is exactly the case that never gets a warm cache — and what he
 * reported was "das Laden braucht vergleichsweise um einiges länger".
 *
 * Fingerprinting each file by its CONTENT keeps E1's guarantee (changed art gets
 * a new address, so nothing is ever stale) and drops the collateral damage
 * (unchanged art keeps its address, so it is fetched once and then never again).
 * After a merge that repaints three files, a returning child downloads three
 * files instead of 298.
 *
 * Cost, measured on this machine: 228 ms to hash 118 MB, ONCE per server
 * instance — the result is cached below, so no request pays it twice. The commit
 * sha stays as the fallback for any file that cannot be read.
 */
// R5-W3 · E5: the helper moved to art-fingerprint.ts, because keen/tile/story
// art was serving 66 MB under the same immutable header with NO cache key.

// Der Cache liegt JE KAPITEL. Vorher war es eine einzige Modul-Variable, die
// dem ersten Kapitel gehörte, das den Server erreicht — mit zwei Kapiteln hätte
// das zweite die Karte des ersten serviert bekommen, und zwar bis zum nächsten
// Neustart. (Die 228 ms Fingerabdruck-Kosten fallen damit einmal je Kapitel an
// statt einmal je Server, nicht einmal je Anfrage.)
const cache = new Map<string, Record<string, string>>();

export const resolvePaintArt = (chapter: string): Record<string, string> => {
  const hit = cache.get(chapter);
  if (hit) return hit;
  const out: Record<string, string> = {};
  const root = path.join(process.cwd(), "public", "art", "g1", "paint");
  for (const dir of artDirsFor(chapter)) {
    const abs = path.join(root, dir);
    if (!fs.existsSync(abs)) continue;
    for (const f of fs.readdirSync(abs).filter((x) => x.endsWith(".png"))) {
      out[f.replace(/\.png$/, "")] = stamped(`/art/g1/paint/${dir}/${f}`, path.join(abs, f));
    }
  }
  cache.set(chapter, out);
  return out;
};
