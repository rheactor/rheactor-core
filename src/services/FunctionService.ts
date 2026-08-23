export function noop() {
  /* empty */
}

async function attemptAsync<T, Err>(
  promise: Promise<T>,
  onError: ((error: Err) => T | Promise<T>) | undefined,
  onFinally: (() => void) | undefined,
): Promise<T> {
  try {
    return await promise;
  } catch (error) {
    if (!onError) {
      throw error;
    }

    return await onError(error as Err);
  } finally {
    onFinally?.();
  }
}

export function attempt<T, Err = Error>(
  action: () => Promise<T>,
  onError?: (error: Err) => T | Promise<T>,
  onFinally?: () => void,
): Promise<T>;
export function attempt<T, Err = Error>(
  action: () => T,
  onError?: (error: Err) => T,
  onFinally?: () => void,
): T;
export function attempt<T, Err>(
  action: () => T | Promise<T>,
  onError?: (error: Err) => T | Promise<T>,
  onFinally?: () => void,
): T | Promise<T> {
  try {
    const result = action();

    if (!(result instanceof Promise)) {
      // inner finally preserves native ordering without running onFinally twice on the async branch
      try {
        return result;
      } finally {
        onFinally?.();
      }
    }

    return attemptAsync(result, onError, onFinally);
  } catch (error) {
    try {
      if (!onError) {
        throw error;
      }

      return onError(error as Err);
    } finally {
      onFinally?.();
    }
  }
}

export function singleton<T>(factory: () => T): () => T {
  let instance: T | undefined;

  return () => {
    instance ??= factory();

    return instance;
  };
}
