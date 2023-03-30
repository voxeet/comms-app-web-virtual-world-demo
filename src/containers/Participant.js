import { connect } from "react-redux";
import { convertStringToHexaColor } from "../helpers/colors";

import Participant from "../components/technical/3DSpatialScene/Participant";
import { createSelector } from "reselect";

const getParticipants = (state) => state.entities.participants;

const getStreams = (state) => state.entities.streams;

const getId = (state, id) => id;

const getParticipantName = createSelector(
  [getParticipants, getId],
  (participants, id) => {
    if (!participants) return null;
    const participant = participants[id];
    const name = participant && participant.name;
    return name || "participant name";
  }
);

const getParticipant = createSelector(
  [getParticipants, getId],
  (participants, id) => participants && participants[id]
);

const getParticipantPosition = createSelector(
  [getParticipants, getId],
  (participants, id) => {
    if (!participants) return null;

    const participant = participants[id];
    const positionDefined =
      participant && participant.location && participant.location.position;

    return positionDefined
      ? [
          participant.location.position.x,
          participant.location.position.y < 1.2
            ? participant.location.position.y + 1.4
            : participant.location.position.y,
          participant.location.position.z,
        ]
      : null;
  }
);

const getParticipantDirection = createSelector(
  [getParticipants, getId],
  (participants, id) => {
    if (!participants) return null;
    const participant = participants[id];

    const directionDefined =
      participant && participant.location && participant.location.direction;

    return directionDefined
      ? [
          participant.location.direction.x,
          participant.location.direction.y === 0
            ? 0
            : -participant.location.direction.y * (Math.PI / 180),
          participant.location.direction.z,
        ]
      : null;
  }
);

const getParticipantStream = createSelector(
  [getParticipants, getId, getStreams],
  (participants, id, streams) => {
    if (!participants) return null;

    const participant = participants[id];
    if (!participant) return null;
    const streamId =
      participant.streams &&
      participant.streams.length > 0 &&
      participant.streams[0];

    if (streamId) {
      const stream = streams[streamId];
      //FIXME: there is some sync issue between video tag and stream updates.
      const videoTracks = stream.getVideoTracks();

      return videoTracks && videoTracks.length > 0 ? streams[streamId] : null;
    }
    return null;
  }
);

const mapStateToProps = (state, props) => {
  const name = getParticipantName(state, props.id);
  const participant = getParticipant(state, props.id);
  const stream = getParticipantStream(state, props.id);
  const position = getParticipantPosition(state, props.id);
  const direction = getParticipantDirection(state, props.id);

  return {
    id: props.id,
    name,
    color: convertStringToHexaColor(props.id),
    speaking: (participant && participant.isSpeaking) || false,
    position,
    direction,
    type: (participant && participant.type) || "user",
    video: (participant && participant.video) || false,
    audio: (participant && participant.audio) || false,
    stream,
  };
};

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(Participant);
