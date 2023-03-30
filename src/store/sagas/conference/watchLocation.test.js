import { describe, expect, it } from "vitest";
import {
  externalListener,
  internalListener,
  setupPubNub,
  subscribe,
  watchLocations,
} from "./watchLocations.js";
import { select, call, all, take, race, cancelled } from "redux-saga/effects";

import {
  getCurrentConferenceID,
  getCurrentDeviceID,
} from "../../reducers/application/selectors.js";
import { application, conference } from "../../effects/index.js";

describe("watch locations test suite", () => {
  it("should do some stuff", () => {
    //arrange
    const publishKey = import.meta.env.VITE_PUBNUB_PUBLISHER_KEY;
    const subscribeKey = import.meta.env.VITE_PUBNUB_SUBSCRIBER_KEY;
    const currentConferenceID = "123";
    const currentDeviceID = "678";
    const pubnub = {};
    const channel = {};

    // act
    const generator = watchLocations();

    // assert
    expect(generator.next().value).toEqual(select(getCurrentConferenceID));
    expect(generator.next(currentConferenceID).value).toEqual(
      select(getCurrentDeviceID)
    );
    expect(generator.next(currentDeviceID).value).toEqual(
      call(setupPubNub, {
        publishKey,
        subscribeKey,
        userId: currentDeviceID,
      })
    );
    expect(generator.next(pubnub).value).toEqual(
      call(subscribe, pubnub, currentConferenceID)
    );
    expect(generator.next(channel).value).toEqual(
      race({
        task: all([
          call(externalListener, channel),
          call(internalListener, pubnub),
        ]),
        cancel: take([
          conference.ended,
          conference.left,
          application.leaveConference,
        ]),
      })
    );
    expect(generator.return().value).toEqual(cancelled());
    expect(generator.next().done).toBeTruthy();
  });
});
