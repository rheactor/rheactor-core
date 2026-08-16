# @rheactor/rheactor-core

Shared utility functions used across Rheactor projects.

## Installation

Private package, install from your internal registry or workspace:

```sh
bun install github:@rheactor/rheactor-core
```

## Entry points

| Entry point | Import path                        | Environment                       | Dependencies                  |
| ----------- | ---------------------------------- | --------------------------------- | ----------------------------- |
| Base        | `@rheactor/rheactor-core`          | Universal (browser, server, edge) | None                          |
| Node        | `@rheactor/rheactor-core/node`     | Node.js only                      | Requires `node:fs` support    |
| Next        | `@rheactor/rheactor-core/next`     | Next.js (requires `next/image`)   | Requires `next/image` support |
| Postgres    | `@rheactor/rheactor-core/postgres` | Universal (browser, server, edge) | None                          |

# Base functions

Safe in any runtime.

**Import from the package root:**

```ts
// Example:
import { chunk, parseAs, slugify } from "@rheactor/rheactor-core";
```

## Array functions

Creating, splitting, transforming, and reading arrays.

### chunk

```ts
chunk<T>(array: T[], size: number): T[][]
```

Splits an array into consecutive sub-arrays of `size` elements. The last chunk may be shorter.

Use for grid layouts, pagination, or batch processing.

```ts
chunk([1, 2, 3, 4, 5], 2); // [[1, 2], [3, 4], [5]]
```

### compact

```ts
compact<T>(array: Array<T | null | undefined>): T[]
```

Removes `null` and `undefined` items, returning a new array narrowed to `T`.

Use instead of a manual `filter((item): item is T => ...)` type guard when cleaning nullable values
from optional inputs, API results, or form values.

```ts
compact([1, null, 2, undefined, 3]); // [1, 2, 3]
```

### firstOf

```ts
firstOf<T>(array: T[]): T | undefined

firstOf<T, TDefault>(array: T[], defaultValue: TDefault): T | TDefault
```

Returns the first element of the array, or the optional `defaultValue` when the array is empty or
its first element is nullish (nullish coalescing). Without a default, `undefined` is returned.

Use when `undefined` is the desired sentinel for an empty array, or to provide a fallback element.
For a `null` sentinel, pass `null` as the default explicitly.

```ts
firstOf([1, 2, 3]); // 1
firstOf([]); // undefined
firstOf([], 0); // 0
firstOf([1, 2], 0); // 1
```

### pluck

```ts
pluck<T, K extends keyof T>(array: T[], key: K): Array<T[K]>
```

Extracts the same property from every item, preserving order.

Use to get a list of ids, names, etc. from an array of objects.

```ts
pluck([{ id: 1, ignored: true }, { id: 2 }], "id"); // [1, 2]
```

### range

```ts
range(start: number, end: number, step = 1): number[]
```

Creates an inclusive numeric sequence from `start` to `end`.

Use to generate years, pages, indices, or any integer interval.

```ts
range(1, 5); // [1, 2, 3, 4, 5]
```

### shuffle

```ts
shuffle<T>(array: T[]): T[]
```

Returns a new array with the items in random order. Does not mutate the input.

Use to randomize lists or quiz answers.

Note: the sort-based implementation is not statistically uniform.

```ts
shuffle([1, 2, 3]); // e.g. [3, 1, 2]
```

### toArray

```ts
toArray<T>(value: Arrayable<T>): T[]

type Arrayable<T> = T | T[];
```

Normalizes a single value or an array into an array.

Use in function arguments to accept both one value and many values.

```ts
toArray(1); // [1]
toArray([1, 2]); // [1, 2]
```

### unique

```ts
unique<T>(array: T[]): T[]
```

Removes duplicates via `Set`, keeping first-occurrence order.

Use to dedupe ids, tags, or merged lists.

```ts
unique([1, 2, 2, 3]); // [1, 2, 3]
```

## File functions

Working with file names and paths.

### getExtension

```ts
getExtension(path: string): string | undefined
```

Returns the extension after the last dot, without the dot. Returns `undefined` when the path has no
dot.

Use for file type detection from file names or URLs.

```ts
getExtension("archive.tar.gz"); // "gz"
```

## Function functions

Small utilities for working with functions.

### noop

```ts
noop(): void
```

Empty function that does nothing.

Use as a placeholder for optional callbacks, event handlers, or default props.

```ts
const onClick: () => void = isEnabled ? handleClick : noop;
```

### singleton

```ts
singleton<T>(factory: () => T): () => T
```

Creates a lazily-initialized single instance: the `factory` runs only on the first call and its
result is stored and reused by every subsequent call.

Use for expensive or stateful shared objects (database clients, stores, caches) without a DI
container.

```ts
const getDb = singleton(() => new DatabaseClient());

getDb() === getDb(); // true
```

## JSON functions

Parsing JSON safely.

### parseAs

```ts
parseAs<T>(data: string | null | undefined): T | undefined
parseAs<T>(data: string | null | undefined, defaultValue: T): T
```

Safely parses a JSON string into `T`.

- **First overload:** returns `undefined` when the input is not a string or is invalid JSON.
- **Second overload:** returns `defaultValue` in those cases, so the result is never `undefined`.

Use when reading JSON from `localStorage`, cookies, URL params, or API responses stored as text.

```ts
parseAs<Settings>(localStorage.getItem("settings"), DEFAULT_SETTINGS); // Settings
parseAs<Settings>(localStorage.getItem("settings")); // Settings | undefined
```

## Link functions

Resolving link attributes.

### getTarget

```ts
getTarget(src: string | undefined, target: "_blank" | "_self" | "blank" | "self" | (string & {}) | undefined): "_blank" | "_self"
```

Resolves the `<a target>` attribute for a link.

- `_blank`/`blank` and `_self`/`self` win over everything else; any other `target` string is
  ignored.
- Otherwise infers from `src`: internal links (`/...`), `mailto:`, and other non-http(s) protocols
  resolve to `_self`; absolute http(s) URLs and `undefined` src resolve to `_blank`.

Use when rendering links from user content where you don't control the URL.

```ts
getTarget("/about", undefined); // "_self"
getTarget("https://example.com", undefined); // "_blank"
getTarget(undefined, "_self"); // "_self"
```

## Number functions

Formatting and clamping numbers.

### clamp

```ts
clamp(value: number, min: number, max: number): number
```

Bounds a number between `min` and `max`.

Use for cursor positions, opacity, scroll offsets, or progress values.

```ts
clamp(120, 0, 100); // 100
```

### formatNumber

```ts
formatNumber(value: number, decimals = 0, decimalSeparator = ".", thousandSeparator = ""): string
```

Formats a number with a fixed number of decimals (`toFixed`), then applies custom `decimalSeparator`
and `thousandSeparator`. Thousands are not grouped by default (empty `thousandSeparator`).

Use for display formatting with locale-specific separators.

```ts
formatNumber(1234567.891, 2, ",", "."); // "1.234.567,89"
```

## Object functions

Projecting subsets of fields from objects.

### pick

```ts
pick<T extends object, K extends keyof T>(object: T, keys: readonly K[]): Pick<T, K>
```

Returns a new object containing only the given `keys`, with values copied from `object`. The source
object is not mutated, and keys not present in `object` are still included with value `undefined`.

Use to shape API responses or props without leaking internal fields.

```ts
pick({ id: 1, name: "Ada", passwordHash: "..." }, ["id", "name"]);
// { id: 1, name: "Ada" }
```

## Promise functions

Awaiting promises and pausing execution.

### promiseAll

```ts
promiseAll<const T extends Record<string, Promise<unknown>>>(promises: T): Promise<{ [K in keyof T]: Awaited<T[K]> }>
```

Runs every promise in the object concurrently (`Promise.all`) and resolves to an object with the
same keys mapped to their resolved values, preserving keys and types.

Use when you need named results instead of a positional array.

```ts
const { user, posts } = await promiseAll({
  user: fetchUser(),
  posts: fetchPosts(),
});
// user: User; posts: Post[]
```

### sleep

```ts
sleep(ms: number): Promise<void>
```

Resolves after `ms` milliseconds via `setTimeout`.

Use as the base for rate limiting, polling loops, or retry backoff.

```ts
await sleep(1000); // pauses execution for 1 second
```

## RegExp functions

Extracting data with regular expressions.

### matchGroups

```ts
matchGroups<GroupName extends string>(expression: RegExp, value: string): Record<GroupName, string | undefined> | undefined
```

Executes a RegExp with named capture groups and returns the groups record, or `undefined` when there
is no match.

Use to parse structured strings such as dates, paths, or ids.

```ts
matchGroups<"year" | "month">(/(?<year>\d{4})-(?<month>\d{2})/v, "2026-08");
// { year: "2026", month: "08" }
```

## Request functions

Typed wrappers around `fetch`.

### request

```ts
request<T>(options: RequestOptions): Promise<RequestResponse<T>>

interface RequestOptions {
  method?: "GET" | "POST";
  url: string | URL;
  query?: string | Record<string, string> | string[][] | URLSearchParams;
  body?: object;
  headers?: HeadersInit;
}

interface RequestResponse<T> {
  success: boolean;
  status: number;
  data?: T;
}
```

Sends a GET (default) or POST `fetch`, serializing `body` as JSON and appending `query` to the URL.
Resolves to `{ success, status, data }`, where `success` is `response.ok` and `data` is the body
parsed as JSON, or `undefined` when the body is empty or invalid JSON.

Use as a small typed fetch wrapper when you don't need full control over the response.

```ts
const result = await request<{ id: number }>({
  url: "/api/users",
  method: "POST",
  body: { name: "Ada" },
});

if (result.success) {
  console.log(result.data?.id);
}
```

### requestText

```ts
requestText(options: RequestOptions): Promise<RequestResponse<string>>
```

Same as `request`, but `data` is the raw response text instead of parsed JSON.

Use for endpoints that return plain text, HTML, or CSV.

## Tailwind merge functions

Merging Tailwind CSS class strings.

### twMerge

```ts
twMerge(...classLists: ClassNameValue[]): string
```

Merges Tailwind CSS class strings, removing conflicts so the last conflicting class wins. Extended
with Rheactor theme tokens (`container` class, `mobile` breakpoint, `theme` color).

Use for `className={twMerge(...)}` with conditional classes.

```ts
twMerge("px-2 py-1", isActive && "py-3"); // "px-2 py-3" when isActive
```

## TypeScript functions

Type system utilities.

### unsafeCast

```ts
unsafeCast<T>(value: unknown): T
```

Casts any value to `T` without any runtime check. Use only when the source is already validated or
known to match `T`.

Do not use on unsanitized input.

```ts
const user = unsafeCast<User>(JSON.parse(data));
```

## Word functions

Slugifying and cleaning words.

### removeDiacritics

```ts
removeDiacritics(word: string): string
```

Removes combining diacritical marks via Unicode NFD normalization.

Use before slugifying, indexing, or comparing user input.

```ts
removeDiacritics("café"); // "cafe"
```

### slugify

```ts
slugify(word: string, separator = "-"): string
```

Lowercases, trims, removes diacritics, and replaces every run of non-word characters with
`separator`, trimming leading and trailing separators.

Use to generate URL-safe slugs.

```ts
slugify("Olá, mundo!"); // "ola-mundo"
```

### slugifyId

```ts
slugifyId(id: number, word: string): string
```

Builds an SEO-friendly slug prefixed with a numeric database id. Pairs with `extractSlugId` to
recover the id from a URL param.

```ts
slugifyId(42, "Olá, mundo!"); // "42-ola-mundo"
```

### extractSlugId

```ts
extractSlugId(id: string): number | undefined
```

Extracts the leading numeric id from a slug created by `slugifyId`. Returns `undefined` when the
prefix is missing or is not a safe integer.

Use to recover the id from a URL param without extra validation.

```ts
extractSlugId("42-ola-mundo"); // 42
extractSlugId("ola-mundo"); // undefined
```

# Node functions

Node.js only.

**Import from the node entry point:**

```ts
// Example:
import { findPackagePath } from "@rheactor/rheactor-core/node";
```

## Package functions

Locating the project package root.

### findPackagePath

```ts
findPackagePath(path = process.cwd()): Promise<string | undefined>
```

Walks up the directory tree from `path` until a directory containing `package.json` is found.
Resolves to that directory path, or `undefined` when the filesystem root is reached without a match.

Use in scripts and CLIs to locate the project root.

```ts
const root = await findPackagePath();
// e.g. "/home/user/projects/my-app"
```

# Next functions

Next.js only.

**Import from the next entry point:**

```ts
// Example:
import { getNextImageUrl } from "@rheactor/rheactor-core/next";
```

## Image functions

Resolving optimized image URLs with `next/image`.

### getNextImageUrl

```ts
getNextImageUrl(src: string, width: number, quality = 75): ImagePropsResult
```

Resolves optimized image URLs through `next/image`'s `getImageProps`. Returns the props object
(including `srcSet` and `src`) ready to be spread onto an `<img>` tag.

Use when you need an optimized image URL outside of an `<Image>` component, such as in OG images,
emails, or headless components.

```ts
const { srcSet, src } = getNextImageUrl("/photo.jpg", 640);

// <img srcSet={srcSet} src={src} />
```

# Postgres functions

Escaping and unescaping identifiers and values for PostgreSQL queries. Safe in any runtime.

**Import from the postgres entry point:**

```ts
// Example:
import {
  escapeIdentifier,
  escapeLiteral,
  unescapeIdentifier,
} from "@rheactor/rheactor-core/postgres";
```

## Postgres functions

Escaping values and identifiers for PostgreSQL queries.

### escapeIdentifier

```ts
escapeIdentifier(identifier: string): string
```

Wraps a PostgreSQL identifier in double quotes, doubling any embedded quotes.

Use when interpolating table or column names into dynamic SQL.

```ts
escapeIdentifier('my"column'); // '"my""column"'
```

### escapeIdentifierSmart

```ts
escapeIdentifierSmart(identifier: string, bypassKeywords = false): string
```

Quotes only when necessary: identifiers matching `/^[a-z_][a-z0-9_$]*$/` are returned as-is unless
they are PostgreSQL keywords. `bypassKeywords = true` also skips the keyword check.

Use to generate cleaner SQL where minimal quoting matters.

```ts
escapeIdentifierSmart("users"); // users
escapeIdentifierSmart("select"); // "select"
```

### escapeLiteral

```ts
escapeLiteral(value: unknown): string
```

Escapes a value into a PostgreSQL string literal. Single quotes are escaped by doubling, values
containing backslashes use the `E''` syntax, non-string values become `''`, and null bytes throw.

Use when interpolating values into dynamic SQL.

```ts
escapeLiteral("O'Reilly"); // "'O''Reilly'"
```

### rescapeIdentifier

```ts
rescapeIdentifier(identifier: string, bypassKeywords = false): string
```

Removes the double-quote escaping from `identifier` (via `unescapeIdentifier`) and re-escapes it
with `escapeIdentifierSmart`, so already-escaped identifiers are normalized instead of
double-escaped. `bypassKeywords` behaves as in `escapeIdentifierSmart`.

Use to normalize identifiers coming from user input, SQL dumps, or configuration before
interpolating them into dynamic SQL.

```ts
rescapeIdentifier('"users"'); // users
rescapeIdentifier('"my""column"'); // "my""column"
```

### unescapeIdentifier

```ts
unescapeIdentifier(identifier: string): string
```

Inverse of `escapeIdentifier`: strips a surrounding pair of double quotes and collapses embedded
`""` back to `"`. Strings without surrounding double quotes (e.g. literals like `'abc'`) are
returned unchanged. Throws when the identifier starts with a double quote but does not end with one
(unbalanced quotes).

Use to recover the raw identifier from a quoted one, e.g. when parsing SQL output or building
`rescapeIdentifier`.

```ts
unescapeIdentifier('"ab""cd"'); // 'ab"cd'
unescapeIdentifier('"users"'); // users
unescapeIdentifier("'abc'"); // "'abc'"
unescapeIdentifier('"abc'); // throws
```
