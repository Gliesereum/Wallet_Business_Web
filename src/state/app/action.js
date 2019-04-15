const actions = {

	START_APPLICATION: "@@START_APPLICATION",
	SUCCESS_APPLICATION: "@@SUCCESS_APPLICATION",
	ERROR_APPLICATION: "@@ERROR_APPLICATION",
	FINISH_APPLICATION: "@@FINISH_APPLICATION",

	/* -- Method (Start application) -- */
	startApp: (socket) => {
		return async dispatch => {
			try {
				setTimeout(async () => {
					console.log(socket.id);
					await dispatch({type: actions.SUCCESS_APPLICATION});
				}, 800);

				setTimeout(async () => {
					await dispatch({type: actions.FINISH_APPLICATION})
				}, 1800);


			} catch (e) {
				dispatch({type: actions.ERROR_APPLICATION, payload: e});

				setTimeout(() => {
					dispatch({type: actions.FINISH_APPLICATION})
				}, 0);
			}
		}
	},
};

export default actions;
