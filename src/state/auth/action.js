import { cookieStorage } from '../../utils';

const actions = {
  CHECK_AUTHENTICATE: 'CHECK_AUTHENTICATE',
  SIGNOUT_USER: 'SIGNOUT_USER',

  UPDATE_USER_DATA: 'UPDATE_USER_DATA',
  ADD_EMAIL: 'ADD_EMAIL',
  VERIFY_EMAIL: 'VERIFY_EMAIL',

  $checkAuthenticate: isAuth => ({
    type: actions.CHECK_AUTHENTICATE,
    payload: isAuth,
  }),

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

  $signOut: () => async (dispatch) => {
    cookieStorage.remove('access_token');
    cookieStorage.remove('refresh_token');

    await dispatch({ type: actions.SIGNOUT_USER });
  },
};

export default actions;
