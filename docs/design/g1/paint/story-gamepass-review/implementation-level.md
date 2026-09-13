# CODEX DRAFT — NOT CANON

## Scope and ownership

Changed only `content/corpus/stories/g1.st.lost-pages/paint/ch01.level.json` in the repository. The five rule pages are embedded tip entities in this same file; no separate tip file was found. No task, engine, test, gate, pilot or proof file in the repository was changed by this assignment. Root owns final integration and validation. No commit.

## Space and authored positions

Coordinates below are zero-based level cells. Each cell measures 16 game pixels.

The right rescue area in p2 grows from a 72-cell room to 92 cells. Everything west of column 60 is preserved, including the number corridor, ink basin, final descent and all nine letter positions. Columns 60–90 form one continuous lower room, floor at row 20, enclosing east wall at column 91. Old isolated upper rescue ledges were removed. This adds 320 game pixels of actual walking space rather than stretching an existing image.

| Beat | New cell | Reason |
| --- | --- | --- |
| Klecks | 63,19 | First encounter after the descent |
| Scissors | 68,19 | Own approach between guide and rescue |
| Merle pencil case | 75,19 | Reachable on the shared floor |
| Merle | 76,19 | Safe physical starting point for following |
| Sweater | 81,19 | Separate pickup after rescue |
| Paintbox | 85,19 | Distinct last enemy before exit |
| Exit door | 89,19 | On the floor near east wall |
| Exit glyph | 90,19 | Continues to p3 |

Merle fallback roaming bounds are 73–79, but the intended integrated behavior is the actual companion trail implemented in the earlier assignment. Wide roaming alone is not the delivered companion mechanic.

In p3, the exit door and glyph move from 60,13 to 60,14. The single support block at 60,14 is removed; the door stands on the broad row-15 terrace. Its exit hint says “Durch diese Tür kommst du zur Tafelbühne.” The phase name is “Der Schulhof”. This was verified against the actual images: `plate_p3_yardwall.png` shows an Austrian schoolyard with paving, school facade, bench and climbing frame; `band_p3_playground.png` shows benches, climbing frames and planted tubs. Calling this visible space an interior would be inaccurate. The door leads back into the school toward the blackboard stage. There is no garden-gate label.

The chair retains its existing identifier `p3-cage4` to avoid unnecessary reference churn, but becomes role `drained`, skin `obj_chair`, at 51,17, with no captive parameters. Its matching new task (owned by the content lane) restores yellow. The old cage count genuinely decreases; a gate expectation must not pretend the chair is still a rescue.

## Attacking objects

Scissors, glue stick and sharpener now use the existing chaser role, which provides a visible warning before its attack. A continuous bouncer would not provide that same warning beat. Their patrol bounds are respectively 66–70, 14–15 and 20–21. Scissors gain their own wide lower floor; glue and sharpener retain their existing safe support positions. The glue stick remains an upper optional encounter, so the main exit tape does not demonstrate its encounter; the independent entity probe below does.

Actual world stepping for all three produced `telegraph → act → patrol` and contact encounter events. Each skin still has a matching encounter/restore card: grey scissors, orange glue stick, red sharpener. This validates movement/encounter compatibility, not final animated art. Root must supply coherent attacking/warning art and ensure render treatment of restored hostile roles.

## Language

The chapter objective now introduces the Tintengeist, the colourless school things, Merle in the pencil case and Klecks as guide. The book does not speak or understand English. The reason for tasks is breaking the spell and helping Merle. Instructions use spoken names for the keyboard keys. No future classmate identity is revealed.

All five rule pages were reviewed. The apostrophe rule explicitly says that one or more letters were omitted. Imperative explanation starts with the verb and explains omission of “you”. The greeting rule uses natural sentences and a concrete object-answer example instead of formula-like plus signs. Number wording explains joining twenty and the ones with a hyphen. Plural wording covers the consonant/vowel distinction and the irregular child/children example. Existing taught forms and source references are preserved.

These are new child-visible lines, so root must include the level fields and all changed tip fields in the fresh blind-reader extract. This assignment does not claim that reader pass has already happened.

## Verification and reproducible artifacts

- `level-laws.log`: `parsePaintLevel` succeeds; `checkLevelLaws` returns `[]`; exit 0. This includes structural/reachability, letter routes, tip lengths, cloth placement and exit rules.
- `level-recorder.mjs`: lab copy of the repository recorder with imports redirected to the real repository engine and output redirected only to this report directory. The recorder algorithm and task solver were not weakened.
- `level-pilots.mjs`: revised exact macro programs for p2 and p3. Earlier untouched phase programs remain available. p2 follows the existing nine-letter approach, descends once, then walks through the spaced lower encounters and presses up at Merle. p3 omits the old final podium jump.
- `level-bands.log`: actual closed-loop recording followed by the same open-loop `replayPhaseTape` used by the repository. Both phases exit successfully with all nine letters.
- `level-proof.json`: recorded raw pad runs and measured outcome, in the lab only. Do not blindly replace the repository proof; root must integrate the intended sequences and stamp the final assembled engine state.
- `level-enemies.log`: 90 actual entity ticks per attacking restored object on its authored phase grid. Each produced warning, attack and contact; each has its intended restore task. This focused probe is not a replacement for a full UI playthrough.

Latest tape results before root updates the companion counter:

| Phase | Exit | Ticks | Letters | Solved tasks | Cages freed | Clothes |
| --- | --- | --- | --- | --- | --- | --- |
| p2 | p3 | 973 | 9/9 | 13 | 1 | 2 |
| p3 | boss | 633 | 9/9 | 2 | 0 | 3 |

Commands run with Node 24 and nice 15 from the trial repository. To repeat the exact tape recording:

```sh
export PATH=/opt/homebrew/opt/node\@24/bin:$PATH && node -v
nice -n 15 node --experimental-strip-types /Users/veho/Code/codex-lab/trial-berichte/CH01_STORY_SPIELPASS/level-recorder.mjs p2 p3
```

## Honest remaining integration limits

The p2 proof currently reports `classmatesAwake: 0` because the existing `tape.ts` counter only permits settle/joy/rest/wave/roam and does not yet recognize the new completed companion state `follow`. The six rescue rounds do complete and the cage is freed; root has been notified to update this semantic counter honestly. This is not grounds to lower the required classmate count. Re-record after root fixes it.

The successful exit tape does not visit every optional task or clothing piece; specifically the upper glue-stick encounter and restored chair are not asserted by this main route. Their authored cells pass reachability laws; complete learning/content coverage remains the separate whole-chapter gate responsibility.

No paintings were generated or stretched by this assignment. The p2 lower rescue floor/body and accompanying furniture composition must now be repainted or recomposed against the green geometry. The p3 door art must sit on the terrace rather than the deleted pedestal. Root owns these art and rendering changes and their alignment/performance evidence.

Full repository battery, final-head proof refresh, blind reader and PR/merge checks remain root tasks. No gate, expectation or test was modified here to obtain a pass.
