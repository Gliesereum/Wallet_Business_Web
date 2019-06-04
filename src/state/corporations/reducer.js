import actions from './action';
import { createReducer } from '../../utils';

const initState = {
  corporations: [],
};

const initReducers = {
  [actions.GET_CORPORATIONS]: (state, payload) => ({
    ...state,
    corporations: payload,
  }),

  [actions.UPDATE_CORPORATION]: (state, payload) => {
    const changedCorpIndex = state.corporations.findIndex(corp => corp.id === payload.id);

    if (changedCorpIndex === -1) {
      return state;
    }
    const newCorps = state.corporations.slice();
    newCorps[changedCorpIndex] = payload;
    return {
      ...state,
      corporations: newCorps,
    };
  },

  [actions.ADD_CORPORATION]: (state, payload) => ({
    ...state,
    corporations: [...state.corporations, payload],
  }),

  [actions.DELETE_CORPORATION]: (state, payload) => ({
    ...state,
    corporations: state.corporations.filter(corp => corp.id !== payload),
  }),

};

export default createReducer(initState, initReducers);
