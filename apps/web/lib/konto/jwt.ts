/**
 * dach-018 · THE DOOR konto KNOCKS ON — verifying a signed call from the
 * account service (logout back-channel §6, the pushes §4.7 / §10).
 *
 * Pattern, not copy, of domi-tracker src/lib/konto/verify.ts. What konto
 * actually signs was MEASURED against konto main 146265f, and it differs from
 * the brief in one load-bearing way:
 *
 *   · logout  (lib/logout.ts:24)            signAppJwt(app, { sid })
 *   · pushes  (lib/lehrerraum/pushes.ts:115) signAppJwt(app, { kind, body_sha256 })
 *
 * So `body_sha256` rides on the PUSHES only. The brief asks for it on the
 * logout call too; built that way, DomiGo would refuse every real sign-out
 * konto sends. Logout is therefore bound to its body the way konto allows —
 * the `sid` in the body must equal the `sid` in the token (the same binding
 * domi-tracker uses, docs/API_AUTH.md) — and the pushes are bound by
 * `kind` + `body_sha256` over the exact bytes received.
 *
 * NO REPLAY REGISTER, deliberately. domi-tracker keeps used token ids because a
 * replayed sign-in would mint a session; here the four receivers are idempotent
 * by construction — a second logout revokes nothing new, and the pushes are
 * required to be idempotent anyway (SPEC §4.7, §10.2). A register would need a
 * table, and this card may not write a migration (brief §0.2). Declared.
 *
 * Node runtime only (jose, and `req.text()` before any parse). Never import
 * this from auth.ts: that file rides into the Edge bundle through middleware.
 */
import { createRemoteJWKSet, decodeProtectedHeader, jwtVerify, type JWTPayload } from "jose";
import { APP } from "./claims.ts";
import { kontoBaseUrl } from "./basis.ts";

export const TYP_APP = "konto-app+jwt";
/** konto issues every token with exp = iat + 60 (lib/signing.ts TOKEN_TTL_SECONDS). */
export const MAX_LAUFZEIT_S = 60;
const UHR_TOLERANZ_S = 5;
const MAX_TOKEN_LAENGE = 4096;
/** Ids that end up in log lines and comparisons: no surprises, no separators. */
const SICHERE_ID = /^[A-Za-z0-9_-]{8,128}$/;
const HEX_SHA256 = /^[0-9a-f]{64}$/;

/** The kinds of push konto can send this app (konto lib/lehrerraum/pushes.ts). */
export const PUSH_ARTEN = ["class-term", "account-deleted", "classes"] as const;
export type PushArt = (typeof PUSH_ARTEN)[number];

let jwks: ReturnType<typeof createRemoteJWKSet> | null = null;

function schluessel() {
  if (!jwks) {
    jwks = createRemoteJWKSet(new URL(`${kontoBaseUrl()}/.well-known/jwks.json`), {
      timeoutDuration: 3000,
      cooldownDuration: 30_000,
      cacheMaxAge: 300_000,
    });
  }
  return jwks;
}

/** Only for the gates: point the verifier at the stub's key set. */
export function _setJwksFuerTest(set: ReturnType<typeof createRemoteJWKSet> | null): void {
  jwks = set;
}

function bearer(req: Request): string | null {
  const h = req.headers.get("authorization");
  if (!h || !h.startsWith("Bearer ")) return null;
  const t = h.slice("Bearer ".length).trim();
  return t.length > 0 && t.length <= MAX_TOKEN_LAENGE ? t : null;
}

async function pruefeBasis(token: string, now: Date): Promise<JWTPayload | null> {
  try {
    const header = decodeProtectedHeader(token);
    // `kid` first: a token that does not say which key signed it is not one of konto's.
    if (typeof header.kid !== "string" || header.kid.length === 0) return null;
    const { payload } = await jwtVerify(token, schluessel(), {
      algorithms: ["EdDSA"],
      audience: APP,
      typ: TYP_APP,
      clockTolerance: UHR_TOLERANZ_S,
      currentDate: now,
      requiredClaims: ["iat", "exp", "jti"],
    });
    // Asked again by hand: jose accepts an ARRAY that contains the audience;
    // konto sends exactly the string, and anything else is not konto.
    if (payload.aud !== APP) return null;
    const { iat, exp, jti } = payload as { iat?: unknown; exp?: unknown; jti?: unknown };
    if (typeof iat !== "number" || typeof exp !== "number") return null;
    const laufzeit = exp - iat;
    if (laufzeit <= 0 || laufzeit > MAX_LAUFZEIT_S) return null;
    if (iat > now.getTime() / 1000 + UHR_TOLERANZ_S) return null;
    if (typeof jti !== "string" || !SICHERE_ID.test(jti)) return null;
    return payload;
  } catch {
    return null;
  }
}

/** sha256 of the exact bytes received, lowercase hex. Web Crypto: no runtime lock-in. */
export async function koerperHash(roh: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(roh));
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

export type LogoutRuf = { sid: string };

/**
 * The sign-out back-channel. Bound to its body by `sid`, which is all konto
 * signs for this call. `roh` is the raw body string — read with req.text(), and
 * parsed by the caller from THOSE bytes, never a second read.
 */
export async function pruefeLogout(req: Request, roh: string, now: Date = new Date()): Promise<LogoutRuf | null> {
  const token = bearer(req);
  if (!token) return null;
  const p = await pruefeBasis(token, now);
  if (!p) return null;
  const sid = (p as { sid?: unknown }).sid;
  if (typeof sid !== "string" || !SICHERE_ID.test(sid)) return null;
  let koerper: unknown;
  try {
    koerper = JSON.parse(roh);
  } catch {
    return null;
  }
  const koerperSid = koerper && typeof koerper === "object" ? (koerper as { sid?: unknown }).sid : undefined;
  if (koerperSid !== sid) return null;
  return { sid };
}

export type PushRuf<T> = { art: PushArt; koerper: T };

/**
 * A signed push. Bound to the route by `kind` and to the bytes by
 * `body_sha256`. The hash is taken over `roh` — the string the route read —
 * so a body that changed between reading and parsing cannot slip through.
 */
export async function pruefePush<T = unknown>(
  req: Request,
  roh: string,
  art: PushArt,
  now: Date = new Date(),
): Promise<PushRuf<T> | null> {
  const token = bearer(req);
  if (!token) return null;
  const p = await pruefeBasis(token, now);
  if (!p) return null;
  const { kind, body_sha256 } = p as { kind?: unknown; body_sha256?: unknown };
  if (kind !== art) return null;
  if (typeof body_sha256 !== "string" || !HEX_SHA256.test(body_sha256)) return null;
  if ((await koerperHash(roh)) !== body_sha256) return null;
  let koerper: unknown;
  try {
    koerper = JSON.parse(roh);
  } catch {
    return null;
  }
  return { art, koerper: koerper as T };
}

/** The one refusal. A caller learns that it was refused, never which check refused it. */
export function abgewiesen(): Response {
  return Response.json({ error: "konto: missing or invalid signature" }, { status: 401 });
}
