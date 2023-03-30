import { all } from "redux-saga/effects";

import authenticationFlow from "./authentication/authenticationFlow";
import conferenceFlow from "./conference/conferenceFlow";
import sessionFlow from "./session/sessionFlow";
import eventFlow from "./event/eventFlow";
import applicationFlow from "./application/applicationFlow.js";

export default function* rootSaga() {
  yield all([
    applicationFlow(),
    authenticationFlow(),
    sessionFlow(),
    conferenceFlow(),
    eventFlow(),
  ]);
}
