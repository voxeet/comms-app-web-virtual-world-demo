import {
  createAction as createActionInternal,
  handleAction as handleActionInternal,
  handleActions as handleActionsInternal,
} from "redux-actions";

export const createAction = (actionName, ...rest) =>
  createActionInternal(`Action(${actionName})`, ...rest);
export const createEffect = createActionInternal;

export const handleEffect = handleActionInternal;
export const handleEffects = handleActionsInternal;
