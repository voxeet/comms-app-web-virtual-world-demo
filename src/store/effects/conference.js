import { createEffect } from "../utils/store";

export const addStream = createEffect("ADD_STREAM");
export const updateStream = createEffect("UPDATE_STREAM");
export const removeStream = createEffect("REMOVE_STREAM");

export const addParticipant = createEffect("ADD_PARTICIPANT");
export const removeParticipant = createEffect("REMOVE_PARTICIPANT");
export const updateParticipant = createEffect("UPDATE_PARTICIPANT");

export const addConference = createEffect("ADD_CONFERENCE");
export const updateConference = createEffect("UPDATE_CONFERENCE");
export const removeConference = createEffect("REMOVE_CONFERENCE");

export const addDevice = createEffect("ADD_DEVICE");
export const updateDevice = createEffect("UPDATE_DEVICE");
export const removeDevice = createEffect("REMOVE_DEVICE");

export const created = createEffect("CREATED");
export const joined = createEffect("JOINED");
export const left = createEffect("LEFT");
export const ended = createEffect("ENDED");

export const recordingStarted = createEffect("RECORDING_STARTED");
export const recordingStopped = createEffect("RECORDING_STOPPED");
export const participantAudioStatus = createEffect("PARTICIPANT_AUDIO_STATUS");

export const addStreamToMainStage = createEffect(
  "ADD_VIDEO_STREAM_TO_MAIN_STAGE"
);

export const removeStreamToMainStage = createEffect(
  "REMOVE_VIDEO_STREAM_TO_MAIN_STAGE"
);

export const addStreamToSecondStage = createEffect(
  "ADD_VIDEO_STREAM_TO_SECOND_STAGE"
);

export const removeStreamToSecondStage = createEffect(
  "REMOVE_VIDEO_STREAM_TO_SECOND_STAGE"
);
