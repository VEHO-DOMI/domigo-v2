import assert from "node:assert/strict";
import { it } from "node:test";
import { Children, createElement, isValidElement, type ReactNode } from "react";
import * as jsx from "react/jsx-runtime";
import * as loader from "@domigo/content-loader";
import * as progress from "@domigo/db";
import { loadTestModule } from "./arena/test-loader.ts";
import { isSlugAllowed } from "./grade-scope.ts";
import { nodes } from "./modi/grammar-render-harness.ts";
const slug = "g2-u03", journey = loader.loadJourney(slug)!;
assert.ok(journey);
const student = { kind: "student", grades: [2], player: { userId:"synthetic-owner", classId:"synthetic-class", classScope:["synthetic-class"] } };
async function expand(tree: ReactNode): Promise<ReactNode> {
  if (Array.isArray(tree)) return Promise.all(tree.map(expand));
  if (!isValidElement<{children?: ReactNode}>(tree)) return tree;
  if (typeof tree.type === "function") return expand(await (tree.type as (p: unknown) => ReactNode | Promise<ReactNode>)(tree.props));
  return createElement(tree.type, tree.props, ...await Promise.all(Children.toArray(tree.props.children).map(expand)));
}
function setup(preview = false, fail = true) {
  let reserves = 0, attempts = 0;
  const view = preview ? { kind:"preview", grades:[2] } : student;
  const modules = {
    "react/jsx-runtime": jsx, "next/link": { default: "a" },
    "next/navigation": { redirect: (url: string) => { throw Error(`redirect:${url}`); }, notFound: () => { throw Error("not-found"); } },
    "@domigo/content-loader": loader,
    "@domigo/db": { ...progress, getDb: () => ({}), listReservedForClass: async () => { reserves++; if (fail) throw Error("synthetic-reserve-unavailable"); return new Set(); }, getJourneyAttempts: async () => { attempts++; return []; } },
    "@/lib/content-service": { loadUnitWithOverrides: async () => loader.loadUnit(slug) },
    "@/lib/student-view": { resolveStudentView: async () => view }, "@/lib/grade-scope": { isSlugAllowed },
    "@/app/PreviewBanner": { default: () => null },
    "@/lib/trainer/LearningShell": { default: ({ children }: {children: ReactNode}) => createElement("div", {}, children), LearningText: ({ en }: {en: string}) => en },
    "./TeachingNode": { default: () => null }, "./PathPracticeNode": { default: () => null },
  };
  const map = loadTestModule("apps/web/app/learn/[slug]/page.tsx", modules).default as (p: unknown) => Promise<ReactNode>;
  const node = loadTestModule("apps/web/app/learn/[slug]/[node]/page.tsx", modules).default as (p: unknown) => Promise<ReactNode>;
  return { map: async () => expand(await map({ params:Promise.resolve({slug}), searchParams:Promise.resolve({}) })),
    node: () => node({ params:Promise.resolve({slug,node:journey.nodes.find(n => n.kind === "practice")!.id}), searchParams:Promise.resolve({}) }),
    calls: () => ({ reserves, attempts }) };
}
const entrances = (tree: ReactNode) => nodes(tree).filter(n => n.type === "a" && typeof n.props.href === "string" && (n.props.href.startsWith(`/learn/${slug}/`) || n.props.href.startsWith("/play/")));
it("unknown reserve state closes every journey node and skips progress reads", async () => {
  const f = setup(); const tree = await f.map(); assert.equal(entrances(tree).length, 0);
  assert.equal(nodes(tree).filter(n => n.props.className === "dg-tile--locked").length, journey.nodes.length);
  assert.deepEqual(f.calls(), { reserves:1, attempts:0 });
});
it("direct journey URL cannot bypass a failed reserve lookup", async () => {
  const f = setup(); await assert.rejects(f.node(), new RegExp(`redirect:/learn/${slug}`)); assert.deepEqual(f.calls(), { reserves:1, attempts:0 });
});
it("successful reserve lookup keeps reachable nodes available", async () => {
  const f = setup(false, false); assert.ok(entrances(await f.map()).length > 0); assert.deepEqual(f.calls(), { reserves:1, attempts:1 });
});
it("teacher preview remains class-free and shows the authored journey", async () => {
  const f = setup(true); assert.equal(entrances(await f.map()).length, journey.nodes.length); await f.node(); assert.deepEqual(f.calls(), { reserves:0, attempts:0 });
});
