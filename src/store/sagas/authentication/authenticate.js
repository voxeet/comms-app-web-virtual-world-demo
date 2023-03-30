import { call, put, delay } from "redux-saga/effects";
import { push } from "redux-first-history";

import { retrieveAccessToken } from "../../services/authentication";
import { authentication } from "../../effects";

export default function* authenticate() {
  // access token helper factory
  const getToken = retrieveAccessToken();

  // get access token
  const token = yield call(getToken);

  if (token) {
    yield delay(200);

    yield put(authentication.setToken({ token }));

    yield put(push("/session"));
  }
}
