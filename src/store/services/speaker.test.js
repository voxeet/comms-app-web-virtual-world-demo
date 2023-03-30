import { describe, it, expect, vi } from "vitest";
import { audioLevel, isSpeaking } from "./speaker";

const mockIsSpeaking = vi.fn();
const mockAudioLevel = vi.fn();

vi.mock("@voxeet/voxeet-web-sdk", () => ({
  default: {
    get conference() {
      return { isSpeaking: mockIsSpeaking, audioLevel: mockAudioLevel };
    },
  },
}));

describe("speaker services test suite", () => {
  it("should succeed", async () => {
    // 1- arrange
    const participant = { name: "toto" };
    const callback = () => {};

    // act
    const result = await isSpeaking(participant, callback);

    // assert
    expect(mockIsSpeaking).toHaveBeenCalled();
    expect(mockIsSpeaking).toHaveBeenCalledWith(participant, callback);
    expect(result).toBe(undefined);
  });

  it("should fail and return an error", async () => {
    // arrange
    const participant = { name: "toto" };
    const callback = () => {};
    mockIsSpeaking.mockImplementation(() => {
      throw new Error("error");
    });

    // act
    const { error } = await isSpeaking(participant, callback);

    // assert
    expect(error).not.toBe(null);
    expect(error).toMatchSnapshot();
    expect(mockIsSpeaking).toHaveBeenCalled();
    expect(mockIsSpeaking).toHaveBeenCalledWith(participant, callback);
  });

  it("should succeed", async () => {
    // arrange
    const participant = { name: "toto" };
    const callback = () => {};

    // act
    const result = await audioLevel(participant, callback);

    // assert
    expect(mockAudioLevel).toHaveBeenCalled();
    expect(mockAudioLevel).toHaveBeenCalledWith(participant, callback);
    expect(result).toBe(undefined);
  });

  it("should fail and return an error", async () => {
    // arrange
    const participant = { name: "toto" };
    const callback = () => {};
    mockAudioLevel.mockImplementation(() => {
      throw new Error("error");
    });

    // act
    const { error } = await audioLevel(participant, callback);

    // assert
    expect(error).not.toBe(null);
    expect(error).toMatchSnapshot();
    expect(mockAudioLevel).toHaveBeenCalled();
    expect(mockAudioLevel).toHaveBeenCalledWith(participant, callback);
  });
});
