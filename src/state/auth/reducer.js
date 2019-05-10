import actions from './action';
import {createReducer} from '../../utils';

const initState = {
  authenticated: false,
  user: {},
  email: null,
};

const initReducers = {
  [actions.CHECK_AUTHENTICATE]: (state) => {
    return {
      ...state,
      authenticated: true,
    }
  },

  [actions.UPDATE_USER_DATA]: (state, payload) => {
    return {
      ...state,
      user: payload,
    }
  },

  [actions.ADD_EMAIL]: (state, payload) => {
    return {
      ...state,
      email: payload,
    }
  },

  [actions.VERIFY_EMAIL]: (state, payload) => {
    return {
      ...state,
      user: {
        ...state.user,
        verifiedStatus: 'VERIFIED',
      },
      email: payload,
    }
  },

  [actions.SIGNOUT_USER]: (state) => {
    return {
      ...state,
      user: initState,
      authenticated: false,
    };
  },
};

export default createReducer(initState, initReducers);
