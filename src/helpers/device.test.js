import { describe, it, expect } from "vitest";
import { isMobile } from "./device";

describe("device helper test suite", () => {
  it("isMobile helper function should return a bool", () => {
    const mobile = isMobile();
    expect(mobile).toBe(false);
  });
});
