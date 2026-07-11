#!/usr/bin/env python3
"""G1-N revision, batch 1 — ch11 (the name + confession) and Act 3 (ch12–ch15).

Authored by Fable per docs/handover/18_g1n_lost_pages_revision.md (§3 beats,
§4 structural rules, §5 register sheet). Task slots preserved verbatim; scenes
rebuilt around them. Run once from repo root; idempotent (whole-chapter
replacement). This script IS the authored content — kept under scripts/story/
so the wave is reviewable as text, then deleted or kept as provenance.
"""
import json

P = "content/corpus/stories/g1.st.lost-pages/story.json"
CH = "g1.st.lost-pages"


def sc(ch, n, speaker, en, de, glosses, slots=None):
    return {
        "id": f"{CH}.{ch}.s{n:03d}",
        "speaker": speaker,
        "textEn": en,
        "scaffoldDe": de,
        "glosses": [{"word": w, "de": d, "scope": None} for w, d in glosses],
        "audio": None,
        "taskSlots": slots or [],
        "next": None,  # chained below
    }


def slot(kind, item):
    return {"slot": kind, "itemId": item, "variantKey": None}


# ── ch11 · What's the Time — THE NAME (Tik's revelation + Finn's confession) ──
ch11 = [
    sc("ch11", 1, "finn", "This page is empty. The clocks stopped!",
       "Diese Seite ist leer. Die Uhren sind stehen geblieben!",
       [("empty", "leer"), ("clocks", "Uhren"), ("stopped", "stehen geblieben")]),
    sc("ch11", 2, "tik", "Tick tock! My clocks are frozen. Time stands still here.",
       "Tick tack! Meine Uhren sind eingefroren. Die Zeit steht hier still.",
       [("frozen", "eingefroren"), ("time", "Zeit"), ("stands still", "steht still")]),
    sc("ch11", 3, "finn", "Find the clock! Then Tik can help us.",
       "Finde die Uhr! Dann kann Tik uns helfen.",
       [("clock", "Uhr"), ("help", "helfen")],
       [slot("name-it", "g1u11.w.clock")]),
    sc("ch11", 4, "finn", "And the living room. Find it!",
       "Und das Wohnzimmer. Finde es!",
       [("living room", "Wohnzimmer")],
       [slot("name-it", "g1u11.w.living-room")]),
    sc("ch11", 5, "finn", "She is reading now. Help!",
       "Sie liest gerade. Hilf!",
       [("reading", "liest")],
       [slot("fix-it", "g1u11.gi.present-continuous.mc.001")]),
    sc("ch11", 6, "finn", "Tick tock! The clocks work again.",
       "Tick tack! Die Uhren gehen wieder.",
       [("work", "gehen"), ("again", "wieder")],
       [slot("recap", "g1u11.ci.what-stopped.mc.001")]),
    sc("ch11", 7, "tik", "Clocks know things, friend. Time stands still for ONE boy here.",
       "Uhren wissen Dinge, Freund. Für EINEN Jungen steht die Zeit hier still.",
       [("know", "wissen"), ("things", "Dinge"), ("boy", "Junge")]),
    sc("ch11", 8, "tik", "He came into the book long ago. He cannot go out.",
       "Er ist vor langer Zeit in das Buch gekommen. Er kann nicht hinaus.",
       [("came", "gekommen"), ("long ago", "vor langer Zeit"), ("go out", "hinausgehen")]),
    sc("ch11", 9, "finn", "I saw him, friend. A boy climbed into the book — I was afraid, and I told nobody.",
       "Ich habe ihn gesehen, Freund. Ein Junge ist in das Buch geklettert — ich hatte Angst, und ich habe es niemandem gesagt.",
       [("saw", "gesehen"), ("climbed", "geklettert"), ("afraid", "Angst"), ("told", "gesagt"), ("nobody", "niemand")]),
    sc("ch11", 10, "finn", "His name is Jona. I am sorry. Now you know it too.",
       "Sein Name ist Jona. Es tut mir leid. Jetzt weißt du es auch.",
       [("name", "Name"), ("sorry", "es tut mir leid"), ("know", "weißt")]),
    sc("ch11", 11, "tik", "Tick tock. It is not too late, Finn. Go and find him.",
       "Tick tack. Es ist nicht zu spät, Finn. Geh und finde ihn.",
       [("too late", "zu spät"), ("find", "finde")]),
]

# ── ch12 · Birthday Cake — the birthday he never got ──
ch12 = [
    sc("ch12", 1, "finn", "This page is empty. It is a birthday page!",
       "Diese Seite ist leer. Es ist eine Geburtstagsseite!",
       [("empty", "leer"), ("birthday", "Geburtstag")]),
    sc("ch12", 2, "rosa", "My cake is gone! But look — whose birthday is it?",
       "Mein Kuchen ist weg! Aber schau — wessen Geburtstag ist das?",
       [("cake", "Kuchen"), ("gone", "weg"), ("whose", "wessen")]),
    sc("ch12", 3, "finn", "Find the birthday cake!",
       "Finde den Geburtstagskuchen!",
       [("birthday cake", "Geburtstagskuchen")],
       [slot("name-it", "g1u12.w.birthday-cake")]),
    sc("ch12", 4, "finn", "And a candle. Find it!",
       "Und eine Kerze. Finde sie!",
       [("candle", "Kerze")],
       [slot("name-it", "g1u12.w.candle")]),
    sc("ch12", 5, "finn", "They were happy. Help!",
       "Sie waren glücklich. Hilf!",
       [("were", "waren"), ("happy", "glücklich")],
       [slot("fix-it", "g1u12.gi.past-simple-was-were.mc.001")]),
    sc("ch12", 6, "finn", "The cake is back! It looks yummy.",
       "Der Kuchen ist zurück! Er sieht lecker aus.",
       [("back", "zurück"), ("yummy", "lecker")],
       [slot("recap", "g1u12.ci.whats-gone.mc.001")]),
    sc("ch12", 7, "rosa", "Now I see it. This page is Jona's birthday. He never got it.",
       "Jetzt sehe ich es. Diese Seite ist Jonas Geburtstag. Er hat ihn nie bekommen.",
       [("see", "sehe"), ("never", "nie"), ("got", "bekommen")]),
    sc("ch12", 8, "finn", "Then we throw it now — for Jona! Rosa, the candles!",
       "Dann feiern wir ihn jetzt — für Jona! Rosa, die Kerzen!",
       [("throw", "feiern"), ("candles", "Kerzen")]),
    sc("ch12", 9, "rosa", "Happy birthday, Jona! Come and eat cake with us!",
       "Alles Gute zum Geburtstag, Jona! Komm und iss Kuchen mit uns!",
       [("eat", "iss")]),
    sc("ch12", 10, "finn", "Look! A boy stands at the edge of the page. Jona — wait!",
       "Schau! Ein Junge steht am Rand der Seite. Jona — warte!",
       [("boy", "Junge"), ("stands", "steht"), ("edge", "Rand"), ("wait", "warte")]),
    sc("ch12", 11, "rosa", "He runs away... but look, Finn. The invitation is gone — he took it.",
       "Er läuft weg... aber schau, Finn. Die Einladung ist weg — er hat sie mitgenommen.",
       [("runs away", "läuft weg"), ("invitation", "Einladung"), ("took", "mitgenommen")]),
    sc("ch12", 12, "finn", "He took it! That is a start, friends. Come!",
       "Er hat sie mitgenommen! Das ist ein Anfang, Freunde. Kommt!",
       [("start", "Anfang")]),
]

# ── ch13 · Help! — the rescue inversion ──
ch13 = [
    sc("ch13", 1, "finn", "This page is Sam's. And look — a big empty spot grows here!",
       "Diese Seite gehört Sam. Und schau — ein großer leerer Fleck wächst hier!",
       [("empty", "leer"), ("spot", "Fleck"), ("grows", "wächst")]),
    sc("ch13", 2, "sam", "We need the rescue words, friend. Find them, fast!",
       "Wir brauchen die Rettungswörter, Freund. Finde sie, schnell!",
       [("need", "brauchen"), ("rescue", "Rettung"), ("fast", "schnell")]),
    sc("ch13", 3, "finn", "Find the fire!",
       "Finde das Feuer!",
       [("fire", "Feuer")],
       [slot("name-it", "g1u13.w.fire")]),
    sc("ch13", 4, "finn", "And the ambulance. Find it!",
       "Und den Rettungswagen. Finde ihn!",
       [("ambulance", "Rettungswagen")],
       [slot("name-it", "g1u13.w.ambulance")]),
    sc("ch13", 5, "finn", "She called for help. Help!",
       "Sie hat um Hilfe gerufen. Hilf!",
       [("called", "gerufen")],
       [slot("fix-it", "g1u13.gi.past-simple-regular.mc.001")]),
    sc("ch13", 6, "sam", "Good work! I climbed the ladder — like in my story!",
       "Gute Arbeit! Ich bin die Leiter hinaufgeklettert — wie in meiner Geschichte!",
       [("climbed", "geklettert"), ("ladder", "Leiter"), ("story", "Geschichte")],
       [slot("recap", "g1u13.ci.sam-climbed.mc.001")]),
    sc("ch13", 7, "finn", "Sam! The empty spot — it goes to Jona. He is in there!",
       "Sam! Der leere Fleck — er geht zu Jona. Er ist da drin!",
       [("spot", "Fleck"), ("in there", "da drin")]),
    sc("ch13", 8, "sam", "Then we help him. That is our job. Give me your hand, boy!",
       "Dann helfen wir ihm. Das ist unsere Arbeit. Gib mir deine Hand, Junge!",
       [("job", "Arbeit"), ("hand", "Hand")]),
    sc("ch13", 9, "finn", "Jona takes his hand! Sam has him. He is out!",
       "Jona nimmt seine Hand! Sam hat ihn. Er ist draußen!",
       [("takes", "nimmt"), ("out", "draußen")]),
    sc("ch13", 10, "sam", "You are safe now, Jona. Sit with us — you do not need to talk.",
       "Du bist jetzt sicher, Jona. Sitz bei uns — du musst nicht reden.",
       [("safe", "sicher"), ("sit", "sitz"), ("talk", "reden")]),
    sc("ch13", 11, "finn", "He stays! And look — Pixel sits with him. She is not afraid.",
       "Er bleibt! Und schau — Pixel sitzt bei ihm. Sie hat keine Angst.",
       [("stays", "bleibt"), ("afraid", "Angst")]),
]

# ── ch14 · Favourite — the first conversation; Jona helps ──
ch14 = [
    sc("ch14", 1, "finn", "This page is empty, and the songs are gone! Jona is with us now — he is quiet.",
       "Diese Seite ist leer, und die Lieder sind weg! Jona ist jetzt bei uns — er ist still.",
       [("songs", "Lieder"), ("quiet", "still")]),
    sc("ch14", 2, "peppi", "Listen to my beat! Music makes everything better.",
       "Hör meinen Beat! Musik macht alles besser.",
       [("listen", "hör"), ("everything", "alles"), ("better", "besser")]),
    sc("ch14", 3, "finn", "Find the music video!",
       "Finde das Musikvideo!",
       [("music video", "Musikvideo")],
       [slot("name-it", "g1u14.w.music-video")]),
    sc("ch14", 4, "finn", "And a cartoon. Find it!",
       "Und einen Zeichentrickfilm. Finde ihn!",
       [("cartoon", "Zeichentrickfilm")],
       [slot("name-it", "g1u14.w.cartoon")]),
    sc("ch14", 5, "finn", "Yesterday I went to the park. Help!",
       "Gestern bin ich in den Park gegangen. Hilf!",
       [("yesterday", "gestern"), ("went", "gegangen")],
       [slot("fix-it", "g1u14.gi.past-simple-irregular.mc.003")]),
    sc("ch14", 6, "finn", "The music is back! Let's dance!",
       "Die Musik ist zurück! Lasst uns tanzen!",
       [("dance", "tanzen")],
       [slot("recap", "g1u14.ci.peppi-loss.mc.001")]),
    sc("ch14", 7, "jona", "I like this song.",
       "Ich mag dieses Lied.",
       [("song", "Lied")]),
    sc("ch14", 8, "peppi", "He talks! Then say it again, my friend — louder!",
       "Er redet! Dann sag es noch mal, mein Freund — lauter!",
       [("talks", "redet"), ("again", "noch mal"), ("louder", "lauter")]),
    sc("ch14", 9, "jona", "My favourite colour is green. I like cartoons... and this.",
       "Meine Lieblingsfarbe ist Grün. Ich mag Zeichentrickfilme... und das hier.",
       [("favourite", "Lieblings-"), ("colour", "Farbe")]),
    sc("ch14", 10, "finn", "Jona — help me fix this line?",
       "Jona — hilfst du mir, diese Zeile zu reparieren?",
       [("fix", "reparieren"), ("line", "Zeile")]),
    sc("ch14", 11, "jona", "Me? ... Yes. I am good at words — I forgot that.",
       "Ich? ... Ja. Ich bin gut mit Wörtern — das habe ich vergessen.",
       [("words", "Wörter"), ("forgot", "vergessen")]),
    sc("ch14", 12, "finn", "Look at the page — it turns bright! You fix it, Jona. YOU.",
       "Schau auf die Seite — sie wird hell! Du reparierst sie, Jona. DU.",
       [("bright", "hell")]),
]

# ── ch15 · Going to Do? — the release ──
ch15 = [
    sc("ch15", 1, "finn", "This is the last page! And the door is here.",
       "Das ist die letzte Seite! Und die Tür ist da.",
       [("last", "letzte"), ("door", "Tür")]),
    sc("ch15", 2, "finn", "But it is not my door alone. Jona — it is yours too.",
       "Aber es ist nicht nur meine Tür. Jona — sie gehört auch dir.",
       [("alone", "allein"), ("yours", "deine")]),
    sc("ch15", 3, "finn", "Find a holiday!",
       "Finde einen Urlaub!",
       [("holiday", "Urlaub")],
       [slot("name-it", "g1u15.w.holiday")]),
    sc("ch15", 4, "finn", "And a beach. Find it!",
       "Und einen Strand. Finde ihn!",
       [("beach", "Strand")],
       [slot("name-it", "g1u15.w.beach")]),
    sc("ch15", 5, "finn", "The page asks Jona: what are you going to do? Help him answer!",
       "Die Seite fragt Jona: Was wirst du tun? Hilf ihm beim Antworten!",
       [("asks", "fragt"), ("answer", "antworten")],
       [slot("fix-it", "g1u15.gi.going-to.mc.001")]),
    sc("ch15", 6, "finn", "Look! The door to school opens.",
       "Schau! Die Tür zur Schule geht auf.",
       [("opens", "geht auf")],
       [slot("recap", "g1u15.ci.finn-goes.mc.001")]),
    sc("ch15", 7, "jona", "I am going to go out. I am going to try again.",
       "Ich werde hinausgehen. Ich werde es wieder versuchen.",
       [("go out", "hinausgehen"), ("try", "versuchen")]),
    sc("ch15", 8, "berger", "Welcome, Finn! And welcome back, Jona. We waited for you.",
       "Willkommen, Finn! Und willkommen zurück, Jona. Wir haben auf dich gewartet.",
       [("welcome", "willkommen"), ("waited", "gewartet")]),
    sc("ch15", 9, "finn", "We did it — the book is full, and we are free. Thank you, friend.",
       "Wir haben es geschafft — das Buch ist voll, und wir sind frei. Danke, Freund.",
       [("did it", "geschafft"), ("free", "frei")]),
    sc("ch15", 10, "finn", "The book sleeps now, quiet and safe. But look — one small grey smudge is still there... and it moves a little.",
       "Das Buch schläft jetzt, still und sicher. Aber schau — ein kleiner grauer Fleck ist noch da... und er bewegt sich ein bisschen.",
       [("sleeps", "schläft"), ("smudge", "Fleck"), ("moves", "bewegt sich")]),
    sc("ch15", 11, "finn", "See you at school. Bye!",
       "Wir sehen uns in der Schule. Tschüss!",
       [("see", "sehen")]),
]


# Re-gloss pass — VS-2 field manual: glosses are PER SCENE (repeats re-gloss),
# and the bank is headwords-only (page/help/gone/took/hand/music/green… are all
# fine A1 words that simply aren't wordlist entries). Keyed by scene number.
REGLOSS = {
    "ch11": {1: [("page", "Seite")], 5: [("help", "Hilfe")], 7: [("stands still", "steht still")]},
    "ch12": {1: [("page", "Seite")], 5: [("help", "Hilfe")], 7: [("page", "Seite")],
             10: [("page", "Seite")], 11: [("gone", "weg")], 12: [("took", "mitgenommen")]},
    "ch13": {1: [("page", "Seite")], 2: [("words", "Wörter")],
             7: [("empty", "leer"), ("goes", "geht")], 9: [("hand", "Hand")], 11: [("sits", "sitzt")]},
    "ch14": {1: [("page", "Seite"), ("empty", "leer"), ("gone", "weg")],
             2: [("beat", "Beat"), ("music", "Musik")], 6: [("music", "Musik")],
             8: [("say", "sag")], 9: [("green", "grün")],
             12: [("page", "Seite"), ("turns", "wird"), ("fix", "reparierst")]},
    "ch15": {1: [("page", "Seite")], 5: [("page", "Seite"), ("help", "Hilfe")],
             9: [("full", "voll")],
             10: [("quiet", "still"), ("safe", "sicher"), ("little", "bisschen")]},
}


def chain(scenes):
    for i, s in enumerate(scenes):
        s["next"] = scenes[i + 1]["id"] if i + 1 < len(scenes) else None
    return scenes


def regloss(key, scenes):
    for n, extra in REGLOSS.get(key, {}).items():
        g = scenes[n - 1]["glosses"]
        have = {x["word"] for x in g}
        for w, d in extra:
            if w not in have:
                g.append({"word": w, "de": d, "scope": None})
    return scenes


st = json.load(open(P))
NEW = {"ch11": ch11, "ch12": ch12, "ch13": ch13, "ch14": ch14, "ch15": ch15}
for ch in st["chapters"]:
    key = ch["id"].split(".")[-1]
    if key in NEW:
        old_slots = sorted(ts["itemId"] for s in ch["scenes"] for ts in s["taskSlots"])
        ch["scenes"] = chain(regloss(key, NEW[key]))
        new_slots = sorted(ts["itemId"] for s in ch["scenes"] for ts in s["taskSlots"])
        assert old_slots == new_slots, f"{key}: slot drift {old_slots} vs {new_slots}"
        print(f"{key}: {len(ch['scenes'])} scenes, slots preserved")

json.dump(st, open(P, "w"), ensure_ascii=False, indent=1)
print("story.json written")

# jona → cast + names (bible rule 7)
cast = json.load(open("content/corpus/stories/g1.st.lost-pages/cast.json"))
if not any(m["id"] == "jona" for m in cast["members"]):
    cast["members"].append({"id": "jona", "nameEn": "Jona", "descriptionDe": "Der Junge aus dem Buch", "voice": None, "art": None})
    json.dump(cast, open("content/corpus/stories/g1.st.lost-pages/cast.json", "w"), ensure_ascii=False, indent=1)
    print("cast: jona added")
names = json.load(open("content/corpus/stories/g1.st.lost-pages/names.json"))
if not any(n["name"] == "Jona" for n in names["names"]):
    names["names"].append({"name": "Jona", "note": "the boy the book kept — named at z11, seen from z12, released at z15"})
    json.dump(names, open("content/corpus/stories/g1.st.lost-pages/names.json", "w"), ensure_ascii=False, indent=1)
    print("names: Jona added")
