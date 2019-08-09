import actions from './action';
import { createReducer } from '../../utils';

const initState = {
  authenticated: false,
  user: {},
  email: {},
};

const initReducers = {
  [actions.CHECK_AUTHENTICATE]: (state, isAuthenticated) => ({
    ...state,
    authenticated: isAuthenticated,
  }),

  [actions.UPDATE_USER_DATA]: (state, payload) => ({
    ...state,
    user: payload,
  }),

  [actions.ADD_EMAIL]: (state, payload) => ({
    ...state,
    email: payload,
  }),

  [actions.VERIFY_EMAIL]: (state, payload) => ({
    ...state,
    user: {
      ...state.user,
      verifiedStatus: 'VERIFIED',
    },
    email: payload,
  }),

  [actions.SIGNOUT_USER]: state => ({
    ...state,
    user: initState,
    authenticated: false,
  }),
};

export default createReducer(initState, initReducers);
