import { describe, expect, it, vi } from "vitest";

import { attempt, noop, singleton } from "#/services/FunctionService";

async function tick(): Promise<void> {
  await Promise.resolve();
}

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

  it("attempt() returns the sync value and runs onFinally", () => {
    const onFinally = vi.fn<() => void>();

    expect(attempt(() => "ok", undefined, onFinally)).toBe("ok");
    expect(onFinally).toHaveBeenCalledOnce();
  });

  it("attempt() catches sync errors with onError", () => {
    expect(
      attempt(
        () => {
          throw new Error("boom");
        },
        (error) => `caught: ${error.message}`,
      ),
    ).toBe("caught: boom");
  });

  it("attempt() rethrows sync errors without onError and still runs onFinally", () => {
    const onFinally = vi.fn<() => void>();

    expect(() =>
      attempt(
        (): string => {
          throw new Error("boom");
        },
        undefined,
        onFinally,
      ),
    ).toThrow("boom");
    expect(onFinally).toHaveBeenCalledOnce();
  });

  it("attempt() narrows the caught error through the generic Err", () => {
    expect(
      attempt(
        (): string => {
          throw new TypeError("not a string");
        },
        (error: TypeError) => `${error.name}: ${error.message}`,
      ),
    ).toBe("TypeError: not a string");
  });

  it("attempt() awaits async actions and runs onFinally only after settling", async () => {
    expect.assertions(2);

    const order: string[] = [];

    const promise = attempt(
      async () => {
        order.push("action");

        await tick();

        return "ok";
      },
      undefined,
      () => {
        order.push("finally");
      },
    );

    order.push("callers");

    await expect(promise).resolves.toBe("ok");
    expect(order).toStrictEqual(["action", "callers", "finally"]);
  });

  it("attempt() catches async rejections with a sync onError", async () => {
    expect.assertions(1);

    await expect(
      attempt(
        async () => {
          await tick();

          throw new Error("boom");
        },
        (error) => `caught: ${error.message}`,
      ),
    ).resolves.toBe("caught: boom");
  });

  it("attempt() supports async onError handlers", async () => {
    expect.assertions(1);

    await expect(
      attempt(
        async () => {
          await tick();

          throw new Error("boom");
        },
        async (error) => {
          await tick();

          return `handled: ${error.message}`;
        },
      ),
    ).resolves.toBe("handled: boom");
  });

  it("attempt() rejects async errors without onError and still runs onFinally", async () => {
    expect.assertions(2);

    const onFinally = vi.fn<() => void>();

    await expect(
      attempt(
        async () => {
          await tick();

          throw new Error("boom");
        },
        undefined,
        onFinally,
      ),
    ).rejects.toThrow("boom");
    expect(onFinally).toHaveBeenCalledOnce();
  });
});
