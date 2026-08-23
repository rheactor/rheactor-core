export type { Arrayable } from "#/services/ArrayService";

export {
  chunk,
  compact,
  firstOf,
  groupBy,
  pluck,
  range,
  shuffle,
  toArray,
  unique,
} from "#/services/ArrayService";

export { getExtension } from "#/services/FileService";

export { attempt, noop, singleton } from "#/services/FunctionService";

export { parseAs } from "#/services/JsonService";

export { getTarget } from "#/services/LinkService";

export { clamp, formatNumber } from "#/services/NumberService";

export { pick } from "#/services/ObjectService";

export { promiseAll, promisePick, sleep } from "#/services/PromiseService";

export { matchGroups } from "#/services/RegExpService";

export type { RequestOptions, RequestResponse } from "#/services/RequestService";
export { request, requestText } from "#/services/RequestService";

export { unsafeCast } from "#/services/TypescriptService";

export { removeDiacritics, slugify, slugifyId, extractSlugId } from "#/services/WordService";
