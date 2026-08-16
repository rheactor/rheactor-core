import { PG_KEYWORDS } from "#/data/PostgresKeywords";

const REGEXP_SAFE_IDENTIFIER = /^[a-z_][a-z0-9_$]*$/v;

export function escapeIdentifier(identifier: string) {
  return `"${identifier.replaceAll('"', '""')}"`;
}

export function escapeIdentifierSmart(identifier: string, bypassKeywords = false) {
  if (REGEXP_SAFE_IDENTIFIER.test(identifier)) {
    const bypassEscaping = bypassKeywords || !PG_KEYWORDS.has(identifier);

    if (bypassEscaping) {
      return identifier;
    }
  }

  return escapeIdentifier(identifier);
}

export function unescapeIdentifier(identifier: string) {
  if (identifier.startsWith('"')) {
    if (!identifier.endsWith('"')) {
      throw new Error("identifier starting with a double quote must end with a double quote");
    }

    return identifier.slice(1, -1).replaceAll('""', '"');
  }

  return identifier;
}

export function rescapeIdentifier(identifier: string, bypassKeywords = false) {
  return escapeIdentifierSmart(unescapeIdentifier(identifier), bypassKeywords);
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
