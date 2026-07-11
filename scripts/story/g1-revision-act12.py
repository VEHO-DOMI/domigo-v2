#!/usr/bin/env python3
"""G1-N revision, batch 2 — Act 1 seeds (ch01–ch05) + Act 2 clue beats (ch07–ch10).

Bible §3: Act-1 chapters stay "as shipped" plus ONE seed each; Act-2 chapters
gain their investigation/empathy beat. Shipped scenes are carried over VERBATIM
(already level-gate-green); new scenes are inserted at the beat position, then
the chapter is renumbered + rechained. Slots asserted unchanged.
"""
import json

P = "content/corpus/stories/g1.st.lost-pages/story.json"
CH = "g1.st.lost-pages"


def sc(speaker, en, de, glosses):
    return {
        "id": "TBD",
        "speaker": speaker,
        "textEn": en,
        "scaffoldDe": de,
        "glosses": [{"word": w, "de": d, "scope": None} for w, d in glosses],
        "audio": None,
        "taskSlots": [],
        "next": None,
    }


# For each chapter: list of (insert_after_original_index_1based, [new scenes]).
# Original indices refer to the CURRENT shipped scene order.
INSERTS = {
    # ch01 — the backwards word; Finn laughs it off a little too fast.
    "ch01": [(6, [
        sc("finn", "Wait — this word is backwards! ... No, now it is right again.",
           "Warte — dieses Wort ist verkehrt herum! ... Nein, jetzt ist es wieder richtig.",
           [("wait", "warte"), ("word", "Wort"), ("backwards", "verkehrt herum"), ("right", "richtig"), ("again", "wieder")]),
        sc("finn", "Pages do funny things, friend. Come!",
           "Seiten machen komische Sachen, Freund. Komm!",
           [("pages", "Seiten"), ("funny", "komisch"), ("things", "Sachen"), ("come", "komm"), ("friend", "Freund")]),
    ])],
    # ch02 — Pixel finds the pencil smudge; Pixel joins the walk.
    "ch02": [(6, [
        sc("pixel", "Meow! Meow! Look here!",
           "Miau! Miau! Schau her!",
           [("meow", "Miau")]),
        sc("finn", "A pencil smudge! It is not from the book — who makes it?",
           "Ein Bleistift-Fleck! Er ist nicht aus dem Buch — wer macht das?",
           [("pencil", "Bleistift"), ("smudge", "Fleck"), ("book", "Buch"), ("makes", "macht")]),
        sc("finn", "Pixel comes with us now — good cat! Next room!",
           "Pixel kommt jetzt mit uns — gute Katze! Nächster Raum!",
           [("cat", "Katze"), ("next", "nächster"), ("room", "Raum"), ("comes", "kommt"), ("good", "gute")]),
    ])],
    # ch03 — the Captain is afraid of the sea; the X is torn out.
    "ch03": [(2, [
        sc("captain", "And... I am afraid of the sea. I! A captain!",
           "Und... ich habe Angst vor dem Meer. Ich! Ein Kapitän!",
           [("afraid", "Angst"), ("sea", "Meer"), ("captain", "Kapitän")]),
        sc("finn", "That is not right — pirates love the sea. Something is wrong with this page.",
           "Das ist nicht richtig — Piraten lieben das Meer. Etwas stimmt nicht mit dieser Seite.",
           [("right", "richtig"), ("sea", "Meer"), ("wrong", "nicht richtig"), ("page", "Seite"), ("something", "etwas")]),
    ]), (8, [
        sc("captain", "But look at my map. The X is not faded — it is torn out!",
           "Aber schau auf meine Karte. Das X ist nicht verblasst — es ist herausgerissen!",
           [("map", "Karte"), ("faded", "verblasst"), ("torn out", "herausgerissen"), ("X", "das X")]),
        sc("finn", "Torn out... Somebody has hands, then. Come, friend!",
           "Herausgerissen... Dann hat jemand Hände. Komm, Freund!",
           [("torn out", "herausgerissen"), ("somebody", "jemand"), ("hands", "Hände"), ("come", "komm"), ("friend", "Freund")]),
    ])],
    # ch04 — Robo's feelings scrambled; the first note fragment: NOBODY.
    "ch04": [(2, [
        sc("robo", "Beep! I laugh when I am sad — and I cry when I am happy. My feelings are mixed!",
           "Piep! Ich lache, wenn ich traurig bin — und ich weine, wenn ich glücklich bin. Meine Gefühle sind durcheinander!",
           [("beep", "Piep"), ("laugh", "lache"), ("cry", "weine"), ("feelings", "Gefühle"), ("mixed", "durcheinander")]),
    ]), (7, [
        sc("finn", "What is this? Someone rubbed a word hard into the page — it says: NOBODY.",
           "Was ist das? Jemand hat ein Wort fest in die Seite gerieben — da steht: NIEMAND.",
           [("someone", "jemand"), ("rubbed", "gerieben"), ("word", "Wort"), ("page", "Seite"), ("says", "steht"), ("nobody", "niemand"), ("hard", "fest")]),
        sc("robo", "Beep. Nobody is a sad word — stay with us, friend!",
           "Piep. Niemand ist ein trauriges Wort — bleib bei uns, Freund!",
           [("beep", "Piep"), ("nobody", "niemand"), ("word", "Wort"), ("stay", "bleib")]),
    ])],
    # ch05 — the song stops mid-line; Finn's Act-1-curtain admission.
    "ch05": [(6, [
        sc("anna", "But look — the song stops in the middle. The words are erased, right here.",
           "Aber schau — das Lied stoppt in der Mitte. Die Wörter sind wegradiert, genau hier.",
           [("song", "Lied"), ("stops", "stoppt"), ("middle", "Mitte"), ("words", "Wörter"), ("erased", "wegradiert"), ("right here", "genau hier")]),
        sc("finn", "Pages do not fade like this, friends. Someone rubs them out.",
           "Seiten verblassen nicht so, Freunde. Jemand radiert sie weg.",
           [("pages", "Seiten"), ("fade", "verblassen"), ("someone", "jemand"), ("rubs", "radiert weg"), ("like", "wie")]),
    ])],
    # ch07 — Luca forgets words mid-recipe; the footprints in the flour.
    "ch07": [(2, [
        sc("luca", "It is worse, friend — I know the word for it, but it is gone from my head!",
           "Es ist schlimmer, Freund — ich kenne das Wort dafür, aber es ist weg aus meinem Kopf!",
           [("worse", "schlimmer"), ("word", "Wort"), ("gone", "weg"), ("head", "Kopf"), ("know", "kenne")]),
    ]), (7, [
        sc("finn", "Chef Luca, look. In the flour — small footprints.",
           "Chef Luca, schau. Im Mehl — kleine Fußspuren.",
           [("flour", "Mehl"), ("footprints", "Fußspuren")]),
        sc("luca", "A child walks in my kitchen? Then the child is hungry, no?",
           "Ein Kind geht in meiner Küche herum? Dann hat das Kind Hunger, oder?",
           [("child", "Kind"), ("walks", "geht herum"), ("kitchen", "Küche"), ("hungry", "Hunger")]),
    ])],
    # ch08 — the missing jacket; the empathy pivot: he is cold.
    "ch08": [(6, [
        sc("mila", "But my warm jacket is not erased — it is gone. Somebody needs it more.",
           "Aber meine warme Jacke ist nicht wegradiert — sie ist weg. Jemand braucht sie mehr.",
           [("warm", "warm"), ("jacket", "Jacke"), ("erased", "wegradiert"), ("gone", "weg"), ("somebody", "jemand"), ("needs", "braucht")]),
        sc("finn", "Then somebody is cold. Keep your kind heart, Mila.",
           "Dann ist jemandem kalt. Behalte dein gutes Herz, Mila.",
           [("somebody", "jemand"), ("cold", "kalt"), ("keep", "behalte"), ("heart", "Herz"), ("kind", "gut")]),
    ])],
    # ch09 — the bowls are full at night; the animals like him; Pixel stops hissing.
    "ch09": [(6, [
        sc("tim", "Strange — the food bowls are full every morning. Somebody feeds my pets at night.",
           "Seltsam — die Futternäpfe sind jeden Morgen voll. Jemand füttert meine Haustiere in der Nacht.",
           [("strange", "seltsam"), ("food bowls", "Futternäpfe"), ("somebody", "jemand"), ("feeds", "füttert"), ("pets", "Haustiere"), ("night", "Nacht"), ("full", "voll"), ("every", "jeden")]),
        sc("finn", "And the animals are not afraid of him. Animals know good hearts.",
           "Und die Tiere haben keine Angst vor ihm. Tiere erkennen gute Herzen.",
           [("animals", "Tiere"), ("afraid", "Angst"), ("know", "erkennen"), ("hearts", "Herzen")]),
        sc("tim", "Look at Pixel — she does not hiss today. Interesting!",
           "Schau Pixel an — sie faucht heute nicht. Interessant!",
           [("hiss", "fauchen"), ("today", "heute"), ("interesting", "interessant")]),
    ])],
    # ch10 — the paper scraps; "I am sorry. I have no money here."
    "ch10": [(6, [
        sc("apple", "Small things are missing, yes. But look — he pays, with little papers.",
           "Kleine Sachen fehlen, ja. Aber schau — er bezahlt, mit kleinen Zetteln.",
           [("things", "Sachen"), ("missing", "fehlen"), ("pays", "bezahlt"), ("papers", "Zetteln"), ("little", "kleinen")]),
        sc("finn", "It says: I am sorry. I have no money here.",
           "Da steht: Es tut mir leid. Ich habe hier kein Geld.",
           [("says", "steht"), ("sorry", "es tut mir leid"), ("money", "Geld")]),
        sc("apple", "He says sorry — every time. I keep all his papers, you know.",
           "Er sagt Entschuldigung — jedes Mal. Ich hebe alle seine Zettel auf, weißt du.",
           [("says", "sagt"), ("sorry", "Entschuldigung"), ("every time", "jedes Mal"), ("keep", "aufheben"), ("papers", "Zettel"), ("know", "weißt")]),
    ])],
}

st = json.load(open(P))
for ch in st["chapters"]:
    key = ch["id"].split(".")[-1]
    if key not in INSERTS:
        continue
    old_slots = sorted(ts["itemId"] for s in ch["scenes"] for ts in s["taskSlots"])
    scenes = list(ch["scenes"])
    # apply inserts back-to-front so 1-based indices stay valid
    for after, new in sorted(INSERTS[key], key=lambda x: -x[0]):
        scenes[after:after] = [dict(s) for s in new]
    # renumber + rechain
    for i, s in enumerate(scenes):
        s["id"] = f"{CH}.{key}.s{i + 1:03d}"
    for i, s in enumerate(scenes):
        s["next"] = scenes[i + 1]["id"] if i + 1 < len(scenes) else None
    ch["scenes"] = scenes
    new_slots = sorted(ts["itemId"] for s in ch["scenes"] for ts in s["taskSlots"])
    assert old_slots == new_slots, f"{key}: slot drift"
    print(f"{key}: {len(scenes)} scenes, slots preserved")

json.dump(st, open(P, "w"), ensure_ascii=False, indent=1)
print("story.json written")
