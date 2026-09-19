/**
 * dach-018 · POST /api/konto/class-term — a change to a class, pulled through
 * (SPEC §10.2): a rename, a new school year, a handover, an archive or an
 * un-archive. Delivered by konto's push queue with backoff, and again by the
 * nightly sync if a push was lost.
 *
 * Idempotent, and the route says nothing about it: the comparison lives in
 * applyKontoClassTerm, which writes only a real difference and journals only a
 * real change.
 */
import { applyKontoClassTerm, getDb, type KontoKlassenEingang } from "@domigo/db";
import { abgewiesen, pruefePush } from "@/lib/konto/jwt";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request): Promise<Response> {
  const roh = await req.text();
  const ruf = await pruefePush<KontoKlassenEingang>(req, roh, "class-term");
  if (!ruf) return abgewiesen();

  const e = ruf.koerper;
  if (!e || typeof e.name !== "string" || typeof e.owner_app_user_id !== "string") {
    return Response.json({ error: "bad_request" }, { status: 400 });
  }

  const r = await applyKontoClassTerm(getDb(), e);
  if (!r.ok) return Response.json({ error: r.grund }, { status: r.grund === "unbekannte-klasse" ? 404 : 422 });
  console.log(`[konto] class-term applied (${r.geaendert ? "changed" : "no change"})`);
  return Response.json({ app_class_id: r.app_class_id, geaendert: r.geaendert });
}
