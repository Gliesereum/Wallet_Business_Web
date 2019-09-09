import {
  asyncRequest,
  withToken,
  cookieStorage,
  // isUserDataFull,
} from '../../utils';

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

  SET_LANGUAGE: 'SET_LANGUAGE',
  SET_LANG_PACK: 'SET_LANG_PACK',
  SET_LANG_PHRASES: 'SET_LANG_PHRASES',

  DATA_LOADING_STATUS: 'DATA_LOADING_STATUS',

  $setLanguage: (language) => {
    cookieStorage.set('_lgCp', language);
    return ({ type: actions.SET_LANGUAGE, payload: JSON.parse(language) });
  },

  $setLangPack: langPack => ({
    type: actions.SET_LANG_PACK,
    payload: langPack,
  }),

  $setLangPhrases: phrases => ({
    type: actions.SET_LANG_PHRASES,
    payload: phrases,
  }),

  $startApp: () => async (dispatch) => {
    await dispatch(actions.$appStatus('loading'));

    // check for server
    try {
      const { packages, phrases } = await asyncRequest({
        url: 'package/map/by-module?module=coupler-web',
        moduleUrl: 'language',
      });
      await dispatch(actions.$setLangPack(packages));
      await dispatch(actions.$setLangPhrases(phrases));

      const lang = await cookieStorage.get('_lgCp');

      if (!lang) {
        const defaultLangPack = packages.find(packageItem => packageItem.isoKey === 'ua');
        await cookieStorage.set('_lgCp', JSON.stringify(defaultLangPack));
        await dispatch({ type: actions.SET_LANGUAGE, payload: defaultLangPack });
      } else {
        await dispatch({ type: actions.SET_LANGUAGE, payload: JSON.parse(lang) });
      }
      await asyncRequest({ fullUrl: 'status' });

      const access_token = cookieStorage.get('access_token');
      const refresh_token = cookieStorage.get('refresh_token');
      const isWelcomePageWasShown = cookieStorage.get('isWelcomePageWasShown');

      const user = await getTokenAndUser(dispatch, access_token, refresh_token);

      if (!user) {
        await dispatch(actions.$appStatus('success'));
        return;
      }
      const email = await withToken(asyncRequest)({ url: 'email/by-user' }) || {};
      const { result: hasAdminRights } = await withToken(asyncRequest)({
        url: 'group-user/user-have-group?groupPurpose=COUPLER_ADMIN',
        moduleUrl: 'permission',
      });

      await dispatch(authActions.$updateUserData(user));
      await dispatch(authActions.$addUserEmail(email));
      await dispatch(authActions.$checkAdminRights(hasAdminRights));

      const businessesUrl = 'business/by-current-user/like-owner';
      const corporationsUrl = 'corporation/by-user';

      const business = await withToken(asyncRequest)({ url: businessesUrl, moduleUrl: 'karma' }) || [];
      const corporations = await withToken(asyncRequest)({ url: corporationsUrl }) || [];

      await dispatch(businessActions.$getBusiness(business));
      await dispatch(corporationsActions.$getCorporations(corporations));

      // const showWelcomePage = !!(isUserDataFull(user) && !(corporations.length) && !isWelcomePageWasShown);
      await dispatch(authActions.$setShowPropWelcomePage(JSON.stringify(!isWelcomePageWasShown), isWelcomePageWasShown));

      await dispatch(actions.$appStatus('success'));
    } catch (e) {
      await dispatch(actions.$appStatus('error'));
    }
  },

  $appStatus: payload => ({ type: actions.APP_STATUS, payload }),
};

export default actions;
