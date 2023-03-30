import { createAction } from "../utils/store";

export const start = createAction("START_APPLICATION");
export const stop = createAction("STOP_APPLICATION");
export const ready = createAction("APPLICATION_READY");
export const navigate = createAction("NAVIGATE");
