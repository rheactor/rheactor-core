import { access, constants } from "node:fs/promises";
import { dirname, join } from "node:path";

async function exists(path: string) {
  try {
    await access(path, constants.F_OK);

    return true;
  } catch {
    return false;
  }
}

export async function findPackagePath(path = process.cwd()) {
  let currentPath = path;

  do {
    const packagePath = join(currentPath, "package.json");

    // eslint-disable-next-line no-await-in-loop
    if (await exists(packagePath)) {
      return currentPath;
    }

    const previousPath = dirname(currentPath);

    if (previousPath === currentPath) {
      return;
    }

    currentPath = previousPath;
  } while (true);
}
