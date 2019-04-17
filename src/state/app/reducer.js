import actions from "./action";
import {createReducer} from "../../utils";

const initState = {
	status: undefined,
	message: "Start server connect!",
	error: undefined
};

const initReducers = {
	//-----------------------------------------------//
	[actions.APP_STATUS]: (state, payload) => {
		return {
			...state,
			status: payload,
		}
	},
};

export default createReducer(initState, initReducers);
