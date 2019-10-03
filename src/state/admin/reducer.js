import actions from './action';
import { createReducer } from '../../utils';

const initState = {
  languageData: {
    packages: [],
    phrases: {},
  },
  tags: [],
};

const initReducers = {
  [actions.GET_PHRASES]: (state, payload) => ({
    ...state,
    languageData: payload,
  }),

  [actions.UPDATE_PHRASE]: (state, payload) => ({
    ...state,
    languageData: {
      packages: state.languageData.packages,
      phrases: {
        ...state.languageData.phrases,
        [payload.code]: {
          ...state.languageData.phrases[payload.code],
          [payload.isoKey]: payload.phrase,
        },
      },
    },
  }),

  [actions.GET_TAGS]: (state, tags) => ({
    ...state,
    tags,
  }),

  [actions.ADD_TAG]: (state, newTag) => ({
    ...state,
    tags: [
      ...state.tags,
      newTag,
    ],
  }),

  [actions.UPDATE_TAG]: (state, updatedTag) => {
    const updatedTagIndex = state.tags.findIndex(item => item.id === updatedTag.id);
    const updatedTagsArray = [
      ...state.tags.slice(0, updatedTagIndex),
      updatedTag,
      ...state.tags.slice(updatedTagIndex + 1),
    ];
    return {
      ...state,
      tags: updatedTagsArray,
    };
  },

  [actions.DELETE_TAG]: (state, deletedTag) => ({
    ...state,
    tags: state.tags.filter(tag => tag.id !== deletedTag.id),
  }),
};

export default createReducer(initState, initReducers);
