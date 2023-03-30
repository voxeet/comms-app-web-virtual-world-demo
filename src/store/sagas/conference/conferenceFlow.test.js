import conferenceFlow from "./conferenceFlow";
import { takeEvery, takeLatest } from "redux-saga/effects";
import { application, authentication } from "../../effects";
import { conference, devices, spatial } from "../../actions";
import {
  create,
  join,
  leave,
  startBroadcastVideoOnMainStage,
  startBroadcastVideoOnSecondStage,
  stopBroadcastVideoOnMainStage,
  stopBroadcastVideoOnSecondStage,
} from "./conference";
import { startAudio, stopAudio } from "./audio";
import { recordConference, stopRecordingConference } from "./record";
import { startVideo, stopVideo } from "./video";
import { addParticipant } from "../../effects/conference";
import { watchParticipant } from "./speaker";
import { startScreenShare, stopScreenShare } from "./screenShare";
import {
  enumerateAudioInputDevices,
  enumerateAudioOutputDevices,
  enumerateVideoInputDevices,
  getAudioInputDevice,
  getAudioOutputDevice,
  getVideoInputDevice,
  setAudioInput,
  setAudioOutput,
  setVideoInput,
} from "./devices";
import {
  setParticipantDirection,
  setParticipantLocation,
  setParticipantPosition,
  setSpatialEnvironment,
} from "./spatial";
import initialize from "./initialize";
import { watchLocations } from "./watchLocations";
import { vi, describe, expect, it } from "vitest";

vi.mock("@voxeet/voxeet-web-sdk", () => ({
  default: {},
}));

describe("conferenceFlow test suite", () => {
  it("should do the flow", () => {
    const generator = conferenceFlow();

    expect(generator.next().value).toEqual(
      takeEvery(authentication.setToken, initialize)
    );
    expect(generator.next().value).toEqual(
      takeEvery(conference.create, create)
    );
    expect(generator.next().value).toEqual(takeEvery(conference.join, join));
    expect(generator.next().value).toEqual(takeEvery(conference.leave, leave));
    expect(generator.next().value).toEqual(
      takeEvery(conference.record, recordConference)
    );
    expect(generator.next().value).toEqual(
      takeEvery(conference.stopRecording, stopRecordingConference)
    );
    expect(generator.next().value).toEqual(
      takeEvery(conference.startVideo, startVideo)
    );
    expect(generator.next().value).toEqual(
      takeEvery(conference.stopVideo, stopVideo)
    );
    expect(generator.next().value).toEqual(
      takeEvery(conference.startLocalAudio, startAudio)
    );
    expect(generator.next().value).toEqual(
      takeEvery(conference.stopLocalAudio, stopAudio)
    );
    expect(generator.next().value).toEqual(
      takeEvery(addParticipant, watchParticipant)
    );
    expect(generator.next().value).toEqual(
      takeEvery(conference.startScreenShare, startScreenShare)
    );
    expect(generator.next().value).toEqual(
      takeEvery(conference.stopScreenShare, stopScreenShare)
    );

    expect(generator.next().value).toEqual(
      takeEvery(devices.listAudioOutputDevices, enumerateAudioOutputDevices)
    );

    expect(generator.next().value).toEqual(
      takeEvery(devices.listAudioInputDevices, enumerateAudioInputDevices)
    );

    expect(generator.next().value).toEqual(
      takeEvery(devices.listVideoInputDevices, enumerateVideoInputDevices)
    );

    expect(generator.next().value).toEqual(
      takeEvery(devices.getAudioInputDevice, getAudioInputDevice)
    );

    expect(generator.next().value).toEqual(
      takeEvery(devices.getAudioOutputDevice, getAudioOutputDevice)
    );

    expect(generator.next().value).toEqual(
      takeEvery(devices.getVideoInputDevice, getVideoInputDevice)
    );

    expect(generator.next().value).toEqual(
      takeEvery(devices.setAudioInput, setAudioInput)
    );

    expect(generator.next().value).toEqual(
      takeEvery(devices.setAudioOutput, setAudioOutput)
    );
    expect(generator.next().value).toEqual(
      takeEvery(devices.setVideoInput, setVideoInput)
    );

    expect(generator.next().value).toEqual(
      takeEvery(spatial.setSpatialEnvironment, setSpatialEnvironment)
    );

    expect(generator.next().value).toEqual(
      takeEvery(spatial.setParticipantLocation, setParticipantLocation)
    );

    expect(generator.next().value).toEqual(
      takeLatest(application.setCurrentConferenceID, watchLocations)
    );

    expect(generator.next().value).toEqual(
      takeEvery(
        conference.startVideoOnMainStage,
        startBroadcastVideoOnMainStage
      )
    );

    expect(generator.next().value).toEqual(
      takeEvery(conference.stopVideoOnMainStage, stopBroadcastVideoOnMainStage)
    );

    expect(generator.next().value).toEqual(
      takeEvery(
        conference.startVideoOnSecondStage,
        startBroadcastVideoOnSecondStage
      )
    );

    expect(generator.next().value).toEqual(
      takeEvery(
        conference.stopVideoOnSecondStage,
        stopBroadcastVideoOnSecondStage
      )
    );

    expect(generator.next().value).toEqual(
      takeEvery(spatial.setParticipantPosition, setParticipantPosition)
    );

    expect(generator.next().value).toEqual(
      takeEvery(spatial.setParticipantDirection, setParticipantDirection)
    );

    expect(generator.next().done).toBeTruthy();
  });
});
