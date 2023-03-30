import {
  getConference,
  recordConference,
  stopRecordingConference,
} from "./record";
import { startRecording, stopRecording } from "../../services/record";
import { call, put, select } from "redux-saga/effects";
import { getCurrentConferenceID } from "../../reducers/application/selectors";
import { updateConference } from "../../effects/conference";
import { vi, expect, describe, it } from "vitest";
import { displayMessage } from "./message.js";

vi.mock("@voxeet/voxeet-web-sdk", () => ({
  default: {},
}));

describe("record test suite", () => {
  it("should return a conference", () => {
    const state = {
      entities: {
        conferences: {
          1: {
            alias: "test",
          },
        },
      },
    };
    const id = "1";

    const conference = getConference(state, id);

    expect(conference).toMatchSnapshot();
  });

  it("should stop recording the conference", () => {
    const currentConferenceID = "1";
    const conference = { id: currentConferenceID };
    const generator = stopRecordingConference();
    expect(generator.next().value).toEqual(call(stopRecording));
    expect(generator.next({ response: {} }).value).toEqual(
      select(getCurrentConferenceID)
    );
    expect(generator.next(currentConferenceID).value).toEqual(
      select(getConference, currentConferenceID)
    );
    expect(generator.next(conference).value).toEqual(
      put(
        updateConference({
          id: conference.id,
          entityType: "conferences",
          data: { recording: false },
        })
      )
    );
    expect(generator.next().done).toBeTruthy();
  });

  it("should start recording the conference", () => {
    // arrange
    const currentConferenceID = "1";
    const conference = { id: currentConferenceID };

    // act
    const generator = recordConference();

    // assert
    expect(generator.next().value).toEqual(call(startRecording));
    expect(generator.next({ response: {} }).value).toEqual(
      select(getCurrentConferenceID)
    );
    expect(generator.next(currentConferenceID).value).toEqual(
      select(getConference, currentConferenceID)
    );
    expect(generator.next(conference).value).toEqual(
      put(
        updateConference({
          id: conference.id,
          entityType: "conferences",
          data: { recording: true },
        })
      )
    );
    expect(generator.next().done).toBeTruthy();
  });

  it("should fail to record a conference and dispatch an action to the store", () => {
    // arrange
    const generator = recordConference();

    // act
    expect(generator.next().value).toEqual(call(startRecording));
    expect(generator.next({ error: {} }).value).toEqual(
      call(displayMessage, {
        type: "error",
        message: "could not start recording event",
      })
    );
    expect(generator.next().done).toBeTruthy();
  });

  it("should fail to stop recording a conference and dispatch an action to the store", () => {
    // arrange
    const generator = stopRecordingConference();

    // act
    expect(generator.next().value).toEqual(call(stopRecording));
    expect(generator.next({ error: {} }).value).toEqual(
      call(displayMessage, {
        type: "error",
        message: "could not stop recording event",
      })
    );
    expect(generator.next().done).toBeTruthy();
  });
});
