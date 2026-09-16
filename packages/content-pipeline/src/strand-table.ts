/**
 * `content story strands --story <id> [--write]` — renders the strand manifest
 * (flags.json `forks`, VS-19) as the table people read: fork → where each
 * choice shows up later. The scene lists are COMPUTED from story.json, never
 * typed, and a test compares the committed doc with this render, so the table
 * cannot drift from the play.
 */
import fs from "node:fs";
import path from "node:path";
import { Story, StoryFlags } from "@domigo/content-schema";
import { readJsonIfExists } from "./json.ts";
import { REPO_ROOT } from "./paths.ts";
import { STORIES_DIR } from "./story-common.ts";
import { flagVisibility } from "./validate-story.ts";

export const STRANDS_DOC_DIR = path.join(REPO_ROOT, "docs", "handover", "strands");

export function strandsDocPath(storyId: string): string {
  return path.join(STRANDS_DOC_DIR, `${storyId}.md`);
}

const short = (sceneId: string): string => sceneId.split(".").slice(-2).join(".");

export function renderStrandTable(story: Story, flags: StoryFlags): string {
  const forks = flags.forks ?? [];
  const vis = flagVisibility(story);
  const lines: string[] = [];
  lines.push(`# Strang-Manifest · ${story.id}`);
  lines.push("");
  lines.push("_Erzeugt von `pnpm content story strands --story " + story.id + " --write` aus `flags.json` (forks) und `story.json`. Nicht von Hand ändern: VS-19 prüft `visibleIn` gegen das Spiel, ein Test prüft diese Datei gegen die Erzeugung._");
  lines.push("");
  lines.push("## Gabeln");
  lines.push("");
  lines.push("| Gabel | Unit | Frage | Gewicht | Stand | sichtbar in Units | Recap je Strang |");
  lines.push("|---|---|---|---|---|---|---|");
  for (const f of forks) {
    const recap = f.recap.map((r) => `U${r.unit}: ${r.itemId ?? "geplant"}`).join(" · ") || "—";
    lines.push(`| ${f.id} | U${f.unit} | ${f.question} | ${f.major ? "Haupt" : "Neben"} | ${f.status === "built" ? "gebaut" : "geplant"} | ${f.visibleIn.map((u) => `U${u}`).join(", ")} | ${recap} |`);
  }
  lines.push("");
  lines.push("## Wahl → wo sichtbar (aus story.json gezählt)");
  lines.push("");
  lines.push("| Gabel | Wahl (Flag) | Bedeutung | Units | Szenen, die sie lesen |");
  lines.push("|---|---|---|---|---|");
  for (const f of forks) {
    for (const o of f.options) {
      // A FlagGate on a sibling option routes THIS option down its else branch:
      // that is a consequence the player sees too, so it counts here.
      const reads = new Map<number, string[]>();
      for (const flag of f.options.map((x) => x.flag)) {
        for (const [unit, rs] of vis.get(flag) ?? []) {
          for (const r of rs) {
            if (flag !== o.flag && r.via !== "gate") continue;
            const label = `${short(r.scene)}${r.via === "gate" ? (flag === o.flag ? " (Weiche: then)" : " (Weiche: else)") : ""}`;
            const list = reads.get(unit) ?? [];
            if (!list.includes(label)) list.push(label);
            reads.set(unit, list);
          }
        }
      }
      const units = [...reads.keys()].sort((a, b) => a - b);
      const scenes = units.map((u) => reads.get(u)!.join(", ")).join(" · ");
      const unitCell = units.length ? units.map((u) => `U${u}`).join(", ") : f.status === "planned" ? `(geplant: ${f.visibleIn.map((u) => `U${u}`).join(", ")})` : "—";
      lines.push(`| ${f.id} | \`${o.flag}\` | ${o.label} | ${unitCell} | ${scenes || "—"} |`);
    }
  }
  lines.push("");
  lines.push("## Notizen");
  lines.push("");
  for (const f of forks) if (f.note) lines.push(`- **${f.id}:** ${f.note}`);
  lines.push("");
  return lines.join("\n");
}

export function loadStrandInputs(storyId: string): { story: Story; flags: StoryFlags } | null {
  const dir = path.join(STORIES_DIR, storyId);
  const s = readJsonIfExists<unknown>(path.join(dir, "story.json"));
  const f = readJsonIfExists<unknown>(path.join(dir, "flags.json"));
  if (s === null || f === null) return null;
  const flags = StoryFlags.parse(f);
  if (!flags.forks?.length) return null;
  return { story: Story.parse(s), flags };
}

export function runStoryStrands(storyId: string, write: boolean): void {
  const inputs = loadStrandInputs(storyId);
  if (inputs === null) {
    console.error(`content story strands: ${storyId} has no flags.json forks — nothing to render`);
    process.exitCode = 1;
    return;
  }
  const md = renderStrandTable(inputs.story, inputs.flags);
  if (!write) { process.stdout.write(md); return; }
  fs.mkdirSync(STRANDS_DOC_DIR, { recursive: true });
  fs.writeFileSync(strandsDocPath(storyId), md);
  console.log(`content story strands: wrote ${path.relative(process.cwd(), strandsDocPath(storyId))}`);
}
