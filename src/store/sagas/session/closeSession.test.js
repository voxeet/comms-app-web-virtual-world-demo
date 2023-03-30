import { describe, expect, it, vi } from "vitest";
import closeSession from "./closeSession";

import { call } from "redux-saga/effects";
import { closeSession as close } from "../../services/session";
import { displayMessage } from "../conference/message.js";

vi.mock("@voxeet/voxeet-web-sdk", () => ({
  default: {},
}));

describe("closeSession test suite", () => {
  it("should close the session", () => {
    const action = {
      type: "",
      payload: {},
    };
    const generator = closeSession(action);
    expect(generator.next().value).toEqual(call(close));
    expect(generator.next({ response: {} }).done).toBeTruthy();
  });

  it("should fail to close the session", () => {
    const action = {
      type: "",
      payload: {},
    };

    const generator = closeSession(action);
    expect(generator.next().value).toEqual(call(close));
    expect(generator.next({ error: {} }).value).toEqual(
      call(displayMessage, {
        type: "error",
        message: "could not close session",
      })
    );
    expect(generator.next().done).toBeTruthy();
  });
});
