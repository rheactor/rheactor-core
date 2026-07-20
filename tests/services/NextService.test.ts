import { describe, expect, it } from "vitest";

import { getNextImageUrl } from "#/services/NextService";

describe("services/NextService", () => {
  it("getNextImageUrl returns image props encoding src and width", () => {
    const properties = getNextImageUrl("https://example.com/image.jpg", 640);

    expect(properties).toBeDefined();
    expect(properties.src).toContain("/_next/image");
    expect(properties.src).toContain("image.jpg");
    expect(properties.width).toBe(640);
  });

  it("getNextImageUrl reflects provided width", () => {
    const properties = getNextImageUrl("https://example.com/image.jpg", 320, 75);

    expect(properties.width).toBe(320);
  });

  it("getNextImageUrl returns props with alt set to empty string", () => {
    const properties = getNextImageUrl("https://example.com/img.png", 100);

    expect(properties["alt"]).toBe("");
  });
});
