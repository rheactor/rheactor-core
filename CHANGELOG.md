# Changelog

All notable changes to this project are documented in this file.

## [3.0.0] - 2026-08-23

### Added

- Node entry point (`@rheactor/rheactor-core/node`) with `exists`, `existsInside`, and
  `findPackagePath`.
- Postgres entry point (`@rheactor/rheactor-core/postgres`) with `escapeIdentifier`,
  `escapeIdentifierSmart`, `escapeLiteral`, `rescapeIdentifier`, and `unescapeIdentifier`.
- Tailwind entry point (`@rheactor/rheactor-core/tailwind`) with theme-extended `twMerge`.
- Base functions: `compact`, `firstOf`, `groupBy`, `pick`, `promisePick`, `sleep`, `singleton`, and
  `unsafeCast`.
- Exported `RequestOptions` and `RequestResponse` types.

### Changed

- `getTarget` target parameter is now optional.
- `pluck` accepts nullable arrays and returns `undefined` for them.
- `request` forwards all remaining options to `fetch`.

### Removed

- `twMerge` from the base entry point; import it from `@rheactor/rheactor-core/tailwind`.

## [2.0.0] - 2026-07-19

### Added

- Next entry point (`@rheactor/rheactor-core/next`) with `getNextImageUrl` optimized image URL
  helper.
- Array utilities: `chunk`, `pluck`, `shuffle`, `unique`.
- Number formatting: `formatNumber`.
- Safe JSON parsing: `parseAs`.
- Named capture group matching: `matchGroups`.
- Typed fetch wrappers: `request` and `requestText`.

### Changed

- `getNextImageUrl` returns full image props (including `srcSet`) instead of a plain URL.

### Removed

- Deferred promise utility and other unused utility APIs.
