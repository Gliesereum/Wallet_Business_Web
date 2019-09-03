import actions from './action';
import { createReducer } from '../../utils';

const initState = {
  languageData: {
    packages: [],
    phrases: {},
  },
};

const initReducers = {
  [actions.GET_PHRASES]: (state, payload) => ({
    ...state,
    languageData: payload,
  }),

  [actions.UPDATE_PHRASE]: (state, payload) => ({
    ...state,
    languageData: {
      packages: state.languageData.packages,
      phrases: {
        ...state.languageData.phrases,
        [payload.code]: {
          ...state.languageData.phrases[payload.code],
          [payload.isoKey]: payload.phrase,
        },
      },
    },
  }),
};

export default createReducer(initState, initReducers);
