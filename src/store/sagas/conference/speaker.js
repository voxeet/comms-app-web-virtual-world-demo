import {
  take,
  fork,
  cancel,
  cancelled,
  put,
  delay,
  race,
  call,
  all,
} from "redux-saga/effects";
import { isSpeaking as isSpeakingService } from "../../services/speaker";

import { stopBackgroundTask } from "../../actions/conference";
import { conference, application } from "../../effects";
import { displayMessage } from "./message";

//let participantId;
export function* bgSync(participant) {
  let isSpeaking = false;
  let previousStatus = false;

  const handleSpeakingStatus = (status) => {
    isSpeaking = status;
  };

  try {
    while (true) {
      try {
        // effects will get executed in parallel
        yield all([call(isSpeakingService, participant, handleSpeakingStatus)]);

        if (isSpeaking !== previousStatus) {
          previousStatus = isSpeaking;
          yield put(
            conference.updateParticipant({
              id: participant.id,
              entityType: "participants",
              data: { isSpeaking },
            })
          );
        }
      } catch (error) {
        yield call(displayMessage, {
          type: "error",
          message: "could not retrieve speaking status",
        });
      }

      yield delay(300);
    }
  } finally {
    if (yield cancelled()) {
      // console.log("task cancelled");
      yield put(stopBackgroundTask());
    }
  }
}

export function* watchParticipant({ payload: { data, id } }) {
  const bgSyncTask = yield fork(bgSync, data[id]);

  while (true) {
    // console.log("waiting for participant updated");

    const { update, remove, ends } = yield race({
      update: take(conference.updateParticipant),
      remove: take(conference.removeParticipant),
      ends: take([
        conference.ended,
        conference.left,
        application.leaveConference,
      ]),
    });

    if (ends) {
      yield cancel(bgSyncTask);
      break;
    }

    if (remove) {
      if (id === remove.payload.id) {
        yield cancel(bgSyncTask);
        break;
      }
    }

    if (update) {
      if (
        id === update.payload.id &&
        update.payload.data.status &&
        update.payload.data.status === "Left"
      ) {
        yield cancel(bgSyncTask);
        break;
      }
    }
  }
  // console.log("exiting");
}
