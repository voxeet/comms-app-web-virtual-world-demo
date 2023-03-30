import { connect } from "react-redux";

import { devices } from "../store/actions";
import {
  getCurrentConferenceID,
  getLocalParticipantID,
} from "../store/reducers/application/selectors";
import {
  getEntity,
  getValidEntities,
} from "../store/reducers/entities/selectors";
import Settings from "../components/screens/settings/Settings";

const mapDispatchToProps = {
  setAudioInput: devices.setAudioInput,
  setAudioOutput: devices.setAudioOutput,
  setVideoInput: devices.setVideoInput,
  getAudioInputDevice: devices.getAudioInputDevice,
  getAudioOutputDevice: devices.getAudioOutputDevice,
  getVideoInputDevice: devices.getVideoInputDevice,
  listAudioInputDevices: devices.listAudioInputDevices,
  listAudioOutputDevices: devices.listAudioOutputDevices,
  listVideoInputDevices: devices.listVideoInputDevices,
};

const mapStateToProps = (state) => {
  const localParticipant = getEntity(
    state,
    "participants",
    getLocalParticipantID(state)
  );

  const conference = getEntity(
    state,
    "conferences",
    getCurrentConferenceID(state)
  );

  const audioInputDevicesIDs = localParticipant.audioInputDevices;
  const audioOutputDevicesIDs = localParticipant.audioOutputDevices;
  const videoInputDevicesIDs = localParticipant.videoInputDevices;

  const audioInputDevices = getValidEntities(
    state,
    "devices",
    audioInputDevicesIDs
  );
  const audioOutputDevices = getValidEntities(
    state,
    "devices",
    audioOutputDevicesIDs
  );
  const videoInputDevices = getValidEntities(
    state,
    "devices",
    videoInputDevicesIDs
  );

  return {
    conference,
    localParticipant,
    audioInputDevices,
    audioOutputDevices,
    videoInputDevices,
    selectedAudioInputDeviceId: localParticipant.selectedAudioInputDeviceId,
    selectedAudioOutputDeviceId: localParticipant.selectedAudioOutputDeviceId,
    selectedVideoInputDeviceId: localParticipant.selectedVideoInputDeviceId,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Settings);
