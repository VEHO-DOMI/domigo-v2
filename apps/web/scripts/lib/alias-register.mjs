// dach-018 · haengt die Alias-Aufloesung ein (`node --import ./scripts/lib/alias-register.mjs`).
// Die Haken laufen in einem eigenen Thread, deshalb stehen sie in einer eigenen Datei.
import { register } from "node:module";
register("./alias-hooks.mjs", import.meta.url);
