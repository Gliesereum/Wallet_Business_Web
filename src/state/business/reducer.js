import actions from './action';
import { createReducer } from '../../utils';

const initState = {
  business: [],
  businessTypes: [],
  businessCategories: [],
  servicePrices: {},
  businessPackages: {},
  businessOrders: {},
};

const initReducers = {
  [actions.GET_BUSINESS]: (state, payload) => ({
    ...state,
    business: payload,
  }),

  [actions.GET_BUSINESS_TYPES]: (state, payload) => ({
    ...state,
    businessTypes: payload || [],
  }),

  [actions.GET_BUSINESS_CATEGORIES]: (state, payload) => ({
    ...state,
    businessCategories: payload || [],
  }),

  [actions.UPDATE_BUSINESS]: (state, payload) => {
    const newBusiness = state.business.filter(b => b.id !== payload.id);
    return {
      ...state,
      business: [...newBusiness, payload],
    };
  },

  [actions.ADD_BUSINESS]: (state, payload) => ({
    ...state,
    business: [...state.business, payload],
  }),

  [actions.GET_SERVICE_PRICE]: (state, payload) => {
    if (!payload.length) return state;

    const { businessId } = payload[0];
    return {
      ...state,
      servicePrices: {
        ...state.servicePrices,
        [businessId]: payload,
      },
    };
  },

  [actions.UPDATE_SERVICE_PRICE]: (state, payload) => {
    const { businessId, id } = payload;
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
      },
    };
  },

  [actions.ADD_SERVICE_PRICE]: (state, payload) => {
    const { businessId } = payload;
    return {
      ...state,
      servicePrices: {
        ...state.servicePrices,
        [businessId]: [
          ...state.servicePrices[businessId],
          payload,
        ],
      },
    };
  },

  [actions.REMOVE_SERVICE_PRICE]: (state, payload) => {
    const { businessId, servicePriceId } = payload;
    return {
      ...state,
      servicePrices: {
        ...state.servicePrices,
        [businessId]: state.servicePrices[businessId].filter(item => item.id !== servicePriceId),
      },
    };
  },

  [actions.GET_BUSINESS_PACKAGES]: (state, payload) => {
    if (!payload.length) return state;

    const { businessId } = payload[0];
    return {
      ...state,
      businessPackages: {
        ...state.businessPackages,
        [businessId]: payload,
      },
    };
  },

  [actions.UPDATE_BUSINESS_PACKAGE]: (state, payload) => {
    const businessPackages = state.businessPackages[payload.businessId];
    const packagesUpdatedIndex = businessPackages.findIndex(item => item.id === payload.id);
    const newArray = [
      ...businessPackages.slice(0, packagesUpdatedIndex),
      payload,
      ...businessPackages.slice(packagesUpdatedIndex + 1),
    ];
    return {
      ...state,
      businessPackages: {
        ...state.businessPackages,
        [state.businessPackages[payload.businessId]]: newArray,
      },
    };
  },

  [actions.ADD_BUSINESS_PACKAGE]: (state, payload) => {
    const businessPackages = state.businessPackages[payload.businessId];
    if (businessPackages && businessPackages.length) {
      // If there is not packages in business before creating this one
      return {
        ...state,
        businessPackages: {
          ...state.businessPackages,
          [payload.businessId]: [
            ...state.businessPackages[payload.businessId],
            payload,
          ],
        },
      };
    }

    return {
      ...state,
      businessPackages: {
        ...state.businessPackages,
        [payload.businessId]: [payload],
      },
    };
  },

  [actions.DELETE_BUSINESS_PACKAGE]: (state, { businessId, packageId }) => ({
    ...state,
    businessPackages: {
      ...state.businessPackages,
      [businessId]: [
        ...state.businessPackages[businessId].filter(item => item.id !== packageId),
      ],
    },
  }),

  [actions.UPDATE_SCHEDULE]: (state, scheduleList) => {
    const updatedBusinessIndex = state.business.findIndex(item => item.id === scheduleList[0].objectId);
    if (updatedBusinessIndex === -1) {
      return state;
    }
    return {
      ...state,
      business: [
        ...state.business.slice(0, updatedBusinessIndex),
        { ...state.business[updatedBusinessIndex], workTimes: scheduleList },
        ...state.business.slice(updatedBusinessIndex + 1),
      ],
    };
  },

  [actions.GET_BUSINESS_ORDERS]: (state, payload) => {
    const { ordersList, businessId } = payload;
    if (!ordersList.length) return state;

    return {
      ...state,
      businessOrders: {
        ...state.businessOrders,
        [businessId]: ordersList,
      },
    };
  },
};

export default createReducer(initState, initReducers);
