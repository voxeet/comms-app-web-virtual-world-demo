import { push } from "redux-first-history";
import { put, delay } from "redux-saga/effects";

export default function* navigate({ payload }) {
  yield delay(200);
  yield put(push(payload.to));
}
