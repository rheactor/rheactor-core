import { PG_KEYWORDS } from "#/data/PostgresKeywords";

const REGEXP_SAFE_IDENTIFIER = /^[a-z_][a-z0-9_$]*$/v;

export function escapeIdentifier(identifier: string) {
  return `"${identifier.replaceAll('"', '""')}"`;
}

export function escapeIdentifierSmart(identifier: string) {
  if (REGEXP_SAFE_IDENTIFIER.test(identifier) && !PG_KEYWORDS.has(identifier)) {
    return identifier;
  }

  return escapeIdentifier(identifier);
}

export function escapeLiteral(value: unknown) {
  if (typeof value !== "string") {
    return "''";
  }

  if (value.includes("\0")) {
    throw new Error("literal cannot contain null bytes");
  }

  return value.includes("\\")
    ? ` E'${value.replaceAll("'", "''").replaceAll("\\", `\\\\`)}'`
    : `'${value.replaceAll("'", "''")}'`;
}
