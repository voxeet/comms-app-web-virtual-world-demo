import { createEffect } from "../utils/store";

export const sdkInitialized = createEffect("SDK_INITIALIZED");

export const setLocalParticipantID = createEffect("SET_LOCAL_PARTICIPANT_ID");
export const setCurrentConferenceID = createEffect("SET_CURRENT_CONFERENCE_ID");

export const setCurrentDeviceID = createEffect("SET_CURRENT_DEVICE_ID");

export const leaveConference = createEffect("LEAVE_CONFERENCE");

export const addMessageID = createEffect("ADD_MESSAGE_ID");
export const removeMessageID = createEffect("REMOVE_MESSAGE_ID");
