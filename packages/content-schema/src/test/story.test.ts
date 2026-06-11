import assert from "node:assert/strict";
import { test } from "node:test";
import { Cast, Story, StoryItems, StoryNames } from "../index.ts";
import { chapter, grammarItem, prov, scene, story, vocabItem } from "./fixtures.ts";

function red(result: { success: boolean }, msg: string): void {
  assert.equal(result.success, false, msg);
}

function branchingChapter() {
  return chapter({
    scenes: [
      scene({
        id: "g2.st.watson.ch01.s001",
        next: "g2.st.watson.ch01.s002",
        taskSlots: [
          { slot: "evidence-1", itemId: "g2u01.w.door", variantKey: null },
          {
            slot: "evidence-2",
            itemId: "g2u01.gi.past-simple-revision.gf.001",
            variantKey: "watson.ch01",
          },
        ],
      }),
      scene({
        id: "g2.st.watson.ch01.s002",
        next: [
          {
            id: "go-in",
            textEn: "Go inside.",
            scaffoldDe: "Geh hinein.",
            next: "g2.st.watson.ch01.s003",
          },
          {
            id: "wait",
            textEn: "Wait for Elias.",
            scaffoldDe: null,
            next: "g2.st.watson.ch01.s004",
          },
        ],
      }),
      scene({ id: "g2.st.watson.ch01.s003", next: null }),
      scene({ id: "g2.st.watson.ch01.s004", next: null }),
    ],
  });
}

test("story with linear scene, branch, terminal + task slots round-trips", () => {
  const st = story({
    chapters: [
      branchingChapter(),
      chapter({
        id: "g2.st.watson.ch02",
        unit: 2,
        titleEn: "The cellar",
        scenes: [scene({ id: "g2.st.watson.ch02.s001" })],
      }),
    ],
  });
  const parsed = Story.parse(st);
  const reparsed = Story.parse(JSON.parse(JSON.stringify(parsed)));
  assert.deepEqual(reparsed, parsed);
});

test("schema-level guardrails it does NOT enforce (VS validators, Track C)", () => {
  // Sie-form scaffold, unknown speaker, unreachable scene all PASS the schema:
  // VS-3 (du-form), VS-6 (speakers resolve), VS-5 (reachability) own them.
  const lax = story({
    chapters: [
      chapter({
        scenes: [
          scene({ scaffoldDe: "Schauen Sie! Die Tür ist offen." }),
          scene({ id: "g2.st.watson.ch01.s099", speaker: "nobody-known" }),
        ],
      }),
    ],
  });
  assert.ok(Story.safeParse(lax).success);
});

test("story red cases", () => {
  red(
    Story.safeParse(
      story({
        chapters: [
          chapter({
            scenes: [scene({ next: "g2.st.watson.ch02.s001" })],
          }),
        ],
      }),
    ),
    "next points outside the chapter",
  );
  red(
    Story.safeParse(
      story({ chapters: [chapter({ scenes: [scene(), scene()] })] }),
    ),
    "duplicate scene ids",
  );
  red(
    Story.safeParse(
      story({
        chapters: [
          chapter({
            scenes: [
              scene({
                next: [
                  {
                    id: "only",
                    textEn: "Go.",
                    scaffoldDe: null,
                    next: "g2.st.watson.ch01.s001",
                  },
                ],
              }),
            ],
          }),
        ],
      }),
    ),
    "single-choice branch",
  );
  red(
    Story.safeParse(
      story({
        chapters: [
          chapter({
            scenes: [
              scene({
                taskSlots: [
                  { slot: "bad", itemId: "g2u01.task.001", variantKey: null },
                ],
              }),
            ],
          }),
        ],
      }),
    ),
    "malformed ItemRef",
  );
  red(
    Story.safeParse(
      story({
        chapters: [
          chapter({ unit: 3 }),
          chapter({
            id: "g2.st.watson.ch02",
            unit: 2,
            scenes: [scene({ id: "g2.st.watson.ch02.s001" })],
          }),
        ],
      }),
    ),
    "decreasing chapter gate units",
  );
});

test("cast / names / story-items", () => {
  const cast = {
    schema: "cast@1",
    storyId: "g2.st.watson",
    members: [
      { id: "nora", nameEn: "Nora", descriptionDe: null, voice: null, art: null },
      { id: "elias", nameEn: "Elias", descriptionDe: "Noras Bruder", voice: null, art: null },
    ],
  };
  assert.ok(Cast.safeParse(cast).success);
  red(
    Cast.safeParse({
      ...cast,
      members: [...cast.members, { ...cast.members[0]! }],
    }),
    "duplicate cast ids",
  );

  assert.ok(
    StoryNames.safeParse({
      schema: "names@1",
      storyId: "g2.st.watson",
      reviewedBy: "fable",
      names: [{ name: "Watson Manor", note: "the setting" }],
    }).success,
  );

  const si = {
    schema: "story-items@1",
    storyId: "g2.st.watson",
    vocabItems: [
      vocabItem({
        provenance: prov({
          narrative: { storyId: "g2.st.watson", chapterId: "g2.st.watson.ch01" },
        }),
      }),
    ],
    grammarItems: [grammarItem("gap-fill")],
  };
  assert.ok(StoryItems.safeParse(si).success);
});
