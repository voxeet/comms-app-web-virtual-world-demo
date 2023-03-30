import { all, call, put, select } from "redux-saga/effects";

import {
  listAudioDevices,
  listVideoDevices,
  selectAudioInput,
  selectAudioOutput,
  selectVideoInput,
  listAudioInputDevices,
  listAudioOutputDevices,
  listVideoInputDevices,
  getSelectedAudioInputDevice,
  getSelectedAudioOutputDevice,
  getSelectedVideoInputDevice,
} from "../../services/devices";

import { addDevice, updateParticipant } from "../../effects/conference";
import { getLocalParticipantID } from "../../reducers/application/selectors";

import { getParticipant } from "./audio";
import { displayMessage } from "./message";

export function* getAudioInputDevice() {
  const { id, entities, error } = yield call(getSelectedAudioInputDevice);
  if (error) {
    yield call(displayMessage, {
      type: "error",
      message: "could not retrieve current audio input device",
    });
    return;
  }
  if (id && entities) {
    const participantID = yield select(getLocalParticipantID);
    const participant = yield select(getParticipant, participantID);

    if (participant) {
      yield put(
        updateParticipant({
          id: participantID,
          entityType: "participants",
          data: { selectedAudioInputDeviceId: id },
        })
      );
    }
  }
}

export function* getAudioOutputDevice() {
  const { id, entities, error } = yield call(getSelectedAudioOutputDevice);
  if (error) {
    yield call(displayMessage, {
      type: "error",
      message: "could not retrieve current audio output device",
    });
    return;
  }
  if (id && entities && !error) {
    const participantID = yield select(getLocalParticipantID);
    const participant = yield select(getParticipant, participantID);

    if (participant) {
      yield put(
        updateParticipant({
          id: participantID,
          entityType: "participants",
          data: { selectedAudioOutputDeviceId: id },
        })
      );
    }
  }
}

export function* getVideoInputDevice() {
  const { id, entities, error } = yield call(getSelectedVideoInputDevice);
  if (error) {
    yield call(displayMessage, {
      type: "error",
      message: "could not retrieve current video input device",
    });
    return;
  }
  if (id && entities) {
    const participantID = yield select(getLocalParticipantID);
    const participant = yield select(getParticipant, participantID);

    if (participant) {
      yield put(
        updateParticipant({
          id: participantID,
          entityType: "participants",
          data: { selectedVideoInputDeviceId: id },
        })
      );
    }
  }
}

export function* updateDevices(devicesList, devicesIds, deviceType) {
  yield all(
    Object.entries(devicesList).map(([id, value]) =>
      put(
        addDevice({
          id,
          data: value,
          entityType: "devices",
        })
      )
    )
  );

  const participantID = yield select(getLocalParticipantID);
  const participant = yield select(getParticipant, participantID);

  if (participant) {
    yield put(
      updateParticipant({
        id: participantID,
        entityType: "participants",
        data: { [deviceType]: devicesIds },
      })
    );
  }
}

export function* enumerateAudioInputDevices() {
  const { ids, entities, error } = yield call(listAudioInputDevices);
  if (error) {
    yield call(displayMessage, {
      type: "error",
      message: "could not list audio input devices",
    });
    return;
  }
  if (ids && entities) {
    yield call(updateDevices, entities, ids, "audioInputDevices");
    yield call(getAudioInputDevice);
  }
}

export function* enumerateAudioOutputDevices() {
  const { ids, entities, error } = yield call(listAudioOutputDevices);
  if (error) {
    yield call(displayMessage, {
      type: "error",
      message: "could not list audio output devices",
    });
    return;
  }
  if (ids && entities) {
    yield call(updateDevices, entities, ids, "audioOutputDevices");
    yield call(getAudioOutputDevice);
  }
}

export function* enumerateVideoInputDevices() {
  const { ids, entities, error } = yield call(listVideoInputDevices);
  if (error) {
    yield call(displayMessage, {
      type: "error",
      message: "could not list video input devices",
    });
    return;
  }
  if (ids && entities) {
    yield call(updateDevices, entities, ids, "videoInputDevices");
    yield call(getVideoInputDevice);
  }
}

// deprecated
export function* enumerateAudioDevices() {
  const { ids, entities, error } = yield call(listAudioDevices);
  if (error) {
    yield call(displayMessage, {
      type: "error",
      message: "could not list audio devices",
    });
  }

  if (ids && entities) {
    yield all(
      Object.entries(entities).map(([id, value]) =>
        put(
          addDevice({
            id,
            data: value,
            entityType: "devices",
          })
        )
      )
    );

    const participantID = yield select(getLocalParticipantID);
    const participant = yield select(getParticipant, participantID);

    /*    const updatedDeviceIds =
      participant.audioDevices && participant.audioDevices.length > 0
        ? [...participant.audioDevices, ...ids]
        : ids;*/

    if (participant) {
      yield put(
        updateParticipant({
          id: participantID,
          entityType: "participants",
          data: { audioDevices: ids },
        })
      );
    }
  }
}

// deprecated
export function* enumerateVideoDevices() {
  const { ids, entities, error } = yield call(listVideoDevices);

  if (error) {
    yield call(displayMessage, {
      type: "error",
      message: "could not list video devices",
    });
    return;
  }

  if (ids && entities) {
    yield all(
      Object.entries(entities).map(([id, value]) =>
        put(
          addDevice({
            id,
            data: value,
            entityType: "devices",
          })
        )
      )
    );

    const participantID = yield select(getLocalParticipantID);
    const participant = yield select(getParticipant, participantID);

    const updatedDeviceIds =
      participant.videoDevices && participant.videoDevices.length > 0
        ? [...participant.videoDevices, ...ids]
        : ids;

    if (participant) {
      yield put(
        updateParticipant({
          id: participantID,
          entityType: "participants",
          data: { videoDevices: updatedDeviceIds },
        })
      );
    }
  }
}

export function* setAudioInput({ payload }) {
  const { error } = yield call(selectAudioInput, payload);
  if (error) {
    yield call(displayMessage, {
      type: "error",
      message: "could not select audio input device",
    });
  }
}

export function* setVideoInput({ payload }) {
  const { error } = yield call(selectVideoInput, payload);
  if (error) {
    yield call(displayMessage, {
      type: "error",
      message: "could not select video input device",
    });
  }
}

export function* setAudioOutput({ payload }) {
  const { error } = yield call(selectAudioOutput, payload);
  if (error) {
    yield call(displayMessage, {
      type: "error",
      message: "sdk: failed to select audio output device",
    });
  }
}
