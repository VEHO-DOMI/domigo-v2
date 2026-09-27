import "server-only";
import fs from "node:fs";
import path from "node:path";
import { REPO_ROOT, loadReleasedChapters } from "@domigo/content-loader";
import { SchoolBattery, SCHOOL_STORY, SCHOOL_CHAPTER } from "./school-contract";
export function loadSchoolBattery() {
  return SchoolBattery.parse(JSON.parse(fs.readFileSync(path.join(REPO_ROOT, "content/corpus/stories", SCHOOL_STORY, "ch01.tasks.v2.json"), "utf8")));
}
export function schoolReleased() { return loadReleasedChapters(SCHOOL_STORY).includes(SCHOOL_CHAPTER); }
