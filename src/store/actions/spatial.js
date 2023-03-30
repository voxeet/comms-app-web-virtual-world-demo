import { createAction } from "../utils/store";

export const setParticipantPosition = createAction("SET_PARTICIPANT_POSITION");
export const setSpatialEnvironment = createAction("SET_SPATIAL_ENVIRONMENT");
export const setParticipantDirection = createAction(
  "SET_PARTICIPANT_DIRECTION"
);

export const fetchRemoteParticipantsLocations = createAction(
  "FETCH_REMOTE_PARTICIPANTS_LOCATIONS"
);

// shared
export const setParticipantLocation = createAction("SET_PARTICIPANT_LOCATION");
