import { describe, expect, it } from "vitest";

import { twMerge } from "#/services/TailwindMergeService";

describe("services/TailwindMergeService", () => {
  it("twMerge", () => {
    expect(twMerge("text-theme-50 text-theme-100")).toBe("text-theme-100");
    expect(twMerge("w-container w-max")).toBe("w-max");
    expect(twMerge("max-md:w-container max-container:w-container")).toBe(
      "max-md:w-container max-container:w-container",
    );
  });
});
