# DomiGo RPG Asset Replacement

The comparison slice currently uses original procedural placeholder pixel art. Each `WorldAsset` has a stable ID, size, palette recipe, and optional `replacementPath`.

## Why IDs stay stable

Maps refer to an asset ID such as `page.damaged`, not a filename. Final transparent PNG files can therefore replace placeholders without editing collision, story logic, interactions, saves, or tests.

## Replacement workflow

1. Keep the existing asset ID and authored pixel dimensions.
2. Generate or draw a transparent PNG through the DomiGo art pipeline.
3. Put the file in a committed public art folder.
4. Set that asset’s `replacementPath`; do not change map tokens.
5. Check transparent edges, one-pixel halos, palette fit, and readability at actual 32-pixel display size.
6. Compare phone, tablet, and desktop views with reduced motion both on and off.
7. Retain the procedural recipe as the safe fallback.

## Calibration palette

- storybook green for structure and navigation;
- warm gold for magic, focus, and earned restoration;
- cream paper for pages and learning overlays;
- school-interior wood for desks, doors, shelves, and corridor warmth.

## Contextual visual grammar

- people: speech marker;
- usable objects: restrained gold outline;
- collectibles: sparkle motion (static under reduced motion);
- damaged page: visibly torn artwork;
- restored page: complete cream-and-gold artwork;
- locked Library route: ink barrier, not a generic task orb.

No final-art claim is made in this calibration build.
