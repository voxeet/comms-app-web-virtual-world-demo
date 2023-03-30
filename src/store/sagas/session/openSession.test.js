import { describe, expect, it, vi } from "vitest";
import openSession from "./openSession";
import { call, put } from "redux-saga/effects";
import { openSession as open } from "../../services/session";
import { session } from "../../effects";
import { push } from "redux-first-history";
import { displayMessage } from "../conference/message";
import { createId } from "@paralleldrive/cuid2";

vi.mock("@voxeet/voxeet-web-sdk", () => ({
  default: {},
}));

describe("openSession test suite without any issue", () => {
  it("should open a session", () => {
    const action = {
      type: "",
      payload: {},
    };
    const id = "123";
    const generator = openSession(action);
    expect(generator.next().value).toEqual(call(open, action.payload));

    expect(generator.next({ error: undefined }).value).toEqual(call(createId));
    expect(generator.next(id).value).toEqual(put(session.opened({ id })));
    expect(generator.next().value).toEqual(put(push("/conference")));
    expect(generator.next().done).toBeTruthy();
  });

  it("openSession should failed and should not dispatch action to store", () => {
    const action = {
      type: "",
      payload: {},
    };

    const generator = openSession(action);
    expect(generator.next().value).toEqual(call(open, action.payload));

    expect(generator.next({ error: {} }).value).toEqual(
      call(displayMessage, {
        type: "error",
        message: "could not open a session",
      })
    );
    expect(generator.next().done).toBeTruthy();
  });
});
