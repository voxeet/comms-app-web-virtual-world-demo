import { call } from "redux-saga/effects";

import {
  startScreenShare as start,
  stopScreenShare as stop,
} from "../../services/screenShare";
import { displayMessage } from "./message";

export function* startScreenShare(action) {
  const { error } = yield call(start, { audio: true });
  if (error) {
    yield call(displayMessage, {
      type: "error",
      message: "could not start screen sharing",
    });
  }
}

export function* stopScreenShare() {
  const { error } = yield call(stop);
  if (error) {
    yield call(displayMessage, {
      type: "error",
      message: "could not stop screen sharing",
    });
  }
}
