import { describe, expect, it } from "vitest";

import { parseAs } from "#/services/JsonService";

describe("services/JsonService", () => {
  it("parseAs parses valid JSON string", () => {
    expect(parseAs('{"abc":1}')).toStrictEqual({ abc: 1 });
  });

  it("parseAs returns undefined for undefined input without default", () => {
    expect(parseAs(undefined)).toBeUndefined();
  });

  it("parseAs returns undefined for null input without default", () => {
    expect(parseAs(null)).toBeUndefined();
  });

  it("parseAs returns undefined for non-string input without default", () => {
    expect(parseAs(123 as unknown as string)).toBeUndefined();
  });

  it("parseAs returns default for undefined input", () => {
    expect(parseAs(undefined, "default")).toBe("default");
  });

  it("parseAs returns default for null input", () => {
    expect(parseAs(null, "default")).toBe("default");
  });

  it("parseAs returns default for non-string input", () => {
    expect(parseAs(123 as unknown as string, 42)).toBe(42);
  });

  it("parseAs returns default for invalid JSON", () => {
    expect(parseAs("not-json", 42)).toBe(42);
  });

  it("parseAs parses valid JSON array", () => {
    expect(parseAs("[1, 2, 3]")).toStrictEqual([1, 2, 3]);
  });

  it("parseAs parses primitive JSON values", () => {
    expect(parseAs("123")).toBe(123);
    expect(parseAs("true")).toBe(true);
  });
});
