import {
  take,
  cancelled,
  call,
  race,
  all,
  put,
  select,
} from "redux-saga/effects";
import { eventChannel } from "redux-saga";
import VoxeetSDK from "@voxeet/voxeet-web-sdk";
import { push } from "redux-first-history";
import { normalize, schema } from "normalizr";

import { application } from "../../actions";

import {
  addParticipant,
  addStream,
  removeParticipant,
  removeStream,
  updateConference,
  updateParticipant,
  updateStream,
} from "../../effects/conference";

import pick from "lodash.pick";
import { getEntity } from "../../reducers/entities/selectors";
import {
  getCurrentConferenceID,
  getLocalParticipantID,
} from "../../reducers/application/selectors";
import { NotFoundEntity } from "../../../dataDefinitions/defect";
import {
  getAudioInputDevice,
  getAudioOutputDevice,
  getVideoInputDevice,
  updateDevices,
} from "../conference/devices";

export function subscribe() {
  return eventChannel((emit) => {
    const handleStreamAdded = (participant, stream) => {
      emit({ type: "streamAdded", payload: { participant, stream } });
    };

    const handleStreamUpdated = (participant, stream) => {
      emit({ type: "streamUpdated", payload: { participant, stream } });
    };

    const handleStreamRemoved = (participant, stream) => {
      emit({ type: "streamRemoved", payload: { participant, stream } });
    };

    const handleParticipantAdded = (participant) => {
      emit({ type: "participantAdded", payload: { participant } });
    };

    const handleParticipantRemoved = (participant) => {
      emit({ type: "participantRemoved", payload: { participant } });
    };

    const handleParticipantUpdated = (participant) => {
      emit({ type: "participantUpdated", payload: { participant } });
    };

    const handleCreated = () => {
      emit({ type: "created" });
    };

    const handleJoined = () => {
      emit({ type: "joined" });
    };

    const handleLeft = () => {
      emit({ type: "left" });
    };

    const handleEnded = () => {
      emit({ type: "ended" });
    };

    const handleRecording = (recording, isRecoding) => {
      emit({ type: "recording", payload: { isRecoding, recording } });
    };

    const handleDeviceChanged = ({
      list: {
        videoInput: videoInputDevices,
        audioInput: audioInputDevices,
        audioOutput: audioOutputDevices,
      },
    }) => {
      emit({
        type: "deviceChanged",
        payload: { videoInputDevices, audioInputDevices, audioOutputDevices },
      });
    };

    VoxeetSDK.conference.on("streamAdded", handleStreamAdded);
    VoxeetSDK.conference.on("streamRemoved", handleStreamRemoved);
    VoxeetSDK.conference.on("streamUpdated", handleStreamUpdated);
    VoxeetSDK.conference.on("participantUpdated", handleParticipantUpdated);
    VoxeetSDK.conference.on("participantRemoved", handleParticipantRemoved);
    VoxeetSDK.conference.on("participantAdded", handleParticipantAdded);
    VoxeetSDK.conference.on("created", handleCreated);
    VoxeetSDK.conference.on("joined", handleJoined);
    VoxeetSDK.conference.on("left", handleLeft);
    VoxeetSDK.conference.on("ended", handleEnded);
    VoxeetSDK.recording.on("statusUpdated", handleRecording);
    VoxeetSDK.mediaDevice.on("deviceChanged", handleDeviceChanged);

    return () => {
      VoxeetSDK.conference.off("streamAdded", handleStreamAdded);
      VoxeetSDK.conference.off("streamRemoved", handleStreamRemoved);
      VoxeetSDK.conference.off("streamUpdated", handleStreamUpdated);
      VoxeetSDK.conference.off("participantUpdated", handleParticipantUpdated);
      VoxeetSDK.conference.off("participantRemoved", handleParticipantRemoved);
      VoxeetSDK.conference.off("participantAdded", handleParticipantAdded);
      VoxeetSDK.conference.off("created", handleCreated);
      VoxeetSDK.conference.off("joined", handleJoined);
      VoxeetSDK.conference.off("left", handleLeft);
      VoxeetSDK.conference.off("ended", handleEnded);
      VoxeetSDK.recording.off("statusUpdated", handleRecording);
      VoxeetSDK.mediaDevice.off("deviceChanged", handleDeviceChanged);
    };
  });
}

// TODO: extract function
function normalizeStream(stream) {
  const streamSchema = new schema.Entity(
    "streams",
    {},
    {
      idAttribute: "id",
    }
  );

  const normalizedData = normalize(stream, streamSchema);
  return {
    streamID: normalizedData.result,
    entities: normalizedData.entities,
  };
}

// TODO: extract function
function normalizeParticipant(participant) {
  const participantSchema = new schema.Entity(
    "participants",
    {},
    {
      idAttribute: "id",
      processStrategy: (entity) => {
        const val = pick(entity, [
          "type",
          "id",
          "status",
          "info",
          "audioTransmitting",
          "videoTransmitting",
        ]);

        if (val.info.externalId) {
          try {
            const decodedString = atob(val.info.externalId);
            const decodeObject = JSON.parse(decodedString);

            const {
              t1,
              t2,
              "init-pos": { x, y, z, r },
            } = decodeObject;

            return {
              name: val.info.name,
              type: t1 !== undefined || t2 !== undefined ? "bot" : val.type,
              id: val.id,
              status: val.status,
              video: val.videoTransmitting,
              audio: val.audioTransmitting,
              ...(x !== undefined &&
                y !== undefined &&
                z !== undefined &&
                r !== undefined && {
                  location: {
                    position: { x, y, z },
                    direction: { x: 0, y: r, z: 0 },
                  },
                }),
            };
          } catch (e) {
            return {
              name: val.info.name,
              type: val.type,
              id: val.id,
              status: val.status,
              video: val.videoTransmitting,
              audio: val.audioTransmitting,
            };
          }
        } else {
          return {
            name: val.info.name,
            type: val.type,
            id: val.id,
            status: val.status,
            video: val.videoTransmitting,
            audio: val.audioTransmitting,
          };
        }
      },
    }
  );

  const normalizedData = normalize(participant, participantSchema);
  return {
    participantID: normalizedData.result,
    entities: normalizedData.entities,
  };
}

function* handleStreamUpdate(
  stream,
  participant,
  localParticipant,
  currentConference,
  add = false
) {
  if (!participant || !stream) return;

  if (localParticipant === NotFoundEntity) return;

  const { streamID } = normalizeStream(stream);

  // screen sharing
  if (stream.type === "ScreenShare") {
    yield put(
      updateConference({
        id: currentConference.id,
        entityType: "conferences",
        data: {
          screenShareStreams: [{ streamID, participantID: participant.id }],
        },
      })
    );
  } else {
    yield put(
      updateParticipant({
        id: participant.id,
        entityType: "participants",
        data: { streams: [streamID] },
      })
    );
  }

  //Temp

  // update stream objs and participant stream list ids
  if (add) {
    yield put(
      addStream({
        id: streamID,
        data: { [streamID]: stream }, // Do not normalize
        entityType: "streams",
      })
    );
  } else {
    yield put(
      updateStream({
        id: streamID,
        data: { [streamID]: stream }, // Do not normalize
        entityType: "streams",
      })
    );
  }
}

export function* externalListener(channel) {
  // eslint-disable no-constant-condition
  while (true) {
    const event = yield take(channel);
    switch (event.type) {
      case "streamAdded": {
        const localParticipantID = yield select(getLocalParticipantID);

        const localParticipant = yield select((state) =>
          getEntity(state, "participants", localParticipantID)
        );

        const currentConferenceID = yield select(getCurrentConferenceID);

        const currentConference = yield select((state) =>
          getEntity(state, "conferences", currentConferenceID)
        );

        yield call(
          handleStreamUpdate,
          event.payload.stream,
          event.payload.participant,
          localParticipant,
          currentConference,
          true
        );

        break;
      }

      case "streamUpdated": {
        const localParticipantID = yield select(getLocalParticipantID);

        const localParticipant = yield select((state) =>
          getEntity(state, "participants", localParticipantID)
        );

        const currentConferenceID = yield select((state) =>
          getCurrentConferenceID(state)
        );

        const currentConference = yield select((state) =>
          getEntity(state, "conferences", currentConferenceID)
        );

        yield call(
          handleStreamUpdate,
          event.payload.stream,
          event.payload.participant,
          localParticipant,
          currentConference,
          false
        );

        break;
      }

      case "streamRemoved": {
        // get participant
        const participant = yield select((state) =>
          getEntity(state, "participants", event.payload.participant.id)
        );

        // remove stream id from participant streams
        // const { streamID } = normalizeStream(event.payload.stream);

        if (event.payload.stream.type === "ScreenShare") {
          const currentConferenceID = yield select(getCurrentConferenceID);

          const currentConference = yield select((state) =>
            getEntity(state, "conferences", currentConferenceID)
          );

          yield put(
            updateConference({
              id: currentConferenceID,
              entityType: "conferences",

              data: {
                screenShareStreams: currentConference.screenShareStreams.filter(
                  (item) => item.streamID !== event.payload.stream.id
                ),
              },
            })
          );
        } else {
          // check valid
          if (participant !== NotFoundEntity) {
            yield put(
              updateParticipant({
                id: event.payload.participant.id,
                entityType: "participants",

                data: {
                  streams: [],
                  /*streams:
                                      participant.streams &&
                                      participant.streams.filter(
                                        (stream) => stream.id !== streamID
                                      ),*/
                },
              })
            );
          }
        }

        // remove stream obj
        yield put(
          removeStream({
            id: event.payload.stream.id,
            entityType: "streams",
          })
        );

        break;
      }

      case "participantRemoved": {
        // remove participant obj
        yield put(
          removeParticipant({
            id: event.payload.participant.id,
            entityType: "participants",
          })
        );

        // remove participant id from conference participant list
        const conferenceID = yield select(getCurrentConferenceID);

        const conference = yield select((state) =>
          getEntity(state, "conferences", conferenceID)
        );

        yield put(
          updateConference({
            id: conferenceID,
            entityType: "conferences",

            data: {
              participants: conference.participants.filter(
                (participant) => participant.id !== event.payload.participant.id
              ),
            },
          })
        );

        break;
      }

      case "participantUpdated": {
        // TODO-HACK: check participant status!
        const conferenceID = yield select(getCurrentConferenceID);

        const conference = yield select((state) =>
          getEntity(state, "conferences", conferenceID)
        );

        const hasLeft = event.payload.participant.status === "Left";
        if (hasLeft) {
          // remove participant
          yield put(
            removeParticipant({
              id: event.payload.participant.id,
              entityType: "participants",
            })
          );

          // update conference participant list
          yield put(
            updateConference({
              id: conferenceID,
              entityType: "conferences",
              data: {
                participants: conference.participants.filter(
                  (participantID) =>
                    participantID !== event.payload.participant.id
                ),
              },
            })
          );

          break;
        }

        const {
          participantID,
          entities: { participants },
        } = normalizeParticipant(event.payload.participant);

        // update
        if (conference.participants.includes(event.payload.participant.id)) {
          yield put(
            updateParticipant({
              id: participantID,
              entityType: "participants",
              data: { ...participants[participantID] },
            })
          );

          break;
        } else {
          // mixer case
          if (participants[participantID].type === "mixer") break;

          // already gone participants
          if (participants[participantID].status === "Left") break;

          // rejoins
          yield put(
            addParticipant({
              id: participantID,
              data: participants,
              entityType: "participants",
            })
          );

          yield put(
            updateConference({
              id: conferenceID,
              entityType: "conferences",
              data: {
                participants: [...conference.participants, participantID],
              },
            })
          );
          break;
        }
      }

      case "participantAdded": {
        const conferenceID = yield select(getCurrentConferenceID);

        const conference = yield select((state) =>
          getEntity(state, "conferences", conferenceID)
        );

        const {
          participantID,
          entities: { participants },
        } = normalizeParticipant(event.payload.participant);

        // mixer case
        if (participants[participantID].type === "mixer") break;

        // already gone participants
        if (participants[participantID].status === "Left") break;

        // add participant
        yield put(
          addParticipant({
            id: participantID,
            data: participants,
            entityType: "participants",
          })
        );

        //add participant to conference participant list
        yield put(
          updateConference({
            id: conferenceID,
            entityType: "conferences",
            data: {
              participants: [...conference.participants, participantID],
            },
          })
        );

        break;
      }

      case "created":
        //yield put(conference.created());
        break;

      case "joined":
        //yield put(conference.joined());
        break;

      case "left":
        //yield put(conference.left());
        break;

      case "ended":
        //yield put(conference.ended());
        yield put(push("/conference"));
        break;

      case "recording": {
        const conferenceID = yield select(getCurrentConferenceID);

        yield put(
          updateConference({
            id: conferenceID,
            entityType: "conferences",
            data: {
              recording: event.payload.recording,
            },
          })
        );
        break;
      }

      case "deviceChanged": {
        const audioInputDevices = event.payload.audioInputDevices;
        const audioInputDevicesIds = event.payload.audioInputDevices.map(
          (device) => device.deviceId
        );
        yield call(
          updateDevices,
          audioInputDevices,
          audioInputDevicesIds,
          "audioInputDevices"
        );
        yield call(getAudioInputDevice);

        const audioOutputDevices = event.payload.audioOutputDevices;
        const audioOutputDevicesIds = event.payload.audioOutputDevices.map(
          (device) => device.deviceId
        );
        yield call(
          updateDevices,
          audioOutputDevices,
          audioOutputDevicesIds,
          "audioOutputDevices"
        );
        yield call(getAudioOutputDevice);

        const videoInputDevices = event.payload.videoInputDevices;
        const videoInputDevicesIds = event.payload.videoInputDevices.map(
          (device) => device.deviceId
        );
        yield call(
          updateDevices,
          videoInputDevices,
          videoInputDevicesIds,
          "videoInputDevices"
        );
        yield call(getVideoInputDevice);

        break;
      }

      default:
        break;
    }
  }
}

export function* internalListener() {
  //TODO: send data to sdk ??
  // VoxeetSDK.send
}

export default function* watchEvents() {
  const channel = yield call(subscribe);

  try {
    const { cancel } = yield race({
      task: all([call(externalListener, channel), call(internalListener)]),
      cancel: take(application.stop),
    });

    if (cancel) {
      channel.close();
    }
  } finally {
    if (yield cancelled()) channel.close();
  }
}
