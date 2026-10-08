// Test/gate support only; not exported by the game or shipped to the client.
import ts from "typescript";

const parse = (source: string) => ts.createSourceFile("contract.tsx", source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
const compact = (node: ts.Node, file: ts.SourceFile) => ts.createPrinter({ removeComments: true }).printNode(ts.EmitHint.Unspecified, node, file).replace(/\s+/g, "");
const accessPath = (node: ts.Node, file: ts.SourceFile) => compact(node, file).replace(/["'\[\]]+/g, ".").replace(/\.$/, "");

export function audienceWiringFailures(source: string): string[] {
  const file = parse(source), failures: string[] = [];
  const expected: Record<string, string> = {
    audience: "audienceAt(props.chapter,sceneId,done,economy)",
    audienceIndex: "audience?economy.findIndex((e)=>e.chapterId===audience.chapterId):-1",
    previousAudience: "economy[audienceIndex-1]??null",
  };
  const found = new Set<string>();
  function visit(node: ts.Node) {
    if (ts.isVariableDeclaration(node) && ts.isIdentifier(node.name) && expected[node.name.text]) {
      found.add(node.name.text);
      if (!node.initializer || compact(node.initializer, file) !== expected[node.name.text]) failures.push(`E9: ${node.name.text} must come unchanged from the authored economy row`);
    }
    if (ts.isIdentifier(node) && node.text === "economy") {
      const parent = node.parent;
      const allowed = (ts.isPropertySignature(parent) && parent.name === node)
        || (ts.isBindingElement(parent) && parent.name === node && parent.getText(file) === "economy")
        || (ts.isCallExpression(parent) && ["audienceAt(props.chapter,sceneId,done,economy)", "fillChapterStats(props.chapter,economy)"].includes(compact(parent, file)))
        || (ts.isArrayLiteralExpression(parent) && compact(parent, file) === "[props.chapter,economy]")
        || (ts.isPropertyAccessExpression(parent) && compact(parent, file) === "economy.findIndex")
        || (ts.isElementAccessExpression(parent) && compact(parent, file) === "economy[audienceIndex-1]");
      if (!allowed) failures.push("E9: unexpected economy read/write in NovelGame");
    }
    if (ts.isIdentifier(node) && ["audience", "previousAudience"].includes(node.text)) {
      const parent = node.parent;
      const allowed = (ts.isVariableDeclaration(parent) && parent.name === node)
        || (ts.isConditionalExpression(parent) && parent.condition === node && compact(parent, file) === expected.audienceIndex)
        || (ts.isPropertyAccessExpression(parent) && compact(parent, file) === "audience.chapterId")
        || (ts.isJsxExpression(parent) && ts.isJsxAttribute(parent.parent) && ["current", "previous"].includes(parent.parent.name.getText(file)));
      if (!allowed) failures.push(`E9: unexpected ${node.text} transformation`);
    }
    if (ts.isJsxSelfClosingElement(node) && node.tagName.getText(file) === "Audience") {
      const attrs = node.attributes.properties;
      for (const [key, value] of [["current", "audience"], ["previous", "previousAudience"]]) {
        if (!attrs.some(a => ts.isJsxAttribute(a) && a.name.getText(file) === key && a.initializer && compact(a.initializer, file) === `{${value}}`)) failures.push(`E9: Audience.${key} must receive ${value} unchanged`);
      }
      if (attrs.some(a => ts.isJsxSpreadAttribute(a) || (ts.isJsxAttribute(a) && !["current", "previous", "quiet"].includes(a.name.getText(file))))) failures.push("E9: Audience cannot receive answer results or additional inputs");
    }
    ts.forEachChild(node, visit);
  }
  visit(file);
  for (const key of Object.keys(expected)) if (!found.has(key)) failures.push(`E9: missing ${key} source`);
  return failures;
}

export function automaticNavigationFailures(source: string): string[] {
  const file = parse(source), failures: string[] = [];
  function visit(node: ts.Node) {
    if (ts.isCallExpression(node)) {
      const call = accessPath(node.expression, file);
      // The novel has no timed story transitions at all. All timers/microtasks
      // need deliberate review, even if their callback navigates through an alias.
      if (/(?:^|\.)(?:setTimeout|setInterval|requestAnimationFrame|queueMicrotask)$/.test(call)) failures.push("scheduled story action");
      if (/\blocation\.+(?:assign|replace|push)\.?$/.test(call)) failures.push("imperative location navigation");
      if (/\bPromise\.resolve\(.*\)\.then$/.test(call)) failures.push("promise-scheduled story action");
      if (/(?:^|\.)useEffect$/.test(call)) {
        const callback = node.arguments[0];
        if (callback && /\b(?:go|setSceneId|setStage)\(/.test(compact(callback, file))) failures.push("effect advances the story");
      }
    }
    if (ts.isBinaryExpression(node) && node.operatorToken.kind === ts.SyntaxKind.EqualsToken && /\blocation(?:\.href)?$/.test(accessPath(node.left, file))) failures.push("location assignment");
    if ((ts.isJsxAttribute(node) && /^autoplay$/i.test(node.name.getText(file))) || (ts.isJsxAttribute(node) && /^(httpEquiv|http-equiv)$/.test(node.name.getText(file)) && /refresh/i.test(node.initializer?.getText(file) ?? ""))) failures.push("automatic HTML navigation/playback");
    ts.forEachChild(node, visit);
  }
  visit(file);
  return failures;
}
