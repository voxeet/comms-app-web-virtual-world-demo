import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  startRemoteAudio,
  stopRemoteAudio,
  stopLocalAudio,
  startLocalAudio,
} from "./audio";

const mockStartRemote = vi.fn();
const mockStopRemote = vi.fn();
const mockStartLocal = vi.fn();
const mockStopLocal = vi.fn();

vi.mock("@voxeet/voxeet-web-sdk", () => ({
  default: {
    get audio() {
      return {
        get remote() {
          return {
            start: mockStartRemote,
            stop: mockStopRemote,
          };
        },
        get local() {
          return {
            start: mockStartLocal,
            stop: mockStopLocal,
          };
        },
      };
    },
  },
}));

describe("audio service test suite", () => {
  beforeEach(() => {});
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should return a resolved promise while starting remote audio", async () => {
    // arrange
    const participant = {};
    mockStartRemote.mockResolvedValue({ response: {} });

    // act
    const { response, error } = await startRemoteAudio(participant);

    // assert
    expect(response).toMatchSnapshot();
    expect(error).toBe(undefined);
    expect(mockStartRemote).toHaveBeenCalledTimes(1);
    expect(mockStartRemote).toHaveBeenCalledWith(participant);
  });

  it("should reject a promise while starting remote audio", async () => {
    // 1- arrange
    mockStartRemote.mockRejectedValueOnce(new Error("error"));

    const participant = {};

    // 2- act / assert
    const { error } = await startRemoteAudio(participant);

    expect(error.message).toBe("error");
    expect(mockStartRemote).toHaveBeenCalledTimes(1);
    expect(mockStartRemote).toHaveBeenCalledWith(participant);
  });

  it("should return a resolved promise while stopping remote audio", async () => {
    // arrange
    mockStopRemote.mockResolvedValue({ response: {} });

    const participant = {};

    // act
    const { response, error } = await stopRemoteAudio(participant);

    // assert
    expect(error).toBe(undefined);
    expect(response).toMatchSnapshot();
    expect(mockStopRemote).toHaveBeenCalledTimes(1);
    expect(mockStopRemote).toHaveBeenCalledWith(participant);
  });

  it("should reject a promise while stopping remote audio", async () => {
    //  arrange
    mockStopRemote.mockRejectedValueOnce(new Error("error"));

    const participant = {};
    mockStartLocal.mockResolvedValue({ response: {} });

    // act
    const { response, error } = await startLocalAudio(participant);

    // assert
    expect(response).toMatchSnapshot();
    expect(error).toBe(undefined);
    expect(mockStartLocal).toHaveBeenCalledTimes(1);
  });

  it("should reject a promise while starting local audio", async () => {
    // 1- arrange
    mockStartLocal.mockRejectedValueOnce(new Error("error"));

    // 2- act / assert
    const { error } = await startLocalAudio();

    expect(error.message).toBe("error");
    expect(mockStartLocal).toHaveBeenCalledTimes(1);
  });

  it("should return a resolved promise while stopping local audio", async () => {
    // arrange
    mockStopRemote.mockResolvedValue({ response: {} });

    // act
    const { response, error } = await stopRemoteAudio();

    // assert
    expect(error).toBe(undefined);
    expect(response).toMatchSnapshot();
    expect(mockStopRemote).toHaveBeenCalledTimes(1);
  });

  it("should return a resolved promise while starting local audio", async () => {
    // arrange
    const participant = {};
    mockStartLocal.mockResolvedValue({ response: {} });

    // act
    const { response, error } = await startLocalAudio(participant);

    // assert
    expect(response).toMatchSnapshot();
    expect(error).toBe(undefined);
    expect(mockStartLocal).toHaveBeenCalledTimes(1);
  });

  it("should reject a promise while stopping local audio", async () => {
    //  arrange
    mockStopLocal.mockRejectedValueOnce(new Error("error"));

    // act
    const { response, error } = await stopLocalAudio();

    // assert
    expect(error.message).toBe("error");
    expect(response).toBe(undefined);
    expect(mockStopLocal).toHaveBeenCalledTimes(1);
  });
});
