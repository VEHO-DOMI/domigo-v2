// L0d · R263 · der Beweis, dass der stille Rueckfall laut geworden ist.
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { heroFallbackNote, resetHeroFallbackNotes } from "./heroFallbackNote.ts";

const urNodeEnv = process.env.NODE_ENV;

describe("heroFallbackNote — der Rueckfall auf den Teile-Baukasten meldet sich", () => {
  beforeEach(() => {
    resetHeroFallbackNotes();
    process.env.NODE_ENV = "development";
  });
  afterEach(() => {
    process.env.NODE_ENV = urNodeEnv;
    resetHeroFallbackNotes();
  });

  it("nennt Stem UND Kapitel — ohne beides waere die Meldung nicht handlungsfaehig", () => {
    const notiz = heroFallbackNote("hero2_run0", "ch02");
    expect(notiz).not.toBeNull();
    expect(notiz).toContain("hero2_run0");
    expect(notiz).toContain("ch02");
  });

  it("meldet sich EINMAL je Kapitel und Stem, nicht 60-mal in der Sekunde", () => {
    expect(heroFallbackNote("hero2_idle", "ch02")).not.toBeNull();
    expect(heroFallbackNote("hero2_idle", "ch02")).toBeNull();
    expect(heroFallbackNote("hero2_idle", "ch02")).toBeNull();
  });

  it("ein anderes Kapitel und ein anderer Stem sind eigene Meldungen", () => {
    expect(heroFallbackNote("hero2_idle", "ch02")).not.toBeNull();
    expect(heroFallbackNote("hero2_idle", "ch03")).not.toBeNull();
    expect(heroFallbackNote("hero2_land", "ch02")).not.toBeNull();
  });

  it("in der Produktion schweigt sie — die Meldung ist fuer die Bahn, nicht fuer das Kind", () => {
    process.env.NODE_ENV = "production";
    expect(heroFallbackNote("hero2_run0", "ch02")).toBeNull();
  });

  it("das Gedaechtnis der Produktion faerbt nicht auf den Entwicklungs-Bau ab", () => {
    process.env.NODE_ENV = "production";
    expect(heroFallbackNote("hero2_cheer", "ch04")).toBeNull();
    process.env.NODE_ENV = "development";
    expect(heroFallbackNote("hero2_cheer", "ch04")).not.toBeNull();
  });
});
