import { stopVideo, startVideo, getParticipant } from "./video";
import { call, select } from "redux-saga/effects";
import { startVideo as start, stopVideo as stop } from "../../services/video";
import { vi, describe, it, expect } from "vitest";
import { displayMessage } from "./message.js";

vi.mock("@voxeet/voxeet-web-sdk", () => ({
  default: {},
}));

describe("video saga test suite", () => {
  it("should return a participant", () => {
    const state = {
      entities: {
        participants: {
          1: {
            name: "toto",
          },
        },
      },
    };

    const id = "1";

    const participant = getParticipant(state, id);

    expect(participant).toMatchSnapshot();
  });

  it("should not call start audio service", () => {
    const action = { type: "START_VIDEO", payload: "123" };
    const generator = startVideo(action);

    expect(generator.next().value).toEqual(
      select(getParticipant, action.payload)
    );

    expect(generator.next().done).toBeTruthy();
  });

  it("should call start audio service", () => {
    const action = { type: "START_VIDEO", payload: "123" };
    const generator = startVideo(action);

    expect(generator.next().value).toEqual(
      select(getParticipant, action.payload)
    );

    const participant = {};

    expect(generator.next(participant).value).toEqual(call(start, participant));
    expect(generator.next({ error: undefined }).done).toBeTruthy();
  });

  it("should call start audio service but fail and dispatch an action", () => {
    const action = { type: "START_VIDEO", payload: "123" };
    const generator = startVideo(action);

    expect(generator.next().value).toEqual(
      select(getParticipant, action.payload)
    );

    const participant = {};

    expect(generator.next(participant).value).toEqual(call(start, participant));
    expect(generator.next({ error: {} }).value).toEqual(
      call(displayMessage, {
        type: "error",
        message: "could not start video",
      })
    );
    expect(generator.next().done).toBeTruthy();
  });

  it("should not call stop video service", () => {
    const action = { type: "STOP_VIDEO", payload: "123" };
    const generator = stopVideo(action);

    expect(generator.next().value).toEqual(
      select(getParticipant, action.payload)
    );

    expect(generator.next().done).toBeTruthy();
  });

  it("should call stop video service", () => {
    const action = { type: "START_AUDIO", payload: "123" };
    const generator = stopVideo(action);

    expect(generator.next().value).toEqual(
      select(getParticipant, action.payload)
    );

    const participant = {};

    expect(generator.next(participant).value).toEqual(call(stop, participant));
    expect(generator.next({ error: undefined }).done).toBeTruthy();
  });

  it("should call stop video service but fail and dispatch an action to store", () => {
    const action = { type: "START_AUDIO", payload: "123" };
    const generator = stopVideo(action);

    expect(generator.next().value).toEqual(
      select(getParticipant, action.payload)
    );

    const participant = {};

    expect(generator.next(participant).value).toEqual(call(stop, participant));
    expect(generator.next({ error: {} }).value).toEqual(
      call(displayMessage, {
        type: "error",
        message: "could not stop video",
      })
    );
    expect(generator.next().done).toBeTruthy();
  });
});
