/** Per-file stamps: production /art has immutable cache headers. */
export const SCHOOL_ART = {
  "berger-down.png": "dc95cbacab62",
  "berger-left.png": "b98d5ffd1f47",
  "berger-right.png": "f3b10cd664af",
  "berger-up.png": "a16669599181",
  "classroom.png": "84ba2a935e24",
  "du-down.png": "558af3445795",
  "du-left.png": "baff96d9f5ea",
  "du-right.png": "76d437dc2fd8",
  "du-up.png": "c1715f0054f6",
  "hub.png": "51dd1be455bf",
  "klecks-down.png": "1b55f800390c",
  "klecks-left.png": "1cc035c1e5c7",
  "klecks-right.png": "7f9093936526",
  "klecks-up.png": "67f16d9163d2",
  "merle-down.png": "e78d52056e90",
  "merle-left.png": "4ab4ffaf0c28",
  "merle-right.png": "de30c126d534",
  "merle-up.png": "1be948a8fd34",
  "oswin-down.png": "7f44a99f14c4",
  "oswin-left.png": "a5a4c2e45401",
  "oswin-right.png": "b6725c8476b9",
  "oswin-up.png": "a88747795c66"
} as const;
export function schoolArt(name: keyof typeof SCHOOL_ART) { return `/art/g2/school/${name}?v=${SCHOOL_ART[name]}`; }
