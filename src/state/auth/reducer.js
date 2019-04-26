import actions from "./action";
import {createReducer} from "../../utils";

const initState = {
  authenticated: false,
  token: null,
  user: {},
  email: null,
  corporations: [],
};

const initReducers = {
  [actions.LOGIN_USER]: (state, payload) => {
    return {
      ...state,
      user: payload,
      authenticated: true,
    };
  },
};

export default createReducer(initState, initReducers);