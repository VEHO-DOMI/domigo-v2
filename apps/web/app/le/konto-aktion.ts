"use server";
// BRAND-2 · srdp-069 · Der Konto-Knopf der Kopfzeile — und seit dach-074 das EINE
// Abmelden der App: app/home/page.tsx und app/admin/page.tsx rufen dieselbe Aktion.
//
// Erst endet DomiGos eigene Sitzung, dann entscheidet lib/konto/abmelden.ts, wohin es
// geht: eine Sitzung, die über konto kam, weiter zu konto /logout (sonst bliebe die
// konto-Sitzung auf einem geteilten Gerät für das nächste Kind stehen); eine
// PIN-Sitzung wie bisher auf die Startseite. Die Weiterleitung ist die von Next, nicht
// Auth.js' `redirectTo`: Auth.js folgt nur Adressen der eigenen App und würde die von
// konto still verwerfen.
//
// Eine Server-Aktion in eigener Datei, damit die Kopfzeile (Client-Komponente im
// Root-Layout) sie aufrufen kann, OHNE dass das Layout auth()/cookies() liest —
// das würde jede bisher statische Route dynamisch machen.
import { redirect } from "next/navigation";
import { auth, signOut } from "@/auth";
import { abmeldeZiel } from "@/lib/konto/abmelden";

export async function abmelden() {
  const session = await auth();
  const via = session?.user?.via ?? null;
  await signOut({ redirect: false });
  redirect(abmeldeZiel(via));
}
