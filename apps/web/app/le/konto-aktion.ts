"use server";
// BRAND-2 · srdp-069 · Der Konto-Knopf der Kopfzeile, bis der Konto-Dienst (K-A) steht:
// DomiGos EIGENES Abmelden — dieselbe Zeile, die app/home/page.tsx und
// app/admin/page.tsx als Server-Aktion tragen. Nach K-A zeigt der Knopf auf den
// Abmelde-Pfad des Konto-Dienstes (Gestaltungsregel des Dachs §1); diese Datei geht dann.
//
// Eine Server-Aktion in eigener Datei, damit die Kopfzeile (Client-Komponente im
// Root-Layout) sie aufrufen kann, OHNE dass das Layout auth()/cookies() liest —
// das würde jede bisher statische Route dynamisch machen.
import { signOut } from "@/auth";

export async function abmelden() {
  await signOut({ redirectTo: "/" });
}
