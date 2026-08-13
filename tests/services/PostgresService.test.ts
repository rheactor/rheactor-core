import { describe, expect, it } from "vitest";

import { escapeIdentifier, escapeIdentifierSmart, escapeLiteral } from "#/services/PostgresService";

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
