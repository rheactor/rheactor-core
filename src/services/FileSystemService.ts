import { access } from "node:fs/promises";

import isPathInside from "is-path-inside";

export const existsInside: (child: string, parent: string) => boolean = isPathInside;

export async function exists(path: string) {
  try {
    await access(path);

    return true;
  } catch {
    return false;
  }
}
