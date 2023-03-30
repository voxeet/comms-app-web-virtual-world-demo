import flow from "./eventFlow";
import { takeLatest } from "redux-saga/effects";
import { application } from "../../effects";
import watchEvent from "./watchEvents";
import { vi, describe, it, expect } from "vitest";

vi.mock("@voxeet/voxeet-web-sdk", () => ({
  default: {},
}));
describe("eventFlow test suite", () => {
  it("should do the flow", () => {
    const generator = flow();
    expect(generator.next().value).toEqual(
      takeLatest(application.sdkInitialized, watchEvent)
    );
    expect(generator.next().done).toBeTruthy();
  });
});
