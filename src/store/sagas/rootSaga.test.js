import rootSaga from "./rootSaga";
import { all } from "redux-saga/effects";
import authenticationFlow from "./authentication/authenticationFlow";
import sessionFlow from "./session/sessionFlow";
import conferenceFlow from "./conference/conferenceFlow";
import eventFlow from "./event/eventFlow";
import { vi, describe, it, expect } from "vitest";
import applicationFlow from "./application/applicationFlow";

vi.mock("@voxeet/voxeet-web-sdk", () => ({
  default: {},
}));

describe("rootSaga test suite", () => {
  it("should do some stuff", () => {
    const generator = rootSaga();
    expect(generator.next().value).toEqual(
      all([
        applicationFlow(),
        authenticationFlow(),
        sessionFlow(),
        conferenceFlow(),
        eventFlow(),
      ])
    );
    expect(generator.next().done).toBeTruthy();
  });
});
