import { asyncRequest, withToken, cookieStorage } from "../../utils";

import authActions from '../auth/action';

const actions = {
	APP_STATUS: 'APP_STATUS',

	startApp: () => async dispatch => {
		const access_token = cookieStorage.get("access_token");
		const refresh_token = cookieStorage.get("refresh_token");
		const statusUrl = "status";
		const userUrl = "user/me";
		const refreshUrl = "auth/refresh";

		try {
			await dispatch(actions.$appStatus('loading'));
			await asyncRequest({ fullUrl: statusUrl });
			if (access_token) {
				const user = await withToken(asyncRequest)({ url: userUrl });
				await dispatch(authActions.$authUser({ user }));
			} else if (refresh_token) {
				// TODO: переделать запрос;
				const tokenInfo = await asyncRequest({
					url: `${refreshUrl}?refreshToken=${refresh_token}`,
					method: "POST",
				});
				const user = await withToken(asyncRequest)({ url: userUrl });
				await dispatch(authActions.$authUser({ user, tokenInfo }));
			}
			await dispatch(actions.$appStatus('ready'));
		} catch (error) {
			await dispatch(actions.$appStatus('error'));
		}
	},

	$appStatus: (payload) => ({type: actions.APP_STATUS, payload}),
};

export default actions;
