import { call, select } from "redux-saga/effects";

import { getEntity } from "../../reducers/entities/selectors";
import { startVideo as start, stopVideo as stop } from "../../services/video";
import { displayMessage } from "./message";

export const getParticipant = (state, id) =>
  getEntity(state, "participants", id);

export function* startVideo({ payload }) {
  const participant = yield select(getParticipant, payload);
  if (!participant) return;

  const { error } = yield call(start, participant);
  if (error) {
    yield call(displayMessage, {
      type: "error",
      message: "could not start video",
    });
  }
}

export function* stopVideo({ payload }) {
  const participant = yield select(getParticipant, payload);
  if (!participant) return;

  const { error } = yield call(stop, participant);
  if (error) {
    yield call(displayMessage, {
      type: "error",
      message: "could not stop video",
    });
  }
}
