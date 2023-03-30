import {
  setParticipantDirection,
  setParticipantLocation,
  setParticipantPosition,
  setSpatialEnvironment,
} from "./spatial";
import {
  setDirection,
  setEnvironment,
  setPosition,
} from "../../services/spatial";
import { call, select, put } from "redux-saga/effects";
import { vi, describe, it, expect } from "vitest";
import { getLocalParticipantID } from "../../reducers/application/selectors.js";
import { getParticipant } from "./audio.js";
import { updateParticipant } from "../../effects/conference.js";

vi.mock("@voxeet/voxeet-web-sdk", () => ({
  default: {},
}));

describe("spatial test suite", () => {
  it("should set environment", () => {
    const payload = {};
    const generator = setSpatialEnvironment({ payload });
    expect(generator.next().value).toEqual(call(setEnvironment, payload));
    expect(generator.next().done).toBeTruthy();
  });

  it("should set participant position", () => {
    const payload = { participantId: "1", position: { x: 0, y: 0, z: 0 } };
    const generator = setParticipantPosition({ payload });

    expect(generator.next().value).toEqual(
      call(setPosition, payload.participantId, payload.position)
    );
    expect(generator.next().done).toBeTruthy();
  });

  it("should set participant direction", () => {
    const payload = { participantId: "1", direction: { x: 0, y: 0, z: 0 } };
    const generator = setParticipantDirection({ payload });

    expect(generator.next().value).toEqual(
      call(setDirection, payload.participantId, payload.direction)
    );
    expect(generator.next().done).toBeTruthy();
  });

  it("should set participant location", () => {
    const action = {
      type: "",
      payload: {
        participantId: "123",
        position: {
          x: 0,
          y: 0,
          z: 0,
        },
        direction: { x: 0, y: 0, z: 0 },
      },
    };

    const participantID = "123";
    const currentPosition = { x: 1, y: 2, z: 3 };
    const position = {
      x: action.payload.position[0],
      y: action.payload.position[1],
      z: action.payload.position[2],
    };

    const direction = {
      x: action.payload.direction[0],
      y: action.payload.direction[1],
      z: action.payload.direction[2],
    };

    const generator = setParticipantLocation(action);
    expect(generator.next().value).toEqual(select(getLocalParticipantID));
    expect(generator.next(participantID).value).toEqual(
      select(getParticipant, participantID)
    );
    expect(generator.next(currentPosition).value).toEqual(
      put(
        updateParticipant({
          id: action.payload.participantId,
          entityType: "participants",
          data: {
            location: {
              position: action.payload.position,
              direction: action.payload.direction,
            },
          },
        })
      )
    );
    expect(generator.next(position).value).toEqual(
      call(setPosition, action.payload.participantId, position)
    );
    expect(generator.next(direction).value).toEqual(
      call(setDirection, action.payload.participantId, direction)
    );
    expect(generator.next().done).toBeTruthy();
  });
});
