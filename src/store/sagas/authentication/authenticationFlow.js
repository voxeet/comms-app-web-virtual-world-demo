import { call, take, takeEvery } from "redux-saga/effects";

import { application, session } from "../../actions";
import logout from "./logout";

import authenticate from "./authenticate";

export default function* authenticationFlow() {
  yield take(application.ready);

  // get token
  yield call(authenticate);

  // wait for session logout
  yield takeEvery(session.close, logout);
}
