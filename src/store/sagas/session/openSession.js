import { call, put } from "redux-saga/effects";
import { push } from "redux-first-history";
import { createId } from "@paralleldrive/cuid2";

import { session } from "../../effects";
import { openSession as open } from "../../services/session";
import { displayMessage } from "../conference/message";

export default function* openSession({ payload }) {
  const { error } = yield call(open, payload);
  if (error) {
    yield call(displayMessage, {
      type: "error",
      message: "could not open a session",
    });

    return;
  }

  const id = yield call(createId);
  yield put(session.opened({ id }));
  yield put(push("/conference"));
}
