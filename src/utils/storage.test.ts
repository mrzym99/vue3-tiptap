import { beforeEach, describe, expect, it, vi } from "vitest";
import { readStorage, writeStorage } from "./storage";

describe("readStorage / writeStorage", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("round-trips a value", () => {
    writeStorage("k", { a: 1 });
    expect(readStorage("k", { a: 0 })).toEqual({ a: 1 });
  });

  it("returns the fallback when the key is missing", () => {
    expect(readStorage("missing", "fallback")).toBe("fallback");
  });

  it("returns the fallback on malformed JSON", () => {
    localStorage.setItem("bad", "{not json");
    expect(readStorage("bad", "fallback")).toBe("fallback");
  });

  it("never throws on write failures", () => {
    vi.spyOn(localStorage, "setItem").mockImplementation(() => {
      throw new Error("quota");
    });
    expect(() => writeStorage("k", 1)).not.toThrow();
    vi.restoreAllMocks();
  });
});
