/**
 * dach-108 · /lehrkraft/pin-reset/<token> (the PIN reset link) — an old door, closed for good.
 *
 * DomiGo checks no PIN of its own any more (Koki 19.09., E-3, »Tabula rasa«).
 * This address took one; now it only leads on, always, with a 307 (never 308)
 * to the fixed target in lib/konto/regeln.ts (tuerZiel). No database, no form,
 * no server action, no date. scripts/check-no-local-login.mjs keeps it so.
 */
import { redirect } from "next/navigation";
import { tuerZiel } from "@/lib/konto/regeln";

export const dynamic = "force-dynamic";

export default async function Tuer() {
  redirect(tuerZiel("pin-reset", ""));
}
