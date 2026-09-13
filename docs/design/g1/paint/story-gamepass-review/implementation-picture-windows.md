# CODEX DRAFT — NOT CANON

State: implemented in the shared trial working tree; no commit. Parent owns scene and whole-level integration.

## What changed and why

`packages/game-paint/src/story/picture-windows.ts` exports the measured pencil-case and device-locker openings and two pure geometry functions. Pure means that they calculate positions without reading or changing a game, browser, or image. Cards and the world can therefore share the same authored coordinates.

`cards/Glance.tsx` now places the occupant inside a registered opening relative to an inner wrapper whose dimensions are exactly the displayed shell PNG. This fixes the previous full-card/full-shell placement. The entire occupant is proportionally contained, centred horizontally and aligned at the bottom. The shell is drawn afterward, so Merle remains behind the real painted bars. The action mark remains in the unchanged outer plate wrapper. Existing unregistered picture layouts retain their full-shell fallback. No new illustration is drawn in CSS.

`cards/CardShell.tsx` identifies the registered shell from the actual portrait stem. `device_locker_*` selects the existing real object (`obj_soundsystem`, `obj_tablet`) through the free-cell convention instead of the legacy captive artwork. `pencilcase_*` selects the registered person window. A complete composition, or a `merle_act_*` scene, never receives a duplicate girl. Other chapters retain the existing captive naming fallback.

For `restore` tasks explicitly declaring `curseVisual: "violet-ink"`, CardShell passes the available `art.curse_violet` to Plate. It becomes a separate transparent image above the object, sharing the object's image box. Portrait wash still applies to the object; the violet ink itself is not desaturated. No other task gets this layer merely because the asset exists. Root owns importing the real ink artwork and its scene behaviour.

## Exported interface

```ts
type PictureRect = Readonly<{ x: number; y: number; width: number; height: number }>;
type PictureWindow = Readonly<{
  frame: Readonly<{ width: number; height: number }>;
  window: PictureRect;
  inset: number;
}>;

PENCILCASE_WINDOW // frame 744×440; opening 122,115,435,217; inset 8
DEVICE_WINDOW    // frame 820×736; common clear rectangle 158,149,239,405; inset 6

containInPictureWindow(registration, { width, height }, inset = registration.inset)
// Returns the complete, proportional, bottom-centred content box in shell PNG pixels.

pictureWindowPercent(registration)
// Returns the inset opening as x/y/width/height percentages of the shell PNG.
```

`Plate` adds optional `behindWindow?: PictureWindow` and `curseUrl?: string`. Its image wrapper has a declared display width derived from the registered aspect ratio and requested height; it can shrink with available card width. The shell image determines the matching wrapper height. The occupant uses `object-fit: contain`, meaning the entire source image remains visible without changing its proportions.

The pencil-case opening is a grille, not one fully transparent rectangle. Its eight-pixel inset avoids the outer rounded corners; bars intentionally cover portions of the girl. The device safe rectangle is fully transparent in both closed and open registered PNGs, with six additional inset pixels for placement. The helper rejects invalid dimensions, out-of-frame windows, and insets that consume the opening.

## Verification

Command, Node 24 and nice 15:

```sh
pnpm --filter @domigo/game-paint exec vitest run src/story/picture-windows.test.ts src/complete-art.test.ts src/restore-grey.test.ts src/cards/portrait.test.ts
```

Exit 0: four files, **34 tests passed**. Log: `picture-windows-tests-green.log`. Package typecheck exit 0: `picture-windows-typecheck-final.log`.

The eleven new tests read the actual imported PNGs. They check real dimensions, complete content aspect ratios, every pixel under the resulting device placement in both locker states, the presence of the pencil-case bars, wide and tall content, malformed geometry, image layering emitted by React, omission of duplicate Merle action portraits, and separation of grayscale object wash from the violet image layer. Existing complete-composition and restore-wash tests remain green.

### New geometry test ownership and tamper

New file `story/picture-windows.test.ts` belongs to this lane. A lab-only copy of the helper changed `Math.min` to `Math.max`, converting whole-image containment into a crop-prone cover placement. The same actual output-bound assertion passed on the production helper and threw on the altered copy. Evidence: `picture-windows-cover-tamper.ts` and `picture-windows-cover-tamper.log`. Production helper bytes were not mutated for this probe. Existing tolerances were not relaxed; the geometric comparisons explicitly allow only 1e-10 pixel floating-point noise.

### Existing portrait test change and tamper

Parent explicitly extended ownership to `cards/portrait.test.ts`. It now checks the exact locked-object identities—picture, sound system and tablet—plus the sole person Merle. It also checks that the ordinary chair is a `drained` entity using `obj_chair`, has no captive field, and has an actual encounter/restore task targeting `chair` and `yellow`, bound to an existing `obj_chair_a` PNG. Thus the count changed for a named semantic reason rather than merely reducing an expected number.

The same chair assertion is called with a cloned entity changed back to `role: "cage", params: { captive: "chair" }`. It throws, and the mutation test requires that failure. This is an internal red assertion with a passing harness result, not a claim of a separate CLI exit 1. Real level data remain untouched.

## Browser evidence and limits

An isolated headless Chrome loaded a local HTML fixture rendered from the real React Plate component, current overlay stylesheet, and base64 bytes of the actual six PNGs. It displayed three compositions: Merle/pencil case, sound system/closed locker, and tablet/open locker. All image boxes remained inside their actual shell-image wrapper. Saved screenshot `picture-window-browser.png` was visually inspected; measured browser rectangles are in `picture-window-browser.json`. Source fixture, generated HTML and browser driver are saved beside this report. The fixture requests 200px picture height to inspect the artwork clearly; production's unchanged default is 132px. This verifies the actual component and browser geometry, not a full gameplay route or mobile reading assessment.

The real violet-ink asset had not been imported when this component fixture was rendered. Its conditional binding and unwashed image emission are tested; final visible artwork and disappearance during scene restoration remain part of Root's integrated review.

Filed, not acted on: the actual existing `obj_soundsystem` and `obj_tablet` textures carry beige painted paper halos, visibly retained within the new locker. Parent was informed; no image was recoloured or cut to conceal them. A broader emphasis test initially reported an unrelated `<strong>` in `PaintGame.tsx`; Root received that exact finding and owns that file. No claim is made here that the whole project battery is green.

## Next step

Parent integrates the shared helper in the scene, binds the device shell fields and real curse artwork, and includes these five owned files and evidence in the whole-level browser review and PR gate battery. No action or permission is needed from Koki for this lane.
