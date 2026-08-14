import crypto from "node:crypto";
import fs from "node:fs";

/**
 * R5-W3 · E5 · THE CACHE KEY IS THE FILE — for ALL the art, not just the book.
 *
 * `next.config.ts` serves every `/art/*` URL with `Cache-Control: immutable,
 * max-age=31536000`. That promise is only safe if a repainted file arrives under
 * a NEW address; otherwise a child who once loaded the old picture keeps it for
 * a year and never sees the new one.
 *
 * E4 fixed exactly this for the painted book (`paint-art.ts`), and the fix was
 * right — but it lived inside that one resolver, while `keen-art.ts`,
 * `tile-art.ts` and `story-art.ts` kept emitting bare URLs for another 66 MB of
 * pictures under the same immutable header. Same defect class, three files
 * further along. So the helper moved here and they all use it.
 *
 * The stamp is the file's own content hash, so a merge that repaints three
 * pictures reissues three addresses and not three hundred (that was E4's other
 * finding: `?v=<commit sha>` threw the whole cache away on every deploy, and
 * Koki plays right after every merge, so he structurally never had a warm one).
 *
 * Cost: one sha1 per file, once per server instance, at the resolver's own
 * cache-fill. Measured for the book: 228 ms for 118 MB.
 */
const VERSION = process.env.VERCEL_GIT_COMMIT_SHA ?? "";

/** Content hash of a file, falling back to the build's commit if it cannot be read. */
export const fingerprint = (abs: string): string => {
  try {
    return crypto.createHash("sha1").update(fs.readFileSync(abs)).digest("hex").slice(0, 8);
  } catch {
    return VERSION;
  }
};

/** `url` with this file's fingerprint appended — or unchanged if there is none. */
export const stamped = (url: string, abs: string): string => {
  const v = fingerprint(abs);
  return v ? `${url}?v=${v}` : url;
};
