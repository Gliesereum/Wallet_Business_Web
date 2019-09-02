import actions from './action';
import { createReducer } from '../../utils';

const initState = {
  phrases: [],
};

const initReducers = {
  [actions.GET_PHRASES]: (state, payload) => ({
    ...state,
    phrases: payload,
  }),
};

export default createReducer(initState, initReducers);
