# Beta-Checkliste · der Trockenlauf vor den Kindern

_Ein Blatt zum Ausdrucken und Abhaken. Gedacht für einen ruhigen Nachmittag mit einem
Laptop und einem Tablet, VOR dem ersten echten Schultag auf der Plattform. Jede Zeile
ist eine Sache, die ein Kind oder eine Kollegin am ersten Tag tut — wenn eine davon
klemmt, klemmt sie besser hier als dort._

**Wo:** https://domigo-v2.vercel.app · **Womit:** die Test-Klasse **TEST P**
(Beitritts-Link `/join/75YAHV`) — nie mit einer echten Klasse.
**Wie lange:** ungefähr eine Stunde, wenn nichts klemmt.

Vorher einmal `/api/version` öffnen und den Stand notieren: ____________________
(Damit steht am Ende fest, welche Fassung geprüft wurde. Ein Merge ist noch kein
Online — erst dieser Wert beweist es.)

---

## 1 · Anmelden — jede Rolle einmal

- [ ] **Kind, neu.** Beitritts-Link öffnen → Namen wählen → Spitzname + 6-stellige PIN
      ausdenken → drin. *Erwartet:* landet auf der Startseite, sieht seinen Namen oben.
- [ ] **Kind, wiederkommend.** Abmelden, dann `/signin` mit Klassencode + Spitzname + PIN.
- [ ] **Kind, falsche PIN.** Dreimal absichtlich falsch. *Erwartet:* eine allgemeine
      Fehlermeldung, die NICHT verrät, ob es den Spitznamen gibt.
- [ ] **Lehrkraft.** `/admin/signin` mit Name + PIN. *Erwartet:* Dashboard mit Klassenkarten.
- [ ] **Lehrkraft über den Einladungs-Link.** `/lehrkraft/<TOKEN>` in einem frischen
      Browser-Fenster → leere Klasse übernehmen → drin.
      ⚠ *Erwartet:* der Passwortmanager bietet auf dieser Seite KEINE fremden
      Zugangsdaten an. Bietet er doch welche an: nicht übernehmen, melden.
- [ ] **Großmeister.** Auf `/admin` erscheint die Karte „👑 Großmeister — alle Klassen".

## 2 · Üben — was ein Kind an einem normalen Tag tut

- [ ] **Üben** (`/practice`): eine Runde bis zum Ende, Rückmeldung erscheint je Aufgabe.
- [ ] **Wiederholen** (`/review`): der Karteikasten schlägt etwas vor und nimmt eine Antwort an.
- [ ] **Lernpfad** (`/learn`): eine Einheit öffnen, eine Aufgabe lösen, der Fortschritt bewegt sich.
- [ ] **Hören** (`/listening`): eine Aufgabe mit Ton — kommt Ton?
- [ ] **Spiel** (`/play`): das Kind sieht NUR seine Schulstufe. Ein Zweitklässler, der
      `/play/4` von Hand eintippt, wird zurück auf seine eigene Stufe geschickt.
- [ ] **Offline-Probe.** Mitten in einer Übungsrunde das WLAN abschalten, zwei Aufgaben
      lösen, WLAN wieder an. *Erwartet:* die Antworten kommen nach, nichts geht verloren.

## 3 · Unterrichten — was eine Lehrkraft am ersten Tag tut

- [ ] **Klasse anlegen** und den Beitritts-Link kopieren.
- [ ] **Namensliste einfügen** (ein Name je Zeile) und den Roster prüfen.
- [ ] **Aufgabe stellen** (`/admin/assignments`): einen Checkup /20 bauen und veröffentlichen.
- [ ] **Aufgabe schreiben** (als Kind, `/assignments`): die Aufgabe erscheint, lässt sich
      abgeben, die Zeit läuft.
- [ ] **Ergebnisse ansehen** (als Lehrkraft): die Abgabe steht in der Liste, mit Note.
- [ ] **Fortschritt ansehen:** Klasse → „Fortschritt" — Tabelle je Kind, häufigste Fallen,
      „Was deine Klasse sieht".

## 4 · Wenn jemand nicht mehr reinkommt

- [ ] **Kind hat die PIN vergessen:** Roster → „PIN zurücksetzen" → das Kind tritt mit
      neuem Spitznamen + neuer PIN bei.
- [ ] **Lehrkraft hat die PIN vergessen, Weg A:** `/lehrkraft/pin-vergessen` → Mail mit
      Link → neue PIN. (Setzt den Brevo-Handgriff voraus; ohne ihn sagt die Seite das ehrlich.)
- [ ] **Lehrkraft hat die PIN vergessen, Weg B:** Großmeister vergibt auf
      `/admin/grandmaster` eine Übergangs-PIN; die Kollegin setzt sie unter
      `/admin/settings` sofort neu.
- [ ] **PIN selbst ändern:** `/admin/settings` — mit der alten PIN als Nachweis.

## 5 · Der Betriebs-Blick (nur Großmeister)

- [ ] `/admin/grandmaster` ganz nach unten: die Karte **„Betrieb"**.
      *Erwartet:* Code-Stand = derselbe Wert wie oben notiert · beide Register „✓ antwortet"
      · Datenbank-Endpunkt beginnt mit `ep-`.
      Steht dort bei einem Register „✗ antwortet nicht", ist die Liste darüber
      **unvollständig, nicht leer** — nichts löschen, melden.

## 6 · Auf dem Tablet

- [ ] Seite im Chrome öffnen → Menü → **„Zum Startbildschirm hinzufügen"**.
      *Erwartet:* das Angebot erscheint, danach liegt ein DomiGo-Icon auf dem
      Startbildschirm und öffnet die App ohne Adresszeile.
- [ ] Einmal quer und einmal hochkant durch eine Übungsrunde.

---

## Wenn etwas klemmt

Nicht selbst reparieren. Notieren: **welche Seite · was getan · was erwartet · was passiert**,
dazu Uhrzeit und der Code-Stand von oben. Das reicht einer Architekten-Sitzung, um
nachzumessen. Klassen bitte in keinem Fall archivieren — das sperrt Kinder aus und ist
derzeit nicht rückgängig zu machen.
