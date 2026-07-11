#!/usr/bin/env python3
"""FOURTEEN: LIVE — Act 2 authoring (ch06–ch10) per docs/handover/19 §3–4.

The branching act: flags.json (all three forks declared), F1 in ch06
(w06.open|quiet), w06 flagLine callbacks in ch07 + ch09, the ch08 crisis,
F2 in ch10 (w10.private|public). VS-14 discipline: taskSlots only on the
shared spine, never on branch-exclusive scenes.
Idempotent: chapters replaced by unit, ci items by id.
"""
import json, os, sys

sys.path.insert(0, os.path.dirname(__file__))
from importlib import import_module

act1 = import_module("g4-live-act1")
sc, link, ci, sid = act1.sc, act1.link, act1.ci, act1.sid
BUNDLE, SID = act1.BUNDLE, act1.SID

# ═══════════════════════════════════════════════════════════════════════════
# ch06 · u06 Kids make a difference — "Our Voice" + FORK 1
# ═══════════════════════════════════════════════════════════════════════════
CH06 = ("Our Voice", "Unsere Stimme", link([
    sc(6, 1, "narrator",
       "English class reads about kids who changed things — a park saved, a well built, a law moved. Ben keeps looking at the studio wall photo on his phone.",
       "Im Englischunterricht geht es um Kinder, die etwas verändert haben — ein geretteter Park, ein gebauter Brunnen, ein bewegtes Gesetz. Ben schaut immer wieder auf das Foto der Studiowand auf seinem Handy.",
       [("changed", "verändert"), ("saved", "gerettet"), ("well", "Brunnen"), ("law", "Gesetz"), ("phone", "Handy")]),
    sc(6, 2, "ben",
       "These kids achieved real things. And we sit on a real thing. It does not feel great, honestly.",
       "Diese Kinder haben echte Dinge erreicht. Und wir sitzen auf einer echten Sache. Es fühlt sich nicht super an, ehrlich.",
       [("achieved", "erreicht"), ("real", "echt"), ("honestly", "ehrlich"), ("feel", "fühlen")],
       slots=[("name-it", "g4u06.w.achieve")]),
    sc(6, 3, "leah",
       "We are not sitting. We are checking. There is a difference, is there not?",
       "Wir sitzen nicht. Wir prüfen. Das ist ein Unterschied, oder etwa nicht?",
       [("checking", "prüfen"), ("difference", "Unterschied")],
       slots=[("fix-it", "g4u06.gi.question-tags.cp.001")]),
    sc(6, 4, "narrator",
       "Then Amelie from 2A knocks. She runs Ben's community chat — youngest mod, sharpest eyes.",
       "Dann klopft Amelie aus der 2A. Sie betreut Bens Community-Chat — jüngste Moderatorin, schärfste Augen.",
       [("knocks", "klopft"), ("community", "Community"), ("sharpest", "schärfste"), ("youngest", "jüngste")]),
    sc(6, 5, "amelie",
       "Everyone in chat talks about the vote. I have a small question. If the vote is fake — why vote?",
       "Alle im Chat reden über die Abstimmung. Ich habe eine kleine Frage. Wenn die Abstimmung fake ist — warum abstimmen?",
       [("chat", "Chat"), ("fake", "fake"), ("vote", "abstimmen")]),
    sc(6, 6, "narrator",
       "Nobody answers. The naive questions are the sharp ones — this one cuts the last doubt away, quickly and cleanly.",
       "Niemand antwortet. Die naiven Fragen sind die scharfen — diese schneidet den letzten Zweifel weg, schnell und sauber.",
       [("naive", "naiv"), ("doubt", "Zweifel"), ("cuts", "schneidet"), ("cleanly", "sauber")],
       slots=[("fix-it", "g4u06.gi.adverbs-of-manner.cp.001")]),
    sc(6, 7, "sara",
       "Okay. A school channel takes on adults. That is new ground — so we support each other, whatever comes.",
       "Okay. Ein Schulkanal legt sich mit Erwachsenen an. Das ist Neuland — also unterstützen wir einander, egal was kommt.",
       [("adults", "Erwachsene"), ("support", "unterstützen"), ("ground", "Boden"), ("whatever", "egal was")],
       slots=[("name-it", "g4u06.w.support")]),
    sc(6, 8, "you",
       "The goal is simple to say and heavy to carry: a fair vote. The only question left is HOW we work.",
       "Das Ziel ist leicht gesagt und schwer getragen: eine faire Abstimmung. Die einzige Frage, die bleibt, ist WIE wir arbeiten.",
       [("goal", "Ziel"), ("fair", "fair"), ("carry", "tragen"), ("heavy", "schwer")],
       slots=[("name-it", "g4u06.w.goal")]),
    sc(6, 9, "narrator",
       "Your call, editor. Loud or quiet?",
       "Deine Entscheidung, Chefredakteur. Laut oder leise?",
       [("call", "Entscheidung"), ("editor", "Chefredakteur"), ("quiet", "leise")],
       next_=[
           {"id": "open", "textEn": "Announce it on the channel: FOURTEEN is investigating the vote. Pressure — and protection.",
            "scaffoldDe": "Kündigt es am Kanal an: FOURTEEN untersucht die Abstimmung. Druck — und Schutz.",
            "next": sid(6, 10), "sets": ["w06.open"]},
           {"id": "quiet", "textEn": "Work quietly. No announcement — doors stay open, and we carry it alone.",
            "scaffoldDe": "Arbeitet leise. Keine Ankündigung — Türen bleiben offen, und wir tragen es allein.",
            "next": sid(6, 12), "sets": ["w06.quiet"]},
       ]),
    # branch: OPEN (no slots — VS-14)
    sc(6, 10, "leah",
       "Tonight, live: 'Something is wrong with our vote. We are on it.' Twenty thousand people just became our bodyguards.",
       "Heute Abend, live: „Mit unserer Abstimmung stimmt etwas nicht. Wir sind dran.“ Zwanzigtausend Leute sind gerade unsere Bodyguards geworden.",
       [("tonight", "heute Abend"), ("wrong", "nicht in Ordnung"), ("became", "geworden")]),
    sc(6, 11, "narrator",
       "The clip travels fast. By morning, every teacher has seen it — and some doors close very softly.",
       "Der Clip verbreitet sich schnell. Bis zum Morgen hat ihn jede Lehrkraft gesehen — und manche Türen schließen sich ganz leise.",
       [("clip", "Clip"), ("travels", "verbreitet sich"), ("softly", "leise"), ("doors", "Türen")],
       next_=sid(6, 14)),
    # branch: QUIET (no slots — VS-14)
    sc(6, 12, "leah",
       "Fine. No announcement. But if I explode from held-in headlines, that is on you.",
       "Gut. Keine Ankündigung. Aber wenn ich an zurückgehaltenen Schlagzeilen explodiere, bist du schuld.",
       [("announcement", "Ankündigung"), ("explode", "explodieren"), ("headlines", "Schlagzeilen"), ("held-in", "zurückgehalten")]),
    sc(6, 13, "narrator",
       "The channel posts a pizza review instead. Underneath it, in the quiet, four people start pulling one thread.",
       "Der Kanal postet stattdessen eine Pizza-Rezension. Darunter, in der Stille, beginnen vier Leute, an einem Faden zu ziehen.",
       [("posts", "postet"), ("instead", "stattdessen"), ("thread", "Faden"), ("pulling", "ziehen")],
       next_=sid(6, 14)),
    # reconverge
    sc(6, 14, "amelie",
       "Whatever you choose up there — chat believes you. I believe you. That is my whole speech.",
       "Was auch immer ihr da oben entscheidet — der Chat glaubt euch. Ich glaube euch. Das war schon meine ganze Rede.",
       [("choose", "entscheiden"), ("believes", "glaubt"), ("speech", "Rede"), ("whole", "ganze")]),
    sc(6, 15, "narrator",
       "On the wall, under the three detective words, a fourth line appears: OUR VOICE, USED CAREFULLY.",
       "An der Wand, unter den drei Detektiv-Wörtern, erscheint eine vierte Zeile: UNSERE STIMME, VORSICHTIG BENUTZT.",
       [("appears", "erscheint"), ("carefully", "vorsichtig"), ("voice", "Stimme"), ("used", "benutzt")],
       slots=[("recap", "g4u06.ci.the-question.mc.001")]),
    sc(6, 16, "ben",
       "For the record: I voted for whichever option has fewer meetings.",
       "Fürs Protokoll: Ich habe für die Option mit weniger Meetings gestimmt.",
       [("record", "Protokoll"), ("fewer", "weniger"), ("option", "Option")],
       next_="END"),
])[:])

# ═══════════════════════════════════════════════════════════════════════════
# ch07 · u07 Travelling Down Under — "The Sydney File" (+ w06 callbacks)
# ═══════════════════════════════════════════════════════════════════════════
CH07 = ("The Sydney File", "Die Sydney-Akte", link([
    sc(7, 1, "narrator",
       "Pitch week, final round: Sydney. Class 2B brings a real didgeridoo and a slideshow of the outback at sunset.",
       "Pitch-Woche, letzte Runde: Sydney. Die 2B bringt ein echtes Didgeridoo und eine Slideshow vom Outback bei Sonnenuntergang.",
       [("outback", "Outback"), ("sunset", "Sonnenuntergang"), ("slideshow", "Slideshow"), ("final", "letzte")]),
    sc(7, 2, "ben",
       "Red earth, ancient stories, spiders the size of my hand. Sydney is amazing AND terrifying. Ten out of ten.",
       "Rote Erde, uralte Geschichten, Spinnen so groß wie meine Hand. Sydney ist großartig UND furchteinflößend. Zehn von zehn.",
       [("earth", "Erde"), ("ancient", "uralt"), ("spiders", "Spinnen"), ("terrifying", "furchteinflößend"), ("amazing", "großartig")]),
    sc(7, 3, "sara",
       "The pitch teaches the real Australia too — the Aborigines' heritage, the walkabout, the land itself telling stories.",
       "Der Pitch zeigt auch das echte Australien — das Erbe der Aborigines, den Walkabout, das Land selbst, das Geschichten erzählt.",
       [("heritage", "Erbe"), ("land", "Land"), ("itself", "selbst")],
       slots=[("name-it", "g4u07.w.heritage")]),
    sc(7, 4, "narrator",
       "After the assembly, the crew opens the SunWays catalogue Leo photographed at the pizza stand.",
       "Nach der Versammlung öffnet die Crew den SunWays-Katalog, den Leo am Pizzastand fotografiert hat.",
       [("catalogue", "Katalog"), ("photographed", "fotografiert")]),
    sc(7, 5, "leo",
       "Dublin: no school package. New York: no school package. Sydney: 'School Special, full service, contact Herr Brandt.'",
       "Dublin: kein Schulpaket. New York: kein Schulpaket. Sydney: „Schul-Spezial, Komplettservice, Kontakt Herr Brandt.“",
       [("package", "Paket"), ("contact", "Kontakt"), ("full service", "Komplettservice")]),
    sc(7, 6, "sara",
       "So whichever city wins, the school books through SunWays — but only ONE city has a ready-made product. The plane leaves for Sydney before anyone votes.",
       "Egal welche Stadt gewinnt, die Schule bucht über SunWays — aber nur EINE Stadt hat ein fertiges Produkt. Das Flugzeug fliegt nach Sydney, bevor irgendwer abstimmt.",
       [("books", "bucht"), ("ready-made", "fertig"), ("product", "Produkt"), ("whichever", "egal welche")],
       slots=[("fix-it", "g4u07.gi.present-simple-future.cp.001")]),
    sc(7, 7, "narrator",
       "The file grows: poster, printer code, loud-class lists, logo, catalogue. Every page is checked twice.",
       "Die Akte wächst: Plakat, Druckercode, Listen der lauten Klassen, Logo, Katalog. Jede Seite wird zweimal geprüft.",
       [("file", "Akte"), ("grows", "wächst"), ("checked", "geprüft"), ("twice", "zweimal")],
       flag_lines=[
           ("w06.open",
            "The file grows — but slower now. Since the announcement, adults smile at the crew and say nothing on camera. Doors everywhere, all politely shut.",
            "Die Akte wächst — aber langsamer jetzt. Seit der Ankündigung lächeln Erwachsene die Crew an und sagen vor der Kamera nichts. Überall Türen, alle höflich zu.",
            [("announcement", "Ankündigung"), ("politely", "höflich"), ("shut", "geschlossen"), ("adults", "Erwachsene"), ("slower", "langsamer"), ("file", "Akte"), ("grows", "wächst")]),
           ("w06.quiet",
            "The file grows in the dark. Yesterday somebody slid a note under the studio door: 'Ask who signs the trips.' No name. Leah carries the tips alone and hates it beautifully.",
            "Die Akte wächst im Dunkeln. Gestern hat jemand einen Zettel unter die Studiotür geschoben: „Fragt, wer die Reisen unterschreibt.“ Kein Name. Leah trägt die Tipps allein und hasst es auf ihre Art großartig.",
            [("slid", "geschoben"), ("note", "Zettel"), ("signs", "unterschreibt"), ("tips", "Tipps"), ("hates", "hasst"), ("file", "Akte"), ("grows", "wächst"), ("dark", "Dunkeln")]),
       ]),
    sc(7, 8, "leah",
       "I want somebody at that company to explain the Special to me. On the record. I want Brandt to answer one question.",
       "Ich will, dass irgendwer bei dieser Firma mir das Spezial erklärt. Offiziell. Ich will, dass Brandt eine Frage beantwortet.",
       [("company", "Firma"), ("explain", "erklärt"), ("on the record", "offiziell"), ("answer", "beantworten")],
       slots=[("fix-it", "g4u07.gi.want-someone-to.cp.001")]),
    sc(7, 9, "sara",
       "And SunWays provides the answer nobody asked for: a new banner over the gym. 'SunWays — partner of your school.' Since when?",
       "Und SunWays liefert die Antwort, die niemand wollte: ein neues Banner über der Turnhalle. „SunWays — Partner eurer Schule.“ Seit wann?",
       [("provides", "liefert"), ("banner", "Banner"), ("partner", "Partner"), ("gym", "Turnhalle")],
       slots=[("name-it", "g4u07.w.provide")]),
    sc(7, 10, "you",
       "Partner. Signed by whom? The word 'partner' has a signature somewhere — find the hand.",
       "Partner. Unterschrieben von wem? Das Wort „Partner“ hat irgendwo eine Unterschrift — findet die Hand.",
       [("signature", "Unterschrift"), ("somewhere", "irgendwo"), ("whom", "wem")],
       slots=[("recap", "g4u07.ci.the-package.mc.001")]),
    sc(7, 11, "narrator",
       "Under the fake stars of pitch season, the real question finally has a shape: not which city — whose signature.",
       "Unter den falschen Sternen der Pitch-Saison hat die echte Frage endlich eine Form: nicht welche Stadt — wessen Unterschrift.",
       [("shape", "Form"), ("finally", "endlich"), ("whose", "wessen"), ("stars", "Sterne")],
       next_="END"),
])[:])

# ═══════════════════════════════════════════════════════════════════════════
# ch08 · u08 Obsessed! — "Leah, 3 a.m." (the cost chapter — the crew fails)
# ═══════════════════════════════════════════════════════════════════════════
CH08 = ("Leah, 3 a.m.", "Leah, 3 Uhr früh", link([
    sc(8, 1, "narrator",
       "Three in the morning. The group chat lights up: eleven messages from Leah, then a video file.",
       "Drei Uhr früh. Der Gruppenchat leuchtet auf: elf Nachrichten von Leah, dann eine Videodatei.",
       [("messages", "Nachrichten"), ("video file", "Videodatei"), ("lights up", "leuchtet auf")]),
    sc(8, 2, "leah",
       "I stayed late. Herr Steiner was at the office printer at nine — with SunWays folders. I filmed through the glass. WE HAVE HIM.",
       "Ich bin lange geblieben. Herr Steiner war um neun am Sekretariats-Drucker — mit SunWays-Mappen. Ich habe durchs Glas gefilmt. WIR HABEN IHN.",
       [("stayed", "geblieben"), ("folders", "Mappen"), ("glass", "Glas"), ("filmed", "gefilmt")]),
    sc(8, 3, "narrator",
       "Next morning the studio is very quiet. Ben is not laughing. When Ben stops laughing, everyone hears it.",
       "Am nächsten Morgen ist das Studio sehr still. Ben lacht nicht. Wenn Ben aufhört zu lachen, hören es alle.",
       [("laughing", "lachen"), ("still", "still"), ("hears", "hören")]),
    sc(8, 4, "sara",
       "Leah. He is a teacher at his own printer. You filmed a person secretly, at night, through glass. Say it out loud and listen to it.",
       "Leah. Er ist ein Lehrer an seinem eigenen Drucker. Du hast heimlich einen Menschen gefilmt, nachts, durchs Glas. Sag es laut und hör dir zu.",
       [("secretly", "heimlich"), ("own", "eigenen"), ("out loud", "laut")]),
    sc(8, 5, "leah",
       "I used to check everything twice. This week I have slept four hours and checked nothing. I know how this looks.",
       "Früher habe ich alles doppelt geprüft. Diese Woche habe ich vier Stunden geschlafen und nichts geprüft. Ich weiß, wie das aussieht.",
       [("used to", "früher"), ("twice", "doppelt"), ("slept", "geschlafen"), ("checked", "geprüft")],
       slots=[("fix-it", "g4u08.gi.tense-time-expression-review.cp.003")]),
    sc(8, 6, "ben",
       "It looks like the story started owning YOU. We said we film the world. We never said we hunt people.",
       "Es sieht so aus, als hätte die Story angefangen, DICH zu besitzen. Wir haben gesagt, wir filmen die Welt. Wir haben nie gesagt, wir jagen Menschen.",
       [("owning", "besitzen"), ("hunt", "jagen"), ("never", "nie")]),
    sc(8, 7, "narrator",
       "The clip sits on the table between them — rare, precious, poisonous. The best evidence they have, gotten the worst way.",
       "Der Clip liegt auf dem Tisch zwischen ihnen — selten, wertvoll, giftig. Der beste Beweis, den sie haben, auf die schlechteste Art bekommen.",
       [("rare", "selten"), ("precious", "wertvoll"), ("poisonous", "giftig"), ("evidence", "Beweis"), ("gotten", "bekommen")],
       slots=[("name-it", "g4u08.w.precious")]),
    sc(8, 8, "you",
       "Novak's rule was about sources. Sara's rules are about people. This clip breaks both. I say we delete it — and I say it knowing what it costs.",
       "Novaks Regel war über Quellen. Saras Regeln sind über Menschen. Dieser Clip bricht beide. Ich sage, wir löschen ihn — und ich sage es und weiß, was es kostet.",
       [("sources", "Quellen"), ("delete", "löschen"), ("costs", "kostet"), ("breaks", "bricht"), ("both", "beide")]),
    sc(8, 9, "leah",
       "I am furious. At you. At me, mostly.",
       "Ich bin wütend. Auf dich. Auf mich, vor allem.",
       [("furious", "wütend"), ("mostly", "vor allem")],
       slots=[("name-it", "g4u08.w.furious")]),
    sc(8, 10, "narrator",
       "Leah presses delete herself. Ten seconds of footage, gone. The most important ten seconds of the season.",
       "Leah drückt selbst auf Löschen. Zehn Sekunden Material, weg. Die wichtigsten zehn Sekunden der Saison.",
       [("presses", "drückt"), ("footage", "Material"), ("seconds", "Sekunden"), ("herself", "selbst")]),
    sc(8, 11, "you",
       "On the studio wall, a new rule, in Leah's handwriting: WE ARE NOT THE STORY.",
       "An der Studiowand eine neue Regel, in Leahs Handschrift: WIR SIND NICHT DIE STORY.",
       [("handwriting", "Handschrift"), ("rule", "Regel")],
       slots=[("recap", "g4u08.ci.the-clip.mc.001")]),
    sc(8, 12, "leah",
       "Yesterday I was a hunter at a window. Today I am a reporter again. Tomorrow we ask Steiner to his face — properly.",
       "Gestern war ich eine Jägerin am Fenster. Heute bin ich wieder Reporterin. Morgen fragen wir Steiner ins Gesicht — richtig.",
       [("hunter", "Jägerin"), ("reporter", "Reporterin"), ("properly", "richtig"), ("face", "Gesicht")],
       slots=[("fix-it", "g4u08.gi.tense-time-expression-review.cp.004")]),
    sc(8, 13, "ben",
       "There she is. Welcome back. I saved you a joke, but it can wait.",
       "Da ist sie ja. Willkommen zurück. Ich habe dir einen Witz aufgehoben, aber der kann warten.",
       [("saved", "aufgehoben"), ("joke", "Witz"), ("wait", "warten")],
       next_="END"),
])[:])

# ═══════════════════════════════════════════════════════════════════════════
# ch09 · u09 Body talk — "Before the Interview" (+ w06 callback)
# ═══════════════════════════════════════════════════════════════════════════
CH09 = ("Before the Interview", "Vor dem Interview", link([
    sc(9, 1, "narrator",
       "The request is written: ten minutes with Herr Steiner, on the record, about the SunWays partnership. Sending it is one tap. Nobody taps.",
       "Die Anfrage ist geschrieben: zehn Minuten mit Herrn Steiner, offiziell, über die SunWays-Partnerschaft. Abschicken ist ein Fingertipp. Niemand tippt.",
       [("request", "Anfrage"), ("partnership", "Partnerschaft"), ("tap", "Fingertipp"), ("sending", "das Abschicken")]),
    sc(9, 2, "ben",
       "My stomach communicates in whale sounds. That may be fear. It might also be the canteen.",
       "Mein Magen kommuniziert in Walgeräuschen. Das kann Angst sein. Es könnte auch die Kantine sein.",
       [("stomach", "Magen"), ("whale", "Wal"), ("fear", "Angst"), ("canteen", "Kantine")],
       slots=[("fix-it", "g4u09.gi.modals-possibility.cp.001")]),
    sc(9, 3, "narrator",
       "Sleepless eyes on Ben. Leah's hands shake over the send button — the body says what the mouth will not.",
       "Übernächtigte Augen bei Ben. Leahs Hände zittern über dem Senden-Knopf — der Körper sagt, was der Mund nicht sagt.",
       [("sleepless", "übernächtigt"), ("shake", "zittern"), ("button", "Knopf"), ("body", "Körper")]),
    sc(9, 4, "sara",
       "So we prepare like professionals. Breathe in four, hold four, out four. Then: every question on its own card.",
       "Also bereiten wir uns vor wie Profis. Vier einatmen, vier halten, vier ausatmen. Dann: jede Frage auf ihrer eigenen Karte.",
       [("prepare", "vorbereiten"), ("breathe", "atmen"), ("hold", "halten"), ("card", "Karte")]),
    sc(9, 5, "you",
       "Card one: 'Did you sign the SunWays agreement?' Short. Polite. Impossible to wriggle out of.",
       "Karte eins: „Hast du die SunWays-Vereinbarung unterschrieben?“ Kurz. Höflich. Unmöglich, sich herauszuwinden.",
       [("sign", "unterschreiben"), ("agreement", "Vereinbarung"), ("polite", "höflich"), ("wriggle out", "sich herauswinden"), ("impossible", "unmöglich")]),
    sc(9, 6, "narrator",
       "They practise in pairs. Eye contact, steady voice, no pointing fingers — a greeting first, always.",
       "Sie üben zu zweit. Blickkontakt, ruhige Stimme, keine zeigenden Finger — zuerst immer eine Begrüßung.",
       [("practise", "üben"), ("steady", "ruhig"), ("pointing", "zeigend"), ("greeting", "Begrüßung"), ("pairs", "zu zweit")],
       slots=[("name-it", "g4u09.w.greet")]),
    sc(9, 7, "amelie",
       "Chat tip from 2A: when I am scared, I nod slowly while the other person talks. It makes me brave and them calm.",
       "Chat-Tipp aus der 2A: Wenn ich Angst habe, nicke ich langsam, während die andere Person redet. Das macht mich mutig und sie ruhig.",
       [("scared", "ängstlich"), ("nod", "nicken"), ("brave", "mutig"), ("calm", "ruhig"), ("slowly", "langsam")]),
    sc(9, 8, "narrator",
       "Ben practises his listening face. It may be perfect. It could also frighten small children — hard to say.",
       "Ben übt sein Zuhör-Gesicht. Es kann perfekt sein. Es könnte auch kleine Kinder erschrecken — schwer zu sagen.",
       [("listening", "Zuhör-"), ("frighten", "erschrecken"), ("perfect", "perfekt")],
       slots=[("fix-it", "g4u09.gi.modals-possibility.cp.002")],
       flag_lines=[
           ("w06.open",
            "Ben practises his listening face for the cameras that now follow the crew everywhere — since the announcement, even the interview is a public event. No pressure. All the pressure.",
            "Ben übt sein Zuhör-Gesicht für die Kameras, die der Crew jetzt überall folgen — seit der Ankündigung ist sogar das Interview ein öffentliches Ereignis. Kein Druck. Aller Druck.",
            [("cameras", "Kameras"), ("follow", "folgen"), ("public", "öffentlich"), ("event", "Ereignis"), ("pressure", "Druck"), ("announcement", "Ankündigung"), ("practises", "übt"), ("listening", "Zuhör-")]),
           ("w06.quiet",
            "Ben practises his listening face in an empty studio. Working quietly means nobody watches — and nobody helps. The four of them, one door, one question.",
            "Ben übt sein Zuhör-Gesicht in einem leeren Studio. Leise arbeiten heißt: Niemand schaut zu — und niemand hilft. Die vier, eine Tür, eine Frage.",
            [("empty", "leer"), ("watches", "schaut zu"), ("helps", "hilft"), ("practises", "übt"), ("listening", "Zuhör-"), ("quietly", "leise")]),
       ]),
    sc(9, 9, "leah",
       "I am embarrassed about one thing only: that my hands know the truth before I do. Fine. They can shake. I will still ask.",
       "Mir ist nur eine Sache peinlich: dass meine Hände die Wahrheit vor mir kennen. Gut. Sollen sie zittern. Ich frage trotzdem.",
       [("embarrassed", "peinlich"), ("truth", "Wahrheit"), ("still", "trotzdem")],
       slots=[("name-it", "g4u09.w.embarrassed")]),
    sc(9, 10, "narrator",
       "Sara reads the cards one last time. Breathing: done. Questions: done. Kindness: packed.",
       "Sara liest die Karten ein letztes Mal. Atmen: erledigt. Fragen: erledigt. Freundlichkeit: eingepackt.",
       [("kindness", "Freundlichkeit"), ("packed", "eingepackt"), ("done", "erledigt")],
       slots=[("recap", "g4u09.ci.the-cards.mc.001")]),
    sc(9, 11, "you",
       "I press send. Ten minutes, Thursday, the library. Steiner answers in two minutes: 'Of course. I was wondering when you would ask.'",
       "Ich drücke auf Senden. Zehn Minuten, Donnerstag, die Bibliothek. Steiner antwortet in zwei Minuten: „Natürlich. Ich habe mich schon gefragt, wann ihr fragt.“",
       [("press", "drücken"), ("library", "Bibliothek"), ("wondering", "sich fragen"), ("of course", "natürlich")]),
    sc(9, 12, "ben",
       "He was WAITING for us? Okay. New whale sounds.",
       "Er hat auf uns GEWARTET? Okay. Neue Walgeräusche.",
       [("waiting", "gewartet")],
       next_="END"),
])[:])

# ═══════════════════════════════════════════════════════════════════════════
# ch10 · u10 A fair world — "The Reason" + FORK 2
# ═══════════════════════════════════════════════════════════════════════════
CH10 = ("The Reason", "Der Grund", link([
    sc(10, 1, "narrator",
       "Wednesday, one day before the interview. Leo finds the last piece — not at night, not through glass. In the public archive, where receipts live.",
       "Mittwoch, ein Tag vor dem Interview. Leo findet das letzte Teil — nicht nachts, nicht durchs Glas. Im öffentlichen Archiv, wo Belege wohnen.",
       [("public", "öffentlich"), ("archive", "Archiv"), ("receipts", "Belege"), ("piece", "Teil")]),
    sc(10, 2, "leo",
       "The partnership agreement. Filed correctly, stamped, boring — and signed: G. Steiner. Two sources now. The banner, and this.",
       "Die Partnerschaftsvereinbarung. Korrekt abgelegt, gestempelt, langweilig — und unterschrieben: G. Steiner. Jetzt zwei Quellen. Das Banner, und das hier.",
       [("agreement", "Vereinbarung"), ("filed", "abgelegt"), ("stamped", "gestempelt"), ("signed", "unterschrieben"), ("boring", "langweilig")],
       slots=[("name-it", "g4u10.w.agreement")]),
    sc(10, 3, "narrator",
       "And stapled behind it, a second page nobody had to file: a list in Steiner's handwriting. Twelve names. Amounts. 'Trip fund.'",
       "Und dahinter getackert eine zweite Seite, die niemand ablegen musste: eine Liste in Steiners Handschrift. Zwölf Namen. Beträge. „Reise-Fonds.“",
       [("stapled", "getackert"), ("amounts", "Beträge"), ("fund", "Fonds"), ("handwriting", "Handschrift"), ("list", "Liste")]),
    sc(10, 4, "sara",
       "I know four of these names. They are kids whose families cannot afford ANY trip. The sponsor money — it pays for them.",
       "Ich kenne vier von diesen Namen. Das sind Kinder, deren Familien sich GAR keine Reise leisten können. Das Sponsorgeld — es bezahlt für sie.",
       [("afford", "sich leisten"), ("families", "Familien"), ("sponsor", "Sponsor")]),
    sc(10, 5, "narrator",
       "The studio goes quiet the way a room goes quiet when a story grows a second heart.",
       "Im Studio wird es so still, wie ein Raum still wird, wenn eine Geschichte ein zweites Herz bekommt.",
       [("grows", "bekommt"), ("heart", "Herz"), ("quiet", "still")]),
    sc(10, 6, "ben",
       "So the deal is dirty AND the reason is decent. If he had asked the school for a fund, none of this would have happened.",
       "Also ist der Deal schmutzig UND der Grund ist anständig. Hätte er die Schule um einen Fonds gebeten, wäre nichts davon passiert.",
       [("dirty", "schmutzig"), ("decent", "anständig"), ("deal", "Deal"), ("reason", "Grund")],
       slots=[("fix-it", "g4u10.gi.third-conditional.cp.001")]),
    sc(10, 7, "sara",
       "Write this down, because it is the sentence of the season: true and unfair can live in the same sentence.",
       "Schreibt das auf, denn es ist der Satz der Saison: Wahr und unfair können im selben Satz wohnen.",
       [("unfair", "unfair"), ("sentence", "Satz"), ("true", "wahr")],
       slots=[("name-it", "g4u10.w.fairness")]),
    sc(10, 8, "leah",
       "If we had published my 3 a.m. clip, we would have told HALF this story. The wrong half first.",
       "Hätten wir meinen 3-Uhr-Clip veröffentlicht, hätten wir die HÄLFTE dieser Geschichte erzählt. Die falsche Hälfte zuerst.",
       [("published", "veröffentlicht"), ("half", "Hälfte"), ("wrong", "falsch")],
       slots=[("fix-it", "g4u10.gi.third-conditional.cp.002")]),
    sc(10, 9, "you",
       "Tomorrow we sit across from him. The file is complete. The question is not WHETHER he answers — it is how we hand him the question.",
       "Morgen sitzen wir ihm gegenüber. Die Akte ist vollständig. Die Frage ist nicht, OB er antwortet — sondern wie wir ihm die Frage reichen.",
       [("across", "gegenüber"), ("complete", "vollständig"), ("hand", "reichen"), ("whether", "ob")],
       next_=[
           {"id": "private", "textEn": "Show him everything first — alone, no camera. He gets the chance to speak. Maybe to act.",
            "scaffoldDe": "Zeigt ihm zuerst alles — allein, ohne Kamera. Er bekommt die Chance zu reden. Vielleicht zu handeln.",
            "next": sid(10, 10), "sets": ["w10.private"]},
           {"id": "public", "textEn": "Keep it formal: the on-camera interview as requested. Clean, protected, on the record.",
            "scaffoldDe": "Bleibt formell: das Kamera-Interview wie angefragt. Sauber, geschützt, offiziell.",
            "next": sid(10, 12), "sets": ["w10.public"]},
       ]),
    # branch: PRIVATE (no slots — VS-14)
    sc(10, 10, "sara",
       "Person first, story second. We show him the file before any lens sees it. If he lies then, we have lost nothing — and he loses our silence.",
       "Zuerst der Mensch, dann die Story. Wir zeigen ihm die Akte, bevor irgendein Objektiv sie sieht. Wenn er dann lügt, haben wir nichts verloren — und er verliert unser Schweigen.",
       [("lens", "Objektiv"), ("lies", "lügt"), ("silence", "Schweigen"), ("lost", "verloren")]),
    sc(10, 11, "narrator",
       "The interview request is quietly changed: no camera in the room. Just four kids, one teacher, and a folder that weighs a schoolyear.",
       "Die Interview-Anfrage wird leise geändert: keine Kamera im Raum. Nur vier Kinder, ein Lehrer und eine Mappe, die ein Schuljahr wiegt.",
       [("changed", "geändert"), ("folder", "Mappe"), ("weighs", "wiegt")],
       next_=sid(10, 14)),
    # branch: PUBLIC (no slots — VS-14)
    sc(10, 12, "leah",
       "On the record protects everyone — him included. No cutting, no whispering, the whole answer or no answer. That is the fairest room there is.",
       "Offiziell schützt alle — ihn auch. Kein Schneiden, kein Flüstern, die ganze Antwort oder keine. Das ist der fairste Raum, den es gibt.",
       [("protects", "schützt"), ("cutting", "Schneiden"), ("whispering", "Flüstern"), ("fairest", "fairste")]),
    sc(10, 13, "narrator",
       "The camera stays in the plan. Leo checks the tripod twice. Formal is a kind of respect too — the cold kind.",
       "Die Kamera bleibt im Plan. Leo prüft das Stativ zweimal. Formell ist auch eine Art Respekt — die kalte Art.",
       [("tripod", "Stativ"), ("respect", "Respekt"), ("formal", "formell"), ("cold", "kalt")],
       next_=sid(10, 14)),
    # reconverge
    sc(10, 14, "narrator",
       "That evening, nobody jokes. Even Ben only says one thing before he goes home.",
       "An dem Abend macht niemand Witze. Sogar Ben sagt nur eine Sache, bevor er heimgeht.",
       [("jokes", "Witze"), ("evening", "Abend")],
       slots=[("recap", "g4u10.ci.the-reason.mc.001")]),
    sc(10, 15, "ben",
       "Whatever happens tomorrow — the twelve kids on that list go on a trip. We write the ending THAT way. Promise me.",
       "Was auch immer morgen passiert — die zwölf Kinder auf der Liste fahren auf eine Reise. Wir schreiben das Ende SO. Versprecht es mir.",
       [("promise", "versprechen"), ("ending", "Ende"), ("list", "Liste")],
       next_="END"),
])[:])

CI_ITEMS = [
    ci("g4u06.ci.the-question.mc.001",
       "What is Amelie's question?",
       "If the vote is fake, why vote?",
       ["Which city has the best pizza?", "When does the plane leave?", "Who runs the community chat?"],
       [("fake", "fake"), ("vote", "Abstimmung / abstimmen"), ("community", "Community"), ("chat", "Chat"), ("plane", "Flugzeug")],
       "Die naive Frage ist die schärfste — sie beendet das Zögern der Crew.",
       "Amelies Frage bringt es auf den Punkt: Wenn die Abstimmung nicht echt ist, ist Mitmachen sinnlos. Danach gibt es kein Zurück mehr."),
    ci("g4u07.ci.the-package.mc.001",
       "What did the crew find in the SunWays catalogue?",
       "Only Sydney has a ready school package.",
       ["All three cities have school packages.", "The catalogue is eight years old.", "Dublin is the cheapest city."],
       [("catalogue", "Katalog"), ("package", "Paket"), ("ready", "fertig"), ("cheapest", "billigste")],
       "Dublin: nichts. New York: nichts. Sydney: „Schul-Spezial, Komplettservice.“",
       "Nur EINE der drei Städte existiert als fertiges SunWays-Produkt — die Reise nach Sydney war geplant, bevor irgendwer abgestimmt hat."),
    ci("g4u08.ci.the-clip.mc.001",
       "What happens to Leah's 3 a.m. clip?",
       "Leah deletes it herself.",
       ["The crew publishes it live.", "Steiner takes the camera away.", "Leo hides it in the archive."],
       [("deletes", "löscht"), ("publishes", "veröffentlicht"), ("hides", "versteckt"), ("herself", "selbst")],
       "Der beste Beweis, auf die schlechteste Art bekommen — was macht die Crew damit?",
       "Der Clip bricht Novaks und Saras Regeln. Leah drückt selbst auf Löschen — und schreibt die neue Regel an die Wand: Wir sind nicht die Story."),
    ci("g4u09.ci.the-cards.mc.001",
       "How does the crew prepare for the interview?",
       "Breathing, and every question on its own card.",
       ["They write angry comments online.", "They film Steiner secretly again.", "They cancel the interview."],
       [("breathing", "Atmen"), ("card", "Karte"), ("cancel", "absagen"), ("secretly", "heimlich"), ("prepare", "vorbereiten")],
       "Vier einatmen, vier halten, vier aus — und dann Karte für Karte.",
       "Profis bereiten sich vor: Atmen gegen die Angst, kurze höfliche Fragen auf Karten. Der Körper zittert trotzdem — gefragt wird trotzdem."),
    ci("g4u10.ci.the-reason.mc.001",
       "Why did Steiner sign the SunWays agreement?",
       "The sponsor money pays for kids who cannot afford a trip.",
       ["He wants to fly to Sydney himself.", "Brandt is his old school friend.", "The Direktorin ordered him to sign."],
       [("sponsor", "Sponsor"), ("afford", "sich leisten"), ("sign", "unterschreiben"), ("ordered", "befohlen"), ("agreement", "Vereinbarung")],
       "Die zweite Seite hinter dem Vertrag: zwölf Namen, Beträge, „Reise-Fonds“.",
       "Der Deal ist falsch, der Grund ist menschlich: Steiners Liste bezahlt die Reise für Kinder, deren Familien es sich nicht leisten können. Wahr und unfair im selben Satz."),
]

FLAGS = {
    "schema": "flags@1",
    "storyId": SID,
    "flags": [
        {"id": "w06.open", "label": "Announced the investigation on the channel", "setIn": f"{SID}.ch06", "major": True},
        {"id": "w06.quiet", "label": "Worked quietly, no announcement", "setIn": f"{SID}.ch06", "major": True},
        {"id": "w10.private", "label": "Showed Steiner everything first, alone", "setIn": f"{SID}.ch10", "major": True},
        {"id": "w10.public", "label": "Kept the formal on-camera interview", "setIn": f"{SID}.ch10", "major": True},
        {"id": "w13.live", "label": "Broke the story as a live special", "setIn": f"{SID}.ch13", "major": True},
        {"id": "w13.print", "label": "Revived the school mag — the special issue", "setIn": f"{SID}.ch13", "major": True},
        {"id": "w13.direktorin", "label": "Brought the file to Direktorin Huber first", "setIn": f"{SID}.ch13", "major": True},
    ],
}


def run():
    sp = os.path.join(BUNDLE, "story.json")
    story = json.load(open(sp))
    for unit, (t_en, t_de, scenes) in [(6, CH06), (7, CH07), (8, CH08), (9, CH09), (10, CH10)]:
        chapter = {"id": f"{SID}.ch{unit:02d}", "unit": unit, "titleEn": t_en, "titleDe": t_de, "scenes": scenes}
        story["chapters"] = [c for c in story["chapters"] if c["unit"] != unit] + [chapter]
    story["chapters"].sort(key=lambda c: c["unit"])
    json.dump(story, open(sp, "w"), ensure_ascii=False, indent=1)

    cp = os.path.join(BUNDLE, "comprehension.json")
    comp = json.load(open(cp))
    comp["items"] = [i for i in comp["items"] if i["id"] not in {c["id"] for c in CI_ITEMS}] + CI_ITEMS
    json.dump(comp, open(cp, "w"), ensure_ascii=False, indent=1)

    json.dump(FLAGS, open(os.path.join(BUNDLE, "flags.json"), "w"), ensure_ascii=False, indent=2)

    # guard: slot ids exist
    import glob
    all_ids = set()
    for f in glob.glob(os.path.join(act1.ROOT, "content", "corpus", "units", "g4-u*", "*.json")):
        if f.endswith(("vocab.json", "grammar.json")):
            for it in json.load(open(f)).get("items", []):
                all_ids.add(it["id"])
    for _, (_, _, scenes) in [(6, CH06), (7, CH07), (8, CH08), (9, CH09), (10, CH10)]:
        for s in scenes:
            for t in s["taskSlots"]:
                if ".ci." not in t["itemId"]:
                    assert t["itemId"] in all_ids, f"phantom itemId {t['itemId']}"
    print("act2 applied: ch06–ch10 (F1+F2), flags.json (7 flags),", len(CI_ITEMS), "ci items; slot ids verified")


if __name__ == "__main__":
    run()
