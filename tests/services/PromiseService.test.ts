import { describe, expect, it, vi } from "vitest";

import { promiseAll, sleep } from "#/services/PromiseService";

describe("services/PromiseService", () => {
  it("sleep resolves after the given milliseconds", async () => {
    expect.assertions(1);

    vi.useFakeTimers();

    const promise = sleep(1500);

    vi.advanceTimersByTime(1500);

    await expect(promise).resolves.toBeUndefined();

    vi.useRealTimers();
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
