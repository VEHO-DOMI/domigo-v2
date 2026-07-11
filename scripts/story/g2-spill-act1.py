#!/usr/bin/env python3
"""G2 "The Spill" — chapters ch02–ch08 (Act 1: the leak · the midpoint).

Authored by Fable per docs/handover/20_g2n_the_spill.md (§3 beats, §4 Blank
rules, §5 register). Linear spine; slot pattern mirrors the gated ch01
(3 name-it vocab · 2 fix-it grammar · 1 recap ci). New .ci. items are
appended to comprehension.json with their own in-bank glosses.
"""
import json

SP = "content/corpus/stories/g2.st.the-spill/story.json"
CP = "content/corpus/stories/g2.st.the-spill/comprehension.json"
CH = "g2.st.the-spill"


def sc(ch, n, speaker, en, de, glosses, slots=None):
    return {"id": f"{CH}.{ch}.s{n:03d}", "speaker": speaker, "textEn": en, "scaffoldDe": de,
            "glosses": [{"word": w, "de": d, "scope": None} for w, d in glosses],
            "audio": None, "taskSlots": slots or [], "next": None}


def slot(kind, item):
    return {"slot": kind, "itemId": item, "variantKey": None}


def ci(cid, prompt, full, distractors, gloss, hint_de, explain_de):
    return {"id": cid, "rev": 1, "difficulty": 1, "format": "multiple-choice",
            "prompt": {"text": prompt, "lang": "en", "blanks": 0},
            "answers": [{"text": full, "tier": "full"}], "direction": None,
            "distractors": distractors, "pairs": [], "groups": [],
            "gloss": [{"word": w, "de": d, "scope": None} for w, d in gloss],
            "hintDe": hint_de, "hintEn": None, "explainDe": explain_de,
            "explainEn": None, "strict": False}


# ── ch02 · u02 "The Wrong Announcements" — Aula; Emma converts ──
ch02 = ("The Wrong Announcements", "Die falschen Durchsagen", [
    sc("ch02", 1, "narrator", "Morning. The whole school stands in the hall — and the loudspeaker clears its throat.",
       "Morgen. Die ganze Schule steht in der Aula — und der Lautsprecher räuspert sich.",
       [("whole", "ganze"), ("hall", "Aula"), ("loudspeaker", "Lautsprecher"), ("clears its throat", "räuspert sich")]),
    sc("ch02", 2, "berger", "Good morning! Today we... swim in the maths and eat the sports hall?",
       "Guten Morgen! Heute... schwimmen wir im Mathe und essen die Turnhalle?",
       [("today", "heute"), ("maths", "Mathe"), ("sports hall", "Turnhalle")]),
    sc("ch02", 3, "narrator", "Laughter everywhere. The teachers' words come out wrong — they swap in the air, mid-sentence.",
       "Überall Gelächter. Die Wörter der Lehrer kommen falsch heraus — sie tauschen in der Luft, mitten im Satz.",
       [("laughter", "Gelächter"), ("swap", "tauschen"), ("mid-sentence", "mitten im Satz")]),
    sc("ch02", 4, "jona", "The ink is in the loudspeaker. It thinks it is funny. It is a LITTLE funny.",
       "Die Tinte ist im Lautsprecher. Sie glaubt, sie ist lustig. Sie ist ein BISSCHEN lustig.",
       [("ink", "Tinte"), ("thinks", "glaubt"), ("funny", "lustig")]),
    sc("ch02", 5, "emma", "This is so embarrassing for the teachers. What is the word for that feeling? Find it!",
       "Das ist so peinlich für die Lehrer. Was ist das Wort für dieses Gefühl? Finde es!",
       [("embarrassing", "peinlich"), ("feeling", "Gefühl")],
       [slot("name-it", "g2u02.w.embarrassed")]),
    sc("ch02", 6, "tarik", "I think it is AWESOME. What is the word for how the whole morning acts? Find it!",
       "Ich finde es GENIAL. Was ist das Wort dafür, wie sich der ganze Morgen benimmt? Finde es!",
       [("awesome", "genial"), ("acts", "benimmt sich")],
       [slot("name-it", "g2u02.w.behaviour")]),
    sc("ch02", 7, "narrator", "You and Jona follow the wandering words down the hall. They hop like frogs. They are not sorry.",
       "Du und Jona folgt den wandernden Wörtern durch die Aula. Sie hüpfen wie Frösche. Es tut ihnen nicht leid.",
       [("follow", "folgen"), ("wandering", "wandernd"), ("hop", "hüpfen"), ("frogs", "Frösche"), ("sorry", "leid")]),
    sc("ch02", 8, "jona", "You put back a word with the right form. Yesterday the loudspeaker ATE them — say it right!",
       "Man setzt ein Wort mit der richtigen Form zurück. Gestern hat der Lautsprecher sie GEFRESSEN — sag es richtig!",
       [("put back", "zurücksetzen"), ("form", "Form"), ("yesterday", "gestern"), ("ate", "gefressen")],
       [slot("fix-it", "g2u02.gi.irregular-verbs.cp.001")]),
    sc("ch02", 9, "emma", "Wait. WAIT. That word just moved. Words do not move. Tell me what did NOT happen here!",
       "Warte. WARTE. Das Wort hat sich gerade bewegt. Wörter bewegen sich nicht. Sag mir, was hier NICHT passiert ist!",
       [("moved", "bewegt"), ("happen", "passieren")],
       [slot("fix-it", "g2u02.gi.past-simple-negation.mc.001")]),
    sc("ch02", 10, "narrator", "Emma stares at the ink. The ink, caught, writes a tiny 'hello' on her shoe.",
       "Emma starrt die Tinte an. Die Tinte, ertappt, schreibt ein winziges 'Hallo' auf ihren Schuh.",
       [("stares", "starrt"), ("caught", "ertappt"), ("tiny", "winzig"), ("shoe", "Schuh")]),
    sc("ch02", 11, "emma", "...okay. I believe you. I have QUESTIONS, but I believe you.",
       "...okay. Ich glaube euch. Ich habe FRAGEN, aber ich glaube euch.",
       [("believe", "glauben"), ("questions", "Fragen")]),
    sc("ch02", 12, "narrator", "The announcements come out right again. Almost. The last one is a rhyme, and it stays a rhyme.",
       "Die Durchsagen kommen wieder richtig heraus. Fast. Die letzte ist ein Reim, und sie bleibt ein Reim.",
       [("announcements", "Durchsagen"), ("almost", "fast"), ("rhyme", "Reim"), ("stays", "bleibt")],
       [slot("recap", "g2u02.ci.the-wrong-words.mc.001")]),
    sc("ch02", 13, "jona", "Three of us now. That is a team. My first one.",
       "Jetzt sind wir drei. Das ist ein Team. Mein erstes.",
       [("team", "Team"), ("first", "erstes")]),
])
ci02 = ci("g2u02.ci.the-wrong-words.mc.001", "What is wrong with the announcements?",
          "The words come out wrong.",
          ["The loudspeaker is off.", "Nobody is in the hall.", "The teachers are late."],
          [("announcements", "Durchsagen"), ("loudspeaker", "Lautsprecher"), ("wrong", "falsch"), ("hall", "Aula"), ("late", "zu spät"), ("come out", "herauskommen"), ("words", "Wörter"), ("off", "aus"), ("nobody", "niemand")],
          "Hör auf die Durchsagen — was machen die Wörter?",
          "Die Wörter tauschen mitten im Satz die Plätze — die Durchsagen kommen falsch heraus. Der Lautsprecher ist an, die Lehrer sind da: Es liegt an den Wörtern selbst.")

# ── ch03 · u03 "The Decorations" — corridor; Tarik joins; the Blank takes orange ──
ch03 = ("The Decorations", "Die Dekorationen", [
    sc("ch03", 1, "narrator", "October. The long corridor is full of Halloween decorations — and this morning, they are awake.",
       "Oktober. Der lange Gang ist voller Halloween-Dekorationen — und heute Morgen sind sie wach.",
       [("corridor", "Gang"), ("decorations", "Dekorationen"), ("awake", "wach")]),
    sc("ch03", 2, "tarik", "The paper bat is FLYING. This is the best school year ever. EVER.",
       "Die Papier-Fledermaus FLIEGT. Das ist das beste Schuljahr aller Zeiten. ALLER ZEITEN.",
       [("paper", "Papier"), ("bat", "Fledermaus"), ("flying", "fliegt"), ("ever", "aller Zeiten")]),
    sc("ch03", 3, "narrator", "The bat wants out of the draught. The plastic spider is afraid of heights and will not talk about it.",
       "Die Fledermaus will raus aus der Zugluft. Die Plastikspinne hat Höhenangst und will nicht darüber reden.",
       [("draught", "Zugluft"), ("plastic", "Plastik"), ("spider", "Spinne"), ("afraid of heights", "Höhenangst")]),
    sc("ch03", 4, "emma", "Fine. The decorations are alive. FINE. What do people wear at Halloween? Find the word!",
       "Gut. Die Dekorationen leben. GUT. Was tragen Leute an Halloween? Finde das Wort!",
       [("alive", "lebendig"), ("wear", "tragen")],
       [slot("name-it", "g2u03.w.costume")]),
    sc("ch03", 5, "jona", "The bat needs a face for the party. What goes over your face? Find it!",
       "Die Fledermaus braucht ein Gesicht für die Party. Was kommt über dein Gesicht? Finde es!",
       [("needs", "braucht"), ("face", "Gesicht")],
       [slot("name-it", "g2u03.w.mask")]),
    sc("ch03", 6, "tarik", "And the spider? Look at it. There is only one word for it. Find it!",
       "Und die Spinne? Schau sie an. Es gibt nur ein Wort dafür. Finde es!",
       [("spider", "Spinne"), ("only", "nur")],
       [slot("name-it", "g2u03.w.cute")]),
    sc("ch03", 7, "narrator", "Then you see the wall. Yesterday it was orange — pumpkins, leaves, paper suns. Now it is... nothing-coloured.",
       "Dann seht ihr die Wand. Gestern war sie orange — Kürbisse, Blätter, Papiersonnen. Jetzt ist sie... farblos.",
       [("wall", "Wand"), ("orange", "orange"), ("pumpkins", "Kürbisse"), ("leaves", "Blätter"), ("nothing-coloured", "farblos")]),
    sc("ch03", 8, "jona", "The smudge took the orange. All of it. It did not touch the decorations — only the colour.",
       "Der Fleck hat das Orange genommen. Alles. Er hat die Dekorationen nicht angefasst — nur die Farbe.",
       [("smudge", "Fleck"), ("took", "genommen"), ("touch", "anfassen"), ("colour", "Farbe")]),
    sc("ch03", 9, "emma", "The bat should stay inside today. Tell it the right way!",
       "Die Fledermaus sollte heute drinnen bleiben. Sag es ihr richtig!",
       [("should", "sollte"), ("inside", "drinnen"), ("stay", "bleiben")],
       [slot("fix-it", "g2u03.gi.should.cp.001")]),
    sc("ch03", 10, "jona", "And we should not chase the smudge. I have a feeling about that. Say it right!",
       "Und wir sollten den Fleck nicht jagen. Ich habe da so ein Gefühl. Sag es richtig!",
       [("chase", "jagen"), ("feeling", "Gefühl")],
       [slot("fix-it", "g2u03.gi.should.cp.002")]),
    sc("ch03", 11, "narrator", "You paint the wall's orange back, word by word, colour by colour. The bat supervises. Badly.",
       "Ihr malt das Orange der Wand zurück, Wort für Wort, Farbe für Farbe. Die Fledermaus beaufsichtigt. Schlecht.",
       [("paint", "malen"), ("supervises", "beaufsichtigt"), ("badly", "schlecht")],
       [slot("recap", "g2u03.ci.the-orange.mc.001")]),
    sc("ch03", 12, "tarik", "I am in your team. I do not know what the team is for, but I am IN it.",
       "Ich bin in eurem Team. Ich weiß nicht, wofür das Team ist, aber ich bin DRIN.",
       [("team", "Team"), ("know", "weiß")]),
    sc("ch03", 13, "jona", "Four now. The bat waves goodbye with one wing. Do not tell the spider it is cute.",
       "Jetzt vier. Die Fledermaus winkt mit einem Flügel zum Abschied. Sagt der Spinne nicht, dass sie süß ist.",
       [("waves", "winkt"), ("wing", "Flügel"), ("goodbye", "Abschied"), ("cute", "süß")]),
])
ci03 = ci("g2u03.ci.the-orange.mc.001", "What does the smudge take from the wall?",
          "The orange colour.",
          ["The paper bat.", "The costumes.", "The spider."],
          [("smudge", "Fleck"), ("wall", "Wand"), ("colour", "Farbe"), ("paper", "Papier"), ("bat", "Fledermaus"), ("spider", "Spinne"), ("costumes", "Kostüme"), ("orange", "orange"), ("take", "nehmen")],
          "Schau auf die Wand — welche FARBE fehlt?",
          "Der Fleck nimmt nur die orange Farbe von der Wand — die Dekorationen selbst lässt er in Ruhe. Er nimmt Farben und Wörter, keine Dinge.")

# ── ch04 · u04 "The Talking Bio Room" — animals talk; first Blank clue ──
ch04 = ("The Talking Bio Room", "Der sprechende Biosaal", [
    sc("ch04", 1, "narrator", "The bio room, Tuesday. The class walks in — and the class walks into a conversation.",
       "Der Biosaal, Dienstag. Die Klasse kommt herein — und die Klasse platzt in ein Gespräch.",
       [("bio room", "Biosaal"), ("Tuesday", "Dienstag"), ("conversation", "Gespräch"), ("walks into", "platzt in")]),
    sc("ch04", 2, "narrator", "The hamster is talking. The hamster has been talking for an hour. The hamster has OPINIONS.",
       "Der Hamster redet. Der Hamster redet seit einer Stunde. Der Hamster hat MEINUNGEN.",
       [("hamster", "Hamster"), ("talking", "redet"), ("hour", "Stunde"), ("opinions", "Meinungen")]),
    sc("ch04", 3, "emma", "It says the wheel is boring and the food is late. It is not WRONG.",
       "Er sagt, das Rad ist langweilig und das Futter kommt zu spät. Er hat nicht UNRECHT.",
       [("wheel", "Rad"), ("boring", "langweilig"), ("food", "Futter"), ("wrong", "unrecht")]),
    sc("ch04", 4, "jona", "Story animals talk. The ink gave them the words. Which animal here is truly dangerous? Find the word!",
       "Tiere aus Geschichten reden. Die Tinte hat ihnen die Wörter gegeben. Welches Tier hier ist wirklich gefährlich? Finde das Wort!",
       [("gave", "gegeben"), ("truly", "wirklich"), ("dangerous", "gefährlich")],
       [slot("name-it", "g2u04.w.dangerous")]),
    sc("ch04", 5, "tarik", "The fish says it is faster than a... big spotted cat. Find that animal!",
       "Der Fisch sagt, er ist schneller als eine... große gepunktete Katze. Finde das Tier!",
       [("fish", "Fisch"), ("faster", "schneller"), ("spotted", "gepunktet")],
       [slot("name-it", "g2u04.w.cheetah")]),
    sc("ch04", 6, "emma", "And the lizard says its cousin is bigger and greener and MUCH more famous. Find the cousin!",
       "Und die Echse sagt, ihr Cousin ist größer und grüner und VIEL berühmter. Finde den Cousin!",
       [("lizard", "Echse"), ("cousin", "Cousin"), ("famous", "berühmt")],
       [slot("name-it", "g2u04.w.crocodile")]),
    sc("ch04", 7, "jona", "The hamster is not as big as the rabbit — but do not tell him. Say it right!",
       "Der Hamster ist nicht so groß wie das Kaninchen — aber sagt es ihm nicht. Sag es richtig!",
       [("rabbit", "Kaninchen")],
       [slot("fix-it", "g2u04.gi.as-as.cp.001")]),
    sc("ch04", 8, "tarik", "And the cheetah is faster than my bike. Probably. Say it right!",
       "Und der Gepard ist schneller als mein Fahrrad. Wahrscheinlich. Sag es richtig!",
       [("cheetah", "Gepard"), ("bike", "Fahrrad"), ("probably", "wahrscheinlich")],
       [slot("fix-it", "g2u04.gi.comparatives.cp.001")]),
    sc("ch04", 9, "narrator", "Then you notice it: every animal, even the loud hamster, keeps away from one door — the storeroom corridor.",
       "Dann fällt es euch auf: Jedes Tier, sogar der laute Hamster, bleibt weg von einer Tür — dem Gang zur Abstellkammer.",
       [("notice", "auffallen"), ("keeps away", "bleibt weg"), ("storeroom", "Abstellkammer"), ("corridor", "Gang")]),
    sc("ch04", 10, "jona", "Animals liked me in the book too. They know who is kind... and they know what is empty.",
       "Tiere mochten mich auch im Buch. Sie wissen, wer nett ist... und sie wissen, was leer ist.",
       [("liked", "mochten"), ("kind", "nett"), ("empty", "leer")],
       [slot("recap", "g2u04.ci.the-storeroom.mc.001")]),
    sc("ch04", 11, "emma", "So the smudge lives near the storeroom. Noted. Nobody goes alone. NOBODY.",
       "Der Fleck wohnt also bei der Abstellkammer. Notiert. Niemand geht allein. NIEMAND.",
       [("lives", "wohnt"), ("noted", "notiert"), ("alone", "allein"), ("nobody", "niemand")]),
    sc("ch04", 12, "narrator", "On the way out, the hamster asks for a newspaper subscription. Frau Berger says she will think about it.",
       "Beim Hinausgehen wünscht sich der Hamster ein Zeitungs-Abo. Frau Berger sagt, sie denkt darüber nach.",
       [("on the way out", "beim Hinausgehen"), ("newspaper", "Zeitung"), ("subscription", "Abo"), ("think about", "nachdenken über")]),
])
ci04 = ci("g2u04.ci.the-storeroom.mc.001", "Where do the animals not want to go?",
          "Near the storeroom corridor.",
          ["Near the bio room.", "Near the sports hall.", "Near the classroom."],
          [("storeroom", "Abstellkammer"), ("corridor", "Gang"), ("bio room", "Biosaal"), ("sports hall", "Turnhalle"), ("classroom", "Klassenzimmer"), ("near", "bei"), ("animals", "Tiere")],
          "Wohin will sogar der laute Hamster NICHT?",
          "Alle Tiere bleiben weg vom Gang zur Abstellkammer — dort wohnt etwas, das sie spüren. Tiere erkennen, was leer ist.")

# ── ch05 · u05 "The Wandering Town" — excursion; the map rearranges ──
ch05 = ("The Wandering Town", "Die wandernde Stadt", [
    sc("ch05", 1, "narrator", "Excursion day! The class walks into town with a map, a plan, and thirty sandwiches.",
       "Ausflugstag! Die Klasse geht mit einer Karte, einem Plan und dreißig Sandwiches in die Stadt.",
       [("excursion", "Ausflug"), ("map", "Karte"), ("plan", "Plan"), ("thirty", "dreißig")]),
    sc("ch05", 2, "berger", "The supermarket is right here on the map. It has been there for forty years.",
       "Der Supermarkt ist genau hier auf der Karte. Er ist seit vierzig Jahren dort.",
       [("supermarket", "Supermarkt"), ("right here", "genau hier"), ("forty", "vierzig"), ("years", "Jahre")]),
    sc("ch05", 3, "narrator", "It is not there. There is a fountain there. The fountain looks very pleased with itself.",
       "Er ist nicht dort. Dort ist ein Brunnen. Der Brunnen sieht sehr zufrieden mit sich aus.",
       [("fountain", "Brunnen"), ("pleased", "zufrieden")]),
    sc("ch05", 4, "jona", "The ink got into the town map. The streets are... shuffling. Find the thing we need most now!",
       "Die Tinte ist in den Stadtplan geraten. Die Straßen... mischen sich. Finde das Ding, das wir jetzt am meisten brauchen!",
       [("got into", "geraten in"), ("streets", "Straßen"), ("shuffling", "mischen sich"), ("most", "am meisten")],
       [slot("name-it", "g2u05.w.map")]),
    sc("ch05", 5, "emma", "We pin the town down, place by place. Start with the big square in the middle. Find it!",
       "Wir heften die Stadt fest, Ort für Ort. Fang mit dem großen Platz in der Mitte an. Finde ihn!",
       [("pin", "festheften"), ("place", "Ort"), ("square", "Platz"), ("middle", "Mitte")],
       [slot("name-it", "g2u05.w.market-square")]),
    sc("ch05", 6, "tarik", "And the splashy thing that stole the supermarket's spot! Find it!",
       "Und das plätschernde Ding, das den Platz vom Supermarkt geklaut hat! Finde es!",
       [("splashy", "plätschernd"), ("stole", "geklaut"), ("spot", "Platz")],
       [slot("name-it", "g2u05.w.fountain")]),
    sc("ch05", 7, "narrator", "Every right direction nails a street in place. The town holds its breath while you work.",
       "Jede richtige Wegbeschreibung nagelt eine Straße fest. Die Stadt hält den Atem an, während ihr arbeitet.",
       [("direction", "Wegbeschreibung"), ("nails", "nagelt fest"), ("holds its breath", "hält den Atem an")]),
    sc("ch05", 8, "emma", "Tell the bakery how to get home: go straight, then left. Say it right!",
       "Sag der Bäckerei, wie sie nach Hause kommt: geradeaus, dann links. Sag es richtig!",
       [("bakery", "Bäckerei"), ("straight", "geradeaus"), ("left", "links")],
       [slot("fix-it", "g2u05.gi.prepositions-directions.cp.001")]),
    sc("ch05", 9, "jona", "And the supermarket: past the church, next to the bank. Say it right!",
       "Und der Supermarkt: an der Kirche vorbei, neben der Bank. Sag es richtig!",
       [("past", "vorbei an"), ("church", "Kirche"), ("next to", "neben"), ("bank", "Bank")],
       [slot("fix-it", "g2u05.gi.prepositions-directions.cp.002")]),
    sc("ch05", 10, "narrator", "The supermarket slides home. The fountain sulks back to its corner. The map stops breathing.",
       "Der Supermarkt rutscht nach Hause. Der Brunnen schmollt zurück in seine Ecke. Die Karte hört auf zu atmen.",
       [("slides", "rutscht"), ("sulks", "schmollt"), ("corner", "Ecke"), ("breathing", "atmen")],
       [slot("recap", "g2u05.ci.the-town.mc.001")]),
    sc("ch05", 11, "berger", "Excellent field work, everyone. We will NOT put this in the report to the Direktorin.",
       "Ausgezeichnete Feldarbeit, alle. Das kommt NICHT in den Bericht an die Direktorin.",
       [("excellent", "ausgezeichnet"), ("field work", "Feldarbeit"), ("report", "Bericht")]),
    sc("ch05", 12, "jona", "She did not ask one single question today. Teachers who read books ask fewer questions.",
       "Sie hat heute keine einzige Frage gestellt. Lehrer, die Bücher lesen, stellen weniger Fragen.",
       [("single", "einzige"), ("question", "Frage"), ("fewer", "weniger")]),
])
ci05 = ci("g2u05.ci.the-town.mc.001", "What is wrong with the town?",
          "The streets and places move around.",
          ["The shops are all closed.", "The map is lost.", "The class is too loud."],
          [("streets", "Straßen"), ("places", "Orte"), ("move around", "bewegen sich"), ("shops", "Geschäfte"), ("closed", "geschlossen"), ("map", "Karte"), ("lost", "verloren"), ("loud", "laut"), ("town", "Stadt"), ("wrong", "falsch")],
          "Der Supermarkt, der Brunnen — was machen sie?",
          "Die Straßen und Orte bewegen sich, weil die Tinte in den Stadtplan geraten ist. Mit Wegbeschreibungen heftet ihr die Stadt wieder fest.")

# ── ch06 · u06 "The Adventure Shelf" — library; Finn cameo; Act-1 curtain ──
ch06 = ("The Adventure Shelf", "Das Abenteuer-Regal", [
    sc("ch06", 1, "narrator", "The library, after lunch. Somewhere between the shelves, a campfire is crackling. In a LIBRARY.",
       "Die Bibliothek, nach dem Mittagessen. Irgendwo zwischen den Regalen knistert ein Lagerfeuer. In einer BIBLIOTHEK.",
       [("library", "Bibliothek"), ("shelves", "Regale"), ("campfire", "Lagerfeuer"), ("crackling", "knistert")]),
    sc("ch06", 2, "emma", "The adventure shelf is leaking. There is a tent in the reading corner and a paddle by the door.",
       "Das Abenteuer-Regal leckt. In der Leseecke steht ein Zelt und neben der Tür ein Paddel.",
       [("leaking", "leckt"), ("tent", "Zelt"), ("reading corner", "Leseecke"), ("paddle", "Paddel")]),
    sc("ch06", 3, "tarik", "A quest! We are ON a quest! First: name the warm crackling thing. Find it!",
       "Eine Quest! Wir sind AUF einer Quest! Zuerst: Benenne das warme, knisternde Ding. Finde es!",
       [("quest", "Quest"), ("warm", "warm"), ("name", "benennen")],
       [slot("name-it", "g2u06.w.campfire")]),
    sc("ch06", 4, "jona", "The boat from page twelve is stuck in the doorway. What kind of boat? Find it!",
       "Das Boot von Seite zwölf steckt im Türrahmen fest. Was für ein Boot? Finde es!",
       [("boat", "Boot"), ("page", "Seite"), ("stuck", "steckt fest"), ("doorway", "Türrahmen")],
       [slot("name-it", "g2u06.w.canoe")]),
    sc("ch06", 5, "narrator", "A familiar green-gold light spills over the shelf — and a small paper-and-ink sprite floats down, beaming.",
       "Ein vertrautes grün-goldenes Licht fällt über das Regal — und ein kleiner Geist aus Papier und Tinte schwebt strahlend herab.",
       [("familiar", "vertraut"), ("light", "Licht"), ("sprite", "Geist"), ("floats", "schwebt"), ("beaming", "strahlend")]),
    sc("ch06", 6, "finn", "My two favourite readers! I came to check on you. Also the book missed you. Also I missed you.",
       "Meine zwei Lieblingsleser! Ich wollte nach euch sehen. Außerdem hat das Buch euch vermisst. Außerdem habe ich euch vermisst.",
       [("favourite", "Lieblings-"), ("readers", "Leser"), ("check on", "nach jemandem sehen"), ("missed", "vermisst")]),
    sc("ch06", 7, "emma", "Are you here to fix the leak?",
       "Bist du hier, um das Leck zu reparieren?",
       [("fix", "reparieren"), ("leak", "Leck")]),
    sc("ch06", 8, "finn", "Me? I do not fix leaks. I AM a leak. But you have to close the shelf before night. Say it right!",
       "Ich? Ich repariere keine Lecks. Ich BIN ein Leck. Aber ihr müsst das Regal vor der Nacht schließen. Sag es richtig!",
       [("leak", "Leck"), ("close", "schließen"), ("before", "vor"), ("night", "Nacht")],
       [slot("fix-it", "g2u06.gi.have-to.cp.001")]),
    sc("ch06", 9, "jona", "And everyone has to carry ONE thing back to the shelf. Even the canoe. Say it right!",
       "Und jeder muss EIN Ding zurück zum Regal tragen. Sogar das Kanu. Sag es richtig!",
       [("carry", "tragen"), ("even", "sogar"), ("canoe", "Kanu")],
       [slot("fix-it", "g2u06.gi.have-to.cp.002")]),
    sc("ch06", 10, "narrator", "The tent folds itself, embarrassed. The campfire goes out politely. The shelf closes with a satisfied click.",
       "Das Zelt faltet sich verlegen zusammen. Das Lagerfeuer geht höflich aus. Das Regal schließt mit einem zufriedenen Klick.",
       [("folds", "faltet"), ("embarrassed", "verlegen"), ("politely", "höflich"), ("satisfied", "zufrieden"), ("click", "Klick")],
       [slot("recap", "g2u06.ci.finn-visit.mc.001")]),
    sc("ch06", 11, "jona", "Finn. The leaks are not random. Look at the map of them — the ink runs one way. It runs AWAY from something.",
       "Finn. Die Lecks sind nicht zufällig. Schau auf ihre Karte — die Tinte läuft in eine Richtung. Sie läuft vor etwas WEG.",
       [("random", "zufällig"), ("one way", "eine Richtung"), ("runs away", "läuft weg")]),
    sc("ch06", 12, "finn", "...I will tell the book. You two — be careful. And be KIND. Those are different jobs, and you need both.",
       "...Ich sage es dem Buch. Ihr zwei — seid vorsichtig. Und seid NETT. Das sind verschiedene Aufgaben, und ihr braucht beide.",
       [("careful", "vorsichtig"), ("kind", "nett"), ("different", "verschieden"), ("jobs", "Aufgaben")]),
])
ci06 = ci("g2u06.ci.finn-visit.mc.001", "What does Jona notice about the leaks?",
          "The ink runs away from something.",
          ["The ink is gone.", "The leaks are random.", "The shelf is empty."],
          [("notice", "bemerken"), ("ink", "Tinte"), ("runs away", "läuft weg"), ("leaks", "Lecks"), ("random", "zufällig"), ("shelf", "Regal"), ("empty", "leer"), ("gone", "weg"), ("something", "etwas")],
          "Jona schaut auf die Karte der Lecks — wohin läuft die Tinte?",
          "Die Lecks sind nicht zufällig: Die Tinte läuft immer in eine Richtung — sie läuft vor etwas davon. Das ist Jonas große Entdeckung am Ende von Akt 1.")

# ── ch07 · u07 "The Missing Weekend" — THE MIDPOINT ──
ch07 = ("The Missing Weekend", "Das fehlende Wochenende", [
    sc("ch07", 1, "narrator", "Friday morning. Something is wrong, and for once, EVERYONE feels it.",
       "Freitagmorgen. Etwas stimmt nicht, und diesmal spüren es ALLE.",
       [("Friday", "Freitag"), ("wrong", "nicht richtig"), ("feels", "spüren")]),
    sc("ch07", 2, "berger", "Class, what are we doing this weekend? ... Class? Anyone?",
       "Klasse, was machen wir dieses Wochenende? ... Klasse? Irgendjemand?",
       [("weekend", "Wochenende"), ("anyone", "irgendjemand")]),
    sc("ch07", 3, "narrator", "Nobody knows. Not one plan. The calendars are blank after Friday. The diaries too. The board by the yard: blank.",
       "Niemand weiß es. Kein einziger Plan. Die Kalender sind leer nach Freitag. Die Tagebücher auch. Die Tafel am Hof: leer.",
       [("nobody", "niemand"), ("calendars", "Kalender"), ("blank", "leer"), ("diaries", "Tagebücher"), ("board", "Tafel"), ("yard", "Hof")]),
    sc("ch07", 4, "emma", "It took the WEEKEND. Every plan. The cinema, the match, my grandma's cake — gone from every page.",
       "Es hat das WOCHENENDE genommen. Jeden Plan. Das Kino, das Match, den Kuchen meiner Oma — weg von jeder Seite.",
       [("took", "genommen"), ("cinema", "Kino"), ("match", "Match"), ("grandma", "Oma"), ("page", "Seite")]),
    sc("ch07", 5, "tarik", "My cousin's party! We had a group thing for it — the chat with all of us! Find the word!",
       "Die Party von meinem Cousin! Wir hatten was zusammen dafür — den Chat mit uns allen! Finde das Wort!",
       [("cousin", "Cousin"), ("party", "Party")],
       [slot("name-it", "g2u07.w.group-chat")]),
    sc("ch07", 6, "emma", "And the cinema thing you need to get in — mine is BLANK paper now! Find the word!",
       "Und das Kino-Ding, das man zum Reinkommen braucht — meins ist jetzt LEERES Papier! Finde das Wort!",
       [("get in", "reinkommen"), ("blank", "leer"), ("paper", "Papier")],
       [slot("name-it", "g2u07.w.ticket")]),
    sc("ch07", 7, "jona", "There is a word for how the whole school feels right now. Find it.",
       "Es gibt ein Wort dafür, wie sich die ganze Schule gerade fühlt. Finde es.",
       [("whole", "ganze"), ("feels", "fühlt sich")],
       [slot("name-it", "g2u07.w.disappointment")]),
    sc("ch07", 8, "narrator", "You rebuild Saturday out loud, plan by plan. Saying a plan writes it back. The school listens.",
       "Ihr baut den Samstag laut wieder auf, Plan für Plan. Einen Plan aussprechen schreibt ihn zurück. Die Schule hört zu.",
       [("rebuild", "wieder aufbauen"), ("out loud", "laut"), ("Saturday", "Samstag"), ("listens", "hört zu")]),
    sc("ch07", 9, "emma", "Careful — say what we are NOT going to do, too. That protects it. Say it right!",
       "Vorsicht — sag auch, was wir NICHT machen werden. Das schützt es. Sag es richtig!",
       [("careful", "Vorsicht"), ("protects", "schützt")],
       [slot("fix-it", "g2u07.gi.going-to-negative.cp.001")]),
    sc("ch07", 10, "jona", "And some plans are only maybe-plans. Maybe-plans taste worse to it. Say it right!",
       "Und manche Pläne sind nur Vielleicht-Pläne. Vielleicht-Pläne schmecken ihm schlechter. Sag es richtig!",
       [("maybe", "vielleicht"), ("taste", "schmecken"), ("worse", "schlechter")],
       [slot("fix-it", "g2u07.gi.might.cp.003")]),
    sc("ch07", 11, "narrator", "Saturday comes back, plan by plan. Slower than it left. Everything comes back slower than it leaves.",
       "Der Samstag kommt zurück, Plan für Plan. Langsamer, als er gegangen ist. Alles kommt langsamer zurück, als es geht.",
       [("slower", "langsamer"), ("left", "gegangen"), ("leaves", "geht")],
       [slot("recap", "g2u07.ci.the-weekend.mc.001")]),
    sc("ch07", 12, "emma", "I see the pattern now. It does not take school things. It takes the things people LOOK FORWARD to.",
       "Ich sehe jetzt das Muster. Es nimmt keine Schulsachen. Es nimmt die Dinge, auf die sich Leute FREUEN.",
       [("pattern", "Muster"), ("look forward to", "sich freuen auf")]),
    sc("ch07", 13, "jona", "Because those are the fullest words. ... I used to know that feeling from the other side.",
       "Weil das die vollsten Wörter sind. ... Ich kannte dieses Gefühl mal von der anderen Seite.",
       [("fullest", "vollste"), ("used to", "früher"), ("side", "Seite")]),
])
ci07 = ci("g2u07.ci.the-weekend.mc.001", "What does the blank take this time?",
          "Everyone's weekend plans.",
          ["The school books.", "The classroom door.", "Tarik's bike."],
          [("blank", "leere Stelle"), ("weekend", "Wochenende"), ("plans", "Pläne"), ("everyone", "alle"), ("classroom", "Klassenzimmer"), ("bike", "Fahrrad"), ("take", "nehmen")],
          "Was fehlt in allen Kalendern nach Freitag?",
          "Die leere Stelle hat alle Wochenendpläne genommen — Kino, Match, Kuchen. Emma erkennt das Muster: Es nimmt, worauf sich Leute freuen.")

# ── ch08 · u08 "The Gym Spaceport" — big fun; Jona's quiet theory ──
ch08 = ("The Gym Spaceport", "Der Turnhallen-Raumhafen", [
    sc("ch08", 1, "narrator", "PE, Thursday. The gym doors open onto a launch pad. A rocket idles where the climbing ropes were.",
       "Sport, Donnerstag. Die Turnhallentüren öffnen sich zu einer Startrampe. Eine Rakete wartet, wo die Kletterseile waren.",
       [("PE", "Sport"), ("gym", "Turnhalle"), ("launch pad", "Startrampe"), ("rocket", "Rakete"), ("climbing ropes", "Kletterseile")]),
    sc("ch08", 2, "tarik", "THE SCIENCE-FICTION SHELF LEAKED. This is the best day of my life. Of ANY life.",
       "DAS SCIENCE-FICTION-REGAL HAT GELECKT. Das ist der beste Tag meines Lebens. JEDES Lebens.",
       [("leaked", "geleckt"), ("life", "Leben")]),
    sc("ch08", 3, "narrator", "A silver figure with too many arms is taking attendance. It is very fair about it.",
       "Eine silberne Gestalt mit zu vielen Armen macht die Anwesenheit. Sie ist dabei sehr gerecht.",
       [("silver", "silbern"), ("figure", "Gestalt"), ("attendance", "Anwesenheit"), ("fair", "gerecht")]),
    sc("ch08", 4, "emma", "Okay, what IS that? There is a word for a person from another world. Find it!",
       "Okay, was IST das? Es gibt ein Wort für eine Person von einer anderen Welt. Finde es!",
       [("world", "Welt")],
       [slot("name-it", "g2u08.w.alien")]),
    sc("ch08", 5, "tarik", "It says we are its... team on the ship! All of us together! Find the word!",
       "Es sagt, wir sind seine... Mannschaft auf dem Schiff! Wir alle zusammen! Finde das Wort!",
       [("ship", "Schiff"), ("together", "zusammen")],
       [slot("name-it", "g2u08.w.crew")]),
    sc("ch08", 6, "emma", "And the one who gives the orders — that is apparently ME now. Find the word!",
       "Und die Person, die die Befehle gibt — das bin jetzt anscheinend ICH. Finde das Wort!",
       [("orders", "Befehle"), ("apparently", "anscheinend")],
       [slot("name-it", "g2u08.w.commander")]),
    sc("ch08", 7, "narrator", "You fly one lap of the gym. The rocket is polite about gravity. PE has never been like this.",
       "Ihr fliegt eine Runde durch die Turnhalle. Die Rakete ist höflich zur Schwerkraft. Sport war noch nie so.",
       [("lap", "Runde"), ("polite", "höflich"), ("gravity", "Schwerkraft")]),
    sc("ch08", 8, "emma", "Commander's log: two hours ago the gym was a gym. Say it right!",
       "Logbuch der Kommandantin: Vor zwei Stunden war die Turnhalle eine Turnhalle. Sag es richtig!",
       [("log", "Logbuch"), ("hours", "Stunden"), ("ago", "vor")],
       [slot("fix-it", "g2u08.gi.past-time-markers.cp.001")]),
    sc("ch08", 9, "tarik", "And last week I could not even climb the rope! Say it right!",
       "Und letzte Woche konnte ich nicht mal das Seil hochklettern! Sag es richtig!",
       [("last week", "letzte Woche"), ("climb", "klettern"), ("rope", "Seil")],
       [slot("fix-it", "g2u08.gi.past-time-markers.cp.002")]),
    sc("ch08", 10, "narrator", "In all the noise, Jona stands at the gym door with a notebook, watching the corridor. Watching the quiet.",
       "In all dem Lärm steht Jona an der Turnhallentür mit einem Notizbuch und beobachtet den Gang. Beobachtet die Stille.",
       [("noise", "Lärm"), ("notebook", "Notizbuch"), ("watching", "beobachtet"), ("quiet", "Stille")],
       [slot("recap", "g2u08.ci.the-quiet.mc.001")]),
    sc("ch08", 11, "jona", "It never comes near the leaks. Never. It does not want story. It wants quiet.",
       "Es kommt nie in die Nähe der Lecks. Nie. Es will keine Geschichte. Es will Stille.",
       [("near", "in die Nähe"), ("never", "nie"), ("story", "Geschichte")]),
    sc("ch08", 12, "emma", "Then the loudest chapter of the year just bought us a very safe afternoon. Enjoy the rocket, Commander's orders.",
       "Dann hat uns das lauteste Kapitel des Jahres einen sehr sicheren Nachmittag gekauft. Genießt die Rakete — Befehl der Kommandantin.",
       [("loudest", "lauteste"), ("chapter", "Kapitel"), ("safe", "sicher"), ("enjoy", "genießen"), ("orders", "Befehl")]),
])
ci08 = ci("g2u08.ci.the-quiet.mc.001", "What does Jona learn about the blank?",
          "It stays away from the leaks and wants quiet.",
          ["It loves the rocket.", "It is afraid of Pixel.", "It lives in the gym."],
          [("learn", "lernen"), ("stays away", "bleibt weg"), ("leaks", "Lecks"), ("quiet", "Stille"), ("rocket", "Rakete"), ("afraid", "Angst"), ("gym", "Turnhalle"), ("blank", "leere Stelle")],
          "Jona steht an der Tür und beobachtet — was will die leere Stelle?",
          "Sie kommt nie in die Nähe der lauten Lecks: Sie will keine Geschichte, sie will Stille. Darum ist der lauteste Tag auch der sicherste.")

CHAPTERS = {"ch02": ch02, "ch03": ch03, "ch04": ch04, "ch05": ch05, "ch06": ch06, "ch07": ch07, "ch08": ch08}
CIS = [ci02, ci03, ci04, ci05, ci06, ci07, ci08]

st = json.load(open(SP))
existing = {c["id"].split(".")[-1] for c in st["chapters"]}
for key in sorted(CHAPTERS):
    title_en, title_de, scenes = CHAPTERS[key]
    for i, s in enumerate(scenes):
        s["next"] = scenes[i + 1]["id"] if i + 1 < len(scenes) else None
    unit = int(key[2:])
    chap = {"id": f"{CH}.{key}", "unit": unit, "titleEn": title_en, "titleDe": title_de, "scenes": scenes}
    if key in existing:
        st["chapters"] = [chap if c["id"].endswith(key) else c for c in st["chapters"]]
    else:
        st["chapters"].append(chap)
st["chapters"].sort(key=lambda c: c["unit"])
json.dump(st, open(SP, "w"), ensure_ascii=False, indent=1)

co = json.load(open(CP))
have = {i["id"] for i in co["items"]}
for item in CIS:
    if item["id"] not in have:
        co["items"].append(item)
json.dump(co, open(CP, "w"), ensure_ascii=False, indent=1)
print(f"ch02–ch08 written ({sum(len(c[2]) for c in CHAPTERS.values())} scenes, {len(CIS)} ci items)")
