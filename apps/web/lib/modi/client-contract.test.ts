import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { it } from "node:test";
import { runInNewContext } from "node:vm";
import { Children, isValidElement, type ReactElement, type ReactNode } from "react";
import * as jsxRuntime from "react/jsx-runtime";
import ts from "typescript";
import * as engine from "@domigo/engine";
import { loadUnit } from "@domigo/content-loader";
import * as decks from "./decks.ts";
import * as catalog from "./catalog.ts";
import type { SubmitWord } from "./types.ts";
import type { AttemptBody } from "../attempt-outbox.ts";

type Props = Record<string, unknown> & { children?: ReactNode; onClick?: () => void; className?: string };
type Component = (props: Props) => ReactElement<Props>;
function elements(node: ReactNode): ReactElement<Props>[] {
  return Children.toArray(node).flatMap((child) => isValidElement<Props>(child) ? [child, ...elements(child.props.children)] : []);
}
// Execute the actual TSX. Only React hooks, routing and HTTP are boundaries.
function mount(file: string, props: Props, modules: Record<string, unknown> = {}, inner = false) {
  const states: unknown[] = [], refs: { current: unknown }[] = [];
  let stateCursor = 0, refCursor = 0;
  const dependencies: Record<string, unknown> = {
    "react/jsx-runtime": jsxRuntime,
    "react": {
      useState(initial: unknown) {
        const index = stateCursor++;
        if (!(index in states)) states[index] = typeof initial === "function" ? initial() : initial;
        return [states[index], (value: unknown) => { states[index] = typeof value === "function" ? value(states[index]) : value; }];
      },
      useRef(initial: unknown) { return refs[refCursor++] ?? (refs[refCursor - 1] = { current: initial }); },
      useEffect() {}, useCallback: (callback: unknown) => callback,
    },
    "next/link": { __esModule: true, default: "a" },
    "@domigo/engine": engine,
    "@/lib/modi/decks": decks,
    "@/lib/modi/catalog": catalog,
    "@/lib/useOutboxFlush": { useOutboxFlush() {} },
    "@/lib/attempt-outbox": { subscribeOutboxReplies() {} },
    ...Object.fromEntries(["flashcards/Flashcards", "memory/Memory", "spelling/Spelling", "wordhunt/WordHunt", "speed/Speed"].map((name) => [`./${name}`, { __esModule: true, default: name }])),
    ...modules,
  };
  const url = new URL(`../../app/modi/${file}`, import.meta.url);
  const compiled = ts.transpileModule(readFileSync(url, "utf8"), { compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX } }).outputText;
  const exports: { default?: Component } = {};
  runInNewContext(compiled, {
    exports, crypto, performance,
    fetch: async () => ({ ok: true, json: async () => ({ speedSession: { sessionStartedAt: 100_000, nonce: "synthetic", signature: "synthetic" }, serverNow: 100_000 }) }),
    require: (name: string) => {
      assert.ok(Object.hasOwn(dependencies, name), `Unexpected client dependency: ${name}`);
      return dependencies[name];
    },
  }, { filename: url.pathname });
  assert.ok(exports.default);
  return () => {
    stateCursor = 0; refCursor = 0;
    const tree = exports.default!(props);
    return inner ? (tree.type as Component)(tree.props) : tree;
  };
}
const settle = () => new Promise<void>((resolve) => setImmediate(resolve));

it("C22 actual Hunt handler submits only selected targets, never decoys or omissions", async () => {
  const words = [1, 2].flatMap((chapter) => loadUnit(`g2-u0${chapter}`).vocab);
  const round = decks.huntRounds(words, () => 0.5)[0]!;
  const target = round.tiles.findIndex((tile) => tile.item !== null);
  const decoy = round.tiles.findIndex((tile) => tile.item === null);
  for (const selected of [[decoy], [target], [target, decoy]]) {
    const sent: { id: string; value: string }[] = [];
    const submit: SubmitWord = async (item, input) => {
      sent.push({ id: item.id, value: input.value });
      return { ok: true, queued: false, tier: engine.gradeVocab(item, input.value).tier };
    };
    const render = mount("wordhunt/WordHunt.tsx", { words, rounds: [round], grade: 2, submit, finish() {} }, {}, true);
    for (const index of selected) {
      const tiles = elements(render()).filter((node) => node.props.className?.includes("og-hunt-tile"));
      tiles[index]!.props.onClick!();
    }
    elements(render()).find((node) => node.props.className === "og-primary")!.props.onClick!();
    await settle();
    assert.deepEqual(sent, selected.includes(target) ? [{ id: round.tiles[target]!.item!.id, value: round.tiles[target]!.word }] : []);
    if (selected.includes(decoy)) {
      const tile = elements(render()).filter((node) => node.props.className?.includes("og-hunt-tile"))[decoy]!;
      assert.match(tile.props.className!, /is-wrong/, "decoy still gets visible feedback");
    }
  }
});

it("C24 actual ModeSession assigns a fresh clientAttemptId to every answer in every mode", async () => {
  const words = loadUnit("g2-u01").vocab.slice(0, 2);
  const allIds = new Set<string>();
  for (const mode of catalog.TRAINER_MODES) {
    const bodies: AttemptBody[] = [];
    const render = mount("ModeSession.tsx", { words, rounds: Array(8).fill({ chapter: 1, tiles: [] }), grade: 2, mode, preview: false, ownerId: "synthetic-owner" }, {
      "@/lib/preview-attempt": { attemptSender: () => async (body: AttemptBody) => { bodies.push(body); return { ok: true, tier: "correct", xpAwarded: 0 }; } },
    });
    elements(render()).find((node) => node.type === "button")!.props.onClick!();
    await settle();
    const game = elements(render()).find((node) => typeof node.props.submit === "function");
    assert.ok(game, mode);
    const submit = game.props.submit as SubmitWord;
    // Re-answering the same item is a NEW attempt, not an offline retry.
    for (const item of [words[0]!, words[0]!, words[1]!]) await submit(item, mode === "memory" || mode === "wordhunt"
      ? { kind: "choice", value: decks.fullAnswer(item) }
      : { kind: "vocab", pool: "deToEn", value: decks.fullAnswer(item, "deToEn") });
    assert.equal(bodies.length, 3, mode);
    for (const body of bodies) {
      assert.match(body.clientAttemptId, /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
      assert.equal(allIds.has(body.clientAttemptId), false, `${mode}: duplicate attempt ID`);
      allIds.add(body.clientAttemptId);
      assert.equal(body.mode, mode);
    }
  }
  assert.equal(allIds.size, 15);
});
