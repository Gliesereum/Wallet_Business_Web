const actions = {
  GET_PHRASES: 'GET_PHRASES',
  UPDATE_PHRASE: 'UPDATE_PHRASE',

  $getPhrases: phrases => ({
    type: actions.GET_PHRASES,
    payload: phrases,
  }),

  $updatePhrase: (code, isoKey, phrase) => ({
    type: actions.UPDATE_PHRASE,
    payload: {
      code,
      isoKey,
      phrase,
    },
  }),
};

export default actions;
