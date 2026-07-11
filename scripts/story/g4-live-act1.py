#!/usr/bin/env python3
"""FOURTEEN: LIVE — Act 1 authoring (ch02–ch05) per docs/handover/19 §3.

Provenance script (the story.json in the bundle is the authoritative artifact —
the VS-2 auto-gloss convergence pass patches glosses in place after this runs).
Also: cast += novak/steiner/brandt/amelie, names registry additions, 4 ci items.
Idempotent: chapters are replaced by unit number, ci items by id.
"""
import json, os

ROOT = os.path.join(os.path.dirname(__file__), "..", "..")
BUNDLE = os.path.join(ROOT, "content", "corpus", "stories", "g4.st.fourteen-live")
SID = "g4.st.fourteen-live"


def sid(ch, n):
    return f"{SID}.ch{ch:02d}.s{n:03d}"


def sc(ch, n, speaker, en, de, glosses, slots=None, next_=None, flag_lines=None):
    """Standard scene. next_: None=sequential, 'END'=chapter end, str/list/dict=explicit."""
    scene = {
        "id": sid(ch, n),
        "speaker": speaker,
        "textEn": en,
        "scaffoldDe": de,
        "glosses": [{"word": w, "de": d, "scope": None} for w, d in glosses],
        "audio": None,
        "taskSlots": [{"slot": s, "itemId": i, "variantKey": None} for s, i in (slots or [])],
        "next": "SEQ" if next_ is None else next_,
    }
    if flag_lines:
        scene["flagLines"] = [
            {"flag": f, "textEn": e, "scaffoldDe": d,
             "glosses": [{"word": w, "de": g, "scope": None} for w, g in gl]}
            for f, e, d, gl in flag_lines
        ]
    return scene


def link(scenes):
    """Resolve SEQ into the next scene's id; 'END' → None."""
    for i, s in enumerate(scenes):
        if s["next"] == "SEQ":
            s["next"] = scenes[i + 1]["id"] if i + 1 < len(scenes) else None
        elif s["next"] == "END":
            s["next"] = None
    return scenes


def ci(cid, prompt, full, distractors, gloss, hint_de, explain_de):
    return {
        "id": cid, "rev": 1, "difficulty": 1, "format": "multiple-choice",
        "prompt": {"text": prompt, "lang": "en", "blanks": 0},
        "answers": [{"text": full, "tier": "full"}],
        "direction": None, "distractors": distractors, "pairs": [], "groups": [],
        "gloss": [{"word": w, "de": d, "scope": None} for w, d in gloss],
        "hintDe": hint_de, "hintEn": None, "explainDe": explain_de, "explainEn": None,
        "strict": False,
    }


# ═══════════════════════════════════════════════════════════════════════════
# ch02 · u02 Whodunit — "How to Ask Questions"
# The unit is detective fiction; the crew learns the method FROM the homework.
# ═══════════════════════════════════════════════════════════════════════════
CH02 = ("How to Ask Questions", "Wie man Fragen stellt", [
    sc(2, 1, "narrator",
       "Monday morning. The poster had disappeared before the first bell. Nobody had touched it — it was simply gone.",
       "Montag früh. Das Plakat war vor der ersten Glocke verschwunden. Niemand hatte es angefasst — es war einfach weg.",
       [("disappeared", "verschwunden"), ("bell", "Glocke"), ("touched", "angefasst"), ("simply", "einfach"), ("poster", "Plakat")]),
    sc(2, 2, "leo",
       "It was there. I filmed it. Things I film do not stop existing.",
       "Es war da. Ich habe es gefilmt. Dinge, die ich filme, hören nicht auf zu existieren.",
       [("filmed", "gefilmt"), ("existing", "zu existieren"), ("stop", "aufhören")]),
    sc(2, 3, "ben",
       "New problem: English homework. A detective story. Twenty pages!",
       "Neues Problem: Englisch-Hausübung. Eine Detektivgeschichte. Zwanzig Seiten!",
       [("detective", "Detektiv"), ("pages", "Seiten"), ("homework", "Hausübung")]),
    sc(2, 4, "sara",
       "Listen to this line: 'A detective needs three things — a motive, an opportunity, and evidence.' That is not homework. That is a checklist.",
       "Hört euch den Satz an: „Ein Detektiv braucht drei Dinge — ein Motiv, eine Gelegenheit und Beweise.“ Das ist keine Hausübung. Das ist eine Checkliste.",
       [("motive", "Motiv"), ("opportunity", "Gelegenheit"), ("evidence", "Beweise"), ("checklist", "Checkliste"), ("line", "Satz")]),
    sc(2, 5, "narrator",
       "Find the word the crew needs most now. Leo's film of the poster is exactly that.",
       "Finde das Wort, das die Crew jetzt am meisten braucht. Leos Film vom Plakat ist genau das.",
       [("most", "am meisten"), ("exactly", "genau")],
       slots=[("name-it", "g4u02.w.evidence")]),
    sc(2, 6, "you",
       "I write the three words on the studio wall. Under them, one question: who wins if Sydney wins?",
       "Ich schreibe die drei Wörter an die Studiowand. Darunter eine Frage: Wer gewinnt, wenn Sydney gewinnt?",
       [("studio", "Studio"), ("wall", "Wand"), ("wins", "gewinnt"), ("under", "darunter")]),
    sc(2, 7, "leo",
       "I zoomed into my footage. There is a small code on the poster's edge — from OUR school printer.",
       "Ich habe in mein Material gezoomt. Auf dem Rand vom Plakat ist ein kleiner Code — von UNSEREM Schuldrucker.",
       [("zoomed", "gezoomt"), ("footage", "Filmmaterial"), ("edge", "Rand"), ("printer", "Drucker"), ("code", "Code")]),
    sc(2, 8, "narrator",
       "Report it like a detective — what had happened before the vote even opened?",
       "Berichte wie ein Detektiv — was war passiert, bevor die Abstimmung überhaupt startete?",
       [("report", "berichten"), ("vote", "Abstimmung"), ("happened", "passiert"), ("even", "überhaupt")],
       slots=[("fix-it", "g4u02.gi.past-perfect.cp.001")]),
    sc(2, 9, "sara",
       "I asked in the office. Friendly, twice. Nobody ordered a poster. Nobody remembers printing one.",
       "Ich habe im Sekretariat gefragt. Freundlich, zweimal. Niemand hat ein Plakat bestellt. Niemand erinnert sich ans Drucken.",
       [("office", "Sekretariat"), ("ordered", "bestellt"), ("remembers", "erinnert sich"), ("twice", "zweimal"), ("printing", "das Drucken")]),
    sc(2, 10, "ben",
       "A poster that nobody made, in a window that nobody opened. Great. We live in a ghost story now?",
       "Ein Plakat, das niemand gemacht hat, in einem Fenster, das niemand geöffnet hat. Super. Leben wir jetzt in einer Geistergeschichte?",
       [("ghost", "Geister-"), ("window", "Fenster"), ("opened", "geöffnet")]),
    sc(2, 11, "sara",
       "No. In a mystery. Ghosts do not use school printers.",
       "Nein. In einem Rätsel. Geister benutzen keine Schuldrucker.",
       [("mystery", "Rätsel"), ("ghosts", "Geister"), ("use", "benutzen")],
       slots=[("name-it", "g4u02.w.mystery")]),
    sc(2, 12, "leah",
       "So we go live with it! 'The poster nobody printed' — that title alone gets ten thousand views.",
       "Also gehen wir damit live! „Das Plakat, das niemand gedruckt hat“ — allein der Titel bringt zehntausend Views.",
       [("title", "Titel"), ("views", "Views"), ("printed", "gedruckt"), ("alone", "allein"), ("thousand", "tausend")]),
    sc(2, 13, "sara",
       "Not yet. We have evidence of a poster — not of a plan. Motive first: who profits?",
       "Noch nicht. Wir haben Beweise für ein Plakat — nicht für einen Plan. Zuerst das Motiv: Wer profitiert?",
       [("profits", "profitiert"), ("plan", "Plan"), ("yet", "noch")]),
    sc(2, 14, "narrator",
       "Tell it like the homework taught you — what had the crew learned by the end of the day?",
       "Erzähl es, wie es die Hausübung gezeigt hat — was hatte die Crew am Ende des Tages gelernt?",
       [("taught", "gezeigt (hat)"), ("learned", "gelernt"), ("end", "Ende")],
       slots=[("fix-it", "g4u02.gi.past-perfect.cp.002")]),
    sc(2, 15, "narrator",
       "Three words on a wall. One question under them. The homework got an A — and a job.",
       "Drei Wörter an einer Wand. Eine Frage darunter. Die Hausübung bekam ein Sehr gut — und einen Job.",
       [("job", "Job"), ("got", "bekam")],
       slots=[("recap", "g4u02.ci.the-method.mc.001")]),
    sc(2, 16, "leah",
       "FOURTEEN is quiet this week. Quiet is not the same as asleep.",
       "FOURTEEN ist diese Woche leise. Leise ist nicht dasselbe wie eingeschlafen.",
       [("quiet", "leise"), ("asleep", "eingeschlafen"), ("same", "dasselbe")],
       next_="END"),
])

# ═══════════════════════════════════════════════════════════════════════════
# ch03 · u03 New York, New York — "The Second Pitch"
# The NY pitch retells the Hudson landing (the unit's own story); first anomaly:
# the "random" pitch assignments gave the loudest classes to Sydney.
# ═══════════════════════════════════════════════════════════════════════════
CH03 = ("The Second Pitch", "Der zweite Pitch", [
    sc(3, 1, "narrator",
       "Pitch week, round two: New York. Class 4B gets three minutes to sell a whole city.",
       "Pitch-Woche, Runde zwei: New York. Die 4B bekommt drei Minuten, um eine ganze Stadt zu verkaufen.",
       [("round", "Runde"), ("sell", "verkaufen"), ("whole", "ganze"), ("minutes", "Minuten")]),
    sc(3, 2, "leah",
       "Their video is GOOD. They tell the story of the plane on the Hudson river — the whole hall goes silent.",
       "Ihr Video ist GUT. Sie erzählen die Geschichte vom Flugzeug auf dem Hudson — die ganze Aula wird still.",
       [("plane", "Flugzeug"), ("river", "Fluss"), ("silent", "still"), ("hall", "Aula")]),
    sc(3, 3, "ben",
       "An emergency landing on water, and every single person got out. New York wins my heart, honestly.",
       "Eine Notlandung auf dem Wasser, und wirklich jeder kam raus. New York gewinnt mein Herz, ehrlich.",
       [("emergency landing", "Notlandung"), ("single", "einzelne"), ("heart", "Herz"), ("honestly", "ehrlich")],
       slots=[("name-it", "g4u03.w.emergency-landing")]),
    sc(3, 4, "sara",
       "The pilot's statement after the miracle was one line: 'We did our job.' THAT is how you talk when it matters.",
       "Das Statement des Piloten nach dem Wunder war ein Satz: „Wir haben unsere Arbeit gemacht.“ SO redet man, wenn es zählt.",
       [("statement", "Statement"), ("miracle", "Wunder"), ("pilot", "Pilot"), ("matters", "zählt")],
       slots=[("name-it", "g4u03.w.miracle")]),
    sc(3, 5, "narrator",
       "After the assembly, Leo does not clap. He stares at his notebook.",
       "Nach der Versammlung klatscht Leo nicht. Er starrt in sein Notizbuch.",
       [("clap", "klatschen"), ("stares", "starrt"), ("notebook", "Notizbuch"), ("assembly", "Versammlung")]),
    sc(3, 6, "leo",
       "The pitch lists. Every class was given a city — 'randomly', they said. I wrote down who got what.",
       "Die Pitch-Listen. Jede Klasse hat eine Stadt bekommen — „zufällig“, hieß es. Ich habe aufgeschrieben, wer was bekommen hat.",
       [("randomly", "zufällig"), ("lists", "Listen"), ("wrote down", "aufgeschrieben")]),
    sc(3, 7, "leo",
       "The three loudest classes, the ones everyone listens to? All three got Sydney. Random does not look like this.",
       "Die drei lautesten Klassen, auf die alle hören? Alle drei haben Sydney bekommen. Zufall sieht nicht so aus.",
       [("loudest", "lautesten"), ("random", "Zufall"), ("listens", "hören auf")]),
    sc(3, 8, "narrator",
       "Report exactly what was said — a reporter repeats it right or not at all. Fix the wrong line.",
       "Berichte genau, was gesagt wurde — ein Reporter gibt es richtig wieder oder gar nicht. Korrigiere den falschen Satz.",
       [("repeats", "gibt wieder"), ("reporter", "Reporter"), ("fix", "korrigiere"), ("wrong", "falsch")],
       slots=[("fix-it", "g4u03.gi.reported-speech-statements.ec.001")]),
    sc(3, 9, "sara",
       "Kevin from 3C told me his class had wanted Dublin. They got Sydney anyway — 'the list said so.'",
       "Kevin aus der 3C hat mir erzählt, seine Klasse hätte Dublin gewollt. Sie haben trotzdem Sydney bekommen — „die Liste hat es so gesagt.“",
       [("anyway", "trotzdem"), ("list", "Liste")]),
    sc(3, 10, "ben",
       "So the list is the boss now? Who elected the list?",
       "Also ist jetzt die Liste der Chef? Wer hat die Liste gewählt?",
       [("boss", "Chef"), ("elected", "gewählt")]),
    sc(3, 11, "narrator",
       "One more line to fix — the announcement got twisted on its way through the school.",
       "Noch ein Satz zum Korrigieren — die Durchsage wurde auf dem Weg durch die Schule verdreht.",
       [("announcement", "Durchsage"), ("twisted", "verdreht"), ("way", "Weg")],
       slots=[("fix-it", "g4u03.gi.reported-speech-statements.ec.002")]),
    sc(3, 12, "you",
       "I add a line to the wall: the loud classes pitch Sydney. Somebody planned the noise.",
       "Ich schreibe eine Zeile an die Wand: Die lauten Klassen pitchen Sydney. Jemand hat den Lärm geplant.",
       [("noise", "Lärm"), ("planned", "geplant"), ("add", "hinzufügen"), ("line", "Zeile")]),
    sc(3, 13, "sara",
       "Still not proof. But it is a pattern — and patterns have makers.",
       "Immer noch kein Beweis. Aber es ist ein Muster — und Muster haben Macher.",
       [("proof", "Beweis"), ("pattern", "Muster"), ("makers", "Macher"), ("still", "immer noch")],
       slots=[("recap", "g4u03.ci.the-lists.mc.001")]),
    sc(3, 14, "leah",
       "New York got my heart today. The list is trying to give it to Sydney. Let it try.",
       "New York hat heute mein Herz gewonnen. Die Liste versucht, es Sydney zu geben. Soll sie es versuchen.",
       [("trying", "versucht")],
       next_="END"),
])

# ═══════════════════════════════════════════════════════════════════════════
# ch04 · u04 A working life — "The Newsroom"
# Work-experience week: `you` + Sara at the local paper under Mira Novak.
# The craft chapter — two sources, notes, protect people.
# ═══════════════════════════════════════════════════════════════════════════
CH04 = ("The Newsroom", "Die Redaktion", [
    sc(4, 1, "narrator",
       "Work-experience week. Sara and you land at the local paper. It smells of coffee and old printers.",
       "Berufspraktische Woche. Sara und du landet bei der Lokalzeitung. Es riecht nach Kaffee und alten Druckern.",
       [("local paper", "Lokalzeitung"), ("smells", "riecht"), ("coffee", "Kaffee"), ("printers", "Drucker")]),
    sc(4, 2, "novak",
       "Mira Novak. You are the school-channel kids. I watch your show — you are honest and you are loud. One of those is a skill.",
       "Mira Novak. Ihr seid die Kinder vom Schulkanal. Ich schaue eure Show — ihr seid ehrlich und ihr seid laut. Eins davon ist eine Fähigkeit.",
       [("skill", "Fähigkeit"), ("honest", "ehrlich"), ("show", "Show")]),
    sc(4, 3, "sara",
       "Which one?",
       "Welches?",
       []),
    sc(4, 4, "novak",
       "Ask me again on Friday. First job: the interview for page two. You take notes. Notes are half of journalism.",
       "Frag mich am Freitag nochmal. Erster Job: das Interview für Seite zwei. Ihr macht Notizen. Notizen sind die halbe Arbeit im Journalismus.",
       [("interview", "Interview"), ("notes", "Notizen"), ("journalism", "Journalismus"), ("page", "Seite")],
       slots=[("name-it", "g4u04.w.journalism")]),
    sc(4, 5, "narrator",
       "The interview: a baker who is closing after forty years. Novak asks four questions and then just listens.",
       "Das Interview: ein Bäcker, der nach vierzig Jahren zusperrt. Novak stellt vier Fragen und hört dann nur zu.",
       [("baker", "Bäcker"), ("closing", "zusperrt"), ("listens", "hört zu")]),
    sc(4, 6, "novak",
       "Rule one: a good question is short. Rule two: write down what people ask you, exactly — report the question, not your memory of it.",
       "Regel eins: Eine gute Frage ist kurz. Regel zwei: Schreibt genau auf, was man euch fragt — berichtet die Frage, nicht eure Erinnerung daran.",
       [("rule", "Regel"), ("memory", "Erinnerung"), ("exactly", "genau"), ("short", "kurz")],
       slots=[("fix-it", "g4u04.gi.reported-questions.cp.001")]),
    sc(4, 7, "sara",
       "The baker asked us whether anyone still cared about real bread. I wrote it down word for word.",
       "Der Bäcker hat uns gefragt, ob sich noch irgendwer für echtes Brot interessiert. Ich habe es Wort für Wort aufgeschrieben.",
       [("whether", "ob"), ("cared", "sich interessiert"), ("bread", "Brot"), ("real", "echt")]),
    sc(4, 8, "you",
       "After lunch I tell Novak about the school vote. The poster, the printer, the lists. She goes very still.",
       "Nach dem Mittagessen erzähle ich Novak von der Schulabstimmung. Das Plakat, der Drucker, die Listen. Sie wird ganz still.",
       [("lunch", "Mittagessen"), ("still", "still"), ("vote", "Abstimmung")]),
    sc(4, 9, "novak",
       "That is a real story. So hear the real rules. Two sources for every fact — one voice is a rumour, two are a report.",
       "Das ist eine echte Story. Also hört die echten Regeln. Zwei Quellen für jeden Fakt — eine Stimme ist ein Gerücht, zwei sind ein Bericht.",
       [("sources", "Quellen"), ("rumour", "Gerücht"), ("report", "Bericht"), ("fact", "Fakt"), ("voice", "Stimme")]),
    sc(4, 10, "novak",
       "And never burn the person who trusts you. If somebody talks to you quietly, they stay safe — deadline or no deadline.",
       "Und verbrennt nie die Person, die euch vertraut. Wenn jemand leise mit euch redet, bleibt er geschützt — Deadline hin oder her.",
       [("burn", "verbrennen"), ("trusts", "vertraut"), ("deadline", "Deadline"), ("safe", "geschützt"), ("quietly", "leise")],
       slots=[("name-it", "g4u04.w.deadline")]),
    sc(4, 11, "sara",
       "Why do you not take the story yourself? You are the real journalist.",
       "Warum nimmst du die Story nicht selbst? Du bist die echte Journalistin.",
       [("journalist", "Journalistin"), ("yourself", "selbst")]),
    sc(4, 12, "novak",
       "Because it is yours. It happened in your school, to your vote. Do it right — and when you need me, ask.",
       "Weil sie euch gehört. Es ist an eurer Schule passiert, mit eurer Abstimmung. Macht es richtig — und wenn ihr mich braucht, fragt.",
       [("happened", "passiert"), ("right", "richtig"), ("need", "braucht")]),
    sc(4, 13, "narrator",
       "One more line for the notebook — report what Novak asked you, exactly.",
       "Noch eine Zeile fürs Notizbuch — berichte genau, was Novak euch gefragt hat.",
       [("notebook", "Notizbuch"), ("line", "Zeile")],
       slots=[("fix-it", "g4u04.gi.reported-questions.cp.002")]),
    sc(4, 14, "narrator",
       "Friday. Novak looks at Sara: 'Honest is the skill. Loud is a volume.' Sara writes THAT down too.",
       "Freitag. Novak schaut Sara an: „Ehrlich ist die Fähigkeit. Laut ist eine Lautstärke.“ Sara schreibt auch DAS auf.",
       [("volume", "Lautstärke")],
       slots=[("recap", "g4u04.ci.the-craft.mc.001")]),
    sc(4, 15, "ben",
       "You two come back from newspaper week like knights from a castle. Did they give you swords?",
       "Ihr zwei kommt von der Zeitungswoche zurück wie Ritter von einer Burg. Habt ihr Schwerter bekommen?",
       [("knights", "Ritter"), ("castle", "Burg"), ("swords", "Schwerter"), ("newspaper", "Zeitung")]),
    sc(4, 16, "sara",
       "Better. Rules.",
       "Besser. Regeln.",
       [],
       next_="END"),
])

# ═══════════════════════════════════════════════════════════════════════════
# ch05 · u05 Hungry? — "Free Pizza"
# The catering trail: SunWays sponsors vote-week snacks. Brandt's first scene.
# Comic surface, serious floor. Act-1 curtain: this is organized.
# ═══════════════════════════════════════════════════════════════════════════
CH05 = ("Free Pizza", "Gratis Pizza", [
    sc(5, 1, "narrator",
       "Vote week starts with a smell: free pizza in the schoolyard. A new stand, bright orange, very shiny.",
       "Die Abstimmungswoche beginnt mit einem Geruch: Gratis-Pizza im Schulhof. Ein neuer Stand, knallorange, sehr glänzend.",
       [("smell", "Geruch"), ("schoolyard", "Schulhof"), ("stand", "Stand"), ("shiny", "glänzend"), ("bright", "knall-")]),
    sc(5, 2, "ben",
       "I will review it live. For the people. Somebody has to do the hard work.",
       "Ich rezensiere sie live. Für die Leute. Irgendwer muss die harte Arbeit machen.",
       [("review", "rezensieren"), ("hard", "hart")]),
    sc(5, 3, "ben",
       "Verdict: the cheese is real, the tomato is fresh, and the crust — the crust is poetry. Nine out of ten!",
       "Urteil: Der Käse ist echt, die Tomate ist frisch, und der Rand — der Rand ist Poesie. Neun von zehn!",
       [("verdict", "Urteil"), ("cheese", "Käse"), ("fresh", "frisch"), ("crust", "Pizzarand"), ("poetry", "Poesie")],
       slots=[("name-it", "g4u05.w.fresh")]),
    sc(5, 4, "sara",
       "Ben. Who pays for two hundred free pizzas?",
       "Ben. Wer bezahlt zweihundert Gratis-Pizzen?",
       [("pays", "bezahlt"), ("hundred", "hundert")]),
    sc(5, 5, "narrator",
       "On the stand, small and polite, a logo: a yellow sun over a plane. SunWays.",
       "Am Stand, klein und höflich, ein Logo: eine gelbe Sonne über einem Flugzeug. SunWays.",
       [("polite", "höflich"), ("logo", "Logo"), ("plane", "Flugzeug"), ("sun", "Sonne")]),
    sc(5, 6, "brandt",
       "You must be the film team! Herr Brandt, SunWays. We love schools. Eat, eat — happy students make good choices.",
       "Ihr müsst das Filmteam sein! Herr Brandt, SunWays. Wir lieben Schulen. Esst, esst — glückliche Schüler treffen gute Entscheidungen.",
       [("choices", "Entscheidungen"), ("students", "Schüler"), ("happy", "glücklich")]),
    sc(5, 7, "leah",
       "Herr Brandt — SunWays sells the trips, right? Is it strange to feed the people who vote on your product?",
       "Herr Brandt — SunWays verkauft die Reisen, oder? Ist es nicht seltsam, die Leute zu füttern, die über Ihr Produkt abstimmen?",
       [("sells", "verkauft"), ("feed", "füttern"), ("product", "Produkt"), ("strange", "seltsam"), ("trips", "Reisen")],
       slots=[("name-it", "g4u05.w.feed")]),
    sc(5, 8, "brandt",
       "Strange? It is normal! Everybody wins — that is how sponsoring works. Enjoy the pizza, kids.",
       "Seltsam? Es ist normal! Alle gewinnen — so funktioniert Sponsoring. Genießt die Pizza, Kinder.",
       [("sponsoring", "Sponsoring"), ("enjoy", "genießt"), ("normal", "normal"), ("works", "funktioniert")]),
    sc(5, 9, "narrator",
       "He smiles like a brochure. Then he is gone, shaking the next hand.",
       "Er lächelt wie ein Prospekt. Dann ist er weg und schüttelt die nächste Hand.",
       [("brochure", "Prospekt"), ("shaking", "schüttelt"), ("smiles", "lächelt")]),
    sc(5, 10, "leo",
       "Look at the vote posters by the gate. Bottom corner. The sun-and-plane logo — it had been printed on them all along.",
       "Schaut euch die Abstimmungsplakate beim Tor an. Untere Ecke. Das Sonne-und-Flugzeug-Logo — es war die ganze Zeit daraufgedruckt.",
       [("gate", "Tor"), ("bottom", "untere"), ("corner", "Ecke"), ("all along", "die ganze Zeit"), ("printed", "gedruckt")]),
    sc(5, 11, "narrator",
       "Put the timeline together — the connectors make it a story, not a list.",
       "Setz die Zeitleiste zusammen — die Verbindungswörter machen eine Geschichte daraus, keine Liste.",
       [("timeline", "Zeitleiste"), ("connectors", "Verbindungswörter"), ("together", "zusammen")],
       slots=[("fix-it", "g4u05.gi.past-perfect-connectors.cp.001")]),
    sc(5, 12, "sara",
       "So: before the vote had even opened, SunWays had paid for the posters AND the pizza. That is not luck. That is a budget.",
       "Also: Bevor die Abstimmung überhaupt gestartet war, hatte SunWays schon die Plakate UND die Pizza bezahlt. Das ist kein Glück. Das ist ein Budget.",
       [("luck", "Glück"), ("budget", "Budget"), ("paid", "bezahlt"), ("even", "überhaupt")]),
    sc(5, 13, "ben",
       "I accepted pizza from the... other side? I need a moment. And maybe another slice, for research.",
       "Ich habe Pizza von der... Gegenseite angenommen? Ich brauche einen Moment. Und vielleicht noch ein Stück, für die Forschung.",
       [("accepted", "angenommen"), ("slice", "Stück"), ("research", "Forschung"), ("side", "Seite")],
       slots=[("name-it", "g4u05.w.accept")]),
    sc(5, 14, "narrator",
       "One more connector line — say what had happened before Ben's ninth slice.",
       "Noch ein Satz mit Verbindungswörtern — sag, was passiert war, vor Bens neuntem Stück.",
       [("ninth", "neuntem")],
       slots=[("fix-it", "g4u05.gi.past-perfect-connectors.cp.003")]),
    sc(5, 15, "narrator",
       "On the studio wall, the question changes. Not 'who wins if Sydney wins?' — 'who is MAKING Sydney win?'",
       "An der Studiowand ändert sich die Frage. Nicht mehr „Wer gewinnt, wenn Sydney gewinnt?“ — „Wer LÄSST Sydney gewinnen?“",
       [("changes", "ändert sich")],
       slots=[("recap", "g4u05.ci.the-stand.mc.001")]),
    sc(5, 16, "leah",
       "Act one is over, team. This is organized. And we are the only ones filming it.",
       "Akt eins ist vorbei, Leute. Das ist organisiert. Und wir sind die Einzigen, die es filmen.",
       [("organized", "organisiert"), ("only", "einzigen"), ("over", "vorbei")],
       next_="END"),
])

CI_ITEMS = [
    ci("g4u02.ci.the-method.mc.001",
       "What are the three things on the studio wall?",
       "Motive, opportunity, evidence.",
       ["Camera, lights, microphone.", "Dublin, New York, Sydney.", "Pizza, poster, printer."],
       [("motive", "Motiv"), ("opportunity", "Gelegenheit"), ("evidence", "Beweise"), ("microphone", "Mikrofon"), ("lights", "Lichter"), ("wall", "Wand"), ("printer", "Drucker"), ("poster", "Plakat")],
       "Die Detektivgeschichte aus der Hausübung nennt genau drei Dinge.",
       "Sara liest die Zeile vor: Ein Detektiv braucht Motiv, Gelegenheit und Beweise — die Crew macht daraus ihre Checkliste."),
    ci("g4u03.ci.the-lists.mc.001",
       "What did Leo notice about the pitch lists?",
       "The loudest classes all got Sydney.",
       ["Every class got its favourite city.", "The lists were written in English.", "New York was not on the lists."],
       [("loudest", "lautesten"), ("lists", "Listen"), ("notice", "bemerken"), ("favourite", "Lieblings-"), ("classes", "Klassen")],
       "Leo hat aufgeschrieben, wer welche Stadt bekommen hat — und ein Muster gesehen.",
       "Die drei lautesten Klassen haben alle Sydney bekommen. Zufall sieht anders aus — das ist das erste Muster der Investigation."),
    ci("g4u04.ci.the-craft.mc.001",
       "What is Novak's rule about facts?",
       "Two sources for every fact.",
       ["Write facts in capital letters.", "Only film facts, never write them.", "Facts need a good title."],
       [("sources", "Quellen"), ("fact", "Fakt"), ("capital letters", "Großbuchstaben"), ("title", "Titel"), ("rule", "Regel")],
       "Eine Stimme ist ein Gerücht — wie viele braucht ein Bericht?",
       "Novaks Handwerksregel: Zwei Quellen für jeden Fakt. Eine Stimme ist ein Gerücht, zwei sind ein Bericht."),
    ci("g4u05.ci.the-stand.mc.001",
       "Who paid for the free pizza stand?",
       "SunWays, the travel sponsor.",
       ["Direktorin Huber, as a surprise.", "Class 4B, from the class fund.", "Nobody — the pizza was left over."],
       [("paid", "bezahlt"), ("sponsor", "Sponsor"), ("surprise", "Überraschung"), ("left over", "übrig"), ("fund", "Kassa"), ("travel", "Reise-")],
       "Schau auf das kleine Logo am Stand: eine Sonne über einem Flugzeug.",
       "Der Stand trägt das SunWays-Logo — die Firma, die die Reisen verkauft, füttert die Leute, die abstimmen. Genau das macht die Crew stutzig."),
]

CAST_ADD = [
    {"id": "novak", "nameEn": "Mira Novak", "descriptionDe": "Journalistin der Lokalzeitung — die Mentorin", "voice": None, "art": None},
    {"id": "brandt", "nameEn": "Herr Brandt", "descriptionDe": "der SunWays-Mann — glatt und freundlich", "voice": None, "art": None},
    {"id": "steiner", "nameEn": "Herr Steiner", "descriptionDe": "Sportlehrer — beliebt, und mittendrin", "voice": None, "art": None},
    {"id": "amelie", "nameEn": "Amelie", "descriptionDe": "2A — Bens jüngste Moderatorin, stellt die besten Fragen", "voice": None, "art": None},
]

NAMES_ADD = [
    {"name": "Mira Novak", "note": "local-paper journalist, u04 mentor"},
    {"name": "Novak", "note": "short form"},
    {"name": "Herr Steiner", "note": "sports teacher — the compromised adult (ch10/ch12)"},
    {"name": "Steiner", "note": "short form"},
    {"name": "SunWays", "note": "the travel sponsor (system-antagonist)"},
    {"name": "Herr Brandt", "note": "SunWays rep"},
    {"name": "Brandt", "note": "short form"},
    {"name": "Amelie", "note": "2A student, Ben's community mod"},
    {"name": "Kevin", "note": "3C student (ch03 source)"},
    {"name": "Hudson", "note": "the river (u03's own story, NY pitch)"},
]


def run():
    sp = os.path.join(BUNDLE, "story.json")
    story = json.load(open(sp))
    for unit, (t_en, t_de, scenes) in [(2, CH02), (3, CH03), (4, CH04), (5, CH05)]:
        chapter = {"id": f"{SID}.ch{unit:02d}", "unit": unit, "titleEn": t_en, "titleDe": t_de,
                   "scenes": link(scenes)}
        story["chapters"] = [c for c in story["chapters"] if c["unit"] != unit] + [chapter]
    story["chapters"].sort(key=lambda c: c["unit"])
    json.dump(story, open(sp, "w"), ensure_ascii=False, indent=1)

    cp = os.path.join(BUNDLE, "comprehension.json")
    comp = json.load(open(cp))
    have = {i["id"] for i in comp["items"]}
    comp["items"] = [i for i in comp["items"] if i["id"] not in {c["id"] for c in CI_ITEMS}] + CI_ITEMS
    json.dump(comp, open(cp, "w"), ensure_ascii=False, indent=1)

    castp = os.path.join(BUNDLE, "cast.json")
    cast = json.load(open(castp))
    ids = {m["id"] for m in cast["members"]}
    cast["members"] += [m for m in CAST_ADD if m["id"] not in ids]
    json.dump(cast, open(castp, "w"), ensure_ascii=False, indent=1)

    np_ = os.path.join(BUNDLE, "names.json")
    names = json.load(open(np_))
    nset = {n["name"] for n in names["names"]}
    names["names"] += [n for n in NAMES_ADD if n["name"] not in nset]
    json.dump(names, open(np_, "w"), ensure_ascii=False, indent=1)

    # guard: every slot itemId must exist in the corpus (fail loud, before validators)
    import glob
    all_ids = set()
    for f in glob.glob(os.path.join(ROOT, "content", "corpus", "units", "g4-u*", "*.json")):
        if f.endswith(("vocab.json", "grammar.json")):
            data = json.load(open(f))
            for it in data.get("items", []):
                all_ids.add(it["id"])
    for _, (_, _, scenes) in [(2, CH02), (3, CH03), (4, CH04), (5, CH05)]:
        for s in scenes:
            for t in s["taskSlots"]:
                if ".ci." not in t["itemId"]:
                    assert t["itemId"] in all_ids, f"phantom itemId {t['itemId']}"
    print("act1 applied: ch02–ch05,", len(CI_ITEMS), "ci items, cast+names extended; slot ids verified")


if __name__ == "__main__":
    run()
