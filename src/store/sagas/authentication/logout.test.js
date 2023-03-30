import { describe, expect, it } from "vitest";
import logout from "./logout";

describe("logout test suite", () => {
  it("should do noop", () => {
    const generator = logout();
    expect(generator.next().value).toEqual(console.log("logout"));
    expect(generator.next().done).toBeTruthy();
  });
});
