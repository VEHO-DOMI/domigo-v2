import type { TrainerLanguage } from "../trainer/register";
export function activityCopy(grade: number, language: TrainerLanguage = grade === 1 ? "de" : "en") {
  const de = language === "de";
  return {
    back: de ? "Zurück" : "Back", title: "Activity Game", subtitle: de ? "Zeichnen · Zeigen · Erklären" : "Draw · Show · Explain",
    groups: de ? "Gruppen" : "Groups", group: de ? "Gruppe" : "Group", add: de ? "Gruppe hinzufügen" : "Add group", remove: de ? "Gruppe entfernen" : "Remove group",
    seconds: de ? "Zeit pro Runde" : "Time per round", rounds: de ? "Runden pro Gruppe" : "Rounds per group", unlimited: de ? "Ohne Rundenlimit" : "Unlimited rounds",
    modes: de ? "So spielt ihr" : "Ways to play", modeHint: de ? "Wähle mindestens eine Art. Mehrere werden gemischt." : "Pick at least one. Pick several to mix.",
    mode: { draw: de ? "Zeichnen" : "Draw", show: de ? "Zeigen" : "Show", explain: de ? "Erklären" : "Explain" },
    rule: { draw: de ? "Zeichne das Wort auf die Tafel, ohne zu sprechen." : "Draw the word silently on the board.", show: de ? "Stelle das Wort dar. Nicht sprechen oder buchstabieren." : "Mime the word — no talking, no spelling.", explain: de ? "Erkläre auf Englisch, ohne das Wort selbst zu sagen." : "Explain in English — never say the word itself." },
    all: de ? "Alle" : "All", none: de ? "Keine" : "None", available: de ? "Wörter verfügbar" : "words available",
    bonus: de ? "Zeitbonus" : "Time bonus", bonusHelp: de ? "+1 Punkt, wenn alle übrigen Wörter vor Ablauf der Zeit erraten sind." : "+1 point for guessing every remaining word before time runs out.",
    start: de ? "Spiel starten" : "Start game", startRound: de ? "Runde starten" : "Start round", turn: de ? "Du bist dran!" : "Your turn!", round: de ? "Runde" : "Round", of: de ? "von" : "of",
    remaining: de ? "Wörter übrig" : "words left", scoreboard: de ? "Punktestand" : "Scoreboard", roundScore: de ? "Punkte dieser Runde" : "Round score", points: de ? "Punkte" : "points",
    correct: de ? "Richtig" : "Correct", skip: de ? "Weiter" : "Skip", skipped: de ? "Übersprungen" : "Skipped", undo: de ? "Letztes Wort zurück" : "Undo last", undoRound: de ? "Runde zurücknehmen" : "Undo round",
    next: de ? "Nächste Gruppe" : "Next turn", resetRound: de ? "Runde neu starten" : "Reset round", reset: de ? "Spiel zurücksetzen" : "Reset game", end: de ? "Spiel beenden" : "End game", final: de ? "Spiel zu Ende!" : "Game over!", again: de ? "Neues Spiel" : "New game",
    tie: de ? "Gleichstand" : "Tie", winner: de ? "Gewonnen" : "Winner", sound: de ? "Ton" : "Sound", on: de ? "an" : "on", off: de ? "aus" : "off",
    cancel: de ? "Abbrechen" : "Cancel", confirm: de ? "Bestätigen" : "Confirm", resetQuestion: de ? "Alle Punkte dieses Spiels gehen verloren." : "All scores for this game will be lost.",
    roundQuestion: de ? "Diese Runde wird vollständig zurückgenommen. Die Zeit startet danach neu." : "This round will be undone completely. Its timer will start again.", endQuestion: de ? "Jetzt die Endstände anzeigen?" : "Show the final scores now?",
    empty: de ? "Für diese Auswahl sind keine Wörter verfügbar." : "No words are available for this selection.", unavailable: de ? "Activity Game ist gerade nicht erreichbar. Bitte versuche es später noch einmal." : "Activity Game is unavailable just now. Please try again later.",
    session: de ? "Dieses Spiel bleibt nur geöffnet, solange ihr auf dieser Seite bleibt." : "This game lasts only while you stay on this page.",
  };
}
