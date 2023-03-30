import { describe, it, expect, vi } from "vitest";
import { openSession, closeSession } from "./session";

const mockClose = vi.fn();
const mockOpen = vi.fn();

vi.mock("@voxeet/voxeet-web-sdk", () => ({
  default: {
    get session() {
      return { close: mockClose, open: mockOpen };
    },
  },
}));

describe("session services test suite", () => {
  it("should succeed", async () => {
    // arrange
    mockOpen.mockResolvedValue({ response: {} });
    const payload = { name: "toto" };

    // act
    const { response, error } = await openSession(payload);

    // assert
    expect(mockOpen).toHaveBeenCalled();
    expect(mockOpen).toBeCalledWith(payload);
    expect(response).toMatchSnapshot();
    expect(error).toBe(undefined);
  });

  it("should succeed", async () => {
    // arrange
    mockClose.mockResolvedValue({ response: {} });

    // act
    const { result, error } = await closeSession();

    // assert
    expect(mockClose).toHaveBeenCalled();
    expect(mockClose).toHaveBeenCalled();
    expect(result).toMatchSnapshot();
    expect(error).toBe(undefined);
  });

  it("should fail and return an error", async () => {
    // arrange
    mockOpen.mockRejectedValueOnce(new Error("error"));
    const payload = { name: "toto" };

    // act
    const { response, error } = await openSession(payload);

    // assert
    expect(mockOpen).toHaveBeenCalled();
    expect(mockOpen).toBeCalledWith(payload);
    expect(error.message).toBe("error");
    expect(response).toBe(undefined);
  });

  it("should fail and return an error", async () => {
    // arrange
    mockClose.mockRejectedValueOnce(new Error("error"));

    // act
    const { response, error } = await closeSession();

    // assert
    expect(mockClose).toHaveBeenCalled();
    expect(mockClose).toHaveBeenCalled();
    expect(error.message).toBe("error");
    expect(response).toBe(undefined);
  });
});
