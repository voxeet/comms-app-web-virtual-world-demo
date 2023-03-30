import { connect } from "react-redux";

import { conference, devices } from "../store/actions";
import Commands from "../components/technical/commands/Commands";
import {
  getCurrentConferenceID,
  getLocalParticipantID,
} from "../store/reducers/application/selectors";
import { getEntity } from "../store/reducers/entities/selectors";

const mapDispatchToProps = {
  leave: conference.leave,
  record: conference.record,
  stopRecording: conference.stopRecording,
  startVideo: conference.startVideo,
  stopVideo: conference.stopVideo,
  startAudio: conference.startLocalAudio,
  stopAudio: conference.stopLocalAudio,
  startScreenShare: conference.startScreenShare,
  stopScreenShare: conference.stopScreenShare,
  listAudioDevices: devices.listAudioDevices,
  listVideoDevices: devices.listVideoDevices,
  setAudioInput: devices.setAudioInput,
  setAudioOutput: devices.setAudioOutput,
  setVideoInput: devices.setVideoInput,
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

  const screenShareStream =
    conference.screenShareStreams &&
    conference.screenShareStreams.length > 0 &&
    conference.screenShareStreams[0];

  const sharing =
    screenShareStream &&
    screenShareStream.participantID === localParticipant.id;

  return {
    localParticipantID: localParticipant.id,
    hasVideo: localParticipant.video,
    hasAudio: localParticipant.audio,
    recording: !!conference.recording,
    screenSharing: sharing,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Commands);
