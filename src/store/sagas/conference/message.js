import { createId } from "@paralleldrive/cuid2";
import { addMessage } from "../../effects/message";
import { application } from "../../effects";
import { put, call } from "redux-saga/effects";

export function* displayMessage({ type, message }) {
  const id = yield call(createId);
  yield put(
    addMessage({
      entityType: "messages",
      data: {
        [id]: {
          type,
          message,
        },
      },
    })
  );

  yield put(application.addMessageID({ id }));
}
