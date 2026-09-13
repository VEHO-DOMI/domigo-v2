/** CODEX DRAFT — NOT CANON. Kokis Spielpass: one visible cause per story beat. */
export interface ComicPanel {
  id: string;
  stem: string;
  titleDe: string;
  sceneDe: string;
  linesDe: readonly string[];
  speakerDe?: string;
  motion: "arrive" | "ink" | "fall" | "settle";
}

export const CH01_STORY_VERSION = "erste-englischstunde-2";
export const CH01_COMIC: readonly ComicPanel[] = [
  {
    id: "school", stem: "story_school", titleDe: "Die erste Englischstunde",
    sceneDe: "Die Schule am Morgen. Durch die Fenster fällt warmes Licht.",
    linesDe: ["Du bist in der ersten Klasse. Heute habt ihr eure erste Englischstunde."], motion: "arrive",
  },
  {
    id: "book", stem: "story_book", titleDe: "Das neue Englischbuch",
    sceneDe: "Die ganze Klasse sitzt in ihrer ersten Englischstunde. Aus dem neuen Englischbuch auf dem Pult steigt dunkle Tinte.",
    linesDe: ["Euer neues Englischbuch liegt offen auf dem Pult. Plötzlich läuft Tinte über die Seiten.", "Sie wird immer mehr. Eine dunkle Gestalt steigt aus dem Buch."], motion: "ink",
  },
  {
    id: "fall", stem: "story_fall", titleDe: "Hinein ins Buch",
    sceneDe: "Ein Tintenwirbel aus dem neuen Englischbuch erfasst die ganze Klasse mit ihren Schulsachen.",
    linesDe: ["Ein Wirbel erfasst das Klassenzimmer. Das Englischbuch verschluckt eure ganze Klasse."], motion: "fall",
  },
  {
    id: "transform", stem: "story_transform", titleDe: "Du wirst Teil der Geschichte",
    sceneDe: "Auf der Buchseite wird der Junge zur gezeichneten Spielfigur. Er entdeckt Handschuhe, einen Rucksack und eine Feder.",
    linesDe: ["Auf der Seite wirst auch du zu einer Zeichnung. An deinen Händen sind plötzlich weiße Handschuhe.", "Du spürst einen Rucksack auf deinem Rücken. Oben schaut eine Feder heraus."], motion: "settle",
  },
  {
    id: "arrival", stem: "story_arrival", titleDe: "Wo sind die anderen?",
    sceneDe: "Der Held steht auf riesigen Buchrücken in einer stillen Halle. Ein kleines Buch hat seine Farbe verloren.",
    linesDe: ["Du landest auf einem riesigen Bücherstapel. Ringsum ist es still.", "Von deinen Mitschülern ist nichts zu sehen."], motion: "settle",
  },
  {
    id: "klecks", stem: "story_klecks", titleDe: "Ein kleiner Helfer", speakerDe: "Klecks",
    sceneDe: "Ein kleiner freundlicher Tintenklecks schaut zwischen den Buchseiten hervor und winkt dem Helden.",
    linesDe: ["Hallo! Ich bin Klecks. Ich habe mich von dem Tintengeist losgemacht.", "Er hat die Schule verhext. Ich will dir helfen, deine Mitschüler zu finden.", "Hier im Buch bekommst du auch magische Kräfte. Ich zeige dir unterwegs, was du damit kannst."], motion: "arrive",
  },
  {
    id: "first-step", stem: "story_first_step", titleDe: "Zeit für die Schule", speakerDe: "Klecks",
    sceneDe: "Klecks zeigt dem Helden das entfärbte Buch und die goldenen Buchstaben in der Eingangshalle.",
    linesDe: ["Fangen wir hier an. Mit den richtigen englischen Wörtern kannst du den Zauber lösen.", "Sammle unterwegs die goldenen Buchstaben. Die brauchen wir später noch."], motion: "settle",
  },
];

export const CH01_BOOT = {
  titleDe: "Die verhexte Schule",
  speakerDe: "Klecks",
  linesDe: [
    "Wir sind in der Eingangshalle. Dort liegt ein Buch, das seine Farbe verloren hat.",
    "Geh hin und sag den Namen auf Englisch. Dann gib ihm die Farbe zurück.",
  ],
  actionDe: "Los geht’s",
} as const;

/** Fictional rescue classmates, not account identities or the old prose cast. */
export const PAINT_CLASSMATES = [
  { id: "merle", name: "Merle", chapter: "ch01" },
  { id: "fenn", name: "Fenn", chapter: "ch02" },
  { id: "ilvy", name: "Ilvy", chapter: "ch03" },
  { id: "piet", name: "Piet", chapter: "ch04" },
  { id: "veit", name: "Veit", chapter: "ch05" },
  { id: "tammo", name: "Tammo", chapter: "ch06" },
  { id: "enna", name: "Enna", chapter: "ch07" },
  { id: "juno", name: "Juno", chapter: "ch08" },
  { id: "quirin", name: "Quirin", chapter: "ch09" },
  { id: "smilla", name: "Smilla", chapter: "ch10" },
  { id: "lenz", name: "Lenz", chapter: "ch11" },
  { id: "edda", name: "Edda", chapter: "ch12" },
  { id: "falk", name: "Falk", chapter: "ch13" },
  { id: "fritzi", name: "Fritzi", chapter: "ch14" },
  { id: "cleo", name: "Cleo", chapter: "ch15" },
] as const;
