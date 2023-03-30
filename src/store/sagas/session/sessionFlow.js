import { takeEvery } from "redux-saga/effects";

import { session } from "../../actions";
import openSession from "./openSession";
import closeSession from "./closeSession";

export default function* conferenceFlow() {
  yield takeEvery(session.open, openSession);
  yield takeEvery(session.close, closeSession);
}
