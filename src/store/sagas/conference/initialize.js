import { select, put, call } from "redux-saga/effects";

import { application } from "../../effects";
import { initializeSDK } from "../../services/sdk";
import { retrieveAccessToken } from "../../services/authentication";

export const getToken = (state) => state.application.authentication.token;

export default function* initialize() {
  const clientAccessToken = import.meta.env.VITE_CLIENT_ACCESS_TOKEN;

  // use access token stored in env file. Note: refresh token won't do anything here
  if (clientAccessToken) {
    yield call(initializeSDK, {
      token: clientAccessToken,
      callback: () => {},
    });
  } else {
    // get client access token from your own authentication server.
    // get helper function to get a token
    const refreshToken = yield call(retrieveAccessToken);

    // get token
    const token = yield select(getToken);

    yield call(initializeSDK, {
      token,
      callback: refreshToken,
    });
  }

  yield put(application.sdkInitialized());
}
