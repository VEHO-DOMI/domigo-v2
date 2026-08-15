"use client";
/**
 * RegelbuchBoard — DAS REGELBUCH on the hub (doc 45 E3).
 *
 * The rule pages the child has put back into the book, readable outside a run.
 * Client-side because the library lives in `localStorage` for now (see
 * lib/regelbuch.ts for why that is a declared step and not an oversight), and
 * because a server component cannot read it.
 *
 * R5-W4 · I2 · REBUILT ON KOKI'S REPLAY OF 2026-08-15 („Regelbuch: schöner,
 * anschaulicher"). What it was: three flat cards in a CSS gradient, each ending
 * in an italic book reference. Three things were wrong with that and only the
 * first is about looks.
 *   1 · IT WAS NOT THE SAME OBJECT AS THE CARD IN THE GAME. The pickup card is a
 *       torn page on painted paper; this was a web panel. A child who collects a
 *       page in the world and looks it up on the hub should meet the same page.
 *       So the board is now set ON `merkseite_page` — the sheet AQ7 painted for
 *       exactly this and which nothing had ever loaded.
 *   2 · IT SHOWED ONLY WHAT WAS FOUND. The in-game archive has always drawn a
 *       torn stub for every page still missing, because the gap is the story —
 *       the shadow tore these out and you can see how many are still gone. The
 *       hub silently pretended the book was complete. It now draws the same
 *       stubs from `merkseite_stub`, off the total each entry carries.
 *   3 · IT POINTED AT THE TEXTBOOK. „MORE! 1 · Unit 1 · Seite 14" under every
 *       rule. Koki: „Die Regel soll NICHT aufs Buch verweisen … wir restaurieren
 *       unser eigenes Buch." The field still exists; no surface renders it.
 *
 * NAMING CARE: this hub already calls the CHAPTERS „Seiten" — the ZoneBoard
 * beside this one says „Die verlorenen Seiten" and „X / Y Seiten zurückgeholt".
 * Both are true and they are not the same thing: a chapter is a story page of
 * the book, a Regel-Seite is a grammar page torn out of it. The copy here says
 * „Regel-Seiten" every time, never a bare „Seiten", so the two boards can sit
 * on one screen without teaching a child that they are one collection.
 */
import { useSyncExternalStore } from "react";
import {
  regelbuchServerSnapshot,
  regelbuchSnapshot,
  subscribeRegelbuch,
  type RegelbuchEntry,
} from "@/lib/regelbuch";

const CHAPTER_NAMES: Record<string, string> = {
  ch01: "Kapitel 1 — Zeit für die Schule",
};

/** The ink family of the painted cards, written once. These are the same values
 *  the game's overlay sheet resolves its `--pb-*` tokens to; the hub sits
 *  outside that sheet's scope and cannot read them, so they are restated here
 *  rather than approximated — J2 measured `--pb-quiet-ink` at 5,53 : 1 on this
 *  paper and an eyeballed near-miss would quietly fail AA. */
const INK = "#2a2114";
const QUIET = "#6b5f47";
const LINE = "#c9ac74";
const ACCENT = "#a8541a";

/** The Merksatz with its one bold key — the same split the card makes, so the
 *  emphasis lands on the same phrase in both places. A key that is not in the
 *  sentence leaves the sentence whole rather than mangling it; `tip-honesty`
 *  is what stops that case ever shipping. */
const splitKey = (satz: string, key: string): readonly [string, string, string] => {
  if (key === "") return [satz, "", ""];
  const at = satz.indexOf(key);
  if (at < 0) return [satz, "", ""];
  return [satz.slice(0, at), key, satz.slice(at + key.length)];
};

const PAGE_URL = "/art/g1/paint/ch01/merkseite_page.png";
const STUB_URL = "/art/g1/paint/ch01/merkseite_stub.png";

/** THE OPEN NOTEBOOK, once per chapter.
 *
 *  ⚠ MEASURED, NOT ASSUMED — and the first attempt was wrong. `merkseite_page`
 *  was used as a per-rule background with `background-size: 100% 100%`, on the
 *  reasoning that „the rule is written on the page". On screen that stretched a
 *  450×346 painted notebook to the shape of each text block and laid the words
 *  across its own SPINE and printed boxes: unreadable, and a distorted object
 *  besides. Looking at the asset itself settled it — it is one OPEN BOOK, two
 *  ruled pages and a ring binder, i.e. the container for a chapter, not a
 *  backdrop for a paragraph. So it is shown once, whole, at its own ratio. */
const Buchbild = (): React.ReactElement => (
  // eslint-disable-next-line @next/next/no-img-element -- decorative painted cell from public/art, ratio-preserved; next/image adds nothing
  <img
    src={PAGE_URL}
    alt=""
    aria-hidden
    style={{ display: "block", width: "100%", maxWidth: 260, height: "auto", margin: "0 0 10px" }}
  />
);

/** One rule, as it lies in the book: name · what happens · the rule · the
 *  English. The same four steps, in the same order, as `cards/RulePage.tsx`.
 *
 *  The ring-binder edge on the left is the echo of the notebook above it: the
 *  entries are leaves OF that book, and a torn-out one (see `Stummel`) is the
 *  same strip with the same rings. That is what ties the three shapes together
 *  without stretching a painting behind text. */
const Seite = ({ e }: { e: RegelbuchEntry }): React.ReactElement => {
  const [before, key, after] = splitKey(e.merksatzDe, e.schluesselDe);
  return (
    <div
      style={{
        background: "linear-gradient(135deg, #fffdf4, #f7edd6)",
        borderLeft: `6px double ${LINE}`,
        borderRadius: "4px 12px 10px 4px / 4px 10px 12px 4px",
        boxShadow: "0 1px 0 rgba(0,0,0,0.05)",
        padding: "13px 17px 15px",
      }}
    >
      <div style={{ fontSize: 11.5, letterSpacing: "0.1em", textTransform: "uppercase", color: QUIET, marginBottom: 4 }}>
        {e.topicDe}
      </div>
      <div style={{ fontSize: 14, color: QUIET, lineHeight: 1.45, marginBottom: 5 }}>{e.erklaerungDe}</div>
      <div
        style={{
          fontSize: 14.5, color: INK, lineHeight: 1.45,
          borderLeft: `3px solid ${LINE}`, borderRadius: "3px 0 0 4px / 4px 0 0 3px",
          padding: "1px 0 1px 10px", marginBottom: 7,
        }}
      >
        {before}<strong style={{ fontWeight: 800 }}>{key}</strong>{after}
      </div>
      <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gap: 1 }}>
        {e.beispieleEn.map((line) => (
          <li key={line} style={{ fontSize: 16, fontWeight: 700, fontFamily: "var(--font-display)", color: ACCENT }}>
            {line}
          </li>
        ))}
      </ul>
    </div>
  );
};

/** A page still out there. No text at all: what is written on a page you have
 *  not found is not something you know, and printing the topic would both spoil
 *  the find and teach the rule for free. Same law as the in-game archive. */
const Stummel = (): React.ReactElement => (
  // ⚠ MEASURED ON THE SCREEN, not carried over. The in-game archive greys its
  // stubs hard (opacity .62 + grayscale .7) because they sit on a lit card in a
  // dark room. Copied onto the hub's pale mint page the same numbers washed the
  // torn strip out to a faint grey sliver — the gap stopped reading as „a page
  // is missing here" and started reading as a rendering fault. The hub keeps
  // the quieting (the stub must not compete with a found rule) and halves it.
  <div style={{ display: "flex", alignItems: "center", gap: 11, opacity: 0.85, filter: "grayscale(0.25)", padding: "6px 4px" }}>
    {/* eslint-disable-next-line @next/next/no-img-element -- decorative painted cell from public/art, sized by height; next/image adds nothing */}
    <img src={STUB_URL} alt="" aria-hidden style={{ height: 46, width: "auto" }} />
    <span style={{ fontSize: 13.5, fontStyle: "italic", color: QUIET }}>Diese Regel-Seite fehlt noch.</span>
  </div>
);

export default function RegelbuchBoard(): React.ReactElement | null {
  // localStorage read through React's own external-store API: the server (and
  // the first paint) sees an empty book, the client swaps in the real one, and
  // the snapshot is reference-stable so this cannot loop.
  const entries: RegelbuchEntry[] = useSyncExternalStore(
    subscribeRegelbuch,
    regelbuchSnapshot,
    regelbuchServerSnapshot,
  );

  if (entries.length === 0) return null;

  const byChapter = new Map<string, RegelbuchEntry[]>();
  for (const e of entries) byChapter.set(e.chapter, [...(byChapter.get(e.chapter) ?? []), e]);

  const found = entries.length;
  // the chapter totals, summed from what the pages themselves carry. `?? 0` and
  // the Math.max below mean a book written by an older build (no `total`) reads
  // as „no gaps" rather than as a negative number of missing pages — the honest
  // failure direction for a cache.
  const total = [...byChapter.values()].reduce((n, list) => n + (list[0]?.total ?? list.length), 0);

  return (
    <section style={{ marginTop: 28 }}>
      <h2 style={{ fontSize: 20, fontWeight: 800, fontFamily: "var(--font-display)", margin: "0 0 4px" }}>
        📜 Dein Regelbuch
      </h2>
      <p style={{ fontSize: 14, color: "#6b6250", margin: "0 0 12px" }}>
        {found >= total
          ? "Alle Regel-Seiten sind wieder im Buch — hier kannst du sie immer nachlesen."
          : `${found} von ${total} Regel-Seiten sind wieder im Buch.`}
      </p>
      {[...byChapter.entries()].map(([chapter, list]) => {
        const missing = Math.max(0, (list[0]?.total ?? list.length) - list.length);
        return (
          <div key={chapter} style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#a8926a", margin: "0 0 6px" }}>
              {CHAPTER_NAMES[chapter] ?? chapter}
            </div>
            <Buchbild />
            <div style={{ display: "grid", gap: 8 }}>
              {list.map((e) => (
                <Seite key={`${chapter}-${e.topicDe}`} e={e} />
              ))}
              {Array.from({ length: missing }, (_, i) => (
                <Stummel key={`gap-${chapter}-${i}`} />
              ))}
            </div>
          </div>
        );
      })}
    </section>
  );
}
