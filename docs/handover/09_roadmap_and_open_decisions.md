# 09 — Roadmap, Open Decisions & the Bulletproof-Beta Checklist

## Recommended sequencing
**P0 — make the foundation bulletproof (before any student go-live):**
1. **Content rework** — item-by-item, rooted in the textbooks, all `04`/`08` rules; per-unit word banks;
   green validators per unit + Koki spot-check.
2. **Migration completion** — import post-2026-05-17 Firebase signups without clobbering claimed accounts
   (`03`); keep the claim flow working.
3. **UX/UI + stability hardening** of whatever app serves the imminent beta.

**P1 — the durable learning pillars:** Study Path (+ Smart Review) → Mock Tests → Listening.

**P2 — engagement + platform:** Story/RPG mode (tech spike first) → PWA install → evaluate native.

**P3 — social, if wanted:** decide Battle / Class Quiz / Buddies; remove dead toggles either way.

## Open decisions (Koki + Fable, before/early in build)
- **Interim beta vehicle:** harden-and-ship **v1** for the imminent student test while v2 is built, vs.
  wait for v2. *(Recommended: hardened-v1 now — the content corpus + migrated data are app-agnostic and
  carry into v2 regardless. "Rebuild from scratch" + "students very soon" otherwise collide.)*
- **v2 stack/architecture** — especially if Story/RPG needs a game engine; how it shares the content
  engine with Study Path; PWA now + native later.
- **Story-mode scope & tech** — 2D scene engine vs. lightweight 3D; how big; asset pipeline.
- **Listening audio** — MORE! Test-Builder audio (rights) vs. generated TTS.
- **Authoring source of truth** — the exact shape of the MORE!-transcript → corpus pipeline + validation
  gate.
- **Native timing** — PWA-only vs. Capacitor/Expo, and when.
- **Mock-test grading** — how much auto-grading vs. teacher hand-grading (esp. writing).

## Bulletproof-Beta Checklist (gate before students)
- [ ] Per audited unit: content validator green (no unanswerable items; no out-of-word-bank unglossed
      words; no "Sie" address; every blank has a sentence-correct accepted-answer set; translations
      correct both ways; every structured item renders) **and** Koki spot-checked.
- [ ] Auth works: student sign-in, teacher sign-in, **legacy claim** (`/signin/migrate`).
- [ ] Migration current: post-May-17 students importable; a fresh claim works end-to-end; no claimed
      account clobbered.
- [ ] No route 500s; progress persists across sign-out/in; combos/XP/streaks/badges award correctly.
- [ ] Mobile-first verified on a cheap phone viewport; PWA installs and tolerates flaky network.
- [ ] Class-scale smoke test (~30 concurrent) — no race/lost-write on attempts.
- [ ] No dead toggles shown to teachers/students for unbuilt features.

## What "done" looks like for this handover
All 11 files in `docs/handover/` + mirrored to the iCloud `DomiGo v2 Handover/` folder; `PASSOVER_PROMPT.md`
opens cold and stands alone; Part-1 claims cross-checked against the live repo; every `05` path resolves.
