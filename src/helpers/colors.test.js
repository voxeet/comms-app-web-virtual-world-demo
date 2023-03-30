import { describe, it, expect } from "vitest";
import { convertStringToHexaColor } from "./colors";

describe("colors test suite", () => {
  it("color should match the snapshot", () => {
    const color = convertStringToHexaColor("test color");
    expect(color).toMatchSnapshot();
  });
});
