import { setToken } from "../../../effects/authentication";
import { handleEffects } from "../../../utils/store";

const initialState = {
  token: null,
};

export default handleEffects(
  {
    [setToken]: (state, action) => ({ ...state, token: action.payload.token }),
  },
  initialState
);
