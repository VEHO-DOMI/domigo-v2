import type { Ability } from "../level.ts";
import type { PlayerPose } from "../player.ts";

/** Each power is introduced only by its actual acquisition event. */
export const ABILITY_LORE: Record<Ability, { title: string; cause: string; use: string; pose: PlayerPose }> = {
  punch: {
    title: "Deine Handschuhe können zaubern",
    cause: "Ein Funke aus der Buchseite springt auf deine Handschuhe. Jetzt kannst du deine Faust losschicken. Sie kommt von selbst zurück.",
    use: "Halte X gedrückt und lass los, um die Faust zu werfen.", pose: "charge",
  },
  swing: {
    title: "Du kannst dich an die Ringe hängen",
    cause: "Die Magie der Seite steckt jetzt auch in deinen Händen. Sie halten dich an den schwebenden Ringen fest.",
    use: "Spring zu einem Ring. Mit der Sprungtaste lässt du wieder los.", pose: "swing",
  },
  hover: {
    title: "Deine Feder dreht sich",
    cause: "Die Magie der Seite bringt die Feder an deinem Rucksack zum Drehen. Sie hält dich wie ein kleiner Hubschrauber in der Luft.",
    use: "Halte beim Fallen die Sprungtaste gedrückt. Dann sinkst du langsamer.", pose: "hover",
  },
  hang: {
    title: "Du kannst dich an Kanten festhalten",
    cause: "Die Magie der Seite macht deinen Griff stärker. Jetzt kannst du dich an einer Kante festhalten.",
    use: "Spring an eine Kante. Mit der Sprungtaste ziehst du dich hinauf.", pose: "hang",
  },
  jump: {
    title: "Du kannst weit springen",
    cause: "In der Buchwelt bist du leicht wie eine Zeichnung. Probier aus, wie weit du springen kannst.",
    use: "Drück die Sprungtaste. Hältst du sie länger, springst du höher.", pose: "jump",
  },
  run: {
    title: "Du kannst schneller laufen",
    cause: "Die Magie der Seite macht deine Schritte schneller. So kommst du auch über längere Lücken.",
    use: "Lauf an und spring im letzten Moment ab.", pose: "run",
  },
};
