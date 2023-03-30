import { describe, expect, it } from "vitest";
import { getDefect, isFaulty, isLoading, isValid } from "./defect";

describe("defect test suite", () => {
  it("isValid should return true when passing a valid object", () => {
    const obj = { id: "123" };
    const valid = isValid(obj);
    expect(valid).toBe(true);
  });

  it("isValid should return true when passing a string", () => {
    const label = "label";
    const valid = isValid(label);
    expect(valid).toBe(true);
  });

  it("isValid should return false when passing an unvalid object", () => {
    const obj = { "@@data/Defect": "ooooops" };
    const valid = isValid(obj);
    expect(valid).toBe(false);
  });

  it("isFaulty should return false when passing a valid object", () => {
    const obj = { id: "123" };
    const valid = isFaulty(obj);
    expect(valid).toBe(false);
  });

  it("isFaulty should return false when passing a string", () => {
    const label = "label";
    const valid = isFaulty(label);
    expect(valid).toBe(false);
  });

  it("isFaulty should return true when passing an unvalid object", () => {
    const obj = { "@@data/Defect": "ooooops" };
    const valid = isFaulty(obj);
    expect(valid).toBe(true);
  });

  it("isLoading should return true", () => {
    const obj = { "@@data/Defect": "Loading" };
    const loading = isLoading(obj);
    expect(loading).toBeTruthy();
  });

  it("isLoading should return false", () => {
    const obj = {};
    const loading = isLoading(obj);
    expect(loading).not.toBeTruthy();
  });

  it("getDefect should return the defect", () => {
    const obj = { "@@data/Defect": "oops" };
    const defect = getDefect(obj);
    expect(defect).toBe("oops");
  });

  it("getDefect should return an empty string", () => {
    const obj = "";
    const defect = getDefect(obj);
    expect(defect).toBe("");
  });
});
