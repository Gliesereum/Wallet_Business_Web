import {createBrowserHistory} from 'history';
import Cookies from 'js-cookie';

import {withToken, asyncRequest} from './request';

const cookieStorage = Cookies;

const history = createBrowserHistory();

const createReducer = (initialState, reducerMap) => {
  return (state = initialState, action) => {
    const reducer = reducerMap[action.type];
    return reducer
      ? reducer(state, action.payload)
      : state;
  };
};

export {
  cookieStorage,
  history,
  createReducer,
  withToken,
  asyncRequest
}

