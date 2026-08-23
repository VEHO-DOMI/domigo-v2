/**
 * K2b · THE OPS SURFACE — pure logic (no database, no request context).
 *
 * WHY THIS EXISTS. Every verification of this platform so far has run through
 * Koki's own hands or his browser agent, because the only way to a signed-in
 * student surface is the sign-in form, and no agent session types a PIN into a
 * form (the standing access rule, Masterblatt rule 3). SRDP solved this once:
 * a token-guarded ops namespace that provisions test students in ONE test class
 * and hands out ONE-TIME sign-in links. This file is that pattern ported —
 * lib/agent-ops.ts over there is the template, and its seven paid-for properties
 * are reproduced here rather than re-derived.
 *
 * THE TWO GATES every /api/ops/* route satisfies:
 *   1. the bearer token equals DOMIGO_OPS_TOKEN (fail closed: no variable, no
 *      surface — a deployment without the secret has no ops namespace at all);
 *   2. the operation touches ONLY the class named by OPS_CLASS_CODE. Real
 *      classes are out of REACH, not merely un-linked: the scope is a WHERE
 *      clause, so a real student's valid uuid resolves to nothing.
 *
 * ⚠ WEB-CRYPTO ONLY, AND THIS IS LOAD-BEARING. The template uses node:crypto.
 * We cannot: apps/web/middleware.ts imports @/auth, auth.ts imports THIS file
 * (for the third provider), and middleware runs on the EDGE runtime where
 * node:crypto does not exist. K2a paid for that lesson at full price — a
 * node:crypto module reached the middleware chain and 404'd every /admin route
 * while typecheck, lint and every unit test stayed green. So: crypto.subtle and
 * crypto.getRandomValues, which exist in Node AND on the Edge. The cost is that
 * signing and hashing are async, and so is the provider's authorize().
 *
 * Pure helpers live here so the battery can prove the guard without a database
 * or a request — the same split the template uses.
 */

/** The weak-secret floor. Below this the surface refuses to exist. */
export const OPS_TOKEN_MIN_LENGTH = 24;

/** Name of the variable that switches the whole namespace on. */
export const OPS_TOKEN_ENV_VAR = "DOMIGO_OPS_TOKEN";

/** How long a minted sign-in link stays valid. Short by design. */
export const OPS_SESSION_LINK_TTL_MS = 10 * 60 * 1000;

/** Where a minted link points. */
export const OPS_SESSION_LINK_PATH = "/api/ops/session-link";

/** Auth.js provider id that consumes a minted link (apps/web/auth.ts). */
export const OPS_SESSION_LINK_PROVIDER = "ops-link";

/** The invite code of the one class the ops namespace may touch.
 *  Default = TEST P on production, the standing test lane; dev points at TST2ER. */
export function opsClassCode(): string {
  return process.env.OPS_CLASS_CODE || "75YAHV";
}

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// ─── byte plumbing (no Buffer — it is not guaranteed on the Edge) ───────────

const encoder = new TextEncoder();

/** UTF-8 bytes in a plain ArrayBuffer. The copy is deliberate: TextEncoder
 *  answers with `Uint8Array<ArrayBufferLike>`, which crypto.subtle's BufferSource
 *  does not accept (it excludes SharedArrayBuffer), so the bytes are re-seated
 *  once rather than cast away at every call site. */
function bytes(text: string) {
  const encoded = encoder.encode(text);
  const out = new Uint8Array(new ArrayBuffer(encoded.byteLength));
  out.set(encoded);
  return out;
}

function base64url(input: Uint8Array): string {
  let binary = "";
  for (const b of input) binary += String.fromCharCode(b);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64url(value: string): Uint8Array | null {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized.length % 4 === 0
    ? normalized
    : normalized + "=".repeat(4 - (normalized.length % 4));
  try {
    const binary = atob(padded);
    const out = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i += 1) out[i] = binary.charCodeAt(i);
    return out;
  } catch {
    return null;
  }
}

function hex(input: Uint8Array): string {
  let out = "";
  for (const b of input) out += b.toString(16).padStart(2, "0");
  return out;
}

/**
 * Constant-time string comparison — the Web-Crypto replacement for
 * node:crypto's timingSafeEqual. Length is compared first and is NOT secret
 * here: both values compared through this function are high-entropy, so their
 * length leaks nothing a guesser can use.
 */
function equalsConstantTime(a: string, b: string): boolean {
  const ba = bytes(a);
  const bb = bytes(b);
  if (ba.length !== bb.length) return false;
  let diff = 0;
  for (let i = 0; i < ba.length; i += 1) diff |= ba[i] ^ bb[i];
  return diff === 0;
}

// ─── gate 1: the bearer token ───────────────────────────────────────────────

/**
 * Bearer-token check, fail-closed and constant-time.
 *
 * - variable unset, empty, or shorter than the floor -> ALWAYS false. A weak
 *   secret is refused rather than accepted, because a 20-character token that
 *   works is worse than a surface that does not exist.
 * - the header must be exactly `Bearer <token>`.
 */
export function isOpsAuthorized(
  authorizationHeader: string | null | undefined,
  envToken: string | undefined = process.env.DOMIGO_OPS_TOKEN,
): boolean {
  if (!envToken || envToken.length < OPS_TOKEN_MIN_LENGTH) return false;
  if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) return false;
  const presented = authorizationHeader.slice("Bearer ".length).trim();
  if (presented.length === 0) return false;
  return equalsConstantTime(presented, envToken);
}

/** The ONE 401 body. Every refusal on this namespace reads identically, so a
 *  caller learns that it was refused and never which check refused it. */
export function opsUnauthorized(): Response {
  return Response.json(
    { error: "ops: missing or invalid bearer token" },
    { status: 401 },
  );
}

// ─── test-student provisioning ──────────────────────────────────────────────

/**
 * A 6-digit PIN for a test student, leading zeros allowed (the student sign-in
 * contract). Drawn from crypto.getRandomValues with rejection sampling, so the
 * digits are uniform rather than modulo-skewed — cheap, and it means the value
 * is never the weakest thing about a test identity.
 */
export function generateTestPin(): string {
  const limit = Math.floor(0x100000000 / 1_000_000) * 1_000_000;
  const buf = new Uint32Array(1);
  let draw = limit;
  while (draw >= limit) {
    crypto.getRandomValues(buf);
    draw = buf[0];
  }
  return String(draw % 1_000_000).padStart(6, "0");
}

// ─── one-time sign-in links ─────────────────────────────────────────────────
//
// THE SECRET IS THE OPS TOKEN, deliberately. Links inherit the lifetime of the
// surface that minted them: rotating DOMIGO_OPS_TOKEN in Vercel invalidates
// every outstanding link at once, and a deployment without the secret can
// neither mint nor accept one. The payload is SIGNED, never encrypted — it
// carries no secret, only an id, a clock and a nonce.
//
// SINGLE USE lives in the register (domigo_v2.ops_link_uses, migration 0017):
// redeeming a link INSERTs the hash of its nonce, and the primary key decides
// the race. Unlike the template there is no compare-and-swap fallback, because
// DomiGo's users table carries no last_seen_at to bind against — and a test
// capability is better ABSENT in the window before the migration lands than
// present in a weaker form. That is the declared trade (packages/db/src/ops-links.ts).

/** 128 bits of link nonce. */
export function generateSessionLinkNonce(): string {
  const buf = new Uint8Array(16);
  crypto.getRandomValues(buf);
  return hex(buf);
}

/**
 * sha256 of the nonce, domain-separated so a hash computed here can never
 * collide with one computed for another purpose (the reset-token pattern).
 *
 * THE NONCE IS HASHED, NOT STORED: the register is a table of SPENT tokens, and
 * a spent-token table that read back as a list of live token material would be
 * a downgrade dressed as a hardening.
 */
export async function hashSessionLinkNonce(nonce: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", bytes(`domigo-ops-link-nonce:${nonce}`));
  return hex(new Uint8Array(digest));
}

/** Signed payload of a one-time sign-in link. */
export type OpsSessionLinkPayload = {
  /** Format marker, signed with the rest — a v2 can never be read as a v1. */
  v: 1;
  /** domigo_v2.users id of the test-class student the link signs in. */
  userId: string;
  /** Epoch ms after which the link is refused. */
  exp: number;
  /** 128 bits of randomness, and the register's key material. */
  nonce: string;
};

/** The register row a redeemed link claims — the pure projection, so the claim
 *  can be asserted without a database and the redeeming code holds no
 *  arithmetic of its own. `expiresAt` is the token's own `exp`: a row is
 *  useless once the clock would refuse the token anyway, which is what makes
 *  pruning safe. */
export type OpsLinkUseRow = {
  nonceHash: string;
  userId: string;
  expiresAt: Date;
};

export async function opsLinkUseRow(payload: OpsSessionLinkPayload): Promise<OpsLinkUseRow> {
  return {
    nonceHash: await hashSessionLinkNonce(payload.nonce),
    userId: payload.userId,
    expiresAt: new Date(payload.exp),
  };
}

async function linkSignature(payloadB64: string, secret: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    bytes(`domigo-ops-link:${secret}`),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", key, bytes(payloadB64));
  return base64url(new Uint8Array(signature));
}

/**
 * Mint a signed link token. Returns null when the secret is missing or below
 * the weak-secret floor — the surface does not exist without its token.
 */
export async function mintOpsSessionLinkToken(
  payload: OpsSessionLinkPayload,
  secret: string | undefined = process.env.DOMIGO_OPS_TOKEN,
): Promise<string | null> {
  if (!secret || secret.length < OPS_TOKEN_MIN_LENGTH) return null;
  const payloadB64 = base64url(bytes(JSON.stringify(payload)));
  return `${payloadB64}.${await linkSignature(payloadB64, secret)}`;
}

export type OpsSessionLinkParse =
  | { ok: true; payload: OpsSessionLinkPayload }
  | { ok: false; reason: "no-secret" | "malformed" | "bad-signature" | "expired" | "far-future" };

/**
 * Verify a link token's signature, shape and clock. Pure — the database-side
 * gates (class scope, the single-use register) live in apps/web/auth.ts.
 *
 * ORDER MATTERS: the signature is checked BEFORE the payload is trusted for
 * anything at all, so a forged payload never reaches JSON.parse's output. Every
 * failure carries its own reason so the battery can prove each gate separately,
 * while the route collapses them all into one 401.
 */
export async function parseOpsSessionLinkToken(
  raw: string | null | undefined,
  secret: string | undefined = process.env.DOMIGO_OPS_TOKEN,
  nowMs: number = Date.now(),
): Promise<OpsSessionLinkParse> {
  if (!secret || secret.length < OPS_TOKEN_MIN_LENGTH) return { ok: false, reason: "no-secret" };
  const token = raw?.trim() ?? "";
  if (token.length === 0) return { ok: false, reason: "malformed" };

  const dot = token.indexOf(".");
  if (dot <= 0 || dot === token.length - 1) return { ok: false, reason: "malformed" };
  if (token.indexOf(".", dot + 1) !== -1) return { ok: false, reason: "malformed" };
  const payloadB64 = token.slice(0, dot);
  const presented = token.slice(dot + 1);

  const expected = await linkSignature(payloadB64, secret);
  if (!equalsConstantTime(presented, expected)) return { ok: false, reason: "bad-signature" };

  const decoded = fromBase64url(payloadB64);
  if (decoded === null) return { ok: false, reason: "malformed" };
  let parsed: unknown;
  try {
    parsed = JSON.parse(new TextDecoder().decode(decoded));
  } catch {
    return { ok: false, reason: "malformed" };
  }
  if (parsed === null || typeof parsed !== "object" || Array.isArray(parsed)) {
    return { ok: false, reason: "malformed" };
  }
  const p = parsed as Record<string, unknown>;
  if (p.v !== 1) return { ok: false, reason: "malformed" };
  if (typeof p.userId !== "string" || !UUID_PATTERN.test(p.userId)) {
    return { ok: false, reason: "malformed" };
  }
  if (typeof p.exp !== "number" || !Number.isFinite(p.exp)) return { ok: false, reason: "malformed" };
  if (typeof p.nonce !== "string" || p.nonce.length < 16) return { ok: false, reason: "malformed" };

  if (nowMs >= p.exp) return { ok: false, reason: "expired" };
  // A CEILING as well as a floor. Without it, "short-lived" is a property of the
  // minting side only: anyone able to sign a payload could mint a decade-long
  // link and this parser would happily accept it. One slack minute absorbs clock
  // skew between the minting and the verifying instance.
  if (p.exp - nowMs > OPS_SESSION_LINK_TTL_MS + 60_000) return { ok: false, reason: "far-future" };

  return { ok: true, payload: { v: 1, userId: p.userId, exp: p.exp, nonce: p.nonce } };
}

// ─── the redirect clamp ─────────────────────────────────────────────────────

/**
 * Clamp the link's `next` parameter to a same-site path.
 *
 * An endpoint that mints a session AND forwards wherever the URL says is an
 * account-takeover primitive, and this one is unauthenticated by construction
 * (the signed token IS the credential, so the URL travels). Allowlist, not
 * blocklist: a single leading slash and nothing else.
 *
 * TAB, LF and CR are tested FIRST, and that order is the whole reason this is
 * not a one-line startsWith: the WHATWG URL parser STRIPS those three
 * characters before parsing, so "/<TAB>/evil.example" survives every prefix
 * check and is then resolved as protocol-relative — a live open redirect out of
 * a session-minting endpoint. The template shipped that bug once; it is fixed
 * here before the first deploy rather than after.
 */
export function safeOpsRedirectTarget(raw: string | null | undefined): string {
  const value = (raw ?? "").trim();
  if (value.length === 0) return "/";
  if (/[\t\n\r]/.test(value)) return "/";
  if (!value.startsWith("/")) return "/";
  if (value.startsWith("//")) return "/";
  if (value.includes("\\")) return "/";
  return value;
}

/** Where a link with no usable `next` lands. The clamp above answers "/" for
 *  everything it refuses — that is the SAFE answer, and it is the template's
 *  answer, so the rule stays comparable across the two platforms. The landing
 *  choice is a separate decision and belongs here: an ops link exists to put a
 *  session in front of a student surface, and "/" is the signed-out marketing
 *  page. So a refused or absent `next` lands on /home instead. */
export const OPS_DEFAULT_LANDING = "/home";

export function opsLandingFor(raw: string | null | undefined): string {
  const clamped = safeOpsRedirectTarget(raw);
  return clamped === "/" ? OPS_DEFAULT_LANDING : clamped;
}

/**
 * The redirect rule again, this time asked of the parser that will actually
 * resolve the URL. Belt and braces: the character rules above encode what we
 * BELIEVE about the parser; this asks it.
 */
export function isSameOriginRedirect(target: string, origin: string): boolean {
  try {
    return new URL(target, origin).origin === new URL(origin).origin;
  } catch {
    return false;
  }
}

// ─── the POST body's action discriminator ───────────────────────────────────

/**
 * Absent = the create contract, so a caller that only ever provisions students
 * writes no action at all. An UNKNOWN value is a named 400 rather than a silent
 * fall-through to creation: the callers here write curl by hand, and a typo that
 * quietly provisioned a student instead of minting a link would leave a stray
 * identity behind every single time.
 */
export function parseOpsStudentAction(
  raw: unknown,
): { ok: true; action: "create" | "session-link" } | { ok: false; error: string } {
  if (raw === undefined || raw === null) return { ok: true, action: "create" };
  if (typeof raw !== "string") return { ok: false, error: "action must be a string when present" };
  const action = raw.trim().toLowerCase();
  if (action === "" || action === "create") return { ok: true, action: "create" };
  if (action === "session-link") return { ok: true, action: "session-link" };
  return { ok: false, error: `action: unknown value "${raw}" — supported: create, session-link` };
}

/** Nickname rule for a provisioned test student, mirroring the /join form's
 *  maxLength of 32. Pure so the route holds no validation of its own. */
export function parseOpsNickname(
  raw: unknown,
): { ok: true; nickname: string } | { ok: false; error: string } {
  if (typeof raw !== "string") return { ok: false, error: "nickname required (2-32 characters)" };
  const nickname = raw.trim();
  if (nickname.length < 2 || nickname.length > 32) {
    return { ok: false, error: "nickname required (2-32 characters)" };
  }
  return { ok: true, nickname };
}
