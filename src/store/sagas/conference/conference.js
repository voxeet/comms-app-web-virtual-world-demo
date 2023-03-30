import { call, put, select } from "redux-saga/effects";

import { application } from "../../effects";
import { push } from "redux-first-history";

import {
  createConference,
  getLocalParticipant,
  joinConference,
  leaveConference,
} from "../../services/conference";
import { getCurrentConferenceID } from "../../reducers/application/selectors";
import { getEntity } from "../../reducers/entities/selectors";
import {
  addConference,
  addParticipant,
  addStreamToMainStage,
  addStreamToSecondStage,
  removeStreamToMainStage,
  removeStreamToSecondStage,
  updateConference,
} from "../../effects/conference";

import { getParticipant } from "./audio";

export const hasVideo = (streams) => {
  const stream = streams.find((stream) => stream.type === "Camera");

  if (!stream) return false;

  const tracks = stream.getVideoTracks();
  return tracks.length > 0;
};

export function* startBroadcastVideoOnMainStage({ payload }) {
  const state = yield select();

  const conferenceID = yield select(getCurrentConferenceID);

  //1- get participant
  const participant = yield select(getParticipant, payload.participantId);

  if (participant) {
    const streams = participant.streams;

    if (streams && streams.length > 0) {
      const stream = yield call(
        getEntity,
        state,
        "streams",
        participant.streams[0]
      );

      //2- check the stream has video track
      if (stream) {
        const video = yield call(hasVideo, [stream]);

        //3- if so add stream id to stream ids array to be displayed (update conference entities)
        if (video) {
          yield put(
            addStreamToMainStage({
              id: conferenceID,
              entityType: "conferences",
              data: {
                mainStageStreams: [participant.streams[0]],
              },
            })
          );
        }
      }
    }
  }
}

export function* stopBroadcastVideoOnMainStage({ payload }) {
  const conferenceID = yield select(getCurrentConferenceID);

  yield put(
    removeStreamToMainStage({
      id: conferenceID,
      entityType: "conferences",
      data: {
        mainStageStreams: [],
      },
    })
  );
}

export function* startBroadcastVideoOnSecondStage({ payload }) {
  const state = yield select();

  const conferenceID = yield select(getCurrentConferenceID);

  //1- get participant
  const participant = yield select(getParticipant, payload.participantId);

  if (participant) {
    const streams = participant.streams;

    if (streams && streams.length > 0) {
      const stream = yield call(
        getEntity,
        state,
        "streams",
        participant.streams[0]
      );

      //2- check the stream has video track
      if (stream) {
        const video = yield call(hasVideo, [stream]);

        //3- if so add stream id to stream ids array to be displayed (update conference entities)
        if (video) {
          yield put(
            addStreamToSecondStage({
              id: conferenceID,
              entityType: "conferences",
              data: {
                secondStageStreams: [participant.streams[0]],
              },
            })
          );
        }
      }
    }
  }
}

export function* stopBroadcastVideoOnSecondStage({ payload }) {
  const conferenceID = yield select(getCurrentConferenceID);

  yield put(
    removeStreamToSecondStage({
      id: conferenceID,
      entityType: "conferences",
      data: {
        secondStageStreams: [],
      },
    })
  );
}

export function* create({ payload }) {
  // get local participant
  const { participantID, entities: participantEntities } = yield call(
    getLocalParticipant
  );

  yield put(
    addParticipant({
      id: participantID,
      data: participantEntities.participants,
      entityType: "participants",
    })
  );

  yield put(application.setLocalParticipantID({ id: participantID }));

  const { entities: conferenceEntities, conferenceID } = yield call(
    createConference,
    payload
  );

  yield put(
    addConference({
      id: conferenceID,
      data: conferenceEntities.conferences,
      entityType: "conferences",
    })
  );

  yield put(application.setCurrentConferenceID({ id: conferenceID }));

  yield put(
    updateConference({
      id: conferenceID,
      entityType: "conferences",
      data: { participants: [participantID] },
    })
  );

  const constraints = {
    audio: true,
    video: false,
  };
  yield call(join, { payload: constraints });
}

export function* join({ payload }) {
  const state = yield select();
  const currentConferenceID = yield select(getCurrentConferenceID);
  const conference = yield call(
    getEntity,
    state,
    "conferences",
    currentConferenceID
  );

  const options = {
    constraints: payload,
    spatialAudio: true,
    dvwc: true,
  };

  // FIXME: do not want conference object to be modify by sdk.
  const copy = { ...conference };

  const { entities, conferenceID } = yield call(joinConference, {
    conference: copy,
    options,
  });

  //TODO: update conference, add spatial audio style status

  yield put(
    updateConference({
      id: conferenceID,
      entityType: "conferences",
      data: { params: entities.conferences[conferenceID].params },
    })
  );

  // NOTE: do not forget to update entities: object passed as ref!
  // yield put(setEntities({ entities, origin: "join conference" }));
  yield put(push(`/conference/${conference.alias}`));
}

export function* leave() {
  const { error } = yield call(leaveConference);

  if (!error) {
    yield put(application.leaveConference());
    yield put(push("/conference"));
  }
}
