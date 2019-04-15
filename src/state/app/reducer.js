import actions from "./action";
import {createReducer} from "../../utils";

const initState = {
	loading: true,
	message: "Start server connect!",
	error: undefined
};

const initReducers = {
	//-----------------------------------------------//
	[actions.START_APPLICATION]: (state) => {
		return {
			...state,
			message: "Start application!",
			loading: true
		}
	},

	[actions.START_APPLICATION]: (state) => {
		return {
			...state,
			message: 'Start connect server API!',
			loading: true
		}
	},

	[actions.SUCCESS_APPLICATION]: (state) => {
		return {
			...state,
			message: 'Success connect server API!',
			error: undefined
		}
	},

	[actions.ERROR_APPLICATION]: (state, payload) => {
		return {
			...state,
			message: "Error connect server API!",
			error: payload
		}
	},

	[actions.FINISH_APPLICATION]: (state) => {
		return {
			...state,
			message: "Finish!",
			loading: false
		}
	},
};

export default createReducer(initState, initReducers);
