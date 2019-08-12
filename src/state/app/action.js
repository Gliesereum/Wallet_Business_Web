import { asyncRequest, withToken, cookieStorage } from '../../utils';

import authActions from '../auth/action';
import corporationsActions from '../corporations/action';
import businessActions from '../business/action';

const actions = {
  APP_STATUS: 'APP_STATUS',
  DATA_LOADING_STATUS: 'DATA_LOADING_STATUS',

  $startApp: () => async (dispatch) => {
    const access_token = cookieStorage.get('access_token');
    const refresh_token = cookieStorage.get('refresh_token');
    const statusUrl = 'status';
    const authCheckUrl = 'auth/check';
    const userUrl = 'user/me';
    const emailUrl = 'email/by-user';
    const refreshUrl = 'auth/refresh';
    const businessesUrl = 'business/by-current-user/like-owner';
    const corporationsUrl = 'corporation/by-user';
    const businessTypeUrl = 'business-category/business-type';
    const businessCategoryUrl = 'business-category';

    try {
      await dispatch(actions.$appStatus('loading'));
      await asyncRequest({ fullUrl: statusUrl });

      if (access_token && access_token !== 'undefined') {
        const { tokenInfo } = await asyncRequest({ url: `${authCheckUrl}?accessToken=${access_token}` });
        const user = await withToken(asyncRequest)({ url: userUrl }) || {};
        const email = await withToken(asyncRequest)({ url: emailUrl }) || {};
        const business = await withToken(asyncRequest)({ url: businessesUrl, moduleUrl: 'karma' }) || [];
        const corporations = await withToken(asyncRequest)({ url: corporationsUrl }) || [];
        const businessTypes = await withToken(asyncRequest)({ url: businessTypeUrl, moduleUrl: 'karma' });
        const businessCategories = await withToken(asyncRequest)({ url: businessCategoryUrl, moduleUrl: 'karma' });

        await dispatch(authActions.$updateUserData(user));
        await dispatch(authActions.$addUserEmail(email));
        await dispatch(businessActions.$getBusiness(business));
        await dispatch(corporationsActions.$getCorporations(corporations));
        await dispatch(businessActions.$getBusinessTypes(businessTypes));
        await dispatch(businessActions.$getBusinessCategories(businessCategories));
        await dispatch(authActions.$checkAuthenticate(tokenInfo));
      } else if (refresh_token && refresh_token !== 'undefined') {
        const tokenInfo = await asyncRequest({
          url: `${refreshUrl}?refreshToken=${refresh_token}`,
          method: 'POST',
        });
        await dispatch(authActions.$checkAuthenticate(tokenInfo));

        if (tokenInfo) {
          const user = await withToken(asyncRequest)({ url: userUrl });
          const email = await withToken(asyncRequest)({ url: emailUrl });

          await dispatch(authActions.$updateUserData(user));
          await dispatch(authActions.$addUserEmail(email));
        }
      }
      await dispatch(actions.$appStatus('ready'));
    } catch (error) {
      await dispatch(actions.$appStatus('error'));
    }
  },

  $appStatus: payload => ({ type: actions.APP_STATUS, payload }),

  $dataLoading: payload => ({ type: actions.DATA_LOADING_STATUS, payload }),
};

export default actions;
