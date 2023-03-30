import { connect } from "react-redux";

import { conference } from "../store/actions";
import ConferenceSettings from "../components/screens/conferenceSettings/ConferenceSettings";

const mapStateToProps = (state) => ({});
const mapDispatchToProps = {
  create: conference.create,
  join: conference.join,
  leave: conference.leave,
};

export default connect(mapStateToProps, mapDispatchToProps)(ConferenceSettings);
