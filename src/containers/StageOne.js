import { connect } from "react-redux";

import { conference } from "../store/actions";
import { getEntity } from "../store/reducers/entities/selectors";

import { isValid } from "../dataDefinitions/defect";
import Stage from "../components/technical/3DSpatialScene/Stage";
import {
  getCurrentConferenceID,
  getLocalParticipantID,
} from "../store/reducers/application/selectors";

const mapStateToProps = (state, props) => {
  const stream = getEntity(state, "streams", props.id);
  const local = getLocalParticipantID(state);

  const conference = getEntity(
    state,
    "conferences",
    getCurrentConferenceID(state)
  );

  const participantIds = isValid(conference) ? conference.participants : [];

  return { stream, participantIds, local };
};

const mapDispatchToProps = {
  startVideo: conference.startVideoOnMainStage,
  stopVideo: conference.stopVideoOnMainStage,
};

export default connect(mapStateToProps, mapDispatchToProps)(Stage);
