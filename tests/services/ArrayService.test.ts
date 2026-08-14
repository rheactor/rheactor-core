import { describe, expect, it } from "vitest";

import { chunk, firstOf, pluck, range, shuffle, toArray, unique } from "#/services/ArrayService";

describe("services/ArrayService", () => {
  type RangeTest = [from: number, to: number, step: number | undefined, output: number[]];

  const rangeTests: RangeTest[] = [
    // Step = 1
    [0, 0, undefined, [0]],
    [1, 1, undefined, [1]],
    [0, 2, undefined, [0, 1, 2]],
    [-1, 1, undefined, [-1, 0, 1]],
    // Step = 2
    [0, 1, 2, [0]],
    [0, 2, 2, [0, 2]],
    [-1, 2, 2, [-1, 1]],
    // Step = 1.5
    [0, 2, 1.5, [0, 1.5]],
    [0, 3, 1.5, [0, 1.5, 3]],
  ];

  it.each(rangeTests)("range(%j, %j, %j) = %j", (from, to, step, output) => {
    expect(range(from, to, step)).toStrictEqual(output);
  });

  type ToArrayTest = [input: unknown, output: unknown[]];

  const toArrayTests: ToArrayTest[] = [
    [123, [123]],
    [[123], [123]],
    [
      [1, 2, 3],
      [1, 2, 3],
    ],
    ["abc", ["abc"]],
    [{ abc: 123 }, [{ abc: 123 }]],
  ];

  it.each(toArrayTests)("toArray(%j) = %j", (input, output) => {
    expect(toArray(input)).toStrictEqual(output);
  });

  type ChunkTest = [input: number[], size: number, output: number[][]];

  const chunkTests: ChunkTest[] = [
    [[1, 2, 3, 4, 5], 2, [[1, 2], [3, 4], [5]]],
    [
      [1, 2, 3, 4],
      2,
      [
        [1, 2],
        [3, 4],
      ],
    ],
    [[1, 2, 3, 4, 5], 1, [[1], [2], [3], [4], [5]]],
    [[1, 2, 3], 5, [[1, 2, 3]]],
    [[] as number[], 3, []],
  ];

  it.each(chunkTests)("chunk(%j, %j) = %j", (input, size, output) => {
    expect(chunk(input, size)).toStrictEqual(output);
  });

  type FirstOfTest = [input: unknown[], defaultValue: unknown, output: unknown];

  const firstOfTests: FirstOfTest[] = [
    [[1, 2, 3], undefined, 1],
    [["a", "b"], undefined, "a"],
    [[], undefined, undefined],
    [[], 0, 0],
    [[], null, null],
    [[1, 2], 0, 1],
    [[null, 2], 3, 3],
    [[undefined, 2], 3, 3],
  ];

  it.each(firstOfTests)("firstOf(%j, %j) = %j", (input, defaultValue, output) => {
    expect(firstOf(input, defaultValue)).toStrictEqual(output);
  });

  type PluckTest = [
    input: Array<{ id: number; name: string }>,
    key: "id" | "name",
    output: unknown[],
  ];

  const pluckTests: PluckTest[] = [
    [
      [
        { id: 1, name: "a" },
        { id: 2, name: "b" },
      ],
      "id",
      [1, 2],
    ],
    [
      [
        { id: 1, name: "a" },
        { id: 2, name: "b" },
      ],
      "name",
      ["a", "b"],
    ],
  ];

  it.each(pluckTests)("pluck(%j, %j) = %j", (input, key, output) => {
    expect(pluck(input, key)).toStrictEqual(output);
  });

  it("unique removes duplicates keeping first occurrence order", () => {
    expect(unique([1, 2, 2, 3, 1])).toStrictEqual([1, 2, 3]);
    expect(unique(["a", "a", "b"])).toStrictEqual(["a", "b"]);
    expect(unique([])).toStrictEqual([]);
  });

  it("shuffle returns same elements as input", () => {
    const input = [1, 2, 3, 4, 5];
    const output = shuffle(input);

    expect(output).toHaveLength(input.length);
    expect([...output].toSorted((itemA, itemB) => itemA - itemB)).toStrictEqual(
      [...input].toSorted((itemA, itemB) => itemA - itemB),
    );
  });
});
