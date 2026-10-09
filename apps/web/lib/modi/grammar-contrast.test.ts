import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { it } from "node:test";
const globalCss = readFileSync(new URL("../../app/globals.css", import.meta.url), "utf8");
const css = readFileSync(new URL("../../app/modi/grammar/grammar.css", import.meta.url), "utf8");
function rule(source: string, selector: string) {
  const blocks = [...source.replace(/\/\*[\s\S]*?\*\//g, "").matchAll(/([^{}]+)\{([^{}]*)\}/g)].filter((match) => match[1]!.trim().split(",").map((s) => s.trim()).includes(selector));
  assert.ok(blocks.length > 0, `missing ${selector}`);
  return Object.fromEntries(blocks.flatMap((match) => [...match[2]!.matchAll(/([\w-]+)\s*:\s*([^;]+);/g)].map((entry) => [entry[1]!, entry[2]!.trim()])));
}
function luminance(hex: string) {
  assert.match(hex, /^#[\da-f]{6}$/i);
  const channels = [1, 3, 5].map((start) => Number.parseInt(hex.slice(start, start + 2), 16) / 255).map((v) => v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
  return channels[0]! * 0.2126 + channels[1]! * 0.7152 + channels[2]! * 0.0722;
}
it("N8 selected structure title and item count have at least 4.5:1 contrast in all eight palettes", () => {
  for (const grade of [1, 2, 3, 4]) for (const theme of ["light", "dark"]) {
    const base = `.og-root[data-grade="${grade}"]`;
    const palette = { ...rule(globalCss, base), ...(theme === "dark" ? rule(globalCss, `${base}[data-theme="dark"]`) : {}) };
    const resolve = (value: string): string => value.startsWith("var(") ? palette[value.slice(4, -1)]! : value;
    const background = resolve(rule(css, '.og-grammar button[aria-pressed="true"]').background!);
    for (const element of ["strong", "small"]) {
      const foreground = resolve(rule(css, `.og-grammar-topic[aria-pressed="true"] ${element}`).color!);
      const values = [luminance(foreground), luminance(background)].sort((a, b) => a - b);
      const contrast = (values[1]! + 0.05) / (values[0]! + 0.05);
      assert.ok(contrast >= 4.5, `year ${grade} ${theme} ${element}: ${foreground} on ${background} = ${contrast.toFixed(3)}:1`);
    }
  }
});
