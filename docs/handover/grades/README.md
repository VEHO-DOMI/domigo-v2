# DomiGo v2 — the four grades, documented

_The per-grade encyclopedia: what's in each grade's content AND its game. For orientation + the project-wide review lens, read [`../../HANDOVER_FOR_REVIEW.md`](../../HANDOVER_FOR_REVIEW.md) first; for live status, [`../../STATUS_AND_ROADMAP.md`](../../STATUS_AND_ROADMAP.md)._

DomiGo v2 teaches **Austrian AHS Klasse 1–4** from the **MORE! 1–4** textbooks (level **A1 → A2+**). Every grade has (1) an approved **content corpus** (vocab + grammar, one folder per unit) and (2) a standalone **grade game** with its own genre. The games all ride the *same* corpus, the *same* grading brain (`@domigo/engine`), and the *same* spaced-retrieval service (`getDueRefs`) — they differ only in fiction + surface.

## The four grades at a glance

| Grade | Level | Units | Vocab | Grammar | Game | Genre | Chapters | Built? |
|---|---|---|---|---|---|---|---|---|
| **[G1](g1.md)** | A1 | 15 | 786 | 1106 | **The Lost Pages** | Phaser top-down overworld RPG | 15 zones | ✅ shipped (#72–78 uplift) |
| **[G2](g2.md)** | A1+/A2 | 15 | 611 | 600 | **The Wrong Name** | DOM+SVG fair-play detective mystery | 15 chapters | ✅ shipped (#40–60, full pedagogy) |
| **[G3](g3.md)** | A2/A2+ | 14 | 599 | 813 | **FOURTEEN** | DOM+SVG interactive graphic novel | 14 episodes | ✅ shipped (#61–71) |
| **[G4](g4.md)** | A2+ | 13 | 450 | 933 | **Syntaxia** | Phaser branching grammar-RPG | 13 worlds | 🟡 designed, not built ([`../13_g4_syntaxia.md`](../13_g4_syntaxia.md)) |
| **Total** | A1→A2+ | **57** | **2,446** | **3,452** | — | — | **44 + 13 planned** | — |

(2,446 vocab + 3,452 grammar = **5,898 items**, all approved at 0.0% stage-8 reject.)

## What "a grade" contains

**1. Content corpus** — `content/corpus/units/g<N>-u<NN>/`:
- `vocab.json` — the unit's vocabulary items (the taught words + phrases).
- `grammar.json` — the unit's grammar items across the 13 formats.
- `state.json` — the audit state (all 57 = `approved`).
- The grade's **structure catalog** is in `content/corpus/structures/g<N>/structures.json` (the grammar rules taught, e.g. G4's third-conditional / reported-speech).
- **Listening/test content** (`listening.json`/`test.json`) is a *separate corpus wave* — only the **g2-u03 pilot** exists (1 of 57 for each); the runtimes are done but the corpus isn't. This is the single largest remaining content effort.

**2. The grade game** — `content/corpus/stories/g<N>.st.<slug>/` (story) + a game package (`packages/game-2d` for G1/G4, `game-detective` for G2, `game-novel` for G3):
- `story.json` (`story@1`) — chapters → scenes → embedded `taskSlots` (referencing corpus items, never copying) + branching `next: Choice[]`.
- `cast.json` / `names.json` — characters + the proper-noun level-gate escape.
- `comprehension.json` — the `.ci.` story-comprehension items (one per chapter/zone/episode).
- `map.json` (overworld grades only) — the zones.
- `variants.json` — scene-embedded carrier re-frames (the tasks-as-story mechanism).
- `release.json` — which chapters are live (gated by unit approval).
- `art.json` — the decoupled art manifest (procedural fallback until PNGs land).

Each per-grade doc below covers the **full chapter/zone/episode breakdown**, the cast, the distinctive mechanics, the enrichment, the file map, and the review-targets.

## Cross-grade: the shared learning app

Beyond the games, the same corpus powers the learning surfaces (all grade-agnostic; see `../../HANDOVER_FOR_REVIEW.md` §3):
- **`/practice`** — stateless drill of any unit's items.
- **`/review`** — the Leitner spaced-review queue (`getDueRefs`), fed by *every* graded attempt in any mode.
- **`/learn`** — the Study Path: a guided per-unit node map (vocab intro → practice → grammar intro → practice → checkpoint).
- **`/listening`** — audio-comprehension tasks (runtime done; content = pilot only).
- **`/tests`** — Schularbeit-style mock tests (runtime done; content = pilot only; teacher grading = the pending B2b).
- **`/admin`** — teacher surfaces (incl. the G2 unit-mastery view).

Everything grades through `POST /api/attempts` → `@domigo/engine` → `recordAttempt` (XP + Leitner + streak), and games derive their reward surfaces (Evidence/Season/Zone boards) from `getSolvedGameItemIds` — **one grading path, everywhere**.

## Read next
- Per grade: **[g1.md](g1.md)** · **[g2.md](g2.md)** · **[g3.md](g3.md)** · **[g4.md](g4.md)**
- The game-design bible (the 9 Laws, the intended design of all 4 games): [`../10_game_layer.md`](../10_game_layer.md)
- The project review lens (gaps/risks/what-to-scrutinize): [`../../HANDOVER_FOR_REVIEW.md`](../../HANDOVER_FOR_REVIEW.md)
