import { call } from "redux-saga/effects";

import { closeSession as close } from "../../services/session";
import { displayMessage } from "../conference/message";

export default function* closeSession() {
  const { error } = yield call(close);
  if (error) {
    yield call(displayMessage, {
      type: "error",
      message: "could not close session",
    });
  }
}
