/**
 * K2b · THE OPS SURFACE, proved without a database (node --test, like
 * lib/grandmaster.test.ts — apps/web has no vitest).
 *
 * This file is the reason lib/ops.ts is pure. The /api/ops/session-link route is
 * UNAUTHENTICATED by construction: the signed token is the credential, so it
 * travels in a URL. Every weakness there is a sign-in weakness, which makes each
 * gate below a security property rather than a convenience — and each one is
 * asserted separately here even though the route collapses them all into one 401.
 *
 * Each group carries its own counter-tamper: an assertion that a NAMED weakening
 * of the code under test would make red. A gate nobody has watched fail has not
 * been shown to work.
 */
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  OPS_DEFAULT_LANDING,
  OPS_SESSION_LINK_TTL_MS,
  OPS_TOKEN_MIN_LENGTH,
  generateSessionLinkNonce,
  generateTestPin,
  hashSessionLinkNonce,
  isOpsAuthorized,
  isSameOriginRedirect,
  mintOpsSessionLinkToken,
  opsClassCode,
  opsLandingFor,
  opsLinkUseRow,
  opsUnauthorized,
  parseOpsNickname,
  parseOpsSessionLinkToken,
  parseOpsStudentAction,
  safeOpsRedirectTarget,
  type OpsSessionLinkPayload,
} from "./ops.ts";

const SECRET = "devtoken-mindestens-24-zeichen-lang"; // 35 chars, fictional
const SHORT = "kurz-nur-23-zeichen-abc"; // 23 chars — one below the floor
const STUDENT = "3f4a9c21-6b7d-4e58-9a10-2c5e8f7b3d64";
const NOW = 1_770_000_000_000; // a fixed clock: these tests own their time

function payload(over: Partial<OpsSessionLinkPayload> = {}): OpsSessionLinkPayload {
  return { v: 1, userId: STUDENT, exp: NOW + OPS_SESSION_LINK_TTL_MS, nonce: "a".repeat(32), ...over };
}

describe("gate 1 — the bearer token", () => {
  it("refuses when the variable is unset: no secret, no surface", () => {
    assert.equal(isOpsAuthorized(`Bearer ${SECRET}`, undefined), false);
    assert.equal(isOpsAuthorized(`Bearer ${SECRET}`, ""), false);
  });

  it("refuses a secret BELOW the floor even when the header matches it exactly", () => {
    // The weak-secret floor is the point of this case: a 23-character token that
    // WORKS would be worse than no surface at all, because it would look guarded.
    assert.equal(SHORT.length, OPS_TOKEN_MIN_LENGTH - 1);
    assert.equal(isOpsAuthorized(`Bearer ${SHORT}`, SHORT), false);
  });

  it("accepts exactly `Bearer <token>` and nothing else", () => {
    assert.equal(isOpsAuthorized(`Bearer ${SECRET}`, SECRET), true);
    assert.equal(isOpsAuthorized(SECRET, SECRET), false); // no scheme
    assert.equal(isOpsAuthorized(`bearer ${SECRET}`, SECRET), false); // wrong case
    assert.equal(isOpsAuthorized("Bearer ", SECRET), false); // empty value
    assert.equal(isOpsAuthorized(null, SECRET), false);
    assert.equal(isOpsAuthorized(undefined, SECRET), false);
  });

  it("refuses a wrong token, and a right token with something appended", () => {
    assert.equal(isOpsAuthorized(`Bearer ${SECRET}x`, SECRET), false);
    assert.equal(isOpsAuthorized(`Bearer ${SECRET.slice(0, -1)}`, SECRET), false);
    assert.equal(isOpsAuthorized("Bearer voellig-anderer-wert-mit-24-zeichen", SECRET), false);
  });

  it("TAMPER: a prefix comparison instead of a full one would pass this", () => {
    // If equalsConstantTime were replaced by `presented.startsWith(envToken)`,
    // the first assertion here would go green. It must stay red.
    assert.equal(isOpsAuthorized(`Bearer ${SECRET}-und-noch-was`, SECRET), false);
  });

  it("every refusal has ONE body and ONE status", async () => {
    const a = opsUnauthorized();
    const b = opsUnauthorized();
    assert.equal(a.status, 401);
    assert.equal(b.status, 401);
    assert.deepEqual(await a.json(), await b.json());
  });
});

describe("gate 2 — the class scope is configured, never guessed", () => {
  it("falls back to the standing production test class when unset", () => {
    const before = process.env.OPS_CLASS_CODE;
    delete process.env.OPS_CLASS_CODE;
    assert.equal(opsClassCode(), "75YAHV");
    process.env.OPS_CLASS_CODE = "TST2ER";
    assert.equal(opsClassCode(), "TST2ER");
    if (before === undefined) delete process.env.OPS_CLASS_CODE;
    else process.env.OPS_CLASS_CODE = before;
  });
});

describe("gate 3 — the signed link: mint and verify", () => {
  it("round-trips a freshly minted token", async () => {
    const token = await mintOpsSessionLinkToken(payload(), SECRET);
    assert.notEqual(token, null);
    const parsed = await parseOpsSessionLinkToken(token, SECRET, NOW);
    assert.equal(parsed.ok, true);
    assert.deepEqual(parsed.ok && parsed.payload, payload());
  });

  it("mints nothing without a secret at or above the floor", async () => {
    assert.equal(await mintOpsSessionLinkToken(payload(), undefined), null);
    assert.equal(await mintOpsSessionLinkToken(payload(), SHORT), null);
  });

  it("refuses to verify without a secret at or above the floor", async () => {
    const token = await mintOpsSessionLinkToken(payload(), SECRET);
    assert.deepEqual(await parseOpsSessionLinkToken(token, undefined, NOW), { ok: false, reason: "no-secret" });
    assert.deepEqual(await parseOpsSessionLinkToken(token, SHORT, NOW), { ok: false, reason: "no-secret" });
  });

  it("refuses a token signed with a DIFFERENT secret — rotation kills every link", async () => {
    const token = await mintOpsSessionLinkToken(payload(), SECRET);
    const other = await parseOpsSessionLinkToken(token, "ein-ganz-anderes-geheimnis-1234", NOW);
    assert.deepEqual(other, { ok: false, reason: "bad-signature" });
  });

  it("refuses a tampered payload — the signature is checked BEFORE the payload is trusted", async () => {
    const token = (await mintOpsSessionLinkToken(payload(), SECRET))!;
    const [body, sig] = token.split(".");
    const forged = Buffer.from(JSON.stringify(payload({ userId: "00000000-0000-4000-8000-000000000000" })), "utf8")
      .toString("base64url");
    assert.deepEqual(await parseOpsSessionLinkToken(`${forged}.${sig}`, SECRET, NOW), { ok: false, reason: "bad-signature" });
    assert.deepEqual(await parseOpsSessionLinkToken(`${body}.${sig.slice(0, -2)}xy`, SECRET, NOW), { ok: false, reason: "bad-signature" });
  });

  it("refuses a FOREIGN version — a v2 can never be read as a v1", async () => {
    const token = await mintOpsSessionLinkToken({ ...payload(), v: 2 } as unknown as OpsSessionLinkPayload, SECRET);
    // Correctly signed, and still refused: the marker is inside the signature.
    assert.deepEqual(await parseOpsSessionLinkToken(token, SECRET, NOW), { ok: false, reason: "malformed" });
  });

  it("refuses malformed shapes, each for its own reason", async () => {
    for (const raw of ["", "   ", "keinpunkt", ".sig", "body.", "a.b.c"]) {
      assert.deepEqual(await parseOpsSessionLinkToken(raw, SECRET, NOW), { ok: false, reason: "malformed" }, raw);
    }
    for (const bad of [{ userId: "kein-uuid" }, { nonce: "zu-kurz" }, { exp: Number.NaN }]) {
      const token = await mintOpsSessionLinkToken(payload(bad as Partial<OpsSessionLinkPayload>), SECRET);
      assert.deepEqual(await parseOpsSessionLinkToken(token, SECRET, NOW), { ok: false, reason: "malformed" }, JSON.stringify(bad));
    }
  });

  it("refuses an EXPIRED link — the floor", async () => {
    const token = await mintOpsSessionLinkToken(payload({ exp: NOW - 1 }), SECRET);
    assert.deepEqual(await parseOpsSessionLinkToken(token, SECRET, NOW), { ok: false, reason: "expired" });
  });

  it("refuses a FAR-FUTURE link — the ceiling, without which `short-lived` is only a property of the minting side", async () => {
    // A decade-long link, correctly signed. Anything able to sign a payload could
    // mint one; the verifier is where that has to die.
    const decade = await mintOpsSessionLinkToken(payload({ exp: NOW + 10 * 365 * 24 * 3600 * 1000 }), SECRET);
    assert.deepEqual(await parseOpsSessionLinkToken(decade, SECRET, NOW), { ok: false, reason: "far-future" });
  });

  it("TAMPER: the ceiling has a NAMED slack minute, and one second past it is refused", async () => {
    const inside = await mintOpsSessionLinkToken(payload({ exp: NOW + OPS_SESSION_LINK_TTL_MS + 59_000 }), SECRET);
    assert.equal((await parseOpsSessionLinkToken(inside, SECRET, NOW)).ok, true);
    const outside = await mintOpsSessionLinkToken(payload({ exp: NOW + OPS_SESSION_LINK_TTL_MS + 61_000 }), SECRET);
    assert.deepEqual(await parseOpsSessionLinkToken(outside, SECRET, NOW), { ok: false, reason: "far-future" });
  });

  it("two links minted in the same millisecond differ", async () => {
    const a = await mintOpsSessionLinkToken(payload({ nonce: generateSessionLinkNonce() }), SECRET);
    const b = await mintOpsSessionLinkToken(payload({ nonce: generateSessionLinkNonce() }), SECRET);
    assert.notEqual(a, b);
  });
});

describe("gate 3b — the register row stores a HASH, never the nonce", () => {
  it("hashes with domain separation and is stable", async () => {
    const nonce = "b".repeat(32);
    const once = await hashSessionLinkNonce(nonce);
    assert.equal(once, await hashSessionLinkNonce(nonce));
    assert.match(once, /^[0-9a-f]{64}$/);
    // Domain separation: the same bytes hashed as a reset token must not collide.
    const plain = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(nonce));
    const plainHex = [...new Uint8Array(plain)].map((b) => b.toString(16).padStart(2, "0")).join("");
    assert.notEqual(once, plainHex);
  });

  it("the row a redeemed link claims carries the hash, the id and the token's own expiry", async () => {
    const p = payload();
    const row = await opsLinkUseRow(p);
    assert.equal(row.nonceHash, await hashSessionLinkNonce(p.nonce));
    assert.equal(row.userId, STUDENT);
    assert.equal(row.expiresAt.getTime(), p.exp);
    // TAMPER: a register that stored the nonce itself would read back as live
    // token material. The hash must not contain it.
    assert.equal(row.nonceHash.includes(p.nonce), false);
  });

  it("a nonce carries 128 bits", () => {
    const n = generateSessionLinkNonce();
    assert.match(n, /^[0-9a-f]{32}$/);
    assert.notEqual(n, generateSessionLinkNonce());
  });
});

describe("the redirect clamp — an open redirector that also mints a session is an account takeover", () => {
  it("refuses the TAB escape that the URL parser strips before parsing", () => {
    // This is the whole reason the rule is not a one-line startsWith: the WHATWG
    // parser removes TAB/LF/CR, so "/<TAB>/evil" becomes "//evil" — protocol-
    // relative, i.e. off-site — AFTER any prefix check has already passed it.
    assert.equal(safeOpsRedirectTarget("/\t/evil.example"), "/");
    assert.equal(safeOpsRedirectTarget("/\n/evil.example"), "/");
    assert.equal(safeOpsRedirectTarget("/\r/evil.example"), "/");
    // And the proof that the escape is real, not theoretical:
    assert.equal(new URL("/\t/evil.example", "https://domigo.example").origin, "https://evil.example");
  });

  it("refuses protocol-relative, backslash and absolute targets", () => {
    for (const bad of ["//evil.example", "/\\evil.example", "\\\\evil.example", "https://fremd.example", "http://fremd.example", "javascript:alert(1)", "evil.example"]) {
      assert.equal(safeOpsRedirectTarget(bad), "/", bad);
    }
  });

  it("lets an ordinary same-site path through untouched", () => {
    assert.equal(safeOpsRedirectTarget("/learn/g2"), "/learn/g2");
    assert.equal(safeOpsRedirectTarget("/practice?unit=3"), "/practice?unit=3");
  });

  it("a refused or absent target lands on /home, never on the signed-out page", () => {
    assert.equal(opsLandingFor(null), OPS_DEFAULT_LANDING);
    assert.equal(opsLandingFor(""), OPS_DEFAULT_LANDING);
    assert.equal(opsLandingFor("https://fremd.example"), OPS_DEFAULT_LANDING);
    assert.equal(opsLandingFor("/learn/g2"), "/learn/g2");
  });

  it("the parser is asked as well as the character rules — belt and braces", () => {
    const origin = "https://domigo-v2.vercel.app";
    assert.equal(isSameOriginRedirect("/home", origin), true);
    assert.equal(isSameOriginRedirect("https://fremd.example/home", origin), false);
    assert.equal(isSameOriginRedirect("//fremd.example", origin), false);
  });
});

describe("the POST body", () => {
  it("treats an absent action as create, and an unknown one as a named 400", () => {
    assert.deepEqual(parseOpsStudentAction(undefined), { ok: true, action: "create" });
    assert.deepEqual(parseOpsStudentAction(null), { ok: true, action: "create" });
    assert.deepEqual(parseOpsStudentAction(""), { ok: true, action: "create" });
    assert.deepEqual(parseOpsStudentAction(" Create "), { ok: true, action: "create" });
    assert.deepEqual(parseOpsStudentAction("session-link"), { ok: true, action: "session-link" });
    const typo = parseOpsStudentAction("sesion-link");
    assert.equal(typo.ok, false);
    // TAMPER: a silent fall-through to create would leave a stray identity behind
    // on every typo. The error must NAME the value it refused.
    assert.equal(!typo.ok && typo.error.includes("sesion-link"), true);
    assert.equal(parseOpsStudentAction(7).ok, false);
  });

  it("bounds the nickname the way the join form does", () => {
    assert.deepEqual(parseOpsNickname("  Pelle  "), { ok: true, nickname: "Pelle" });
    assert.equal(parseOpsNickname("a").ok, false);
    assert.equal(parseOpsNickname("x".repeat(33)).ok, false);
    assert.equal(parseOpsNickname(undefined).ok, false);
    assert.equal(parseOpsNickname(42).ok, false);
  });
});

describe("the provisioned PIN", () => {
  it("is six digits, leading zeros allowed, and varies", () => {
    const seen = new Set<string>();
    for (let i = 0; i < 200; i += 1) {
      const pin = generateTestPin();
      assert.match(pin, /^[0-9]{6}$/);
      seen.add(pin);
    }
    // 200 draws from a million values collide vanishingly rarely; a constant
    // generator would collapse this to 1.
    assert.equal(seen.size > 190, true);
  });
});
