export function noop() {
  /* empty */
}

export function singleton<T>(factory: () => T): () => T {
  let instance: T | undefined;

  return () => {
    instance ??= factory();

    return instance;
  };
}
