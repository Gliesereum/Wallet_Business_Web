import {createStore, combineReducers, applyMiddleware, compose} from 'redux';
import createLogger from 'redux-logger';
import thunk from 'redux-thunk';
import ReduxPromise from 'redux-promise';
import reducers from './reducers';

const composeEnhancers =
	typeof window === 'object' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
		? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
			// Specify extension’s options like name, actionsBlacklist, actionsCreators, serialize...
			// actionCreators
		})
		: compose;

export default function configureStore() {
	return createStore(
		combineReducers({
			...reducers
		}),
		{},
		composeEnhancers(applyMiddleware(ReduxPromise, thunk, createLogger))
	);
}
