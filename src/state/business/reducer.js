import actions from './action';
import {createReducer} from '../../utils';

const initState = {
  business: [],
  businessTypes: [],
  businessCategories: [],
  servicePrices: {},
};

const initReducers = {
  [actions.GET_BUSINESS]: (state, payload) => {
    return {
      ...state,
      business: payload,
    };
  },

  [actions.GET_BUSINESS_TYPES]: (state, payload) => {
    return {
      ...state,
      businessTypes: payload || [],
    };
  },

  [actions.GET_BUSINESS_CATEGORIES]: (state, payload) => {
    return {
      ...state,
      businessCategories: payload || [],
    };
  },

  [actions.UPDATE_BUSINESS]: (state, payload) => {
    const newBusiness = state.business.filter(b => b.id !== payload.id);
    return {
      ...state,
      business: [...newBusiness, payload],
    };
  },

  [actions.ADD_BUSINESS]: (state, payload) => {
    return {
      ...state,
      business: [...state.business, payload],
    };
  },

  [actions.GET_SERVICE_PRICE]: (state, payload) => {
    if (!payload.length) return state;

    const businessId = payload[0].businessId;
    return {
      ...state,
      servicePrices: {
        ...state.servicePrices,
        [businessId]: payload,
      },
    };
  },

  [actions.UPDATE_SERVICE_PRICE]: (state, payload) => {
    const {businessId, id} = payload;
    const updatedServices = state.servicePrices[businessId];
    const updatedServiceIndex = updatedServices.findIndex(item => item.id === id);
    const newServicesArray = [
      ...updatedServices.slice(0, updatedServiceIndex),
      payload,
      ...updatedServices.slice(updatedServiceIndex + 1),
    ];
    return {
      ...state,
      servicePrices: {
        ...state.servicePrices,
        [businessId]: newServicesArray,
      }
    };
  },

  [actions.ADD_SERVICE_PRICE]: (state, payload) => {
    const {businessId} = payload;
    return {
      ...state,
      servicePrices: {
        ...state.servicePrices,
        [businessId]: [
          ...state.servicePrices[businessId],
          payload,
        ],
      }
    };
  },

  [actions.REMOVE_SERVICE_PRICE]: (state, payload) => {
    const {businessId, servicePriceId} = payload;
    return {
      ...state,
      servicePrices: {
        ...state.servicePrices,
        [businessId]: state.servicePrices[businessId].filter(item => item.id !== servicePriceId),
      }
    };
  },

};

export default createReducer(initState, initReducers);
