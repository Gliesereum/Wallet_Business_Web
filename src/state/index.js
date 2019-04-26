import configureStore from './store';
import appActions from './app/action';
import authActions from './auth/action';
import corporationsActions from './corporations/action';

export const store = configureStore();

export const actions = {
	app: appActions,
	auth: authActions,
	corporations: corporationsActions,
};
