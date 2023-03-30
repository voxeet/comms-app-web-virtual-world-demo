import { describe, it, expect, vi } from "vitest";
import { setDirection, setEnvironment, setPosition } from "./spatial";

const participantId = "123";
const participant = { name: "toto" };

const mockSetSpatialEnvironment = vi.fn();
const mockSetSpatialPosition = vi.fn();
const mockSetSpatialDirection = vi.fn();

vi.mock("@voxeet/voxeet-web-sdk", () => ({
  default: {
    get conference() {
      return {
        setSpatialEnvironment: mockSetSpatialEnvironment,
        setSpatialPosition: mockSetSpatialPosition,
        setSpatialDirection: mockSetSpatialDirection,
        get participants() {
          const participants = new Map();
          participants.set(participantId, participant);

          return participants;
        },
      };
    },
  },
}));

describe("spatial services test suite", () => {
  it("setEnvironment should succeed", () => {
    // arrange
    const payload = {
      scale: { x: 1, y: 1, z: 1 },
      forward: { x: 1, y: 2, z: 3 },
      up: { x: 4, y: 5, z: 6 },
      right: { x: 1, y: 2, z: 3 },
    };

    mockSetSpatialEnvironment.mockImplementation(() => {});

    // act
    setEnvironment(payload);

    // assert
    expect(mockSetSpatialEnvironment).toHaveBeenCalledWith(
      payload.scale,
      payload.forward,
      payload.up,
      payload.right
    );
    expect(mockSetSpatialEnvironment).toHaveBeenCalled();
  });

  it("should succeed", () => {
    // arrange
    const position = { x: 1, y: 2, z: 3 };
    mockSetSpatialPosition.mockImplementation(() => {});

    // act
    setPosition(participantId, position);

    // assert
    expect(mockSetSpatialPosition).toHaveBeenCalledWith(participant, position);
    expect(mockSetSpatialPosition).toHaveBeenCalled();
  });

  it("should succeed", () => {
    // arrange
    const direction = { x: 1, y: 2, z: 3 };
    mockSetSpatialDirection.mockImplementation(() => {});

    // act
    setDirection(participantId, direction);

    // assert
    expect(mockSetSpatialDirection).toHaveBeenCalledWith(
      participant,
      direction
    );
    expect(mockSetSpatialDirection).toHaveBeenCalled();
  });
});
