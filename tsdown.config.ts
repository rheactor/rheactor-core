import { defineConfig } from "tsdown";

// oxlint-disable-next-line import/no-anonymous-default-export
export default defineConfig([
  {
    minify: true,
    entry: "./src/index.ts",
    platform: "browser",
  },
  {
    minify: true,
    entry: "./src/index.next.ts",
    platform: "node",
  },
  {
    minify: true,
    entry: "./src/index.node.ts",
    platform: "node",
  },
  {
    minify: true,
    entry: "./src/index.postgres.ts",
    platform: "node",
  },
]);
