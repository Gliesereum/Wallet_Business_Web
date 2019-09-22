import { cookieStorage } from '../../utils';

const actions = {
  CHECK_AUTHENTICATE: 'CHECK_AUTHENTICATE',
  SIGNOUT_USER: 'SIGNOUT_USER',

  UPDATE_USER_DATA: 'UPDATE_USER_DATA',
  ADD_EMAIL: 'ADD_EMAIL',
  VERIFY_EMAIL: 'VERIFY_EMAIL',

  CHECK_ADMIN_RIGHTS: 'CHECK_ADMIN_RIGHTS',
  SHOW_WELCOME_PAGE: 'SHOW_WELCOME_PAGE',

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

  $checkAdminRights: hasAdminRights => ({
    type: actions.CHECK_ADMIN_RIGHTS,
    payload: hasAdminRights,
  }),

  $setShowPropWelcomePage: (showWelcomePage, isWelcomePageWasShown = false) => {
    cookieStorage.set('isWelcomePageWasShown', isWelcomePageWasShown);
    return ({
      type: actions.SHOW_WELCOME_PAGE,
      payload: JSON.parse(showWelcomePage),
    });
  },

  $signOut: () => async (dispatch) => {
    cookieStorage.remove('access_token');
    cookieStorage.remove('refresh_token');

    await dispatch({ type: actions.SIGNOUT_USER });
  },
};

export default actions;
