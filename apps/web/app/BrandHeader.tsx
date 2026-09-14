"use client";
/**
 * The persistent DomiGo wordmark header (every screen, like the trainers). It's
 * grade-aware: on a /play/[grade] route it sets data-grade on itself so the
 * wordmark gradient + glow theme to that grade's trainer (g1 green · g2 red ·
 * g3 blue→gold · g4 purple→gold); elsewhere it's the default blue→gold app brand.
 *
 * BRAND-2 · srdp-069 · Die Kopfzeile des Dachs »Lauter Einser« (Gestaltungsregel des Dachs §1).
 * Kokis Urteil 14.09.: auf /play/[1-4] steht EXAKT die bisherige Kopfzeile (Stufen-Schriftzug
 * + Tagline), ohne Dach-Zonen — das Spiel bleibt, wie es ist. Überall sonst drei Zonen:
 *   links  · Zeichen stern-01 + »Lauter Einser« → https://lautereinser.at (die Weiche)
 *   Mitte  · der DomiGo-Schriftzug wie bisher + »Teil von Lauter Einser« statt der Tagline
 *   rechts · Werkzeug-Wechsler + Konto-Knopf (bis zum Konto-Dienst: DomiGos eigenes Abmelden)
 * scripts/check-umbrella-tokens.mjs hält die /play-Weiche und ihr Markup fest.
 *
 * Anmeldung und Rolle liest diese Komponente im BROWSER aus /api/auth/session (Auth.js v5,
 * JWT, die Session-Callback in auth.ts ist rein — keine DB). Nicht im Root-Layout über
 * auth()/cookies(): das würde /, /_not-found und /manifest.webmanifest von statisch auf
 * dynamisch kippen. Bis die Antwort da ist (und bei jedem Fehler) gilt Gast = Schüler, und
 * der Konto-Knopf fehlt. Neu gelesen wird bei jedem Pfadwechsel, weil die Kopfzeile im
 * Root-Layout über Anmelden/Abmelden hinweg stehen bleibt.
 */
import { useEffect, useState, useTransition } from "react";
import { usePathname } from "next/navigation";
import { werkzeugeFuer, type Rolle } from "@/lib/le-werkzeuge";
import { abmelden } from "./le/konto-aktion";
import SternZeichen from "./le/SternZeichen";
import WerkzeugWechsler from "./le/WerkzeugWechsler";

type Sitzung = { angemeldet: boolean; rolle: Rolle | null };
const GAST: Sitzung = { angemeldet: false, rolle: null };

export default function BrandHeader() {
  const pathname = usePathname() ?? "";
  const m = pathname.match(/^\/play\/([1-4])(?:\/|$)/);
  const grade = m ? m[1] : undefined;
  const [sitzung, setSitzung] = useState<Sitzung>(GAST);
  const [, startTransition] = useTransition();

  useEffect(() => {
    if (grade) return; // im Spiel keine Dach-Zonen, also auch keine Anfrage
    let aktiv = true;
    fetch("/api/auth/session", { cache: "no-store", credentials: "same-origin" })
      .then((r) => (r.ok ? r.json() : null))
      .then((s: { user?: { role?: string } } | null) => {
        if (!aktiv) return;
        const role = s?.user?.role;
        setSitzung({
          angemeldet: Boolean(s?.user),
          rolle: role === "teacher" ? "teacher" : role === "student" ? "student" : null,
        });
      })
      .catch(() => {
        /* Gast bleibt Gast — die Kopfzeile darf nie an einer Anfrage scheitern */
      });
    return () => {
      aktiv = false;
    };
  }, [pathname, grade]);

  if (grade) {
    return (
      <header className="dg-app-header" data-grade={grade} style={{ background: "var(--bg)" }}>
        <div className="dg-glow" aria-hidden="true" />
        <a href="/home" className="brand-wordmark" style={{ fontSize: 30, position: "relative", lineHeight: 1 }}>DomiGo</a>
        <div className="dg-tagline">English · Vocabulary &amp; Grammar</div>
      </header>
    );
  }

  const onAbmelden = sitzung.angemeldet
    ? () => {
        setSitzung(GAST); // sofort, auch wenn die Weiterleitung auf dieselbe Seite zeigt
        startTransition(async () => {
          await abmelden();
        });
      }
    : undefined;

  return (
    <header className="dg-app-header le-kopf" data-grade={grade} style={{ background: "var(--bg)" }}>
      <div className="le-glow-rahmen" aria-hidden="true">
        <div className="dg-glow" />
      </div>
      <div className="le-zone le-zone-links" lang="de">
        <a href="https://lautereinser.at" className="le-brand">
          <SternZeichen className="le-stern" />
          <span>Lauter Einser</span>
        </a>
      </div>
      <div className="le-zone le-zone-mitte">
        <a href="/home" className="brand-wordmark" style={{ fontSize: 30, position: "relative", lineHeight: 1 }}>DomiGo</a>
        <div className="le-affiliation" lang="de">Teil von Lauter Einser</div>
      </div>
      <div className="le-zone le-zone-rechts" lang="de">
        <WerkzeugWechsler werkzeuge={werkzeugeFuer(sitzung.rolle)} abmelden={onAbmelden} />
        {onAbmelden && (
          <button type="button" className="le-konto le-nur-breit" onClick={onAbmelden}>
            Abmelden
          </button>
        )}
      </div>
    </header>
  );
}
