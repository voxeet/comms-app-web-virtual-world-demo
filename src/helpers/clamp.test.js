import { describe, it, expect } from "vitest";
import { clamp } from "./clamp";

describe("clamp test suite", () => {
  it("return value should be clamp min value", () => {
    // 1- arrange
    const clamp2To9 = clamp(2, 9);

    // 2- act
    const result = clamp2To9(1);

    // 3- assert
    expect(result).toEqual(2);
  });

  it("return value should be clamp max value", () => {
    // 1- arrange
    const clamp2To9 = clamp(2, 9);

    // 2- act
    const result = clamp2To9(10);

    // 3- assert
    expect(result).toEqual(9);
  });

  it("return value should be passed value", () => {
    // 1- arrange
    const clamp2To9 = clamp(2, 9);

    // 2- act
    const result = clamp2To9(5);

    // 3- assert
    expect(result).toEqual(5);
  });
});
