const actions = {
  GET_BUSINESS_TYPES: 'GET_BUSINESS_TYPES',
  GET_BUSINESS_CATEGORIES: 'GET_BUSINESS_CATEGORIES',

  GET_BUSINESS: 'GET_BUSINESS',
  UPDATE_BUSINESS: 'UPDATE_BUSINESS',
  ADD_BUSINESS: 'ADD_BUSINESS',

  GET_SERVICE_PRICE: 'GET_SERVICE_PRICE',
  UPDATE_SERVICE_PRICE: 'UPDATE_SERVICE_PRICE',
  ADD_SERVICE_PRICE: 'ADD_SERVICE_PRICE',
  REMOVE_SERVICE_PRICE: 'REMOVE_SERVICE_PRICE',

  GET_BUSINESS_PACKAGES: 'GET_BUSINESS_PACKAGES',
  UPDATE_BUSINESS_PACKAGE: 'UPDATE_BUSINESS_PACKAGE',
  ADD_BUSINESS_PACKAGE: 'ADD_BUSINESS_PACKAGE',
  DELETE_BUSINESS_PACKAGE: 'DELETE_BUSINESS_PACKAGE',

  UPDATE_SCHEDULE: 'UPDATE_SCHEDULE',

  GET_BUSINESS_ORDERS: 'GET_BUSINESS_ORDERS',

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

  $getPriceService: data => ({
    type: actions.GET_SERVICE_PRICE,
    payload: data,
  }),

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

  $getBusinessPackages: data => ({
    type: actions.GET_BUSINESS_PACKAGES,
    payload: data,
  }),

  $updateBusinessPackage: businessPackage => ({
    type: actions.UPDATE_BUSINESS_PACKAGE,
    payload: businessPackage,
  }),

  $createBusinessPackage: businessPackage => ({
    type: actions.ADD_BUSINESS_PACKAGE,
    payload: businessPackage,
  }),

  $deleteBusinessPackage: ({ businessId, packageId }) => ({
    type: actions.DELETE_BUSINESS_PACKAGE,
    payload: { businessId, packageId },
  }),

  $updateSchedule: scheduleList => ({
    type: actions.UPDATE_SCHEDULE,
    payload: scheduleList,
  }),

  $getBusinessOrders: (businessId, data) => ({
    type: actions.GET_BUSINESS_ORDERS,
    payload: { businessId, data },
  }),

};

export default actions;
