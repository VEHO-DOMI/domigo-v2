/**
 * K12 · DIE HOER-INHALTE FUER DAS LEHRER-BACKEND — und die Gegenrichtung: was
 * davon ein Kind NICHT bekommt (P-R13 Punkt 7a, Koki 2026-08-24).
 *
 * Warum diese Datei ueberhaupt: eine Lehrkraft konnte den Sprechtext ihrer
 * Hoer-Aufgaben nirgends sehen. Repo-weit nachgezaehlt — im ganzen /admin gibt
 * es genau einen Treffer auf »listening«, und der ist ein Kommentar ueber etwas
 * Ungebautes. Der Text selbst liegt seit der W-0-Welle im Bestand
 * (content/corpus/units/<einheit>/listening.json, Feld `audio.script`).
 *
 * ES WIRD KEINE ZWEITE ABSCHRIFT ANGELEGT. Das ist der Kern des Auftrags: die
 * Lehrer-Flaeche liest `audio.script` zur Laufzeit. Eine Kopie koennte driften,
 * und das Tor V-LC7 (validate-listening) haelt genau deshalb `audio.script` und
 * `transcript` wortgleich — wer eine dritte Fassung anlegt, stellt sich neben
 * dieses Tor statt darunter.
 *
 * DIE GEGENRICHTUNG (`ohneSprechtextFuersKind`) ist ein Fund dieser Bahn und
 * Kokis Entscheid vom 24.08., ihn mitzureparieren: der Sprechtext reiste bisher
 * IM SEITEN-PAKET jedes Kindes mit. Die Schuelerseiten entfernten das Feld
 * `transcript` (»it's the answer key«, sagte der Kommentar dort) und reichten
 * das ganze `audio`-Objekt weiter — in dem derselbe Text als `script` steht.
 * Angezeigt wurde er nie; ausgeliefert wurde er immer. Ein Blick in den
 * Seitenquelltext gab die Loesungen her, auf der Uebungsseite UND in der
 * Schularbeits-Probe.
 *
 * Warum der Text nicht einfach immer verschwindet: hat eine Einheit noch KEINE
 * Aufnahme (`file: null` — laut V-LC6 ausdruecklich erlaubt), spricht der
 * Browser ihn selbst vor. Ohne Text waere die Aufgabe dann stumm. Also: der
 * Text faellt weg, SOBALD es eine Aufnahme gibt — und nur dann.
 *
 * ⚠ GEBAUT ALS POSITIV-LISTE, nicht als Streichliste. Ein `{...audio, script:
 * null}` waere eine Streichliste, und die Registry hat diese Klasse schon
 * einmal bezahlt: bei einem Spread leckt JEDES kuenftig hinzugefuegte Feld von
 * selbst ans Kind. Hier werden die drei Felder, die das Kind braucht, einzeln
 * genannt. Ein neues Feld an `AudioRef` kommt damit nur ans Kind, wenn jemand
 * es HIER hinschreibt — die Voreinstellung ist Schweigen. (Nebenwirkung, so
 * gewollt: `audio.source` mit Anbieter und Stimm-Ids faehrt nicht mehr mit.)
 *
 * Keine `@/…`-Aliase, aus demselben Grund, den lib/grade-scope.ts nennt: die
 * Batterie von apps/web laeuft unter blankem `node --test` und loest echte
 * Pakete auf, aber keine tsconfig-Aliase.
 */
import type { AudioRef, ListeningFile } from "@domigo/content-schema";
import { listListeningUnits, loadListening } from "@domigo/content-loader";
import { isSlugAllowed, visibleGradesFor } from "./grade-scope.ts";

/** Ein Hoer-Stueck, so wie eine Lehrkraft es braucht. */
export interface HoerStueck {
  /** Die Einheit, in der es lebt — »g2-u04«. */
  einheit: string;
  /** Die Aufgaben-Id aus dem Bestand — »g2u04.lt.vote«. */
  aufgabeId: string;
  /** Der Aufgaben-Schluessel — »vote«. Teil des Download-Namens. */
  schluessel: string;
  titelDe: string;
  /** WOERTLICH `audio.script`. Keine Kopie, keine Umformung. */
  sprechtext: string;
  /** Der oeffentliche Pfad der Aufnahme, oder null, solange keine existiert. */
  datei: string | null;
  /** Die Stimmen der Aufnahme, wie der Bestand sie protokolliert hat. */
  stimmen: string[];
  /** Gezaehlt, nie getippt — Orientierung fuer die Laenge (P-R13 Punkt 5). */
  woerter: number;
}

/**
 * Der Bestand einer Stufe MIT seinen Luecken. Eine einzelne kaputte Datei darf
 * nicht die ganze Liste ausloeschen, und sie darf auch nicht verschwiegen
 * werden: »ich konnte nicht nachsehen« ist etwas anderes als »da ist nichts«
 * (die K1b-Doktrin, hier auf den Bestand statt auf die Datenbank angewandt).
 */
export interface HoerBestand {
  stuecke: HoerStueck[];
  /** Einheiten, deren listening.json nicht lesbar war — namentlich. */
  unlesbar: string[];
}

/** Woerter zaehlen wie der Validator es tut (packages/content-pipeline). */
export function woerterZaehlen(text: string): number {
  return text.split(/\s+/).filter(Boolean).length;
}

/** Die Stimm-Namen einer Aufnahme, in der Reihenfolge des Bestands. */
function stimmenVon(audio: AudioRef): string[] {
  const aus = audio.source?.voices?.map((v) => v.name).filter(Boolean) ?? [];
  if (aus.length > 0) return aus;
  return audio.voice ? [audio.voice] : [];
}

/** Alle Aufgaben einer geladenen Datei in die Lehrer-Form bringen. */
function stueckeAus(datei: ListeningFile): HoerStueck[] {
  return datei.tasks.map((t) => ({
    einheit: datei.slug,
    aufgabeId: t.id,
    schluessel: t.key,
    titelDe: t.titleDe,
    sprechtext: t.audio.script,
    datei: t.audio.file,
    stimmen: stimmenVon(t.audio),
    woerter: woerterZaehlen(t.audio.script),
  }));
}

/**
 * Die Hoer-Stuecke EINER Stufe, zur Laufzeit aus dem Bestand gelesen.
 *
 * Die Stufen-Einschraenkung laeuft ueber dieselben zwei Bausteine wie jede
 * andere Korpus-Flaeche (visibleGradesFor + isSlugAllowed aus grade-scope) —
 * eine zweite Herleitung derselben Regel waere genau die Art Zwilling, die
 * spaeter auseinanderlaeuft.
 */
export function hoerStueckeFuerStufe(grade: number): HoerBestand {
  const stufen = visibleGradesFor(grade);
  const stuecke: HoerStueck[] = [];
  const unlesbar: string[] = [];
  for (const slug of listListeningUnits().filter((s) => isSlugAllowed(s, stufen))) {
    try {
      const datei = loadListening(slug);
      if (datei) stuecke.push(...stueckeAus(datei));
    } catch (err) {
      console.error(
        "[lib/hoeren] listening.json nicht lesbar:",
        slug,
        err instanceof Error ? err.message.slice(0, 200) : String(err).slice(0, 200),
      );
      unlesbar.push(slug);
    }
  }
  return { stuecke, unlesbar };
}

/**
 * Der Dateiname, unter dem die Aufnahme im Download-Ordner der Lehrkraft
 * landet: »g2-u04-vote-hoeren.mp3«.
 *
 * Der echte Pfad behaelt seinen Fingerabdruck (»vote--amelia--598e1842.mp3«) —
 * er ist der K5a-Datei-Kontrakt, an dem V-LC6 haengt, und wird hier nicht
 * angefasst. Der Aufgaben-Schluessel steht mit im Namen, obwohl heute jede
 * Einheit nur eine Aufgabe hat: das Schema erlaubt mehrere, und zwei Dateien
 * namens »g2-u04-hoeren.mp3« wuerden sich im selben Ordner in die Quere kommen.
 */
export function downloadName(einheit: string, schluessel: string): string {
  const sauber = (s: string) => s.toLowerCase().replace(/[^a-z0-9-]+/g, "-").replace(/^-+|-+$/g, "");
  return `${sauber(einheit)}-${sauber(schluessel)}-hoeren.mp3`;
}

/**
 * Grobe Sprechdauer aus der Wortzahl, auf eine halbe Minute gerundet und als
 * SCHAETZUNG beschriftet — die echte Laenge steckt in der Tonspur, nicht in
 * einer Formel. 112 Woerter je Minute ist die Mitte des Bandes, in dem die
 * fertigen Aufnahmen liegen (A1–A2-Tempo, bewusst langsamer als Erwachsenen-
 * Sprechtempo).
 *
 * Warum die Zahl ueberhaupt hier steht: P-R13 Punkt 5 setzt fuer Stufe 2 zwei
 * bis drei Minuten an. Eine Lehrkraft soll auf einen Blick sehen, wo ein
 * Stueck heute steht — ohne es abspielen zu muessen.
 */
export function dauerSchaetzung(woerter: number): string {
  const minuten = woerter / 112;
  if (minuten < 0.75) return "unter 1 Min.";
  const halbe = Math.round(minuten * 2) / 2;
  return `ca. ${String(halbe).replace(".", ",")} Min.`;
}

/** Die Tonspur-Angabe, wie sie ein Kind bekommt. Siehe Kopf dieser Datei. */
export interface KindAudio {
  /** null heisst NICHT GESENDET (es gibt eine Aufnahme) — nie »leer«. */
  script: string | null;
  voice: string | null;
  file: string | null;
}

/**
 * Positiv-Liste: genau die drei Felder, die der Abspieler braucht. Der
 * Sprechtext faehrt nur mit, solange es keine Aufnahme gibt.
 */
export function ohneSprechtextFuersKind(audio: AudioRef): KindAudio {
  return {
    script: audio.file ? null : audio.script,
    voice: audio.voice,
    file: audio.file,
  };
}
