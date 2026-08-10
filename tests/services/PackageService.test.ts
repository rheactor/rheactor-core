import { describe, expect, it } from "vitest";

import { findPackagePath } from "#/services/PackageService";

describe("services/PackageService", () => {
  it("findPackagePath(): exists", async () => {
    expect.assertions(1);

    await expect(findPackagePath()).resolves.toBe(process.cwd());
  });

  it("findPackagePath(): not exists", async () => {
    expect.assertions(1);

    await expect(findPackagePath("/")).resolves.toBeUndefined();
  });
});
