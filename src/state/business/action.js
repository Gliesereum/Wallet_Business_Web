import { asyncRequest } from "../../utils";

const actions = {
  GET_BUSINESS_TYPES: "GET_BUSINESS_TYPES",
  GET_BUSINESS_CATEGORIES: "GET_BUSINESS_CATEGORIES",

  GET_BUSINESS: "GET_BUSINESS",
  UPDATE_BUSINESS: "UPDATE_BUSINESS",
  ADD_BUSINESS: "ADD_BUSINESS",

  GET_SERVICE_PRICE: "GET_SERVICE_PRICE",
  UPDATE_SERVICE_PRICE: "UPDATE_SERVICE_PRICE",
  ADD_SERVICE_PRICE: "ADD_SERVICE_PRICE",
  REMOVE_SERVICE_PRICE: "REMOVE_SERVICE_PRICE",

  $getBusiness: business => ({
    type: actions.GET_BUSINESS,
    payload: business,
  }),

  $getBusinessTypes: types => ({
    type: actions.GET_BUSINESS_TYPES,
    payload: types,
  }),

  $getBusinessCategories: categories => ({
    type: actions.GET_BUSINESS_CATEGORIES,
    payload: categories,
  }),

  $updateBusiness: updatedBusiness => ({
    type: actions.UPDATE_BUSINESS,
    payload: updatedBusiness,
  }),

  $addNewBusiness: newBusiness => ({
    type: actions.ADD_BUSINESS,
    payload: newBusiness,
  }),

  $getPriceService: async (businessId) => {
    const servicesURL = `price/by-business/${businessId}`;

    try {
      const data = await asyncRequest({ url: servicesURL, moduleUrl: "karma" }) || [];
      return {
        type: actions.GET_SERVICE_PRICE,
        payload: data,
      };
    } catch (error) {
      console.log(error)
    }
  },

  $updateServicePrice: newServicePrice => ({
    type: actions.UPDATE_SERVICE_PRICE,
    payload: newServicePrice,
  }),

  $addServicePrice: servicePrice => ({
    type: actions.ADD_SERVICE_PRICE,
    payload: servicePrice,
  }),

  $removeServicePrice: payload => ({
    type: actions.REMOVE_SERVICE_PRICE,
    payload,
  }),

};

export default actions;
