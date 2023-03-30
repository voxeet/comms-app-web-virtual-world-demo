import { describe, it, expect, vi } from "vitest";
import { startVideo, stopVideo } from "./video";

const mockStartVideo = vi.fn();
const mockStopVideo = vi.fn();

vi.mock("@voxeet/voxeet-web-sdk", () => ({
  default: {
    get conference() {
      return { startVideo: mockStartVideo, stopVideo: mockStopVideo };
    },
  },
}));

describe("video services test suite", () => {
  it(" should succeed", async () => {
    // arrange
    const participant = { name: "toto" };
    const constraints = { audio: true, video: true };
    mockStartVideo.mockResolvedValue({ response: {} });

    // act
    const { response, error } = await startVideo(participant, constraints);

    // assert
    expect(mockStartVideo).toHaveBeenCalled();
    expect(mockStartVideo).toHaveBeenCalledWith(participant, constraints);
    expect(response).toMatchSnapshot();
    expect(error).toBe(undefined);
  });

  it("should fail and return an error", async () => {
    // arrange
    const participant = { name: "toto" };
    const constraints = { video: true, audio: true };
    mockStartVideo.mockRejectedValueOnce(new Error("error"));

    // act
    const { error, response } = await startVideo(participant, constraints);

    // assert
    expect(error.message).toEqual("error");
    expect(response).toBe(undefined);
    expect(mockStartVideo).toHaveBeenCalled();
    expect(mockStartVideo).toHaveBeenCalledWith(participant, constraints);
  });

  it("should succeed", async () => {
    // arrange
    const participant = { name: "toto" };
    mockStopVideo.mockResolvedValue({ response: {} });

    // act
    const { response, error } = await stopVideo(participant);

    // assert
    expect(mockStopVideo).toHaveBeenCalled();
    expect(mockStopVideo).toHaveBeenCalledWith(participant);
    expect(response).toMatchSnapshot();
    expect(error).toBe(undefined);
  });

  it("should fail and return an error", async () => {
    // arrange
    const participant = { name: "toto" };
    mockStopVideo.mockRejectedValueOnce(new Error("error"));

    // act
    const { error, response } = await stopVideo(participant);

    // assert
    expect(error).not.toBe(null);
    expect(error.message).toEqual("error");
    expect(error).toMatchSnapshot();
    expect(response).toBe(undefined);
    expect(mockStopVideo).toHaveBeenCalled();
    expect(mockStopVideo).toHaveBeenCalledWith(participant);
  });
});
