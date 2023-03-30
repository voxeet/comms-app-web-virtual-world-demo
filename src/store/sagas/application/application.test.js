import { describe, expect, it } from "vitest";
import navigate from "./application";
import { push } from "redux-first-history";
import { put, delay } from "redux-saga/effects";

describe("application test suite", () => {
  it("should dispatch a navigation action", () => {
    // arrange
    const action = {
      payload: {
        to: "/destination",
      },
    };

    // act
    const generator = navigate(action);

    // assert
    expect(generator.next().value).toEqual(delay(200));
    expect(generator.next().value).toEqual(put(push(action.payload.to)));
    expect(generator.next().done).toBeTruthy();
  });
});
