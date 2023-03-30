import { call, select, put } from "redux-saga/effects";

import { startRecording, stopRecording } from "../../services/record";
import { getEntity } from "../../reducers/entities/selectors";
import { getCurrentConferenceID } from "../../reducers/application/selectors";
import { updateConference } from "../../effects/conference";
import { displayMessage } from "./message";

export const getConference = (state, id) => getEntity(state, "conferences", id);

export function* stopRecordingConference() {
  const { error } = yield call(stopRecording);
  if (error) {
    yield call(displayMessage, {
      type: "error",
      message: "could not stop recording event",
    });

    return;
  }

  const currentConferenceID = yield select(getCurrentConferenceID);
  const conference = yield select(getConference, currentConferenceID);

  yield put(
    updateConference({
      id: conference.id,
      entityType: "conferences",
      data: { recording: false },
    })
  );
}

export function* recordConference() {
  const { error } = yield call(startRecording);
  if (error) {
    yield call(displayMessage, {
      type: "error",
      message: "could not start recording event",
    });

    return;
  }

  const currentConferenceID = yield select(getCurrentConferenceID);
  const conference = yield select(getConference, currentConferenceID);

  yield put(
    updateConference({
      id: conference.id,
      entityType: "conferences",
      data: { recording: true },
    })
  );
}
