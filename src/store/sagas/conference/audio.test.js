import { getParticipant, startAudio, stopAudio } from "./audio";
import { call } from "redux-saga/effects";
import {
  startLocalAudio as start,
  stopLocalAudio as stop,
} from "../../services/audio";
import { vi, describe, expect, it } from "vitest";
import { displayMessage } from "./message.js";

vi.mock("@voxeet/voxeet-web-sdk", () => ({
  default: {},
}));

describe("audio saga test suite", () => {
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

  it("it should not call start audio service", () => {
    const action = { type: "START_AUDIO", payload: "123" };
    const generator = startAudio(action);

    expect(generator.next().value).toEqual(call(start));
    expect(generator.next({ error: undefined }).done).toBeTruthy();
  });

  it("should call start audio service", () => {
    const action = { type: "START_AUDIO", payload: "123" };
    const generator = startAudio(action);

    expect(generator.next().value).toEqual(call(start));
    expect(generator.next({ error: undefined }).done).toBeTruthy();
  });

  it("should call start audio service, fail and dispatch an action to the store ", () => {
    const action = { type: "START_AUDIO", payload: "123" };
    const generator = startAudio(action);

    expect(generator.next().value).toEqual(call(start));
    expect(generator.next({ error: { undefined } }).value).toEqual(
      call(displayMessage, {
        type: "error",
        message: "could not start audio",
      })
    );
    expect(generator.next().done).toBeTruthy();
  });

  it("should call stop audio service", () => {
    const action = { type: "START_AUDIO", payload: "123" };
    const generator = stopAudio(action);

    expect(generator.next().value).toEqual(call(stop));
    expect(generator.next({ error: undefined }).done).toBeTruthy();
  });

  it("should call stop audio service fail and dispatch an action to the store", () => {
    const action = { type: "START_AUDIO", payload: "123" };
    const generator = stopAudio(action);

    expect(generator.next().value).toEqual(call(stop));
    expect(generator.next({ error: {} }).value).toEqual(
      call(displayMessage, {
        type: "error",
        message: "could not stop audio",
      })
    );
    expect(generator.next().done).toBeTruthy();
  });
});
