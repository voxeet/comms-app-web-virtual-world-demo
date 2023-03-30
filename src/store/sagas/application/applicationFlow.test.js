import { describe, expect, it } from "vitest";
import { takeEvery } from "redux-saga/effects";

import { application } from "../../actions/index.js";
import applicationFlow from "./applicationFlow.js";
import navigate from "./application.js";

describe("applicationFlow test suite", () => {
  it("should do the flow", () => {
    const generator = applicationFlow();
    expect(generator.next().value).toEqual(
      takeEvery(application.navigate, navigate)
    );

    expect(generator.next().done).toBeTruthy();
  });
});
