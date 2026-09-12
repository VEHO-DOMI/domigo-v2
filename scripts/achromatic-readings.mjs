// CODEX DRAFT — NOT CANON. Exact source and anatomical frame.
export const DUAL_READINGS = {
  "ch02/pinguin": {
    "word": "black and white",
    "sourceSha256": "f19009c2a1e5e6ea08663b7d9ea90fbb2f13977a3d0f06e2cecf7db0aa1addf2",
    "width": 279,
    "height": 382,
    "regions": [
      {
        "id": "black-flipper",
        "colour": "black",
        "x": 35,
        "y": 210,
        "w": 28,
        "h": 55
      },
      {
        "id": "black-head",
        "colour": "black",
        "x": 110,
        "y": 20,
        "w": 55,
        "h": 28
      },
      {
        "id": "white-belly",
        "colour": "white",
        "x": 115,
        "y": 208,
        "w": 85,
        "h": 90
      }
    ],
    "why": "Neutral-white repaint inspected and measured 2026-09-12. Fixed 28×55 flipper and 55×28 head interiors exclude silhouette, eyes and beak; fixed 85×90 central belly excludes feet and background. Each region has 100% qualifying opaque pixels and one full connected component; eroded core shares are 0.794805/0.794805/0.910588. Belly RGB medians 246/246/245, black flipper48/53/51 and head63/64/62. Original ivory belly medians208/185/134 had zero qualifying neutral-white pixels. This is a measured source reading, not a blind pupil colour or live-render acceptance."
  }
};
