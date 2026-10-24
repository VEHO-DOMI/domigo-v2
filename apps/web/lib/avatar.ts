/** Names follow the actual numbered original PNGs. Never reorder the assets or
 * stored avatar ids when changing copy. Ambiguous fantasy figures use their
 * visible features rather than an invented character identity. */
export const AVATARS = [
  { id: 1, en: "Pixel Hero", de: "Pixelheld" },
  { id: 2, en: "Astronaut", de: "Astronaut" },
  { id: 3, en: "Red Panda", de: "Roter Panda" },
  { id: 4, en: "Ninja", de: "Ninja" },
  { id: 5, en: "Owl", de: "Eule" },
  { id: 6, en: "Unicorn", de: "Einhorn" },
  { id: 7, en: "Flame Spirit", de: "Flammengeist" },
  { id: 8, en: "Star", de: "Stern" },
  { id: 9, en: "Fox", de: "Fuchs" },
  { id: 10, en: "Skeleton", de: "Skelett" },
  { id: 11, en: "Goblin", de: "Goblin" },
  { id: 12, en: "Die", de: "Würfel" },
  { id: 13, en: "Penguin", de: "Pinguin" },
  { id: 14, en: "Ghost", de: "Geist" },
  { id: 15, en: "Phoenix", de: "Phönix" },
  { id: 16, en: "Viking", de: "Wikinger" },
  { id: 17, en: "Donut", de: "Donut" },
  { id: 18, en: "Taco", de: "Taco" },
  { id: 19, en: "Lightning Bolt", de: "Blitz" },
  { id: 20, en: "Treasure Chest", de: "Schatztruhe" },
  { id: 21, en: "Green Dragon", de: "Grüner Drache" },
  { id: 22, en: "Crystal Figure", de: "Kristallfigur" },
  { id: 23, en: "Cactus", de: "Kaktus" },
  { id: 24, en: "Knight", de: "Ritter" },
  { id: 25, en: "Diamond Gem", de: "Diamant" },
  { id: 26, en: "Chameleon", de: "Chamäleon" },
  { id: 27, en: "Wolf", de: "Wolf" },
  { id: 28, en: "White Furry Monster", de: "Weißes Fellmonster" },
  { id: 29, en: "Tree Face", de: "Baumgesicht" },
  { id: 30, en: "Potion Bottle", de: "Zaubertrankflasche" },
  { id: 31, en: "Moon", de: "Mond" },
  { id: 32, en: "Purple Octopus", de: "Violetter Oktopus" },
  { id: 33, en: "Golden Fantasy Bird", de: "Goldener Fantasievogel" },
  { id: 34, en: "Coffee Cup", de: "Kaffeebecher" },
  { id: 35, en: "Space Cat", de: "Weltraumkatze" },
  { id: 36, en: "Pirate", de: "Pirat" },
  { id: 37, en: "Cyborg", de: "Cyborg" },
  { id: 38, en: "Shield", de: "Schild" },
  { id: 39, en: "Robot", de: "Roboter" },
  { id: 40, en: "Cyclops", de: "Zyklop" },
  { id: 41, en: "Mushroom Sprite", de: "Pilzwesen" },
  { id: 42, en: "Axolotl", de: "Axolotl" },
  { id: 43, en: "Storm Cloud", de: "Gewitterwolke" },
  { id: 44, en: "Wizard", de: "Zauberfigur" },
  { id: 45, en: "Cat", de: "Katze" },
  { id: 46, en: "Alien", de: "Außerirdischer" },
  { id: 47, en: "Tentacle Creature", de: "Tentakelwesen" },
  { id: 48, en: "Panda", de: "Panda" },
  { id: 49, en: "Blue Droplet", de: "Blauer Tropfen" },
  { id: 50, en: "Book", de: "Buch" },
] as const;

export const AVATAR_NAMES = AVATARS.map(avatar => avatar.en);

function boundedAvatar(avatar: number): number {
  return Number.isInteger(avatar) && avatar >= 1 && avatar <= AVATARS.length ? avatar : 1;
}

export function avatarName(avatar: number, language: "de" | "en" = "en"): string {
  return AVATARS[boundedAvatar(avatar) - 1][language];
}

export function avatarPath(avatar: number): string {
  return `/avatars/${String(boundedAvatar(avatar)).padStart(2, "0")}.png`;
}
