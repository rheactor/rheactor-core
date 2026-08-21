import { describe, expect, it, vi } from "vitest";

import { promiseAll, promisePick, sleep } from "#/services/PromiseService";

describe("services/PromiseService", () => {
  it("sleep resolves after the given milliseconds", async () => {
    expect.assertions(1);

    vi.useFakeTimers();

    const promise = sleep(1500);

    vi.advanceTimersByTime(1500);

    await expect(promise).resolves.toBeUndefined();

    vi.useRealTimers();
  });

  it("promisePick resolves the value at the given key", async () => {
    expect.assertions(1);

    const result: number | undefined = await promisePick(Promise.resolve({ abc: 123 }), "abc");

    expect(result).toBe(123);
  });

  it("promisePick accepts an explicit value type", async () => {
    expect.assertions(1);

    const promise: Promise<unknown> = Promise.resolve({ abc: 123 });
    const result: number | undefined = await promisePick<number>(promise, "abc");

    expect(result).toBe(123);
  });

  it("promisePick supports array indexes", async () => {
    expect.assertions(1);

    const result: number | undefined = await promisePick(Promise.resolve([1, 2]), 0);

    expect(result).toBe(1);
  });

  it("promisePick resolves undefined when the key is missing", async () => {
    expect.assertions(1);

    const result = await promisePick(Promise.resolve({ abc: 123 }), "def");

    expect(result).toBeUndefined();
  });

  it.each([null, 42, "text"] as const)("promisePick resolves undefined for %s", async (value) => {
    expect.assertions(1);

    await expect(promisePick(Promise.resolve(value), "abc")).resolves.toBeUndefined();
  });

  it("promisePick propagates rejections", async () => {
    expect.assertions(1);

    await expect(promisePick(Promise.reject(new Error("boom")), "abc")).rejects.toThrow("boom");
  });

  it("promiseAll", async () => {
    expect.assertions(1);

    const promise = promiseAll({
      testA: Promise.resolve(1),
      testB: Promise.resolve(2),
      testC: Promise.resolve(3),
    });

    await expect(promise).resolves.toStrictEqual({
      testA: 1,
      testB: 2,
      testC: 3,
    });
  });
});
