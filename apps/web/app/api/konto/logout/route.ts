/**
 * dach-018 · POST /api/konto/logout {sid} — the sign-out back-channel (SPEC §6).
 *
 * When someone signs out at the account service, it tells every app. For a
 * JWT app like DomiGo there is no server-side session to end, so this route
 * cannot revoke anything by itself: the binding mechanism is the 60-second
 * claims check in the jwt callback, which sees the session revoked and refuses
 * the token within the minute (SPEC §6 says so in as many words, and nachtrag
 * N-8 rules out the optional local block list — it would need a table, and this
 * card writes no migration).
 *
 * So the route answers 204 and writes one server line. That is not a stub: it
 * is the call konto needs to hear an answer to, and a wrong signature must
 * still be a 401 — a back-channel that accepts anything is a way to learn
 * which session ids exist.
 */
import { abgewiesen, pruefeLogout } from "@/lib/konto/jwt";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request): Promise<Response> {
  // Read the RAW bytes once: the signature is bound to them, so a second read
  // or an early JSON.parse would verify something other than what arrived.
  const roh = await req.text();
  const ruf = await pruefeLogout(req, roh);
  if (!ruf) return abgewiesen();
  console.log("[konto] sign-out received; the session ends at its next claims check (≤ 60 s)");
  return new Response(null, { status: 204 });
}
