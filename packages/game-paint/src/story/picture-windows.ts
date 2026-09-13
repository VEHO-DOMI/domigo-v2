/** Registered PNG coordinates, shared by cards and the world. These describe
 * authored openings; they never cut or redraw the artwork. */
export type PictureRect = Readonly<{ x: number; y: number; width: number; height: number }>;
export type PictureWindow = Readonly<{
  frame: Readonly<{ width: number; height: number }>;
  window: PictureRect;
  inset: number;
}>;

/** The closed pencil case has bars inside this opening. The inset keeps the
 * occupant away from the rounded outer corners; the painted bars stay in front. */
export const PENCILCASE_WINDOW: PictureWindow = {
  frame: { width: 744, height: 440 },
  window: { x: 122, y: 115, width: 435, height: 217 },
  inset: 8,
};

/** Every pixel in this common rectangle is transparent in both registered
 * locker states. Source proof: docs/art/ch01-story-gamepass/devices-photo. */
export const DEVICE_WINDOW: PictureWindow = {
  frame: { width: 820, height: 736 },
  window: { x: 158, y: 149, width: 239, height: 405 },
  inset: 6,
};

/** The dedicated photo-cage states share one photographed content size and
 * the same original floor y730. Source halves are cropped at y180, not repainted. */
export const CLASS_PHOTO_WINDOW: PictureWindow = {
  frame: { width: 768, height: 674 },
  window: { x: 157, y: 155, width: 442, height: 316 },
  inset: 6,
};
export const CLASS_PHOTO_OPEN_WINDOW: PictureWindow = {
  ...CLASS_PHOTO_WINDOW,
  window: { ...CLASS_PHOTO_WINDOW.window, x: 86 },
};
export const CLASS_PHOTO_ORIGIN = {
  closed: { x: 378 / 768, y: 550 / 674 },
  open: { x: 307 / 768, y: 550 / 674 },
} as const;

function innerWindow(registration: PictureWindow, inset: number): PictureRect {
  const { frame, window: w } = registration;
  if (![frame.width, frame.height, w.x, w.y, w.width, w.height, inset].every(Number.isFinite)
    || frame.width <= 0 || frame.height <= 0 || w.x < 0 || w.y < 0
    || inset < 0 || w.width <= 2 * inset || w.height <= 2 * inset
    || w.x + w.width > frame.width || w.y + w.height > frame.height) {
    throw new RangeError("Picture window must fit its frame and retain a positive inset area");
  }
  return { x: w.x + inset, y: w.y + inset, width: w.width - 2 * inset, height: w.height - 2 * inset };
}

/** Fit the complete image proportionally, bottom-centred inside the opening.
 * All returned dimensions use the shell PNG's pixel coordinates. */
export function containInPictureWindow(
  registration: PictureWindow,
  content: Readonly<{ width: number; height: number }>,
  inset = registration.inset,
): PictureRect {
  if (![content.width, content.height].every(n => Number.isFinite(n) && n > 0)) {
    throw new RangeError("Picture content must have finite positive dimensions");
  }
  const inner = innerWindow(registration, inset);
  const scale = Math.min(inner.width / content.width, inner.height / content.height);
  const width = content.width * scale, height = content.height * scale;
  return { x: inner.x + (inner.width - width) / 2, y: inner.y + inner.height - height, width, height };
}

/** CSS percentages relative to the actual shell image, never its card. */
export function pictureWindowPercent(registration: PictureWindow): PictureRect {
  const inner = innerWindow(registration, registration.inset);
  return {
    x: 100 * inner.x / registration.frame.width,
    y: 100 * inner.y / registration.frame.height,
    width: 100 * inner.width / registration.frame.width,
    height: 100 * inner.height / registration.frame.height,
  };
}
