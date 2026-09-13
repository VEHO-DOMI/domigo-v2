# CODEX DRAFT — NOT CANON

## Completed author-image import

Imported the two parent-approved, visually inspected originals with the existing registered-image importer. Installed four PNGs in `apps/web/public/art/g1/paint/ch01/`:

| Stem | Canvas | Meaning |
| --- | --- | --- |
| `klassenfoto_a` | 1408 × 972 | Whole wooden frame, complete class scene, fifteen children in three rows of five |
| `device_locker_a` | 820 × 736 | Closed empty locker with violet ink around its lock |
| `device_locker_b` | 820 × 736 | Byte-identical closed fallback; no invented animation |
| `device_locker_open` | 820 × 736 | Same locker body, door hinged on the right and opening to the right |

All final files were visually inspected at their registered resolution. The class photograph retains Merle in the lower left, wearing her green flower dress. The roster is recorded in the original manifest; this image is a complete class scene, not fifteen separate portraits. No lesson-answer text was painted into either image.

## Registration and window geometry

Both source originals remain byte-identical, with SHA-256 hashes — fingerprints of the file bytes — in `originals.manifest.json`, `installed-stems.json`, and `import-report.json`. The explicit source crop contains each complete foreground plus a six-pixel margin. The class-photo crop is x60,y23,w1415,h977, mapped to 1408×972. This preserves the complete frame.

Locker registration aligns the main body to common PNG coordinates x20..570 and y16..676. Source landmarks: closed x76..628,y145..805; open x740..1273,y145..799. The open door extends beyond the body to the right and slightly below it, so both states use the same larger 820×736 canvas. Align the body baseline y676 rather than each image's full painted bounding box. In the open state the full painted extent is x18,y14,w776,h712; the closed extent is x20,y15,w552,h663. These differing outer extents are intentional door geometry, not a body-scale change.

Measured bounded transparent components use alpha ≤16; alpha is a pixel's opacity. The following bounding boxes include rounded corners and therefore do not mean every pixel inside them is clear:

| State | Main opening (x,y,width,height) | Fully clear rectangle (every alpha = 0) |
| --- | --- | --- |
| Closed | 141,147,261,410 | 158,149,239,405 |
| Open | 134,122,314,451 | 135,123,313,449 |

The common safe placement rectangle is **x158,y149,width239,height405**, unchanged in both states. Root can place the real device inside this rectangle behind the locker texture. The open door has a separate clear opening at x556,y133,w140,h493; this is not the device cavity. Exact measurements and methods are in `window-geometry.json`.

For the Merle pencil case, already installed in the preceding task, both images use 744×440. Closed twelve grille openings have combined bounds x122,y115,w435,h217, with solid bars inside those combined bounds. Open main window x101,y113,w424,h215. Use `../merle/window-geometry.json`; these are opening bounds, not all-transparent placement rectangles.

## Verification and limits

The standard import passed all four images without weakening any threshold or changing the importer. For all four images, both source and output checks report zero remaining fringe pixels and zero remaining isolated specks. The original file hashes and installed output hashes were verified. Source and output reports are separated from the declared crop and registration coordinates. No additional colour matte was applied: the purple ink is authored content and must remain.

At large magnification, isolated violet edge pixels remain around parts of the locker window and outer silhouette. The unchanged standard fringe test classifies these as passing; the explicit no-violet treatment would remove legitimate ink and was not used. Parent was informed rather than silently changing the gate or recolouring the image. This is a remaining visual review observation, not a claimed zero-violet result.

The import changes no scene, user interface, animation contract, learning content, or gate. Scene placement and device drawing remain the parent's integration work. No game-play check or whole PR gate battery is claimed by this import report. No commit was made.

## Traceable files

Repository source pack: `docs/art/ch01-story-gamepass/devices-photo/`, including the two exact originals, exact prompts, original manifest and roster, import manifest, full import report, installed-stem hashes, window geometry, and import log. `classphoto-15-original.png` SHA-256: `4ac4e7214d82e0ce775ba0fa14e9755cd2aff2c696813f5411187f8d9f659d83`. Corrected locker original SHA-256: `a4f085cdae9bb22f86b1c6f63d7ddaa5b0a9966f5d9debe0e26f430f295adfc2`. The earlier locker original with the wrong hinge arrangement was not imported.

Lab outputs: `imported-devices-photo/`; measurement and byte-copy script: `finish-devices-photo-import.mjs`; import log: `devices-photo-import.log`. Script performs no pixel painting.
