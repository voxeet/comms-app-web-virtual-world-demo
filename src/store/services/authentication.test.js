import { describe, expect, it, vi } from "vitest";
import { retrieveAccessToken } from "./authentication.js";

global.fetch = vi.fn();

describe("authentication test suite", () => {
  it("should return a function", async () => {
    // arrange
    const token = "token";
    const getTokenResponse = { access_token: token };
    function createFetchResponse(data) {
      return { json: () => new Promise((resolve) => resolve(data)) };
    }

    fetch.mockResolvedValue(createFetchResponse(getTokenResponse));

    // act
    const getToken = retrieveAccessToken();

    // assert
    expect(getToken).toBeTypeOf("function");

    const newToken = await getToken();

    expect(token).toBe(token);

    //clean up
    global.fetch.mockClear();
  });
});
