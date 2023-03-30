import { expect, it, describe } from "vitest";
import reducer from "./data";

describe("data reducer test suite", () => {
  it("should update the state - curren session id", () => {
    // arrange
    const action = {
      type: "OPENED",
      payload: {
        id: "sessionID",
      },
    };

    const state = {};

    // act
    const updatedState = reducer(state, action);

    // assert
    expect(updatedState).toMatchSnapshot();
  });

  it("should update the state - current participant id", () => {
    // arrange
    const action = {
      type: "SET_LOCAL_PARTICIPANT_ID",
      payload: {
        id: "participantId",
      },
    };

    const state = {};

    // act
    const updatedState = reducer(state, action);

    // assert
    expect(updatedState).toMatchSnapshot();
  });

  it("should update the state - current conference id", () => {
    // arrange
    const action = {
      type: "SET_CURRENT_CONFERENCE_ID",
      payload: {
        id: "conferenceId",
      },
    };

    const state = {};

    // act
    const updatedState = reducer(state, action);

    // assert
    expect(updatedState).toMatchSnapshot();
  });

  it("should update the state - current device id", () => {
    // arrange
    const action = {
      type: "SET_CURRENT_DEVICE_ID",
      payload: {
        id: "deviceId",
      },
    };

    const state = {};

    // act
    const updatedState = reducer(state, action);

    // assert
    expect(updatedState).toMatchSnapshot();
  });

  it("should update the state - message id", () => {
    // arrange
    const action = {
      type: "ADD_MESSAGE_ID",
      payload: {
        id: "messageId",
      },
    };

    const state = {};

    // act
    const updatedState = reducer(state, action);

    // assert
    expect(updatedState).toMatchSnapshot();
  });

  it("should update the state - remove message id", () => {
    // arrange
    const action = {
      type: "REMOVE_MESSAGE_ID",
      payload: {
        id: "4",
      },
    };

    const state = { messages: ["1", "2", "3", "4"] };

    // act
    const updatedState = reducer(state, action);

    // assert
    expect(updatedState).toMatchSnapshot();
  });

  it("should update the state - clean state", () => {
    // arrange
    const action = {
      type: "LEAVE_CONFERENCE",
      payload: {
        id: "conferenceId",
      },
    };

    const state = {
      currentDeviceID: "123",
      messages: ["1"],
      currentConferenceID: "768",
      currentSessionID: "785",
    };

    // act
    const updatedState = reducer(state, action);

    // assert
    expect(updatedState).toMatchSnapshot();
  });
});
