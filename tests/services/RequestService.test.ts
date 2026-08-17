/* eslint-disable unicorn/no-useless-promise-resolve-reject */
import { describe, expect, it, vi } from "vitest";

import { request, requestText } from "#/services/RequestService";

function createMockFetch(response: Partial<Response>) {
  const mock = vi.fn<() => Response>(
    () => ({ ok: true, status: 200, text: () => "", ...response }) as Response,
  );

  vi.stubGlobal("fetch", mock);

  return mock;
}

describe("services/RequestService", () => {
  it("request performs GET and parses JSON", async () => {
    expect.assertions(3);

    createMockFetch({
      ok: true,
      status: 200,
      text: async () => Promise.resolve(JSON.stringify({ value: 1 })),
    });

    const result = await request({ url: "https://example.com/api" });

    expect(result.success).toBe(true);
    expect(result.status).toBe(200);
    expect(result.data).toStrictEqual({ value: 1 });
  });

  it("request returns undefined data for invalid JSON", async () => {
    expect.assertions(2);

    createMockFetch({
      ok: true,
      status: 200,
      text: async () => Promise.resolve("not-json"),
    });

    const result = await request({ url: "https://example.com/api" });

    expect(result.success).toBe(true);
    expect(result.data).toBeUndefined();
  });

  it("request uses POST method and serializes body", async () => {
    expect.assertions(4);

    const mock = createMockFetch({
      ok: true,
      status: 201,
      text: async () => Promise.resolve("{}"),
    });

    await request({
      url: "https://example.com/api",
      method: "POST",
      body: { item: 1 },
    });

    expect(mock).toHaveBeenCalledOnce();

    const [url, init] = mock.mock.calls.at(0) as unknown as [string, RequestInit];

    expect(url).toBe("https://example.com/api");
    expect(init.method).toBe("POST");
    expect(init.body).toBe(JSON.stringify({ item: 1 }));
  });

  it("request passes through RequestInit options", async () => {
    expect.assertions(3);

    const mock = createMockFetch({
      ok: true,
      status: 200,
      text: async () => Promise.resolve("{}"),
    });

    await request({
      url: "https://example.com/api",
      method: "POST",
      credentials: "include",
      cache: "no-store",
    });

    const [, init] = mock.mock.calls.at(0) as unknown as [string, RequestInit];

    expect(init.method).toBe("POST");
    expect(init.credentials).toBe("include");
    expect(init.cache).toBe("no-store");
  });

  it("request appends query string from query object", async () => {
    expect.assertions(2);

    const mock = createMockFetch({
      ok: true,
      status: 200,
      text: async () => Promise.resolve("{}"),
    });

    await request({
      url: "https://example.com/api",
      query: { page: "2", search: "test" },
    });

    const calls = mock.mock.calls as unknown as Array<[string, RequestInit]>;
    const [url] = calls.at(0)!;

    expect(url).toContain("page=2");
    expect(url).toContain("search=test");
  });

  it("request reflects non-ok response", async () => {
    expect.assertions(3);

    createMockFetch({
      ok: false,
      status: 404,
      text: async () => Promise.resolve(""),
    });

    const result = await request({ url: "https://example.com/missing" });

    expect(result.success).toBe(false);
    expect(result.status).toBe(404);
    expect(result.data).toBeUndefined();
  });

  it("requestText returns raw text response", async () => {
    expect.assertions(2);

    createMockFetch({
      ok: true,
      status: 200,
      text: async () => Promise.resolve("plain text"),
    });

    const result = await requestText({ url: "https://example.com/text" });

    expect(result.success).toBe(true);
    expect(result.data).toBe("plain text");
  });
});
