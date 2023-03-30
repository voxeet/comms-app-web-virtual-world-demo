import { takeLatest } from "redux-saga/effects";

import watchEvent from "./watchEvents";
import { application } from "../../effects";

export default function* conferenceFlow() {
  yield takeLatest(application.sdkInitialized, watchEvent);
}
