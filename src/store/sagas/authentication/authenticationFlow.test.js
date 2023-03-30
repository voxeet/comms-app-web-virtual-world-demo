import { describe, expect, it } from "vitest";
import authenticationFlow from "./authenticationFlow";
import { call, take, takeEvery } from "redux-saga/effects";
import { application, session } from "../../actions";
import authenticate from "./authenticate";
import logout from "./logout";

describe("authenticationFlow test suite", () => {
  it("should do the flow", () => {
    const generator = authenticationFlow();
    expect(generator.next().value).toEqual(take(application.ready));

    expect(generator.next().value).toEqual(call(authenticate));

    expect(generator.next().value).toEqual(takeEvery(session.close, logout));

    expect(generator.next().done).toBeTruthy();
  });
});
