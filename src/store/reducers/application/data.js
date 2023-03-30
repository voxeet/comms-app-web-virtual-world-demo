import {
  setLocalParticipantID,
  setCurrentConferenceID,
  leaveConference,
  setCurrentDeviceID,
  addMessageID,
  removeMessageID,
} from "../../effects/application";
import { opened } from "../../effects/session";

import { handleEffects } from "../../utils/store";

const initialState = {
  localParticipantID: null,
  currentConferenceID: null,
  currentDeviceID: null,
  currentSessionID: null,
  messages: [],
};

export default handleEffects(
  {
    [opened]: (state, action) => ({
      ...state,
      currentSessionID: action.payload.id,
    }),
    [setLocalParticipantID]: (state, action) => ({
      ...state,
      localParticipantID: action.payload.id,
    }),
    [setCurrentConferenceID]: (state, action) => {
      return {
        ...state,
        currentConferenceID: action.payload.id,
      };
    },
    [setCurrentDeviceID]: (state, action) => ({
      ...state,
      currentDeviceID: action.payload.id,
    }),
    [leaveConference]: (state) => {
      const { currentDeviceID, currentSessionID } = state;
      return { currentDeviceID, currentSessionID };
    },
    [addMessageID]: (state, action) => {
      return {
        ...state,
        messages: [...(state.messages || []), action.payload.id],
      };
    },
    [removeMessageID]: (state, action) => {
      return {
        ...state,
        messages: state.messages.filter((id) => id !== action.payload.id),
      };
    },
  },
  initialState
);
