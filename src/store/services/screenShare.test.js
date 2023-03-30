import { describe, it, expect, vi } from "vitest";
import { startScreenShare, stopScreenShare } from "./screenShare";

const mockStartScreenShare = vi.fn();
const mockStopScreenShare = vi.fn();

vi.mock("@voxeet/voxeet-web-sdk", () => ({
  default: {
    get conference() {
      return {
        startScreenShare: mockStartScreenShare,
        stopScreenShare: mockStopScreenShare,
      };
    },
  },
}));

describe("screen share services test suite", () => {
  it("should return a resolved promise", async () => {
    // arrange
    mockStartScreenShare.mockResolvedValue({ response: {} });
    const option = { audio: true };

    // act
    const { response, error } = await startScreenShare(option);

    // assert
    expect(mockStartScreenShare).toHaveBeenCalled();
    expect(mockStartScreenShare).toHaveBeenCalledWith(option);
    expect(response).toMatchSnapshot();
    expect(error).toBe(undefined);
  });

  it("should return a resolved promise", async () => {
    // arrange
    mockStopScreenShare.mockResolvedValue(true);

    // act
    const { response, error } = await stopScreenShare();

    // assert
    expect(mockStopScreenShare).toHaveBeenCalled();
    expect(response).toMatchSnapshot();
    expect(error).toBe(undefined);
  });

  it("should return a resolved promise containing an error", async () => {
    // arrange
    mockStartScreenShare.mockRejectedValueOnce(new Error("error"));

    // act
    const { response, error } = await startScreenShare();

    // assert
    expect(mockStartScreenShare).toHaveBeenCalled();
    expect(response).toBe(undefined);
    expect(error.message).toBe("error");
  });

  it("should return a resolved promise containing an error", async () => {
    // arrange
    mockStopScreenShare.mockRejectedValueOnce(new Error("error"));

    // act
    const { response, error } = await stopScreenShare();

    // assert
    expect(mockStopScreenShare).toHaveBeenCalled();
    expect(error.message).toBe("error");
    expect(response).toBe(undefined);
  });
});
