import { describe, expect, it } from "vitest";

import { pick } from "#/services/ObjectService";

describe("services/ObjectService", () => {
  type PickTest = [input: Record<string, unknown>, keys: string[], output: Record<string, unknown>];

  const pickTests: PickTest[] = [
    [{ id: 1, name: "Ada", secret: "s" }, ["id", "name"], { id: 1, name: "Ada" }],
    [{ id: 1, name: "Ada" }, [], {}],
    [{ id: 1, name: "Ada" }, ["missing"], { missing: undefined }],
  ];

  it.each(pickTests)("pick(%j, %j) = %j", (input, keys, output) => {
    expect(pick(input, keys)).toStrictEqual(output);
  });

  it("does not mutate the source object", () => {
    const source = { id: 1, name: "Ada" };
    const result = pick(source, ["id"]);

    result.id = 99;

    expect(source.id).toBe(1);
  });
});
