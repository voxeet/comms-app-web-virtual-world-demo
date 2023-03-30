import { connect } from "react-redux";

import { conference } from "../store/actions";
import { getEntity } from "../store/reducers/entities/selectors";
import ScreenSharing from "../components/technical/3DSpatialScene/ScreenSharing";

const mapStateToProps = (state, props) => {
  const stream = getEntity(state, "streams", props.id);

  return { stream };
};

const mapDispatchToProps = {
  startVideo: conference.startVideoOnMainStage,
  stopVideo: conference.stopVideoOnMainStage,
};

export default connect(mapStateToProps, mapDispatchToProps)(ScreenSharing);
