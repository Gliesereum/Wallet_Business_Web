const actions = {
  GET_CORPORATIONS: "GET_CORPORATIONS",
  UPDATE_CORPORATION: "UPDATE_CORPORATION",
  DELETE_CORPORATION: "DELETE_CORPORATION",
  ADD_CORPORATION: "ADD_CORPORATION",

  $getCorporations: corporations => async dispatch => {
    await dispatch({
      type: actions.GET_CORPORATIONS,
      payload: corporations,
    });
  },

  $updateCorporation: corporation => ({
    type: actions.UPDATE_CORPORATION,
    payload: corporation,
  }),

  $addCorporation: corporation => ({
    type: actions.ADD_CORPORATION,
    payload: corporation,
  }),

  $deleteCorporation: id => ({
    type: actions.DELETE_CORPORATION,
    payload: id,
  })
};

export default actions;
