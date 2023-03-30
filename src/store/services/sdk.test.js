import { describe, it, expect, vi } from "vitest";
import { initializeSDK } from "./sdk";

const mockInitializeToken = vi.fn();

vi.mock("@voxeet/voxeet-web-sdk", () => ({
  default: {
    initializeToken: (token, callback) => mockInitializeToken(token, callback),
  },
}));

describe("sdk init service test suite", () => {
  it("should init the sdk", () => {
    // arrange
    const token = "token";

    const callback = () => {};
    // 2- act
    initializeSDK({ token, callback });

    // assert
    expect(mockInitializeToken).toHaveBeenCalled();
    expect(mockInitializeToken).toHaveBeenCalledWith(token, callback);
  });
});
