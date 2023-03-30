import omit from "lodash.omit";

import {
  addConference,
  addDevice,
  addParticipant,
  addStream,
  removeParticipant,
  removeStream,
  updateConference,
  updateDevice,
  updateParticipant,
  updateStream,
  addStreamToMainStage,
  removeStreamToMainStage,
  addStreamToSecondStage,
  removeStreamToSecondStage,
} from "../../effects/conference";
import { handleEffects } from "../../utils/store";
import { leaveConference } from "../../effects/application";
import { participantPositionSet } from "../../effects/spatial";
import { addMessage, removeMessage } from "../../effects/message";

const initialState = {};

const setEntityReducer = (state, action) => ({
  ...state,
  [action.payload.entityType]: {
    ...state[action.payload.entityType],
    ...action.payload.data,
  },
});

const removeEntityReducer = (state, action) => {
  const cleanedEntity = omit(
    state[action.payload.entityType],
    action.payload.id
  );
  return {
    ...state,
    [action.payload.entityType]: cleanedEntity,
  };
};

const updateEntityReducer = (state, action) => {
  return {
    ...state,
    [action.payload.entityType]: {
      ...state[action.payload.entityType],
      [action.payload.id]: {
        ...state[action.payload.entityType][action.payload.id],
        ...action.payload.data,
      },
    },
  };
};

export default handleEffects(
  {
    /*  [setEntities]: setEntitiesReducer,
        [setEntity]: setEntityReducer,
        [removeEntity]: removeEntityReducer,
        [updateEntity]: updateEntityReducer,*/
    [leaveConference]: () => initialState,
    [addParticipant]: setEntityReducer,
    [updateParticipant]: updateEntityReducer,
    [removeParticipant]: removeEntityReducer,
    [addStream]: setEntityReducer,
    [removeStream]: removeEntityReducer,
    [updateStream]: setEntityReducer,
    [updateConference]: updateEntityReducer,
    [addDevice]: setEntityReducer,
    [updateDevice]: updateEntityReducer,
    [addConference]: setEntityReducer,
    [participantPositionSet]: updateEntityReducer,
    [addStreamToMainStage]: updateEntityReducer,
    [removeStreamToMainStage]: updateEntityReducer,
    [addStreamToSecondStage]: updateEntityReducer,
    [removeStreamToSecondStage]: updateEntityReducer,
    [addMessage]: setEntityReducer,
    [removeMessage]: removeEntityReducer,
  },
  initialState
);
