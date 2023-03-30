import { describe, it, expect } from "vitest";
import { getCurrentConferenceID, getLocalParticipantID } from "./selectors";

describe("selectors test suite", () => {
  it("getLocalParticipantID should return an ID", () => {
    // arrange
    const id = "123";

    const state = {
      application: {
        "@@/data": {
          localParticipantID: id,
        },
      },
    };

    // act
    const participantID = getLocalParticipantID(state);

    // assert
    expect(participantID).toBe("123");
  });

  it("getCurrentConferenceID should return the current conference id", () => {
    // arrange
    const id = "123";

    const state = {
      application: {
        "@@/data": {
          currentConferenceID: id,
        },
      },
    };

    // act
    const conferenceID = getCurrentConferenceID(state);

    // assert
    expect(conferenceID).toBe("123");
  });
});
