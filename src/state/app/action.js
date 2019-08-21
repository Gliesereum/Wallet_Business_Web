import { asyncRequest, withToken, cookieStorage } from '../../utils';

import authActions from '../auth/action';
import corporationsActions from '../corporations/action';
import businessActions from '../business/action';

const getTokenAndUser = async (dispatch, access_token, refresh_token) => {
  if (access_token && access_token !== 'undefined') {
    try {
      const { tokenInfo, user } = await asyncRequest({ url: `auth/check?accessToken=${access_token}` });

      if (tokenInfo && user) {
        await dispatch(authActions.$checkAuthenticate(true));
      }

      return user;
    } catch (e) {
      if (refresh_token && refresh_token !== 'undefined') {
        try {
          const { tokenInfo } = await asyncRequest({
            url: `auth/refresh?refreshToken=${refresh_token}`,
            method: 'POST',
          });
          await getTokenAndUser(dispatch, tokenInfo.accessToken, tokenInfo.refreshToken);
        } catch (err) {
          dispatch(authActions.$signOut());
        }
      } else {
        dispatch(authActions.$signOut());
      }
    }
  } else if (refresh_token && refresh_token !== 'undefined') {
    try {
      const { tokenInfo } = await asyncRequest({
        url: `auth/refresh?refreshToken=${refresh_token}`,
        method: 'POST',
      });
      await getTokenAndUser(dispatch, tokenInfo.accessToken, tokenInfo.refreshToken);
    } catch (err) {
      dispatch(authActions.$signOut());
    }
  } else {
    dispatch(authActions.$signOut());
  }
};

const actions = {
  APP_STATUS: 'APP_STATUS',
  DATA_LOADING_STATUS: 'DATA_LOADING_STATUS',
  SET_LANGUAGE: 'SET_LANGUAGE',

  $setLanguage: (language) => {
    cookieStorage.set('_lgCp', language.target.value);
    return ({ type: actions.SET_LANGUAGE, payload: JSON.parse(language.target.value) });
  },

  $startApp: () => async (dispatch) => {
    await dispatch(actions.$appStatus('loading'));

    const lang = await cookieStorage.get('_lgCp');

    if (!lang) {
      await cookieStorage.set('_lgCp', JSON.stringify({
        isoKey: 'uk',
        label: 'Українська',
        icon: '',
        direction: 'ltr',
        module: 'web',
      },));
    } else {
      await dispatch({ type: actions.SET_LANGUAGE, payload: JSON.parse(lang) });
    }

    // check for server
    try {
      await asyncRequest({ fullUrl: 'status' });
    } catch (e) {
      await dispatch(actions.$appStatus('error'));
    }

    const access_token = cookieStorage.get('access_token');
    const refresh_token = cookieStorage.get('refresh_token');

    const user = await getTokenAndUser(dispatch, access_token, refresh_token);
    const email = await withToken(asyncRequest)({ url: 'email/by-user' }) || {};

    await dispatch(authActions.$updateUserData(user));
    await dispatch(authActions.$addUserEmail(email));

    if (
      user
      && user.firstName
      && user.lastName
      && user.middleName
      && user.country
      && user.city
    ) {
      const businessesUrl = 'business/by-current-user/like-owner';
      const corporationsUrl = 'corporation/by-user';

      const business = await withToken(asyncRequest)({ url: businessesUrl, moduleUrl: 'karma' }) || [];
      const corporations = await withToken(asyncRequest)({ url: corporationsUrl }) || [];

      await dispatch(businessActions.$getBusiness(business));
      await dispatch(corporationsActions.$getCorporations(corporations));
    }

    await dispatch(actions.$appStatus('ready'));
  },

  $appStatus: payload => ({ type: actions.APP_STATUS, payload }),
};

export default actions;
