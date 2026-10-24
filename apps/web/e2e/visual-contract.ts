// Fixed palette from the calibrated source. Changes require review, never runtime regeneration.
export const ACCENTS = {
  "1-light": {
    "--accent": "#16a34a",
    "--accent-light": "#22c55e",
    "--accent-glow": "rgba(22,163,74,0.15)",
    "--accent-deep": "#15803d"
  },
  "1-dark": {
    "--accent": "#22c55e",
    "--accent-light": "#4ade80",
    "--accent-glow": "rgba(34,197,94,0.25)",
    "--accent-deep": "#15803d"
  },
  "2-light": {
    "--accent": "#dc2626",
    "--accent-light": "#ef4444",
    "--accent-glow": "rgba(220,38,38,0.15)",
    "--accent-deep": "#b91c1c"
  },
  "2-dark": {
    "--accent": "#ef4444",
    "--accent-light": "#f87171",
    "--accent-glow": "rgba(239,68,68,0.25)",
    "--accent-deep": "#b91c1c"
  },
  "3-light": {
    "--accent": "#2563eb",
    "--accent-light": "#3b82f6",
    "--accent-glow": "rgba(37,99,235,0.15)",
    "--accent-deep": "#1d4ed8"
  },
  "3-dark": {
    "--accent": "#3b82f6",
    "--accent-light": "#60a5fa",
    "--accent-glow": "rgba(59,130,246,0.25)",
    "--accent-deep": "#004f9f"
  },
  "4-light": {
    "--accent": "#7c3aed",
    "--accent-light": "#8b5cf6",
    "--accent-glow": "rgba(124,58,237,0.15)",
    "--accent-deep": "#6d28d9"
  },
  "4-dark": {
    "--accent": "#8b5cf6",
    "--accent-light": "#a78bfa",
    "--accent-glow": "rgba(139,92,246,0.25)",
    "--accent-deep": "#5b21b6"
  }
} as const;
