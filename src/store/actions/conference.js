import { createAction } from "../utils/store";

export const create = createAction("CREATE_CONFERENCE");
export const join = createAction("JOIN_CONFERENCE");
export const leave = createAction("LEAVE_CONFERENCE");
export const nearbyFound = createAction("NEARBY_FOUND");
export const nearbyLost = createAction("NEARBY_LOST");
export const record = createAction("RECORD_CONFERENCE");
export const stopRecording = createAction("STOP_RECORDING_CONFERENCE");
export const startVideo = createAction("START_VIDEO");
export const stopVideo = createAction("STOP_VIDEO");
export const startLocalAudio = createAction("START_LOCAL_AUDIO");
export const stopLocalAudio = createAction("STOP_LOCAL_AUDIO");
export const startRemoteAudio = createAction("START_REMOTE_AUDIO");
export const stopRemoteAudio = createAction("STOP_REMOTE_AUDIO");
export const stopBackgroundTask = createAction("STOP_BACKGROUND_TASK");
export const startScreenShare = createAction("START_SCREEN_SHARE");
export const stopScreenShare = createAction("STOP_SCREEN_SHARE");
export const startVideoOnMainStage = createAction("START_VIDEO_ON_MAIN_STAGE");
export const stopVideoOnMainStage = createAction("STOP_VIDEO_ON_MAIN_STAGE");
export const startVideoOnSecondStage = createAction(
  "START_VIDEO_ON_SECOND_STAGE"
);
export const stopVideoOnSecondStage = createAction(
  "STOP_VIDEO_ON_SECOND_STAGE"
);
