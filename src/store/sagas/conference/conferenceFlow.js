import { takeEvery, takeLatest } from "redux-saga/effects";

import { application, authentication } from "../../effects";
import { conference, devices, spatial } from "../../actions";
import { stopVideo, startVideo } from "./video";
import { startAudio, stopAudio } from "./audio";
import { recordConference, stopRecordingConference } from "./record";
import {
  create,
  join,
  leave,
  startBroadcastVideoOnMainStage,
  stopBroadcastVideoOnMainStage,
  startBroadcastVideoOnSecondStage,
  stopBroadcastVideoOnSecondStage,
} from "./conference";
import { watchParticipant } from "./speaker";
import { startScreenShare, stopScreenShare } from "./screenShare";
import {
  enumerateVideoInputDevices,
  enumerateAudioOutputDevices,
  enumerateAudioInputDevices,
  setAudioInput,
  setAudioOutput,
  setVideoInput,
  getAudioInputDevice,
  getVideoInputDevice,
  getAudioOutputDevice,
} from "./devices";
import {
  setParticipantDirection,
  setParticipantLocation,
  setParticipantPosition,
  setSpatialEnvironment,
} from "./spatial";
import { addParticipant } from "../../effects/conference";
import initialize from "./initialize";
import { watchLocations } from "./watchLocations";

export default function* conferenceFlow() {
  yield takeEvery(authentication.setToken, initialize);
  yield takeEvery(conference.create, create);
  yield takeEvery(conference.join, join);
  yield takeEvery(conference.leave, leave);
  yield takeEvery(conference.record, recordConference);
  yield takeEvery(conference.stopRecording, stopRecordingConference);
  yield takeEvery(conference.startVideo, startVideo);
  yield takeEvery(conference.stopVideo, stopVideo);
  yield takeEvery(conference.startLocalAudio, startAudio);
  yield takeEvery(conference.stopLocalAudio, stopAudio);
  yield takeEvery(addParticipant, watchParticipant);
  yield takeEvery(conference.startScreenShare, startScreenShare);
  yield takeEvery(conference.stopScreenShare, stopScreenShare);

  yield takeEvery(devices.listAudioOutputDevices, enumerateAudioOutputDevices);
  yield takeEvery(devices.listAudioInputDevices, enumerateAudioInputDevices);
  yield takeEvery(devices.listVideoInputDevices, enumerateVideoInputDevices);

  yield takeEvery(devices.getAudioInputDevice, getAudioInputDevice);
  yield takeEvery(devices.getAudioOutputDevice, getAudioOutputDevice);
  yield takeEvery(devices.getVideoInputDevice, getVideoInputDevice);

  yield takeEvery(devices.setAudioInput, setAudioInput);
  yield takeEvery(devices.setAudioOutput, setAudioOutput);
  yield takeEvery(devices.setVideoInput, setVideoInput);

  yield takeEvery(spatial.setSpatialEnvironment, setSpatialEnvironment);
  yield takeEvery(spatial.setParticipantLocation, setParticipantLocation);
  yield takeLatest(application.setCurrentConferenceID, watchLocations);
  yield takeEvery(
    conference.startVideoOnMainStage,
    startBroadcastVideoOnMainStage
  );
  yield takeEvery(
    conference.stopVideoOnMainStage,
    stopBroadcastVideoOnMainStage
  );
  yield takeEvery(
    conference.startVideoOnSecondStage,
    startBroadcastVideoOnSecondStage
  );
  yield takeEvery(
    conference.stopVideoOnSecondStage,
    stopBroadcastVideoOnSecondStage
  );
  yield takeEvery(spatial.setParticipantPosition, setParticipantPosition);
  yield takeEvery(spatial.setParticipantDirection, setParticipantDirection);
}
