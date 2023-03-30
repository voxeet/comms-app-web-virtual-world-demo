import { describe, it, expect, vi } from "vitest";
import watchEvents, {
  subscribe,
  externalListener,
  internalListener,
} from "./watchEvents";
import { call, all, race, take, cancelled } from "redux-saga/effects";
import { application } from "../../actions/index.js";

vi.mock("@voxeet/voxeet-web-sdk", () => ({
  default: {},
}));

describe("watch events test suite", () => {
  it("should watch events only once", () => {
    //arrange
    const mockClose = vi.fn();
    const channel = { close: mockClose };

    // act
    const generator = watchEvents();

    // assert
    expect(generator.next().value).toEqual(call(subscribe));
    expect(generator.next(channel).value).toEqual(
      race({
        task: all([call(externalListener, channel), call(internalListener)]),
        cancel: take(application.stop),
      })
    );
    expect(generator.return().value).toEqual(cancelled());
    expect(generator.next().done).toBeTruthy();
  });

  it("should do no op", () => {
    const generator = internalListener();
    expect(generator.next().done).toBeTruthy();
  });
});
