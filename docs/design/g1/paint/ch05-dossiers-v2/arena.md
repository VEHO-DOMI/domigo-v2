# ch05 · p4 — Die große Bühne (GERÜST)

_Stand: **Gerüst**, gebaut von der Bahn L5-G1 als Kalibrier-Beifang. Der Raum ist 40×20, Oberfläche `normal`, Ausgang → `done`. Der Ost-Trakt (Schlagzeug-Verfolgung, Taktsprung-Gabe) ist Motor-Arbeit der Bahn L5-M2 und steht als Daten in `pending.md`._

## 1 · Auftrag
Die große Bühne: die Arena des Ton-Schluckers, mit dem Sieg-Trakt-Käfig der Sängerin.

## 3 · Begründungs-Manifest (Gerüst-Anker — am gebauten Gitter gemessen)

| id | Was | Anker | Fiktion | Mechanik | Gesetz | Kunst |
|---|---|---|---|---|---|---|
| tonschlucker | Der Ton-Schlucker | **(20,10)** | der Wächter, der den Ton der Band verschluckt hat | `guardian` Tier M = vier Knoten; die Fenster und der Noten-Mix sind Daten der Bahn L5-M2 | entity-reachable | fb-ent-generic |
| p4-cage-singer | Notenständer-Käfig — die Sängerin | **(33,15)** | Platzhalter der Bahn L5-G2 — die Fiktion des Raums wird dort geschnitten | Sieg-Trakt-Käfig nach dem Muster von ch01 — er öffnet erst nach dem Wächter | cage-law · cage-captive-key | fb-ent-generic |

## 10 · Bau-Vertrag

- Spawn `S` **(3,15)** · Ausgang `X` **(38,15)** — nie in die letzten zwei Spalten, das Erreichbarkeits-Modell betritt sie nicht.
- Keine Tinte im Gerüst ⇒ keine Schwelle, kein Anker (das Gesetz `checkpoint-count` zählt Anker je Tinten-Querung).
- **Dieser Raum wird von L5-G2 vollständig ersetzt.** Was hier steht, ist der Bindungs-Vertrag mit den Karten der T-Bahn, nicht der fertige Raum.

## 11 · Fix-Protokoll

- 2026-09-03 · L5-G1: Gerüst angelegt. Anker maschinell aus dem Gitter gezogen.
