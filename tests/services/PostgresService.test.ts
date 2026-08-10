import { describe, expect, it } from "vitest";

import { escapeIdentifier, escapeIdentifierSmart, escapeLiteral } from "#/services/PostgresService";

describe("PostgresService", () => {
  interface EscapeIdentifierTest {
    input: string;
    output: string;
    outputSmart: string;
  }

  const escapeIdentifierTests: EscapeIdentifierTest[] = [
    { input: "", output: '""', outputSmart: '""' },
    { input: '"', output: '""""', outputSmart: '""""' },
    { input: "'", output: '"\'"', outputSmart: '"\'"' },
    { input: "a", output: '"a"', outputSmart: "a" },
    { input: "users", output: '"users"', outputSmart: "users" },
    { input: "all", output: '"all"', outputSmart: '"all"' },
    { input: "CamelCase", output: '"CamelCase"', outputSmart: '"CamelCase"' },
  ];

  it.each(escapeIdentifierTests)("escapeIdentifier($input)", ({ input, output }) => {
    expect(escapeIdentifier(input)).toBe(output);
  });

  it.each(escapeIdentifierTests)("escapeIdentifierSmart($input)", ({ input, outputSmart }) => {
    expect(escapeIdentifierSmart(input)).toBe(outputSmart);
  });

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
