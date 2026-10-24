/** Execute the real presentation store with each harness's own React hooks. */
import { loadTestModule } from "../arena/test-loader.ts";
import * as register from "./register.ts";
export function trainerPreferences(dependencies: Record<string, unknown>) {
  return loadTestModule("apps/web/lib/trainer/preferences.tsx", { ...dependencies, "./register": register });
}
