/**
 * BRAND-2 · srdp-069 · Das Zeichen des Dachs »Lauter Einser« (stern-01).
 * Geometrie wörtlich aus CODEX-ABLAGE-MARKE/batch-le2/marken/stern-01/zeichen-currentColor.svg
 * (dieselbe Komponente wie in srdp-practice, BRAND-1 V2). Es nimmt die Farbe seiner
 * Umgebung an (currentColor) und ist rein dekorativ — der Name steht als Text daneben.
 */
export default function SternZeichen({ className, size = 28 }: { className?: string; size?: number }) {
  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <g fill="currentColor">
        <path d="M14 45 L38 26 H51 V84 H31 V51 L22 58 Z" />
        <polygon points="72.000,4.000 77.173,16.881 91.021,17.820 80.369,26.719 83.756,40.180 72.000,32.800 60.244,40.180 63.631,26.719 52.979,17.820 66.827,16.881" />
      </g>
    </svg>
  );
}
