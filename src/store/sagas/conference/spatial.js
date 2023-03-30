import { call, put, select } from "redux-saga/effects";

import {
  setDirection,
  setEnvironment,
  setPosition,
} from "../../services/spatial";
import { getLocalParticipantID } from "../../reducers/application/selectors";
import { updateParticipant } from "../../effects/conference";
import { getParticipant } from "./audio";

const areEqual = (array1, array2) =>
  array1.length === array2.length &&
  array1.every((value, index) => value === array2[index]);

export function* setSpatialEnvironment({ payload }) {
  yield call(setEnvironment, payload);
}

export function* setParticipantPosition({ payload }) {
  yield call(setPosition, payload.participantId, payload.position);
}

export function* setParticipantDirection({ payload }) {
  yield call(setDirection, payload.participantId, payload.direction);
}

export function* setParticipantLocation({ payload }) {
  const participantID = yield select(getLocalParticipantID);
  const participant = yield select(getParticipant, participantID);

  const currentPosition =
    (participant.location && participant.location.position) || [];

  const currentDirection =
    (participant.location && participant.location.direction) || [];

  if (
    !areEqual(payload.position, currentPosition) ||
    !areEqual(payload.direction, currentDirection)
  ) {
    if (participantID === payload.participantId) {
      yield put(
        updateParticipant({
          id: payload.participantId,
          entityType: "participants",
          data: {
            location: {
              position: payload.position,
              direction: payload.direction,
            },
          },
        })
      );
    }

    const position = {
      x: payload.position[0],
      y: payload.position[1],
      z: payload.position[2],
    };

    const direction = {
      x: payload.direction[0],
      y: payload.direction[1],
      z: payload.direction[2],
    };

    yield call(setPosition, payload.participantId, position);

    yield call(setDirection, payload.participantId, direction);
  }
}
