import { getEntity } from "../reducers/entities/selectors";

export const getParticipant = (state, id) =>
  getEntity(state, "participants", id);
