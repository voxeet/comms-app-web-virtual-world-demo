import { connect } from "react-redux";

import ProtectedRoute from "../components/technical/protectedRoute/ProtectedRoute.jsx";
import { application } from "../store/actions/index.js";

const mapStateToProps = (state) => {
  return {
    isAuthenticated: state.application.authentication.token !== null,
  };
};

const mapDispatchToProps = {
  navigate: application.navigate,
};

export default connect(mapStateToProps, mapDispatchToProps)(ProtectedRoute);
