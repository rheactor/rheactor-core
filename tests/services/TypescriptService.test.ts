import { describe, expect, it } from "vitest";

import { unsafeCast } from "#/index";

describe("services/TypescriptService", () => {
  it("unsafeCast", () => {
    expect(unsafeCast<number>("string")).toBe("string");
  });
});
