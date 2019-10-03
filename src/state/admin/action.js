const actions = {
  GET_PHRASES: 'GET_PHRASES',
  UPDATE_PHRASE: 'UPDATE_PHRASE',

  GET_TAGS: 'GET_TAGS',
  ADD_TAG: 'ADD_TAG',
  UPDATE_TAG: 'UPDATE_TAG',
  DELETE_TAG: 'DELETE_TAG',

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

  $getTags: tags => ({
    type: actions.GET_TAGS,
    payload: tags,
  }),

  $addTag: tag => ({
    type: actions.ADD_TAG,
    payload: tag,
  }),

  $updateTag: tag => ({
    type: actions.UPDATE_TAG,
    payload: tag,
  }),

  $deleteTag: tagId => ({
    type: actions.DELETE_TAG,
    payload: tagId,
  }),
};

export default actions;
