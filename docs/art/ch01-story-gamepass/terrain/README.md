# Terrain sourcepack

**CODEX DRAFT — NOT CANON**

Three bounded Chapter1 terrain replacements after the green layout recordings: extended p2east floor/wall/three stairs, extended p2east L ceiling, p3courtyard wall without the isolated top pedestal. Exact target geometry is in `body-plan.json`, authored originals in `sources/`, registered axes in `import-manifest.json`, original/output hashes in `provenance.json`, generated silhouette stencils in `masks/`, and measurements/logs in `evidence/`.

Run the unchanged registered importer with Node24:

```sh
node docs/art/import-ch01-buecherwelt.mjs --manifest docs/art/ch01-story-gamepass/terrain/import-manifest.json --dest docs/art/ch01-story-gamepass/terrain/registered
```

The explicit `clipAlpha` masks cut only forbidden air; they never supply opacity or colour. Every required target pixel was measured as alpha255, every outside pixel as alpha0. The floor original contains painted checkerboard in its air; measured monotone registration samples only inside its books and the mask removes all air. No checkerboard colour cleanup or hand-painted replacement pixels was used. The two newly generated ceiling/courtyard sources use magenta background processed by the already registered importer.

The `sources/body-p3-east-wall-before.png` original is provenance only: clipping its old single pedestal left a dark stump on the terrace and was rejected. Final p3 comes from the genuinely edited source and has a continuous painted terrace cap. The first wider floor generation was rejected because it had four steps; Root's corrected three-step original is the imported source (`floor-correction.prompt.txt`).

Existing checks: all body silhouettes pass; p2/p3 partitions have zero errors; visualBody and scene-cutout tests20/20 pass. No gate files were changed. The final browser camera/character-scale inspection belongs to the integration pass. The detailed German report is in the lab at `CH01_STORY_SPIELPASS/implementation-terrain-layout.md`.
