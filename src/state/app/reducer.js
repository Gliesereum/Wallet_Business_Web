import actions from './action';
import {createReducer} from '../../utils';

const initState = {
  appStatus: undefined,
  dataLoading: false,
  message: 'Start server connect!',
  error: undefined
};

const initReducers = {
  //-----------------------------------------------//
  [actions.APP_STATUS]: (state, payload) => {
    return {
      ...state,
      appStatus: payload,
    }
  },

  [actions.DATA_LOADING_STATUS]: (state, payload) => {
    return {
      ...state,
      dataLoading: payload,
    }
  },
};

export default createReducer(initState, initReducers);
