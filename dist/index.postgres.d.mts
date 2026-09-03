//#region src/services/PostgresService.d.ts
export declare function escapeIdentifier(identifier: string): string;
export declare function escapeIdentifierSmart(identifier: string, bypassKeywords?: boolean): string;
export declare function unescapeIdentifier(identifier: string): string;
export declare function rescapeIdentifier(identifier: string, bypassKeywords?: boolean): string;
export declare function escapeLiteral(value: unknown): string;
//#endregion