// THE CARD GALLERY (R5-W1 · D1) — dev-only, never reachable in production.
//
// Why it exists: this packet rebuilds NINE card kinds and ELEVEN ceremony
// panels. Reaching each of them in the running game costs a play-through per
// item and can only ever photograph the ones ch01 happens to place — the
// `spell` kind is not in ch01's palette at all (doc 41 §1), so it has no frame
// in any replay Koki has ever recorded. A bench that mounts every surface from
// its own fixtures turns „prove it looks better" from a day into a minute, and
// makes the before/after gallery HONEST: the same bench photographs both sides.
//
// Three rules it follows, so it stays a measuring instrument rather than a
// second reality:
//  · REAL COMPONENTS ONLY. It renders the shipped `CardHost` and the shipped
//    ceremony `Overlay` (handed in as a prop, so this file never imports
//    PaintGame and Phaser can never leak into a second chunk — the bundle law).
//  · REAL CONTENT WHERE IT EXISTS. The cards come from the chapter's own
//    tasks file and the ceremonies from the chapter's own level; only `spell`
//    is synthetic, and it says so on the tile.
//  · ONE SURFACE PER URL. `?karten=<id>` renders exactly one stage at the
//    game's own size, which is what a screenshot wants; `?karten=1` lists them.
import React from "react";
import type { GameTaskV2 } from "@domigo/content-schema";
import type { PaintLevel } from "../level.ts";
import { CardHost } from "../cards/CardHost.tsx";
import { PAINT_OVERLAY_CSS } from "../cards/overlay-css.ts";
import { LOGICAL_H, LOGICAL_W, RENDER_SCALE } from "../paint.ts";

/** The ceremony renderer, handed in by PaintGame. Typed structurally — the
 *  gallery must not import PaintGame (see the bundle note above). */
export type OverlayRenderer = (props: Record<string, unknown>) => React.ReactElement;

export interface GalleryProps {
  level: PaintLevel;
  art: Record<string, string>;
  tasks: GameTaskV2[];
  Overlay: OverlayRenderer;
  /** which surface to show; "1" (or undefined) shows the index */
  which?: string;
}

/** the stage a card is judged on: the game's own viewport, with the chapter's
 *  own painted backdrop behind it. A card judged over white is a card judged
 *  over a world that does not exist. */
const STAGE_W = LOGICAL_W * RENDER_SCALE;
const STAGE_H = LOGICAL_H * RENDER_SCALE;

/** the chapter's own rooms, rotated behind the surfaces */
const BACKDROPS = ["l1_p1_a", "l1_p2_a", "l1_p3_a", "l1_p4_a", "l1_p1_b", "l1_p2_b", "l1_p3_b", "l1_p4_b"];

const SYNTHETIC_SPELL: GameTaskV2 = {
  id: "gallery.synthetic.spell",
  use: "encounter",
  kind: "spell",
  stimulus: { type: "entity", showsDe: "Ein grauer Bleistift hält Buchstaben hoch", art: "pencil_a" },
  storyDe: "Leg die Buchstaben in die richtige Reihenfolge!",
  promptEn: "What is it?",
  answer: "pen",
  extraLetters: "rt",
  skins: ["pencil"],
  phases: ["p1"],
  hints: { deDesc: "Das Schreibgerät mit Tinte.", deWord: "a pen" },
} as unknown as GameTaskV2;

/** one entry of the bench */
interface Surface {
  id: string;
  label: string;
  note?: string;
  render: () => React.ReactElement;
}

const noop = (): void => {};

export default function CardGallery({ level, art, tasks, Overlay, which }: GalleryProps): React.ReactElement {
  const byKind = (kind: string): GameTaskV2 | undefined => tasks.find((t) => t.kind === kind);

  // the chapter's own rule page, so the tip panel shows a real Merksatz
  const tipEntity = [...level.phases, ...(level.arena ? [level.arena] : [])]
    .flatMap((p) => p.entities)
    .find((e) => e.params?.merksatzDe !== undefined);
  const doorEntity = [...level.phases, ...(level.arena ? [level.arena] : [])]
    .flatMap((p) => p.entities)
    .find((e) => e.params?.price !== undefined);

  const bilanz = {
    kids: 1, kidsTotal: 1,
    freed: 5, freedTotal: 6,
    tips: 2, tipsTotal: 3,
    letters: 24, lettersTotal: 27,
    books: 1, booksTotal: 1,
  };

  const ceremony = (id: string, label: string, o: Record<string, unknown>, note?: string): Surface => ({
    id, label, note,
    render: () => (
      <Overlay
        o={{ req: { use: "quickfire", ctx: { type: "ceremony", beat: "goal" } }, item: null, attempts: 0, typed: "", align: "center", ...o }}
        level={level}
        art={art}
        onResolve={noop}
        onWorldChange={noop}
        onDismiss={noop}
        onPay={noop}
        letters={24}
        bonusTotal={12}
        bilanz={bilanz}
        hubHref="/play/1"
        onRestart={noop}
      />
    ),
  });

  /** THE BENCH MUST NOT FLATTER OR SLANDER. A blind critic on the first full
   *  round wrote that the restore card „shows the eraser in full saturated
   *  colour, so ‚give it its colour back' has no visible payoff" — and it was
   *  right about the picture and wrong about the game: in play that portrait
   *  carries the being's live wash (the desaturation law, doc 41 §2) and IS
   *  grey. The bench was handing the verifier a projection the game never
   *  shows. It passes the world's own WASH_ALPHA now. */
  const DRAINED_WASH = 0.72;

  const card = (id: string, label: string, task: GameTaskV2 | undefined, extra?: Record<string, unknown>, note?: string): Surface => ({
    id, label, note,
    render: () =>
      task === undefined ? (
        <p style={{ padding: 24, fontSize: 15 }}>keine {label}-Karte im Kapitel</p>
      ) : (
        <CardHost
          key={id}
          task={task}
          onResolve={noop}
          onDismiss={noop}
          align="right"
          art={art}
          servedUse={task.use}
          {...extra}
        />
      ),
  });

  const surfaces: Surface[] = [
    // ── the nine card kinds ────────────────────────────────────────────────
    card("choice", "choice", byKind("choice")),
    card("oddone", "oddone", byKind("oddone")),
    card("restore", "restore", byKind("restore"), { portraitWash: DRAINED_WASH },
      "der Radiergummi ist im Spiel GRAU, bis das Kind ihm die Farbe zurückgibt"),
    card("wheel", "wheel", byKind("wheel")),
    card("order", "order", byKind("order")),
    card("mistake", "mistake", byKind("mistake")),
    card("memory", "memory", byKind("memory")),
    card("typed", "typed", byKind("typed")),
    card("spell", "spell", SYNTHETIC_SPELL, undefined, "SYNTHETISCH — ch01 führt keine spell-Karte (doc 41 §1)"),
    // the two states a card also has to survive: the hint ladder open, and a
    // reawakening round counter above it
    card("choice-hints", "choice · Hinweis-Ebene", byKind("choice"), { round: { n: 3, of: 6 } },
      "Hinweise erscheinen erst nach Fehlversuchen — im Bench über die Runden-Zeile sichtbar gemacht"),
    // ── the eleven ceremony panels ─────────────────────────────────────────
    ceremony("goal", "Ziel-Karte", { card: "goal" }),
    ceremony("tip", "Regel-Seite", {
      card: "tip",
      tip: { topicDe: String(tipEntity?.params?.topicDe ?? "Regel"), merksatzDe: String(tipEntity?.params?.merksatzDe ?? "—") },
    }),
    ceremony("score", "Bilanz-Seite", { card: "score" }),
    ceremony("out", "Tür hinaus", { card: "out" }),
    ceremony("grant", "Die Gabe", { card: "grant" }),
    ceremony("cagehint", "Käfig-Hinweis", { card: "cagehint" }),
    ceremony("bonuspay", "Kleckskammer-Tür", { card: "bonuspay", price: Number(doorEntity?.params?.price ?? 6) }),
    ceremony("ceremony-merle", "Rettung · Merle", { card: "ceremony", ceremony: { skin: "merle", classmate: "merle", first: true } }),
    ceremony("ceremony-wisp", "Rettung · Wesen", { card: "ceremony", ceremony: { skin: "wisp", first: false } }),
    ceremony("console", "Trost-Karte", { card: "console", typed: "hello" }),
    ceremony("bonusend-perfect", "Kleckskammer · perfekt", { card: "bonusend", bonusend: { got: 12, total: 12, timeout: false } }),
    ceremony("bonusend-timeout", "Kleckskammer · Zeit aus", { card: "bonusend", bonusend: { got: 7, total: 12, timeout: true } }),
  ];

  const one = surfaces.find((s) => s.id === which);

  return (
    <div style={{ fontFamily: "var(--font-body, system-ui, sans-serif)", color: "#3b3122" }}>
      <style>{PAINT_OVERLAY_CSS}</style>
      {/* the dev server's own floating badge sits in the corner of every frame
          the bench shoots; a blind critic listed it as a defect of the GAME
          („a generic black N circle … identical across all 10 images"). The
          instrument may not put its own furniture in the evidence. */}
      <style>{"nextjs-portal{display:none!important}"}</style>
      {one === undefined ? (
        <>
          <h1 style={{ fontSize: 20, margin: "0 0 4px", fontFamily: "var(--font-display, inherit)" }}>
            Karten-Bench — {surfaces.length} Flächen
          </h1>
          <p style={{ fontSize: 13, color: "#7a6a4a", margin: "0 0 14px" }}>
            Eine Fläche pro Adresse: <code>?karten=&lt;id&gt;</code>. Nur Entwicklung, nie in Produktion.
          </p>
          <ul style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 6, listStyle: "none", padding: 0 }}>
            {surfaces.map((s) => (
              <li key={s.id}>
                <a href={`?karten=${s.id}`} style={{ color: "#8a5a2b" }}>
                  {s.label} <span style={{ color: "#b7a980" }}>({s.id})</span>
                </a>
              </li>
            ))}
          </ul>
        </>
      ) : (
        // ONE surface, full bleed on a neutral ground: a screenshot of the bench
        // must be a screenshot of the CARD, not of the app's header and padding
        // around it. The label sits outside the stage and is cropped away by the
        // capture script, so nothing on the judged image is bench furniture.
        <div style={{ position: "fixed", inset: 0, background: "#171310", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8 }}>
          <p style={{ fontSize: 12, margin: 0, color: "#8d7f66" }}>
            <a href="?karten=1" style={{ color: "#b4884f" }}>← Bench</a>
            {"  ·  "}
            <b>{one.label}</b> <span style={{ color: "#6f6552" }}>({one.id})</span>
            {one.note !== undefined && <>{"  ·  "}<i>{one.note}</i></>}
          </p>
          <div
            data-testid="gallery-stage"
            style={{
              position: "relative", width: STAGE_W, height: STAGE_H, overflow: "hidden",
              borderRadius: 10, background: "#e9dcbc", flex: "0 0 auto",
            }}
          >
            {/* a DIFFERENT room behind each surface. One backdrop for all 22
                made every frame look like the same inert wall, and two blind
                critics counted that against the cards themselves („~50 % of
                every frame is inert"). The world a card interrupts is a
                different room every time; the bench says so. */}
            <img
              src={art[BACKDROPS[surfaces.findIndex((s) => s.id === one.id) % BACKDROPS.length]!] ?? art.l1_p1_a ?? ""}
              alt=""
              aria-hidden
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
            />
            {one.render()}
          </div>
        </div>
      )}
    </div>
  );
}
