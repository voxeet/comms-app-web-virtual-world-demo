import { describe, it, expect, vi } from "vitest";
import { startRecording, stopRecording } from "./record";

const mockStart = vi.fn();
const mockStop = vi.fn();

vi.mock("@voxeet/voxeet-web-sdk", () => ({
  default: {
    get recording() {
      return { start: mockStart, stop: mockStop };
    },
  },
}));

describe("record services test suite", () => {
  it("should succeed", async () => {
    // arrange
    mockStart.mockResolvedValue({ response: {} });

    // act
    const { response, error } = await startRecording();

    // assert
    expect(mockStart).toHaveBeenCalled();
    expect(response).toMatchSnapshot();
    expect(error).toBe(undefined);
  });

  it("should succeed", async () => {
    // arrange
    mockStop.mockResolvedValue({ response: {} });

    // act
    const { response, error } = await stopRecording();

    // assert
    expect(mockStop).toHaveBeenCalled();
    expect(response).toMatchSnapshot();
    expect(error).toBe(undefined);
  });

  it("should fail and return  an error", async () => {
    // arrange
    mockStart.mockRejectedValueOnce(new Error("error"));

    //  act
    const { response, error } = await startRecording();

    // assert
    expect(mockStart).toHaveBeenCalled();
    expect(response).toBe(undefined);
    expect(error.message).toBe("error");
  });

  it("should fail and return an error", async () => {
    // arrange
    mockStop.mockRejectedValueOnce(new Error("error"));

    // act
    const { response, error } = await stopRecording();

    // assert
    expect(mockStop).toHaveBeenCalled();
    expect(response).toBe(undefined);
    expect(error.message).toBe("error");
  });
});
