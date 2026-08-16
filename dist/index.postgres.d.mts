//#region src/services/PostgresService.d.ts
declare function escapeIdentifier(identifier: string): string;
declare function escapeIdentifierSmart(identifier: string, bypassKeywords?: boolean): string;
declare function unescapeIdentifier(identifier: string): string;
declare function rescapeIdentifier(identifier: string, bypassKeywords?: boolean): string;
declare function escapeLiteral(value: unknown): string;
//#endregion
export { escapeIdentifier, escapeIdentifierSmart, escapeLiteral, rescapeIdentifier, unescapeIdentifier };