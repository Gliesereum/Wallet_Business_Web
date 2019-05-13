import {cookieStorage} from '../../utils';

const actions = {
  CHECK_AUTHENTICATE: 'CHECK_AUTHENTICATE',
  SIGNOUT_USER: 'SIGNOUT_USER',

  UPDATE_USER_DATA: 'UPDATE_USER_DATA',
  ADD_EMAIL: 'ADD_EMAIL',
  VERIFY_EMAIL: 'VERIFY_EMAIL',

  $checkAuthenticate: (tokenInfo) => {
    if (tokenInfo) {
      const {accessExpirationDate, accessToken, refreshToken, refreshExpirationDate} = tokenInfo;
      cookieStorage.set('access_token', accessToken, {expires: new Date(accessExpirationDate), path: '/'});
      cookieStorage.set('refresh_token', refreshToken, {expires: new Date(refreshExpirationDate), path: '/'});
    }

    return ({
      type: actions.CHECK_AUTHENTICATE,
    });
  },

  $updateUserData: user => ({
    type: actions.UPDATE_USER_DATA,
    payload: user,
  }),

  $addUserEmail: email => ({
    type: actions.ADD_EMAIL,
    payload: email,
  }),

  $verifyUserEmail: email => ({
    type: actions.VERIFY_EMAIL,
    payload: email,
  }),

  $signOut: () => async dispatch => {
    cookieStorage.remove('access_token');
    cookieStorage.remove('refresh_token');

    await dispatch({type: actions.SIGNOUT_USER});
  }
};

export default actions;
