/**
 * K2b · /api/ops/test-students — provisioning and sign-in links for the ops test class.
 *
 * POST { nickname }                     → create a test student, PIN returned ONCE
 * POST { action: "session-link", … }    → mint a short-lived, one-time sign-in URL
 * GET                                   → the roster of the ops class, and nothing else
 *
 * Both gates apply to every branch: the bearer token (DOMIGO_OPS_TOKEN) AND the
 * class scope (OPS_CLASS_CODE). Everything this route can do, it can do to one
 * class. The pure half — token check, action parser, nickname rule, link minting —
 * lives in @/lib/ops and is proved without a database in lib/ops.test.ts; the
 * queries live in @domigo/db (ops-links.ts), where the scope WHERE clause belongs.
 * This file is I/O and nothing else.
 *
 * WHY create() IS NOT THE /join FORM. It is the API twin of the same claim
 * (bcrypt-12 pinHash, per-class case-insensitive nickname uniqueness) with the PIN
 * generated server-side, because the whole point is that no human picks one and no
 * agent types one. The PIN appears in the response body EXACTLY once and is written
 * to no log: it belongs in the round's report, per the standing access rule.
 */
import { type NextRequest } from "next/server";

import {
  createOpsTestStudent,
  findOpsStudent,
  getDb,
  listOpsClassStudents,
  loadOpsClass,
} from "@domigo/db";
import {
  OPS_SESSION_LINK_PATH,
  OPS_SESSION_LINK_TTL_MS,
  generateSessionLinkNonce,
  generateTestPin,
  isOpsAuthorized,
  mintOpsSessionLinkToken,
  opsClassCode,
  opsUnauthorized,
  parseOpsNickname,
  parseOpsStudentAction,
} from "@/lib/ops";
import { hashPin } from "@/lib/pin";

export const dynamic = "force-dynamic";
export const runtime = "nodejs"; // bcryptjs is Node-only; the link crypto is not

function classMissing(): Response {
  return Response.json(
    { error: `ops: no active class with invite code "${opsClassCode()}" (OPS_CLASS_CODE)` },
    { status: 500 },
  );
}

export async function POST(req: NextRequest) {
  if (!isOpsAuthorized(req.headers.get("authorization"))) return opsUnauthorized();

  let body: unknown = null;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "body must be JSON" }, { status: 400 });
  }

  const action = parseOpsStudentAction((body as { action?: unknown })?.action);
  if (!action.ok) return Response.json({ error: action.error }, { status: 400 });
  if (action.action === "session-link") return mintSessionLink(req, body);

  const parsedNickname = parseOpsNickname((body as { nickname?: unknown })?.nickname);
  if (!parsedNickname.ok) return Response.json({ error: parsedNickname.error }, { status: 400 });
  const nickname = parsedNickname.nickname;

  const cls = await loadOpsClass(getDb(), opsClassCode());
  if (!cls) return classMissing();

  const pin = generateTestPin();
  const created = await createOpsTestStudent(getDb(), cls.id, nickname, await hashPin(pin));
  if (!created.ok) {
    return Response.json(
      { error: `nickname "${nickname}" already taken in the ops class`, id: created.id },
      { status: 409 },
    );
  }

  return Response.json({
    id: created.id,
    nickname,
    pin, // ONCE. Never logged; bank it in the round's report or it is unreachable.
    classCode: cls.inviteCode,
    signInUrl: "/signin",
  });
}

/**
 * Mint a one-time sign-in URL for ONE student of the ops class.
 *
 * Addressable by `nickname` (case-insensitive, the way the roster reads) or by
 * `id`. Anything the ops class does not contain is a 404 — INCLUDING a real
 * student's valid uuid, which is the point: the scope is a WHERE clause, not a
 * filter applied afterwards.
 */
async function mintSessionLink(req: NextRequest, body: unknown) {
  const raw = (body ?? {}) as { nickname?: unknown; id?: unknown };
  const nickname = typeof raw.nickname === "string" ? raw.nickname.trim() : "";
  const id = typeof raw.id === "string" ? raw.id.trim() : "";
  if (nickname.length === 0 && id.length === 0) {
    return Response.json(
      { error: "session-link requires nickname or id (of a student in the ops class)" },
      { status: 400 },
    );
  }

  const cls = await loadOpsClass(getDb(), opsClassCode());
  if (!cls) return classMissing();

  const student = await findOpsStudent(getDb(), cls.id, { id, nickname });
  if (!student) {
    return Response.json(
      { error: `no student ${id.length > 0 ? `"${id}"` : `"${nickname}"`} in the ops class` },
      { status: 404 },
    );
  }

  const expiresAt = Date.now() + OPS_SESSION_LINK_TTL_MS;
  const token = await mintOpsSessionLinkToken({
    v: 1,
    userId: student.id,
    exp: expiresAt,
    nonce: generateSessionLinkNonce(),
  });
  if (!token) {
    // Unreachable through the authorized path — the same variable gates both.
    // Refused rather than assumed: a link nobody can verify is worse than none.
    return Response.json({ error: "ops: link signing unavailable" }, { status: 500 });
  }

  return Response.json({
    id: student.id,
    nickname: student.displayName,
    classCode: cls.inviteCode,
    url: `${req.nextUrl.origin}${OPS_SESSION_LINK_PATH}?token=${encodeURIComponent(token)}`,
    expiresAt: new Date(expiresAt).toISOString(),
    expiresInSeconds: Math.round(OPS_SESSION_LINK_TTL_MS / 1000),
    singleUse: true,
  });
}

export async function GET(req: NextRequest) {
  if (!isOpsAuthorized(req.headers.get("authorization"))) return opsUnauthorized();
  const cls = await loadOpsClass(getDb(), opsClassCode());
  if (!cls) return classMissing();
  return Response.json({
    classCode: cls.inviteCode,
    className: cls.name,
    students: await listOpsClassStudents(getDb(), cls.id),
  });
}
