// Only imported by the component test. No app route imports this module.
import { registerHooks, createRequire } from "node:module";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const require = createRequire(new URL("../../../package.json", import.meta.url));
const ts = require("typescript");
const hooks = registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier === "next/link") return nextResolve("next/link.js", context);
    if (specifier.startsWith(".") && context.parentURL?.includes("/app/admin/")) {
      for (const extension of [".tsx", ".ts"]) {
        try { return nextResolve(`${specifier}${extension}`, context); } catch { /* Try the declared import unchanged below. */ }
      }
    }
    return nextResolve(specifier, context);
  },
  load(url, context, nextLoad) {
    if (!url.endsWith(".tsx")) return nextLoad(url, context);
    const result = ts.transpileModule(readFileSync(fileURLToPath(url), "utf8"), {
      compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX },
      fileName: fileURLToPath(url),
    });
    return { format: "module", shortCircuit: true, source: result.outputText };
  },
});
export const stopRenderHooks = () => hooks.deregister();
