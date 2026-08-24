-- P-R8 · KLARNAMEN RAUS AUS DEM BESTAND DES KLASSEN-JOURNALS.
--
-- Der Code schreibt ab dieser Bahn nur noch Ids, Zahlen und Laengen. Die Zeilen,
-- die VOR ihr geschrieben wurden, tragen die Namen aber weiter: die Namensliste
-- jedes Imports, den Spitznamen jedes Beitritts, den Vornamen jeder Korrektur und
-- den Namen jeder Lehrkraft, die eine Klasse uebernommen hat. Diese Migration
-- schreibt sie auf die neue Form um.
--
-- ⚠ SIE VERAENDERT BESTANDSDATEN. Es gibt KEINE Ruecknahme — die Loeschung IST der
--   Zweck. Vor dem Lauf auf der Produktion gehoert ein Neon-Branch (Zeitpunkt-Kopie)
--   angelegt; danach ist der Name aus der Tabelle fort.
--
-- Jede Anweisung ist IDEMPOTENT (ein zweiter Lauf aendert 0 Zeilen, weil die
-- Bedingung dann auf nichts mehr passt) und gibt ihre eigene ZAHL zurueck: im Neon-
-- Editor ist »1 Zeile« ohne Wert die Falle, an der die 0070-Anwendung fast
-- vorbeigelaufen waere. Hier sagt jeder Lauf, wie viele Zeilen er gesaeubert hat.
--
-- Statt des jsonb-Operators `?` steht ueberall `jsonb_typeof(...) = 'string'` bzw.
-- `= 'array'`: das ist die genauere Bedingung (nur echte Werte der erwarteten Art)
-- und vermeidet ein Fragezeichen im SQL, das manche Treiber als Platzhalter lesen.

-- 1 · import: die NAMENSLISTE wird zur Zahl. Die Namen selbst stehen in den
--     Roster-Zeilen, die derselbe Import angelegt hat — das Journal brauchte sie nie.
WITH gesaeubert AS (
  UPDATE "domigo_v2"."roster_events"
  SET "payload" = jsonb_build_object($q$count$q$, jsonb_array_length("payload" -> $q$names$q$))
  WHERE "kind" = $q$import$q$ AND jsonb_typeof("payload" -> $q$names$q$) = $q$array$q$
  RETURNING 1
)
SELECT count(*)::int AS import_zeilen_gesaeubert FROM gesaeubert;
--> statement-breakpoint
-- 2 · claim: der SPITZNAME des Kindes wird zu seiner Laenge.
WITH gesaeubert AS (
  UPDATE "domigo_v2"."roster_events"
  SET "payload" = ("payload" - $q$displayName$q$)
                  || jsonb_build_object($q$displayNameLength$q$, length("payload" ->> $q$displayName$q$))
  WHERE "kind" = $q$claim$q$ AND jsonb_typeof("payload" -> $q$displayName$q$) = $q$string$q$
  RETURNING 1
)
SELECT count(*)::int AS claim_zeilen_gesaeubert FROM gesaeubert;
--> statement-breakpoint
-- 3 · rename: der korrigierte VORNAME wird zu seiner Laenge.
WITH gesaeubert AS (
  UPDATE "domigo_v2"."roster_events"
  SET "payload" = ("payload" - $q$givenName$q$)
                  || jsonb_build_object($q$givenNameLength$q$, length("payload" ->> $q$givenName$q$))
  WHERE "kind" = $q$rename$q$ AND jsonb_typeof("payload" -> $q$givenName$q$) = $q$string$q$
  RETURNING 1
)
SELECT count(*)::int AS rename_zeilen_gesaeubert FROM gesaeubert;
--> statement-breakpoint
-- 4 · teacher_claim: der NAME der Lehrkraft faellt ersatzlos weg — `toTeacherId`
--     steht daneben und zeigt auf die Zeile, die den Namen fuehrt.
WITH gesaeubert AS (
  UPDATE "domigo_v2"."roster_events"
  SET "payload" = "payload" - $q$displayName$q$
  WHERE "kind" = $q$teacher_claim$q$ AND jsonb_typeof("payload" -> $q$displayName$q$) = $q$string$q$
  RETURNING 1
)
SELECT count(*)::int AS teacher_claim_zeilen_gesaeubert FROM gesaeubert;
--> statement-breakpoint
-- 5 · DER BEWEIS. Muss 0 sein — sonst traegt noch eine Zeile ein Namensfeld.
--     `->` liefert NULL, wenn der Schluessel fehlt; ein vorhandener Schluessel mit
--     JSON-null wuerde also ebenfalls auffallen, und das ist beabsichtigt.
SELECT count(*)::int AS zeilen_mit_namensfeld
FROM "domigo_v2"."roster_events"
WHERE "payload" -> $q$names$q$ IS NOT NULL
   OR "payload" -> $q$displayName$q$ IS NOT NULL
   OR "payload" -> $q$givenName$q$ IS NOT NULL
   OR "payload" -> $q$nickname$q$ IS NOT NULL
   OR "payload" -> $q$name$q$ IS NOT NULL;
