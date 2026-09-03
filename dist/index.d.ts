//#region src/services/ArrayService.d.ts
type Arrayable<T> = T | T[];
export declare function chunk<T>(array: T[], size: number): T[][];
export declare function compact<T>(array: Array<T | null | undefined>): T[];
export declare function firstOf<T>(array: T[]): T | undefined;
export declare function firstOf<T, TDefault>(array: T[], defaultValue: TDefault): T | TDefault;
export declare function groupBy<T, K extends PropertyKey>(items: Iterable<T>, keySelector: (item: T, index: number) => K): Partial<Record<K, T[]>>;
export declare function pluck<T, K extends keyof T>(array: T[], key: K): Array<T[K]>;
export declare function pluck<T, K extends keyof T>(array: T[] | null | undefined, key: K): Array<T[K]> | undefined;
export declare function range(start: number, end: number, step?: number): number[];
export declare function shuffle<T>(array: T[]): T[];
export declare function toArray<T>(value: Arrayable<T>): T[];
export declare function unique<T>(array: T[]): T[];
//#endregion
//#region src/services/FileService.d.ts
export declare function getExtension(path: string): string | undefined;
//#endregion
//#region src/services/FunctionService.d.ts
export declare function noop(): void;
export declare function attempt<T, Err = Error>(action: () => Promise<T>, onError?: (error: Err) => T | Promise<T>, onFinally?: () => void): Promise<T>;
export declare function attempt<T, Err = Error>(action: () => T, onError?: (error: Err) => T, onFinally?: () => void): T;
export declare function singleton<T>(factory: () => T): () => T;
//#endregion
//#region src/services/JsonService.d.ts
export declare function parseAs<T>(data: string | null | undefined): T | undefined;
export declare function parseAs<T>(data: string | null | undefined, defaultValue: T): T;
//#endregion
//#region src/services/LinkService.d.ts
type Target = "_blank" | "_self" | "blank" | "self";
export declare function getTarget(src: string | undefined, target?: Target | (string & {})): "_blank" | "_self";
//#endregion
//#region src/services/NumberService.d.ts
export declare function clamp(value: number, min: number, max: number): number;
export declare function formatNumber(value: number, decimals?: number, decimalSeparator?: string, thousandSeparator?: string): string;
//#endregion
//#region src/services/ObjectService.d.ts
export declare function pick<T extends object, K extends keyof T>(object: T, keys: readonly K[]): Pick<T, K>;
//#endregion
//#region src/services/PromiseService.d.ts
export declare function sleep(ms: number): Promise<void>;
export declare function promisePick<T extends object, K extends keyof T>(promise: Promise<T>, key: K): Promise<T[K] | undefined>;
export declare function promisePick<T>(promise: Promise<unknown>, key: PropertyKey): Promise<T | undefined>;
export declare function promiseAll<const T extends Record<string, Promise<unknown>>>(promises: T): Promise<{ [K in keyof T]: Awaited<T[K]>; }>;
//#endregion
//#region src/services/RegExpService.d.ts
type MatchGroups<Group extends string> = Record<Group, string | undefined>;
export declare function matchGroups<GroupName extends string>(expression: RegExp, value: string): MatchGroups<GroupName> | undefined;
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
export declare function request<T>(options: RequestOptions): Promise<RequestResponse<T>>;
export declare function requestText(options: RequestOptions): Promise<RequestResponse<string>>;
//#endregion
//#region src/services/TypescriptService.d.ts
export declare function unsafeCast<T>(value: unknown): T;
//#endregion
//#region src/services/WordService.d.ts
export declare function removeDiacritics(word: string): string;
export declare function slugify(word: string, separator?: string): string;
export declare function slugifyId(id: number, word: string): string;
export declare function extractSlugId(id: string): number | undefined;
//#endregion
export type { Arrayable, RequestOptions, RequestResponse };