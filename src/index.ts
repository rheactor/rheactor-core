export type { Arrayable } from "#/services/ArrayService";

export {
  chunk,
  compact,
  firstOf,
  pluck,
  range,
  shuffle,
  toArray,
  unique,
} from "#/services/ArrayService";

export { getExtension } from "#/services/FileService";

export { noop, singleton } from "#/services/FunctionService";

export { parseAs } from "#/services/JsonService";

export { getTarget } from "#/services/LinkService";

export { clamp, formatNumber } from "#/services/NumberService";

export { escapeIdentifier, escapeIdentifierSmart, escapeLiteral } from "#/services/PostgresService";

export { promiseAll } from "#/services/PromiseService";

export { matchGroups } from "#/services/RegExpService";

export { request, requestText } from "#/services/RequestService";

export { twMerge } from "#/services/TailwindMergeService";

export { unsafeCast } from "#/services/TypescriptService";

export { removeDiacritics, slugify, slugifyId, extractSlugId } from "#/services/WordService";
