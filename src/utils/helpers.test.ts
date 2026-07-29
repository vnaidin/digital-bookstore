import { beforeEach, describe, expect, it, vi } from "vitest";

import { chunkArray, getImageUrl, PLACEHOLDER_IMG, toBinary } from "./helpers";

describe("PLACEHOLDER_IMG", () => {
  it("is the logo path", () => {
    expect(PLACEHOLDER_IMG).toBe("/logo.png");
  });
});

describe("getImageUrl", () => {
  beforeEach(() => {
    vi.stubEnv("VITE_BE_URL", "http://localhost:3016");
  });

  it("constructs a full URL from a relative path", () => {
    expect(getImageUrl("images/book.jpg")).toBe(
      "http://localhost:3016/images/book.jpg",
    );
  });

  it("handles undefined path gracefully", () => {
    expect(getImageUrl(undefined)).toBe("http://localhost:3016/");
  });
});

describe("chunkArray", () => {
  it("splits an array into fixed-size chunks", () => {
    expect(chunkArray([1, 2, 3, 4, 5], 2)).toEqual([[1, 2], [3, 4], [5]]);
  });

  it("returns a single chunk when size >= length", () => {
    expect(chunkArray([1, 2], 5)).toEqual([[1, 2]]);
  });

  it("returns empty array for empty input", () => {
    expect(chunkArray([], 3)).toEqual([]);
  });

  it("preserves generic types", () => {
    const result = chunkArray(["a", "b", "c"], 2);
    expect(result).toEqual([["a", "b"], ["c"]]);
  });
});

describe("toBinary", () => {
  it("passes ASCII strings through unchanged", () => {
    expect(toBinary("hello")).toBe("hello");
  });

  it("converts Cyrillic characters to binary", () => {
    const result = toBinary("привіт");
    expect(typeof result).toBe("string");
    expect(result.length).toBeGreaterThan(0);
  });

  it("handles empty string", () => {
    expect(toBinary("")).toBe("");
  });
});
