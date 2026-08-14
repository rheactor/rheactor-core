import { describe, expect, it } from "vitest";

import { noop, singleton } from "#/services/FunctionService";

describe("services/FunctionService", () => {
  it("noop() = undefined", () => {
    // eslint-disable-next-line @typescript-eslint/no-confusing-void-expression
    expect(noop()).toBeUndefined();
  });

  it("singleton()", () => {
    let calls = 0;

    const instance = singleton(() => {
      calls += 1;

      return { calls };
    });

    expect(instance()).toStrictEqual({ calls: 1 });
    expect(instance()).toStrictEqual({ calls: 1 });
    expect(instance()).toBe(instance());
  });
});
