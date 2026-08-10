import { describe, expect, it } from "vitest";

import { getTarget } from "#/services/LinkService";

describe("services/LinkService", () => {
  const getTargetTests = [
    ["any", "_blank", "_blank"],
    ["any", "blank", "_blank"],
    ["any", "_self", "_self"],
    ["any", "self", "_self"],
    [undefined, undefined, "_blank"],
    ["mailto:example@example.com", undefined, "_self"],
    ["http://example.com", undefined, "_blank"],
    ["https://example.com", undefined, "_blank"],
    ["ftp://example.com", undefined, "_self"],
    ["/", undefined, "_self"],
    ["/home", undefined, "_self"],
    ["/home", "_blank", "_blank"],
  ] as const;

  it.each(getTargetTests)("getTarget(%j, %j) = %j", (src, target, output) => {
    expect(getTarget(src, target)).toStrictEqual(output);
  });
});
