/**
 * K2b · DomiGo als installierbare App (PWA v1).
 *
 * Wozu: die Kinder arbeiten auf Tablets, und eine Adresse im Browser ist kein
 * Ort, den ein Zweitklaessler wiederfindet. Mit diesem Blatt bietet Chrome
 * »Zum Startbildschirm hinzufuegen« an; danach traegt das Geraet ein Icon, und
 * ein Tipp darauf oeffnet DomiGo im eigenen Fenster ohne Adresszeile.
 *
 * BEWUSST OHNE SERVICE WORKER, und das ist eine erklaerte Grenze, kein Rest.
 * Ein Service Worker ist ein Stueck Code, das der Browser BEHAELT und vor jede
 * Anfrage stellt — er kann eine App offline halten, aber er kann sie auch auf
 * einem alten Stand einfrieren, wenn sein Vertrag mit den Dateinamen nicht
 * stimmt. Die Uebungen bringen ihr Offline-Verhalten bereits selbst mit
 * (lib/attempt-outbox.ts sammelt Antworten und schickt sie nach, wenn das Netz
 * wiederkommt), also brachte ein Worker hier Risiko ohne Gewinn. Er ist als
 * benannte Schuld nach K8/K9 vermerkt.
 *
 * `start_url` ist /home und nicht /: die Startseite ist die abgemeldete
 * Werbeseite, und wer die App vom Startbildschirm oeffnet, ist angemeldet.
 */
import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "DomiGo — English Vocabulary & Grammar",
    short_name: "DomiGo",
    description: "English vocabulary & grammar trainer for AHS Klasse 1–4.",
    start_url: "/home",
    scope: "/",
    display: "standalone",
    orientation: "any",
    lang: "en",
    // Beide Farben stammen aus app/globals.css (:root) — --accent und --bg.
    theme_color: "#2563eb",
    background_color: "#edf4ff",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      // `maskable` heisst: Android darf beliebig zuschneiden (Kreis, Squircle,
      // Tropfen). Deshalb ein eigenes Blatt, auf dem die Marke kleiner steht und
      // in der sicheren Zone bleibt — sonst kappt der Zuschnitt das D.
      { src: "/icons/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
