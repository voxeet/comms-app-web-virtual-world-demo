import { connect } from "react-redux";

import { conference, spatial } from "../store/actions";
import { getEntity } from "../store/reducers/entities/selectors";
import { getLocalParticipantID } from "../store/reducers/application/selectors";
import { convertStringToHexaColor } from "../helpers/colors";
import { LocalParticipant } from "../components/technical/3DSpatialScene/LocalParticipant";
import { isValid } from "../dataDefinitions/defect";

const mapStateToProps = (state) => {
  const localParticipant = getEntity(
    state,
    "participants",
    getLocalParticipantID(state)
  );

  if (!isValid(localParticipant)) return { id: null, name: null, color: "red" };

  return {
    id: localParticipant.id,
    name: localParticipant.name,
    color: convertStringToHexaColor(localParticipant.id),
    type: (localParticipant && localParticipant.type) || "user",
  };
};

const mapDispatchToProps = {
  stopAudio: conference.stopLocalAudio,
  startAudio: conference.startLocalAudio,
  stopVideo: conference.stopVideo,
  startVideo: conference.startVideo,
  setPosition: spatial.setParticipantPosition,
  setDirection: spatial.setParticipantDirection,
  setLocation: spatial.setParticipantLocation,
  fetchRemoteParticipantsLocations: spatial.fetchRemoteParticipantsLocations,
};

export default connect(mapStateToProps, mapDispatchToProps)(LocalParticipant);
