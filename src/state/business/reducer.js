import actions from './action';
import { createReducer } from '../../utils';

const initState = {
  business: [],
  chosenBusiness: null,
  servicePrices: {},
  businessPackages: {},
  workingSpaces: [],
  ordersPage: {
    number: 0,
    totalPages: 0,
    totalElements: 0,
  },
  orders: [],
  businessMedia: [],
  businessTags: [],
};

const initReducers = {
  [actions.GET_BUSINESS]: (state, payload) => ({
    ...state,
    business: payload,
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

  [actions.REMOVE_BUSINESS]: (state, businessId) => ({
    ...state,
    business: state.business.filter(item => item.id !== businessId),
  }),

  [actions.CHANGE_CHOSEN_BUSINESS]: (state, businessId) => ({
    ...state,
    chosenBusiness: state.business.find(item => item.id === businessId),
    businessMedia: businessId === null ? [] : state.businessMedia,
    businessTags: businessId === null ? [] : state.businessTags,
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
    const isServicePriceExist = state.servicePrices[businessId];

    return {
      ...state,
      servicePrices: {
        ...state.servicePrices,
        [businessId]: isServicePriceExist
          ? [
            ...state.servicePrices[businessId],
            payload,
          ] : [
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
    const { businessId, id } = payload;
    const businessPackages = state.businessPackages[businessId];
    const packagesUpdatedIndex = businessPackages.findIndex(item => item.id === id);
    const newArray = [
      ...businessPackages.slice(0, packagesUpdatedIndex),
      payload,
      ...businessPackages.slice(packagesUpdatedIndex + 1),
    ];
    return {
      ...state,
      businessPackages: {
        ...state.businessPackages,
        [businessId]: newArray,
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

  [actions.GET_WORKING_SPACES]: (state, payload) => ({
    ...state,
    workingSpaces: payload,
  }),

  [actions.ADD_WORKING_SPACE]: (state, payload) => ({
    ...state,
    workingSpaces: [
      ...state.workingSpaces,
      payload,
    ],
  }),

  [actions.UPDATE_WORKING_SPACE]: (state, payload) => {
    const updatedWorkingSpaceIndex = state.workingSpaces.findIndex(item => item.id === payload.id);
    const newWorkingSpaceArray = [
      ...state.workingSpaces.slice(0, updatedWorkingSpaceIndex),
      payload,
      ...state.workingSpaces.slice(updatedWorkingSpaceIndex + 1),
    ];
    return {
      ...state,
      workingSpaces: newWorkingSpaceArray,
    };
  },

  [actions.REMOVE_WORKER_FROM_OLD_WORKING_SPACE]: (state, { movedWorker }) => {
    const workingSpaceIndex = state.workingSpaces.findIndex(ws => ws.id === movedWorker.workingSpaceId);

    const modifiedWorkingSpaceWorkers = state.workingSpaces[workingSpaceIndex].workers
      .filter(worker => worker.id !== movedWorker.id);

    const modifiedWorkingSpace = {
      ...state.workingSpaces[workingSpaceIndex],
      workers: modifiedWorkingSpaceWorkers,
    };

    return {
      ...state,
      workingSpaces: [
        ...state.workingSpaces.slice(0, workingSpaceIndex),
        modifiedWorkingSpace,
        ...state.workingSpaces.slice(workingSpaceIndex + 1),
      ],
    };
  },

  [actions.DELETE_WORKING_SPACE]: (state, payload) => ({
    ...state,
    workingSpaces: [
      ...state.workingSpaces.filter(item => item.id !== payload),
    ],
  }),

  [actions.GET_BUSINESS_MEDIA]: (state, payload) => ({
    ...state,
    businessMedia: payload,
  }),

  [actions.ADD_BUSINESS_MEDIA]: (state, { newMedia, index }) => {
    const replacedMedia = state.businessMedia[index] || {};
    let newBusinessMediaArray = [];

    if (replacedMedia.id) { // update
      newBusinessMediaArray = [
        ...state.businessMedia.slice(0, index),
        {
          ...replacedMedia,
          url: newMedia,
        },
        ...state.businessMedia.slice(index + 1),
      ];
    } else { // add new
      newBusinessMediaArray = [
        ...state.businessMedia,
        { url: newMedia },
      ];
    }

    return {
      ...state,
      businessMedia: newBusinessMediaArray,
    };
  },

  [actions.DELETE_BUSINESS_MEDIA]: (state, id) => ({
    ...state,
    businessMedia: state.businessMedia.filter(item => item.id !== id),
  }),

  [actions.GET_BUSINESS_TAGS]: (state, tags) => ({
    ...state,
    businessTags: tags,
  }),

  [actions.GET_ORDERS]: (state, {
    content = [],
    totalElements,
    totalPages,
    number,
  }) => ({
    ...state,
    orders: content,
    ordersPage: {
      totalElements,
      totalPages,
      number: number + 1,
    },
  }),

  [actions.UPDATE_ORDER_STATUS]: (state, payload) => {
    const updatedOrderIndex = state.orders.findIndex(item => item.id === payload.id);
    const newOrdersArray = [
      ...state.orders.slice(0, updatedOrderIndex),
      payload,
      ...state.orders.slice(updatedOrderIndex + 1),
    ];

    return {
      ...state,
      orders: newOrdersArray,
    };
  },
};

export default createReducer(initState, initReducers);
