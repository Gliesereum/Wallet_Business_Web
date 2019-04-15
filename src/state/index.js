import configureStore from './store';
import appActions from './app/action';

export const store = configureStore();

export const actions = {
	app: appActions
};
