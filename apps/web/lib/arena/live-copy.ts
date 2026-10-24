export function liveCopy(language: "de" | "en") {
    return language === "de" ? {
        title: "Live-Duell", victory: "Gewonnen!", defeat: "Diesmal verloren", draw: "Unentschieden", invitation: "Möchtest du mitspielen?", quiz: "Klassenquiz", back: "Zurück", invite: "Einladen", peer: "Mit wem spielst du?", peerHint: "Verabredet euch zum Spielen. Die Einladung gilt 30 Sekunden.",
        choose: "Chapters auswählen", mode: "Aufgaben", translation: "Übersetzung", definition: "Definition", context: "Lückensatz", count: "Fragen", create: "Quizraum öffnen", code: "Raumcode", join: "Beitreten",
        waiting: "Warten auf die anderen …", pending: "Die Einladung gilt 30 Sekunden.", accept: "Annehmen", decline: "Ablehnen", start: "Quiz starten", next: "Nächste Frage", finish: "Ergebnis zeigen", close: "Spiel beenden",
        ready: "Gleich geht’s los", round: "Runde", question: "Frage", answer: "Deine Antwort", send: "Antwort abgeben", saved: "Antwort gespeichert. Warte auf die anderen.", result: "Ergebnis", standing: "Zwischenstand", wins: "Gewonnene Runden", complete: "Geschafft!", cancelled: "Dieses Spiel ist beendet.",
        seconds: "Sekunden", me: "du", points: "Spielpunkte", xp: "Antwort-XP", correct: "Richtig", wrong: "Nicht richtig", unavailable: "Das Live-Spiel ist gerade nicht erreichbar. Du kannst in der Arena ein Word Duel spielen.",
        retry: "Noch einmal laden", rooms: "Deine Spiele", empty: "Noch kein Spiel offen.", loading: "Spiel wird geladen …", preview: "Beispiel mit erfundenen Spielern. Hier werden keine Antworten gespeichert.",
        rules: "5 Runden · 15 Sekunden je Antwort. Richtig schlägt falsch. Sind beide richtig, gewinnt die früher eingegangene Antwort.", quizRules: "15 Sekunden je Frage. Eine richtige Antwort bringt 500 bis 1000 Spielpunkte: je früher, desto mehr. Diese Spielpunkte sind keine XP.",
        select: "Bitte wähle mindestens ein Chapter.", noPeers: "Hier ist noch niemand zum Einladen.", closedQuestion: "Diese Frage ist bereits geschlossen. Der Spielstand wird neu geladen.", full: "Dieser Raum ist voll.", changed: "Die Spielerliste hat sich geändert. Bitte lade sie neu.", noQuestions: "Für diese Auswahl gibt es gerade nicht genug freie Aufgaben. Wähle ein anderes Chapter.",
    } : {
        title: "Live Battle", victory: "Victory!", defeat: "Defeat", draw: "Draw", invitation: "Would you like to play?", quiz: "Class Quiz", back: "Back", invite: "Invite", peer: "Who will you play with?", peerHint: "Arrange to play together. The invitation lasts 30 seconds.",
        choose: "Choose Chapters", mode: "Questions", translation: "Translation", definition: "Definition", context: "Gap fill", count: "Questions", create: "Open quiz room", code: "Room code", join: "Join",
        waiting: "Waiting for the others …", pending: "The invitation lasts 30 seconds.", accept: "Accept", decline: "Decline", start: "Start quiz", next: "Next question", finish: "Show final result", close: "End game",
        ready: "Get ready", round: "Round", question: "Question", answer: "Your answer", send: "Submit answer", saved: "Answer saved. Wait for the others.", result: "Result", standing: "Current score", wins: "Rounds won", complete: "Well done!", cancelled: "This game has ended.",
        seconds: "seconds", me: "you", points: "game points", xp: "answer XP", correct: "Correct", wrong: "Not correct", unavailable: "The live game is unavailable right now. You can play Word Duel in the Arena.",
        retry: "Reload", rooms: "Your games", empty: "No open games yet.", loading: "Loading game …", preview: "Example with invented players. No answers are saved here.",
        rules: "5 rounds · 15 seconds per answer. Correct beats incorrect. If both are correct, the first answer received wins.", quizRules: "15 seconds per question. A correct answer earns 500 to 1000 game points: the sooner, the more. These game points are not XP.",
        select: "Choose at least one Chapter.", noPeers: "There is nobody to invite yet.", closedQuestion: "This question has closed. The game is reloading.", full: "This room is full.", changed: "The player list has changed. Please reload it.", noQuestions: "There are not enough available questions for this selection. Choose another Chapter.",
    };
}
export function liveMessage(code: string, language: "de" | "en") {
    const c = liveCopy(language);
    if (code === "live_room_full")
        return c.full;
    if (code === "live_roster_changed")
        return c.changed;
    if (code === "live_not_enough_questions")
        return c.noQuestions;
    if (["live_question_closed", "live_question_reserved", "live_bad_answer", "live_content_changed"].includes(code))
        return c.closedQuestion;
    if (code === "live_room_closed")
        return c.cancelled;
    return c.unavailable;
}
