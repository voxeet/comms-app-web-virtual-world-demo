import { connect } from "react-redux";

import { spatial } from "../store/actions";
import Conference from "../components/screens/conference/Conference";
import { createSelector } from "reselect";

const getConferenceId = (state) =>
  state.application["@@/data"].currentConferenceID;

const getParticipantID = (state) =>
  state.application["@@/data"].localParticipantID;

const getConferences = (state) => state.entities.conferences;

const getParticipantsIds = createSelector(
  [getParticipantID, getConferenceId, getConferences],
  (participantId, conferenceId, conferences) => {
    if (!conferences) return [];
    const conference = conferences[conferenceId];
    return conference.participants.filter((id) => id !== participantId);
  }
);

const getMainStageStreamId = createSelector(
  [getConferenceId, getConferences],
  (id, conferences) => {
    if (!conferences) return null;
    const conference = conferences[id];
    return (
      conference.mainStageStreams &&
      conference.mainStageStreams.length > 0 &&
      conference.mainStageStreams[conference.mainStageStreams.length - 1]
    );
  }
);

const getSecondStageStreamId = createSelector(
  [getConferenceId, getConferences],
  (id, conferences) => {
    if (!conferences) return null;
    const conference = conferences[id];
    return (
      conference.secondStageStreams &&
      conference.secondStageStreams.length > 0 &&
      conference.secondStageStreams[conference.secondStageStreams.length - 1]
    );
  }
);

const getScreenSharingStreamId = createSelector(
  [getConferenceId, getConferences],
  (id, conferences) => {
    if (!conferences) return null;
    const conference = conferences[id];
    return (
      conference.screenShareStreams &&
      conference.screenShareStreams.length > 0 &&
      conference.screenShareStreams[0].streamID
    );
  }
);

const mapStateToProps = (state) => {
  return {
    localParticipantId: getParticipantID(state),
    remoteParticipantIds: getParticipantsIds(state),
    screenShareStreamId: getScreenSharingStreamId(state),
    mainStageStreamId: getMainStageStreamId(state),
    secondStageStreamId: getSecondStageStreamId(state),
  };
};

const mapDispatchToProps = {
  setSpatialEnvironment: spatial.setSpatialEnvironment,
};

export default connect(mapStateToProps, mapDispatchToProps)(Conference);
