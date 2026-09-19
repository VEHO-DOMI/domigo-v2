/**
 * dach-018 · POST /api/konto/classes — the account service creates a class here
 * (SPEC §4.7). It answers with DomiGo's own id for it, which konto then stores
 * as the bridge (`app_class_links`); without that bridge the class is invisible
 * to the class wall, which is why the bridge comes before the accounts in the
 * switch-over order (SPEC §10).
 *
 * The SENDER for this endpoint is built on the konto side (dach-048, nachtrag
 * N-1) and does not exist yet: until it does, the only way a class reaches
 * DomiGo is the switch-over import. The receiver is ready first on purpose —
 * the day the sender ships, nothing here has to change.
 */
import { createKontoClass, getDb, type KontoKlassenEingang } from "@domigo/db";
import { abgewiesen, pruefePush } from "@/lib/konto/jwt";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request): Promise<Response> {
  const roh = await req.text();
  const ruf = await pruefePush<KontoKlassenEingang>(req, roh, "classes");
  if (!ruf) return abgewiesen();

  const e = ruf.koerper;
  if (!e || typeof e.name !== "string" || typeof e.owner_app_user_id !== "string") {
    return Response.json({ error: "bad_request" }, { status: 400 });
  }

  const r = await createKontoClass(getDb(), e);
  if (!r.ok) {
    // 422 with the reason as a FIELD NAME, never a value (nachtrag N-17).
    const satz =
      r.grund === "kein-jahrgang"
        ? "DomiGo speichert jede Klasse mit einem Jahrgang von 1 bis 4; ohne Jahrgang kann die Lehrgruppe hier nicht angelegt werden."
        : "Die verantwortliche Lehrkraft hat sich in DomiGo noch nie angemeldet; nach ihrer ersten Anmeldung gelingt derselbe Aufruf.";
    return Response.json({ error: r.grund, feld: r.grund === "kein-jahrgang" ? "jahrgang" : "owner_app_user_id", satz }, { status: 422 });
  }
  console.log(`[konto] class received (${r.geaendert ? "created" : "already known"})`);
  return Response.json({ app_class_id: r.app_class_id }, { status: r.geaendert ? 201 : 200 });
}
