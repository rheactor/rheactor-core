//#region src/services/ArrayService.d.ts
type Arrayable<T> = T | T[];
declare function chunk<T>(array: T[], size: number): T[][];
declare function compact<T>(array: Array<T | null | undefined>): T[];
declare function firstOf<T>(array: T[]): T | undefined;
declare function firstOf<T, TDefault>(array: T[], defaultValue: TDefault): T | TDefault;
declare function groupBy<T, K extends PropertyKey>(items: Iterable<T>, keySelector: (item: T, index: number) => K): Partial<Record<K, T[]>>;
declare function pluck<T, K extends keyof T>(array: T[], key: K): Array<T[K]>;
declare function range(start: number, end: number, step?: number): number[];
declare function shuffle<T>(array: T[]): T[];
declare function toArray<T>(value: Arrayable<T>): T[];
declare function unique<T>(array: T[]): T[];
//#endregion
//#region src/services/FileService.d.ts
declare function getExtension(path: string): string | undefined;
//#endregion
//#region src/services/FunctionService.d.ts
declare function noop(): void;
declare function singleton<T>(factory: () => T): () => T;
//#endregion
//#region src/services/JsonService.d.ts
declare function parseAs<T>(data: string | null | undefined): T | undefined;
declare function parseAs<T>(data: string | null | undefined, defaultValue: T): T;
//#endregion
//#region src/services/LinkService.d.ts
type Target = "_blank" | "_self" | "blank" | "self";
declare function getTarget(src: string | undefined, target?: Target | (string & {})): "_blank" | "_self";
//#endregion
//#region src/services/NumberService.d.ts
declare function clamp(value: number, min: number, max: number): number;
declare function formatNumber(value: number, decimals?: number, decimalSeparator?: string, thousandSeparator?: string): string;
//#endregion
//#region src/services/ObjectService.d.ts
declare function pick<T extends object, K extends keyof T>(object: T, keys: readonly K[]): Pick<T, K>;
//#endregion
//#region src/services/PromiseService.d.ts
declare function sleep(ms: number): Promise<void>;
declare function promisePick<T extends object, K extends keyof T>(promise: Promise<T>, key: K): Promise<T[K] | undefined>;
declare function promisePick<T>(promise: Promise<unknown>, key: PropertyKey): Promise<T | undefined>;
declare function promiseAll<const T extends Record<string, Promise<unknown>>>(promises: T): Promise<{ [K in keyof T]: Awaited<T[K]>; }>;
//#endregion
//#region src/services/RegExpService.d.ts
type MatchGroups<Group extends string> = Record<Group, string | undefined>;
declare function matchGroups<GroupName extends string>(expression: RegExp, value: string): MatchGroups<GroupName> | undefined;
//#endregion
//#region src/services/RequestService.d.ts
type FetchUrl = Exclude<Parameters<typeof fetch>[0], Request>;
type URLSearchParamsQuery = ConstructorParameters<typeof URLSearchParams>[0];
interface RequestOptions extends Omit<RequestInit, "body"> {
  url: FetchUrl;
  query?: URLSearchParamsQuery;
  body?: object;
}
interface RequestResponse<T> {
  success: boolean;
  status: number;
  data?: T;
}
declare function request<T>(options: RequestOptions): Promise<RequestResponse<T>>;
declare function requestText(options: RequestOptions): Promise<RequestResponse<string>>;
//#endregion
//#region src/services/TailwindMergeService.d.ts
declare const twMerge: (...classLists: import("tailwind-merge").ClassNameValue[]) => string;
//#endregion
//#region src/services/TypescriptService.d.ts
declare function unsafeCast<T>(value: unknown): T;
//#endregion
//#region src/services/WordService.d.ts
declare function removeDiacritics(word: string): string;
declare function slugify(word: string, separator?: string): string;
declare function slugifyId(id: number, word: string): string;
declare function extractSlugId(id: string): number | undefined;
//#endregion
export { type Arrayable, type RequestOptions, type RequestResponse, chunk, clamp, compact, extractSlugId, firstOf, formatNumber, getExtension, getTarget, groupBy, matchGroups, noop, parseAs, pick, pluck, promiseAll, promisePick, range, removeDiacritics, request, requestText, shuffle, singleton, sleep, slugify, slugifyId, toArray, twMerge, unique, unsafeCast };