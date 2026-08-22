import { join } from "node:path";

import { describe, expect, it } from "vitest";

import { exists } from "#/services/FileSystemService";

describe("services/FileSystemService", () => {
  it("exists(): existing path", async () => {
    expect.assertions(1);

    await expect(exists(join(process.cwd(), "package.json"))).resolves.toBe(true);
  });

  it("exists(): missing path", async () => {
    expect.assertions(1);

    await expect(exists(join(process.cwd(), "does-not-exist"))).resolves.toBe(false);
  });
});
