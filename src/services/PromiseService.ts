export async function sleep(ms: number) {
  const { promise, resolve } = Promise.withResolvers();

  setTimeout(resolve, ms);

  await promise;
}

export async function promisePick<T extends object, K extends keyof T>(
  promise: Promise<T>,
  key: K,
): Promise<T[K] | undefined>;

export async function promisePick<T>(
  promise: Promise<unknown>,
  key: PropertyKey,
): Promise<T | undefined>;

export async function promisePick(promise: Promise<unknown>, key: PropertyKey) {
  const resolved = await promise;

  if (resolved === null || typeof resolved !== "object") {
    return undefined;
  }

  return (resolved as Record<PropertyKey, unknown>)[key];
}

export async function promiseAll<const T extends Record<string, Promise<unknown>>>(promises: T) {
  const keys = Object.keys(promises);
  const results = await Promise.all(Object.values(promises));

  return Object.fromEntries(results.map((result, index) => [keys[index], result])) as Promise<{
    [K in keyof T]: Awaited<T[K]>;
  }>;
}
