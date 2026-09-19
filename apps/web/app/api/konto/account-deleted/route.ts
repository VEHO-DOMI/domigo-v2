/**
 * dach-018 · POST /api/konto/account-deleted {app_user_id} — konto is about to
 * delete an account, and every app has to remove what it holds about that
 * person (SPEC §3b, DATEN-7 I-9).
 *
 * Idempotent: an unknown person answers 204, because "already gone" and "never
 * here" are the same outcome and konto must be able to retry safely. A database
 * failure answers 500 on purpose — konto retries, and a half-finished deletion
 * that reported success would be the worst possible answer.
 *
 * What is removed and what deliberately is not: see deleteUserData
 * (packages/db/src/konto-loeschung.ts). The count per table is logged; no name
 * ever is.
 */
import { deleteUserData, getDb } from "@domigo/db";
import { abgewiesen, pruefePush } from "@/lib/konto/jwt";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request): Promise<Response> {
  const roh = await req.text();
  const ruf = await pruefePush<{ app_user_id?: unknown }>(req, roh, "account-deleted");
  if (!ruf) return abgewiesen();

  const id = ruf.koerper?.app_user_id;
  if (typeof id !== "string" || id.length === 0) return Response.json({ error: "bad_request" }, { status: 400 });

  try {
    const bericht = await deleteUserData(getDb(), id);
    console.log(`[konto] account deleted: ${JSON.stringify(bericht.zeilen)}`);
    return new Response(null, { status: 204 });
  } catch {
    return Response.json({ error: "delete_failed" }, { status: 500 });
  }
}
