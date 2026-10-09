import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
import { Children, createElement, isValidElement, type ReactElement, type ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import * as jsxRuntime from "react/jsx-runtime";
import ts from "typescript";
import * as engine from "@domigo/engine";
import * as grammar from "./grammar.ts";
import * as decks from "./decks.ts";
export type Props = Record<string, unknown> & { children?: ReactNode; className?: string };
export type Node = ReactElement<Props>;
type Component = (props: Props) => ReactNode;
type Instance = { state: unknown[]; refs: { current: unknown }[]; cursor: number; refCursor: number };
const compiled = new Map<string, string>();
export function nodes(tree: ReactNode): Node[] {
  return Children.toArray(tree).flatMap((node) => isValidElement<Props>(node) ? [node, ...nodes(node.props.children)] : []);
}
export function text(tree: ReactNode): string {
  return Children.toArray(tree).map((node) => isValidElement<Props>(node) ? text(node.props.children) : String(node)).join("");
}
export const settle = () => new Promise<void>((resolve) => setImmediate(resolve));
/** Execute real TSX and nested children. Only hooks, routing, randomness and external boundaries are replaced. */
export function mount(file: string, props: Props, modules: Record<string, unknown> = {}) {
  const instances = new Map<string, Instance>();
  let active: Instance;
  const stored = new Map<string, string>(), writes: [string, string][] = [];
  const dependencies: Record<string, unknown> = {
    "react/jsx-runtime": jsxRuntime,
    "react": {
      useState(initial: unknown) {
        const instance = active, index = instance.cursor++;
        if (!(index in instance.state)) instance.state[index] = typeof initial === "function" ? initial() : initial;
        return [instance.state[index], (value: unknown) => { instance.state[index] = typeof value === "function" ? value(instance.state[index]) : value; }];
      },
      useRef(initial: unknown) { return active.refs[active.refCursor++] ?? (active.refs[active.refCursor - 1] = { current: initial }); },
      useCallback: (callback: unknown) => callback, useEffect() {},
      useSyncExternalStore: (_subscribe: unknown, getSnapshot: () => unknown) => getSnapshot(),
    },
    "next/link": { __esModule: true, default: "a" }, "@domigo/engine": engine,
    "@/lib/modi/grammar": grammar, "@/lib/modi/decks": { ...decks, shuffle: <T,>(items: readonly T[]) => [...items] },
    "@/lib/useOutboxFlush": { useOutboxFlush() {} }, "@/lib/attempt-outbox": { subscribeOutboxReplies() {} }, ...modules,
  };
  const loaded = new Map<string, Record<string, unknown>>();
  function load(path: string): Record<string, unknown> {
    if (loaded.has(path)) return loaded.get(path)!;
    const url = new URL(`../../${path}`, import.meta.url);
    if (!compiled.has(path)) compiled.set(path, ts.transpileModule(readFileSync(url, "utf8"), {
      compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, target: ts.ScriptTarget.ES2022 },
    }).outputText);
    const exports: Record<string, unknown> = {}; loaded.set(path, exports);
    const relatives: Record<string, string> = { "./GrammarMemory": "app/modi/grammar/GrammarMemory.tsx", "./GrammarExercise": "app/modi/grammar/GrammarExercise.tsx", "@/lib/modi/preference": "lib/modi/preference.ts" };
    runInNewContext(compiled.get(path)!, { exports, crypto, Event,
      localStorage: { getItem: (key: string) => stored.get(key) ?? null, setItem: (key: string, value: string) => { writes.push([key, value]); stored.set(key, value); } },
      window: { dispatchEvent() {}, addEventListener() {}, removeEventListener() {} },
      require(name: string) {
        if (Object.hasOwn(dependencies, name)) return dependencies[name];
        if (relatives[name]) return load(relatives[name]);
        assert.fail(`Unexpected client dependency: ${name}`);
      },
    }, { filename: url.pathname });
    return exports;
  }
  const component = load(file).default as Component;
  function expand(node: ReactNode, path: string): ReactNode {
    if (!isValidElement<Props>(node)) return node;
    if (typeof node.type === "function") {
      const id = `${path}:${node.key ?? ""}`, instance = instances.get(id) ?? { state: [], refs: [], cursor: 0, refCursor: 0 };
      instances.set(id, instance); instance.cursor = 0; instance.refCursor = 0; active = instance;
      return expand((node.type as Component)(node.props), `${id}/component`);
    }
    return createElement(node.type, node.props, ...Children.toArray(node.props.children).map((child, i) => expand(child, `${path}/${i}`)));
  }
  const render = () => expand(createElement(component, props), "root");
  return { render, html: () => renderToStaticMarkup(render()), stored, writes };
}
export function byClass(tree: ReactNode, className: string): Node[] { return nodes(tree).filter((node) => node.props.className?.split(" ").includes(className)); }
export function click(node: Node) {
  assert.ok(node, "control exists"); assert.notEqual(node.props.disabled, true, "control is enabled");
  assert.equal(typeof node.props.onClick, "function"); (node.props.onClick as () => void)();
}
export function fill(node: Node, value: string) { (node.props.onChange as (event: { target: { value: string } }) => void)({ target: { value } }); }
export function check(tree: ReactNode) {
  const form = nodes(tree).find((node) => node.type === "form"); assert.ok(form);
  (form.props.onSubmit as (event: { preventDefault(): void }) => void)({ preventDefault() {} });
}
