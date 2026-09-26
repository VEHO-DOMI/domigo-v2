/**
 * BRAND-2 · srdp-069 · Die Werkzeug-Liste des Dachs »Lauter Einser« (Werkzeug-Wechsler
 * in der Kopfzeile, Gestaltungsregel des Dachs §1).
 *
 * Die EINE Quelle ist app/le-werkzeuge.json — eine byte-gleiche Kopie von S2s
 * CODEX-ABLAGE-MARKE/tokens/lauter-einser-werkzeuge.json (sha256 gepinnt in
 * scripts/check-umbrella-tokens.mjs). Dieselbe Datei speist den Wechsler in jeder
 * Lauter-Einser-App und die Kacheln auf lautereinser.at; deshalb steht kein Titel,
 * kein Satz und keine Adresse im Code — Quelle ändern, neu vendorn, neu pinnen.
 *
 * Bewusst frei von `@/…`-Pfad-Aliassen (wie lib/levels.ts): die Suite von apps/web
 * läuft unter `node --test` ohne Bundler, und der Import-Zusatz `with { type: "json" }`
 * ist das, was Node dafür verlangt (lib/paint-art.ts macht es genauso).
 */
import data from "../app/le-werkzeuge.json" with { type: "json" };

export type WerkzeugStand = "live" | "zieht um" | "kommt später";
export type Rolle = "student" | "teacher";

export type Werkzeug = {
  id: string;
  titel: string;
  /**
   * Seit Fassung 3 (18.09.): fertiger Kopfzeilen-Wortlaut aus der Quelle — »Fach · Stufe — titel«,
   * seit Fassung 6 (26.09.) auch »Fach — titel«, ohne Stufe nur der Titel. DomiGo zeigt ihn heute
   * nicht (Kopfzeile Mitte = Wortmarke, vom Tor check-umbrella-tokens gehalten); das Feld steht
   * hier, damit der Typ die Datei vollständig beschreibt und eine spätere Kopfzeilen-Karte nichts
   * umbauen muss.
   */
  anzeige: string;
  satz: string;
  kategorie: { fach: string; stufe: string };
  adresse: string;
  kurzform: string;
  sprache: string;
  sichtbar_fuer: Rolle[];
  stand: WerkzeugStand;
  /** Anmelde-App bei konto (»srdp« | »go« | »tracker«), oder null: meldet nicht über konto an. */
  konto_app: string | null;
  /** Die eine Rückkehr-Adresse, die konto für konto_app zulässt, oder null. */
  konto_return: string | null;
};

/**
 * Der Name des Menüs in der Kopfzeile (Fassung 4: »Bereiche«) — aus der Datei gelesen, nie
 * getippt: die Quelle nennt ihn, und jede Lauter-Einser-App zeigt denselben.
 */
export const MENUE_TITEL: string = data.menue_titel;

/** DomiGos eigener Eintrag: mit aria-current gezeigt, nie als Sprung. */
export const EIGENES_WERKZEUG = "eng-us";

/**
 * Die Einträge, die eine Rolle sehen darf, in Datei-Reihenfolge (Bereiche für Schüler
 * zuerst, Lehrer-Notizbuch und Mein Bereich zuletzt). Gäste (null) sehen, was Schüler sehen.
 */
export function werkzeugeFuer(rolle: Rolle | null): Werkzeug[] {
  const r: Rolle = rolle ?? "student";
  return (data.werkzeuge as Werkzeug[]).filter((w) => w.sichtbar_fuer.includes(r));
}

/** Nur ein Eintrag mit Stand »live« wird ein Link; alles andere ist Text mit seinem Stand. */
export function istSprung(w: Werkzeug): boolean {
  return w.stand === "live" && w.id !== EIGENES_WERKZEUG;
}

/** »Fach · Stufe«, oder nur das Fach, wenn die Stufe leer ist. */
export function kategorieLabel(w: Werkzeug): string {
  return w.kategorie.stufe ? `${w.kategorie.fach} · ${w.kategorie.stufe}` : w.kategorie.fach;
}
