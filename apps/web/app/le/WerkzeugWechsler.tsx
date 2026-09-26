"use client";
/**
 * BRAND-2 · srdp-069 · Der Werkzeug-Wechsler des Dachs »Lauter Einser« (Gestaltungsregel
 * des Dachs §1, Zone rechts). Gespiegelt aus srdp-practice (BRAND-1 V2,
 * components/le/WerkzeugWechsler.tsx), angepasst an DomiGo.
 *
 * Die Einträge kommen aus werkzeugeFuer(rolle) (lib/le-werkzeuge.ts); diese Komponente
 * kennt keinen Titel und keine Adresse selbst. Die Texte sind Deutsch (die Sprache des
 * Dachs, lang="de") und stehen so da, wie die Datei sie hat.
 *
 * Bedienung: ein Menü-Knopf (Name aus der Datei, MENUE_TITEL — Fassung 4: »Bereiche«) mit aria-expanded + aria-controls. Enter/Leertaste
 * oder Pfeil ab öffnen und setzen den Fokus auf den ersten Eintrag; Pfeile und
 * Tab/Umschalt+Tab bleiben im Menü (Fokusfalle), Pos1/Ende springen, Escape schließt und
 * gibt den Fokus an den Knopf zurück; ein Klick daneben schließt.
 *
 * Eintragsregeln (Regel §4 — nie ein toter Link): Stand »live« → Link; DomiGos eigener
 * Eintrag (eng-us) → aria-current="page", kein Sprung; alles andere → Text mit seinem
 * Stand (»kommt später« / »zieht um«).
 *
 * Handy (375 px): die Zone rechts ist EIN Menü-Knopf. Der Konto-Knopf wandert dann als
 * letzter Eintrag in dieses Menü (le-nur-schmal); breit steht er daneben (BrandHeader).
 */
import { useEffect, useId, useRef, useState } from "react";
import { EIGENES_WERKZEUG, istSprung, MENUE_TITEL, zeileUeberDemNamen, type Werkzeug } from "@/lib/le-werkzeuge";

function EintragInhalt({ w }: { w: Werkzeug }) {
  const zeile = zeileUeberDemNamen(w);
  return (
    <>
      {zeile && <span className="le-switcher-cat">{zeile}</span>}
      <span className="le-switcher-title">{w.titel}</span>
      <span className="le-switcher-satz">{w.satz}</span>
      {w.stand !== "live" && <span className="le-state">{w.stand}</span>}
    </>
  );
}

export default function WerkzeugWechsler({
  werkzeuge,
  abmelden,
}: {
  werkzeuge: Werkzeug[];
  /** Nur gesetzt, wenn jemand angemeldet ist: dann trägt das schmale Menü den Konto-Knopf. */
  abmelden?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const wrapRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Nur SICHTBARE Einträge zählen für die Fokusfalle: der Konto-Eintrag ist breit per CSS
  // ausgeblendet und darf dort nicht angesprungen werden.
  const items = () =>
    Array.from(menuRef.current?.querySelectorAll<HTMLElement>('[role="menuitem"]') ?? []).filter(
      (el) => el.getClientRects().length > 0,
    );

  const close = (returnFocus: boolean) => {
    setOpen(false);
    if (returnFocus) buttonRef.current?.focus();
  };

  // Offen: Fokus auf den ersten Eintrag; ein Druck außerhalb schließt.
  useEffect(() => {
    if (!open) return;
    items()[0]?.focus();
    const onPointer = (e: PointerEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onPointer);
    return () => document.removeEventListener("pointerdown", onPointer);
  }, [open]);

  const onMenuKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const list = items();
    if (list.length === 0) return;
    const at = list.indexOf(document.activeElement as HTMLElement);
    const go = (i: number) => list[(i + list.length) % list.length].focus();
    switch (e.key) {
      case "Escape":
        e.preventDefault();
        close(true);
        break;
      case "ArrowDown":
        e.preventDefault();
        go(at + 1);
        break;
      case "ArrowUp":
        e.preventDefault();
        go(at - 1);
        break;
      case "Home":
        e.preventDefault();
        go(0);
        break;
      case "End":
        e.preventDefault();
        go(list.length - 1);
        break;
      case "Tab":
        e.preventDefault();
        go(e.shiftKey ? at - 1 : at + 1);
        break;
    }
  };

  return (
    <div ref={wrapRef} className="le-switcher-wrap" lang="de">
      <button
        ref={buttonRef}
        type="button"
        className="le-switcher"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((o) => !o)}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown" && !open) {
            e.preventDefault();
            setOpen(true);
          }
        }}
      >
        {MENUE_TITEL} <span aria-hidden="true" className="le-switcher-pfeil">▼</span>
      </button>
      <div
        ref={menuRef}
        id={menuId}
        role="menu"
        aria-label={MENUE_TITEL}
        hidden={!open}
        className="le-switcher-menu"
        onKeyDown={onMenuKeyDown}
      >
        {werkzeuge.map((w) => {
          if (w.id === EIGENES_WERKZEUG) {
            return (
              <span key={w.id} role="menuitem" tabIndex={-1} aria-current="page" className="le-switcher-item"
                onClick={() => close(true)}>
                <EintragInhalt w={w} />
              </span>
            );
          }
          if (istSprung(w)) {
            return (
              <a key={w.id} role="menuitem" tabIndex={-1} href={w.adresse} className="le-switcher-item">
                <EintragInhalt w={w} />
              </a>
            );
          }
          return (
            <span key={w.id} role="menuitem" tabIndex={-1} aria-disabled="true" className="le-switcher-item">
              <EintragInhalt w={w} />
            </span>
          );
        })}
        {abmelden && (
          <button
            type="button"
            role="menuitem"
            tabIndex={-1}
            className="le-switcher-item le-switcher-konto le-nur-schmal"
            onClick={() => {
              setOpen(false);
              abmelden();
            }}
          >
            <span className="le-switcher-title">Abmelden</span>
          </button>
        )}
      </div>
    </div>
  );
}
