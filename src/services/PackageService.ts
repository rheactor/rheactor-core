import { access, constants } from "node:fs/promises";
import { dirname, join } from "node:path";

export async function findPackagePath(path = process.cwd()) {
  let currentPath = path;

  do {
    try {
      // eslint-disable-next-line no-await-in-loop
      await access(join(currentPath, "package.json"), constants.F_OK);

      return currentPath;
    } catch {
      // Empty.
    }

    const previousPath = dirname(currentPath);

    if (previousPath === currentPath) {
      return;
    }

    currentPath = previousPath;
  } while (
    // oxlint-disable-next-line no-constant-condition
    true
  );
}
