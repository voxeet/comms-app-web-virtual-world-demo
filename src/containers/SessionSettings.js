import { connect } from "react-redux";

import { application, session } from "../store/actions";
import SessionSettings from "../components/screens/sessionSettings/SessionSettings";

const mapStateToProps = (state) => ({});
const mapDispatchToProps = {
  open: session.open,
  close: session.close,
  ready: application.ready,
};

export default connect(mapStateToProps, mapDispatchToProps)(SessionSettings);
