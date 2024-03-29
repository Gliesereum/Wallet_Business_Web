import actions from './action';
import { createReducer } from '../../utils';

const initState = {
  appStatus: 'loading',
  status: null,
  loading: false,
  defaultLanguage: {},
  langPack: [],
  phrases: {},
  message: 'Start server connect!',
  error: undefined,
};

const initReducers = {
  [actions.APP_STATUS]: (state, { appStatus, status = null }) => ({
    ...state,
    appStatus,
    status,
  }),

  [actions.SET_LANGUAGE]: (state, payload) => ({
    ...state,
    defaultLanguage: payload,
  }),

  [actions.SET_LANG_PACK]: (state, payload) => ({
    ...state,
    langPack: payload,
  }),

  [actions.SET_LANG_PHRASES]: (state, payload) => ({
    ...state,
    phrases: payload,
  }),

  [actions.DATA_LOADING_STATUS]: (state, payload) => ({
    ...state,
    loading: payload,
  }),
};

export default createReducer(initState, initReducers);
