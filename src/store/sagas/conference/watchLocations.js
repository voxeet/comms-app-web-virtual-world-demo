import PubNub from "pubnub";
import { createId } from "@paralleldrive/cuid2";
import {
  getCurrentConferenceID,
  getCurrentDeviceID,
  getLocalParticipantID,
} from "../../reducers/application/selectors";
import {
  all,
  call,
  cancelled,
  put,
  race,
  select,
  take,
  takeEvery,
} from "redux-saga/effects";
import { eventChannel } from "redux-saga";
import { application, conference } from "../../effects";
import { spatial } from "../../actions";
import { updateParticipant } from "../../effects/conference";
import { getEntity, getValidEntities } from "../../reducers/entities/selectors";
import { isValid } from "../../../dataDefinitions/defect";
import { displayMessage } from "./message";

// participant id and position and direction combined (location) map
// locations.set("participantID", {position:{...}, direction:{...} });
let locations = new Map();

// device id and participant id map
// ids.set("deviceID", "participantID");
let ids = new Map();

// Create a channel for events coming from PubNub. (Not from redux store).
export function subscribe(pubnub, channel) {
  return eventChannel((emit) => {
    // add listener
    const listener = {
      status: (statusEvent) => {
        if (statusEvent.category === "PNConnectedCategory") {
          emit({ type: "connected" });
        }
      },
      message: (messageEvent) => {
        emit({
          type: messageEvent.userMetadata.type,
          message: messageEvent.message,
          publisher: messageEvent.publisher,
        });
      },
      presence: (presenceEvent) => {
        emit({ type: presenceEvent.action, data: presenceEvent.uuid });
      },
    };
    pubnub.addListener(listener);

    pubnub.subscribe({
      channels: [channel],
      withPresence: true,
    });

    return () => {
      pubnub.removeListener(listener);
      pubnub.unsubscribe({
        channels: [channel],
      });
    };
  });
}

// Create PubNub instance.
export function setupPubNub({ publishKey, subscribeKey, userId }) {
  // Update this block with your publish/subscribe keys
  return new PubNub({
    publishKey,
    subscribeKey,
    userId,
  });
}

// Listen to events (actions) from PubNub.
// And dispatch actions/effects to the store accordingly. (Update remote participants' locations).
export function* externalListener(channel) {
  const localParticipantID = yield select(getLocalParticipantID);
  const localDeviceID = yield select(getCurrentDeviceID);
  const currentConferenceID = yield select(getCurrentConferenceID);

  while (true) {
    const event = yield take(channel);

    switch (event.type) {
      case "UpdatePosition": {
        const currentConference = yield select((state) =>
          getEntity(state, "conferences", currentConferenceID)
        );

        if (!isValid(currentConference)) break;

        const participants = currentConference.participants || [];

        if (!participants.includes(event.message.participantId)) break;
        if (event.message.participantId === localParticipantID) break;

        // update ids map
        // FIXME: always set it ?
        ids.set(event.publisher, event.message.participantId);

        // update locations map
        locations.set(event.message.participantId, {
          ...locations.get(event.message.participantId),
          position: event.message.position,
        });

        yield put(
          updateParticipant({
            id: event.message.participantId,
            entityType: "participants",
            data: { location: locations.get(event.message.participantId) },
          })
        );
        break;
      }

      case "UpdateDirection": {
        const currentConference = yield select((state) =>
          getEntity(state, "conferences", currentConferenceID)
        );

        if (!isValid(currentConference)) break;

        const participants = currentConference.participants || [];

        if (!participants.includes(event.message.participantId)) break;
        if (event.message.participantId === localParticipantID) break;

        // update ids map
        // FIXME: always set it ?
        ids.set(event.publisher, event.message.participantId);

        // update locations map
        locations.set(event.message.participantId, {
          ...locations.get(event.message.participantId),
          direction: event.message.direction,
        });

        yield put(
          updateParticipant({
            id: event.message.participantId,
            entityType: "participants",
            data: { location: locations.get(event.message.participantId) },
          })
        );
        break;
      }

      case "join": {
        const deviceID = event.data;
        if (deviceID === localDeviceID) break;

        ids.set(event.data, {});
        break;
      }

      case "leave": {
        const deviceID = event.data;
        if (deviceID === localDeviceID) break;

        if (ids.has(deviceID)) {
          const participantId = ids.get(deviceID);

          // update locations map
          if (locations.has(participantId)) {
            locations.delete(participantId);
          }
        }
        ids.delete(deviceID);
        break;
      }
      default:
        break;
    }
  }
}

// Helper function (HOF) that returns a function (generator) used to publish message (send local participant's direction).
const sendPositionWithPubNub = (pubnub) =>
  function* sendPosition(action) {
    const currentConferenceID = yield select(getCurrentConferenceID);
    const {
      payload: { position, participantId },
    } = action;
    try {
      yield call([pubnub, pubnub.publish], {
        message: { position, participantId },
        channel: currentConferenceID,
        meta: { type: "UpdatePosition" },
      });
    } catch (error) {
      yield call(displayMessage, {
        type: "error",
        message: "PubNub: failed to update position",
      });
    }
  };

// Helper function (HOF) that returns a function (generator) used to fetch messages.
// The aim goal is to retrieve locations from participants already there.
// And finally, dispatch an effect to the store to update ui (3D scene accordingly).
const fetchParticipantsLocationsWithPubNub = (pubnub) =>
  function* fetchLocations() {
    const currentConferenceID = yield select(getCurrentConferenceID);
    const localParticipantID = yield select(getLocalParticipantID);

    const currentConference = yield select((state) =>
      getEntity(state, "conferences", currentConferenceID)
    );

    const participantsIds = currentConference.participants;
    if (participantsIds.length === 0) return;

    const participants = yield select((state) => {
      return getValidEntities(state, "participants", participantsIds);
    });

    const remoteParticipantsIds = participants
      .filter(
        (participant) =>
          participant.id !== localParticipantID && participant.type !== "bot"
      )
      .map((participant) => participant.id);

    let channelsMessages;
    try {
      channelsMessages = yield call([pubnub, pubnub.fetchMessages], {
        channels: [currentConferenceID],
        count: 1000,
        includeUUID: true,
        includeMeta: true,
      });
    } catch (error) {
      yield call(displayMessage, {
        type: "error",
        message: "PubNub: failed to fetch locations",
      });
    }

    if (
      channelsMessages &&
      Object.keys(channelsMessages).length > 0 &&
      Object.keys(channelsMessages.channels).length > 0
    ) {
      const orderedChannelMessages =
        channelsMessages.channels[currentConferenceID].reverse();

      const remoteLocations = remoteParticipantsIds.map((id) => {
        const latestPositionMessage = orderedChannelMessages.find(
          (item) =>
            item.message.participantId === id &&
            item.meta.type === "UpdatePosition"
        );
        const latestDirectionMessage = orderedChannelMessages.find(
          (item) =>
            item.message.participantId === id &&
            item.meta.type === "UpdateDirection"
        );

        return {
          id,
          location: {
            position: latestPositionMessage
              ? latestPositionMessage.message.position
              : { x: 0, y: 0, z: 0 },
            direction: latestDirectionMessage
              ? latestDirectionMessage.message.direction
              : { x: 0, y: 0, z: 0 },
          },
        };
      });

      yield all(
        remoteLocations.map((location) =>
          put(
            updateParticipant({
              id: location.id,
              entityType: "participants",
              data: { location: location.location },
            })
          )
        )
      );
    }
  };

// Helper function (HOF) that returns a function (generator) used to publish message (send local participant's direction).
const sendDirectionWithPubNub = (pubnub) =>
  function* sendPosition(action) {
    const currentConferenceID = yield select(getCurrentConferenceID);
    const {
      payload: { direction, participantId },
    } = action;

    try {
      yield call([pubnub, pubnub.publish], {
        message: { direction, participantId },
        channel: currentConferenceID,
        meta: { type: "UpdateDirection" },
      });
    } catch (error) {
      yield call(displayMessage, {
        type: "error",
        message: "PubNub: failed to update direction",
      });
    }
  };

// Listen to actions dispatched from within the application.
// Trigger side effects accordingly (such as send position, send direction or fetch messages).
export function* internalListener(pubnub) {
  yield takeEvery(
    spatial.setParticipantPosition,
    sendPositionWithPubNub(pubnub)
  );

  yield takeEvery(
    spatial.setParticipantDirection,
    sendDirectionWithPubNub(pubnub)
  );

  yield takeEvery(
    spatial.fetchRemoteParticipantsLocations,
    fetchParticipantsLocationsWithPubNub(pubnub)
  );
}

// Main saga.
// 1- setup PubNub,
// 2- create a channel,
// 3- listen to events coming from within the app and from PubNub,
// 4- react to events accordingly,
// 5- do it until you leave the event, being kicked or the event is over.
export function* watchLocations() {
  const publishKey = import.meta.env.VITE_PUBNUB_PUBLISHER_KEY;
  const subscribeKey = import.meta.env.VITE_PUBNUB_SUBSCRIBER_KEY;

  const currentConferenceID = yield select(getCurrentConferenceID);
  let currentDeviceID = yield select(getCurrentDeviceID);

  if (!currentDeviceID) {
    currentDeviceID = yield call(createId);
    yield put(application.setCurrentDeviceID({ id: currentDeviceID }));
  }

  const pubnub = yield call(setupPubNub, {
    publishKey,
    subscribeKey,
    userId: currentDeviceID,
  });

  const channel = yield call(subscribe, pubnub, currentConferenceID);

  try {
    const { cancel } = yield race({
      task: all([
        call(externalListener, channel),
        call(internalListener, pubnub),
      ]),
      cancel: take([
        conference.ended,
        conference.left,
        application.leaveConference,
      ]),
    });

    if (cancel) {
      channel.close();
    }
  } finally {
    if (yield cancelled()) channel.close();
  }
}
