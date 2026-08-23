import { defineConfig } from "tsdown";

// oxlint-disable-next-line import/no-anonymous-default-export
export default defineConfig([
  {
    minify: true,
    entry: "./src/index.ts",
    platform: "browser",
    deps: { neverBundle: ["tailwind-merge"] },
  },
  {
    minify: true,
    entry: "./src/index.next.ts",
    platform: "node",
    deps: { neverBundle: ["next"] },
  },
  {
    minify: true,
    entry: "./src/index.node.ts",
    platform: "node",
    deps: { alwaysBundle: ["is-path-inside"], onlyBundle: false },
  },
  {
    minify: true,
    entry: "./src/index.postgres.ts",
    platform: "node",
  },
]);
