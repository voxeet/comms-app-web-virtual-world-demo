import { startScreenShare, stopScreenShare } from "./screenShare";
import {
  startScreenShare as start,
  stopScreenShare as stop,
} from "../../services/screenShare";
import { call } from "redux-saga/effects";
import { displayMessage } from "./message";
import { vi, describe, it, expect } from "vitest";

vi.mock("@voxeet/voxeet-web-sdk", () => ({
  default: {},
}));

describe("screen share test suite", () => {
  it("it should call start screen share service", () => {
    //1- arrange
    const option = { audio: true };

    //2- act / assert
    const generator = startScreenShare();
    expect(generator.next().value).toEqual(call(start, option));
    expect(generator.next({ result: {} }).done).toBeTruthy();
  });

  it("start screen share should failed and dispatch a message to the store", () => {
    //1- arrange
    const option = { audio: true };

    //2- act / assert
    const generator = startScreenShare();
    expect(generator.next().value).toEqual(call(start, option));
    expect(generator.next({ error: {} }).value).toEqual(
      call(displayMessage, {
        type: "error",
        message: "could not start screen sharing",
      })
    );
    expect(generator.next().done).toBeTruthy();
  });

  it("it should call stop screen share service", () => {
    //1- act / assert
    const generator = stopScreenShare();
    expect(generator.next().value).toEqual(call(stop));
    expect(generator.next({ result: {} }).done).toBeTruthy();
  });

  it("stop screen sharing should failed and dispatch an action to the store", () => {
    //1- act / assert
    const generator = stopScreenShare();
    expect(generator.next().value).toEqual(call(stop));
    expect(generator.next({ error: {} }).value).toEqual(
      call(displayMessage, {
        type: "error",
        message: "could not stop screen sharing",
      })
    );
    expect(generator.next().done).toBeTruthy();
  });
});
