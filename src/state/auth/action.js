import { cookieStorage } from "../../utils";

const actions = {
  LOGIN_USER: "LOGIN_USER",

  AUTH_USER: "AUTH_USER",
  AUTH_TOKEN: "AUTH_TOKEN",
  AUTH_EMAIL: "AUTH_EMAIL",

  GET_CORPORATIONS: "GET_CORPORATIONS",

  $authUser: ({ user, tokenInfo }) => async dispatch => {
    if (tokenInfo) {
      const { accessExpirationDate, accessToken, refreshToken, refreshExpirationDate } = tokenInfo;
      cookieStorage.set('access_token', accessToken, { expires: new Date(accessExpirationDate), path: '' });
      cookieStorage.set('refresh_token', refreshToken, { expires: new Date(refreshExpirationDate), path: '' });
    }
    await dispatch({ type: actions.LOGIN_USER, payload: user });
  },

};

export default actions;
