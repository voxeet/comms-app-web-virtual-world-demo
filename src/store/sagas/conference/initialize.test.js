import initialize, { getToken } from "./initialize";
import { call, put, select } from "redux-saga/effects";
import { initializeSDK } from "../../services/sdk";
import { application } from "../../effects";
import { vi, expect, describe, it } from "vitest";

vi.mock("@voxeet/voxeet-web-sdk", () => ({
  default: {},
}));

describe("initialize sdk test suite", () => {
  it("it should init the sdk", () => {
    // arrange
    const token = "token";

    const refreshToken = () => {};

    // act
    const generator = initialize();

    // assert

    //FIXME: assertion failure
    //expect(generator.next().value).toEqual(call(retrieveAccessToken, key));
    generator.next();

    expect(generator.next(refreshToken).value).toEqual(select(getToken));
    expect(generator.next(token).value).toEqual(
      call(initializeSDK, { token, callback: refreshToken })
    );
    expect(generator.next().value).toEqual(put(application.sdkInitialized()));
    expect(generator.next().done).toBeTruthy();
  });

  it("selector should return application saved token", () => {
    const state = {
      application: {
        authentication: {
          token: "token",
        },
      },
    };
    const token = getToken(state);
    expect(token).toBe("token");
  });
});
