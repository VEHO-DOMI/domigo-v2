# DomiGo Fable Calibration Review

Status: ready for the first real Chrome play-through at `http://localhost:3210/dev/game-preview/fresh`.

## The one decision

Does this opening feel like a warm, explorable Grade 1 storybook school worth continuing, or should its visual/play-feel language change before the other rooms are polished?

Concrete verdict examples:

- “Continue: the small character, camera pace, cream paper, green walls, and contextual doors feel coherent.”
- “Amend: movement is right, but rooms feel too empty; add stronger landmarks and denser school detail.”
- “Recalibrate: the palette/readability feels like a worksheet rather than an RPG; redo the visual hierarchy first.”

Recommendation: choose **Amend** unless the Book Atrium, Courtyard, corridor arrival, and Frau Berger encounter all feel emotionally connected on the first walk. Small calibration changes are cheap now and expensive after six rooms are polished.

## Five-minute path

1. Open Fresh and walk around the Book Atrium; confirm the camera scrolls instead of shrinking the full room.
2. Approach the lower door; confirm the prompt appears only nearby. Press E or Space (or Action on touch).
3. Cross the Courtyard, inspect the fountain, and enter the school.
4. Walk left in the corridor and enter the Classroom.
5. Approach Frau Berger, start the pencil task, deliberately try one wrong answer, then solve it.
6. Toggle English/German, enable Debug once, background the tab briefly, and return.

## What to report

Report one verdict plus at most three changes, in ordinary language. Examples: “camera lags too far,” “door is hard to see,” “Frau Berger should feel more alive.” No IDs or technical vocabulary are needed.

## Verification honesty

The routes return HTTP 200. Under Node 24.14.0, repository type checks, lint, automated tests, learning/story validators, production build, and the JavaScript-size ceiling all pass. The automated browser bridge failed during this session before opening a tab. Chrome and Computer Use were installed afterward; therefore no screenshot or played-path claim is recorded yet.
