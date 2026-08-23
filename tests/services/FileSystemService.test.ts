import { dirname, join, sep } from "node:path";

import { describe, expect, it } from "vitest";

import { exists, existsInside } from "#/services/FileSystemService";

describe("services/FileSystemService", () => {
  it("exists(): existing path", async () => {
    expect.assertions(1);

    await expect(exists(join(process.cwd(), "package.json"))).resolves.toBe(true);
  });

  it("exists(): missing path", async () => {
    expect.assertions(1);

    await expect(exists(join(process.cwd(), "does-not-exist"))).resolves.toBe(false);
  });

  describe("existsInside()", () => {
    const parent = process.cwd();

    const existsInsideTests = [
      [join(parent, "src", "index.ts"), true],
      [join(parent, "..foo"), true],
      [join(parent, "..", "sibling"), false],
      [dirname(parent), false],
      [join(parent, "..", "..", "elsewhere"), false],
      [parent, false],
      [`${parent}${sep}`, false],
    ] as const;

    it.each(existsInsideTests)("existsInside(%j, cwd) = %j", (child, output) => {
      expect(existsInside(child, parent)).toBe(output);
    });
  });
});
