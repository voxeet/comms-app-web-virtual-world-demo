import { describe, expect, it } from "vitest";

import reducer from "./entities";

describe("entities test suite", () => {
  it("dispatch leave conference action, reducer should return initial state", () => {
    // 1- arrange
    const action = { type: "LEAVE_CONFERENCE" };
    const state = {};

    // 2- act
    const updatedState = reducer(state, action);

    // 3- assert
    expect(updatedState).toMatchSnapshot();
  });

  it("dispatch add participant action, reducer should add one participant entity", () => {
    // 1- arrange
    const action = {
      type: "ADD_PARTICIPANT",
      payload: {
        entityType: "participants",
        data: { participantId: { name: "toto" } },
      },
    };
    const state = {};

    // 2- act
    const updatedState = reducer(state, action);

    // 3- assert
    expect(updatedState).toMatchSnapshot();
  });

  it("dispatch update participant action, reducer should add one participant entity", () => {
    // 1- arrange
    const action = {
      type: "UPDATE_PARTICIPANT",
      payload: {
        entityType: "participants",
        id: "participantId",
        data: { surname: "titi" },
      },
    };

    const state = {
      participants: {
        participantId: {
          name: "toto",
        },
      },
    };

    // 2- act
    const updatedState = reducer(state, action);

    // 3- assert
    expect(updatedState).toMatchSnapshot();
  });

  it("dispatch remove participant action, reducer should remove one participant entity", () => {
    // 1- arrange
    const action = {
      type: "REMOVE_PARTICIPANT",
      payload: {
        entityType: "participants",
        id: "participantId",
      },
    };

    const state = {
      participants: {
        participantId: {
          name: "toto",
        },
      },
    };

    // 2- act
    const updatedState = reducer(state, action);

    // 3- assert
    expect(updatedState).toMatchSnapshot();
  });
});
