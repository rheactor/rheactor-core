import { describe, expect, it } from "vitest";

import {
  escapeIdentifier,
  escapeIdentifierSmart,
  escapeLiteral,
  rescapeIdentifier,
  unescapeIdentifier,
} from "#/services/PostgresService";

describe("PostgresService", () => {
  interface EscapeIdentifierTest {
    input: string;
    output: string;
    outputSmart: string;
    bypassKeywords?: boolean;
  }

  const escapeIdentifierTests: EscapeIdentifierTest[] = [
    { input: "", output: '""', outputSmart: '""' },
    { input: '"', output: '""""', outputSmart: '""""' },
    { input: "'", output: '"\'"', outputSmart: '"\'"' },
    { input: "a", output: '"a"', outputSmart: "a" },
    { input: "users", output: '"users"', outputSmart: "users" },
    { input: "users", output: '"users"', outputSmart: "users", bypassKeywords: true },
    { input: "all", output: '"all"', outputSmart: '"all"' },
    { input: "all", output: '"all"', outputSmart: "all", bypassKeywords: true },
    { input: "CamelCase", output: '"CamelCase"', outputSmart: '"CamelCase"' },
    { input: "CamelCase", output: '"CamelCase"', outputSmart: '"CamelCase"', bypassKeywords: true },
  ];

  it.each(escapeIdentifierTests)("escapeIdentifier($input)", ({ input, output }) => {
    expect(escapeIdentifier(input)).toBe(output);
  });

  it.each(escapeIdentifierTests)(
    "escapeIdentifierSmart($input, $escapeKeywords)",
    ({ input, outputSmart, bypassKeywords }) => {
      expect(escapeIdentifierSmart(input, bypassKeywords)).toBe(outputSmart);
    },
  );

  interface UnescapeIdentifierTest {
    input: string;
    output: string;
  }

  const unescapeIdentifierTests: UnescapeIdentifierTest[] = [
    { input: "", output: "" },
    { input: '"', output: "" },
    { input: '""', output: "" },
    { input: "a", output: "a" },
    { input: 'a"b', output: 'a"b' },
    { input: 'ab"', output: 'ab"' },
    { input: "a'b", output: "a'b" },
    { input: "a b", output: "a b" },
    { input: "'abc'", output: "'abc'" },
    { input: '"a"', output: "a" },
    { input: '"ab"cd"', output: 'ab"cd' },
    { input: '"ab""cd"', output: 'ab"cd' },
    { input: '"users"', output: "users" },
    { input: "users", output: "users" },
    { input: '"all"', output: "all" },
    { input: "all", output: "all" },
    { input: '"CamelCase"', output: "CamelCase" },
    { input: "CamelCase", output: "CamelCase" },
  ];

  it.each(unescapeIdentifierTests)("unescapeIdentifier($input)", ({ input, output }) => {
    expect(unescapeIdentifier(input)).toBe(output);
  });

  it.each(['"abc', '"a"b', '""x'])(
    "unescapeIdentifier() throws on unbalanced quotes: $input",
    (input) => {
      expect(() => unescapeIdentifier(input)).toThrow(
        "identifier starting with a double quote must end with a double quote",
      );
    },
  );

  interface RescapeIdentifierTest {
    input: string;
    output: string;
    bypassKeywords?: boolean;
  }

  const rescapeIdentifierTests: RescapeIdentifierTest[] = [
    { input: "", output: '""' },
    { input: '"', output: '""' },
    { input: "'", output: '"\'"' },
    { input: "a", output: "a" },
    { input: 'a"b', output: '"a""b"' },
    { input: '"a""b"', output: '"a""b"' },
    { input: "users", output: "users" },
    { input: '"users"', output: "users" },
    { input: "all", output: '"all"' },
    { input: "all", output: "all", bypassKeywords: true },
    { input: '"all"', output: '"all"' },
    { input: '"all"', output: "all", bypassKeywords: true },
    { input: "CamelCase", output: '"CamelCase"' },
    { input: "'abc'", output: `"'abc'"` },
  ];

  it.each(rescapeIdentifierTests)(
    "rescapeIdentifier($input, $escapeKeywords)",
    ({ input, output, bypassKeywords }) => {
      expect(rescapeIdentifier(input, bypassKeywords)).toBe(output);
    },
  );

  it.each(rescapeIdentifierTests.map(({ input }) => input))(
    "rescapeIdentifier is idempotent for $input",
    (input) => {
      const rescaped = rescapeIdentifier(input);

      expect(rescapeIdentifier(rescaped)).toBe(rescaped);
    },
  );

  type EscapeLiteralTest = [input: string | undefined, output: string];

  const escapeLiteralTests: EscapeLiteralTest[] = [
    [undefined, "''"],
    ["", "''"],
    ["a", "'a'"],
    ["'", "''''"],
    ["a'b", "'a''b'"],
    ["a''b", "'a''''b'"],
    ["\\", ` E'\\\\'`],
    [`a\\b`, ` E'a\\\\b'`],
    [`a\\'b`, ` E'a\\\\''b'`],
    ["\n", "'\n'"],
    ["\t", "'\t'"],
  ];

  it.each(escapeLiteralTests)("escapeLiteral(%j)", (input, output) => {
    expect(escapeLiteral(input)).toBe(output);
  });

  it("escapeLiteral() throws on null byte", () => {
    expect(() => escapeLiteral("a\0b")).toThrow("literal cannot contain null bytes");
  });
});
