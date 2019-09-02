const actions = {
  GET_PHRASES: 'GET_PHRASES',

  $getPhrases: phrases => ({
    type: actions.GET_PHRASES,
    payload: phrases,
  }),
};

export default actions;
