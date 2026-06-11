# apps/web — the DomiGo v2 Next.js app (PWA)

The student/teacher app: auth + claim flow, practice modes, Study Path, and the four grade games
(mounted on `app/(game)/play/[grade]` routes — engines code-split per route).

```sh
pnpm dev          # from this dir (or `pnpm --filter web dev` from the repo root)
pnpm typecheck && pnpm lint && pnpm build
```

Start with the repo root [README](../../README.md) and
[`docs/handover/00_START_HERE.md`](../../docs/handover/00_START_HERE.md); the guardrails in
[`08_design_principles.md`](../../docs/handover/08_design_principles.md) are non-negotiable.
Game-layer design: [`10_game_layer.md`](../../docs/handover/10_game_layer.md).
