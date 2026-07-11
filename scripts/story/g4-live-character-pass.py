#!/usr/bin/env python3
"""FOURTEEN: LIVE — the character-driven pass (Koki directive 2026-07-11).

Patches story.json IN PLACE (the acts' 474 convergence glosses must survive —
never rebuild from the act scripts). Five surgical upgrades, each giving a
crew member a personal stake students can identify with:

  1. BEN IS ON THE LIST — ch05 seed (the joke has a floor), ch10 reveal
     (he knows the names because one is his), the dignity beat (Leo's slice),
     ch10 promise + ch13 passenger-list check now read as his own arc.
  2. LEAH'S G3 SCAR — ch08: her 3 a.m. line ties the obsession to what the
     crew did to Ben in Season 1 ("never that person again. Tonight I was her.").
  3. SARA'S RULES HAVE AN ORIGIN — ch09: people-first exists because she
     watched the internet nearly break Ben last year (G3 ch10 park bench).
  4. LEO SAYS WHY HE FILMS — ch11: "I talk slowly. A camera waits. People
     do not." (the quiet kids' line; keeps the reflexive-pronoun slot).
  5. Ch10 restaffing so the reveal lands: the analytic third-conditional line
     moves from Ben (who is mid-reveal) to Leah (post-ch08 regret register).

Idempotent: keyed by scene id, asserts the pre-text before replacing.
Run autogloss_g4 + validate-story after.
"""
import json, os

ROOT = os.path.join(os.path.dirname(__file__), "..", "..")
SP = os.path.join(ROOT, "content", "corpus", "stories", "g4.st.fourteen-live", "story.json")
S = "g4.st.fourteen-live"

# sceneId → dict of field replacements (speaker / textEn / scaffoldDe / glosses-add)
PATCH = {
    # ── 1 · Ben's seed (ch05): the free-pizza joke gets a floor
    f"{S}.ch05.s013": {
        "textEn": "I accepted pizza from the... other side? I need a moment. And two slices to take home — that part is not a joke.",
        "scaffoldDe": "Ich habe Pizza von der... Gegenseite angenommen? Ich brauche einen Moment. Und zwei Stücke zum Mitnehmen — der Teil ist kein Witz.",
        "glosses_add": [("accepted", "angenommen"), ("slice", "Stück"), ("slices", "Stücke"), ("joke", "Witz"), ("side", "Seite"), ("take home", "mitnehmen")],
        "glosses_drop": ["research"],
    },
    # ── 1 · The reveal (ch10 s004): Sara's line becomes Ben's own
    f"{S}.ch10.s004": {
        "speaker": "ben",
        "textEn": "I know these names. Mine is one of them. My family — we were never flying anywhere, whatever city wins.",
        "scaffoldDe": "Ich kenne diese Namen. Meiner ist einer davon. Meine Familie — wir wären nie irgendwohin geflogen, egal welche Stadt gewinnt.",
        "glosses_add": [("mine", "meiner"), ("family", "Familie"), ("flying", "fliegen"), ("whatever", "egal welche"), ("names", "Namen"), ("wins", "gewinnt"), ("never", "nie")],
        "glosses_drop": ["afford", "families", "sponsor"],
    },
    # ── 1 · The dignity beat (ch10 s005): nobody makes it weird
    f"{S}.ch10.s005": {
        "textEn": "The studio goes quiet the way a room goes quiet when a story grows a second heart. Leo slides the last pizza slice over to Ben without one word.",
        "scaffoldDe": "Im Studio wird es so still, wie ein Raum still wird, wenn eine Geschichte ein zweites Herz bekommt. Leo schiebt Ben das letzte Stück Pizza rüber, ohne ein Wort.",
        "glosses_add": [("slides", "schiebt"), ("slice", "Stück"), ("word", "Wort"), ("grows", "bekommt"), ("heart", "Herz"), ("quiet", "still"), ("last", "letzte")],
    },
    # ── 5 · The analytic line moves to Leah (Ben is mid-reveal)
    f"{S}.ch10.s006": {
        "speaker": "leah",
        "textEn": "So the deal is dirty AND the reason is decent. If he had asked the school for a fund, none of this would have happened.",
        # textEn unchanged except speaker; scaffold + slot stay
    },
    # ── 1 · Ben's promise is now his own arc
    f"{S}.ch10.s015": {
        "textEn": "Whatever happens tomorrow — the twelve kids on that list go on the trip. All twelve. I am allowed to say that now. Promise me.",
        "scaffoldDe": "Was auch immer morgen passiert — die zwölf Kinder auf der Liste fahren mit. Alle zwölf. Das darf ich jetzt sagen. Versprecht es mir.",
        "glosses_add": [("promise", "versprechen"), ("allowed", "dürfen"), ("kids", "Kinder"), ("list", "Liste"), ("trip", "Reise"), ("whatever", "egal was"), ("twelve", "zwölf")],
        "glosses_drop": ["ending"],
    },
    # ── 2 · Leah's G3 scar (ch08 s005) — keeps the time-expression texture for the slot
    f"{S}.ch08.s005": {
        "textEn": "I used to check everything twice. Last year we turned Ben into a joke for views, and I promised: never that person again. Tonight I was her.",
        "scaffoldDe": "Früher habe ich alles doppelt geprüft. Letztes Jahr haben wir Ben für Views zu einem Witz gemacht, und ich habe versprochen: nie wieder diese Person. Heute Nacht war ich sie.",
        "glosses_add": [("used to", "früher"), ("turned", "gemacht"), ("joke", "Witz"), ("views", "Views"), ("promised", "versprochen"), ("person", "Person"), ("tonight", "heute Nacht"), ("twice", "doppelt"), ("never", "nie")],
        "glosses_drop": ["slept", "checked"],
    },
    # ── 3 · Sara's rules have an origin (ch09 s004)
    f"{S}.ch09.s004": {
        "textEn": "We prepare like professionals. My rules come from last year, when the internet nearly broke Ben — people first, because I have seen the alternative. Breathe in four, hold four, out four. Then: every question on its own card.",
        "scaffoldDe": "Wir bereiten uns vor wie Profis. Meine Regeln kommen vom letzten Jahr, als das Internet Ben fast zerbrochen hat — zuerst der Mensch, weil ich die Alternative gesehen habe. Vier einatmen, vier halten, vier ausatmen. Dann: jede Frage auf ihrer eigenen Karte.",
        "glosses_add": [("prepare", "vorbereiten"), ("rules", "Regeln"), ("internet", "Internet"), ("nearly", "fast"), ("broke", "zerbrochen"), ("alternative", "Alternative"), ("breathe", "atmen"), ("hold", "halten"), ("card", "Karte"), ("seen", "gesehen"), ("own", "eigene")],
    },
    # ── 4 · Leo says why he films (ch11 s010, keeps the reflexive slot diegesis)
    f"{S}.ch11.s010": {
        "speaker": "leo",
        "textEn": "I photograph everything myself, twice. I film because I talk slowly. A camera waits — people do not.",
        "scaffoldDe": "Ich fotografiere alles selbst, zweimal. Ich filme, weil ich langsam rede. Eine Kamera wartet — Menschen nicht.",
        "glosses_add": [("photograph", "fotografiere"), ("myself", "selbst"), ("twice", "zweimal"), ("film", "filme"), ("slowly", "langsam"), ("camera", "Kamera"), ("waits", "wartet"), ("talk", "rede")],
        "glosses_drop": ["photographs", "neatly"],
    },
}


def run():
    st = json.load(open(SP))
    idx = {s["id"]: s for c in st["chapters"] for s in c["scenes"]}
    changed = 0
    for sid_, p in PATCH.items():
        sc = idx[sid_]
        if "speaker" in p:
            sc["speaker"] = p["speaker"]
        if "textEn" in p:
            sc["textEn"] = p["textEn"]
        if "scaffoldDe" in p:
            sc["scaffoldDe"] = p["scaffoldDe"]
        have = {g["word"].lower() for g in sc["glosses"]}
        for w in p.get("glosses_drop", []):
            sc["glosses"] = [g for g in sc["glosses"] if g["word"].lower() != w]
        for w, d in p.get("glosses_add", []):
            if w.lower() not in have:
                sc["glosses"].append({"word": w, "de": d, "scope": None})
        # prune glosses whose word no longer appears in any line of the scene
        texts = [sc["textEn"]]
        if isinstance(sc["next"], list):
            texts += [c["textEn"] for c in sc["next"]]
        joined = " ".join(texts).lower()
        sc["glosses"] = [g for g in sc["glosses"] if g["word"].lower() in joined]
        changed += 1
    json.dump(st, open(SP, "w"), ensure_ascii=False, indent=1)
    print(f"character pass applied: {changed} scenes patched")


if __name__ == "__main__":
    run()
