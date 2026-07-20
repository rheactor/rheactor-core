import { defineConfig } from "tsdown";

export default defineConfig([
  {
    minify: true,
    entry: "./src/index.ts",
    platform: "browser",
    logLevel: "error",
  },
  {
    minify: true,
    entry: "./src/index.next.ts",
    platform: "node",
    logLevel: "error",
  },
  {
    minify: true,
    entry: "./src/index.node.ts",
    platform: "node",
    logLevel: "error",
  },
]);
