import { describe, it, expect, vi } from "vitest";
import { displayMessage } from "./message.js";
import { addMessage } from "../../effects/message.js";
import { put, call } from "redux-saga/effects";
import { createId } from "@paralleldrive/cuid2";
import { application } from "../../effects/index.js";

vi.mock("@voxeet/voxeet-web-sdk", () => ({
  default: {},
}));

describe("message saga test suite", () => {
  it("", () => {
    const type = "error";
    const message = "oops";

    const generator = displayMessage({ type, message });

    const id = "123";

    expect(generator.next().value).toEqual(call(createId));
    expect(generator.next(id).value).toEqual(
      put(
        addMessage({
          entityType: "messages",
          data: {
            [id]: {
              type,
              message,
            },
          },
        })
      )
    );
    expect(generator.next().value).toEqual(
      put(application.addMessageID({ id }))
    );

    expect(generator.next().done).toBeTruthy();
  });
});
