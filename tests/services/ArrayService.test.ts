import { describe, expect, it } from "vitest";

import {
  chunk,
  compact,
  firstOf,
  groupBy,
  pluck,
  range,
  shuffle,
  toArray,
  unique,
} from "#/services/ArrayService";

function* generate(): Generator<number> {
  yield 1;
  yield 3;
  yield 5;
}

function evenOrOdd(item: number): "even" | "odd" {
  return item % 2 === 0 ? "even" : "odd";
}

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

  type CompactTest = [input: Array<number | null | undefined>, output: number[]];

  const compactTests: CompactTest[] = [
    [
      [1, null, 2, undefined, 3],
      [1, 2, 3],
    ],
    [[null, undefined], []],
    [
      [1, 2, 3],
      [1, 2, 3],
    ],
    [[] as Array<number | null | undefined>, []],
  ];

  it.each(compactTests)("compact(%j) = %j", (input, output) => {
    expect(compact(input)).toStrictEqual(output);
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

  type GroupByTest = [
    input: number[],
    keySelector: (item: number) => number | string,
    output: Record<string, number[]>,
  ];

  const groupByTests: GroupByTest[] = [
    [
      [1, 2, 3, 4, 5, 6],
      (item) => (item % 2 === 0 ? "even" : "odd"),
      { odd: [1, 3, 5], even: [2, 4, 6] },
    ],
    [[1, 2, 3, 4], (item) => item % 2, { 1: [1, 3], 0: [2, 4] }],
    [[1, 2, 3, 4, 5], (item) => String(item % 3), { 1: [1, 4], 2: [2, 5], 0: [3] }],
    [[], (item) => (item % 2 === 0 ? "even" : "odd"), {}],
  ];

  it.each(groupByTests)("groupBy(%j) = %j", (input, keySelector, output) => {
    expect(groupBy(input, keySelector)).toStrictEqual(output);
  });

  it("groupBy preserves item order within groups, including non-adjacent items", () => {
    const items = [
      { role: "admin", name: "A" },
      { role: "user", name: "B" },
      { role: "admin", name: "C" },
    ];

    expect(groupBy(items, (item) => item.role)).toStrictEqual({
      admin: [
        { role: "admin", name: "A" },
        { role: "admin", name: "C" },
      ],
      user: [{ role: "user", name: "B" }],
    });
  });

  it('groupBy handles the "__proto__" key without corrupting the result', () => {
    const result = groupBy(["a", "b"], () => "__proto__");

    expect(result["__proto__"]).toStrictEqual(["a", "b"]);
    expect(Object.hasOwn(result, "__proto__")).toBe(true);
  });

  it("groupBy accepts any Iterable, such as Set and generators", () => {
    const set = new Set([1, 2, 3, 4]);

    expect(groupBy(set, evenOrOdd)).toStrictEqual({ odd: [1, 3], even: [2, 4] });
    expect(groupBy(generate(), evenOrOdd)).toStrictEqual({ odd: [1, 3, 5] });
  });

  it("groupBy passes the item index to the key selector", () => {
    const seen: number[] = [];

    groupBy(["a", "b", "c"], (item, index) => {
      seen.push(index);
      return item;
    });

    expect(seen).toStrictEqual([0, 1, 2]);
  });

  it("groupBy does not mutate the input iterable", () => {
    const input = Object.freeze(["a", "b", "a"]);

    expect(() => groupBy(input, (item) => item)).not.toThrow();
    expect(input).toStrictEqual(["a", "b", "a"]);
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
