/**
 * dach-018 · A STAND-IN FOR konto, for the gates only.
 *
 * It mints its own Ed25519 key pair and speaks the six calls the adapter makes
 * or receives, in the shapes measured against konto main 146265f. It is NOT a
 * second implementation of konto: it answers, it does not decide. Anything the
 * real service would judge (is this account allowed, is this code archived) is
 * scripted by the test that uses it.
 *
 * Never imported by application code — nothing under app/ reaches it, so it is
 * not in any bundle.
 */
import { createLocalJWKSet, exportJWK, generateKeyPair, SignJWT, type JWK, type KeyObject } from "jose";

export const TYP = {
  handoff: "konto-handoff+jwt",
  app: "konto-app+jwt",
} as const;

export type StubSchluessel = {
  kid: string;
  privat: KeyObject | CryptoKey;
  jwks: { keys: JWK[] };
  /** Hand this to _setJwksFuerTest so lib/konto/jwt.ts verifies against the stub. */
  keySet: ReturnType<typeof createLocalJWKSet>;
};

export async function neueSchluessel(kid = "stub-1"): Promise<StubSchluessel> {
  const { privateKey, publicKey } = await generateKeyPair("EdDSA", { crv: "Ed25519", extractable: true });
  const jwk = await exportJWK(publicKey);
  const keys = [{ ...jwk, kid, alg: "EdDSA", use: "sig" }];
  return { kid, privat: privateKey, jwks: { keys }, keySet: createLocalJWKSet({ keys }) };
}

type SignOpts = { typ: string; laufzeitS?: number; jetzt?: Date };

async function sign(k: StubSchluessel, nutzlast: Record<string, unknown>, o: SignOpts): Promise<string> {
  const jetzt = o.jetzt ?? new Date();
  const iat = Math.floor(jetzt.getTime() / 1000);
  return new SignJWT(nutzlast)
    .setProtectedHeader({ alg: "EdDSA", kid: k.kid, typ: o.typ })
    .setIssuedAt(iat)
    .setExpirationTime(iat + (o.laufzeitS ?? 60))
    .sign(k.privat as Parameters<SignJWT["sign"]>[0]);
}

let jtiZaehler = 0;
const neueJti = () => `stubjti${String(++jtiZaehler).padStart(8, "0")}`;

/** konto -> app: the sign-out back-channel. Signs {sid}, nothing else. */
export function signLogout(k: StubSchluessel, sid: string, o: Partial<SignOpts> = {}) {
  return sign(k, { sid, aud: "go", jti: neueJti() }, { typ: TYP.app, ...o });
}

/** konto -> app: a push. Signs {kind, body_sha256} over the exact body bytes. */
export async function signPush(k: StubSchluessel, art: string, koerper: string, o: Partial<SignOpts> = {}) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(koerper));
  const hex = [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join("");
  return sign(k, { kind: art, body_sha256: hex, aud: "go", jti: neueJti() }, { typ: TYP.app, ...o });
}

/** konto -> browser: the one-time handoff token in the redirect. */
export function signHandoff(k: StubSchluessel, sub: string, sid: string, o: Partial<SignOpts> = {}) {
  return sign(k, { sub, app: "go", sid, jti: neueJti() }, { typ: TYP.handoff, ...o });
}

// ── The HTTP side: a fetch the adapter can be handed instead of the real one ──

export type StubKonto = {
  /** Claims answered per handoff token, and per sid on the 60-second question. */
  claims: Map<string, unknown>;
  /** Handoff tokens already spent — a second exchange answers 409, like konto. */
  verbraucht: Set<string>;
  /** Sessions the test has revoked. */
  widerrufen: Set<string>;
  /**
   * Every call the adapter made, for counting (»app-links exactly once«).
   * `pfad` and `koerper` are load-bearing for anmeldung.test.ts and stay as they
   * are; dach-123 ADDED `methode` and `cache`, because a class list fetched with
   * the wrong verb or with a cache would break a promise no body can show.
   */
  rufe: { pfad: string; koerper: unknown; methode: string; cache: string }[];
  /**
   * dach-123 · what `/api/app-roster` answers, settable per test. `roh` wins
   * over `body` and is sent verbatim — that is how a broken-JSON answer is made.
   */
  rosterAntwort: { status: number; body?: unknown; roh?: string };
  secret: string;
  fetch: typeof fetch;
};

export function neuerStub(secret = "stub-secret-mindestens-24-zeichen"): StubKonto {
  const s: StubKonto = {
    claims: new Map(),
    verbraucht: new Set(),
    widerrufen: new Set(),
    rufe: [],
    rosterAntwort: { status: 200, body: { namen_gesperrt: false, kinder: [] } },
    secret,
    fetch: (() => {}) as unknown as typeof fetch,
  };

  s.fetch = (async (eingabe: RequestInfo | URL, init?: RequestInit) => {
    const url = new URL(typeof eingabe === "string" ? eingabe : eingabe instanceof URL ? eingabe.href : eingabe.url);
    const pfad = url.pathname;
    const auth = new Headers(init?.headers).get("authorization");
    const koerper = init?.body ? JSON.parse(String(init.body)) : null;
    s.rufe.push({ pfad, koerper, methode: String(init?.method ?? "GET"), cache: String(init?.cache ?? "") });

    const json = (b: unknown, status = 200) => new Response(JSON.stringify(b), { status, headers: { "content-type": "application/json" } });
    if (auth !== `Bearer ${s.secret}`) return json({ error: "app secret" }, 401);

    if (pfad === "/api/handoff/exchange") {
      const token = String(koerper?.token ?? "");
      if (s.verbraucht.has(token)) {
        // 409 MIT wohlgeformtem Koerper: so wie ein fehlerhaftes (oder
        // feindseliges) konto antworten koennte. Wer hier nur die FORM prueft
        // und nicht den STATUS, laesst eine zweite Einloesung durch — genau das
        // misst test:konto-handoff.
        return json(s.claims.get(token) ?? { error: "consumed" }, 409);
      }
      const c = s.claims.get(token);
      if (!c) return json({ error: "unknown" }, 409);
      s.verbraucht.add(token);
      return json(c);
    }
    if (pfad === "/api/claims") {
      const sid = url.searchParams.get("sid") ?? "";
      if (s.widerrufen.has(sid)) return json({ status: "revoked" });
      const c = s.claims.get(`sid:${sid}`);
      return c ? json(c) : json({ status: "revoked" });
    }
    if (pfad === "/api/app-roster") {
      const a = s.rosterAntwort;
      if (typeof a.roh === "string") return new Response(a.roh, { status: a.status, headers: { "content-type": "application/json" } });
      return json(a.body, a.status);
    }
    if (pfad === "/api/app-links") return json({ ok: true }, 201);
    if (pfad === "/api/app-class-links") return json({ ok: true }, 201);
    if (pfad.startsWith("/api/import/")) return json({ ergebnis: [] }, 201);
    if (pfad === "/api/class-terms") return json({ class_terms: [] });
    return json({ error: "no such path" }, 404);
  }) as typeof fetch;

  return s;
}
