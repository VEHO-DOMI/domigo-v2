import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { describe, it } from "node:test";
import { Children, isValidElement, type ReactElement, type ReactNode } from "react";
import { transpileModule, ModuleKind, JsxEmit } from "typescript";

// Execute the actual client component; only hooks, router and HTTP are test boundaries.
const require = createRequire(import.meta.url);
const source = transpileModule(readFileSync(new URL("../app/admin/StoryWorldControls.tsx", import.meta.url), "utf8"), {
  compilerOptions: { module: ModuleKind.CommonJS, jsx: JsxEmit.ReactJSX },
}).outputText;
type Props = { children?: ReactNode; role?: string; onClick?: () => void; disabled?: boolean };
function find(node: ReactNode, predicate: (element: ReactElement<Props>) => boolean): ReactElement<Props> | undefined {
  for (const child of Children.toArray(node)) {
    if (!isValidElement<Props>(child)) continue;
    if (predicate(child)) return child;
    const nested = find(child.props.children, predicate);
    if (nested) return nested;
  }
}

function mount() {
  const states: unknown[] = [];
  let cursor = 0;
  let refreshes = 0;
  let finish: () => void = () => {};
  const settled = new Promise<void>((resolve) => { finish = resolve; });
  const componentModule = { exports: {} as { default: (props: object) => ReactElement } };
  const dependencies = (id: string) => {
    if (id === "next/navigation") return { useRouter: () => ({ refresh: () => { refreshes++; } }) };
    if (id === "react") return {
      useState(initial: unknown) {
        const index = cursor++;
        if (!(index in states)) states[index] = initial;
        return [states[index], (value: unknown) => {
          states[index] = value;
          if (index === 0 && value === null) finish();
        }];
      },
      useTransition: () => [false, (action: () => void) => action()],
    };
    return require(id);
  };
  new Function("require", "module", "exports", source)(dependencies, componentModule, componentModule.exports);
  const render = () => {
    cursor = 0;
    return componentModule.exports.default({ grades: [{ grade: 1, isOpen: false }], allowedGrades: [1], available: true });
  };
  return { render, settled, refreshes: () => refreshes };
}

describe("StoryWorldControls save confirmation", () => {
  const cases = [
    { name: "confirms a successful JSON save", status: 200, body: '{"ok":true}', redirected: false, success: true },
    { name: "rejects a followed redirect even with JSON ok true", status: 200, body: '{"ok":true}', redirected: true, success: false },
    { name: "rejects an HTTP failure even with JSON ok true", status: 403, body: '{"ok":true}', redirected: false, success: false },
    { name: "rejects JSON ok false", status: 200, body: '{"ok":false}', redirected: false, success: false },
    { name: "rejects JSON without confirmation", status: 200, body: '{}', redirected: false, success: false },
    { name: "rejects a truthy non-boolean confirmation", status: 200, body: '{"ok":"true"}', redirected: false, success: false },
    { name: "rejects a null JSON body", status: 200, body: 'null', redirected: false, success: false },
    { name: "rejects a successful HTML page", status: 200, body: '<html>Sign in</html>', redirected: false, success: false },
  ];
  for (const scenario of cases) {
    it(scenario.name, { timeout: 2000 }, async (t) => {
      const response = new Response(scenario.body, { status: scenario.status });
      Object.defineProperty(response, "redirected", { value: scenario.redirected });
      const request = t.mock.method(globalThis, "fetch", async () => response);
      const ui = mount();
      const button = find(ui.render(), (element) => element.type === "button");
      assert.ok(button?.props.onClick);
      assert.equal(button.props.disabled, false);
      button.props.onClick();
      await ui.settled;
      const status = find(ui.render(), (element) => element.props.role === "status");
      assert.equal(status?.props.children, scenario.success ? "Grade 1: open." : "Could not save. Reload and try again.");
      assert.equal(ui.refreshes(), scenario.success ? 1 : 0);
      assert.equal(find(ui.render(), (element) => element.type === "button")?.props.disabled, false);
      assert.equal(request.mock.callCount(), 1);
      assert.deepEqual(request.mock.calls[0].arguments, ["/admin/story-world", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ grade: 1, isOpen: true }),
      }]);
    });
  }
});
