import { combineReducers } from "redux";

import authentication from "./authentication/authentication";
import data from "./data";

export default combineReducers({
  "@@/data": data,
  authentication,
});

//
// const Application = {
//   "@@/data": {
//     localParticipantID: 123,
//     currentConferenceID: 456
//   },
//   authentication: {
//     "token": "access_token",
//   }
// };
