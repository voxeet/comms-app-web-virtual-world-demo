import flow from "./sessionFlow";
import { takeEvery } from "redux-saga/effects";
import { session } from "../../actions";
import openSession from "./openSession";
import closeSession from "./closeSession";
import { vi, describe, it, expect } from "vitest";

vi.mock("@voxeet/voxeet-web-sdk", () => ({
  default: {},
}));

describe("sessionFlow test suite", () => {
  it("should do the flow", () => {
    const generator = flow();
    expect(generator.next().value).toEqual(
      takeEvery(session.open, openSession)
    );
    expect(generator.next().value).toEqual(
      takeEvery(session.close, closeSession)
    );
    expect(generator.next().done).toBeTruthy();
  });
});
