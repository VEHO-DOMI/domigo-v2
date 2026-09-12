// CODEX DRAFT — NOT CANON. Exact source and anatomical frame.
export const DUAL_READINGS = {
  "ch02/pinguin": {
    "word": "black and white",
    "sourceSha256": "f5774702b7e033be9d79ef68b05357da822cb1dcaf351222c9d2de73dfc8be02",
    "width": 512,
    "height": 384,
    "regions": [
      {
        "id": "black-flipper",
        "colour": "black",
        "x": 151,
        "y": 212,
        "w": 28,
        "h": 55
      },
      {
        "id": "black-head",
        "colour": "black",
        "x": 226,
        "y": 22,
        "w": 55,
        "h": 28
      },
      {
        "id": "white-belly",
        "colour": "white",
        "x": 231,
        "y": 210,
        "w": 85,
        "h": 90
      }
    ],
    "why": "Neutral-white repaint inspected and measured 2026-09-12. Fixed 28×55 flipper and 55×28 head interiors exclude silhouette, eyes and beak; fixed 85×90 central belly excludes feet and background. Each region has 100% qualifying opaque pixels and one full connected component; eroded core shares are 0.794805/0.794805/0.910588. Belly RGB medians 246/246/245, black flipper48/53/51 and head63/64/62. Original ivory belly medians208/185/134 had zero qualifying neutral-white pixels. This is a measured source reading, not a blind pupil colour or live-render acceptance. Technical registration only: original 279×382 RGBA preserved byte-for-byte at x=116, y=2 inside 512×384; anatomical regions translated identically. No thresholds or colours changed. Lossless compression on 2026-09-13 changes encoded bytes only; all decoded RGBA bytes and dimensions were compared against b2755d3 and are identical. Recorded source hash follows the compressed file."
  }
};
