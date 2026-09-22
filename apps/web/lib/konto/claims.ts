/**
 * dach-018 · WHAT konto SAYS ABOUT A PERSON, and the two calls that ask.
 *
 * Shapes measured against konto main 146265f (lib/claims.ts, README section
 * "Schnittstellen (für die Adapter)"), not copied from the spec — where the two
 * disagreed, the code won (nachtrag N-16 says so in as many words).
 *
 * A student claim deliberately carries NO first name, last name, catalogue
 * number or name source (DATEN-7 I-6): DomiGo learns a nickname and a class,
 * and nothing that could name a child to another child.
 *
 * Edge-safe: `fetch` and strings only — auth.ts imports this, middleware.ts
 * imports auth.ts, and middleware runs on the Edge.
 */
import { kontoBaseUrl } from "./basis.ts";

/** The app's own name in the roof's vocabulary. Never anything else. */
export const APP = "go" as const;

export type KontoRole = {
  area: "srdp" | "go" | "tracker" | "konto";
  role: "student" | "teacher" | "admin" | "master";
};

export type KontoClass = {
  id: string;
  term_id: string;
  name: string;
  jahrgang: number | null;
  term_started_at: string;
  fach: string;
  own: boolean;
  grant_id?: string;
  /** DomiGo's own `classes.id` for this group — null until the bridge exists. */
  app_class_id: string | null;
};

type Base = {
  sub: string;
  display: string;
  sid: string;
  acting_for: string | null;
  roles: KontoRole[];
  scope: { school_year: string; classes: KontoClass[] };
  features: { master_view: boolean; editor: boolean };
  app_user_id: string | null;
  issued_at: string;
  expires_at: string;
};

export type TeacherClaims = Base & { kind: "teacher"; "kürzel": string };
export type StudentClaims = Base & { kind: "student"; nick: string };
export type Claims = TeacherClaims | StudentClaims;

/** The secret this app presents to konto. Fail-closed: too short is no secret. */
const SECRET_MIN = 24;

function appSecret(): string | null {
  const s = (process.env.KONTO_APP_SECRET ?? "").trim();
  return s.length >= SECRET_MIN ? s : null;
}

function istClaims(v: unknown): v is Claims {
  if (!v || typeof v !== "object") return false;
  const c = v as Partial<Claims>;
  return (
    typeof c.sub === "string" &&
    typeof c.sid === "string" &&
    (c.kind === "teacher" || c.kind === "student") &&
    Array.isArray(c.roles) &&
    !!c.scope &&
    Array.isArray(c.scope.classes)
  );
}

/**
 * Trade the one-time handoff token for the claims (SPEC §4.4), server to
 * server. konto answers 400 broken · 401 wrong secret · 403 other app ·
 * 409 already spent or expired. Every one of them is `null` here: the
 * caller may not learn which, and no token is ever logged.
 */
export async function exchangeHandoff(token: string): Promise<Claims | null> {
  const secret = appSecret();
  if (!secret) {
    console.error("[konto] KONTO_APP_SECRET missing or too short — no sign-in through konto");
    return null;
  }
  if (!token || token.length > 4096) return null;
  try {
    const res = await fetch(`${kontoBaseUrl()}/api/handoff/exchange`, {
      method: "POST",
      headers: { authorization: `Bearer ${secret}`, "content-type": "application/json" },
      body: JSON.stringify({ token }),
      cache: "no-store",
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) {
      console.error(`[konto] handoff refused (${res.status})`);
      return null;
    }
    const body: unknown = await res.json();
    return istClaims(body) ? body : null;
  } catch {
    console.error("[konto] handoff exchange unreachable");
    return null;
  }
}

export type ClaimsAbruf =
  | { status: "ok"; claims: Claims }
  | { status: "revoked" }
  | { status: "unreachable" };

/**
 * The 60-second question (SPEC §4.6): is this konto session still alive, and
 * what may it see now? A revoked session and a refused call end the local
 * session; an unreachable konto does NOT — a network hiccup must not sign a
 * whole class out mid-lesson, and the session dies at its own 30-day clock
 * anyway.
 */
export async function fetchClaims(sid: string): Promise<ClaimsAbruf> {
  const secret = appSecret();
  if (!secret) return { status: "revoked" };
  try {
    const u = new URL(`${kontoBaseUrl()}/api/claims`);
    u.searchParams.set("sid", sid);
    const res = await fetch(u, {
      headers: { authorization: `Bearer ${secret}` },
      cache: "no-store",
      signal: AbortSignal.timeout(5000),
    });
    if (res.status === 401 || res.status === 403) return { status: "revoked" };
    if (!res.ok) return { status: "unreachable" };
    const body: unknown = await res.json();
    if (body && typeof body === "object" && (body as { status?: unknown }).status === "revoked") {
      return { status: "revoked" };
    }
    return istClaims(body) ? { status: "ok", claims: body } : { status: "unreachable" };
  } catch {
    return { status: "unreachable" };
  }
}

/**
 * Tell konto which local user this account became (SPEC §4.5). 201 new, 200
 * already so, 409 linked to someone else — the last one is a real conflict and
 * is reported, because it means two local users claim one account.
 */
export async function meldeAppLink(sub: string, appUserId: string): Promise<boolean> {
  const secret = appSecret();
  if (!secret) return false;
  try {
    const res = await fetch(`${kontoBaseUrl()}/api/app-links`, {
      method: "POST",
      headers: { authorization: `Bearer ${secret}`, "content-type": "application/json" },
      body: JSON.stringify({ sub, app_user_id: appUserId }),
      cache: "no-store",
      signal: AbortSignal.timeout(8000),
    });
    if (res.status === 409) console.error("[konto] app-link conflict — this account is already linked to another DomiGo user");
    return res.ok;
  } catch {
    console.error("[konto] app-link unreachable");
    return false;
  }
}

/** Does this person hold the role DomiGo's teacher surface requires (L2)? */
export function istLehrkraftFuerGo(claims: Claims): boolean {
  return claims.roles.some((r) => r.area === APP && r.role === "teacher");
}

/** The class ids DomiGo knows, in konto's order. Groups without a bridge drop out. */
export function appClassIds(claims: Claims): string[] {
  return claims.scope.classes.map((c) => c.app_class_id).filter((id): id is string => typeof id === "string" && id.length > 0);
}

// ── dach-123 · K6-Go: die Klassenliste der Lehrkraft, zur ANZEIGE ────────────

/**
 * One child as konto names it on the class list. Exactly five fields — what the
 * roof sends beyond them never reaches DomiGo (see `projiziereKinder`).
 * `app_user_id` is set only for `angekommen`, and then it IS the local user id.
 */
export type KontoKind = {
  platz: number | null;
  last_name: string;
  first_name: string;
  status: "offen" | "name_gewaehlt" | "angekommen";
  app_user_id: string | null;
};

/** Never an exception: every refusal has a name the pages can render a sentence for. */
export type KlassenlisteErgebnis =
  | { ok: true; namenGesperrt: boolean; kinder: KontoKind[] }
  | { ok: false; grund: "unreachable" | "refused" | "unknown-class" };

const STATUS = new Set(["offen", "name_gewaehlt", "angekommen"]);

/**
 * Field by field, never by spread: a new field at konto must be classified here
 * before it can reach a page. A child without a valid status or without both
 * name strings is dropped rather than half-built.
 */
function projiziereKinder(roh: unknown): KontoKind[] {
  if (!Array.isArray(roh)) return [];
  const out: KontoKind[] = [];
  for (const k of roh) {
    if (!k || typeof k !== "object") continue;
    const q = k as Record<string, unknown>;
    if (typeof q.status !== "string" || !STATUS.has(q.status)) continue;
    if (typeof q.last_name !== "string" || typeof q.first_name !== "string") continue;
    out.push({
      platz: typeof q.platz === "number" && Number.isInteger(q.platz) ? q.platz : null,
      last_name: q.last_name,
      first_name: q.first_name,
      status: q.status as KontoKind["status"],
      app_user_id: typeof q.app_user_id === "string" && q.app_user_id.length > 0 ? q.app_user_id : null,
    });
  }
  return out;
}

/**
 * The class list of ONE class, asked in the name of the person who is looking
 * right now (dach-123 · E1). konto decides for itself who may see a list —
 * owner, head teacher, co-teacher, grant — and writes the TRUE caller into its
 * own log; asking with the owner's id would be lying to the roof. That is why
 * the first argument is the acting teacher OBJECT and never a loose id.
 *
 * POST, not GET: no identifier belongs in an address and therefore in an
 * access log. Nothing here is stored, cached or logged — not even a status:
 * a rule without exceptions is one a gate can prove (E6), so this function is
 * the one in this file that never writes a console line.
 */
export async function holeKlassenliste(
  schauende: { userId: string },
  appClassId: string,
): Promise<KlassenlisteErgebnis> {
  const secret = appSecret();
  if (!secret) return { ok: false, grund: "unreachable" };
  if (!schauende.userId || !appClassId) return { ok: false, grund: "unreachable" };
  try {
    const res = await fetch(`${kontoBaseUrl()}/api/app-roster`, {
      method: "POST",
      headers: { authorization: `Bearer ${secret}`, "content-type": "application/json" },
      body: JSON.stringify({ app_class_id: appClassId, app_user_id: schauende.userId }),
      cache: "no-store",
      signal: AbortSignal.timeout(5000),
    });
    if (res.status === 404) return { ok: false, grund: "unknown-class" };
    if (res.status === 401 || res.status === 403) return { ok: false, grund: "refused" };
    if (res.status !== 200) return { ok: false, grund: "unreachable" };
    const body = (await res.json()) as unknown;
    if (!body || typeof body !== "object") return { ok: false, grund: "unreachable" };
    const b = body as Record<string, unknown>;
    return { ok: true, namenGesperrt: b.namen_gesperrt === true, kinder: projiziereKinder(b.kinder) };
  } catch {
    return { ok: false, grund: "unreachable" };
  }
}
