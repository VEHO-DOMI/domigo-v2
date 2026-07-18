// THE CODEX COMMISSION — BATCH Y (v5.2: ONE card — the classroom set repainted
// to the BOOK's colour key). Background: Batch W's colour variants came back
// off-key (door brown, board green, desk brown); the colour-room TASKS teach
// the book's colours, so the ART must match the book — not the other way
// round. ch01.tasks.json carries an INTERIM re-key to the W art; when this
// batch lands, the keys revert to the book values below.
import { STYLE_PIXEL_V3 } from "./commission-w.mjs";

export { STYLE_PIXEL_V3 };

const SHEET = "FORMAT: PNG pose-sheet on SOLID magenta #FF00FF (no transparency — chroma-keyed later). Clean grid, equal cells, generous margins, nothing touching cell borders.";

// THE BOOK COLOUR KEY (MORE! 1, Unit 1 — binding for art AND tasks):
export const BOOK_COLOURS = {
  chair: "brown",
  desk: "green",
  board: "white",
  door: "blue",
  window: "yellow",
  school_bag: "red",
};

export const cardsY = [
  {
    stem: "classroom4_sheet", file: "classroom4_sheet.png", folder: "ch01", batch: "Y", cls: "pixel", gen: "cr4",
    size: "1024×768 (4×3, 256px cells)", format: "sheet",
    usage: "Replaces the 12 cr_* classroom stems. Row-major pairs: chair grey/colour, desk grey/colour, board grey/colour, door grey/colour, window grey/colour, school_bag grey/colour — colour variants EXACTLY on the book key (chair BROWN, desk GREEN, board WHITE, door BLUE, window YELLOW, school bag RED).",
    prompt: `${STYLE_PIXEL_V3}\n\nSUBJECT: a 4×3 sheet (12 cells, row-major) of SIX classroom things, each as a PAIR — first the DRAINED variant (all greys, sad sleepy face), then the RESTORED variant (full colour, gentle happy face), each object ~190px, softly grounded with a small contact shadow:\n(1-2) CHAIR — restored variant painted warm wood BROWN.\n(3-4) DESK — restored variant painted friendly GREEN (green tabletop and frame, the book's green desk).\n(5-6) BOARD on a stand — restored variant a clean WHITE board (white writing surface, light frame).\n(7-8) DOOR in its frame — restored variant painted BLUE (clearly blue panels).\n(9-10) WINDOW with frame — restored variant with a warm YELLOW frame and sunny glass.\n(11-12) SCHOOL BAG — restored variant bright RED.\nTHE COLOUR LAW: these six restored colours are a TEACHING KEY from the textbook — the dominant colour of each restored object MUST be unmistakably the named colour (a child asked "what colour is it?" answers it in one look). Same object silhouette within each pair — only palette and face change. ${SHEET}`,
  },
];

export const futureSectionsY = [
  { title: "Act-1 per-chapter sets (ch02–ch05)", note: "Nach dem Template-Freeze: pro Kapitel Terrain-Delta + Kreaturen-Cast + bt/bgp am v3-Balken, aus den doc-30-Blättern." },
];
