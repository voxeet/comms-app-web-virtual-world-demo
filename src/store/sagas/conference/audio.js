import { call } from "redux-saga/effects";

import { getEntity } from "../../reducers/entities/selectors";
import {
  startLocalAudio as start,
  stopLocalAudio as stop,
} from "../../services/audio";
import { displayMessage } from "./message";

// FIXME: create a selectors files ?
export const getParticipant = (state, id) =>
  getEntity(state, "participants", id);

export function* startAudio() {
  const { error } = yield call(start);

  if (error) {
    yield call(displayMessage, {
      type: "error",
      message: "could not start audio",
    });
  }
}
export function* stopAudio() {
  const { error } = yield call(stop);

  if (error) {
    yield call(displayMessage, {
      type: "error",
      message: "could not stop audio",
    });
  }
}
