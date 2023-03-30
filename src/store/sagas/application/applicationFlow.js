import { application } from "../../actions/index.js";
import navigate from "./application.js";
import { takeEvery } from "redux-saga/effects";

export default function* applicationFlow() {
  yield takeEvery(application.navigate, navigate);
}
