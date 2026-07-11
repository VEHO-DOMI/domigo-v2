#!/usr/bin/env python3
"""G3 "FOURTEEN" — one surgical character-driven improvement (Koki directive
2026-07-11: "we can also improve G3 there if you see room").

Independent fresh-context review found G3 strong on its spine (Ben, You) but
thin on ONE load-bearing character: LEAH drives the whole Season-1 tragedy
("more mistakes, more clicks") yet has no stated personal WHY — she reads as
plot-engine, breaking the story's own "no cartoon villains" bar. This gives her
an identifiable fear (being invisible / a nobody) with two coordinated touches:

  1. ch01.s001 — plant the want as a question in the innocent opening.
  2. ch07.s008 — at the moment she chooses to keep hurting Ben, name the fear.
     The original sentence is kept VERBATIM (so recap g3u07.ci.why-not-tell —
     answer "The channel is too big now" — stays clearly correct); the fear is
     appended to "Too late".

Nothing else in G3 is touched — Ben, You, Sara already land (review verdict:
"already good, do not manufacture changes").

IMPLEMENTATION NOTE: g3/story.json is HAND-FORMATTED with one compact line per
scene; json.load->json.dump would reserialize the whole file (a 3000-line noise
diff). So this does exact-string replacement on the raw text — format-preserving,
minimal diff. Idempotent (asserts each original line is present before replacing).
"""
import os

ROOT = os.path.join(os.path.dirname(__file__), "..", "..")
SP = os.path.join(ROOT, "content", "corpus", "stories", "g3.st.fourteen", "story.json")

REPLACEMENTS = [
    # ch01.s001 — plant Leah's want as a question (+ glosses: knows, everyone)
    (
        '{ "id": "g3.st.fourteen.ch01.s001", "speaker": "leah", "textEn": "Look at Sara\'s channel! So many people watch it.", "scaffoldDe": "Schau dir Saras Kanal an! So viele Leute schauen es.", "glosses": [{ "word": "channel", "de": "Kanal", "scope": null }], "audio": null, "taskSlots": [], "next": "g3.st.fourteen.ch01.s002" }',
        '{ "id": "g3.st.fourteen.ch01.s001", "speaker": "leah", "textEn": "Look at Sara\'s channel! Everyone knows her. Why not us?", "scaffoldDe": "Schau dir Saras Kanal an! Alle kennen sie. Warum nicht wir?", "glosses": [{ "word": "channel", "de": "Kanal", "scope": null }, { "word": "knows", "de": "kennt", "scope": null }, { "word": "everyone", "de": "alle", "scope": null }], "audio": null, "taskSlots": [], "next": "g3.st.fourteen.ch01.s002" }',
    ),
    # ch07.s008 — name the fear; keep the original sentence verbatim for the recap key (+ gloss: nobody)
    (
        '{ "id": "g3.st.fourteen.ch07.s008", "speaker": "leah", "textEn": "No. We have 60,000 subscribers now. Too late.", "scaffoldDe": "Nein. Wir haben jetzt 60.000 Abonnenten. Zu spät.", "glosses": [{ "word": "subscribers", "de": "Abonnenten", "scope": null }, { "word": "late", "de": "spät", "scope": null }], "audio": null, "taskSlots": [], "next": "g3.st.fourteen.ch07.s009" }',
        '{ "id": "g3.st.fourteen.ch07.s008", "speaker": "leah", "textEn": "No. We have 60,000 subscribers now. Too late — and I can\'t be nobody again.", "scaffoldDe": "Nein. Wir haben jetzt 60.000 Abonnenten. Zu spät — und ich will nicht wieder ein Niemand sein.", "glosses": [{ "word": "subscribers", "de": "Abonnenten", "scope": null }, { "word": "late", "de": "spät", "scope": null }, { "word": "nobody", "de": "ein Niemand", "scope": null }], "audio": null, "taskSlots": [], "next": "g3.st.fourteen.ch07.s009" }',
    ),
]


def run():
    text = open(SP, encoding="utf-8").read()
    for old, new in REPLACEMENTS:
        assert old in text, f"pre-text not found (drift?): {old[:80]}..."
        assert text.count(old) == 1, f"ambiguous match: {old[:80]}..."
        text = text.replace(old, new)
    open(SP, "w", encoding="utf-8").write(text)
    print("g3 character polish applied: 2 Leah scenes (ch01.s001 want, ch07.s008 fear) — format-preserving")


if __name__ == "__main__":
    run()
