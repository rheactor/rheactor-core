import { describe, expect, it } from "vitest";

import { getExtension } from "#/services/FileService";

describe("services/FileService", () => {
  const getExtensionTests = [
    ["example.bin", "bin"],
    ["example.test.bin", "bin"],
    ["example.BIN", "BIN"],
    ["example", undefined],
  ] as const;

  it.each(getExtensionTests)("getExtension(%j) = %j", (input, output) => {
    expect(getExtension(input)).toStrictEqual(output);
  });
});
