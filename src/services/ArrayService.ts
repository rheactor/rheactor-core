export type Arrayable<T> = T | T[];

export function chunk<T>(array: T[], size: number): T[][] {
  return Array.from({ length: Math.ceil(array.length / size) }, (_, index) =>
    array.slice(index * size, index * size + size),
  );
}

export function compact<T>(array: Array<T | null | undefined>): T[] {
  return array.filter((item) => item !== null && item !== undefined);
}

export function firstOf<T>(array: T[]): T | undefined;

export function firstOf<T, TDefault>(array: T[], defaultValue: TDefault): T | TDefault;

export function firstOf<T, TDefault>(
  array: T[],
  defaultValue?: TDefault,
): T | TDefault | undefined {
  return array.at(0) ?? defaultValue;
}

export function pluck<T, K extends keyof T>(array: T[], key: K): Array<T[K]> {
  return array.map((item) => item[key]);
}

export function range(start: number, end: number, step = 1) {
  return Array.from({ length: (end - start) / step + 1 }, (_, index) => start + index * step);
}

export function shuffle<T>(array: T[]) {
  return array.toSorted(() => Math.random() - 0.5);
}

export function toArray<T>(value: Arrayable<T>): T[] {
  return Array.isArray(value) ? value : [value];
}

export function unique<T>(array: T[]): T[] {
  return [...new Set(array)];
}
