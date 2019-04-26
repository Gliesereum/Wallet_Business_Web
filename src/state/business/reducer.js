import actions from "./action";
import { createReducer } from "../../utils";

const initState = {
  business: [],
};

const initReducers = {
  [actions.GET_BUSINESS]: (state, payload) => {
    return {
      ...state,
      business: payload,
    };
  },

};

export default createReducer(initState, initReducers);
