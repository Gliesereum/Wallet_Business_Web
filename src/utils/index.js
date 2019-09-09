import { createBrowserHistory } from 'history';
import Cookies from 'js-cookie';

import {
  withToken, asyncRequest, asyncUploadFile,
} from './request';
import {
  getFirstLetterName,
  getDate,
  checkInputHandler,
  isUserDataFull,
} from './helperFunc';
import fetchDecorator from './fetch';

const cookieStorage = Cookies;

const history = createBrowserHistory();

const createReducer = (initialState, reducerMap) => (state = initialState, action) => {
  const reducer = reducerMap[action.type];
  return reducer
    ? reducer(state, action.payload)
    : state;
};

export {
  cookieStorage,
  history,
  createReducer,
  withToken,
  asyncRequest,
  asyncUploadFile,
  getFirstLetterName,
  getDate,
  fetchDecorator,
  checkInputHandler,
  isUserDataFull,
};
