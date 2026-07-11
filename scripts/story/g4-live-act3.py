#!/usr/bin/env python3
"""FOURTEEN: LIVE — Act 3 authoring (ch11–ch13) per docs/handover/19 §3–4.

ch11 the archive (the eight-year-old unfinished story) · ch12 the planetarium
(keystone confrontation STAGED per w10.* via FlagGate) · ch13 the three-way
finale (w13.live | w13.print | w13.direktorin) + the honest re-vote epilogue
(Sydney wins — for real this time) + the sign-off flagLines that consume all
three F3 flags. VS-14: no taskSlots on branch-exclusive scenes.
"""
import json, os, sys

sys.path.insert(0, os.path.dirname(__file__))
from importlib import import_module

act1 = import_module("g4-live-act1")
sc, link, ci, sid = act1.sc, act1.link, act1.ci, act1.sid
BUNDLE, SID = act1.BUNDLE, act1.SID

# ═══════════════════════════════════════════════════════════════════════════
# ch11 · u11 Ready for reading — "The Archive"
# ═══════════════════════════════════════════════════════════════════════════
CH11 = ("The Archive", "Das Archiv", link([
    sc(11, 1, "narrator",
       "The librarian catches the crew reading in a corner and makes them an offer: help clear up the basement archive, keep what you learn.",
       "Die Bibliothekarin erwischt die Crew beim Lesen in einer Ecke und macht ihnen ein Angebot: Helft, das Keller-Archiv aufzuräumen, und behaltet, was ihr lernt.",
       [("librarian", "Bibliothekarin"), ("basement", "Keller"), ("offer", "Angebot"), ("clear up", "aufräumen"), ("keep", "behalten")],
       slots=[("name-it", "g4u11.w.clear-up")]),
    sc(11, 2, "ben",
       "A basement full of old paper. If I am not back in an hour, tell my story. Make me braver in it.",
       "Ein Keller voller altem Papier. Wenn ich in einer Stunde nicht zurück bin, erzählt meine Geschichte. Macht mich darin mutiger.",
       [("braver", "mutiger"), ("paper", "Papier"), ("hour", "Stunde")]),
    sc(11, 3, "narrator",
       "Boxes of the old school mag — thirty years of it. The crew teaches itself to read archives: date, editor, what changed between issues.",
       "Kisten mit der alten Schülerzeitung — dreißig Jahre davon. Die Crew bringt sich selbst bei, Archive zu lesen: Datum, Redaktion, was sich zwischen den Ausgaben ändert.",
       [("boxes", "Kisten"), ("issues", "Ausgaben"), ("editor", "Redaktion"), ("date", "Datum")],
       slots=[("fix-it", "g4u11.gi.reflexive-pronouns.cp.001")]),
    sc(11, 4, "sara",
       "I prefer novels. This is non-fiction now — our school, eight years ago. Look at this issue. LOOK.",
       "Ich mag lieber Romane. Das hier ist jetzt Sachliteratur — unsere Schule, vor acht Jahren. Schaut euch diese Ausgabe an. SCHAUT.",
       [("novels", "Romane"), ("non-fiction", "Sachliteratur"), ("prefer", "lieber mögen")],
       slots=[("name-it", "g4u11.w.non-fiction")]),
    sc(11, 5, "narrator",
       "Eight years ago: a ski-week vote. Three resorts. And a sponsor's sun-and-plane logo in the corner of the page.",
       "Vor acht Jahren: eine Abstimmung über die Schiwoche. Drei Schigebiete. Und das Sonne-und-Flugzeug-Logo eines Sponsors in der Ecke der Seite.",
       [("resorts", "Schigebiete"), ("sponsor", "Sponsor"), ("corner", "Ecke"), ("logo", "Logo")]),
    sc(11, 6, "leo",
       "Issue 4 announces a big investigation: 'Was our vote steered? Part two next issue.' There is no part two. Issue 5 has a hole where the article should be.",
       "Ausgabe 4 kündigt eine große Recherche an: „Wurde unsere Abstimmung gelenkt? Teil zwei in der nächsten Ausgabe.“ Es gibt keinen Teil zwei. Ausgabe 5 hat ein Loch, wo der Artikel sein sollte.",
       [("steered", "gelenkt"), ("investigation", "Recherche"), ("hole", "Loch"), ("article", "Artikel"), ("announces", "kündigt an")]),
    sc(11, 7, "narrator",
       "Not a torn-out page — a planned one that never came. The table of contents names it. The pages jump past it. An editorial hole, printed and bound.",
       "Keine herausgerissene Seite — eine geplante, die nie kam. Das Inhaltsverzeichnis nennt sie. Die Seiten springen daran vorbei. Ein redaktionelles Loch, gedruckt und gebunden.",
       [("torn-out", "herausgerissen"), ("table of contents", "Inhaltsverzeichnis"), ("bound", "gebunden"), ("planned", "geplant")]),
    sc(11, 8, "leah",
       "Somebody stopped that story. Eight years later, SunWays runs the same play — because last time, stopping the story worked.",
       "Jemand hat diese Geschichte gestoppt. Acht Jahre später fährt SunWays denselben Trick — weil das Stoppen der Geschichte letztes Mal funktioniert hat.",
       [("stopped", "gestoppt"), ("play", "Trick"), ("worked", "funktioniert")]),
    sc(11, 9, "sara",
       "The mag looks innocent. The hole is not. We did not inherit a story, team — we inherited an UNFINISHED one.",
       "Die Zeitung sieht unschuldig aus. Das Loch ist es nicht. Wir haben keine Geschichte geerbt, Leute — wir haben eine UNVOLLENDETE geerbt.",
       [("innocent", "unschuldig"), ("inherited", "geerbt"), ("unfinished", "unvollendet")],
       slots=[("name-it", "g4u11.w.innocent")]),
    sc(11, 10, "narrator",
       "The crew photographs everything and puts the boxes back neatly — archives keep those who keep them.",
       "Die Crew fotografiert alles und stellt die Kisten ordentlich zurück — Archive schützen die, die sie pflegen.",
       [("photographs", "fotografiert"), ("neatly", "ordentlich")],
       slots=[("fix-it", "g4u11.gi.reflexive-pronouns.cp.002")]),
    sc(11, 11, "you",
       "On the wall, the timeline gains a left edge: eight years. This is bigger than one teacher. It always was.",
       "An der Wand bekommt die Zeitleiste einen linken Rand: acht Jahre. Das ist größer als ein Lehrer. Das war es immer.",
       [("timeline", "Zeitleiste"), ("edge", "Rand"), ("bigger", "größer")],
       slots=[("recap", "g4u11.ci.the-hole.mc.001")]),
    sc(11, 12, "ben",
       "So the school mag started this fight and never got to finish it. Anyone else getting goosebumps? Just me? Fine.",
       "Also hat die Schülerzeitung diesen Kampf angefangen und durfte ihn nie beenden. Bekommt noch wer Gänsehaut? Nur ich? Gut.",
       [("goosebumps", "Gänsehaut"), ("fight", "Kampf"), ("finish", "beenden")],
       next_="END"),
])[:])

# ═══════════════════════════════════════════════════════════════════════════
# ch12 · u12 Space — "The Planetarium" (staged per w10.* via FlagGate)
# ═══════════════════════════════════════════════════════════════════════════
CH12 = ("The Planetarium", "Das Planetarium", link([
    sc(12, 1, "narrator",
       "Space week ends with the big evening: the whole school at the planetarium. Fake stars, real people — the crew, Steiner, Brandt, Direktorin Huber, everyone under one dome.",
       "Die Weltraumwoche endet mit dem großen Abend: die ganze Schule im Planetarium. Falsche Sterne, echte Menschen — die Crew, Steiner, Brandt, Direktorin Huber, alle unter einer Kuppel.",
       [("dome", "Kuppel"), ("stars", "Sterne"), ("planetarium", "Planetarium")]),
    sc(12, 2, "ben",
       "The show says the universe is expanding. Same as our story. I would like ONE thing this year that stays small.",
       "Die Show sagt, das Universum dehnt sich aus. Genau wie unsere Story. Ich hätte gern EINE Sache dieses Jahr, die klein bleibt.",
       [("universe", "Universum"), ("expanding", "dehnt sich aus"), ("stays", "bleibt")]),
    sc(12, 3, "narrator",
       "The commander of the fake spaceship counts down. Gravity, orbits, the works. The crew is not watching the ceiling.",
       "Der Kommandant des falschen Raumschiffs zählt runter. Schwerkraft, Umlaufbahnen, das volle Programm. Die Crew schaut nicht an die Decke.",
       [("commander", "Kommandant"), ("spaceship", "Raumschiff"), ("gravity", "Schwerkraft"), ("orbits", "Umlaufbahnen"), ("ceiling", "Decke")],
       slots=[("name-it", "g4u12.w.crew")]),
    sc(12, 4, "narrator",
       "In the interval, it happens — the way it was set up to happen.",
       "In der Pause passiert es — so, wie es eingefädelt war.",
       [("interval", "Pause"), ("set up", "eingefädelt")],
       next_={"kind": "flag", "flag": "w10.private", "then": sid(12, 5), "else": sid(12, 8)}),
    # branch: PRIVATE staging (Steiner had seen the file already — no slots)
    sc(12, 5, "steiner",
       "You four. You showed me everything and printed nothing. I have thought about it every hour since.",
       "Ihr vier. Ihr habt mir alles gezeigt und nichts veröffentlicht. Ich habe seitdem jede Stunde darüber nachgedacht.",
       [("showed", "gezeigt"), ("printed", "veröffentlicht"), ("since", "seitdem")]),
    sc(12, 6, "steiner",
       "I signed because twelve kids cannot pay. That is the truth and it is not an excuse. Tomorrow I tell Direktorin Huber myself — you pushed nothing. You waited. Thank you for that.",
       "Ich habe unterschrieben, weil zwölf Kinder nicht zahlen können. Das ist die Wahrheit, und sie ist keine Entschuldigung. Morgen sage ich es Direktorin Huber selbst — ihr habt nichts erzwungen. Ihr habt gewartet. Danke dafür.",
       [("excuse", "Entschuldigung"), ("pushed", "erzwungen"), ("waited", "gewartet"), ("signed", "unterschrieben")]),
    sc(12, 7, "narrator",
       "Brandt appears at his elbow, smiling like a brochure — and finds nothing to deflect. The quiet way turned out to be the fast way.",
       "Brandt taucht neben ihm auf, lächelt wie ein Prospekt — und findet nichts zum Abwiegeln. Der leise Weg war am Ende der schnelle.",
       [("appears", "taucht auf"), ("deflect", "abwiegeln"), ("turned out", "stellte sich heraus")],
       next_=sid(12, 11)),
    # branch: PUBLIC staging (the formal interview happened on camera — no slots)
    sc(12, 8, "narrator",
       "The interview had run that afternoon, formal and cold: card one, card two, the file on the table, the camera steady.",
       "Das Interview war am Nachmittag gelaufen, formell und kühl: Karte eins, Karte zwei, die Akte auf dem Tisch, die Kamera ruhig.",
       [("formal", "formell"), ("steady", "ruhig"), ("afternoon", "Nachmittag")]),
    sc(12, 9, "steiner",
       "On camera I said three sentences: I signed it. I had my reasons. I will explain them to the school, not to a lens.",
       "Vor der Kamera habe ich drei Sätze gesagt: Ich habe unterschrieben. Ich hatte meine Gründe. Ich erkläre sie der Schule, nicht einem Objektiv.",
       [("lens", "Objektiv"), ("reasons", "Gründe"), ("sentences", "Sätze")]),
    sc(12, 10, "narrator",
       "Now, under the dome, Brandt works the room — 'sponsoring is friendship' — but every parent has already seen the stiff little interview. Deflection needs darkness. The clip took it away.",
       "Jetzt, unter der Kuppel, arbeitet Brandt den Saal ab — „Sponsoring ist Freundschaft“ — aber alle Eltern haben das steife kleine Interview schon gesehen. Abwiegeln braucht Dunkelheit. Der Clip hat sie ihm genommen.",
       [("deflection", "das Abwiegeln"), ("stiff", "steif"), ("parent", "Eltern"), ("darkness", "Dunkelheit")],
       next_=sid(12, 11)),
    # reconverge
    sc(12, 11, "narrator",
       "Direktorin Huber turns up beside the crew with two cups of tea and one sentence: 'My office. Monday. Bring everything.'",
       "Direktorin Huber taucht neben der Crew auf, mit zwei Tassen Tee und einem Satz: „Mein Büro. Montag. Bringt alles mit.“",
       [("turns up", "taucht auf"), ("cups", "Tassen"), ("office", "Büro")],
       slots=[("fix-it", "g4u12.gi.phrasal-verbs.cp.001")]),
    sc(12, 12, "sara",
       "The story has gravity now. Everyone in this dome can feel it pulling.",
       "Die Geschichte hat jetzt Schwerkraft. Jeder unter dieser Kuppel spürt, wie sie zieht.",
       [("pulling", "ziehen"), ("feel", "spüren")],
       slots=[("name-it", "g4u12.w.gravity")]),
    sc(12, 13, "narrator",
       "Above them, fake stars. The narrator of the space show says from far enough away, everything looks small. We are not far enough away.",
       "Über ihnen falsche Sterne. Der Erzähler der Weltraumshow sagt, von weit genug weg sieht alles klein aus. Wir sind nicht weit genug weg.",
       [("above", "über"), ("far", "weit")],
       slots=[("recap", "g4u12.ci.the-dome.mc.001")]),
    sc(12, 14, "leah",
       "Monday, then. We hand our story over — or we do not. One weekend to work out who we are.",
       "Montag also. Wir geben unsere Geschichte ab — oder nicht. Ein Wochenende, um herauszufinden, wer wir sind.",
       [("hand", "abgeben"), ("work out", "herausfinden"), ("weekend", "Wochenende")],
       slots=[("fix-it", "g4u12.gi.phrasal-verbs.cp.002")],
       next_="END"),
])[:])

# ═══════════════════════════════════════════════════════════════════════════
# ch13 · u13 A school mag — "Print / Live / The Desk" + FORK 3 + epilogue
# ═══════════════════════════════════════════════════════════════════════════
CH13 = ("Print / Live / The Desk", "Druck / Live / Der Schreibtisch", link([
    sc(13, 1, "narrator",
       "Sunday, the studio. On the table: the file, complete. Poster, lists, catalogue, banner, agreement, the twelve names, the eight-year-old hole. Proven twice over.",
       "Sonntag, das Studio. Auf dem Tisch: die Akte, vollständig. Plakat, Listen, Katalog, Banner, Vereinbarung, die zwölf Namen, das acht Jahre alte Loch. Doppelt bewiesen.",
       [("complete", "vollständig"), ("proven", "bewiesen"), ("file", "Akte"), ("agreement", "Vereinbarung")]),
    sc(13, 2, "ben",
       "Honestly? A year ago we filmed lunch reviews. Now we sit here holding a school's whole truth. Growth is terrifying.",
       "Ehrlich? Vor einem Jahr haben wir Essensrezensionen gefilmt. Jetzt sitzen wir hier und halten die ganze Wahrheit einer Schule. Wachsen ist furchteinflößend.",
       [("honestly", "ehrlich"), ("growth", "das Wachsen"), ("truth", "Wahrheit"), ("holding", "halten")],
       slots=[("name-it", "g4u13.w.honestly")]),
    sc(13, 3, "sara",
       "Three roads, and every one of them ends with the truth out. Live special. Or the mag reborn — a printed special edition. Or Huber's desk first.",
       "Drei Wege, und jeder endet damit, dass die Wahrheit rauskommt. Live-Spezial. Oder die Zeitung neu geboren — eine gedruckte Sonderausgabe. Oder zuerst Hubers Schreibtisch.",
       [("roads", "Wege"), ("reborn", "neu geboren"), ("edition", "Ausgabe"), ("desk", "Schreibtisch")],
       slots=[("name-it", "g4u13.w.edition")]),
    sc(13, 4, "narrator",
       "Word-work first — the mag's old masthead needs new words built from old ones. Then the choice.",
       "Zuerst Wortarbeit — der alte Zeitungskopf braucht neue Wörter, gebaut aus alten. Dann die Entscheidung.",
       [("masthead", "Zeitungskopf"), ("built", "gebaut"), ("choice", "Entscheidung")],
       slots=[("fix-it", "g4u13.gi.word-formation.cp.001")]),
    sc(13, 5, "you",
       "Novak said it in week one: live is a power tool. Power tools need guards. Editor's call — and this time the editor is all of us. I count to three.",
       "Novak hat es in Woche eins gesagt: Live ist ein Elektrowerkzeug. Elektrowerkzeuge brauchen Schutz. Entscheidung der Redaktion — und diesmal ist die Redaktion wir alle. Ich zähle bis drei.",
       [("power tool", "Elektrowerkzeug"), ("guards", "Schutz"), ("count", "zählen")],
       next_=[
           {"id": "live", "textEn": "The live special. Maximum truth, the school watches together — and carries it together.",
            "scaffoldDe": "Das Live-Spezial. Maximale Wahrheit, die Schule schaut gemeinsam zu — und trägt es gemeinsam.",
            "next": sid(13, 6), "sets": ["w13.live"]},
           {"id": "print", "textEn": "Revive the school mag. The measured special issue — and the eight-year-old hole finally filled.",
            "scaffoldDe": "Die Schülerzeitung wiederbeleben. Die ruhige Sonderausgabe — und das acht Jahre alte Loch endlich gefüllt.",
            "next": sid(13, 9), "sets": ["w13.print"]},
           {"id": "desk", "textEn": "Huber's desk first. The institution repairs itself — and FOURTEEN reports the repair.",
            "scaffoldDe": "Zuerst Hubers Schreibtisch. Die Institution repariert sich selbst — und FOURTEEN berichtet über die Reparatur.",
            "next": sid(13, 12), "sets": ["w13.direktorin"]},
       ]),
    # ── branch: LIVE (no slots)
    sc(13, 6, "narrator",
       "Thursday, 18:00. The school watches together — gym, corridors, phones. Leah reads the timeline straight, no music, no zoom. Then she hands the microphone across the table.",
       "Donnerstag, 18:00. Die Schule schaut gemeinsam zu — Turnhalle, Gänge, Handys. Leah liest die Zeitleiste vor, ehrlich, ohne Musik, ohne Zoom. Dann reicht sie das Mikrofon über den Tisch.",
       [("microphone", "Mikrofon"), ("straight", "ehrlich"), ("hands", "reicht")],
       flag_lines=[
           ("w10.private",
            "Thursday, 18:00. The school watches together. And because the crew once waited, Steiner sits WITH them at the table — he asked to. He tells his reason himself, warm and steady, to every family at once.",
            "Donnerstag, 18:00. Die Schule schaut gemeinsam zu. Und weil die Crew damals gewartet hat, sitzt Steiner MIT ihnen am Tisch — er hat darum gebeten. Er erzählt seinen Grund selbst, warm und ruhig, allen Familien gleichzeitig.",
            [("waited", "gewartet"), ("reason", "Grund"), ("steady", "ruhig"), ("family", "Familie"), ("asked", "gebeten"), ("watches", "schaut zu"), ("table", "Tisch")]),
           ("w10.public",
            "Thursday, 18:00. The school watches together. Steiner appears only in the stiff formal interview clip — three sentences, a closed face. True, protected, cold. The crew plays it uncut and lets the school decide.",
            "Donnerstag, 18:00. Die Schule schaut gemeinsam zu. Steiner erscheint nur im steifen, formellen Interview-Clip — drei Sätze, ein verschlossenes Gesicht. Wahr, geschützt, kühl. Die Crew zeigt ihn ungeschnitten und lässt die Schule entscheiden.",
            [("stiff", "steif"), ("uncut", "ungeschnitten"), ("protected", "geschützt"), ("appears", "erscheint"), ("decide", "entscheiden"), ("watches", "schaut zu"), ("sentences", "Sätze")]),
       ]),
    sc(13, 7, "narrator",
       "SunWays withdraws by Friday morning — a two-line statement, very smooth, very final. The vote is cancelled and reset. The school is loud for days, and honest all the way through.",
       "SunWays zieht sich bis Freitagfrüh zurück — ein Zwei-Zeilen-Statement, sehr glatt, sehr endgültig. Die Abstimmung wird abgesagt und neu aufgesetzt. Die Schule ist tagelang laut, und durch und durch ehrlich.",
       [("withdraws", "zieht sich zurück"), ("statement", "Statement"), ("cancelled", "abgesagt"), ("reset", "neu aufgesetzt"), ("smooth", "glatt")]),
    sc(13, 8, "ben",
       "We were honest tonight. Were we kind? I keep asking it. I think the answer is: as kind as live allows. Steiner's face carried it in front of everyone.",
       "Wir waren heute Abend ehrlich. Waren wir gütig? Ich frage es mich dauernd. Ich glaube, die Antwort ist: so gütig, wie live es erlaubt. Steiners Gesicht hat es vor allen getragen.",
       [("kind", "gütig"), ("allows", "erlaubt"), ("carried", "getragen")],
       next_=sid(13, 15)),
    # ── branch: PRINT (no slots)
    sc(13, 9, "narrator",
       "They find the mag's old adviser, dust off the layout files, and build ISSUE #1 in nine days. Page five is the eight-year-old story — finished at last, sources and all. Next to it, their own.",
       "Sie finden den alten Betreuungslehrer der Zeitung, entstauben die Layout-Dateien und bauen AUSGABE #1 in neun Tagen. Seite fünf ist die acht Jahre alte Geschichte — endlich fertig, mit allen Quellen. Daneben ihre eigene.",
       [("adviser", "Betreuungslehrer"), ("dust off", "entstauben"), ("layout", "Layout"), ("sources", "Quellen"), ("finished", "fertig")],
       flag_lines=[
           ("w10.private",
            "They build ISSUE #1 in nine days. On page seven, a short piece Steiner wrote HIMSELF — 'What I did and why' — because the crew had given him the room to choose his own words. Print holds warmth better than anyone expected.",
            "Sie bauen AUSGABE #1 in neun Tagen. Auf Seite sieben ein kurzer Text, den Steiner SELBST geschrieben hat — „Was ich getan habe und warum“ — weil die Crew ihm den Raum gelassen hat, seine eigenen Worte zu wählen. Papier hält Wärme besser, als alle dachten.",
            [("piece", "Text"), ("warmth", "Wärme"), ("expected", "dachten"), ("room", "Raum"), ("choose", "wählen"), ("build", "bauen"), ("days", "Tage")]),
           ("w10.public",
            "They build ISSUE #1 in nine days. Steiner's formal interview is printed word for word, unsoftened — he chose silence beyond his three sentences, and the mag respects it. The page is correct, and a little cold, and everyone feels both.",
            "Sie bauen AUSGABE #1 in neun Tagen. Steiners formelles Interview wird Wort für Wort gedruckt, ungeglättet — mehr als seine drei Sätze wollte er nicht sagen, und die Zeitung respektiert das. Die Seite ist korrekt, und ein wenig kühl, und alle spüren beides.",
            [("printed", "gedruckt"), ("unsoftened", "ungeglättet"), ("respects", "respektiert"), ("silence", "Schweigen"), ("beyond", "über ... hinaus"), ("build", "bauen"), ("days", "Tage")]),
       ]),
    sc(13, 10, "narrator",
       "For one day, the channel's comments call the crew cowards for not going live. The crew reads them at the studio table, eating the last sponsor-free pizza, entirely fine with it.",
       "Einen Tag lang nennen die Kommentare am Kanal die Crew Feiglinge, weil sie nicht live gegangen ist. Die Crew liest sie am Studiotisch, isst die letzte sponsorfreie Pizza und ist damit völlig im Reinen.",
       [("cowards", "Feiglinge"), ("comments", "Kommentare"), ("entirely", "völlig")]),
    sc(13, 11, "narrator",
       "Novak reprints the piece in the local paper with one added line: 'Reported by the FOURTEEN editorial team.' The school reads instead of watching — slower, deeper, twice.",
       "Novak druckt den Artikel in der Lokalzeitung nach, mit einer zusätzlichen Zeile: „Recherchiert vom Redaktionsteam von FOURTEEN.“ Die Schule liest, statt zu schauen — langsamer, tiefer, zweimal.",
       [("reprints", "druckt nach"), ("added", "zusätzlich"), ("editorial team", "Redaktionsteam"), ("instead", "statt")],
       next_=sid(13, 15)),
    # ── branch: DESK (no slots)
    sc(13, 12, "narrator",
       "Monday, 7:50. The file lands on Huber's desk with all four of them standing there. She reads for eleven minutes without one word. Then she looks up.",
       "Montag, 7:50. Die Akte landet auf Hubers Schreibtisch, alle vier stehen dabei. Sie liest elf Minuten lang ohne ein Wort. Dann schaut sie auf.",
       [("lands", "landet"), ("minutes", "Minuten"), ("without", "ohne")]),
    sc(13, 13, "direktorin",
       "You could have gone live with this. You came here. I will not forget either fact. Now watch what an institution does when children do its homework.",
       "Ihr hättet damit live gehen können. Ihr seid hierhergekommen. Ich werde keine der beiden Tatsachen vergessen. Und jetzt schaut zu, was eine Institution tut, wenn Kinder ihre Hausaufgaben machen.",
       [("institution", "Institution"), ("fact", "Tatsache"), ("forget", "vergessen"), ("homework", "Hausaufgaben")],
       flag_lines=[
           ("w10.private",
            "You showed Herr Steiner the file before you showed me. He told me so himself, this morning, standing where you stand. That order of events saved a man's dignity — I will not forget it. Now watch what an institution does when children do its homework.",
            "Ihr habt Herrn Steiner die Akte gezeigt, bevor ihr sie mir gezeigt habt. Das hat er mir selbst erzählt, heute früh, genau da, wo ihr jetzt steht. Diese Reihenfolge hat die Würde eines Menschen gerettet — das vergesse ich nicht. Und jetzt schaut zu, was eine Institution tut, wenn Kinder ihre Hausaufgaben machen.",
            [("dignity", "Würde"), ("order", "Reihenfolge"), ("saved", "gerettet"), ("institution", "Institution"), ("homework", "Hausaufgaben"), ("forget", "vergessen"), ("stand", "stehen")]),
           ("w10.public",
            "I watched your formal interview twice. Correct, protected, cold — like a courtroom. You kept every rule and gave him nothing to fear but the truth. I can work with that. Now watch what an institution does when children do its homework.",
            "Ich habe euer formelles Interview zweimal angesehen. Korrekt, geschützt, kühl — wie ein Gerichtssaal. Ihr habt jede Regel gehalten und ihm nichts zu fürchten gegeben außer der Wahrheit. Damit kann ich arbeiten. Und jetzt schaut zu, was eine Institution tut, wenn Kinder ihre Hausaufgaben machen.",
            [("courtroom", "Gerichtssaal"), ("fear", "fürchten"), ("rule", "Regel"), ("institution", "Institution"), ("homework", "Hausaufgaben"), ("protected", "geschützt"), ("truth", "Wahrheit")]),
       ]),
    sc(13, 14, "narrator",
       "By Wednesday: agreement cancelled, re-vote announced, and the trip fund made OFFICIAL — Steiner keeps his job with conditions, and his reason becomes a school programme with a budget line. FOURTEEN reports the outcome, calmly, completely. Some viewers never learn how close it came. The crew knows.",
       "Bis Mittwoch: Vereinbarung gekündigt, Neuwahl angekündigt, und der Reise-Fonds wird OFFIZIELL — Steiner behält seinen Job mit Auflagen, und sein Grund wird ein Schulprogramm mit Budgetzeile. FOURTEEN berichtet über das Ergebnis, ruhig, vollständig. Manche Zuschauer erfahren nie, wie knapp es war. Die Crew weiß es.",
       [("cancelled", "gekündigt"), ("conditions", "Auflagen"), ("programme", "Programm"), ("outcome", "Ergebnis"), ("viewers", "Zuschauer"), ("close", "knapp")],
       next_=sid(13, 15)),
    # ── reconverge: the honest re-vote
    sc(13, 15, "narrator",
       "Then the school votes again. Real ballots, sealed box, two parent observers and Amelie guarding the count like a hawk in year two.",
       "Dann stimmt die Schule noch einmal ab. Echte Stimmzettel, versiegelte Box, zwei Eltern als Beobachter und Amelie, die die Auszählung bewacht wie ein Falke aus der zweiten Klasse.",
       [("ballots", "Stimmzettel"), ("sealed", "versiegelt"), ("observers", "Beobachter"), ("count", "Auszählung"), ("hawk", "Falke")]),
    sc(13, 16, "narrator",
       "The result, read aloud twice because the hall will not stop laughing: Sydney. Sydney wins the honest vote.",
       "Das Ergebnis, zweimal laut vorgelesen, weil die Aula nicht aufhört zu lachen: Sydney. Sydney gewinnt die ehrliche Abstimmung.",
       [("result", "Ergebnis"), ("aloud", "laut"), ("laughing", "lachen")]),
    sc(13, 17, "ben",
       "Same city. Different school. THAT is the whole story, right there.",
       "Gleiche Stadt. Andere Schule. DAS ist die ganze Geschichte, genau da.",
       [("same", "gleiche"), ("different", "andere"), ("whole", "ganze")],
       slots=[("recap", "g4u13.ci.the-revote.mc.001")]),
    sc(13, 18, "narrator",
       "And the twelve names on Steiner's list are on the passenger list too. Ben checked it himself. Twice.",
       "Und die zwölf Namen von Steiners Liste stehen auch auf der Passagierliste. Ben hat es selbst geprüft. Zweimal.",
       [("passenger", "Passagier-"), ("checked", "geprüft"), ("twice", "zweimal")],
       slots=[("fix-it", "g4u13.gi.word-formation.cp.002")]),
    sc(13, 19, "leah",
       "Last segment of the season. We found a poster, and behind it a plan, and behind the plan a person, and behind the person a reason. We told all four layers. That is the job.",
       "Letztes Segment der Saison. Wir haben ein Plakat gefunden, dahinter einen Plan, dahinter einen Menschen, dahinter einen Grund. Wir haben alle vier Schichten erzählt. Das ist der Job.",
       [("layers", "Schichten"), ("behind", "dahinter"), ("segment", "Segment")],
       flag_lines=[
           ("w13.live",
            "Last segment of the season — live, of course, one year after our first honest broadcast. We told the truth with everyone watching, and we paid the live price for it. We would pay it again. FOURTEEN, out.",
            "Letztes Segment der Saison — live natürlich, ein Jahr nach unserer ersten ehrlichen Sendung. Wir haben die Wahrheit erzählt, während alle zugeschaut haben, und wir haben den Live-Preis dafür bezahlt. Wir würden ihn wieder zahlen. FOURTEEN, Ende.",
            [("broadcast", "Sendung"), ("price", "Preis"), ("paid", "bezahlt"), ("watching", "zuschauen"), ("truth", "Wahrheit"), ("segment", "Segment")]),
           ("w13.print",
            "Last segment of the season — and beside the camera, a stack of ISSUE #1, still smelling of ink. We learned that slow can be a kind of brave. The hole from eight years ago is closed. FOURTEEN, out.",
            "Letztes Segment der Saison — und neben der Kamera ein Stapel von AUSGABE #1, noch mit Druckerschwärze-Geruch. Wir haben gelernt, dass langsam eine Form von mutig sein kann. Das Loch von vor acht Jahren ist geschlossen. FOURTEEN, Ende.",
            [("stack", "Stapel"), ("ink", "Druckerschwärze"), ("brave", "mutig"), ("closed", "geschlossen"), ("slow", "langsam"), ("segment", "Segment")]),
           ("w13.direktorin",
            "Last segment of the season — the quietest big story this school will ever have. We handed the truth to the person whose job it is, and the system worked, because we made it work. Somebody had to see it up close. That was us. FOURTEEN, out.",
            "Letztes Segment der Saison — die leiseste große Geschichte, die diese Schule je haben wird. Wir haben die Wahrheit der Person übergeben, deren Job sie ist, und das System hat funktioniert, weil wir es zum Funktionieren gebracht haben. Irgendwer musste es aus der Nähe sehen. Das waren wir. FOURTEEN, Ende.",
            [("handed", "übergeben"), ("system", "System"), ("worked", "funktioniert"), ("quietest", "leiseste"), ("close", "Nähe"), ("segment", "Segment")]),
       ]),
    sc(13, 20, "narrator",
       "The red light goes steady, then dark. Season two ends the way season one ended: messy, honest — and together.",
       "Das rote Licht leuchtet ruhig, dann dunkel. Staffel zwei endet, wie Staffel eins geendet hat: chaotisch, ehrlich — und gemeinsam.",
       [("steady", "ruhig"), ("messy", "chaotisch"), ("season", "Staffel"), ("together", "gemeinsam")],
       next_="END"),
])[:])

CI_ITEMS = [
    ci("g4u11.ci.the-hole.mc.001",
       "What did the crew find in the old school mags?",
       "An investigation that was announced but never printed.",
       ["A love letter from a teacher.", "The winner of this year's vote.", "Leo's baby photos."],
       [("investigation", "Recherche"), ("announced", "angekündigt"), ("printed", "gedruckt"), ("mags", "Zeitungen"), ("winner", "Sieger")],
       "Ausgabe 4 kündigt Teil zwei an — und Ausgabe 5 hat ein Loch.",
       "Vor acht Jahren wollte die Schülerzeitung eine gelenkte Abstimmung aufdecken. Der Artikel erschien nie — die Crew erbt die unvollendete Geschichte."),
    ci("g4u12.ci.the-dome.mc.001",
       "Why does the planetarium evening matter?",
       "The whole cast of the story is in one room.",
       ["The crew films the fake stars for the channel.", "Ben wins the space quiz.", "The vote happens under the dome."],
       [("dome", "Kuppel"), ("cast", "alle Beteiligten"), ("quiz", "Quiz"), ("matter", "wichtig sein")],
       "Crew, Steiner, Brandt, Huber — alle unter einer Kuppel, in einer Pause.",
       "Die Weltraumwoche bringt alle Beteiligten in einen Raum. Genau dort passiert die Konfrontation — so, wie die Crew sie in Kapitel 10 angelegt hat."),
    ci("g4u13.ci.the-revote.mc.001",
       "Who wins the honest re-vote?",
       "Sydney — the same city, fairly this time.",
       ["Dublin, because the crew pitched it.", "New York, in Ben's honour.", "Nobody — the trip is cancelled."],
       [("fairly", "fair / ehrlich"), ("honour", "zu Ehren"), ("cancelled", "abgesagt"), ("re-vote", "Neuwahl")],
       "Das Ergebnis wird zweimal vorgelesen, weil die Aula lacht.",
       "Sydney gewinnt wieder — aber diesmal echt. Ben sagt es am besten: Gleiche Stadt, andere Schule. Es ging nie um das Reiseziel, sondern um die ehrliche Wahl."),
]


def run():
    sp = os.path.join(BUNDLE, "story.json")
    story = json.load(open(sp))
    for unit, (t_en, t_de, scenes) in [(11, CH11), (12, CH12), (13, CH13)]:
        chapter = {"id": f"{SID}.ch{unit:02d}", "unit": unit, "titleEn": t_en, "titleDe": t_de, "scenes": scenes}
        story["chapters"] = [c for c in story["chapters"] if c["unit"] != unit] + [chapter]
    story["chapters"].sort(key=lambda c: c["unit"])
    json.dump(story, open(sp, "w"), ensure_ascii=False, indent=1)

    cp = os.path.join(BUNDLE, "comprehension.json")
    comp = json.load(open(cp))
    comp["items"] = [i for i in comp["items"] if i["id"] not in {c["id"] for c in CI_ITEMS}] + CI_ITEMS
    json.dump(comp, open(cp, "w"), ensure_ascii=False, indent=1)

    import glob
    all_ids = set()
    for f in glob.glob(os.path.join(act1.ROOT, "content", "corpus", "units", "g4-u*", "*.json")):
        if f.endswith(("vocab.json", "grammar.json")):
            for it in json.load(open(f)).get("items", []):
                all_ids.add(it["id"])
    for _, (_, _, scenes) in [(11, CH11), (12, CH12), (13, CH13)]:
        for s in scenes:
            for t in s["taskSlots"]:
                if ".ci." not in t["itemId"]:
                    assert t["itemId"] in all_ids, f"phantom itemId {t['itemId']}"
    print("act3 applied: ch11–ch13 (FlagGate staging + 3-way F3 + epilogue),", len(CI_ITEMS), "ci items; slot ids verified")


if __name__ == "__main__":
    run()
